import { NextRequest, NextResponse } from "next/server";

const DEFAULT_BASE =
  process.env.BACKEND_API_BASE ||
  process.env.COMPARE_API_BASE ||
  "http://127.0.0.1:8001/api/v1/";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const base = DEFAULT_BASE.replace(/\/+$/, "") + "/";
    const url = new URL("track/click", base).toString();

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const body = await res.json().catch(() => ({ success: res.ok }));
    return NextResponse.json(body, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Click tracking failed",
      },
      { status: 500 }
    );
  }
}
