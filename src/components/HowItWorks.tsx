"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const FONT = "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

const steps = [
  {
    step: "01",
    title: "Enter Your Journey",
    description: "Tell us where you're travelling from and where you want to go.",
    icon: "/images/how-it-works/step-01-form.png",
  },
  {
    step: "02",
    title: "Compare Taxi Fares",
    description: "View available prices from taxi operators serving your area.",
    icon: "/images/how-it-works/step-02-search.png",
  },
  {
    step: "03",
    title: "Choose & Book",
    description: "Select the option you prefer and continue to the taxi company's website.",
    icon: "/images/how-it-works/step-03-car.png",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{ background: "#E5F1FD", padding: "72px 0 84px" }}
    >
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-[96px] xl:px-[113px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "52px" }}
        >
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: "clamp(36px, 4.2vw, 60px)",
              lineHeight: "109%",
              letterSpacing: "0.01em",
              color: "#000000",
              margin: 0,
            }}
          >
            HOW IT <span style={{ color: "#197DF1" }}>WORKS</span>
          </h2>
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "clamp(15px, 1.4vw, 23px)",
              lineHeight: "141%",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#000000",
              marginTop: "16px",
              marginBottom: 0,
            }}
          >
            Find your taxi in three simple steps.
          </p>
        </motion.div>

        {/* Cards + Arrows */}
        <div
          style={{
            display: "grid",
            alignItems: "center",
            gap: "0",
          }}
          className="how-grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 lg:gap-0"
        >
          {steps.map((item, idx) => (
            <React.Fragment key={item.step}>
              {/* Card */}
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.18, ease: "easeOut" }}
                whileHover={{ y: -6, boxShadow: "0 18px 36px rgba(25, 125, 241, 0.12)" }}
                style={{
                  background: "#FFFFFF",
                  borderRadius: "20px",
                  minHeight: "188.81px",
                  display: "flex",
                  alignItems: "center",
                  padding: "24px 28px 24px 24px",
                  gap: "24px",
                  boxSizing: "border-box",
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
                  cursor: "default",
                }}
                className="transition-shadow"
              >
                {/* Icon area: large light blue circle + small blue circle with step number */}
                <div style={{ position: "relative", flexShrink: 0, width: "60px", height: "60px" }}>
                  {/* Large light blue circle */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      width: "65.14px",
                      height: "65.14px",
                      borderRadius: "50%",
                      background: "#C5ECFF",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* Icon image centered in the big circle */}
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={32}
                      height={32}
                      style={{ objectFit: "contain", marginTop: "" }}
                    />
                  </motion.div>
                  {/* Small #197DF1 circle with step number */}
                  <div
                    style={{
                      width: "31.5px",
                      height: "31.5px",
                      borderRadius: "50%",
                      background: "#197DF1",
                      position: "absolute",
                      top: "-15px",
                      left: "-8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(25, 125, 241, 0.3)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: "16px",
                        letterSpacing: "-0.05em",
                        color: "#FFFFFF",
                        lineHeight: 1,
                      }}
                    >
                      {item.step}
                    </span>
                  </div>
                </div>

                {/* Text */}
                <div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontWeight: 700,
                      lineHeight: "141%",
                      letterSpacing: "0.01em",
                      textTransform: "uppercase",
                      color: "#000000",
                      margin: 0,
                      marginBottom: "10px",
                    }}
                    className="text-[14px] lg:text-[16px] xxl:text-[20px]"
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontWeight: 400,
                      lineHeight: "145%",
                      letterSpacing: "0.01em",
                      color: "rgba(0, 0, 0, 0.65)",
                      margin: 0,
                    }}
                    className="text-[12px] lg:text-[10px] xxl:text-[18px]"
                  >
                    {item.description}
                  </p>
                </div>
              </motion.article>

              {/* Arrow connector between cards */}
              {idx < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.18 + 0.1 }}
                  className="how-arrow"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 12px",
                  }}
                >
                  <Image
                    src="/images/how-it-works-arrow.png"
                    alt="next step"
                    width={130}
                    height={20}
                    style={{ objectFit: "contain" }}
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile styling */}
        <style>{`
          @media (max-width: 1023px) {
            .how-grid {
              display: flex !important;
              flex-direction: column;
              gap: 20px;
            }
            .how-arrow {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
