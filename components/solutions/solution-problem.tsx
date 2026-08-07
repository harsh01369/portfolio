"use client";

import { motion } from "framer-motion";
import type { SolutionIndustryContent, IndustryConfig } from "@/data/solutions-config";
import Icon from "./icon";

interface Props { content: SolutionIndustryContent; industry: IndustryConfig; }

export default function SolutionProblem({ content, industry }: Props) {
  return (
    <section className="py-20 border-b border-[#e2e8f0]" style={{ backgroundColor: industry.accentLight }}>
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>The Problem</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-8">Sound Familiar?</h2>
          <blockquote className="text-lg text-[#334155] italic leading-relaxed max-w-3xl mb-10 pl-6 border-l-2" style={{ borderColor: industry.accentColor }}>
            &ldquo;{content.problemStory}&rdquo;
          </blockquote>
          <div className="grid gap-3 sm:grid-cols-2">
            {content.painPoints.map((point, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-white border border-[#e2e8f0]">
                <Icon name="alert" className="w-4 h-4 mt-0.5 shrink-0" style={{ color: industry.accentColor }} />
                <span className="text-sm text-[#334155]">{point}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
