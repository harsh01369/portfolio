"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "dashboard" | "source";

export default function CrediflowStaleCovenantDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("dashboard");

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
          <span className="text-[10.5px] text-white/40 ml-2">covenant monitor :: min. cash balance, QuickBooks feed</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            "Real-time portfolio monitoring" is only as real-time as the weakest source behind it. A QuickBooks
            integration is only as current as the last time the borrower's own bookkeeper hit reconcile.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("dashboard")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "dashboard" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "dashboard" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              what the dashboard shows
            </button>
            <button
              onClick={() => setMode("source")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "source" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "source" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              what the source data says
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">covenant: minimum cash balance $150,000</span>
                <span className="text-[9.5px] text-white/60">{mode === "dashboard" ? "compliant, green" : "last reconciled 12 days ago"}</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">QuickBooks balance on file</span>
                <span className="text-[9.5px] text-white/60">$168,400, as of 12 days ago</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "source" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "source" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "dashboard"
                ? "The portfolio view marks this covenant compliant because the last synced number cleared $150,000. Nothing on this screen tells the credit team that number is 12 days old, because QuickBooks only updates when the borrower reconciles, not on a schedule the lender controls."
                : "Twelve days of cash burn, payroll, or a missed receivable could already have pushed this account under $150,000. The covenant status shown today reflects whatever the borrower's bookkeeper last typed in, not today's actual balance."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
