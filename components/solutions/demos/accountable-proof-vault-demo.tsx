"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "attested" | "self-reported";

interface ProofStep {
  label: string;
  detail: string;
}

interface VaultStat {
  id: string;
  label: string;
  value: string;
  subtext: string;
  proof: ProofStep[];
}

const GREY = "rgba(255,255,255,0.4)";

const STATS: VaultStat[] = [
  {
    id: "reserves",
    label: "Reserves",
    value: "$4,208,900",
    subtext: "USDC + wBTC, held across 3 custodians",
    proof: [
      { label: "Secure enclave reads custodian balance", detail: "SGX attestation quote signed, no raw API key exposed" },
      { label: "zkTLS session to custodian API", detail: "TLS transcript proven without revealing session contents" },
      { label: "Zero-knowledge proof generated", detail: "Proves balance ≥ claimed figure without disclosing ledger detail" },
      { label: "Proof committed on-chain", detail: "Verifiable by any marketplace visitor, no trust in Accountable required" },
    ],
  },
  {
    id: "collateral",
    label: "Collateral schedule",
    value: "132% ratio",
    subtext: "Overcollateralization across 4 loan tranches",
    proof: [
      { label: "Secure enclave reads tranche ledger", detail: "Raw loan-level data never leaves the enclave" },
      { label: "zkTLS session to lending platform", detail: "Captures live schedule without screenshot-style trust" },
      { label: "Zero-knowledge proof generated", detail: "Proves ratio ≥ 125% covenant without exposing individual loans" },
      { label: "Proof committed on-chain", detail: "Timestamped, independently re-verifiable" },
    ],
  },
  {
    id: "flow",
    label: "Capital flow (24h)",
    value: "+$61,400 net",
    subtext: "Inflows minus redemptions, rolling day",
    proof: [
      { label: "Secure enclave reads flow ledger", detail: "Deposit and withdrawal totals attested in isolation" },
      { label: "zkTLS session to settlement rail", detail: "Bank/rail confirmations proven, not merely reported" },
      { label: "Zero-knowledge proof generated", detail: "Proves net figure matches underlying movements" },
      { label: "Proof committed on-chain", detail: "Anyone can check the commitment against the claim" },
    ],
  },
];

export default function AccountableProofVaultDemo({ accentColor, bgDark }: Props) {
  const [modes, setModes] = useState<Record<string, Mode>>({
    reserves: "attested",
    collateral: "attested",
    flow: "self-reported",
  });
  const [expanded, setExpanded] = useState<string | null>(null);

  const attestedCount = Object.values(modes).filter((m) => m === "attested").length;

  function toggle(id: string) {
    setModes((prev) => ({ ...prev, [id]: prev[id] === "attested" ? "self-reported" : "attested" }));
    setExpanded((prev) => (prev === id ? null : prev));
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">YieldApp vault</p>
              <p className="text-white text-sm font-semibold mt-1">Meridian Yield Fund III</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-white/35">Vault trust</p>
              <p className="text-sm font-mono tabular-nums font-semibold" style={{ color: accentColor }}>
                {attestedCount}/{STATS.length} attested
              </p>
            </div>
          </div>

          <div className="h-1 rounded-full overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.08)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: accentColor }}
              animate={{ width: `${(attestedCount / STATS.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          <div className="space-y-2.5">
            {STATS.map((stat) => {
              const mode = modes[stat.id];
              const isAttested = mode === "attested";
              const isOpen = expanded === stat.id;
              return (
                <div
                  key={stat.id}
                  className="rounded-xl overflow-hidden transition-colors"
                  style={{
                    background: isAttested ? `${accentColor}12` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isAttested ? accentColor + "55" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <p className="text-white/50 text-[9px] uppercase tracking-wider">{stat.label}</p>
                        <p className="text-white text-base font-semibold tabular-nums mt-0.5">{stat.value}</p>
                      </div>
                      <button
                        onClick={() => toggle(stat.id)}
                        className="relative flex rounded-full p-0.5 shrink-0"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        {(["attested", "self-reported"] as Mode[]).map((m) => (
                          <span
                            key={m}
                            className="relative text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                            style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.45)" }}
                          >
                            {mode === m && (
                              <motion.div
                                layoutId={`mode-${stat.id}`}
                                className="absolute inset-0 rounded-full"
                                style={{ background: m === "attested" ? accentColor : GREY }}
                                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                              />
                            )}
                            <span className="relative">{m === "attested" ? "ZK" : "Self"}</span>
                          </span>
                        ))}
                      </button>
                    </div>
                    <p className="text-white/35 text-[10px] leading-relaxed mb-2">{stat.subtext}</p>

                    {isAttested ? (
                      <button
                        onClick={() => setExpanded(isOpen ? null : stat.id)}
                        className="flex items-center gap-1.5 text-[10px] font-semibold"
                        style={{ color: accentColor }}
                      >
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: accentColor }}
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                        />
                        {isOpen ? "Hide proof chain" : "View proof chain"}
                      </button>
                    ) : (
                      <p className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: GREY }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREY }} />
                        No proof trail, as submitted by the vault operator
                      </p>
                    )}
                  </div>

                  <AnimatePresence>
                    {isAttested && isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3.5 pb-3.5 space-y-1.5"
                      >
                        {stat.proof.map((step, i) => (
                          <motion.div
                            key={step.label}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-start gap-2 rounded-lg px-2.5 py-2"
                            style={{ background: "rgba(0,0,0,0.2)" }}
                          >
                            <span
                              className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                              style={{ background: accentColor, color: bgDark }}
                            >
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-white/80 text-[10px] font-medium leading-snug">{step.label}</p>
                              <p className="text-white/35 text-[9px] leading-snug mt-0.5">{step.detail}</p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Toggle any stat to compare an enclave + zkTLS attested claim against a self-reported one, the distinction
            that YieldApp&apos;s live listings don&apos;t currently surface. Illustrative vault, not a real fund.
          </p>
        </div>
      </div>
    </div>
  );
}
