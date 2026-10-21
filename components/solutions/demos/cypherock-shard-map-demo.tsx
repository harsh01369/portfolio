"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "shamir" | "seed";

interface Shard {
  id: string;
  label: string;
  sub: string;
}

const SHARDS: Shard[] = [
  { id: "vault", label: "Vault", sub: "never holds full key" },
  { id: "card1", label: "Card 1", sub: "NFC" },
  { id: "card2", label: "Card 2", sub: "NFC" },
  { id: "card3", label: "Card 3", sub: "NFC" },
  { id: "card4", label: "Card 4", sub: "NFC" },
];

const THRESHOLD = 3;

export default function CypherockShardMapDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("shamir");
  const [lostShamir, setLostShamir] = useState<Set<string>>(new Set());
  const [lostSeed, setLostSeed] = useState(false);

  const remaining = SHARDS.length - lostShamir.size;
  const shamirRecoverable = remaining >= THRESHOLD;

  const toggleShard = (id: string) => {
    setLostShamir((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetAll = () => {
    setLostShamir(new Set());
    setLostSeed(false);
  };

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Key-loss simulator</p>
            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="text-white/35 hover:text-white/60 text-[10px] uppercase tracking-wide transition-colors"
              >
                Reset
              </button>
              <div
                className="flex rounded-full p-0.5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {(["shamir", "seed"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                    style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                  >
                    {mode === m && (
                      <motion.div
                        layoutId="cypherock-mode-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: accentColor }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{m === "shamir" ? "Cypherock X1" : "Seed phrase"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {mode === "shamir" ? (
                <motion.div
                  key="shamir"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white/35 text-[10px] leading-relaxed mb-4">
                    5 shards, Shamir&apos;s Secret Sharing, 3-of-5 threshold. Click a shard to simulate losing it.
                    No single shard, including the Vault, ever holds the complete key.
                  </p>

                  <div className="relative h-[150px] flex items-center justify-center mb-5">
                    {SHARDS.map((shard, i) => {
                      const angle = (i / SHARDS.length) * Math.PI * 2 - Math.PI / 2;
                      const r = shard.id === "vault" ? 0 : 92;
                      const x = Math.cos(angle) * r;
                      const y = Math.sin(angle) * r;
                      const isLost = lostShamir.has(shard.id);
                      const isVault = shard.id === "vault";
                      return (
                        <motion.button
                          key={shard.id}
                          onClick={() => toggleShard(shard.id)}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            x: isVault ? 0 : x,
                            y: isVault ? 0 : y,
                          }}
                          transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          whileTap={{ scale: 0.92 }}
                          className="absolute flex flex-col items-center justify-center rounded-xl px-3 py-2.5 cursor-pointer"
                          style={{
                            width: isVault ? 76 : 64,
                            height: isVault ? 76 : 64,
                            background: isLost ? "rgba(255,255,255,0.03)" : `${accentColor}16`,
                            border: `1px solid ${isLost ? "rgba(255,255,255,0.1)" : accentColor}`,
                            opacity: isLost ? 0.4 : 1,
                          }}
                        >
                          <span
                            className="text-[10px] font-semibold"
                            style={{ color: isLost ? "rgba(255,255,255,0.3)" : "white" }}
                          >
                            {shard.label}
                          </span>
                          <span className="text-[8px] mt-0.5" style={{ color: isLost ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.4)" }}>
                            {isLost ? "lost" : shard.sub}
                          </span>
                          {isLost && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <span className="text-white/25 text-lg">×</span>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.div
                    animate={{
                      background: shamirRecoverable ? `${accentColor}16` : "rgba(244,63,94,0.12)",
                      borderColor: shamirRecoverable ? accentColor : "#F43F5E",
                    }}
                    className="rounded-lg px-3.5 py-3"
                    style={{ border: "1px solid" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <motion.span
                          className="w-1.5 h-1.5 rounded-full"
                          animate={{ background: shamirRecoverable ? accentColor : "#F43F5E" }}
                        />
                        <p
                          className="text-[11px] font-semibold uppercase tracking-wide"
                          style={{ color: shamirRecoverable ? accentColor : "#F43F5E" }}
                        >
                          {shamirRecoverable ? "Wallet recoverable" : "Wallet lost"}
                        </p>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-white/70">
                        {remaining}/{SHARDS.length} shards present
                      </span>
                    </div>
                    <p className="text-white/45 text-[11px] leading-relaxed mt-1.5">
                      {shamirRecoverable
                        ? `Any ${THRESHOLD} of ${SHARDS.length} shards reconstruct the key. You can lose ${
                            SHARDS.length - THRESHOLD
                          } of them and still recover.`
                        : `Below the ${THRESHOLD}-of-${SHARDS.length} threshold. The key cannot be reconstructed from what remains.`}
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="seed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-white/35 text-[10px] leading-relaxed mb-4">
                    A typical seed-phrase wallet. One backup holds the entire key. Click it to simulate losing it.
                  </p>

                  <div className="h-[150px] flex items-center justify-center mb-5">
                    <motion.button
                      onClick={() => setLostSeed((v) => !v)}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center rounded-xl px-6 py-5 cursor-pointer"
                      style={{
                        background: lostSeed ? "rgba(255,255,255,0.03)" : "rgba(244,63,94,0.12)",
                        border: `1px solid ${lostSeed ? "rgba(255,255,255,0.1)" : "#F43F5E"}`,
                        opacity: lostSeed ? 0.4 : 1,
                      }}
                    >
                      <span className="text-white text-xs font-semibold">12-word seed phrase</span>
                      <span className="text-white/40 text-[10px] mt-0.5">the only backup</span>
                      {lostSeed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="text-white/25 text-xl">×</span>
                        </motion.div>
                      )}
                    </motion.button>
                  </div>

                  <motion.div
                    animate={{
                      background: lostSeed ? "rgba(244,63,94,0.12)" : `${accentColor}16`,
                      borderColor: lostSeed ? "#F43F5E" : accentColor,
                    }}
                    className="rounded-lg px-3.5 py-3"
                    style={{ border: "1px solid" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full"
                        animate={{ background: lostSeed ? "#F43F5E" : accentColor }}
                      />
                      <p
                        className="text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: lostSeed ? "#F43F5E" : accentColor }}
                      >
                        {lostSeed ? "Wallet lost" : "Wallet recoverable"}
                      </p>
                    </div>
                    <p className="text-white/45 text-[11px] leading-relaxed mt-1.5">
                      {lostSeed
                        ? "Single point of failure. Lose this one backup and every asset behind it is gone, permanently."
                        : "Everything depends on this one phrase. There is no second shard, no threshold, no redundancy."}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
