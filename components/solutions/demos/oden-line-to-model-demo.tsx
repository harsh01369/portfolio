"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

const SAMPLES = [
  {
    line: "Line 7 — Extruder",
    anomaly: "Periodic torque spikes every 42 cycles",
    param: "torque_rms",
    rootCause: "Screw-motor bearing wear",
    recommendation: "Schedule bearing replacement within 120 operating hours",
    template: "Torque periodicity -> bearing wear",
  },
  {
    line: "Line 12 — Stamping press",
    anomaly: "Gradual drift in cycle-time baseline",
    param: "die_temp",
    rootCause: "Die temperature creeping above spec",
    recommendation: "Insert a cooldown pause every 300 strokes",
    template: "Cycle-time drift -> die overheat",
  },
  {
    line: "Line 3 — CNC mill",
    anomaly: "Vibration amplitude step-change mid-shift",
    param: "spindle_vibration",
    rootCause: "Tool wear crossing threshold",
    recommendation: "Trigger a tool-change alert at the vibration threshold",
    template: "Vibration step -> tool wear",
  },
];

const STAGE_LABELS = ["Anomaly discovery", "Root-cause trace", "Recommendation"];

export default function OdenLineToModelDemo({ accentColor, bgDark }: Props) {
  const [cycle, setCycle] = useState(0);
  const [stage, setStage] = useState(-1);
  const [library, setLibrary] = useState<string[]>([]);
  const [matched, setMatched] = useState(false);
  const [running, setRunning] = useState(false);

  const sample = SAMPLES[cycle % SAMPLES.length];

  function feedLine() {
    if (running) return;
    setRunning(true);
    setStage(-1);
    setMatched(false);
    const alreadyKnown = library.includes(sample.template);
    [0, 1, 2].forEach((i) => {
      window.setTimeout(() => setStage(i), i * 550 + 200);
    });
    window.setTimeout(() => {
      if (!alreadyKnown) {
        setLibrary((lib) => [...lib, sample.template]);
      } else {
        setMatched(true);
      }
      setRunning(false);
      setCycle((c) => c + 1);
    }, 1900);
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-16 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Line-to-model onboarding</p>
            <button
              onClick={feedLine}
              disabled={running}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ background: accentColor, color: bgDark }}
            >
              {running ? "Analyzing..." : "Feed next line's sensor stream"}
            </button>
          </div>

          <p className="text-white/35 text-[9px] uppercase tracking-wider mb-3">
            Never-seen input: <span className="text-white/60">{sample.line}</span>
          </p>

          <div className="space-y-2 mb-5">
            {STAGE_LABELS.map((label, i) => {
              const reached = stage >= i;
              const active = stage === i;
              let detail = "";
              if (i === 0) detail = sample.anomaly;
              if (i === 1) detail = `${sample.rootCause} (param: ${sample.param})`;
              if (i === 2) detail = sample.recommendation;
              return (
                <motion.div
                  key={`${cycle}-${label}`}
                  animate={{
                    background: reached ? `${accentColor}12` : "rgba(255,255,255,0.03)",
                    borderColor: reached ? `${accentColor}55` : "rgba(255,255,255,0.08)",
                  }}
                  className="rounded-lg px-3.5 py-2.5 border"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <motion.div
                      animate={{
                        scale: active ? [1, 1.2, 1] : 1,
                        background: reached ? accentColor : "rgba(255,255,255,0.08)",
                      }}
                      transition={active ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    >
                      <span className="text-[9px] font-bold" style={{ color: reached ? bgDark : "rgba(255,255,255,0.4)" }}>
                        {i + 1}
                      </span>
                    </motion.div>
                    <span
                      className="text-[10.5px] font-medium"
                      style={{ color: reached ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)" }}
                    >
                      {label}
                    </span>
                  </div>
                  {reached && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/45 text-[10px] leading-relaxed pl-7"
                    >
                      {detail}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mb-3">
            <p className="text-white/35 text-[9px] uppercase tracking-wider mb-2">
              Pattern template library ({library.length})
            </p>
            <div className="flex flex-wrap gap-1.5 min-h-[26px]">
              <AnimatePresence>
                {library.map((t) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[9.5px] px-2.5 py-1 rounded-full"
                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}44`, color: accentColor }}
                  >
                    {t}
                  </motion.span>
                ))}
              </AnimatePresence>
              {library.length === 0 && <span className="text-white/25 text-[10px]">empty, first run populates it</span>}
            </div>
          </div>

          <div className="min-h-[46px]">
            <AnimatePresence mode="wait">
              {matched ? (
                <motion.p
                  key={`matched-${cycle}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10.5px] leading-relaxed"
                  style={{ color: accentColor }}
                >
                  Matched an existing template, applied directly, no retraining needed for this signature.
                </motion.p>
              ) : stage === 2 && !running ? (
                <motion.p
                  key={`new-${cycle}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/30 text-[10.5px] leading-relaxed"
                >
                  New signature, no prior template matched. Added to the library for every future line that sees it.
                </motion.p>
              ) : (
                <p className="text-white/30 text-[10.5px] leading-relaxed">
                  Models don&apos;t transfer cleanly between factory lines, but the discovery-to-recommendation path can.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
