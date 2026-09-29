"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { footerColumns } from "@/lib/data";

const socials = [
  {
    label: "Facebook",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    label: "X",
    path: "M4 4l7.5 9L4 20h2.2l6-6.8L17.5 20H20l-7.7-9.2L19.8 4H17.6l-5.6 6.3L6.5 4H4z",
  },
  {
    label: "Instagram",
    path: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.2-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z",
  },
  {
    label: "LinkedIn",
    path: "M6.5 9H3v12h3.5V9zM4.8 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM21 13.4c0-3.1-1.7-4.5-3.9-4.5-1.8 0-2.6 1-3.1 1.7V9H10.5v12H14v-6.5c0-1.7.3-3.4 2.5-3.4s2.5 1.9 2.5 3.5V21H22v-7.6z",
  },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer id="contact" className="bg-brand-dark text-white">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto grid max-w-[1720px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_repeat(3,0.7fr)_1.2fr] lg:gap-8 lg:px-[96px] xl:px-[113px] lg:py-16"
      >
        <div>
          <Logo variant="dark" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            Compare local taxi fares across the UK and choose the option that
            fits your journey.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((social) => (
              <motion.a
                key={social.label}
                href="#"
                whileHover={{ scale: 1.12, backgroundColor: "#197DF1" }}
                whileTap={{ scale: 0.95 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors"
                aria-label={social.label}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d={social.path} />
                </svg>
              </motion.a>
            ))}
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide">
              {column.title}
            </h3>
            <ul className="space-y-2.5">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/70 transition hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide">
            Stay in the Loop
          </h3>
          <p className="mb-4 text-sm text-white/70">
            Get updates on new cities, features and operator partners.
          </p>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border-white/10 bg-white/10 text-white placeholder:text-white/40 focus:border-brand"
            />
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button type="submit" className="w-full shrink-0 sm:w-auto">
                Subscribe
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1720px] flex-col items-center justify-between gap-3 px-4 py-5 text-sm text-white/55 sm:flex-row sm:px-6 lg:px-[96px] xl:px-[113px]">
          <p>© {new Date().getFullYear()} TaxiScanner. All rights reserved.</p>
          <p>Compare smarter. Ride better.</p>
        </div>
      </div>
    </footer>
  );
}
