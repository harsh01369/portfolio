"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Replica {
  id: string;
  label: string;
  fetchDelayMs: number;
}

const REPLICAS: Replica[] = [
  { id: "r1", label: "replica-1", fetchDelayMs: 300 },
  { id: "r2", label: "replica-2", fetchDelayMs: 2600 },
  { id: "r3", label: "replica-3", fetchDelayMs: 900 },
];

const BASE_ROWS = 4821934;
const NEW_PART_ROWS = 12000;

export default function AltinityReplicaLagDemo({ accentColor, bgDark }: Props) {
  const [rows, setRows] = useState<Record<string, number>>({ r1: BASE_ROWS, r2: BASE_ROWS, r3: BASE_ROWS });
  const [inserted, setInserted] = useState(false);
  const [running, setRunning] = useState(false);
  const [queryResult, setQueryResult] = useState<{ replica: string; count: number } | null>(null);
  const [queryKey, setQueryKey] = useState(0);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function insertPart() {
    clearTimers();
    setRunning(true);
    setInserted(true);
    setQueryResult(null);
    setRows({ r1: BASE_ROWS, r2: BASE_ROWS, r3: BASE_ROWS });

    REPLICAS.forEach((r) => {
      const t = window.setTimeout(() => {
        setRows((prev) => ({ ...prev, [r.id]: BASE_ROWS + NEW_PART_ROWS }));
        if (r.id === REPLICAS[REPLICAS.length - 1].id) setRunning(false);
      }, r.fetchDelayMs);
      timers.current.push(t);
    });
  }

  function runQuery() {
    const picked = REPLICAS[Math.floor(Math.random() * REPLICAS.length)];
    setQueryKey((k) => k + 1);
    setQueryResult({ replica: picked.label, count: rows[picked.id] });
  }

  const allSynced = REPLICAS.every((r) => rows[r.id] === BASE_ROWS + NEW_PART_ROWS);

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
          <span className="text-[10.5px] text-white/40 ml-2">altinity.cloud :: shard-01 replicas</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            ReplicatedMergeTree replicas fetch new parts asynchronously, each on its own schedule. A
            <span style={{ color: accentColor }}> SELECT count(*)</span> against this shard hits whichever
            replica the load balancer picks, not necessarily the one that finished syncing.
          </p>

          <div className="space-y-1.5 mb-4">
            {REPLICAS.map((r) => {
              const synced = rows[r.id] === BASE_ROWS + NEW_PART_ROWS;
              const lagging = inserted && !synced;
              return (
                <div
                  key={r.id}
                  className="rounded-lg px-3 py-2.5 flex items-center justify-between"
                  style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${lagging ? "#f59e0b55" : "rgba(255,255,255,0.07)"}` }}
                >
                  <div className="flex items-center gap-2">
                    <motion.span
                      key={`${r.id}-${synced}`}
                      initial={{ scale: 0.6, opacity: 0.4 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: lagging ? "#f59e0b" : synced && inserted ? "#22c55e" : "rgba(255,255,255,0.3)" }}
                    />
                    <span className="text-[10.5px] text-white/75">{r.label}</span>
                  </div>
                  <span className="text-[10px] tabular-nums" style={{ color: lagging ? "#f59e0b" : accentColor }}>
                    {rows[r.id].toLocaleString()} rows{lagging ? " (fetching part...)" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={insertPart}
              disabled={running}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity disabled:opacity-50"
              style={{ background: accentColor, color: bgDark }}
            >
              INSERT 12,000 rows
            </button>
            <button
              onClick={runQuery}
              disabled={!inserted}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity disabled:opacity-40"
              style={{ background: "rgba(255,255,255,0.08)", color: "white" }}
            >
              SELECT count(*), random replica
            </button>
          </div>

          <AnimatePresence mode="wait">
            {queryResult && (
              <motion.div
                key={queryKey}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg px-3 py-2.5"
                style={{
                  background: queryResult.count === BASE_ROWS + NEW_PART_ROWS ? "rgba(255,255,255,0.03)" : "#f59e0b14",
                  border: `1px solid ${queryResult.count === BASE_ROWS + NEW_PART_ROWS ? "rgba(255,255,255,0.08)" : "#f59e0b55"}`,
                }}
              >
                <p className="text-[10.5px] text-white/70">
                  Routed to <span style={{ color: accentColor }}>{queryResult.replica}</span>:{" "}
                  <span className="tabular-nums font-semibold">{queryResult.count.toLocaleString()}</span>
                </p>
                {queryResult.count !== BASE_ROWS + NEW_PART_ROWS && (
                  <p className="text-[9.5px] text-amber-300/80 mt-1">
                    12,000 rows short of the other two replicas, same query, same shard, different answer.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {inserted && allSynced && (
            <p className="text-[9.5px] text-white/35 mt-3">All three replicas caught up, count(*) is now consistent regardless of which one answers.</p>
          )}
        </div>
      </div>
    </div>
  );
}
