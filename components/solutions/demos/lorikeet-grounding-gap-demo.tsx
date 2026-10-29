"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "grounded-only" | "verified";

export default function LorikeetGroundingGapDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("grounded-only");

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
          <span className="text-[10.5px] text-white/40 ml-2">ticket :: "what's your return window?"</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Lorikeet's own published view: retrieval grounding alone doesn't stop hallucination, a model can pull the
            exact right doc and still summarize it wrong. The same retrieved source, two different paths from there.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("grounded-only")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "grounded-only" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "grounded-only" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              retrieval grounding only
            </button>
            <button
              onClick={() => setMode("verified")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "verified" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "verified" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              grounded + verified
            </button>
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-[9.5px] text-white/55">retrieved policy doc: "Returns accepted within 30 days of delivery, except final sale items."</span>
          </div>

          <div
            className="rounded-lg px-3 py-3 mb-4"
            style={{
              background: mode === "verified" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "verified" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] leading-relaxed text-white/70">
              {mode === "grounded-only"
                ? "\"You have 30 days from your purchase date to return it!\" Right document, wrong anchor date, and the final-sale exception quietly dropped."
                : "\"Returns are accepted within 30 days of delivery, though final sale items can't be returned.\" Checked against the source line by line before it goes out."}
            </motion.p>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <p className="text-[9.5px] leading-relaxed text-white/55">
              The correct document was retrieved both times. The gap is what happens between retrieval and the
              words a customer actually reads, exactly the step grounding alone doesn't cover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
