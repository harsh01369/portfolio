import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries } from "@/data/solutions-config";
import { getSolutionBySlug, getIndustryBySlug, getContentFor, isValidIndustrySlug } from "@/lib/solutions";
import { createMetadata } from "@/lib/metadata";
import SolutionPageContent from "@/components/solutions/solution-page-content";

interface Props {
  params: Promise<{ slug: string; industry: string }>;
}

export async function generateStaticParams() {
  const { solutions } = await import("@/data/solutions-config");
  return solutions.flatMap((s) => industries.map((i) => ({ slug: s.slug, industry: i.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, industry } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution || !isValidIndustrySlug(industry)) return {};

  const industryConfig = getIndustryBySlug(industry)!;
  const content = getContentFor(slug, industry);
  return createMetadata({
    title: `${solution.title} for ${industryConfig.label} Businesses`,
    description: content.heroSubheadline,
    path: `/solutions/${slug}/${industry}`,
  });
}

export default async function SolutionIndustryPage({ params }: Props) {
  const { slug, industry } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution || !isValidIndustrySlug(industry)) notFound();

  return (
    <Suspense fallback={null}>
      <SolutionPageContent solution={solution} initialIndustry={industry} />
    </Suspense>
  );
}
