"use client";

import { motion } from "framer-motion";
import type { SolutionIndustryContent, IndustryConfig } from "@/data/solutions-config";
import Icon from "./icon";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const card = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function SolutionFeatures({ content, industry }: { content: SolutionIndustryContent; industry: IndustryConfig }) {
  return (
    <section className="py-20 border-b border-[#e2e8f0]">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>What&apos;s Included</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-4">Everything You Get</h2>
          <p className="text-[#475569] mb-10 max-w-2xl">A complete package designed to grow your business, not just a website.</p>
        </motion.div>
        <motion.div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" variants={container} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {content.features.map((f, i) => (
            <motion.div key={i} variants={card} className="p-6 rounded-lg border border-[#e2e8f0] hover:border-[#cbd5e1] transition-colors">
              <div className="w-9 h-9 rounded-md flex items-center justify-center mb-4" style={{ backgroundColor: industry.accentLight, color: industry.accentColor }}>
                <Icon name={f.icon} className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[#0f172a] mb-1">{f.title}</h3>
              <p className="text-sm text-[#475569] leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}