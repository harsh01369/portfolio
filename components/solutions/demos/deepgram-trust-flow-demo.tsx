"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Retention = "retain" | "autodelete";

const STAGES = [
  { label: "Ingest", lock: false },
  { label: "Encrypted in transit", lock: true },
  { label: "Processed", lock: false },
  { label: "Encrypted at rest", lock: true },
  { label: "Retention", lock: false },
];

export default function DeepgramTrustFlowDemo({ accentColor, bgDark }: Props) {
  const [retention, setRetention] = useState<Retention>("autodelete");
  const [runKey, setRunKey] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);

  function sendRequest() {
    setRunKey((k) => k + 1);
    setActiveStage(0);
    STAGES.forEach((_, i) => {
      window.setTimeout(() => setActiveStage(i), i * 420);
    });
  }

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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Request data-flow visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["retain", "autodelete"] as Retention[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRetention(r)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: retention === r ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {retention === r && (
                    <motion.div
                      layoutId="dg-retention-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{r === "retain" ? "Retain audio" : "Auto-delete on schedule"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-between mb-6 px-1">
            <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2" style={{ background: "rgba(255,255,255,0.1)" }} />
            {STAGES.map((stage, i) => {
              const reached = activeStage >= i;
              return (
                <div key={`${runKey}-${stage.label}`} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                  <motion.div
                    animate={{
                      scale: activeStage === i ? 1.15 : 1,
                      background: reached ? accentColor : "rgba(255,255,255,0.08)",
                      borderColor: reached ? accentColor : "rgba(255,255,255,0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="w-7 h-7 rounded-full flex items-center justify-center border"
                    style={{ color: reached ? bgDark : "rgba(255,255,255,0.4)" }}
                  >
                    {stage.lock ? (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <rect x="5" y="11" width="14" height="9" rx="1.5" fill="currentColor" />
                        <path d="M8 11V7a4 4 0 118 0v4" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                    ) : (
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    )}
                  </motion.div>
                  <span
                    className="text-[8.5px] text-center leading-tight max-w-[62px]"
                    style={{ color: reached ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}
                  >
                    {stage.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={sendRequest}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Send audio request
            </button>
          </div>

          <div className="min-h-[70px]">
            <AnimatePresence mode="wait">
              {activeStage === STAGES.length - 1 && (
                <motion.div
                  key={`${runKey}-${retention}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {retention === "retain" ? "Audio retained under account policy" : "Audio deleted on schedule"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {retention === "retain"
                      ? "This request's audio and transcript stay available for model improvement opt-in, encrypted at rest until the account owner removes it."
                      : "This request's audio is purged automatically 30 days after processing, transcript retained per account policy, raw voiceprint is not."}
                  </p>
                </motion.div>
              )}
              {activeStage !== STAGES.length - 1 && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Every request moving through this pipeline, visible end to end, the transparency your own developers don&apos;t currently get.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
