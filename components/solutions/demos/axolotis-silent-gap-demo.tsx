"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "silent" | "loud";

export default function AxolotisSilentGapDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("silent");

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
          <span className="text-[10.5px] text-white/40 ml-2">AxHydro-Opt :: inflow ingestion, Unit 3</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A customer's inflow forecast workbook arrives with one blank cell, a sensor dropout at hour 14.
            What happens next depends entirely on whether the ingestion layer is built to fail loudly or quietly.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("silent")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "silent" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "silent" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              silent fallback
            </button>
            <button
              onClick={() => setMode("loud")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "loud" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "loud" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              fails loudly
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">Unit 3, hour 14, forecasted inflow</span>
                <span className="text-[9.5px] text-white/60">(blank cell)</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">what the optimization engine receives</span>
                <span className="text-[9.5px] text-white/60">{mode === "silent" ? "hour 13's value, carried forward" : "nothing, flagged as a gap"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "loud" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "loud" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "silent"
                ? "The gap gets quietly filled and a full Unit 3 schedule comes out the other side, looking exactly as confident as every other hour. An operator approves it without ever knowing hour 14 was a guess."
                : "Unit 3's schedule halts at hour 14 and routes to the audit log for human review instead of guessing. The operator sees exactly where the real data ran out, before approving anything downstream of it."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
