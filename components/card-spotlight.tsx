"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface CardSpotlightProps {
  children: ReactNode;
  className?: string;
}

export default function CardSpotlight({
  children,
  className,
}: CardSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`card-spotlight ${className || ""}`}
    >
      {children}
    </div>
  );
}
