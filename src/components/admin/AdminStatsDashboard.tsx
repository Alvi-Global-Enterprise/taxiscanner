"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminStatsResponse,
  fetchAdminStats,
} from "@/lib/adminApi";
import { BarChart3, Loader2, MousePointerClick, Search } from "lucide-react";

export function AdminStatsDashboard() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await fetchAdminStats(days);
      setData(stats);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <BarChart3 size={18} className="text-blue-600" />
          Firm performance
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Last
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-semibold text-slate-800"
          >
            <option value={7}>7 days</option>
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
          </select>
        </label>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          <Loader2 className="animate-spin" size={18} />
          Loading statistics…
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Search size={14} />
                Compare impressions
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {data.totals.compare_impressions}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <MousePointerClick size={14} />
                Booking clicks
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {data.totals.booking_clicks}
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Firm</th>
                  <th className="px-4 py-3 font-semibold">Compares shown</th>
                  <th className="px-4 py-3 font-semibold">Booking clicks</th>
                </tr>
              </thead>
              <tbody>
                {data.providers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                      No events yet. Run a compare or track a booking click.
                    </td>
                  </tr>
                ) : (
                  data.providers.map((row) => (
                    <tr key={row.provider_slug} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {row.display_name}
                        <div className="text-xs font-medium text-slate-400">
                          {row.provider_slug}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {row.compare_impressions}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{row.booking_clicks}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
}
