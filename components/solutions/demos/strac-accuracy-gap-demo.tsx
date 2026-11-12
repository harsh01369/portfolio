"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "caught" | "missed";
type Phase = "idle" | "scanning" | "done";

export default function StracAccuracyGapDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("caught");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("scanning");
    window.setTimeout(() => setPhase("done"), 900);
  }

  const scanning = phase === "scanning";
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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Pre-upload scan visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["caught", "missed"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="strac-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "caught" ? "Standard pattern" : "Obfuscated pattern"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">GenAI upload intercepted</p>
            <p className="text-white text-xs font-semibold mb-1 font-mono">
              {mode === "caught" ? "SSN: 412-69-8831" : "SSN: four-one-two, six-nine, eight-eight-three-one"}
            </p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">pasted into prompt body</p>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Scan before upload
            </button>
          </div>

          <div className="min-h-[90px]">
            <AnimatePresence mode="wait">
              {scanning && (
                <motion.div
                  key={`scanning-${runKey}`}
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
                  <span className="text-white/40 text-[11px]">Scanning content in real-time...</span>
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
                    {mode === "caught" ? "Blocked: SSN detected" : "Passed through, nothing flagged"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {mode === "caught"
                      ? "Strac's own site says it scans content in real-time before it reaches GenAI tools, and a standard-format SSN is exactly the pattern that claim is built on."
                      : "Strac's own site calls its detection “very accurate” with no published accuracy figure. A spelled-out SSN reaching a GenAI tool unflagged is the risk that number would need to bound."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Scan the same SSN in standard format and spelled out to see which one a DLP pattern match actually
                  catches.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
