"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function RelevantIdentityResolutionDemo({ accentColor, bgDark }: Props) {
  const [resolved, setResolved] = useState(false);

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
          <span className="text-[10.5px] text-white/40 ml-2">uds :: diabetes HbA1c control measure</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A clinic visit record and a lab result record for the same patient, filed under a
            slightly different name spelling. UDS mapping guides flag this exact pattern,
            duplicate patient identities going unresolved, as a known source of bad measure counts.
          </p>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-white/70">EHR record A: "Maria Lopez"</span>
              </div>
              <span className="text-[9px] text-white/40">diabetes diagnosis, qualifying visit on file</span>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-white/70">EHR record B: "Maria A. Lopez"</span>
              </div>
              <span className="text-[9px] text-white/40">HbA1c lab result, 6.9%, in control</span>
            </div>
          </div>

          <button
            onClick={() => setResolved((r) => !r)}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity mb-4"
            style={{ background: accentColor, color: bgDark }}
          >
            {resolved ? "View as two unresolved records" : "Resolve to one patient identity"}
          </button>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: resolved ? "#22c55e14" : "#ef444414", border: `1px solid ${resolved ? "#22c55e55" : "#ef444455"}` }}
          >
            <motion.p
              key={String(resolved)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9.5px] leading-relaxed"
              style={{ color: resolved ? "#86efac" : "#fca5a5" }}
            >
              {resolved
                ? "Resolved to one patient. The qualifying visit and the in-control lab result both belong to the measure's denominator and numerator for the same person, counted correctly."
                : "Unresolved. Record A has the qualifying visit but no lab result attached. Record B has the lab result but no qualifying visit on its own. Neither record alone satisfies the full measure, so this patient's actual, well-controlled diabetes care disappears from the reported numerator."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
