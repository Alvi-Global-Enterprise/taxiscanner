"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdminProvider,
  CoverageMode,
  fetchAdminProviders,
  updateProviderCoverage,
} from "@/lib/adminApi";
import { PostcodeMultiSelect } from "@/components/admin/PostcodeMultiSelect";
import { Building2, Loader2, Save, Globe2, MapPinned, Map } from "lucide-react";

export function AdminFirmsPostcodeManager() {
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [coverageMode, setCoverageMode] = useState<CoverageMode>("nationwide");
  const [selectedPostcodes, setSelectedPostcodes] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAdminProviders();
      setProviders(list);
      const first = list[0];
      if (first) {
        setSelectedSlug((prev) => prev || first.slug);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load providers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(
    () => providers.find((p) => p.slug === selectedSlug) || null,
    [providers, selectedSlug]
  );

  useEffect(() => {
    if (!selected) return;
    setCoverageMode(selected.coverage_mode);
    setSelectedPostcodes(selected.postcodes || []);
    setIsActive(selected.is_active);
  }, [selected]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateProviderCoverage(selected.slug, {
        coverage_mode: coverageMode,
        postcodes:
          coverageMode === "postcodes" || coverageMode === "both"
            ? selectedPostcodes
            : selected.postcodes || [],
        towns: selected.towns || [],
        is_active: isActive,
      });
      setProviders((prev) => prev.map((p) => (p.slug === updated.slug ? updated : p)));
      setSelectedPostcodes(updated.postcodes || []);
      showToast(`Saved coverage for ${updated.display_name}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
        <Loader2 className="animate-spin" size={18} />
        Loading firms from backend…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toast ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
          {toast}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Building2 size={16} />
            Taxi firms
          </h2>
          <ul className="space-y-1">
            {providers.map((p) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => setSelectedSlug(p.slug)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                    selectedSlug === p.slug
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div>{p.display_name}</div>
                  <div
                    className={`mt-0.5 text-xs font-medium ${
                      selectedSlug === p.slug ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {p.coverage_mode === "nationwide"
                      ? "Nationwide"
                      : p.coverage_mode === "towns"
                        ? `${p.towns?.length || 0} town(s)`
                        : p.coverage_mode === "both"
                          ? `${p.postcodes.length} PC + ${p.towns?.length || 0} towns`
                          : `${p.postcodes.length} postcode(s)`}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {!selected ? (
            <p className="text-sm text-slate-500">Select a firm.</p>
          ) : (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selected.display_name}</h2>
                <p className="text-sm text-slate-500">slug: {selected.slug}</p>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Firm is active
              </label>

              <div>
                <p className="mb-2 text-sm font-bold text-slate-900">Coverage mode</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setCoverageMode("nationwide")}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      coverageMode === "nationwide"
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Globe2 size={16} />
                    Nationwide (all UK pickups)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverageMode("postcodes")}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      coverageMode === "postcodes"
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <MapPinned size={16} />
                    Specific postcodes only
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverageMode("towns")}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      coverageMode === "towns"
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Map size={16} />
                    Town / city map only
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverageMode("both")}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      coverageMode === "both"
                        ? "border-blue-600 bg-blue-50 text-blue-800"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <MapPinned size={16} />
                    Postcodes + towns (either match)
                  </button>
                </div>
              </div>

              {coverageMode === "nationwide" ? (
                <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  This firm appears for every pickup location (no postcode/town restriction).
                </p>
              ) : null}

              {coverageMode === "postcodes" || coverageMode === "both" ? (
                <PostcodeMultiSelect
                  value={selectedPostcodes}
                  onChange={setSelectedPostcodes}
                  disabled={saving}
                />
              ) : null}

              {coverageMode === "towns" || coverageMode === "both" ? (
                <p className="rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-800">
                  Town assignments are managed on the{" "}
                  <a href="/admin/operators" className="font-bold underline">
                    Town Map
                  </a>{" "}
                  page ({selected.towns?.length || 0} town(s) currently assigned).
                </p>
              ) : null}

              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save coverage
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
