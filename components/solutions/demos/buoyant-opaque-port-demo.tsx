"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

type Mode = "detect" | "opaque";

export default function BuoyantOpaquePortDemo({ accentColor, bgDark }: Props) {
  const [mode, setMode] = useState<Mode>("detect");

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
          <span className="text-[10.5px] text-white/40 ml-2">linkerd-proxy :: order-service to mysql:3306</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Linkerd's own docs call this out directly: protocol detection waits for the client to speak first.
            MySQL speaks first. Nothing marks that port, and every connection eats the same fixed stall.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setMode("detect")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "detect" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "detect" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              port 3306, detection on
            </button>
            <button
              onClick={() => setMode("opaque")}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: mode === "opaque" ? accentColor : "rgba(255,255,255,0.08)", color: mode === "opaque" ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              port marked opaque
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">config.linkerd.io/opaque-ports</span>
                <span className="text-[9.5px] text-white/60">{mode === "opaque" ? "\"3306\"" : "(unset)"}</span>
              </div>
            </div>
            <div className="rounded-lg px-3 py-2.5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] text-white/55">time to first byte through the proxy</span>
                <span className="text-[9.5px] text-white/60">{mode === "detect" ? "10.0s stall, then fallback" : "~1ms, no detection"}</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{
              background: mode === "opaque" ? `${accentColor}18` : "rgba(239,68,68,0.08)",
              border: mode === "opaque" ? `1px solid ${accentColor}66` : "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <motion.p key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] leading-relaxed text-white/55">
              {mode === "detect"
                ? "The proxy waits for the client to send the first bytes so it can sniff the protocol. MySQL's server sends its handshake first, so there's nothing to sniff, and every single connection pays the full detection timeout before falling back to a plain TCP stream."
                : "With the port marked opaque, the proxy never tries to sniff anything. It forwards bytes as a TCP stream from the first packet, the connection opens immediately, and the mesh still gets mTLS and TCP-level metrics, it just skips the part that was never going to work for this port anyway."}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
