import type { Metadata } from "next";
import { experiences } from "@/data/experience";
import AnimatedPageHeader from "@/components/animated-page-header";
import TimelineItem from "@/components/timeline-item";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Experience",
  description:
    "Work experience and education. Full Stack Developer with experience at startups and e-commerce companies.",
  path: "/experience",
});

export default function ExperiencePage() {
  const work = experiences.filter((e) => e.type === "work");
  const education = experiences.filter((e) => e.type === "education");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <AnimatedPageHeader
        label="Career"
        title="Experience"
        description="My professional journey and education."
      />

      <div className="grid gap-16 lg:grid-cols-[1fr_300px]">
        <div>
          <h2 className="text-xl font-semibold mb-8 gradient-text inline-block">
            Work Experience
          </h2>
          <div>
            {work.map((exp) => (
              <TimelineItem key={exp.title + exp.company} experience={exp} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-8 gradient-text inline-block">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div
                key={edu.title}
                className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-border-hover"
              >
                <h3 className="text-sm font-semibold text-text-primary">
                  {edu.title}
                </h3>
                <p className="text-sm text-accent mt-0.5">{edu.company}</p>
                <p className="text-xs text-text-muted mt-1">{edu.period}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
