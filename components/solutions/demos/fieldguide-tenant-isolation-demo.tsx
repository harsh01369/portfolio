"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type IsolationMode = "enforced" | "unpatched";

const TENANT_A = {
  name: "Audit Firm Alpha",
  agent: "Field Orchestrator, Alpha",
  evidence: ["Client ledger Q3.xlsx", "Bank confirmation letter", "Related-party disclosures"],
};

const TENANT_B = {
  name: "Audit Firm Beta",
  agent: "Field Orchestrator, Beta",
  evidence: ["Inventory count sheet", "Revenue recognition memo", "Signed management rep letter"],
};

export default function FieldguideTenantIsolationDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<IsolationMode>("enforced");
  const [phase, setPhase] = useState<"idle" | "attempting" | "resolved">("idle");

  const breached = mode === "unpatched";

  function attempt() {
    setPhase("attempting");
    setTimeout(() => setPhase("resolved"), 900);
  }

  function reset() {
    setPhase("idle");
  }

  function switchMode(m: IsolationMode) {
    setMode(m);
    setPhase("idle");
  }

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
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Tenant isolation prover</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["enforced", "unpatched"] as IsolationMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="isolation-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: m === "enforced" ? accentColor : "#E5484D" }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "enforced" ? "Isolation enforced" : "Unpatched build"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3 mb-4">
            {/* Tenant A */}
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white text-xs font-semibold">{TENANT_A.name}</p>
              <p className="text-white/35 text-[9px] mb-2 font-mono">{TENANT_A.agent}</p>
              <div className="space-y-1 mb-2">
                {TENANT_A.evidence.map((e) => (
                  <p key={e} className="text-white/55 text-[10px] truncate">
                    • {e}
                  </p>
                ))}
              </div>
              <div
                className="rounded-md px-2 py-1.5 mt-2 min-h-[38px]"
                style={{ background: "rgba(0,0,0,0.3)" }}
              >
                <p className="text-white/30 text-[8px] uppercase tracking-wider mb-0.5">Agent log</p>
                <AnimatePresence mode="wait">
                  {phase === "idle" && (
                    <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/40 text-[9px] font-mono">
                      idle, awaiting evidence request
                    </motion.p>
                  )}
                  {phase === "attempting" && (
                    <motion.p
                      key="att"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[9px] font-mono"
                      style={{ color: accentColor }}
                    >
                      SELECT * FROM tenant_beta.vault…
                    </motion.p>
                  )}
                  {phase === "resolved" && (
                    <motion.p
                      key="res"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[9px] font-mono leading-relaxed"
                      style={{ color: breached ? "#F2994A" : "#E5484D" }}
                    >
                      {breached
                        ? `200, tenant_beta/${TENANT_B.evidence[1].toLowerCase().replace(/ /g, "_")} returned`
                        : "403, tenant_boundary_violation, request denied"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Tenant B */}
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white text-xs font-semibold">{TENANT_B.name}</p>
              <p className="text-white/35 text-[9px] mb-2 font-mono">{TENANT_B.agent}</p>
              <div className="space-y-1 mb-2">
                {TENANT_B.evidence.map((e) => {
                  const isLeaked = phase === "resolved" && breached && e === TENANT_B.evidence[1];
                  return (
                    <p
                      key={e}
                      className="text-[10px] truncate"
                      style={{ color: isLeaked ? "#F2994A" : "rgba(255,255,255,0.55)" }}
                    >
                      • {e}
                      {isLeaked && <span className="ml-1 text-[8px] uppercase font-bold">accessed</span>}
                    </p>
                  );
                })}
              </div>
              <div className="rounded-md px-2 py-1.5 mt-2 min-h-[38px]" style={{ background: "rgba(0,0,0,0.3)" }}>
                <p className="text-white/30 text-[8px] uppercase tracking-wider mb-0.5">Vault status</p>
                <p
                  className="text-[9px] font-mono"
                  style={{ color: phase === "resolved" && breached ? "#F2994A" : "rgba(255,255,255,0.4)" }}
                >
                  {phase === "resolved" && breached ? "foreign tenant read evidence.pdf" : "sealed, no foreign reads"}
                </p>
              </div>
            </div>

            {/* boundary line */}
            <div className="absolute left-1/2 top-9 bottom-24 -translate-x-1/2 flex items-center justify-center pointer-events-none">
              <motion.div
                className="w-px h-full"
                style={{
                  background: breached && phase === "resolved" ? "transparent" : "rgba(255,255,255,0.12)",
                  backgroundImage:
                    breached && phase === "resolved"
                      ? "none"
                      : `repeating-linear-gradient(to bottom, ${accentColor}88 0 6px, transparent 6px 12px)`,
                }}
              />
              <AnimatePresence>
                {phase === "attempting" && (
                  <motion.div
                    key="chip"
                    initial={{ x: -70, opacity: 0 }}
                    animate={{ x: breached ? 70 : 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.85, ease: "easeInOut" }}
                    className="absolute text-[8px] font-mono px-2 py-1 rounded whitespace-nowrap"
                    style={{ background: bgDark, border: `1px solid ${accentColor}`, color: accentColor }}
                  >
                    evidence_req
                  </motion.div>
                )}
              </AnimatePresence>
              {phase === "resolved" && (
                <span
                  className="absolute text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    background: breached ? "#F2994A" : "#1E9E6B",
                    color: bgDark,
                  }}
                >
                  {breached ? "Breached" : "Held"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {phase !== "resolved" ? (
              <button
                onClick={attempt}
                disabled={phase === "attempting"}
                className="flex-1 text-[11px] font-semibold px-3 py-2.5 rounded-lg"
                style={{
                  background: phase === "attempting" ? "rgba(255,255,255,0.06)" : accentColor,
                  color: phase === "attempting" ? "rgba(255,255,255,0.4)" : bgDark,
                }}
              >
                {phase === "attempting" ? "Attempting cross-tenant read…" : "Attempt cross-tenant read →"}
              </button>
            ) : (
              <button
                onClick={reset}
                className="flex-1 text-[11px] font-semibold px-3 py-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
              >
                Reset
              </button>
            )}
          </div>

          {phase === "resolved" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/55 text-[11px] leading-relaxed mt-3">
              {breached
                ? "Without the tenant boundary check, Alpha's agent happily read Beta's evidence vault because both ran on the same shared orchestrator process. Two competing audit firms, one leaked client file."
                : "Alpha's agent request carries a tenant claim the orchestrator checks on every evidence read, not just at login. The cross-tenant query never reaches Beta's vault."}
            </motion.p>
          )}

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Simulated tenants and evidence for this demo only, not a real Fieldguide engagement or customer data.
          </p>
        </div>
      </div>
    </div>
  );
}
