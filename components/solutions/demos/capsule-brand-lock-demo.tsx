"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

export default function CapsuleBrandLockDemo({ accentColor, bgDark }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingLocked, setDraggingLocked] = useState<string | null>(null);

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2e` }}
      >
        <div
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Brand lock canvas</p>
            <span
              className="text-[9px] font-semibold px-2 py-1 rounded-full uppercase tracking-wider"
              style={{ background: `${accentColor}1a`, color: accentColor, border: `1px solid ${accentColor}44` }}
            >
              drag to test
            </span>
          </div>

          <div
            ref={canvasRef}
            className="relative rounded-xl overflow-hidden mb-4"
            style={{
              height: 220,
              background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="absolute top-2 left-3 text-white/20 text-[9px] uppercase tracking-wider">
              Template canvas, 1080x1920
            </p>

            {/* free: headline text */}
            <motion.div
              drag
              dragConstraints={canvasRef}
              dragElastic={0.06}
              dragMomentum={false}
              whileDrag={{ scale: 1.04 }}
              className="absolute top-10 left-8 cursor-grab active:cursor-grabbing select-none"
              style={{ touchAction: "none" }}
            >
              <div
                className="rounded-md px-3 py-2"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <p className="text-white text-xs font-bold">Headline text</p>
                <p className="text-white/35 text-[9px] uppercase tracking-wider mt-0.5">open, drag freely</p>
              </div>
            </motion.div>

            {/* free: footage thumbnail */}
            <motion.div
              drag
              dragConstraints={canvasRef}
              dragElastic={0.06}
              dragMomentum={false}
              whileDrag={{ scale: 1.04 }}
              className="absolute bottom-10 left-8 cursor-grab active:cursor-grabbing select-none"
              style={{ touchAction: "none" }}
            >
              <div
                className="rounded-md px-3 py-2.5 w-24"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <p className="text-white text-[10px] font-semibold">B-roll clip</p>
                <p className="text-white/35 text-[9px] mt-0.5">swap or move</p>
              </div>
            </motion.div>

            {/* locked: logo chip */}
            <motion.div
              drag
              dragSnapToOrigin
              dragElastic={0.5}
              onDragStart={() => setDraggingLocked("logo")}
              onDragEnd={() => setDraggingLocked(null)}
              whileDrag={{ scale: 0.97 }}
              className="absolute top-10 right-8 cursor-grab active:cursor-grabbing select-none z-10"
              style={{ touchAction: "none" }}
            >
              <div
                className="rounded-md px-3 py-2"
                style={{ background: `${accentColor}1f`, border: `1px solid ${accentColor}88` }}
              >
                <p className="text-xs font-bold" style={{ color: accentColor }}>
                  Logo mark
                </p>
                <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: `${accentColor}aa` }}>
                  locked
                </p>
              </div>
              {draggingLocked === "logo" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-1.5 left-0 whitespace-nowrap rounded-md px-2.5 py-1.5"
                  style={{ background: bgDark, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-[9px] font-semibold" style={{ color: accentColor }}>
                    Locked by your creative team
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* locked: motion curve */}
            <motion.div
              drag
              dragSnapToOrigin
              dragElastic={0.5}
              onDragStart={() => setDraggingLocked("curve")}
              onDragEnd={() => setDraggingLocked(null)}
              whileDrag={{ scale: 0.97 }}
              className="absolute bottom-10 right-8 cursor-grab active:cursor-grabbing select-none z-10"
              style={{ touchAction: "none" }}
            >
              <div
                className="rounded-md px-3 py-2"
                style={{ background: `${accentColor}1f`, border: `1px solid ${accentColor}88` }}
              >
                <div className="flex items-center gap-2">
                  <svg width="28" height="20" viewBox="0 0 28 20">
                    <path
                      d="M1 19 C 9 19, 9 1, 27 1"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="1.5"
                    />
                  </svg>
                  <div>
                    <p className="text-[10px] font-bold" style={{ color: accentColor }}>
                      Exit ease
                    </p>
                    <p className="text-[8px] font-mono" style={{ color: `${accentColor}aa` }}>
                      0.65, 0, 0.35, 1
                    </p>
                  </div>
                </div>
              </div>
              {draggingLocked === "curve" && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-1.5 right-0 whitespace-nowrap rounded-md px-2.5 py-1.5"
                  style={{ background: bgDark, border: `1px solid ${accentColor}55` }}
                >
                  <p className="text-[9px] font-semibold" style={{ color: accentColor }}>
                    Locked by your creative team
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>

          <p className="text-white/35 text-[10px] leading-relaxed">
            Headline text and the B-roll clip move wherever you drop them. The logo mark and the exit easing curve
            resist and snap back, brand lock holds even inside an editor that otherwise feels fully open. Sample
            template, built for this demo only.
          </p>
        </div>
      </div>
    </div>
  );
}
