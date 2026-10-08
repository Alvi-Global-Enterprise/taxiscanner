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

/**
 * Builds a readable formatted address string from Photon feature properties.
 */
function buildFormattedAddress(props: PhotonProperties, defaultName: string): string {
  const parts: string[] = [];

  if (props.name) {
    parts.push(props.name);
  }

  const streetAddress = [props.housenumber, props.street].filter(Boolean).join(" ");
  if (streetAddress && !parts.includes(streetAddress)) {
    parts.push(streetAddress);
  }

  const locality = props.locality || props.district;
  if (locality && !parts.includes(locality)) {
    parts.push(locality);
  }

  if (props.city && !parts.includes(props.city)) {
    parts.push(props.city);
  }

  if (props.postcode && !parts.includes(props.postcode)) {
    parts.push(props.postcode);
  }

  if (props.country && !parts.includes(props.country)) {
    parts.push(props.country);
  }

  if (parts.length === 0) {
    return defaultName;
  }

  // Remove duplicates while preserving order
  const uniqueParts = Array.from(new Set(parts.map((p) => p.trim()).filter(Boolean)));
  return uniqueParts.join(", ");
}

/**
 * Geocodes a location string using the Photon Komoot API.
 *
 * Extracts:
 * - Coordinates: maps [longitude, latitude] -> { lat, lon }
 * - Location name & formatted address from feature properties
 *
 * Handles:
 * - Timeouts (via AbortController)
 * - Empty results
 * - Network or parsing failures
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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const endpoint = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`[Photon] HTTP error: ${response.status} ${response.statusText} for "${trimmed}"`);
      return null;
    }

    const data = (await response.json()) as PhotonFeatureCollection;

    if (!data || !Array.isArray(data.features) || data.features.length === 0) {
      console.warn(`[Photon] No results found for query: "${trimmed}"`);
      return null;
    }

    const feature = data.features[0];
    const coords = feature?.geometry?.coordinates;

    // Photon returns coordinates in [longitude, latitude] format
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

    const properties = feature.properties || {};
    const resolvedName = properties.name?.trim() || trimmed;
    const formattedAddress = buildFormattedAddress(properties, resolvedName);

    return {
      query: trimmed,
      name: resolvedName,
      formatted_address: formattedAddress,
      lat,
      lon,
      city: properties.city || null,
      postcode: properties.postcode || null,
      country: properties.country || null,
      rawFeature: feature,
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`[Photon] Request timed out after ${timeoutMs}ms for query: "${trimmed}"`);
    } else {
      console.warn(`[Photon] Failed to geocode query: "${trimmed}"`, error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
