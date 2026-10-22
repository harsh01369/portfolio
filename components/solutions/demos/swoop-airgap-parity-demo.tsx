"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "clean" | "drifted";

interface Component {
  name: string;
  cloudHash: string;
  airgapHash: string;
}

const COMPONENTS: Component[] = [
  { name: "SwoopOS Core", cloudHash: "a3f9c1e", airgapHash: "a3f9c1e" },
  { name: "Workload Scheduler", cloudHash: "7d82b40", airgapHash: "7d82b40" },
  { name: "Model Runtime", cloudHash: "e15f6a2", airgapHash: "e15f6a2" },
  { name: "Telemetry Agent", cloudHash: "9b0c7f3", airgapHash: "9b0c7f3" },
];

export default function SwoopAirgapParityDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("drifted");
  const [checked, setChecked] = useState(-1);
  const [runKey, setRunKey] = useState(0);
  const [done, setDone] = useState(false);

  function runCheck() {
    setRunKey((k) => k + 1);
    setDone(false);
    setChecked(0);
    COMPONENTS.forEach((_, i) => {
      window.setTimeout(() => setChecked(i), i * 380);
    });
    window.setTimeout(() => setDone(true), COMPONENTS.length * 380 + 200);
  }

  function switchMode(m: Mode) {
    setMode(m);
    setChecked(-1);
    setDone(false);
  }

  function airgapHashFor(i: number) {
    const comp = COMPONENTS[i];
    const isDriftedComponent = i === COMPONENTS.length - 1;
    if (mode === "drifted" && isDriftedComponent) return "9b0c8a1";
    return comp.airgapHash;
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Air-gap parity visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["clean", "drifted"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="swoop-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "clean" ? "Clean deploy" : "Drifted deploy"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-white/35 text-[9px] uppercase tracking-wider">Cloud path</span>
            <span className="text-white/35 text-[9px] uppercase tracking-wider">Air-gapped bundle</span>
          </div>

          <div className="space-y-2 mb-5">
            {COMPONENTS.map((comp, i) => {
              const checkedRow = checked >= i;
              const mismatch = checkedRow && mode === "drifted" && i === COMPONENTS.length - 1;
              return (
                <motion.div
                  key={`${runKey}-${comp.name}`}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className="rounded-lg px-3 py-2.5"
                  style={{
                    background: mismatch ? "rgba(239,68,68,0.1)" : checkedRow ? `${accentColor}0d` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${mismatch ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/50 text-[9px] uppercase tracking-wider">{comp.name}</span>
                    <span
                      className="text-[9px] font-semibold"
                      style={{ color: mismatch ? "#ef4444" : checkedRow ? accentColor : "rgba(255,255,255,0.3)" }}
                    >
                      {mismatch ? "DRIFT" : checkedRow ? "MATCH" : "pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-[10.5px] font-mono tabular-nums">{comp.cloudHash}</span>
                    <span className="text-white/25 text-[9px]">vs</span>
                    <span className="text-white/70 text-[10.5px] font-mono tabular-nums">{airgapHashFor(i)}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={runCheck}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Run parity check
            </button>
          </div>

          <div className="min-h-[58px]">
            <AnimatePresence mode="wait">
              {done && mode === "drifted" && (
                <motion.div
                  key={`drift-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)" }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Drift detected: Telemetry Agent</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    The air-gapped bundle shipped a build one patch behind the cloud path. Flagged for resync before
                    this environment is trusted for a control-system decision.
                  </p>
                </motion.div>
              )}
              {done && mode === "clean" && (
                <motion.div
                  key={`clean-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1 font-mono tabular-nums">
                    Parity confirmed: 4/4 components
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    Every component hash matches across both paths. The air-gapped bundle is provably running the
                    same build as the connected deployment, not just a similar one.
                  </p>
                </motion.div>
              )}
              {!done && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Same package, two delivery paths, bare-metal or fully offline. Run the check to verify they
                  actually landed identical.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
