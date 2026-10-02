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
    async ({ pickup, dropoff }: CompareRequest) => {
      setLoading(true);
      setError(null);
      scrollToComparison();

      try {
        const result = await fetchCompareQuotes({ pickup, dropoff });
        setCompareData(result.data ?? null);
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
    <>
      <main>
        <HeroSection
          onCompare={handleCompare}
          comparing={loading}
          compareError={error}
        />
        <FeatureSection />
        <HowItWorks />
        <ComparisonPreview
          data={compareData}
          loading={loading}
          error={error}
        />
        <WhyChoose />
        <Testimonials />
        <OperatorsCTA />
      </main>
    </>
  );
}
