"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "accepts" | "eligible";

export default function NextPatientEligibilityGapDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("accepts");

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
          <span className="text-[10.5px] text-white/40 ml-2">booking :: Dr. Nakamura, dermatology</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Showing which providers accept a plan's network and confirming this patient's specific plan is eligible
            for this specific visit are two different checks. NextPatient's own docs say it does the first, not the second.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("accepts")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "accepts" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "accepts" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              provider accepts network
            </button>
            <button
              onClick={() => setMode("eligible")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "eligible" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "eligible" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              this plan's actual eligibility
            </button>
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-[9.5px] text-white/55">Patient: BlueShield PPO, booking a skin biopsy follow-up</span>
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{
              background: mode === "accepts" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "accepts" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] text-white/55">booking confirmation shown to patient</span>
              <span className="text-[9.5px] font-semibold" style={{ color: mode === "accepts" ? accentColor : "#f59e0b" }}>
                {mode === "accepts" ? "confirmed, \"in network\"" : "not actually checked yet"}
              </span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "accepts"
                ? "The practice accepts BlueShield PPO generally, so the booking shows as confirmed. Whether this specific plan's specific benefit covers this specific visit hasn't been checked at all."
                : "Eligibility for this procedure under this plan is a separate lookup, one NextPatient's own docs say it doesn't run. A confirmed booking can still surface a coverage surprise at the front desk."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
