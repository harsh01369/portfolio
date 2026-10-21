"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

const NODES = [
  { label: "Primary DB", region: "us-east" },
  { label: "Read replica", region: "us-west" },
  { label: "Derived / cache copy", region: "edge-cache" },
  { label: "Backup snapshot", region: "cold-storage" },
];

function fakeHash(seed: number) {
  const chars = "0123456789abcdef";
  let out = "";
  let s = seed;
  for (let i = 0; i < 40; i++) {
    s = (s * 9301 + 49297) % 233280;
    out += chars[Math.floor((s / 233280) * 16)];
  }
  return out;
}

export default function NametagDeletionAttestationDemo({ accentColor, bgDark }: Props) {
  const [runKey, setRunKey] = useState(0);
  const [sweptCount, setSweptCount] = useState(0);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [certified, setCertified] = useState(false);

  function triggerDeletion() {
    setRunKey((k) => k + 1);
    setSweptCount(0);
    setCertified(false);
    const stamps: string[] = [];
    const base = Date.now();
    NODES.forEach((_, i) => {
      window.setTimeout(() => {
        stamps[i] = new Date(base + i * 180).toISOString().slice(11, 23);
        setTimestamps([...stamps]);
        setSweptCount(i + 1);
        if (i === NODES.length - 1) {
          window.setTimeout(() => setCertified(true), 300);
        }
      }, i * 480 + 200);
    });
  }

  const certHash = fakeHash(runKey + 7);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Deletion attestation console</p>
            <button
              onClick={triggerDeletion}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Trigger sample deletion
            </button>
          </div>

          <p className="text-white/35 text-[9px] uppercase tracking-wider mb-2">Record biometric_tmpl_8841</p>

          <div className="space-y-2 mb-5">
            {NODES.map((node, i) => {
              const swept = sweptCount > i;
              const sweeping = sweptCount === i;
              return (
                <motion.div
                  key={`${runKey}-${node.label}`}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
                  style={{
                    background: swept ? `${accentColor}12` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${swept ? accentColor + "55" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <motion.div
                      animate={{
                        scale: sweeping ? [1, 1.25, 1] : 1,
                        background: swept ? accentColor : "rgba(255,255,255,0.08)",
                      }}
                      transition={sweeping ? { duration: 0.9, repeat: Infinity } : { duration: 0.25 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    >
                      {swept ? (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13l4 4L19 7" stroke={bgDark} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className="text-[8px] text-white/40 font-bold">{i + 1}</span>
                      )}
                    </motion.div>
                    <div>
                      <p className="text-white text-xs font-medium">{node.label}</p>
                      <p className="text-white/30 text-[9px]">{node.region}</p>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    {swept ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[9.5px] font-mono tabular-nums"
                        style={{ color: accentColor }}
                      >
                        absent @ {timestamps[i]}
                      </motion.span>
                    ) : (
                      <span className="text-[9.5px] text-white/25">pending</span>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <div className="min-h-[92px]">
            <AnimatePresence mode="wait">
              {certified ? (
                <motion.div
                  key={`cert-${runKey}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-white text-xs font-semibold">Deletion certificate issued</p>
                    <span
                      className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: accentColor, color: bgDark }}
                    >
                      signed
                    </span>
                  </div>
                  <p className="text-white/40 text-[10px] font-mono tabular-nums mb-1.5 break-all">
                    sha256:{certHash}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    All four copies confirmed absent as of their own sweep timestamp. Exportable, verifiable
                    independently of this console, the artifact a BIPA or GDPR deletion request actually needs.
                  </p>
                </motion.div>
              ) : (
                <p className="text-white/30 text-[11px] text-center pt-6">
                  {sweptCount === 0
                    ? "A tenant-isolated deletion request touches four copies, not one."
                    : "Sweeping replicas, caches, and backups..."}
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
