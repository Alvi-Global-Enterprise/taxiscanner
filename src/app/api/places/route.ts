import { NextResponse } from "next/server";
import {
  PhotonFeature,
  parseHouseNumberQuery,
  formatAddressParts,
} from "@/lib/photon";

export interface PlaceSuggestion {
  name: string;
  subtitle: string;
  fullAddress: string;
  lat: number;
  lon: number;
  city?: string | null;
  postcode?: string | null;
  country?: string | null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const parsed = parseHouseNumberQuery(query);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const fetchPhoton = async (searchTerm: string): Promise<PhotonFeature[]> => {
      try {
        const endpoint = `https://photon.komoot.io/api/?q=${encodeURIComponent(
          searchTerm
        )}&limit=8&lat=51.5074&lon=-0.1278`;

        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent": "TaxiScanner/1.0",
          },
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          return [];
        }

        const data = await res.json();
        return Array.isArray(data?.features) ? data.features : [];
      } catch {
        return [];
      }
    };

    // If query contains a house / flat / door number, query both the exact string
    // and the street in parallel so that if OSM lacks door-level data, the street
    // still resolves with the user's house number attached.
    const promises: [Promise<PhotonFeature[]>, Promise<PhotonFeature[]>] = [
      fetchPhoton(query),
      parsed.hasHouseNumber && parsed.streetQuery.length >= 2
        ? fetchPhoton(parsed.streetQuery)
        : Promise.resolve([]),
    ];

    const [queryFeatures, streetFeatures] = await Promise.all(promises);
    clearTimeout(timeoutId);

    // Merge and tag features
    interface TaggedFeature {
      feature: PhotonFeature;
      isFromStreetQuery: boolean;
    }

    const combined: TaggedFeature[] = [
      ...queryFeatures.map((f) => ({ feature: f, isFromStreetQuery: false })),
      ...streetFeatures.map((f) => ({ feature: f, isFromStreetQuery: true })),
    ];

    // Prioritize UK results first, and prioritize exact house matches
    combined.sort((a, b) => {
      const aProps = a.feature.properties || {};
      const bProps = b.feature.properties || {};

      const aUk =
        aProps.countrycode === "GB" ||
        aProps.country === "United Kingdom"
          ? 1
          : 0;
      const bUk =
        bProps.countrycode === "GB" ||
        bProps.country === "United Kingdom"
          ? 1
          : 0;

      if (bUk !== aUk) {
        return bUk - aUk;
      }

      // If user typed house number, prioritize features that have house number
      // or UK street matches over non-UK results
      const aHasHouse = Boolean(aProps.housenumber);
      const bHasHouse = Boolean(bProps.housenumber);
      if (aHasHouse !== bHasHouse && !a.isFromStreetQuery && !b.isFromStreetQuery) {
        return bHasHouse ? 1 : -1;
      }

      return 0;
    });

    const suggestions: PlaceSuggestion[] = [];
    const seenAddresses = new Set<string>();

    for (const item of combined) {
      const feat = item.feature;
      const coords = feat.geometry?.coordinates;
      if (
        !Array.isArray(coords) ||
        coords.length < 2 ||
        typeof coords[0] !== "number" ||
        typeof coords[1] !== "number"
      ) {
        continue;
      }

      const lon = coords[0];
      const lat = coords[1];
      const props = feat.properties || {};

      // If user provided a house number and feature doesn't already have one,
      // apply the user's house number prefix
      const effectivePrefix = parsed.hasHouseNumber ? parsed.housePrefix : undefined;
      const fallbackName = item.isFromStreetQuery ? parsed.streetQuery : query;

      const formatted = formatAddressParts(props, fallbackName, effectivePrefix);

      // Avoid duplicates
      const dedupKey = formatted.fullAddress.toLowerCase();
      if (seenAddresses.has(dedupKey)) {
        continue;
      }
      seenAddresses.add(dedupKey);

      suggestions.push({
        name: formatted.name,
        subtitle: formatted.subtitle,
        fullAddress: formatted.fullAddress,
        lat,
        lon,
        city: props.city || null,
        postcode: props.postcode || null,
        country: props.country || null,
      });

      if (suggestions.length >= 7) {
        break;
      }
    }

    return NextResponse.json(
      { suggestions },
      {
        headers: {
          "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
        },
      }
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ suggestions: [] });
    }
    return NextResponse.json({ suggestions: [] });
  }
}
