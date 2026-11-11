"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "reprocessed" | "pinned";
type Phase = "idle" | "specUpdate" | "recalc" | "done";

export default function InsifyPolicyVersioningDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("pinned");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("specUpdate");
    window.setTimeout(() => setPhase("recalc"), 700);
    window.setTimeout(() => setPhase("done"), 1550);
  }

  const specUpdated = phase !== "idle";
  const recalculating = phase === "recalc" || phase === "done";
  const done = phase === "done";
  const reprocessed = mode === "reprocessed" && done;

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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Carrier spec versioning</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["reprocessed", "pinned"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="insify-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "reprocessed" ? "Live spec always applies" : "Pinned at issuance"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Policy POL-5523</p>
            <p className="text-white text-xs font-semibold mb-1">Electronics cover, issued under carrier spec v12</p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">Premium: €340/yr, mid-lifecycle</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: specUpdated ? accentColor : "rgba(255,255,255,0.1)",
                background: specUpdated ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Carrier update</p>
              <p className="text-white/70 text-[10.5px]">{specUpdated ? "Underwriting spec v13 published" : "Spec v12 current"}</p>
            </motion.div>
            <motion.div
              animate={{
                borderColor: recalculating ? accentColor : "rgba(255,255,255,0.1)",
                background: recalculating ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">POL-5523 recalculation</p>
              <p className="text-white/70 text-[10.5px]">{recalculating ? "Checking policy against current rules" : "Not triggered"}</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Carrier publishes a new underwriting spec
            </button>
          </div>

          <div className="min-h-[110px]">
            <AnimatePresence mode="wait">
              {specUpdated && !done && (
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
                    {phase === "specUpdate" && "v13 rolling out across the platform..."}
                    {phase === "recalc" && "Evaluating POL-5523 against the active spec..."}
                  </span>
                </motion.div>
              )}
              {done && (
                <motion.div
                  key={`done-${runKey}-${mode}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{
                    background: reprocessed ? "#F8717122" : `${accentColor}14`,
                    border: `1px solid ${reprocessed ? "#F87171" : accentColor}55`,
                  }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {reprocessed ? "POL-5523 silently reassessed under v13" : "POL-5523 stays on v12 until renewal"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {reprocessed
                      ? "The same underwriting engine serves every policy off the live spec. v13 changed electronics cover limits, so a policy issued under v12's promises now gets evaluated against rules the customer never agreed to."
                      : "Issuance-time pinning means POL-5523 keeps evaluating against the exact v12 terms it was sold under. v13 only applies to policies written after it published."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Every carrier has its own spec, every product its own rules. Publish an update and see what
                  happens to a policy already in flight.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
