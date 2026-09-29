"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { CalendarDays, Check, Clock3, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { trustItems } from "@/lib/data";
import { Navbar } from "@/components/Navbar";

const FONT = "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

export function HeroSection() {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  /* shared input box style */
  const inputBox: React.CSSProperties = {
    width: "100%",
    height: "51px",
    border: "1px solid #197DF1",
    borderRadius: "7px",
    padding: "0 14px 0 38px",
    fontFamily: FONT,
    fontWeight: 400,
    // fontSize: "17px",
    lineHeight: "141%",
    letterSpacing: "0.01em",
    color: "rgba(0,0,0,0.85)",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    lineHeight: "141%",
    letterSpacing: "0.01em",
    color: "#000000",
    display: "block",
    marginBottom: "6px",
  };

  return (
    <section
      id="home"
      style={{ position: "relative", overflow: "hidden", minHeight: "900px" }}
    >
      {/* Full-bleed background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/images/hero-graphic.png"
          alt=""
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "right center" }}
          sizes="100vw"
        />
      </div>

      {/* Blurry gradient backdrop behind content container */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(90deg, rgba(235, 248, 255, 0.94) 0%, rgba(238, 249, 255, 0.88) 32%, rgba(240, 249, 255, 0.6) 50%, rgba(255, 255, 255, 0) 72%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          maskImage:
            "linear-gradient(to right, black 0%, black 40%, rgba(0,0,0,0.6) 55%, transparent 72%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 40%, rgba(0,0,0,0.6) 55%, transparent 72%)",
          pointerEvents: "none",
        }}
      />

      {/* Navbar overlaying hero graphic */}
      <Navbar />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          margin: "0 auto",
        }}
        className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-[96px] xl:px-[113px]"
      >
        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: "23px",
            lineHeight: "25px",
            letterSpacing: "0.32em",
            color: "#45B6ED",
            marginTop: "190px",
            marginBottom: "0",
          }}
        >
          A SMARTER WAY TO BOOK TAXIS
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
          className="text-[46px] lg:text-[72px] xxl:text-[99px]"
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            lineHeight: "109%",
            letterSpacing: "0.01em",
            color: "#000000",
            maxWidth: "614px",
            marginTop: "16px",
            marginBottom: "0",
          }}
        >
          Compare Taxi Prices <span style={{ color: "#197DF1" }}> Across the UK</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: "25px",
            lineHeight: "141%",
            letterSpacing: "0.01em",
            color: "#000000",
            maxWidth: "815px",
            marginTop: "58px",
            marginBottom: "0",
          }}
        >
          Enter your journey once and compare taxi fares from local operators in
          seconds. Save time, compare your options and choose the ride that
          works for you.
        </motion.p>

        {/* Search Box */}
        <motion.div
          id="search"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.48, ease: "easeOut" }}
          style={{ marginTop: "46px", maxWidth: "1008px" }}
        >
          <form onSubmit={onSubmit}>
            <div
              style={{
                background: "#FFFFFF",
                boxShadow: "-3px 2px 28.5px #C5ECFF",
                borderRadius: "18px",
                overflow: "hidden",
              }}
            >
              {/* Fields Row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 0.65fr 0.65fr auto",
                  gap: "20px",
                  padding: "28px 34px 24px",
                  alignItems: "end",
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.65fr_0.65fr_auto]"
              >
                {/* Pickup Location */}
                <label style={{ display: "block" }}>
                  <span className="text-[12px] lg:text-[14px] xxl:text-[18px]" style={labelStyle}>PICKUP LOCATION</span>
                  <div style={{ position: "relative" }}>
                    <MapPin
                      size={16}
                      color="#197DF1"
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter Pickup Location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      style={inputBox}
                      className="text-[10px] lg:text-[12px] xxl:text-[18px]"
                    />
                  </div>
                </label>

                {/* Drop-off Location */}
                <label style={{ display: "block" }}>
                  <span className="text-[12px] lg:text-[14px] xxl:text-[18px]" style={labelStyle}>DROP-OFF LOCATION</span>
                  <div style={{ position: "relative" }}>
                    <MapPin
                      size={16}
                      color="#08C5A1"
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",

                      }}
                    />
                    <input
                      type="text"
                      placeholder="Enter Drop-Off Location"
                      value={dropoff}
                      onChange={(e) => setDropoff(e.target.value)}
                      style={inputBox}
                      className="text-[10px] lg:text-[12px] xxl:text-[18px]"
                    />
                  </div>
                </label>

                {/* Date */}
                <label style={{ display: "block" }}>
                  <span className="text-[12px] lg:text-[14px] xxl:text-[18px]" style={labelStyle}>Date:</span>
                  <div style={{ position: "relative" }}>
                    <CalendarDays
                      size={16}
                      color="#197DF1"
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      style={inputBox}
                      className="text-[10px] lg:text-[12px] xxl:text-[18px]"
                    />
                  </div>
                </label>

                {/* Time */}
                <label style={{ display: "block" }}>
                  <span className="text-[12px] lg:text-[14px] xxl:text-[18px]" style={labelStyle}>Time:</span>
                  <div style={{ position: "relative" }}>
                    <Clock3
                      size={16}
                      color="#197DF1"
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        pointerEvents: "none",
                      }}
                    />
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      style={inputBox}
                      className="text-[10px] lg:text-[12px] xxl:text-[18px]"
                    />
                  </div>
                </label>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(25, 125, 241, 0.4)" }}
                  whileTap={{ scale: 0.96 }}
                  className="text-[12px] lg:text-[14px] xxl:text-[18px]"
                  style={{
                    width: "135px",
                    height: "51px",
                    background: "#197DF1",
                    borderRadius: "7px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: FONT,
                    fontWeight: 700,
                    // fontSize: "18px",
                    lineHeight: "20px",
                    color: "#FFFFFF",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  Compare Prices
                </motion.button>
              </div>

              {/* Trust Badges Row */}
              <div
                style={{
                  background: "#D1EFFD",
                  borderRadius: "0 0 17px 17px",
                  padding: "18px 34px",
                  display: "flex",
                  alignItems: "center",
                  gap: "48px",
                }}
                className="flex flex-wrap items-center gap-6 sm:gap-10"
              >
                {trustItems.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    style={{ display: "flex", alignItems: "center", gap: "10px" }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        background: "#08C5A1",
                        flexShrink: 0,
                      }}
                    >
                      <Check size={12} color="#fff" strokeWidth={3} />
                    </span>
                    <span
                      className="text-[12px] lg:text-[14px] xxl:text-[18px]"
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        // fontSize: "21px",
                        lineHeight: "141%",
                        letterSpacing: "0.01em",
                        color: "rgba(0,0,0,0.55)",
                      }}
                    >
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      <div style={{ height: "60px" }} />
    </section>
  );
}
