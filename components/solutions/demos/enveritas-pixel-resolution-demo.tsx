"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type ResKey = "landsat" | "copernicus" | "enveritas";

const RESOLUTIONS: Record<ResKey, { label: string; meters: number; cells: number; flagged: boolean }> = {
  landsat: { label: "Landsat (30m)", meters: 30, cells: 4, flagged: true },
  copernicus: { label: "Copernicus (10m)", meters: 10, cells: 8, flagged: true },
  enveritas: { label: "Enveritas (0.5m)", meters: 0.5, cells: 24, flagged: false },
};

export default function EnveritasPixelResolutionDemo({ accentColor, bgDark }: Props) {
  const [res, setRes] = useState<ResKey>("landsat");
  const config = RESOLUTIONS[res];

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
          <span className="text-[10.5px] text-white/40 ml-2">eudr :: plot vs. deforested area, 0.4ha farm</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A 0.4 hectare farm sits right next to a deforested patch. Whether the farm "overlaps"
            that patch depends entirely on how coarse the pixel grid is, not on whether the farmer
            actually cleared anything.
          </p>

          <div className="flex items-center gap-2 mb-4">
            {(Object.keys(RESOLUTIONS) as ResKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setRes(k)}
                className="text-[10px] px-2.5 py-1 rounded-md"
                style={{ background: res === k ? accentColor : "rgba(255,255,255,0.08)", color: res === k ? bgDark : "rgba(255,255,255,0.6)" }}
              >
                {RESOLUTIONS[k].label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center mb-4">
            <div
              className="grid gap-[1px] p-1 rounded"
              style={{
                gridTemplateColumns: `repeat(${config.cells}, 1fr)`,
                background: "rgba(255,255,255,0.08)",
                width: "280px",
                aspectRatio: "1",
              }}
            >
              {Array.from({ length: config.cells * config.cells }).map((_, i) => {
                const row = Math.floor(i / config.cells);
                const col = i % config.cells;
                const isFarm = col < config.cells * 0.55;
                const isDeforested = col >= config.cells * 0.45;
                const flaggedCell = config.flagged && isFarm && isDeforested && row > config.cells * 0.3 && row < config.cells * 0.7;
                return (
                  <div
                    key={i}
                    style={{
                      background: flaggedCell ? "#ef4444" : isFarm ? "#4ade8055" : isDeforested ? "#92400e77" : "rgba(255,255,255,0.03)",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: config.flagged ? "#ef444414" : "#22c55e14", border: `1px solid ${config.flagged ? "#ef444455" : "#22c55e55"}` }}
          >
            <motion.p
              key={res}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9.5px] leading-relaxed"
              style={{ color: config.flagged ? "#fca5a5" : "#86efac" }}
            >
              {config.flagged
                ? `At ${config.meters}m pixels, the boundary cell between the plot and the deforested patch gets classified as overlap. The farm gets flagged non-compliant, even though no clearing happened inside its actual boundary.`
                : "At 0.5m, individual pixels resolve the real edge. The plot and the deforested patch sit next to each other with no overlap, same farm, same patch, different conclusion."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
