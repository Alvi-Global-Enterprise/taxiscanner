import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { HowItWorks } from "@/components/HowItWorks";
import { ComparisonPreview } from "@/components/ComparisonPreview";
import { WhyChoose } from "@/components/WhyChoose";
import { Testimonials } from "@/components/Testimonials";
import { OperatorsCTA } from "@/components/OperatorsCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        <FeatureSection />
        <HowItWorks />
        <ComparisonPreview />
        <WhyChoose />
        <Testimonials />
        <OperatorsCTA />
      </main>
      <Footer />
    </>
  );
}
