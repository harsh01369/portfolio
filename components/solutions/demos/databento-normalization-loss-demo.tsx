"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "normalized" | "raw";

export default function DatabentoNormalizationLossDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("normalized");

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
          <span className="text-[10.5px] text-white/40 ml-2">XNAS :: two quotes, same microsecond bucket</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Databento's own docs call this out directly: normalization is useful but deliberately lossy, truncated
            timestamps and discarded sequence numbers among the tradeoffs, which is exactly why a raw PCAP feed exists.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("normalized")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "normalized" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "normalized" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              normalized (DBN)
            </button>
            <button
              onClick={() => setMode("raw")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "raw" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "raw" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              raw PCAP
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2 text-[9.5px] text-white/55" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              quote A: bid 142.07, arrives at the venue
            </div>
            <div className="rounded-lg px-3 py-2 text-[9.5px] text-white/55" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              quote B: bid 142.09, arrives moments later
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{
              background: mode === "raw" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "raw" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] text-white/55">which quote actually came first</span>
              <span className="text-[9.5px] font-semibold" style={{ color: mode === "raw" ? accentColor : "#f59e0b" }}>
                {mode === "normalized" ? "ambiguous, same rounded timestamp" : "A, by original packet order"}
              </span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <p className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "normalized"
                ? "DBN's shared schema is correct for the vast majority of strategies, but the truncation and discarded sequence numbers that make it fast also erase the exact order two near-simultaneous quotes arrived in."
                : "The raw feed preserves original packet order exactly as it hit the wire, the one thing normalization was never trying to keep."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
