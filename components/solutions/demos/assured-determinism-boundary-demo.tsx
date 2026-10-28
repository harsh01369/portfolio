"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type StepKind = "agent" | "deterministic";

interface Step {
  id: string;
  label: string;
  kind: StepKind;
  outputs: string[];
}

const STEPS: Step[] = [
  {
    id: "nba",
    label: "Next Best Action",
    kind: "agent",
    outputs: [
      "Recommend: request repair shop estimate before approving rental.",
      "Recommend: approve rental now, request estimate in parallel.",
      "Recommend: flag for adjuster review, damage description is ambiguous.",
    ],
  },
  {
    id: "notes",
    label: "Adjuster notes, auto-drafted",
    kind: "agent",
    outputs: [
      "Claimant reports rear-end collision, moderate bumper damage, no injuries noted.",
      "Rear-end collision reported, bumper damage, claimant declined medical attention.",
      "Collision at low speed, bumper and tail light damage, claimant uninjured per intake.",
    ],
  },
  {
    id: "payout",
    label: "Payout calculation vs policy limits",
    kind: "deterministic",
    outputs: ["$1,840.00 (collision deductible $500, policy limit $5,000, repair estimate $2,340.00)"],
  },
];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export default function AssuredDeterminismBoundaryDemo({ accentColor, bgDark }: Props) {
  const [runs, setRuns] = useState<number[]>([]);

  function runClaim() {
    setRuns((prev) => [...prev, prev.length]);
  }

  const lastTwo = runs.slice(-2);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl font-mono"
        style={{ background: bgDark, border: `1px solid ${accentColor}33` }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${accentColor}2E` }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
          <span className="text-[10.5px] text-white/40 ml-2">claim #88213 :: pipeline replay</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Agents where they accelerate the work, determinism where it protects the outcome. Run the same claim
            twice: agent steps can phrase things differently each time, the payout calc can't.
          </p>

          <div className="space-y-1.5 mb-4">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="rounded-lg px-3 py-2.5"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: `1px solid ${step.kind === "deterministic" ? `${accentColor}44` : "rgba(255,255,255,0.07)"}`,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10.5px] text-white/75">{step.label}</span>
                  <span
                    className="text-[8.5px] uppercase tracking-wide px-1.5 py-0.5 rounded"
                    style={{
                      color: step.kind === "deterministic" ? accentColor : "#f59e0b",
                      background: step.kind === "deterministic" ? `${accentColor}1a` : "#f59e0b1a",
                    }}
                  >
                    {step.kind === "deterministic" ? "deterministic" : "agent"}
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  {runs.length === 0 ? (
                    <p className="text-[9.5px] text-white/25">Run the claim to see this step's output.</p>
                  ) : (
                    <div className="space-y-1">
                      {lastTwo.map((runSeed, i) => {
                        const output = step.kind === "deterministic" ? step.outputs[0] : pick(step.outputs, runSeed);
                        return (
                          <motion.p
                            key={`${step.id}-${runSeed}`}
                            initial={{ opacity: 0, y: -2 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[9.5px] leading-relaxed"
                            style={{ color: "rgba(255,255,255,0.55)" }}
                          >
                            <span className="text-white/30">run {lastTwo.length > 1 ? i + 1 : runs.length}:</span> {output}
                          </motion.p>
                        );
                      })}
                      {lastTwo.length === 2 && step.kind === "agent" && (
                        <p className="text-[9px]" style={{ color: "#f59e0b" }}>
                          {STEPS.find((s) => s.id === step.id)!.outputs[lastTwo[0] % 3] !== STEPS.find((s) => s.id === step.id)!.outputs[lastTwo[1] % 3]
                            ? "different phrasing, same claim, same inputs"
                            : "happened to match this time, not guaranteed"}
                        </p>
                      )}
                      {lastTwo.length === 2 && step.kind === "deterministic" && (
                        <p className="text-[9px]" style={{ color: accentColor }}>
                          byte-identical both runs
                        </p>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <button
            onClick={runClaim}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity"
            style={{ background: accentColor, color: bgDark }}
          >
            {runs.length === 0 ? "Run claim through pipeline" : "Run claim again"}
          </button>
        </div>
      </div>
    </div>
  );
}
