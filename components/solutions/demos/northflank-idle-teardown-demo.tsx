"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Preview {
  id: string;
  pr: string;
  httpIdleAt: number;
  activity: "none" | "background-worker";
}

const IDLE_THRESHOLD = 30; // minutes

const INITIAL: Preview[] = [
  { id: "p1", pr: "PR #412 - checkout flow", httpIdleAt: 4, activity: "none" },
  { id: "p2", pr: "PR #418 - webhook retries", httpIdleAt: 22, activity: "background-worker" },
  { id: "p3", pr: "PR #420 - nav redesign", httpIdleAt: 11, activity: "none" },
];

export default function NorthflankIdleTeardownDemo({ accentColor, bgDark }: Props) {
  const [previews, setPreviews] = useState<Preview[]>(INITIAL);
  const [torndown, setTorndown] = useState<Set<string>>(new Set());
  const [running, setRunning] = useState(false);
  const timers = useRef<number | null>(null);

  function advanceClock() {
    if (running) return;
    setRunning(true);
    let ticks = 0;
    timers.current = window.setInterval(() => {
      ticks += 1;
      setPreviews((prev) =>
        prev.map((p) => (torndown.has(p.id) ? p : { ...p, httpIdleAt: p.httpIdleAt + 2 }))
      );
      if (ticks >= 6) {
        if (timers.current) window.clearInterval(timers.current);
        setRunning(false);
      }
    }, 220);
  }

  useEffect(() => {
    const toKill = previews.filter((p) => p.httpIdleAt >= IDLE_THRESHOLD && !torndown.has(p.id));
    if (toKill.length === 0) return;
    setTorndown((prev) => {
      const next = new Set(prev);
      toKill.forEach((p) => next.add(p.id));
      return next;
    });
  }, [previews, torndown]);

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
          <span className="text-[10.5px] text-white/40 ml-2">northflank :: preview-idle-reaper</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Idle teardown watches HTTP traffic. A preview with no inbound requests for{" "}
            <span style={{ color: accentColor }}>{IDLE_THRESHOLD} min</span> gets reaped, even if something
            inside it, a queue consumer, a webhook retry loop, is still doing real work.
          </p>

          <div className="space-y-1.5 mb-4">
            <AnimatePresence initial={false}>
              {previews.map((p) => {
                const dead = torndown.has(p.id);
                const pct = Math.min(100, (p.httpIdleAt / IDLE_THRESHOLD) * 100);
                const danger = p.httpIdleAt >= IDLE_THRESHOLD - 8;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 1 }}
                    animate={{ opacity: dead ? 0.4 : 1 }}
                    className="rounded-lg px-3 py-2.5"
                    style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${dead ? "#ef444455" : "rgba(255,255,255,0.07)"}` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] text-white/75" style={{ textDecoration: dead ? "line-through" : "none" }}>
                        {p.pr}
                      </span>
                      <span className="text-[9px]" style={{ color: dead ? "#ef4444" : "rgba(255,255,255,0.4)" }}>
                        {dead ? "torn down" : `${p.httpIdleAt}m since last HTTP`}
                      </span>
                    </div>
                    {!dead && (
                      <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: danger ? "#ef4444" : accentColor }}
                          animate={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                    {p.activity === "background-worker" && (
                      <p className="text-[9px]" style={{ color: dead ? "#fca5a5" : "#f59e0b" }}>
                        {dead
                          ? "webhook retry worker was still running when this got reaped, in-flight retries were dropped."
                          : "webhook retry worker active, no HTTP traffic to show it"}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            onClick={advanceClock}
            disabled={running}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity disabled:opacity-50"
            style={{ background: accentColor, color: bgDark }}
          >
            Advance 12 minutes
          </button>
        </div>
      </div>
    </div>
  );
}
