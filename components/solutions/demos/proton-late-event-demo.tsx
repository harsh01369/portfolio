"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "snapshot" | "reconciled";

export default function ProtonLateEventDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("snapshot");

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
          <span className="text-[10.5px] text-white/40 ml-2">Data Layer :: Prophet 21 inventory event, HVAC-X200</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            The ERP sells the last unit by phone 6 minutes after this hour's curated snapshot already built.
            What the rep sees next depends on whether that late event gets reconciled before it's served.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("snapshot")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "snapshot" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "snapshot" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              curated snapshot, as-is
            </button>
            <button
              onClick={() => setMode("reconciled")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "reconciled" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "reconciled" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              late event reconciled
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">curated layer, HVAC-X200 stock</span>
                <span className="text-[9.5px] text-white/60">40 units, built 9:00am</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">ERP event, phone sale at 9:06am</span>
                <span className="text-[9.5px] text-white/60">0 units remaining</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "reconciled" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "reconciled" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "snapshot"
                ? "The AI brain still sees 40 units, so it tells the rep to pitch HVAC-X200 to a waiting customer. Nothing in this path looked broken, the number was just already six minutes stale by the time anyone read it."
                : "The late event lands before serving, the curated number drops to zero, and the recommendation either disappears or routes to a substitute part instead of promising stock that's already gone."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
