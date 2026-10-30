import { NextRequest, NextResponse } from "next/server";
import { backendAdminFetch } from "@/lib/backendAdmin";
import { withAdminSession } from "@/lib/requireAdminSession";

type Ctx = { params: Promise<{ slug: string }> };

export async function PUT(request: NextRequest, context: Ctx) {
  return withAdminSession(request, async () => {
    try {
      const { slug } = await context.params;
      const payload = await request.json();
      const res = await backendAdminFetch(
        `admin/providers/${encodeURIComponent(slug)}/towns`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const body = await res.json();
      return NextResponse.json(body, { status: res.status });
    } catch (e) {
      return NextResponse.json(
        {
          success: false,
          message: e instanceof Error ? e.message : "Towns update failed",
        },
        { status: 500 }
      );
    }
  });
}
