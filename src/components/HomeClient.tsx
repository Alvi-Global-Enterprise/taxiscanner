"use client";

import { useCallback, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ComparisonPreview } from "@/components/ComparisonPreview";
import { WhyChoose } from "@/components/WhyChoose";
import { Testimonials } from "@/components/Testimonials";
import { OperatorsCTA } from "@/components/OperatorsCTA";
import { AdminOperatorZoneManager } from "@/components/admin/AdminOperatorZoneManager";
import {
  CompareData,
  CompareQuote,
  CompareRequest,
  fetchCompareQuotes,
} from "@/lib/compareApi";
import { resolvePickupZone } from "@/lib/geoMatching";
import {
  loadTaxiCompanies,
  getCompaniesForTown,
  TaxiCompany,
} from "@/lib/operatorZonesStore";
import { Map, X } from "lucide-react";

export function HomeClient() {
  const [compareData, setCompareData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lastPayload, setLastPayload] = useState<CompareRequest | null>(null);

  const scrollToComparison = useCallback(() => {
    requestAnimationFrame(() => {
      document
        .getElementById("comparison")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleCompare = useCallback(
    async (payload: CompareRequest) => {
      setLastPayload(payload);
      setLoading(true);
      setError(null);
      scrollToComparison();

      // 1. Resolve which UK town boundary contains this pickup location
      const zoneResult = resolvePickupZone({
        lat: payload.pickup_lat,
        lon: payload.pickup_lon,
        locationName: payload.pickup_name,
        query: payload.pickup,
      });

      // 2. Load all current taxi companies saved by admin
      const allCompanies = loadTaxiCompanies();

      // 3. Filter: strictly only companies ticked for this matched town boundary
      const tickedCompanies: TaxiCompany[] = zoneResult.zone
        ? getCompaniesForTown(allCompanies, zoneResult.zone.id)
        : [];

      try {
        let upstreamResult: CompareData | null = null;
        try {
          const res = await fetchCompareQuotes(payload);
          if (res.data) {
            upstreamResult = res.data;
          }
        } catch (e) {
          console.warn("Upstream compare fallback triggered:", e);
        }

        // Calculate distance & duration
        const distanceMiles =
          upstreamResult?.route?.distance_miles ??
          (payload.pickup_lat && payload.dropoff_lat
            ? Math.max(
                3.5,
                Math.round(
                  Math.hypot(
                    (payload.dropoff_lat - payload.pickup_lat) * 69,
                    (payload.dropoff_lon! - payload.pickup_lon!) * 53
                  ) * 1.3
                )
              )
            : 7.8);

        const durationMinutes =
          upstreamResult?.route?.duration_minutes ??
          Math.max(8, Math.round(distanceMiles * 2.4));

        // 4. Generate quotes STRICTLY for the ticked companies
        const quotes: CompareQuote[] = tickedCompanies.map((company) => {
          const basePrice = company.baseFare + distanceMiles * company.perMileRate;
          const minPrice = Math.round(basePrice * 100) / 100;
          const maxPrice = Math.round(basePrice * 1.15 * 100) / 100;

          return {
            provider: company.id,
            display_name: company.name,
            min_price: minPrice,
            max_price: maxPrice,
            is_fixed_price: false,
            currency: "GBP",
            estimated_pickup_minutes: company.minEtaMinutes,
            estimated_duration_minutes: durationMinutes,
            distance_miles: distanceMiles,
            quote_type: "estimate",
            is_available: true,
            booking_url: company.bookingUrl || null,
            error_message: null,
          };
        });

        const finalData: CompareData = {
          pickup: upstreamResult?.pickup ?? {
            query: payload.pickup,
            formatted_address: payload.pickup,
            coordinates: {
              latitude: payload.pickup_lat || 53.48,
              longitude: payload.pickup_lon || -2.24,
            },
            city: zoneResult.zone?.name || null,
            postcode: null,
            country: "United Kingdom",
          },
          dropoff: upstreamResult?.dropoff ?? {
            query: payload.dropoff,
            formatted_address: payload.dropoff,
            coordinates: {
              latitude: payload.dropoff_lat || 53.36,
              longitude: payload.dropoff_lon || -2.27,
            },
            city: null,
            postcode: null,
            country: "United Kingdom",
          },
          route: upstreamResult?.route ?? {
            distance_miles: distanceMiles,
            duration_minutes: durationMinutes,
            distance_meters: Math.round(distanceMiles * 1609.34),
            duration_seconds: durationMinutes * 60,
            summary: `${distanceMiles.toFixed(1)} miles via main routes`,
            is_estimated: true,
          },
          quotes,
          matchedZone: zoneResult.zone
            ? {
                id: zoneResult.zone.id,
                name: zoneResult.zone.name,
                displayName: zoneResult.zone.displayName,
                region: zoneResult.zone.region,
                matchType: zoneResult.matchType,
              }
            : null,
          totalConfiguredOperators: allCompanies.length,
        };

        setCompareData(finalData);
        scrollToComparison();
      } catch (err) {
        setCompareData(null);
        setError(
          err instanceof Error ? err.message : "Unable to compare prices right now."
        );
        scrollToComparison();
      } finally {
        setLoading(false);
      }
    },
    [scrollToComparison]
  );

  // If admin updates town assignments and closes modal, refresh comparison if active
  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (lastPayload) {
      handleCompare(lastPayload);
    }
  };

  return (
    <>
      <main>
        <HeroSection
          onCompare={handleCompare}
          comparing={loading}
          compareError={error}
        />
        <FeatureSection />
        <HowItWorks />
        {(loading || compareData || error) && (
          <ComparisonPreview
            data={compareData}
            loading={loading}
            error={error}
            onOpenAdminMap={() => setIsAdminOpen(true)}
          />
        )}
        <WhyChoose />
        <Testimonials />
        <OperatorsCTA />
      </main>

      {/* Floating Action Button to quickly open Admin Operator Zones Map */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-2.5 bg-slate-900 hover:bg-blue-600 text-white px-5 py-3.5 rounded-full shadow-2xl border border-slate-700/50 hover:border-blue-500 transition-all duration-200 transform hover:scale-105 group"
          title="Open UK Towns & Operators Map Admin"
        >
          <div className="w-6 h-6 rounded-full bg-blue-500 group-hover:bg-white text-white group-hover:text-blue-600 flex items-center justify-center transition">
            <Map size={14} />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold leading-tight">Admin Portal</div>
            <div className="text-[10px] text-slate-300 group-hover:text-blue-100">UK Towns & Operators Map</div>
          </div>
        </button>
      </div>

      {/* Admin Modal Overlay */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-[1500px] my-auto">
            <button
              onClick={handleCloseAdmin}
              className="absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full bg-white text-slate-700 shadow-xl flex items-center justify-center hover:bg-slate-100 hover:text-black transition"
              aria-label="Close Admin Modal"
            >
              <X size={20} />
            </button>
            <AdminOperatorZoneManager onClose={handleCloseAdmin} />
          </div>
        </div>
      )}
    </>
  );
}
