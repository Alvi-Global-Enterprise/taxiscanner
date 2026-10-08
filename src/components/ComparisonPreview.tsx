"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  CompareData,
  CompareQuote,
  formatPickupEta,
  formatQuotePrice,
} from "@/lib/compareApi";

const FONT =
  "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

const PROVIDER_LOGOS: Record<string, string> = {
  uber: "/images/companies/uber.png",
  bolt: "/images/companies/bolt.png",
  streetcars: "/images/companies/streetcars.png",
  veezu: "/images/companies/veezu.png",
};

const PROVIDER_COLORS: Record<string, string> = {
  uber: "#000000",
  bolt: "#34D186",
  streetcars: "#197DF1",
  veezu: "#0ABCA5",
};

type PreviewRow = {
  key: string;
  logo?: string;
  name: string;
  ratingLabel: string | null;
  rating: number | null;
  eta: string;
  vehicle: string;
  detail: string;
  price: string;
  bookingUrl: string | null;
  highlight: boolean;
  provider?: string;
};

const DIVIDER_LINE: React.CSSProperties = {
  borderBottom: "1.5px solid rgba(25, 125, 241, 0.22)",
  width: "100%",
};

function VerticalDivider() {
  return (
    <div
      style={{
        width: "2px",
        height: "53px",
        backgroundColor: "rgba(25, 125, 241, 0.22)",
        borderRadius: "2px",
        flexShrink: 0,
        margin: "0 18px",
        alignSelf: "center",
      }}
    />
  );
}

function mapQuotesToRows(data: CompareData): PreviewRow[] {
  const available = data.quotes.filter((q) => q.is_available !== false);
  const sorted = [...available].sort((a, b) => a.min_price - b.min_price);
  const cheapest = sorted[0]?.provider;

  return sorted.map((quote: CompareQuote) => ({
    key: quote.provider,
    logo: PROVIDER_LOGOS[quote.provider.toLowerCase()],
    name: quote.display_name,
    ratingLabel: null,
    rating: null,
    eta: formatPickupEta(quote.estimated_pickup_minutes),
    vehicle:
      quote.distance_miles != null
        ? `${quote.distance_miles.toFixed(1)} miles`
        : data.route?.summary || "Route estimate",
    detail:
      quote.estimated_duration_minutes != null
        ? `${quote.estimated_duration_minutes} min trip`
        : quote.quote_type === "estimate"
        ? "Indicative estimate"
        : quote.quote_type,
    price: formatQuotePrice(quote),
    bookingUrl: quote.booking_url,
    highlight: quote.provider === cheapest,
    provider: quote.provider,
  }));
}

/**
 * Skeleton row mimicking the exact layout of comparison rows
 */
function SkeletonRow({ index }: { index: number }) {
  return (
    <div key={index}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          minHeight: "126px",
          padding: "16px 20px",
          borderRadius: "14px",
        }}
      >
        {/* Logo box */}
        <div
          style={{
            width: "160px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
            style={{
              width: "140px",
              height: "70px",
              borderRadius: "14px",
              border: "1px solid rgba(15, 23, 42, 0.06)",
            }}
          />
        </div>

        <VerticalDivider />

        {/* Name & subtitle */}
        <div
          style={{
            flex: "1 1 200px",
            minWidth: "180px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: "8px",
            gap: "10px",
          }}
        >
          <div
            className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
            style={{ width: "135px", height: "26px", borderRadius: "6px" }}
          />
          <div
            className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
            style={{ width: "90px", height: "14px", borderRadius: "4px" }}
          />
        </div>

        <VerticalDivider />

        {/* Vehicle */}
        <div
          style={{
            flex: "1 1 160px",
            minWidth: "140px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <div
            className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
            style={{ width: "110px", height: "20px", borderRadius: "6px" }}
          />
          <div
            className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
            style={{ width: "95px", height: "14px", borderRadius: "4px" }}
          />
        </div>

        <VerticalDivider />

        {/* ETA */}
        <div
          style={{
            flex: "1 1 160px",
            minWidth: "140px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <div
            className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
            style={{ width: "80px", height: "20px", borderRadius: "6px" }}
          />
          <div
            className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
            style={{ width: "105px", height: "14px", borderRadius: "4px" }}
          />
        </div>

        <VerticalDivider />

        {/* Price */}
        <div
          style={{
            width: "210px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "8px",
          }}
        >
          <div
            className="animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200"
            style={{ width: "105px", height: "30px", borderRadius: "7px" }}
          />
        </div>

        <VerticalDivider />

        {/* Button */}
        <div
          style={{
            width: "190px",
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            className="animate-pulse bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200"
            style={{
              width: "178px",
              height: "52px",
              borderRadius: "9px",
            }}
          />
        </div>
      </div>
      <div style={DIVIDER_LINE} />
    </div>
  );
}

/**
 * Skeleton preview view when loading live prices
 */
function ComparisonSkeleton() {
  return (
    <section id="comparison" style={{ padding: "80px 0" }}>
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-[96px] xl:px-[113px]">
        {/* Header Skeleton */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
            COMPARISON <span style={{ color: "#197DF1" }}>PREVIEW</span>
          </h2>

          {/* Live pulsing badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#E8F4FD",
              border: "1.5px solid #BAE1FD",
              borderRadius: "30px",
              padding: "10px 24px",
              marginTop: "20px",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: "#197DF1",
                display: "inline-block",
              }}
              className="animate-ping"
            />
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "15px",
                color: "#197DF1",
                letterSpacing: "0.02em",
              }}
            >
              Comparing live quotes across UK operators...
            </span>
          </div>

          <p
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: "14px",
              color: "rgba(0,0,0,0.5)",
              marginTop: "12px",
            }}
          >
            Checking Uber, Bolt, StreetCars & Veezu fares for your route
          </p>
        </div>

        {/* Table Rows Skeleton */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: "1000px" }}>
            <div style={DIVIDER_LINE} />
            {[0, 1, 2, 3].map((idx) => (
              <SkeletonRow key={idx} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export type ComparisonPreviewProps = {
  data?: CompareData | null;
  loading?: boolean;
  error?: string | null;
};

export function ComparisonPreview({
  data = null,
  loading = false,
  error = null,
}: ComparisonPreviewProps) {
  // Requirement: By default, this section is completely hidden until a comparison is triggered
  if (!loading && !data && !error) {
    return null;
  }

  // When loading live quotes, display the skeleton loader preview
  if (loading) {
    return <ComparisonSkeleton />;
  }

  // When an error occurred
  if (error && !data) {
    return (
      <section id="comparison" style={{ padding: "80px 0" }}>
        <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-[96px] xl:px-[113px]">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
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
              COMPARISON <span style={{ color: "#197DF1" }}>PREVIEW</span>
            </h2>
          </div>

          <div
            style={{
              maxWidth: "680px",
              margin: "0 auto",
              background: "#FEF2F2",
              border: "1.5px solid #FECACA",
              borderRadius: "16px",
              padding: "32px 28px",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(239, 68, 68, 0.08)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "#FEE2E2",
                color: "#DC2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              !
            </div>
            <h3
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "18px",
                color: "#991B1B",
                margin: "0 0 8px",
              }}
            >
              Unable to Fetch Live Quotes
            </h3>
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "15px",
                color: "#B91C1C",
                lineHeight: "150%",
                margin: 0,
              }}
            >
              {error}
            </p>
            <a
              href="#search"
              style={{
                display: "inline-block",
                marginTop: "20px",
                padding: "10px 24px",
                background: "#DC2626",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              Adjust Journey & Try Again
            </a>
          </div>
        </div>
      </section>
    );
  }

  // When live quote data is available
  const rows = data ? mapQuotesToRows(data) : [];

  return (
    <section id="comparison" style={{ padding: "80px 0" }}>
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-[96px] xl:px-[113px]">
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
            COMPARISON <span style={{ color: "#197DF1" }}>PREVIEW</span>
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
            Live quotes for your journey
          </p>

          {data && (
            <p
              style={{
                fontFamily: FONT,
                fontWeight: 500,
                fontSize: "15px",
                lineHeight: "150%",
                color: "rgba(0,0,0,0.65)",
                marginTop: "18px",
                maxWidth: "720px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {data.pickup.formatted_address} → {data.dropoff.formatted_address}
              {data.route ? (
                <>
                  {" "}
                  · {data.route.distance_miles.toFixed(1)} miles ·{" "}
                  {data.route.duration_minutes} mins
                </>
              ) : null}
            </p>
          )}
        </motion.div>

        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: "1000px" }}>
            <div style={DIVIDER_LINE} />

            {rows.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  fontFamily: FONT,
                  padding: "48px 20px",
                  color: "rgba(0,0,0,0.55)",
                }}
              >
                No quotes available for this route right now.
              </p>
            ) : (
              rows.map((item, idx) => {
                const btnStyle = item.highlight
                  ? {
                      background:
                        "linear-gradient(180deg, #4EE2CA 0%, #0ABCA5 100%)",
                      boxShadow: "0 4px 14px rgba(10, 188, 165, 0.25)",
                    }
                  : {
                      background: "#197DF1",
                      boxShadow: "0 4px 14px rgba(25, 125, 241, 0.25)",
                    };

                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.12,
                      ease: "easeOut",
                    }}
                  >
                    <motion.div
                      whileHover={{
                        backgroundColor: "rgba(229, 241, 253, 0.45)",
                      }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0",
                        minHeight: "126px",
                        padding: "16px 20px",
                        borderRadius: "14px",
                      }}
                    >
                      {/* Logo / brand badge */}
                      <div
                        style={{
                          width: "160px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item.logo ? (
                          <div
                            style={{
                              width: "140px",
                              height: "70px",
                              borderRadius: "14px",
                              background: "#FFFFFF",
                              border: "1px solid rgba(15, 23, 42, 0.08)",
                              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.06)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              padding: "8px",
                            }}
                          >
                            <Image
                              src={item.logo}
                              alt={`${item.name} logo`}
                              width={120}
                              height={54}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              width: "140px",
                              height: "64px",
                              borderRadius: "12px",
                              background:
                                PROVIDER_COLORS[
                                  item.provider?.toLowerCase() || ""
                                ] || "#197DF1",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: FONT,
                              fontWeight: 800,
                              fontSize: "20px",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {item.name}
                          </div>
                        )}
                      </div>

                      <VerticalDivider />

                      {/* Name */}
                      <div
                        style={{
                          flex: "1 1 200px",
                          minWidth: "180px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          paddingRight: "8px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: "28px",
                            lineHeight: "130%",
                            letterSpacing: "0.01em",
                            color: "#000000",
                            margin: 0,
                          }}
                        >
                          {item.name}
                        </p>
                        {item.rating != null && item.ratingLabel ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              marginTop: "4px",
                            }}
                          >
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg
                                key={s}
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill={
                                  s <= Math.round(item.rating!)
                                    ? "#FFB030"
                                    : "#E2E8F0"
                                }
                              >
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                              </svg>
                            ))}
                            <span
                              style={{
                                fontFamily: FONT,
                                fontWeight: 400,
                                fontSize: "15px",
                                color: "#000000",
                                marginLeft: "4px",
                              }}
                            >
                              {item.ratingLabel}
                            </span>
                          </div>
                        ) : (
                          <p
                            style={{
                              fontFamily: FONT,
                              fontWeight: 600,
                              fontSize: "14px",
                              color: "rgba(0,0,0,0.45)",
                              margin: "6px 0 0",
                            }}
                          >
                            Live estimate
                          </p>
                        )}
                      </div>

                      <VerticalDivider />

                      {/* Distance / trip */}
                      <div
                        style={{
                          flex: "1 1 160px",
                          minWidth: "140px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: "20px",
                            lineHeight: "130%",
                            color: "#000000",
                            margin: 0,
                          }}
                        >
                          {item.vehicle}
                        </p>
                        <p
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#000000",
                            opacity: 0.44,
                            margin: "2px 0 0",
                          }}
                        >
                          {item.detail}
                        </p>
                      </div>

                      <VerticalDivider />

                      {/* ETA */}
                      <div
                        style={{
                          flex: "1 1 160px",
                          minWidth: "140px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: "20px",
                            lineHeight: "130%",
                            color: "#000000",
                            margin: 0,
                          }}
                        >
                          {item.eta}
                        </p>
                        <p
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: "14px",
                            color: "#000000",
                            opacity: 0.44,
                            margin: "2px 0 0",
                          }}
                        >
                          Pickup ETA
                        </p>
                      </div>

                      <VerticalDivider />

                      {/* Price */}
                      <div
                        style={{
                          width: "210px",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: "8px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: item.price.includes("–")
                              ? "21px"
                              : "26px",
                            lineHeight: "120%",
                            letterSpacing: "-0.01em",
                            color: "#000000",
                            margin: 0,
                            textAlign: "right",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.price}
                        </p>
                      </div>

                      <VerticalDivider />

                      {/* CTA */}
                      <div
                        style={{
                          width: "190px",
                          flexShrink: 0,
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <motion.a
                          href={item.bookingUrl || "#search"}
                          target={item.bookingUrl ? "_blank" : undefined}
                          rel={
                            item.bookingUrl
                              ? "noopener noreferrer"
                              : undefined
                          }
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "0 8px 24px rgba(25, 125, 241, 0.35)",
                          }}
                          whileTap={{ scale: 0.96 }}
                          style={{
                            ...btnStyle,
                            width: "178px",
                            height: "52px",
                            borderRadius: "9px",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            flexShrink: 0,
                            textDecoration: "none",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: FONT,
                              fontWeight: 700,
                              fontSize: "17px",
                              lineHeight: "1",
                              color: "#FFFFFF",
                            }}
                          >
                            View Deal
                          </span>
                          <svg
                            width="20"
                            height="14"
                            viewBox="0 0 22 15"
                            fill="none"
                            style={{ flexShrink: 0 }}
                          >
                            <path
                              d="M1 7.5H20M14 1.5L20 7.5L14 13.5"
                              stroke="#FFFFFF"
                              strokeWidth="2.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.a>
                      </div>
                    </motion.div>

                    <div style={DIVIDER_LINE} />
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
