import { NextResponse } from "next/server";

const DEFAULT_BASE = "https://scant-volumes-flip.ngrok-free.dev/api/v1";

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

    const base = (process.env.COMPARE_API_BASE || DEFAULT_BASE).replace(/\/$/, "");
    const upstream = await fetch(`${base}/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ pickup, dropoff }),
      cache: "no-store",
    });

    const data = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      return NextResponse.json(
        data ?? {
          success: false,
          message: `Upstream compare failed (${upstream.status})`,
        },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to compare prices";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
