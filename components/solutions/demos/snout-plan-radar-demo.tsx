"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Clinic {
  id: string;
  name: string;
  plans: number;
  // lapsing-risk score per week, 0 (healthy) to 100 (high risk), weeks 0-6
  trajectory: number[];
  dotOffsets: number[];
}

const WEEKS = [0, 1, 2, 3, 4, 5, 6];
const RISK_THRESHOLD = 65;

const CLINICS: Clinic[] = [
  {
    id: "c1",
    name: "Lakeside Animal Care",
    plans: 34,
    trajectory: [12, 10, 14, 11, 15, 13, 16],
    dotOffsets: [-6, -2, 1, 4, 7, 10],
  },
  {
    id: "c2",
    name: "Brightpaw Animal Hospital",
    plans: 51,
    trajectory: [24, 27, 30, 34, 37, 41, 44],
    dotOffsets: [-9, -4, 0, 5, 9, 13],
  },
  {
    id: "c3",
    name: "Cascade Pet Clinic",
    plans: 42,
    trajectory: [20, 31, 46, 60, 72, 81, 88],
    dotOffsets: [-10, -5, 0, 4, 8, 12],
  },
  {
    id: "c4",
    name: "Maple Ridge Vet",
    plans: 29,
    trajectory: [16, 18, 19, 22, 24, 25, 27],
    dotOffsets: [-7, -3, 1, 3, 6, 11],
  },
];

function riskColor(score: number): string {
  if (score >= RISK_THRESHOLD) return "#ff4d5e";
  if (score >= 40) return "#ffaa3c";
  return "#4dd08a";
}

export default function SnoutPlanRadarDemo({ accentColor, bgDark }: Props) {
  const [week, setWeek] = useState(0);

  const scored = useMemo(
    () =>
      CLINICS.map((c) => ({
        ...c,
        score: c.trajectory[week],
      })),
    [week]
  );

  const flagged = scored.filter((c) => c.score >= RISK_THRESHOLD);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Plan health radar</p>
            <span className="text-[10px] font-mono tabular-nums text-white/40">Week {week}</span>
          </div>
          <p className="text-white text-sm font-semibold mb-5">Wellness-plan portfolio by clinic</p>

          <input
            type="range"
            min={0}
            max={6}
            step={1}
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="w-full mb-1 accent-current"
            style={{ accentColor }}
          />
          <div className="flex justify-between mb-6">
            {WEEKS.map((w) => (
              <span key={w} className="text-[8px] text-white/25 font-mono tabular-nums">
                {w}
              </span>
            ))}
          </div>

          <div className="space-y-2.5 mb-5">
            {scored.map((c) => {
              const color = riskColor(c.score);
              const risky = c.score >= RISK_THRESHOLD;
              return (
                <div
                  key={c.id}
                  className="rounded-xl p-3.5"
                  style={{
                    background: risky ? "rgba(255,77,94,0.08)" : "rgba(255,255,255,0.045)",
                    border: `1px solid ${risky ? "rgba(255,77,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white text-xs font-semibold">{c.name}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">{c.plans} active plans</p>
                    </div>
                    <p className="text-xs font-mono tabular-nums font-semibold" style={{ color }}>
                      {Math.round(c.score)}
                    </p>
                  </div>

                  <div className="flex gap-1.5">
                    {c.dotOffsets.map((offset, i) => {
                      const dotScore = Math.max(0, Math.min(100, c.score + offset));
                      return (
                        <motion.div
                          key={i}
                          className="w-5 h-5 rounded-full"
                          animate={{ background: riskColor(dotScore), opacity: 0.55 + dotScore / 220 }}
                          transition={{ duration: 0.4 }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {flagged.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl p-4 mb-2 overflow-hidden"
                style={{ background: "rgba(255,77,94,0.1)", border: "1px solid rgba(255,77,94,0.4)" }}
              >
                <p className="text-[#ff4d5e] text-xs font-semibold mb-1">
                  {flagged.map((c) => c.name).join(", ")} crossed the lapsing-risk threshold
                </p>
                <p className="text-white/60 text-[11px] leading-relaxed">
                  Flagged at week {week}, ahead of default exposure against the financing facility, instead of
                  surfacing only after plans actually lapse.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            Continuous portfolio visibility in place of a traditional credit score, inferred from the no-credit-check
            financing structure, not a confirmed existing Snout feature. Sample clinics and plan counts, built for
            this demo only.
          </p>
        </div>
      </div>
    </div>
  );
}
