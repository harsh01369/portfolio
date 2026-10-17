"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

interface CaseStudy {
  slug: string;
  index: string;
  domain: string;
}

// The 3 real case studies the trailer built around — same order, same
// framing (numbered chrome, giant background name, an open-laptop mockup
// around the real screenshot, tagline + domain chip row).
const CASES: CaseStudy[] = [
  { slug: "silentgreen", index: "01", domain: "silentgreen.vercel.app" },
  { slug: "bhairav-aaradhyaa", index: "02", domain: "bhairavaaradhyaa.com" },
  { slug: "previsit", index: "03", domain: "previsit-pi.vercel.app" },
];

function CaseCard({ project, meta }: { project: Project; meta: CaseStudy }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative border-t border-border py-16 sm:py-24"
    >
      {/* giant background name -- sits behind the laptop mockup, starting
          below the chrome row rather than overlapping it (an earlier pass
          had "( Live now )" rendering illegibly on top of the name's
          letterforms, confirmed on a rendered screenshot) */}
      <div
        className="pointer-events-none absolute left-0 top-24 select-none whitespace-nowrap text-[18vw] font-black leading-none tracking-tighter text-accent/90 sm:top-28 sm:text-[9rem]"
        aria-hidden="true"
      >
        {project.title.split(" ")[0].toUpperCase()}
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="relative z-10 mb-6 flex items-center justify-between font-mono text-xs text-text-muted">
          <span className="rounded bg-surface/90 px-1.5 py-0.5 backdrop-blur-sm">( Live now )</span>
          <span className="rounded bg-surface/90 px-1.5 py-0.5 backdrop-blur-sm">{meta.index}</span>
        </div>

        {/* open-laptop mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15, type: "spring", bounce: 0.3 }}
          className="relative ml-auto w-full max-w-3xl"
        >
          <div className="-rotate-[0.6deg] rounded-xl bg-[#161819] p-3 shadow-[0_50px_100px_rgba(0,0,0,0.22)] sm:p-4">
            <div className="overflow-hidden rounded-[4px]">
              <div className="flex h-7 items-center gap-2 bg-[#1a1d1f] px-3 sm:h-8">
                <span className="h-2 w-2 rounded-full bg-[#ec6a5e]" />
                <span className="h-2 w-2 rounded-full bg-[#f4bf4f]" />
                <span className="h-2 w-2 rounded-full bg-[#61c454]" />
                <span className="ml-2 rounded bg-[#0f1112] px-2 py-0.5 font-mono text-[10px] text-text-muted sm:text-xs">
                  {meta.domain}
                </span>
              </div>
              <div className="relative aspect-video w-full bg-[#0f1112]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 768px, 100vw"
                />
              </div>
            </div>
          </div>
          <div
            className="-mt-px h-[6%] bg-gradient-to-b from-[#0d0e0f] to-[#232627]"
            style={{ maxHeight: 8 }}
          />
          <div
            className="relative mx-[-5%] h-10 bg-gradient-to-b from-[#a7aaad] to-[#7e8184] shadow-[0_20px_30px_rgba(0,0,0,0.25)] sm:h-14"
            style={{ clipPath: "polygon(5.5% 0, 94.5% 0, 100% 100%, 0% 100%)" }}
          />
        </motion.div>

        {/* chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <span className="rounded-full bg-text-primary px-4 py-2 text-sm font-semibold text-accent-muted">
            {project.tagline}
          </span>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-text-primary px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-text-primary hover:text-bg"
            >
              {meta.domain} ↗
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center rounded-full px-4 py-2 text-sm font-semibold text-accent hover:text-accent-hover"
          >
            Read the case study →
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function CaseStudyShowcase({ projects }: { projects: Project[] }) {
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="mx-auto max-w-5xl px-6 pt-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium text-accent"
        >
          Selected Work
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Real projects, live right now.
        </motion.h2>
      </div>

      {CASES.map((meta) => {
        const project = bySlug[meta.slug];
        if (!project) return null;
        return <CaseCard key={meta.slug} project={project} meta={meta} />;
      })}
    </section>
  );
}
