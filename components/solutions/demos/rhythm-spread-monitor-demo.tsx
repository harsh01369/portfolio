"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Region = "rhythm" | "inspire";

interface RegionData {
  label: string;
  plan: string;
  retailRate: number; // cents/kWh, what the customer pays
  baseline: number[]; // cents/kWh wholesale, 8 hourly slices
  peak: number[];
}

const REGIONS: Record<Region, RegionData> = {
  rhythm: {
    label: "Rhythm TX (legacy)",
    plan: "Time-of-use plan, 11.2c/kWh",
    retailRate: 11.2,
    baseline: [6.1, 5.8, 6.4, 7.9, 8.6, 9.1, 8.3, 6.9],
    peak: [6.1, 5.8, 6.4, 9.2, 13.8, 17.4, 15.1, 10.2],
  },
  inspire: {
    label: "Inspire markets (newly folded in)",
    plan: "Flat-bill plan, 10.4c/kWh",
    retailRate: 10.4,
    baseline: [6.8, 6.5, 7.0, 8.1, 8.9, 9.4, 8.7, 7.4],
    peak: [6.8, 6.5, 7.0, 10.1, 14.9, 19.2, 16.6, 11.5],
  },
};

const HOURS = ["12p", "2p", "4p", "6p", "8p", "10p", "12a", "2a"];

export default function RhythmSpreadMonitorDemo({ accentColor, bgDark }: Props) {
  const [region, setRegion] = useState<Region>("rhythm");
  const [peakActive, setPeakActive] = useState<Record<Region, boolean>>({ rhythm: false, inspire: false });

  const data = REGIONS[region];
  const wholesale = peakActive[region] ? data.peak : data.baseline;
  const maxVal = Math.max(data.retailRate, ...data.peak) * 1.08;

  const minMargin = useMemo(() => Math.min(...wholesale.map((w) => data.retailRate - w)), [wholesale, data.retailRate]);
  const marginAtRisk = minMargin < 0;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Spread monitor</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["rhythm", "inspire"] as Region[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className="relative text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                  style={{ color: region === r ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {region === r && (
                    <motion.div
                      layoutId="region-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{r === "rhythm" ? "Rhythm TX" : "Inspire"}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-white text-sm font-semibold mb-0.5">{data.label}</p>
          <p className="text-white/40 text-xs mb-5">{data.plan}</p>

          {/* Chart */}
          <div className="relative h-[160px] mb-2 flex items-end gap-2">
            {/* retail rate reference line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed"
              style={{
                borderColor: "rgba(255,255,255,0.3)",
                bottom: `${(data.retailRate / maxVal) * 100}%`,
              }}
            />
            <span
              className="absolute right-0 text-[9px] text-white/40 font-mono tabular-nums"
              style={{ bottom: `${(data.retailRate / maxVal) * 100}%`, transform: "translateY(2px)" }}
            >
              plan rate {data.retailRate.toFixed(1)}c
            </span>

            {wholesale.map((w, i) => {
              const margin = data.retailRate - w;
              const negative = margin < 0;
              const barHeight = (w / maxVal) * 100;
              return (
                <div key={HOURS[i]} className="relative flex-1 h-full flex items-end">
                  <motion.div
                    className="w-full rounded-t-sm"
                    style={{ background: negative ? "#ff4d5e" : accentColor, opacity: negative ? 0.85 : 0.55 }}
                    animate={{ height: `${barHeight}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 mb-5">
            {HOURS.map((h) => (
              <span key={h} className="flex-1 text-center text-[9px] text-white/30 font-mono tabular-nums">
                {h}
              </span>
            ))}
          </div>

          {/* margin readout */}
          <div
            className="rounded-xl p-4 flex items-center justify-between mb-4"
            style={{
              background: marginAtRisk ? "rgba(255,77,94,0.1)" : `${accentColor}14`,
              border: `1px solid ${marginAtRisk ? "rgba(255,77,94,0.4)" : accentColor + "44"}`,
            }}
          >
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-1">Worst-hour margin</p>
              <p
                className="text-xl font-bold tabular-nums"
                style={{ color: marginAtRisk ? "#ff4d5e" : accentColor }}
              >
                {minMargin >= 0 ? "+" : ""}
                {minMargin.toFixed(1)}c/kWh
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-1">Status</p>
              <motion.p
                key={marginAtRisk ? "risk" : "ok"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-semibold"
                style={{ color: marginAtRisk ? "#ff4d5e" : accentColor }}
              >
                {marginAtRisk ? "Margin at risk, visible before quarter-end" : "Within range"}
              </motion.p>
            </div>
          </div>

          <button
            onClick={() => setPeakActive((prev) => ({ ...prev, [region]: !prev[region] }))}
            className="w-full text-[11px] font-semibold py-2.5 rounded-lg transition-colors"
            style={{
              background: peakActive[region] ? "rgba(255,77,94,0.18)" : "rgba(255,255,255,0.08)",
              color: peakActive[region] ? "#ff4d5e" : "rgba(255,255,255,0.7)",
              border: `1px solid ${peakActive[region] ? "rgba(255,77,94,0.4)" : "rgba(255,255,255,0.12)"}`,
            }}
          >
            {peakActive[region] ? "Reset to normal load" : "Simulate Texas summer peak event"}
          </button>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            Simulated wholesale feed against one plan&apos;s retail rate, split by region so a post-acquisition
            margin squeeze shows up before the books close, not after. Sample prices, not a live ERCOT feed.
          </p>
        </div>
      </div>
    </div>
  );
}
