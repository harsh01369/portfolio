"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Feature = "nudge" | "fee";

const FEATURES: Record<
  Feature,
  { label: string; sawIt: number[]; didntSee: number[]; naive: number; causal: [number, number]; metric: string }
> = {
  nudge: {
    label: "Rebalancing nudge",
    sawIt: [52, 55, 59, 63, 66, 70],
    didntSee: [50, 51, 52, 53, 54, 55],
    naive: 15,
    causal: [6, 12],
    metric: "Rebalancing compliance",
  },
  fee: {
    label: "Fee transparency banner",
    sawIt: [40, 44, 47, 49, 52, 54],
    didntSee: [38, 39, 40, 41, 42, 43],
    naive: 11,
    causal: [3, 9],
    metric: "Client retention lift",
  },
};

const MONTHS = ["M1", "M2", "M3", "M4", "M5", "M6"];
const X0 = 14;
const X1 = 446;
const Y0 = 118;
const Y1 = 16;
const VMIN = 30;
const VMAX = 75;

function xScale(i: number) {
  return X0 + (i / (MONTHS.length - 1)) * (X1 - X0);
}
function yScale(v: number) {
  const t = (v - VMIN) / (VMAX - VMIN);
  return Y0 + t * (Y1 - Y0);
}
function toPoints(values: number[]) {
  return values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
}

export default function PurposeCausalTraceDemo({ accentColor, bgDark }: Props) {
  const [feature, setFeature] = useState<Feature>("nudge");
  const [adjusted, setAdjusted] = useState(false);
  const data = FEATURES[feature];
  const causalMid = (data.causal[0] + data.causal[1]) / 2;

  function selectFeature(f: Feature) {
    setFeature(f);
    setAdjusted(false);
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-16 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Decision-to-outcome trace</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["nudge", "fee"] as Feature[]).map((f) => (
                <button
                  key={f}
                  onClick={() => selectFeature(f)}
                  className="relative text-[10.5px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: feature === f ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {feature === f && (
                    <motion.div
                      layoutId="purpose-feature-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{FEATURES[f].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
              <span className="text-white/45 text-[9.5px]">Advisors who saw it</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.35)" }} />
              <span className="text-white/45 text-[9.5px]">Advisors who didn&apos;t</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.svg
              key={feature}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              viewBox="0 0 460 134"
              className="w-full h-[140px]"
            >
              {[0.25, 0.5, 0.75].map((t) => (
                <line key={t} x1={X0} x2={X1} y1={Y0 - t * (Y0 - Y1)} y2={Y0 - t * (Y0 - Y1)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
              ))}
              <polyline points={toPoints(data.didntSee)} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.75} strokeLinejoin="round" />
              <polyline points={toPoints(data.sawIt)} fill="none" stroke={accentColor} strokeWidth={2} strokeLinejoin="round" />
              {MONTHS.map((_, i) => (
                <circle key={`end-${i}`} cx={xScale(i)} cy={yScale(data.sawIt[i])} r={i === MONTHS.length - 1 ? 3 : 0} fill={accentColor} />
              ))}
            </motion.svg>
          </AnimatePresence>
          <div className="flex justify-between px-1 mb-4">
            {MONTHS.map((m) => (
              <span key={m} className="text-white/25 text-[8.5px]">{m}</span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-white/35 text-[9px] uppercase tracking-wider">
              Naive gap: <span className="text-white/70 font-semibold">+{data.naive} pts</span> {data.metric}
            </p>
            <button
              onClick={() => setAdjusted(true)}
              disabled={adjusted}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ background: accentColor, color: bgDark }}
            >
              Adjust for selection bias
            </button>
          </div>

          <div className="min-h-[86px]">
            <AnimatePresence mode="wait">
              {adjusted ? (
                <motion.div
                  key={`adjusted-${feature}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <div className="relative h-5 mb-2.5 mt-1">
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2" style={{ background: "rgba(255,255,255,0.12)" }} />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.causal[1] - data.causal[0]) / data.naive * 100}%` }}
                      className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full"
                      style={{
                        left: `${(data.causal[0] / data.naive) * 100}%`,
                        background: `${accentColor}40`,
                        border: `1px solid ${accentColor}`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.6)" }}
                    />
                    <span className="absolute right-0 -top-4 text-white/35 text-[8px]">naive +{data.naive}</span>
                    <span
                      className="absolute -top-4 text-[8px]"
                      style={{ left: `${(data.causal[0] / data.naive) * 100}%`, color: accentColor }}
                    >
                      causal {data.causal[0]}&ndash;{data.causal[1]}
                    </span>
                  </div>
                  <p className="text-white text-xs font-semibold mb-1">
                    Causal effect: +{causalMid.toFixed(0)} pts ({data.causal[0]}&ndash;{data.causal[1]} CI)
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    Advisors who opted into this feature were already higher-engagement before they saw it, that
                    selection effect accounts for most of the naive gap. The isolated contribution is real, just
                    smaller, and now defensible in front of a product decision.
                  </p>
                </motion.div>
              ) : (
                <p className="text-white/30 text-[11px] text-center pt-6">
                  The raw gap between cohorts mixes the feature&apos;s real effect with who was likely to engage
                  with it anyway.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
