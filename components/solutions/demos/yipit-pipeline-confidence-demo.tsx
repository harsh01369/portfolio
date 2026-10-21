"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Record_ {
  id: string;
  source: string;
  confidence: number;
  reason: string;
  clean: boolean;
}

const RECORDS: Record_[] = [
  { id: "r1", source: "checkout_events.csv", confidence: 97, reason: "Schema matches, field-complete", clean: true },
  { id: "r2", source: "app_rank_scrape.json", confidence: 91, reason: "Schema matches, field-complete", clean: true },
  { id: "r3", source: "card_panel_feed.csv", confidence: 88, reason: "Minor outlier, within tolerance", clean: true },
  { id: "r4", source: "shipment_scan.json", confidence: 74, reason: "Schema drift: new nested field", clean: false },
  { id: "r5", source: "job_postings.csv", confidence: 61, reason: "Outlier value, 4.2x category mean", clean: false },
  { id: "r6", source: "store_traffic.json", confidence: 52, reason: "Missing field: timestamp_utc", clean: false },
  { id: "r7", source: "web_pricing.csv", confidence: 95, reason: "Schema matches, field-complete", clean: true },
  { id: "r8", source: "review_volume.json", confidence: 68, reason: "Outlier value, source server moved", clean: false },
];

export default function YipitPipelineConfidenceDemo({ accentColor, bgDark }: Props) {
  const [threshold, setThreshold] = useState(85);

  const { approved, routed } = useMemo(() => {
    const approved = RECORDS.filter((r) => r.confidence >= threshold);
    const routed = RECORDS.filter((r) => r.confidence < threshold);
    return { approved, routed };
  }, [threshold]);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Pipeline confidence triage</p>
            <p className="text-white/80 text-[11px] font-mono tabular-nums font-semibold">
              {approved.length}/{RECORDS.length} auto-approved
            </p>
          </div>

          <div
            className="rounded-lg px-4 py-3 mb-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="yipit-threshold" className="text-white/50 text-[10px] uppercase tracking-wider">
                Auto-approve threshold
              </label>
              <span className="text-white text-xs font-mono tabular-nums font-bold" style={{ color: accentColor }}>
                {threshold}
              </span>
            </div>
            <input
              id="yipit-threshold"
              type="range"
              min={40}
              max={99}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${accentColor} ${((threshold - 40) / 59) * 100}%, rgba(255,255,255,0.1) ${((threshold - 40) / 59) * 100}%)`,
                accentColor,
              }}
            />
            <p className="text-white/35 text-[10px] mt-2 leading-relaxed">
              Drag to see which incoming records clear the bar on their own, and which get routed to an analyst
              instead.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: accentColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                Auto-approved
              </p>
              <div className="flex flex-col gap-1.5 min-h-[260px]">
                {approved.map((r) => (
                  <motion.div
                    key={r.id}
                    layout
                    layoutId={r.id}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="rounded-md px-2.5 py-2"
                    style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}40` }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white text-[11px] font-mono truncate">{r.source}</p>
                      <p className="text-[10px] font-mono tabular-nums font-bold" style={{ color: accentColor }}>
                        {r.confidence}
                      </p>
                    </div>
                    <p className="text-white/40 text-[9.5px] mt-0.5 leading-tight">{r.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                Routed to analyst
              </p>
              <div className="flex flex-col gap-1.5 min-h-[260px]">
                {routed.map((r) => (
                  <motion.div
                    key={r.id}
                    layout
                    layoutId={r.id}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="rounded-md px-2.5 py-2"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white/70 text-[11px] font-mono truncate">{r.source}</p>
                      <p className="text-white/50 text-[10px] font-mono tabular-nums font-bold">{r.confidence}</p>
                    </div>
                    <p className="text-white/35 text-[9.5px] mt-0.5 leading-tight">{r.reason}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-white/45 text-[11px] leading-relaxed mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            Every record gets a confidence score and a reason, not just a pass/fail. The 180-plus analyst layer isn't
            bypassed, it's pointed at exactly the records the pipeline itself isn't sure about.
          </p>
        </div>
      </div>
    </div>
  );
}
