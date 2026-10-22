"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface StateRule {
  id: string;
  state: string;
  consentType: "one-party" | "two-party";
  script: string;
}

const STATES: StateRule[] = [
  {
    id: "ca",
    state: "California",
    consentType: "two-party",
    script: "Hi, before we start, I want to let you know I'll be recording our conversation for training and quality purposes. Is that okay with you?",
  },
  {
    id: "tx",
    state: "Texas",
    consentType: "one-party",
    script: "Internal note: Texas is one-party consent. Your own participation in the conversation is sufficient, no verbal disclosure is legally required, though the rep may still choose to mention it.",
  },
  {
    id: "fl",
    state: "Florida",
    consentType: "two-party",
    script: "Hi, quick heads up, I record these visits so our team can review quality later. Just need you to say it's fine before we get going.",
  },
  {
    id: "il",
    state: "Illinois",
    consentType: "two-party",
    script: "Before we continue, I need to tell you this conversation is being recorded for training purposes, and I need your verbal okay to proceed under Illinois law.",
  },
  {
    id: "ny",
    state: "New York",
    consentType: "one-party",
    script: "Internal note: New York is one-party consent. Disclosure is not legally required, this visit may be recorded without a verbal script.",
  },
];

export default function SiroConsentDemo({ accentColor, bgDark }: Props) {
  const [stateId, setStateId] = useState(STATES[0].id);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const active = STATES.find((s) => s.id === stateId)!;
  const needsDisclosure = active.consentType === "two-party";
  const canRecord = !needsDisclosure || confirmed;

  useEffect(() => {
    setConfirmed(false);
    setConfirming(false);
  }, [stateId]);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => {
      setConfirmed(true);
      setConfirming(false);
    }, 850);
    return () => clearTimeout(t);
  }, [confirming]);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Consent-aware recording</p>
            <div className="flex items-center gap-1.5">
              <motion.span
                key={canRecord ? "on" : "off"}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: canRecord ? "#f87171" : "rgba(255,255,255,0.25)" }}
                animate={canRecord ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-[10px] font-semibold" style={{ color: canRecord ? "#f87171" : "rgba(255,255,255,0.35)" }}>
                {canRecord ? "Recording" : "Blocked"}
              </span>
            </div>
          </div>

          <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-2">Simulated device location</p>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {STATES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStateId(s.id)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full transition-colors"
                style={{
                  background: stateId === s.id ? accentColor : "rgba(255,255,255,0.05)",
                  color: stateId === s.id ? bgDark : "rgba(255,255,255,0.5)",
                  border: `1px solid ${stateId === s.id ? accentColor : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {s.state}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={stateId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="rounded-xl p-4 mb-4"
                style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${accentColor}33` }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-white text-xs font-semibold">{active.state}</p>
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                    style={{
                      background: needsDisclosure ? "rgba(255,170,60,0.15)" : `${accentColor}1a`,
                      color: needsDisclosure ? "#ffaa3c" : accentColor,
                    }}
                  >
                    {active.consentType === "two-party" ? "Two-party consent" : "One-party consent"}
                  </span>
                </div>
                <p className="text-white/30 text-[9px] uppercase tracking-wider mb-1">
                  {needsDisclosure ? "Required verbal disclosure" : "No disclosure legally required"}
                </p>
                <p className="text-white/65 text-[11px] leading-relaxed italic">&ldquo;{active.script}&rdquo;</p>
              </div>

              {needsDisclosure ? (
                <button
                  onClick={() => !confirmed && setConfirming(true)}
                  disabled={confirming || confirmed}
                  className="w-full text-xs font-semibold py-2.5 rounded-lg transition-opacity disabled:opacity-70"
                  style={{
                    background: confirmed ? accentColor : "rgba(255,255,255,0.08)",
                    color: confirmed ? bgDark : "rgba(255,255,255,0.7)",
                    border: confirmed ? "none" : "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {confirmed ? "Consent confirmed, recording active" : confirming ? "Waiting for verbal confirmation..." : "Confirm disclosure was given and consent received"}
                </button>
              ) : (
                <p className="text-white/35 text-[10px] text-center leading-relaxed py-2">
                  Recording activates automatically, this state does not require a verbal consent step.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            The recording indicator never activates ahead of what the law in that state actually requires. Sample
            states and scripts, built for this demo only, not legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
