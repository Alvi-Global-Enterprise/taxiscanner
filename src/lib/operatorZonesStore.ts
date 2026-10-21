export type TaxiCompany = {
  id: string;
  name: string;
  brandColor: string;
  logoUrl?: string;
  baseFare: number;
  perMileRate: number;
  minEtaMinutes: number;
  rating: number;
  phone: string;
  bookingUrl: string;
  vehicleType: string;
  /**
   * List of UK town zone IDs where this company is ticked/licensed to operate
   */
  assignedTownIds: string[];
  isActive: boolean;
};

export const DEFAULT_TAXI_COMPANIES: TaxiCompany[] = [
  {
    id: "streetcars",
    name: "Streetcars Manchester",
    brandColor: "#197DF1",
    logoUrl: "/images/companies/streetcars.png",
    baseFare: 3.5,
    perMileRate: 2.1,
    minEtaMinutes: 4,
    rating: 4.8,
    phone: "+44 161 228 7878",
    bookingUrl: "https://streetcarsmanchester.co.uk",
    vehicleType: "Standard Saloon",
    assignedTownIds: ["manchester"],
    isActive: true,
  },
  {
    id: "uber",
    name: "Uber UK",
    brandColor: "#000000",
    logoUrl: "/images/companies/uber.png",
    baseFare: 3.2,
    perMileRate: 1.95,
    minEtaMinutes: 5,
    rating: 4.7,
    phone: "+44 808 169 7335",
    bookingUrl: "https://m.uber.com",
    vehicleType: "UberX",
    assignedTownIds: [
      "london",
      "manchester",
      "birmingham",
      "leeds",
      "liverpool",
      "bristol",
      "sheffield",
      "newcastle",
      "nottingham",
      "edinburgh",
      "glasgow",
      "cardiff",
    ],
    isActive: true,
  },
  {
    id: "bolt",
    name: "Bolt UK",
    brandColor: "#34D186",
    logoUrl: "/images/companies/bolt.png",
    baseFare: 3.0,
    perMileRate: 1.85,
    minEtaMinutes: 6,
    rating: 4.6,
    phone: "+44 800 048 7672",
    bookingUrl: "https://bolt.eu",
    vehicleType: "Bolt Ride",
    assignedTownIds: [
      "london",
      "birmingham",
      "bristol",
      "manchester",
      "sheffield",
      "nottingham",
      "newcastle",
      "cardiff",
    ],
    isActive: true,
  },
  {
    id: "veezu",
    name: "Veezu",
    brandColor: "#0ABCA5",
    logoUrl: "/images/companies/veezu.png",
    baseFare: 3.4,
    perMileRate: 2.15,
    minEtaMinutes: 5,
    rating: 4.7,
    phone: "+44 29 2033 3333",
    bookingUrl: "https://veezu.co.uk",
    vehicleType: "Local Saloon",
    assignedTownIds: ["cardiff", "bristol", "birmingham", "sheffield", "leeds"],
    isActive: true,
  },
  {
    id: "amber_cars",
    name: "Amber Cars Leeds",
    brandColor: "#F59E0B",
    baseFare: 3.2,
    perMileRate: 2.05,
    minEtaMinutes: 5,
    rating: 4.7,
    phone: "+44 113 202 2112",
    bookingUrl: "https://amber-cars.co.uk",
    vehicleType: "Standard Saloon",
    assignedTownIds: ["leeds"],
    isActive: true,
  },
  {
    id: "delta_taxis",
    name: "Delta Taxis Liverpool",
    brandColor: "#DC2626",
    baseFare: 2.9,
    perMileRate: 1.9,
    minEtaMinutes: 4,
    rating: 4.8,
    phone: "+44 151 924 7373",
    bookingUrl: "https://deltataxis.net",
    vehicleType: "Standard Saloon",
    assignedTownIds: ["liverpool"],
    isActive: true,
  },
  {
    id: "blueline_taxis",
    name: "Blueline Taxis Newcastle",
    brandColor: "#2563EB",
    baseFare: 3.1,
    perMileRate: 2.0,
    minEtaMinutes: 6,
    rating: 4.6,
    phone: "+44 191 262 6666",
    bookingUrl: "https://bluelinetaxis.com",
    vehicleType: "Executive Saloon",
    assignedTownIds: ["newcastle"],
    isActive: true,
  },
  {
    id: "glasgow_taxis",
    name: "Glasgow Taxis",
    brandColor: "#0F172A",
    baseFare: 3.6,
    perMileRate: 2.2,
    minEtaMinutes: 5,
    rating: 4.8,
    phone: "+44 141 429 7070",
    bookingUrl: "https://glasgowtaxis.co.uk",
    vehicleType: "Official Black Cab",
    assignedTownIds: ["glasgow"],
    isActive: true,
  },
  {
    id: "capital_cars",
    name: "Capital Cars Edinburgh",
    brandColor: "#7C3AED",
    baseFare: 3.5,
    perMileRate: 2.15,
    minEtaMinutes: 5,
    rating: 4.7,
    phone: "+44 131 777 7777",
    bookingUrl: "https://capitalcarsscotland.co.uk",
    vehicleType: "Standard Saloon",
    assignedTownIds: ["edinburgh"],
    isActive: true,
  },
  {
    id: "addison_lee",
    name: "Addison Lee London",
    brandColor: "#E11D48",
    baseFare: 5.5,
    perMileRate: 2.8,
    minEtaMinutes: 7,
    rating: 4.9,
    phone: "+44 20 7387 8888",
    bookingUrl: "https://addisonlee.com",
    vehicleType: "Premium Executive",
    assignedTownIds: ["london"],
    isActive: true,
  },
  {
    id: "value_cabs",
    name: "Value Cabs Belfast",
    brandColor: "#059669",
    baseFare: 3.3,
    perMileRate: 2.1,
    minEtaMinutes: 6,
    rating: 4.7,
    phone: "+44 28 9080 9080",
    bookingUrl: "https://valuecabs.co.uk",
    vehicleType: "Standard Saloon",
    assignedTownIds: ["belfast"],
    isActive: true,
  },
  {
    id: "radio_taxis_southampton",
    name: "Radio Taxis Southampton",
    brandColor: "#EA580C",
    baseFare: 3.4,
    perMileRate: 2.15,
    minEtaMinutes: 6,
    rating: 4.6,
    phone: "+44 23 8066 6666",
    bookingUrl: "https://radtax.co.uk",
    vehicleType: "Standard Saloon",
    assignedTownIds: ["southampton"],
    isActive: true,
  },
  {
    id: "oxford_royal_cars",
    name: "001 Royal Cars Oxford",
    brandColor: "#4338CA",
    baseFare: 3.6,
    perMileRate: 2.25,
    minEtaMinutes: 5,
    rating: 4.7,
    phone: "+44 1865 240000",
    bookingUrl: "https://royal-cars.com",
    vehicleType: "Standard Saloon",
    assignedTownIds: ["oxford"],
    isActive: true,
  },
  {
    id: "cambridge_panther",
    name: "Panther Taxis Cambridge",
    brandColor: "#0891B2",
    baseFare: 3.5,
    perMileRate: 2.2,
    minEtaMinutes: 5,
    rating: 4.8,
    phone: "+44 1223 715715",
    bookingUrl: "https://panthertaxis.co.uk",
    vehicleType: "Standard Saloon",
    assignedTownIds: ["cambridge"],
    isActive: true,
  },
];

const STORAGE_KEY = "taxi_scanner_operator_zones_v1";

export function loadTaxiCompanies(): TaxiCompany[] {
  if (typeof window === "undefined") {
    return DEFAULT_TAXI_COMPANIES;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TAXI_COMPANIES));
      return DEFAULT_TAXI_COMPANIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_TAXI_COMPANIES;
  } catch (e) {
    console.error("Failed to load taxi companies from localStorage", e);
    return DEFAULT_TAXI_COMPANIES;
  }
}

export function saveTaxiCompanies(companies: TaxiCompany[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    window.dispatchEvent(new CustomEvent("taxi-companies-updated"));
  } catch (e) {
    console.error("Failed to save taxi companies to localStorage", e);
  }
}

export function resetTaxiCompaniesToDefault(): TaxiCompany[] {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_TAXI_COMPANIES;
}

/**
 * Filter: Return only taxi companies that have ticked the given townId
 */
export function getCompaniesForTown(
  companies: TaxiCompany[],
  townId: string | null | undefined
): TaxiCompany[] {
  if (!townId) return [];
  const normalizedId = townId.toLowerCase().trim();
  return companies.filter(
    (c) => c.isActive && c.assignedTownIds.some((id) => id.toLowerCase() === normalizedId)
  );
}
