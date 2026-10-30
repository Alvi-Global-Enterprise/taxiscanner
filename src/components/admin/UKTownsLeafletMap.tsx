"use client";

import { useEffect, useRef } from "react";
import { UK_TOWN_ZONES, UKTownZone } from "@/lib/ukZonesData";
import type { Map as LeafletMap, Polygon as LeafletPolygon } from "leaflet";
import "leaflet/dist/leaflet.css";

type UKTownsLeafletMapProps = {
  selectedTownIds: string[];
  onToggleTown: (townId: string) => void;
  activeCompanyColor?: string;
  focusedZoneId?: string | null;
  height?: string;
};

export function UKTownsLeafletMap({
  selectedTownIds,
  onToggleTown,
  activeCompanyColor = "#197DF1",
  focusedZoneId,
  height = "520px",
}: UKTownsLeafletMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const polygonLayersRef = useRef<Map<string, LeafletPolygon>>(new Map());
  const onToggleRef = useRef(onToggleTown);
  const selectedRef = useRef(selectedTownIds);
  const colorRef = useRef(activeCompanyColor);

  useEffect(() => {
    onToggleRef.current = onToggleTown;
  }, [onToggleTown]);

  useEffect(() => {
    selectedRef.current = selectedTownIds;
  }, [selectedTownIds]);

  useEffect(() => {
    colorRef.current = activeCompanyColor;
  }, [activeCompanyColor]);

  // Initialize map once
  useEffect(() => {
    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    if (!containerRef.current || mapRef.current) return;

    import("leaflet").then((leafletModule) => {
      const L = leafletModule.default ?? leafletModule;
      if (!isMounted || !containerRef.current || mapRef.current) return;

      // Leaflet needs a real pixel size — force layout before init
      containerRef.current.style.height = height;
      containerRef.current.style.minHeight = "420px";

      const map = L.map(containerRef.current, {
        center: [54.5, -2.6],
        zoom: 6,
        minZoom: 5,
        maxZoom: 14,
        zoomControl: true,
        attributionControl: true,
      });

      mapRef.current = map;

      // Free OpenStreetMap tiles (no API key)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        crossOrigin: true,
      }).addTo(map);

      const layerOrder = (z: UKTownZone) =>
        ({ all_uk: 0, nation: 1, region: 2, city: 3 } as Record<string, number>)[
          z.layer || "city"
        ] ?? 3;

      const styleFor = (zone: UKTownZone, isSelected: boolean, color: string) => {
        const layer = zone.layer || "city";
        if (layer === "all_uk") {
          return {
            color: isSelected ? color : "#0F172A",
            weight: isSelected ? 3 : 2,
            fillColor: isSelected ? color : "#64748B",
            fillOpacity: isSelected ? 0.28 : 0.08,
          };
        }
        if (layer === "nation") {
          return {
            color: isSelected ? color : "#475569",
            weight: isSelected ? 2.5 : 1.5,
            fillColor: isSelected ? color : "#94A3B8",
            fillOpacity: isSelected ? 0.35 : 0.1,
          };
        }
        if (layer === "region") {
          return {
            color: isSelected ? color : "#64748B",
            weight: isSelected ? 2 : 1,
            fillColor: isSelected ? color : "#CBD5E1",
            fillOpacity: isSelected ? 0.4 : 0.12,
          };
        }
        return {
          color: isSelected ? color : "#94A3B8",
          weight: isSelected ? 2.5 : 1,
          fillColor: isSelected ? color : "#E2E8F0",
          fillOpacity: isSelected ? 0.5 : 0.08,
        };
      };

      [...UK_TOWN_ZONES]
        .sort((a, b) => layerOrder(a) - layerOrder(b))
        .forEach((zone: UKTownZone) => {
        const isSelected = selectedRef.current.includes(zone.id);
        const color = colorRef.current;
        const style = styleFor(zone, isSelected, color);

        const polygon = L.polygon(zone.boundary, style).addTo(map);

        polygon.bindTooltip(
          `<div style="font-family: inherit; font-size: 13px; font-weight: 600;">
            <strong>${zone.name}</strong><br/>
            <span style="font-size: 11px; opacity: 0.85;">${zone.region} (${zone.country})</span><br/>
            <span style="font-size: 11px; color: ${isSelected ? "#059669" : "#64748B"};">
              ${isSelected ? "✓ Covered (Click to untick)" : "+ Click to add coverage"}
            </span>
          </div>`,
          { sticky: true, className: "uk-town-tooltip" }
        );

        polygon.on("click", () => {
          onToggleRef.current(zone.id);
        });

        polygon.on("mouseover", () => {
          polygon.setStyle({ weight: 3.5, fillOpacity: 0.6 });
        });

        polygon.on("mouseout", () => {
          const currentSelected = selectedRef.current.includes(zone.id);
          polygon.setStyle(styleFor(zone, currentSelected, colorRef.current));
        });

        polygonLayersRef.current.set(zone.id, polygon);
      });

      // Fix grey/blank map when container size settles after layout
      const invalidate = () => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      };
      requestAnimationFrame(() => {
        invalidate();
        setTimeout(invalidate, 100);
        setTimeout(invalidate, 400);
      });

      if (containerRef.current && typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => invalidate());
        resizeObserver.observe(containerRef.current);
      }
    });

    const polygonLayers = polygonLayersRef.current;

    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        polygonLayers.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync polygon styles when selection / brand color changes
  useEffect(() => {
    if (!mapRef.current) return;

    const styleFor = (zone: UKTownZone, isSelected: boolean, color: string) => {
      const layer = zone.layer || "city";
      if (layer === "all_uk") {
        return {
          color: isSelected ? color : "#0F172A",
          weight: isSelected ? 3 : 2,
          fillColor: isSelected ? color : "#64748B",
          fillOpacity: isSelected ? 0.28 : 0.08,
        };
      }
      if (layer === "nation") {
        return {
          color: isSelected ? color : "#475569",
          weight: isSelected ? 2.5 : 1.5,
          fillColor: isSelected ? color : "#94A3B8",
          fillOpacity: isSelected ? 0.35 : 0.1,
        };
      }
      if (layer === "region") {
        return {
          color: isSelected ? color : "#64748B",
          weight: isSelected ? 2 : 1,
          fillColor: isSelected ? color : "#CBD5E1",
          fillOpacity: isSelected ? 0.4 : 0.12,
        };
      }
      return {
        color: isSelected ? color : "#94A3B8",
        weight: isSelected ? 2.5 : 1,
        fillColor: isSelected ? color : "#E2E8F0",
        fillOpacity: isSelected ? 0.5 : 0.08,
      };
    };

    UK_TOWN_ZONES.forEach((zone) => {
      const polygon = polygonLayersRef.current.get(zone.id);
      if (!polygon) return;

      const isSelected = selectedTownIds.includes(zone.id);
      polygon.setStyle(styleFor(zone, isSelected, activeCompanyColor));

      polygon.setTooltipContent(
        `<div style="font-family: inherit; font-size: 13px; font-weight: 600;">
          <strong>${zone.name}</strong><br/>
          <span style="font-size: 11px; opacity: 0.85;">${zone.region} (${zone.country}) · ${zone.layer || "city"}</span><br/>
          <span style="font-size: 11px; color: ${isSelected ? "#059669" : "#64748B"};">
            ${isSelected ? "✓ Covered (Click to untick)" : "+ Click to add coverage"}
          </span>
        </div>`
      );
    });
  }, [selectedTownIds, activeCompanyColor]);

  // Pan to focused zone
  useEffect(() => {
    if (!mapRef.current || !focusedZoneId) return;
    const target = UK_TOWN_ZONES.find((z) => z.id === focusedZoneId);
    if (target) {
      mapRef.current.flyTo(target.center, 9, { duration: 1.2 });
    }
  }, [focusedZoneId]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        minHeight: "420px",
        borderRadius: "14px",
        overflow: "hidden",
        border: "1.5px solid #E2E8F0",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        background: "#e8eef5",
      }}
    >
      <div
        ref={containerRef}
        className="uk-towns-leaflet-map"
        style={{ width: "100%", height: "100%", minHeight: "420px", zIndex: 0 }}
      />

      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 1000,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          padding: "8px 14px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          border: "1px solid #E2E8F0",
          fontSize: "12px",
          fontWeight: 600,
          color: "#0F172A",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: activeCompanyColor,
            display: "inline-block",
          }}
        />
        <span>Click town boundary on map to tick / untick</span>
      </div>
    </div>
  );
}
