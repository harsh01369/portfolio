"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Phase = "idle" | "requesting" | "resolved";

const CHECKLIST = [
  { label: "Fence height", value: "6 ft, fully enclosed" },
  { label: "Other animals present", value: "None during booked hours" },
  { label: "Access notes", value: "Side gate, code shared after booking" },
];

export default function SniffspotBookingIntegrityDemo({ accentColor, bgDark }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [disclosureAccurate, setDisclosureAccurate] = useState(true);
  const [timestamps, setTimestamps] = useState<{ a: number; b: number }>({ a: 0, b: 0 });

  function simulate() {
    const a = 213 + Math.round(Math.random() * 40);
    const b = a + 60 + Math.round(Math.random() * 90);
    setTimestamps({ a, b });
    setPhase("requesting");
    window.setTimeout(() => setPhase("resolved"), 650);
  }

  const aWins = timestamps.a <= timestamps.b;

  return (
    <div className="w-full max-w-lg flex flex-col items-center">
      <div
        className="relative rounded-[2rem] overflow-hidden shadow-2xl w-[300px]"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -right-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(55px)" }}
        />
        {/* notch */}
        <div className="relative flex justify-center pt-2">
          <div className="w-20 h-4 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        <div className="relative px-5 pb-6 pt-3">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">Maple Ridge Yard</p>
          <p className="text-white text-sm font-semibold mb-3">Sat, 4:00-5:00 PM slot</p>

          <div className="min-h-[160px]">
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2.5"
                >
                  <p className="text-white/45 text-[11px] leading-relaxed mb-2">
                    Two guests open this exact slot at nearly the same instant.
                  </p>
                  <button
                    onClick={simulate}
                    className="w-full text-[11px] font-semibold px-3 py-2 rounded-lg transition-opacity hover:opacity-85"
                    style={{ background: accentColor, color: bgDark }}
                  >
                    Simulate concurrent booking
                  </button>
                </motion.div>
              )}

              {phase === "requesting" && (
                <motion.div
                  key="requesting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  {["Guest A", "Guest B"].map((g, i) => (
                    <motion.div
                      key={g}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between rounded-lg px-3 py-2"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <span className="text-white text-xs">{g} requests slot</span>
                      <span className="text-white/50 text-[10px] font-mono tabular-nums">
                        t+{i === 0 ? timestamps.a : timestamps.b}ms
                      </span>
                    </motion.div>
                  ))}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/40 text-[10px] text-center pt-1"
                  >
                    Resolving booking lock...
                  </motion.p>
                </motion.div>
              )}

              {phase === "resolved" && (
                <motion.div key="resolved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-lg px-3 py-2.5"
                    style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}` }}
                  >
                    <p className="text-xs font-semibold" style={{ color: accentColor }}>
                      {aWins ? "Guest A" : "Guest B"} confirmed, lock acquired at t+{Math.min(timestamps.a, timestamps.b)}ms
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 }}
                    className="rounded-lg px-3 py-2.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <p className="text-white/60 text-xs">
                      {aWins ? "Guest B" : "Guest A"} redirected to nearby open slots before seeing a confirmation screen, never shown a double-booked yard.
                    </p>
                  </motion.div>
                  <button
                    onClick={() => setPhase("idle")}
                    className="w-full text-[10px] text-white/40 hover:text-white/60 pt-1 transition-colors"
                  >
                    Run again
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Safety disclosure</p>
              <button
                onClick={() => setDisclosureAccurate((v) => !v)}
                className="text-[9px] font-semibold px-2 py-0.5 rounded-full transition-colors"
                style={{
                  background: disclosureAccurate ? `${accentColor}22` : "rgba(240,82,82,0.15)",
                  color: disclosureAccurate ? accentColor : "#F05252",
                  border: `1px solid ${disclosureAccurate ? accentColor : "#F05252"}`,
                }}
              >
                {disclosureAccurate ? "Verified" : "Mark outdated"}
              </button>
            </div>
            <div className="space-y-1.5 mb-3">
              {CHECKLIST.map((c) => (
                <div key={c.label} className="flex items-center justify-between text-[10px]">
                  <span className="text-white/40">{c.label}</span>
                  <span className="text-white/65 text-right">{disclosureAccurate ? c.value : "Flagged, host re-verifying"}</span>
                </div>
              ))}
            </div>
            <button
              disabled={!disclosureAccurate}
              className="w-full text-[11px] font-semibold px-3 py-2 rounded-lg transition-opacity"
              style={{
                background: disclosureAccurate ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                color: disclosureAccurate ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
                border: "1px solid rgba(255,255,255,0.1)",
                cursor: disclosureAccurate ? "pointer" : "not-allowed",
              }}
            >
              {disclosureAccurate ? "Confirm booking" : "Confirm disabled until re-verified"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
