import axios from "axios";

/**
 * Browser calls same-origin Next.js proxies under /api/admin/*.
 * The proxy attaches ADMIN_API_TOKEN server-side to the Laravel backend.
 */
const adminClient = axios.create({
  baseURL: "/api/admin",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export type CoverageMode = "nationwide" | "postcodes" | "towns" | "both";

export type AdminProvider = {
  id: number;
  slug: string;
  name: string;
  display_name: string;
  is_active: boolean;
  coverage_mode: CoverageMode;
  logo_url: string | null;
  booking_url_template: string | null;
  sort_order: number;
  postcodes: string[];
  towns: string[];
  pricing: {
    base_fare: number;
    per_mile_rate: number;
    per_minute_rate: number;
    minimum_fare: number;
    booking_fee: number;
    airport_fee: number;
  } | null;
};

export type AdminTownCatalogueItem = {
  id: string;
  name: string;
  displayName: string;
  region: string;
  country: string;
};

export type AdminStatsProviderRow = {
  provider_slug: string;
  display_name: string;
  is_active: boolean | null;
  compare_impressions: number;
  booking_clicks: number;
};

export type AdminStatsResponse = {
  from: string;
  to: string;
  providers: AdminStatsProviderRow[];
  totals: {
    compare_impressions: number;
    booking_clicks: number;
  };
};

function axiosMessage(e: unknown, fallback: string): string {
  if (axios.isAxiosError(e)) {
    const msg = e.response?.data?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
    return e.message || fallback;
  }
  if (e instanceof Error) return e.message;
  return fallback;
}

export async function fetchAdminProviders(): Promise<AdminProvider[]> {
  try {
    const { data } = await adminClient.get<{ success: boolean; data: AdminProvider[] }>(
      "/providers"
    );
    return data.data;
  } catch (e) {
    throw new Error(axiosMessage(e, "Failed to load providers"));
  }
}

export async function updateProviderCoverage(
  slug: string,
  payload: {
    coverage_mode: CoverageMode;
    postcodes?: string[];
    towns?: string[];
    is_active?: boolean;
  }
): Promise<AdminProvider> {
  try {
    const { data } = await adminClient.put<{ success: boolean; data: AdminProvider }>(
      `/providers/${slug}/coverage`,
      payload
    );
    return data.data;
  } catch (e) {
    throw new Error(axiosMessage(e, "Failed to update coverage"));
  }
}

export async function syncProviderPostcodes(
  slug: string,
  postcodes: string[]
): Promise<AdminProvider> {
  try {
    const { data } = await adminClient.put<{ success: boolean; data: AdminProvider }>(
      `/providers/${slug}/postcodes`,
      { postcodes }
    );
    return data.data;
  } catch (e) {
    throw new Error(axiosMessage(e, "Failed to sync postcodes"));
  }
}

export async function syncProviderTowns(
  slug: string,
  towns: string[]
): Promise<AdminProvider> {
  try {
    const { data } = await adminClient.put<{ success: boolean; data: AdminProvider }>(
      `/providers/${slug}/towns`,
      { towns }
    );
    return data.data;
  } catch (e) {
    throw new Error(axiosMessage(e, "Failed to sync towns"));
  }
}

export async function fetchAdminTownCatalogue(): Promise<AdminTownCatalogueItem[]> {
  try {
    const { data } = await adminClient.get<{
      success: boolean;
      data: AdminTownCatalogueItem[];
    }>("/towns");
    return data.data;
  } catch (e) {
    throw new Error(axiosMessage(e, "Failed to load town catalogue"));
  }
}

export async function fetchAdminStats(days = 30): Promise<AdminStatsResponse> {
  try {
    const { data } = await adminClient.get<{ success: boolean; data: AdminStatsResponse }>(
      "/stats",
      { params: { days } }
    );
    return data.data;
  } catch (e) {
    throw new Error(axiosMessage(e, "Failed to load stats"));
  }
}
