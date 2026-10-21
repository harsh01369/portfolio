"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "known" | "unknown";

interface ClusterPoint {
  x: number;
  y: number;
}

interface Cluster {
  id: string;
  label: string;
  color: string;
  points: ClusterPoint[];
}

const CLUSTERS: Cluster[] = [
  {
    id: "wall",
    label: "Cell wall synthesis inhibitors",
    color: "#60A5FA",
    points: [
      { x: 18, y: 22 }, { x: 24, y: 18 }, { x: 15, y: 30 }, { x: 22, y: 28 }, { x: 28, y: 24 }, { x: 19, y: 34 },
    ],
  },
  {
    id: "protein",
    label: "Protein synthesis inhibitors",
    color: "#FBBF24",
    points: [
      { x: 72, y: 20 }, { x: 78, y: 26 }, { x: 68, y: 28 }, { x: 75, y: 32 }, { x: 82, y: 22 }, { x: 70, y: 18 },
    ],
  },
  {
    id: "dna",
    label: "DNA replication inhibitors",
    color: "#F87171",
    points: [
      { x: 25, y: 72 }, { x: 32, y: 78 }, { x: 20, y: 80 }, { x: 28, y: 68 }, { x: 35, y: 74 }, { x: 22, y: 66 },
    ],
  },
  {
    id: "membrane",
    label: "Membrane disruptors",
    color: "#34D399",
    points: [
      { x: 75, y: 70 }, { x: 80, y: 76 }, { x: 70, y: 78 }, { x: 78, y: 65 }, { x: 72, y: 80 }, { x: 82, y: 72 },
    ],
  },
];

const KNOWN_POSITION = { x: 26, y: 24 };
const UNKNOWN_POSITION = { x: 50, y: 48 };

export default function ArrePathPhenotypeExplorerDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("unknown");
  const pos = mode === "known" ? KNOWN_POSITION : UNKNOWN_POSITION;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.12, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Phenotype fingerprint explorer</p>
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              Illustrative data
            </span>
          </div>
          <p className="text-white/35 text-[10.5px] leading-relaxed mb-5">
            Synthetic embedding, not ArrePath's real imaging data. Shape of the idea only.
          </p>

          <div className="flex rounded-full p-0.5 mb-5 w-fit" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {(["known", "unknown"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
              >
                {mode === m && (
                  <motion.div
                    layoutId="arrepath-mode-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: accentColor }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{m === "known" ? "Known mechanism compound" : "Run ARP-114 (unknown)"}</span>
              </button>
            ))}
          </div>

          <div className="relative rounded-lg overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", height: 220 }}>
            {CLUSTERS.map((cluster) => (
              <div key={cluster.id}>
                {cluster.points.map((pt, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full -ml-[3px] -mt-[3px]"
                    style={{ left: `${pt.x}%`, top: `${pt.y}%`, background: cluster.color, opacity: 0.55 }}
                  />
                ))}
                <div
                  className="absolute w-14 h-14 rounded-full -ml-7 -mt-7 pointer-events-none"
                  style={{
                    left: `${cluster.points.reduce((s, p) => s + p.x, 0) / cluster.points.length}%`,
                    top: `${cluster.points.reduce((s, p) => s + p.y, 0) / cluster.points.length}%`,
                    background: cluster.color,
                    opacity: 0.08,
                    filter: "blur(10px)",
                  }}
                />
              </div>
            ))}

            <motion.div
              className="absolute w-3.5 h-3.5 rounded-full -ml-[7px] -mt-[7px] z-10"
              style={{ background: accentColor, boxShadow: `0 0 14px ${accentColor}` }}
              animate={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            />
            <motion.div
              className="absolute -ml-1 -mt-1 rounded-full z-0"
              style={{ width: 8, height: 8, border: `2px solid ${accentColor}` }}
              animate={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                scale: [1, 2.4, 1],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                left: { type: "spring", stiffness: 260, damping: 26 },
                top: { type: "spring", stiffness: 260, damping: 26 },
                scale: { duration: 1.8, repeat: Infinity, ease: "easeOut" },
                opacity: { duration: 1.8, repeat: Infinity, ease: "easeOut" },
              }}
            />

            <div className="absolute bottom-2 left-2 flex flex-col gap-1">
              {CLUSTERS.map((c) => (
                <div key={c.id} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-white/35 text-[8.5px]">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg px-4 py-3 mt-4"
            style={{ background: mode === "unknown" ? `${accentColor}14` : "rgba(255,255,255,0.04)", border: `1px solid ${mode === "unknown" ? accentColor + "40" : "rgba(255,255,255,0.08)"}` }}
          >
            <p className="text-white text-xs font-semibold mb-1">
              {mode === "unknown" ? "ARP-114 phenotype lands outside every known cluster" : "This compound lands inside a known cluster"}
            </p>
            <p className="text-white/45 text-[11px] leading-relaxed">
              {mode === "unknown"
                ? "No mechanism assumption required to see this: the imaging phenotype alone says ARP-114 kills bacteria in a way nothing in the reference set does, before anyone has worked out how, which is the premise of the bacterial-autopsy approach."
                : "Its imaging phenotype sits inside the cell-wall-synthesis cluster, consistent with a mechanism we already have reference data for."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
