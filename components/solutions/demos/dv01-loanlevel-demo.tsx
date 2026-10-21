"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Cohort = "all" | "nonqm";

interface Loan {
  id: string;
  state: string;
  status: "current" | "watch" | "forbearance";
}

const ALL_LOANS: Loan[] = [
  { id: "LN-88213", state: "TX", status: "current" },
  { id: "LN-88214", state: "OH", status: "current" },
  { id: "LN-88215", state: "FL", status: "current" },
  { id: "LN-88216", state: "AZ", status: "current" },
  { id: "LN-88217", state: "NC", status: "current" },
];

const NONQM_LOANS: Loan[] = [
  { id: "LN-91042", state: "TX", status: "forbearance" },
  { id: "LN-91055", state: "AZ", status: "watch" },
  { id: "LN-91061", state: "NC", status: "current" },
  { id: "LN-91073", state: "FL", status: "forbearance" },
  { id: "LN-91088", state: "OH", status: "current" },
];

const PORTFOLIO_POINTS = [2.0, 2.1, 1.9, 2.2, 2.0, 2.1];

function statusLabel(s: Loan["status"]) {
  if (s === "forbearance") return "Forbearance";
  if (s === "watch") return "30-59 DPD";
  return "Current";
}

export default function Dv01LoanLevelDemo({ accentColor, bgDark }: Props) {
  const [cohort, setCohort] = useState<Cohort>("all");
  const loans = cohort === "all" ? ALL_LOANS : NONQM_LOANS;
  const flaggedCount = loans.filter((l) => l.status !== "current").length;
  const rate = cohort === "all" ? "2.1%" : `${Math.round((flaggedCount / loans.length) * 100)}%`;

  const max = Math.max(...PORTFOLIO_POINTS);
  const min = Math.min(...PORTFOLIO_POINTS);
  const points = PORTFOLIO_POINTS.map((v, i) => {
    const x = (i / (PORTFOLIO_POINTS.length - 1)) * 100;
    const y = 30 - ((v - min) / (max - min || 1)) * 24 - 3;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="w-full max-w-xl">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(65px)" }}
        />

        <div className="relative p-7">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-5">
            Portfolio view vs loan-level view
          </p>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div
              className="rounded-lg p-3.5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">Portfolio delinquency, 30+ DPD</p>
              <p className="text-white text-xl font-bold tabular-nums mb-1">2.1%</p>
              <svg viewBox="0 0 100 30" className="w-full h-10" preserveAspectRatio="none">
                <polyline points={points} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              </svg>
              <p className="text-white/30 text-[10px] mt-1">flat, trailing 6 months, all active loans</p>
            </div>

            <div className="rounded-lg p-3.5" style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}40` }}>
              <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                {cohort === "all" ? "Same cohort, filtered" : "2023 Non-QM cohort"}
              </p>
              <p className="text-xl font-bold tabular-nums mb-1" style={{ color: cohort === "all" ? "white" : accentColor }}>
                {rate}
              </p>
              <p className="text-white/40 text-[10px]">
                {flaggedCount} of {loans.length} loans newly delinquent in this filter
              </p>
            </div>
          </div>

          <div
            className="flex rounded-full p-0.5 mb-4 w-fit"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {(["all", "nonqm"] as Cohort[]).map((c) => (
              <button
                key={c}
                onClick={() => setCohort(c)}
                className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{ color: cohort === c ? bgDark : "rgba(255,255,255,0.55)" }}
              >
                {cohort === c && (
                  <motion.div
                    layoutId="cohort-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: accentColor }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{c === "all" ? "All loans" : "2023 Non-QM cohort"}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            {loans.map((loan, i) => (
              <motion.div
                key={loan.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex items-center justify-between text-[11.5px] rounded-md px-3 py-2"
                style={{
                  background: loan.status !== "current" ? `${accentColor}14` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${loan.status !== "current" ? accentColor + "55" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <span className="text-white/60 font-mono tabular-nums">{loan.id}</span>
                <span className="text-white/35">{loan.state}</span>
                <span
                  className="font-semibold"
                  style={{ color: loan.status !== "current" ? accentColor : "rgba(255,255,255,0.4)" }}
                >
                  {statusLabel(loan.status)}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="text-white/30 text-[10.5px] leading-relaxed mt-5">
            Same portfolio, same month. The aggregate chart stays flat, filtering to the loan level surfaces a real
            cluster moving into forbearance underneath it.
          </p>
        </div>
      </div>
    </div>
  );
}
