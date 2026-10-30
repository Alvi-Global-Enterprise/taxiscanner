import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminPassword,
  getExpectedAdminSessionToken,
  readAdminSessionFromCookieHeader,
} from "@/lib/adminAuth";

/** Temporary local debug — remove before production push if desired */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ success: false }, { status: 404 });
  }

  const fromJar = request.cookies.get(ADMIN_SESSION_COOKIE)?.value || null;
  const fromHeader = readAdminSessionFromCookieHeader(
    request.headers.get("cookie")
  );
  const expected = getExpectedAdminSessionToken();
  const passwordConfigured = Boolean(getAdminPassword());

  return NextResponse.json({
    passwordConfigured,
    hasCookieJar: Boolean(fromJar),
    hasCookieHeader: Boolean(fromHeader),
    cookiePrefix: (fromJar || fromHeader || "").slice(0, 12),
    expectedPrefix: (expected || "").slice(0, 12),
    matches: (fromJar || fromHeader) === expected,
  });
}
