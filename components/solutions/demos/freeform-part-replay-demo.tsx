"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Layer {
  layer: number;
  laserA: number;
  laserB: number;
  seamDelta: number;
  corrected: boolean;
}

const LAYERS: Layer[] = [
  { layer: 40, laserA: 1612, laserB: 1609, seamDelta: 3, corrected: false },
  { layer: 120, laserA: 1618, laserB: 1611, seamDelta: 7, corrected: false },
  { layer: 200, laserA: 1615, laserB: 1646, seamDelta: 31, corrected: false },
  { layer: 201, laserA: 1615, laserB: 1617, seamDelta: 2, corrected: true },
  { layer: 280, laserA: 1620, laserB: 1618, seamDelta: 2, corrected: false },
  { layer: 360, laserA: 1617, laserB: 1616, seamDelta: 1, corrected: false },
];

const SEAM_TOLERANCE = 12;

const FLEET = [
  { cell: "Cell 02", values: [2, 3, 2, 4, 3], risk: false },
  { cell: "Cell 03", values: [3, 8, 14, 9, 6], risk: true },
  { cell: "Cell 05", values: [2, 2, 3, 2, 2], risk: false },
  { cell: "Cell 07", values: [4, 11, 17, 10, 5], risk: true },
];

function sparkPath(values: number[], w: number, h: number, max: number) {
  const step = w / (values.length - 1);
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${(i * step).toFixed(1)} ${(h - (v / max) * h).toFixed(1)}`)
    .join(" ");
}

export default function FreeformPartReplayDemo({ accentColor, bgDark }: Props) {
  const [index, setIndex] = useState(-1);
  const [runKey, setRunKey] = useState(0);
  const [complete, setComplete] = useState(false);
  const [flagFleet, setFlagFleet] = useState(false);
  const timers = useRef<number[]>([]);

  const current = index >= 0 ? LAYERS[Math.min(index, LAYERS.length - 1)] : null;
  const correctionLogged = LAYERS.some((l) => l.corrected);
  const seamHistory = LAYERS.slice(0, index + 1).map((l) => l.seamDelta);
  const maxDelta = Math.max(SEAM_TOLERANCE + 5, ...LAYERS.map((l) => l.seamDelta));

  function play() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setRunKey((k) => k + 1);
    setComplete(false);
    setFlagFleet(false);
    setIndex(0);
    LAYERS.forEach((_, i) => {
      const t = window.setTimeout(() => setIndex(i), i * 460);
      timers.current.push(t);
    });
    const t = window.setTimeout(() => setComplete(true), LAYERS.length * 460 + 200);
    timers.current.push(t);
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}33` }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
            backgroundSize: "18px 18px",
          }}
        />

        <div className="relative p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.18em]">Multi-laser seam audit</p>
            <p className="text-white/30 text-[9.5px] font-mono tabular-nums">Bracket Ti-6Al-4V, Run 4471</p>
          </div>

          <div className="relative rounded-lg overflow-hidden mb-4" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex h-28">
              <div
                className="flex-1 flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #0e2a3a, #0a1b26)" }}
              >
                <span className="text-[9px] text-cyan-200/60 absolute top-2 left-2 uppercase tracking-wider">Laser A</span>
                <span className="font-mono text-cyan-100 text-lg tabular-nums">{current ? `${current.laserA}C` : "-"}</span>
              </div>
              <div
                className="w-[3px] relative z-10"
                style={{
                  background: current && current.seamDelta > SEAM_TOLERANCE ? "#f59e0b" : "rgba(255,255,255,0.25)",
                  boxShadow: current && current.seamDelta > SEAM_TOLERANCE ? "0 0 14px #f59e0b" : "none",
                }}
              />
              <div
                className="flex-1 flex items-center justify-center relative"
                style={{ background: "linear-gradient(225deg, #3a260e, #26170a)" }}
              >
                <span className="text-[9px] text-amber-200/60 absolute top-2 right-2 uppercase tracking-wider">Laser B</span>
                <span className="font-mono text-amber-100 text-lg tabular-nums">{current ? `${current.laserB}C` : "-"}</span>
              </div>
            </div>
            <div className="px-3 py-1.5 flex items-center justify-between" style={{ background: "rgba(0,0,0,0.3)" }}>
              <span className="text-white/35 text-[9px]">seam delta</span>
              <span
                className="font-mono text-[11px] tabular-nums"
                style={{ color: current && current.seamDelta > SEAM_TOLERANCE ? "#f59e0b" : "rgba(255,255,255,0.6)" }}
              >
                {current ? `${current.seamDelta}C` : "-"} / {SEAM_TOLERANCE}C limit
              </span>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-white/30 text-[9px] uppercase tracking-wider mb-1.5">Seam delta, this run</p>
            <svg viewBox="0 0 220 40" className="w-full h-10">
              <line x1="0" y1={40 - (SEAM_TOLERANCE / maxDelta) * 40} x2="220" y2={40 - (SEAM_TOLERANCE / maxDelta) * 40} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1" opacity="0.5" />
              {seamHistory.length > 1 && (
                <motion.path
                  key={runKey}
                  d={sparkPath(seamHistory, 220, 40, maxDelta)}
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="1.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </svg>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={play}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Play replay
            </button>
          </div>

          <div className="min-h-[108px]">
            <AnimatePresence mode="wait">
              {current && current.corrected && (
                <motion.div
                  key={`adj-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3 mb-2"
                  style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.4)" }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Seam correction logged, layer {current.layer}</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    Laser B power trimmed 4% to match laser A&apos;s melt pool at the seam boundary. Delta back under
                    the {SEAM_TOLERANCE}C limit within one layer.
                  </p>
                </motion.div>
              )}
              {complete && (
                <motion.div
                  key={`cert-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${accentColor}55` }}
                >
                  <div className="px-3.5 py-3" style={{ background: `${accentColor}14` }}>
                    <p className="text-white text-xs font-semibold mb-1">Certified, seam integrity validated</p>
                    <p className="text-white/45 text-[10.5px] leading-relaxed">
                      {correctionLogged
                        ? "One seam excursion detected and corrected in-process. Final dimensional and seam checks both passed."
                        : "No seam excursions this run. Final dimensional check passed."}
                    </p>
                  </div>
                  <button
                    onClick={() => setFlagFleet(true)}
                    className="w-full text-left px-3.5 py-2.5 text-[10.5px]"
                    style={{ background: "rgba(255,255,255,0.03)", color: accentColor }}
                  >
                    This seam geometry runs hot elsewhere too. Check the fleet &gt;
                  </button>
                </motion.div>
              )}
              {!current && !complete && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Play the replay to watch what the seam between two lasers does under heat, and what gets fixed
                  before the part ships.
                </p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {flagFleet && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 rounded-lg p-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-white/35 text-[9px] uppercase tracking-wider mb-2">
                  Same seam geometry, other cells printing this bracket
                </p>
                <div className="flex gap-3">
                  {FLEET.map((f) => (
                    <div key={f.cell} className="flex-1">
                      <svg viewBox="0 0 60 28" className="w-full h-7">
                        <path
                          d={sparkPath(f.values, 60, 28, 20)}
                          fill="none"
                          stroke={f.risk ? "#f59e0b" : "rgba(255,255,255,0.3)"}
                          strokeWidth="1.5"
                        />
                      </svg>
                      <p className="text-[8.5px] text-center mt-0.5" style={{ color: f.risk ? "#f59e0b" : "rgba(255,255,255,0.3)" }}>
                        {f.cell}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-white/40 text-[9.5px] leading-relaxed mt-2">
                  2 of 4 other cells running this part show the same seam-side heat pattern. Worth a path-planning
                  review before it shows up as a defect on one of them instead of a correction.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
