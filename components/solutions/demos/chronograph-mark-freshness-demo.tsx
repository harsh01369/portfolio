"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Holding {
  id: string;
  company: string;
  valueQ2: number;
  valueQ3: number;
  q3Submitted: boolean;
}

const HOLDINGS: Holding[] = [
  { id: "h1", company: "Northline Robotics", valueQ2: 42.1, valueQ3: 46.8, q3Submitted: true },
  { id: "h2", company: "Veltrix Health", valueQ2: 28.4, valueQ3: 31.2, q3Submitted: true },
  { id: "h3", company: "Marrow Logistics", valueQ2: 19.9, valueQ3: 14.6, q3Submitted: false },
  { id: "h4", company: "Casefield Materials", valueQ2: 36.7, valueQ3: 38.9, q3Submitted: true },
];

export default function ChronographMarkFreshnessDemo({ accentColor, bgDark }: Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const blendedNav = HOLDINGS.reduce((sum, h) => sum + (h.q3Submitted ? h.valueQ3 : h.valueQ2), 0);
  const staleCount = HOLDINGS.filter((h) => !h.q3Submitted).length;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl font-mono"
        style={{ background: bgDark, border: `1px solid ${accentColor}33` }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${accentColor}2E` }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
          <span className="text-[10.5px] text-white/40 ml-2">lp-view :: Fund III, Q3 NAV</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Four portfolio companies, four GPs submitting marks on their own schedule. One hasn't
            filed Q3 yet. The fund-level NAV an LP sees today is whatever's been submitted,
            blended with whatever hasn't.
          </p>

          <div className="rounded-lg px-3 py-3 mb-4" style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}44` }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/55">Fund III reported NAV</span>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: accentColor }}>
                ${blendedNav.toFixed(1)}M
              </span>
            </div>
            <p className="text-[9px] text-white/35 mt-1">
              {staleCount} of {HOLDINGS.length} holdings in this number are still on their Q2 mark.
            </p>
          </div>

          <div className="space-y-1.5 mb-4">
            {HOLDINGS.map((h) => (
              <div key={h.id} className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${!h.q3Submitted ? "#f59e0b44" : "rgba(255,255,255,0.07)"}` }}>
                <span className="text-[10px] text-white/70">{h.company}</span>
                {showBreakdown ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[9.5px] tabular-nums"
                    style={{ color: h.q3Submitted ? "#4ade80" : "#fbbf24" }}
                  >
                    {h.q3Submitted ? `Q3 mark: $${h.valueQ3.toFixed(1)}M` : `Q2 mark (carried): $${h.valueQ2.toFixed(1)}M`}
                  </motion.span>
                ) : (
                  <span className="text-[9.5px] text-white/30">in blended total</span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowBreakdown((s) => !s)}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity"
            style={{ background: accentColor, color: bgDark }}
          >
            {showBreakdown ? "Show as single NAV figure" : "Break down by mark freshness"}
          </button>
        </div>
      </div>
    </div>
  );
}
