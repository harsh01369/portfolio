"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SignatureRing from "@/components/signature-ring";

export default function CtaBand() {
  return (
    <section className="relative overflow-hidden border-t border-border px-6 py-24 text-center sm:py-32">
      <div className="relative mx-auto max-w-3xl">
        <div className="relative mx-auto mb-6 h-0 w-0">
          <SignatureRing />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
          className="text-3xl font-bold tracking-tight sm:text-5xl"
        >
          Tell me what you&rsquo;re building.
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-text-primary px-7 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-accent-hover"
          >
            Start a project
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <span className="rounded-full bg-accent-muted px-3 py-1 font-mono text-xs text-accent-hover">
            harshkhetia.dev
          </span>
        </motion.div>
      </div>
    </section>
  );
}
