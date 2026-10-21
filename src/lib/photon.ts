/**
 * Photon Komoot Geocoding Helper
 * API Endpoint: https://photon.komoot.io/api/?q={query}
 *
 * Photon returns coordinates in GeoJSON format:
 * geometry.coordinates = [longitude, latitude]
 */

export interface PhotonGeometry {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface PhotonProperties {
  osm_type?: string;
  osm_id?: number;
  osm_key?: string;
  osm_value?: string;
  name?: string;
  housenumber?: string;
  street?: string;
  locality?: string;
  district?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  countrycode?: string;
  extent?: [number, number, number, number];
  [key: string]: unknown;
}

export interface PhotonFeature {
  type: "Feature";
  geometry: PhotonGeometry;
  properties: PhotonProperties;
}

export interface PhotonFeatureCollection {
  type: "FeatureCollection";
  features: PhotonFeature[];
}

export interface GeocodedLocation {
  query: string;
  name: string;
  formatted_address: string;
  lat: number;
  lon: number;
  city: string | null;
  postcode: string | null;
  country: string | null;
  rawFeature?: PhotonFeature;
}

export interface GeocodeOptions {
  timeoutMs?: number;
}

export interface ParsedAddressQuery {
  hasHouseNumber: boolean;
  housePrefix: string;
  streetQuery: string;
}

/**
 * Extracts leading house / flat / unit numbers from an address search string.
 * Examples:
 * - "14 Victoria Road" -> housePrefix: "14", streetQuery: "Victoria Road"
 * - "14b High Street, London" -> housePrefix: "14b", streetQuery: "High Street, London"
 * - "12-14 High Street" -> housePrefix: "12-14", streetQuery: "High Street"
 * - "Flat 3, 22 Baker Street" -> housePrefix: "Flat 3, 22", streetQuery: "Baker Street"
 * - "Flat 2A Oxford Street" -> housePrefix: "Flat 2A", streetQuery: "Oxford Street"
 * - "Apartment 5, Kings Road" -> housePrefix: "Apartment 5", streetQuery: "Kings Road"
 * - "Unit 4, Trade Park" -> housePrefix: "Unit 4", streetQuery: "Trade Park"
 * - "No. 10 Downing Street" -> housePrefix: "No. 10", streetQuery: "Downing Street"
 */
export function parseHouseNumberQuery(query: string): ParsedAddressQuery {
  const trimmed = (query || "").trim();
  if (!trimmed) {
    return { hasHouseNumber: false, housePrefix: "", streetQuery: "" };
  }

  const regex = /^((?:(?:flat|apt|apartment|unit|suite|room|no\.?)\s+[a-z0-9\-]+(?:,?\s*\d+[a-z]?(?:-\d+[a-z]?)?)?)|(?:\d+[a-z]?(?:-\d+[a-z]?)?))\s*,?\s+(.+)$/i;

  const match = trimmed.match(regex);
  if (match && match[2]?.trim()) {
    const rawPrefix = match[1].trim().replace(/,$/, "").trim();
    const rest = match[2].trim();
    return {
      hasHouseNumber: true,
      housePrefix: rawPrefix,
      streetQuery: rest,
    };
  }

  return {
    hasHouseNumber: false,
    housePrefix: "",
    streetQuery: trimmed,
  };
}

/**
 * Formats name, subtitle, and fullAddress from Photon feature properties,
 * cleanly integrating any house / unit number prefix if the feature lacks it.
 */
export function formatAddressParts(
  props: PhotonProperties,
  defaultName: string,
  housePrefix?: string
): { name: string; subtitle: string; fullAddress: string } {
  const streetName = (props.street || "").trim();
  let name = (props.name || "").trim();

  // If props.name is missing, try building from housenumber + street
  if (!name) {
    if (props.housenumber && streetName) {
      name = `${props.housenumber} ${streetName}`;
    } else if (housePrefix && streetName) {
      name = `${housePrefix} ${streetName}`;
    } else {
      name = streetName || defaultName;
    }
  } else if (
    housePrefix &&
    !props.housenumber &&
    !name.toLowerCase().startsWith(housePrefix.toLowerCase())
  ) {
    // If name is just the street name or POI without the user's house number
    name = `${housePrefix} ${name}`;
  }

  const subtitleParts = [
    streetName && !name.toLowerCase().includes(streetName.toLowerCase()) ? streetName : null,
    props.locality || props.district,
    props.city,
    props.postcode,
    props.country,
  ]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter((p) => p && !name.toLowerCase().includes(p.toLowerCase()));

  const uniqueSubtitle = Array.from(new Set(subtitleParts)).join(", ");
  const fullAddress = uniqueSubtitle ? `${name}, ${uniqueSubtitle}` : name;

  return {
    name,
    subtitle: uniqueSubtitle,
    fullAddress,
  };
}

/**
 * Builds a readable formatted address string from Photon feature properties.
 */
function buildFormattedAddress(
  props: PhotonProperties,
  defaultName: string,
  housePrefix?: string
): string {
  const formatted = formatAddressParts(props, defaultName, housePrefix);
  return formatted.fullAddress;
}

/**
 * Geocodes a location string using the Photon Komoot API with smart house-number support.
 *
 * Extracts:
 * - Coordinates: maps [longitude, latitude] -> { lat, lon }
 * - Location name & formatted address from feature properties
 * - Preserves user house numbers even when OpenStreetMap lacks door-level data
 */
export async function geocodeWithPhoton(
  query: string,
  options?: GeocodeOptions
): Promise<GeocodedLocation | null> {
  const trimmed = typeof query === "string" ? query.trim() : "";
  if (!trimmed) {
    return null;
  }

  const timeoutMs = options?.timeoutMs ?? 6000;
  const parsed = parseHouseNumberQuery(trimmed);

  const fetchFeatures = async (searchQuery: string): Promise<PhotonFeature[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const endpoint = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        searchQuery
      )}&limit=6&lat=51.5074&lon=-0.1278`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "User-Agent": "TaxiScanner/1.0",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        return [];
      }

      const data = (await response.json()) as PhotonFeatureCollection;
      return Array.isArray(data?.features) ? data.features : [];
    } catch {
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  };

  try {
    // 1. Try geocoding full query first
    const features = await fetchFeatures(trimmed);

    // Pick best UK feature if available
    let bestFeature: PhotonFeature | null = null;
    if (features.length > 0) {
      const ukFeature = features.find(
        (f) =>
          f.properties?.countrycode === "GB" ||
          f.properties?.country === "United Kingdom"
      );
      bestFeature = ukFeature || features[0];
    }

    // 2. If no UK feature found and user provided a house number, fallback to searching the street
    const isUK =
      bestFeature?.properties?.countrycode === "GB" ||
      bestFeature?.properties?.country === "United Kingdom";

    if ((!bestFeature || !isUK) && parsed.hasHouseNumber && parsed.streetQuery.length >= 2) {
      const streetFeatures = await fetchFeatures(parsed.streetQuery);
      if (streetFeatures.length > 0) {
        const ukStreetFeature = streetFeatures.find(
          (f) =>
            f.properties?.countrycode === "GB" ||
            f.properties?.country === "United Kingdom"
        );
        if (ukStreetFeature || !bestFeature) {
          bestFeature = ukStreetFeature || streetFeatures[0];
        }
      }
    }

    if (!bestFeature) {
      console.warn(`[Photon] No results found for query: "${trimmed}"`);
      return null;
    }

    const coords = bestFeature?.geometry?.coordinates;
    if (
      !coords ||
      !Array.isArray(coords) ||
      coords.length < 2 ||
      typeof coords[0] !== "number" ||
      typeof coords[1] !== "number" ||
      Number.isNaN(coords[0]) ||
      Number.isNaN(coords[1])
    ) {
      console.warn(`[Photon] Invalid coordinates returned for query: "${trimmed}"`, coords);
      return null;
    }

    const lon = coords[0];
    const lat = coords[1];
    const properties = bestFeature.properties || {};

    const effectivePrefix = parsed.hasHouseNumber ? parsed.housePrefix : undefined;
    const formatted = formatAddressParts(properties, trimmed, effectivePrefix);

    return {
      query: trimmed,
      name: formatted.name,
      formatted_address: formatted.fullAddress,
      lat,
      lon,
      city: properties.city || null,
      postcode: properties.postcode || null,
      country: properties.country || null,
      rawFeature: bestFeature,
    };
  } catch (error: unknown) {
    console.warn(`[Photon] Failed to geocode query: "${trimmed}"`, error);
    return null;
  }
}
