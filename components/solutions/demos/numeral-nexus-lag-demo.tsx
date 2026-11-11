"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "instant" | "realistic";
type Phase = "idle" | "crossed" | "registering" | "done";

export default function NumeralNexusLagDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("realistic");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("crossed");
    const registerDelay = mode === "instant" ? 350 : 1200;
    window.setTimeout(() => setPhase("registering"), registerDelay);
    window.setTimeout(() => setPhase("done"), registerDelay + 700);
  }

  const crossed = phase !== "idle";
  const registering = phase === "registering" || phase === "done";
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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Nexus threshold monitor, Virginia</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["instant", "realistic"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="numeral-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "instant" ? "Registers same instant" : "Real registration lag"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Virginia exposure</p>
            <p className="text-white text-xs font-semibold mb-1 font-mono tabular-nums">$98,400 / $100,000 · 196 / 200 txns</p>
            <p className="text-white/55 text-[10.5px]">Approaching exposure</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: crossed ? accentColor : "rgba(255,255,255,0.1)",
                background: crossed ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">New Virginia sale</p>
              <p className="text-white/70 text-[10.5px]">{crossed ? "$3,100 order, threshold crossed" : "No new order"}</p>
            </motion.div>
            <motion.div
              animate={{
                borderColor: registering ? accentColor : "rgba(255,255,255,0.1)",
                background: registering ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Registration + collection</p>
              <p className="text-white/70 text-[10.5px]">{registering ? "Filing VA registration..." : "Not yet needed"}</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Cross the Virginia threshold
            </button>
          </div>

          <div className="min-h-[110px]">
            <AnimatePresence mode="wait">
              {crossed && !done && (
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
                    {phase === "crossed" && "Nexus established, orders keep coming in..."}
                    {phase === "registering" && "Registration submitted to Virginia..."}
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
                    background: mode === "realistic" ? "#F8717122" : `${accentColor}14`,
                    border: `1px solid ${mode === "realistic" ? "#F87171" : accentColor}55`,
                  }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {mode === "realistic" ? "3 more orders shipped before collection went live" : "Collection active before the next order"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {mode === "realistic"
                      ? "Virginia itself doesn't process a registration the instant it's filed. Every order that ships in that window is tax owed to the state with nothing collected from the buyer for it, a gap the guarantee covers after the fact, not one it closes in real time."
                      : "In this idealized timeline, collection flips on the moment the threshold is crossed, so every order after it already has the right tax collected."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Automatically register when you exceed a threshold doesn&apos;t say how long that takes. Cross
                  it and see what ships in the meantime.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
