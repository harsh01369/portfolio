"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "quiet" | "ingesting";

export default function ImplyCompactionLockDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("quiet");

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
          <span className="text-[10.5px] text-white/40 ml-2">datasource :: clicks_2026 :: hour interval</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Druid's own docs state the rule: compaction locks the interval it's merging, and if an ingestion task
            needs that same interval, ingestion wins by default, the compaction task fails without finishing.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("quiet")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "quiet" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "quiet" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              no new ingestion
            </button>
            <button
              onClick={() => setMode("ingesting")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "ingesting" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "ingesting" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              late event lands mid-compaction
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">compaction task, merging 40 small segments into 1</span>
                <span className="text-[9px]" style={{ color: mode === "quiet" ? accentColor : "#f59e0b" }}>
                  {mode === "quiet" ? "holds the lock, runs to completion" : "superseded, exits without finishing"}
                </span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">late Kafka event for this same hour</span>
                <span className="text-[9px] text-white/40">{mode === "ingesting" ? "arrives, needs the interval now" : "none"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "quiet"
                ? "No contention, the merge completes and the hour ends up as one well-sized segment."
                : "The ingestion task takes the interval, the compaction task is superseded mid-merge, and the hour stays fragmented into 40 small segments until something retries the compaction."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
