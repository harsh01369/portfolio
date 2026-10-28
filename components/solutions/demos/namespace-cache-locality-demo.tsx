"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Strategy = "locality" | "idle";

const NODE_A = { name: "node-a", hasCache: true, queueDepth: 3, coldPullSeconds: 0, warmStartSeconds: 2 };
const NODE_B = { name: "node-b", hasCache: false, queueDepth: 0, coldPullSeconds: 8, warmStartSeconds: 2 };

export default function NamespaceCacheLocalityDemo({ accentColor, bgDark }: Props) {
  const [strategy, setStrategy] = useState<Strategy>("locality");

  const chosen = strategy === "locality" ? NODE_A : NODE_B;
  const queueWaitSeconds = chosen.queueDepth * 4;
  const startupSeconds = chosen.hasCache ? chosen.warmStartSeconds : chosen.coldPullSeconds;
  const totalSeconds = queueWaitSeconds + startupSeconds;

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
          <span className="text-[10.5px] text-white/40 ml-2">scheduler :: new CI job dispatch</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A cache-aware scheduler routes jobs to nodes that already hold the right cache
            revision. That's a real win when the node is free. It's a real cost when that node is
            also the busiest one.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setStrategy("locality")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: strategy === "locality" ? accentColor : "rgba(255,255,255,0.08)", color: strategy === "locality" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              route to cache hit (node-a)
            </button>
            <button
              onClick={() => setStrategy("idle")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: strategy === "idle" ? accentColor : "rgba(255,255,255,0.08)", color: strategy === "idle" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              route to idle node (node-b)
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: chosen === NODE_A ? `${accentColor}14` : "rgba(255,255,255,0.025)", border: `1px solid ${chosen === NODE_A ? `${accentColor}55` : "rgba(255,255,255,0.07)"}` }}>
              <span className="text-[10px] text-white/70">node-a: cache hit, queue depth 3</span>
              {chosen === NODE_A && <span className="text-[9.5px]" style={{ color: accentColor }}>selected</span>}
            </div>
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: chosen === NODE_B ? `${accentColor}14` : "rgba(255,255,255,0.025)", border: `1px solid ${chosen === NODE_B ? `${accentColor}55` : "rgba(255,255,255,0.07)"}` }}>
              <span className="text-[10px] text-white/70">node-b: cold cache, idle, no queue</span>
              {chosen === NODE_B && <span className="text-[9.5px]" style={{ color: accentColor }}>selected</span>}
            </div>
          </div>

          <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9.5px] text-white/50">queue wait</span>
              <motion.span key={`q-${strategy}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tabular-nums" style={{ color: accentColor }}>{queueWaitSeconds}s</motion.span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9.5px] text-white/50">{chosen.hasCache ? "warm start (cache present)" : "cold pull (cache absent)"}</span>
              <motion.span key={`s-${strategy}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tabular-nums" style={{ color: accentColor }}>{startupSeconds}s</motion.span>
            </div>
            <div className="h-px my-1.5" style={{ background: "rgba(255,255,255,0.08)" }} />
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/70 font-semibold">total time to first output</span>
              <motion.span key={`t-${strategy}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[11px] tabular-nums font-bold" style={{ color: accentColor }}>{totalSeconds}s</motion.span>
            </div>
          </div>

          <p className="text-white/30 text-[9px] leading-relaxed mt-3">
            {strategy === "locality"
              ? "The cache hit wins the pull, but loses the race: 12 seconds in queue behind it eats the two seconds the cache saved."
              : "The idle node loses the cache and still wins the race: no queue, just a slower cold pull."}
          </p>
        </div>
      </div>
    </div>
  );
}
