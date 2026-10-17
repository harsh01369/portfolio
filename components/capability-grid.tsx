"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const TABS = ["Web Builds", "AI Content Pipelines", "SEO & AEO", "Motion Graphics"];

const CELLS = [
  {
    title: "Web Builds",
    sub: "Shipped, not mocked up.",
    thumb: "/images/projects/bhairav-aaradhyaa/thumbnail.png",
    icon: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 stroke-accent" fill="none" strokeWidth={1.5}>
        <rect x="2" y="3" width="16" height="14" rx="2" />
        <path d="M2 7h16" />
      </svg>
    ),
  },
  {
    title: "AI Content Pipelines",
    sub: "Research, write, verify, send.",
    thumb: "/images/projects/silentgreen/thumbnail.png",
    icon: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 stroke-accent" fill="none" strokeWidth={1.5}>
        <circle cx="4" cy="10" r="2" />
        <circle cx="16" cy="4" r="2" />
        <circle cx="16" cy="16" r="2" />
        <path d="M6 10h4M11.5 5.5L13.5 8.5M11.5 14.5L13.5 11.5" />
      </svg>
    ),
  },
  {
    title: "SEO & AEO",
    sub: "Cited by the AI, not just ranked.",
    stat: "13,147",
    icon: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 stroke-accent" fill="none" strokeWidth={1.5}>
        <circle cx="10" cy="10" r="8" />
        <ellipse cx="10" cy="10" rx="3.3" ry="8" />
        <path d="M2 10h16" />
      </svg>
    ),
  },
  {
    title: "Motion Graphics",
    sub: "Built with the same frame-by-frame renderer as the demo above.",
    thumb: "/images/projects/previsit/thumbnail.png",
    icon: (
      <svg viewBox="0 0 20 20" className="h-6 w-6 stroke-accent" fill="none" strokeWidth={1.5}>
        <rect x="2" y="2" width="16" height="16" rx="2" />
        <path d="M8 7l5 3-5 3z" />
      </svg>
    ),
  },
];

const TAB_STEP_MS = 650;

function TabBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [active, setActive] = useState(0);
  const [cyclesLeft, setCyclesLeft] = useState(TABS.length);

  useEffect(() => {
    if (!inView || cyclesLeft <= 0) return;
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % TABS.length);
      setCyclesLeft((c) => c - 1);
    }, TAB_STEP_MS);
    return () => clearTimeout(id);
  }, [inView, cyclesLeft, active]);

  return (
    <div ref={ref} className="mb-10 flex justify-center">
      <div className="relative inline-flex gap-1 rounded-full border border-border bg-surface p-1.5">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(i)}
            className="relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
            style={{ color: active === i ? "#ffffff" : "var(--color-text-muted)" }}
          >
            {active === i && (
              <motion.span
                layoutId="capability-tab-indicator"
                className="absolute inset-0 rounded-full bg-text-primary"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CapabilityGrid() {
  return (
    <section className="border-t border-border px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="text-sm font-medium text-accent">What I Do</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Four disciplines, one build.
          </h2>
        </motion.div>

        <TabBar />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
        >
          {CELLS.map((cell) => (
            <motion.div
              key={cell.title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/40 bg-accent/10">
                {cell.icon}
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight">{cell.title}</h3>
              <p className="mt-1.5 text-sm text-text-muted">{cell.sub}</p>

              {cell.thumb && (
                <div className="absolute -right-3 -bottom-3 w-[46%] overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.18)]" style={{ transform: "rotate(2deg)" }}>
                  <Image src={cell.thumb} alt="" width={400} height={300} className="h-auto w-full object-cover" />
                </div>
              )}
              {cell.stat && (
                <span className="absolute bottom-6 right-7 text-4xl font-black tracking-tight text-accent">
                  {cell.stat}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
