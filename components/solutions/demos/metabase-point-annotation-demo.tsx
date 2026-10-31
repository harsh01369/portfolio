"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface WeekPoint {
  week: number;
  value: number;
}

const SERIES: WeekPoint[] = [
  { week: 1, value: 412 },
  { week: 2, value: 430 },
  { week: 3, value: 455 },
  { week: 4, value: 448 },
  { week: 5, value: 470 },
  { week: 6, value: 265 },
  { week: 7, value: 460 },
  { week: 8, value: 478 },
  { week: 9, value: 490 },
  { week: 10, value: 505 },
  { week: 11, value: 498 },
  { week: 12, value: 310 },
  { week: 13, value: 520 },
  { week: 14, value: 535 },
  { week: 15, value: 542 },
  { week: 16, value: 558 },
];

const INCIDENTS: Record<number, { label: string; detail: string }> = {
  6: { label: "Auth outage", detail: "43 min, 09:12-09:55 UTC" },
  12: { label: "Billing API 502s", detail: "1h 10m, partial" },
};

const MIN_V = 250;
const MAX_V = 560;
const PAD_X = 10;
const CHART_W = 280;
const TOP_Y = 14;
const BOTTOM_Y = 142;
const AXIS_Y = 148;

function xFor(i: number) {
  return PAD_X + (i * CHART_W) / (SERIES.length - 1);
}
function yFor(value: number) {
  const t = (value - MIN_V) / (MAX_V - MIN_V);
  return BOTTOM_Y - t * (BOTTOM_Y - TOP_Y);
}

const PATH = SERIES.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i).toFixed(1)} ${yFor(p.value).toFixed(1)}`).join(" ");

export default function MetabasePointAnnotationDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<"today" | "query">("today");

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
          <span className="text-[10.5px] text-white/40 ml-2">weekly-signups :: line chart</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Metabase ships Events &amp; Timelines: each one is typed in by hand and marks a date on the x-axis, not
            the data point it explains. Issue{" "}
            <span style={{ color: accentColor }}>#3922</span>, query-based event annotations, has been open since
            2016 with 158 upvotes.
          </p>

          <div className="rounded-lg mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg viewBox="0 0 300 165" className="w-full h-auto">
              <path d={PATH} fill="none" stroke={accentColor} strokeWidth={1.6} />
              {SERIES.map((p, i) => (
                <circle key={p.week} cx={xFor(i)} cy={yFor(p.value)} r={1.8} fill="rgba(255,255,255,0.5)" />
              ))}
              <line x1={PAD_X} y1={AXIS_Y} x2={PAD_X + CHART_W} y2={AXIS_Y} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

              {mode === "today" ? (
                <g>
                  {/* only the first incident is shown -- the second would need the sidebar opened and typed by hand again */}
                  <motion.line
                    key="today-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x1={xFor(5)}
                    y1={TOP_Y}
                    x2={xFor(5)}
                    y2={AXIS_Y}
                    stroke="rgba(255,255,255,0.4)"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                  <circle cx={xFor(5)} cy={AXIS_Y} r={3.2} fill="rgba(255,255,255,0.6)" />
                  <text x={xFor(5)} y={AXIS_Y + 11} fontSize="6.5" fill="rgba(255,255,255,0.5)" textAnchor="middle">
                    Event
                  </text>
                </g>
              ) : (
                <g>
                  {Object.entries(INCIDENTS).map(([weekStr, inc]) => {
                    const week = Number(weekStr);
                    const i = week - 1;
                    const p = SERIES[i];
                    const cx = xFor(i);
                    const cy = yFor(p.value);
                    return (
                      <g key={week}>
                        <motion.circle
                          initial={{ r: 0, opacity: 0 }}
                          animate={{ r: 5.5, opacity: 1 }}
                          transition={{ duration: 0.35 }}
                          cx={cx}
                          cy={cy}
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth={1.4}
                        />
                        <circle cx={cx} cy={cy} r={2} fill="#ef4444" />
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>

            <AnimatePresence mode="wait">
              {mode === "today" ? (
                <motion.div
                  key="today-labels"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pb-3 text-[9px] text-white/40"
                >
                  &quot;Event&quot; typed in the sidebar by hand. Marks week 6 on the x-axis only, the line runs the
                  full chart height regardless of how deep the dip actually is. Week 12&apos;s outage has no marker
                  at all, nobody went back and typed it in.
                </motion.div>
              ) : (
                <motion.div
                  key="query-labels"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pb-3 flex flex-col gap-1 text-[9px]"
                >
                  {Object.entries(INCIDENTS).map(([weekStr, inc]) => (
                    <div key={weekStr} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
                      <span className="text-white/70">
                        week {weekStr}: {inc.label}
                      </span>
                      <span className="text-white/35">· {inc.detail}</span>
                      <span className="text-white/25 ml-auto">from incidents query</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-[9.5px] leading-relaxed mb-4 text-white/35">
            {mode === "today"
              ? "This is what shipping today looks like: one manual event, pinned to a date, disconnected from the value."
              : "Both markers come from the same incidents table every time this renders, no manual entry, and each one sits on the actual point it explains."}
          </p>

          <button
            onClick={() => setMode((m) => (m === "today" ? "query" : "today"))}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity"
            style={{ background: accentColor, color: bgDark }}
          >
            {mode === "today" ? "Switch to query-based annotation" : "Back to Metabase's current Events"}
          </button>
        </div>
      </div>
    </div>
  );
}
