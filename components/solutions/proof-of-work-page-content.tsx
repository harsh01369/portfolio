"use client";

import type { ProofOfWorkPreviewConfig } from "@/data/proof-of-work-previews";
import DataVideoPlayerDemo from "./data-video-player-demo";
import DiscoveryJourneyDemo from "./discovery-journey-demo";
import CareerPathDemo from "./career-path-demo";
import { demoRegistry } from "./demo-registry";

interface Props {
  preview: ProofOfWorkPreviewConfig;
}

function DemoByKind({ preview }: { preview: ProofOfWorkPreviewConfig }) {
  switch (preview.demoKind) {
    case "data-video":
      return <DataVideoPlayerDemo scenes={preview.scenes} accentColor={preview.accentColor} bgDark={preview.bgDark} />;
    case "discovery-journey":
      return (
        <DiscoveryJourneyDemo
          practicePrompt={preview.practicePrompt}
          practiceFeedback={preview.practiceFeedback}
          plans={preview.plans}
          confirmationHeadline={preview.confirmationHeadline}
          confirmationNote={preview.confirmationNote}
          accentColor={preview.accentColor}
          bgDark={preview.bgDark}
        />
      );
    case "career-path":
      return <CareerPathDemo paths={preview.paths} accentColor={preview.accentColor} bgDark={preview.bgDark} />;
    case "registry": {
      const Demo = demoRegistry[preview.registryKey];
      if (!Demo) return null;
      return <Demo accentColor={preview.accentColor} bgDark={preview.bgDark} />;
    }
  }
}

export default function ProofOfWorkPageContent({ preview }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div
        className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
        style={{ color: preview.accentColor }}
      >
        Built in response to your open role
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.1] mb-3">
        {preview.companyName}
      </h1>

      <p className="text-lg font-medium mb-6" style={{ color: preview.accentColor }}>
        {preview.roleTitle}
      </p>

      <p className="text-lg text-text-primary/70 leading-relaxed mb-3 max-w-xl">{preview.whatTheyAsked}</p>
      <p className="text-base text-text-primary/60 leading-relaxed mb-8 max-w-xl">{preview.heroNote}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-primary/60 mb-14 pb-14 border-b border-text-primary/10">
        <span>{preview.city}</span>
        <span aria-hidden="true">•</span>
        <a
          href={preview.companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-text-primary/20 hover:decoration-text-primary/60 transition-colors"
        >
          {preview.companyUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </a>
        <span aria-hidden="true">•</span>
        <a
          href={preview.jobPostingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-text-primary/20 hover:decoration-text-primary/60 transition-colors"
        >
          the posting
        </a>
      </div>

      <div className="grid md:grid-cols-[1fr_440px] gap-10 items-start">
        <div className="order-2 md:order-1">
          <h2 className="text-xl font-semibold text-text-primary mb-5">What this demo is</h2>
          <p className="text-sm text-text-primary/85 leading-relaxed mb-5">{preview.demoExplainer}</p>
          <p className="text-xs text-text-primary/50 leading-relaxed">{preview.sampleDataNote}</p>
        </div>

        <div className="order-1 md:order-2 md:sticky md:top-24 flex justify-center md:justify-end">
          <DemoByKind preview={preview} />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-text-primary/10">
        <p className="text-sm text-text-primary/60 mb-2">
          Happy to walk through how this was built, and how it'd extend to real client data, on a free call, no
          charge, no pressure.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: preview.accentColor }}
        >
          Get in touch
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>

      <div className="mt-8 pt-8 border-t border-text-primary/10 text-xs text-text-primary/40 leading-relaxed">
        This page was built specifically for {preview.companyName} in response to the {preview.roleTitle} posting,
        not sent to anyone else.
      </div>
    </div>
  );
}
