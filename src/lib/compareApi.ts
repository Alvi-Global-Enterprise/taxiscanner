export type CompareLocation = {
  query: string;
  formatted_address: string;
  coordinates: { latitude: number; longitude: number };
  city: string | null;
  postcode: string | null;
  country: string | null;
};

export type CompareQuote = {
  provider: string;
  display_name: string;
  min_price: number;
  max_price: number;
  is_fixed_price: boolean;
  currency: string;
  estimated_pickup_minutes: number | null;
  estimated_duration_minutes: number | null;
  distance_miles: number | null;
  quote_type: string;
  is_available: boolean;
  booking_url: string | null;
  error_message: string | null;
};

export type CompareRoute = {
  distance_miles: number;
  duration_minutes: number;
  distance_meters: number;
  duration_seconds: number;
  summary: string;
  is_estimated: boolean;
};

export type CompareData = {
  pickup: CompareLocation;
  dropoff: CompareLocation;
  route: CompareRoute;
  quotes: CompareQuote[];
};

export type CompareResponse = {
  success: boolean;
  data?: CompareData;
  meta?: {
    quote_type?: string;
    disclaimer?: string;
    execution_time_ms?: number;
  };
  message?: string;
  error?: string;
};

export type CompareRequest = {
  pickup: string;
  dropoff: string;
};

export async function fetchCompareQuotes(
  payload: CompareRequest
): Promise<CompareResponse> {
  const res = await fetch("/api/compare", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => null)) as CompareResponse | null;

  if (!res.ok) {
    throw new Error(
      json?.message || json?.error || `Compare request failed (${res.status})`
    );
  }

  if (!json?.success || !json.data) {
    throw new Error(json?.message || json?.error || "No quotes returned");
  }

  return json;
}

export function formatQuotePrice(quote: CompareQuote): string {
  const symbol = quote.currency === "GBP" ? "£" : `${quote.currency} `;
  const min = quote.min_price.toFixed(2);
  const max = quote.max_price.toFixed(2);
  if (quote.is_fixed_price || min === max) {
    return `${symbol}${min}`;
  }
  return `${symbol}${min}–${symbol}${max}`;
}

export function formatPickupEta(minutes: number | null | undefined): string {
  if (minutes == null || Number.isNaN(minutes)) return "—";
  return `${minutes} mins`;
}
