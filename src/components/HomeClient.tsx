"use client";

import { useCallback, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ComparisonPreview } from "@/components/ComparisonPreview";
import { WhyChoose } from "@/components/WhyChoose";
import { Testimonials } from "@/components/Testimonials";
import { OperatorsCTA } from "@/components/OperatorsCTA";
import {
  CompareData,
  CompareRequest,
  fetchCompareQuotes,
} from "@/lib/compareApi";

export function HomeClient() {
  const [compareData, setCompareData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollToComparison = useCallback(() => {
    requestAnimationFrame(() => {
      document
        .getElementById("comparison")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const handleCompare = useCallback(
    async (payload: CompareRequest) => {
      setLoading(true);
      setError(null);
      scrollToComparison();

      try {
        // Req 2: quotes + postcode coverage come from Laravel backend
        const res = await fetchCompareQuotes(payload);
        if (!res.data) {
          throw new Error(res.message || "No quotes returned");
        }

        const finalData: CompareData = {
          ...res.data,
          quotes: (res.data.quotes || []).filter((q) => q.is_available !== false),
          totalConfiguredOperators: res.data.quotes?.length ?? 0,
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

  return (
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
        />
      )}
      <WhyChoose />
      <Testimonials />
      <OperatorsCTA />
    </main>
  );
}
