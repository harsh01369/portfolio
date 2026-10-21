"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Scenario = "vpn" | "hr";

interface ScenarioConfig {
  channel: string;
  requester: string;
  userMessage: string;
  confidence: number;
  source: string;
  outcome: "auto-answer" | "silent-escalation";
  channelReply: string;
  escalation?: {
    team: string;
    owner: string;
    suppressedGuess: string;
  };
}

const SCENARIOS: Record<Scenario, ScenarioConfig> = {
  vpn: {
    channel: "#it-help",
    requester: "jordan.m",
    userMessage: "hey can someone reset my VPN access, keeps timing out on connect",
    confidence: 97,
    source: "source: Notion, IT Runbook: VPN Access Reset",
    outcome: "auto-answer",
    channelReply:
      "Cleared the lockout on your account, this happens after 2 failed MFA attempts. You're good to reconnect now.",
  },
  hr: {
    channel: "#it-help",
    requester: "jordan.m",
    userMessage: "my manager keeps making comments about my pregnancy that don't feel okay, not sure what to do",
    confidence: 31,
    source: "no source cleared to answer this",
    outcome: "silent-escalation",
    channelReply: "Thanks for flagging this, looping in the right team now.",
    escalation: {
      team: "HR, Employee Relations",
      owner: "Priya N.",
      suppressedGuess: "possible discrimination or harassment, high sensitivity, do not auto-respond",
    },
  },
};

export default function RavennaEscalationDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<Scenario>("vpn");
  const cfg = SCENARIOS[scenario];

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Incoming request</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["vpn", "hr"] as Scenario[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setScenario(s)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: scenario === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {scenario === s && (
                    <motion.div
                      layoutId="scenario-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s === "vpn" ? "IT request" : "HR issue"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={scenario}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className="rounded-lg p-3 mb-4"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-5 h-5 rounded" style={{ background: "rgba(255,255,255,0.12)" }} />
                    <p className="text-white/70 text-[11px] font-semibold">{cfg.requester}</p>
                    <p className="text-white/25 text-[10px]">{cfg.channel}</p>
                  </div>
                  <p className="text-white/75 text-[12.5px] leading-relaxed">{cfg.userMessage}</p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="mb-4"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-white/40 text-[10px] uppercase tracking-wider">Ravenna confidence</p>
                    <p
                      className="text-sm font-bold tabular-nums"
                      style={{ color: cfg.outcome === "auto-answer" ? accentColor : "rgba(255,255,255,0.55)" }}
                    >
                      {cfg.confidence}%
                    </p>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: cfg.outcome === "auto-answer" ? accentColor : "rgba(255,255,255,0.3)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${cfg.confidence}%` }}
                      transition={{ type: "spring", stiffness: 180, damping: 26, delay: 0.25 }}
                    />
                  </div>
                  <p className="text-white/35 text-[10.5px] mt-1.5 font-mono">{cfg.source}</p>
                </motion.div>

                {cfg.outcome === "auto-answer" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="rounded-lg p-3"
                    style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                        Auto-answered, posted in {cfg.channel}
                      </p>
                    </div>
                    <p className="text-white/80 text-[12.5px] leading-relaxed">Ravenna: {cfg.channelReply}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    className="space-y-2.5"
                  >
                    <div
                      className="rounded-lg p-3"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">visible in {cfg.channel}</p>
                      <p className="text-white/80 text-[12.5px] leading-relaxed">Ravenna: {cfg.channelReply}</p>
                    </div>
                    <div
                      className="rounded-lg p-3"
                      style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                          escalated privately, not posted
                        </p>
                      </div>
                      <p className="text-white/70 text-[12px] mb-1">
                        Routed to {cfg.escalation?.team}, {cfg.escalation?.owner}
                      </p>
                      <p className="text-white/35 text-[10.5px] font-mono line-through">
                        internal guess, never sent: &quot;{cfg.escalation?.suppressedGuess}&quot;
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-white/30 text-[10.5px] leading-relaxed mt-5">
            {cfg.outcome === "auto-answer"
              ? "High confidence, source cited, safe to resolve in-channel."
              : "Low confidence or sensitive topic, Ravenna never shows its own guess, it hands off quietly instead."}
          </p>
        </div>
      </div>
    </div>
  );
}
