"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function EntanglAsbuiltDriftDemo({ accentColor, bgDark }: Props) {
  const [useAsBuilt, setUseAsBuilt] = useState(false);

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
          <span className="text-[10.5px] text-white/40 ml-2">procedure-gen :: CRAC unit filter replacement, room 4</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A maintenance procedure generated from facility drawings is only as good as how
            recently the physical equipment matched those drawings. Units get swapped. Drawings
            don't always get updated the same day.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setUseAsBuilt(false)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: !useAsBuilt ? accentColor : "rgba(255,255,255,0.08)", color: !useAsBuilt ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              design drawing (2023)
            </button>
            <button
              onClick={() => setUseAsBuilt(true)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: useAsBuilt ? accentColor : "rgba(255,255,255,0.08)", color: useAsBuilt ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              equipment record (as installed)
            </button>
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/55">unit model on file</span>
              <motion.span key={String(useAsBuilt)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10.5px] font-semibold" style={{ color: accentColor }}>
                {useAsBuilt ? "Liebert CRV, swapped 2025" : "Liebert DS, original 2023 spec"}
              </motion.span>
            </div>
            <span className="text-[9px] text-white/35">{useAsBuilt ? "matches what's physically in room 4 today" : "matches the drawing, not the current unit"}</span>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: useAsBuilt ? "#22c55e14" : "#ef444414", border: `1px solid ${useAsBuilt ? "#22c55e55" : "#ef444455"}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: useAsBuilt ? "#86efac" : "#fca5a5" }}>
              {useAsBuilt
                ? "Generated against the equipment record, the procedure references the right filter part number and the right shutdown sequence for the unit that's actually bolted into room 4."
                : "Generated against the 2023 drawing, the procedure references a filter part number and shutdown sequence for a unit model that isn't the one physically in room 4 anymore. A technician following it exactly still gets the wrong part."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
