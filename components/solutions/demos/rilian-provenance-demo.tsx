"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface BoardNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface LogEntry {
  id: number;
  actor: "AGENT" | "OPERATOR";
  text: string;
  time: string;
}

const NODES: BoardNode[] = [
  { id: "sensor-12", label: "Sensor 12", x: 16, y: 34 },
  { id: "relay-7", label: "Relay 7", x: 148, y: 98 },
  { id: "node-c", label: "Node C", x: 226, y: 20 },
  { id: "uplink", label: "Uplink", x: 86, y: 138 },
];

const AGENT_FLAGS = [
  "packet loss 14% over 5m, recommend reroute",
  "signal drift beyond tolerance, flagging for review",
  "unexpected idle period, possible sensor fault",
  "latency spike, auto-isolated from mesh",
];

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `T+${m}:${s}`;
}

export default function RilianProvenanceDemo({ accentColor, bgDark }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef(37);
  const [flaggedId, setFlaggedId] = useState<string>("relay-7");
  const [flagIndex, setFlagIndex] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([
    { id: 1, actor: "AGENT", text: "Flagged Relay 7, packet loss 11% over 5m", time: formatTime(12) },
    { id: 2, actor: "OPERATOR", text: "Acknowledged, holding position for diagnostics", time: formatTime(24) },
    { id: 3, actor: "AGENT", text: "Reclassified Relay 7, within tolerance, unflagging", time: formatTime(31) },
  ]);

  function pushLog(entry: Omit<LogEntry, "id" | "time">) {
    const time = formatTime(clockRef.current);
    clockRef.current += 4 + Math.round(Math.random() * 5);
    setLog((prev) => [...prev, { ...entry, id: prev.length + 1, time }].slice(-6));
  }

  function logDragEnd(label: string) {
    pushLog({ actor: "OPERATOR", text: `Repositioned ${label} on the board` });
  }

  function injectAgentFlag() {
    const node = NODES[flagIndex % NODES.length];
    const flagText = AGENT_FLAGS[flagIndex % AGENT_FLAGS.length];
    setFlaggedId(node.id);
    setFlagIndex((i) => i + 1);
    pushLog({ actor: "AGENT", text: `Flagged ${node.label}, ${flagText}` });
  }

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(70px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-4">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Shared board, provenance</p>
            <button
              onClick={injectAgentFlag}
              className="text-[10.5px] font-semibold px-3 py-1.5 rounded-full transition-colors"
              style={{ background: `${accentColor}1c`, border: `1px solid ${accentColor}55`, color: accentColor }}
            >
              Simulate agent action
            </button>
          </div>

          <div
            ref={containerRef}
            className="relative w-full h-[180px] rounded-lg mb-2 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          >
            {NODES.map((node) => {
              const isFlagged = node.id === flaggedId;
              return (
                <motion.div
                  key={node.id}
                  drag
                  dragConstraints={containerRef}
                  dragMomentum={false}
                  dragElastic={0.12}
                  onDragEnd={() => logDragEnd(node.label)}
                  whileDrag={{ scale: 1.08 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute cursor-grab active:cursor-grabbing select-none rounded-full px-2.5 py-1.5 text-[10px] font-semibold whitespace-nowrap"
                  style={{
                    x: node.x,
                    y: node.y,
                    background: isFlagged ? `${accentColor}22` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${isFlagged ? accentColor : "rgba(255,255,255,0.15)"}`,
                    color: isFlagged ? accentColor : "rgba(255,255,255,0.65)",
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    {isFlagged && (
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: accentColor }}
                        animate={{ opacity: [1, 0.25, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      />
                    )}
                    {node.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <p className="text-white/25 text-[10px] mb-4">
            Drag any node, the board is live, every move gets logged below.
          </p>

          <div className="space-y-1.5 mb-4">
            {log.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-2 text-[11px]"
              >
                <span
                  className="shrink-0 font-mono text-[9.5px] px-1.5 py-0.5 rounded tabular-nums"
                  style={{
                    background: entry.actor === "AGENT" ? `${accentColor}1c` : "rgba(255,255,255,0.06)",
                    color: entry.actor === "AGENT" ? accentColor : "rgba(255,255,255,0.55)",
                  }}
                >
                  {entry.actor}
                </span>
                <span className="text-white/55 flex-1">{entry.text}</span>
                <span className="text-white/25 font-mono text-[10px] tabular-nums shrink-0">{entry.time}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-white/25 text-[10px] leading-relaxed italic">
            Meridian is illustrative of the shared human and agent canvas described in the posting, not a confirmed
            product detail.
          </p>
        </div>
      </div>
    </div>
  );
}
