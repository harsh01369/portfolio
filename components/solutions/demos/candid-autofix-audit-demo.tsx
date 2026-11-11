"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "silent" | "audited";
type Phase = "idle" | "detected" | "fixing" | "done";

export default function CandidAutofixAuditDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("audited");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("detected");
    window.setTimeout(() => setPhase("fixing"), 700);
    window.setTimeout(() => setPhase("done"), 1500);
  }

  const detected = phase !== "idle";
  const fixing = phase === "fixing" || phase === "done";
  const done = phase === "done";

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Auto-fix audit trail</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["silent", "audited"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="candid-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "silent" ? "Silent auto-fix" : "Logged + reviewable"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Claim CLM-48821</p>
            <p className="text-white text-xs font-semibold mb-1">CPT 99214, modifier missing</p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">$184.00 billed to Aetna</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: detected ? accentColor : "rgba(255,255,255,0.1)",
                background: detected ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Issue detected</p>
              <p className="text-white/70 text-[10.5px]">{detected ? "Modifier 25 missing for same-day E/M" : "Scanning..."}</p>
            </motion.div>
            <motion.div
              animate={{
                borderColor: fixing ? accentColor : "rgba(255,255,255,0.1)",
                background: fixing ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Auto-fix</p>
              <p className="text-white/70 text-[10.5px]">{fixing ? "Modifier 25 appended, resubmitting" : "Waiting"}</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Run the auto-fix on CLM-48821
            </button>
          </div>

          <div className="min-h-[110px]">
            <AnimatePresence mode="wait">
              {detected && !done && (
                <motion.div
                  key={`working-${runKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 pt-3"
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                  <span className="text-white/40 text-[11px]">
                    {phase === "detected" && "Flagging the modifier issue..."}
                    {phase === "fixing" && "Applying the fix and resubmitting to the payer..."}
                  </span>
                </motion.div>
              )}
              {done && (
                <motion.div
                  key={`done-${runKey}-${mode}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {mode === "silent" ? "Resubmitted, no record of what changed" : "Resubmitted with a reviewable diff"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {mode === "silent"
                      ? "The claim went back out to Aetna with the modifier added. If this fix pattern is wrong for a specific payer's rules, nobody finds out until a denial comes back weeks later, with no trail of what was actually changed."
                      : "The same fix, logged: modifier added, old and new claim lines diffed, and held for a biller to confirm before resubmission if this payer has flagged this exact modifier pattern before."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Detects and fixes issues for you is the pitch. Run it and see what changes between a silent fix
                  and a reviewable one.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
