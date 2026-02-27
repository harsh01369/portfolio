import type { Experience } from "@/data/experience";

export default function TimelineItem({
  experience,
}: {
  experience: Experience;
}) {
  return (
    <div className="relative pl-8 pb-10 last:pb-0 group">
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-0 w-px bg-border group-last:hidden" />

      {/* Dot */}
      <div
        className={`absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 ${
          experience.type === "work"
            ? "border-accent bg-accent-muted"
            : "border-text-muted bg-surface"
        }`}
      />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="text-base font-semibold text-text-primary">
            {experience.title}
          </h3>
          <span className="text-xs text-text-muted whitespace-nowrap">
            {experience.period}
          </span>
        </div>
        <p className="text-sm text-accent mt-0.5">
          {experience.company}
          <span className="text-text-muted"> &middot; {experience.location}</span>
        </p>

        <ul className="mt-3 space-y-1.5">
          {experience.description.map((item, i) => (
            <li key={i} className="text-sm text-text-secondary leading-relaxed">
              {item}
            </li>
          ))}
        </ul>

        {experience.technologies && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-block rounded-full bg-surface-hover px-2 py-0.5 text-xs text-text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
