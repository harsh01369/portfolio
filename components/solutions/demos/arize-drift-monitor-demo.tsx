"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Point {
  x: number;
  y: number;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function cluster(n: number, cx: number, cy: number, spread: number, seed: number): Point[] {
  const rand = seededRandom(seed);
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const angle = rand() * Math.PI * 2;
    const r = rand() * spread;
    pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  return pts;
}

function centroid(pts: Point[]): Point {
  return { x: pts.reduce((s, p) => s + p.x, 0) / pts.length, y: pts.reduce((s, p) => s + p.y, 0) / pts.length };
}

const BASELINE = cluster(60, 130, 100, 42, 7);
const PROD_NORMAL = cluster(60, 140, 108, 46, 13);
const PROD_SHIFTED = cluster(60, 235, 60, 50, 21);
const PROD_SHIFTED_SMALL = PROD_SHIFTED.slice(0, 6);

const ALERT_THRESHOLD = 60;

export default function ArizeDriftMonitorDemo({ accentColor, bgDark }: Props) {
  const [shifted, setShifted] = useState(false);
  const [smallSample, setSmallSample] = useState(false);

  const baselineCentroid = useMemo(() => centroid(BASELINE), []);
  const prodPoints = shifted ? (smallSample ? PROD_SHIFTED_SMALL : PROD_SHIFTED) : PROD_NORMAL;
  const prodCentroid = useMemo(() => centroid(prodPoints), [prodPoints]);
  const distance = Math.hypot(prodCentroid.x - baselineCentroid.x, prodCentroid.y - baselineCentroid.y);
  const alerting = distance > ALERT_THRESHOLD;
  const unreliable = smallSample && shifted;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl font-mono"
        style={{ background: bgDark, border: `1px solid ${accentColor}33` }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${accentColor}2E` }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
          <span className="text-[10.5px] text-white/40 ml-2">arize :: embedding-drift-monitor</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Drift score is the distance between the baseline centroid and the production window's centroid. It's
            only as trustworthy as the window's sample size, <span style={{ color: accentColor }}>n</span> matters
            as much as the score itself.
          </p>

          <div className="rounded-lg mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg viewBox="0 0 300 180" className="w-full h-auto">
              {BASELINE.map((p, i) => (
                <circle key={`b${i}`} cx={p.x} cy={p.y} r={2} fill="rgba(255,255,255,0.35)" />
              ))}
              {prodPoints.map((p, i) => (
                <motion.circle
                  key={`p${i}-${shifted}-${smallSample}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, cx: p.x, cy: p.y }}
                  transition={{ duration: 0.5 }}
                  r={2.4}
                  fill={alerting ? "#ef4444" : accentColor}
                />
              ))}
              <motion.circle animate={{ cx: baselineCentroid.x, cy: baselineCentroid.y }} r={5} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5} />
              <motion.circle animate={{ cx: prodCentroid.x, cy: prodCentroid.y }} r={5} fill="none" stroke={alerting ? "#ef4444" : accentColor} strokeWidth={1.5} />
              <motion.line
                animate={{ x1: baselineCentroid.x, y1: baselineCentroid.y, x2: prodCentroid.x, y2: prodCentroid.y }}
                stroke={alerting ? "#ef4444" : "rgba(255,255,255,0.3)"}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </svg>
            <div className="flex items-center gap-4 px-3 pb-2.5 text-[9px] text-white/40">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/35" /> baseline window</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: alerting ? "#ef4444" : accentColor }} /> production window (n={prodPoints.length})</span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4 flex items-center justify-between"
            style={{ background: alerting && !unreliable ? "#ef444414" : "rgba(255,255,255,0.03)", border: `1px solid ${alerting && !unreliable ? "#ef444455" : "rgba(255,255,255,0.08)"}` }}
          >
            <span className="text-[10.5px] text-white/70">Centroid distance</span>
            <span className="text-[13px] font-semibold tabular-nums" style={{ color: alerting ? "#ef4444" : accentColor }}>
              {distance.toFixed(1)} <span className="text-white/30 text-[9px]">/ {ALERT_THRESHOLD} threshold</span>
            </span>
          </div>

          <p className="text-[9.5px] leading-relaxed mb-4" style={{ color: unreliable ? "#fca5a5" : alerting ? "#fca5a5" : "rgba(255,255,255,0.35)" }}>
            {unreliable
              ? `Score crossed the threshold, but n=${prodPoints.length} is too thin to trust. This could be real drift or just noise from a small window.`
              : alerting
              ? "Drift monitor fires: production embeddings have moved meaningfully away from baseline."
              : "Within normal variance, no alert."}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShifted((s) => !s)}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity"
              style={{ background: accentColor, color: bgDark }}
            >
              {shifted ? "Reset to normal traffic" : "Shift production traffic"}
            </button>
            <button
              onClick={() => setSmallSample((s) => !s)}
              className="flex items-center gap-1.5 text-[10px] text-white/45"
            >
              <span
                className="w-7 h-4 rounded-full relative transition-colors"
                style={{ background: smallSample ? accentColor : "rgba(255,255,255,0.12)" }}
              >
                <motion.span
                  className="absolute top-0.5 w-3 h-3 rounded-full bg-white"
                  animate={{ left: smallSample ? 14 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                />
              </span>
              small window (n=6)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
