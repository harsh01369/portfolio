"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Tenant = "aetna" | "planb";
type ProbeState = "idle" | "crossing" | "blocked";

const STAGES = ["Ingestion", "NLP extraction", "Model scoring", "Output"];

export default function OnosTenantIsolationDemo({ accentColor, bgDark }: Props) {
  const [tenant, setTenant] = useState<Tenant>("aetna");
  const [runKey, setRunKey] = useState(0);
  const [activeStage, setActiveStage] = useState(-1);
  const [probeState, setProbeState] = useState<ProbeState>("idle");

  function runNote() {
    setProbeState("idle");
    setRunKey((k) => k + 1);
    setActiveStage(0);
    STAGES.forEach((_, i) => {
      window.setTimeout(() => setActiveStage(i), i * 380);
    });
  }

  function attemptCrossTenant() {
    setProbeState("crossing");
    window.setTimeout(() => setProbeState("blocked"), 650);
  }

  const otherTenant: Tenant = tenant === "aetna" ? "planb" : "aetna";
  const tenantLabel = (t: Tenant) => (t === "aetna" ? "Aetna" : "Plan B");

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Tenant isolation visualizer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["aetna", "planb"] as Tenant[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTenant(t)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: tenant === t ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {tenant === t && (
                    <motion.div
                      layoutId="onos-tenant-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{tenantLabel(t)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {([tenant, otherTenant] as Tenant[]).map((laneTenant) => {
              const isActive = laneTenant === tenant;
              return (
                <div
                  key={laneTenant}
                  className="relative rounded-xl p-3"
                  style={{
                    background: isActive ? `${accentColor}10` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? `${accentColor}55` : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: isActive ? accentColor : "rgba(255,255,255,0.35)" }}
                    >
                      {tenantLabel(laneTenant)} partition
                    </span>
                    {isActive && (
                      <span className="text-white/30 text-[9px] font-mono tabular-nums">plan_id: {laneTenant}</span>
                    )}
                  </div>
                  <div className="relative flex items-center justify-between px-1">
                    <div
                      className="absolute left-3 right-3 top-1/2 h-px -translate-y-1/2"
                      style={{ background: "rgba(255,255,255,0.1)" }}
                    />
                    {STAGES.map((stage, i) => {
                      const reached = isActive && activeStage >= i;
                      return (
                        <div
                          key={`${runKey}-${laneTenant}-${stage}`}
                          className="relative z-10 flex flex-col items-center gap-1.5 flex-1"
                        >
                          <motion.div
                            animate={{
                              scale: isActive && activeStage === i ? 1.15 : 1,
                              background: reached ? accentColor : "rgba(255,255,255,0.08)",
                              borderColor: reached ? accentColor : "rgba(255,255,255,0.15)",
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="w-5 h-5 rounded-full border"
                          />
                          <span
                            className="text-[7.5px] text-center leading-tight max-w-[52px]"
                            style={{ color: reached ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.28)" }}
                          >
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={runNote}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Run clinical note
            </button>
            <button
              onClick={attemptCrossTenant}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Attempt cross-tenant read
            </button>
          </div>

          <div className="min-h-[58px]">
            <AnimatePresence mode="wait">
              {probeState === "crossing" && (
                <motion.p
                  key="crossing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/40 text-[11px] text-center pt-4"
                >
                  Probing boundary from {tenantLabel(tenant)}, reading toward {tenantLabel(otherTenant)}...
                </motion.p>
              )}
              {probeState === "blocked" && (
                <motion.div
                  key="blocked"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.4)" }}
                >
                  <p className="text-white text-xs font-semibold mb-1">Blocked: plan boundary enforced</p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {tenantLabel(tenant)} viewer attempted to read {tenantLabel(otherTenant)} records. The row-level
                    tenant tag attached at ingestion did not match the requesting plan_id, the query was rejected
                    before it reached storage.
                  </p>
                </motion.div>
              )}
              {probeState === "idle" && activeStage === STAGES.length - 1 && (
                <motion.div
                  key="clean"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1 font-mono tabular-nums">
                    Boundary checks passed: 4/4
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    The note stayed tagged to {tenantLabel(tenant)} through every stage, no field it produced is
                    readable by {tenantLabel(otherTenant)}&apos;s models or dashboards.
                  </p>
                </motion.div>
              )}
              {probeState === "idle" && activeStage !== STAGES.length - 1 && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  Run a note through one plan&apos;s pipeline, then try reading across the boundary from the other.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
