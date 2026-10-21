"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type SyncMode = "webhook" | "poll";

const STARTING_SEATS = 12;
const POLL_SECONDS = 8;

export default function SubstraktSyncDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<SyncMode>("poll");
  const [spektrixSeats, setSpektrixSeats] = useState(STARTING_SEATS);
  const [publicSeats, setPublicSeats] = useState(STARTING_SEATS);
  const [status, setStatus] = useState<"idle" | "syncing" | "stale">("idle");
  const [countdown, setCountdown] = useState(0);
  const timers = useRef<{ timeout?: ReturnType<typeof setTimeout>; interval?: ReturnType<typeof setInterval> }>({});

  function clearTimers() {
    if (timers.current.timeout) clearTimeout(timers.current.timeout);
    if (timers.current.interval) clearInterval(timers.current.interval);
  }

  useEffect(() => {
    return () => clearTimers();
  }, []);

  function changeMode(next: SyncMode) {
    clearTimers();
    setMode(next);
    setStatus("idle");
    setCountdown(0);
  }

  function simulateBooking() {
    if (status !== "idle" || spektrixSeats <= 0) return;
    const newSeats = spektrixSeats - 1;
    setSpektrixSeats(newSeats);

    if (mode === "webhook") {
      setStatus("syncing");
      timers.current.timeout = setTimeout(() => {
        setPublicSeats(newSeats);
        setStatus("idle");
      }, 650);
    } else {
      setStatus("stale");
      setCountdown(POLL_SECONDS);
      timers.current.interval = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearTimers();
            setPublicSeats(newSeats);
            setStatus("idle");
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
  }

  function reset() {
    clearTimers();
    setSpektrixSeats(STARTING_SEATS);
    setPublicSeats(STARTING_SEATS);
    setStatus("idle");
    setCountdown(0);
  }

  const outOfSync = publicSeats !== spektrixSeats;

  return (
    <div className="w-full max-w-xl">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.09, filter: "blur(65px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Sync integrity</p>
            <div
              className="flex rounded-full p-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {(["poll", "webhook"] as SyncMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => changeMode(m)}
                  className="relative text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors"
                  style={{ color: mode === m ? bgDark : "rgba(255,255,255,0.55)" }}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="sync-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: accentColor }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{m === "poll" ? "5-min poll cache" : "Live webhook"}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div
              className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">Public event page</p>
              <p className="text-white/70 text-[11.5px] mb-2">Science Museum Lates, Nov 14</p>
              <p
                className="text-2xl font-bold tabular-nums mb-1"
                style={{ color: outOfSync ? "rgba(255,255,255,0.5)" : accentColor }}
              >
                {publicSeats} left
              </p>
              {outOfSync ? (
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                  stale{mode === "poll" && countdown > 0 ? ` (next poll in ${countdown}s)` : ""}
                </p>
              ) : (
                <p className="text-white/25 text-[10px]">in sync</p>
              )}
            </div>

            <div
              className="rounded-lg p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/35 text-[10px] uppercase tracking-wider mb-2">Spektrix, source of truth</p>
              <p className="text-white/70 text-[11.5px] mb-2">Seat holds, live</p>
              <p className="text-2xl font-bold tabular-nums mb-3 text-white">{spektrixSeats} left</p>
              <button
                onClick={simulateBooking}
                disabled={status !== "idle" || spektrixSeats <= 0}
                className="w-full text-[11px] font-semibold py-2 rounded-lg transition-colors disabled:opacity-40"
                style={{ background: `${accentColor}1c`, border: `1px solid ${accentColor}55`, color: accentColor }}
              >
                {spektrixSeats <= 0 ? "Sold out" : "Simulate booking"}
              </button>
            </div>
          </div>

          {mode === "poll" && status === "stale" && (
            <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: accentColor }}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: POLL_SECONDS, ease: "linear" }}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-white/30 text-[10.5px] leading-relaxed">
              {mode === "poll"
                ? "A booking confirms in Spektrix instantly, the public page only refreshes on its next poll. For a window, it can show a wrong, falsely available count."
                : "A webhook pushes the change the moment Spektrix confirms it, the public page is never more than a beat behind."}
            </p>
            <button onClick={reset} className="text-[10.5px] text-white/35 hover:text-white/60 underline shrink-0">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
