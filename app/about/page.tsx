import type { Metadata } from "next";
import { skills } from "@/data/skills";
import { experiences } from "@/data/experience";
import AnimatedPageHeader from "@/components/animated-page-header";
import AnimatedSkillGrid from "@/components/animated-skill-grid";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Full Stack Developer and AI Engineer based in Manchester, UK. BSc (Hons) Computer Science from Lancaster University. 10+ projects shipped including dual-payment platforms, AI news pipelines, and content automation engines reaching 700K+ monthly reach.",
  path: "/about",
});

export default function AboutPage() {
  const education = experiences.filter((e) => e.type === "education");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <AnimatedPageHeader
        label="About"
        title="About Me"
        description="Full Stack Developer and AI Engineer. I build production systems that handle real payments, real users, and real data."
      />

      {/* Bio */}
      <div className="max-w-3xl space-y-5 text-text-secondary leading-relaxed">
        <p>
          I am a Full Stack Developer and AI Engineer based in Manchester, UK. I
          graduated with a BSc (Hons) in Computer Science from University
          Academy 92 (Lancaster University) and have since shipped 10+ projects
          across e-commerce, AI automation, content systems, and real-time
          applications.
        </p>
        <p>
          My biggest project is{" "}
          <a href="/projects/bhairav-aaradhyaa" className="text-accent hover:text-accent-hover transition-colors">
            Bhairav Aaradhyaa
          </a>
          , a full-stack spiritual tech platform I built from scratch. It serves
          users in India and internationally with 65 divine forms, 45 Sanskrit
          stotras, a japa counter with streak gamification, and a life purpose
          questionnaire algorithm. The platform processes live payments through
          two gateways: Stripe for international users and Instamojo for Indian
          users, with MaxMind GeoIP routing users to the correct checkout
          automatically. I also built a Puppeteer-based pre-rendering pipeline
          that converts 192 React routes into static HTML so Google can actually
          index the content.
        </p>
        <p>
          Alongside the platform, I built{" "}
          <a href="/projects/contentforge" className="text-accent hover:text-accent-hover transition-colors">
            ContentForge
          </a>
          , a content automation engine that generates 3,500+ social media assets
          from a single data source. It renders HTML templates into
          platform-specific images via Puppeteer for Instagram, Pinterest,
          Twitter/X, and Facebook. The system handles scheduling with rate
          limiting, cross-platform deduplication, and includes an AI-powered
          Instagram DM engine using Groq. Organic reach across the brand hit
          700K+ monthly.
        </p>
        <p>
          On the e-commerce side, I built{" "}
          <a href="/projects/uwear" className="text-accent hover:text-accent-hover transition-colors">
            UWEAR UK
          </a>
          , a complete online store with a React storefront, Express backend, and
          a separate admin dashboard. The admin dashboard polls for new orders
          every 5 seconds with audio notifications, shows 30-day sales charts
          via Chart.js, and handles inventory tracking across 200+ products. I
          also built{" "}
          <a href="/projects/cybership" className="text-accent hover:text-accent-hover transition-colors">
            CyberShip
          </a>
          , a carrier-agnostic shipping rate library using the Adapter pattern
          with UPS OAuth 2.0 integration, Zod validation, and 100% test
          coverage.
        </p>
        <p>
          My AI work includes{" "}
          <a href="/projects/geobot" className="text-accent hover:text-accent-hover transition-colors">
            GeoThreadBot
          </a>
          , a 7-stage Python pipeline that fetches news from Twitter, YouTube,
          and RSS feeds concurrently, detects 12+ languages, scores relevance
          with SpaCy and VADER, summarises articles using BART transformers,
          cross-verifies facts against credible sources, and publishes approved
          stories to Twitter/X. I refactored it from a 953-line prototype into
          25 modules across 8 packages with 19 unit tests. I also built{" "}
          <a href="/projects/helec" className="text-accent hover:text-accent-hover transition-colors">
            HELEC
          </a>
          , a real-time AI customer support chat using SvelteKit, Fastify,
          Socket.IO, and Groq&apos;s LLM for response generation.
        </p>
        <p>
          My stack covers the full picture: React 19, SvelteKit, and Next.js on
          the frontend. Express 5, Fastify 5, and Flask on the backend.
          PostgreSQL, MongoDB, and SQLite for data. Python with TensorFlow,
          SpaCy, and Hugging Face for AI/ML. Docker, Vercel, Render, and
          Hostinger for deployment. I pick what fits the problem rather than
          defaulting to the same tools every time.
        </p>
        <p>
          I am currently looking for full-time opportunities in full stack
          development or AI engineering. I want to work on products where I can
          own features end to end and ship things that people actually use.
        </p>
      </div>

      {/* Skills */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-10 gradient-text inline-block">
          Technical Skills
        </h2>
        <AnimatedSkillGrid skills={skills} />
      </div>

      {/* Education */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-8 gradient-text inline-block">
          Education
        </h2>
        <div className="space-y-4">
          {education.map((edu) => (
            <div
              key={edu.title}
              className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-border-hover"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h3 className="text-base font-semibold text-text-primary">
                  {edu.title}
                </h3>
                <span className="text-xs text-text-muted">{edu.period}</span>
              </div>
              <p className="text-sm text-accent mt-1">
                {edu.company}
                <span className="text-text-muted">
                  {" "}
                  &middot; {edu.location}
                </span>
              </p>
              <p className="mt-3 text-sm text-text-secondary">
                {edu.description[0]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight mb-8 gradient-text inline-block">
          Certifications
        </h2>
        <div className="space-y-4">
          <a
            href="/Harsh_Khetia_Certificate.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border border-border bg-surface p-6 transition-all hover:border-border-hover hover:bg-surface-hover group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
                Generative AI Mastermind
              </h3>
              <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                View Certificate
              </span>
            </div>
            <p className="text-sm text-accent mt-1">
              Outskill
            </p>
            <p className="mt-3 text-sm text-text-secondary">
              Comprehensive training in generative AI systems, prompt engineering, LLM architectures, and applied AI development.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
