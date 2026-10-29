"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "auth" | "settle";

export default function BleapLockedRateDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("auth");

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl font-mono"
        style={{ background: bgDark, border: `1px solid ${accentColor}33` }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(${accentColor} 1px, transparent 1px), linear-gradient(90deg, ${accentColor} 1px, transparent 1px)`,
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: `1px solid ${accentColor}2E` }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#ef4444" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#22c55e" }} />
          <span className="text-[10.5px] text-white/40 ml-2">Bleap card :: gas pump pre-auth, SOL balance</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Bleap's own pitch is that the exchange rate locks the moment you authorize. A gas pump authorizes
            one amount and settles a different one days later, and the crypto never actually moved at auth time.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("auth")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "auth" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "auth" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              moment of authorization
            </button>
            <button
              onClick={() => setMode("settle")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "settle" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "settle" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              final settlement, 2 days later
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">pump pre-authorizes, locked rate</span>
                <span className="text-[9.5px] text-white/60">$75.00 hold, SOL locked at $178.40</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">{mode === "auth" ? "amount actually pumped" : "final settled amount from the merchant"}</span>
                <span className="text-[9.5px] text-white/60">{mode === "auth" ? "not known yet" : "$42.30, SOL now trading at $181.90"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "auth" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "auth" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "auth"
                ? "The $178.40 rate locks against a $75.00 hold that was never the real charge, just the pump's standard ceiling. Nothing has actually settled, so nothing has actually converted yet."
                : "Two days later the merchant settles $42.30, a third of the hold, and SOL has moved since the locked quote. Whichever rate actually gets charged against the wallet, the one locked at authorization or the spot rate at settlement, the card network's variable-amount behavior and a volatile asset are now interacting in a way neither system was built to coordinate alone."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
