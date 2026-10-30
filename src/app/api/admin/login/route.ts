import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  credentialsMatch,
  getAdminPassword,
  getAdminUsername,
} from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = typeof body?.username === "string" ? body.username : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!getAdminUsername() || !getAdminPassword()) {
      return NextResponse.json(
        { success: false, message: "Admin credentials are not configured." },
        { status: 503 }
      );
    }

    if (!credentialsMatch(username, password)) {
      return NextResponse.json(
        { success: false, message: "Invalid username or password." },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(username.trim(), password);
    const res = NextResponse.json({ success: true, message: "Logged in." });

    res.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json(
      { success: false, message: "Login failed." },
      { status: 500 }
    );
  }
}
