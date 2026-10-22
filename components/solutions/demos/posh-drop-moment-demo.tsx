"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type CheckoutMode = "standard" | "waitingroom";
type BuyerStatus = "pending" | "sold" | "oversold_error" | "sold_out" | "waitlisted";

const CAPACITY = 5;
const BUYERS = [
  "Maya R.", "Jordan K.", "Theo B.", "Priya S.", "Deja W.",
  "Omar F.", "Lena V.", "Chris P.", "Nadia H.", "Will T.",
];

const STANDARD_OUTCOMES: BuyerStatus[] = [
  "sold", "sold", "sold", "sold", "sold",
  "oversold_error", "sold_out", "sold_out", "sold_out", "sold_out",
];

const WAITINGROOM_OUTCOMES: BuyerStatus[] = [
  "sold", "sold", "sold", "sold", "sold",
  "waitlisted", "waitlisted", "waitlisted", "waitlisted", "waitlisted",
];

export default function PoshDropMomentDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<CheckoutMode>("waitingroom");
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);

  const outcomes = mode === "standard" ? STANDARD_OUTCOMES : WAITINGROOM_OUTCOMES;
  const batchSize = mode === "standard" ? 3 : 1;

  useEffect(() => {
    if (!running) return;
    if (revealed >= BUYERS.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setRevealed((r) => Math.min(r + batchSize, BUYERS.length)), 450);
    return () => clearTimeout(t);
  }, [running, revealed, batchSize]);

  function triggerDrop() {
    setRevealed(0);
    setRunning(true);
  }

  function reset() {
    setRevealed(0);
    setRunning(false);
  }

  function switchMode(m: CheckoutMode) {
    setMode(m);
    reset();
  }

  const sold = outcomes.slice(0, revealed).filter((s) => s === "sold").length;
  const remaining = Math.max(CAPACITY - sold, 0);
  const errorCount = outcomes.slice(0, revealed).filter((s) => s === "oversold_error").length;
  const waitlistCount = outcomes.slice(0, revealed).filter((s) => s === "waitlisted").length;
  const done = revealed >= BUYERS.length && !running;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Drop moment simulator</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["standard", "waitingroom"] as CheckoutMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="checkout-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "standard" ? "Standard checkout" : "Waiting room"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3 mb-4 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <p className="text-white text-xs font-semibold">Front Row, Friday</p>
              <p className="text-white/35 text-[9px]">Limited tier, {CAPACITY} tickets</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-mono tabular-nums font-bold" style={{ color: remaining === 0 ? "#E5484D" : accentColor }}>
                {remaining}
              </p>
              <p className="text-white/30 text-[8px] uppercase tracking-wider">remaining</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1.5">Checkout attempts</p>
              <div className="space-y-1 min-h-[180px]">
                {BUYERS.map((name, i) => {
                  const isRevealed = i < revealed;
                  const status = outcomes[i];
                  const colors: Record<BuyerStatus, string> = {
                    pending: "rgba(255,255,255,0.3)",
                    sold: "#1E9E6B",
                    oversold_error: "#E5484D",
                    sold_out: "rgba(255,255,255,0.3)",
                    waitlisted: "#F2994A",
                  };
                  const labels: Record<BuyerStatus, string> = {
                    pending: "waiting…",
                    sold: "confirmed",
                    oversold_error: "double-booked",
                    sold_out: "sold out",
                    waitlisted: "waitlisted",
                  };
                  return (
                    <motion.div
                      key={name}
                      layout
                      initial={false}
                      animate={{ opacity: isRevealed ? 1 : 0.35 }}
                      className="flex items-center justify-between text-[10px] rounded-md px-2 py-1"
                      style={{ background: "rgba(255,255,255,0.02)" }}
                    >
                      <span className="text-white/60 truncate">{name}</span>
                      <span className="font-mono shrink-0 ml-2" style={{ color: isRevealed ? colors[status] : "rgba(255,255,255,0.25)" }}>
                        {isRevealed ? labels[status] : "···"}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-white/35 text-[9px] uppercase tracking-wider mb-1.5">Who&apos;s going</p>
              <div className="rounded-lg p-2 min-h-[180px]" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence>
                    {BUYERS.slice(0, revealed).map((name, i) =>
                      outcomes[i] === "sold" ? (
                        <motion.div
                          key={name}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-1 text-[9px] font-medium px-1.5 py-1 rounded-full"
                          style={{ background: `${accentColor}1a`, border: `1px solid ${accentColor}55`, color: accentColor }}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[7px] font-bold"
                            style={{ background: accentColor, color: bgDark }}
                          >
                            {name[0]}
                          </span>
                          {name}
                        </motion.div>
                      ) : null
                    )}
                  </AnimatePresence>
                </div>
                {sold > 0 && (
                  <p className="text-white/30 text-[9px] font-mono tabular-nums mt-2">{sold} going</p>
                )}
              </div>
            </div>
          </div>

          {!running && !done ? (
            <button
              onClick={triggerDrop}
              className="w-full text-[11px] font-semibold px-3 py-2.5 rounded-lg"
              style={{ background: accentColor, color: bgDark }}
            >
              Trigger drop →
            </button>
          ) : running ? (
            <div className="w-full text-[11px] font-semibold px-3 py-2.5 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
              {BUYERS.length - revealed} buyers still hitting the drop…
            </div>
          ) : (
            <div className="space-y-2">
              <div
                className="rounded-xl p-3.5"
                style={{
                  background: errorCount > 0 ? "rgba(229,72,77,0.08)" : "rgba(30,158,107,0.08)",
                  border: `1px solid ${errorCount > 0 ? "#E5484D55" : "#1E9E6B55"}`,
                }}
              >
                <p className="text-xs font-bold" style={{ color: errorCount > 0 ? "#E5484D" : "#1E9E6B" }}>
                  {errorCount > 0 ? `${errorCount} oversold, refunds required` : `Sold out cleanly, ${waitlistCount} waitlisted`}
                </p>
                <p className="text-white/55 text-[11px] leading-relaxed mt-1">
                  {errorCount > 0
                    ? "Standard checkout let three buyers read the same stale inventory count at once. All three got a confirmation screen, only five tickets actually exist."
                    : "The waiting room processed one buyer at a time against the real count. Inventory never went negative, and everyone who missed out got an honest waitlist slot instead of a false confirmation."}
                </p>
              </div>
              <button
                onClick={reset}
                className="text-[10px] font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)" }}
              >
                Run again
              </button>
            </div>
          )}

          <p className="text-white/30 text-[10px] leading-relaxed mt-4">
            Scripted buyers and a fixed five-ticket tier, built for this demo only, not a live Posh drop.
          </p>
        </div>
      </div>
    </div>
  );
}
