"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "batch" | "event";

export default function VirtaBatchVsEventDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("batch");

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
          <span className="text-[10.5px] text-white/40 ml-2">patient app :: glucose reading logged</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Spark has run on batch/async since early days, a deliberate speed-over-scalability call at the time. The
            tradeoff: how fast a reading that needs a same-day medication adjustment actually reaches a coach.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("batch")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "batch" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "batch" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              batch/async sync
            </button>
            <button
              onClick={() => setMode("event")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "event" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "event" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              event-driven push
            </button>
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] text-white/55">reading: 58 mg/dL, flagged low, logged 10:41am</span>
              <span className="text-[9px] text-white/35">patient app → Spark</span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{
              background: mode === "event" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "event" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9.5px] text-white/55">coach sees it on the care queue</span>
              <span className="text-[9.5px] font-semibold" style={{ color: mode === "event" ? accentColor : "#f59e0b" }}>
                {mode === "batch" ? "next sync window" : "10:41am, immediately"}
              </span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "batch"
                ? "Batch/async means this reading sits until the next scheduled sync picks it up, fine for routine logging, not for a low reading that needs same-day adjustment."
                : "Event-driven means the low reading pushes to the coach's queue the moment it's logged, no waiting on the next sync window."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
