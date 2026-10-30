import { NextRequest, NextResponse } from "next/server";
import { backendAdminFetch } from "@/lib/backendAdmin";
import { withAdminSession } from "@/lib/requireAdminSession";

export async function GET(request: NextRequest) {
  return withAdminSession(request, async () => {
    try {
      const res = await backendAdminFetch("admin/providers");
      const body = await res.json();
      return NextResponse.json(body, { status: res.status });
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: e instanceof Error ? e.message : "Admin providers request failed",
        },
        { status: 500 }
      );
    }
  });
}
