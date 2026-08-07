"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SolutionIndustryContent } from "@/data/solutions-config";

export default function SolutionFAQ({ content }: { content: SolutionIndustryContent }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="py-20 border-b border-[#e2e8f0]">
      <div className="mx-auto max-w-3xl px-6">
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--industry-accent, #2563eb)" }}>Questions</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-10">Common Questions</motion.h2>
        <div className="space-y-2">
          {content.faqs.map((faq, i) => {
            const open = openIdx === i;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.25, delay: i * 0.04 }} className="border border-[#e2e8f0] rounded-lg overflow-hidden">
                <button onClick={() => setOpenIdx(open ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={open}>
                  <span className="text-sm font-medium text-[#0f172a] pr-4">{faq.question}</span>
                  <span className="text-[#94a3b8] shrink-0 text-lg transition-transform duration-200" style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <div className="px-5 pb-5 text-sm text-[#475569] leading-relaxed">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}