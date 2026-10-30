import { NextRequest, NextResponse } from "next/server";

const COOKIE = "ts_admin_session";

function isPublicAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  );
}

/**
 * Lightweight gate: require session cookie presence.
 * Real token verification happens in Node (admin layout + API routes)
 * where env vars / crypto are reliable.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(COOKIE)?.value;
  if (!cookie) {
    if (isAdminApi) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
