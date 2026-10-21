"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Position {
  id: string;
  chain: string;
  protocol: string;
  asset: string;
  baseValue: number;
  shockMultiplier: number;
  rippleDelay: number;
  correlated: boolean;
}

const MARGIN_REQUIREMENT = 1_850_000;

const POSITIONS: Position[] = [
  { id: "p1", chain: "Ethereum", protocol: "Lido", asset: "Staked ETH", baseValue: 2_400_000, shockMultiplier: 0.62, rippleDelay: 0, correlated: true },
  { id: "p2", chain: "Arbitrum", protocol: "Uniswap v3", asset: "ETH/USDC LP", baseValue: 1_100_000, shockMultiplier: 0.75, rippleDelay: 0.15, correlated: true },
  { id: "p3", chain: "Base", protocol: "Aave v3", asset: "USDC supplied", baseValue: 900_000, shockMultiplier: 1.0, rippleDelay: 0, correlated: false },
  { id: "p4", chain: "Polygon", protocol: "Lido", asset: "wstETH", baseValue: 650_000, shockMultiplier: 0.62, rippleDelay: 0.15, correlated: true },
  { id: "p5", chain: "Optimism", protocol: "Perp DEX", asset: "ETH short (hedge)", baseValue: 500_000, shockMultiplier: 1.25, rippleDelay: 0.3, correlated: true },
];

function fmt(n: number) {
  return `$${(n / 1_000_000).toFixed(2)}M`;
}

function healthColor(ratio: number) {
  if (ratio >= 2.5) return "#4dd08a";
  if (ratio >= 1.6) return "#ffaa3c";
  return "#ff4d5e";
}

export default function AugustCrossMarginDemo({ accentColor, bgDark }: Props) {
  const [shocked, setShocked] = useState(false);

  const positions = useMemo(
    () =>
      POSITIONS.map((p) => ({
        ...p,
        value: shocked ? p.baseValue * p.shockMultiplier : p.baseValue,
      })),
    [shocked]
  );

  const totalValue = positions.reduce((acc, p) => acc + p.value, 0);
  const marginRatio = totalValue / MARGIN_REQUIREMENT;
  const color = healthColor(marginRatio);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -bottom-24 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Cross-margin health map</p>
            <div
              className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
              style={{ background: `${accentColor}1a`, color: accentColor, border: `1px solid ${accentColor}44` }}
            >
              5 chains, 1 account
            </div>
          </div>

          {/* radial map */}
          <div className="relative h-[240px] flex items-center justify-center mb-6">
            {positions.map((p, i) => {
              const angle = (i / positions.length) * Math.PI * 2 - Math.PI / 2;
              const r = 98;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              const dropping = shocked && p.shockMultiplier < 1;
              const rising = shocked && p.shockMultiplier > 1;
              return (
                <div key={p.id} className="absolute" style={{ left: "50%", top: "50%" }}>
                  {/* connecting line */}
                  <motion.div
                    className="absolute h-px origin-left"
                    style={{
                      width: r,
                      left: 0,
                      top: 0,
                      transform: `rotate(${angle}rad)`,
                      background: shocked && p.correlated ? color : "rgba(255,255,255,0.12)",
                    }}
                    animate={shocked && p.correlated ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.3 }}
                    transition={shocked && p.correlated ? { duration: 0.8, repeat: Infinity, delay: p.rippleDelay } : {}}
                  />
                  <motion.div
                    initial={false}
                    animate={{ x, y }}
                    transition={{ type: "spring", stiffness: 300, damping: 28, delay: p.rippleDelay }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg px-2.5 py-2 text-center w-[100px]"
                    style={{
                      background: dropping ? "rgba(255,77,94,0.12)" : rising ? "rgba(77,208,138,0.12)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${dropping ? "rgba(255,77,94,0.4)" : rising ? "rgba(77,208,138,0.4)" : "rgba(255,255,255,0.12)"}`,
                    }}
                  >
                    <p className="text-white/70 text-[9px] font-semibold">{p.chain}</p>
                    <p className="text-white/35 text-[8px] mt-0.5">{p.asset}</p>
                    <motion.p
                      className="text-[10px] font-mono tabular-nums mt-1 font-semibold"
                      style={{ color: dropping ? "#ff4d5e" : rising ? "#4dd08a" : "rgba(255,255,255,0.6)" }}
                    >
                      {fmt(p.value)}
                    </motion.p>
                  </motion.div>
                </div>
              );
            })}

            {/* center hub */}
            <motion.div
              className="relative z-10 rounded-full flex flex-col items-center justify-center w-[108px] h-[108px]"
              style={{ background: bgDark, border: `2px solid ${color}` }}
              animate={{ boxShadow: `0 0 ${shocked ? 28 : 12}px ${color}55` }}
            >
              <p className="text-white/40 text-[8px] uppercase tracking-wider">Margin ratio</p>
              <p className="text-lg font-bold tabular-nums" style={{ color }}>
                {marginRatio.toFixed(2)}x
              </p>
            </motion.div>
          </div>

          <div
            className="rounded-xl p-4 mb-4 flex items-center justify-between"
            style={{ background: `${color}14`, border: `1px solid ${color}44` }}
          >
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-1">Blended account value</p>
              <p className="text-white text-sm font-semibold tabular-nums">{fmt(totalValue)}</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-1">Status</p>
              <p className="text-xs font-semibold" style={{ color }}>
                {marginRatio >= 2.5 ? "Healthy" : marginRatio >= 1.6 ? "At risk" : "Near liquidation"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShocked((s) => !s)}
            className="w-full text-[11px] font-semibold py-2.5 rounded-lg transition-colors"
            style={{
              background: shocked ? "rgba(255,77,94,0.18)" : accentColor,
              color: shocked ? "#ff4d5e" : bgDark,
              border: shocked ? "1px solid rgba(255,77,94,0.4)" : "none",
            }}
          >
            {shocked ? "Reset price feed" : "Simulate ETH price shock, -38%"}
          </button>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            One simulated institutional account, collateral spread across five chains and protocols. A price shock
            on Ethereum ripples through correlated ETH exposure on Arbitrum, Polygon, and the Optimism hedge, while
            the uncorrelated Base USDC position holds steady, all recalculated into one blended margin ratio.
            Sample account, not a real client&apos;s position.
          </p>
        </div>
      </div>
    </div>
  );
}
