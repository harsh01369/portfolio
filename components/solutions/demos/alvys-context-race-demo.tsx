"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "stale" | "fresh";
type Phase = "idle" | "driverUpdate" | "agentActs" | "done";

export default function AlvysContextRaceDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("fresh");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("driverUpdate");
    const agentDelay = mode === "stale" ? 350 : 1100;
    window.setTimeout(() => setPhase("agentActs"), agentDelay);
    window.setTimeout(() => setPhase("done"), agentDelay + 700);
  }

  const driverUpdated = phase !== "idle";
  const agentActed = phase === "agentActs" || phase === "done";
  const done = phase === "done";
  const raced = mode === "stale" && done;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Foundry context graph</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["stale", "fresh"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="alvys-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "stale" ? "Agent acts fast" : "Agent waits for sync"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Load #LD-7734</p>
            <p className="text-white text-xs font-semibold mb-1">Status: In transit, ETA 4:30pm</p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">context graph last synced 40s ago</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: driverUpdated ? accentColor : "rgba(255,255,255,0.1)",
                background: driverUpdated ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Driver app event</p>
              <p className="text-white/70 text-[10.5px]">{driverUpdated ? "Delivered, POD photo attached" : "No new event"}</p>
            </motion.div>
            <motion.div
              animate={{
                borderColor: agentActed ? accentColor : "rgba(255,255,255,0.1)",
                background: agentActed ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Foundry agent</p>
              <p className="text-white/70 text-[10.5px]">{agentActed ? "Releasing carrier payment" : "Watching the graph"}</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Driver marks the load delivered
            </button>
          </div>

          <div className="min-h-[110px]">
            <AnimatePresence mode="wait">
              {phase !== "idle" && !done && (
                <motion.div
                  key={`working-${runKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 pt-3"
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                  <span className="text-white/40 text-[11px]">
                    {phase === "driverUpdate" && "Event written to the driver node..."}
                    {phase === "agentActs" && (mode === "stale" ? "Agent reading the load node before the edge updates..." : "Waiting for the graph edge to settle...")}
                  </span>
                </motion.div>
              )}
              {done && (
                <motion.div
                  key={`done-${runKey}-${mode}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{
                    background: raced ? "#F8717122" : `${accentColor}14`,
                    border: `1px solid ${raced ? "#F87171" : accentColor}55`,
                  }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {raced ? "Payment released against a load the POD hadn't reached yet" : "Payment released after the POD actually linked to the load"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {raced
                      ? "The driver node updated first, but the edge connecting that delivery event to this specific load hadn't propagated through the graph yet. The agent read the load node, saw no blocking exception, and acted on a view that was already stale."
                      : "The agent held until the delivery event's edge to this load settled in the graph, so it acted on the same state a human checking the dashboard would have seen."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Foundry acts on a context graph fed by events from different sources. Trigger one and see what
                  the agent does before everything lines up.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
