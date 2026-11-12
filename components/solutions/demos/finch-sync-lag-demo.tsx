"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "claimed" | "realistic";
type Phase = "idle" | "fired" | "checking" | "done";

export default function FinchSyncLagDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("claimed");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("fired");
    const lag = mode === "claimed" ? 250 : 1400;
    window.setTimeout(() => setPhase("checking"), 450);
    window.setTimeout(() => setPhase("done"), 450 + lag);
  }

  const fired = phase !== "idle";
  const checking = phase === "checking" || phase === "done";
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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">HR sync visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["claimed", "realistic"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="finch-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "claimed" ? "Real-time (as claimed)" : "Realistic sync lag"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: fired ? accentColor : "rgba(255,255,255,0.1)",
                background: fired ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">HR system</p>
              <p className="text-white text-xs font-semibold mb-1">Employee #4821</p>
              <p className="text-white/55 text-[10.5px] font-mono tabular-nums">
                {fired ? "status: terminated" : "status: active"}
              </p>
            </motion.div>

            <motion.div
              animate={{
                borderColor: done ? accentColor : "rgba(255,255,255,0.1)",
                background: done ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Finch API read</p>
              <p className="text-white text-xs font-semibold mb-1">Benefits platform query</p>
              <p className="text-white/55 text-[10.5px] font-mono tabular-nums">
                {done ? "status: terminated" : checking ? "status: active" : "not yet queried"}
              </p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Fire termination event
            </button>
          </div>

          <div className="min-h-[78px]">
            <AnimatePresence mode="wait">
              {checking && !done && (
                <motion.div
                  key={`checking-${runKey}`}
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
                  <span className="text-white/40 text-[11px]">
                    {mode === "claimed" ? "Propagating change..." : "Waiting on next sync cycle..."}
                  </span>
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
                    Synced in {mode === "claimed" ? "0.3s" : "4.1s"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {mode === "claimed"
                      ? "If the propagation really is this fast every time, a benefits decision made moments after termination reads the correct status."
                      : "Finch's own site states '>99.9% platform uptime' and 'real-time visibility' but names no sync interval. A benefits decision made in this window still reads the employee as active."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  An employee gets terminated in the HR system. Fire the event to see how long the status takes to
                  actually reach a reader.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
