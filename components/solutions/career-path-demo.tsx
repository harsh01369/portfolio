"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CareerPathOption } from "@/data/proof-of-work-previews";

interface Props {
  paths: CareerPathOption[];
  accentColor: string;
  bgDark: string;
}

const typeIcon: Record<string, string> = { skill: "●", cert: "◆", role: "★" };

export default function CareerPathDemo({ paths, accentColor, bgDark }: Props) {
  const [activeId, setActiveId] = useState(paths[0]?.id);
  const active = paths.find((p) => p.id === activeId) ?? paths[0];

  return (
    <div className="w-full max-w-md">
      <div className="rounded-xl overflow-hidden shadow-2xl p-6" style={{ background: bgDark }}>
        <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-4">Pick a starting point</p>

        <div className="flex gap-2 mb-6">
          {paths.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className="flex-1 text-left rounded-lg px-3 py-2.5 text-xs font-medium transition-colors"
              style={{
                background: p.id === activeId ? `${accentColor}22` : "rgba(255,255,255,0.06)",
                border: `1px solid ${p.id === activeId ? accentColor : "rgba(255,255,255,0.12)"}`,
                color: p.id === activeId ? "white" : "rgba(255,255,255,0.55)",
              }}
            >
              {p.fromRole}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {active && (
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="relative pl-5">
                <div
                  className="absolute left-[7px] top-1 bottom-1 w-px"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                />
                {active.steps.map((step, i) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.3 }}
                    className="relative mb-5 last:mb-0"
                  >
                    <div
                      className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px]"
                      style={{
                        background: step.type === "role" ? accentColor : bgDark,
                        border: `1.5px solid ${accentColor}`,
                        color: step.type === "role" ? bgDark : accentColor,
                      }}
                    >
                      {typeIcon[step.type]}
                    </div>
                    <p
                      className="text-sm font-semibold mb-0.5"
                      style={{ color: step.type === "role" ? accentColor : "white" }}
                    >
                      {step.label}
                    </p>
                    <p className="text-white/40 text-xs">{step.evidenceNote}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
