"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Device {
  id: string;
  label: string;
  inSession: boolean;
}

const DEVICES: Device[] = [
  { id: "d1", label: "Unit 14B, Nazareth Home", inSession: false },
  { id: "d2", label: "Unit 07A, Nazareth Home", inSession: true },
  { id: "d3", label: "Unit 22C, Nazareth Home", inSession: false },
];

type UpdateState = "pending" | "updating" | "deferred" | "updated";

export default function ToiLabsOtaSessionDemo({ accentColor, bgDark }: Props) {
  const [states, setStates] = useState<Record<string, UpdateState>>({ d1: "pending", d2: "pending", d3: "pending" });
  const [running, setRunning] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function rollout() {
    clearTimers();
    setRunning(true);
    setSessionEnded(false);
    setStates({ d1: "updating", d2: "deferred", d3: "updating" });

    const t1 = window.setTimeout(() => {
      setStates((prev) => ({ ...prev, d1: "updated", d3: "updated" }));
      setRunning(false);
    }, 1200);
    timers.current.push(t1);
  }

  function finishSession() {
    setSessionEnded(true);
    setStates((prev) => ({ ...prev, d2: "updating" }));
    const t = window.setTimeout(() => {
      setStates((prev) => ({ ...prev, d2: "updated" }));
    }, 900);
    timers.current.push(t);
  }

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
          <span className="text-[10.5px] text-white/40 ml-2">fleet :: ota-rollout</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A firmware push that lands mid-scan risks dropping the one reading that mattered. Fleet-wide rollouts
            need to know which units are mid-session, not just which ones are reachable.
          </p>

          <div className="space-y-1.5 mb-4">
            {DEVICES.map((d) => {
              const state = states[d.id];
              const color =
                state === "deferred" ? "#f59e0b" : state === "updating" ? accentColor : state === "updated" ? "#22c55e" : "rgba(255,255,255,0.3)";
              return (
                <div
                  key={d.id}
                  className="rounded-lg px-3 py-2.5"
                  style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${state === "deferred" ? "#f59e0b55" : "rgba(255,255,255,0.07)"}` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-white/75">{d.label}</span>
                    <span className="text-[9px] uppercase tracking-wide" style={{ color }}>
                      {state === "pending" ? "firmware v2.4.1" : state}
                    </span>
                  </div>
                  {d.id === "d2" && (
                    <p className="text-[9px] mt-1" style={{ color: state === "deferred" ? "#f59e0b" : "rgba(255,255,255,0.3)" }}>
                      {state === "deferred"
                        ? "mid-session, optical scan in progress, update queued until session ends"
                        : sessionEnded
                        ? "session ended, queued update now applying"
                        : ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={rollout}
              disabled={running || states.d1 !== "pending"}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity disabled:opacity-40"
              style={{ background: accentColor, color: bgDark }}
            >
              Push firmware v2.4.1 to fleet
            </button>
            <AnimatePresence>
              {states.d2 === "deferred" && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={finishSession}
                  className="text-[10px] text-white/45 underline decoration-white/20"
                >
                  mark unit 07A session complete
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
