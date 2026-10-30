import zonesJson from "@/data/uk_town_zones.json";

export type UKTownZoneLayer = "all_uk" | "nation" | "region" | "city" | string;

export type UKTownZone = {
  id: string;
  name: string;
  displayName: string;
  region: string;
  country: string;
  center: [number, number];
  radiusKm: number;
  boundary: [number, number][];
  keywords: string[];
  layer?: UKTownZoneLayer;
};

/** Seamless UK coverage: All UK + nations + regions + major cities. */
export const UK_TOWN_ZONES: UKTownZone[] = zonesJson as UKTownZone[];

export const UK_TOWN_ZONE_COUNT = UK_TOWN_ZONES.length;

export const UK_ALL_ZONE_ID = "all_uk";

export const UK_NATION_ZONE_IDS = ["england", "scotland", "wales", "northern_ireland"] as const;

/** Zone IDs that together mean full UK coverage for admin one-click. */
export function getFullUkCoverageIds(): string[] {
  return UK_TOWN_ZONES.filter((z) =>
    z.layer === "all_uk" || z.layer === "nation" || z.layer === "region"
  ).map((z) => z.id);
}
