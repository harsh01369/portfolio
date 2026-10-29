"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "pedestrian" | "theft";

export default function ChipMotorsAsymmetricThresholdDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("pedestrian");

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
          <span className="text-[10.5px] text-white/40 ml-2">Chip :: perception, dusk parking lot</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            One detector, one confidence score, two decisions. The cost of missing a person isn't symmetric with
            the cost of a false alarm, so the same 34% reading gets opposite treatment depending on what it's for.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("pedestrian")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "pedestrian" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "pedestrian" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              stop-for-people threshold
            </button>
            <button
              onClick={() => setMode("theft")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "theft" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "theft" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              theft-alert threshold
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">detector output, person-shaped object</span>
                <span className="text-[9.5px] text-white/60">34% confidence</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">decision threshold in use</span>
                <span className="text-[9.5px] text-white/60">{mode === "pedestrian" ? "12% (biased to never miss)" : "80% (biased to rarely alert)"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "pedestrian" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "pedestrian" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "pedestrian"
                ? "34% clears the 12% bar, so Chip stops. A false stop costs a few seconds. A missed person doesn't get a second chance, so the threshold is tuned to let false positives through freely."
                : "34% doesn't clear the 80% bar, so no alert fires, only a logged frame. A theft alert that cries wolf gets muted by the owner within a week, so this threshold is tuned the opposite way: rare and right beats frequent and hedged."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
