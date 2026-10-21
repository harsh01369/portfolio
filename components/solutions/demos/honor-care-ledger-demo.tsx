"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface CareFact {
  id: string;
  label: string;
  value: string;
  sourceVisit: string;
  sourceCaregiver: string;
  sensitive: boolean;
}

interface Visit {
  id: string;
  date: string;
  caregiver: string;
  facts: CareFact[];
}

const VISITS: Visit[] = [
  {
    id: "v1",
    date: "Mon Oct 12",
    caregiver: "Maria T.",
    facts: [
      {
        id: "f1",
        label: "Mobility",
        value: "Uses left handrail on stairs, right knee is the weaker side",
        sourceVisit: "Mon Oct 12",
        sourceCaregiver: "Maria T.",
        sensitive: false,
      },
      {
        id: "f2",
        label: "Medication timing",
        value: "Takes evening meds 30 min after dinner, not with it, or nausea follows",
        sourceVisit: "Mon Oct 12",
        sourceCaregiver: "Maria T.",
        sensitive: false,
      },
    ],
  },
  {
    id: "v2",
    date: "Thu Oct 15",
    caregiver: "Dennis O.",
    facts: [
      {
        id: "f3",
        label: "Comfort cue",
        value: "Gets anxious around 4pm, playing Sinatra on the kitchen radio calms her within minutes",
        sourceVisit: "Thu Oct 15",
        sourceCaregiver: "Dennis O.",
        sensitive: true,
      },
    ],
  },
  {
    id: "v3",
    date: "Mon Oct 19",
    caregiver: "Priya K.",
    facts: [
      {
        id: "f4",
        label: "Family note",
        value: "Daughter mentioned a recent fall risk near the bathroom rug, family prefers it isn't removed, just watched",
        sourceVisit: "Mon Oct 19",
        sourceCaregiver: "Priya K.",
        sensitive: true,
      },
    ],
  },
];

const NEXT_CAREGIVER = "Angela R.";
const NEXT_VISIT_DATE = "Fri Oct 23";

export default function HonorCareLedgerDemo({ accentColor, bgDark }: Props) {
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [reviewing, setReviewing] = useState<string | null>(null);

  const sensitiveFacts = VISITS.flatMap((v) => v.facts).filter((f) => f.sensitive);
  const nonSensitiveFacts = VISITS.flatMap((v) => v.facts).filter((f) => !f.sensitive);
  const allApproved = sensitiveFacts.every((f) => approved[f.id]);

  const handoffFacts = [...nonSensitiveFacts, ...sensitiveFacts.filter((f) => approved[f.id])];

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Care continuity ledger</p>
              <p className="text-white text-sm font-semibold mt-1">Eleanor R. — care recipient</p>
            </div>
            <div
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ background: `${accentColor}1a`, color: accentColor, border: `1px solid ${accentColor}44` }}
            >
              3 visits logged
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-stretch gap-2 mb-6">
            {VISITS.map((visit, i) => (
              <div key={visit.id} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="w-full rounded-lg px-2 py-2.5 text-center"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <p className="text-white/80 text-[10px] font-semibold">{visit.date}</p>
                  <p className="text-white/40 text-[9px] mt-0.5">{visit.caregiver}</p>
                  <p className="text-[9px] font-mono tabular-nums mt-1" style={{ color: accentColor }}>
                    {visit.facts.length} fact{visit.facts.length > 1 ? "s" : ""}
                  </p>
                </motion.div>
                {i < VISITS.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    className="h-px w-full mt-1 origin-left"
                    style={{ background: "rgba(255,255,255,0.15)" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Approval gate for sensitive facts */}
          <div className="mb-5">
            <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-2.5">
              Human-in-the-loop approval before propagation
            </p>
            <div className="space-y-2">
              {sensitiveFacts.map((fact) => (
                <div
                  key={fact.id}
                  className="rounded-lg px-3 py-2.5"
                  style={{
                    background: approved[fact.id] ? `${accentColor}14` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${approved[fact.id] ? accentColor + "55" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(255,170,60,0.15)", color: "#ffaa3c" }}
                        >
                          Sensitive
                        </span>
                        <span className="text-white/35 text-[9px]">{fact.label}</span>
                      </div>
                      <p className="text-white/75 text-xs leading-relaxed">{fact.value}</p>
                      <button
                        onClick={() => setReviewing(reviewing === fact.id ? null : fact.id)}
                        className="text-[9px] mt-1.5 underline"
                        style={{ color: accentColor }}
                      >
                        {reviewing === fact.id ? "hide source" : "trace source"}
                      </button>
                      <AnimatePresence>
                        {reviewing === fact.id && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-white/35 text-[10px] mt-1.5 font-mono"
                          >
                            captured {fact.sourceVisit} by {fact.sourceCaregiver}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <button
                      onClick={() => setApproved((prev) => ({ ...prev, [fact.id]: !prev[fact.id] }))}
                      className="shrink-0 text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                      style={{
                        background: approved[fact.id] ? accentColor : "rgba(255,255,255,0.08)",
                        color: approved[fact.id] ? bgDark : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {approved[fact.id] ? "Approved" : "Approve"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next caregiver handoff screen */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${accentColor}33` }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-white text-xs font-semibold">
                {NEXT_CAREGIVER}&apos;s handoff screen — {NEXT_VISIT_DATE}
              </p>
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: allApproved ? accentColor : "rgba(255,255,255,0.3)" }}
                animate={allApproved ? { opacity: [1, 0.3, 1] } : {}}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            </div>
            <div className="space-y-1.5">
              <AnimatePresence>
                {handoffFacts.map((fact) => (
                  <motion.div
                    key={fact.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="flex items-start gap-2 text-[11px]"
                  >
                    <span style={{ color: accentColor }}>•</span>
                    <span className="text-white/65 leading-relaxed">{fact.value}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {handoffFacts.length === 0 && (
                <p className="text-white/30 text-[11px] italic">No context surfaced yet.</p>
              )}
            </div>
          </div>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            Context captured once, surfaced to the next caregiver before they arrive, with a visible audit trail and
            a gate before sensitive facts propagate. Sample recipient and visits, built for this demo only.
          </p>
        </div>
      </div>
    </div>
  );
}
