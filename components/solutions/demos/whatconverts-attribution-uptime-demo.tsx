"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Status = "normal" | "incident";

const STAGES = ["Call/form captured", "Attribution matched", "Client report updated"];

export default function WhatConvertsAttributionUptimeDemo({ accentColor, bgDark }: Props) {
  const [status, setStatus] = useState<Status>("normal");
  const [secondsLeft, setSecondsLeft] = useState(254);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 254));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const legacy =
    status === "normal"
      ? { captured: 48, attributed: 48, lost: 0 }
      : { captured: 48, attributed: 31, lost: 17 };
  const whatconverts =
    status === "normal"
      ? { captured: 48, attributed: 48, lost: 0 }
      : { captured: 48, attributed: 48, lost: 0 };

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Attribution pipeline uptime</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["normal", "incident"] as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: status === s ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {status === s && (
                    <motion.div
                      layoutId="wc-status-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{s === "normal" ? "Normal operation" : "Inject instance failure"}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="flex items-center justify-between rounded-lg px-3.5 py-2 mb-4"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-white/40 text-[10px] uppercase tracking-wider">Agency report due to client</span>
            <span className="text-white text-xs font-mono tabular-nums font-semibold">
              {mm}:{ss}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "legacy", label: "Legacy pipeline", data: legacy, good: false },
              { key: "wc", label: "WhatConverts pipeline", data: whatconverts, good: true },
            ].map(({ key, label, data, good }) => (
              <div
                key={key}
                className="rounded-xl p-3.5"
                style={{
                  background: good ? `${accentColor}0F` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${good ? `${accentColor}44` : "rgba(255,255,255,0.08)"}`,
                }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wide mb-3"
                  style={{ color: good ? accentColor : "rgba(255,255,255,0.45)" }}
                >
                  {label}
                </p>
                <div className="space-y-2 mb-3">
                  {STAGES.map((stage, i) => {
                    const stalls = !good && status === "incident" && i >= 1;
                    return (
                      <div key={stage} className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{
                            background: stalls ? "#F05252" : good ? accentColor : "rgba(255,255,255,0.5)",
                          }}
                        />
                        <span
                          className="text-[10.5px]"
                          style={{ color: stalls ? "#F09A9A" : "rgba(255,255,255,0.7)" }}
                        >
                          {stage}
                          {stalls && i === 1 ? " (lag)" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-white/40">Captured</span>
                    <span className="text-white font-mono tabular-nums">{data.captured}</span>
                  </div>
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-white/40">Attributed</span>
                    <span className="text-white font-mono tabular-nums">{data.attributed}</span>
                  </div>
                  <div className="flex justify-between text-[10.5px]">
                    <span className="text-white/40">Lost / misattributed</span>
                    <span
                      className="font-mono tabular-nums font-semibold"
                      style={{ color: data.lost > 0 ? "#F05252" : "rgba(255,255,255,0.5)" }}
                    >
                      {data.lost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            {status === "incident"
              ? "During a simulated instance failure, the legacy pipeline silently drops attribution on 17 of 48 leads before the client ever sees the report. Failover keeps the second pipeline intact."
              : "Both pipelines agree under normal conditions. Inject an instance failure to see where that stops being true."}
          </p>
        </div>
      </div>
    </div>
  );
}
