"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "continuous" | "combinatorial";

export default function OneChronosCombinatorialMatchDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("continuous");

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
          <span className="text-[10.5px] text-white/40 ml-2">book :: two conditional orders, same auction window</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Order A only clears if it can pair with Order B at a combined net price. Neither leg clears on its own.
            Under price-time priority, that pair is exactly the kind of mutually beneficial trade that can go unrecognized.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("continuous")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "continuous" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "continuous" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              continuous, price-time priority
            </button>
            <button
              onClick={() => setMode("combinatorial")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "combinatorial" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "combinatorial" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              combinatorial auction, batch
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">Order A: sell X @ 41.20, only if paired with buying Y @ 18.05</span>
                <span className="text-[9px]" style={{ color: mode === "continuous" ? "#f59e0b" : accentColor }}>
                  {mode === "continuous" ? "leg alone: no fill" : "evaluated as bundle"}
                </span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">Order B: buy X @ 41.20, only if paired with selling Y @ 18.05</span>
                <span className="text-[9px]" style={{ color: mode === "continuous" ? "#f59e0b" : accentColor }}>
                  {mode === "continuous" ? "leg alone: no fill" : "evaluated as bundle"}
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: mode === "combinatorial" ? `${accentColor}18` : "rgba(239,68,68,0.08)", border: mode === "combinatorial" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)" }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "continuous"
                ? "Each leg is matched against the book one at a time. Neither order's standalone limit is met, so the book shows no trade, even though the pair is a mutually beneficial match at the combined price."
                : "The solver evaluates both orders together as one package, finds the combined price that clears both legs at once, and executes the pair in the same auction."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
