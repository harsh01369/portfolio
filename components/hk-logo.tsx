"use client";

import { useState, useCallback } from "react";

const COLOR_SETS = [
  { h: "#3b82f6", k: "#fafafa" },  // default: blue H, white K
  { h: "#60a5fa", k: "#a78bfa" },  // light blue H, purple K
  { h: "#a78bfa", k: "#3b82f6" },  // purple H, blue K
  { h: "#fafafa", k: "#3b82f6" },  // inverted: white H, blue K
  { h: "#8b5cf6", k: "#60a5fa" },  // purple H, light blue K
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
