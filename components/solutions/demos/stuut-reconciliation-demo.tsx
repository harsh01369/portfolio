"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Case = "clean" | "ambiguous";

interface ErpAInvoice {
  invoiceNo: string;
  customerId: string;
  amountDue: number;
  matched: boolean;
  confidence: number;
}

interface ErpBInvoice {
  ref: string;
  accountCode: string;
  balance: number;
  matched: boolean;
  confidence: number;
}

interface CaseData {
  amount: number;
  reference: string;
  remitter: string;
  erpA: ErpAInvoice[];
  erpB: ErpBInvoice[];
  verdict: "auto" | "escalate";
  verdictReason: string;
}

const CASES: Record<Case, CaseData> = {
  clean: {
    amount: 4210.0,
    reference: "INV-88213",
    remitter: "Falcon Logistics LLC",
    erpA: [
      { invoiceNo: "INV-88213", customerId: "CUST-4471", amountDue: 4210.0, matched: true, confidence: 99 },
      { invoiceNo: "INV-88199", customerId: "CUST-4471", amountDue: 1120.0, matched: false, confidence: 2 },
      { invoiceNo: "INV-88144", customerId: "CUST-2208", amountDue: 4210.0, matched: false, confidence: 11 },
    ],
    erpB: [
      { ref: "FL-2024-0092", accountCode: "ACC-5521", balance: 4210.0, matched: true, confidence: 94 },
      { ref: "FL-2024-0088", accountCode: "ACC-5521", balance: 980.0, matched: false, confidence: 3 },
    ],
    verdict: "auto",
    verdictReason:
      "Reference, remitter, and amount all agree on ERP A. ERP B lacks the same reference field but amount and account mapping confirm the same invoice, auto-matched on both systems.",
  },
  ambiguous: {
    amount: 1850.0,
    reference: "PYMT REF 00231",
    remitter: "Falcon Logistics LLC",
    erpA: [
      { invoiceNo: "INV-88220", customerId: "CUST-4471", amountDue: 1850.0, matched: false, confidence: 51 },
      { invoiceNo: "INV-88221", customerId: "CUST-4471", amountDue: 1850.0, matched: false, confidence: 49 },
      { invoiceNo: "INV-88199", customerId: "CUST-4471", amountDue: 1120.0, matched: false, confidence: 4 },
    ],
    erpB: [
      { ref: "FL-2024-0095", accountCode: "ACC-5521", balance: 1850.0, matched: false, confidence: 50 },
      { ref: "FL-2024-0096", accountCode: "ACC-5521", balance: 1850.0, matched: false, confidence: 48 },
    ],
    verdict: "escalate",
    verdictReason:
      "The remittance reference does not map to any open invoice number, and two open invoices from the same customer share the exact amount. Confidence splits roughly evenly, this needs a human to confirm which invoice was actually paid.",
  },
};

function Panel({
  title,
  schema,
  rows,
  accentColor,
}: {
  title: string;
  schema: string;
  rows: { primary: string; secondary: string; amount: number; matched: boolean; confidence: number }[];
  accentColor: string;
}) {
  return (
    <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <p className="text-white text-[11px] font-semibold">{title}</p>
      <p className="text-white/30 text-[9px] mb-2.5">{schema}</p>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div
            key={r.primary}
            className="rounded-md px-2 py-1.5"
            style={{
              background: r.matched ? `${accentColor}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${r.matched ? accentColor : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-white text-[10px] font-mono tabular-nums">{r.primary}</span>
              <span
                className="text-[9px] font-mono tabular-nums font-semibold"
                style={{ color: r.matched ? accentColor : "rgba(255,255,255,0.4)" }}
              >
                {r.confidence}%
              </span>
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-white/35 text-[9px]">{r.secondary}</span>
              <span className="text-white/50 text-[9px] font-mono tabular-nums">${r.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StuutReconciliationDemo({ accentColor, bgDark }: Props) {
  const [tab, setTab] = useState<Case>("clean");
  const data = CASES[tab];

  return (
    <div className="w-full max-w-xl">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Cash application trace</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["clean", "ambiguous"] as Case[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setTab(c)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: tab === c ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {tab === c && (
                    <motion.div
                      layoutId="stuut-case-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{c === "clean" ? "Clean match" : "Ambiguous match"}</span>
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <div
                className="flex items-center justify-between rounded-lg px-3.5 py-2.5 mb-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div>
                  <p className="text-white text-xs font-semibold">Incoming payment</p>
                  <p className="text-white/40 text-[10px] mt-0.5">
                    {data.remitter}, ref &ldquo;{data.reference}&rdquo;
                  </p>
                </div>
                <span className="text-sm font-mono tabular-nums font-semibold text-white">${data.amount.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <Panel
                  title="ERP A"
                  schema="invoice_no / customer_id / amount_due"
                  accentColor={accentColor}
                  rows={data.erpA.map((r) => ({
                    primary: r.invoiceNo,
                    secondary: r.customerId,
                    amount: r.amountDue,
                    matched: r.matched,
                    confidence: r.confidence,
                  }))}
                />
                <Panel
                  title="ERP B"
                  schema="ref / account_code / balance"
                  accentColor={accentColor}
                  rows={data.erpB.map((r) => ({
                    primary: r.ref,
                    secondary: r.accountCode,
                    amount: r.balance,
                    matched: r.matched,
                    confidence: r.confidence,
                  }))}
                />
              </div>

              <div
                className="rounded-lg px-3.5 py-3"
                style={{
                  background: data.verdict === "auto" ? `${accentColor}16` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${data.verdict === "auto" ? accentColor : "rgba(255,255,255,0.12)"}`,
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: data.verdict === "auto" ? accentColor : "rgba(255,255,255,0.5)" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wide"
                    style={{ color: data.verdict === "auto" ? accentColor : "rgba(255,255,255,0.6)" }}
                  >
                    {data.verdict === "auto" ? "Auto-matched" : "Escalated to a human"}
                  </p>
                </div>
                <p className="text-white/50 text-[11px] leading-relaxed">{data.verdictReason}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
