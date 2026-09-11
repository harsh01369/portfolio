import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLeadPreview } from "@/data/lead-previews";
import { getIndustryBySlug } from "@/lib/solutions";
import PreviewPageContent from "@/components/solutions/preview-page-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const preview = getLeadPreview(slug);
  if (!preview) return {};
  return {
    title: `${preview.businessName} Preview`,
    description: `A live preview built for ${preview.businessName}.`,
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function LeadPreviewPage({ params }: Props) {
  const { slug } = await params;
  const preview = getLeadPreview(slug);
  if (!preview) notFound();

  const industry = getIndustryBySlug("medico")!;

  return <PreviewPageContent preview={preview} industry={industry} />;
}
