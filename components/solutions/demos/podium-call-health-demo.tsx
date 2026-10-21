"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Network = "stable" | "degraded";

const STAGES = ["SIP signaling", "Media negotiation", "AI agent pickup", "Live transcription", "Booking confirmed"];

interface StackResult {
  reachedStage: number;
  failed: boolean;
  note: string;
}

const RESULTS: Record<Network, { typical: StackResult; podium: StackResult }> = {
  stable: {
    typical: { reachedStage: 4, failed: false, note: "Call completes normally." },
    podium: { reachedStage: 4, failed: false, note: "Call completes normally." },
  },
  degraded: {
    typical: {
      reachedStage: 2,
      failed: true,
      note: "Jitter spike arrives mid-pickup, audio garbles, caller hangs up before the AI Employee can respond.",
    },
    podium: {
      reachedStage: 4,
      failed: false,
      note: "Same jitter spike absorbed by adaptive buffering and SIP failover, booking completes anyway.",
    },
  },
};

export default function PodiumCallHealthDemo({ accentColor, bgDark }: Props) {
  const [network, setNetwork] = useState<Network>("stable");
  const result = RESULTS[network];

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Call health under load</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["stable", "degraded"] as Network[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setNetwork(n)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: network === n ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {network === n && (
                    <motion.div
                      layoutId="podium-network-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{n === "stable" ? "Stable network" : "Inject jitter + packet loss"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(["typical", "podium"] as const).map((stack) => {
              const r = result[stack];
              const label = stack === "typical" ? "Typical VoIP stack" : "Podium stack";
              return (
                <div
                  key={stack}
                  className="rounded-xl p-3.5"
                  style={{
                    background: stack === "podium" ? `${accentColor}0F` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${stack === "podium" ? `${accentColor}44` : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wide mb-3"
                    style={{ color: stack === "podium" ? accentColor : "rgba(255,255,255,0.45)" }}
                  >
                    {label}
                  </p>
                  <div className="space-y-2">
                    {STAGES.map((stage, i) => {
                      const done = i <= r.reachedStage;
                      const isFailurePoint = r.failed && i === r.reachedStage;
                      return (
                        <motion.div
                          key={`${network}-${stack}-${stage}`}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.3 }}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{
                              background: isFailurePoint
                                ? "#F05252"
                                : done
                                  ? stack === "podium"
                                    ? accentColor
                                    : "rgba(255,255,255,0.5)"
                                  : "rgba(255,255,255,0.15)",
                            }}
                          />
                          <span
                            className="text-[10.5px] leading-tight"
                            style={{
                              color: isFailurePoint
                                ? "#F05252"
                                : done
                                  ? "rgba(255,255,255,0.75)"
                                  : "rgba(255,255,255,0.3)",
                            }}
                          >
                            {stage}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${network}-${stack}-note`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-[10px] leading-relaxed mt-3 pt-3"
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        color: r.failed ? "#F09A9A" : "rgba(255,255,255,0.45)",
                      }}
                    >
                      {r.note}
                    </motion.p>
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
