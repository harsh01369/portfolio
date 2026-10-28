"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Participant {
  id: string;
  name: string;
  hasSpruceAccount: boolean;
}

const INITIAL: Participant[] = [
  { id: "p1", name: "Dr. Okafor (you)", hasSpruceAccount: true },
  { id: "p2", name: "Patient: M. Reyes", hasSpruceAccount: true },
  { id: "p3", name: "Caregiver: J. Reyes", hasSpruceAccount: false },
];

export default function SpruceChannelBoundaryDemo({ accentColor, bgDark }: Props) {
  const [participants, setParticipants] = useState<Participant[]>(INITIAL);

  const allHaveAccounts = participants.every((p) => p.hasSpruceAccount);
  const caregiver = participants.find((p) => p.id === "p3")!;

  function inviteCaregiver() {
    setParticipants((prev) => prev.map((p) => (p.id === "p3" ? { ...p, hasSpruceAccount: true } : p)));
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
          <span className="text-[10.5px] text-white/40 ml-2">conversation :: channel-router</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Secure group messaging needs every participant inside the app, there's no group SMS fallback. One
            uninvited participant doesn't degrade the group, it blocks the secure channel for everyone in it.
          </p>

          <div className="space-y-1.5 mb-4">
            {participants.map((p) => (
              <div
                key={p.id}
                className="rounded-lg px-3 py-2.5 flex items-center justify-between"
                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${p.hasSpruceAccount ? "rgba(255,255,255,0.07)" : "#f59e0b55"}` }}
              >
                <span className="text-[10.5px] text-white/75">{p.name}</span>
                <span className="text-[9px] uppercase tracking-wide" style={{ color: p.hasSpruceAccount ? "#22c55e" : "#f59e0b" }}>
                  {p.hasSpruceAccount ? "has secure account" : "SMS only, not invited"}
                </span>
              </div>
            ))}
          </div>

          <div
            className="rounded-lg px-3 py-2.5 mb-4"
            style={{ background: allHaveAccounts ? "rgba(255,255,255,0.03)" : "#f59e0b14", border: `1px solid ${allHaveAccounts ? `${accentColor}44` : "#f59e0b55"}` }}
          >
            <p className="text-[10.5px] text-white/70 mb-1">Group channel status</p>
            <p className="text-[11px] font-semibold" style={{ color: allHaveAccounts ? accentColor : "#f59e0b" }}>
              {allHaveAccounts ? "Secure group messaging enabled" : "Blocked, can't form a secure group with a non-account participant in it"}
            </p>
          </div>

          <AnimatePresence>
            {!allHaveAccounts && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={inviteCaregiver}
                className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity"
                style={{ background: accentColor, color: bgDark }}
              >
                Invite {caregiver.name.split(": ")[1]} to Spruce
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
