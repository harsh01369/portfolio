"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "complete" | "incomplete";
type Phase = "idle" | "checking" | "done";

export default function ClaimHealthPacketGapDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("complete");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("checking");
    window.setTimeout(() => setPhase("done"), 900);
  }

  const checking = phase === "checking";
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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Smart intake visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["complete", "incomplete"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="claimhealth-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "complete" ? "Complete packet" : "Missing field"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Referral packet received</p>
            <p className="text-white text-xs font-semibold mb-1 font-mono">
              {mode === "complete" ? "Diagnosis code, physician order, and prior notes attached" : "Diagnosis code attached, no physician order on file"}
            </p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">checked against clinical criteria</p>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Run authorization
            </button>
          </div>

          <div className="min-h-[90px]">
            <AnimatePresence mode="wait">
              {checking && (
                <motion.div
                  key={`checking-${runKey}`}
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
                  <span className="text-white/40 text-[11px]">Checking packet against clinical criteria...</span>
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
                  <p className="text-white text-xs font-semibold mb-1 font-mono tabular-nums">
                    {mode === "complete" ? "Authorization approved, finding cited to source" : "Held: gap found, routed to reviewer"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {mode === "complete"
                      ? "Claim Health's own site says it automates every authorization from submission to renewal, with findings cited back to the source document."
                      : "That same site also says every packet is read against your own clinical criteria. A missing physician order is the gap \"automates every\" doesn't name, surfacing automatically instead of silently."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Run the same authorization on a complete packet and one missing a field to see what "every" actually covers.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
