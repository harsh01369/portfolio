"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const STEPS = [
  { num: "01", title: "Scope", caption: "Real constraints first, mockups never." },
  { num: "02", title: "Build", caption: "Shipped code, not slide decks." },
  { num: "03", title: "Verify", caption: "Every claim checked against real data." },
  { num: "04", title: "Ship", caption: "Live in production, not a demo link." },
];

export default function ProcessSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const trackWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="border-t border-border bg-surface px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <p className="text-sm font-medium text-accent">How I Build</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Same process, every project.
          </h2>
        </motion.div>

        {/* scroll-linked progress track -- the scroll position IS the
            timeline here, the direct web equivalent of the trailer's
            time-driven arrow sweeping across the 4-step track */}
        <div className="relative mb-10 hidden h-0.5 bg-border sm:block">
          <motion.div
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: trackWidth, boxShadow: "0 0 10px rgba(20,184,166,0.5)" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className="rounded-2xl border border-border bg-bg p-7"
            >
              <p className="text-5xl font-black leading-none text-accent">{step.num}</p>
              <h3 className="mt-4 text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{step.caption}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
