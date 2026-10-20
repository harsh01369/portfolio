"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PlayerScene } from "@/data/proof-of-work-previews";

interface Props {
  scenes: PlayerScene[];
  accentColor: string;
  bgDark: string;
}

const SCENE_DURATION_MS = 4200;

export default function DataVideoPlayerDemo({ scenes, accentColor, bgDark }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startRef = useRef<number>(0);

  const scene = scenes[index];

  useEffect(() => {
    if (!playing) return;
    startRef.current = performance.now();
    setProgress(0);

    function tick(now: number) {
      const elapsed = now - startRef.current;
      const pct = Math.min(1, elapsed / SCENE_DURATION_MS);
      setProgress(pct);
      if (pct >= 1) {
        setIndex((i) => (i + 1) % scenes.length);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, playing, scenes.length]);

  function jumpTo(i: number) {
    setIndex(i);
    setProgress(0);
  }

  return (
    <div className="w-full max-w-md">
      <div
        className="relative rounded-xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, aspectRatio: "9 / 12" }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <SceneView key={scene.id} scene={scene} accentColor={accentColor} />
          </AnimatePresence>
        </div>

        <div className="absolute left-0 right-0 bottom-0 px-5 pb-4 pt-10 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-sm leading-snug mb-3 min-h-[2.5em]">{scene.caption}</p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center flex-shrink-0 transition-colors"
            >
              {playing ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <rect x="1" y="0" width="3" height="10" />
                  <rect x="6" y="0" width="3" height="10" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <polygon points="0,0 10,5 0,10" />
                </svg>
              )}
            </button>

            <div className="flex-1 flex gap-1.5">
              {scenes.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => jumpTo(i)}
                  className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
                  aria-label={`Jump to ${s.chapterLabel}`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: accentColor,
                      width: i < index ? "100%" : i === index ? `${progress * 100}%` : "0%",
                      transition: i === index ? "none" : "width 0.2s",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2.5">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                onClick={() => jumpTo(i)}
                className="text-[10px] uppercase tracking-wide transition-colors"
                style={{ color: i === index ? "white" : "rgba(255,255,255,0.4)" }}
              >
                {s.chapterLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneView({ scene, accentColor }: { scene: PlayerScene; accentColor: string }) {
  const base = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  };

  if (scene.kind === "intro") {
    return (
      <motion.div {...base} className="text-center">
        <div
          className="w-10 h-10 rounded-full mx-auto mb-4"
          style={{ background: accentColor, opacity: 0.9 }}
        />
        <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-2">Portfolio Review</p>
        <p className="text-white text-xl font-semibold">Q3 2026</p>
      </motion.div>
    );
  }

  if (scene.kind === "metric" && scene.metric) {
    return (
      <motion.div {...base} className="text-center w-full">
        <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-3">{scene.metric.label}</p>
        <CountUpValue value={scene.metric.value} accentColor={accentColor} />
        {scene.metric.sublabel && (
          <p className="text-sm font-medium mt-2" style={{ color: accentColor }}>
            {scene.metric.sublabel}
          </p>
        )}
      </motion.div>
    );
  }

  if (scene.kind === "chart" && scene.chart) {
    return (
      <motion.div {...base} className="w-full">
        <p className="text-white/50 text-xs uppercase tracking-[0.2em] mb-4 text-center">{scene.chart.label}</p>
        <MiniLineChart points={scene.chart.points} accentColor={accentColor} />
      </motion.div>
    );
  }

  if (scene.kind === "callout") {
    return (
      <motion.div {...base} className="text-center">
        <div
          className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background: `${accentColor}33`, border: `1.5px solid ${accentColor}` }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <p className="text-white text-sm max-w-[220px] mx-auto leading-relaxed">Rebalancing opportunity</p>
      </motion.div>
    );
  }

  return (
    <motion.div {...base} className="text-center">
      <p className="text-white text-base font-medium max-w-[240px] mx-auto leading-relaxed">That&apos;s the review.</p>
    </motion.div>
  );
}

function CountUpValue({ value, accentColor }: { value: string; accentColor: string }) {
  const [display, setDisplay] = useState("0");
  const numeric = parseFloat(value.replace(/[^0-9.]/g, ""));
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9.]*$/)?.[0] ?? "";

  useEffect(() => {
    if (Number.isNaN(numeric)) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 1100;
    let raf: number;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = numeric * eased;
      const formatted = numeric % 1 === 0 ? Math.round(current).toLocaleString() : current.toFixed(1);
      setDisplay(formatted);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <p className="text-3xl font-bold text-white tabular-nums" style={{ textShadow: `0 0 24px ${accentColor}66` }}>
      {prefix}
      {display}
      {suffix}
    </p>
  );
}

function MiniLineChart({ points, accentColor }: { points: number[]; accentColor: string }) {
  const w = 220;
  const h = 90;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / range) * h;
    return `${x},${y}`;
  });
  const path = `M${coords.join(" L")}`;
  const areaPath = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mx-auto block">
      <defs>
        <linearGradient id="chartFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill="url(#chartFade)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={accentColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <motion.circle
        cx={coords[coords.length - 1].split(",")[0]}
        cy={coords[coords.length - 1].split(",")[1]}
        r={3.5}
        fill={accentColor}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      />
    </svg>
  );
}
