"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type DeviceClass = "routers" | "switches" | "firewalls";
type CheckStatus = "pass" | "fail" | "pending";

interface CheckDef {
  id: string;
  name: string;
  deviceClass: DeviceClass;
  query: string[];
  affected: boolean;
  resultIfRun: CheckStatus;
  violation?: string;
}

const CHECKS: CheckDef[] = [
  {
    id: "fw-inbound",
    name: "No edge firewall permits inbound any/any",
    deviceClass: "firewalls",
    query: ["check inboundAnyAny =", "  foreach interfaces[edgeFacing]", "  where acl.permits(any, any)", "  emit violation"],
    affected: true,
    resultIfRun: "fail",
    violation: "GigabitEthernet0/1 on edge-fw-02 now permits any any inbound, matched by acl.permits(any, any).",
  },
  {
    id: "bogon-deny",
    name: "Provider ACLs deny bogon source ranges",
    deviceClass: "firewalls",
    query: ["check bogonDeny =", "  foreach providerAcls", "  where !denies(bogonRanges)", "  emit violation"],
    affected: true,
    resultIfRun: "pass",
  },
  {
    id: "bgp-maxprefix",
    name: "Every BGP peer has a max-prefix limit",
    deviceClass: "routers",
    query: ["check bgpMaxPrefix =", "  foreach bgpNeighbors", "  where maxPrefixLimit == null", "  emit violation"],
    affected: false,
    resultIfRun: "pass",
  },
  {
    id: "vlan-trunk",
    name: "No VLAN mismatch across trunk links",
    deviceClass: "switches",
    query: ["check vlanTrunkMatch =", "  foreach trunkLinks", "  where localVlans != remoteVlans", "  emit violation"],
    affected: false,
    resultIfRun: "pass",
  },
];

const CLASS_DELAY_MS: Record<DeviceClass, number> = { routers: 650, switches: 1300, firewalls: 2400 };
const CLASS_LABEL: Record<DeviceClass, string> = { routers: "routers", switches: "switches", firewalls: "firewalls" };

interface LiveState {
  status: CheckStatus;
  resolved: boolean;
}

function initialStates(): Record<string, LiveState> {
  const s: Record<string, LiveState> = {};
  for (const c of CHECKS) s[c.id] = { status: "pass", resolved: true };
  return s;
}

export default function ForwardTwinFreshnessDemo({ accentColor, bgDark }: Props) {
  const [predictOnly, setPredictOnly] = useState(false);
  const [lastRunPredicted, setLastRunPredicted] = useState(false);
  const [states, setStates] = useState<Record<string, LiveState>>(initialStates());
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const timers = useRef<number[]>([]);

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function push() {
    clearTimers();
    setRunKey((k) => k + 1);
    setRunning(true);
    setLastRunPredicted(predictOnly);

    const next: Record<string, LiveState> = {};
    for (const c of CHECKS) {
      next[c.id] = c.affected ? { status: "pending", resolved: false } : { status: c.resultIfRun, resolved: true };
    }
    setStates(next);

    const affectedChecks = CHECKS.filter((c) => c.affected);
    let resolvedCount = 0;
    affectedChecks.forEach((c) => {
      const t = window.setTimeout(() => {
        setStates((prev) => ({ ...prev, [c.id]: { status: c.resultIfRun, resolved: true } }));
        resolvedCount += 1;
        if (resolvedCount === affectedChecks.length) setRunning(false);
      }, CLASS_DELAY_MS[c.deviceClass]);
      timers.current.push(t);
    });
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
          <span className="text-[10.5px] text-white/40 ml-2">forward-enterprise :: verify</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Each check below is a query with a <span style={{ color: accentColor }}>violation</span> field, run
            against the twin. A check only turns green once its own device class has reported fresh state, not the
            moment the twin decides nothing is wrong yet.
          </p>

          <div className="rounded-lg p-3 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1.5">Change queued on edge-fw-02</p>
            <p className="text-[11px] leading-relaxed">
              <span style={{ color: "#ef4444" }}>- deny any any log</span>
              <br />
              <span style={{ color: "#22c55e" }}>+ permit any any</span>
            </p>
          </div>

          <div className="space-y-1.5 mb-4">
            {CHECKS.map((c) => {
              const live = states[c.id];
              const predicted = live.resolved && lastRunPredicted;
              const color = predicted
                ? accentColor
                : live.status === "fail"
                ? "#ef4444"
                : live.status === "pending"
                ? "#f59e0b"
                : "#22c55e";
              return (
                <div
                  key={c.id}
                  className="rounded-lg px-3 py-2.5"
                  style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${live.status === "fail" && !predicted ? "#ef444455" : "rgba(255,255,255,0.07)"}` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <motion.span
                        key={`${c.id}-${runKey}-${live.status}`}
                        initial={{ scale: 0.6, opacity: 0.4 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      <span className="text-[10.5px] text-white/75 truncate">{c.name}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wide flex-shrink-0" style={{ color }}>
                      {live.status === "pending" ? "verifying" : predicted ? `${live.status} (predicted)` : live.status}
                    </span>
                  </div>
                  <p className="text-white/25 text-[9px] mt-1 pl-3.5">
                    {live.resolved
                      ? predicted
                        ? `predicted against ${CLASS_LABEL[c.deviceClass]} state, not applied to the real network`
                        : `confirmed against ${CLASS_LABEL[c.deviceClass]}, just reported`
                      : `waiting on ${CLASS_LABEL[c.deviceClass]} to report state`}
                  </p>
                  <AnimatePresence>
                    {live.status === "fail" && live.resolved && c.violation && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[9.5px] leading-relaxed mt-1.5 pl-3.5"
                        style={{ color: "#fca5a5" }}
                      >
                        {c.violation}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={push}
              disabled={running}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity disabled:opacity-50"
              style={{ background: accentColor, color: bgDark }}
            >
              {predictOnly ? "Predict impact" : "Push and verify"}
            </button>
            <button
              onClick={() => setPredictOnly((p) => !p)}
              className="flex items-center gap-1.5 text-[10px] text-white/45"
            >
              <span
                className="w-7 h-4 rounded-full relative transition-colors"
                style={{ background: predictOnly ? accentColor : "rgba(255,255,255,0.12)" }}
              >
                <motion.span
                  className="absolute top-0.5 w-3 h-3 rounded-full bg-white"
                  animate={{ left: predictOnly ? 14 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 34 }}
                />
              </span>
              predict only, do not apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
