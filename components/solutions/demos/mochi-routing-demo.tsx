"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Drug = "semaglutide" | "tirzepatide";
type Status = "pending" | "checking" | "rejected" | "routed";

interface PharmacyResult {
  id: string;
  name: string;
  detail: string;
  reason: string;
  outcome: "out-of-stock" | "too-slow" | "routed";
}

const ORDERS: Record<Drug, { label: string; dose: string; pharmacies: PharmacyResult[] }> = {
  semaglutide: {
    label: "Semaglutide",
    dose: "1mg weekly, new prescription",
    pharmacies: [
      { id: "a", name: "Village Compounding Co", detail: "Pharmacy A", reason: "Out of stock, last restock 9 days ago", outcome: "out-of-stock" },
      { id: "b", name: "MedFlow Central", detail: "Pharmacy B", reason: "In stock, 14-day fulfillment lead time", outcome: "too-slow" },
      { id: "c", name: "QuickScript Pharmacy", detail: "Pharmacy C", reason: "In stock, 2-day fulfillment, $412 cash price", outcome: "routed" },
    ],
  },
  tirzepatide: {
    label: "Tirzepatide",
    dose: "5mg weekly, refill, 2nd pharmacy switch",
    pharmacies: [
      { id: "a", name: "Harbor Point Pharmacy", detail: "Pharmacy A", reason: "In stock, 5-day lead time, $560 cash price", outcome: "too-slow" },
      { id: "b", name: "MedFlow Central", detail: "Pharmacy B", reason: "Out of stock, backordered 3 weeks", outcome: "out-of-stock" },
      { id: "c", name: "QuickScript Pharmacy", detail: "Pharmacy C", reason: "In stock, 3-day fulfillment, $498 cash price", outcome: "routed" },
    ],
  },
};

const CRITERIA = ["Stock on hand", "Fulfillment lead time", "Cash price", "Prior fill history"];

export default function MochiRoutingDemo({ accentColor, bgDark }: Props) {
  const [drug, setDrug] = useState<Drug>("semaglutide");
  const [step, setStep] = useState(0);

  const order = ORDERS[drug];

  useEffect(() => {
    setStep(0);
    const timer = setInterval(() => {
      setStep((s) => (s < order.pharmacies.length * 2 ? s + 1 : s));
    }, 500);
    return () => clearInterval(timer);
  }, [drug, order.pharmacies.length]);

  const statusFor = (index: number): Status => {
    const checkingAt = index * 2;
    const resolvedAt = index * 2 + 1;
    if (step <= checkingAt) return "pending";
    if (step === resolvedAt) return "checking";
    const outcome = order.pharmacies[index].outcome;
    return outcome === "routed" ? "routed" : "rejected";
  };

  const done = step >= order.pharmacies.length * 2;
  const routedPharmacy = order.pharmacies.find((p) => p.outcome === "routed");

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Pharmacy routing trace</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["semaglutide", "tirzepatide"] as Drug[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDrug(d)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: drug === d ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {drug === d && (
                    <motion.div
                      layoutId="mochi-drug-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{ORDERS[d].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg px-3.5 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white text-xs font-semibold">Order entering marketplace</p>
            <p className="text-white/40 text-[10px] mt-0.5">{order.label}, {order.dose}</p>
          </div>

          <div className="space-y-2 min-h-[190px]">
            {order.pharmacies.map((p, i) => {
              const status = statusFor(i);
              const bg =
                status === "routed" ? `${accentColor}18` : status === "rejected" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.03)";
              const border =
                status === "routed" ? accentColor : status === "rejected" ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.08)";
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: status === "pending" ? 0.35 : 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between gap-3 rounded-lg px-3.5 py-2.5"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold">
                      {p.detail}. {p.name}
                    </p>
                    <AnimatePresence mode="wait">
                      {status === "checking" ? (
                        <motion.p key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/35 text-[10px] mt-0.5">
                          Checking stock and lead time...
                        </motion.p>
                      ) : status !== "pending" ? (
                        <motion.p key="resolved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 text-[10px] mt-0.5 leading-snug">
                          {p.reason}
                        </motion.p>
                      ) : (
                        <p className="text-white/25 text-[10px] mt-0.5">Awaiting check</p>
                      )}
                    </AnimatePresence>
                  </div>
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wide shrink-0 px-2 py-1 rounded-full"
                    style={{
                      color: status === "routed" ? accentColor : status === "rejected" ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.3)",
                      background: status === "routed" ? `${accentColor}22` : "transparent",
                    }}
                  >
                    {status === "pending" ? "Queued" : status === "checking" ? "Checking" : status === "routed" ? "Routed" : "Skipped"}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-4 mb-3">
            {CRITERIA.map((c) => (
              <span
                key={c}
                className="text-[9px] uppercase tracking-wide px-2 py-1 rounded-full text-white/35"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {c}
              </span>
            ))}
          </div>

          <AnimatePresence>
            {done && routedPharmacy && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg px-3.5 py-3"
                style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}` }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: accentColor }}>
                  Switched mid-treatment, zero manual intervention
                </p>
                <p className="text-white/50 text-[11px] leading-relaxed">
                  Routed to {routedPharmacy.name} on stock, lead time, and price, the same comparison a patient would have had to make by phone across three separate calls.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
