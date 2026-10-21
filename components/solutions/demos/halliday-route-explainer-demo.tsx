"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Pair = "usdc-arb" | "eth-base";

interface Route {
  id: string;
  bridge: string;
  fee: number;
  seconds: number;
  hops: number;
  chosen: boolean;
  reason: string;
}

const ROUTES: Record<Pair, { label: string; routes: Route[] }> = {
  "usdc-arb": {
    label: "USDC (Ethereum) → ETH (Arbitrum)",
    routes: [
      { id: "a", bridge: "Native bridge + DEX swap", fee: 4.82, seconds: 720, hops: 2, chosen: false, reason: "Cheapest gas, but a 12-minute finality window" },
      { id: "b", bridge: "Fast bridge aggregator", fee: 2.15, seconds: 38, hops: 2, chosen: true, reason: "Best balance of speed and fee for this size" },
      { id: "c", bridge: "Direct liquidity pool route", fee: 1.40, seconds: 55, hops: 1, chosen: false, reason: "Cheapest, but pool depth adds slippage above $5k" },
    ],
  },
  "eth-base": {
    label: "ETH (Mainnet) → USDC (Base)",
    routes: [
      { id: "d", bridge: "Canonical Base bridge", fee: 1.95, seconds: 480, hops: 2, chosen: false, reason: "Reliable, but slow relative to the alternatives" },
      { id: "e", bridge: "Fast bridge aggregator", fee: 0.86, seconds: 22, hops: 2, chosen: true, reason: "Lowest fee at near-instant speed for this route" },
      { id: "f", bridge: "Cross-chain messaging route", fee: 1.10, seconds: 31, hops: 3, chosen: false, reason: "One extra hop adds risk with no speed or fee gain" },
    ],
  },
};

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

export default function HallidayRouteExplainerDemo({ accentColor, bgDark }: Props) {
  const [pair, setPair] = useState<Pair>("usdc-arb");
  const current = ROUTES[pair];
  const chosen = current.routes.find((r) => r.chosen)!;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.14, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Route explainer</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["usdc-arb", "eth-base"] as Pair[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPair(p)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: pair === p ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {pair === p && (
                    <motion.div
                      layoutId="halliday-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{p === "usdc-arb" ? "USDC → Arbitrum" : "ETH → Base"}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-white/50 text-xs font-mono mb-4">{current.label}</p>

          <div className="flex flex-col gap-2.5">
            {current.routes.map((route, i) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-lg px-4 py-3"
                style={{
                  background: route.chosen ? `${accentColor}14` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${route.chosen ? accentColor : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {route.chosen && (
                  <span
                    className="absolute -top-2.5 left-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: accentColor, color: bgDark }}
                  >
                    Selected route
                  </span>
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-white text-xs font-semibold">{route.bridge}</p>
                  <span className="text-white/35 text-[10px] font-mono tabular-nums">{route.hops} hop{route.hops > 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-4 mb-1.5">
                  <p className="text-[11px] font-mono tabular-nums">
                    <span className="text-white/35">fee </span>
                    <span className="text-white font-semibold">${route.fee.toFixed(2)}</span>
                  </p>
                  <p className="text-[11px] font-mono tabular-nums">
                    <span className="text-white/35">time </span>
                    <span className="text-white font-semibold">{formatTime(route.seconds)}</span>
                  </p>
                </div>
                <p
                  className="text-[10.5px] leading-snug"
                  style={{ color: route.chosen ? accentColor : "rgba(255,255,255,0.4)" }}
                >
                  {route.reason}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="text-white/45 text-[11px] leading-relaxed mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            The user only ever sees one signature for &ldquo;{chosen.bridge}&rdquo;. Every candidate route Halliday's
            engine scored stays visible here, so &ldquo;why did my transaction take this path&rdquo; has a real
            answer instead of a black box.
          </p>
        </div>
      </div>
    </div>
  );
}
