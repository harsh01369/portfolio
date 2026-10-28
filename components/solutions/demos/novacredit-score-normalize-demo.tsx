"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function NovaCreditScoreNormalizeDemo({ accentColor, bgDark }: Props) {
  const [normalized, setNormalized] = useState(false);

  const rawScore = 612;
  const rawScale = "0-999 (UK Experian scale)";
  const rawPercentile = 71;
  const localEquivalentScore = 718;
  const localScale = "300-850 (US FICO-equivalent scale)";

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
          <span className="text-[10.5px] text-white/40 ml-2">underwrite :: new-to-US applicant, UK credit history</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            An applicant's only credit history is from a UK bureau on a 0-999 scale. A US lender
            reading that number against a FICO scale it was never built for will misread it, not
            because the applicant is risky, but because the scale is foreign.
          </p>

          <button
            onClick={() => setNormalized((n) => !n)}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity mb-4"
            style={{ background: accentColor, color: bgDark }}
          >
            {normalized ? "View raw foreign bureau record" : "Convert to local-equivalent score"}
          </button>

          <div className="rounded-lg px-3 py-3 mb-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {!normalized ? (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-white/55">raw score</span>
                  <span className="text-[13px] font-bold tabular-nums" style={{ color: accentColor }}>{rawScore}</span>
                </div>
                <span className="text-[9px] text-white/35">{rawScale}, {rawPercentile}th percentile among UK filers</span>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-white/55">local-equivalent score</span>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] font-bold tabular-nums" style={{ color: accentColor }}>{localEquivalentScore}</motion.span>
                </div>
                <span className="text-[9px] text-white/35">{localScale}, mapped from the same {rawPercentile}th percentile</span>
              </>
            )}
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: normalized ? "#22c55e14" : "#ef444414", border: `1px solid ${normalized ? "#22c55e55" : "#ef444455"}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: normalized ? "#86efac" : "#fca5a5" }}>
              {normalized
                ? "718 reads as a solidly good US applicant, because this person is one. Converting by percentile rank, not by treating the raw number as if it were already on a US scale, is what keeps the risk signal intact across the border."
                : "612 out of 999 looks mediocre to someone expecting FICO's 300-850 range. On its native scale, it's actually a strong score, the 71st percentile of UK filers. Read cold, a US underwriter could easily decline a genuinely creditworthy applicant."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
