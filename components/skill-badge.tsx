export default function SkillBadge({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary">
      {name}
    </span>
  );
}
