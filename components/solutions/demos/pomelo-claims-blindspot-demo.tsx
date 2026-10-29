"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "claims-only" | "pomelo";

export default function PomeloClaimsBlindspotDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("claims-only");

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
          <span className="text-[10.5px] text-white/40 ml-2">risk model :: first pregnancy, week 14</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Pomelo's own SMFM-presented study looked at nearly 45,000 deliveries and flagged first-time mothers with
            no documented pre-pregnancy claims, a group a claims-only model has almost nothing to score them on.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("claims-only")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "claims-only" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "claims-only" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              claims-history model
            </button>
            <button
              onClick={() => setMode("pomelo")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "pomelo" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "pomelo" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              claims + lab + pharmacy + EHR
            </button>
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-[9.5px] text-white/55">Patient: first pregnancy, no prior claims history on file, elevated BP on this visit's lab panel</span>
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{
              background: mode === "pomelo" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "pomelo" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] text-white/55">preeclampsia risk flag</span>
              <span className="text-[9.5px] font-semibold" style={{ color: mode === "pomelo" ? accentColor : "#f59e0b" }}>
                {mode === "claims-only" ? "no history to score, defaults to unflagged" : "flagged from this visit's lab signal"}
              </span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <p className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "claims-only"
                ? "No pre-pregnancy claims means no risk signal for a model that only reads claims history, even though the aspirin regimen that cuts preeclampsia risk 25% only helps if she's flagged in time to start it."
                : "Reading this visit's own lab result catches the signal a claims-only model never had data for in the first place."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
