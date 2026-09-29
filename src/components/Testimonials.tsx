"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FONT = "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: "sarah",
    name: "Sarah M.",
    role: "DOCTOR",
    quote:
      "Really easy to use. I could compare different taxi options without checking several websites.",
    avatar: "/images/avatar-1.png",
  },
  {
    id: "james",
    name: "James T.",
    role: "STUDENT",
    quote:
      "The comparison was clear and simple, and it helped me find a taxi for my journey quickly.",
    avatar: "/images/avatar-2.png",
  },
  {
    id: "joseph",
    name: "Joseph K.",
    role: "ENTREPRENEUR",
    quote:
      "A very useful idea. Everything I needed to compare was available in one place.",
    avatar: "/images/avatar-3.png",
  },
  {
    id: "daniel",
    name: "Daniel R.",
    role: "BUSINESS TRAVEL",
    quote:
      "Quick comparison before a late train. Found a local cab with a clear price and good ETA.",
    avatar: "/images/avatar-1.png",
  },
  {
    id: "elena",
    name: "Elena S.",
    role: "FREQUENT FLYER",
    quote:
      "Transparent pricing made airport transfers completely stress-free. Bookmarked!",
    avatar: "/images/avatar-2.png",
  },
];

function StarIcon({ size = 23 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#FFB030"
      style={{ display: "inline-block", flexShrink: 0 }}
      aria-hidden="true"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1); // James T. initially centered as in Figma
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = testimonialsData.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    if (diffX > 45) {
      prevSlide();
    } else if (diffX < -45) {
      nextSlide();
    }
    touchStartX.current = null;
  };

  // Compute indices for 3-card sliding view
  const prevIndex = (activeIndex - 1 + total) % total;
  const nextIndex = (activeIndex + 1) % total;

  return (
    <section
      id="reviews"
      aria-label="Customer Testimonials"
      style={{
        position: "relative",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        padding: "80px 0 96px",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="outline-none"
    >
      {/* Container matching Figma max-width 1720px */}
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-[96px] xl:px-[113px]">
        {/* Section Heading matching Figma specs */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: "clamp(34px, 4.2vw, 60px)",
              lineHeight: "109%",
              letterSpacing: "0.01em",
              color: "#000000",
              margin: 0,
            }}
          >
            WHAT <span style={{ color: "#197DF1" }}>CUSTOMERS SAY</span>
          </h2>
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 400,
              fontSize: "clamp(14px, 1.4vw, 23px)",
              lineHeight: "141%",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#000000",
              marginTop: "16px",
              marginBottom: 0,
            }}
          >
            A quick and simple way to compare taxi options.
          </p>
        </div>

        {/* Carousel Viewport with Left and Right Fade Animation Overlays */}
        <div
          className="relative w-full overflow-hidden py-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Edge Fade Vignette */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-16 sm:w-28 md:w-36 lg:w-48"
            style={{
              background:
                "linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0) 100%)",
            }}
          />

          {/* Right Edge Fade Vignette */}
          <div
            className="pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-16 sm:w-28 md:w-36 lg:w-48"
            style={{
              background:
                "linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0) 100%)",
            }}
          />

          {/* 3-Card Carousel Track */}
          <div className="mx-auto flex min-h-[460px] items-center justify-center gap-4 sm:gap-6 lg:gap-8">
            {/* 1. Left (Previous) Card */}
            <div
              onClick={prevSlide}
              className="hidden cursor-pointer select-none transition-all duration-500 ease-out md:block md:w-[360px] lg:w-[488px]"
              style={{
                transform: "scale(0.92)",
                opacity: 0.85,
              }}
              title="Click to view previous review"
            >
              <TestimonialCard item={testimonialsData[prevIndex]} isFeatured={false} />
            </div>

            {/* 2. Center (Active / Featured) Card */}
            <div
              className="w-full max-w-[520px] transition-all duration-500 ease-out sm:max-w-[560px] lg:w-[622px] lg:max-w-[622px]"
              style={{
                transform: "scale(1)",
                zIndex: 10,
              }}
            >
              <TestimonialCard item={testimonialsData[activeIndex]} isFeatured={true} />
            </div>

            {/* 3. Right (Next) Card */}
            <div
              onClick={nextSlide}
              className="hidden cursor-pointer select-none transition-all duration-500 ease-out md:block md:w-[360px] lg:w-[488px]"
              style={{
                transform: "scale(0.92)",
                opacity: 0.85,
              }}
              title="Click to view next review"
            >
              <TestimonialCard item={testimonialsData[nextIndex]} isFeatured={false} />
            </div>
          </div>

          {/* Navigation Arrows positioned on edges */}
          <button
            onClick={prevSlide}
            aria-label="Previous customer review"
            className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-blue-100 bg-white/95 p-3 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-[#197DF1] hover:bg-[#197DF1] hover:text-white hover:shadow-xl active:scale-95 sm:left-4 lg:left-8"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next customer review"
            className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full border border-blue-100 bg-white/95 p-3 text-slate-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-[#197DF1] hover:bg-[#197DF1] hover:text-white hover:shadow-xl active:scale-95 sm:right-4 lg:right-8"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonialsData.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-8 bg-[#197DF1]"
                  : "w-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  item: Testimonial;
  isFeatured: boolean;
}

function TestimonialCard({ item, isFeatured }: TestimonialCardProps) {
  // Center Card vs Side Card styles derived from Figma CSS
  const bgColor = isFeatured ? "#197DF1" : "#E5F1FD";
  const textColor = isFeatured ? "#FFFFFF" : "#0B4A93";
  const quoteMarkColor = isFeatured ? "#FFFFFF" : "#0B4A93";
  const dividerColor = "#45B6ED";
  const roleColor = isFeatured ? "#FFFFFF" : "#000000";
  const roleOpacity = isFeatured ? 0.5 : 0.24;

  const starSize = isFeatured ? 28 : 22;
  const avatarSize = isFeatured ? 60 : 48;

  return (
    <article
      style={{
        backgroundColor: bgColor,
        borderRadius: "27px",
        minHeight: isFeatured ? "420px" : "343px",
        padding: isFeatured ? "36px 36px 32px" : "28px 28px 24px",
        boxShadow: isFeatured
          ? "0 22px 50px -10px rgba(25, 125, 241, 0.38), 0 8px 20px -4px rgba(0, 0, 0, 0.08)"
          : "0 10px 28px -6px rgba(11, 74, 147, 0.08)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
      className="group"
    >
      {/* Top Row: 5 Stars + Right-Aligned Figma Quote Mark */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        {/* 5 Stars */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <StarIcon key={s} size={starSize} />
          ))}
        </div>

        {/* Big stylized quote mark from Figma */}
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: isFeatured ? "140px" : "110px",
            lineHeight: 0,
            color: quoteMarkColor,
            opacity: isFeatured ? 0.35 : 0.4,
            transform: "translateY(24px)",
            userSelect: "none",
          }}
          aria-hidden="true"
        >
          “
        </span>
      </div>

      {/* Middle Row: Quote Text */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", margin: "12px 0 20px" }}>
        <p
          style={{
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: isFeatured
              ? "clamp(18px, 1.8vw, 26px)"
              : "clamp(16px, 1.3vw, 20px)",
            lineHeight: "153%",
            color: textColor,
            margin: 0,
          }}
        >
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>

      {/* Bottom Area: Cyan Accent Divider + User Details */}
      <div>
        {/* Figma Rectangle 32 divider */}
        <div
          style={{
            width: isFeatured ? "85%" : "75%",
            height: isFeatured ? "2.6px" : "2px",
            backgroundColor: dividerColor,
            marginBottom: "18px",
            borderRadius: "2px",
          }}
        />

        {/* User Info Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          {/* Avatar and Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                minWidth: `${avatarSize}px`,
                position: "relative",
                borderRadius: "50%",
                overflow: "hidden",
                border: isFeatured ? "2px solid rgba(255, 255, 255, 0.4)" : "none",
                backgroundColor: "#D9D9D9",
                flexShrink: 0,
              }}
            >
              <Image
                src={item.avatar}
                alt={item.name}
                fill
                sizes={`${avatarSize}px`}
                style={{ objectFit: "cover" }}
              />
            </div>

            <p
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: isFeatured ? "clamp(20px, 2vw, 28px)" : "clamp(18px, 1.6vw, 24px)",
                lineHeight: "135%",
                color: textColor,
                margin: 0,
              }}
            >
              {item.name}
            </p>
          </div>

          {/* Role (DOCTOR, STUDENT, etc.) aligned to the right */}
          <p
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: isFeatured ? "clamp(15px, 1.4vw, 20px)" : "clamp(13px, 1.1vw, 17px)",
              lineHeight: "135%",
              letterSpacing: "0.04em",
              textAlign: "right",
              textTransform: "uppercase",
              color: roleColor,
              opacity: roleOpacity,
              margin: 0,
              flexShrink: 0,
            }}
          >
            {item.role}
          </p>
        </div>
      </div>
    </article>
  );
}
