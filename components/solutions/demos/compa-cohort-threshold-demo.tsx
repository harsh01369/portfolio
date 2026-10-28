"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface FilterLevel {
  label: string;
  contributingCompanies: number;
  medianBase: number;
}

const LEVELS: FilterLevel[] = [
  { label: "Staff Engineer, US", contributingCompanies: 214, medianBase: 215000 },
  { label: "Staff Engineer, Infra, US", contributingCompanies: 58, medianBase: 221000 },
  { label: "Staff Engineer, Infra, Denver metro", contributingCompanies: 9, medianBase: 228000 },
  { label: "Staff Engineer, Infra, Denver metro, Series B", contributingCompanies: 3, medianBase: 231000 },
];

const SAFE_THRESHOLD = 5;

export default function CompaCohortThresholdDemo({ accentColor, bgDark }: Props) {
  const [index, setIndex] = useState(0);
  const level = LEVELS[index];
  const suppressed = level.contributingCompanies < SAFE_THRESHOLD;

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
          <span className="text-[10.5px] text-white/40 ml-2">benchmark :: cohort-disclosure-check</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Pooled, anonymized comp data stops being anonymous once a filter narrows the cohort down to a
            handful of companies, at that point the "median" is just one or two real offers wearing a label.
          </p>

          <div className="rounded-lg px-3 py-3 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${suppressed ? "#ef444455" : `${accentColor}44`}` }}>
            <p className="text-[10.5px] text-white/70 mb-2">{level.label}</p>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-white/40">contributing companies</span>
              <span className="text-[11px] tabular-nums font-semibold" style={{ color: suppressed ? "#ef4444" : accentColor }}>
                {level.contributingCompanies}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-white/40">median base</span>
              <motion.span
                key={suppressed ? "hidden" : level.medianBase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[13px] tabular-nums font-semibold"
                style={{ color: suppressed ? "#ef4444" : accentColor }}
              >
                {suppressed ? "suppressed" : `$${level.medianBase.toLocaleString()}`}
              </motion.span>
            </div>
          </div>

          {suppressed && (
            <p className="text-[9.5px] leading-relaxed mb-4" style={{ color: "#fca5a5" }}>
              Below {SAFE_THRESHOLD} contributing companies, showing a figure here would effectively reveal one
              or two real companies' actual offers. Benchmark withheld until the cohort widens.
            </p>
          )}

          <div className="flex items-center gap-2">
            {LEVELS.map((l, i) => (
              <button
                key={l.label}
                onClick={() => setIndex(i)}
                className="text-[9.5px] px-2.5 py-1 rounded-md transition-opacity"
                style={{
                  background: i === index ? accentColor : "rgba(255,255,255,0.08)",
                  color: i === index ? bgDark : "rgba(255,255,255,0.6)",
                }}
              >
                {i === 0 ? "broad" : i === LEVELS.length - 1 ? "narrowest" : `+filter`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
