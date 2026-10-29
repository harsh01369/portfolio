"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "forced" | "abstain";

export default function AZXAbstentionDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("forced");

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
          <span className="text-[10.5px] text-white/40 ml-2">disaggregation :: whole-building meter, 2.1kW step</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            AZX's own posting ships disaggregation "with abstention and monitoring built in," because dispatch
            decisions downstream act on whichever device the model says drew that power, right or wrong.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("forced")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "forced" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "forced" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              forced best guess
            </button>
            <button
              onClick={() => setMode("abstain")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "abstain" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "abstain" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              abstains below threshold
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">top candidate: EV charger ramping</span>
                <span className="text-[9.5px] text-white/60">54% confidence</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">second candidate: water heater cycling</span>
                <span className="text-[9.5px] text-white/60">46% confidence</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "abstain" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "abstain" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "forced"
                ? "A 54-46 split still has to resolve to one label, so the dispatch program curtails the EV charger. If this was actually the water heater, the demand-response event hits the wrong asset and the EV keeps drawing power right through it."
                : "Below the confidence gap this model is built to trust, it reports ambiguous instead of picking one. The dispatch program defers to a fallback rule for this meter instead of acting on a guess."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
