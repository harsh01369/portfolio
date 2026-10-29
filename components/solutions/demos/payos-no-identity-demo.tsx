"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "standard" | "agentic";

export default function PayOSNoIdentityDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("standard");

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
          <span className="text-[10.5px] text-white/40 ml-2">checkout :: agent books a $340 hotel room</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            PayOS says it plainly: an agent has no legal identity, and that breaks verification built for a
            human at checkout. The fix isn't identity, it's replacing identity with a scoped token and a limit.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("standard")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "standard" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "standard" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              standard CNP verification
            </button>
            <button
              onClick={() => setMode("agentic")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "agentic" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "agentic" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              agentic token + limit
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">cardholder name / billing address on file</span>
                <span className="text-[9.5px] text-white/60">{mode === "standard" ? "no human present to match" : "n/a, not the check being run"}</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">what actually authorizes this charge</span>
                <span className="text-[9.5px] text-white/60">{mode === "standard" ? "AVS / CVV identity match" : "developer limit + prior human approval"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "agentic" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "agentic" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "standard"
                ? "Standard card-not-present checks are built around verifying a human who isn't there. The agent has no legal identity to match against an AVS record, so the transaction either fails verification or has to fall back to trusting the raw card number outright."
                : "The proxy token never tries to verify who the agent is. It encodes what it's allowed to do: a spend ceiling and a prior human sign-off, checked at authorization time instead of an identity that doesn't exist for an autonomous buyer."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
