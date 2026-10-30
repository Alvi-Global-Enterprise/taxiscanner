"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AdminProvider,
  fetchAdminProviders,
  syncProviderTowns,
} from "@/lib/adminApi";
import { getFullUkCoverageIds, UK_TOWN_ZONES } from "@/lib/ukZonesData";
import { UKTownsLeafletMapClient } from "./UKTownsLeafletMapClient";
import { AdminShell } from "./AdminShell";
import {
  Search,
  Check,
  MapPin,
  Building2,
  ShieldCheck,
  Loader2,
  Globe2,
  Save,
  Trash2,
} from "lucide-react";

const BRAND_COLORS: Record<string, string> = {
  uber: "#000000",
  bolt: "#34D186",
  streetcars: "#197DF1",
  veezu: "#E11D48",
};

type Props = {
  onClose?: () => void;
  /** When true, owns AdminShell and puts taxi firms under the left nav. */
  withShell?: boolean;
};

export function AdminOperatorZoneManager({ onClose, withShell = false }: Props) {
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [townSearch, setTownSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [layerFilter, setLayerFilter] = useState<string>("coverage");
  const [focusedZoneId, setFocusedZoneId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Local ticks — only sent to backend when Save is clicked */
  const [draftTowns, setDraftTowns] = useState<string[]>([]);
  const savedTownsRef = useRef<string[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAdminProviders();
      setProviders(list);
      setSelectedSlug((prev) => prev || list[0]?.slug || "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load firms");
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

  // Load draft when firm changes (or first load finishes)
  useEffect(() => {
    if (loading) return;
    const firm = providers.find((p) => p.slug === selectedSlug);
    if (!firm) {
      setDraftTowns([]);
      savedTownsRef.current = [];
      return;
    }
    const towns = [...(firm.towns || [])];
    setDraftTowns(towns);
    savedTownsRef.current = towns;
    // intentionally not depending on providers — only firm switch / initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug, loading]);

  const isDirty = useMemo(() => {
    const a = [...draftTowns].sort().join(",");
    const b = [...savedTownsRef.current].sort().join(",");
    return a !== b;
  }, [draftTowns]);

  const filteredCompanies = useMemo(() => {
    return providers.filter((p) =>
      p.display_name.toLowerCase().includes(companySearch.toLowerCase())
    );
  }, [providers, companySearch]);

  const filteredTowns = useMemo(() => {
    const layerOrder = { all_uk: 0, nation: 1, region: 2, city: 3 } as Record<
      string,
      number
    >;
    return UK_TOWN_ZONES.filter((zone) => {
      const matchesText =
        zone.name.toLowerCase().includes(townSearch.toLowerCase()) ||
        zone.region.toLowerCase().includes(townSearch.toLowerCase());
      const matchesCountry =
        countryFilter === "all" ||
        zone.country.toLowerCase() === countryFilter.toLowerCase() ||
        (countryFilter === "united kingdom" && zone.layer === "all_uk");
      const layer = zone.layer || "city";
      const matchesLayer =
        layerFilter === "all" ||
        (layerFilter === "coverage" &&
          (layer === "all_uk" || layer === "nation" || layer === "region")) ||
        layer === layerFilter;
      return matchesText && matchesCountry && matchesLayer;
    }).sort(
      (a, b) =>
        (layerOrder[a.layer || "city"] ?? 9) - (layerOrder[b.layer || "city"] ?? 9) ||
        a.name.localeCompare(b.name)
    );
  }, [townSearch, countryFilter, layerFilter]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const selectFirm = (slug: string) => {
    if (slug === selectedSlug) return;
    if (isDirty) {
      const ok = window.confirm(
        "You have unsaved coverage changes. Switch firm and discard them?"
      );
      if (!ok) return;
    }
    setSelectedSlug(slug);
  };

  const handleToggleTown = (townId: string) => {
    if (!selected || saving) return;
    setDraftTowns((prev) =>
      prev.includes(townId) ? prev.filter((id) => id !== townId) : [...prev, townId]
    );
  };

  const handleSelectAllFilteredTowns = () => {
    if (!selected || saving) return;
    setDraftTowns((prev) =>
      Array.from(new Set([...prev, ...filteredTowns.map((t) => t.id)]))
    );
  };

  const handleClearAllTowns = () => {
    if (!selected || saving) return;
    if (draftTowns.length === 0) return;
    const ok = window.confirm(
      `Clear all coverage zones for ${selected.display_name}? Click Save afterwards to apply.`
    );
    if (!ok) return;
    setDraftTowns([]);
  };

  const handleCoverEntireUk = () => {
    if (!selected || saving) return;
    setDraftTowns(getFullUkCoverageIds());
  };

  const handleDiscard = () => {
    setDraftTowns([...savedTownsRef.current]);
    setError(null);
  };

  const handleSave = async () => {
    if (!selected || saving) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await syncProviderTowns(selected.slug, draftTowns);
      setProviders((prev) => prev.map((p) => (p.slug === updated.slug ? updated : p)));
      const towns = [...(updated.towns || [])];
      setDraftTowns(towns);
      savedTownsRef.current = towns;
      showToast(`Saved coverage for ${updated.display_name}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save coverage");
    } finally {
      setSaving(false);
    }
  };

  const coversEntireUk = Boolean(
    draftTowns.includes("all_uk") ||
      (draftTowns.includes("england") &&
        draftTowns.includes("scotland") &&
        draftTowns.includes("wales") &&
        draftTowns.includes("northern_ireland"))
  );

  const brandColor = (slug: string) => BRAND_COLORS[slug] || "#197DF1";

  const firmsSidebar = (
    <div className="flex flex-col">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
        <Building2 size={16} className="text-blue-600" />
        Taxi firms ({providers.length})
      </h3>
      <div className="relative mb-2">
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search firms..."
          value={companySearch}
          onChange={(e) => setCompanySearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
      <div className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1">
        {filteredCompanies.map((company) => {
          const isSelected = selected?.slug === company.slug;
          const count = isSelected ? draftTowns.length : company.towns?.length || 0;
          const entireUk = isSelected
            ? draftTowns.includes("all_uk")
            : company.towns?.includes("all_uk");
          return (
            <button
              type="button"
              key={company.slug}
              onClick={() => selectFirm(company.slug)}
              className={`w-full rounded-xl border p-2.5 text-left transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50/70 ring-1 ring-blue-600"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ backgroundColor: brandColor(company.slug) }}
                />
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-slate-900">
                    {company.display_name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {count === 0 ? (
                      <span className="font-medium text-amber-600">No coverage</span>
                    ) : entireUk ? (
                      <span className="font-medium text-emerald-600">Entire UK</span>
                    ) : (
                      <span className="font-medium text-emerald-600">
                        {count} zone(s)
                      </span>
                    )}
                    {isSelected && isDirty ? (
                      <span className="ml-1 font-bold text-amber-600">· unsaved</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const mainPanel = loading ? (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
      <Loader2 className="animate-spin" size={18} />
      Loading town coverage from backend…
    </div>
  ) : (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 shadow-2xl">
      {notification ? (
        <div className="fixed right-6 top-6 z-[9999] flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-white shadow-xl">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              UK Coverage Map
            </h2>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
              Anywhere in the UK
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Select a firm on the left, then tick coverage zones. Use{" "}
            <strong>Cover entire UK</strong> for nationwide.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {isDirty ? (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
              Unsaved changes
            </span>
          ) : null}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Done / Close
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {/* Map + wide coverage zones (firms live under left nav) */}
      <div className="grid min-h-[640px] grid-cols-1 xl:grid-cols-12">
        <div className="flex flex-col border-r border-slate-200 bg-slate-100/60 p-4 xl:col-span-7">
          {selected ? (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                  style={{ backgroundColor: brandColor(selected.slug) }}
                >
                  {selected.display_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {selected.display_name}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      mode: {selected.coverage_mode}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {coversEntireUk ? (
                      <span className="font-semibold text-emerald-700">
                        Covers entire United Kingdom — any UK pickup
                      </span>
                    ) : (
                      <>
                        Active in:{" "}
                        <strong className="text-blue-600">{draftTowns.length}</strong>{" "}
                        zone(s)
                        {isDirty ? (
                          <span className="ml-1 font-bold text-amber-600">(unsaved)</span>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                Tick zones, then click Save Coverage
              </div>
            </div>
          ) : null}

          <div className="h-[520px] w-full shrink-0">
            <UKTownsLeafletMapClient
              selectedTownIds={draftTowns}
              onToggleTown={handleToggleTown}
              activeCompanyColor={selected ? brandColor(selected.slug) : "#197DF1"}
              focusedZoneId={focusedZoneId}
              height="520px"
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col bg-white xl:col-span-5">
          <div className="flex flex-1 flex-col p-4 pb-0">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
                <MapPin size={16} className="text-blue-600" />
                Coverage zones ({filteredTowns.length})
              </h3>
            </div>

            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search (UK, England, Manchester)..."
                value={townSearch}
                onChange={(e) => setTownSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="mb-1.5 flex gap-1 overflow-x-auto pb-1 text-xs">
              {[
                ["coverage", "UK layers"],
                ["all_uk", "Entire UK"],
                ["nation", "Nations"],
                ["region", "Regions"],
                ["city", "Cities"],
                ["all", "Everything"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLayerFilter(id)}
                  className={`whitespace-nowrap rounded px-2.5 py-1 font-medium transition ${
                    layerFilter === id
                      ? "bg-blue-600 font-bold text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mb-3 flex gap-1 overflow-x-auto pb-1 text-xs">
              {["all", "england", "scotland", "wales", "northern ireland"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCountryFilter(c)}
                  className={`whitespace-nowrap rounded px-2.5 py-1 capitalize font-medium transition ${
                    countryFilter === c
                      ? "bg-slate-800 font-bold text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c === "all" ? "Any country" : c}
                </button>
              ))}
            </div>

            <div className="mb-2 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={handleCoverEntireUk}
                disabled={saving || !selected}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1.5 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
              >
                <Globe2 size={12} />
                Cover entire UK
              </button>
              <button
                type="button"
                onClick={handleSelectAllFilteredTowns}
                disabled={saving || !selected}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1.5 text-[11px] font-semibold text-blue-800 hover:bg-blue-100 disabled:opacity-50"
              >
                <Check size={12} />
                Tick all shown
              </button>
            </div>

            <div className="max-h-[380px] flex-1 space-y-1.5 overflow-y-auto pr-1">
              {filteredTowns.map((zone) => {
                const isChecked = draftTowns.includes(zone.id);
                return (
                  <div
                    key={zone.id}
                    onClick={() => handleToggleTown(zone.id)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition ${
                      isChecked
                        ? "border-emerald-500 bg-emerald-50/50 text-slate-900"
                        : "border-slate-100 bg-white text-slate-700 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                          isChecked
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked ? <Check size={12} strokeWidth={3} /> : null}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{zone.name}</div>
                        <div className="text-xs text-slate-400">
                          {(zone.layer || "city").replace("_", " ")} · {zone.region}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocusedZoneId(zone.id);
                      }}
                      className="px-1 py-0.5 text-xs text-blue-600 hover:underline"
                      title="Zoom on map"
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky action bar — always visible */}
          <div className="sticky bottom-0 border-t border-slate-200 bg-white px-3 py-2.5 shadow-[0_-6px_16px_rgba(15,23,42,0.05)]">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                Selected: <strong className="text-slate-800">{draftTowns.length}</strong>{" "}
                zone(s)
              </span>
              {isDirty ? (
                <span className="font-semibold text-amber-600">Not saved yet</span>
              ) : (
                <span className="font-medium text-emerald-600">All changes saved</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              <button
                type="button"
                onClick={handleClearAllTowns}
                disabled={saving || !selected || draftTowns.length === 0}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 size={12} />
                Clear all
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                disabled={saving || !selected || !isDirty}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving || !selected || !isDirty}
                className="col-span-2 inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-2 py-1.5 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 sm:col-span-1"
              >
                {saving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}
                Save coverage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (withShell) {
    return (
      <AdminShell
        title="Town Map"
        subtitle="Assign UK coverage to firms (synced to backend)."
        wide
        sidebarExtra={loading ? undefined : firmsSidebar}
      >
        {mainPanel}
      </AdminShell>
    );
  }

  // Legacy embed: show firms inline above map if shell not used
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        {firmsSidebar}
      </div>
      {mainPanel}
    </div>
  );
}
