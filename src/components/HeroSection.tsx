"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Check, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { trustItems } from "@/lib/data";
import { Navbar } from "@/components/Navbar";

const FONT = "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

function CalendarFilledIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="3.5" width="16" height="14" rx="3" fill="#197DF1" />
      <rect x="5.5" y="1.5" width="1.8" height="3" rx="0.9" fill="#197DF1" stroke="#FFFFFF" strokeWidth="0.8" />
      <rect x="12.7" y="1.5" width="1.8" height="3" rx="0.9" fill="#197DF1" stroke="#FFFFFF" strokeWidth="0.8" />
      <circle cx="6.5" cy="9" r="1.1" fill="#FFFFFF" />
      <circle cx="10" cy="9" r="1.1" fill="#FFFFFF" />
      <circle cx="13.5" cy="9" r="1.1" fill="#FFFFFF" />
      <circle cx="6.5" cy="13" r="1.1" fill="#FFFFFF" />
      <circle cx="10" cy="13" r="1.1" fill="#FFFFFF" />
      <circle cx="13.5" cy="13" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}

function ClockFilledIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r="8.5" fill="#197DF1" />
      <path
        d="M10 5.8V10.2L12.8 12.2"
        stroke="#FFFFFF"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookingCheckbox({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        margin: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: "9px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "21px",
          height: "21px",
          borderRadius: "5px",
          background: checked ? "#197DF1" : "#FFFFFF",
          border: checked ? "1.5px solid #197DF1" : "1.5px solid #CAD8E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.15s ease",
          boxShadow: checked ? "0 2px 6px rgba(25, 125, 241, 0.25)" : "none",
        }}
      >
        {checked && <Check size={14} color="#FFFFFF" strokeWidth={3.2} />}
      </div>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: "15px",
          lineHeight: "141%",
          color: "rgba(0,0,0,0.85)",
          whiteSpace: "nowrap",
        }}
        className="text-[13px] lg:text-[14px] xxl:text-[16px]"
      >
        {label}
      </span>
    </button>
  );
}

type HeroSectionProps = {
  onCompare?: (payload: { pickup: string; dropoff: string }) => Promise<void> | void;
  comparing?: boolean;
  compareError?: string | null;
};

export function HeroSection({
  onCompare,
  comparing = false,
  compareError = null,
}: HeroSectionProps) {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookingMode, setBookingMode] = useState<"now" | "later">("now");
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const pickupValue = pickup.trim();
    const dropoffValue = dropoff.trim();

    if (!pickupValue || !dropoffValue) {
      setLocalError("Please enter both pickup and drop-off locations.");
      return;
    }

    setLocalError(null);
    await onCompare?.({ pickup: pickupValue, dropoff: dropoffValue });
  };

  const formError = localError || compareError;

  /* shared input box style */
  const inputBox: React.CSSProperties = {
    width: "100%",
    height: "51px",
    border: "1.5px solid #BED2E8",
    borderRadius: "7px",
    padding: "0 14px 0 40px",
    fontFamily: FONT,
    fontWeight: 400,
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
          style={{ marginTop: "46px", maxWidth: "1160px" }}
        >
          <form onSubmit={onSubmit}>
            <div
              style={{
                background: "#FFFFFF",
                boxShadow: "-3px 2px 28.5px #C5ECFF",
                borderRadius: "18px",
                overflow: "hidden",
                transition: "all 0.25s ease",
              }}
            >
              {/* Fields Row for Book Now mode */}
              {bookingMode === "now" ? (
                <div
                  style={{
                    padding: "26px 30px 22px",
                    gap: "16px",
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_auto_auto] items-end"
                >
                  {/* Pickup Location */}
                  <label style={{ display: "block" }}>
                    <span className="text-[12px] lg:text-[13px] xxl:text-[17px]" style={labelStyle}>
                      PICKUP LOCATION
                    </span>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          zIndex: 1,
                        }}
                      >
                        <MapPin size={17} fill="#197DF1" color="#197DF1" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Pickup Location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        style={inputBox}
                        className="text-[11px] lg:text-[13px] xxl:text-[16px] placeholder:text-[#94A3B8]"
                        required
                        disabled={comparing}
                      />
                    </div>
                  </label>

                  {/* Drop-off Location */}
                  <label style={{ display: "block" }}>
                    <span className="text-[12px] lg:text-[13px] xxl:text-[17px]" style={labelStyle}>
                      DROP-OFF LOCATION
                    </span>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          zIndex: 1,
                        }}
                      >
                        <MapPin size={17} fill="#08C5A1" color="#08C5A1" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Drop-Off Location"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        style={inputBox}
                        className="text-[11px] lg:text-[13px] xxl:text-[16px] placeholder:text-[#94A3B8]"
                        required
                        disabled={comparing}
                      />
                    </div>
                  </label>

                  {/* Booking Mode options (Book Now / Book Later) */}
                  <div style={{ alignSelf: "end" }}>
                    <span
                      className="text-[12px] lg:text-[13px] xxl:text-[17px] hidden lg:block"
                      style={{ ...labelStyle, visibility: "hidden" }}
                    >
                      Booking Mode
                    </span>
                    <div
                      style={{
                        height: "51px",
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        padding: "0 6px",
                      }}
                    >
                      <BookingCheckbox
                        label="Book Now"
                        checked={true}
                        onClick={() => setBookingMode("now")}
                      />
                      <BookingCheckbox
                        label="Book Later"
                        checked={false}
                        onClick={() => setBookingMode("later")}
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <div style={{ alignSelf: "end" }}>
                    <span
                      className="text-[12px] lg:text-[13px] xxl:text-[17px] hidden lg:block"
                      style={{ ...labelStyle, visibility: "hidden" }}
                    >
                      Action
                    </span>
                    <motion.button
                      type="submit"
                      disabled={comparing}
                      whileHover={
                        comparing
                          ? undefined
                          : { scale: 1.04, boxShadow: "0 8px 24px rgba(25, 125, 241, 0.4)" }
                      }
                      whileTap={comparing ? undefined : { scale: 0.96 }}
                      className="text-[13px] lg:text-[14px] xxl:text-[16px] w-full lg:w-auto"
                      style={{
                        height: "51px",
                        padding: "0 24px",
                        background: "#197DF1",
                        borderRadius: "7px",
                        border: "none",
                        cursor: comparing ? "wait" : "pointer",
                        opacity: comparing ? 0.75 : 1,
                        fontFamily: FONT,
                        fontWeight: 700,
                        lineHeight: "20px",
                        color: "#FFFFFF",
                        transition: "background 0.2s",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {comparing ? "Comparing..." : "Compare Prices"}
                    </motion.button>
                  </div>
                </div>
              ) : (
                /* Fields Row for Book Later mode — Single Row, same compact height! */
                <div
                  style={{
                    padding: "26px 30px 22px",
                    gap: "14px",
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_auto_0.75fr_0.75fr_auto] items-end"
                >
                  {/* Pickup Location */}
                  <label style={{ display: "block" }}>
                    <span className="text-[12px] lg:text-[13px] xxl:text-[17px]" style={labelStyle}>
                      PICKUP LOCATION
                    </span>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          zIndex: 1,
                        }}
                      >
                        <MapPin size={17} fill="#197DF1" color="#197DF1" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Pickup Location"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        style={inputBox}
                        className="text-[11px] lg:text-[13px] xxl:text-[16px] placeholder:text-[#94A3B8]"
                        required
                        disabled={comparing}
                      />
                    </div>
                  </label>

                  {/* Drop-off Location */}
                  <label style={{ display: "block" }}>
                    <span className="text-[12px] lg:text-[13px] xxl:text-[17px]" style={labelStyle}>
                      DROP-OFF LOCATION
                    </span>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          zIndex: 1,
                        }}
                      >
                        <MapPin size={17} fill="#08C5A1" color="#08C5A1" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Drop-Off Location"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        style={inputBox}
                        className="text-[11px] lg:text-[13px] xxl:text-[16px] placeholder:text-[#94A3B8]"
                        required
                        disabled={comparing}
                      />
                    </div>
                  </label>

                  {/* Booking Mode Checkboxes */}
                  <div style={{ alignSelf: "end" }}>
                    <span
                      className="text-[12px] lg:text-[13px] xxl:text-[17px]"
                      style={{
                        ...labelStyle,
                        color: "rgba(0,0,0,0.55)",
                        fontWeight: 500,
                      }}
                    >
                      Booking Mode
                    </span>
                    <div
                      style={{
                        height: "51px",
                        display: "flex",
                        alignItems: "center",
                        gap: "18px",
                        padding: "0 4px",
                      }}
                    >
                      <BookingCheckbox
                        label="Book Now"
                        checked={false}
                        onClick={() => setBookingMode("now")}
                      />
                      <BookingCheckbox
                        label="Book Later"
                        checked={true}
                        onClick={() => setBookingMode("later")}
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <label style={{ display: "block" }}>
                    <span className="text-[12px] lg:text-[13px] xxl:text-[17px]" style={labelStyle}>
                      Date
                    </span>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          zIndex: 1,
                        }}
                      >
                        <CalendarFilledIcon size={17} />
                      </div>
                      <input
                        type="text"
                        placeholder="Select Date"
                        value={date}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = "text";
                        }}
                        onClick={(e) => {
                          if ("showPicker" in e.currentTarget) {
                            try {
                              e.currentTarget.showPicker();
                            } catch {}
                          }
                        }}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ ...inputBox, padding: "0 10px 0 36px", cursor: "pointer" }}
                        className="text-[11px] lg:text-[13px] xxl:text-[16px] placeholder:text-[#94A3B8]"
                      />
                    </div>
                  </label>

                  {/* Time */}
                  <label style={{ display: "block" }}>
                    <span className="text-[12px] lg:text-[13px] xxl:text-[17px]" style={labelStyle}>
                      Time
                    </span>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          zIndex: 1,
                        }}
                      >
                        <ClockFilledIcon size={17} />
                      </div>
                      <input
                        type="text"
                        placeholder="Select Time"
                        value={time}
                        onFocus={(e) => (e.target.type = "time")}
                        onBlur={(e) => {
                          if (!e.target.value) e.target.type = "text";
                        }}
                        onClick={(e) => {
                          if ("showPicker" in e.currentTarget) {
                            try {
                              e.currentTarget.showPicker();
                            } catch {}
                          }
                        }}
                        onChange={(e) => setTime(e.target.value)}
                        style={{ ...inputBox, padding: "0 10px 0 36px", cursor: "pointer" }}
                        className="text-[11px] lg:text-[13px] xxl:text-[16px] placeholder:text-[#94A3B8]"
                      />
                    </div>
                  </label>

                  {/* Submit button */}
                  <div style={{ alignSelf: "end" }}>
                    <span
                      className="text-[12px] lg:text-[13px] xxl:text-[17px] hidden xl:block"
                      style={{ ...labelStyle, visibility: "hidden" }}
                    >
                      Action
                    </span>
                    <motion.button
                      type="submit"
                      disabled={comparing}
                      whileHover={
                        comparing
                          ? undefined
                          : { scale: 1.04, boxShadow: "0 8px 24px rgba(25, 125, 241, 0.4)" }
                      }
                      whileTap={comparing ? undefined : { scale: 0.96 }}
                      className="text-[13px] lg:text-[14px] xxl:text-[16px] w-full xl:w-auto"
                      style={{
                        height: "51px",
                        padding: "0 22px",
                        background: "#197DF1",
                        borderRadius: "7px",
                        border: "none",
                        cursor: comparing ? "wait" : "pointer",
                        opacity: comparing ? 0.75 : 1,
                        fontFamily: FONT,
                        fontWeight: 700,
                        lineHeight: "20px",
                        color: "#FFFFFF",
                        transition: "background 0.2s",
                        flexShrink: 0,
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {comparing ? "Comparing..." : "Compare Prices"}
                    </motion.button>
                  </div>
                </div>
              )}

              {formError && (
                <p
                  style={{
                    margin: 0,
                    padding: "0 30px 14px",
                    fontFamily: FONT,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#DC2626",
                  }}
                >
                  {formError}
                </p>
              )}

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
