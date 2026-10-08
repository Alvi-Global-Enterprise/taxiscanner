"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Loader2, MapPin, X } from "lucide-react";
import { PlaceSuggestion } from "@/app/api/places/route";

const FONT =
  "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

export interface PlaceAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelectCoords?: (coords: { lat: number; lon: number; name: string } | null) => void;
  icon: React.ReactNode;
  labelStyle?: React.CSSProperties;
  inputBoxStyle?: React.CSSProperties;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export function PlaceAutocompleteInput({
  label,
  placeholder,
  value,
  onChange,
  onSelectCoords,
  icon,
  labelStyle,
  inputBoxStyle,
  className = "",
  required = false,
  disabled = false,
}: PlaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activeFetchAbortRef = useRef<AbortController | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch suggestions with debouncing
  useEffect(() => {
    const trimmed = value.trim();

    if (trimmed.length < 2 || !isOpen) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    if (activeFetchAbortRef.current) {
      activeFetchAbortRef.current.abort();
    }

    const controller = new AbortController();
    activeFetchAbortRef.current = controller;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places?q=${encodeURIComponent(trimmed)}`,
          {
            signal: controller.signal,
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch places");
        }
        const data = await res.json();
        const results: PlaceSuggestion[] = Array.isArray(data?.suggestions)
          ? data.suggestions
          : [];

        setSuggestions(results);
        setHighlightedIndex(-1);
      } catch (err: unknown) {
        if (!(err instanceof Error && err.name === "AbortError")) {
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, isOpen]);

  const handleSelect = useCallback(
    (item: PlaceSuggestion) => {
      const selectedValue = item.fullAddress || item.name;
      onChange(selectedValue);
      onSelectCoords?.({
        lat: item.lat,
        lon: item.lon,
        name: item.name,
      });
      setIsOpen(false);
      setSuggestions([]);
    },
    [onChange, onSelectCoords]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    onSelectCoords?.(null);
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <label style={{ display: "block" }}>
        <span
          className="text-[12px] lg:text-[13px] xxl:text-[17px]"
          style={labelStyle}
        >
          {label}
        </span>
        <div style={{ position: "relative" }}>
          {/* Leading Icon */}
          <div
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            {icon}
          </div>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (value.trim().length >= 2) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            style={{
              ...inputBoxStyle,
              paddingRight: value ? "36px" : "14px",
            }}
            className={`text-[11px] lg:text-[13px] xxl:text-[16px] placeholder:text-[#94A3B8] ${className}`}
            required={required}
            disabled={disabled}
            autoComplete="off"
          />

          {/* Trailing Loader or Clear button */}
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              zIndex: 2,
            }}
          >
            {loading && (
              <Loader2
                size={16}
                className="animate-spin text-[#197DF1]"
              />
            )}
            {!loading && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "2px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94A3B8",
                }}
                title="Clear"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </label>

      {/* Autocomplete Dropdown */}
      {isOpen && value.trim().length >= 2 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#FFFFFF",
            borderRadius: "12px",
            boxShadow:
              "0 12px 32px -4px rgba(15, 23, 42, 0.15), 0 4px 12px -2px rgba(15, 23, 42, 0.08)",
            border: "1.5px solid #E2E8F0",
            maxHeight: "280px",
            overflowY: "auto",
            zIndex: 100,
            padding: "6px 0",
            fontFamily: FONT,
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => {
              const isHighlighted = index === highlightedIndex;
              return (
                <div
                  key={`${item.fullAddress}-${index}`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onMouseDown={(e) => {
                    // prevent input onBlur before click registers
                    e.preventDefault();
                    handleSelect(item);
                  }}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    background: isHighlighted ? "#F0F7FF" : "transparent",
                    borderLeft: isHighlighted
                      ? "3px solid #197DF1"
                      : "3px solid transparent",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    transition: "background 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      marginTop: "3px",
                      flexShrink: 0,
                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      background: isHighlighted ? "#E0F0FE" : "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MapPin
                      size={13}
                      color={isHighlighted ? "#197DF1" : "#64748B"}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "13.5px",
                        lineHeight: "130%",
                        color: "#0F172A",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.name}
                    </div>
                    {item.subtitle && (
                      <div
                        style={{
                          fontWeight: 400,
                          fontSize: "12px",
                          lineHeight: "130%",
                          color: "#64748B",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginTop: "2px",
                        }}
                      >
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : !loading ? (
            <div
              style={{
                padding: "14px 18px",
                textAlign: "center",
                color: "#94A3B8",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              No matching places found.
            </div>
          ) : (
            <div
              style={{
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                color: "#64748B",
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              <Loader2 size={15} className="animate-spin text-[#197DF1]" />
              Searching locations...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
