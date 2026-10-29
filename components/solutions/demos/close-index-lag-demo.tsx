"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "search" | "mongo";

export default function CloseIndexLagDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("search");

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
          <span className="text-[10.5px] text-white/40 ml-2">lead #4471 :: rep marks "Closed Lost", 4 seconds ago</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Billions of Mongo documents with Elasticsearch underneath means two sources of truth with two
            different clocks. An agent retrieving through search doesn't see what Mongo already knows.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("search")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "search" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "search" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              agent reads via Elasticsearch
            </button>
            <button
              onClick={() => setMode("mongo")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "mongo" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "mongo" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              reads straight from Mongo
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">status in MongoDB, the system of record</span>
                <span className="text-[9.5px] text-white/60">Closed Lost</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">status the agent sees</span>
                <span className="text-[9.5px] text-white/60">{mode === "search" ? "Open, index not caught up" : "Closed Lost"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "mongo" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "mongo" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "search"
                ? "An agent queued a follow-up the moment this lead looked open. By the time it runs, a human already closed it as lost, but the agent's view of the world is still a few seconds behind the write that mattered."
                : "Reading the field the rep actually touched means the agent sees the close the instant it happens, no reindex to wait on, at the cost of giving up Elasticsearch's retrieval and ranking for that read."
              }
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
