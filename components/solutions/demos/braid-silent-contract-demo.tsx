"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "merged" | "caught";

export default function BraidSilentContractDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("merged");

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
          <span className="text-[10.5px] text-white/40 ml-2">settlement-split.java :: AI-generated diff</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            An AI agent refactors a settlement-splitting method and swaps the rounding mode. Tests still pass,
            the diff still compiles, and nothing about it looks wrong unless you know what a silent contract
            change on a money path actually looks like.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("merged")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "merged" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "merged" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              merged without catching it
            </button>
            <button
              onClick={() => setMode("caught")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "caught" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "caught" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              caught before merge
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5 font-mono" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="text-[9px] text-red-400/70 line-through">amount.setScale(2, RoundingMode.HALF_UP)</div>
              <div className="text-[9px] text-emerald-400/80">amount.setScale(2, RoundingMode.HALF_EVEN)</div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">nightly settlement batch, 10,000 split payments</span>
                <span className="text-[9.5px] text-white/60">{mode === "merged" ? "214 transactions land 1 cent lower" : "batch blocked pending sign-off"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "caught" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "caught" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "merged"
                ? "Every existing test still passes, because none of them happened to assert on a value sitting exactly on a rounding boundary. The drift is real money, and it ships quietly in the next settlement run."
                : "A reviewer who knows this failure pattern flags the rounding-mode change as a financial-correctness issue before merge, not a style nit, and the batch waits for an explicit sign-off instead of running on faith."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
