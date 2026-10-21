"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Scenario = "normal" | "replay" | "expired";

const STEPS = [
  "Cert presented",
  "Validated against pinned chain",
  "Webhook signed, rotating secret",
  "Payload encrypted",
];

const FAIL_COLOR = "#E5484D";

// index into STEPS where each attack scenario gets caught, null = clean run
const FAIL_INDEX: Record<Scenario, number | null> = {
  normal: null,
  expired: 1,
  replay: 2,
};

const FAIL_REASON: Record<Scenario, string> = {
  normal: "",
  expired:
    "The issuer's certificate is past its TTL. Chain validation rejects it immediately, the handshake never reaches the signing step.",
  replay:
    "This webhook signature corresponds to a secret window that already rotated. The signature is valid for a secret that no longer exists, replay rejected.",
};

export default function SpadeMtlsHandshakeDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [runKey, setRunKey] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  function selectScenario(s: Scenario) {
    setScenario(s);
    setRunKey((k) => k + 1);
    setActiveStep(-1);
    const failAt = FAIL_INDEX[s];
    let stopped = false;
    STEPS.forEach((_, i) => {
      window.setTimeout(() => {
        if (stopped) return;
        setActiveStep(i);
        if (failAt !== null && i === failAt) stopped = true;
      }, i * 480);
    });
  }

  const failAt = FAIL_INDEX[scenario];
  const isDone = failAt === null && activeStep === STEPS.length - 1;
  const isRejected = failAt !== null && activeStep === failAt;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Enrichment handshake</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["normal", "replay", "expired"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => selectScenario(s)}
                  className="relative text-[10.5px] font-semibold px-2.5 py-1.5 rounded-full transition-colors"
                  style={{ color: scenario === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {scenario === s && (
                    <motion.div
                      layoutId="spade-scenario-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: s === "normal" ? accentColor : FAIL_COLOR }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {s === "normal" ? "Normal" : s === "replay" ? "Replay attack" : "Expired cert"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mb-6">
            <div
              className="rounded-lg px-3.5 py-3 text-center shrink-0"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <p className="text-white text-[11px] font-semibold">Bank issuer</p>
              <p className="text-white/35 text-[9px] mt-0.5">presents cert</p>
            </div>

            <div className="relative flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }}>
              <motion.div
                key={runKey}
                className="absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2"
                style={{ background: isRejected ? FAIL_COLOR : accentColor }}
                animate={{ left: isRejected ? ["0%", "45%"] : ["0%", "95%"] }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </div>

            <div
              className="rounded-lg px-3.5 py-3 text-center shrink-0 relative"
              style={{
                background: isRejected ? "rgba(229,72,77,0.08)" : `${accentColor}18`,
                border: `1px solid ${isRejected ? "rgba(229,72,77,0.4)" : accentColor}`,
              }}
            >
              <p className="text-white text-[11px] font-semibold">Spade</p>
              <p className="text-white/35 text-[9px] mt-0.5">enrichment service</p>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            {STEPS.map((step, i) => {
              const neverReached = failAt !== null && i > failAt;
              const isFail = failAt === i && activeStep >= i;
              const reached = activeStep >= i && !neverReached;
              return (
                <div key={`${runKey}-${step}`} className="flex items-center gap-2.5">
                  <motion.div
                    animate={{
                      background: isFail ? FAIL_COLOR : reached ? accentColor : "rgba(255,255,255,0.08)",
                    }}
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
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
                    className="text-[11px]"
                    style={{ color: isFail ? FAIL_COLOR : reached ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="min-h-[60px]">
            <AnimatePresence mode="wait">
              {isRejected && (
                <motion.div
                  key={`fail-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: "rgba(229,72,77,0.1)", border: "1px solid rgba(229,72,77,0.4)" }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Connection rejected, no data crossed the boundary</p>
                  <p className="text-white/50 text-[10.5px] leading-relaxed">{FAIL_REASON[scenario]}</p>
                </motion.div>
              )}
              {isDone && (
                <motion.div
                  key={`ok-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Enriched data delivered</p>
                  <p className="text-white/50 text-[10.5px] leading-relaxed">
                    Cert, chain, signature, and encryption all checked out, this is what the handshake looks like on
                    every legitimate request an issuer bank sends.
                  </p>
                </motion.div>
              )}
              {activeStep < 0 && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/30 text-[11px] text-center pt-2"
                >
                  Switch scenario above to replay the handshake.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
