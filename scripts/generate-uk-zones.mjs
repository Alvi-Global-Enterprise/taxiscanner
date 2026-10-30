/**
 * Seamless UK coverage zones — no gaps.
 * Layers:
 *  1) all_uk          — whole United Kingdom (one-click full cover)
 *  2) 4 nations       — England / Scotland / Wales / Northern Ireland
 *  3) English regions — tile England completely
 *  4) Major cities    — finer admin control (optional)
 *
 * Usage: node scripts/generate-uk-zones.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function circleBoundary(lat, lon, radiusKm, points = 14) {
  const boundary = [];
  const latRad = (lat * Math.PI) / 180;
  const degLat = radiusKm / 111.32;
  const degLon = radiusKm / (111.32 * Math.cos(latRad));
  for (let i = 0; i < points; i++) {
    const angle = (2 * Math.PI * i) / points;
    boundary.push([
      +(lat + degLat * Math.cos(angle)).toFixed(5),
      +(lon + degLon * Math.sin(angle)).toFixed(5),
    ]);
  }
  boundary.push(boundary[0]);
  return boundary;
}

function zone({
  id,
  name,
  displayName,
  region,
  country,
  center,
  radiusKm,
  boundary,
  keywords = [],
  layer = "city",
}) {
  return {
    id,
    name,
    displayName: displayName || name,
    region,
    country,
    center,
    radiusKm: radiusKm ?? 0,
    keywords: Array.from(
      new Set([name.toLowerCase(), ...keywords.map((k) => k.toLowerCase())])
    ),
    boundary,
    layer, // all_uk | nation | region | city
  };
}

/**
 * Generous outlines so land + coastal towns are inside.
 * Coordinates are [lat, lng], closed rings.
 */
const ALL_UK_BOUNDARY = [
  [58.7, -7.5],
  [58.7, -1.5],
  [55.9, -1.4],
  [55.85, -1.6],
  [54.1, -0.7],
  [53.0, 0.3],
  [52.0, 1.8],
  [51.2, 1.5],
  [50.7, 1.0],
  [50.0, -1.5],
  [49.85, -5.2],
  [50.0, -5.8],
  [51.0, -5.7],
  [51.7, -5.5],
  [52.4, -5.4],
  [53.4, -4.9],
  [54.6, -5.8],
  [55.3, -7.8],
  [55.4, -6.2],
  [56.8, -6.5],
  [58.0, -5.5],
  [58.7, -7.5],
];

const ENGLAND_BOUNDARY = [
  [55.85, -2.0],
  [55.85, -1.5],
  [54.1, -0.7],
  [53.0, 0.3],
  [52.0, 1.8],
  [51.2, 1.5],
  [50.7, 1.0],
  [50.0, -1.5],
  [49.9, -5.2],
  [50.2, -5.7],
  [51.2, -5.0],
  [51.7, -4.0],
  [52.0, -3.2],
  [53.0, -3.2],
  [54.2, -3.6],
  [55.0, -2.8],
  [55.85, -2.0],
];

const SCOTLAND_BOUNDARY = [
  [58.7, -7.5],
  [58.7, -1.5],
  [56.0, -1.8],
  [55.0, -2.0],
  [54.9, -3.5],
  [55.0, -5.0],
  [55.4, -6.2],
  [56.0, -6.5],
  [56.8, -6.5],
  [58.0, -5.5],
  [58.7, -7.5],
];

const WALES_BOUNDARY = [
  [53.5, -3.0],
  [53.4, -4.9],
  [52.4, -5.4],
  [51.7, -5.5],
  [51.3, -4.5],
  [51.3, -3.0],
  [51.6, -2.7],
  [52.4, -2.7],
  [53.0, -2.7],
  [53.5, -3.0],
];

const NI_BOUNDARY = [
  [55.4, -7.8],
  [55.3, -5.4],
  [54.0, -5.4],
  [54.0, -8.2],
  [55.0, -8.2],
  [55.4, -7.8],
];

/** Overlapping regional tiles — intentional overlap = no gaps */
const REGIONS = [
  {
    id: "region_london",
    name: "Greater London",
    region: "Greater London",
    country: "England",
    center: [51.5074, -0.1278],
    keywords: ["london", "greater london"],
    boundary: [
      [51.72, -0.55],
      [51.72, 0.35],
      [51.28, 0.35],
      [51.28, -0.55],
      [51.72, -0.55],
    ],
  },
  {
    id: "region_south_east",
    name: "South East England",
    region: "South East",
    country: "England",
    center: [51.2, -0.5],
    keywords: ["south east", "kent", "surrey", "sussex", "hampshire", "berkshire", "buckinghamshire", "oxfordshire"],
    boundary: [
      [52.2, -1.6],
      [52.2, 1.5],
      [50.5, 1.5],
      [50.5, -1.9],
      [51.1, -1.9],
      [52.2, -1.6],
    ],
  },
  {
    id: "region_south_west",
    name: "South West England",
    region: "South West",
    country: "England",
    center: [50.9, -3.5],
    keywords: ["south west", "cornwall", "devon", "somerset", "dorset", "bristol", "wiltshire", "gloucestershire"],
    boundary: [
      [52.2, -5.8],
      [52.2, -1.5],
      [50.5, -1.5],
      [49.85, -5.8],
      [52.2, -5.8],
    ],
  },
  {
    id: "region_east_england",
    name: "East of England",
    region: "East of England",
    country: "England",
    center: [52.4, 0.5],
    keywords: ["east of england", "norfolk", "suffolk", "essex", "cambridgeshire", "hertfordshire", "bedfordshire"],
    boundary: [
      [53.0, -0.7],
      [53.0, 1.9],
      [51.4, 1.9],
      [51.4, -0.7],
      [53.0, -0.7],
    ],
  },
  {
    id: "region_east_midlands",
    name: "East Midlands",
    region: "East Midlands",
    country: "England",
    center: [52.9, -0.9],
    keywords: ["east midlands", "nottinghamshire", "derbyshire", "leicestershire", "lincolnshire", "northamptonshire"],
    boundary: [
      [53.6, -2.0],
      [53.6, 0.4],
      [52.0, 0.4],
      [52.0, -2.0],
      [53.6, -2.0],
    ],
  },
  {
    id: "region_west_midlands",
    name: "West Midlands",
    region: "West Midlands",
    country: "England",
    center: [52.5, -2.0],
    keywords: ["west midlands", "birmingham", "staffordshire", "warwickshire", "worcestershire", "shropshire", "herefordshire"],
    boundary: [
      [53.3, -3.2],
      [53.3, -1.2],
      [51.8, -1.2],
      [51.8, -3.2],
      [53.3, -3.2],
    ],
  },
  {
    id: "region_yorkshire",
    name: "Yorkshire & Humber",
    region: "Yorkshire",
    country: "England",
    center: [53.8, -1.3],
    keywords: ["yorkshire", "humber", "leeds", "sheffield", "hull", "york"],
    boundary: [
      [54.6, -2.5],
      [54.6, 0.3],
      [53.2, 0.3],
      [53.2, -2.5],
      [54.6, -2.5],
    ],
  },
  {
    id: "region_north_west",
    name: "North West England",
    region: "North West",
    country: "England",
    center: [53.8, -2.6],
    keywords: ["north west", "manchester", "liverpool", "lancashire", "cumbria", "cheshire"],
    boundary: [
      [55.1, -3.7],
      [55.1, -1.9],
      [52.9, -1.9],
      [52.9, -3.7],
      [55.1, -3.7],
    ],
  },
  {
    id: "region_north_east",
    name: "North East England",
    region: "North East",
    country: "England",
    center: [54.9, -1.6],
    keywords: ["north east", "newcastle", "sunderland", "durham", "teesside"],
    boundary: [
      [55.9, -2.5],
      [55.9, -0.8],
      [54.4, -0.8],
      [54.4, -2.5],
      [55.9, -2.5],
    ],
  },
];

const CITIES = [
  ["london", "London", "Greater London", "England", 51.5074, -0.1278, 28, ["heathrow", "croydon", "stratford"]],
  ["manchester", "Manchester", "North West", "England", 53.4808, -2.2426, 18, ["salford", "stockport", "bolton"]],
  ["birmingham", "Birmingham", "West Midlands", "England", 52.4862, -1.8904, 18, ["solihull"]],
  ["leeds", "Leeds", "Yorkshire", "England", 53.8008, -1.5491, 16, []],
  ["glasgow", "Glasgow", "Scotland", "Scotland", 55.8642, -4.2518, 16, ["paisley"]],
  ["liverpool", "Liverpool", "North West", "England", 53.4084, -2.9916, 15, ["wirral"]],
  ["newcastle", "Newcastle", "North East", "England", 54.9783, -1.6178, 15, ["gateshead"]],
  ["sheffield", "Sheffield", "Yorkshire", "England", 53.3811, -1.4701, 15, []],
  ["bristol", "Bristol", "South West", "England", 51.4545, -2.5879, 16, []],
  ["edinburgh", "Edinburgh", "Scotland", "Scotland", 55.9533, -3.1883, 14, ["leith"]],
  ["cardiff", "Cardiff", "Wales", "Wales", 51.4816, -3.1791, 14, []],
  ["belfast", "Belfast", "Northern Ireland", "Northern Ireland", 54.5973, -5.9301, 14, []],
  ["nottingham", "Nottingham", "East Midlands", "England", 52.9548, -1.1581, 14, []],
  ["leicester", "Leicester", "East Midlands", "England", 52.6369, -1.1398, 13, []],
  ["coventry", "Coventry", "West Midlands", "England", 52.4068, -1.5197, 12, []],
  ["bradford", "Bradford", "Yorkshire", "England", 53.796, -1.7594, 12, []],
  ["stoke", "Stoke-on-Trent", "West Midlands", "England", 53.0027, -2.1794, 13, []],
  ["wolverhampton", "Wolverhampton", "West Midlands", "England", 52.5862, -2.1288, 11, []],
  ["plymouth", "Plymouth", "South West", "England", 50.3755, -4.1427, 14, []],
  ["southampton", "Southampton", "South East", "England", 50.9097, -1.4044, 14, []],
  ["portsmouth", "Portsmouth", "South East", "England", 50.8198, -1.088, 12, []],
  ["reading", "Reading", "South East", "England", 51.4543, -0.9781, 12, []],
  ["derby", "Derby", "East Midlands", "England", 52.9225, -1.4746, 12, []],
  ["northampton", "Northampton", "East Midlands", "England", 52.2405, -0.9027, 12, []],
  ["milton_keynes", "Milton Keynes", "South East", "England", 52.0406, -0.7594, 14, []],
  ["luton", "Luton", "East of England", "England", 51.8787, -0.42, 11, []],
  ["aberdeen", "Aberdeen", "Scotland", "Scotland", 57.1497, -2.0943, 14, []],
  ["dundee", "Dundee", "Scotland", "Scotland", 56.462, -2.9707, 12, []],
  ["inverness", "Inverness", "Scotland", "Scotland", 57.4778, -4.2247, 22, ["highlands"]],
  ["fort_william", "Fort William", "Scotland", "Scotland", 56.8198, -5.1052, 22, []],
  ["swansea", "Swansea", "Wales", "Wales", 51.6214, -3.9436, 13, []],
  ["newport_wales", "Newport (Wales)", "Wales", "Wales", 51.5842, -2.9977, 12, ["newport"]],
  ["wrexham", "Wrexham", "Wales", "Wales", 53.043, -2.992, 12, []],
  ["derry", "Derry / Londonderry", "Northern Ireland", "Northern Ireland", 54.9966, -7.3086, 14, ["londonderry"]],
  ["york", "York", "Yorkshire", "England", 53.9591, -1.0815, 12, []],
  ["oxford", "Oxford", "South East", "England", 51.752, -1.2577, 12, []],
  ["cambridge", "Cambridge", "East of England", "England", 52.2053, 0.1218, 12, []],
  ["brighton", "Brighton & Hove", "South East", "England", 50.8225, -0.1372, 12, ["brighton"]],
  ["bournemouth", "Bournemouth", "South West", "England", 50.7192, -1.8808, 14, ["poole"]],
  ["norwich", "Norwich", "East of England", "England", 52.6309, 1.2974, 12, []],
  ["exeter", "Exeter", "South West", "England", 50.7184, -3.5339, 12, []],
  ["truro", "Cornwall (Truro)", "South West", "England", 50.263, -5.051, 28, ["cornwall", "newquay", "penzance"]],
  ["carlisle", "Carlisle / Cumbria", "North West", "England", 54.892, -2.932, 22, ["cumbria", "kendal"]],
  ["hull", "Hull", "Yorkshire", "England", 53.7676, -0.3274, 13, []],
  ["middlesbrough", "Teesside", "North East", "England", 54.5742, -1.235, 14, ["middlesbrough", "teesside"]],
  ["preston", "Preston", "North West", "England", 53.7632, -2.7031, 12, []],
  ["blackpool", "Blackpool", "North West", "England", 53.8175, -3.0357, 12, []],
  ["sunderland", "Sunderland", "North East", "England", 54.9069, -1.3838, 12, []],
  ["peterborough", "Peterborough", "East of England", "England", 52.5695, -0.2405, 12, []],
  ["ipswich", "Ipswich", "East of England", "England", 52.0567, 1.1482, 11, []],
  ["southend", "Southend-on-Sea", "East of England", "England", 51.5459, 0.7077, 11, []],
  ["maidstone", "Maidstone / Kent", "South East", "England", 51.2704, 0.5227, 16, ["kent", "medway", "canterbury"]],
  ["guildford", "Guildford / Surrey", "South East", "England", 51.2362, -0.5704, 14, ["surrey"]],
  ["bath", "Bath", "South West", "England", 51.3811, -2.359, 10, []],
  ["gloucester", "Gloucester", "South West", "England", 51.8642, -2.2382, 11, []],
  ["worcester", "Worcester", "West Midlands", "England", 52.1936, -2.2216, 11, []],
  ["lincoln", "Lincoln", "East Midlands", "England", 53.2307, -0.5406, 12, []],
  ["doncaster", "Doncaster", "Yorkshire", "England", 53.5228, -1.1285, 12, []],
  ["huddersfield", "Huddersfield", "Yorkshire", "England", 53.6458, -1.785, 11, []],
  ["warrington", "Warrington", "North West", "England", 53.39, -2.597, 11, []],
  ["chester", "Chester", "North West", "England", 53.191, -2.891, 11, []],
  ["stirling", "Stirling / Central Scotland", "Scotland", "Scotland", 56.1165, -3.9369, 18, ["falkirk", "perth"]],
  ["dumfries", "Dumfries & Galloway", "Scotland", "Scotland", 55.07, -3.605, 22, []],
  ["oban", "Argyll / Oban", "Scotland", "Scotland", 56.415, -5.471, 28, ["argyll"]],
  ["orkney_shetland", "Orkney / Shetland", "Scotland", "Scotland", 59.0, -3.0, 90, ["orkney", "shetland", "lerwick", "kirkwall"]],
  ["bangor_wales", "North Wales", "Wales", "Wales", 53.228, -4.128, 28, ["bangor", "llandudno", "holyhead"]],
  ["aberystwyth", "Mid Wales", "Wales", "Wales", 52.414, -4.082, 28, ["aberystwyth"]],
  ["carmarthen", "West Wales", "Wales", "Wales", 51.856, -4.312, 28, ["carmarthen", "pembroke", "llanelli"]],
  ["newry", "Newry", "Northern Ireland", "Northern Ireland", 54.175, -6.34, 14, []],
  ["coleraine", "Coleraine / Causeway", "Northern Ireland", "Northern Ireland", 55.133, -6.668, 18, ["ballymena", "portrush"]],
  ["omagh", "West NI (Omagh)", "Northern Ireland", "Northern Ireland", 54.598, -7.31, 20, ["enniskillen"]],
  ["isle_of_wight", "Isle of Wight", "South East", "England", 50.6938, -1.3047, 18, ["isle of wight", "newport isle of wight"]],
];

const zones = [];

zones.push(
  zone({
    id: "all_uk",
    name: "Entire United Kingdom",
    displayName: "Entire United Kingdom (everywhere)",
    region: "United Kingdom",
    country: "United Kingdom",
    center: [54.5, -2.5],
    radiusKm: 700,
    boundary: ALL_UK_BOUNDARY,
    keywords: ["united kingdom", "uk", "great britain", "britain"],
    layer: "all_uk",
  })
);

zones.push(
  zone({
    id: "england",
    name: "England",
    displayName: "All of England",
    region: "England",
    country: "England",
    center: [52.5, -1.5],
    radiusKm: 400,
    boundary: ENGLAND_BOUNDARY,
    keywords: ["england"],
    layer: "nation",
  })
);

zones.push(
  zone({
    id: "scotland",
    name: "Scotland",
    displayName: "All of Scotland",
    region: "Scotland",
    country: "Scotland",
    center: [56.5, -4.0],
    radiusKm: 350,
    boundary: SCOTLAND_BOUNDARY,
    keywords: ["scotland"],
    layer: "nation",
  })
);

zones.push(
  zone({
    id: "wales",
    name: "Wales",
    displayName: "All of Wales",
    region: "Wales",
    country: "Wales",
    center: [52.3, -3.7],
    radiusKm: 180,
    boundary: WALES_BOUNDARY,
    keywords: ["wales", "cymru"],
    layer: "nation",
  })
);

zones.push(
  zone({
    id: "northern_ireland",
    name: "Northern Ireland",
    displayName: "All of Northern Ireland",
    region: "Northern Ireland",
    country: "Northern Ireland",
    center: [54.6, -6.5],
    radiusKm: 120,
    boundary: NI_BOUNDARY,
    keywords: ["northern ireland", "ulster"],
    layer: "nation",
  })
);

for (const r of REGIONS) {
  zones.push(
    zone({
      id: r.id,
      name: r.name,
      region: r.region,
      country: r.country,
      center: r.center,
      radiusKm: 80,
      boundary: r.boundary,
      keywords: r.keywords,
      layer: "region",
    })
  );
}

for (const [id, name, region, country, lat, lon, radiusKm, keywords] of CITIES) {
  zones.push(
    zone({
      id,
      name,
      region,
      country,
      center: [lat, lon],
      radiusKm,
      boundary: circleBoundary(lat, lon, radiusKm),
      keywords,
      layer: "city",
    })
  );
}

const frontendJson = path.join(__dirname, "../src/data/uk_town_zones.json");
const frontendTs = path.join(__dirname, "../src/lib/ukZonesData.ts");
const backendJson = path.resolve(
  __dirname,
  "../../../TaxiScannerBackend-Github/taxiscannerbackend/config/data/uk_town_zones.json"
);

fs.mkdirSync(path.dirname(frontendJson), { recursive: true });
fs.mkdirSync(path.dirname(backendJson), { recursive: true });
const json = JSON.stringify(zones, null, 2);
fs.writeFileSync(frontendJson, json + "\n");
fs.writeFileSync(backendJson, json + "\n");

fs.writeFileSync(
  frontendTs,
  `import zonesJson from "@/data/uk_town_zones.json";

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
`
);

console.log(`Generated ${zones.length} zones`);
console.log(
  "layers",
  Object.fromEntries(
    ["all_uk", "nation", "region", "city"].map((l) => [
      l,
      zones.filter((z) => z.layer === l).length,
    ])
  )
);
