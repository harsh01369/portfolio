"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Region {
  id: number;
  type: "measured" | "generated";
  confidence: number;
  note: string;
}

// 6 columns x 4 rows, hail-damaged door panel. Center cluster is generated
// (occluded by specular glare off the dent), surrounding area is directly measured.
const GRID: Region[] = [
  { id: 1, type: "measured", confidence: 97, note: "Flat panel surface, clean lidar return." },
  { id: 2, type: "measured", confidence: 95, note: "Flat panel surface, clean lidar return." },
  { id: 3, type: "measured", confidence: 92, note: "Edge of dent cluster, partial return." },
  { id: 4, type: "measured", confidence: 93, note: "Edge of dent cluster, partial return." },
  { id: 5, type: "measured", confidence: 96, note: "Flat panel surface, clean lidar return." },
  { id: 6, type: "measured", confidence: 98, note: "Flat panel surface, clean lidar return." },
  { id: 7, type: "measured", confidence: 94, note: "Flat panel surface, clean lidar return." },
  { id: 8, type: "generated", confidence: 71, note: "Occluded by specular glare off the dent rim." },
  { id: 9, type: "generated", confidence: 58, note: "Deepest point of dent, sensor return saturated." },
  { id: 10, type: "generated", confidence: 62, note: "Dent floor, glare obscured direct measurement." },
  { id: 11, type: "measured", confidence: 90, note: "Edge of dent cluster, partial return." },
  { id: 12, type: "measured", confidence: 95, note: "Flat panel surface, clean lidar return." },
  { id: 13, type: "measured", confidence: 93, note: "Flat panel surface, clean lidar return." },
  { id: 14, type: "generated", confidence: 68, note: "Occluded by specular glare off the dent rim." },
  { id: 15, type: "generated", confidence: 74, note: "Partial occlusion, inferred from adjacent curvature." },
  { id: 16, type: "generated", confidence: 65, note: "Dent floor, glare obscured direct measurement." },
  { id: 17, type: "measured", confidence: 91, note: "Edge of dent cluster, partial return." },
  { id: 18, type: "measured", confidence: 96, note: "Flat panel surface, clean lidar return." },
  { id: 19, type: "measured", confidence: 97, note: "Flat panel surface, clean lidar return." },
  { id: 20, type: "measured", confidence: 94, note: "Flat panel surface, clean lidar return." },
  { id: 21, type: "generated", confidence: 79, note: "Partial occlusion, inferred from adjacent curvature." },
  { id: 22, type: "measured", confidence: 92, note: "Edge of dent cluster, partial return." },
  { id: 23, type: "measured", confidence: 95, note: "Flat panel surface, clean lidar return." },
  { id: 24, type: "measured", confidence: 98, note: "Flat panel surface, clean lidar return." },
];

export default function QuidientMeasuredGeneratedDemo({ accentColor, bgDark }: Props) {
  const [overlayOn, setOverlayOn] = useState(true);
  const [threshold, setThreshold] = useState(70);
  const [selected, setSelected] = useState<number>(9);

  const selectedRegion = GRID.find((r) => r.id === selected)!;
  const belowThresholdCount = GRID.filter((r) => r.confidence < threshold).length;
  const generatedCount = GRID.filter((r) => r.type === "generated").length;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Measured vs generated</p>
            <button
              onClick={() => setOverlayOn((v) => !v)}
              className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full"
              style={{
                background: overlayOn ? accentColor : "rgba(255,255,255,0.08)",
                color: overlayOn ? bgDark : "rgba(255,255,255,0.6)",
              }}
            >
              {overlayOn ? "Confidence overlay on" : "Confidence overlay off"}
            </button>
          </div>

          <p className="text-white/35 text-[9px] uppercase tracking-wider mb-2">
            Hail-damaged door panel, reconstructed scene
          </p>

          <div className="grid grid-cols-6 gap-1 mb-4 rounded-lg overflow-hidden p-1" style={{ background: "rgba(0,0,0,0.3)" }}>
            {GRID.map((region) => {
              const isSelected = region.id === selected;
              const flagged = region.confidence < threshold;
              const baseColor = region.type === "measured" ? "#1E9E6B" : "#F2994A";
              return (
                <motion.button
                  key={region.id}
                  onClick={() => setSelected(region.id)}
                  className="relative aspect-square rounded-sm"
                  style={{
                    background: overlayOn ? `${baseColor}${Math.round((region.confidence / 100) * 60 + 20).toString(16)}` : "rgba(255,255,255,0.08)",
                    outline: isSelected ? `2px solid ${accentColor}` : flagged ? "1px solid #E5484D" : "none",
                  }}
                  animate={flagged ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
                  transition={flagged ? { duration: 1.4, repeat: Infinity } : {}}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-4 mb-4 text-[9px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#1E9E6B" }} />
              <span className="text-white/45">Measured, high confidence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#F2994A" }} />
              <span className="text-white/45">Generated, inferred</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border" style={{ borderColor: "#E5484D" }} />
              <span className="text-white/45">Below threshold</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-white/35 text-[9px] uppercase tracking-wider">Review threshold</p>
              <p className="text-white text-xs font-mono tabular-nums font-semibold">{threshold}% confidence</p>
            </div>
            <input
              type="range"
              min={50}
              max={99}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{ accentColor, background: "rgba(255,255,255,0.1)" }}
            />
            <p className="text-white/30 text-[9px] mt-1">
              {belowThresholdCount} of {GRID.length} regions flagged for manual review, {generatedCount} regions
              total are generatively filled
            </p>
          </div>

          <motion.div
            key={selectedRegion.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-3.5"
            style={{
              background: selectedRegion.type === "measured" ? "rgba(30,158,107,0.08)" : "rgba(242,153,74,0.08)",
              border: `1px solid ${selectedRegion.type === "measured" ? "#1E9E6B55" : "#F2994A55"}`,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold" style={{ color: selectedRegion.type === "measured" ? "#1E9E6B" : "#F2994A" }}>
                Region {selectedRegion.id}, {selectedRegion.type === "measured" ? "directly measured" : "generatively filled"}
              </p>
              <p className="text-white/70 text-xs font-mono tabular-nums">{selectedRegion.confidence}%</p>
            </div>
            <p className="text-white/55 text-[11px] leading-relaxed">{selectedRegion.note}</p>
          </motion.div>

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Illustrative region grid for this demo only, not a real Quidient scan or customer claim.
          </p>
        </div>
      </div>
    </div>
  );
}
