"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

const NODES = [
  { label: "Acute EMR", sub: "Hospital discharge" },
  { label: "WellBeam", sub: "Transition layer" },
  { label: "Home-health EMR", sub: "Post-acute intake" },
];

const CONTROLS = [
  { label: "Encryption in transit", at: 0.1 },
  { label: "IAM-scoped access boundary", at: 0.38 },
  { label: "Container / dependency scan", at: 0.62 },
  { label: "Audit-log write", at: 0.85 },
];

export default function WellbeamCareTransitionDemo({ accentColor, bgDark }: Props) {
  const [runKey, setRunKey] = useState(0);
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  function simulateHandoff() {
    setRunKey((k) => k + 1);
    setProgress(0);
    setRunning(true);
    const start = Date.now();
    const duration = 2600;
    function tick() {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / duration);
      setProgress(p);
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setRunning(false);
      }
    }
    requestAnimationFrame(tick);
  }

  const complete = progress >= 1;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-7">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Care-transition security trace</p>
            <button
              onClick={simulateHandoff}
              disabled={running}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ background: accentColor, color: bgDark }}
            >
              {running ? "In transit..." : "Simulate discharge handoff"}
            </button>
          </div>

          <div className="relative mb-6 px-2">
            <div className="absolute left-5 right-5 top-3.5 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            <motion.div
              key={runKey}
              className="absolute top-3.5 h-px origin-left"
              style={{ left: "20px", right: "20px", background: accentColor }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress }}
              transition={{ duration: 0.05, ease: "linear" }}
            />
            <div className="relative flex justify-between">
              {NODES.map((node, i) => {
                const nodeProgress = i / (NODES.length - 1);
                const reached = progress >= nodeProgress - 0.02;
                return (
                  <div key={node.label} className="flex flex-col items-center gap-2 w-20">
                    <motion.div
                      animate={{
                        background: reached ? accentColor : "rgba(255,255,255,0.08)",
                        scale: reached && progress < 1 && Math.abs(progress - nodeProgress) < 0.05 ? 1.25 : 1,
                      }}
                      className="w-7 h-7 rounded-full border flex items-center justify-center z-10"
                      style={{ borderColor: reached ? accentColor : "rgba(255,255,255,0.15)" }}
                    >
                      <span className="text-[10px] font-bold" style={{ color: reached ? bgDark : "rgba(255,255,255,0.4)" }}>
                        {i + 1}
                      </span>
                    </motion.div>
                    <div className="text-center">
                      <p
                        className="text-[9.5px] font-medium leading-tight"
                        style={{ color: reached ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)" }}
                      >
                        {node.label}
                      </p>
                      <p className="text-white/25 text-[8px] leading-tight">{node.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-5">
            {CONTROLS.map((control) => {
              const fired = progress >= control.at;
              return (
                <motion.div
                  key={`${runKey}-${control.label}`}
                  animate={{
                    background: fired ? `${accentColor}14` : "rgba(255,255,255,0.03)",
                    borderColor: fired ? `${accentColor}55` : "rgba(255,255,255,0.08)",
                  }}
                  className="rounded-lg px-3 py-2 border flex items-center gap-2"
                >
                  <motion.span
                    animate={{ background: fired ? accentColor : "rgba(255,255,255,0.15)" }}
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                  />
                  <span
                    className="text-[9.5px] leading-tight"
                    style={{ color: fired ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}
                  >
                    {control.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="min-h-[70px]">
            <AnimatePresence mode="wait">
              {complete ? (
                <motion.div
                  key={`summary-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Per-record attestation: 4/4 controls fired</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    This discharge record moved from acute EMR to home-health EMR with every infra control logged
                    at the moment it fired, not inferred after the fact. That per-record trail is what a SOC2 or
                    HIPAA auditor asks for at the highest-risk handoff in the chart.
                  </p>
                </motion.div>
              ) : (
                <p className="text-white/30 text-[11px] text-center pt-5">
                  {progress === 0
                    ? "Discharge data crosses an organizational boundary here, acute to post-acute, the moment handoffs usually go unlogged."
                    : "Record in transit, controls firing as each boundary is crossed..."}
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
