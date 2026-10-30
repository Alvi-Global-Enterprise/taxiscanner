/**
 * Server-only helpers for Next.js Route Handlers → Laravel admin API.
 */

export function getBackendApiBase(): string {
  const raw =
    process.env.BACKEND_API_BASE ||
    process.env.COMPARE_API_BASE ||
    "https://taxiscannerbackend.vercel.app/api/v1/";
  return raw.replace(/\/+$/, "") + "/";
}

export function getAdminToken(): string {
  return (process.env.ADMIN_API_TOKEN || "").trim();
}

export type BackendAdminResult = {
  ok: boolean;
  status: number;
  url: string;
  data: unknown;
  rawText: string;
};

/**
 * Fetch Laravel admin API and safely parse JSON (HTML/PHP errors become clear messages).
 */
export async function backendAdminFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const result = await backendAdminRequest(path, init);
  // Preserve previous Response-like usage for callers that still use res.json()
  return new Response(result.rawText, {
    status: result.status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function backendAdminRequest(
  path: string,
  init: RequestInit = {}
): Promise<BackendAdminResult> {
  const token = getAdminToken();
  if (!token) {
    throw new Error(
      "ADMIN_API_TOKEN is not configured on the Next.js server (Vercel env)."
    );
  }

  const url = new URL(path.replace(/^\//, ""), getBackendApiBase()).toString();
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  headers.set("X-Admin-Token", token);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(url, { ...init, headers, cache: "no-store" });
  } catch (e) {
    throw new Error(
      `Backend unreachable at ${url}: ${e instanceof Error ? e.message : "network error"}`
    );
  }

  const rawText = await res.text();
  const trimmed = rawText.trim();

  let data: unknown = null;
  if (trimmed) {
    try {
      data = JSON.parse(trimmed);
    } catch {
      const snippet = trimmed.slice(0, 180).replace(/\s+/g, " ");
      throw new Error(
        `Backend returned non-JSON (HTTP ${res.status}) from ${url}. Body starts with: ${snippet}`
      );
    }
  }

  return {
    ok: res.ok,
    status: res.status,
    url,
    data,
    rawText: trimmed || "null",
  };
}

/** Prefer this in route handlers — always returns JSON to the browser. */
export async function proxyBackendAdminJson(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  try {
    const result = await backendAdminRequest(path, init);
    return Response.json(result.data ?? { success: false }, {
      status: result.status,
    });
  } catch (e) {
    return Response.json(
      {
        success: false,
        message: e instanceof Error ? e.message : "Admin backend request failed",
      },
      { status: 502 }
    );
  }
}
