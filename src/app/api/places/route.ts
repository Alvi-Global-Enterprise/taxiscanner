import { NextResponse } from "next/server";
import { PhotonFeature } from "@/lib/photon";

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

    const endpoint = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      query
    )}&limit=10&lat=51.5074&lon=-0.1278`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json({ suggestions: [] });
    }

    const data = await res.json();
    const features: PhotonFeature[] = Array.isArray(data?.features)
      ? (data.features as PhotonFeature[])
      : [];

    // Prioritize UK results if available
    const sortedFeatures = [...features].sort((a, b) => {
      const aProps = a.properties || {};
      const bProps = b.properties || {};
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
      return bUk - aUk;
    });

    const suggestions: PlaceSuggestion[] = [];
    const seenAddresses = new Set<string>();

    for (const feat of sortedFeatures) {
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
      const name = (props.name || "").trim() || query;

      const subtitleParts = [
        [props.housenumber, props.street].filter(Boolean).join(" "),
        props.locality || props.district,
        props.city,
        props.postcode,
        props.country,
      ]
        .map((p) => (typeof p === "string" ? p.trim() : ""))
        .filter((p) => p && p !== name);

      const uniqueSubtitle = Array.from(new Set(subtitleParts)).join(", ");
      const fullAddress = uniqueSubtitle ? `${name}, ${uniqueSubtitle}` : name;

      // Avoid duplicates
      const dedupKey = fullAddress.toLowerCase();
      if (seenAddresses.has(dedupKey)) {
        continue;
      }
      seenAddresses.add(dedupKey);

      suggestions.push({
        name,
        subtitle: uniqueSubtitle,
        fullAddress,
        lat,
        lon,
        city: props.city || null,
        postcode: props.postcode || null,
        country: props.country || null,
      });

      if (suggestions.length >= 6) {
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
