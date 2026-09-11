"use client";

import { useState } from "react";
import type { LeadPreviewConfig } from "@/data/lead-previews";
import type { IndustryConfig } from "@/data/solutions-config";
import WhatsAppSimulator from "./whatsapp-simulator";
import BookingCalendar from "./booking-calendar";

interface Props {
  preview: LeadPreviewConfig;
  industry: IndustryConfig;
}

export default function PreviewPageContent({ preview, industry }: Props) {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div
        className="text-xs font-semibold uppercase tracking-[0.15em] mb-4"
        style={{ color: preview.accentColor }}
      >
        A live preview, built just for you
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-text-primary leading-[1.1] mb-3">
        {preview.businessName}
      </h1>

      <p
        className="text-lg font-medium mb-6"
        style={{ color: preview.accentColor }}
      >
        {preview.tagline}
      </p>

      <p className="text-lg text-text-primary/70 leading-relaxed mb-8 max-w-xl">
        The chat on the right is live, ask it something real. It's running off your actual hours, services and
        current promotions, not placeholder copy.
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
          <h2 className="text-xl font-semibold text-text-primary mb-5">What changes for a patient</h2>

          <div className="space-y-5">
            {preview.journeySteps.map((step) => (
              <div key={step.customerAsks} className="relative pl-5">
                <span
                  className="absolute left-0 top-[7px] w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: preview.accentColor }}
                  aria-hidden="true"
                />
                <p className="text-sm text-text-primary/50 mb-1">{step.customerAsks}</p>
                <p className="text-sm text-text-primary/85 leading-relaxed">{step.whatHappens}</p>
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
            onBook={() => setShowCalendar(true)}
          />
        </div>
      </div>

      {showCalendar && (
        <div id="contact-form" className="mt-16 scroll-mt-24">
          <BookingCalendar
            businessName={preview.businessName}
            accentColor={preview.accentColor}
            closedWeekdays={preview.closedWeekdays}
          />
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-text-primary/10">
        <p className="text-sm text-text-primary/60 mb-2">
          This page is a working example, not a pitch deck. If it's useful, let's talk about setting it up for real.
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
        Everything this assistant says comes from {preview.businessName}&apos;s own site. Anything not published
        there, it says so instead of guessing.
      </div>
    </div>
  );
}
