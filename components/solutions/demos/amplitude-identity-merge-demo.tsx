"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "shared" | "preserved";
type Phase = "idle" | "anonBrowsing" | "login" | "done";

export default function AmplitudeIdentityMergeDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("preserved");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("anonBrowsing");
    window.setTimeout(() => setPhase("login"), 750);
    window.setTimeout(() => setPhase("done"), 1550);
  }

  const browsed = phase !== "idle";
  const loggedIn = phase === "login" || phase === "done";
  const done = phase === "done";
  const merged = mode === "shared" && done;

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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Shared-device identity trace</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["shared", "preserved"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="amplitude-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "shared" ? "Device ID reset on logout" : "Device ID preserved"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Device: Kiosk-04 (lobby tablet)</p>
            <p className="text-white text-xs font-semibold mb-1">Anonymous ID: dev_8f21</p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">Priya browsed pricing, viewed enterprise plan</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: browsed ? accentColor : "rgba(255,255,255,0.1)",
                background: browsed ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Anonymous session</p>
              <p className="text-white/70 text-[10.5px]">{browsed ? "dev_8f21: pricing, enterprise plan" : "No activity yet"}</p>
            </motion.div>
            <motion.div
              animate={{
                borderColor: loggedIn ? accentColor : "rgba(255,255,255,0.1)",
                background: loggedIn ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Next login on Kiosk-04</p>
              <p className="text-white/70 text-[10.5px]">{loggedIn ? "user_id: marcus_t logs in" : "Waiting"}</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              A different person logs in on the same kiosk
            </button>
          </div>

          <div className="min-h-[110px]">
            <AnimatePresence mode="wait">
              {phase !== "idle" && !done && (
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
                    {phase === "anonBrowsing" && "Priya browses anonymously on dev_8f21..."}
                    {phase === "login" && "marcus_t sends his first identified event..."}
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
                    background: merged ? "#F8717122" : `${accentColor}14`,
                    border: `1px solid ${merged ? "#F87171" : accentColor}55`,
                  }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {merged ? "marcus_t's profile now shows Priya's enterprise-plan interest" : "marcus_t's profile starts clean"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {merged
                      ? "Amplitude joins previous anonymous events on a device to whoever logs in next. Because dev_8f21 wasn't reset after Priya's session, her browsing merged into marcus_t's identity the moment he logged in."
                      : "Resetting the device's anonymous ID on logout meant marcus_t's login started a fresh anonymous identity with nothing to join, so Priya's session stayed hers alone."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  A shared device carries whoever used it last. Trigger a second login and see whose history
                  follows.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
