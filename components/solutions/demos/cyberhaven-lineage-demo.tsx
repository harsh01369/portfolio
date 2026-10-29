"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "signature" | "lineage";

export default function CyberhavenLineageDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("signature");

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
          <span className="text-[10.5px] text-white/40 ml-2">Q3-forecast.xlsx :: one paragraph, copied</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Cyberhaven's own walkthrough of this exact chain: a finance report, one paragraph copied out, pasted
            into a generative AI tool. No file signature survives that copy, only the lineage does.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("signature")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "signature" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "signature" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              legacy signature match
            </button>
            <button
              onClick={() => setMode("lineage")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "lineage" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "lineage" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              lineage tracking
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2 text-[9.5px] text-white/55" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              1. download Q3-forecast.xlsx from finance system
            </div>
            <div className="rounded-lg px-3 py-2 text-[9.5px] text-white/55" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              2. copy one paragraph, no file attached, no filename, no hash match
            </div>
            <div className="rounded-lg px-3 py-2 text-[9.5px] text-white/55" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              3. paste into an external generative AI prompt
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "lineage" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "lineage" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "signature"
                ? "Nothing to match against. The pasted text isn't the file, has no signature, no filename, no hash, legacy DLP sees ordinary text leaving the browser."
                : "The paste is linked back to the original download, source sensitive, destination external AI tool, flagged regardless of how the content was transformed in between."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
