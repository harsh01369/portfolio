"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "unscoped" | "scoped";

export default function HostfullyCrossPropertyDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("unscoped");

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
          <span className="text-[10.5px] text-white/40 ml-2">AI concierge :: guest at Unit B asks about wifi</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            One host runs twelve properties, each with its own guidebook. Retrieval that isn't locked to the
            guest's actual reservation can confidently answer with the wrong property's details.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("unscoped")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "unscoped" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "unscoped" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              top-k across portfolio
            </button>
            <button
              onClick={() => setMode("scoped")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "scoped" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "scoped" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              scoped to reservation
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">guest's actual reservation</span>
                <span className="text-[9.5px] text-white/60">Unit B, Oceanview Row</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">guidebook chunk retrieved for "wifi password"</span>
                <span className="text-[9.5px] text-white/60">{mode === "unscoped" ? "Unit A, higher semantic score" : "Unit B, the one booked"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "scoped" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "scoped" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "unscoped"
                ? "Unit A's guidebook happens to phrase its wifi section in a way that scores higher against this exact question, so the guest in Unit B gets Unit A's network name and password, stated with full confidence."
                : "The retrieval step is filtered to this reservation's property ID before ranking runs at all, so there's no chunk from any other unit in the candidate set to begin with, regardless of how well it would have scored."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
