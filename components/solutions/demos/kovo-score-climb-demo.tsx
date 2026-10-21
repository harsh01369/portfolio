"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type ProfileId = "no-file" | "thin-file" | "one-late";

interface Profile {
  id: ProfileId;
  label: string;
  startScore: number | null;
  startFactors: { history: number; length: number; mix: number };
  monthlyGain: number;
}

const PROFILES: Profile[] = [
  {
    id: "no-file",
    label: "No credit file",
    startScore: null,
    startFactors: { history: 0, length: 0, mix: 10 },
    monthlyGain: 11,
  },
  {
    id: "thin-file",
    label: "Thin file",
    startScore: 580,
    startFactors: { history: 40, length: 25, mix: 30 },
    monthlyGain: 8,
  },
  {
    id: "one-late",
    label: "One prior late payment",
    startScore: 558,
    startFactors: { history: 28, length: 35, mix: 30 },
    monthlyGain: 7,
  },
];

const MAX_MONTHS = 24;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function KovoScoreClimbDemo({ accentColor, bgDark }: Props) {
  const [profileId, setProfileId] = useState<ProfileId>("thin-file");
  const [month, setMonth] = useState(0);

  const profile = PROFILES.find((p) => p.id === profileId)!;

  const state = useMemo(() => {
    const base = profile.startScore ?? 300;
    const score = clamp(Math.round(base + month * profile.monthlyGain), 300, 850);
    const prevScore =
      month === 0 ? null : clamp(Math.round(base + (month - 1) * profile.monthlyGain), 300, 850);
    const history = clamp(profile.startFactors.history + month * 3.4, 0, 100);
    const length = clamp(profile.startFactors.length + month * 2.6, 0, 100);
    const mix = clamp(profile.startFactors.mix + month * 1.2, 0, 100);
    return { score, prevScore, history, length, mix };
  }, [profile, month]);

  const milestones = [
    { at: 1, label: "Credit boost unlocked", desc: "First on-time payment reports to all 4 bureaus" },
    { at: 4, label: "Cash reward unlocked", desc: "4 on-time payments trigger Kovo's cash milestone" },
  ];

  function changeProfile(id: ProfileId) {
    setProfileId(id);
    setMonth(0);
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Payment to score</p>
            <button
              onClick={() => setMonth(0)}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
            >
              Restart
            </button>
          </div>

          <div className="flex gap-1.5 mb-5">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                onClick={() => changeProfile(p.id)}
                className="relative flex-1 text-[10px] font-semibold px-2 py-1.5 rounded-lg"
                style={{
                  background: profileId === p.id ? accentColor : "rgba(255,255,255,0.05)",
                  color: profileId === p.id ? bgDark : "rgba(255,255,255,0.5)",
                  border: `1px solid ${profileId === p.id ? accentColor : "rgba(255,255,255,0.1)"}`,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/35 text-[9px] uppercase tracking-wider">Score, month {month}</p>
              <div className="flex items-baseline gap-2">
                <motion.p
                  key={state.score}
                  initial={{ opacity: 0.4, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white text-3xl font-bold tabular-nums"
                >
                  {month === 0 && profile.startScore === null ? "No score" : state.score}
                </motion.p>
                {state.prevScore !== null && state.score - state.prevScore > 0 && (
                  <motion.span
                    key={`delta-${month}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-mono tabular-nums"
                    style={{ color: accentColor }}
                  >
                    +{state.score - state.prevScore}
                  </motion.span>
                )}
              </div>
            </div>
            <button
              onClick={() => setMonth((m) => clamp(m + 1, 0, MAX_MONTHS))}
              disabled={month >= MAX_MONTHS}
              className="text-xs font-semibold px-4 py-2.5 rounded-xl disabled:opacity-30"
              style={{ background: accentColor, color: bgDark }}
            >
              Log on-time payment →
            </button>
          </div>

          {/* FICO factor breakdown */}
          <div className="space-y-2.5 mb-5">
            {[
              { label: "Payment history", value: state.history, weight: "35%" },
              { label: "Length of credit history", value: state.length, weight: "15%" },
              { label: "Credit mix", value: state.mix, weight: "10%" },
            ].map((factor) => (
              <div key={factor.label}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-white/55 text-[10px]">
                    {factor.label} <span className="text-white/25">({factor.weight} of score)</span>
                  </p>
                  <p className="text-white/50 text-[10px] font-mono tabular-nums">{Math.round(factor.value)}</p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: accentColor }}
                    animate={{ width: `${factor.value}%` }}
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div className="space-y-1.5">
            {milestones.map((m) => {
              const reached = month >= m.at;
              return (
                <div
                  key={m.at}
                  className="rounded-lg px-3 py-2 flex items-center justify-between"
                  style={{
                    background: reached ? `${accentColor}16` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${reached ? accentColor + "55" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div>
                    <p className="text-[10px] font-semibold" style={{ color: reached ? accentColor : "rgba(255,255,255,0.4)" }}>
                      Month {m.at} — {m.label}
                    </p>
                    <p className="text-white/35 text-[9px] mt-0.5">{m.desc}</p>
                  </div>
                  <AnimatePresence>
                    {reached && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0"
                        style={{ background: accentColor, color: bgDark }}
                      >
                        Unlocked
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Illustrative score model at $10/month, no credit check, over a 24-month term, built for this demo only,
            not a FICO-certified simulation or Kovo&apos;s actual bureau-reported trajectory.
          </p>
        </div>
      </div>
    </div>
  );
}
