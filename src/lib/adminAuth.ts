import { createHash } from "crypto";

export const ADMIN_SESSION_COOKIE = "ts_admin_session";

/** Default local admin (override via env for production) */
export function getAdminUsername(): string {
  return (process.env.ADMIN_USERNAME || "admin").trim();
}

export function getAdminPassword(): string {
  return (process.env.ADMIN_PASSWORD || "password123").trim();
}

export function createAdminSessionToken(
  username: string,
  password: string
): string {
  const secret = process.env.ADMIN_SESSION_SECRET || "taxiscanner-admin-session";
  return createHash("sha256")
    .update(`${username}:${password}:${secret}`)
    .digest("hex");
}

export function getExpectedAdminSessionToken(): string | null {
  const username = getAdminUsername();
  const password = getAdminPassword();
  if (!username || !password) return null;
  return createAdminSessionToken(username, password);
}

export function isValidAdminSessionToken(
  token: string | undefined | null
): boolean {
  const expected = getExpectedAdminSessionToken();
  if (!expected || !token) return false;
  return token.trim() === expected;
}

export function credentialsMatch(username: string, password: string): boolean {
  return (
    username.trim() === getAdminUsername() &&
    password === getAdminPassword()
  );
}

export function readAdminSessionFromCookieHeader(
  cookieHeader: string | null
): string | null {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const [name, ...rest] = part.trim().split("=");
    if (name === ADMIN_SESSION_COOKIE) {
      return rest.join("=") || null;
    }
  }
  return null;
}
