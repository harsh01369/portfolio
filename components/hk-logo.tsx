"use client";

import { useState, useCallback } from "react";

const COLOR_SETS = [
  { h: "#14b8a6", k: "#111111" },  // default: teal H, ink K
  { h: "#111111", k: "#14b8a6" },  // ink H, teal K
  { h: "#0d9488", k: "#111111" },  // deep teal H, ink K
  { h: "#111111", k: "#0d9488" },  // ink H, deep teal K
  { h: "#14b8a6", k: "#0d9488" },  // teal H, deep teal K
];

export default function HKLogo() {
  const [colorIndex, setColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const cycleColor = useCallback(() => {
    setColorIndex((prev) => (prev + 1) % COLOR_SETS.length);
  }, []);

  const colors = COLOR_SETS[colorIndex];

  return (
    <span
      className="relative inline-flex items-center select-none cursor-pointer"
      onMouseEnter={() => {
        setIsHovered(true);
        cycleColor();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-lg font-bold tracking-tight relative">
        <span
          className="transition-colors duration-500 ease-out"
          style={{ color: colors.h }}
        >
          H
        </span>
        <span
          className="transition-colors duration-500 ease-out"
          style={{ color: colors.k }}
        >
          K
        </span>
      </span>

      {/* Subtle glow on hover */}
      <span
        className="absolute inset-0 -m-1 rounded-md transition-all duration-500 ease-out"
        style={{
          background: isHovered
            ? `radial-gradient(circle, ${colors.h}15, transparent 70%)`
            : "transparent",
        }}
        aria-hidden="true"
      />
    </span>
  );
}
