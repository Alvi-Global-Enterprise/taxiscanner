"use client";

import { useEffect, useRef } from "react";
import { UK_TOWN_ZONES, UKTownZone } from "@/lib/ukZonesData";
import type { Map as LeafletMap, Polygon as LeafletPolygon } from "leaflet";

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

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    if (!containerRef.current || mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!isMounted || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: [54.5, -2.6], // Centered over UK
        zoom: 6,
        minZoom: 5,
        maxZoom: 14,
        zoomControl: true,
      });

      mapRef.current = map;

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Add polygon layers for each UK Town Zone
      UK_TOWN_ZONES.forEach((zone: UKTownZone) => {
        const isSelected = selectedTownIds.includes(zone.id);

        const polygon = L.polygon(zone.boundary, {
          color: isSelected ? activeCompanyColor : "#94A3B8",
          weight: isSelected ? 3 : 1.5,
          fillColor: isSelected ? activeCompanyColor : "#CBD5E1",
          fillOpacity: isSelected ? 0.45 : 0.15,
        }).addTo(map);

        // Tooltip
        polygon.bindTooltip(
          `<div style="font-family: inherit; font-size: 13px; font-weight: 600;">
            <strong>${zone.name}</strong><br/>
            <span style="font-size: 11px; opacity: 0.85;">${zone.region} (${zone.country})</span><br/>
            <span style="font-size: 11px; color: ${isSelected ? '#059669' : '#64748B'};">
              ${isSelected ? '✓ Covered (Click to untick)' : '+ Click to add coverage'}
            </span>
          </div>`,
          {
            sticky: true,
            className: "uk-town-tooltip",
          }
        );

        polygon.on("click", () => {
          onToggleTown(zone.id);
        });

        polygon.on("mouseover", () => {
          polygon.setStyle({
            weight: 3.5,
            fillOpacity: 0.6,
          });
        });

        polygon.on("mouseout", () => {
          const currentSelected = selectedTownIds.includes(zone.id);
          polygon.setStyle({
            weight: currentSelected ? 3 : 1.5,
            fillOpacity: currentSelected ? 0.45 : 0.15,
          });
        });

        polygonLayersRef.current.set(zone.id, polygon);
      });
    });

    const polygonLayers = polygonLayersRef.current;

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        polygonLayers.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync polygon styles when selectedTownIds changes
  useEffect(() => {
    if (!mapRef.current) return;

    UK_TOWN_ZONES.forEach((zone) => {
      const polygon = polygonLayersRef.current.get(zone.id);
      if (!polygon) return;

      const isSelected = selectedTownIds.includes(zone.id);

      polygon.setStyle({
        color: isSelected ? activeCompanyColor : "#94A3B8",
        weight: isSelected ? 3 : 1.5,
        fillColor: isSelected ? activeCompanyColor : "#CBD5E1",
        fillOpacity: isSelected ? 0.45 : 0.15,
      });

      polygon.setTooltipContent(
        `<div style="font-family: inherit; font-size: 13px; font-weight: 600;">
          <strong>${zone.name}</strong><br/>
          <span style="font-size: 11px; opacity: 0.85;">${zone.region} (${zone.country})</span><br/>
          <span style="font-size: 11px; color: ${isSelected ? '#059669' : '#64748B'};">
            ${isSelected ? '✓ Covered (Click to untick)' : '+ Click to add coverage'}
          </span>
        </div>`
      );
    });
  }, [selectedTownIds, activeCompanyColor]);

  // Pan to focused zone if specified
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
        borderRadius: "14px",
        overflow: "hidden",
        border: "1.5px solid #E2E8F0",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Map Overlay Info Pill */}
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
