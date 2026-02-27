"use client";

import { useEffect, useRef, useCallback } from "react";

export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = useCallback((e: MouseEvent) => {
    if (ref.current) {
      ref.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(59, 130, 246, 0.04), transparent 40%)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [handleMouse]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
    />
  );
}
