"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function SphinxAntennaContentionDemo({ accentColor, bgDark }: Props) {
  const [pooled, setPooled] = useState(false);

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
          <span className="text-[10.5px] text-white/40 ml-2">schedule :: dish-7, 14:00-14:12 UTC contact window</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A legacy parabolic dish talks to exactly one satellite at a time. Two operators
            wanting the same 12 minute window on the same dish is a hard conflict, not a
            scheduling nuance, unless there's a wider pool to draw from.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setPooled(false)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: !pooled ? accentColor : "rgba(255,255,255,0.08)", color: !pooled ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              legacy SCN, dish-7 only
            </button>
            <button
              onClick={() => setPooled(true)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: pooled ? accentColor : "rgba(255,255,255,0.08)", color: pooled ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              pooled marketplace
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[10px] text-white/70">Operator A requests dish-7, 14:00-14:12 UTC</span>
              <span className="text-[9.5px] text-emerald-400">confirmed</span>
            </div>
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: !pooled ? "#ef444414" : "rgba(255,255,255,0.025)", border: `1px solid ${!pooled ? "#ef444455" : "rgba(255,255,255,0.07)"}` }}>
              <span className="text-[10px] text-white/70">Operator B requests dish-7, 14:03-14:09 UTC</span>
              <motion.span key={String(pooled)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] font-semibold" style={{ color: pooled ? "#4ade80" : "#ef4444" }}>
                {pooled ? "reassigned to dish-12" : "conflict, queued"}
              </motion.span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: pooled ? "#22c55e14" : "#ef444414", border: `1px solid ${pooled ? "#22c55e55" : "#ef444455"}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: pooled ? "#86efac" : "#fca5a5" }}>
              {pooled
                ? "Pooling commercial and government antennas gives the scheduler somewhere to put Operator B instead of a conflict. Dish-12 covers the same ground track in the same window."
                : "On a single dedicated dish, Operator B just waits. Against 19 dishes covering the whole globe, this kind of overlap is exactly the congestion the legacy Satellite Control Network runs into."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
