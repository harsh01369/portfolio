"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Verdict = "pending" | "checking" | "cleared" | "flagged";

interface FuelTxn {
  id: string;
  vehicle: string;
  driver: string;
  pumpLocation: string;
  gallons: number;
  amount: number;
  telematicsLocation: string;
  distanceFromPump: number;
  tankCapacityGal: number;
  tankBeforeGal: number;
  verdict: Verdict;
  reason: string;
}

const SEED: Omit<FuelTxn, "verdict">[] = [
  {
    id: "t1",
    vehicle: "Truck 14 (F-150)",
    driver: "R. Alvarez",
    pumpLocation: "Shell, Route 9, Dayton OH",
    gallons: 18.2,
    amount: 64.1,
    telematicsLocation: "Shell, Route 9, Dayton OH",
    distanceFromPump: 0,
    tankCapacityGal: 26,
    tankBeforeGal: 7.1,
    reason: "Telematics location matches pump, 18.2 gal fits remaining 18.9 gal of tank capacity.",
  },
  {
    id: "t2",
    vehicle: "Truck 14 (F-150)",
    driver: "R. Alvarez",
    pumpLocation: "Pilot, I-70 Exit 44, Columbus OH",
    gallons: 22.0,
    amount: 79.42,
    telematicsLocation: "Warehouse dock, Dayton OH",
    distanceFromPump: 71,
    tankCapacityGal: 26,
    tankBeforeGal: 19.4,
    reason: "Truck was 71 miles away in Dayton when this purchase posted in Columbus.",
  },
  {
    id: "t3",
    vehicle: "Van 3 (Transit)",
    driver: "K. Osei",
    pumpLocation: "BP, Main St, Akron OH",
    gallons: 15.6,
    amount: 54.8,
    telematicsLocation: "BP, Main St, Akron OH",
    distanceFromPump: 0.1,
    tankCapacityGal: 25,
    tankBeforeGal: 9.8,
    reason: "Location matches within 0.1 miles, gallons fit the remaining 15.2 gal of tank capacity.",
  },
  {
    id: "t4",
    vehicle: "Van 3 (Transit)",
    driver: "K. Osei",
    pumpLocation: "Speedway, Canton OH",
    gallons: 19.0,
    amount: 68.3,
    telematicsLocation: "Speedway, Canton OH",
    distanceFromPump: 0,
    tankCapacityGal: 25,
    tankBeforeGal: 4.2,
    reason: "Tank only had 4.2 gal left, 19.0 gal purchased exceeds the 20.8 gal of physical room in the tank.",
  },
  {
    id: "t5",
    vehicle: "Truck 22 (Silverado)",
    driver: "M. Chen",
    pumpLocation: "Marathon, Toledo OH",
    gallons: 24.5,
    amount: 86.9,
    telematicsLocation: "Marathon, Toledo OH",
    distanceFromPump: 0,
    tankCapacityGal: 31,
    tankBeforeGal: 5.0,
    reason: "Location matches, 24.5 gal fits the remaining 26 gal of tank capacity.",
  },
];

const OUTCOME: Record<string, "cleared" | "flagged"> = {
  t1: "cleared",
  t2: "flagged",
  t3: "cleared",
  t4: "flagged",
  t5: "cleared",
};

export default function CoastGhostFillDemo({ accentColor, bgDark }: Props) {
  const [txns, setTxns] = useState<FuelTxn[]>(SEED.map((t) => ({ ...t, verdict: "pending" })));
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    if (cursor >= txns.length) return;
    if (txns[cursor].verdict !== "checking") return;
    const timeout = setTimeout(() => {
      setTxns((prev) =>
        prev.map((t, i) => (i === cursor ? { ...t, verdict: OUTCOME[t.id] } : t))
      );
    }, 900);
    return () => clearTimeout(timeout);
  }, [cursor, txns]);

  const runNext = () => {
    if (cursor >= txns.length) return;
    setTxns((prev) => prev.map((t, i) => (i === cursor ? { ...t, verdict: "checking" } : t)));
    setTimeout(() => setCursor((c) => c + 1), 950);
  };

  const clearedCount = txns.filter((t) => t.verdict === "cleared").length;
  const flaggedCount = txns.filter((t) => t.verdict === "flagged").length;
  const done = cursor >= txns.length;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Ghost fill detector</p>
              <p className="text-white text-sm font-semibold mt-1">Live fuel transaction feed</p>
            </div>
            <div className="flex gap-1.5">
              <span
                className="text-[9px] font-semibold px-2 py-1 rounded-full tabular-nums"
                style={{ background: `${accentColor}1a`, color: accentColor, border: `1px solid ${accentColor}44` }}
              >
                {clearedCount} cleared
              </span>
              <span
                className="text-[9px] font-semibold px-2 py-1 rounded-full tabular-nums"
                style={{ background: "rgba(248,81,73,0.12)", color: "#f87171", border: "1px solid rgba(248,81,73,0.35)" }}
              >
                {flaggedCount} flagged
              </span>
            </div>
          </div>

          <div className="space-y-2 min-h-[320px]">
            {txns.slice(0, cursor + 1).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-lg px-3.5 py-3"
                style={{
                  background:
                    t.verdict === "flagged"
                      ? "rgba(248,81,73,0.08)"
                      : t.verdict === "cleared"
                      ? `${accentColor}10`
                      : "rgba(255,255,255,0.04)",
                  border: `1px solid ${
                    t.verdict === "flagged" ? "rgba(248,81,73,0.4)" : t.verdict === "cleared" ? `${accentColor}55` : "rgba(255,255,255,0.1)"
                  }`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-xs font-semibold">{t.vehicle}</p>
                      <span className="text-white/30 text-[10px]">{t.driver}</span>
                    </div>
                    <p className="text-white/50 text-[10px] mb-1">
                      {t.pumpLocation} · <span className="tabular-nums">{t.gallons.toFixed(1)} gal</span> ·{" "}
                      <span className="tabular-nums">${t.amount.toFixed(2)}</span>
                    </p>

                    <AnimatePresence mode="wait">
                      {t.verdict === "checking" && (
                        <motion.div
                          key="checking"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-1.5 mt-1.5"
                        >
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: accentColor }}
                            animate={{ opacity: [1, 0.25, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                          <span className="text-white/40 text-[10px]">
                            checking against telematics at {t.telematicsLocation}...
                          </span>
                        </motion.div>
                      )}
                      {(t.verdict === "cleared" || t.verdict === "flagged") && (
                        <motion.p
                          key="reason"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-[10px] leading-relaxed mt-1.5"
                          style={{ color: t.verdict === "flagged" ? "#f87171" : "rgba(255,255,255,0.55)" }}
                        >
                          {t.reason}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="shrink-0">
                    {t.verdict === "pending" && (
                      <span className="text-[9px] text-white/25 uppercase tracking-wider">queued</span>
                    )}
                    {t.verdict === "checking" && (
                      <span className="text-[9px] uppercase tracking-wider" style={{ color: accentColor }}>
                        checking
                      </span>
                    )}
                    {t.verdict === "cleared" && (
                      <motion.span
                        layoutId={`badge-${t.id}`}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                        style={{ background: accentColor, color: bgDark }}
                      >
                        cleared
                      </motion.span>
                    )}
                    {t.verdict === "flagged" && (
                      <motion.span
                        layoutId={`badge-${t.id}`}
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 24 }}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                        style={{ background: "#f87171", color: bgDark }}
                      >
                        flagged
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5">
            {!done ? (
              <button
                onClick={runNext}
                disabled={txns[cursor]?.verdict === "checking"}
                className="w-full text-xs font-semibold py-2.5 rounded-lg transition-opacity disabled:opacity-50"
                style={{ background: accentColor, color: bgDark }}
              >
                {cursor === 0 ? "Run next transaction check" : "Check next incoming purchase"}
              </button>
            ) : (
              <p className="text-white/35 text-[10px] text-center leading-relaxed">
                Feed complete. Every purchase is checked against telematics location and tank room at the exact
                purchase timestamp, not a monthly statement review. Sample vehicles and transactions, built for this
                demo only.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
