"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface Application {
  id: string;
  institution: string;
  name: string;
  dob: string;
  ssnLast4: string;
  phone: string;
  soloScore: number;
}

const APPLICATIONS: Application[] = [
  { id: "a1", institution: "Meridian Credit Union", name: "T. Alvarez", dob: "03/14/1991", ssnLast4: "4821", phone: "(629) 555-0114", soloScore: 142 },
  { id: "a2", institution: "Castlebrook Bank", name: "Theo Alvarez", dob: "03/14/1991", ssnLast4: "4821", phone: "(629) 555-0114", soloScore: 168 },
  { id: "a3", institution: "Harborline Financial", name: "T. R. Alvarez", dob: "03/14/1991", ssnLast4: "4821", phone: "(305) 555-8820", soloScore: 119 },
];

export default function SentilinkManifestLinkDemo({ accentColor, bgDark }: Props) {
  const [linked, setLinked] = useState(false);

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
          <span className="text-[10.5px] text-white/40 ml-2">manifest :: cross-institution linkage</span>
        </div>

        <div className="relative p-5">
          <p className="text-white/35 text-[10px] leading-relaxed mb-4">
            Three applications at three different institutions, each one scoring low in isolation. The risk only
            shows up once overlapping PII, the same SSN and DOB, reused across accounts no single institution
            can see, links them together.
          </p>

          <div className="space-y-1.5 mb-4">
            {APPLICATIONS.map((app) => (
              <motion.div
                key={app.id}
                layout
                className="rounded-lg px-3 py-2.5"
                style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${linked ? "#ef444455" : "rgba(255,255,255,0.07)"}` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] text-white/75">{app.institution}</span>
                  <span className="text-[10px] tabular-nums" style={{ color: linked ? "#ef4444" : accentColor }}>
                    {linked ? "847" : app.soloScore} <span className="text-white/30 text-[8.5px]">/999</span>
                  </span>
                </div>
                <p className="text-[9px] text-white/35">
                  {app.name} · DOB {app.dob} · SSN ***-**-{app.ssnLast4} · {app.phone}
                </p>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {linked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg px-3 py-2.5 mb-4"
                style={{ background: "#ef444414", border: "1px solid #ef444455" }}
              >
                <p className="text-[9.5px] leading-relaxed" style={{ color: "#fca5a5" }}>
                  Same SSN and DOB across all three, two share the exact same phone number. Individually, each
                  application looked like a plausible low-risk applicant. Linked, this is one synthetic identity
                  applying at three institutions in the same week.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setLinked((s) => !s)}
            className="text-[11px] font-semibold px-4 py-1.5 rounded-md transition-opacity"
            style={{ background: accentColor, color: bgDark }}
          >
            {linked ? "Reset to isolated view" : "Run Manifest cross-reference"}
          </button>
        </div>
      </div>
    </div>
  );
}
