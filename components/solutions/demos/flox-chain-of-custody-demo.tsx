"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Stage {
  id: string;
  label: string;
  tag: string;
}

const STAGES: Stage[] = [
  { id: "manifest", label: "manifest.toml", tag: "sha256:2f9a1c declared" },
  { id: "build", label: "Locked build", tag: "build attestation signed" },
  { id: "sbom", label: "Signed SBOM", tag: "SBOM signed, cosign" },
  { id: "artifact", label: "Published artifact", tag: "registry signature valid" },
  { id: "pull", label: "Customer pull", tag: "chain of custody intact" },
];

// Tampering can be injected at any stage except the last, there's nothing
// after "customer pull" left to catch it.
const TAMPER_OPTIONS = [
  { id: -1, label: "Clean run" },
  { id: 0, label: "Manifest" },
  { id: 1, label: "Locked build" },
  { id: 2, label: "Signed SBOM" },
  { id: 3, label: "Artifact" },
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function FloxChainOfCustodyDemo({ accentColor, bgDark }: Props) {
  const [tamperAt, setTamperAt] = useState<number>(-1);
  const [runKey, setRunKey] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);
  const [failedAt, setFailedAt] = useState<number | null>(null);
  const FAIL_COLOR = "#E5484D";

  function runPipeline() {
    setRunKey((k) => k + 1);
    setActiveStage(-1);
    setFailedAt(null);
    let stopped = false;
    STAGES.forEach((_, i) => {
      window.setTimeout(() => {
        if (stopped) return;
        const catchesTamper = tamperAt >= 0 && i === tamperAt + 1;
        setActiveStage(i);
        if (catchesTamper) {
          setFailedAt(i);
          stopped = true;
        }
      }, i * 560);
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
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-3">Build provenance pipeline</p>

          <p className="text-white/35 text-[10.5px] uppercase tracking-wider mb-2">Inject tampering at</p>
          <div
            className="flex flex-wrap gap-1 p-0.5 rounded-full mb-5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {TAMPER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setTamperAt(opt.id);
                  setActiveStage(-1);
                  setFailedAt(null);
                }}
                className="relative text-[10.5px] font-semibold px-2.5 py-1.5 rounded-full transition-colors"
                style={{ color: tamperAt === opt.id ? bgDark : "rgba(255,255,255,0.55)" }}
              >
                {tamperAt === opt.id && (
                  <motion.div
                    layoutId="flox-tamper-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: opt.id === -1 ? accentColor : FAIL_COLOR }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{opt.label}</span>
              </button>
            ))}
          </div>

          <div className="relative flex items-center justify-between mb-5 px-1">
            <div className="absolute left-3 right-3 top-3.5 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            {STAGES.map((stage, i) => {
              const neverReached = failedAt !== null && i > failedAt;
              const isFail = failedAt === i;
              const reached = activeStage >= i && !neverReached;
              return (
                <div key={`${runKey}-${stage.id}`} className="relative z-10 flex flex-col items-center gap-1.5 flex-1">
                  <motion.div
                    animate={{
                      scale: activeStage === i ? 1.18 : 1,
                      background: isFail ? FAIL_COLOR : reached ? accentColor : "rgba(255,255,255,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="w-7 h-7 rounded-full flex items-center justify-center border"
                    style={{ borderColor: isFail ? FAIL_COLOR : reached ? accentColor : "rgba(255,255,255,0.15)" }}
                  >
                    {isFail ? (
                      <XIcon color={bgDark} />
                    ) : reached ? (
                      <CheckIcon color={bgDark} />
                    ) : (
                      <span className="text-[9px] font-bold text-white/35">{i + 1}</span>
                    )}
                  </motion.div>
                  <span
                    className="text-[8px] text-center leading-tight max-w-[58px]"
                    style={{ color: isFail ? FAIL_COLOR : reached ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)" }}
                  >
                    {stage.label}
                  </span>
                  {reached && !isFail && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[7px] font-mono text-center leading-tight max-w-[62px]"
                      style={{ color: `${accentColor}cc` }}
                    >
                      {stage.tag}
                    </motion.span>
                  )}
                  {isFail && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[7px] font-mono text-center leading-tight max-w-[62px]"
                      style={{ color: FAIL_COLOR }}
                    >
                      signature mismatch
                    </motion.span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={runPipeline}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Run pipeline
            </button>
          </div>

          <div className="min-h-[64px]">
            <AnimatePresence mode="wait">
              {!hasRun && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/30 text-[11px] text-center pt-2"
                >
                  Pick a stage to tamper with, or run a clean pass, then watch where verification lands.
                </motion.p>
              )}
              {hasRun && failedAt !== null && (
                <motion.div
                  key={`fail-${runKey}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: "rgba(229,72,77,0.1)", border: "1px solid rgba(229,72,77,0.4)" }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    Caught at {STAGES[failedAt].label}, never reached {STAGES[STAGES.length - 1].label}
                  </p>
                  <p className="text-white/50 text-[10.5px] leading-relaxed">
                    The artifact was altered after {STAGES[tamperAt].label}. Signature verification at the next
                    stage recomputed the hash, found it didn&apos;t match what was signed, and halted before the
                    tampered build could reach a customer.
                  </p>
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
                  <p className="text-white text-xs font-semibold mb-1">Chain of custody intact, start to finish</p>
                  <p className="text-white/50 text-[10.5px] leading-relaxed">
                    Every stage&apos;s signature checked out against the one before it. The customer pulled exactly
                    the environment Flox built and signed, nothing in between.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
