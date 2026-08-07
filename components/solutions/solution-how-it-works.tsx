"use client";

import { motion } from "framer-motion";

const steps = [
  { n: "1", title: "Free Audit Call", desc: "A review of your online presence, the gaps, and what an upgrade would look like. No charge, no pressure." },
  { n: "2", title: "It Gets Built", desc: "A custom website and AI tools built specifically for your business, delivered in about 14 days." },
  { n: "3", title: "You See Results", desc: "More bookings, more calls, more customers from day one, with everything tracked so you can see it." },
];

export default function SolutionHowItWorks() {
  return (
    <section className="py-20 border-b border-[#e2e8f0]">
      <div className="mx-auto max-w-5xl px-6">
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest mb-2 text-center" style={{ color: "var(--industry-accent, #2563eb)" }}>The Process</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-12 text-center">How It Works</motion.h2>
        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.12 }} className="text-center relative">
              {i < 2 && <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] border-t border-dashed border-[#cbd5e1]" />}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 text-base font-semibold mb-4 relative z-10 bg-white"
                style={{ borderColor: "var(--industry-accent, #2563eb)", color: "var(--industry-accent, #2563eb)" }}>{s.n}</div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-2">{s.title}</h3>
              <p className="text-sm text-[#475569] max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}