"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Preset = "bot" | "human";

interface Signal {
  id: string;
  label: string;
  detail: string;
  delta: number;
}

const PRESETS: Record<Preset, { title: string; signals: Signal[] }> = {
  bot: {
    title: "Automated bot session",
    signals: [
      { id: "tls", label: "TLS handshake shape", detail: "JA3 fingerprint matches a known headless Chrome build", delta: 22 },
      { id: "cadence", label: "Request cadence", delta: 28, detail: "41 requests/sec with zero timing jitter" },
      { id: "mouse", label: "Mouse path entropy", detail: "No pointer movement recorded before submit", delta: 18 },
      { id: "header", label: "Header order", detail: "Accept-Language header missing, low signal alone", delta: 4 },
      { id: "ip", label: "IP reputation", detail: "Residential proxy pool, flagged on 3 prior sessions", delta: 15 },
    ],
  },
  human: {
    title: "Human session",
    signals: [
      { id: "tls", label: "TLS handshake shape", detail: "JA3 fingerprint matches Chrome 124 desktop, unremarkable", delta: 2 },
      { id: "cadence", label: "Request cadence", detail: "6 requests over 40 seconds, natural variance", delta: -8 },
      { id: "mouse", label: "Mouse path entropy", detail: "Organic curvature, 340 points, hesitation near submit", delta: -15 },
      { id: "header", label: "Header order", detail: "Standard browser header order", delta: -4 },
      { id: "ip", label: "IP reputation", detail: "Residential ISP, no prior history either way", delta: 3 },
    ],
  },
};

const BASELINE = 50;
const THRESHOLD = 72;

export default function DataDomeSignalDemo({ accentColor, bgDark }: Props) {
  const [preset, setPreset] = useState<Preset>("bot");
  const [step, setStep] = useState(0);

  const signals = PRESETS[preset].signals;

  useEffect(() => {
    setStep(0);
    const timer = setInterval(() => {
      setStep((s) => (s < signals.length ? s + 1 : s));
    }, 650);
    return () => clearInterval(timer);
  }, [preset, signals.length]);

  const visible = signals.slice(0, step);
  const runningScore = Math.max(0, Math.min(100, BASELINE + visible.reduce((sum, s) => sum + s.delta, 0)));
  const done = step >= signals.length;
  const blocked = done && runningScore >= THRESHOLD;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Signal score reconstruction</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["bot", "human"] as Preset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPreset(p)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: preset === p ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {preset === p && (
                    <motion.div
                      layoutId="datadome-preset-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{p === "bot" ? "Bot request" : "Human request"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end justify-between mb-2">
            <p className="text-white/35 text-[10px] uppercase tracking-wider">Composite score</p>
            <span
              className="text-2xl font-mono tabular-nums font-semibold"
              style={{ color: blocked ? accentColor : "rgba(255,255,255,0.85)" }}
            >
              {runningScore}
            </span>
          </div>

          <div className="relative h-2.5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              animate={{ width: `${runningScore}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ background: accentColor }}
            />
            <div
              className="absolute inset-y-0 w-px"
              style={{ left: `${THRESHOLD}%`, background: "rgba(255,255,255,0.35)" }}
            />
          </div>
          <div className="flex justify-end mb-5">
            <span className="text-white/30 text-[9px] uppercase tracking-wider">Block threshold {THRESHOLD}</span>
          </div>

          <div className="space-y-2 min-h-[210px]">
            <AnimatePresence>
              {visible.map((s, i) => {
                const inconclusive = Math.abs(s.delta) <= 5;
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                    className="flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5"
                    style={{
                      background: inconclusive ? "rgba(255,255,255,0.03)" : `${accentColor}14`,
                      border: `1px solid ${inconclusive ? "rgba(255,255,255,0.07)" : `${accentColor}45`}`,
                    }}
                  >
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold">{s.label}</p>
                      <p className="text-white/35 text-[10px] mt-0.5 leading-snug">{s.detail}</p>
                    </div>
                    <span
                      className="text-xs font-mono tabular-nums font-semibold shrink-0"
                      style={{ color: inconclusive ? "rgba(255,255,255,0.4)" : accentColor }}
                    >
                      {s.delta > 0 ? "+" : ""}{s.delta}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {done && (
              <motion.div
                key={blocked ? "blocked" : "allowed"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg px-3.5 py-3"
                style={{
                  background: blocked ? `${accentColor}18` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${blocked ? accentColor : "rgba(255,255,255,0.1)"}`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: blocked ? accentColor : "rgba(255,255,255,0.4)" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: blocked ? accentColor : "rgba(255,255,255,0.55)" }}
                  >
                    {blocked ? "Blocked" : "Allowed"}
                  </p>
                </div>
                <p className="text-white/50 text-[11px] leading-relaxed">
                  {blocked
                    ? "Five signals compounded past the block threshold before a single request reached the origin."
                    : "No single signal was conclusive on its own, and the composite stayed well under the block threshold."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
