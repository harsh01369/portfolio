"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Priority = {
  id: string;
  label: string;
  detail: string;
  outcome: "fail" | "success";
};

const LADDER: Priority[] = [
  { id: "p1", label: "Priority 1: direct LAN", detail: "host-to-host, same network", outcome: "fail" },
  { id: "p2", label: "Priority 2: ICE reflexive", detail: "STUN-discovered public endpoint", outcome: "fail" },
  { id: "p3", label: "Priority 3: ICE direct", detail: "hole-punch through NAT", outcome: "fail" },
  { id: "p4", label: "Priority 4: relay", detail: "WebSocket relay, last resort", outcome: "success" },
];

export default function NetbirdRelayFallbackDemo({ accentColor, bgDark }: Props) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    setStep(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setStep(i);
      if (i < LADDER.length) {
        setTimeout(tick, 550);
      } else {
        setRunning(false);
      }
    };
    setTimeout(tick, 400);
  };

  const relayed = step >= LADDER.length;

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
          <span className="text-[10.5px] text-white/40 ml-2">netbird :: peer connection attempt</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Two peers, both behind symmetric NAT on separate corporate networks. Direct and
            ICE candidates get tried in priority order before anything falls back to a relay.
          </p>

          <div className="flex items-center justify-between mb-4 px-1">
            <div className="text-[10px] text-white/55">peer A (office NAT)</div>
            <div className="text-[9px] text-white/30">{relayed ? "via relay" : "negotiating..."}</div>
            <div className="text-[10px] text-white/55">peer B (office NAT)</div>
          </div>

          <div className="space-y-1.5 mb-4">
            {LADDER.map((p, idx) => {
              const reached = step > idx;
              const active = step === idx + 1 && running;
              return (
                <div
                  key={p.id}
                  className="rounded-lg px-3 py-2.5 transition-opacity"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${reached ? (p.outcome === "success" ? "#22c55e55" : "#ef444444") : "rgba(255,255,255,0.07)"}`,
                    opacity: step === 0 ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10.5px] text-white/75">{p.label}</span>
                    {reached && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[9.5px] font-semibold"
                        style={{ color: p.outcome === "success" ? "#4ade80" : "#fca5a5" }}
                      >
                        {p.outcome === "success" ? "connected" : "no path"}
                      </motion.span>
                    )}
                    {active && <span className="text-[9.5px] text-white/40">trying...</span>}
                  </div>
                  <span className="text-[9px] text-white/35">{p.detail}</span>
                </div>
              );
            })}
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{ background: relayed ? "#22c55e14" : "rgba(255,255,255,0.03)", border: `1px solid ${relayed ? "#22c55e55" : `${accentColor}44`}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: relayed ? "#86efac" : "rgba(255,255,255,0.55)" }}>
              {relayed
                ? "Connected, but through the relay, not peer-to-peer. Both NATs were symmetric, so every direct and reflexive candidate failed. The tunnel still works and is still end-to-end encrypted, but it's now carrying an extra hop's latency that a straight line between the two offices wouldn't have."
                : "Run the attempt to see which priority level this pair actually lands on."}
            </p>
          </div>

          <button
            onClick={run}
            disabled={running}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity disabled:opacity-50"
            style={{ background: accentColor, color: bgDark }}
          >
            {running ? "Negotiating..." : step >= LADDER.length ? "Retry connection" : "Attempt direct connection"}
          </button>
        </div>
      </div>
    </div>
  );
}
