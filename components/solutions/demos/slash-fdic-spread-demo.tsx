"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "single" | "spread";
type Phase = "idle" | "depositing" | "done";

export default function SlashFdicSpreadDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("single");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("depositing");
    window.setTimeout(() => setPhase("done"), 900);
  }

  const depositing = phase === "depositing";
  const done = phase === "done";

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Deposit coverage visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["single", "spread"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="slash-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "single" ? "Single bank" : "IntraFi network"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Corporate balance</p>
            <p className="text-white text-xs font-semibold mb-1 font-mono tabular-nums">$14,200,000.00</p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">
              {mode === "single" ? "held at one bank" : "swept across the 800-bank network"}
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Check FDIC coverage
            </button>
          </div>

          <div className="min-h-[90px]">
            <AnimatePresence mode="wait">
              {depositing && (
                <motion.div
                  key={`depositing-${runKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 pt-3"
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                  <span className="text-white/40 text-[11px]">Checking coverage...</span>
                </motion.div>
              )}
              {done && (
                <motion.div
                  key={`done-${runKey}-${mode}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1 font-mono tabular-nums">
                    {mode === "single" ? "$250,000.00 insured, $13,950,000.00 exposed" : "$14,200,000.00 insured"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {mode === "single"
                      ? "Standard FDIC coverage caps at $250K per depositor per bank. Everything above that at one bank is uninsured."
                      : "Slash's own site says deposit partners spread balances across their network of 800 banks, extending coverage to hundreds of millions, which is what actually makes a balance this size fully insured."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Check the same large balance against a single bank and against the IntraFi network to see how much
                  is actually insured.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
