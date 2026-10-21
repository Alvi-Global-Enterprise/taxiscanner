"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TaxiCompany,
  loadTaxiCompanies,
  saveTaxiCompanies,
  resetTaxiCompaniesToDefault,
} from "@/lib/operatorZonesStore";
import { UK_TOWN_ZONES } from "@/lib/ukZonesData";
import { UKTownsLeafletMap } from "./UKTownsLeafletMap";
import {
  Search,
  Plus,
  Check,
  MapPin,
  Building2,
  Trash2,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

type Props = {
  onClose?: () => void;
};

export function AdminOperatorZoneManager({ onClose }: Props) {
  const [companies, setCompanies] = useState<TaxiCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [companySearch, setCompanySearch] = useState("");
  const [townSearch, setTownSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [focusedZoneId, setFocusedZoneId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // New Company Modal state
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#197DF1");
  const [newBaseFare, setNewBaseFare] = useState("3.50");
  const [newPerMile, setNewPerMile] = useState("2.10");
  const [newPhone, setNewPhone] = useState("+44 ");
  const [newBookingUrl, setNewBookingUrl] = useState("https://");
  const [newVehicle, setNewVehicle] = useState("Standard Saloon");

  // Load companies
  useEffect(() => {
    const list = loadTaxiCompanies();
    setCompanies(list);
    if (list.length > 0) {
      setSelectedCompanyId(list[0].id);
    }
  }, []);

  const selectedCompany = useMemo(() => {
    return companies.find((c) => c.id === selectedCompanyId) || companies[0];
  }, [companies, selectedCompanyId]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) =>
      c.name.toLowerCase().includes(companySearch.toLowerCase())
    );
  }, [companies, companySearch]);

  const filteredTowns = useMemo(() => {
    return UK_TOWN_ZONES.filter((zone) => {
      const matchesText =
        zone.name.toLowerCase().includes(townSearch.toLowerCase()) ||
        zone.region.toLowerCase().includes(townSearch.toLowerCase());
      const matchesCountry =
        countryFilter === "all" || zone.country.toLowerCase() === countryFilter.toLowerCase();
      return matchesText && matchesCountry;
    });
  }, [townSearch, countryFilter]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Toggle town coverage for active company
  const handleToggleTown = (townId: string) => {
    if (!selectedCompany) return;

    const currentTowns = selectedCompany.assignedTownIds;
    const exists = currentTowns.includes(townId);
    const updatedTowns = exists
      ? currentTowns.filter((id) => id !== townId)
      : [...currentTowns, townId];

    const updatedCompanies = companies.map((c) =>
      c.id === selectedCompany.id ? { ...c, assignedTownIds: updatedTowns } : c
    );

    setCompanies(updatedCompanies);
    saveTaxiCompanies(updatedCompanies);

    const townName = UK_TOWN_ZONES.find((z) => z.id === townId)?.name || townId;
    showToast(
      exists
        ? `Removed "${townName}" from ${selectedCompany.name}`
        : `Added "${townName}" to ${selectedCompany.name}`
    );
  };

  const handleSelectAllFilteredTowns = () => {
    if (!selectedCompany) return;
    const toAdd = filteredTowns.map((t) => t.id);
    const set = new Set([...selectedCompany.assignedTownIds, ...toAdd]);
    const updatedTowns = Array.from(set);

    const updatedCompanies = companies.map((c) =>
      c.id === selectedCompany.id ? { ...c, assignedTownIds: updatedTowns } : c
    );
    setCompanies(updatedCompanies);
    saveTaxiCompanies(updatedCompanies);
    showToast(`Added ${toAdd.length} towns to ${selectedCompany.name}`);
  };

  const handleClearAllTowns = () => {
    if (!selectedCompany) return;
    const updatedCompanies = companies.map((c) =>
      c.id === selectedCompany.id ? { ...c, assignedTownIds: [] } : c
    );
    setCompanies(updatedCompanies);
    saveTaxiCompanies(updatedCompanies);
    showToast(`Cleared all towns for ${selectedCompany.name}`);
  };

  const handleDeleteCompany = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      const remaining = companies.filter((c) => c.id !== id);
      setCompanies(remaining);
      saveTaxiCompanies(remaining);
      if (selectedCompanyId === id && remaining.length > 0) {
        setSelectedCompanyId(remaining[0].id);
      }
      showToast(`Deleted ${name}`);
    }
  };

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newId = newName.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();
    const newCompany: TaxiCompany = {
      id: newId,
      name: newName.trim(),
      brandColor: newColor,
      baseFare: parseFloat(newBaseFare) || 3.5,
      perMileRate: parseFloat(newPerMile) || 2.1,
      minEtaMinutes: 5,
      rating: 4.8,
      phone: newPhone.trim(),
      bookingUrl: newBookingUrl.trim(),
      vehicleType: newVehicle,
      assignedTownIds: [],
      isActive: true,
    };

    const updated = [newCompany, ...companies];
    setCompanies(updated);
    saveTaxiCompanies(updated);
    setSelectedCompanyId(newId);
    setIsAddingCompany(false);

    // Reset form
    setNewName("");
    setNewBaseFare("3.50");
    setNewPerMile("2.10");

    showToast(`Created company "${newCompany.name}"! Now tick towns on the map to grant coverage.`);
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all taxi companies and town boundaries to original defaults?")) {
      const defaults = resetTaxiCompaniesToDefault();
      setCompanies(defaults);
      setSelectedCompanyId(defaults[0]?.id || "");
      showToast("Reset to default UK taxi companies and coverage!");
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 overflow-hidden shadow-2xl">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[9999] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              UK Taxi Companies & Coverage Geofencing
            </h2>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Admin Portal
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Tick towns on the map for each taxi company. When a customer searches within a town boundary,
            only companies ticked for that boundary can offer quotes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            title="Reset to sample UK operators"
          >
            <RotateCcw size={14} />
            Reset Defaults
          </button>
          {onClose && (
            <button
              onClick={onClose} 
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Done / Close
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left sidebar (companies), Center (Map), Right (Towns Checklist) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Companies List (3 cols) */}
        <div className="lg:col-span-3 bg-white border-r border-slate-200 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Building2 size={16} className="text-blue-600" />
              UK Taxi Companies ({companies.length})
            </h3>
            <button
              onClick={() => setIsAddingCompany(true)}
              className="flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1.5 rounded-lg shadow-sm transition"
            >
              <Plus size={14} /> Add Company
            </button>
          </div>

          {/* Search company input */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text" 
              placeholder="Search companies..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[500px]">
            {filteredCompanies.map((company) => {
              const isSelected = selectedCompany?.id === company.id;
              const count = company.assignedTownIds.length;

              return (
                <div
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? "border-blue-600 bg-blue-50/70 shadow-sm ring-1 ring-blue-600"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: company.brandColor }}
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {company.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {count === 0 ? (
                          <span className="text-amber-600 font-medium">No towns ticked</span>
                        ) : (
                          <span className="text-emerald-600 font-medium">
                            {count} {count === 1 ? "town" : "towns"} ticked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {companies.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCompany(company.id, company.name);
                      }}
                      className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                      title="Delete company"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center Column: Interactive Map (6 cols) */}
        <div className="lg:col-span-6 p-4 flex flex-col bg-slate-100/60 border-r border-slate-200">
          {/* Active Company Banner */}
          {selectedCompany && (
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 mb-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: selectedCompany.brandColor }}
                >
                  {selectedCompany.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedCompany.name}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                      Base: £{selectedCompany.baseFare.toFixed(2)} + £{selectedCompany.perMileRate.toFixed(2)}/mi
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>Active in: <strong className="text-blue-600">{selectedCompany.assignedTownIds.length}</strong> UK towns</span>
                    <span>•</span>
                    <span>Vehicle: {selectedCompany.vehicleType}</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg font-medium">
                Tip: Click polygons on map to toggle coverage
              </div>
            </div>
          )}

          {/* Leaflet UK Map Component */}
          <div className="flex-1 min-h-[460px]">
            <UKTownsLeafletMap
              selectedTownIds={selectedCompany?.assignedTownIds || []}
              onToggleTown={handleToggleTown}
              activeCompanyColor={selectedCompany?.brandColor || "#197DF1"}
              focusedZoneId={focusedZoneId}
              height="100%"
            />
          </div>
        </div>

        {/* Right Column: Towns & Cities Checklist (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <MapPin size={16} className="text-blue-600" />
              UK Towns & Cities ({filteredTowns.length})
            </h3>
          </div>

          {/* Search towns */}
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search towns (e.g. Manchester, Leeds)..."
              value={townSearch}
              onChange={(e) => setTownSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1 mb-2.5 overflow-x-auto pb-1 text-[11px]">
            {["all", "england", "scotland", "wales", "northern ireland"].map((c) => (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                className={`px-2 py-0.5 rounded capitalize whitespace-nowrap transition font-medium ${
                  countryFilter === c
                    ? "bg-blue-600 text-white font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c === "all" ? "All UK" : c}
              </button>
            ))}
          </div>

          {/* Bulk actions */}
          <div className="flex items-center justify-between gap-2 mb-2 text-[11px]">
            <button
              onClick={handleSelectAllFilteredTowns}
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
            >
              + Tick all shown
            </button>
            <button
              onClick={handleClearAllTowns}
              className="text-slate-500 hover:text-red-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          {/* Towns Checklist */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[460px]">
            {filteredTowns.map((zone) => {
              const isChecked = selectedCompany?.assignedTownIds.includes(zone.id);

              return (
                <div
                  key={zone.id}
                  onClick={() => handleToggleTown(zone.id)}
                  className={`px-3 py-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                    isChecked
                      ? "border-emerald-500 bg-emerald-50/50 text-slate-900"
                      : "border-slate-100 hover:border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition ${
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isChecked && <Check size={11} strokeWidth={3} />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{zone.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {zone.region}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFocusedZoneId(zone.id);
                    }}
                    className="text-[10px] text-blue-600 hover:underline px-1 py-0.5"
                    title="Zoom on map"
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add New Taxi Company Modal */}
      {isAddingCompany && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Add New UK Taxi Company
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter company details. You will then be able to tick which UK towns/cities it serves.
            </p>

            <form onSubmit={handleCreateCompany} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Manchester Royal Cabs"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Base Fare (£)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={newBaseFare}
                    onChange={(e) => setNewBaseFare(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rate per Mile (£)
                  </label>
                  <input
                    type="number"
                    step="0.10"
                    value={newPerMile}
                    onChange={(e) => setNewPerMile(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-8 h-8 rounded border p-0 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 font-mono">{newColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Website / Booking URL
                </label>
                <input
                  type="url"
                  value={newBookingUrl}
                  onChange={(e) => setNewBookingUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCompany(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
                >
                  Create & Select Towns
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
