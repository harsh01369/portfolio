"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface LP {
  id: string;
  name: string;
  committed: number;
  joinedAfterClose: boolean;
}

const LPS: LP[] = [
  { id: "l1", name: "Meridian Family Office", committed: 2_000_000, joinedAfterClose: false },
  { id: "l2", name: "Castelline Partners", committed: 3_000_000, joinedAfterClose: false },
  { id: "l3", name: "Arbor State Pension", committed: 5_000_000, joinedAfterClose: false },
];

const LATE_LP: LP = { id: "l4", name: "Northbridge Endowment", committed: 4_000_000, joinedAfterClose: true };

const CALLS_ALREADY_MADE = 1_600_000; // total already called from the first 3 LPs before the late close

function fmt(n: number) {
  return `$${n.toLocaleString()}`;
}

export default function JuniperSquareRebalanceDemo({ accentColor, bgDark }: Props) {
  const [lateJoined, setLateJoined] = useState(false);

  const allLPs = lateJoined ? [...LPS, LATE_LP] : LPS;
  const totalCommitted = allLPs.reduce((s, l) => s + l.committed, 0);

  const beforeCalled: Record<string, number> = {};
  for (const lp of LPS) beforeCalled[lp.id] = (lp.committed / LPS.reduce((s, l) => s + l.committed, 0)) * CALLS_ALREADY_MADE;

  const afterCalled: Record<string, number> = {};
  if (lateJoined) {
    for (const lp of allLPs) afterCalled[lp.id] = (lp.committed / totalCommitted) * CALLS_ALREADY_MADE;
  }

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
          <span className="text-[10.5px] text-white/40 ml-2">fund-i :: late-close rebalance</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            {fmt(CALLS_ALREADY_MADE)} already called from the first close. A new LP joining after that close
            doesn't just get added, every existing LP's share of that call gets recomputed against the new total
            committed capital.
          </p>

          <div className="space-y-1.5 mb-4">
            <AnimatePresence initial={false}>
              {allLPs.map((lp) => {
                const before = beforeCalled[lp.id];
                const after = lateJoined ? afterCalled[lp.id] : before;
                const changed = lateJoined && lp.id !== LATE_LP.id && Math.abs(after - before) > 1;
                return (
                  <motion.div
                    key={lp.id}
                    layout
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg px-3 py-2.5"
                    style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${changed ? "#f59e0b55" : "rgba(255,255,255,0.07)"}` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10.5px] text-white/75">{lp.name}</span>
                      <span className="text-[9px] text-white/35">committed {fmt(lp.committed)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/40">called to date</span>
                      <span className="text-[10px] tabular-nums font-semibold" style={{ color: changed ? "#f59e0b" : accentColor }}>
                        {fmt(Math.round(after))}
                        {changed && <span className="text-white/30 ml-1 text-[9px]">(was {fmt(Math.round(before))})</span>}
                      </span>
                    </div>
                    {lp.id === LATE_LP.id && lateJoined && (
                      <p className="text-[9px] mt-1" style={{ color: "#f59e0b" }}>
                        catch-up contribution for the call that already happened before this LP closed
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setLateJoined((s) => !s)}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity"
            style={{ background: accentColor, color: bgDark }}
          >
            {lateJoined ? "Undo late close" : "Add Northbridge Endowment, late close"}
          </button>
        </div>
      </div>
    </div>
  );
}
