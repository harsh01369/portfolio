"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Product {
  id: string;
  name: string;
  relevance: number;
}

interface SponsoredCandidate {
  id: string;
  name: string;
  relevance: number;
  bid: number;
  displaceSlot: number;
}

interface QueryScenario {
  id: string;
  query: string;
  organic: Product[];
  sponsored: SponsoredCandidate;
}

const SCENARIOS: QueryScenario[] = [
  {
    id: "shoes",
    query: "running shoes",
    organic: [
      { id: "p1", name: "TrailFlex Pro 3", relevance: 96 },
      { id: "p2", name: "UrbanRunner Elite", relevance: 91 },
      { id: "p3", name: "AeroSprint Lite", relevance: 88 },
      { id: "p4", name: "CloudStep Max", relevance: 84 },
      { id: "p5", name: "PaceForm X", relevance: 79 },
    ],
    sponsored: { id: "s1", name: "Bolt Runner (Sponsored)", relevance: 72, bid: 90, displaceSlot: 2 },
  },
  {
    id: "protein",
    query: "protein powder",
    organic: [
      { id: "p1", name: "PureIso Whey", relevance: 97 },
      { id: "p2", name: "LeanCore Blend", relevance: 90 },
      { id: "p3", name: "GrassFed Classic", relevance: 85 },
      { id: "p4", name: "PlantRise Vanilla", relevance: 81 },
      { id: "p5", name: "RapidRecover Choc", relevance: 76 },
    ],
    sponsored: { id: "s2", name: "SurgeFuel Protein (Sponsored)", relevance: 68, bid: 86, displaceSlot: 1 },
  },
  {
    id: "chairs",
    query: "office chairs",
    organic: [
      { id: "p1", name: "ErgoFrame 7", relevance: 95 },
      { id: "p2", name: "LumbarPro Mesh", relevance: 89 },
      { id: "p3", name: "DeskForm Classic", relevance: 83 },
      { id: "p4", name: "TaskRight Slim", relevance: 78 },
      { id: "p5", name: "FlexSeat Standard", relevance: 74 },
    ],
    sponsored: { id: "s3", name: "ChairWorks Elevate (Sponsored)", relevance: 65, bid: 82, displaceSlot: 3 },
  },
];

export default function ConstructorReasoningDemo({ accentColor, bgDark }: Props) {
  const [query, setQuery] = useState("");
  const [retailMediaOn, setRetailMediaOn] = useState(false);

  const scenario = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SCENARIOS[0];
    return SCENARIOS.find((s) => s.query.includes(q) || q.includes(s.query.split(" ")[0])) ?? SCENARIOS[0];
  }, [query]);

  const results = useMemo(() => {
    const base = scenario.organic.map((p) => ({ ...p, sponsored: false, displaced: false }));
    if (!retailMediaOn) return base;
    const slot = scenario.sponsored.displaceSlot;
    const displacedProduct = base[slot];
    const withSponsored = [...base];
    withSponsored.splice(slot, 0, {
      id: scenario.sponsored.id,
      name: scenario.sponsored.name,
      relevance: scenario.sponsored.relevance,
      sponsored: true,
      displaced: false,
    });
    const displacedIndex = withSponsored.findIndex((p) => p.id === displacedProduct.id);
    withSponsored[displacedIndex] = { ...withSponsored[displacedIndex], displaced: true };
    return withSponsored.slice(0, 6);
  }, [scenario, retailMediaOn]);

  const displaced = results.find((r) => r.displaced);
  const integrityDrop = displaced ? Math.round(displaced.relevance - scenario.sponsored.relevance) : 0;
  const integrity = retailMediaOn ? Math.max(0, 100 - integrityDrop * 1.6) : 100;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Search sandbox</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {[false, true].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => setRetailMediaOn(v)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full"
                  style={{ color: retailMediaOn === v ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {retailMediaOn === v && (
                    <motion.div
                      layoutId="rm-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{v ? "Retail media on" : "Organic only"}</span>
                </button>
              ))}
            </div>
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Try: ${SCENARIOS.map((s) => s.query).join(" / ")}`}
            className="w-full rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/30 mb-2 outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <div className="flex gap-1.5 mb-5">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setQuery(s.query)}
                className="text-[9px] px-2 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}
              >
                {s.query}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 mb-5">
            {results.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="rounded-lg px-3 py-2.5 flex items-center justify-between"
                style={{
                  background: p.sponsored ? `${accentColor}16` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${p.sponsored ? accentColor + "66" : p.displaced ? "rgba(255,170,60,0.4)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-white/30 text-[10px] font-mono tabular-nums w-4">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-medium truncate">{p.name}</p>
                    {p.sponsored && (
                      <span
                        className="text-[8px] font-bold uppercase tracking-wider"
                        style={{ color: accentColor }}
                      >
                        Sponsored · bid-adjusted {scenario.sponsored.bid}
                      </span>
                    )}
                    {p.displaced && (
                      <span className="text-[8px] font-medium uppercase tracking-wider" style={{ color: "#ffaa3c" }}>
                        Bumped by sponsored slot
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-white/50 text-[10px] font-mono tabular-nums shrink-0">
                  rel {p.relevance}
                </span>
              </motion.div>
            ))}
          </div>

          <div
            className="rounded-xl p-3.5"
            style={{ background: "rgba(255,255,255,0.035)", border: `1px solid ${accentColor}33` }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/50 text-[10px] uppercase tracking-wider">Relevance integrity</p>
              <p className="text-sm font-mono tabular-nums font-semibold" style={{ color: accentColor }}>
                {integrity.toFixed(0)}%
              </p>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: accentColor }}
                animate={{ width: `${integrity}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
              />
            </div>
            {retailMediaOn && displaced ? (
              <p className="text-white/60 text-[10px] leading-relaxed">
                {scenario.sponsored.name} (relevance {scenario.sponsored.relevance}, bid-adjusted{" "}
                {scenario.sponsored.bid}) took the slot from {displaced.name} (relevance {displaced.relevance}). The
                swap only clears because the bid-adjusted score beats the neighboring organic score, not because
                revenue alone decides placement.
              </p>
            ) : (
              <p className="text-white/40 text-[10px] leading-relaxed">
                Pure relevance ranking, no paid placement active. Toggle retail media on to see the tradeoff math.
              </p>
            )}
          </div>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Mock catalog and bid figures for this demo only, not Constructor&apos;s live ranking output.
          </p>
        </div>
      </div>
    </div>
  );
}
