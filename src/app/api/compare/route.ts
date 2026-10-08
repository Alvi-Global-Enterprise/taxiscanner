import { NextResponse } from "next/server";
import { geocodeWithPhoton } from "@/lib/photon";

const DEFAULT_BASE =
  process.env.COMPARE_API_BASE ||
  "https://taxiscannerbackend.vercel.app/api/v1/";

type CompareApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    pickup?: {
      query?: string;
      formatted_address?: string;
      coordinates?: { latitude: number; longitude: number };
      city?: string | null;
      postcode?: string | null;
      country?: string | null;
    };
    dropoff?: {
      query?: string;
      formatted_address?: string;
      coordinates?: { latitude: number; longitude: number };
      city?: string | null;
      postcode?: string | null;
      country?: string | null;
    };
    [key: string]: unknown;
  };
  meta?: {
    geocoded?: {
      pickup: boolean;
      dropoff: boolean;
    };
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

function parseJsonSafely(text: string): CompareApiResponse | null {
  try {
    return JSON.parse(text) as CompareApiResponse;
  } catch {
    const jsonStart = text.indexOf("{");
    if (jsonStart !== -1) {
      try {
        return JSON.parse(text.slice(jsonStart)) as CompareApiResponse;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pickup = typeof body?.pickup === "string" ? body.pickup.trim() : "";
    const dropoff = typeof body?.dropoff === "string" ? body.dropoff.trim() : "";

    if (!pickup || !dropoff) {
      return NextResponse.json(
        { success: false, message: "Pickup and drop-off are required." },
        { status: 400 }
      );
    }

    // 1. Server-side Geocoding using Photon Komoot API for both pickup and drop-off
    const [pickupGeo, dropoffGeo] = await Promise.all([
      geocodeWithPhoton(pickup),
      geocodeWithPhoton(dropoff),
    ]);

    // 2. Build final payload injecting extracted coordinates and resolved location names
    const payload = {
      // Location names (use resolved name from Photon if available, fallback to query)
      pickup: pickupGeo?.name || pickup,
      dropoff: dropoffGeo?.name || dropoff,
      pickup_query: pickup,
      dropoff_query: dropoff,

      // Extracted coordinates mapped correctly: geometry.coordinates is [lon, lat]
      pickup_lat: pickupGeo?.lat ?? null,
      pickup_lon: pickupGeo?.lon ?? null,
      pickup_latitude: pickupGeo?.lat ?? null,
      pickup_longitude: pickupGeo?.lon ?? null,

      dropoff_lat: dropoffGeo?.lat ?? null,
      dropoff_lon: dropoffGeo?.lon ?? null,
      dropoff_latitude: dropoffGeo?.lat ?? null,
      dropoff_longitude: dropoffGeo?.lon ?? null,

      // Location details and formatted addresses
      pickup_name: pickupGeo?.name || pickup,
      dropoff_name: dropoffGeo?.name || dropoff,
      pickup_formatted_address: pickupGeo?.formatted_address || pickup,
      dropoff_formatted_address: dropoffGeo?.formatted_address || dropoff,

      pickup_coordinates: pickupGeo
        ? { latitude: pickupGeo.lat, longitude: pickupGeo.lon }
        : null,
      dropoff_coordinates: dropoffGeo
        ? { latitude: dropoffGeo.lat, longitude: dropoffGeo.lon }
        : null,
    };

    const base = DEFAULT_BASE.replace(/\/$/, "");

    // 3. Send final payload to backend compare API
    let upstream = await fetch(`${base}/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const rawText = await upstream.text().catch(() => "");
    let data = parseJsonSafely(rawText);

    // Graceful fallback: if upstream failed with resolved names, retry with original query strings
    if (!upstream.ok || !data?.success) {
      if (payload.pickup !== pickup || payload.dropoff !== dropoff) {
        const fallbackPayload = {
          ...payload,
          pickup,
          dropoff,
        };

        const retryUpstream = await fetch(`${base}/compare`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(fallbackPayload),
          cache: "no-store",
        });

        const retryText = await retryUpstream.text().catch(() => "");
        const retryData = parseJsonSafely(retryText);

        if (retryUpstream.ok && retryData?.success) {
          upstream = retryUpstream;
          data = retryData;
        }
      }
    }

    if (!upstream.ok) {
      return NextResponse.json(
        data ?? {
          success: false,
          message: `Upstream compare failed (${upstream.status})`,
        },
        { status: upstream.status }
      );
    }

    // Enhance response with geocoding info if upstream omitted it
    if (data && typeof data === "object") {
      if (data.data?.pickup && !data.data.pickup.coordinates && pickupGeo) {
        data.data.pickup.coordinates = {
          latitude: pickupGeo.lat,
          longitude: pickupGeo.lon,
        };
      }
      if (data.data?.dropoff && !data.data.dropoff.coordinates && dropoffGeo) {
        data.data.dropoff.coordinates = {
          latitude: dropoffGeo.lat,
          longitude: dropoffGeo.lon,
        };
      }

      if (!data.meta) {
        data.meta = {};
      }
      data.meta.geocoded = {
        pickup: Boolean(pickupGeo),
        dropoff: Boolean(dropoffGeo),
      };
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to compare prices";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
