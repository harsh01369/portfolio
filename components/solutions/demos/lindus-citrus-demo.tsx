"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "cro" | "citrus";

interface Milestone {
  id: string;
  label: string;
  pct: number;
  fixedPrice: number;
}

const MILESTONES: Milestone[] = [
  { id: "m1", label: "Site activation", pct: 25, fixedPrice: 40000 },
  { id: "m2", label: "First patient enrolled", pct: 50, fixedPrice: 85000 },
  { id: "m3", label: "Last patient enrolled", pct: 75, fixedPrice: 140000 },
  { id: "m4", label: "Database lock", pct: 100, fixedPrice: 180000 },
];

export default function LindusCitrusDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("cro");
  const [step, setStep] = useState(0);
  const [croCost, setCroCost] = useState(12400);

  const progressPct = step === 0 ? 0 : MILESTONES[step - 1].pct;
  const done = step >= MILESTONES.length;

  useEffect(() => {
    if (mode !== "cro" || done) return;
    const interval = setInterval(() => {
      setCroCost((c) => c + Math.round(180 + Math.random() * 260));
    }, 450);
    return () => clearInterval(interval);
  }, [mode, done]);

  const advance = () => {
    if (done) return;
    setStep((s) => s + 1);
  };

  const lindusLocked = step > 0 ? MILESTONES[step - 1].fixedPrice : 0;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Trial billing model</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["cro", "citrus"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "cro" ? "Traditional CRO" : "Lindus Citrus"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/50 text-[10px] uppercase tracking-wider">Trial progress</span>
              <span className="text-white text-[11px] font-semibold tabular-nums">{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: accentColor }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          <div className="space-y-2 mb-5">
            {MILESTONES.map((m, i) => {
              const hit = step > i;
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
                  style={{
                    background: hit ? `${accentColor}12` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${hit ? accentColor + "55" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <span className="text-white/75 text-[11px]">{m.label}</span>
                  <AnimatePresence mode="wait">
                    {!hit ? (
                      <motion.span key="pending" className="text-white/25 text-[9px] uppercase tracking-wider">
                        pending
                      </motion.span>
                    ) : mode === "citrus" ? (
                      <motion.span
                        key="locked"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 420, damping: 26 }}
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                        style={{ background: accentColor, color: bgDark }}
                      >
                        paid · ${m.fixedPrice.toLocaleString()} locked
                      </motion.span>
                    ) : (
                      <motion.span key="billed" className="text-white/40 text-[9px] uppercase tracking-wider">
                        hit, hours still billing
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${accentColor}33` }}
          >
            <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-1.5">
              {mode === "cro" ? "Running cost meter" : "Sponsor cost, locked per milestone"}
            </p>
            <AnimatePresence mode="wait">
              {mode === "cro" ? (
                <motion.p
                  key="cro-cost"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-2xl font-bold tabular-nums"
                >
                  ${croCost.toLocaleString()}
                  {!done && (
                    <motion.span
                      className="inline-block w-1.5 h-1.5 rounded-full ml-2"
                      style={{ background: "#f87171" }}
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  )}
                </motion.p>
              ) : (
                <motion.p
                  key="citrus-cost"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white text-2xl font-bold tabular-nums"
                  style={{ color: accentColor }}
                >
                  ${lindusLocked.toLocaleString()}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-white/40 text-[10px] mt-1.5 leading-relaxed">
              {mode === "cro"
                ? "Billable hours accrue continuously, whether or not a milestone is near. The sponsor can't predict the final number."
                : "Each milestone locks in a fixed price the instant it's hit. No meter runs in between, the sponsor knows the ceiling on day one."}
            </p>
          </div>

          <button
            onClick={advance}
            disabled={done}
            className="w-full text-xs font-semibold py-2.5 rounded-lg transition-opacity disabled:opacity-40"
            style={{ background: accentColor, color: bgDark }}
          >
            {done ? "Trial complete" : `Advance to: ${MILESTONES[step].label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
