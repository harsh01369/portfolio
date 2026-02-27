"use client";

import { motion } from "framer-motion";

interface AnimatedPageHeaderProps {
  label?: string;
  title: string;
  description?: string;
}

export default function AnimatedPageHeader({
  label,
  title,
  description,
}: AnimatedPageHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className="mb-14"
    >
      {label && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="text-sm font-medium text-accent mb-3"
        >
          {label}
        </motion.p>
      )}
      <motion.h1
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
        className="text-4xl font-bold tracking-tight sm:text-5xl gradient-text"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
          className="mt-4 text-lg text-text-secondary max-w-2xl"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
