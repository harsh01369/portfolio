"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Scenario = "clean" | "conflicting";

const FEEDS = {
  clean: [
    { carrier: "Progressive feed", renewal: "2026-03-14", limit: "$500,000" },
    { carrier: "Agency mgmt system", renewal: "2026-03-14", limit: "$500,000" },
    { carrier: "Carrier EDI batch", renewal: "2026-03-14", limit: "$500,000" },
  ],
  conflicting: [
    { carrier: "Progressive feed", renewal: "2026-03-14", limit: "$500,000" },
    { carrier: "Agency mgmt system", renewal: "2026-03-21", limit: "$500,000" },
    { carrier: "Carrier EDI batch", renewal: "2026-03-14", limit: "$350,000" },
  ],
};

export default function CovuGoldenRecordDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<Scenario>("clean");
  const [resolved, setResolved] = useState(false);

  const feeds = FEEDS[scenario];
  const hasConflict = scenario === "conflicting";

  function runReconciliation() {
    setResolved(false);
    window.setTimeout(() => setResolved(true), 50);
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Golden record reconciliation</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["clean", "conflicting"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setScenario(s);
                    setResolved(false);
                  }}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: scenario === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {scenario === s && (
                    <motion.div
                      layoutId="covu-scenario-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s === "clean" ? "Clean feeds" : "Conflicting feeds"}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">Incoming carrier feeds, policy #AP-20481</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {feeds.map((f, i) => (
              <motion.div
                key={f.carrier}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="rounded-lg px-2.5 py-2.5"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-white/40 text-[9px] leading-tight mb-1.5">{f.carrier}</p>
                <p className="text-white text-[10px] font-mono tabular-nums">{f.renewal}</p>
                <p className="text-white text-[10px] font-mono tabular-nums">{f.limit}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={runReconciliation}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Run reconciliation
            </button>
          </div>

          <div className="min-h-[150px]">
            <AnimatePresence mode="wait">
              {resolved && (
                <motion.div
                  key={`${scenario}-resolved`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="rounded-lg px-3.5 py-3 mb-3"
                    style={{
                      background: hasConflict ? `${accentColor}10` : `${accentColor}18`,
                      border: `1px solid ${hasConflict ? "rgba(255,255,255,0.15)" : accentColor}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-white text-xs font-semibold">Golden Policy Journal</p>
                      <span
                        className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{
                          background: hasConflict ? "rgba(255,255,255,0.1)" : `${accentColor}30`,
                          color: hasConflict ? "rgba(255,255,255,0.6)" : accentColor,
                        }}
                      >
                        {hasConflict ? "Conflict flagged" : "High confidence"}
                      </span>
                    </div>
                    <p className="text-white/60 text-[11px] font-mono tabular-nums">
                      renewal: {hasConflict ? "2 of 3 feeds agree" : "2026-03-14"}
                    </p>
                    <p className="text-white/60 text-[11px] font-mono tabular-nums">
                      limit: {hasConflict ? "2 of 3 feeds agree" : "$500,000"}
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-white/35 text-[10px] uppercase tracking-wider shrink-0">AI router</span>
                    <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.1)" }} />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.35 }}
                    className="rounded-lg px-3.5 py-2.5 mt-2"
                    style={{
                      background: hasConflict ? "rgba(255,255,255,0.04)" : `${accentColor}14`,
                      border: `1px solid ${hasConflict ? "rgba(255,255,255,0.1)" : `${accentColor}55`}`,
                    }}
                  >
                    <p className="text-white text-xs font-semibold">
                      {hasConflict ? "Routed to licensed professional" : "Auto-handled by AI"}
                    </p>
                    <p className="text-white/45 text-[10px] leading-relaxed mt-1">
                      {hasConflict
                        ? "Service request (coverage verification) quarantined, a Golden Record with an open conflict can't be trusted for automated action."
                        : "Service request (coverage verification) answered directly from the Golden Record, no human needed."}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {!resolved && (
              <p className="text-white/30 text-[11px] text-center pt-10">
                Three feeds, one record. Run reconciliation to watch it resolve.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
