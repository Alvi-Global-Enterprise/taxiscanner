import axios from "axios";

// Default to Next.js API route ("/api") to prevent browser CORS and OPTIONS 404 errors.
// When using "/api", the request is same-origin (no OPTIONS preflight) and Next.js proxies
// it server-to-server to your backend.
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api"
).replace(/\/+$/, "");

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
