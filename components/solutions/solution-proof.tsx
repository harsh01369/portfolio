"use client";

import { motion } from "framer-motion";
import type { SolutionIndustryContent, IndustryConfig } from "@/data/solutions-config";

export default function SolutionProof({ content, industry }: { content: SolutionIndustryContent; industry: IndustryConfig }) {
  return (
    <section className="py-20 border-b border-[#e2e8f0] text-white" style={{ backgroundColor: industry.accentDark }}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] items-start">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center text-2xl font-bold shrink-0">
            HK
          </motion.div>
          <div>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Who&apos;s Building This</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-bold mb-4">Harsh Khetia, Full Stack Developer</motion.h2>
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-white/85 leading-relaxed max-w-2xl mb-3">
              I&apos;m a solo developer, not an agency, so you work directly with the person building it, start to finish.
              No account managers, no handoffs.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white/10 rounded-lg p-5 mb-6 max-w-2xl">
              <p className="text-sm font-semibold mb-1">{content.proofStat}</p>
              <p className="text-white/80 text-sm leading-relaxed">{content.proofDescription}</p>
            </motion.div>
            <div className="flex flex-wrap items-center gap-5">
              <button onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                className="px-6 py-3 rounded-md bg-white font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity" style={{ color: industry.accentDark }}>
                Book a Free Call
              </button>
              <a href="/projects" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                See the projects this is built on →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}