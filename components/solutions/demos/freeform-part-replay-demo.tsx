"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "nominal" | "corrected";

interface Checkpoint {
  layer: number;
  thermalC: number;
  deviationMicron: number;
  adjustment: string | null;
}

const NOMINAL: Checkpoint[] = [
  { layer: 40, thermalC: 1612, deviationMicron: 4, adjustment: null },
  { layer: 120, thermalC: 1618, deviationMicron: 5, adjustment: null },
  { layer: 200, thermalC: 1615, deviationMicron: 3, adjustment: null },
  { layer: 280, thermalC: 1620, deviationMicron: 4, adjustment: null },
  { layer: 360, thermalC: 1617, deviationMicron: 3, adjustment: null },
];

const CORRECTED: Checkpoint[] = [
  { layer: 40, thermalC: 1614, deviationMicron: 4, adjustment: null },
  { layer: 120, thermalC: 1618, deviationMicron: 5, adjustment: null },
  { layer: 200, thermalC: 1649, deviationMicron: 11, adjustment: "Laser power -6%, thermal drift detected" },
  { layer: 280, thermalC: 1621, deviationMicron: 5, adjustment: null },
  { layer: 360, thermalC: 1616, deviationMicron: 4, adjustment: null },
];

export default function FreeformPartReplayDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("corrected");
  const [index, setIndex] = useState(-1);
  const [runKey, setRunKey] = useState(0);
  const [complete, setComplete] = useState(false);

  const data = mode === "corrected" ? CORRECTED : NOMINAL;
  const current = index >= 0 ? data[Math.min(index, data.length - 1)] : null;
  const adjustmentCount = data.filter((c) => c.adjustment !== null).length;

  function play() {
    setRunKey((k) => k + 1);
    setComplete(false);
    setIndex(0);
    data.forEach((_, i) => {
      window.setTimeout(() => setIndex(i), i * 480);
    });
    window.setTimeout(() => setComplete(true), data.length * 480 + 200);
  }

  function switchMode(m: Mode) {
    setMode(m);
    setIndex(-1);
    setComplete(false);
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Part-to-sensor replay</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["nominal", "corrected"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="ff-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "nominal" ? "Nominal run" : "Run with correction"}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-[10px] font-mono tabular-nums mb-4">Bracket, Ti-6Al-4V, Run 4471</p>

          <div className="relative h-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: accentColor }}
              animate={{ width: `${((index + 1) / data.length) * 100}%` }}
              transition={{ ease: "linear", duration: 0.3 }}
            />
            {data.map((cp, i) => {
              const reached = index >= i;
              return (
                <div
                  key={`${runKey}-marker-${cp.layer}`}
                  className="absolute top-1/2 w-2.5 h-2.5 rounded-full border"
                  style={{
                    left: `${(i / (data.length - 1)) * 100}%`,
                    transform: "translate(-50%, -50%)",
                    background: cp.adjustment !== null && reached ? "#f59e0b" : reached ? accentColor : "rgba(255,255,255,0.15)",
                    borderColor: cp.adjustment !== null ? "#f59e0b" : accentColor,
                  }}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-5">
            <div
              className="rounded-lg px-3 py-2.5 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/35 text-[8.5px] uppercase tracking-wider mb-1">Layer</p>
              <p className="text-white text-sm font-mono tabular-nums">{current ? current.layer : "-"}</p>
            </div>
            <div
              className="rounded-lg px-3 py-2.5 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/35 text-[8.5px] uppercase tracking-wider mb-1">Thermal</p>
              <p className="text-white text-sm font-mono tabular-nums">{current ? `${current.thermalC}C` : "-"}</p>
            </div>
            <div
              className="rounded-lg px-3 py-2.5 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/35 text-[8.5px] uppercase tracking-wider mb-1">Deviation</p>
              <p className="text-white text-sm font-mono tabular-nums">
                {current ? `${current.deviationMicron}um` : "-"}
              </p>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={play}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Play replay
            </button>
          </div>

          <div className="min-h-[76px]">
            <AnimatePresence mode="wait">
              {current && current.adjustment !== null && !complete && (
                <motion.div
                  key={`adj-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.4)" }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Control adjustment logged</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">{current.adjustment}</p>
                </motion.div>
              )}
              {complete && (
                <motion.div
                  key={`cert-${runKey}-${mode}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Certified production-grade</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {adjustmentCount > 0
                      ? `All ${data.length} checkpoints within tolerance, ${adjustmentCount} real-time correction logged and resolved, final dimensional check passed.`
                      : `All ${data.length} checkpoints within tolerance, no corrections needed, final dimensional check passed.`}
                  </p>
                </motion.div>
              )}
              {!current && !complete && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Play the replay to see the sensor data that justifies calling this specific part
                  production-grade.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
