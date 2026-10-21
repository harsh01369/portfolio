"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Buyer = "Discount grocer" | "Liquidator" | "Export broker";

interface Sku {
  id: string;
  name: string;
  category: string;
  initialDays: number;
}

const SKUS: Sku[] = [
  { id: "s1", name: "Harvest Oat Bars, 12ct", category: "Near-dated snacks", initialDays: 18 },
  { id: "s2", name: "Men's Trail Jacket, closeout run", category: "Close-out apparel", initialDays: 11 },
  { id: "s3", name: "Sparkling Water, 24pk", category: "Near-dated beverage", initialDays: 7 },
  { id: "s4", name: "Kids Rain Boots, last-season", category: "Close-out apparel", initialDays: 3 },
];

function buyerFor(days: number): Buyer {
  if (days > 9) return "Discount grocer";
  if (days > 3) return "Liquidator";
  return "Export broker";
}

function urgencyFor(days: number): number {
  return Math.max(2, Math.min(100, Math.round(100 - days * 4.6)));
}

function urgencyColor(score: number): string {
  if (score > 70) return "#ff4d5e";
  if (score > 40) return "#ffaa3c";
  return "#4dd08a";
}

export default function SpoilerDecayClockDemo({ accentColor, bgDark }: Props) {
  const [daysLeft, setDaysLeft] = useState<Record<string, number>>(
    () => Object.fromEntries(SKUS.map((s) => [s.id, s.initialDays]))
  );
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setDaysLeft((prev) => {
        const next: Record<string, number> = {};
        let allZero = true;
        for (const s of SKUS) {
          const v = Math.max(0, prev[s.id] - 0.6);
          next[s.id] = v;
          if (v > 0) allZero = false;
        }
        if (allZero) setRunning(false);
        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [running]);

  const ranked = [...SKUS].sort((a, b) => urgencyFor(daysLeft[b.id]) - urgencyFor(daysLeft[a.id]));

  const reset = () => {
    setRunning(false);
    setDaysLeft(Object.fromEntries(SKUS.map((s) => [s.id, s.initialDays])));
  };

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Decay clock</p>
            <div className="flex gap-2">
              <button
                onClick={() => setRunning((r) => !r)}
                className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: running ? `${accentColor}22` : accentColor,
                  color: running ? accentColor : bgDark,
                  border: `1px solid ${accentColor}`,
                }}
              >
                {running ? "Pause" : "Run clock"}
              </button>
              <button
                onClick={reset}
                className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {ranked.map((sku) => {
              const days = daysLeft[sku.id];
              const score = urgencyFor(days);
              const buyer = buyerFor(days);
              const color = urgencyColor(score);
              return (
                <motion.div
                  key={sku.id}
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="rounded-xl p-3.5"
                  style={{ background: "rgba(255,255,255,0.045)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white text-xs font-semibold">{sku.name}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">{sku.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono tabular-nums" style={{ color }}>
                        {days.toFixed(1)}d left
                      </p>
                    </div>
                  </div>

                  <div className="h-1.5 rounded-full overflow-hidden mb-2.5" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: color }}
                      animate={{ width: `${score}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-white/35 uppercase tracking-wider">
                      Urgency <span className="font-mono tabular-nums" style={{ color }}>{score}</span>
                    </span>
                    <motion.span
                      layoutId={`buyer-${sku.id}`}
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${accentColor}1c`, color: accentColor, border: `1px solid ${accentColor}44` }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    >
                      → {buyer}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-white/35 text-[10px] leading-relaxed mt-5">
            Each SKU&apos;s urgency score rises as days-to-expiry shrink, re-ranking which buyer type the offer
            would route to next, discount grocer, then liquidator, then export broker. Sample SKUs and clock speed,
            built for this demo only.
          </p>
        </div>
      </div>
    </div>
  );
}
