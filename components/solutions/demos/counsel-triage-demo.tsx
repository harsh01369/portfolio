"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Scenario = "benign" | "urgent";
type StageKey = "received" | "intake" | "decision" | "physician" | "resolved";

interface ScriptEvent {
  atMs: number;
  stage: StageKey;
  label: string;
}

interface ScenarioData {
  title: string;
  message: string;
  intakeSummary: string;
  events: ScriptEvent[];
  resolvedByAi: boolean;
}

const SCENARIOS: Record<Scenario, ScenarioData> = {
  benign: {
    title: "Routine refill",
    message: "Can I get a refill on my blood pressure medication, I'm out as of Friday.",
    intakeSummary: "Routine refill request. No acute symptoms. Stable chronic medication, last filled 28 days ago.",
    resolvedByAi: true,
    events: [
      { atMs: 0, stage: "received", label: "Patient message received in Studio embed" },
      { atMs: 500, stage: "intake", label: "AI intake and summarization running" },
      { atMs: 1600, stage: "decision", label: "AI-resolved, refill approved against existing prescription" },
    ],
  },
  urgent: {
    title: "Acute symptom",
    message: "I've had chest tightness and shortness of breath for the last 20 minutes.",
    intakeSummary: "Acute cardiopulmonary symptoms reported, 20-minute duration. Flagged high-risk pattern.",
    resolvedByAi: false,
    events: [
      { atMs: 0, stage: "received", label: "Patient message received in Studio embed" },
      { atMs: 500, stage: "intake", label: "AI intake and summarization running" },
      { atMs: 1500, stage: "decision", label: "Escalated, high-risk pattern outside AI resolution scope" },
      { atMs: 1500, stage: "physician", label: "Licensed physician reviewing live" },
      { atMs: 4800, stage: "resolved", label: "Physician response: directed to seek emergency care now" },
    ],
  },
};

const STAGE_ORDER: StageKey[] = ["received", "intake", "decision", "physician", "resolved"];

export default function CounselTriageDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<Scenario>("benign");
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(Date.now());

  const data = SCENARIOS[scenario];
  const finalEvent = data.events[data.events.length - 1];
  const finished = elapsed >= finalEvent.atMs;

  useEffect(() => {
    startRef.current = Date.now();
    setElapsed(0);
    const timer = setInterval(() => {
      const next = Date.now() - startRef.current;
      setElapsed(next >= finalEvent.atMs ? finalEvent.atMs : next);
    }, 80);
    return () => clearInterval(timer);
  }, [scenario, finalEvent.atMs]);

  const replay = () => {
    startRef.current = Date.now();
    setElapsed(0);
  };

  const activeEvents = data.events.filter((e) => e.atMs <= elapsed);
  const activeStages = new Set(activeEvents.map((e) => e.stage));
  const currentStage = activeEvents[activeEvents.length - 1]?.stage ?? "received";

  const fmt = (ms: number) => `${(ms / 1000).toFixed(1)}s`;

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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Triage escalation clock</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["benign", "urgent"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: scenario === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {scenario === s && (
                    <motion.div
                      layoutId="counsel-scenario-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{SCENARIOS[s].title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg px-3.5 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/70 text-[11px] leading-snug pr-3">&ldquo;{data.message}&rdquo;</p>
            <span className="text-sm font-mono tabular-nums font-semibold shrink-0" style={{ color: accentColor }}>
              {fmt(elapsed)}
            </span>
          </div>

          <div className="space-y-2 min-h-[220px]">
            {STAGE_ORDER.filter((s) => data.events.some((e) => e.stage === s)).map((stageKey) => {
              const event = data.events.find((e) => e.stage === stageKey)!;
              const active = activeStages.has(stageKey);
              const isCurrent = currentStage === stageKey && !finished;
              const isEscalation = stageKey === "decision" && !data.resolvedByAi;
              const isPhysician = stageKey === "physician" || (stageKey === "resolved" && !data.resolvedByAi);
              return (
                <motion.div
                  key={stageKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: active ? 1 : 0.25, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5"
                  style={{
                    background: active && (isEscalation || isPhysician) ? `${accentColor}16` : active ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${active && (isEscalation || isPhysician) ? accentColor : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {isCurrent && (
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: accentColor }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                    <p className="text-white text-xs font-semibold">{active ? event.label : "Pending"}</p>
                  </div>
                  <span className="text-[10px] font-mono tabular-nums text-white/40 shrink-0">
                    {active ? fmt(Math.min(elapsed, finalEvent.atMs) - event.atMs) : "--"}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {finished && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg px-3.5 py-3"
                style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>
                    {data.resolvedByAi ? "Resolved by AI" : "Resolved by a licensed physician"}
                  </p>
                  <button onClick={replay} className="text-[10px] font-semibold uppercase tracking-wide text-white/40 hover:text-white/70">
                    Replay
                  </button>
                </div>
                <p className="text-white/55 text-[11px] leading-relaxed">
                  Total time from message to resolution: <span className="font-mono tabular-nums">{fmt(finalEvent.atMs)}</span>.{" "}
                  {data.resolvedByAi
                    ? "The AI intake summary was sufficient to close this out without a physician in the loop."
                    : "Intake correctly recognized this was outside AI resolution scope and handed it to a physician instead of guessing."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
