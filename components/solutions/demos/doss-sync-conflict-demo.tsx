"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "sequential" | "simultaneous";
type Phase = "idle" | "erp" | "doss" | "reconciling" | "done";

export default function DossSyncConflictDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("simultaneous");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("erp");
    const dossDelay = mode === "simultaneous" ? 180 : 950;
    window.setTimeout(() => setPhase("doss"), dossDelay);
    window.setTimeout(() => setPhase("reconciling"), dossDelay + 350);
    window.setTimeout(() => setPhase("done"), dossDelay + 1050);
  }

  const erpDone = phase !== "idle";
  const dossDone = phase === "doss" || phase === "reconciling" || phase === "done";
  const reconciling = phase === "reconciling";
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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Ledger sync visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["sequential", "simultaneous"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="doss-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "sequential" ? "Staggered writes" : "Same-instant writes"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: erpDone ? accentColor : "rgba(255,255,255,0.1)",
                background: erpDone ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">ERP warehouse scan</p>
              <p className="text-white text-xs font-semibold mb-1">SKU-204</p>
              <p className="text-white/55 text-[10.5px] font-mono tabular-nums">
                {erpDone ? "100 to 88 units" : "100 units"}
              </p>
            </motion.div>

            <motion.div
              animate={{
                borderColor: dossDone ? accentColor : "rgba(255,255,255,0.1)",
                background: dossDone ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Dossbot chat command</p>
              <p className="text-white text-xs font-semibold mb-1">&quot;Move 2 units to Display A&quot;</p>
              <p className="text-white/55 text-[10.5px] font-mono tabular-nums">
                {dossDone ? "base 100, delta -2" : "queued"}
              </p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Trigger inventory event
            </button>
          </div>

          <div className="min-h-[78px]">
            <AnimatePresence mode="wait">
              {reconciling && (
                <motion.div
                  key={`reconciling-${runKey}`}
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
                    {mode === "simultaneous"
                      ? "Version conflict detected, rebasing Dossbot delta..."
                      : "Applying Dossbot delta to settled count..."}
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
                  <p className="text-white text-xs font-semibold mb-1 font-mono tabular-nums">Reconciled: 86 units</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {mode === "simultaneous"
                      ? "Both edits landed in the same window. Doss's version counter caught that Dossbot's command was issued against the stale count of 100, held it, and replayed the -2 delta against ERP's settled 88 instead of overwriting it."
                      : "ERP's scan settled first. Dossbot read the fresh count of 88 before issuing its command, so the -2 delta landed clean with no rebase needed."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Both systems can edit the same SKU. Trigger the event to see how Doss keeps them from silently
                  diverging.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
