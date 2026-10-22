"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

const DAYS_PER_MONTH = 30;
const CLOUD_COST_PER_HOUR = 0.021;
const DEVICE_COST_PER_HOUR = 0.0025;

const TIERS = [
  { name: "Free", price: 0 },
  { name: "Plus", price: 11.99 },
  { name: "Pro", price: 29.99 },
];

function breakevenCloudPct(price: number, dailyHours: number) {
  if (dailyHours <= 0) return 100;
  const monthlyHours = dailyHours * DAYS_PER_MONTH;
  const threshold = (price / monthlyHours - DEVICE_COST_PER_HOUR) / (CLOUD_COST_PER_HOUR - DEVICE_COST_PER_HOUR);
  return Math.max(0, Math.min(100, threshold * 100));
}

export default function TwinMindUnitEconomicsDemo({ accentColor, bgDark }: Props) {
  const [dailyHours, setDailyHours] = useState(6);
  const [cloudPct, setCloudPct] = useState(45);

  const monthlyCost = useMemo(() => {
    const monthlyHours = dailyHours * DAYS_PER_MONTH;
    const cloudHours = monthlyHours * (cloudPct / 100);
    const deviceHours = monthlyHours * (1 - cloudPct / 100);
    return cloudHours * CLOUD_COST_PER_HOUR + deviceHours * DEVICE_COST_PER_HOUR;
  }, [dailyHours, cloudPct]);

  const proBreakeven = breakevenCloudPct(29.99, dailyHours);
  const plusBreakeven = breakevenCloudPct(11.99, dailyHours);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-5">Second brain unit economics</p>

          <div className="space-y-4 mb-5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-white/35 text-[9px] uppercase tracking-wider">Daily capture hours</p>
                <p className="text-white text-xs font-mono tabular-nums font-semibold">{dailyHours.toFixed(1)} hrs</p>
              </div>
              <input
                type="range"
                min={0.5}
                max={16}
                step={0.5}
                value={dailyHours}
                onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor, background: "rgba(255,255,255,0.1)" }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-white/35 text-[9px] uppercase tracking-wider">Cloud processing share</p>
                <p className="text-white text-xs font-mono tabular-nums font-semibold">{cloudPct}% cloud</p>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={cloudPct}
                onChange={(e) => setCloudPct(parseInt(e.target.value, 10))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ accentColor, background: "rgba(255,255,255,0.1)" }}
              />
              <p className="text-white/30 text-[9px] mt-1">{100 - cloudPct}% stays on-device</p>
            </div>
          </div>

          <div className="rounded-xl p-3.5 mb-4" style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}44` }}>
            <p className="text-white/50 text-[9px] uppercase tracking-wider mb-1">Estimated compute cost per user</p>
            <p className="text-2xl font-mono tabular-nums font-bold" style={{ color: accentColor }}>
              ${monthlyCost.toFixed(2)}
              <span className="text-white/35 text-xs font-normal">/mo</span>
            </p>
          </div>

          <div className="space-y-2">
            {TIERS.map((tier, i) => {
              const margin = tier.price - monthlyCost;
              const healthy = tier.price === 0 ? true : margin >= 0;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-lg px-3 py-2.5 flex items-center justify-between"
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: `1px solid ${healthy || tier.price === 0 ? "rgba(255,255,255,0.08)" : "#E5484D44"}`,
                  }}
                >
                  <div>
                    <p className="text-white text-xs font-semibold">{tier.name}</p>
                    <p className="text-white/35 text-[9px] font-mono tabular-nums">
                      ${tier.price.toFixed(2)}/mo list price
                    </p>
                  </div>
                  <div className="text-right">
                    {tier.price === 0 ? (
                      <p className="text-white/40 text-[10px] font-mono tabular-nums">
                        -${monthlyCost.toFixed(2)} cost, subsidized
                      </p>
                    ) : (
                      <>
                        <p
                          className="text-[11px] font-mono tabular-nums font-semibold"
                          style={{ color: healthy ? "#1E9E6B" : "#E5484D" }}
                        >
                          {margin >= 0 ? "+" : ""}${margin.toFixed(2)} margin
                        </p>
                        <p className="text-white/30 text-[8px] uppercase tracking-wider">
                          {healthy ? "profitable at this usage" : "losing money at this usage"}
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="rounded-xl p-3 mt-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/55 text-[11px] leading-relaxed">
              At {dailyHours.toFixed(1)} hrs/day, Plus stays profitable only below{" "}
              <span className="font-mono tabular-nums font-semibold" style={{ color: accentColor }}>
                {plusBreakeven.toFixed(0)}% cloud
              </span>
              , Pro up to{" "}
              <span className="font-mono tabular-nums font-semibold" style={{ color: accentColor }}>
                {proBreakeven.toFixed(0)}% cloud
              </span>
              . Push more transcription and summarization on-device and the breakeven line moves right.
            </p>
          </div>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Illustrative per-hour compute costs for this demo only, not TwinMind&apos;s real infrastructure spend.
          </p>
        </div>
      </div>
    </div>
  );
}
