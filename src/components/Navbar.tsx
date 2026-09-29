"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/data";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSearch = () => {
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        background: scrolled ? "rgba(255, 255, 255, 0.94)" : "rgba(255, 255, 255, 0.12)",
        boxShadow: scrolled ? "0 4px 24px rgba(0, 0, 0, 0.08)" : "none",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div
        className="mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-14"
        style={{ height: "104px", maxWidth: "1920px" }}
      >
        {/* Logo */}
        <motion.a
          href="#home"
          className="flex-shrink-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Image
            src="/images/logo.png"
            alt="TaxiScanner Logo"
            width={220}
            height={61}
            priority
            style={{ height: "61px", width: "220px", objectFit: "contain" }}
          />
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              onClick={() => setActive(link.label)}
              className="relative"
              whileHover={{ y: -1 }}
              style={{
                fontFamily: "'Noto Sans JP', 'LINE Seed JP', 'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "18px",
                lineHeight: "20px",
                color: "#000000",
                opacity: active === link.label ? 1 : 0.38,
                transition: "opacity 0.2s",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              {link.label}
              {active === link.label && (
                <motion.span
                  layoutId="navbar-active-pill"
                  className="absolute rounded-full"
                  style={{
                    bottom: "-10px",
                    left: 0,
                    width: "24px",
                    height: "3px",
                    background: "#197DF1",
                    borderRadius: "1.5px",
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <motion.button
            onClick={scrollToSearch}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(25, 125, 241, 0.35)" }}
            whileTap={{ scale: 0.96 }}
            style={{
              width: "208px",
              height: "59px",
              background: "#197DF1",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'LINE Seed JP', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "18px",
              lineHeight: "20px",
              color: "#FFFFFF",
              transition: "background 0.2s",
            }}
          >
            Compare Prices
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-slate-100 bg-white px-4 py-4 lg:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActive(link.label);
                    setOpen(false);
                  }}
                  style={{
                    fontWeight: 700,
                    fontSize: "16px",
                    color: active === link.label ? "#197DF1" : "rgba(0,0,0,0.6)",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    textDecoration: "none",
                  }}
                >
                  {link.label}
                </a>
              ))}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={scrollToSearch}
                style={{
                  marginTop: "8px",
                  width: "100%",
                  height: "50px",
                  background: "#197DF1",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#FFFFFF",
                }}
              >
                Compare Prices
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
