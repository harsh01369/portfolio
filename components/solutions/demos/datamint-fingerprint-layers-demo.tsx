"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function DatamintFingerprintLayersDemo({ accentColor, bgDark }: Props) {
  const [emulateHttp2, setEmulateHttp2] = useState(false);

  const tlsMatch = true;
  const http2Match = emulateHttp2;
  const consistent = tlsMatch && http2Match;

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
          <span className="text-[10.5px] text-white/40 ml-2">fetch :: outbound request, fingerprint check</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Matching Chrome's TLS ClientHello (JA4) doesn't automatically reproduce Chrome's
            HTTP/2 frame order and settings. A detector that checks both layers for consistency
            catches the gap even when the TLS layer alone looks perfect.
          </p>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] text-white/50">HTTP/2 layer:</span>
            <button
              onClick={() => setEmulateHttp2(false)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: !emulateHttp2 ? accentColor : "rgba(255,255,255,0.08)", color: !emulateHttp2 ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              default Rust client frames
            </button>
            <button
              onClick={() => setEmulateHttp2(true)}
              className="text-[10px] px-2.5 py-1 rounded-md"
              style={{ background: emulateHttp2 ? accentColor : "rgba(255,255,255,0.08)", color: emulateHttp2 ? bgDark : "rgba(255,255,255,0.6)" }}
            >
              emulate Chrome frame order
            </button>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid #22c55e44" }}>
              <span className="text-[10px] text-white/70">TLS ClientHello (JA4)</span>
              <span className="text-[9.5px] font-semibold text-emerald-400">matches Chrome 128</span>
            </div>
            <div className="rounded-lg px-3 py-2 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${http2Match ? "#22c55e44" : "#ef444444"}` }}>
              <span className="text-[10px] text-white/70">HTTP/2 SETTINGS + frame order</span>
              <motion.span key={String(http2Match)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9.5px] font-semibold" style={{ color: http2Match ? "#4ade80" : "#ef4444" }}>
                {http2Match ? "matches Chrome 128" : "does not match Chrome"}
              </motion.span>
            </div>
          </div>

          <div
            className="rounded-lg px-3 py-2.5"
            style={{ background: consistent ? "#22c55e14" : "#ef444414", border: `1px solid ${consistent ? "#22c55e55" : "#ef444455"}` }}
          >
            <p className="text-[9.5px] leading-relaxed" style={{ color: consistent ? "#86efac" : "#fca5a5" }}>
              {consistent
                ? "Cross-layer check: consistent. A detector comparing TLS and HTTP/2 fingerprints sees one coherent Chrome client, not two mismatched layers."
                : "Cross-layer check: inconsistent. The TLS handshake says Chrome, the HTTP/2 layer says something else. That mismatch alone is a signal, independent of anything in the request body."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
