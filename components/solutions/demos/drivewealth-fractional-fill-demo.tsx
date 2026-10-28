"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Order {
  id: string;
  customer: string;
  dollars: number;
}

const PRICE = 412.5;
const ORDERS: Order[] = [
  { id: "o1", customer: "Customer A", dollars: 50 },
  { id: "o2", customer: "Customer B", dollars: 200 },
  { id: "o3", customer: "Customer C", dollars: 15 },
  { id: "o4", customer: "Customer D", dollars: 120 },
];

const FILL_RATE = 0.82; // exchange only fills 82% of the aggregated block

function sharesFor(dollars: number) {
  return dollars / PRICE;
}

export default function DrivewealthFractionalFillDemo({ accentColor, bgDark }: Props) {
  const [aggregated, setAggregated] = useState(false);
  const [filled, setFilled] = useState(false);

  const totalDollars = ORDERS.reduce((s, o) => s + o.dollars, 0);
  const totalSharesRequested = sharesFor(totalDollars);
  const blockShares = Math.ceil(totalSharesRequested);
  const actualFilledShares = filled ? blockShares * FILL_RATE : blockShares;

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
          <span className="text-[10.5px] text-white/40 ml-2">block-order :: fractional aggregation</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            The exchange only trades whole shares. Four dollar-amount orders get aggregated into one block
            order, and however much of that block actually fills has to be prorated back down to each customer.
          </p>

          <div className="space-y-1.5 mb-4">
            {ORDERS.map((o) => {
              const requested = sharesFor(o.dollars);
              const received = filled ? requested * FILL_RATE : requested;
              return (
                <div key={o.id} className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-[10.5px] text-white/75">{o.customer}</span>
                  <span className="text-[9px] text-white/40">${o.dollars}</span>
                  <span className="text-[10px] tabular-nums" style={{ color: accentColor }}>
                    {received.toFixed(6)} sh
                  </span>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-white/40">aggregated block order sent to exchange</span>
              <span className="text-[10.5px] tabular-nums font-semibold" style={{ color: accentColor }}>{blockShares} whole shares</span>
            </div>
            <AnimatePresence>
              {filled && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
                  <span className="text-[9px]" style={{ color: "#f59e0b" }}>actually filled, {Math.round(FILL_RATE * 100)}% of block</span>
                  <span className="text-[10.5px] tabular-nums font-semibold" style={{ color: "#f59e0b" }}>{actualFilledShares.toFixed(2)} shares</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!aggregated && (
            <button onClick={() => setAggregated(true)} className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity" style={{ background: accentColor, color: bgDark }}>
              Aggregate 4 orders into one block
            </button>
          )}
          {aggregated && !filled && (
            <button onClick={() => setFilled(true)} className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity" style={{ background: "#f59e0b", color: bgDark }}>
              Simulate partial fill from exchange
            </button>
          )}
          {filled && (
            <p className="text-[9.5px] text-white/35">Each customer's fill prorated down from their original dollar order, proportional to the block's actual fill rate.</p>
          )}
        </div>
      </div>
    </div>
  );
}
