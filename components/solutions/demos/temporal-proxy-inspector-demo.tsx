"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "self-hosted" | "cloud";

interface Hop {
  label: string;
  namespace: string;
  payload: string;
  note: string;
}

const SELF_HOSTED_HOPS: Hop[] = [
  { label: "Local Worker", namespace: "default", payload: '{"orderId":"8841","action":"ChargeCard"}', note: "plaintext, same cluster" },
  { label: "Self-hosted Server", namespace: "default", payload: '{"orderId":"8841","action":"ChargeCard"}', note: "no proxy hop, no re-encryption" },
];

const CLOUD_HOPS: Hop[] = [
  { label: "Local Worker", namespace: "default", payload: '{"orderId":"8841","action":"ChargeCard"}', note: "unchanged application code" },
  {
    label: "Temporal Proxy",
    namespace: "prod.a2k9x.tmprl.cloud",
    payload: "U2FsdGVkX1+3J9kzre8Qn0f2Lp9Xh==",
    note: "namespace rewritten, TLS terminated and re-established, payload encrypted",
  },
  { label: "Temporal Cloud", namespace: "prod.a2k9x.tmprl.cloud", payload: "U2FsdGVkX1+3J9kzre8Qn0f2Lp9Xh==", note: "workflow task dispatched" },
];

export default function TemporalProxyInspectorDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("cloud");
  const [runKey, setRunKey] = useState(0);
  const [activeHop, setActiveHop] = useState(-1);

  const hops = mode === "cloud" ? CLOUD_HOPS : SELF_HOSTED_HOPS;

  function startCall() {
    setRunKey((k) => k + 1);
    setActiveHop(-1);
    hops.forEach((_, i) => {
      window.setTimeout(() => setActiveHop(i), i * 650);
    });
  }

  const isDone = activeHop === hops.length - 1;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Workflow call path</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["self-hosted", "cloud"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m);
                    setActiveHop(-1);
                  }}
                  className="relative text-[10.5px] font-semibold px-2.5 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="temporal-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "self-hosted" ? "Self-hosted only" : "Self-hosted + Cloud"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start justify-between mb-5 gap-2">
            {hops.map((hop, i) => {
              const reached = activeHop >= i;
              return (
                <div key={`${runKey}-${hop.label}`} className="flex items-center flex-1 last:flex-none">
                  <motion.div
                    initial={{ opacity: 0.4, scale: 0.92 }}
                    animate={{ opacity: reached ? 1 : 0.4, scale: activeHop === i ? 1.05 : 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    className="rounded-lg px-2.5 py-2.5 shrink-0"
                    style={{
                      background: reached ? `${accentColor}18` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${reached ? accentColor : "rgba(255,255,255,0.1)"}`,
                      width: 108,
                    }}
                  >
                    <p className="text-[9.5px] font-semibold text-white leading-tight mb-1">{hop.label}</p>
                    <p className="text-[8px] font-mono leading-tight break-all" style={{ color: reached ? accentColor : "rgba(255,255,255,0.3)" }}>
                      {hop.namespace}
                    </p>
                  </motion.div>
                  {i < hops.length - 1 && (
                    <div className="flex-1 h-px relative mx-1" style={{ background: "rgba(255,255,255,0.12)" }}>
                      {activeHop >= i && (
                        <motion.div
                          key={`${runKey}-${i}`}
                          className="absolute top-1/2 w-1.5 h-1.5 rounded-full -translate-y-1/2"
                          style={{ background: accentColor }}
                          initial={{ left: "0%" }}
                          animate={{ left: "95%" }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mb-5">
            <button
              onClick={startCall}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Start workflow call
            </button>
          </div>

          <div className="min-h-[110px]">
            <AnimatePresence mode="wait">
              {activeHop < 0 && (
                <motion.p
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white/30 text-[11px] text-center pt-6"
                >
                  Start a call to watch the payload move hop by hop.
                </motion.p>
              )}
              {activeHop >= 0 && (
                <motion.div key={`${runKey}-${activeHop}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <div
                    className="rounded-lg px-3 py-2.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p className="text-white/30 text-[9px] uppercase tracking-wider mb-1">{hops[activeHop].label}, payload on the wire</p>
                    <p className="text-white/75 text-[10.5px] font-mono break-all">{hops[activeHop].payload}</p>
                  </div>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">{hops[activeHop].note}</p>
                  {isDone && (
                    <p className="text-white/30 text-[10px] leading-relaxed pt-1 border-t border-white/5 mt-2">
                      {mode === "cloud"
                        ? "Zero application code changes: the Worker's code above is identical in self-hosted mode, only the connection target and the Proxy's config differ."
                        : "No namespace rewrite, no TLS re-establishment needed, the Worker talks straight to its own cluster."}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
