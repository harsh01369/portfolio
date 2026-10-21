"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Lens = "raw" | "signal";

interface Window {
  label: string;
  idleRatio: number;
  excavatorRuntimeMin: number;
  trailerPings: number;
  beaconPings: number;
  risk: boolean;
}

const WINDOWS: Window[] = [
  { label: "08:00", idleRatio: 0.12, excavatorRuntimeMin: 14, trailerPings: 2, beaconPings: 340, risk: false },
  { label: "08:15", idleRatio: 0.18, excavatorRuntimeMin: 12, trailerPings: 2, beaconPings: 410, risk: false },
  { label: "08:30", idleRatio: 0.31, excavatorRuntimeMin: 9, trailerPings: 2, beaconPings: 380, risk: false },
  { label: "08:45", idleRatio: 0.47, excavatorRuntimeMin: 6, trailerPings: 1, beaconPings: 295, risk: true },
  { label: "09:00", idleRatio: 0.58, excavatorRuntimeMin: 4, trailerPings: 2, beaconPings: 360, risk: true },
  { label: "09:15", idleRatio: 0.52, excavatorRuntimeMin: 5, trailerPings: 1, beaconPings: 330, risk: true },
];

export default function TennaTelemetryDemo({ accentColor, bgDark }: Props) {
  const [lens, setLens] = useState<Lens>("raw");
  const [windowIdx, setWindowIdx] = useState(3);

  const current = WINDOWS[windowIdx];
  const visible = WINDOWS.slice(0, windowIdx + 1);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Fleet telemetry replay</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["raw", "signal"] as Lens[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLens(l)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: lens === l ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {lens === l && (
                    <motion.div
                      layoutId="tenna-lens-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{l === "raw" ? "Raw stream" : "Risk signal"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* time-window scrubber: replays a past window */}
          <div className="flex items-center gap-1.5 mb-6">
            {WINDOWS.map((w, i) => (
              <button
                key={w.label}
                onClick={() => setWindowIdx(i)}
                className="relative flex-1 text-center py-1.5 rounded-md text-[10px] font-mono tabular-nums transition-colors"
                style={{
                  background: i === windowIdx ? `${accentColor}22` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i === windowIdx ? accentColor : "rgba(255,255,255,0.08)"}`,
                  color: i === windowIdx ? accentColor : "rgba(255,255,255,0.4)",
                }}
              >
                {w.label}
                {w.risk && (
                  <span
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              {lens === "raw" ? (
                <motion.div
                  key="raw"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2.5"
                >
                  {[
                    {
                      name: "Excavator CAT 320",
                      sub: "plug-in tracker, 1s interval",
                      value: `${current.excavatorRuntimeMin} min runtime`,
                      highlight: true,
                    },
                    {
                      name: "Idle trailer",
                      sub: "solar tracker, 15min interval",
                      value: `${current.trailerPings} pings`,
                      highlight: false,
                    },
                    {
                      name: "Tool cluster (12 beacons)",
                      sub: "BLE, sub-second bursts",
                      value: `${current.beaconPings} pings`,
                      highlight: false,
                    },
                  ].map((row, i) => (
                    <motion.div
                      key={row.name}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.35 }}
                      className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
                      style={{
                        background: row.highlight ? `${accentColor}14` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${row.highlight ? `${accentColor}55` : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <div>
                        <p className="text-white text-xs font-semibold">{row.name}</p>
                        <p className="text-white/35 text-[10px] mt-0.5">{row.sub}</p>
                      </div>
                      <span
                        className="text-xs font-mono tabular-nums font-semibold"
                        style={{ color: row.highlight ? accentColor : "rgba(255,255,255,0.45)" }}
                      >
                        {row.value}
                      </span>
                    </motion.div>
                  ))}
                  <p className="text-white/35 text-[10px] leading-relaxed pt-1">
                    At native frequency, 1,000+ low-value beacon pings land in this window alongside the one signal
                    that matters. The raw stream alone cannot tell you which asset needs attention.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="signal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-end gap-2 h-[120px] mb-4 px-1">
                    {visible.map((w, i) => (
                      <div key={w.label} className="flex-1 flex flex-col items-center gap-1.5">
                        <motion.div
                          className="w-full rounded-t-sm"
                          initial={{ height: 0 }}
                          animate={{ height: `${w.idleRatio * 100}%` }}
                          transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 28 }}
                          style={{
                            background: w.risk ? accentColor : "rgba(255,255,255,0.18)",
                            minHeight: 4,
                          }}
                        />
                        <span className="text-white/30 text-[9px] font-mono tabular-nums">{w.label}</span>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {current.risk ? (
                      <motion.div
                        key="risk"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg px-3.5 py-3"
                        style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}` }}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: accentColor }}
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                          />
                          <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>
                            Maintenance risk surfaced
                          </p>
                        </div>
                        <p className="text-white text-xs font-semibold">Excavator CAT 320</p>
                        <p className="text-white/45 text-[11px] leading-relaxed mt-1">
                          Idle-to-runtime ratio climbed to <span className="font-mono tabular-nums">{Math.round(current.idleRatio * 100)}%</span>,
                          flagged out of 370,000 tracked assets without being drowned in beacon noise.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="clear"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg px-3.5 py-3"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <p className="text-white/50 text-xs">
                          Idle ratio at <span className="font-mono tabular-nums text-white/70">{Math.round(current.idleRatio * 100)}%</span>, within normal range for this equipment class.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
