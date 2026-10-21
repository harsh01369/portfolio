"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Plan = "keep" | "trade";

const INSURANCE: Record<Plan, number[]> = {
  keep: [1450, 1400, 1360, 1330, 1310],
  trade: [1600, 1550, 1500, 1460, 1430],
};
const REPAIR: Record<Plan, number[]> = {
  keep: [380, 620, 980, 1450, 2100],
  trade: [120, 160, 210, 270, 340],
};
const FINANCING: Record<Plan, number[]> = {
  keep: [2560, 1920, 1280, 640, 0],
  trade: [5040, 4850, 4640, 4410, 4160],
};

const STREAMS = [
  { key: "insurance", label: "Insurance premium", data: INSURANCE },
  { key: "repair", label: "Repair / maintenance", data: REPAIR },
  { key: "financing", label: "Financing payoff", data: FINANCING },
] as const;

function cumulative(arr: number[], horizon: number) {
  return arr.slice(0, horizon).reduce((a, b) => a + b, 0);
}

export default function JerryTcoSimulatorDemo({ accentColor, bgDark }: Props) {
  const [plan, setPlan] = useState<Plan>("keep");
  const [horizon, setHorizon] = useState(3);

  const totals = useMemo(() => {
    const perStream = STREAMS.map((s) => cumulative(s.data[plan], horizon));
    const total = perStream.reduce((a, b) => a + b, 0);
    return { perStream, total };
  }, [plan, horizon]);

  const maxStream = 10500;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">True cost of ownership</p>
              <p className="text-white/30 text-[10px] mt-0.5">2021 Toyota RAV4 &middot; 42,000 mi &middot; sample profile</p>
            </div>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["keep", "trade"] as Plan[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlan(p)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: plan === p ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {plan === p && (
                    <motion.div
                      layoutId="jerry-plan-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{p === "keep" ? "Keep 3 more years" : "Trade in now"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/35 text-[9px] uppercase tracking-wider">Horizon</p>
              <p className="text-white text-xs font-semibold tabular-nums">{horizon} yr{horizon > 1 ? "s" : ""}</p>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full accent-current"
              style={{ color: accentColor }}
            />
          </div>

          <div className="space-y-2.5 mb-5">
            {STREAMS.map((stream, i) => {
              const value = totals.perStream[i];
              return (
                <div key={stream.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/45 text-[10px]">{stream.label}</span>
                    <span className="text-white text-[11px] font-semibold tabular-nums">
                      ${value.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: accentColor }}
                      animate={{ width: `${Math.min(100, (value / maxStream) * 100)}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${plan}-${horizon}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg px-3.5 py-3"
              style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-white text-xs font-semibold">Blended {horizon}-year total cost</p>
                <p className="text-xl font-bold tabular-nums" style={{ color: accentColor }}>
                  ${totals.total.toLocaleString()}
                </p>
              </div>
              <p className="text-white/45 text-[10.5px] leading-relaxed">
                {plan === "keep"
                  ? "Lower financing drag, but repair cost compounds fast as mileage climbs, insurance and maintenance history, financing, and repair risk fused into one forecast instead of three separate quotes."
                  : "Financing resets high and insurance ticks up on a newer loan, but repair risk nearly disappears under warranty, the tradeoff a single insurance quote never shows."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
