"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Factor {
  id: string;
  label: string;
  source: string;
  asOf: string;
  weight: number;
  dismissible: boolean;
  note: string;
}

const FACTORS: Factor[] = [
  { id: "osha", label: "OSHA violation on file", source: "OSHA inspection records", asOf: "2019", weight: 22, dismissible: true, note: "Violation closed and corrected, 6 years ago. Still counted at full weight until dismissed." },
  { id: "lawsuit", label: "Active litigation mention", source: "News and court filings", asOf: "2024", weight: 18, dismissible: false, note: "Recent, keeps full weight." },
  { id: "crime", label: "Elevated crime score, facility zip", source: "Third-party crime index", asOf: "2026", weight: 14, dismissible: false, note: "Current, keeps full weight." },
  { id: "safer", label: "Clean SAFER/DOT record", source: "FMCSA SAFER", asOf: "2026", weight: -6, dismissible: false, note: "Offsets risk, stays in the total either way." },
];

const BASE_SCORE = 52;

export default function KalepaRiskBreakdownDemo({ accentColor, bgDark }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const activeFactors = FACTORS.filter((f) => !dismissed.has(f.id));
  const score = Math.max(0, Math.min(100, BASE_SCORE + activeFactors.reduce((s, f) => s + f.weight, 0)));
  const band = score >= 70 ? "Elevated" : score >= 45 ? "Moderate" : "Low";
  const bandColor = score >= 70 ? "#ef4444" : score >= 45 ? "#f59e0b" : "#22c55e";

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
          <span className="text-[10.5px] text-white/40 ml-2">submission :: risk-score-breakdown</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Every point in the score traces to one factor, one source, one as-of date. Stale factors keep full
            weight until an underwriter explicitly dismisses them, the score doesn't age things out on its own.
          </p>

          <div
            className="rounded-lg px-3 py-3 mb-4 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${bandColor}44` }}
          >
            <span className="text-[10.5px] text-white/70">Overall risk score</span>
            <motion.span
              key={score}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              className="text-[16px] font-semibold tabular-nums"
              style={{ color: bandColor }}
            >
              {score} <span className="text-[10px]">{band}</span>
            </motion.span>
          </div>

          <div className="space-y-1.5 mb-3">
            <AnimatePresence initial={false}>
              {FACTORS.map((f) => {
                const isDismissed = dismissed.has(f.id);
                return (
                  <motion.div
                    key={f.id}
                    layout
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isDismissed ? 0.35 : 1 }}
                    className="rounded-lg px-3 py-2.5"
                    style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10.5px] text-white/75" style={{ textDecoration: isDismissed ? "line-through" : "none" }}>
                        {f.label}
                      </span>
                      <span className="text-[10px] tabular-nums flex-shrink-0" style={{ color: f.weight >= 0 ? "#f59e0b" : "#22c55e" }}>
                        {f.weight >= 0 ? "+" : ""}{f.weight}
                      </span>
                    </div>
                    <p className="text-[9px] text-white/35">{f.source} · as of {f.asOf}</p>
                    <p className="text-[9px] text-white/30 mt-1">{f.note}</p>
                    {f.dismissible && (
                      <button
                        onClick={() =>
                          setDismissed((prev) => {
                            const next = new Set(prev);
                            if (next.has(f.id)) next.delete(f.id);
                            else next.add(f.id);
                            return next;
                          })
                        }
                        className="mt-1.5 text-[9px] underline decoration-white/20"
                        style={{ color: accentColor }}
                      >
                        {isDismissed ? "restore this factor" : "dismiss, resolved 2019"}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <p className="text-[9px] text-white/30">Base 52 + sum of active factors, clamped 0-100.</p>
        </div>
      </div>
    </div>
  );
}
