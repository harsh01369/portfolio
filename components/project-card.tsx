"use client";

import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import CardSpotlight from "./card-spotlight";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <CardSpotlight className="h-full overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:border-border-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
        <div className="relative aspect-video overflow-hidden bg-bg">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={project.image.endsWith(".gif")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
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
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-text-secondary border border-white/5"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="inline-block rounded-md bg-white/5 px-2 py-0.5 text-xs text-text-muted border border-white/5">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>
        </div>
      </CardSpotlight>
    </Link>
  );
}
