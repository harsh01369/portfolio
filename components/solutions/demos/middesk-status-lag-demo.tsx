"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "unaware" | "aware";
type Phase = "idle" | "dissolved" | "decision" | "done";

export default function MiddeskStatusLagDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("aware");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("dissolved");
    window.setTimeout(() => setPhase("decision"), 750);
    window.setTimeout(() => setPhase("done"), 1600);
  }

  const dissolved = phase !== "idle";
  const deciding = phase === "decision" || phase === "done";
  const done = phase === "done";
  const missed = mode === "unaware" && done;

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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Registration status monitor</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["unaware", "aware"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="middesk-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "unaware" ? "Cached snapshot" : "Live propagation"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Business on file</p>
            <p className="text-white text-xs font-semibold mb-1">Ridgeline Freight LLC</p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">EIN on file, status: Active, last verified 11 days ago</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: dissolved ? "#F87171" : "rgba(255,255,255,0.1)",
                background: dissolved ? "#F8717112" : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Secretary of state, live</p>
              <p className="text-white/70 text-[10.5px]">{dissolved ? "Status changed: Administratively Dissolved" : "Status: Active"}</p>
            </motion.div>
            <motion.div
              animate={{
                borderColor: deciding ? accentColor : "rgba(255,255,255,0.1)",
                background: deciding ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Decision engine</p>
              <p className="text-white/70 text-[10.5px]">{deciding ? "Approving a new credit line for Ridgeline..." : "Idle"}</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Change the business&apos;s real-world status
            </button>
          </div>

          <div className="min-h-[100px]">
            <AnimatePresence mode="wait">
              {dissolved && !done && (
                <motion.div
                  key={`working-${runKey}`}
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
                    {phase === "dissolved" && "State registry updated..."}
                    {phase === "decision" && (mode === "aware" ? "Re-pulling live status before deciding..." : "Deciding against the 11-day-old snapshot...")}
                  </span>
                </motion.div>
              )}
              {done && (
                <motion.div
                  key={`done-${runKey}-${mode}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{
                    background: missed ? "#F8717122" : `${accentColor}14`,
                    border: `1px solid ${missed ? "#F87171" : accentColor}55`,
                  }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {missed ? "Credit line approved for a dissolved entity" : "Credit line held, status re-verified"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {missed
                      ? "Decisions in seconds, sourced from a snapshot that was 11 days old. The dissolution happened after that snapshot was taken, so the decision engine never saw it."
                      : "Re-pulling the live registry before the decision caught the dissolution that happened after the last cached snapshot, before it reached the ledger."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Aggregated and refreshed doesn&apos;t say how fast. Change the registry and see what a decision
                  made in between actually sees.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
