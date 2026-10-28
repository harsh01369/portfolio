"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function OrcaGuardrailDemo({ accentColor, bgDark }: Props) {
  const [fuelBudgetPercent, setFuelBudgetPercent] = useState(100);

  const proposedBurn = 4.2;
  const remainingFuel = (fuelBudgetPercent / 100) * 6.0;
  const blocked = proposedBurn > remainingFuel;

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
          <span className="text-[10.5px] text-white/40 ml-2">onboard :: debris avoidance maneuver</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            The AI operator decides what to do, avoid the debris track. A deterministic planner
            turns that into an exact burn. Guardrails check the burn against hard constraints
            before anything reaches the thrusters, regardless of how confident the AI was.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-white/50">remaining propellant budget:</span>
            <button onClick={() => setFuelBudgetPercent(100)} className="text-[10px] px-2.5 py-1 rounded-md" style={{ background: fuelBudgetPercent === 100 ? accentColor : "rgba(255,255,255,0.08)", color: fuelBudgetPercent === 100 ? bgDark : "rgba(255,255,255,0.6)" }}>100%</button>
            <button onClick={() => setFuelBudgetPercent(60)} className="text-[10px] px-2.5 py-1 rounded-md" style={{ background: fuelBudgetPercent === 60 ? accentColor : "rgba(255,255,255,0.08)", color: fuelBudgetPercent === 60 ? bgDark : "rgba(255,255,255,0.6)" }}>60%</button>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[10px] text-white/70">AI operator: avoid debris track, high confidence</span>
            </div>
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[10px] text-white/70">deterministic plan</span>
              <span className="text-[9.5px] tabular-nums" style={{ color: accentColor }}>burn {proposedBurn.toFixed(1)}% of remaining fuel</span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: blocked ? "#ef444414" : "#22c55e14", border: `1px solid ${blocked ? "#ef444455" : "#22c55e55"}` }}
          >
            <motion.p
              key={fuelBudgetPercent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9.5px] leading-relaxed"
              style={{ color: blocked ? "#fca5a5" : "#86efac" }}
            >
              {blocked
                ? `Guardrail denies the burn. The plan needs ${proposedBurn.toFixed(1)}% of fuel but only ${remainingFuel.toFixed(1)}% remains at the ${fuelBudgetPercent}% budget level. The AI's decision was correct, avoid the debris, but the deterministic plan it generated doesn't fit inside what's actually left in the tank, so it never reaches the thrusters.`
                : `Guardrail approves. At ${fuelBudgetPercent}% remaining budget, the ${proposedBurn.toFixed(1)}% burn fits inside what's actually available, so the command reaches the thrusters.`}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
