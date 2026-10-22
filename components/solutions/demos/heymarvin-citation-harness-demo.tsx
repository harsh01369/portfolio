"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type ScenarioId = "clean" | "injected";

interface CorpusItem {
  id: string;
  source: string;
  text: string;
}

interface Claim {
  text: string;
  citedId: string;
  verified: boolean;
}

const CORPUS: CorpusItem[] = [
  {
    id: "c1",
    source: "Call #482, enterprise churn interview",
    text: "We canceled mainly because the Slack integration kept losing thread context after the March update.",
  },
  {
    id: "c2",
    source: "Survey response, NPS detractor",
    text: "Support took four days to respond to a billing dispute, that's why I'm leaving.",
  },
  {
    id: "c3",
    source: "Call #501, mid-market renewal",
    text: "Honestly the dashboard loads fast now, the April perf fix helped a lot.",
  },
  {
    id: "c4",
    source: "Intercom transcript #1190",
    text: "Our team never uses the mobile app, everything happens on desktop during work hours.",
  },
  {
    id: "c5",
    source: "Call #517, expansion conversation",
    text: "We'd pay more for SSO if it shipped before our security review in June.",
  },
];

const SCENARIOS: Record<ScenarioId, { label: string; claims: Claim[] }> = {
  clean: {
    label: "Clean run",
    claims: [
      { text: "Enterprise churn was driven by Slack thread context breaking after a recent update.", citedId: "c1", verified: true },
      { text: "A detractor cited a four-day wait on a billing dispute as their reason for leaving.", citedId: "c2", verified: true },
      { text: "A mid-market renewal contact said dashboard load times improved after the April fix.", citedId: "c3", verified: true },
      { text: "One account said SSO would need to ship before their June security review to justify a higher tier.", citedId: "c5", verified: true },
    ],
  },
  injected: {
    label: "Injected claim",
    claims: [
      { text: "Enterprise churn was driven by Slack thread context breaking after a recent update.", citedId: "c1", verified: true },
      { text: "A detractor cited a four-day wait on a billing dispute as their reason for leaving.", citedId: "c2", verified: true },
      { text: "Most customers say the mobile app is their primary way of using the product during work hours.", citedId: "c4", verified: false },
      { text: "One account said SSO would need to ship before their June security review to justify a higher tier.", citedId: "c5", verified: true },
    ],
  },
};

export default function HeyMarvinCitationHarnessDemo({ accentColor, bgDark }: Props) {
  const [scenario, setScenario] = useState<ScenarioId>("clean");
  const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
  const [revealed, setRevealed] = useState(0);

  const claims = SCENARIOS[scenario].claims;

  useEffect(() => {
    if (status !== "running") return;
    if (revealed >= claims.length) {
      setStatus("done");
      return;
    }
    const t = setTimeout(() => setRevealed((r) => r + 1), 600);
    return () => clearTimeout(t);
  }, [status, revealed, claims.length]);

  function runHarness() {
    setRevealed(0);
    setStatus("running");
  }

  function reset() {
    setRevealed(0);
    setStatus("idle");
  }

  function switchScenario(s: ScenarioId) {
    setScenario(s);
    setRevealed(0);
    setStatus("idle");
  }

  const verifiedCount = claims.slice(0, revealed).filter((c) => c.verified).length;
  const flaggedCount = claims.slice(0, revealed).filter((c) => !c.verified).length;
  const allHaveFailure = claims.some((c) => !c.verified);
  const passed = status === "done" && flaggedCount === 0;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Citation integrity harness</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["clean", "injected"] as ScenarioId[]).map((s) => (
                <button
                  key={s}
                  onClick={() => switchScenario(s)}
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
                  <span className="relative">{SCENARIOS[s].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1">Ask-AI question</p>
            <p className="text-white/75 text-xs leading-relaxed">
              Why are enterprise customers churning, and what would get them to upgrade?
            </p>
          </div>

          <div className="space-y-2 mb-4 min-h-[220px]">
            {claims.map((claim, i) => {
              const isRevealed = i < revealed || status === "done";
              const source = CORPUS.find((c) => c.id === claim.citedId);
              return (
                <motion.div
                  key={`${scenario}-${i}`}
                  layout
                  className="rounded-lg px-3 py-2.5"
                  style={{
                    background: !isRevealed
                      ? "rgba(255,255,255,0.03)"
                      : claim.verified
                      ? "rgba(16,185,129,0.08)"
                      : "rgba(229,72,77,0.08)",
                    border: `1px solid ${
                      !isRevealed ? "rgba(255,255,255,0.08)" : claim.verified ? "#1E9E6B55" : "#E5484D55"
                    }`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-white/80 text-xs leading-relaxed flex-1">{claim.text}</p>
                    <AnimatePresence mode="wait">
                      {!isRevealed ? (
                        <motion.span
                          key="pending"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: status === "running" && i === revealed ? 1 : 0.25 }}
                          className="text-[9px] uppercase tracking-wider shrink-0 font-mono"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          {status === "running" && i === revealed ? "scanning…" : "queued"}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="result"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                          style={{
                            background: claim.verified ? "#1E9E6B" : "#E5484D",
                            color: "#fff",
                          }}
                        >
                          {claim.verified ? "Verified" : "Unsupported"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  {isRevealed && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-white/35 text-[10px] mt-1.5 leading-relaxed"
                    >
                      {claim.verified ? "Matches " : "Traced to "}
                      <span className="text-white/50">{source?.source}</span>
                      {!claim.verified && (
                        <span className="block mt-0.5 text-white/40 italic">
                          Source actually says: &ldquo;{source?.text}&rdquo;
                        </span>
                      )}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {status !== "done" ? (
              <motion.button
                key="run"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={runHarness}
                disabled={status === "running"}
                className="w-full text-[11px] font-semibold px-3 py-2.5 rounded-lg"
                style={{
                  background: status === "running" ? "rgba(255,255,255,0.06)" : accentColor,
                  color: status === "running" ? "rgba(255,255,255,0.4)" : bgDark,
                }}
              >
                {status === "running" ? `Walking claim ${revealed + 1} of ${claims.length}…` : "Run harness →"}
              </motion.button>
            ) : (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl p-3.5"
                style={{
                  background: passed ? "rgba(30,158,107,0.08)" : "rgba(229,72,77,0.08)",
                  border: `1px solid ${passed ? "#1E9E6B55" : "#E5484D55"}`,
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-bold" style={{ color: passed ? "#1E9E6B" : "#E5484D" }}>
                    {passed ? "QA PASS" : "QA FAIL"}
                  </p>
                  <p className="text-white/60 text-[10px] font-mono tabular-nums">
                    {verifiedCount}/{claims.length} verified
                  </p>
                </div>
                <p className="text-white/55 text-[11px] leading-relaxed">
                  {passed
                    ? "Every claim in this answer traces cleanly back to a corpus snippet. Safe to ship to the research doc."
                    : `${flaggedCount} claim${flaggedCount > 1 ? "s" : ""} cited a real transcript but asserted something that transcript doesn't support. Held back from the research doc.`}
                </p>
                <button
                  onClick={reset}
                  className="mt-3 text-[10px] font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)" }}
                >
                  Run again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Fixed sample transcript corpus and a scripted Ask-AI answer, built for this demo only, not Marvin&apos;s
            live agent output.
          </p>
        </div>
      </div>
    </div>
  );
}
