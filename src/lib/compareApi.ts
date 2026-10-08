import axios from "axios";
import { apiClient } from "@/lib/apiClient";

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
  pickup_lat?: number;
  pickup_lon?: number;
  dropoff_lat?: number;
  dropoff_lon?: number;
  pickup_name?: string;
  dropoff_name?: string;
};

export { API_BASE_URL } from "@/lib/apiClient";

export async function fetchCompareQuotes(
  payload: CompareRequest
): Promise<CompareResponse> {
  try {
    const response = await apiClient.post<CompareResponse>("/compare", payload);
    const data = response.data;

    if (!data?.success || !data?.data) {
      throw new Error(data?.message || data?.error || "No quotes returned");
    }

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === "string" ? error.response.data : null);

      if (serverMessage) {
        throw new Error(serverMessage);
      }

      if (error.code === "ECONNABORTED") {
        throw new Error("Request timed out. Please try again.");
      }

      if (!error.response) {
        throw new Error("Unable to connect to server. Please check your internet connection.");
      }

      throw new Error(`Compare request failed (${error.response.status})`);
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Failed to compare prices. Please try again.");
  }
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
