"use client";

import { useMemo } from "react";

type Seg = [number, number, number, number];

/**
 * One-point-perspective room grid, extracted from the mascot hero's own
 * background pattern so the same "room" reads as the site's persistent
 * backdrop, not just a one-off hero decoration. Pure SVG, static (no rAF,
 * no pointer listeners) -- cheap to keep mounted on every page.
 */
function buildRoom(): { back: Seg[]; rays: Seg[]; depth: string[] } {
  const x0 = 95;
  const x1 = 905;
  const y0 = 85;
  const y1 = 865;
  const vx = (x0 + x1) / 2;
  const vy = (y0 + y1) / 2;
  const cols = 14;
  const rows = 11;
  const back: Seg[] = [];
  const rays: Seg[] = [];
  const out = (x: number, y: number): Seg => {
    const dx = x - vx;
    const dy = y - vy;
    const tx = dx > 0 ? (1000 - x) / dx : dx < 0 ? -x / dx : Infinity;
    const ty = dy > 0 ? (1000 - y) / dy : dy < 0 ? -y / dy : Infinity;
    const t = Math.min(tx, ty);
    return [x, y, x + dx * t, y + dy * t];
  };
  for (let i = 0; i <= cols; i++) {
    const x = x0 + ((x1 - x0) * i) / cols;
    back.push([x, y0, x, y1]);
    rays.push(out(x, y0), out(x, y1));
  }
  for (let j = 0; j <= rows; j++) {
    const y = y0 + ((y1 - y0) * j) / rows;
    back.push([x0, y, x1, y]);
    rays.push(out(x0, y), out(x1, y));
  }
  const depth = [1.07, 1.16, 1.28, 1.45, 1.7].map((s) => {
    const l = vx + (x0 - vx) * s;
    const r = vx + (x1 - vx) * s;
    const t = vy + (y0 - vy) * s;
    const b = vy + (y1 - vy) * s;
    return "M" + l + " " + t + "H" + r + "V" + b + "H" + l + "Z";
  });
  return { back, rays, depth };
}

export default function RoomBackground() {
  const room = useMemo(buildRoom, []);

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-0 h-full w-full text-text-primary"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.1" vectorEffect="non-scaling-stroke">
        {room.back.map((s, i) => (
          <line key={"b" + i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />
        ))}
        {room.rays.map((s, i) => (
          <line key={"r" + i} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} />
        ))}
        {room.depth.map((d, i) => (
          <path key={"d" + i} d={d} />
        ))}
      </g>
    </svg>
  );
}
