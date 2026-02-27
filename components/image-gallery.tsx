"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryImage {
  src: string;
  alt: string;
}

export default function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images || images.length === 0) return null;

  const labels = images.map((_, i) => {
    if (i === 0) return "Overview";
    if (images[i].alt.toLowerCase().includes("architecture")) return "Architecture";
    return `Image ${i + 1}`;
  });

  return (
    <div className="mb-12">
      {/* Image — clickable to open lightbox */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-accent/20 to-purple-500/20 blur-lg opacity-50" />
        <div
          className="relative overflow-hidden rounded-xl border border-border bg-surface cursor-zoom-in"
          onClick={() => setLightbox(true)}
        >
          <Image
            src={images[active].src}
            alt={images[active].alt}
            width={1200}
            height={images[active].alt.toLowerCase().includes("architecture") ? 800 : 630}
            className="w-full h-auto"
            sizes="(max-width: 1024px) 100vw, 896px"
            priority={active === 0}
          />
        </div>
      </div>

      {/* Tabs */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setActive(i)}
              className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                active === i
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-text-muted hover:border-border-hover hover:text-text-secondary"
              }`}
            >
              {labels[i]}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox modal */}
      {lightbox && (
        <Lightbox
          images={images}
          active={active}
          setActive={setActive}
          onClose={() => setLightbox(false)}
        />
      )}
    </div>
  );
}

function Lightbox({
  images,
  active,
  setActive,
  onClose,
}: {
  images: GalleryImage[];
  active: number;
  setActive: (i: number) => void;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && active < images.length - 1) setActive(active + 1);
      if (e.key === "ArrowLeft" && active > 0) setActive(active - 1);
    },
    [active, images.length, onClose, setActive]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          {active > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActive(active - 1); }}
              className="absolute left-4 z-10 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {active < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setActive(active + 1); }}
              className="absolute right-4 z-10 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </>
      )}

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[active].src}
          alt={images[active].alt}
          width={1200}
          height={images[active].alt.toLowerCase().includes("architecture") ? 800 : 630}
          className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
          sizes="90vw"
          priority
        />

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium">
            {active + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}
