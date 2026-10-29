"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "latest" | "today";

export default function GeovisualStalePassDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("latest");

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
          <span className="text-[10.5px] text-white/40 ml-2">Sentinel Hub :: Block 14, lettuce, Salinas Valley</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Sentinel-2 revisits a field roughly every 5 days, and cloud cover can erase a pass entirely.
            "Latest available image" and "what the field looks like right now" aren't always the same thing.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("latest")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "latest" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "latest" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              latest available image
            </button>
            <button
              onClick={() => setMode("today")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "today" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "today" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              actual conditions today
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">NDVI snapshot shown on dashboard</span>
                <span className="text-[9.5px] text-white/60">{mode === "latest" ? "0.71, captured 18 days ago" : "unknown, no cloud-free pass since"}</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">passes since, lost to cloud cover</span>
                <span className="text-[9.5px] text-white/60">3 consecutive passes</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "today" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "today" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "latest"
                ? "The grower sees a healthy 0.71 NDVI and a timestamp that just says the date it was captured, not how many passes have failed since. Whatever's actually happening in Block 14 for the last 18 days isn't in this number."
                : "Three cloud-covered passes in a row means there's no new optical read at all, not a stale one, an absent one. A disease outbreak or irrigation failure in that window wouldn't show up until the next clear sky, however far off that is."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
