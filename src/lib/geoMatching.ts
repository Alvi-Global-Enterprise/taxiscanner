import { UKTownZone, UK_TOWN_ZONES } from "./ukZonesData";

/**
 * Standard ray-casting algorithm for Point in Polygon
 * Checks if point [lat, lng] is inside polygon [[lat, lng], ...]
 */
export function isPointInPolygon(
  point: [number, number],
  polygon: [number, number][]
): boolean {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > lng !== yj > lng &&
      lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Haversine distance in Kilometers between two lat/lng points
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export type ZoneMatchResult = {
  zone: UKTownZone | null;
  matchType: "polygon" | "radius" | "keyword" | "none";
  distanceKm?: number;
};

/**
 * Resolves which UK Town / City Zone a customer's pickup belongs to.
 * 1. Checks exact boundary polygon inclusion
 * 2. Checks radius proximity around zone center
 * 3. Checks keyword/city name matches
 */
export function resolvePickupZone(params: {
  lat?: number | null;
  lon?: number | null;
  locationName?: string | null;
  query?: string | null;
}): ZoneMatchResult {
  const { lat, lon, locationName, query } = params;

  // 1. Point-in-polygon check if coordinates available
  if (typeof lat === "number" && typeof lon === "number" && !isNaN(lat) && !isNaN(lon)) {
    for (const zone of UK_TOWN_ZONES) {
      if (isPointInPolygon([lat, lon], zone.boundary)) {
        return {
          zone,
          matchType: "polygon",
          distanceKm: haversineDistanceKm(lat, lon, zone.center[0], zone.center[1]),
        };
      }
    }

    // 2. Proximity / Radius check (closest zone within radiusKm)
    let closestZone: UKTownZone | null = null;
    let minDistance = Infinity;

    for (const zone of UK_TOWN_ZONES) {
      const dist = haversineDistanceKm(lat, lon, zone.center[0], zone.center[1]);
      if (dist <= zone.radiusKm && dist < minDistance) {
        minDistance = dist;
        closestZone = zone;
      }
    }

    if (closestZone) {
      return {
        zone: closestZone,
        matchType: "radius",
        distanceKm: minDistance,
      };
    }
  }

  // 3. Fallback: Keyword search in text
  const text = `${locationName || ""} ${query || ""}`.toLowerCase();
  if (text.trim().length > 0) {
    for (const zone of UK_TOWN_ZONES) {
      if (zone.keywords.some((k) => text.includes(k))) {
        return {
          zone,
          matchType: "keyword",
        };
      }
    }
  }

  return {
    zone: null,
    matchType: "none",
  };
}
