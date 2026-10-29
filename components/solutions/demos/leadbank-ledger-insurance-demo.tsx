"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "reconciled" | "drifted";

export default function LeadBankLedgerInsuranceDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("reconciled");

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
          <span className="text-[10.5px] text-white/40 ml-2">FBO account :: fintech partner ledger</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Pass-through FDIC insurance on a pooled FBO account isn't automatic, it depends on records proving
            exactly how much of the pool belongs to each end customer. That's precisely what broke in the Synapse collapse.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("reconciled")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "reconciled" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "reconciled" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              ledger reconciled
            </button>
            <button
              onClick={() => setMode("drifted")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "drifted" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "drifted" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              ledger drifted from bank balance
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">FBO pool balance at the bank</span>
                <span className="text-[9.5px] text-white/60">$4,210,000.00</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">partner's own ledger, sum of customer balances</span>
                <span className="text-[9.5px] text-white/60">{mode === "reconciled" ? "$4,210,000.00" : "$4,187,400.00"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "reconciled" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "reconciled" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "reconciled"
                ? "Records match the bank's actual balance, so each customer's pass-through coverage is provable to the dollar."
                : "A $22,600 gap between the partner's ledger and the actual bank balance means nobody can currently prove which specific customers that money belongs to, the exact failure mode that left Synapse customers locked out of funds."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
