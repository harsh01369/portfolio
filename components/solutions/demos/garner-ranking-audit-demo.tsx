"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type View = "before" | "after";

interface Provider {
  id: string;
  name: string;
  specialty: string;
  before: number;
  after: number;
  drivingMetric: string;
  flagged: boolean;
}

const PROVIDERS: Provider[] = [
  { id: "p1", name: "Dr. N. Osei", specialty: "Orthopedic Surgery", before: 94, after: 95, drivingMetric: "Revision-surgery rate, weight unchanged", flagged: false },
  { id: "p2", name: "Dr. L. Farrow", specialty: "Orthopedic Surgery", before: 81, after: 82, drivingMetric: "Readmission rate, weight unchanged", flagged: false },
  { id: "p3", name: "Riverside Ortho Group", specialty: "Orthopedic Surgery", before: 63, after: 86, drivingMetric: "Patient wait-time metric reweighted 3x", flagged: true },
  { id: "p4", name: "Dr. S. Tran", specialty: "Orthopedic Surgery", before: 77, after: 75, drivingMetric: "Complication rate, weight unchanged", flagged: false },
  { id: "p5", name: "Dr. M. Oyelaran", specialty: "Orthopedic Surgery", before: 70, after: 68, drivingMetric: "Patient-reported outcome, weight unchanged", flagged: false },
];

function rankOf(list: Provider[], view: View): Provider[] {
  return [...list].sort((a, b) => (view === "before" ? b.before - a.before : b.after - a.after));
}

export default function GarnerRankingAuditDemo({ accentColor, bgDark }: Props) {
  const [view, setView] = useState<View>("before");
  const ranked = rankOf(PROVIDERS, view);
  const moved = PROVIDERS.filter((p) => p.before !== p.after).length;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Ranking change auditor</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["before", "after"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: view === v ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {view === v && (
                    <motion.div
                      layoutId="garner-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{v === "before" ? "Before PR" : "After PR"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {ranked.map((p, i) => {
                const score = view === "before" ? p.before : p.after;
                const delta = p.after - p.before;
                return (
                  <motion.div
                    key={p.id}
                    layout
                    layoutId={p.id}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    className="rounded-lg px-3.5 py-2.5"
                    style={{
                      background: p.flagged && view === "after" ? `${accentColor}14` : "rgba(255,255,255,0.04)",
                      border: `1px solid ${p.flagged && view === "after" ? accentColor + "55" : "rgba(255,255,255,0.08)"}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-[11px] font-mono tabular-nums w-4 flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{p.name}</p>
                        <p className="text-white/40 text-[10px] truncate">{p.specialty}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: p.flagged && view === "after" ? accentColor : "rgba(255,255,255,0.35)" }}
                            animate={{ width: `${score}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        </div>
                        <span className="text-white text-[11px] font-mono tabular-nums font-bold w-7 text-right">
                          {score}
                        </span>
                      </div>
                    </div>
                    {view === "after" && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[10px] mt-1.5 ml-7 leading-tight"
                        style={{ color: p.flagged ? accentColor : "rgba(255,255,255,0.35)" }}
                      >
                        {delta !== 0 ? (delta > 0 ? "+" : "") + delta : "±0"} pts · {p.drivingMetric}
                        {p.flagged && " — flagged for review"}
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          <div
            className="rounded-lg px-4 py-3 mt-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-white text-xs font-semibold mb-1">
              {view === "after"
                ? `${moved} of ${PROVIDERS.length} providers reordered by this change`
                : "Baseline ranking, before the proposed reweight"}
            </p>
            <p className="text-white/45 text-[11px] leading-relaxed">
              {view === "after"
                ? "Riverside Ortho Group jumped 23 points and three ranks on a single reweighted metric, not a broad quality improvement. That's exactly the pattern this auditor exists to surface before it merges, since no provider can pay for placement, a change that quietly behaves like paid placement has to be caught here."
                : "Switch to “After PR” to see the same scoring run with a proposed metric reweight applied, and which specific metric moved each provider."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
