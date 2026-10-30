import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionToken,
  readAdminSessionFromCookieHeader,
} from "@/lib/adminAuth";

export function assertAdminSessionFromRequest(request: NextRequest): void {
  const fromJar = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const fromHeader = readAdminSessionFromCookieHeader(
    request.headers.get("cookie")
  );
  const token = fromJar || fromHeader;

  if (!isValidAdminSessionToken(token)) {
    throw new Error("UNAUTHORIZED_ADMIN");
  }
}

export function adminUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { success: false, message: "Unauthorized. Please log in." },
    { status: 401 }
  );
}

export async function withAdminSession(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    assertAdminSessionFromRequest(request);
    return await handler();
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED_ADMIN") {
      return adminUnauthorizedResponse();
    }
    throw e;
  }
}
