"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "pooled" | "segregated";

const POOLED_ACCOUNTS = ["Acct 4471", "Acct 2208", "Acct 9013", "Acct 5560", "You"];

export default function CustodiaCustodyDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("pooled");

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid rgba(212,162,76,0.18)` }}
      >
        {/* ambient glow */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Custody model</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["pooled", "segregated"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "pooled" ? "Typical exchange" : "Custodia"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[260px]">
            <AnimatePresence mode="wait">
              {mode === "pooled" ? (
                <motion.div
                  key="pooled"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-[150px] flex items-center justify-center mb-5">
                    {/* the pool */}
                    <motion.div
                      className="absolute w-28 h-28 rounded-full"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="absolute text-white/30 text-[10px] uppercase tracking-wider">Shared pool</span>

                    {POOLED_ACCOUNTS.map((acct, i) => {
                      const angle = (i / POOLED_ACCOUNTS.length) * Math.PI * 2 - Math.PI / 2;
                      const r = 95;
                      const x = Math.cos(angle) * r;
                      const y = Math.sin(angle) * r;
                      const isYou = acct === "You";
                      return (
                        <motion.div
                          key={acct}
                          initial={{ opacity: 0, x: 0, y: 0 }}
                          animate={{ opacity: 1, x, y }}
                          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute text-[9px] font-medium px-2 py-1 rounded-full whitespace-nowrap"
                          style={{
                            background: isYou ? `${accentColor}22` : "rgba(255,255,255,0.05)",
                            border: `1px solid ${isYou ? accentColor : "rgba(255,255,255,0.12)"}`,
                            color: isYou ? accentColor : "rgba(255,255,255,0.4)",
                          }}
                        >
                          {acct}
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="text-white text-sm font-semibold mb-1">Your balance: a number</p>
                  <p className="text-white/45 text-xs leading-relaxed">
                    Drawn from a commingled pool. No specific on-chain asset is attributed to you, if the pool runs
                    short, every claim on it is diluted equally.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="segregated"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-[150px] flex items-center justify-center gap-6 mb-5">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="rounded-lg px-4 py-3 text-center"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <p className="text-white text-xs font-semibold">You</p>
                      <p className="text-white/40 text-[10px] mt-0.5">Custodia account</p>
                    </motion.div>

                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
                      className="h-px flex-1 max-w-[56px] origin-left"
                      style={{ background: accentColor }}
                    />

                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="rounded-lg px-4 py-3 text-center relative"
                      style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}` }}
                    >
                      <div className="flex items-center gap-1.5 justify-center mb-0.5">
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: accentColor }}
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                        />
                        <p className="text-[10px] font-semibold" style={{ color: accentColor }}>
                          Segregated
                        </p>
                      </div>
                      <p className="text-white/70 text-[10px] font-mono tabular-nums">bc1q...9f2a</p>
                    </motion.div>
                  </div>
                  <p className="text-white text-sm font-semibold mb-1">Your balance: an attributable address</p>
                  <p className="text-white/45 text-xs leading-relaxed">
                    A specific on-chain address, mapped 1:1 to your account. What you hold isn&apos;t a claim on a
                    shared pool, it&apos;s identifiably yours, the way a safe-deposit box is.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
