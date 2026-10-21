"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Phase = "idle" | "scanning" | "done";

interface ReceiptRow {
  category: string;
  dataType: string;
  bytes: string;
  points: number;
}

const ROWS: ReceiptRow[] = [
  { category: "Public news domains", dataType: "HTML + metadata", bytes: "4.2 MB", points: 12 },
  { category: "E-commerce product pages", dataType: "structured text", bytes: "1.8 MB", points: 6 },
  { category: "Public forum threads", dataType: "plain text", bytes: "2.6 MB", points: 9 },
  { category: "Open government datasets", dataType: "CSV / JSON", bytes: "0.9 MB", points: 4 },
];

const NEVER_INCLUDES = [
  "Logged-in or authenticated sessions",
  "Personal email, DMs, or messaging apps",
  "Banking, payment, or health portals",
  "Anything behind a password you typed",
];

export default function WyndlabsTrustReceiptDemo({ accentColor, bgDark }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [visibleRows, setVisibleRows] = useState(0);

  useEffect(() => {
    if (phase !== "scanning") return;
    if (visibleRows >= ROWS.length) {
      const t = setTimeout(() => setPhase("done"), 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleRows((v) => v + 1), 420);
    return () => clearTimeout(t);
  }, [phase, visibleRows]);

  const runSimulation = () => {
    setVisibleRows(0);
    setPhase("scanning");
  };

  const reset = () => {
    setPhase("idle");
    setVisibleRows(0);
  };

  const totalBytes = ROWS.slice(0, visibleRows).reduce((sum, r) => sum + parseFloat(r.bytes), 0);
  const totalPoints = ROWS.slice(0, visibleRows).reduce((sum, r) => sum + r.points, 0);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Bandwidth trust receipt</p>
            {phase !== "idle" && (
              <button
                onClick={reset}
                className="text-white/35 hover:text-white/60 text-[10px] uppercase tracking-wide transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="min-h-[300px]">
            {phase === "idle" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[260px] gap-4"
              >
                <p className="text-white/45 text-xs text-center leading-relaxed max-w-[320px]">
                  Simulate one crawl session through your node. A transparency receipt is generated showing exactly
                  what categories were crawled, nothing from your own private sessions.
                </p>
                <motion.button
                  onClick={runSimulation}
                  whileTap={{ scale: 0.96 }}
                  className="rounded-full px-5 py-2.5 text-xs font-semibold"
                  style={{ background: accentColor, color: bgDark }}
                >
                  Run crawl simulation
                </motion.button>
              </motion.div>
            )}

            {phase !== "idle" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center gap-1.5 mb-3">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                    animate={phase === "scanning" ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                    transition={{ duration: 1, repeat: phase === "scanning" ? Infinity : 0 }}
                  />
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>
                    {phase === "scanning" ? "Scanning session, node #A41F" : "Session receipt, node #A41F"}
                  </p>
                </div>

                <div className="space-y-2 mb-3">
                  <AnimatePresence>
                    {ROWS.slice(0, visibleRows).map((row) => (
                      <motion.div
                        key={row.category}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <div>
                          <p className="text-white text-xs font-semibold">{row.category}</p>
                          <p className="text-white/35 text-[10px] mt-0.5">{row.dataType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/70 text-xs font-mono tabular-nums">{row.bytes}</p>
                          <p className="text-[10px] font-mono tabular-nums" style={{ color: accentColor }}>
                            +{row.points} pts
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {phase === "done" && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between rounded-lg px-3.5 py-2.5 mb-3"
                      style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}` }}
                    >
                      <p className="text-white text-xs font-semibold">Session total</p>
                      <p className="text-xs font-mono tabular-nums font-semibold" style={{ color: accentColor }}>
                        {totalBytes.toFixed(1)} MB · {totalPoints} pts
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="rounded-lg px-3.5 py-3"
                      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <p className="text-white/50 text-[10px] uppercase tracking-wide font-semibold mb-2">
                        Never includes
                      </p>
                      <ul className="space-y-1">
                        {NEVER_INCLUDES.map((item) => (
                          <li key={item} className="text-white/35 text-[11px] flex items-start gap-1.5">
                            <span className="mt-0.5">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
