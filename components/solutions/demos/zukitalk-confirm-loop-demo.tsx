"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "single" | "confirm";

export default function ZukiTalkConfirmLoopDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("single");

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
          <span className="text-[10.5px] text-white/40 ml-2">MPI call :: brake pad replacement, $340</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            The voice agent asks the customer to approve a $340 repair over the phone. What it does with an
            answer like "yeah, no, go ahead" depends entirely on whether it confirms back before recording it.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("single")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "single" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "single" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              single-pass transcription
            </button>
            <button
              onClick={() => setMode("confirm")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "confirm" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "confirm" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              confirms back first
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">customer says, over road noise</span>
                <span className="text-[9.5px] text-white/60">"yeah, no, go ahead"</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">what the system records</span>
                <span className="text-[9.5px] text-white/60">{mode === "single" ? "approved, logged immediately" : "pending, awaiting confirmation"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "confirm" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "confirm" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "single"
                ? "The transcript scores this as an approval and the shop proceeds with the $340 repair. If the customer actually meant to decline and the \"no\" got buried in a filler phrase, there's no step where that gets caught before the work starts."
                : "The agent reads the approval back explicitly, \"so you'd like us to go ahead with the $340 brake pad replacement, is that right?\", and only logs the approval once the customer confirms a second time in response to that specific question."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
