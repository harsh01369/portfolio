"use client";

import { motion } from "framer-motion";
import type { SolutionIndustryContent, IndustryConfig, SolutionConfig } from "@/data/solutions-config";
import Icon from "./icon";

interface Props { content: SolutionIndustryContent; industry: IndustryConfig; solution: SolutionConfig; }

export default function SolutionHero({ content, industry, solution }: Props) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="border-b border-[#e2e8f0]">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: industry.accentColor }}>
              Built for {industry.label} Businesses
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0f172a] leading-tight whitespace-pre-line">{content.heroHeadline}</h1>
            <p className="mt-6 text-lg text-[#475569] leading-relaxed max-w-xl">{content.heroSubheadline}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={() => scrollTo("contact-form")} className="px-7 py-3.5 rounded-md text-white font-bold text-sm uppercase tracking-wide transition-opacity hover:opacity-90" style={{ backgroundColor: industry.accentColor }}>
                Book a Free Call
              </button>
              <button onClick={() => scrollTo("mockup-section")} className="px-7 py-3.5 rounded-md font-bold text-sm uppercase tracking-wide border-2 transition-colors hover:text-white"
                style={{ borderColor: industry.accentColor, color: industry.accentColor }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = industry.accentColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                See It Live
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }} className="hidden lg:block">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: industry.accentLight, color: industry.accentColor }}>
                <Icon name={solution.icon} className="w-6 h-6" />
              </div>
              <p className="text-lg font-semibold text-[#0f172a]">{solution.title}</p>
              <p className="text-sm text-[#475569] mt-1">{solution.tagline}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg border border-[#e2e8f0] p-4">
                  <p className="text-2xl font-bold" style={{ color: industry.accentColor }}>24/7</p>
                  <p className="text-xs text-[#94a3b8]">Availability</p>
                </div>
                <div className="rounded-lg border border-[#e2e8f0] p-4">
                  <p className="text-2xl font-bold" style={{ color: industry.accentColor }}>&lt;2s</p>
                  <p className="text-xs text-[#94a3b8]">Load Time</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
