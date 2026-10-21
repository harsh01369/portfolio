"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface LineageNode {
  id: string;
  kind: string;
  title: string;
  detail: string;
  changedRecently: boolean | null;
  isRootCause?: boolean;
}

const CHAIN: LineageNode[] = [
  {
    id: "output",
    kind: "Agent output",
    title: "Refund approved for order #88213",
    detail:
      "Agent told the customer 62 days post-purchase was fine because policy was updated. It should not have approved this.",
    changedRecently: null,
  },
  {
    id: "context",
    kind: "Retrieved context",
    title: "refund_policy.md, section 4.2",
    detail: "Chunk cited: refunds honored within 90 days of purchase.",
    changedRecently: false,
  },
  {
    id: "source",
    kind: "Source data",
    title: "merchant row, refund_policy_config",
    detail: "This merchant's own config row: max_days = 90, untouched for 140 days.",
    changedRecently: false,
  },
  {
    id: "pipeline",
    kind: "Upstream pipeline run",
    title: "nightly_policy_sync, run #4471",
    detail:
      "Global default flipped 60 to 90 for every merchant 6 hours ago, a scoping bug, no anomaly alert fired.",
    changedRecently: true,
    isRootCause: true,
  },
];

export default function MonteCarloRootCauseDemo({ accentColor, bgDark }: Props) {
  const [revealed, setRevealed] = useState(1);
  const atEnd = revealed >= CHAIN.length;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -left-20 w-60 h-60 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(65px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Root cause walk</p>
            <p className="text-white/30 text-[10.5px] tabular-nums">
              {revealed} / {CHAIN.length}
            </p>
          </div>

          <div className="space-y-0">
            <AnimatePresence initial={false}>
              {CHAIN.slice(0, revealed).map((node, i) => {
                const isCurrent = i === revealed - 1;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isCurrent ? 1 : 0.5, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  >
                    {i > 0 && <div className="w-px h-4 ml-3" style={{ background: "rgba(255,255,255,0.15)" }} />}
                    <div
                      className="rounded-lg p-3.5"
                      style={{
                        background: node.isRootCause && isCurrent ? `${accentColor}16` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${
                          node.isRootCause && isCurrent ? accentColor : "rgba(255,255,255,0.08)"
                        }`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p
                          className="text-[10px] uppercase tracking-wider"
                          style={{ color: isCurrent ? accentColor : "rgba(255,255,255,0.35)" }}
                        >
                          {node.kind}
                        </p>
                        {node.changedRecently !== null && (
                          <span
                            className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded tabular-nums"
                            style={{
                              background: node.changedRecently ? `${accentColor}22` : "rgba(255,255,255,0.06)",
                              color: node.changedRecently ? accentColor : "rgba(255,255,255,0.4)",
                            }}
                          >
                            changed recently: {node.changedRecently ? "yes" : "no"}
                          </span>
                        )}
                      </div>
                      <p className="text-white/85 text-[13px] font-semibold mb-1">{node.title}</p>
                      <p className="text-white/45 text-[11.5px] leading-relaxed">{node.detail}</p>
                      {node.isRootCause && isCurrent && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.25 }}
                          className="text-[10.5px] font-bold uppercase tracking-wider mt-2"
                          style={{ color: accentColor }}
                        >
                          Root cause found
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="mt-5">
            {!atEnd ? (
              <button
                onClick={() => setRevealed((r) => Math.min(r + 1, CHAIN.length))}
                className="w-full text-[11.5px] font-semibold py-2.5 rounded-lg transition-colors"
                style={{ background: `${accentColor}1c`, border: `1px solid ${accentColor}55`, color: accentColor }}
              >
                Trace back one hop
              </button>
            ) : (
              <button
                onClick={() => setRevealed(1)}
                className="w-full text-[11.5px] font-semibold py-2.5 rounded-lg transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                Run the walk again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
