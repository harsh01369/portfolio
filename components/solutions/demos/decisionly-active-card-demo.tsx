"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "active" | "inactive";

export default function DecisionlyActiveCardDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("active");

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
          <span className="text-[10.5px] text-white/40 ml-2">POST /v2/issuer/cases :: dispute.reason = fraud</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Decisionly's own API schema requires card.is_active to be false before it will accept fraud evidence.
            Whether that field actually got flipped depends on an entirely separate workflow: card blocking.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("active")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "active" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "active" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              card.is_active: true
            </button>
            <button
              onClick={() => setMode("inactive")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "inactive" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "inactive" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              card.is_active: false
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">cardholder-reported fraud, disputed amount</span>
                <span className="text-[9.5px] text-white/60">$340.00</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">card record, has it actually been blocked</span>
                <span className="text-[9.5px] text-white/60">{mode === "active" ? "still showing active" : "blocked after the report"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "inactive" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "inactive" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "active"
                ? "The fraud case waits on a field nobody told it to watch. If card blocking runs on its own schedule and the dispute gets filed first, the evidence submission stalls on a precondition the dispute team can't see or fix from their side."
                : "Once the card's actually blocked, the same fraud case clears the precondition and the evidence bundle submits cleanly. The dispute was never the hard part, the card-blocking workflow finishing first was."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
