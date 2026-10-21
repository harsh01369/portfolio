"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Comp {
  label: string;
  price: number;
  distance: string;
  similarity: number;
}

interface Signal {
  label: string;
  value: string;
  freshness: string;
}

interface Listing {
  id: string;
  label: string;
  base: number;
  comps: Comp[];
  signals: Signal[];
  suggested: number;
}

const LISTINGS: Listing[] = [
  {
    id: "loft",
    label: "Downtown 2BR Loft",
    base: 142,
    comps: [
      { label: "Comp A", price: 158, distance: "0.3 mi", similarity: 94 },
      { label: "Comp B", price: 134, distance: "0.5 mi", similarity: 89 },
      { label: "Comp C", price: 151, distance: "0.7 mi", similarity: 86 },
    ],
    signals: [
      { label: "Occupancy pacing", value: "+11% vs. 28-day avg", freshness: "synced 4 min ago" },
      { label: "Booking window", value: "9 days out, tightening", freshness: "synced 4 min ago" },
      { label: "Seasonal event", value: "Downtown marathon, Sat", freshness: "synced 2 hr ago" },
    ],
    suggested: 171,
  },
  {
    id: "beachfront",
    label: "Beachfront Condo",
    base: 210,
    comps: [
      { label: "Comp A", price: 245, distance: "0.1 mi", similarity: 97 },
      { label: "Comp B", price: 198, distance: "0.4 mi", similarity: 82 },
      { label: "Comp C", price: 232, distance: "0.2 mi", similarity: 91 },
    ],
    signals: [
      { label: "Occupancy pacing", value: "+24% vs. 28-day avg", freshness: "synced 4 min ago" },
      { label: "Booking window", value: "22 days out, stable", freshness: "synced 4 min ago" },
      { label: "Seasonal event", value: "Peak summer week", freshness: "synced 6 hr ago" },
    ],
    suggested: 268,
  },
  {
    id: "cabin",
    label: "Mountain Cabin",
    base: 95,
    comps: [
      { label: "Comp A", price: 88, distance: "1.1 mi", similarity: 79 },
      { label: "Comp B", price: 102, distance: "0.6 mi", similarity: 88 },
      { label: "Comp C", price: 91, distance: "0.9 mi", similarity: 84 },
    ],
    signals: [
      { label: "Occupancy pacing", value: "-6% vs. 28-day avg", freshness: "synced 5 min ago" },
      { label: "Booking window", value: "41 days out, slack", freshness: "synced 5 min ago" },
      { label: "Seasonal event", value: "None detected", freshness: "synced 3 hr ago" },
    ],
    suggested: 89,
  },
];

export default function WheelhousePriceProvenanceDemo({ accentColor, bgDark }: Props) {
  const [listingId, setListingId] = useState(LISTINGS[0].id);
  const listing = LISTINGS.find((l) => l.id === listingId) ?? LISTINGS[0];
  const delta = listing.suggested - listing.base;

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
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Price provenance</p>
          </div>

          <div
            className="flex rounded-full p-0.5 mb-5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {LISTINGS.map((l) => (
              <button
                key={l.id}
                onClick={() => setListingId(l.id)}
                className="relative flex-1 text-[10.5px] font-semibold px-2 py-1.5 rounded-full transition-colors"
                style={{ color: listingId === l.id ? bgDark : "rgba(255,255,255,0.55)" }}
              >
                {listingId === l.id && (
                  <motion.div
                    layoutId="wheelhouse-listing-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: accentColor }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={listing.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-white/40 text-[10px] uppercase tracking-wide font-semibold mb-2">
                Comp set (anonymized)
              </p>
              <div className="space-y-1.5 mb-4">
                {listing.comps.map((comp, i) => (
                  <motion.div
                    key={comp.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <span className="text-white/60 text-[11px]">{comp.label}</span>
                    <span className="text-white/35 text-[10px]">{comp.distance}</span>
                    <span className="text-white/40 text-[10px] font-mono tabular-nums">{comp.similarity}% match</span>
                    <span className="text-white text-xs font-mono tabular-nums font-semibold">${comp.price}</span>
                  </motion.div>
                ))}
              </div>

              <p className="text-white/40 text-[10px] uppercase tracking-wide font-semibold mb-2">
                Signals used tonight
              </p>
              <div className="space-y-1.5 mb-4">
                {listing.signals.map((signal, i) => (
                  <motion.div
                    key={signal.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + i * 0.06 }}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div>
                      <p className="text-white text-[11px] font-medium">{signal.label}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">{signal.value}</p>
                    </div>
                    <span className="text-white/30 text-[9px] font-mono tabular-nums whitespace-nowrap">
                      {signal.freshness}
                    </span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-lg px-3.5 py-3"
                style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-[10px]">Base rate</p>
                    <p className="text-white/70 text-sm font-mono tabular-nums">${listing.base}</p>
                  </div>
                  <span className="text-white/30 text-xs">→</span>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: accentColor }}>
                      Tonight&apos;s suggested rate
                    </p>
                    <p className="text-lg font-mono tabular-nums font-bold" style={{ color: accentColor }}>
                      ${listing.suggested}
                    </p>
                  </div>
                </div>
                <p className="text-white/40 text-[10px] mt-1.5">
                  {delta >= 0 ? "+" : ""}
                  {delta} from base, traced to the 3 comps and 3 signals above, not a black box.
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
