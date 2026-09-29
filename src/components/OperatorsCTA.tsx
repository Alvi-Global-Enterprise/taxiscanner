"use client";

import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { operatorBenefits } from "@/lib/data";

export function OperatorsCTA() {
  return (
    <section id="operators" className="relative overflow-hidden">
      <div className="relative min-h-[440px] w-full">
        <Image
          src="/images/operators.png"
          alt="Taxi operator standing beside a London black cab at night"
          fill
          className="object-cover object-right"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-brand-dark/30" />

        <div className="relative mx-auto flex min-h-[440px] max-w-[1720px] items-center px-4 py-16 sm:px-6 lg:px-[96px] xl:px-[113px]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl text-white"
          >
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Are You a <span className="text-brand-200">Taxi Operator?</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              Join TaxiScanner and grow your taxi services. Reach travellers who
              are already comparing local fares and looking for trusted operators.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              {operatorBenefits.map((benefit, idx) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button size="lg" className="shadow-lg shadow-blue-500/25">
                  Become a Partner
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
