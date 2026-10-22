"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "standard" | "priority";
type Phase = "idle" | "changed" | "ingesting" | "reconciling" | "verified";
type QueryState = "none" | "stale" | "verified";

const WINDOW_MS: Record<Mode, number> = { standard: 4200, priority: 1400 };
const REAL_SECONDS: Record<Mode, number> = { standard: 90, priority: 12 };

const STAGES: { key: Phase; label: string }[] = [
  { key: "changed", label: "Real network updated" },
  { key: "ingesting", label: "Twin ingest" },
  { key: "reconciling", label: "Reconcile" },
  { key: "verified", label: "Intent checks re-verified" },
];

export default function ForwardTwinFreshnessDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("standard");
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [queryState, setQueryState] = useState<QueryState>("none");
  const [runKey, setRunKey] = useState(0);
  const startRef = useRef(0);

  useEffect(() => {
    if (phase === "idle" || phase === "verified") return;
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - startRef.current);
    }, 80);
    return () => window.clearInterval(id);
  }, [phase]);

  function pushChange() {
    const total = WINDOW_MS[mode];
    setRunKey((k) => k + 1);
    setQueryState("none");
    setElapsedMs(0);
    startRef.current = Date.now();
    setPhase("changed");
    window.setTimeout(() => setPhase("ingesting"), total * 0.25);
    window.setTimeout(() => setPhase("reconciling"), total * 0.55);
    window.setTimeout(() => setQueryState("stale"), total * 0.4);
    window.setTimeout(() => {
      setPhase("verified");
      setQueryState("verified");
      setElapsedMs(total);
    }, total);
  }

  const stageIndex = STAGES.findIndex((s) => s.key === phase);
  const windowMs = WINDOW_MS[mode];
  const progress = windowMs > 0 ? Math.min(elapsedMs / windowMs, 1) : 0;
  const secondsLabel = (REAL_SECONDS[mode] * progress).toFixed(0);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Twin freshness visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["standard", "priority"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="fwd-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "standard" ? "Standard sync" : "Priority sync"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-white/35 text-[9.5px] uppercase tracking-wider">Staleness window</span>
            <span
              className="text-sm font-mono tabular-nums"
              style={{ color: phase === "verified" ? accentColor : "white" }}
            >
              {secondsLabel}s / {REAL_SECONDS[mode]}s
            </span>
          </div>
          <div className="h-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: accentColor }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ ease: "linear", duration: 0.08 }}
            />
          </div>

          <div className="relative flex items-center justify-between mb-5 px-1">
            <div
              className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
            {STAGES.map((stage, i) => {
              const reached = stageIndex >= i;
              return (
                <div key={`${runKey}-${stage.key}`} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                  <motion.div
                    animate={{
                      scale: stageIndex === i ? 1.15 : 1,
                      background: reached ? accentColor : "rgba(255,255,255,0.08)",
                      borderColor: reached ? accentColor : "rgba(255,255,255,0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="w-7 h-7 rounded-full flex items-center justify-center border"
                    style={{ color: reached ? bgDark : "rgba(255,255,255,0.4)" }}
                  >
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  </motion.div>
                  <span
                    className="text-[8px] text-center leading-tight max-w-[62px]"
                    style={{ color: reached ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={pushChange}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Push firewall rule change
            </button>
          </div>

          <div className="min-h-[70px]">
            <AnimatePresence mode="wait">
              {queryState === "stale" && (
                <motion.div
                  key={`stale-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)" }}
                >
                  <p className="text-white text-xs font-semibold mb-1">In-flight query flagged: STALE</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    A blast-radius query fired inside the staleness window is marked against the twin&apos;s
                    last-reconciled state, not the live network, so it can&apos;t be trusted yet.
                  </p>
                </motion.div>
              )}
              {queryState === "verified" && (
                <motion.div
                  key={`verified-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Query re-verified: CLEAN</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    Twin reconciled in {REAL_SECONDS[mode]}s. The same query now runs against current state, affected
                    intent checks re-passed with no flagged paths.
                  </p>
                </motion.div>
              )}
              {queryState === "none" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Push a change and watch how long the twin stays behind reality, and what that means for queries
                  running during the gap.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
