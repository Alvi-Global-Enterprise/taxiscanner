"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const FONT = "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

const featureCards = [
  {
    title: "Real-Time Prices",
    description:
      "Compare up-to-date taxi fares for your journey in one convenient place.",
    bgColor: "#DFEDF9",
    image: "/images/features/real-time-prices.png",
  },
  {
    title: "Local Taxi Operators",
    description: "Discover taxi companies available in your pickup area.",
    bgColor: "#CEFCDC",
    image: "/images/features/local-operators.png",
  },
  {
    title: "Quick Comparison",
    description:
      "Compare multiple taxi options without visiting different websites.",
    bgColor: "#E9E1FF",
    image: "/images/features/quick-comparison.png",
  },
  {
    title: "Save Time & Money",
    description:
      "Spend less time searching and find an option that suits your journey and budget.",
    bgColor: "#FCEED6",
    image: "/images/features/save-time.png",
  },
];

export function FeatureSection() {
  return (
    <section className="mx-auto w-full max-w-[1720px] px-4 py-14 sm:px-6 lg:px-[96px] xl:px-[113px] lg:py-16">
      <div className="grid gap-[28px] sm:grid-cols-2 lg:grid-cols-4">
        {featureCards.map((card, idx) => (
          <motion.article
            key={card.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
            whileHover={{ y: -6, scale: 1.02, boxShadow: "0 14px 30px rgba(0, 0, 0, 0.08)" }}
            className="flex items-center gap-4 cursor-default transition-shadow"
            style={{
              backgroundColor: card.bgColor,
              borderRadius: "20px",
              minHeight: "156.3px",
              padding: "24px 20px 24px 28px",
              boxSizing: "border-box",
            }}
          >
            {/* White circle icon container (100.7px in Figma) */}
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-shrink-0 items-center justify-center"
              style={{
                width: "100.7px",
                height: "100.7px",
                minWidth: "100.7px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
              }}
            >
              <Image
                src={card.image}
                alt={card.title}
                width={48}
                height={48}
                style={{
                  width: "48px",
                  height: "48px",
                  objectFit: "contain",
                }}
              />
            </motion.div>

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "19px",
                  lineHeight: "141%",
                  letterSpacing: "0.01em",
                  color: "#000000",
                  margin: 0,
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontFamily: FONT,
                  fontWeight: 400,
                  fontSize: "15px",
                  lineHeight: "141%",
                  letterSpacing: "0.01em",
                  color: "rgba(0, 0, 0, 0.7)",
                  margin: 0,
                  marginTop: "4px",
                }}
              >
                {card.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
