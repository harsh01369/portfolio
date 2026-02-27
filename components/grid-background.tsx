"use client";

import { useEffect, useRef, useCallback } from "react";

const CELL_SIZE = 60;
const TRAIL_DURATION = 1200; // ms for a cell to fully fade out
const LINE_COLOR = "rgba(255, 255, 255, 0.06)";

// Theme colors for the trail — accent palette
const TRAIL_COLORS = [
  { r: 59, g: 130, b: 246 },  // accent blue #3b82f6
  { r: 96, g: 165, b: 250 },  // accent-hover #60a5fa
  { r: 30, g: 58, b: 95 },    // accent-muted #1e3a5f
  { r: 139, g: 92, b: 246 },  // purple #8b5cf6
  { r: 59, g: 130, b: 246 },  // blue again (weighted)
];

interface TrailCell {
  col: number;
  row: number;
  color: { r: number; g: number; b: number };
  timestamp: number;
}

export default function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<Map<string, TrailCell>>(new Map());
  const mouseRef = useRef({ x: -1, y: -1 });
  const rafRef = useRef<number>(0);
  const lastCellRef = useRef("");
  const idleRef = useRef(false);
  const drawnIdleRef = useRef(false);

  const getRandomColor = () =>
    TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const addTrailCell = useCallback((x: number, y: number) => {
    mouseRef.current = { x, y };
    idleRef.current = false;
    drawnIdleRef.current = false;
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    const key = `${col},${row}`;

    if (key !== lastCellRef.current) {
      lastCellRef.current = key;
      trailRef.current.set(key, {
        col,
        row,
        color: getRandomColor(),
        timestamp: performance.now(),
      });
    }
  }, []);

  const handleMouse = useCallback(
    (e: MouseEvent) => addTrailCell(e.clientX, e.clientY),
    [addTrailCell]
  );

  const handleTouch = useCallback(
    (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) addTrailCell(t.clientX, t.clientY);
    },
    [addTrailCell]
  );

  const draw = useCallback((time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Skip redraws when idle (no trails, no mouse movement) to save battery
    if (idleRef.current && drawnIdleRef.current) {
      rafRef.current = requestAnimationFrame(draw);
      return;
    }

    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    // Draw trail cells (fading)
    const trail = trailRef.current;
    const expired: string[] = [];

    trail.forEach((cell, key) => {
      const elapsed = time - cell.timestamp;
      if (elapsed > TRAIL_DURATION) {
        expired.push(key);
        return;
      }

      const progress = elapsed / TRAIL_DURATION;
      // Ease out — fast start, slow fade
      const alpha = Math.max(0, 0.08 * (1 - progress * progress));
      const { r, g, b } = cell.color;

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.fillRect(
        cell.col * CELL_SIZE,
        cell.row * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    });

    // Cleanup expired cells
    for (const key of expired) trail.delete(key);

    // If no trail cells remain and mouse hasn't moved, mark idle
    if (trail.size === 0 && expired.length > 0) {
      idleRef.current = true;
    }

    // Highlight current cell
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    if (mx >= 0 && my >= 0) {
      const curCol = Math.floor(mx / CELL_SIZE);
      const curRow = Math.floor(my / CELL_SIZE);
      ctx.fillStyle = "rgba(59, 130, 246, 0.06)";
      ctx.fillRect(
        curCol * CELL_SIZE,
        curRow * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    // Draw grid lines
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 0.5;
    ctx.beginPath();

    // Vertical lines
    for (let x = 0; x <= w; x += CELL_SIZE) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
    }
    // Horizontal lines
    for (let y = 0; y <= h; y += CELL_SIZE) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
    }
    ctx.stroke();

    // Radial fade mask — grid fades toward edges
    const gradient = ctx.createRadialGradient(
      w / 2,
      h * 0.4,
      Math.min(w, h) * 0.15,
      w / 2,
      h * 0.4,
      Math.max(w, h) * 0.8
    );
    gradient.addColorStop(0, "rgba(10, 10, 10, 0)");
    gradient.addColorStop(0.7, "rgba(10, 10, 10, 0.3)");
    gradient.addColorStop(1, "rgba(10, 10, 10, 0.75)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    if (idleRef.current) drawnIdleRef.current = true;
    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("touchmove", handleTouch, { passive: true });
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("touchmove", handleTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleResize, handleMouse, handleTouch, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
