export type UkPostcodeDistrict = {
  outcode: string;
  places: string;
};

/** Friendly place labels (overrides generic area name). */
const PLACE_OVERRIDES: Record<string, string> = {
  // Manchester (from client reference)
  M1: "Piccadilly, Northern Quarter, Oxford Road (prime core / transport hub)",
  M2: "Deansgate, King Street, Albert Square (business / civic core)",
  M3: "Castlefield, Spinningfields, St John's, Greengate, Salford fringe",
  M4: "Ancoats, New Islington",
  M5: "Salford, Ordsall",
  M14: "Fallowfield, Rusholme, Victoria Park",
  M15: "Hulme, First Street, south Castlefield",
  M20: "Didsbury, Withington",
  M21: "Chorlton",
  M32: "Stretford",
  M33: "Sale",
  M41: "Urmston",
  M50: "Salford Quays, MediaCityUK",
  M60: "Manchester city centre (large user / PO boxes)",
  M90: "Manchester Airport",
  // London samples
  SW1A: "Westminster, Buckingham Palace, Whitehall",
  SW1E: "Victoria, Buckingham Gate",
  SW1W: "Belgravia",
  W1: "West End (legacy area prefix)",
  W1A: "West End large users",
  W1B: "Oxford Circus, Regent Street",
  W1C: "Oxford Street",
  W1D: "Soho, Chinatown",
  W1F: "Soho",
  W1G: "Harley Street",
  W1H: "Marylebone",
  W1J: "Mayfair",
  W1K: "Mayfair",
  W1S: "Mayfair",
  W1T: "Fitzrovia",
  W1U: "Marylebone",
  W1W: "Fitzrovia",
  EC1A: "City of London, St Paul's",
  EC2A: "Shoreditch, Old Street",
  EC2M: "Liverpool Street",
  EC3A: "Aldgate, Leadenhall",
  EC4A: "Fleet Street",
  E1: "Whitechapel, Spitalfields, Stepney",
  E14: "Canary Wharf, Isle of Dogs",
  N1: "Islington, Hoxton",
  NW1: "Camden, Regent's Park, Marylebone fringe",
  SE1: "Southwark, London Bridge, Waterloo",
  // Other major cities
  B1: "Birmingham city centre",
  B15: "Edgbaston",
  LS1: "Leeds city centre",
  LS2: "Leeds University, Mabgate",
  L1: "Liverpool city centre",
  L2: "Liverpool business district",
  G1: "Glasgow city centre",
  G2: "Glasgow Blythswood",
  EH1: "Edinburgh Old Town",
  EH2: "Edinburgh New Town",
  CF10: "Cardiff city centre",
  CF11: "Cardiff Bay, Grangetown",
  BS1: "Bristol city centre",
  BS8: "Clifton",
  NG1: "Nottingham city centre",
  NE1: "Newcastle city centre",
  S1: "Sheffield city centre",
  SO14: "Southampton city centre",
  OX1: "Oxford city centre",
  CB1: "Cambridge",
  BT1: "Belfast city centre",
};

const AREA_CITY: Record<string, string> = {
  AB: "Aberdeen",
  AL: "St Albans",
  B: "Birmingham",
  BA: "Bath",
  BB: "Blackburn",
  BD: "Bradford",
  BH: "Bournemouth",
  BL: "Bolton",
  BN: "Brighton",
  BR: "Bromley",
  BS: "Bristol",
  BT: "Belfast",
  CA: "Carlisle",
  CB: "Cambridge",
  CF: "Cardiff",
  CH: "Chester",
  CM: "Chelmsford",
  CO: "Colchester",
  CR: "Croydon",
  CT: "Canterbury",
  CV: "Coventry",
  CW: "Crewe",
  DA: "Dartford",
  DD: "Dundee",
  DE: "Derby",
  DG: "Dumfries",
  DH: "Durham",
  DL: "Darlington",
  DN: "Doncaster",
  DT: "Dorchester",
  DY: "Dudley",
  E: "London East",
  EC: "London City / EC",
  EH: "Edinburgh",
  EN: "Enfield",
  EX: "Exeter",
  FK: "Falkirk",
  FY: "Blackpool",
  G: "Glasgow",
  GL: "Gloucester",
  GU: "Guildford",
  HA: "Harrow",
  HD: "Huddersfield",
  HG: "Harrogate",
  HP: "Hemel Hempstead",
  HR: "Hereford",
  HS: "Outer Hebrides",
  HU: "Hull",
  HX: "Halifax",
  IG: "Ilford",
  IP: "Ipswich",
  IV: "Inverness",
  KA: "Kilmarnock",
  KT: "Kingston upon Thames",
  KW: "Kirkwall",
  KY: "Kirkcaldy",
  L: "Liverpool",
  LA: "Lancaster",
  LD: "Llandrindod Wells",
  LE: "Leicester",
  LL: "Llandudno",
  LN: "Lincoln",
  LS: "Leeds",
  LU: "Luton",
  M: "Manchester",
  ME: "Medway",
  MK: "Milton Keynes",
  ML: "Motherwell",
  N: "London North",
  NE: "Newcastle",
  NG: "Nottingham",
  NN: "Northampton",
  NP: "Newport",
  NR: "Norwich",
  NW: "London NW",
  OL: "Oldham",
  OX: "Oxford",
  PA: "Paisley",
  PE: "Peterborough",
  PH: "Perth",
  PL: "Plymouth",
  PO: "Portsmouth",
  PR: "Preston",
  RG: "Reading",
  RH: "Redhill",
  RM: "Romford",
  S: "Sheffield",
  SA: "Swansea",
  SE: "London SE",
  SG: "Stevenage",
  SK: "Stockport",
  SL: "Slough",
  SM: "Sutton",
  SN: "Swindon",
  SO: "Southampton",
  SP: "Salisbury",
  SR: "Sunderland",
  SS: "Southend-on-Sea",
  ST: "Stoke-on-Trent",
  SW: "London SW",
  SY: "Shrewsbury",
  TA: "Taunton",
  TD: "Galashiels",
  TF: "Telford",
  TN: "Tonbridge",
  TQ: "Torquay",
  TR: "Truro",
  TS: "Cleveland / Teesside",
  TW: "Twickenham",
  UB: "Southall",
  W: "London West",
  WA: "Warrington",
  WC: "London WC",
  WD: "Watford",
  WF: "Wakefield",
  WN: "Wigan",
  WR: "Worcester",
  WS: "Walsall",
  WV: "Wolverhampton",
  YO: "York",
  ZE: "Lerwick",
};

/**
 * Build UK outward-code catalogue (district level).
 * Matching uses outcodes (M1, SW1A) — same as backend coverage.
 */
function buildUkDistricts(): UkPostcodeDistrict[] {
  const byOutcode = new Map<string, UkPostcodeDistrict>();

  const add = (outcode: string, places: string) => {
    const key = outcode.toUpperCase();
    if (!byOutcode.has(key)) {
      byOutcode.set(key, { outcode: key, places });
    }
  };

  for (const [outcode, places] of Object.entries(PLACE_OVERRIDES)) {
    add(outcode, places);
  }

  // Generate standard numeric districts for every UK postcode area
  for (const [area, city] of Object.entries(AREA_CITY)) {
    const max = area.length === 1 ? 99 : 99;
    for (let n = 1; n <= max; n++) {
      const outcode = `${area}${n}`;
      if (!PLACE_OVERRIDES[outcode]) {
        add(outcode, `${city} area (${outcode})`);
      }
    }
  }

  // Common lettered London / central districts
  const lettered = [
    "SW1A",
    "SW1E",
    "SW1H",
    "SW1P",
    "SW1V",
    "SW1W",
    "SW1X",
    "SW1Y",
    "EC1A",
    "EC1M",
    "EC1N",
    "EC1R",
    "EC1V",
    "EC1Y",
    "EC2A",
    "EC2M",
    "EC2N",
    "EC2R",
    "EC2V",
    "EC2Y",
    "EC3A",
    "EC3M",
    "EC3N",
    "EC3R",
    "EC3V",
    "EC4A",
    "EC4M",
    "EC4N",
    "EC4R",
    "EC4V",
    "EC4Y",
    "WC1A",
    "WC1B",
    "WC1E",
    "WC1H",
    "WC1N",
    "WC1R",
    "WC1V",
    "WC1X",
    "WC2A",
    "WC2B",
    "WC2E",
    "WC2H",
    "WC2N",
    "WC2R",
    "W1A",
    "W1B",
    "W1C",
    "W1D",
    "W1F",
    "W1G",
    "W1H",
    "W1J",
    "W1K",
    "W1S",
    "W1T",
    "W1U",
    "W1W",
  ];
  for (const outcode of lettered) {
    if (!PLACE_OVERRIDES[outcode]) {
      add(outcode, `London central (${outcode})`);
    }
  }

  return Array.from(byOutcode.values()).sort((a, b) =>
    a.outcode.localeCompare(b.outcode, "en", { numeric: true })
  );
}

export const UK_POSTCODE_DISTRICTS: UkPostcodeDistrict[] = buildUkDistricts();

export function formatDistrictOption(d: UkPostcodeDistrict): string {
  return `${d.outcode}: ${d.places}`;
}

export function searchUkPostcodeDistricts(
  query: string,
  limit = 40
): UkPostcodeDistrict[] {
  const q = query.trim().toUpperCase().replace(/\s+/g, "");
  if (!q) {
    return UK_POSTCODE_DISTRICTS.slice(0, limit);
  }

  const starts: UkPostcodeDistrict[] = [];
  const contains: UkPostcodeDistrict[] = [];

  for (const d of UK_POSTCODE_DISTRICTS) {
    const hay = `${d.outcode} ${d.places}`.toUpperCase();
    if (d.outcode.startsWith(q) || hay.startsWith(q)) {
      starts.push(d);
    } else if (hay.includes(q)) {
      contains.push(d);
    }
    if (starts.length >= limit) break;
  }

  return [...starts, ...contains].slice(0, limit);
}

export function resolveDistrictLabel(outcode: string): string {
  const key = outcode.toUpperCase().replace(/\s+/g, "");
  const found = UK_POSTCODE_DISTRICTS.find((d) => d.outcode === key);
  return found ? formatDistrictOption(found) : key;
}
