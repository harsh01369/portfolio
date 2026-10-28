"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

// Two capsules of flow readings. A volume accumulator should reset to 0 at
// each capsule boundary. If it doesn't, capsule 2's running total silently
// inherits capsule 1's leftover volume.
const CAPSULE_1 = [120, 140, 155, 160, 150];
const CAPSULE_2 = [40, 55, 60, 70, 80];
const THRESHOLD = 300;

export default function SeeqCapsuleResetDemo({ accentColor, bgDark }: Props) {
  const [resetAtBoundary, setResetAtBoundary] = useState(true);

  const capsule1Total = CAPSULE_1.reduce((a, b) => a + b, 0);

  const capsule2Running: number[] = [];
  let running = resetAtBoundary ? 0 : capsule1Total;
  for (const v of CAPSULE_2) {
    running += v;
    capsule2Running.push(running);
  }

  const crossIndex = capsule2Running.findIndex((v) => v >= THRESHOLD);

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
          <span className="text-[10.5px] text-white/40 ml-2">batch :: tank fill, volume threshold</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Capsule 1 finishes with 725 units already accumulated. A running volume integral is
            supposed to reset to zero at the next capsule's start. Seeq users have reported this
            not always happening cleanly across overlapping or non-continuous capsules.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-white/50">capsule 2 accumulator:</span>
            <button
              onClick={() => setResetAtBoundary(true)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: resetAtBoundary ? accentColor : "rgba(255,255,255,0.08)", color: resetAtBoundary ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              resets at boundary
            </button>
            <button
              onClick={() => setResetAtBoundary(false)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: !resetAtBoundary ? accentColor : "rgba(255,255,255,0.08)", color: !resetAtBoundary ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              carries over
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            {CAPSULE_2.map((v, i) => (
              <div key={i} className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${i === crossIndex ? "#ef444455" : "rgba(255,255,255,0.07)"}` }}>
                <span className="text-[9.5px] text-white/40">capsule 2, t+{i + 1} flow={v}</span>
                <motion.span
                  key={`${resetAtBoundary}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[10.5px] tabular-nums font-semibold"
                  style={{ color: i === crossIndex ? "#ef4444" : accentColor }}
                >
                  total: {capsule2Running[i]}
                </motion.span>
              </div>
            ))}
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: !resetAtBoundary ? "#ef444414" : "rgba(255,255,255,0.03)", border: `1px solid ${!resetAtBoundary ? "#ef444455" : `${accentColor}44`}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: !resetAtBoundary ? "#fca5a5" : "rgba(255,255,255,0.55)" }}>
              {resetAtBoundary
                ? `Threshold (${THRESHOLD}) crossed at t+${crossIndex + 1} of capsule 2, measured on capsule 2's own volume.`
                : `Threshold (${THRESHOLD}) crossed at t+${crossIndex + 1} of capsule 2, but ${capsule1Total} of that total is leftover from capsule 1. The alarm fires almost immediately into the new batch, against a baseline that isn't really capsule 2's.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
