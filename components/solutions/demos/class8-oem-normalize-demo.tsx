"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Truck {
  id: string;
  oem: string;
  rawLabel: string;
  rawValue: string;
  normalizedMpg: number;
}

const TRUCKS: Truck[] = [
  { id: "t1", oem: "Freightliner", rawLabel: "reported MPG", rawValue: "6.8 mpg", normalizedMpg: 6.8 },
  { id: "t2", oem: "Volvo", rawLabel: "reported fuel use", rawValue: "34.6 L/100km", normalizedMpg: 6.8 },
  { id: "t3", oem: "Mack", rawLabel: "reported fuel flow", rawValue: "9.1 gal/hr @ 52mph avg", normalizedMpg: 5.7 },
];

export default function Class8OemNormalizeDemo({ accentColor, bgDark }: Props) {
  const [normalized, setNormalized] = useState(false);

  const worstNormalized = [...TRUCKS].sort((a, b) => a.normalizedMpg - b.normalizedMpg)[0];

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
          <span className="text-[10.5px] text-white/40 ml-2">fleet :: cross-oem fuel comparison</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Going OEM-native across Freightliner, Volvo, and Mack means three different telemetry schemas for
            the same thing, fuel economy. Compare the raw numbers directly and you're not actually comparing
            fuel economy, you're comparing units.
          </p>

          <div className="space-y-1.5 mb-4">
            {TRUCKS.map((t) => (
              <div key={t.id} className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] text-white/75">{t.oem}</span>
                  <span className="text-[9px] text-white/35">{t.rawLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">{normalized ? "normalized" : "as reported"}</span>
                  <motion.span
                    key={normalized ? "norm" : "raw"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] tabular-nums font-semibold"
                    style={{ color: t.id === worstNormalized.id && normalized ? "#ef4444" : accentColor }}
                  >
                    {normalized ? `${t.normalizedMpg.toFixed(1)} mpg equiv.` : t.rawValue}
                  </motion.span>
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{ background: normalized ? "#ef444414" : "rgba(255,255,255,0.03)", border: `1px solid ${normalized ? "#ef444455" : `${accentColor}44`}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: normalized ? "#fca5a5" : "rgba(255,255,255,0.55)" }}>
              {normalized
                ? `Normalized, the Mack truck is actually the worst performer at ${worstNormalized.normalizedMpg.toFixed(1)} mpg equivalent, not obvious from its raw gal/hr reading.`
                : "Reading the raw numbers as-is, nothing here looks directly comparable yet."}
            </p>
          </div>

          <button
            onClick={() => setNormalized((s) => !s)}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity"
            style={{ background: accentColor, color: bgDark }}
          >
            {normalized ? "View raw OEM readings" : "Normalize across OEM schemas"}
          </button>
        </div>
      </div>
    </div>
  );
}
