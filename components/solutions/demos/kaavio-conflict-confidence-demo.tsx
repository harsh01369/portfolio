"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface SourceValue {
  id: string;
  source: string;
  value: string;
}

const VALUES: SourceValue[] = [
  { id: "s1", source: "manufacturer spec PDF", value: "24V DC" },
  { id: "s2", source: "distributor catalog feed", value: "24V DC" },
  { id: "s3", source: "manufacturer website", value: "12V DC" },
];

export default function KaavioConflictConfidenceDemo({ accentColor, bgDark }: Props) {
  const [sourcesEnabled, setSourcesEnabled] = useState<Record<string, boolean>>({ s1: true, s2: false, s3: false });

  const toggle = (id: string) => setSourcesEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  const activeValues = VALUES.filter((v) => sourcesEnabled[v.id]);
  const uniqueValues = new Set(activeValues.map((v) => v.value));
  const hasConflict = uniqueValues.size > 1;
  const confidence = activeValues.length === 0 ? 0 : hasConflict ? 42 : Math.min(60 + activeValues.length * 15, 95);

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
          <span className="text-[10.5px] text-white/40 ml-2">attribute :: SKU-88213, input voltage</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Three sources claim to know this SKU's input voltage. Two of three agree. Toggle
            which sources are in play and watch confidence score react to agreement, not just to
            having more sources.
          </p>

          <div className="space-y-1.5 mb-4">
            {VALUES.map((v) => (
              <button
                key={v.id}
                onClick={() => toggle(v.id)}
                className="w-full rounded-lg px-3 py-2 flex items-center justify-between text-left transition-opacity"
                style={{ background: sourcesEnabled[v.id] ? `${accentColor}14` : "rgba(255,255,255,0.025)", border: `1px solid ${sourcesEnabled[v.id] ? `${accentColor}55` : "rgba(255,255,255,0.07)"}`, opacity: sourcesEnabled[v.id] ? 1 : 0.5 }}
              >
                <span className="text-[10px] text-white/70">{v.source}</span>
                <span className="text-[10px] font-semibold tabular-nums" style={{ color: accentColor }}>{v.value}</span>
              </button>
            ))}
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: hasConflict ? "#ef444414" : "rgba(255,255,255,0.03)", border: `1px solid ${hasConflict ? "#ef444455" : `${accentColor}44`}` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/55">confidence score</span>
              <motion.span key={confidence} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[12px] font-bold tabular-nums" style={{ color: hasConflict ? "#ef4444" : accentColor }}>
                {confidence}%
              </motion.span>
            </div>
            <p className="text-[9px] leading-relaxed" style={{ color: hasConflict ? "#fca5a5" : "rgba(255,255,255,0.4)" }}>
              {activeValues.length === 0
                ? "No sources active."
                : hasConflict
                  ? "Sources disagree. Confidence drops even though three sources is normally enough to trust an attribute, agreement matters more than count."
                  : "Sources agree. Confidence rises with each additional source that corroborates the same value."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
