"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface DataCenter {
  id: string;
  label: string;
  region: string;
}

const DATA_CENTERS: DataCenter[] = [
  { id: "use", label: "us-east-1", region: "Virginia" },
  { id: "euw", label: "eu-west-1", region: "Ireland" },
  { id: "apse", label: "ap-southeast-1", region: "Singapore" },
];

const ORG_LIMIT = 500; // configured org-wide limit, req/min
const BURST_PER_DC = 420; // traffic hitting each DC at once in the burst

export default function TykMdcbQuotaDemo({ accentColor, bgDark }: Props) {
  const [counts, setCounts] = useState<Record<string, number>>({ use: 0, euw: 0, apse: 0 });
  const [running, setRunning] = useState(false);
  const [synced, setSynced] = useState(true);
  const [runKey, setRunKey] = useState(0);
  const timers = useRef<number[]>([]);

  const total = counts.use + counts.euw + counts.apse;
  const overLimit = total > ORG_LIMIT;

  function clearTimers() {
    timers.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
  }

  function sendBurst() {
    clearTimers();
    setRunKey((k) => k + 1);
    setRunning(true);
    setSynced(false);
    setCounts({ use: 0, euw: 0, apse: 0 });

    DATA_CENTERS.forEach((dc, i) => {
      let current = 0;
      const step = Math.ceil(BURST_PER_DC / 24);
      const t = window.setInterval(() => {
        current = Math.min(BURST_PER_DC, current + step);
        setCounts((prev) => ({ ...prev, [dc.id]: current }));
        if (current >= BURST_PER_DC) {
          window.clearInterval(t);
          if (dc.id === DATA_CENTERS[DATA_CENTERS.length - 1].id) setRunning(false);
        }
      }, 45 + i * 10);
      timers.current.push(t);
    });
  }

  function syncPolicy() {
    setSynced(true);
  }

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
          <span className="text-[10.5px] text-white/40 ml-2">tyk-mdcb :: org-quota-monitor</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Org limit is <span style={{ color: accentColor }}>{ORG_LIMIT} req/min</span>, pushed down from the
            control plane. Each data center enforces it against its own local cache, there's no live shared
            counter between them until the next policy sync.
          </p>

          <div className="space-y-2 mb-4">
            {DATA_CENTERS.map((dc) => {
              const count = counts[dc.id];
              const pct = Math.min(100, (count / BURST_PER_DC) * 100);
              const dcOver = count > ORG_LIMIT;
              return (
                <div key={dc.id} className="rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10.5px] text-white/75">{dc.label}</span>
                    <span className="text-[9px] text-white/35">{dc.region}</span>
                    <span className="text-[10px] tabular-nums" style={{ color: dcOver ? "#ef4444" : accentColor }}>
                      {count} <span className="text-white/30">/ {ORG_LIMIT} local cap</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: dcOver ? "#ef4444" : accentColor }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4 flex items-center justify-between"
            style={{ background: overLimit ? "#ef444414" : "rgba(255,255,255,0.03)", border: `1px solid ${overLimit ? "#ef444455" : "rgba(255,255,255,0.08)"}` }}
          >
            <span className="text-[10.5px] text-white/70">Actual combined rate, all regions</span>
            <motion.span
              key={`${total}-${runKey}`}
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              className="text-[13px] font-semibold tabular-nums"
              style={{ color: overLimit ? "#ef4444" : accentColor }}
            >
              {total} req/min
            </motion.span>
          </div>

          <p className="text-[9.5px] leading-relaxed mb-4" style={{ color: overLimit ? "#fca5a5" : "rgba(255,255,255,0.35)" }}>
            {overLimit
              ? `${total} is ${total - ORG_LIMIT} over the configured ${ORG_LIMIT}/min org limit. Each region's gateway thinks it's still within bounds, because locally it is.`
              : synced
              ? "Policy synced. All regions agree on the current allocation."
              : "Awaiting next policy sync from the control plane."}
          </p>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={sendBurst}
              disabled={running}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity disabled:opacity-50"
              style={{ background: accentColor, color: bgDark }}
            >
              Send synchronized burst, all 3 regions
            </button>
            <button
              onClick={syncPolicy}
              disabled={running || synced}
              className="text-[10px] text-white/45 underline decoration-white/20 disabled:opacity-40"
            >
              Trigger policy sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
