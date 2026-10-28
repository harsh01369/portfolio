"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function CoderSessionPersistenceDemo({ accentColor, bgDark }: Props) {
  const [templateSupportsPersistence, setTemplateSupportsPersistence] = useState(true);
  const [paused, setPaused] = useState(false);
  const [resumed, setResumed] = useState(false);

  const pause = () => {
    setPaused(true);
    setResumed(false);
  };

  const resume = () => {
    setResumed(true);
  };

  const contextIntact = templateSupportsPersistence;

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
          <span className="text-[10.5px] text-white/40 ml-2">task :: agent workspace, idle timeout</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            A task auto-pauses on idle timeout and looks the same from the outside either way.
            Whether the agent actually picks up where it left off depends on a template setting,
            not on anything the task itself did.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-white/50">template:</span>
            <button
              onClick={() => { setTemplateSupportsPersistence(true); setPaused(false); setResumed(false); }}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: templateSupportsPersistence ? accentColor : "rgba(255,255,255,0.08)", color: templateSupportsPersistence ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              supports session persistence
            </button>
            <button
              onClick={() => { setTemplateSupportsPersistence(false); setPaused(false); setResumed(false); }}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: !templateSupportsPersistence ? accentColor : "rgba(255,255,255,0.08)", color: !templateSupportsPersistence ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              no persistence support
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[10px] text-white/70">agent mid-task: refactoring auth module, 14 files touched</span>
            </div>

            {!paused && (
              <button onClick={pause} className="text-[11px] font-semibold px-4 py-1.5 rounded-md" style={{ background: accentColor, color: bgDark }}>
                Idle timeout reached, auto-pause
              </button>
            )}

            {paused && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg px-3 py-2.5" style={{ background: "#f59e0b14", border: "1px solid #f59e0b44" }}>
                <span className="text-[10px] text-amber-300">build reason: idle timeout. workspace paused.</span>
              </motion.div>
            )}

            {paused && !resumed && (
              <button onClick={resume} className="text-[11px] font-semibold px-4 py-1.5 rounded-md" style={{ background: accentColor, color: bgDark }}>
                Resume workspace
              </button>
            )}
          </div>

          {resumed && (
            <div
              className="rounded-lg px-3 py-2.5"
              style={{ background: contextIntact ? "#22c55e14" : "#ef444414", border: `1px solid ${contextIntact ? "#22c55e55" : "#ef444455"}` }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9.5px] leading-relaxed"
                style={{ color: contextIntact ? "#86efac" : "#fca5a5" }}
              >
                {contextIntact
                  ? "Resumed. The agent picks up mid-refactor, same 14 files, same conversation context."
                  : "Resumed, but the agent's conversation context didn't come back with it. From the workspace list this looked identical to the other template. The agent starts the auth refactor over from nothing."}
              </motion.p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
