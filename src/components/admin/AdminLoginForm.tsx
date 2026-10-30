"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, User } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin/firms";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }
      router.replace(nextPath.startsWith("/admin") ? nextPath : "/admin/firms");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Lock size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Admin login</h1>
            <p className="text-xs text-slate-500">Sign in to manage firms & stats</p>
          </div>
        </div>

        {error ? (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <label className="mb-1 block text-sm font-bold text-slate-800">
          Username
        </label>
        <div className="relative mb-3">
          <User
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
            autoComplete="username"
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none ring-blue-500 focus:ring-2"
            placeholder="admin"
          />
        </div>

        <label className="mb-1 block text-sm font-bold text-slate-800">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring-2"
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading || !username || !password}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
          Sign in
        </button>
      </form>
    </div>
  );
}
