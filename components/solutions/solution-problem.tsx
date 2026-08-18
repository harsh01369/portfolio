"use client";

import { motion } from "framer-motion";
import type { SolutionIndustryContent, IndustryConfig } from "@/data/solutions-config";
import Icon from "./icon";

interface Props { content: SolutionIndustryContent; industry: IndustryConfig; }

export default function SolutionProblem({ content, industry }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>The Problem</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-6">Sound Familiar?</h2>
      <div className="rounded-xl bg-white border border-[#e2e8f0] overflow-hidden">
        <blockquote className="text-base text-[#334155] italic leading-relaxed p-6 sm:p-7 pl-7 border-l-2" style={{ borderColor: industry.accentColor }}>
          &ldquo;{content.problemStory}&rdquo;
        </blockquote>
        <div className="border-t border-[#e2e8f0] divide-y divide-[#e2e8f0]">
          {content.painPoints.map((point, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-start gap-3 px-6 sm:px-7 py-3">
              <Icon name="alert" className="w-4 h-4 mt-0.5 shrink-0" style={{ color: industry.accentColor }} />
              <span className="text-sm text-[#334155]">{point}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
