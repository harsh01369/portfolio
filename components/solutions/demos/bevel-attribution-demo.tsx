"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Scenario = "meal" | "activity";

interface Tick {
  t: string;
  glucose: number;
  event?: { kind: "meal" | "activity"; label: string };
  attribution?: {
    cause: "meal" | "activity";
    confidence: number;
    reason: string;
    ruledOut?: { label: string; reason: string };
  };
}

const SCENARIOS: Record<Scenario, { title: string; ticks: Tick[] }> = {
  meal: {
    title: "Meal-driven spike",
    ticks: [
      { t: "12:00", glucose: 96 },
      { t: "12:05", glucose: 94, event: { kind: "meal", label: "Lunch logged, 62g carbs" } },
      { t: "12:10", glucose: 101 },
      { t: "12:15", glucose: 118 },
      {
        t: "12:20",
        glucose: 142,
        attribution: {
          cause: "meal",
          confidence: 91,
          reason: "Rise starts 15 minutes after a 62g-carb lunch, inside the typical post-meal glucose window.",
        },
      },
      {
        t: "12:25",
        glucose: 156,
        event: { kind: "activity", label: "12-minute walk logged" },
        attribution: {
          cause: "meal",
          confidence: 88,
          reason: "Peak still tracks the lunch carb load. The walk starting now is too late to explain the rise already in progress.",
          ruledOut: { label: "12-minute walk", reason: "Started after the rise was already underway" },
        },
      },
      { t: "12:30", glucose: 151 },
      { t: "12:35", glucose: 139 },
    ],
  },
  activity: {
    title: "Activity-driven dip",
    ticks: [
      { t: "12:00", glucose: 132 },
      { t: "12:05", glucose: 129 },
      { t: "12:10", glucose: 125, event: { kind: "activity", label: "22-minute brisk walk logged" } },
      { t: "12:15", glucose: 112 },
      {
        t: "12:20",
        glucose: 98,
        attribution: {
          cause: "activity",
          confidence: 85,
          reason: "Drop begins 10 minutes into a brisk walk, matching the known post-exercise glucose clearance pattern.",
        },
      },
      {
        t: "12:25",
        glucose: 89,
        attribution: {
          cause: "activity",
          confidence: 89,
          reason: "Continued clearance from the same walk window, well past its typical half-life for this drop size.",
        },
      },
      {
        t: "12:30",
        glucose: 84,
        event: { kind: "meal", label: "Snack logged, apple and almond butter" },
        attribution: {
          cause: "activity",
          confidence: 83,
          reason: "The dip was already bottoming out before the snack was logged. The walk remains the plausible cause.",
          ruledOut: { label: "Apple and almond butter snack", reason: "Logged after the dip had already occurred" },
        },
      },
      { t: "12:35", glucose: 86 },
    ],
  },
};

export default function BevelAttributionDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<Scenario>("meal");
  const data = SCENARIOS[scenario];
  const defaultIdx = data.ticks.findIndex((t) => t.attribution) >= 0
    ? data.ticks.map((t) => !!t.attribution).lastIndexOf(true)
    : 0;
  const [selected, setSelected] = useState(defaultIdx);

  const handleScenario = (s: Scenario) => {
    setScenario(s);
    const idx = SCENARIOS[s].ticks.map((t) => !!t.attribution).lastIndexOf(true);
    setSelected(idx >= 0 ? idx : 0);
  };

  const max = Math.max(...data.ticks.map((t) => t.glucose));
  const min = Math.min(...data.ticks.map((t) => t.glucose));
  const current = data.ticks[selected];

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
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Signal attribution replay</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["meal", "activity"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleScenario(s)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: scenario === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {scenario === s && (
                    <motion.div
                      layoutId="bevel-scenario-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{SCENARIOS[s].title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* shared timeline: glucose bars with event markers */}
          <div className="flex items-end gap-1.5 h-[110px] mb-1.5 px-1">
            {data.ticks.map((tick, i) => {
              const heightPct = ((tick.glucose - min + 8) / (max - min + 16)) * 100;
              const isSelected = i === selected;
              return (
                <button
                  key={tick.t}
                  onClick={() => setSelected(i)}
                  className="flex-1 flex flex-col items-center gap-1.5 group"
                >
                  <div className="relative w-full flex justify-center" style={{ height: 14 }}>
                    {tick.event && (
                      <span
                        className="text-[9px] leading-none"
                        title={tick.event.label}
                        style={{ color: tick.event.kind === "meal" ? accentColor : "rgba(255,255,255,0.5)" }}
                      >
                        {tick.event.kind === "meal" ? "●" : "▲"}
                      </span>
                    )}
                  </div>
                  <motion.div
                    className="w-full rounded-t-sm"
                    initial={false}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    style={{
                      background: isSelected ? accentColor : "rgba(255,255,255,0.18)",
                      minHeight: 4,
                    }}
                  />
                </button>
              );
            })}
          </div>
          <div className="flex gap-1.5 mb-4 px-1">
            {data.ticks.map((tick) => (
              <span key={tick.t} className="flex-1 text-center text-white/25 text-[9px] font-mono tabular-nums">
                {tick.t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[10px] text-white/35 mb-4">
            <span className="flex items-center gap-1.5">
              <span style={{ color: accentColor }}>●</span> Meal logged
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-white/50">▲</span> Activity logged
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${scenario}-${selected}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="min-h-[120px]"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-white text-sm font-semibold">
                  {current.t}, <span className="font-mono tabular-nums">{current.glucose} mg/dL</span>
                </p>
              </div>

              {current.attribution ? (
                <div
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>
                      Attributed to {current.attribution.cause === "meal" ? "lunch" : "the walk"}
                    </p>
                    <span className="text-[10px] font-mono tabular-nums" style={{ color: accentColor }}>
                      {current.attribution.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-white/55 text-[11px] leading-relaxed">{current.attribution.reason}</p>
                  {current.attribution.ruledOut && (
                    <p className="text-white/30 text-[10px] mt-2 leading-relaxed">
                      Ruled out: {current.attribution.ruledOut.label}. {current.attribution.ruledOut.reason}.
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded-lg px-3.5 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-white/45 text-xs">No attributable meal or activity event falls inside the causal window for this reading.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
