"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const FONT = "'Noto Sans JP', 'LINE Seed JP', 'Plus Jakarta Sans', system-ui, sans-serif";

const comparisons = [
  {
    logo: "/images/companies/citycab.png",
    name: "CityCab",
    rating: 4.8,
    ratingCount: 512,
    eta: "6 mins",
    vehicle: "Standard Saloon",
    passengers: "Up to 4 passengers",
    price: "£18.50",
    btnStyle: {
      background: "linear-gradient(180deg, #4EE2CA 0%, #0ABCA5 100%)",
      boxShadow: "0 4px 14px rgba(10, 188, 165, 0.25)",
    },
  },
  {
    logo: "/images/companies/swiftride.png",
    name: "Swift Ride",
    rating: 4.6,
    ratingCount: 258,
    eta: "8 mins",
    vehicle: "Executive Car",
    passengers: "Up to 4 passengers",
    price: "£21.20",
    btnStyle: {
      background: "#197DF1",
      boxShadow: "0 4px 14px rgba(25, 125, 241, 0.25)",
    },
  },
  {
    logo: "/images/companies/urbantaxi.png",
    name: "Urban Taxi",
    rating: 4.4,
    ratingCount: 489,
    eta: "10 mins",
    vehicle: "Standard Saloon",
    passengers: "Up to 4 passengers",
    price: "£23.00",
    btnStyle: {
      background: "#197DF1",
      boxShadow: "0 4px 14px rgba(25, 125, 241, 0.25)",
    },
  },
  {
    logo: "/images/companies/primecabs.png",
    name: "Prime Cabs",
    rating: 4.7,
    ratingCount: 396,
    eta: "6 mins",
    vehicle: "MPV",
    passengers: "Up to 4 passengers",
    price: "£26.50",
    btnStyle: {
      background: "#197DF1",
      boxShadow: "0 4px 14px rgba(25, 125, 241, 0.25)",
    },
  },
];

// Horizontal divider matching Figma opacity: 0.2; border: 4px solid #197DF1
const DIVIDER_LINE: React.CSSProperties = {
  borderBottom: "1.5px solid rgba(25, 125, 241, 0.22)",
  width: "100%",
};

// Vertical divider: 52.69px tall bar, vertically centered, 2px wide, light blue
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

export function ComparisonPreview() {
  return (
    <section id="about" style={{ padding: "80px 0" }}>
      <div className="mx-auto w-full max-w-[1720px] px-4 sm:px-6 lg:px-[96px] xl:px-[113px]">
        {/* Section Heading */}
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
            Compare Taxi Options at a Glance
          </p>
        </motion.div>

        {/* Table Container with horizontal scroll on small viewports */}
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ minWidth: "1280px" }}>
            {/* Top horizontal divider above first row */}
            <div style={DIVIDER_LINE} />

            {comparisons.map((item, idx) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: "easeOut" }}
              >
                <motion.div
                  whileHover={{ backgroundColor: "rgba(229, 241, 253, 0.45)" }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "185px auto minmax(210px, 1.2fr) auto minmax(110px, 0.8fr) auto minmax(210px, 1.2fr) auto minmax(115px, 0.8fr) auto 244px",
                    alignItems: "center",
                    minHeight: "126px",
                    padding: "16px 20px",
                    borderRadius: "14px",
                  }}
                >
                  {/* 1. Logo */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{
                      width: "185px",
                      height: "85px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={185}
                      height={85}
                      style={{
                        width: "185px",
                        height: "85px",
                        objectFit: "contain",
                        borderRadius: "17px",
                      }}
                    />
                  </motion.div>

                  {/* 2. Vertical Divider 1 */}
                  <VerticalDivider />

                  {/* 3. Company Name + Star Rating */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: "35px",
                        lineHeight: "141%",
                        letterSpacing: "0.01em",
                        color: "#000000",
                        margin: 0,
                      }}
                    >
                      {item.name}
                    </p>
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
                          width="21"
                          height="21"
                          viewBox="0 0 24 24"
                          fill={s <= Math.round(item.rating) ? "#FFB030" : "#E2E8F0"}
                        >
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                      ))}
                      <span
                        style={{
                          fontFamily: FONT,
                          fontWeight: 400,
                          fontSize: "17px",
                          lineHeight: "141%",
                          letterSpacing: "0.01em",
                          color: "#000000",
                          marginLeft: "4px",
                        }}
                      >
                        {item.rating}({item.ratingCount})
                      </span>
                    </div>
                  </div>

                  {/* 4. Vertical Divider 2 */}
                  <VerticalDivider />

                  {/* 5. ETA */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: "23px",
                        lineHeight: "141%",
                        letterSpacing: "0.01em",
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
                        fontSize: "18px",
                        lineHeight: "141%",
                        letterSpacing: "0.01em",
                        color: "#000000",
                        opacity: 0.44,
                        margin: 0,
                        marginTop: "2px",
                      }}
                    >
                      Estimated ETA
                    </p>
                  </div>

                  {/* 6. Vertical Divider 3 */}
                  <VerticalDivider />

                  {/* 7. Vehicle */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: "23px",
                        lineHeight: "141%",
                        letterSpacing: "0.01em",
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
                        fontSize: "18px",
                        lineHeight: "141%",
                        letterSpacing: "0.01em",
                        color: "#000000",
                        opacity: 0.44,
                        margin: 0,
                        marginTop: "2px",
                      }}
                    >
                      {item.passengers}
                    </p>
                  </div>

                  {/* 8. Vertical Divider 4 */}
                  <VerticalDivider />

                  {/* 9. Price */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: "32px",
                        lineHeight: "141%",
                        letterSpacing: "0.01em",
                        color: "#000000",
                        margin: 0,
                      }}
                    >
                      {item.price}
                    </p>
                  </div>

                  {/* 10. Vertical Divider 5 */}
                  <VerticalDivider />

                  {/* 11. View Deal button */}
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(25, 125, 241, 0.35)" }}
                    whileTap={{ scale: 0.96 }}
                    style={{
                      ...item.btnStyle,
                      width: "200px",
                      height: "56px",
                      borderRadius: "9px",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "141%",
                        letterSpacing: "0.01em",
                        color: "#FFFFFF",
                      }}
                    >
                      View Deal
                    </span>
                    {/* Right Arrow Icon */}
                    <svg
                      width="22"
                      height="15"
                      viewBox="0 0 22 15"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: "1px" }}
                    >
                      <path
                        d="M1 7.5H20M14 1.5L20 7.5L14 13.5"
                        stroke="#FFFFFF"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.button>
                </motion.div>

                {/* Horizontal divider between and below rows */}
                <div style={DIVIDER_LINE} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
