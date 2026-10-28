"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function ParadeDbInlineIndexDemo({ accentColor, bgDark }: Props) {
  const [inserted, setInserted] = useState(false);
  const [syncedCaughtUp, setSyncedCaughtUp] = useState(false);

  const insert = () => {
    setInserted(true);
    setSyncedCaughtUp(false);
    setTimeout(() => setSyncedCaughtUp(true), 2400);
  };

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
          <span className="text-[10.5px] text-white/40 ml-2">search :: order row insert</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A hand-rolled BM25 setup keeps the search index as a separate table that a background
            job re-syncs. pg_search updates its index inside the same transaction as the write.
            Insert a row and query both paths for it.
          </p>

          <button
            onClick={insert}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity mb-4"
            style={{ background: accentColor, color: bgDark }}
          >
            INSERT INTO orders (sku, description) ...
          </button>

          <div className="space-y-2.5">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] text-white/75">pg_search (inline, same transaction)</span>
              </div>
              <motion.div
                key={inserted ? "found" : "empty"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px]"
                style={{ color: inserted ? "#4ade80" : "rgba(255,255,255,0.3)" }}
              >
                {inserted ? "SELECT ... WHERE sku @@@ 'new part' -> 1 row, visible immediately" : "no rows inserted yet"}
              </motion.div>
            </div>

            <div
              className="rounded-lg px-3 py-2.5"
              style={{ background: inserted && !syncedCaughtUp ? "#ef444414" : "rgba(255,255,255,0.025)", border: `1px solid ${inserted && !syncedCaughtUp ? "#ef444455" : "rgba(255,255,255,0.07)"}` }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10.5px] text-white/75">hand-rolled index (background re-sync)</span>
                {inserted && !syncedCaughtUp && <span className="text-[9px] text-amber-300">sync job pending</span>}
              </div>
              <motion.div
                key={inserted ? (syncedCaughtUp ? "caught-up" : "stale") : "empty"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px]"
                style={{ color: !inserted ? "rgba(255,255,255,0.3)" : syncedCaughtUp ? "#4ade80" : "#fca5a5" }}
              >
                {!inserted
                  ? "no rows inserted yet"
                  : syncedCaughtUp
                    ? "SELECT ... WHERE sku @@@ 'new part' -> 1 row, sync job finally ran"
                    : "SELECT ... WHERE sku @@@ 'new part' -> 0 rows, row exists in Postgres but not in the search index yet"}
              </motion.div>
            </div>
          </div>

          <p className="text-white/30 text-[9px] leading-relaxed mt-4">
            {inserted && !syncedCaughtUp
              ? "This window is where \"I just added it, why can't I find it\" support tickets come from."
              : " "}
          </p>
        </div>
      </div>
    </div>
  );
}
