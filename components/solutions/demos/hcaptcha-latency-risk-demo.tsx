"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "graceful" | "failopen";

const THRESHOLD = 55;
const FAILOPEN_CLIFF = 82;

function metricsFor(mode: Mode, rps: number) {
  if (mode === "graceful") {
    const riskDepth = rps <= THRESHOLD ? 100 : Math.max(38, 100 - (rps - THRESHOLD) * 2.1);
    const p50 = 16 + rps * 0.34;
    const p99 = 38 + rps * 0.82;
    const botPass = riskDepth >= 92 ? 0.6 : (100 - riskDepth) * 0.11;
    return { riskDepth, p50, p99, botPass, failedOpen: false };
  }
  const failedOpen = rps >= FAILOPEN_CLIFF;
  const riskDepth = failedOpen ? 3 : 100;
  const p50 = failedOpen ? 21 : 16 + rps * 0.52;
  const p99 = failedOpen ? 44 : 38 + rps * 1.28;
  const botPass = failedOpen ? 41 + (rps - FAILOPEN_CLIFF) * 0.4 : 0.6;
  return { riskDepth, p50, p99, botPass, failedOpen };
}

export default function HcaptchaLatencyRiskDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("graceful");
  const [rps, setRps] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function rampTraffic() {
    if (running) return;
    setRps(0);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRps((r) => {
        if (r >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          return 100;
        }
        return r + 2;
      });
    }, 70);
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const { riskDepth, p50, p99, botPass, failedOpen } = metricsFor(mode, rps);
  const botSeverity = botPass > 25 ? "critical" : botPass > 5 ? "elevated" : "nominal";
  const severityColor = botSeverity === "critical" ? "#F0493C" : botSeverity === "elevated" ? "#E8A23D" : accentColor;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Latency vs risk dial</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["graceful", "failopen"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="hcaptcha-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "graceful" ? "Degrade gracefully" : "Fail open"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-0.5">Incoming traffic</p>
              <p className="text-white text-xl font-semibold tabular-nums">
                {Math.round(rps * 8.4).toLocaleString()} <span className="text-white/35 text-xs font-normal">req/s</span>
              </p>
            </div>
            <button
              onClick={rampTraffic}
              disabled={running}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ background: accentColor, color: bgDark }}
            >
              {running ? "Ramping..." : "Simulate traffic spike"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div
              className="rounded-xl p-3.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-2">Latency</p>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-white/45 text-[9px]">p50</span>
                <span className="text-white text-sm font-semibold tabular-nums">{p50.toFixed(0)}ms</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden mb-2.5" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: accentColor }}
                  animate={{ width: `${Math.min(100, (p50 / 70) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-white/45 text-[9px]">p99</span>
                <span className="text-white text-sm font-semibold tabular-nums">{p99.toFixed(0)}ms</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: accentColor }}
                  animate={{ width: `${Math.min(100, (p99 / 170) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div
              className="rounded-xl p-3.5"
              style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${severityColor}33` }}
            >
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-2">Bot pass-through</p>
              <p className="text-2xl font-bold tabular-nums mb-2" style={{ color: severityColor }}>
                {botPass.toFixed(1)}%
              </p>
              <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: severityColor }}
                  animate={{ width: `${Math.min(100, botPass * 2)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1">Risk-analysis depth</p>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: riskDepth < 50 ? severityColor : accentColor }}
                  animate={{ width: `${riskDepth}%` }}
                  transition={{ duration: failedOpen ? 0.15 : 0.3 }}
                />
              </div>
            </div>
          </div>

          <div className="min-h-[56px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${mode}-${botSeverity}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg px-3.5 py-3"
                style={{ background: `${severityColor}14`, border: `1px solid ${severityColor}55` }}
              >
                <p className="text-white text-xs font-semibold mb-1">
                  {failedOpen
                    ? "Failed open: risk analysis bypassed to protect latency"
                    : mode === "graceful"
                      ? botSeverity === "nominal"
                        ? "Full risk-analysis depth, latency inside SLA"
                        : "Shedding risk-analysis depth to hold latency inside SLA"
                      : "Holding full risk analysis as load climbs"}
                </p>
                <p className="text-white/45 text-[10.5px] leading-relaxed">
                  {failedOpen
                    ? `At ${Math.round(rps * 8.4).toLocaleString()} req/s the queue breached its latency budget, so the stage that scores challenge difficulty against known bot signatures was skipped entirely. That is not a performance regression, it is a security one.`
                    : mode === "graceful"
                      ? "Past the SLA threshold the risk-scoring stage is progressively thinned, not removed, latency stays bounded and bot pass-through rises a few points instead of spiking."
                      : "This path refuses to thin risk analysis under load. Watch p99 climb unbounded until it crosses the fail-open cliff."}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
