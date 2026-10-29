"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "spv" | "allocated";

export default function AllocatePooledRemainderDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("spv");

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
          <span className="text-[10.5px] text-white/40 ml-2">capital call :: aggregated SPV, 14 underlying investors</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Allocate's own pitch is aggregating smaller tickets into a single LP position. The fund calls that
            one position, but the money owed actually belongs to 14 people in uneven, fractional proportions.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("spv")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "spv" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "spv" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              call at the SPV level
            </button>
            <button
              onClick={() => setMode("allocated")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "allocated" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "allocated" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              allocated to each investor
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">capital call from the fund</span>
                <span className="text-[9.5px] text-white/60">$250,000.00</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">{mode === "spv" ? "what the SPV owes, in total" : "sum of all 14 rounded investor shares"}</span>
                <span className="text-[9.5px] text-white/60">{mode === "spv" ? "$250,000.00, one clean number" : "$249,998.60"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "allocated" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "allocated" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "spv"
                ? "At the SPV level this is one wire for one clean number. Nothing here shows that it's actually 14 fractional unit balances, each rounded to the cent, about to be added back together."
                : "Each investor's pro-rata share gets rounded to the cent, and the rounded pieces don't sum back to $250,000.00 exactly. $1.40 is now unaccounted for, and someone has to own the rule for where it goes: the largest holder, spread pro-rata, or the house."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
