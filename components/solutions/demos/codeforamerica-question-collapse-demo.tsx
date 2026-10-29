"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "compound" | "personalized";

export default function CodeForAmericaQuestionCollapseDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("compound");

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
          <span className="text-[10.5px] text-white/40 ml-2">GetCalFresh :: SNAP expedited screening</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Eligibility is a math problem written as if-then rules. CfA's own writeup on this exact screening step
            says collapsing a compound legal condition into one personalized question cut drop-off by more than half.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("compound")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "compound" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "compound" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              original compound question
            </button>
            <button
              onClick={() => setMode("personalized")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "personalized" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "personalized" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              personalized single question
            </button>
          </div>

          <div
            className="rounded-lg px-3 py-3 mb-4"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] leading-relaxed text-white/70">
              {mode === "compound"
                ? "\"Is your gross monthly income under $150 AND are your countable resources under $100?\""
                : "\"Based on what you told us already, do you have less than $250 in cash?\""}
            </motion.p>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">applicant has to</span>
                <span className="text-[9px] text-white/40">
                  {mode === "compound" ? "parse a compound legal condition, do the math themselves" : "answer one plain yes/no, threshold already computed from their data"}
                </span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">drop-off at this step</span>
                <span className="text-[9.5px] font-semibold" style={{ color: mode === "personalized" ? accentColor : "#f59e0b" }}>
                  {mode === "compound" ? "high, confusing wording" : "cut by more than half, 75% for Chinese speakers"}
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <p className="text-[9.5px] leading-relaxed text-white/55">
              Same eligibility rule either way, income under $150 and resources under $100. The only thing that
              changed is who does the math, the applicant or the system, using data it already has.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
