"use client";

import { motion } from "framer-motion";
import type { IndustryConfig } from "@/data/solutions-config";

export default function SolutionStatementBand({ industry }: { industry: IndustryConfig }) {
  return (
    <section className="py-10" style={{ backgroundColor: industry.accentColor }}>
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-white text-lg sm:text-xl font-semibold">
          Built specifically for {industry.label.toLowerCase()} businesses, not a generic template with your logo on it.
        </motion.p>
      </div>
    </section>
  );
}