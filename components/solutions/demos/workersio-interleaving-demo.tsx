"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

const TOTAL_INTERLEAVINGS = 2847213;

export default function WorkersIoInterleavingDemo({ accentColor, bgDark }: Props) {
  const [found, setFound] = useState(false);
  const [searching, setSearching] = useState(false);
  const [replaying, setReplaying] = useState(false);

  const search = () => {
    setSearching(true);
    setFound(false);
    setTimeout(() => {
      setSearching(false);
      setFound(true);
    }, 1400);
  };

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
          <span className="text-[10.5px] text-white/40 ml-2">simulate :: concurrent withdraw + transfer, same account</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Two operations race on the same account balance. Almost every timing between them is
            fine. One exact interleaving double-spends the balance, and it only shows up if the
            scheduler happens to land on it.
          </p>

          <button
            onClick={search}
            disabled={searching}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity mb-4 disabled:opacity-60"
            style={{ background: accentColor, color: bgDark }}
          >
            {searching ? "Searching interleavings..." : found ? "Search again" : "Search for a breaking interleaving"}
          </button>

          {searching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg px-3 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[9.5px] text-white/40 tabular-nums">scanning {TOTAL_INTERLEAVINGS.toLocaleString()} possible schedules...</span>
            </motion.div>
          )}

          {found && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1.5 mb-4">
              <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "#ef444414", border: "1px solid #ef444455" }}>
                <span className="text-[10px] text-white/70">interleaving #1,992,847 of {TOTAL_INTERLEAVINGS.toLocaleString()}</span>
                <span className="text-[9.5px] font-semibold text-red-400">balance check fails</span>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-[9.5px] text-white/40">withdraw reads balance before transfer's debit commits, both proceed, account goes negative</span>
              </div>
            </motion.div>
          )}

          {found && (
            <button
              onClick={() => setReplaying((r) => !r)}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity mb-4"
              style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)" }}
            >
              {replaying ? "Hide replay" : "Replay deterministically"}
            </button>
          )}

          {replaying && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg px-3 py-2.5" style={{ background: "#22c55e14", border: "1px solid #22c55e55" }}>
              <p className="text-[9.5px] leading-relaxed text-emerald-300">
                Same exact schedule, same injected timing, same result every run. The failing
                interleaving isn't a flaky repro, it's a fixed recording you can step through.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
