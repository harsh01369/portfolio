"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Projects Shipped", value: "10+" },
  { label: "Monthly Organic Reach", value: "700K+" },
  { label: "Technologies", value: "40+" },
  { label: "Content Assets Generated", value: "3,500+" },
];

export default function StatsSection() {
  return (
    <section className="relative border-t border-border overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="mx-auto max-w-5xl px-6 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: "easeOut" as const },
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
