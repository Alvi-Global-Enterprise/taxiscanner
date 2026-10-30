import { NextRequest } from "next/server";
import { proxyBackendAdminJson } from "@/lib/backendAdmin";
import { withAdminSession } from "@/lib/requireAdminSession";

export async function GET(request: NextRequest) {
  return withAdminSession(request, async () =>
    proxyBackendAdminJson("admin/towns")
  );
}
