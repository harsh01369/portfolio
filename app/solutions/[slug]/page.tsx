import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutions, industries } from "@/data/solutions-config";
import { getSolutionBySlug } from "@/lib/solutions";
import SolutionPageContent from "@/components/solutions/solution-page-content";

interface Props { params: Promise<{ slug: string }>; }

export async function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};
  return {
    title: `${solution.title} for Local Businesses`,
    description: `${solution.description} Built for ${industries.map((i) => i.label).join(", ")}.`,
  };
}

export default async function SolutionPage({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();
  return (
    <Suspense>
      <SolutionPageContent solution={solution} />
    </Suspense>
  );
}
