import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { createMetadata, createJsonLd } from "@/lib/metadata";
import ImageGallery from "@/components/image-gallery";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const project = projects.find((p) => p.slug === slug);
    if (!project) return {};
    return createMetadata({
      title: project.title,
      description: project.description,
      path: `/projects/${project.slug}`,
    });
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.description,
    applicationCategory: "WebApplication",
    author: { "@type": "Person", name: "Harsh Khetia" },
  };

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={createJsonLd(jsonLd)}
      />

      <article className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        {/* Back link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All Projects
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl gradient-text">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            {project.tagline}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
              >
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-accent to-purple-500 opacity-50 blur-sm group-hover:opacity-100 transition-opacity" />
                <div className="relative inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white">
                  Visit Live Site
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:border-border-hover hover:text-text-primary transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Source
              </a>
            )}
          </div>
        </div>

        {/* Image gallery with tabs */}
        {project.images && project.images.length > 0 ? (
          <ImageGallery images={project.images} />
        ) : (
          <div className="relative mb-12">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-accent/20 to-purple-500/20 blur-lg opacity-50" />
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-surface">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
                priority
              />
            </div>
          </div>
        )}

        {/* Description */}
        <div className="space-y-4 text-text-secondary leading-relaxed text-base sm:text-lg">
          {project.longDescription.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Features + Tech in a grid */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {/* Features */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold mb-5 gradient-text inline-block">
              Key Features
            </h2>
            <ul className="space-y-3">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-text-secondary"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold mb-5 gradient-text inline-block">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-block rounded-md bg-white/5 border border-white/5 px-3 py-1.5 text-sm text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Next project link */}
        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-text-muted mb-2">Next project</p>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group inline-flex items-center gap-3 text-xl font-semibold text-text-primary hover:text-accent transition-colors"
          >
            {nextProject.title}
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </article>
    </>
  );
}
