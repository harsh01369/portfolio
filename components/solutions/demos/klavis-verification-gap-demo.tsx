"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function KlavisVerificationGapDemo({ accentColor, bgDark }: Props) {
  const [checkType, setCheckType] = useState<"shallow" | "programmatic">("shallow");

  const shallowPass = true;
  const programmaticPass = false;

  const result = checkType === "shallow" ? shallowPass : programmaticPass;

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
          <span className="text-[10.5px] text-white/40 ml-2">rl-env :: coding task, rename function across repo</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            An agent renames a function and reports done. Whether that becomes a positive or
            negative training signal depends entirely on which check decides.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setCheckType("shallow")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: checkType === "shallow" ? accentColor : "rgba(255,255,255,0.08)", color: checkType === "shallow" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              shallow check
            </button>
            <button
              onClick={() => setCheckType("programmatic")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: checkType === "programmatic" ? accentColor : "rgba(255,255,255,0.08)", color: checkType === "programmatic" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              programmatic verification
            </button>
          </div>

          <div className="rounded-lg px-3 py-2.5 mb-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {checkType === "shallow" ? (
              <>
                <div className="text-[10px] text-white/70 mb-1">checks: function definition renamed in target file</div>
                <span className="text-[9px] text-white/35">doesn't look at callers elsewhere in the repo</span>
              </>
            ) : (
              <>
                <div className="text-[10px] text-white/70 mb-1">checks: full test suite, Dockerized, actual execution</div>
                <span className="text-[9px] text-white/35">runs everything that imports this function</span>
              </>
            )}
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: result ? "#22c55e14" : "#ef444414", border: `1px solid ${result ? "#22c55e55" : "#ef444455"}` }}
          >
            <motion.p
              key={checkType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[9.5px] leading-relaxed"
              style={{ color: result ? "#86efac" : "#fca5a5" }}
            >
              {checkType === "shallow"
                ? "Shallow check passes. The function got renamed exactly as asked, this task would get labeled a success, and the agent would get positive reinforcement for it."
                : "Programmatic verification fails. Three other files still call the function by its old name. The rename broke the build, which the shallow check never ran far enough to see. Labeled as success, this becomes training signal the model shouldn't have gotten."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
