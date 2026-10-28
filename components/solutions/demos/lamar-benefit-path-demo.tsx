"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Benefit = "pharmacy" | "medical";

export default function LamarBenefitPathDemo({ accentColor, bgDark }: Props) {
  const [benefit, setBenefit] = useState<Benefit>("pharmacy");

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
          <span className="text-[10.5px] text-white/40 ml-2">pa-submit :: same specialty drug, same patient</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Whether a specialty drug is billed under the pharmacy benefit or the medical benefit
            decides which electronic standard the PA has to go out on, not just which form to fill in.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setBenefit("pharmacy")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: benefit === "pharmacy" ? accentColor : "rgba(255,255,255,0.08)", color: benefit === "pharmacy" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              pharmacy benefit
            </button>
            <button
              onClick={() => setBenefit("medical")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: benefit === "medical" ? accentColor : "rgba(255,255,255,0.08)", color: benefit === "medical" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              medical benefit
            </button>
          </div>

          <div className="rounded-lg px-3 py-3 mb-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/55">submission standard</span>
              <motion.span key={benefit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10.5px] font-semibold" style={{ color: accentColor }}>
                {benefit === "pharmacy" ? "NCPDP SCRIPT" : "FHIR-based PA API"}
              </motion.span>
            </div>
            <span className="text-[9px] text-white/35">
              {benefit === "pharmacy" ? "routed through the pharmacy claims network" : "routed through the payer's clinical review system"}
            </span>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <p className="text-[9.5px] leading-relaxed text-white/55">
              {benefit === "pharmacy"
                ? "Same drug, same diagnosis, but the packet and the channel it goes out on are built for the pharmacy claims path, not the medical review path. Submitting on the wrong standard doesn't get rejected for medical necessity, it gets rejected for being sent on the wrong channel entirely."
                : "Same drug, same diagnosis, now routed as a medical benefit request through the FHIR-based API, straight into the payer's clinical review queue instead of the pharmacy claims network."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
