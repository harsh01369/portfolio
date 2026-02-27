interface SectionHeaderProps {
  title: string;
  description?: string;
}

export default function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-lg text-text-secondary max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
