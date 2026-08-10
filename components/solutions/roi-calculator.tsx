"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { SolutionIndustryContent, IndustryConfig, SolutionConfig } from "@/data/solutions-config";
import { getPricing } from "@/data/solutions-config";

export default function ROICalculator({ content, industry, solution }: { content: SolutionIndustryContent; industry: IndustryConfig; solution: SolutionConfig }) {
  const [missed, setMissed] = useState(content.roiDefaults.missedPerWeek);
  const [avg, setAvg] = useState(content.roiDefaults.avgValue);
  const monthly = missed * avg * 4.33;
  const annual = monthly * 12;
  const priced = getPricing(solution.slug, industry.slug);
  // One-time solutions don't have a monthly cost to compare against — show weeks to
  // payback on the one-time fee instead of a "Nx over per month" multiple.
  const cost = priced.kind === "one-time" ? (priced.oneTimeLow ?? 0) : (priced.monthly ?? 0);
  const payMultiple = monthly / cost;
  const weekly = monthly / 4.33;
  const weeksToPayback = weekly > 0 ? cost / weekly : 0;

  return (
    <section id="roi-calculator" className="py-20 border-b border-[#e2e8f0]">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>The Numbers</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-2">See What You Could Be Losing</h2>
          <p className="text-[#475569] mb-10">Rough numbers, adjust the sliders to match your business.</p>
        </motion.div>
        <div className="grid gap-10 lg:grid-cols-2 items-start">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#475569]">Missed customers per week</span>
                <span className="font-semibold text-[#0f172a]">{missed}</span>
              </div>
              <input type="range" min={1} max={30} value={missed} onChange={(e) => setMissed(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${industry.accentColor} ${((missed - 1) / 29) * 100}%, #e2e8f0 ${((missed - 1) / 29) * 100}%)` }} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#475569]">Average value {content.roiDefaults.label}</span>
                <span className="font-semibold text-[#0f172a]">£{avg}</span>
              </div>
              <input type="range" min={10} max={500} step={5} value={avg} onChange={(e) => setAvg(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${industry.accentColor} ${((avg - 10) / 490) * 100}%, #e2e8f0 ${((avg - 10) / 490) * 100}%)` }} />
            </div>
            <p className="text-xs text-[#94a3b8]">These are illustrative estimates to think through the numbers, not a guarantee.</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-8 rounded-lg border border-[#e2e8f0] bg-white">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#475569]">Estimated monthly revenue at stake</span>
                <span className="text-2xl font-bold text-[#0f172a]">£{Math.round(monthly).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#475569]">Estimated annual revenue at stake</span>
                <span className="text-lg font-semibold text-[#334155]">£{Math.round(annual).toLocaleString()}</span>
              </div>
              <hr className="border-[#e2e8f0]" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#475569]">Solution investment</span>
                <span className="text-sm font-medium text-[#0f172a]">
                  {priced.kind === "one-time" ? `from £${cost.toLocaleString()} one-time` : `from £${cost}/month`}
                </span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
              <p className="text-sm text-[#334155] mb-4">
                {priced.kind === "one-time" ? (
                  <>At these numbers, the one-time fee is covered in roughly <span className="font-semibold" style={{ color: industry.accentColor }}>{weeksToPayback >= 1 ? `${Math.ceil(weeksToPayback)} weeks` : "under a week"}</span> by recovering just the customers on the slider above.</>
                ) : (
                  <>At these numbers, the monthly investment is covered roughly <span className="font-semibold" style={{ color: industry.accentColor }}>{payMultiple >= 1 ? `${payMultiple.toFixed(1)}x over` : "in part"}</span> by recovering just the customers on the slider above.</>
                )}
              </p>
              <button onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full py-3.5 rounded-md text-white font-bold text-sm uppercase tracking-wide hover:opacity-90 transition-opacity" style={{ backgroundColor: industry.accentColor }}>
                Book a Free Call
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}