"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function TahomaPortalSelfhealDemo({ accentColor, bgDark }: Props) {
  const [portalChanged, setPortalChanged] = useState(false);
  const [selfHealEnabled, setSelfHealEnabled] = useState(true);

  const recordedTarget = "Submit Claim";
  const actualElementAtCoords = portalChanged ? "Cancel" : "Submit Claim";
  const wouldMisclick = portalChanged && !selfHealEnabled;
  const healed = portalChanged && selfHealEnabled;

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
          <span className="text-[10.5px] text-white/40 ml-2">agent :: payer portal, claim submission step</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A recorded workflow clicks a specific screen position. Payer portals change their
            layout without warning. Whether that breaks the claim depends on whether the agent
            is matching a coordinate or matching the actual element.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setPortalChanged((p) => !p)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: portalChanged ? accentColor : "rgba(255,255,255,0.08)", color: portalChanged ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              {portalChanged ? "portal layout: changed" : "portal layout: unchanged"}
            </button>
            <button
              onClick={() => setSelfHealEnabled((s) => !s)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: selfHealEnabled ? accentColor : "rgba(255,255,255,0.08)", color: selfHealEnabled ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              {selfHealEnabled ? "self-heal: on" : "self-heal: off"}
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[10px] text-white/70">recorded step</span>
              <span className="text-[9.5px] tabular-nums" style={{ color: accentColor }}>click (420, 680) → &quot;{recordedTarget}&quot;</span>
            </div>
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: wouldMisclick ? "#ef444414" : "rgba(255,255,255,0.025)", border: `1px solid ${wouldMisclick ? "#ef444455" : "rgba(255,255,255,0.07)"}` }}>
              <span className="text-[10px] text-white/70">element now at (420, 680)</span>
              <motion.span key={actualElementAtCoords} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] font-semibold" style={{ color: wouldMisclick ? "#ef4444" : accentColor }}>
                &quot;{actualElementAtCoords}&quot;
              </motion.span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: wouldMisclick ? "#ef444414" : healed ? "#22c55e14" : "rgba(255,255,255,0.03)", border: `1px solid ${wouldMisclick ? "#ef444455" : healed ? "#22c55e55" : `${accentColor}44`}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: wouldMisclick ? "#fca5a5" : healed ? "#86efac" : "rgba(255,255,255,0.55)" }}>
              {wouldMisclick
                ? "A coordinate-matching agent clicks Cancel instead of Submit Claim. The claim never goes in, and nothing about the agent's own log looks like a failure, the click executed exactly as recorded."
                : healed
                  ? "Self-heal re-locates the element by what it actually says, not where it used to sit, and clicks the real Submit Claim button even though the portal moved it."
                  : "Toggle the portal layout to see what self-heal is actually protecting against."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
