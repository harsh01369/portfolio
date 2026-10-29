"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "without" | "with";

export default function ModernTreasuryIdempotencyDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("without");

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
          <span className="text-[10.5px] text-white/40 ml-2">POST /payment_orders :: timeout, client retries</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A POST isn't idempotent by default. A client that times out and retries the exact same wire transfer
            request either gets a second payment, or gets the original result back, depending on one header.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("without")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "without" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "without" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              no idempotency key
            </button>
            <button
              onClick={() => setMode("with")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "with" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "with" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              idempotency key, same request
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[9.5px] text-white/55">request 1: wire $48,200.00, client times out waiting on the response</span>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[9.5px] text-white/55">request 2: same wire, client retries 4s later</span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "with" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "with" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "without"
                ? "No key means the API has no way to know request 2 is a retry, not a new wire. It executes again: $96,400.00 sent."
                : "Same key on both requests. Within the 24-hour window, request 2 is recognized as a repeat and returns the stored result from request 1, no second wire."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
