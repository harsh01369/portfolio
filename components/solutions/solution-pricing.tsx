"use client";

import { motion } from "framer-motion";
import type { IndustryConfig, SolutionConfig } from "@/data/solutions-config";
import { getPricing } from "@/data/solutions-config";
import Icon from "./icon";

export default function SolutionPricing({ solution, industry }: { solution: SolutionConfig; industry: IndustryConfig }) {
  const priced = getPricing(solution.slug, industry.slug);

  return (
    <section className="py-20 border-b border-[#e2e8f0]">
      <div className="mx-auto max-w-3xl px-6">
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>Pricing</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-10">What This Actually Costs</motion.h2>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-8 rounded-lg border border-[#e2e8f0] bg-white">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1 mb-2">
            {priced.kind === "hybrid" && (
              <>
                <span className="text-3xl font-bold text-[#0f172a]">£{priced.setup}</span>
                <span className="text-sm text-[#475569] mb-1">setup, then £{priced.monthly}/month</span>
              </>
            )}
            {priced.kind === "monthly-flat" && (
              <>
                <span className="text-3xl font-bold text-[#0f172a]">£{priced.monthly}</span>
                <span className="text-sm text-[#475569] mb-1">/month, no setup fee</span>
              </>
            )}
            {priced.kind === "one-time" && (
              <>
                <span className="text-3xl font-bold text-[#0f172a]">
                  {priced.oneTimeLow === priced.oneTimeHigh
                    ? `£${priced.oneTimeLow?.toLocaleString()}`
                    : `£${priced.oneTimeLow?.toLocaleString()}–£${priced.oneTimeHigh?.toLocaleString()}`}
                </span>
                <span className="text-sm text-[#475569] mb-1">one-time, scoped to your business</span>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-[#e2e8f0] space-y-3">
            {priced.trustLine && (
              <div className="flex items-start gap-2.5">
                <Icon name="check" className="w-4 h-4 mt-0.5 shrink-0" style={{ color: industry.accentColor }} />
                <span className="text-sm text-[#334155]">{priced.trustLine}</span>
              </div>
            )}
            <div className="flex items-start gap-2.5">
              <Icon name="check" className="w-4 h-4 mt-0.5 shrink-0" style={{ color: industry.accentColor }} />
              <span className="text-sm text-[#334155]">No long-term contract. Cancel anytime.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Icon name="check" className="w-4 h-4 mt-0.5 shrink-0" style={{ color: industry.accentColor }} />
              <span className="text-sm text-[#334155]">You work directly with me, not an account manager.</span>
            </div>
          </div>

          <button onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full mt-6 py-3.5 rounded-md text-white font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity" style={{ backgroundColor: industry.accentColor }}>
            Book a Free Call
          </button>
        </motion.div>
      </div>
    </section>
  );
}