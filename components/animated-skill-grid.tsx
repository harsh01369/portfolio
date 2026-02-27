"use client";

import { motion } from "framer-motion";
import type { SkillCategory } from "@/data/skills";

export default function AnimatedSkillGrid({
  skills,
}: {
  skills: SkillCategory[];
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.01 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {skills.map((category) => (
        <motion.div
          key={category.name}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.4, ease: "easeOut" as const },
            },
          }}
          className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-hover"
        >
          <h3 className="text-xs font-medium uppercase tracking-wider text-accent mb-4">
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill}
                className="inline-block rounded-md bg-white/5 border border-white/5 px-2.5 py-1 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
