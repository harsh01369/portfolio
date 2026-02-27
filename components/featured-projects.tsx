"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import CardSpotlight from "./card-spotlight";

export default function FeaturedProjects({
  projects,
}: {
  projects: Project[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth ?? 400;
    el.scrollBy({
      left: direction === "left" ? -cardWidth - 16 : cardWidth + 16,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-28">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
      >
        <div>
          <p className="text-sm font-medium text-accent mb-2">Portfolio</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
            Featured Projects
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Slider arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous project"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next project"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          <Link
            href="/projects"
            className="group text-sm text-text-muted hover:text-accent transition-colors flex items-center gap-1"
          >
            View all
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </motion.div>

      {/* Slider */}
      <div className="relative">
        {/* Fade edges */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="w-[calc(100vw-3rem)] sm:w-[400px] flex-shrink-0 snap-start"
            >
              <Link href={`/projects/${project.slug}`} className="group block h-full">
                <CardSpotlight className="h-full overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:border-border-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden bg-bg">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="400px"
                      unoptimized={project.image.endsWith(".gif")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <svg
                        className="w-4 h-4 text-text-muted shrink-0 mt-1 transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 17L17 7M17 7H7M17 7v10"
                        />
                      </svg>
                    </div>

                    <p className="mt-2 text-sm text-text-muted leading-relaxed line-clamp-2">
                      {project.tagline}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-text-secondary border border-white/5"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-text-muted border border-white/5">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </CardSpotlight>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
