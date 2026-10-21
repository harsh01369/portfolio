"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type View = "flow" | "boundary";

const STAGES = ["Capture", "Encrypted sync", "Autopilot loop", "Stored history"];

const METRICS = [
  { label: "HRV", value: "54", unit: "ms" },
  { label: "Heart rate", value: "58", unit: "bpm" },
  { label: "Resp. rate", value: "14", unit: "rpm" },
];

const BLOCKED_COLOR = "#E5484D";

export default function EightSleepBoundaryDemo({ accentColor, bgDark }: Props) {
  const [view, setView] = useState<View>("flow");

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(65px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">One night&apos;s data</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["flow", "boundary"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: view === v ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {view === v && (
                    <motion.div
                      layoutId="view-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{v === "flow" ? "Where it goes" : "What never happens"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex-1 rounded-lg px-2.5 py-2 text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <p className="text-white/35 text-[9.5px] uppercase tracking-wider mb-0.5">{m.label}</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {m.value}
                  <span className="text-white/35 text-[10px] font-normal ml-0.5">{m.unit}</span>
                </p>
              </motion.div>
            ))}
          </div>

          <div className="min-h-[170px]">
            <AnimatePresence mode="wait">
              {view === "flow" ? (
                <motion.div
                  key="flow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between relative mb-4">
                    {STAGES.map((stage, i) => (
                      <div key={stage} className="flex items-center flex-1 last:flex-none">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 26 }}
                          className="rounded-lg px-2 py-2.5 text-center shrink-0"
                          style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}45`, width: 78 }}
                        >
                          <p className="text-[9px] font-semibold leading-tight" style={{ color: accentColor }}>
                            {stage}
                          </p>
                        </motion.div>
                        {i < STAGES.length - 1 && (
                          <div
                            className="flex-1 h-px relative mx-1"
                            style={{ background: "rgba(255,255,255,0.12)" }}
                          >
                            <motion.div
                              className="absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2"
                              style={{ background: accentColor }}
                              animate={{ left: ["0%", "90%"] }}
                              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-white/45 text-[11.5px] leading-relaxed">
                    Biometrics flow from the pod cover to Autopilot&apos;s real-time loop and into your sleep
                    history, encrypted in transit the whole way.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="boundary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <div
                      className="rounded-lg px-3 py-2.5 text-center"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <p className="text-white/55 text-[9.5px] font-semibold">Stored history</p>
                    </div>

                    <div className="relative flex items-center w-14 h-9">
                      <motion.div
                        className="absolute top-1/2 w-2 h-2 rounded-full -translate-y-1/2"
                        style={{ background: accentColor }}
                        animate={{ left: ["0%", "60%", "30%", "0%"], opacity: [1, 1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity, times: [0, 0.5, 0.75, 1] }}
                      />
                      <div
                        className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-full"
                        style={{
                          background:
                            "repeating-linear-gradient(180deg, " +
                            BLOCKED_COLOR +
                            " 0, " +
                            BLOCKED_COLOR +
                            " 4px, transparent 4px, transparent 8px)",
                        }}
                      />
                    </div>

                    <div
                      className="rounded-lg px-3 py-2.5 text-center"
                      style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.4)" }}
                    >
                      <p className="text-[9.5px] font-semibold" style={{ color: BLOCKED_COLOR }}>
                        AI model training
                      </p>
                    </div>
                  </div>
                  <p className="text-white/45 text-[11.5px] leading-relaxed">
                    This path is blocked by design. Eight Sleep&apos;s privacy policy states personal data is not
                    used to train LLMs or third-party generative AI, this is that boundary made visible.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
