export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  image: string;
  images?: { src: string; alt: string }[];
  github?: string;
  live?: string;
  featured: boolean;
  /** Real, measured outcomes for this project (not activity counts). Shown as a short proof strip on the project card. */
  results?: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    slug: "number-and-verse",
    title: "Number & Verse",
    tagline: "Numerology product with a deterministic calculation core and versioned AI interpretation",
    description:
      "A one-time-purchase personal life-pattern app where numerology is a deterministic calculation layer, a separate pattern engine finds structured relationships in the results, and AI only interprets what's already been computed, never performs the computation itself. Row-level security enforced and tested on a real Postgres engine, not just application-layer checks.",
    longDescription: `Number & Verse is built around one architectural rule I kept strict throughout: AI interprets, it never calculates. Every numerology number is deterministic, the same birth data always produces the same result, computed by code, versioned, and auditable. A separate pattern engine looks at those computed facts and finds structured relationships between them. Only after both of those layers have run does an AI model (through a provider-agnostic AIProvider, currently Groq) turn the facts into readable interpretation. Scripture and planetary symbolism are kept as explicitly separate lenses rather than blended into the numerology, since conflating different systems of meaning is exactly the kind of thing that erodes trust in a product like this.

Authentication and authorization are deliberately split: Firebase proves who you are, but PostgreSQL row-level security, not application code, decides what you can read. I wrote a two-user RLS test that runs against a real Postgres engine rather than mocking the database, confirming one user genuinely cannot read, change, or delete another user's rows at the database layer. The app also refuses to start in production if it detects local-mode config, a dev-auth unlock, missing keys, a plain HTTP address, or a database role that would bypass RLS, a deliberate startup guard rather than a runtime check that could be skipped.

Payment confirmation has two independent paths that converge on the same grant code: the Stripe webhook, and a verify endpoint that runs when the user returns from checkout, so a payment still gets recognised even if the webhook is delayed or the user closes the tab before it lands. The product itself is a single one-time $9.99 purchase (no subscription) with a free tier limited to Life Path and one pattern, enforced server-side, and 20 "Ask Your Map" questions included with purchase.

The content pipeline runs its own review gate: as of the last content pass, 993 of 1,003 written pages are approved, 163 of those are published to search, and the rest stay approved-but-unindexed until a further review wave promotes them. The 10 unapproved pages (specific scripture commentary where page numbers couldn't be verified against the source) are deliberately held back rather than shipped. 231 tests cover the application, run through Vitest and Playwright, and the whole stack deploys through Railway with its own documented launch checklist (test-mode purchase, refund, second account) before anything goes live.`,
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Three.js",
      "Firebase Auth",
      "PostgreSQL",
      "Drizzle ORM",
      "Row-Level Security",
      "Stripe",
      "Groq LLM",
      "Vitest",
      "Playwright",
    ],
    features: [
      "Deterministic numerology core, separate from AI interpretation",
      "PostgreSQL row-level security tested with a real two-user database test",
      "Production startup guard refuses unsafe config (local mode, missing keys, HTTP)",
      "Dual payment confirmation: Stripe webhook + return-from-checkout verify",
      "One-time $9.99 purchase, no subscription, server-enforced free tier",
      "Content review pipeline: 993 of 1,003 pages approved, 163 published",
      "231 tests across Vitest and Playwright",
      "Cinematic Three.js WebGL hero",
    ],
    image: "/images/projects/number-and-verse/thumbnail.png",
    images: [
      { src: "/images/projects/number-and-verse/hero.png", alt: "Number & Verse, platform overview and key metrics" },
    ],
    github: "https://github.com/harsh01369/number-and-verse",
    live: "https://numberandverse.com",
    featured: true,
  },
  {
    slug: "silentgreen",
    title: "SilentGreen",
    tagline: "Catches automations that report success and did nothing, without asking a model to grade a model",
    description:
      "A verification CLI for AI and automation pipelines, built on the premise that an LLM judge marking its own family's output is the wrong tool. Instead it checks whether every checkable fact in an answer (numbers, dates, emails, identifiers, quoted text) actually appears in the source material, and carries a clock so it can catch a scheduled workflow that silently stopped firing.",
    longDescription: `SilentGreen exists because of one failure mode I kept seeing described the same way: a workflow or an AI agent reports success on every run, and the work didn't happen. An upstream API quietly renames a field, a mapping step resolves to null, a database accepts the null, an email goes out reading "Hi {{ $json.firstName }}" to a real customer, and the platform logs every single one of those runs as a 200. Nothing an error-driven monitor watches for ever fires.

The core check deliberately asks a narrower question than most AI evaluation tools: not "is this answer good," but "does every checkable fact in it appear in the material the model was actually given." Numbers, money, dates, emails, links, identifiers, and quoted passages either occur in the source or they don't, which is a question with a real, verifiable answer rather than a judgment call. I measured this against the common alternative (LLM-as-judge) rather than asserting it's better: judges score their own model family's output higher, and agreement that looks like 80% in a controlled test can collapse past 50% error under adversarial bias probes.

Every result lands in one of three verdicts: proven, violated, or unproven, and unproven is the one that matters most. If a workflow changes underneath a check, or the evidence needed to confirm something was never retained, the honest answer is "this wasn't established," not a green tick earned by default. Contracts (short YAML files stating what a pipeline is actually for) are bound to a semantic hash of the workflow graph, so renaming a node or dragging it on the canvas changes nothing, but rewiring a connection or changing a request target invalidates every check bound to it, and those checks report unproven until a person re-confirms them rather than silently continuing to report green about a graph that no longer exists.

Absence detection is the other half: a scheduled workflow that stops firing writes no execution and raises no error, so SilentGreen carries its own clock, discounting nights and weekends so an alarm doesn't fire at 2am on a Saturday for a workflow that only runs weekday business hours (and then get muted within a fortnight, which is worse than no alerting at all). The whole system is read-only against any connected platform, with no code path that can activate, deactivate, or modify anything, and produces a hash-chained, append-only evidence ledger that's deliberately plain JSON so it stays readable and diffable without the tool itself. 167 tests cover the core, and the test that gates every change isn't accuracy, it's the count of faithful answers wrongly flagged, which has to stay at zero.`,
    technologies: [
      "TypeScript",
      "Node.js",
      "n8n API",
      "LangSmith",
      "Langfuse",
      "OpenTelemetry",
      "GitHub Actions",
    ],
    features: [
      "Fact-grounding check: every number, date, email, and quote verified against the source",
      "Three verdicts (proven / violated / unproven), with no code path that turns silence into a pass",
      "Absence detection with a business-hours-aware clock for silently-stopped workflows",
      "Contracts bound to a semantic graph hash, go stale rather than rotting on change",
      "Hash-chained, append-only evidence ledger in plain diffable JSON",
      "Read-only against every connected platform, no path to modify anything",
      "Auto-unpacks LangSmith, Langfuse, and OpenTelemetry GenAI trace exports",
      "167 tests, gated on zero false positives rather than raw accuracy",
    ],
    image: "/images/projects/silentgreen/thumbnail.png",
    images: [
      { src: "/images/projects/silentgreen/hero.png", alt: "SilentGreen, verification overview and key metrics" },
    ],
    github: "https://github.com/harsh01369/silentgreen",
    live: "https://silentgreen.vercel.app/",
    results: [
      { label: "Finance Ops, UK", value: "Catches AI billing errors" },
      { label: "Fintech Ops, Singapore", value: "Verified fact vs. unproven claim" },
    ],
    featured: true,
  },
  {
    slug: "auditable",
    title: "Auditable",
    tagline: "WCAG accessibility audits where every AI finding is verified against the real DOM before it's reported",
    description:
      "An accessibility audit tool built around a number most scanners don't show you: a rule engine can fully decide only 4 of the 55 WCAG 2.2 Level A/AA success criteria. The rest need judgment, so this runs axe-core for what's mechanical, an AI pass for what isn't, and a separate verification stage that checks every AI claim against the actually-captured page before it's allowed into the report.",
    longDescription: `Auditable (wcag-evidence) runs a three-stage pipeline for every page it audits. axe-core settles what's mechanically decidable, reproducibly. A model then reads the rendered DOM, the browser-computed accessibility tree, and every interactive element, reporting what the rule engine structurally cannot see: whether alt text that technically exists actually describes the image, whether a link labelled "Read more" fails to convey its purpose out of context, whether a heading describes the section beneath it. Then, critically, a separate verification stage checks every one of those AI claims against the page actually captured, and a claim only reaches the report if it survives five checks: the WCAG criterion it cites exists, its selector resolves to exactly one element that was really captured, the markup it quotes genuinely appears there, it doesn't overturn a criterion the rule engine already fully decided, and it doesn't just restate something the engine already reported. Claims that fail verification are counted and printed in the report as rejected, not silently dropped, because a report that hides its own rejects looks identical to one that never made a mistake.

I measured accuracy rather than asserting it. Against a held-out test corpus (written after the detection prompt was already tuned, run once, not cherry-picked), the AI judgment pass catches 5 of 7 defect categories a rule engine alone structurally cannot (71%), with zero false positives across 6 deliberately-correct distractor elements built into the corpus specifically to catch a tool that over-reports. On the corpus used for tuning it scores 88%, and the README states that gap plainly rather than quoting the better number.

The tool also refuses to do two things. It won't audit a page it can't confirm is the real page, an early version set a realistic desktop user agent to look more convincing, tripped a Cloudflare bot check, and cheerfully audited the resulting "Just a moment..." interstitial as if it were the site. It now detects and refuses that case outright. And it won't report an absence of findings as conformance: of the 55 WCAG 2.2 A/AA criteria, every report states whether each one is failed, passed, not established, or needs a person, and on the W3C's own demonstration page only 1 of 55 is something a rule engine alone can fully decide. Running the tool against its own sales page caught a real bug: a muted text color computing to 4.30:1 contrast against a 4.5:1 requirement, invisible to the eye, baked into the report template itself, which meant every report the tool had generated up to that point carried the same defect.

The regulatory context is concrete: the EU's Accessibility Act has been enforceable since 28 June 2025, penalties reach €100,000, and in April 2025 the FTC separately fined an overlay-widget vendor $1,000,000 for claiming its product could make a site WCAG compliant on its own. The tool positions itself explicitly against both failure modes, a free scanner that can't make the judgment calls that are most of a real audit, and an unverified automated claim of compliance that courts and regulators have already rejected as a defense.`,
    technologies: [
      "TypeScript",
      "Node.js",
      "Playwright",
      "axe-core",
      "Claude (Anthropic API)",
      "Groq LLM",
    ],
    features: [
      "Three-stage pipeline: axe-core rule engine, AI judgment pass, independent verification",
      "Every AI claim checked against the real captured DOM before it reaches the report",
      "Measured accuracy on a held-out corpus (71%), not an asserted number",
      "Refuses to audit pages it can't confirm are real (bot-check interstitials, cookie walls)",
      "Reports coverage for all 55 WCAG 2.2 A/AA criteria as failed/passed/not-established/needs-a-person",
      "Rejected AI claims are printed in the report, never silently dropped",
      "Found and fixed a real 4.30:1 contrast defect baked into its own report template",
      "Evidence pack output: findings, coverage table, manual test plan, draft accessibility statement",
    ],
    image: "/images/projects/auditable/thumbnail.png",
    images: [
      { src: "/images/projects/auditable/hero.png", alt: "Auditable, audit overview and key metrics" },
    ],
    github: "https://github.com/harsh01369/auditable",
    live: "https://harsh01369.github.io/auditable/",
    featured: true,
  },
  {
    slug: "opportunity-intelligence-engine",
    title: "Opportunity Intelligence Engine",
    tagline:
      "Lead-discovery and cold-outreach engine: Maps scraping, SMTP verification, sequenced sending",
    description:
      "A cold-outreach pipeline that finds real businesses via Google Maps, scans their sites for a usable contact email, verifies deliverability with a raw SMTP probe before anything sends, and runs a 3-touch Brevo sequence with a durable suppression list. Built to run daily, unattended, inside a strict sending cap.",
    longDescription: `Opportunity Intelligence Engine is a lead-generation and cold-outreach system I built to run real campaigns, not a demo. It finds businesses through Google Maps search, filters out chains and hospital systems with a dedicated regex pass, visits each independent business's website with a headless Playwright browser, and extracts a real contact email from the rendered page content, not just a mailto link, since most sites bury the real address in plain text or a contact form.

Every email that passes the scan goes through an SMTP pre-send check before it ever reaches a queue: a raw socket connection to the domain's MX host, a RCPT TO probe, and a three-way verdict. Accepted addresses get queued automatically. Addresses the probe cannot confirm are held back for manual review rather than risking a bounce, because a sender's domain reputation is a shared, slow-to-rebuild resource.

Outreach runs as a scheduled 3-touch sequence (day 0, day 4, day 10) through the Brevo transactional API, with per-lead tracking links and a suppression list that any opt-out or hard bounce writes to immediately, checked on every single send path so a suppressed address can never receive another touch regardless of which script is running.

The hardest bugs were not in any single stage, they were in making daily unattended runs actually idempotent. An early version silently re-scanned the same several hundred known-bad domains on every restart because a "no email found" outcome was never persisted, only successes were. A worse one: the finder script never closed its own browser instance on exit, so repeated restarts stacked multiple live copies of the same process, all racing to write the same output file and periodically overwriting each other's progress. Fixing both (a persistent no-match log, and a PID lock file plus an explicit process exit) turned a flaky, hours-long daily grind into a clean, repeatable run that currently sits at 597 SMTP-accepted leads out of 966 independent practices scanned for a single campaign.`,
    technologies: [
      "TypeScript",
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "Playwright",
      "Python",
      "Brevo",
      "Groq LLM",
    ],
    features: [
      "Google Maps-based lead discovery with chain/hospital-system filtering",
      "Playwright-based site scanning for real contact emails, not just mailto links",
      "Raw SMTP RCPT TO verification before any address is queued",
      "3-touch sequenced outreach via Brevo with per-lead tracking links",
      "Durable suppression list checked on every send path",
      "PID-locked, idempotent daily runs with persistent no-match logging",
      "Free-mail-provider matching so small practices on Gmail still qualify",
    ],
    image: "/images/projects/opportunity-intelligence-engine/thumbnail.png",
    images: [
      { src: "/images/projects/opportunity-intelligence-engine/hero.png", alt: "Opportunity Intelligence Engine, pipeline overview and key metrics" },
    ],
    github: "https://github.com/harsh01369/opportunity-intelligence-engine",
    featured: true,
  },
  {
    slug: "previsit",
    title: "Pre-Visit",
    tagline: "Patient intake automation demo, including a hand-built frame-by-frame video renderer",
    description:
      "A Next.js demo site for an AI patient-intake product, pitched to independent medical practices through the Opportunity Intelligence Engine's own cold-outreach pipeline. Built alongside it: a frame-by-frame video rendering engine that screenshots HTML scene files through Puppeteer and stitches them with ffmpeg, with no timeline-editing software anywhere in the pipeline.",
    longDescription: `Pre-Visit is the demo site I built for an AI-driven patient-intake product, and it's the live link every cold email from the Opportunity Intelligence Engine actually points to. The site itself is a Next.js 15 app: an intake chat panel showing what a patient's pre-visit conversation looks like, a booking calendar, phone and identity verification steps, and a contact path, all built to be the thing a practice owner clicks through in under a minute and immediately understands.

The part I'm most glad I built properly is the demo video. The brief was simple: show a patient's whole flow, then cut to what the doctor actually sees. I built it as a frame-by-frame renderer rather than reaching for timeline-editing software: each scene is a self-contained HTML file exposing a pure renderFrame(progress) function (0 to 1), nothing in it depends on Date.now() or a real CSS transition, so the same progress value always produces the same pixels. A Puppeteer script loops through progress values, screenshots each frame, and ffmpeg encodes the sequence into a silent MP4 per scene before crossfading them together and muxing in an audio track trimmed to the assembled video's exact runtime via ffprobe.

That determinism is what made iteration survivable. Early passes had real, fixable problems: reveals timed to a flat 0.5 seconds regardless of how much text there was to read, hard cuts between scenes that read as a glitch, a closing line whose word-by-word reveal finished right as the scene ended with no time to actually read it. Every fix was a change to one scene's pacing windows, not a re-shoot, because re-rendering a single scene and re-running the assembly script always reproduces exactly the same result. The motion itself went through a real upgrade pass too: the logo draws its stroke on instead of fading, cards drop in with a slight 3D tilt and spring overshoot, the doctor's queue view gets a moving highlight sweep instead of a static pulse, and each side of the story opens with its own full-bleed chapter wipe so the two-sided flow reads as two explicit parts rather than one undifferentiated scroll.

I built this pipeline specifically because the equivalent one used for an earlier demo video was never committed anywhere, only the rendered output survived, and rebuilding from a lost process is not a mistake worth repeating. Everything, scenes, render scripts, and the final output's source, lives in the repo now.`,
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Puppeteer",
      "ffmpeg",
    ],
    features: [
      "Patient intake chat panel, booking calendar, and identity verification demo",
      "Frame-by-frame video renderer: pure renderFrame(progress) scenes, no timeline software",
      "Deterministic rendering: same progress value always produces identical pixels",
      "Crossfade assembly and ffprobe-driven audio trimming across 5 scenes",
      "Pacing driven entirely by per-scene duration windows, not fixed-time reveals",
      "Two-sided story: patient flow, then a cut to the doctor's queue view",
      "Demo site is the live link the cold-outreach campaign actually sends",
    ],
    image: "/images/projects/previsit/thumbnail.png",
    images: [
      { src: "/images/projects/previsit/hero.png", alt: "Pre-Visit, demo site overview and key metrics" },
    ],
    live: "https://previsit-pi.vercel.app",
    github: "https://github.com/harsh01369/previsit",
    featured: true,
  },
  {
    slug: "bhairav-aaradhyaa",
    title: "Bhairav Aaradhyaa",
    tagline:
      "Multi-vertical spiritual tech platform: two deities, a documentary section, and a monetized AI reading engine",
    description:
      "A spiritual tech platform serving users in India and internationally, grown well past its original Bhairava-only scope: a second full deity vertical (Shiva, 27 stotra pages), a documentary Films section with its own launch-email system, a rebuilt Life Purpose engine now on its 4th-generation algorithm with a paid personal-reading tier, and a retention system sending web push and email through a real panchang (Hindu calendar) calculation. Dual payment processing (Stripe + Instamojo) and a Puppeteer pipeline pre-rendering the growing route set for SEO.",
    longDescription: `Bhairav Aaradhyaa started as a single-deity spiritual content platform and has since grown into something considerably bigger. The original content layer is still there: Bhairava divine forms with mantras and iconography, Sanskrit stotras with transliterations, shastra stories, and articles. What's new is a second, parallel vertical for Shiva with 27 of its own stotra pages, and a Films section with watch pages for documentaries, each with its own launch email and push-notification campaign built on a reusable template rather than one-off work.

The Life Purpose feature went through a real rebuild, not just a tweak: a new questionnaire and results flow, a results dashboard, and a 4th-generation scoring algorithm running behind a switch so it can be validated before fully replacing the previous version. It also introduced the platform's first genuine premium monetization tier, a paid personal reading, on top of the existing one-time unlocks. Admin tooling got hardened alongside it: Brevo sender and domain-auth status lookups, a delivery-events endpoint, and the kind of operational visibility a growing paid feature actually needs.

The retention system is the most substantial addition outside the content itself. Web push notifications go out via VAPID, including readings tied to specific sacred days computed from a verified panchang calendar rather than a static list of dates. Every push and email deep-link carries UTM-style attribution so the funnel from notification to return visit is actually measurable, instrumented end to end through GA4. A "chant this mantra now" bridge was built, unmounted for a time, then deliberately remounted once the funnel data justified it, exactly the kind of decision that needs real instrumentation behind it rather than a guess.

The core technical challenges from the original build are still load-bearing: MaxMind GeoIP routes Indian users to Instamojo in INR and international users to Stripe in GBP automatically, both verified through webhook signatures (HMAC-SHA256 for Stripe, SHA1 MAC for Instamojo), and the Puppeteer-based pre-rendering pipeline that took Google's indexing from 0 pages to full coverage on a client-rendered React app now runs across a meaningfully larger route set, with an ongoing SEO program beyond the initial pre-render: the VBT technique pages scaled to 112, with meta-description rewrites driven by actual CTR data rather than written once and left alone.

The backend runs Express 5 with TypeScript strict mode, Prisma ORM on Neon.tech serverless PostgreSQL, Firebase Admin SDK for authentication, and Brevo for every transactional and campaign email across the platform.`,
    technologies: [
      "React 19",
      "TypeScript",
      "Express 5",
      "PostgreSQL",
      "Prisma 5",
      "Firebase Auth",
      "Stripe",
      "Instamojo",
      "Puppeteer",
      "Tailwind CSS",
      "Brevo",
      "Framer Motion",
      "Web Push (VAPID)",
      "GA4",
    ],
    features: [
      "Two parallel deity verticals: Bhairava and Shiva (27 stotra pages)",
      "Films section with documentary watch pages and a reusable launch-campaign template",
      "Life Purpose v2: new questionnaire, results dashboard, 4th-gen algorithm behind a switch",
      "First paid monetization tier: a premium personal reading, on top of one-time unlocks",
      "Web push via VAPID tied to a verified panchang (Hindu calendar) calculation",
      "UTM-style attribution across every push/email deep link, instrumented through GA4",
      "Dual payment processing with geo-based routing (Stripe + Instamojo)",
      "Puppeteer pre-rendering pipeline, SEO program now scaled to 112 VBT technique pages",
    ],
    image: "/images/projects/bhairav-aaradhyaa/thumbnail.png",
    images: [
      { src: "/images/projects/bhairav-aaradhyaa/hero.png", alt: "Bhairav Aaradhyaa, platform overview with key metrics" },
      { src: "/images/projects/bhairav-aaradhyaa/architecture.png", alt: "System architecture: frontend, backend, payments, and services" },
    ],
    live: "https://bhairavaaradhyaa.com",
    github: "https://github.com/harsh01369/bhairav-aaradhya-showcase",
    featured: true,
    results: [
      { label: "Organic Search Growth (6mo)", value: "18x" },
      { label: "AI Overview Citations", value: "13,147" },
      { label: "New Users (5wks)", value: "500+" },
    ],
  },
  {
    slug: "eloquent-operator-console",
    title: "AI Operator Console",
    tagline: "Conversational UI and explainable step-trace viewer for regulated financial-services AI agents",
    description:
      "A prototype of the UI layer that sits on top of a financial-services AI agent: a three-panel console with the customer conversation on one side, live reasoning in the middle, and a scrubbable step-by-step trace on the other, built because most agent UIs either hide reasoning behind a black-box chat or dump a 200-line LangChain trace no compliance officer will ever read.",
    longDescription: `Regulated AI agents in banking and insurance can't just act, every decision has to be explainable, auditable, and confirmable by a human when needed. This console is built as the middle path between a black-box chat and a raw trace dump: a conversation view, a structured reasoning panel, and a scrubbable trace rail, with every step carrying its own confidence score, the SOP section it cited, the tools it called with their structured arguments and results, and a before/after state diff.

It ships with 5 realistic scenarios covering the kind of decisions that actually need this scrutiny: unfreezing an account after a geo-anomaly fraud alert, a $75k cross-border wire under enhanced due diligence, an auto-loan hardship adjustment, an insurance claim SLA follow-up, and a chargeback dispute with a provisional credit. Each trace supports live replay (play, pause, step forward, reset) and exports as audit JSON a compliance reviewer can actually open and read. It's a frontend prototype by design, React 19 and TypeScript strict mode, all mock data local and deterministic, no backend, built to demonstrate the UI layer's information architecture rather than a full agent integration.`,
    technologies: [
      "React 19",
      "TypeScript",
      "Vite 6",
      "Tailwind CSS",
      "Framer Motion",
    ],
    features: [
      "Three-panel layout: conversation, live reasoning, scrubbable trace rail",
      "5 realistic regulated-finance scenarios (fraud, wire transfer, hardship, claims, chargebacks)",
      "Live trace replay with play/pause/step/reset controls",
      "Audit JSON export per trace for compliance review",
      "Per-step confidence score, cited SOP section, tool calls, and state diff",
      "Responsive across desktop, tablet (slide-in drawer), and mobile (tab switcher)",
    ],
    image: "/images/projects/eloquent-operator-console/thumbnail.png",
    images: [
      { src: "/images/projects/eloquent-operator-console/hero.png", alt: "AI Operator Console, overview and key metrics" },
    ],
    github: "https://github.com/harsh01369/eloquent-operator-console",
    featured: false,
  },
  {
    slug: "jyotisha-engine",
    title: "Jyotiṣa Cognitive Reasoning System",
    tagline: "Research-grade reasoning engine that keeps deterministic calculation strictly separate from AI interpretation",
    description:
      "A structured reasoning engine for Jyotiṣa (Vedic astrology) built on one non-negotiable rule: language models never compute longitude, varga, dasha, aspect, or yoga, and never become the authority for a rule. Chart facts come from a deterministic calculator against a local ephemeris; Jyotiṣa knowledge is tracked as editioned texts flowing through reviewed claims into executable rules.",
    longDescription: `This system treats two very different kinds of accuracy separately. Chart facts (the actual astronomical positions and derived values) come from a local ephemeris and a named, versioned CalculationProfile: the same birth data and profile always produce the same ChartSnapshot, hashable and reproducible. Jyotiṣa knowledge (what those positions are traditionally held to mean) follows a different path entirely: editioned source texts flow through reviewed claims into executable rules, and a user-facing answer may only cite a published RuleSetRelease, never an LLM's general training-data sense of what a text "probably" says.

The project is explicit that LLMs know a syllabus of Jyotiṣa, not a critical edition, and treats them accordingly: usable as clerks and adversarial reviewers, never as the source of authority (śāstra). Several rules are enforced as non-negotiable throughout the codebase: no silent convention-mixing (every result belongs to a named CalculationProfile), a source claim, a commentator's interpretation, an implementation rule, and a system inference are kept as distinct types rather than flattened together, contradiction between sources is preserved as data rather than resolved by fiat, and the system has to answer usefully even with the LLM layer switched off entirely. The deterministic calculation core is Python, with a separate knowledge pipeline package and machine-readable schemas defining the contracts between them.`,
    technologies: [
      "Python",
      "pytest",
      "ruff",
    ],
    features: [
      "Deterministic calculation core: same input + profile always produces the same hashable result",
      "Source claim, interpretation, rule, and inference kept as distinct, separately-tracked types",
      "User-facing answers may only cite a published, versioned RuleSetRelease",
      "Contradiction between sources preserved as data, never silently resolved",
      "System must answer usefully with the LLM layer switched off",
      "Machine-readable schemas defining the calculator/knowledge contract",
    ],
    image: "/images/projects/jyotisha-engine/thumbnail.png",
    images: [
      { src: "/images/projects/jyotisha-engine/hero.png", alt: "Jyotisa Cognitive Reasoning System, overview and key metrics" },
    ],
    featured: false,
  },
  {
    slug: "contentforge",
    title: "ContentForge",
    tagline:
      "Multi-platform social media content engine producing 3,500+ assets",
    description:
      "An automated content generation and publishing engine that produces 3,500+ social media assets from a single data source. Puppeteer renders HTML templates into optimised images for Instagram, Pinterest, Twitter/X, and Facebook. Includes a smart scheduler with queue management, platform-specific rate limiting, and AI-powered Instagram DM automation via Groq.",
    longDescription: `ContentForge is a standalone content automation engine I built to solve a real problem: manually creating social media posts for a spiritual brand across 4 platforms is not sustainable. The system reads spiritual content data (forms, stotras, stories, articles) from a TypeScript source, transforms it through platform-specific extractors, renders HTML templates into production-ready images via Puppeteer, and publishes on schedule.

The engine generates 8 distinct Instagram card types across 4 visual themes (classic, cosmic, puja-scene, shakti). Namavali cards display 4 divine names per card from 4 different namavalis totalling 302 names. Sahasranama cards pull from a 1,000-name dataset. Story carousels produce 7-slide posts: cover, context, action, climax, morals, insights, and CTA. Stotra verse cards and mantra cards round out the Instagram content.

Pinterest gets its own extraction layer: wisdom quotes from articles, form spotlight pins with deity images, moral teachings from stories, and ritual tip cards. All at 1000x1500 resolution with SEO-rich descriptions.

Twitter content follows different rules entirely. Tweets stay under 220 characters (leaving room for hashtags). The extractor scores story hooks by dramatic impact and picks the strongest opening lines. Article threads produce 7-8 tweet chains with hooks, key insights, and CTAs. Links go in auto-reply tweets only because embedding URLs in the main tweet body kills reach.

The scheduler manages a queue with statuses (DRAFT, QUEUED, PUBLISHING, PUBLISHED, FAILED) and respects safe daily limits: 2 posts/day on Instagram, 9 on Pinterest, 4 on Twitter. A cron job checks every 2 minutes for posts due to publish. Auto-fill scans output directories and queues unposted content with time slots.

The dashboard is a React 19 app with real-time SSE streaming for generation progress, queue management, OAuth token management, and content preview galleries. Platform integrations use Instagram Graph API v21.0, Pinterest API v5, and Twitter API v2.

I also built an AI-powered DM engine for Instagram. When users message the brand, Groq's LLM generates contextual replies based on a knowledge base of FAQs, form recommendations, and practice guidance.`,
    technologies: [
      "Node.js",
      "Express 5",
      "Puppeteer",
      "React 19",
      "TypeScript",
      "Instagram Graph API",
      "Pinterest API v5",
      "Twitter API v2",
      "Groq LLM",
      "node-cron",
      "sharp",
    ],
    features: [
      "3,500+ content pieces from a single data source",
      "8 Instagram card types across 4 visual themes",
      "7-slide story carousel generation",
      "Platform-specific content extraction and formatting",
      "Smart scheduler with queue management and rate limiting",
      "Real-time SSE dashboard for generation progress",
      "AI-powered Instagram DM automation via Groq",
      "Cross-platform deduplication to avoid content overlap",
      "Auto-fill: scans output directories and queues unposted content",
    ],
    image: "/images/projects/contentforge/thumbnail.png",
    images: [
      { src: "/images/projects/contentforge/hero.png", alt: "ContentForge, content automation engine overview" },
      { src: "/images/projects/contentforge/architecture.png", alt: "Content pipeline: data source → extractors → render → schedule → publish" },
    ],
    github: "https://github.com/harsh01369/contentforge-showcase",
    featured: false,
  },
  {
    slug: "uwear",
    title: "UWEAR UK",
    tagline: "Full e-commerce ecosystem with storefront, backend, and admin dashboard",
    description:
      "A production e-commerce platform for a UK clothing brand. React 18 storefront with product catalog, cart, and Stripe checkout. Express + MongoDB backend handling orders, payments, and SendGrid emails. Separate admin dashboard with Chart.js analytics, order printing, real-time polling with audio notifications, and inventory management across 200+ products.",
    longDescription: `UWEAR UK is a complete e-commerce ecosystem I built across three separate applications: a customer-facing storefront, a REST API backend, and an admin dashboard. Each serves a distinct user and runs independently.

The storefront is a React 18 application with Chakra UI and Tailwind CSS. It handles the full shopping flow: product browsing with filters (product type, interest, gender, sale status), image zoom on product details, size selection, cart management, and multi-step checkout. The cart system works in dual mode: guest users get localStorage-based carts, and logged-in users get server-synced carts that persist across devices. On login, the guest cart merges with the server cart automatically.

Authentication uses JWT tokens with Axios interceptors that inject the Bearer token on every request and handle 401 responses globally. When a token expires, users get redirected to login without crashing the app.

The backend runs Express with MongoDB (Mongoose). Stripe handles payment processing through checkout sessions. When Stripe sends a webhook confirming payment, the backend creates the order record, decrements inventory, and fires a SendGrid email with an HTML template matching the UWEAR brand (gold and black theme). Product images are organised by serial number in a Multer-based upload system with 5MB limits.

The admin dashboard is a separate React app with Bootstrap and Chart.js. It polls the backend every 5 seconds for new orders and plays an audio notification when one arrives. Store owners can view 30-day sales charts, track order statuses, print orders with formatted HTML tables, manage product listings with image uploads, and monitor low-stock alerts. The dashboard uses session-based authentication (separate from JWT) for admin access.

The frontend is deployed on Hostinger, and the backend and admin dashboard run on Render.`,
    technologies: [
      "React 18",
      "Chakra UI",
      "Tailwind CSS",
      "Express",
      "MongoDB",
      "Mongoose",
      "Stripe",
      "SendGrid",
      "JWT",
      "Chart.js",
      "Bootstrap",
      "Multer",
    ],
    features: [
      "Dual cart system: localStorage for guests, server-sync for logged-in users",
      "Stripe checkout sessions with webhook-driven order confirmation",
      "Admin dashboard with Chart.js 30-day sales analytics",
      "Real-time order polling with audio notifications",
      "Order printing with formatted HTML templates",
      "SendGrid branded transactional emails",
      "Product image upload organised by serial number",
      "Low-stock alerts and inventory tracking across 200+ products",
    ],
    image: "/images/projects/uwear/thumbnail.png",
    images: [
      { src: "/images/projects/uwear/hero.png", alt: "UWEAR UK, e-commerce ecosystem overview" },
      { src: "/images/projects/uwear/architecture.png", alt: "Architecture: storefront, backend API, and admin dashboard" },
    ],
    live: "https://uwearuk.com",
    github: "https://github.com/harsh01369/uwear-platform-showcase",
    featured: false,
  },
  {
    slug: "geobot",
    title: "GeoThreadBot",
    tagline: "7-stage AI pipeline that fetches, analyses, and publishes geopolitics news",
    description:
      "A Python pipeline that fetches news from 3 concurrent sources (Twitter, YouTube, RSS), detects 12+ languages, scores relevance with SpaCy and VADER, summarises with BART transformers, cross-verifies facts against credible sources, queues for human moderation, and publishes approved stories to Twitter/X.",
    longDescription: `GeoThreadBot is an end-to-end AI news automation system that monitors geopolitical events across the internet and publishes verified stories to Twitter/X. The pipeline runs 7 stages in sequence, and I refactored it from a single 953-line prototype into a modular Python package with 25 modules across 8 packages and 19 unit tests.

Stage 1 is concurrent data collection. Three fetchers run in separate threads: the Twitter fetcher monitors accounts and hashtags via the Twitter API v2, the YouTube fetcher extracts video transcripts using the YouTube Data API v3, and the RSS fetcher monitors news feeds via feedparser. All three run simultaneously and feed into a shared processing queue.

Stage 2 handles language detection and translation. The system supports 12+ languages and automatically detects the source language using langdetect. Non-English content gets translated via deep-translator before processing.

Stage 3 is NLP filtering. SpaCy extracts named entities and keywords from each article. VADER scores the emotional tone. A relevance scoring algorithm combines keyword frequency, entity matching, and domain relevance to filter out low-quality content before the expensive transformer inference runs.

Stage 4 is AI summarisation. The BART model (facebook/bart-large-cnn) generates concise summaries. The model is lazy-loaded on first use to avoid blocking startup. NLTK handles sentence tokenisation for key point extraction.

Stage 5 is fact verification. Each story gets cross-referenced against credible sources (BBC, Reuters, AP News, Al Jazeera, NY Times, The Hindu). Confidence scoring starts at 0 and increments by 0.4 for each credible source that corroborates the story. Stories need a confidence score of 0.6 or higher to pass verification.

Stage 6 is human moderation. Verified stories enter a review queue accessible through a Flask API. I built this checkpoint because fully autonomous publishing of geopolitical news is risky. Only approved stories proceed.

Stage 7 is distribution. Approved stories get formatted into Twitter threads with the 280-character limit, domain hashtags, and source citations. The tweepy client handles posting via the Twitter API.

The SQLite database tracks all claims, processed content, and pipeline metrics. The whole system runs on a configurable cron schedule.`,
    technologies: [
      "Python",
      "Flask",
      "TensorFlow",
      "Hugging Face BART",
      "SpaCy",
      "VADER",
      "Twitter API v2",
      "YouTube Data API",
      "SQLite",
      "NLTK",
      "deep-translator",
      "feedparser",
    ],
    features: [
      "7-stage automated pipeline with concurrent data fetching",
      "3 data sources running in parallel: Twitter, YouTube, RSS",
      "12+ language detection with automatic translation",
      "SpaCy + VADER NLP filtering with relevance scoring",
      "BART transformer summarisation with lazy loading",
      "Cross-source fact verification with confidence scoring",
      "Human moderation queue via Flask API",
      "Refactored from 953-line monolith to 25 modules across 8 packages",
      "19 unit tests with API mocking via pytest",
    ],
    image: "/images/projects/geobot/thumbnail.png",
    images: [
      { src: "/images/projects/geobot/hero.png", alt: "GeoThreadBot, AI news pipeline overview" },
      { src: "/images/projects/geobot/architecture.png", alt: "7-stage pipeline: fetch → NLP → summarise → verify → publish" },
    ],
    github: "https://github.com/harsh01369/AI-powered-Geo-politics-news-bot",
    featured: false,
  },
  {
    slug: "helec",
    title: "HELEC",
    tagline:
      "Real-time AI customer support chat powered by Groq LLM",
    description:
      "A real-time customer support chat system built as a pnpm monorepo. SvelteKit 2 frontend with a floating chat widget, Fastify 5 backend with Socket.IO for live messaging, and Groq LLM (llama-3.3-70b) generating contextual responses with a 10-message conversation window stored in PostgreSQL via Prisma.",
    longDescription: `HELEC (Helpful E-commerce Live Engine for Customers) is a real-time AI-powered customer support system I built as a pnpm monorepo with shared TypeScript types across frontend and backend. I chose SvelteKit over React for the frontend because Svelte's reactive declarations and built-in stores handle WebSocket state far more cleanly than React's useEffect-based approach.

The frontend is a floating chat widget (SvelteKit 2 with Svelte 5, Tailwind CSS, DaisyUI) that sits in the bottom-right corner of any e-commerce store. Users click the bubble, type a question, and get AI-powered responses in real time. The widget handles session persistence through localStorage, shows typing indicators, auto-scrolls to the latest message, and supports conversation resets.

The backend runs Fastify 5, which benchmarks at roughly 2x the throughput of Express. Socket.IO handles bidirectional real-time communication. When a user sends a message, the server creates the conversation (if new), loads the last 10 messages from PostgreSQL for context, sends the conversation history to Groq's API, and streams the AI response back through the WebSocket.

I chose Groq (llama-3.3-70b-versatile) over OpenAI for inference speed. Groq runs on custom LPU hardware and returns responses roughly 10x faster than GPT-4. The system prompt is 300+ lines covering products, shipping policies, return procedures, payment options, and product recommendations specific to the e-commerce store.

The database schema is minimal: Conversation and Message models in Prisma with cascade deletes. PostgreSQL 16 runs in Docker Compose for local development. Input validation uses Zod for every endpoint, and UUID validation catches malformed conversation IDs before they hit the database.

REST endpoints handle conversation retrieval and health checks, while Socket.IO events handle the real-time message flow: join_conversation, send_message, typing indicators, and error propagation.`,
    technologies: [
      "SvelteKit 2",
      "Svelte 5",
      "Fastify 5",
      "Socket.IO",
      "Groq LLM",
      "PostgreSQL",
      "Prisma 6",
      "TypeScript",
      "Tailwind CSS",
      "DaisyUI",
      "Zod",
      "Docker Compose",
      "pnpm Monorepo",
    ],
    features: [
      "Floating chat widget with typing indicators and auto-scroll",
      "Groq LLM (llama-3.3-70b) with 10-message context window",
      "Socket.IO real-time bidirectional messaging",
      "pnpm monorepo with shared TypeScript types",
      "Fastify 5 backend (2x Express throughput)",
      "PostgreSQL conversation persistence with cascade deletes",
      "Zod input validation on all endpoints",
      "Docker Compose for local PostgreSQL",
      "300+ line system prompt for domain-specific responses",
    ],
    image: "/images/projects/helec/thumbnail.png",
    images: [
      { src: "/images/projects/helec/hero.png", alt: "HELEC, AI customer support chat overview" },
      { src: "/images/projects/helec/architecture.png", alt: "Real-time architecture: SvelteKit ↔ Socket.IO ↔ Fastify ↔ Groq" },
    ],
    github: "https://github.com/harsh01369/helec",
    featured: false,
  },
  {
    slug: "cybership",
    title: "CyberShip Carrier Service",
    tagline: "Carrier-agnostic shipping rate aggregator with Adapter pattern",
    description:
      "A TypeScript library that normalises shipping carrier APIs behind a single interface using the Adapter pattern. UPS OAuth 2.0 integration with token caching, Zod schema validation for type-safe requests, fault-tolerant parallel queries via Promise.allSettled, and 100% test coverage with Vitest and nock HTTP mocking.",
    longDescription: `CyberShip is a carrier-agnostic shipping rate aggregation library I built in TypeScript. The core idea is simple: every shipping carrier has a different API format, authentication method, and pricing model. CyberShip normalises all of them behind a single interface so consuming applications can query rates from any carrier with one function call.

The architecture uses the Adapter pattern with a CarrierRegistry. Each carrier implements a Carrier interface with a getRates method that takes a standardised RateRequest and returns RateQuote objects. The registry stores carriers by code in a Map, and the ShippingService orchestrates queries.

The UPS integration is the most complete adapter. Authentication uses OAuth 2.0 client-credentials flow with smart token caching. Tokens get cached in memory with a 60-second expiry buffer, so the system refreshes tokens before they expire rather than after a 401 response. The UpsMapper handles shape translation: converting RateRequest objects into UPS-specific payloads and mapping UPS responses back to normalised RateQuote objects, including unit conversions between imperial (IN/LBS) and metric (CM/KG).

The HttpClient wraps Node.js fetch with timeout handling via AbortController, JSON parsing with error recovery, form-encoded body support for OAuth, and consistent error mapping to a typed CarrierError with codes like AUTH_FAILED, RATE_LIMIT, TIMEOUT, and MALFORMED_RESPONSE.

The ShippingService exposes two methods: getRates for a single carrier, and getRatesFromAll that queries every registered carrier in parallel using Promise.allSettled. This means one carrier failing does not block results from others.

Validation uses Zod schemas on every input. The RateRequestSchema validates origin and destination addresses, and the PackageSchema validates dimensions and weight with unit enums. Invalid requests fail fast with clear error messages before any API call is made.

Tests use Vitest with nock for HTTP mocking. Every carrier interaction, token refresh, error path, and validation rule is covered.`,
    technologies: [
      "TypeScript",
      "Zod 4",
      "Vitest",
      "nock",
      "UPS OAuth 2.0",
      "Node.js Fetch",
    ],
    features: [
      "Adapter pattern with pluggable CarrierRegistry",
      "UPS OAuth 2.0 with smart token caching (60s expiry buffer)",
      "Zod schema validation for all inputs",
      "Fault-tolerant parallel queries via Promise.allSettled",
      "Unit conversion between imperial and metric systems",
      "Custom HttpClient with timeout, error recovery, and form encoding",
      "Typed CarrierError with codes: AUTH_FAILED, RATE_LIMIT, TIMEOUT",
      "100% test coverage with Vitest and nock HTTP mocking",
    ],
    image: "/images/projects/cybership/thumbnail.png",
    images: [
      { src: "/images/projects/cybership/hero.png", alt: "CyberShip, shipping rate aggregator overview" },
      { src: "/images/projects/cybership/architecture.png", alt: "Adapter pattern: ShippingService → CarrierRegistry → Carrier adapters" },
    ],
    github: "https://github.com/harsh01369/cybership-carrier-service",
    featured: false,
  },
  {
    slug: "portfolio",
    title: "Portfolio Website",
    tagline: "This website, built with Next.js 15 and Tailwind CSS 4",
    description:
      "My portfolio and blog rebuilt from a Create React App with zero SEO into a Next.js 15 static site. All pages pre-rendered at build time with unique metadata, Open Graph tags, JSON-LD structured data, and an auto-generated sitemap. MDX blog system with syntax highlighting. Light paper theme with an illustrated, pointer-tracking mascot hero and a persistent one-point-perspective room-grid background.",
    longDescription: `This portfolio is a ground-up rebuild of my previous Create React App site. The old version had zero SEO because everything was client-rendered JavaScript. Google could not index a single page. Searching for my name returned nothing.

The rebuild uses Next.js 15 with the App Router and static site generation. Every page is pre-rendered at build time as full HTML. Each project and blog post gets its own URL with unique title, meta description, Open Graph tags, and JSON-LD structured data (Person, WebSite, BlogPosting, SoftwareApplication schemas). The sitemap.ts auto-generates a sitemap covering all routes.

The blog system uses MDX (Markdown + JSX) loaded through gray-matter for frontmatter parsing and next-mdx-remote for rendering. Code blocks use sugar-high for lightweight syntax highlighting.

The site went through a full visual rebuild from its original dark, CV-style presentation to a light paper theme built around an illustrated mascot hero with pointer-tracking gaze and click-to-greet interaction, and a one-point-perspective room-grid background that now runs continuously from the hero through the footer on every page, not just behind the fold. The copy was reframed from job-seeker language ("available for work") to agency/project framing ("taking projects") to match how the site is actually used to pitch work now.

Tailwind CSS 4 handles all styling with custom theme tokens defined as CSS variables, which made the dark-to-light flip mostly a token-level change rather than a per-component rewrite. Inter and JetBrains Mono are self-hosted via next/font for zero external requests.`,
    technologies: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS 4",
      "MDX",
      "Framer Motion",
      "next/font",
    ],
    features: [
      "Static site generation for every page",
      "MDX blog with syntax highlighting",
      "SEO: unique metadata, Open Graph, JSON-LD, sitemap",
      "Illustrated mascot hero with pointer-tracking gaze and click-to-greet",
      "Persistent room-grid background running from hero to footer, site-wide",
      "Framer Motion staggered entrance animations",
      "Self-hosted Inter + JetBrains Mono fonts",
      "Token-level dark-to-light theme flip via CSS custom properties",
    ],
    image: "/images/projects/portfolio/thumbnail.png",
    images: [
      { src: "/images/projects/portfolio/hero.png", alt: "Portfolio Website, Next.js 15 SSG overview" },
      { src: "/images/projects/portfolio/architecture.png", alt: "Architecture: App Router → SSG → SEO layer → Vercel" },
    ],
    github: "https://github.com/harsh01369/portfolio-website",
    live: "https://harshkhetia.dev",
    featured: false,
  },
];
