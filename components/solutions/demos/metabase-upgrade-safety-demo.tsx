"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Phase = "pre" | "diffing" | "post";

interface Item {
  label: string;
  type: "question" | "dashboard" | "embed";
  outcome: "safe" | "review";
  reason?: string;
}

const ITEMS: Item[] = [
  { label: "MRR by plan tier", type: "question", outcome: "safe" },
  { label: "Churn cohort dashboard", type: "dashboard", outcome: "safe" },
  { label: "Support ticket SLA", type: "question", outcome: "review", reason: "custom field ref deprecated in v51" },
  { label: "Customer 360 embed", type: "embed", outcome: "review", reason: "embed CSS selector renamed" },
  { label: "Weekly revenue snapshot", type: "dashboard", outcome: "safe" },
];

export default function MetabaseUpgradeSafetyDemo({ accentColor, bgDark }: Props) {
  const [phase, setPhase] = useState<Phase>("pre");
  const [cutover, setCutover] = useState(false);

  useEffect(() => {
    if (phase !== "diffing") return;
    const t = setTimeout(() => setPhase("post"), 1300);
    return () => clearTimeout(t);
  }, [phase]);

  const runUpgrade = () => setPhase("diffing");
  const reset = () => {
    setPhase("pre");
    setCutover(false);
  };

  const reviewCount = ITEMS.filter((i) => i.outcome === "review").length;
  const safeCount = ITEMS.length - reviewCount;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Upgrade safety simulator</p>
            {phase !== "pre" && (
              <button
                onClick={reset}
                className="text-white/35 hover:text-white/60 text-[10px] uppercase tracking-wide transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-4 text-[10px] font-mono tabular-nums">
            <span className="text-white/35">v50.2 (current)</span>
            <motion.span
              animate={{ color: phase === "post" ? accentColor : "rgba(255,255,255,0.3)" }}
              className="uppercase tracking-wide font-semibold"
            >
              {phase === "pre" && "awaiting run"}
              {phase === "diffing" && "diffing..."}
              {phase === "post" && (cutover ? "live on v51.0" : "staged v51.0")}
            </motion.span>
            <span className="text-white/35">v51.0 (candidate)</span>
          </div>

          <div className="space-y-1.5 mb-4">
            {ITEMS.map((item, i) => {
              const revealed = phase === "post";
              return (
                <motion.div
                  key={item.label}
                  initial={false}
                  animate={{
                    background:
                      revealed && item.outcome === "review" ? "rgba(244,63,94,0.1)" : "rgba(255,255,255,0.03)",
                    borderColor:
                      revealed && item.outcome === "review" ? "#F43F5E" : "rgba(255,255,255,0.07)",
                  }}
                  transition={{ delay: revealed ? i * 0.07 : 0 }}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5"
                  style={{ border: "1px solid" }}
                >
                  <div>
                    <p className="text-white text-[11px] font-medium">{item.label}</p>
                    <p className="text-white/30 text-[9px] uppercase tracking-wide mt-0.5">{item.type}</p>
                    {revealed && item.reason && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.07 + 0.1 }}
                        className="text-[10px] mt-1"
                        style={{ color: "#F43F5E" }}
                      >
                        {item.reason}
                      </motion.p>
                    )}
                  </div>
                  <div className="relative w-[78px] h-[22px]">
                    <AnimatePresence mode="wait">
                      {!revealed ? (
                        <motion.span
                          key="pending"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute right-0 text-[9px] uppercase tracking-wide text-white/30"
                        >
                          pending
                        </motion.span>
                      ) : (
                        <motion.span
                          key={item.outcome}
                          layoutId={`badge-${item.label}`}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute right-0 text-[9px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full"
                          style={{
                            background: item.outcome === "safe" ? `${accentColor}1E` : "rgba(244,63,94,0.16)",
                            color: item.outcome === "safe" ? accentColor : "#F43F5E",
                          }}
                        >
                          {item.outcome === "safe" ? "confirmed safe" : "needs review"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {phase === "pre" && (
            <motion.button
              onClick={runUpgrade}
              whileTap={{ scale: 0.96 }}
              className="w-full rounded-lg py-2.5 text-xs font-semibold"
              style={{ background: accentColor, color: bgDark }}
            >
              Simulate upgrade to v51.0
            </motion.button>
          )}

          {phase === "post" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div
                className="flex items-center justify-between rounded-lg px-3.5 py-2.5 mb-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-white/60 text-[11px]">
                  {safeCount} confirmed safe, {reviewCount} need review before cutover
                </span>
              </div>
              {!cutover ? (
                <motion.button
                  onClick={() => setCutover(true)}
                  whileTap={{ scale: 0.96 }}
                  className="w-full rounded-lg py-2.5 text-xs font-semibold"
                  style={{ background: accentColor, color: bgDark }}
                >
                  Cut over traffic to v51.0
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3 text-center"
                  style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}` }}
                >
                  <p className="text-[11px] font-semibold" style={{ color: accentColor }}>
                    Zero-downtime cutover complete. The 2 flagged items were caught before any end user saw a
                    broken dashboard.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
