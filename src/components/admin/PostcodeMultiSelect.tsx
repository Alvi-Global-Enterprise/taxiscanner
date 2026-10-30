"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  UkPostcodeDistrict,
  formatDistrictOption,
  resolveDistrictLabel,
  searchUkPostcodeDistricts,
} from "@/lib/ukPostcodeDistricts";
import { Check, ChevronDown, Search, X } from "lucide-react";

type Props = {
  value: string[];
  onChange: (outcodes: string[]) => void;
  disabled?: boolean;
};

export function PostcodeMultiSelect({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => value.map((v) => v.toUpperCase().replace(/\s+/g, "")),
    [value]
  );

  const options = useMemo(() => searchUkPostcodeDistricts(query, 50), [query]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggle = (outcode: string) => {
    const key = outcode.toUpperCase();
    if (selected.includes(key)) {
      onChange(selected.filter((x) => x !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  const remove = (outcode: string) => {
    onChange(selected.filter((x) => x !== outcode));
  };

  return (
    <div ref={rootRef} className="relative">
      <label className="mb-2 block text-sm font-bold text-slate-900">
        Assign UK postcodes (districts)
      </label>

      {/* Selected chips */}
      <div className="mb-2 flex min-h-[44px] flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2">
        {selected.length === 0 ? (
          <span className="px-1 py-1 text-xs text-slate-400">
            No postcodes selected yet
          </span>
        ) : (
          selected.map((code) => (
            <span
              key={code}
              className="inline-flex max-w-full items-center gap-1 rounded-lg bg-blue-600 px-2 py-1 text-xs font-semibold text-white"
              title={resolveDistrictLabel(code)}
            >
              <span className="truncate">{code}</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => remove(code)}
                className="rounded hover:bg-blue-500"
                aria-label={`Remove ${code}`}
              >
                <X size={12} />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Searchable dropdown trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setOpen((v) => !v);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
      >
        <span className="text-slate-600">
          Search & select postcodes (e.g. M1, Piccadilly, London…)
        </span>
        <ChevronDown size={16} className="text-slate-400" />
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type postcode or place name…"
              className="w-full border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <ul className="max-h-72 overflow-y-auto py-1">
            {options.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-slate-500">
                No matches. Try M1, SW1A, Manchester, Leeds…
              </li>
            ) : (
              options.map((opt: UkPostcodeDistrict) => {
                const active = selected.includes(opt.outcode);
                return (
                  <li key={opt.outcode}>
                    <button
                      type="button"
                      onClick={() => toggle(opt.outcode)}
                      className={`flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition ${
                        active ? "bg-blue-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                          active
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {active ? <Check size={12} /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="font-bold text-slate-900">{opt.outcode}</span>
                        <span className="text-slate-500">: </span>
                        <span className="text-slate-600">{opt.places}</span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <div className="border-t border-slate-100 px-3 py-2 text-[11px] text-slate-500">
            Showing UK outward codes (districts). Format:{" "}
            <span className="font-semibold text-slate-700">
              {formatDistrictOption({
                outcode: "M1",
                places: "Piccadilly, Northern Quarter…",
              })}
            </span>
            . Selected: {selected.length}
          </div>
        </div>
      ) : null}
    </div>
  );
}
