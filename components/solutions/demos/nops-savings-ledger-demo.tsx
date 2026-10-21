"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Decision {
  id: string;
  time: string;
  action: string;
  savingsRate: number;
  lockInRisk: number;
  invoiceLine: string;
  invoiceAmount: number;
}

const DECISIONS: Decision[] = [
  {
    id: "d1",
    time: "09:00",
    action: "Exchanged 1yr Compute Savings Plan, us-east-1 m6g family",
    savingsRate: 38,
    lockInRisk: 22,
    invoiceLine: "AWS Compute Savings Plan — exchange fee credit",
    invoiceAmount: -412.18,
  },
  {
    id: "d2",
    time: "09:15",
    action: "Purchased 3yr Reserved Instance, GCP n2-standard, prod cluster",
    savingsRate: 61,
    lockInRisk: 74,
    invoiceLine: "GCP Committed Use Discount — new 3yr term",
    invoiceAmount: 1840.55,
  },
  {
    id: "d3",
    time: "09:40",
    action: "Held off purchasing Azure Reserved VM, usage trending down 18%",
    savingsRate: 0,
    lockInRisk: 0,
    invoiceLine: "No commitment action taken",
    invoiceAmount: 0,
  },
  {
    id: "d4",
    time: "09:58",
    action: "Converted Standard to Convertible RI, AWS r6g, Databricks Lakebase job cluster",
    savingsRate: 44,
    lockInRisk: 31,
    invoiceLine: "AWS RI conversion — Lakebase compute line",
    invoiceAmount: 256.90,
  },
];

export default function NopsSavingsLedgerDemo({ accentColor, bgDark }: Props) {
  const [activeId, setActiveId] = useState(DECISIONS[0].id);
  const active = DECISIONS.find((d) => d.id === activeId) ?? DECISIONS[0];

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.12, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] mb-5">Savings attribution ledger</p>

          <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1">
            {DECISIONS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className="relative flex-shrink-0 text-[11px] font-mono tabular-nums font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{
                  color: activeId === d.id ? bgDark : "rgba(255,255,255,0.5)",
                  background: activeId === d.id ? accentColor : "rgba(255,255,255,0.06)",
                  border: `1px solid ${activeId === d.id ? accentColor : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {d.time}
              </button>
            ))}
          </div>

          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-white text-sm font-semibold mb-4 leading-snug">{active.action}</p>

            <div
              className="relative rounded-lg p-4 mb-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-3">
                Effective savings rate vs. lock-in risk
              </p>
              <div className="relative h-24 rounded-md" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }} />
                  <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }} />
                  <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)" }} />
                  <div />
                </div>
                <motion.div
                  className="absolute w-3 h-3 rounded-full -ml-1.5 -mt-1.5"
                  style={{ background: accentColor, boxShadow: `0 0 12px ${accentColor}` }}
                  animate={{
                    left: `${active.savingsRate}%`,
                    top: `${100 - active.lockInRisk}%`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
                <span className="absolute left-1.5 bottom-1 text-white/25 text-[8px] uppercase tracking-wider">
                  low savings
                </span>
                <span className="absolute right-1.5 top-1 text-white/25 text-[8px] uppercase tracking-wider">
                  high lock-in
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-[11px] font-mono tabular-nums">
                  <span className="text-white/40">Savings </span>
                  <span className="font-bold" style={{ color: accentColor }}>
                    {active.savingsRate}%
                  </span>
                </p>
                <p className="text-[11px] font-mono tabular-nums">
                  <span className="text-white/40">Lock-in </span>
                  <span className="text-white font-bold">{active.lockInRisk}%</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accentColor}66)` }} />
              <span className="text-white/30 text-[9px] uppercase tracking-wider">traces to invoice</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accentColor}66)` }} />
            </div>

            <div
              className="rounded-lg px-4 py-3 flex items-center justify-between"
              style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}40` }}
            >
              <p className="text-white text-xs font-medium leading-snug pr-3">{active.invoiceLine}</p>
              <p
                className="text-sm font-mono tabular-nums font-bold flex-shrink-0"
                style={{ color: active.invoiceAmount > 0 ? accentColor : active.invoiceAmount < 0 ? "#4ADE80" : "rgba(255,255,255,0.4)" }}
              >
                {active.invoiceAmount === 0 ? "$0.00" : `${active.invoiceAmount > 0 ? "+" : "-"}$${Math.abs(active.invoiceAmount).toFixed(2)}`}
              </p>
            </div>
          </motion.div>

          <p className="text-white/45 text-[11px] leading-relaxed mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            nOps bills as a percentage of savings generated. Every dollar of that fee traces back to one specific,
            timestamped commitment decision, not a black-box estimate.
          </p>
        </div>
      </div>
    </div>
  );
}
