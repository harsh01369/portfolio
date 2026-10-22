"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Site = "urban" | "rural";

interface Tick {
  label: string;
  trafficPct: number;
}

const AI_DEMAND_PCT = 46;

const SITES: Record<Site, { title: string; ticks: Tick[] }> = {
  urban: {
    title: "Urban macro site",
    ticks: [
      { label: "06:00", trafficPct: 22 },
      { label: "09:00", trafficPct: 78 },
      { label: "12:00", trafficPct: 65 },
      { label: "15:00", trafficPct: 70 },
      { label: "18:00", trafficPct: 92 },
      { label: "21:00", trafficPct: 88 },
      { label: "00:00", trafficPct: 35 },
    ],
  },
  rural: {
    title: "Rural small cell",
    ticks: [
      { label: "06:00", trafficPct: 10 },
      { label: "09:00", trafficPct: 18 },
      { label: "12:00", trafficPct: 15 },
      { label: "15:00", trafficPct: 20 },
      { label: "18:00", trafficPct: 25 },
      { label: "21:00", trafficPct: 22 },
      { label: "00:00", trafficPct: 8 },
    ],
  },
};

export default function EdgeQUtilizationDemo({ accentColor, bgDark }: Props) {
  const [site, setSite] = useState<Site>("urban");
  const ticks = SITES[site].ticks;
  const defaultIdx = ticks.reduce((best, t, i) => (t.trafficPct < ticks[best].trafficPct ? i : best), 0);
  const [selected, setSelected] = useState(defaultIdx);

  const handleSite = (s: Site) => {
    setSite(s);
    const t = SITES[s].ticks;
    setSelected(t.reduce((best, tk, i) => (tk.trafficPct < t[best].trafficPct ? i : best), 0));
  };

  const current = ticks[selected];
  const headroom = 100 - current.trafficPct;
  const allocated = Math.min(AI_DEMAND_PCT, headroom);
  const throttled = AI_DEMAND_PCT - allocated;
  const idle = headroom - allocated;

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
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Silicon utilization</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["urban", "rural"] as Site[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSite(s)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: site === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {site === s && (
                    <motion.div
                      layoutId="edgeq-site-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{SITES[s].title}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">5G traffic load vs. AI inference fill</p>

          <div className="flex items-end gap-2 h-[130px] mb-2 px-1">
            {ticks.map((t, i) => {
              const h = 100 - t.trafficPct;
              const alloc = Math.min(AI_DEMAND_PCT, h);
              const isSelected = i === selected;
              return (
                <button key={t.label} onClick={() => setSelected(i)} className="flex-1 flex flex-col items-stretch gap-1.5">
                  <div className="relative w-full flex flex-col justify-end rounded-sm overflow-hidden" style={{ height: 96, background: "rgba(255,255,255,0.04)" }}>
                    <motion.div
                      className="w-full"
                      initial={false}
                      animate={{ height: `${alloc}%`, opacity: isSelected ? 1 : 0.55 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      style={{ background: accentColor }}
                    />
                    <motion.div
                      className="w-full"
                      initial={false}
                      animate={{ height: `${t.trafficPct}%`, opacity: isSelected ? 1 : 0.55 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      style={{ background: "rgba(255,255,255,0.3)" }}
                    />
                  </div>
                  <span className="text-white/30 text-[9px] font-mono tabular-nums text-center">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[10px] text-white/35 mb-5">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-sm" style={{ background: "rgba(255,255,255,0.3)" }} /> Baseband traffic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-sm" style={{ background: accentColor }} /> AI inference filling headroom
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${site}-${selected}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-white/35 text-[9px] uppercase tracking-wide">Traffic load</p>
                  <p className="text-white text-sm font-mono tabular-nums font-semibold mt-0.5">{current.trafficPct}%</p>
                </div>
                <div className="rounded-lg px-3 py-2.5" style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}45` }}>
                  <p className="text-[9px] uppercase tracking-wide" style={{ color: accentColor }}>AI allocated</p>
                  <p className="text-sm font-mono tabular-nums font-semibold mt-0.5" style={{ color: accentColor }}>{allocated}%</p>
                </div>
                <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-white/35 text-[9px] uppercase tracking-wide">Idle headroom</p>
                  <p className="text-white text-sm font-mono tabular-nums font-semibold mt-0.5">{idle}%</p>
                </div>
              </div>

              <div className="rounded-lg px-3.5 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-white text-xs font-semibold mb-1">Drone object detection batch, requesting {AI_DEMAND_PCT}% compute</p>
                <p className="text-white/50 text-[11px] leading-relaxed">
                  {throttled > 0
                    ? `Baseband load leaves only ${headroom}% headroom at ${current.label}, so this batch runs throttled, ${allocated}% served now and ${throttled}% queued until traffic drops.`
                    : `Baseband load leaves ${headroom}% headroom at ${current.label}, enough to run this batch at its full ${allocated}% request on compute that would otherwise sit idle.`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
