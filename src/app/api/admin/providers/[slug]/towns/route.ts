import { NextRequest } from "next/server";
import { proxyBackendAdminJson } from "@/lib/backendAdmin";
import { withAdminSession } from "@/lib/requireAdminSession";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: NextRequest, context: Ctx) {
  return withAdminSession(request, async () => {
    const { slug } = await context.params;
    const payload = await request.json();
    return proxyBackendAdminJson(
      `admin/providers/${encodeURIComponent(slug)}/towns`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  });
}
