"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type AlertId = "riverton" | "lakeside";

interface AlertRecord {
  title: string;
  entity: string;
  daysRemaining: number;
  source: string;
  method: string;
  verified: string;
  confidence: number;
}

const ALERTS: Record<AlertId, AlertRecord> = {
  riverton: {
    title: "IT services contract expiring",
    entity: "City of Riverton, public works dept.",
    daysRemaining: 47,
    source: "Riverton County procurement portal, solicitation RC-2024-118",
    method: "FOIA automation, nightly scrape of posted contract awards",
    verified: "verified 6 hours ago",
    confidence: 94,
  },
  lakeside: {
    title: "Bus fleet contract expiring",
    entity: "Lakeside School District, transportation office",
    daysRemaining: 112,
    source: "State education procurement register, award LSD-TR-44",
    method: "Public register scrape, cross-checked against board meeting minutes",
    verified: "verified 2 days ago",
    confidence: 81,
  },
};

const STEPS = ["Source identified", "Verified against registry", "Confidence scored"];

export default function StarbridgeProvenanceTraceDemo({ accentColor, bgDark }: Props) {
  const [alertId, setAlertId] = useState<AlertId>("riverton");
  const [traced, setTraced] = useState(false);
  const [stage, setStage] = useState(-1);
  const [runKey, setRunKey] = useState(0);
  const alert = ALERTS[alertId];

  function trace() {
    setTraced(true);
    setRunKey((k) => k + 1);
    setStage(0);
    STEPS.forEach((_, i) => window.setTimeout(() => setStage(i), i * 400));
  }

  function switchAlert(id: AlertId) {
    setAlertId(id);
    setTraced(false);
    setStage(-1);
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Signal provenance trace</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["riverton", "lakeside"] as AlertId[]).map((id) => (
                <button
                  key={id}
                  onClick={() => switchAlert(id)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: alertId === id ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {alertId === id && (
                    <motion.div
                      layoutId="sb-alert-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{id === "riverton" ? "Riverton" : "Lakeside"}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={alertId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl p-4 mb-4"
              style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}40` }}
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">{alert.entity}</p>
              <p className="text-white text-sm font-semibold mb-1">{alert.title}</p>
              <p className="font-mono tabular-nums text-xs" style={{ color: accentColor }}>
                Expires in {alert.daysRemaining} days
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mb-5">
            <button
              onClick={trace}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Trace this signal
            </button>
          </div>

          <div className="min-h-[150px]">
            <AnimatePresence mode="wait">
              {traced ? (
                <motion.div key={`trace-${runKey}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
                  {STEPS.map((step, i) => {
                    const reached = stage >= i;
                    return (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: reached ? 1 : 0.25, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-lg px-3 py-2.5 flex items-start gap-2.5"
                        style={{
                          background: reached ? "rgba(255,255,255,0.04)" : "transparent",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5"
                          style={{
                            background: reached ? accentColor : "rgba(255,255,255,0.1)",
                            color: reached ? bgDark : "rgba(255,255,255,0.4)",
                          }}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-white text-[11px] font-semibold">{step}</p>
                          <p className="text-white/45 text-[10px] leading-relaxed mt-0.5">
                            {i === 0 ? alert.source : null}
                            {i === 1 ? `${alert.method}, ${alert.verified}` : null}
                          </p>
                          {i === 2 && reached && (
                            <div className="mt-1.5">
                              <div className="h-1.5 rounded-full w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ background: accentColor }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${alert.confidence}%` }}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                              </div>
                              <p className="text-white/50 text-[10px] font-mono tabular-nums mt-1">
                                {alert.confidence}% confidence
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Every signal traces back to a public filing, not a guess. Click trace to see where this one came
                  from.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
