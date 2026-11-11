"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "naive" | "formance";
type Phase = "idle" | "sending" | "timeout" | "retrying" | "done";

export default function FormanceLedgerDriftDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("formance");
  const [phase, setPhase] = useState<Phase>("idle");
  const [runKey, setRunKey] = useState(0);

  function trigger() {
    setRunKey((k) => k + 1);
    setPhase("sending");
    window.setTimeout(() => setPhase("timeout"), 700);
    window.setTimeout(() => setPhase("retrying"), 1300);
    window.setTimeout(() => setPhase("done"), 2200);
  }

  const sent = phase !== "idle";
  const timedOut = phase === "timeout" || phase === "retrying" || phase === "done";
  const retried = phase === "retrying" || phase === "done";
  const done = phase === "done";
  const drifted = mode === "naive" && done;

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-20 -left-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.1, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-6">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Ledger drift simulator</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["naive", "formance"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="formance-mode-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "naive" ? "Naive retry" : "Reconciled by construction"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3.5 border mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }}>
            <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Payout instruction</p>
            <p className="text-white text-xs font-semibold mb-1">Pay $4,200.00 to vendor acct ****2217</p>
            <p className="text-white/55 text-[10.5px] font-mono tabular-nums">tx_ref: pay_8831</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <motion.div
              animate={{
                borderColor: sent ? accentColor : "rgba(255,255,255,0.1)",
                background: sent ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Payment rail call</p>
              <p className="text-white/70 text-[10.5px]">{timedOut ? "Timed out, no ack received" : sent ? "Awaiting response..." : "Not sent yet"}</p>
            </motion.div>
            <motion.div
              animate={{
                borderColor: retried ? accentColor : "rgba(255,255,255,0.1)",
                background: retried ? `${accentColor}12` : "rgba(255,255,255,0.03)",
              }}
              className="rounded-xl p-3.5 border"
            >
              <p className="text-white/40 text-[9px] uppercase tracking-wider mb-1.5">Retry attempt</p>
              <p className="text-white/70 text-[10.5px]">{retried ? "Re-sent pay_8831 to the rail" : "Waiting on first attempt"}</p>
            </motion.div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={trigger}
              className="text-[11px] font-semibold px-4 py-1.5 rounded-full transition-opacity hover:opacity-85"
              style={{ background: accentColor, color: bgDark }}
            >
              Simulate a timed-out payout call
            </button>
          </div>

          <div className="min-h-[100px]">
            <AnimatePresence mode="wait">
              {phase !== "idle" && !done && (
                <motion.div
                  key={`working-${runKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 pt-3"
                >
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: accentColor }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                  <span className="text-white/40 text-[11px]">
                    {phase === "sending" && "Calling the payment rail..."}
                    {phase === "timeout" && "No ack within timeout window, outcome unknown..."}
                    {phase === "retrying" && "Retrying pay_8831..."}
                  </span>
                </motion.div>
              )}
              {done && (
                <motion.div
                  key={`done-${runKey}-${mode}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg px-3.5 py-3"
                  style={{
                    background: drifted ? "#F8717122" : `${accentColor}14`,
                    border: `1px solid ${drifted ? "#F87171" : accentColor}55`,
                  }}
                >
                  <p className="text-white text-xs font-semibold mb-1">
                    {drifted ? "Books drift: $4,200.00 paid twice" : "Books stay balanced: $4,200.00 paid once"}
                  </p>
                  <p className="text-white/45 text-[10.5px] leading-relaxed">
                    {drifted
                      ? "The first call actually succeeded on the rail's side before the ack was lost. The retry used a fresh reference, so the ledger recorded it as a second, unrelated payment. Nothing here was malicious, the ledger just had no way to know pay_8831 already happened."
                      : "Formance keyed the retry to the same idempotency reference as the original call. The ledger recognized tx_ref: pay_8831 had already posted and discarded the duplicate before it ever touched a balance."}
                  </p>
                </motion.div>
              )}
              {phase === "idle" && (
                <p className="text-white/30 text-[11px] text-center pt-4">
                  A network timeout doesn&apos;t tell you whether the call landed. Trigger one and see what each
                  retry strategy does to the books.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
