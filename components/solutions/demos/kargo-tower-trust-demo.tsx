"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Scenario = "normal" | "compromised";

interface Tower {
  id: string;
  label: string;
  bay: string;
}

const TOWERS: Tower[] = [
  { id: "T-01", label: "Tower 01", bay: "Dock 3" },
  { id: "T-02", label: "Tower 02", bay: "Dock 4" },
  { id: "T-03", label: "Tower 03", bay: "Dock 5" },
  { id: "T-04", label: "Tower 04", bay: "Dock 6" },
  { id: "T-05", label: "Tower 05", bay: "Dock 7" },
  { id: "T-06", label: "Tower 06", bay: "Dock 8" },
];

const COMPROMISED_ID = "T-04";

const STAGES = [
  "Device identity attested",
  "Mesh link encrypted",
  "Firmware integrity check",
  "CV reading signed",
  "Delivered to WMS",
];

const FAIL_COLOR = "#E5484D";

export default function KargoTowerTrustDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);
  const [failedAt, setFailedAt] = useState<number | null>(null);

  const isCompromisedTower = (id: string) => scenario === "compromised" && id === COMPROMISED_ID;

  function clickTower(id: string) {
    setSelectedId(id);
    setRunKey((k) => k + 1);
    setActiveStage(-1);
    setFailedAt(null);
    const willFailAt = isCompromisedTower(id) ? 2 : null; // caught at firmware integrity check
    let stopped = false;
    STAGES.forEach((_, i) => {
      window.setTimeout(() => {
        if (stopped) return;
        setActiveStage(i);
        if (willFailAt !== null && i === willFailAt) {
          setFailedAt(i);
          stopped = true;
        }
      }, i * 480);
    });
  }

  const hasRun = activeStage >= 0;
  const isDone = failedAt === null && activeStage === STAGES.length - 1;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Tower Trust Ledger</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["normal", "compromised"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setScenario(s);
                    setSelectedId(null);
                    setActiveStage(-1);
                    setFailedAt(null);
                  }}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: scenario === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {scenario === s && (
                    <motion.div
                      layoutId="kargo-scenario-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: s === "normal" ? accentColor : FAIL_COLOR }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s === "normal" ? "Normal fleet" : "Compromised tower"}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">Dock floor, click a tower</p>
          <div className="grid grid-cols-6 gap-1.5 mb-5">
            {TOWERS.map((t) => {
              const flagged = isCompromisedTower(t.id);
              const selected = selectedId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => clickTower(t.id)}
                  className="relative rounded-lg py-2.5 flex flex-col items-center gap-1 transition-transform"
                  style={{
                    background: selected ? `${accentColor}1f` : "rgba(255,255,255,0.04)",
                    border: selected ? `1px solid ${accentColor}` : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {flagged && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                      style={{ background: FAIL_COLOR }}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  )}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="20" rx="1.5" fill={selected ? accentColor : "rgba(255,255,255,0.3)"} />
                    <rect x="4" y="6" width="3" height="4" rx="0.5" fill={selected ? accentColor : "rgba(255,255,255,0.25)"} />
                    <rect x="17" y="6" width="3" height="4" rx="0.5" fill={selected ? accentColor : "rgba(255,255,255,0.25)"} />
                  </svg>
                  <span className="text-[7.5px] text-white/50 font-mono">{t.id}</span>
                </button>
              );
            })}
          </div>

          <div className="min-h-[150px]">
            <AnimatePresence mode="wait">
              {!selectedId && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/30 text-[11px] text-center pt-10"
                >
                  Select a Tower to watch its freight-scan event move through the ledger.
                </motion.p>
              )}

              {selectedId && (
                <motion.div key={`${runKey}-${selectedId}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="relative flex items-center justify-between mb-4 px-1">
                    <div className="absolute left-3 right-3 top-3.5 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
                    {STAGES.map((stage, i) => {
                      const neverReached = failedAt !== null && i > failedAt;
                      const isFail = failedAt === i;
                      const reached = activeStage >= i && !neverReached;
                      return (
                        <div key={stage} className="relative z-10 flex flex-col items-center gap-1 flex-1">
                          <motion.div
                            animate={{
                              scale: activeStage === i ? 1.18 : 1,
                              background: isFail ? FAIL_COLOR : reached ? accentColor : "rgba(255,255,255,0.08)",
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="w-6 h-6 rounded-full flex items-center justify-center border"
                            style={{ borderColor: isFail ? FAIL_COLOR : reached ? accentColor : "rgba(255,255,255,0.15)" }}
                          >
                            {isFail ? (
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                                <path d="M6 6l12 12M18 6L6 18" stroke={bgDark} strokeWidth="3.5" strokeLinecap="round" />
                              </svg>
                            ) : reached ? (
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                                <path d="M5 13l4 4L19 7" stroke={bgDark} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <span className="text-[8px] font-bold text-white/35">{i + 1}</span>
                            )}
                          </motion.div>
                          <span
                            className="text-[7.5px] text-center leading-tight max-w-[54px]"
                            style={{ color: isFail ? FAIL_COLOR : reached ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.28)" }}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {failedAt !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg px-3.5 py-3"
                      style={{ background: "rgba(229,72,77,0.1)", border: "1px solid rgba(229,72,77,0.4)" }}
                    >
                      <p className="text-white text-xs font-semibold mb-1">
                        {selectedId} rejected before reaching the WMS
                      </p>
                      <p className="text-white/50 text-[10.5px] leading-relaxed">
                        Its firmware hash didn&apos;t match the last known-good build on file. The scan never left
                        the mesh, no freight record was written to the warehouse dashboard.
                      </p>
                    </motion.div>
                  )}
                  {isDone && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg px-3.5 py-3"
                      style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                    >
                      <p className="text-white text-xs font-semibold mb-1">
                        {selectedId} scan delivered to the WMS dashboard
                      </p>
                      <p className="text-white/50 text-[10.5px] leading-relaxed">
                        Identity, mesh link, firmware, and the CV reading itself all verified before the freight
                        record reached ERP/TMS/WMS, a tampered Tower never gets this far.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
