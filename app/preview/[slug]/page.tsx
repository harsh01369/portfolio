import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLeadPreview } from "@/data/lead-previews";
import { getProofOfWorkPreview } from "@/data/proof-of-work-previews";
import { getIndustryBySlug } from "@/lib/solutions";
import PreviewPageContent from "@/components/solutions/preview-page-content";
import ProofOfWorkPageContent from "@/components/solutions/proof-of-work-page-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const preview = getLeadPreview(slug);
  if (preview) {
    return {
      title: `${preview.businessName} Preview`,
      description: `A live preview built for ${preview.businessName}.`,
      robots: { index: false, follow: false, nocache: true },
    };
  }
  const proofOfWork = getProofOfWorkPreview(slug);
  if (proofOfWork) {
    return {
      title: `${proofOfWork.companyName} Preview`,
      description: `A live demo built for ${proofOfWork.companyName}.`,
      robots: { index: false, follow: false, nocache: true },
    };
  }
  return {};
}

export default async function LeadPreviewPage({ params }: Props) {
  const { slug } = await params;

  const preview = getLeadPreview(slug);
  if (preview) {
    const industry = getIndustryBySlug("medico")!;
    return <PreviewPageContent preview={preview} industry={industry} />;
  }

  const proofOfWork = getProofOfWorkPreview(slug);
  if (proofOfWork) {
    return <ProofOfWorkPageContent preview={proofOfWork} />;
  }

  notFound();
}
