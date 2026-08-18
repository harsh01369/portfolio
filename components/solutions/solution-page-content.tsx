"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { type SolutionConfig, type IndustrySlug, industries } from "@/data/solutions-config";
import { getContentFor, getIndustryBySlug, isValidIndustrySlug } from "@/lib/solutions";
import IndustryTabs from "./industry-tabs";
import SolutionHero from "./solution-hero";
import SolutionProblem from "./solution-problem";
import SolutionFeatures from "./solution-features";
import ROICalculator from "./roi-calculator";
import SolutionHowItWorks from "./solution-how-it-works";
import SolutionProof from "./solution-proof";
import SolutionFAQ from "./solution-faq";
import PackageBuilder from "./package-builder";
import MockupSection from "./mockup-section";
import SolutionStatementBand from "./solution-statement-band";
import Icon from "./icon";

interface Props { solution: SolutionConfig; }

export default function SolutionPageContent({ solution }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const industryParam = searchParams.get("industry");
  const paramIsValid = !!industryParam && isValidIndustrySlug(industryParam);

  const [selectedIndustry, setSelectedIndustry] = useState<IndustrySlug | null>(paramIsValid ? (industryParam as IndustrySlug) : null);

  useEffect(() => {
    if (industryParam && isValidIndustrySlug(industryParam)) setSelectedIndustry(industryParam);
  }, [industryParam]);

  function choose(slug: IndustrySlug) {
    setSelectedIndustry(slug);
    router.replace(`/solutions/${solution.slug}?industry=${slug}`, { scroll: false });
  }

  // No industry chosen yet — ask, instead of silently defaulting to one.
  if (!selectedIndustry) {
    return (
      <div className="solutions-theme relative z-10">
        <div className="min-h-screen bg-white flex items-center justify-center py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-lg bg-[#eff6ff] text-[#2563eb] flex items-center justify-center mb-6">
              <Icon name={solution.icon} className="w-7 h-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#2563eb] mb-2">{solution.title}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">What kind of business is this for?</h1>
            <p className="text-[#475569] mb-10 max-w-xl mx-auto">Pick your industry and I&apos;ll show you a working example built for it, not a generic demo.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {industries.map((ind) => (
                <button key={ind.slug} onClick={() => choose(ind.slug)}
                  className="p-4 rounded-lg border border-[#e2e8f0] hover:border-current text-left transition-colors"
                  style={{ color: ind.accentColor }}>
                  <span className="block text-sm font-semibold text-[#0f172a]">{ind.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const industry = getIndustryBySlug(selectedIndustry)!;
  const content = getContentFor(solution.slug, selectedIndustry);

  return (
    <div className="solutions-theme relative z-10" style={{ "--industry-accent": industry.accentColor, "--industry-accent-dark": industry.accentDark, "--industry-accent-light": industry.accentLight } as React.CSSProperties}>
      <div className="min-h-screen bg-white">
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-sm border-b border-[#e2e8f0]">
          <div className="mx-auto max-w-5xl px-6 py-3">
            <IndustryTabs selected={selectedIndustry} onSelect={choose} />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={selectedIndustry} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <SolutionHero content={content} industry={industry} solution={solution} />
            <MockupSection industry={industry} content={content} />
            <SolutionStatementBand industry={industry} />
            <section className="py-16 border-b border-[#e2e8f0]" style={{ backgroundColor: industry.accentLight }}>
              <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-12 lg:grid-cols-2 items-start">
                  <SolutionProblem content={content} industry={industry} />
                  <ROICalculator content={content} industry={industry} solution={solution} />
                </div>
              </div>
            </section>
            <SolutionFeatures content={content} industry={industry} />
            <PackageBuilder industry={industry} />
            <SolutionHowItWorks />
            <SolutionFAQ content={content} />
            <SolutionProof content={content} industry={industry} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}