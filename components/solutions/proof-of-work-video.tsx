"use client";

import { useRef, useState } from "react";

interface Props {
  src: string;
  accentColor: string;
}

// Same self-hosted <video> + play-button-overlay pattern as components/
// showreel.tsx, sized to sit in the demo column (440px) instead of a
// full-bleed hero block. Shown in place of the interactive demo once a
// company's video has been rendered and its videoUrl set.
export default function ProofOfWorkVideo({ src, accentColor }: Props) {
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

  // Poster ships alongside the video under the same name, e.g.
  // netbird.mp4 -> netbird-poster.jpg (extracted from a frame partway
  // through, not frame 0, since frame 0 is always the pre-fade-in intro
  // beat and makes a blank-looking thumbnail).
  const poster = src.replace(/\.mp4$/, "-poster.jpg");

  return (
    <div
      className="group relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-text-primary/10 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.25)]"
      style={{ boxShadow: `0 30px 70px -20px ${accentColor}33` }}
    >
      <video
        ref={videoRef}
        className="aspect-video w-full"
        src={src}
        poster={poster}
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
          aria-label="Play the walkthrough"
          className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-black">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
