"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Target = "bot" | "webhook";
type Phase = "idle" | "sent" | "failed" | "resolved";

export default function MedplumSubscriptionRetryDemo({ accentColor, bgDark }: Props) {
  const [target, setTarget] = useState<Target>("bot");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("sent");
    window.setTimeout(() => setPhase("failed"), 700);
    window.setTimeout(() => setPhase("resolved"), 1600);
  }

  const sent = phase !== "idle";
  const failed = phase === "failed" || phase === "resolved";
  const resolved = phase === "resolved";
  const silentlyDropped = target === "bot" && resolved;

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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Subscription delivery trace</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["bot", "webhook"] as Target[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTarget(t)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: target === t ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {target === t && (
                    <motion.div
                      layoutId="medplum-target-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t === "bot" ? "App-level Bot handler" : "External HTTP endpoint"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Subscription event</p>
            <p className="text-white text-xs font-semibold mb-1">Observation created, patient_ref: Patient/8841</p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">subscription-max-attempts: 3</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: sent ? accentColor : "rgba(255,255,255,0.1)",
                background: sent ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Delivery attempt</p>
              <p className="text-white/70 text-[10.5px]">{sent ? "Handler invoked" : "Not sent yet"}</p>
            </motion.div>
            <motion.div
              animate={{
                borderColor: failed ? "#F87171" : "rgba(255,255,255,0.1)",
                background: failed ? "#F8717112" : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Handler result</p>
              <p className="text-white/70 text-[10.5px]">{failed ? "Threw: downstream timeout" : "Pending"}</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Make the handler fail on delivery
            </button>
          </div>

          <div className="min-h-[110px]">
            <AnimatePresence mode="wait">
              {failed && !resolved && (
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
                    {target === "bot" ? "Checking retry policy for the Bot handler..." : "Queuing retry per subscription-max-attempts..."}
                  </span>
                </motion.div>
              )}
              {resolved && (
                <motion.div
                  key={`done-${runKey}-${target}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{
                    background: silentlyDropped ? "#F8717122" : `${accentColor}14`,
                    border: `1px solid ${silentlyDropped ? "#F87171" : accentColor}55`,
                  }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {silentlyDropped ? "Event dropped, no retry, no alert" : "Retried automatically, delivered on attempt 2"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {silentlyDropped
                      ? "App-level Bot handler failures aren't automatically retried by subscription-max-attempts. The failure is logged, but nothing re-runs this handler, so whatever it was supposed to do (update a record, notify a system) simply never happens unless something else is watching for it."
                      : "External HTTP endpoints get a configurable retry policy, so subscription-max-attempts actually covers this path. The second attempt succeeded and the event delivered."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Reliability here isn&apos;t one setting, it depends on the endpoint type. Fail a delivery and see
                  which one actually gets retried.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
