"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import SignatureRing from "@/components/signature-ring";

// Each cycling word is filled with that real project's own screenshot
// (background-clip: text) instead of a flat color, the same technique the
// trailer's hook uses. Images are pre-blurred as separate files (gblur,
// sigma=14) rather than blurred live: a CSS blur() filter on the element
// also blurs the clip-path/text-mask edges, not just the image, which read
// as mushy letterforms on the first pass of the trailer build.
const WORDS = [
  { word: "SITES", image: "/images/projects/bhairav-aaradhyaa/hero-blur.jpg", sub: "you can trust." },
  { word: "PIPELINES", image: "/images/projects/silentgreen/hero-blur.jpg", sub: "that actually run." },
  { word: "PROOF", image: "/images/projects/previsit/hero-blur.jpg", sub: "you can verify." },
];

const TILES = ["I", "B", "U", "I", "L", "D"];
const WORD_HOLD_MS = 2800;

const SERVICES = ["Web Builds", "AI Content Pipelines", "SEO & AEO", "Motion Graphics"];

export default function HeroHook() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), WORD_HOLD_MS);
    return () => clearInterval(id);
  }, []);

  const active = WORDS[index];

  return (
    <section className="relative overflow-hidden border-b border-border px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div
        className="pointer-events-none absolute left-[-10%] top-[20%] h-[560px] w-[560px] rounded-full bg-accent/10 blur-[160px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/10 px-3 py-1.5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs tracking-wide text-emerald-700">taking_projects</span>
        </motion.div>

        {/* "I BUILD" tile row, with the opening signature ring pinging beside it */}
        <div className="relative mb-3 flex items-center gap-1.5">
          <SignatureRing className="absolute -left-7 top-1/2 h-0 w-0 -translate-y-1/2" />
          {TILES.map((letter, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
              className="flex h-12 w-9 items-center justify-center bg-text-primary text-xl font-black leading-none text-accent-muted sm:h-20 sm:w-14 sm:text-4xl"
            >
              {letter}
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.3, delay: 0.15 + TILES.length * 0.07 }}
            className="h-12 w-5 origin-bottom bg-accent sm:h-20 sm:w-8"
            style={{ clipPath: "polygon(62% 0, 100% 0, 38% 100%, 0 100%)" }}
          />
        </div>

        {/* cycling word, clipped imagery fill */}
        <div className="relative min-h-[96px] sm:min-h-[150px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.word}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <h1
                className="bg-clip-text text-[clamp(3rem,13vw,8.5rem)] font-black leading-[0.9] tracking-tight text-transparent"
                style={{
                  backgroundImage: `url(${active.image})`,
                  backgroundSize: "180%",
                  backgroundPosition: "center",
                  WebkitBackgroundClip: "text",
                  filter: "brightness(0.5) contrast(1.15) saturate(1.3)",
                }}
              >
                {active.word}
              </h1>
              <p className="mt-3 text-lg font-semibold text-text-secondary sm:text-2xl">
                I build {active.word.toLowerCase()} {active.sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* services row */}
        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
          {SERVICES.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              {i > 0 && <span className="text-border-hover">/</span>}
              {s}
            </span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-text-primary px-6 py-3 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
          >
            Tell me what you&rsquo;re building
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
