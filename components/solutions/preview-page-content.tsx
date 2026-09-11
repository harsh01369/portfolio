"use client";

import type { LeadPreviewConfig } from "@/data/lead-previews";
import type { IndustryConfig } from "@/data/solutions-config";
import WhatsAppSimulator from "./whatsapp-simulator";

interface Props {
  preview: LeadPreviewConfig;
  industry: IndustryConfig;
}

export default function PreviewPageContent({ preview, industry }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div
        className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
        style={{ color: preview.accentColor }}
      >
        Built for {preview.businessName}
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.1] mb-4">
        {preview.tagline}
      </h1>

      <p className="text-lg text-text-primary/70 leading-relaxed mb-8 max-w-xl">
        {preview.heroNote}. Here's what it looks like when someone messages {preview.businessName}{" "}
        and actually gets an answer, instantly, day or night.
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-primary/60 mb-14 pb-14 border-b border-text-primary/10">
        <span>{preview.city}</span>
        <span aria-hidden="true">•</span>
        <a href={preview.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-text-primary/20 hover:decoration-text-primary/60 transition-colors">
          {preview.sourceUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
        </a>
      </div>

      <div className="grid md:grid-cols-[1fr_auto] gap-10 items-start">
        <div className="order-2 md:order-1">
          <h2 className="text-xl font-semibold text-text-primary mb-3">Try it yourself</h2>
          <p className="text-sm text-text-primary/60 leading-relaxed mb-6 max-w-sm">
            This isn't a script playing back, it's a real conversation. Ask it something a patient
            actually would, a price, your hours, the Invisalign promotion, and watch it answer, then
            hand off to booking.
          </p>

          <div className="space-y-3">
            {preview.factsSummary.map((fact) => (
              <div key={fact} className="flex gap-3 text-sm text-text-primary/70 leading-relaxed">
                <span
                  className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: preview.accentColor }}
                  aria-hidden="true"
                />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 md:order-2 md:sticky md:top-24">
          <WhatsAppSimulator
            industry={industry}
            solutionSlug="ai-chatbot"
            overrideBusinessName={preview.businessName}
            leadId={preview.opportunityId}
          />
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-text-primary/10 text-xs text-text-primary/40 leading-relaxed">
        Every fact this assistant uses came from {preview.businessName}&apos;s own site. Anything
        not published there, it says so rather than guessing, same as it would for a real patient.
      </div>
    </div>
  );
}
