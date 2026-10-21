"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Destination = "person" | "business" | "payout";
type Urgency = "standard" | "instant";

interface RailSpec {
  id: string;
  name: string;
  kind: string;
  seconds: number;
  speedLabel: string;
  costOf: (amount: number) => number;
  successRate: (destination: Destination) => number;
  supports: (destination: Destination) => boolean;
}

const RAILS: RailSpec[] = [
  {
    id: "ach",
    name: "ACH (Same-Day)",
    kind: "Bank rail",
    seconds: 18000,
    speedLabel: "~5 hrs",
    costOf: () => 0.2,
    successRate: () => 99.6,
    supports: (d) => d !== "payout",
  },
  {
    id: "rtp",
    name: "RTP",
    kind: "Bank rail, instant",
    seconds: 15,
    speedLabel: "~15 sec",
    costOf: (amount) => Math.min(amount * 0.0005, 1),
    successRate: (d) => (d === "person" ? 97 : d === "business" ? 90 : 0),
    supports: (d) => d !== "payout",
  },
  {
    id: "fednow",
    name: "FedNow",
    kind: "Bank rail, instant",
    seconds: 12,
    speedLabel: "~12 sec",
    costOf: () => 0.045,
    successRate: (d) => (d === "person" ? 94 : d === "business" ? 88 : 0),
    supports: (d) => d !== "payout",
  },
  {
    id: "visa-direct",
    name: "Visa Direct",
    kind: "Card push-to-account",
    seconds: 35,
    speedLabel: "~35 sec",
    costOf: (amount) => 0.25 + amount * 0.015,
    successRate: (d) => (d === "person" ? 98 : d === "business" ? 85 : 99),
    supports: () => true,
  },
  {
    id: "mastercard-move",
    name: "Mastercard Move",
    kind: "Card push-to-account",
    seconds: 45,
    speedLabel: "~45 sec",
    costOf: (amount) => 0.25 + amount * 0.014,
    successRate: (d) => (d === "person" ? 97 : d === "business" ? 84 : 98.5),
    supports: () => true,
  },
];

const AMOUNTS = [50, 500, 5000];
const DESTS: { id: Destination; label: string }[] = [
  { id: "person", label: "Person (P2P)" },
  { id: "business", label: "Business" },
  { id: "payout", label: "Card payout" },
];
const URGENCIES: { id: Urgency; label: string }[] = [
  { id: "standard", label: "Standard" },
  { id: "instant", label: "Instant" },
];

function scoreRail(rail: RailSpec, amount: number, destination: Destination, urgency: Urgency) {
  if (!rail.supports(destination)) return null;
  const success = rail.successRate(destination);
  if (success === 0) return null;
  const cost = rail.costOf(amount);
  const costPct = (cost / amount) * 100;
  const speedWeight = urgency === "instant" ? 0.55 : 0.2;
  const costWeight = urgency === "instant" ? 0.15 : 0.45;
  const successWeight = 1 - speedWeight - costWeight;
  const speedPenalty = Math.min(rail.seconds / 60, 500);
  const score = success * successWeight - speedPenalty * speedWeight - costPct * costWeight;
  return { success, cost, costPct, score };
}

export default function AstraRoutingDemo({ accentColor, bgDark }: Props) {
  const [amount, setAmount] = useState(500);
  const [destination, setDestination] = useState<Destination>("person");
  const [urgency, setUrgency] = useState<Urgency>("instant");
  const [failedRailId, setFailedRailId] = useState<string | null>(null);
  const [failoverLatency, setFailoverLatency] = useState<number | null>(null);

  const ranked = useMemo(() => {
    const scored = RAILS.filter((r) => r.id !== failedRailId).map((rail) => {
      const result = scoreRail(rail, amount, destination, urgency);
      return { rail, result };
    });
    return scored
      .filter((s) => s.result !== null)
      .sort((a, b) => (b.result!.score ?? -999) - (a.result!.score ?? -999));
  }, [amount, destination, urgency, failedRailId]);

  const unsupported = useMemo(
    () => RAILS.filter((r) => r.id !== failedRailId && scoreRail(r, amount, destination, urgency) === null),
    [amount, destination, urgency, failedRailId]
  );

  const winner = ranked[0];

  function triggerFailure() {
    if (!winner) return;
    setFailedRailId(winner.rail.id);
    setFailoverLatency(0.8 + Math.random() * 0.6);
  }

  function reset() {
    setFailedRailId(null);
    setFailoverLatency(null);
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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Routing decision</p>
            {failedRailId && (
              <button
                onClick={reset}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-3 mb-5">
            <div>
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1.5">Amount</p>
              <div className="flex gap-1.5">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => {
                      setAmount(a);
                      reset();
                    }}
                    className="relative flex-1 text-[11px] font-semibold px-2 py-1.5 rounded-lg"
                    style={{
                      background: amount === a ? accentColor : "rgba(255,255,255,0.05)",
                      color: amount === a ? bgDark : "rgba(255,255,255,0.5)",
                      border: `1px solid ${amount === a ? accentColor : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    ${a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1.5">Destination</p>
              <div className="flex gap-1.5">
                {DESTS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setDestination(d.id);
                      reset();
                    }}
                    className="relative flex-1 text-[10px] font-semibold px-2 py-1.5 rounded-lg"
                    style={{
                      background: destination === d.id ? accentColor : "rgba(255,255,255,0.05)",
                      color: destination === d.id ? bgDark : "rgba(255,255,255,0.5)",
                      border: `1px solid ${destination === d.id ? accentColor : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1.5">Urgency</p>
              <div
                className="flex rounded-full p-0.5 w-fit"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {URGENCIES.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setUrgency(u.id);
                      reset();
                    }}
                    className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full"
                    style={{ color: urgency === u.id ? bgDark : "rgba(255,255,255,0.55)" }}
                  >
                    {urgency === u.id && (
                      <motion.div
                        layoutId="urgency-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: accentColor }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{u.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rail ranking */}
          <div className="space-y-1.5 mb-4">
            {ranked.map(({ rail, result }, i) => {
              const isWinner = i === 0;
              const isFailed = rail.id === failedRailId;
              return (
                <motion.div
                  key={rail.id}
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  className="rounded-lg px-3 py-2.5"
                  style={{
                    background: isWinner ? `${accentColor}16` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${isWinner ? accentColor + "66" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {isWinner && (
                        <span
                          className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: accentColor, color: bgDark }}
                        >
                          Wins
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{rail.name}</p>
                        <p className="text-white/35 text-[9px]">{rail.kind}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-white/70 text-[10px] font-mono tabular-nums">{rail.speedLabel}</p>
                        <p className="text-white/35 text-[9px] font-mono tabular-nums">
                          ${result!.cost.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right w-10">
                        <p className="text-[10px] font-mono tabular-nums" style={{ color: accentColor }}>
                          {result!.success.toFixed(0)}%
                        </p>
                        <p className="text-white/30 text-[8px] uppercase">success</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {failedRailId && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg px-3 py-2 flex items-center justify-between"
                style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.3)" }}
              >
                <p className="text-[10px] font-medium" style={{ color: "#E5484D" }}>
                  {RAILS.find((r) => r.id === failedRailId)?.name} marked unavailable
                </p>
                <p className="text-[9px] font-mono tabular-nums" style={{ color: "#E5484D" }}>
                  failover in {failoverLatency?.toFixed(1)}s
                </p>
              </motion.div>
            )}

            {unsupported.map((rail) => (
              <div
                key={rail.id}
                className="rounded-lg px-3 py-2 opacity-40"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="text-white/40 text-[10px]">{rail.name} — not supported for this destination</p>
              </div>
            ))}
          </div>

          {/* Reasoning */}
          {winner && (
            <div
              className="rounded-xl p-3.5"
              style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${accentColor}33` }}
            >
              <p className="text-white/80 text-xs leading-relaxed">
                <span className="font-semibold" style={{ color: accentColor }}>
                  {winner.rail.name}
                </span>{" "}
                wins: {winner.rail.speedLabel.replace("~", "")} settlement, {winner.result!.success.toFixed(0)}%
                success for this destination, ${winner.result!.cost.toFixed(2)} on a ${amount.toLocaleString()}{" "}
                transfer. Weighted for {urgency === "instant" ? "speed first" : "cost first"}, sponsor-bank agnostic.
              </p>
              {!failedRailId && (
                <button
                  onClick={triggerFailure}
                  className="mt-3 text-[10px] font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)" }}
                >
                  Simulate {winner.rail.name} failure →
                </button>
              )}
            </div>
          )}

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Illustrative rail economics for this demo only, not Astra&apos;s live routing data or production success
            rates.
          </p>
        </div>
      </div>
    </div>
  );
}
