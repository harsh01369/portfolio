"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

const WEEKS = 8;
const MTA_INITIAL = [60, 62, 65, 64, 66, 69, 71, 73];
const MMM_INITIAL = [55, 57, 58, 60, 61, 63, 64, 66];
const INCREMENTALITY_TESTS: { week: number; value: number }[] = [
  { week: 1, value: 47 },
  { week: 4, value: 49 },
];

const VMIN = 40;
const VMAX = 80;
const X0 = 14;
const X1 = 446;
const Y0 = 125;
const Y1 = 14;

function xScale(week: number) {
  return X0 + (week / (WEEKS - 1)) * (X1 - X0);
}
function yScale(value: number) {
  const t = (value - VMIN) / (VMAX - VMIN);
  return Y0 + t * (Y1 - Y0);
}
function toPoints(values: number[]) {
  return values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function NorthbeamReconciliationDemo({ accentColor, bgDark }: Props) {
  const [mta, setMta] = useState([...MTA_INITIAL]);
  const [mmm, setMmm] = useState([...MMM_INITIAL]);
  const [tests, setTests] = useState(INCREMENTALITY_TESTS);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);

  function runLiftTest() {
    if (running) return;
    setRunning(true);
    setDone(false);
    const newWeek = WEEKS - 1;
    const causalValue = 52;
    const fromMta = [...mta];
    const fromMmm = [...mmm];
    const targetMta = [...mta];
    const targetMmm = [...mmm];
    targetMta[newWeek - 1] = 60;
    targetMta[newWeek] = 56;
    targetMmm[newWeek - 1] = 57;
    targetMmm[newWeek] = 54;

    setTests((t) => [...t, { week: newWeek, value: causalValue }]);

    const start = Date.now();
    const duration = 900;
    function tick() {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setMta(fromMta.map((v, i) => lerp(v, targetMta[i], eased)));
      setMmm(fromMmm.map((v, i) => lerp(v, targetMmm[i], eased)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setRunning(false);
        setDone(true);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  const latestGap = Math.round(Math.min(mta[WEEKS - 1], mmm[WEEKS - 1]) - (tests[tests.length - 1]?.value ?? 0));

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Three-way reconciliation</p>
            <button
              onClick={runLiftTest}
              disabled={running || tests.length > 2}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85 disabled:opacity-40"
              style={{ background: accentColor, color: bgDark }}
            >
              {running ? "Reconciling..." : "Run new lift test"}
            </button>
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#ffffff" }} />
              <span className="text-white/45 text-[9.5px]">MTA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.4)" }} />
              <span className="text-white/45 text-[9.5px]">MMM+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
              <span className="text-white/45 text-[9.5px]">Incrementality test</span>
            </div>
          </div>

          <svg viewBox="0 0 460 140" className="w-full h-[150px]">
            {[0.25, 0.5, 0.75].map((t) => (
              <line key={t} x1={X0} x2={X1} y1={Y0 - t * (Y0 - Y1)} y2={Y0 - t * (Y0 - Y1)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            ))}

            <polyline points={toPoints(mta)} fill="none" stroke="#ffffff" strokeWidth={1.75} strokeLinejoin="round" />
            <polyline points={toPoints(mmm)} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.75} strokeLinejoin="round" />

            {tests.length > 1 && (
              <polyline
                points={tests.map((t) => `${xScale(t.week)},${yScale(t.value)}`).join(" ")}
                fill="none"
                stroke={accentColor}
                strokeDasharray="4 3"
                strokeWidth={1.75}
              />
            )}

            {tests.map((t) => (
              <motion.circle
                key={`${t.week}-${t.value}`}
                initial={{ r: 0, opacity: 0 }}
                animate={{ r: 3.5, opacity: 1 }}
                transition={{ duration: 0.3 }}
                cx={xScale(t.week)}
                cy={yScale(t.value)}
                fill={accentColor}
              />
            ))}
          </svg>

          <div className="min-h-[68px] mt-2">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{ background: `${accentColor}14`, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    MTA and MMM+ pulled {Math.max(0, latestGap)} points toward the causal number
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    A new lift test is a calibration event, not just another chart series. This is what a two-way
                    incrementality product can&apos;t do today: bend the correlational models toward ground truth
                    automatically, in both directions, not just report the disagreement.
                  </p>
                </motion.div>
              ) : (
                <p className="text-white/30 text-[11px] text-center pt-5">
                  MTA and MMM+ agree on direction but disagree on magnitude. Incrementality is the causal
                  check, today it only tells you the gap exists.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
