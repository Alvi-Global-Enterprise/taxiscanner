import { UKTownZone, UK_TOWN_ZONES } from "./ukZonesData";

const LAYER_RANK: Record<string, number> = {
  city: 1,
  region: 2,
  nation: 3,
  all_uk: 4,
};

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
      lat < ((xj - xi) * (lng - yi)) / (yj - yi || 1e-12) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
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
  matchType: "polygon" | "radius" | "keyword" | "nearest" | "none";
  distanceKm?: number;
  matchingIds: string[];
};

function pickPrimary(zones: UKTownZone[]): UKTownZone {
  return [...zones].sort(
    (a, b) =>
      (LAYER_RANK[a.layer || "city"] ?? 9) - (LAYER_RANK[b.layer || "city"] ?? 9)
  )[0];
}

/**
 * Resolves which UK coverage zone(s) a pickup belongs to.
 * Returns all containing layers so firms with All UK / nation / region / city all match.
 */
export function resolvePickupZone(params: {
  lat?: number | null;
  lon?: number | null;
  locationName?: string | null;
  query?: string | null;
}): ZoneMatchResult {
  const { lat, lon, locationName, query } = params;
  const hits: UKTownZone[] = [];

  if (typeof lat === "number" && typeof lon === "number" && !isNaN(lat) && !isNaN(lon)) {
    for (const zone of UK_TOWN_ZONES) {
      if (isPointInPolygon([lat, lon], zone.boundary)) {
        hits.push(zone);
      }
    }

    if (hits.length === 0) {
      let closest: UKTownZone | null = null;
      let minDistance = Infinity;
      for (const zone of UK_TOWN_ZONES) {
        if (zone.layer === "all_uk") continue;
        const dist = haversineDistanceKm(lat, lon, zone.center[0], zone.center[1]);
        if (dist <= zone.radiusKm && dist < minDistance) {
          minDistance = dist;
          closest = zone;
        }
      }
      if (closest) {
        hits.push(closest);
        const allUk = UK_TOWN_ZONES.find((z) => z.layer === "all_uk");
        if (allUk) hits.push(allUk);
        return {
          zone: pickPrimary(hits),
          matchType: "radius",
          distanceKm: minDistance,
          matchingIds: Array.from(new Set(hits.map((z) => z.id))),
        };
      }

      let nearest: UKTownZone | null = null;
      let nearestDist = Infinity;
      for (const zone of UK_TOWN_ZONES) {
        if (!["city", "region", "nation"].includes(zone.layer || "city")) continue;
        const dist = haversineDistanceKm(lat, lon, zone.center[0], zone.center[1]);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = zone;
        }
      }
      if (nearest && nearestDist <= 80) {
        hits.push(nearest);
        const allUk = UK_TOWN_ZONES.find((z) => z.layer === "all_uk");
        if (allUk) hits.push(allUk);
        return {
          zone: pickPrimary(hits),
          matchType: "nearest",
          distanceKm: nearestDist,
          matchingIds: Array.from(new Set(hits.map((z) => z.id))),
        };
      }
    } else {
      if (!hits.some((z) => z.layer === "all_uk")) {
        const allUk = UK_TOWN_ZONES.find((z) => z.layer === "all_uk");
        if (allUk) hits.push(allUk);
      }
      return {
        zone: pickPrimary(hits),
        matchType: "polygon",
        matchingIds: Array.from(new Set(hits.map((z) => z.id))),
      };
    }
  }

  const text = `${locationName || ""} ${query || ""}`.toLowerCase();
  if (text.trim()) {
    for (const zone of UK_TOWN_ZONES) {
      if (zone.keywords.some((k) => text.includes(k))) {
        hits.push(zone);
      }
    }
    if (hits.length) {
      return {
        zone: pickPrimary(hits),
        matchType: "keyword",
        matchingIds: Array.from(new Set(hits.map((z) => z.id))),
      };
    }
  }

  return { zone: null, matchType: "none", matchingIds: [] };
}
