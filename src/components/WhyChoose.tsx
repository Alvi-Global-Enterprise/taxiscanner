"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const FONT = "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

const whyFeatures = [
  {
    title: "ONE SEARCH, MULTIPLE OPTIONS",
    description:
      "Enter your journey once and see available taxi options without searching multiple websites.",
    icon: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#197DF1"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "SMARTER COMPARISON",
    description:
      "Compare fares side by side and choose the option that best suits your journey.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#197DF1">
        <ellipse cx="12" cy="6.5" rx="8" ry="2.8" />
        <path d="M4 6.5v3.2c0 1.55 3.58 2.8 8 2.8s8-1.25 8-2.8V6.5c-1.3 1.2-4.4 2-8 2s-6.7-.8-8-2z" />
        <path d="M4 11.5v3.2c0 1.55 3.58 2.8 8 2.8s8-1.25 8-2.8v-3.2c-1.3 1.2-4.4 2-8 2s-6.7-.8-8-2z" />
      </svg>
    ),
  },
  {
    title: "LOCAL COVERAGE",
    description:
      "See taxi operators available for your pickup location and service area.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#197DF1">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    title: "SIMPLE BOOKING JOURNEY",
    description:
      "Once you've chosen an option, continue directly to the taxi operator to complete your booking.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#197DF1">
        <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.22 8.78 7 9.28 7 9.8v9.2c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-.02l-.17-.12z" />
      </svg>
    ),
  },
];

export function WhyChoose() {
  return (
    <section
      id="about"
      style={{
        position: "relative",
        backgroundColor: "#E5F1FD",
        overflow: "hidden",
      }}
      className="py-16 sm:py-20 lg:py-24"
    >
      {/* Background photo of woman next to London cab & Big Ben */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        <Image
          src="/images/Mask group.png"
          alt="London Taxi Booking"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "right center",
          }}
        />

        {/* Smooth horizontal gradient overlay to blend seamlessly into background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, #E5F1FD 0%, #E5F1FD 45%, rgba(229, 241, 253, 0.85) 58%, rgba(229, 241, 253, 0.2) 75%, transparent 90%)",
          }}
        />
      </div>

      {/* Foreground Content */}
      <div
        className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-[96px] xl:px-[113px]"
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >
        <div className="w-full lg:max-w-[58%] xl:max-w-[53%]">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2
              className="text-nowrap"
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: "clamp(34px, 4vw, 56px)",
                lineHeight: "110%",
                letterSpacing: "0.01em",
                color: "#000000",
                margin: 0,
              }}
            >
              WHY CHOOSE <span style={{ color: "#197DF1" }}>TAXISCANNER</span>
            </h2>
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: "clamp(14px, 1.35vw, 21px)",
                lineHeight: "141%",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#000000",
                marginTop: "16px",
                marginBottom: "46px",
              }}
            >
              A SIMPLER WAY TO COMPARE TAXI FARES ACROSS THE UK.
            </p>
          </motion.div>

          {/* 2x2 Feature Grid - Strictly 2 columns on desktop matching Figma */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 lg:gap-x-10 lg:gap-y-9">
            {whyFeatures.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "18px",
                }}
              >
                {/* Floating white circular badge for icon */}
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 350 }}
                  style={{
                    width: "60px",
                    height: "60px",
                    minWidth: "60px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 6px 18px rgba(25, 125, 241, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "default",
                  }}
                >
                  {item.icon}
                </motion.div>

                {/* Text Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: "17px",
                      lineHeight: "135%",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      color: "#000000",
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "150%",
                      color: "rgba(0, 0, 0, 0.68)",
                      marginTop: "7px",
                      marginRight: 0,
                      marginBottom: 0,
                      marginLeft: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
