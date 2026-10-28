"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function WasmerSnapshotClockDemo({ accentColor, bgDark }: Props) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [resumed, setResumed] = useState(false);

  const snapshotClock = "14:02:07.112";
  const realClockAtResume = `14:02:${(7 + Math.floor(elapsedMs / 1000)).toString().padStart(2, "0")}.${(elapsedMs % 1000).toString().padStart(3, "0")}`;

  const advance = () => {
    setElapsedMs((e) => e + 340);
    setResumed(true);
  };

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
          <span className="text-[10.5px] text-white/40 ml-2">instaboot :: snapshot resume, cold request</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Your own docs call out clock reads and active sockets as the exceptions to a
            deterministic snapshot. Everything else can safely replay. The clock can't, because
            real time kept moving while the snapshot sat idle.
          </p>

          <button
            onClick={advance}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity mb-4"
            style={{ background: accentColor, color: bgDark }}
          >
            Cold request arrives, resume from snapshot
          </button>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[10px] text-white/70">clock value frozen in snapshot</span>
              <span className="text-[10px] tabular-nums" style={{ color: accentColor }}>{snapshotClock}</span>
            </div>
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: resumed ? `${accentColor}14` : "rgba(255,255,255,0.025)", border: `1px solid ${resumed ? `${accentColor}55` : "rgba(255,255,255,0.07)"}` }}>
              <span className="text-[10px] text-white/70">real wall-clock at resume</span>
              <motion.span key={elapsedMs} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tabular-nums" style={{ color: accentColor }}>
                {resumed ? realClockAtResume : "not yet resumed"}
              </motion.span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: resumed ? "#22c55e14" : "rgba(255,255,255,0.03)", border: `1px solid ${resumed ? "#22c55e55" : `${accentColor}44`}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: resumed ? "#86efac" : "rgba(255,255,255,0.55)" }}>
              {resumed
                ? `Every resume re-reads the real clock instead of replaying the frozen value, so the runtime correctly reports ${realClockAtResume} rather than the stale ${snapshotClock} the snapshot was taken at. That's deliberate, not automatic, every clock call has to be caught and re-executed rather than replayed like the rest of the snapshotted state.`
                : "Resume a few times and watch how far the real clock has to jump from the frozen snapshot value."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
