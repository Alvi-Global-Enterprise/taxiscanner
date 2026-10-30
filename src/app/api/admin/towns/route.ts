import { NextRequest, NextResponse } from "next/server";
import { backendAdminFetch } from "@/lib/backendAdmin";
import { withAdminSession } from "@/lib/requireAdminSession";

export async function GET(request: NextRequest) {
  return withAdminSession(request, async () => {
    try {
      const res = await backendAdminFetch("admin/towns");
      const body = await res.json();
      return NextResponse.json(body, { status: res.status });
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: e instanceof Error ? e.message : "Towns catalogue failed",
        },
        { status: 500 }
      );
    }
  });
}
