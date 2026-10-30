import { NextRequest } from "next/server";
import { proxyBackendAdminJson } from "@/lib/backendAdmin";
import { withAdminSession } from "@/lib/requireAdminSession";

export async function GET(request: NextRequest) {
  return withAdminSession(request, async () => {
    const days = request.nextUrl.searchParams.get("days") || "30";
    return proxyBackendAdminJson(`admin/stats?days=${encodeURIComponent(days)}`);
  });
}
