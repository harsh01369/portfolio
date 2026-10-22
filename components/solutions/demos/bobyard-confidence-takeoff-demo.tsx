"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface TakeoffItem {
  id: string;
  label: string;
  unit: string;
  qty: number;
  confidence: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

const INITIAL_ITEMS: TakeoffItem[] = [
  { id: "a", label: "Drywall, Room A", unit: "sq ft", qty: 412, confidence: 94, x: 8, y: 10, w: 90, h: 70 },
  { id: "b", label: "Flooring, Hallway", unit: "sq ft", qty: 118, confidence: 61, x: 104, y: 10, w: 48, h: 70 },
  { id: "c", label: "Drywall, Room B", unit: "sq ft", qty: 356, confidence: 88, x: 158, y: 10, w: 90, h: 70 },
  { id: "d", label: "Window trim, East wall", unit: "lin ft", qty: 42, confidence: 53, x: 8, y: 88, w: 90, h: 44 },
  { id: "e", label: "Baseboard, Room A + B", unit: "lin ft", qty: 206, confidence: 91, x: 104, y: 88, w: 144, h: 44 },
];

export default function BobyardConfidenceTakeoffDemo({ accentColor, bgDark }: Props) {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [editing, setEditing] = useState<string | null>(null);

  const adjust = (id: string, delta: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it)));
  };

  const confirm = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, confidence: 100 } : it)));
    setEditing(null);
  };

  const lowCount = items.filter((i) => i.confidence < 85).length;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Confidence-driven takeoff</p>
            <span
              className="text-[9px] font-semibold px-2 py-1 rounded-full tabular-nums"
              style={{ background: "rgba(255,170,60,0.15)", color: "#ffaa3c", border: "1px solid rgba(255,170,60,0.35)" }}
            >
              {lowCount} need review
            </span>
          </div>

          <div
            className="relative rounded-xl mb-4"
            style={{ height: 150, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {items.map((it) => {
              const low = it.confidence < 85;
              return (
                <motion.button
                  key={it.id}
                  onClick={() => low && setEditing(editing === it.id ? null : it.id)}
                  className="absolute rounded-md flex items-center justify-center text-center px-1"
                  style={{
                    left: it.x,
                    top: it.y,
                    width: it.w,
                    height: it.h,
                    background: low ? "rgba(255,170,60,0.06)" : `${accentColor}10`,
                    border: low ? "1.5px dashed #ffaa3c" : `1.5px solid ${accentColor}`,
                    cursor: low ? "pointer" : "default",
                  }}
                  animate={low ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
                  transition={low ? { duration: 1.6, repeat: Infinity } : {}}
                >
                  <span className="text-white/60 text-[8px] leading-tight">{it.label}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="space-y-2">
            {items.map((it) => {
              const low = it.confidence < 85;
              return (
                <div
                  key={it.id}
                  className="rounded-lg px-3.5 py-2.5"
                  style={{
                    background: low ? "rgba(255,170,60,0.06)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${low ? "rgba(255,170,60,0.3)" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-white/80 text-[11px] font-medium">{it.label}</p>
                      <p className="text-white/40 text-[10px] tabular-nums mt-0.5">
                        {it.qty.toLocaleString()} {it.unit} ·{" "}
                        <span style={{ color: low ? "#ffaa3c" : accentColor }}>{it.confidence}% confidence</span>
                      </p>
                    </div>
                    {low ? (
                      <button
                        onClick={() => setEditing(editing === it.id ? null : it.id)}
                        className="shrink-0 text-[10px] font-semibold px-3 py-1.5 rounded-full"
                        style={{ background: "rgba(255,170,60,0.18)", color: "#ffaa3c" }}
                      >
                        quick correct
                      </button>
                    ) : (
                      <span
                        className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                        style={{ background: `${accentColor}1a`, color: accentColor }}
                      >
                        confirmed
                      </span>
                    )}
                  </div>

                  <AnimatePresence>
                    {editing === it.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-2 mt-2.5 pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                          <button
                            onClick={() => adjust(it.id, -1)}
                            className="w-6 h-6 rounded-md text-white/70 text-xs font-bold"
                            style={{ background: "rgba(255,255,255,0.08)" }}
                          >
                            −
                          </button>
                          <span className="text-white text-xs font-semibold tabular-nums w-16 text-center">
                            {it.qty} {it.unit}
                          </span>
                          <button
                            onClick={() => adjust(it.id, 1)}
                            className="w-6 h-6 rounded-md text-white/70 text-xs font-bold"
                            style={{ background: "rgba(255,255,255,0.08)" }}
                          >
                            +
                          </button>
                          <button
                            onClick={() => confirm(it.id)}
                            className="ml-auto text-[10px] font-semibold px-3 py-1.5 rounded-full"
                            style={{ background: accentColor, color: bgDark }}
                          >
                            Confirm quantity
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <p className="text-white/35 text-[10px] leading-relaxed mt-4">
            Solid outlines mean the model is confident, dashed and pulsing means it wants a second look. Correcting a
            low-confidence item is a tap and a nudge, not a from-scratch re-measure. Sample drawing, built for this
            demo only.
          </p>
        </div>
      </div>
    </div>
  );
}
