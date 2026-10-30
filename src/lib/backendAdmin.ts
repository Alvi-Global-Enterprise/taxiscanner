/**
 * Server-only helpers for Next.js Route Handlers → Laravel admin API.
 */

export function getBackendApiBase(): string {
  const raw =
    process.env.BACKEND_API_BASE ||
    process.env.COMPARE_API_BASE ||
    "http://127.0.0.1:8001/api/v1/";
  return raw.replace(/\/+$/, "") + "/";
}

export function getAdminToken(): string {
  return (process.env.ADMIN_API_TOKEN || "").trim();
}

export async function backendAdminFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getAdminToken();
  if (!token) {
    throw new Error("ADMIN_API_TOKEN is not configured on the Next.js server.");
  }

  const url = new URL(path.replace(/^\//, ""), getBackendApiBase()).toString();
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  headers.set("X-Admin-Token", token);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, { ...init, headers, cache: "no-store" });
}
