"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface FlowNode {
  id: string;
  label: string;
  versioned: boolean;
  version?: string;
  lastAudited?: string;
  usedInWorkflows?: number;
  note: string;
}

interface Prompt {
  id: string;
  text: string;
  nodes: FlowNode[];
}

const PROMPTS: Prompt[] = [
  {
    id: "renewal",
    text: "Renewals over $2M need manager sign-off before quoting",
    nodes: [
      { id: "r1", label: "Pull current renewal premium", versioned: true, version: "v2.3", lastAudited: "Oct 3, 2026", usedInWorkflows: 148, note: "Standard premium lookup block, shared across every renewal workflow in your account." },
      { id: "r2", label: "If premium > $2,000,000", versioned: false, note: "Generated for this prompt. The threshold and comparison are specific to what you typed, not yet a reusable block." },
      { id: "r3", label: "Route to manager sign-off queue", versioned: true, version: "v3.1", lastAudited: "Sep 21, 2026", usedInWorkflows: 94, note: "Pre-tested routing block. Handles queue assignment and SLA timers the same way across all workflows that use it." },
      { id: "r4", label: "Notify assigned manager", versioned: true, version: "v1.6", lastAudited: "Oct 11, 2026", usedInWorkflows: 211, note: "Shared notification block covering email and in-app alerts." },
      { id: "r5", label: "Resume quoting on approval", versioned: false, note: "Generated for this prompt to re-enter your existing quoting flow at the right step." },
    ],
  },
  {
    id: "telematics",
    text: "New auto policy applicants under 21 get a telematics add-on offer",
    nodes: [
      { id: "t1", label: "Read applicant date of birth", versioned: true, version: "v4.0", lastAudited: "Oct 15, 2026", usedInWorkflows: 302, note: "Core intake block, used on nearly every applicant-facing workflow." },
      { id: "t2", label: "If age < 21", versioned: false, note: "Generated for this prompt. A fresh age comparison built around the exact cutoff you described." },
      { id: "t3", label: "Attach telematics add-on offer", versioned: true, version: "v1.2", lastAudited: "Aug 29, 2026", usedInWorkflows: 37, note: "Pre-tested offer-attachment block, previously used only for the EV discount workflow." },
      { id: "t4", label: "Log consent and continue application", versioned: true, version: "v2.8", lastAudited: "Oct 2, 2026", usedInWorkflows: 268, note: "Shared consent-logging block required on every workflow that adds a data-sharing offer." },
    ],
  },
  {
    id: "fraud",
    text: "Claims flagged for fraud route to senior adjuster same day",
    nodes: [
      { id: "f1", label: "Check fraud flag on claim", versioned: true, version: "v3.4", lastAudited: "Oct 18, 2026", usedInWorkflows: 176, note: "Shared block reading the fraud score already computed upstream." },
      { id: "f2", label: "If flagged = true", versioned: false, note: "Generated for this prompt as a thin branch around the fraud flag." },
      { id: "f3", label: "Assign to senior adjuster pool", versioned: false, note: "Generated for this prompt. Your account has no existing 'senior adjuster pool' block yet, this one is unaudited." },
      { id: "f4", label: "Set same-day SLA timer", versioned: true, version: "v2.1", lastAudited: "Jul 30, 2026", usedInWorkflows: 85, note: "Pre-tested SLA timer block, reused from the escalations workflow." },
    ],
  },
];

export default function FeatheryProvenanceDemo({ accentColor, bgDark }: Props) {
  const [promptId, setPromptId] = useState<string>(PROMPTS[0].id);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const activePrompt = PROMPTS.find((p) => p.id === promptId)!;
  const selected = activePrompt.nodes.find((n) => n.id === selectedNode) ?? null;

  const handleSelectPrompt = (id: string) => {
    setPromptId(id);
    setSelectedNode(null);
  };

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
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-1">Workflow provenance inspector</p>
          <p className="text-white text-sm font-semibold mb-4">Describe the process, Robin builds it. Inspect what it's made of.</p>

          <div className="flex flex-col gap-1.5 mb-5">
            {PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPrompt(p.id)}
                className="relative text-left text-[11px] px-3 py-2 rounded-lg transition-colors"
                style={{
                  background: promptId === p.id ? `${accentColor}14` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${promptId === p.id ? accentColor + "66" : "rgba(255,255,255,0.08)"}`,
                  color: promptId === p.id ? "white" : "rgba(255,255,255,0.45)",
                }}
              >
                &ldquo;{p.text}&rdquo;
              </button>
            ))}
          </div>

          <p className="text-white/35 text-[10px] uppercase tracking-[0.15em] mb-2.5">
            Assembled flow, click any step
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={promptId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-0"
            >
              {activePrompt.nodes.map((node, i) => (
                <div key={node.id}>
                  <motion.button
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.09, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left"
                    style={{
                      background: selectedNode === node.id ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${
                        selectedNode === node.id ? "rgba(255,255,255,0.22)" : node.versioned ? `${accentColor}33` : "rgba(255,170,60,0.3)"
                      }`,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: node.versioned ? accentColor : "#ffaa3c" }}
                      />
                      <span className="text-white/80 text-[11px]">{node.label}</span>
                    </span>
                    <span
                      className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        background: node.versioned ? `${accentColor}1a` : "rgba(255,170,60,0.15)",
                        color: node.versioned ? accentColor : "#ffaa3c",
                      }}
                    >
                      {node.versioned ? node.version : "generated"}
                    </span>
                  </motion.button>
                  {i < activePrompt.nodes.length - 1 && (
                    <div className="flex justify-start pl-5">
                      <div className="w-px h-3" style={{ background: "rgba(255,255,255,0.12)" }} />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div
                  className="rounded-xl p-4"
                  style={{
                    background: selected.versioned ? `${accentColor}10` : "rgba(255,170,60,0.07)",
                    border: `1px solid ${selected.versioned ? accentColor + "44" : "rgba(255,170,60,0.3)"}`,
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{
                        background: selected.versioned ? `${accentColor}1a` : "rgba(255,170,60,0.18)",
                        color: selected.versioned ? accentColor : "#ffaa3c",
                      }}
                    >
                      {selected.versioned ? "Versioned block" : "Freshly generated"}
                    </span>
                    {selected.versioned && (
                      <span className="text-white/40 text-[10px] tabular-nums">
                        {selected.version} · audited {selected.lastAudited} · used in{" "}
                        {selected.usedInWorkflows} workflows
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-[11px] leading-relaxed">{selected.note}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            Robin never hides what it built. Every step traces to either a pre-tested block with an audit trail, or
            a freshly generated step flagged for review before it runs on real policies. Sample prompts and blocks,
            built for this demo only.
          </p>
        </div>
      </div>
    </div>
  );
}
