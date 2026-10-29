"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "lidar" | "resurveyed";

export default function AuroraLidarSnapshotDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("lidar");

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
          <span className="text-[10.5px] text-white/40 ml-2">rooftop design :: 142 Birchwood Dr</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            LIDAR shading is a snapshot in time, captured whenever the survey flight happened. Aurora's own help
            docs flag exactly this case: a customer who removed shade trees after that flight still shows shaded panels.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("lidar")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "lidar" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "lidar" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              LIDAR shading, as captured
            </button>
            <button
              onClick={() => setMode("resurveyed")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "resurveyed" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "resurveyed" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              trees removed, LIDAR shading off
            </button>
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-[9.5px] text-white/55">LIDAR capture date: 14 months ago. Two oak trees on the south side were removed last spring.</span>
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{
              background: mode === "resurveyed" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "resurveyed" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] text-white/55">south-facing array, modeled annual production</span>
              <span className="text-[9.5px] font-semibold" style={{ color: mode === "resurveyed" ? accentColor : "#f59e0b" }}>
                {mode === "lidar" ? "shaded by trees that no longer exist" : "full sun, matches current site"}
              </span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <p className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "lidar"
                ? "The model is physically accurate for the day the plane flew, not for today. Nothing in the design flags that the trees are gone unless someone turns LIDAR shading off and re-verifies on site."
                : "Turning off LIDAR shading for this obstruction and confirming on site brings the design back in line with what the roof actually looks like now."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
