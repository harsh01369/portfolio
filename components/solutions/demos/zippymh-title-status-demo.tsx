"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Status = "chattel" | "retired";

export default function ZippyMHTitleStatusDemo({ accentColor, bgDark }: Props) {
  const [status, setStatus] = useState<Status>("chattel");

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
          <span className="text-[10.5px] text-white/40 ml-2">underwriting :: same home, same land, same owner</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Owning the land underneath a manufactured home doesn't make it real property. The home stays legally
            chattel until the personal-property title is actually retired with the state, paperwork, not physics.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setStatus("chattel")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: status === "chattel" ? accentColor : "rgba(255,255,255,0.08)", color: status === "chattel" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              title not yet retired
            </button>
            <button
              onClick={() => setStatus("retired")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: status === "retired" ? accentColor : "rgba(255,255,255,0.08)", color: status === "retired" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              title retired with state
            </button>
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span className="text-[9.5px] text-white/55">Applicant owns the land, home is permanently affixed, same application either way</span>
          </div>

          <div className="space-y-2 mb-4">
            <div
              className="rounded-lg px-3 py-2.5"
              style={{
                background: status === "chattel" ? `${accentColor}18` : "rgba(255,255,255,0.025)",
                border: status === "chattel" ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">legal classification</span>
                <span className="text-[9.5px] font-semibold" style={{ color: accentColor }}>
                  {status === "chattel" ? "personal property (chattel)" : "real property"}
                </span>
              </div>
            </div>
            <div
              className="rounded-lg px-3 py-2.5"
              style={{
                background: status === "chattel" ? `${accentColor}18` : "rgba(255,255,255,0.025)",
                border: status === "chattel" ? `1px solid ${accentColor}66` : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">loan terms available</span>
                <span className="text-[9.5px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {status === "chattel" ? "chattel: higher rate, 15-25yr, fewer protections" : "standard mortgage: lower rate, up to 30yr"}
                </span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${accentColor}44` }}
          >
            <motion.p key={status} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {status === "chattel"
                ? "Underwriting this as real property because the owner holds the land would misclassify the collateral, the retirement filing is what actually changes the lien and the terms, not land ownership alone."
                : "Only once the title's been retired with the state does the home convert to real property, now a standard mortgage, same physical home as before."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
