"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Scenario = "complete" | "gap";

const TOTAL_MONTHS = 14;
const EARLY_WINDOW = [3, 6];
const GAP_WINDOW = [4.2, 5.6];
const COMPLETE_DETECTION_MONTH = 4.4;
const STANDARD_DETECTION_MONTH = 12.5;

export default function ViaductWarningLagDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<Scenario>("complete");
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [detected, setDetected] = useState<number | null>(null);

  const month = (progress / 100) * TOTAL_MONTHS;
  const detectionMonth = scenario === "complete" ? COMPLETE_DETECTION_MONTH : STANDARD_DETECTION_MONTH;

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1.1;
        if (next >= 100) {
          setPlaying(false);
          return 100;
        }
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    if (month >= detectionMonth && detected === null && progress > 0) {
      setDetected(detectionMonth);
    }
  }, [month, detectionMonth, detected, progress]);

  const replay = () => {
    setProgress(0);
    setDetected(null);
    setPlaying(true);
  };

  const switchScenario = (s: Scenario) => {
    setScenario(s);
    setProgress(0);
    setDetected(null);
    setPlaying(false);
  };

  const pct = (m: number) => (m / TOTAL_MONTHS) * 100;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Early warning lag</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["complete", "gap"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => switchScenario(s)}
                  className="relative text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                  style={{ color: scenario === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {scenario === s && (
                    <motion.div
                      layoutId="scenario-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s === "complete" ? "Complete pipeline" : "Dropped batch"}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-white text-sm font-semibold mb-0.5">Fleet telemetry replay, injected fault signature</p>
          <p className="text-white/40 text-xs mb-6">Peterbilt 579, regional haul cohort, sample fleet</p>

          {/* Timeline */}
          <div className="relative h-20 mb-3">
            {/* early-warning window */}
            <div
              className="absolute top-6 h-8 rounded"
              style={{
                left: `${pct(EARLY_WINDOW[0])}%`,
                width: `${pct(EARLY_WINDOW[1] - EARLY_WINDOW[0])}%`,
                background: `${accentColor}1c`,
                border: `1px dashed ${accentColor}55`,
              }}
            />
            {/* dropped data batch, gap scenario only */}
            {scenario === "gap" && (
              <div
                className="absolute top-6 h-8 rounded"
                style={{
                  left: `${pct(GAP_WINDOW[0])}%`,
                  width: `${pct(GAP_WINDOW[1] - GAP_WINDOW[0])}%`,
                  background:
                    "repeating-linear-gradient(45deg, rgba(255,77,94,0.25) 0px, rgba(255,77,94,0.25) 4px, transparent 4px, transparent 8px)",
                  border: "1px solid rgba(255,77,94,0.5)",
                }}
              />
            )}
            {/* baseline track */}
            <div className="absolute top-9 left-0 right-0 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
            {/* standard detection marker */}
            <div className="absolute top-2 flex flex-col items-center" style={{ left: `${pct(STANDARD_DETECTION_MONTH)}%` }}>
              <span className="text-[8px] text-white/30 whitespace-nowrap -translate-x-1/2">standard claim</span>
            </div>
            {/* playhead */}
            <motion.div
              className="absolute top-7 w-1 h-6 rounded-full"
              style={{ background: accentColor, left: `${progress}%` }}
              transition={{ duration: 0.04, ease: "linear" }}
            />
            {/* detection pulse */}
            {detected !== null && (
              <motion.div
                initial={{ scale: 0.3, opacity: 0.9 }}
                animate={{ scale: 2.4, opacity: 0 }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeOut" }}
                className="absolute top-8 w-3 h-3 rounded-full -translate-x-1/2"
                style={{ left: `${pct(detected)}%`, background: scenario === "complete" ? accentColor : "#ff4d5e" }}
              />
            )}
          </div>
          <div className="flex justify-between text-[9px] text-white/30 font-mono tabular-nums mb-6">
            <span>Month 0</span>
            <span>Month {TOTAL_MONTHS}</span>
          </div>

          <button
            onClick={replay}
            disabled={playing}
            className="w-full text-[11px] font-semibold py-2.5 rounded-lg transition-colors mb-4"
            style={{
              background: playing ? "rgba(255,255,255,0.06)" : accentColor,
              color: playing ? "rgba(255,255,255,0.4)" : bgDark,
            }}
          >
            {playing ? "Replaying..." : "Replay telemetry stream"}
          </button>

          <AnimatePresence mode="wait">
            {detected !== null ? (
              <motion.div
                key={scenario}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-4"
                style={{
                  background: scenario === "complete" ? `${accentColor}14` : "rgba(255,77,94,0.1)",
                  border: `1px solid ${scenario === "complete" ? accentColor + "44" : "rgba(255,77,94,0.4)"}`,
                }}
              >
                {scenario === "complete" ? (
                  <p className="text-white/80 text-xs leading-relaxed">
                    <span className="font-semibold" style={{ color: accentColor }}>
                      Caught at month {COMPLETE_DETECTION_MONTH.toFixed(1)}.
                    </span>{" "}
                    That is {(STANDARD_DETECTION_MONTH - COMPLETE_DETECTION_MONTH).toFixed(1)} months ahead of the
                    standard warranty-claim detection point, inside the 3–6 month early-warning window.
                  </p>
                ) : (
                  <p className="text-white/80 text-xs leading-relaxed">
                    <span className="font-semibold text-[#ff4d5e]">Signal missed.</span> The fault signature fell
                    inside the dropped batch, so detection silently slipped past the early-warning window to month{" "}
                    {STANDARD_DETECTION_MONTH.toFixed(1)}, the standard warranty-claim detection point.
                  </p>
                )}
              </motion.div>
            ) : (
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-white/35 text-xs italic">Press replay to run the scenario.</p>
              </div>
            )}
          </AnimatePresence>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            Same injected fault signature, two pipeline states: complete telemetry catches it inside the
            documented 3–6 month early-warning window, a dropped ETL batch lets it slip to standard detection.
            Simulated fleet data, not a real customer&apos;s telemetry.
          </p>
        </div>
      </div>
    </div>
  );
}
