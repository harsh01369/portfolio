"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function OscilarFeatureStalenessDemo({ accentColor, bgDark }: Props) {
  const [newTxns, setNewTxns] = useState(0);

  const pushTxn = () => setNewTxns((n) => Math.min(n + 1, 4));

  const servedVelocity = 3;
  const actualVelocity = servedVelocity + newTxns;
  const servedDecision = servedVelocity >= 5 ? "BLOCK" : "ALLOW";
  const actualDecision = actualVelocity >= 5 ? "BLOCK" : "ALLOW";
  const mismatch = servedDecision !== actualDecision;

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
          <span className="text-[10.5px] text-white/40 ml-2">decision :: card auth, feature lookup</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A tiered setup like this splits a system of record, a low-latency serving tier, and a
            batch/ML tier. The serving tier answers in milliseconds from a precomputed feature,
            not from the system of record directly. New transactions land in the system of record
            first and take a moment to reach the serving tier.
          </p>

          <button
            onClick={pushTxn}
            disabled={newTxns >= 4}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity mb-4 disabled:opacity-40"
            style={{ background: accentColor, color: bgDark }}
          >
            Card swipe #{newTxns + 1}: new transaction hits the ledger
          </button>

          <div className="space-y-2.5">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] text-white/75">serving tier (precomputed velocity)</span>
                <span className="text-[9.5px] font-semibold tabular-nums" style={{ color: accentColor }}>{servedVelocity}/5min</span>
              </div>
              <motion.div key={servedDecision} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px]" style={{ color: servedDecision === "BLOCK" ? "#fca5a5" : "#86efac" }}>
                decision: {servedDecision}
              </motion.div>
            </div>

            <div
              className="rounded-lg px-3 py-2.5"
              style={{ background: mismatch ? "#ef444414" : "rgba(255,255,255,0.025)", border: `1px solid ${mismatch ? "#ef444455" : "rgba(255,255,255,0.07)"}` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] text-white/75">system of record (actual velocity)</span>
                <motion.span key={actualVelocity} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] font-semibold tabular-nums" style={{ color: mismatch ? "#ef4444" : accentColor }}>
                  {actualVelocity}/5min
                </motion.span>
              </div>
              <div className="text-[10px]" style={{ color: actualDecision === "BLOCK" ? "#fca5a5" : "#86efac" }}>
                would decide: {actualDecision}
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mt-4"
            style={{ background: mismatch ? "#ef444414" : "rgba(255,255,255,0.03)", border: `1px solid ${mismatch ? "#ef444455" : `${accentColor}44`}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: mismatch ? "#fca5a5" : "rgba(255,255,255,0.55)" }}>
              {mismatch
                ? `The serving tier is still answering from a velocity feature that hasn't caught up. Card ${newTxns + 2} would get approved against the real-time rule on a value that's already ${actualVelocity - servedVelocity} transactions stale.`
                : "Push a few more swipes faster than the feature pipeline can recompute, and watch the two tiers disagree."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
