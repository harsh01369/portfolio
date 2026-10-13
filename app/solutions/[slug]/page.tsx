import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutions, industries, type IndustrySlug } from "@/data/solutions-config";
import { getSolutionBySlug, getIndustryBySlug, getContentFor, isValidIndustrySlug } from "@/lib/solutions";
import { createMetadata } from "@/lib/metadata";
import SolutionPageContent from "@/components/solutions/solution-page-content";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ industry?: string | string[] }>;
}

function firstParam(v?: string | string[]): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export async function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};

  const industry = firstParam((await searchParams).industry);
  if (industry && isValidIndustrySlug(industry)) {
    const industryConfig = getIndustryBySlug(industry)!;
    const content = getContentFor(slug, industry);
    // Canonical points at the path-based URL (/solutions/[slug]/[industry]), not this
    // query-param one, so Google indexes one real page per combo instead of treating
    // every outreach-email link (?industry=...&lead=...&campaign=...) as a near-duplicate.
    // The query-param shape itself stays live forever -- real sent emails link to it.
    return createMetadata({
      title: `${solution.title} for ${industryConfig.label}`,
      description: content.heroSubheadline,
      path: `/solutions/${slug}/${industry}`,
    });
  }

  return createMetadata({
    title: `${solution.title} for Local Businesses`,
    description: `${solution.description} Built for ${industries.map((i) => i.label).join(", ")}.`,
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();

  const industryParam = firstParam((await searchParams).industry);
  const initialIndustry: IndustrySlug | null =
    industryParam && isValidIndustrySlug(industryParam) ? industryParam : null;

  return (
    <Suspense fallback={null}>
      <SolutionPageContent solution={solution} initialIndustry={initialIndustry} />
    </Suspense>
  );
}