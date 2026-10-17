"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * The actual motion-graphics trailer, self-hosted. Placed right after the
 * hero so "the demo above" (referenced by the Motion Graphics card in the
 * capability grid further down the page) is a real, true claim rather than
 * dangling copy with nothing to point at.
 */
export default function Showreel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="border-b border-border px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-sm font-medium text-accent">The Showreel</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Watch it in motion.
            </h2>
          </div>
          <p className="text-sm text-text-muted">
            Built frame by frame &mdash; same renderer behind every demo on this site.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="group relative overflow-hidden rounded-2xl border border-border bg-black shadow-[0_40px_90px_rgba(0,0,0,0.18)]"
        >
          <video
            ref={videoRef}
            className="aspect-video w-full"
            src="/videos/showreel.mp4"
            poster="/videos/showreel-poster.jpg"
            controls={playing}
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />

          {!playing && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play the showreel"
              className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105 sm:h-20 sm:w-20">
                <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-text-primary sm:h-8 sm:w-8">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
