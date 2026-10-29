"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Stage = "terminal" | "picked-up";

export default function BlueCargoClockSwitchDemo({ accentColor, bgDark }: Props) {
  const [stage, setStage] = useState<Stage>("terminal");

  const demurrageFree = 4;
  const detentionFree = 5;
  const dayInTerminal = 6;
  const dayPickedUp = 3;
  const dayNow = 10;

  const demurrageOverage = Math.max(0, dayInTerminal - demurrageFree);
  const detentionOverage = Math.max(0, dayNow - (dayPickedUp + detentionFree));

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
          <span className="text-[10.5px] text-white/40 ml-2">container MSCU4471982 :: fee clock</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Pulling a laden box out of the terminal stops the demurrage clock and starts a separate detention clock,
            with its own free-time allowance. Same container, two different fees, two different clocks.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setStage("terminal")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: stage === "terminal" ? accentColor : "rgba(255,255,255,0.08)", color: stage === "terminal" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              still in terminal, day {dayInTerminal}
            </button>
            <button
              onClick={() => setStage("picked-up")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: stage === "picked-up" ? accentColor : "rgba(255,255,255,0.08)", color: stage === "picked-up" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              picked up day {dayPickedUp}, now day {dayNow}
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div
              className="rounded-lg px-3 py-2.5"
              style={{
                background: stage === "terminal" ? `${accentColor}18` : "rgba(255,255,255,0.025)",
                border: stage === "terminal" ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] text-white/55">demurrage clock (terminal dwell)</span>
                <span className="text-[9px] font-semibold" style={{ color: stage === "terminal" ? accentColor : "rgba(255,255,255,0.3)" }}>
                  {stage === "terminal" ? "running" : "stopped at pickup"}
                </span>
              </div>
              <span className="text-[9px] text-white/35">free time 4 days from discharge</span>
            </div>

            <div
              className="rounded-lg px-3 py-2.5"
              style={{
                background: stage === "picked-up" ? `${accentColor}18` : "rgba(255,255,255,0.025)",
                border: stage === "picked-up" ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9.5px] text-white/55">detention clock (chassis, awaiting empty return)</span>
                <span className="text-[9px] font-semibold" style={{ color: stage === "picked-up" ? accentColor : "rgba(255,255,255,0.3)" }}>
                  {stage === "picked-up" ? "running" : "not started"}
                </span>
              </div>
              <span className="text-[9px] text-white/35">free time 5 days from pickup</span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <motion.p key={stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {stage === "terminal"
                ? `Day ${dayInTerminal}, still in the terminal. Free time was 4 days, so this is ${demurrageOverage} day${demurrageOverage === 1 ? "" : "s"} into demurrage, accruing daily.`
                : `Picked up day ${dayPickedUp}, which stopped demurrage with time to spare. But the empty still isn't back by day ${dayNow}, so it's now ${detentionOverage} day${detentionOverage === 1 ? "" : "s"} into detention, a fee nobody watching only the demurrage clock would see coming.`}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
