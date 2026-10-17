"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Organic Growth (6mo)", value: "18x" },
  { label: "AI Overview Citations", value: "13,147" },
  { label: "New Users (5wks)", value: "500+" },
  { label: "Projects Shipped", value: "14+" },
];

export default function StatsSection() {
  return (
    <section className="relative border-t border-border overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center text-sm font-medium text-accent"
        >
          The Numbers
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, scale: 0.75, y: 14 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { duration: 0.45, type: "spring" as const, bounce: 0.4 },
                },
              }}
              className="text-center"
            >
              <p className="text-4xl font-bold gradient-text">{stat.value}</p>
              <p className="mt-2 text-sm text-text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
