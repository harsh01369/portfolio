"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "semantic" | "hybrid" | "keyword";

const MODES: Record<Mode, { label: string; alpha: number }> = {
  semantic: { label: "alpha = 1.0 (semantic only)", alpha: 1.0 },
  hybrid: { label: "alpha = 0.5 (hybrid default)", alpha: 0.5 },
  keyword: { label: "alpha = 0.0 (keyword only)", alpha: 0.0 },
};

const DOC_A = { name: "\"Having trouble signing in to your account\"", vector: 0.91, bm25: 0.12 };
const DOC_B = { name: "\"How to log in on a new device\"", vector: 0.58, bm25: 0.89 };

function score(doc: typeof DOC_A, alpha: number) {
  return alpha * doc.vector + (1 - alpha) * doc.bm25;
}

export default function MossAlphaBlendDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("hybrid");
  const alpha = MODES[mode].alpha;
  const scoreA = score(DOC_A, alpha);
  const scoreB = score(DOC_B, alpha);
  const aWins = scoreA >= scoreB;

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
          <span className="text-[10.5px] text-white/40 ml-2">query :: "can't log in"</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Hybrid retrieval blends the vector score and the BM25 keyword score with one alpha parameter.
            Same two documents, same query, same index, different alpha, different top result.
          </p>

          <div className="flex items-center gap-1.5 mb-4">
            {(Object.keys(MODES) as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="text-[9.5px] px-2.5 py-1 rounded-md"
                style={{
                  background: mode === m ? accentColor : "rgba(255,255,255,0.08)",
                  color: mode === m ? bgDark : "rgba(255,255,255,0.6)",
                }}
              >
                {MODES[m].label}
              </button>
            ))}
          </div>

          <div className="space-y-2 mb-4">
            <div
              className="rounded-lg px-3 py-2.5"
              style={{
                background: aWins ? `${accentColor}18` : "rgba(255,255,255,0.025)",
                border: aWins ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] text-white/55">{DOC_A.name}</span>
                {aWins && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-semibold" style={{ color: accentColor }}>
                    #1
                  </motion.span>
                )}
              </div>
              <span className="text-[9px] text-white/35">
                vector 0.91 &middot; bm25 0.12 &middot; combined {scoreA.toFixed(2)}
              </span>
            </div>

            <div
              className="rounded-lg px-3 py-2.5"
              style={{
                background: !aWins ? `${accentColor}18` : "rgba(255,255,255,0.025)",
                border: !aWins ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] text-white/55">{DOC_B.name}</span>
                {!aWins && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-semibold" style={{ color: accentColor }}>
                    #1
                  </motion.span>
                )}
              </div>
              <span className="text-[9px] text-white/35">
                vector 0.58 &middot; bm25 0.89 &middot; combined {scoreB.toFixed(2)}
              </span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <p className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "semantic"
                ? "Pure semantic similarity ranks the sign-in-trouble doc first, even without a shared keyword."
                : mode === "keyword"
                ? "Pure keyword overlap ranks the new-device doc first, because it literally contains \"log in.\""
                : "At the default 0.5 blend, the keyword match wins anyway, the crossover point for this pair sits closer to alpha 0.7."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
