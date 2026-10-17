"use client";

import { motion } from "framer-motion";

/**
 * Recurring ring-bloom mark used at the top of the hero and again in the
 * closing CTA — the same bookend device used throughout the trailer, so the
 * homepage carries one recognizable signature instead of each section
 * inventing its own flourish.
 */
export default function SignatureRing({ className = "" }: { className?: string }) {
  return (
    <span className={`pointer-events-none relative inline-block ${className}`} aria-hidden="true">
      <motion.span
        className="absolute left-1/2 top-1/2 rounded-full border-2"
        style={{ borderColor: "#5eead4" }}
        initial={{ width: 10, height: 10, x: "-50%", y: "-50%", opacity: 1 }}
        whileInView={{ width: 80, height: 80, opacity: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <motion.span
        className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full"
        style={{ background: "#5eead4", x: "-50%", y: "-50%" }}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: [0, 1, 0], scale: [0.5, 1.6, 2] }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
    </span>
  );
}
