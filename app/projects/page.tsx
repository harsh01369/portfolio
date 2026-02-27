import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/project-card";
import AnimatedPageHeader from "@/components/animated-page-header";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Projects",
  description:
    "Full stack web applications, AI pipelines, and e-commerce platforms built with React, Node.js, Python, and more.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <AnimatedPageHeader
        label="Portfolio"
        title="Projects"
        description="A collection of projects I have built, from e-commerce platforms to AI pipelines."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
