"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Scenario = "routine" | "spike";

interface Hop {
  id: string;
  label: string;
  sublabel: string;
  latencyMs: number;
}

const ROUTINE_READING = { glucose: 94, ketones: 1.1, label: "Glucose 94 mg/dL · Ketones 1.1 mmol/L" };
const SPIKE_READING = { glucose: 241, ketones: 0.2, label: "Glucose 241 mg/dL · Ketones 0.2 mmol/L" };

const ROUTINE_HOPS: Hop[] = [
  { id: "device", label: "Member device", sublabel: "Reading captured", latencyMs: 0 },
  { id: "ingest", label: "Ingestion pipeline", sublabel: "Normalized + stored", latencyMs: 1800 },
  { id: "coach", label: "Coach dashboard", sublabel: "Within range, logged only", latencyMs: 3400 },
];

const SPIKE_HOPS: Hop[] = [
  { id: "device", label: "Member device", sublabel: "Reading captured", latencyMs: 0 },
  { id: "ingest", label: "Ingestion pipeline", sublabel: "Normalized + stored", latencyMs: 1800 },
  { id: "coach", label: "Coach dashboard", sublabel: "Threshold breach flagged", latencyMs: 3400 },
  { id: "physician", label: "Physician alert", sublabel: "Escalated for review", latencyMs: 41000 },
  { id: "decision", label: "Medication decision", sublabel: "Insulin dose adjusted", latencyMs: 96000 },
];

function formatLatency(ms: number): string {
  if (ms === 0) return "0:00";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function VirtaSignalChainDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<Scenario>("routine");
  const [visibleCount, setVisibleCount] = useState(0);
  const [displayedMs, setDisplayedMs] = useState(0);

  const hops = scenario === "routine" ? ROUTINE_HOPS : SPIKE_HOPS;
  const reading = scenario === "routine" ? ROUTINE_READING : SPIKE_READING;
  const isDanger = scenario === "spike";
  const finalLatency = hops[hops.length - 1].latencyMs;

  useEffect(() => {
    setVisibleCount(0);
    setDisplayedMs(0);
    let step = 0;
    const revealInterval = setInterval(() => {
      step += 1;
      setVisibleCount(step);
      if (step >= hops.length) clearInterval(revealInterval);
    }, 420);
    return () => clearInterval(revealInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);

  useEffect(() => {
    if (visibleCount === 0) return;
    const target = hops[Math.min(visibleCount - 1, hops.length - 1)].latencyMs;
    const start = performance.now();
    const duration = 500;
    const from = displayedMs;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayedMs(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleCount]);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Signal-to-intervention chain</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["routine", "spike"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: scenario === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {scenario === s && (
                    <motion.div
                      layoutId="virta-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: s === "spike" ? "#EF4444" : accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s === "routine" ? "Routine check-in" : "Inject danger spike"}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg px-4 py-3 mb-5 flex items-center justify-between"
            style={{
              background: isDanger ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${isDanger ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: isDanger ? "#EF4444" : accentColor }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <span className="text-white/80 text-xs font-mono tabular-nums">{reading.label}</span>
            </div>
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: isDanger ? "#EF4444" : accentColor }}
            >
              {isDanger ? "Out of range" : "In range"}
            </span>
          </div>

          <div className="min-h-[216px]">
            <div className="flex flex-col gap-2.5">
              <AnimatePresence mode="popLayout">
                {hops.slice(0, visibleCount).map((hop, i) => {
                  const isLast = i === visibleCount - 1;
                  const isTerminal = isLast && visibleCount === hops.length;
                  const flagged = isDanger && (hop.id === "coach" || hop.id === "physician" || hop.id === "decision");
                  return (
                    <motion.div
                      key={hop.id}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-3 rounded-lg px-3.5 py-2.5"
                      style={{
                        background: flagged ? `${accentColor}14` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${flagged ? accentColor + "55" : "rgba(255,255,255,0.08)"}`,
                      }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{
                          background: flagged ? accentColor : "rgba(255,255,255,0.1)",
                          color: flagged ? bgDark : "rgba(255,255,255,0.5)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{hop.label}</p>
                        <p className="text-white/40 text-[10.5px] truncate">{hop.sublabel}</p>
                      </div>
                      <p
                        className="text-[11px] font-mono tabular-nums font-semibold flex-shrink-0"
                        style={{ color: flagged ? accentColor : "rgba(255,255,255,0.45)" }}
                      >
                        +{formatLatency(hop.latencyMs)}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div
            className="flex items-center justify-between rounded-lg px-4 py-3 mt-1"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Elapsed since reading</p>
            <p className="text-white text-base font-mono tabular-nums font-bold">{formatLatency(displayedMs)}</p>
          </div>

          <div className="flex gap-4 mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <p className="text-white text-lg font-bold tabular-nums">60%</p>
              <p className="text-white/40 text-[10px] leading-tight mt-0.5">
                reverse type 2 diabetes at one year, company-reported trial data
              </p>
            </div>
            <div>
              <p className="text-white text-lg font-bold tabular-nums">94%</p>
              <p className="text-white/40 text-[10px] leading-tight mt-0.5">
                reduce or eliminate insulin use, company-reported trial data
              </p>
            </div>
          </div>
          <p className="text-white/45 text-[11px] leading-relaxed mt-4">
            {isDanger
              ? "A dangerous reading doesn't wait for a scheduled check-in. It moves through ingestion to a coach to a physician in under two minutes, and a medication change can be live inside ninety."
              : "Most readings never need a physician. They're logged, reviewed by a coach, and closed out, so escalation stays rare and fast when it actually happens."}
          </p>
        </div>
      </div>
    </div>
  );
}
