// Per-lead live demos for companies found through a real job posting, not a
// local business with a slow website. A generic "your site is slow" audit
// means nothing to a funded startup or an agency, they already know their
// own numbers. What lands instead is proof of the exact thing the posting
// asked for, built and working, not described. See [[hot_lead_preview_pages]]
// for the sibling system this one deliberately does NOT reuse the shape of
// (chat/booking demos for local businesses) -- this is a different kind of
// artifact for a different kind of lead, sharing only the "one route per
// lead, swap by slug" pattern.
//
// Deliberately a discriminated union, not one shape with optional fields for
// every demo type: the whole point is that the demo is designed per lead to
// match what THEIR posting actually asks for, not forced into a shape built
// for a different company's product. Storyline needed a video player.
// Speak's posting is about their signup/checkout journey, not their AI
// tutor. FutureFit's posting is about evidence-grounded career coaching.
// Three different things, three different demo kinds.

export interface PlayerScene {
  id: string;
  chapterLabel: string;
  kind: "intro" | "metric" | "chart" | "callout" | "outro";
  caption: string;
  metric?: { label: string; value: string; sublabel?: string };
  chart?: { label: string; points: number[] };
  calloutIcon?: "up" | "down" | "flag" | "check";
}

export interface DiscoveryStep {
  id: string;
  label: string;
}

export interface PlanOption {
  name: string;
  tagline: string;
  features: string[];
}

export interface CareerPathNode {
  label: string;
  type: "skill" | "cert" | "role";
  evidenceNote: string;
}

export interface CareerPathOption {
  id: string;
  fromRole: string;
  toRole: string;
  steps: CareerPathNode[];
}

interface BasePreview {
  slug: string;
  companyName: string;
  roleTitle: string;
  jobPostingUrl: string;
  companyUrl: string;
  accentColor: string;
  accentDark: string;
  bgDark: string;
  city: string;
  heroNote: string;
  whatTheyAsked: string;
  demoExplainer: string;
  sampleDataNote: string;
}

export interface DataVideoPreview extends BasePreview {
  demoKind: "data-video";
  scenes: PlayerScene[];
}

export interface DiscoveryJourneyPreview extends BasePreview {
  demoKind: "discovery-journey";
  practicePrompt: string;
  practiceFeedback: string;
  plans: PlanOption[];
  confirmationHeadline: string;
  confirmationNote: string;
}

export interface CareerPathPreview extends BasePreview {
  demoKind: "career-path";
  paths: CareerPathOption[];
}

// For the "next 25" batch: each demo's data lives inside its own component
// (see components/solutions/demo-registry.tsx) instead of a new typed variant
// per lead here, registryKey just looks it up.
export interface RegistryPreview extends BasePreview {
  demoKind: "registry";
  registryKey: string;
}

export type ProofOfWorkPreviewConfig = DataVideoPreview | DiscoveryJourneyPreview | CareerPathPreview | RegistryPreview;

export const proofOfWorkPreviews: Record<string, ProofOfWorkPreviewConfig> = {
  "storyline-ai": {
    slug: "storyline-ai",
    demoKind: "data-video",
    companyName: "Storyline AI",
    roleTitle: "Lead Frontend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4020296-lead-frontend-engineer",
    companyUrl: "https://storyline.com/",
    accentColor: "#5B6CFF",
    accentDark: "#3B46C4",
    bgDark: "#0C0E1A",
    city: "Malibu, CA",
    heroNote:
      "Your own site describes an interactive menu system for chapters, visualization rollovers, and call-to-action buttons inside your videos, this demo builds that same pattern live.",
    whatTheyAsked:
      "The posting is for someone to own the Player, the system that renders SVG, animation, audio, and video into playback, built from code and JSON, not a video editor.",
    demoExplainer:
      "This is a small working Player, not a mockup, built the same way the posting describes: a JSON scene list driving SVG and motion in the browser, with the same chapter navigation and interactivity your own product page describes. The data below is a sample portfolio review, not a real client's.",
    sampleDataNote: "Sample portfolio data, built for this demo only, not a real Storyline client.",
    scenes: [
      { id: "intro", chapterLabel: "Intro", kind: "intro", caption: "Q3 portfolio review, sample client." },
      {
        id: "value",
        chapterLabel: "Value",
        kind: "metric",
        caption: "Overall, the portfolio grew 6.4% this quarter.",
        metric: { label: "Portfolio Value", value: "$482,900", sublabel: "+6.4% this quarter" },
      },
      {
        id: "growth",
        chapterLabel: "Growth",
        kind: "chart",
        caption: "Most of that gain landed in the back half of the quarter, led by the technology allocation.",
        chart: { label: "Growth index", points: [100, 103, 101, 108, 112, 118] },
      },
      {
        id: "alert",
        chapterLabel: "Alert",
        kind: "callout",
        caption: "One thing worth a conversation: the bond allocation has drifted 4% below target.",
        calloutIcon: "flag",
      },
      {
        id: "outro",
        chapterLabel: "Next",
        kind: "outro",
        caption: "Built live from code and data, the same thing the Player role is asking someone to own.",
      },
    ],
  },

  speak: {
    slug: "speak",
    demoKind: "discovery-journey",
    companyName: "Speak",
    roleTitle: "Full-stack Engineer, Discovery",
    jobPostingUrl: "https://wellfound.com/jobs/3533228-full-stack-engineer",
    companyUrl: "https://www.speak.com/",
    accentColor: "#FF5A36",
    accentDark: "#D43F1F",
    bgDark: "#1A0E0A",
    city: "San Francisco, CA",
    heroNote:
      "The posting is for the Discovery pod specifically, the web acquisition and purchase journey (discovery, checkout, billing, provisioning), not the AI tutor itself.",
    whatTheyAsked:
      "Near-term work for this role includes self-serve Speak for Business onboarding, web payments experimentation, and enterprise-ready web journeys, in TypeScript across Next.js, Node, and Postgres.",
    demoExplainer:
      "A small working version of that journey: a practice moment that hooks interest, straight into a clean plan picker and confirmation, the same funnel shape the posting describes. The practice feedback below is a sample response, not a real model call.",
    sampleDataNote: "Sample practice feedback, not a live model response, built to show the funnel, not the AI tutor.",
    practicePrompt: "Try it: how would you order a coffee in Spanish?",
    practiceFeedback:
      "Solid structure, that reads clearly. One tip: “quisiera” lands a touch more polite than “quiero” for a request like this.",
    plans: [
      { name: "Free", tagline: "Get a feel for it", features: ["3 lessons a week", "Core languages"] },
      {
        name: "Premium",
        tagline: "Learn without limits",
        features: ["Unlimited lessons", "All 15+ languages", "Speak for Business onboarding"],
      },
    ],
    confirmationHeadline: "You're in.",
    confirmationNote: "This is where provisioning and billing would pick up, the part the role actually owns.",
  },

  "futurefit-ai": {
    slug: "futurefit-ai",
    demoKind: "career-path",
    companyName: "FutureFit AI",
    roleTitle: "Senior AI Engineer, Data",
    jobPostingUrl: "https://wellfound.com/jobs/4824217-senior-ai-engineer",
    companyUrl: "https://www.futurefit.ai/",
    accentColor: "#1E9E6B",
    accentDark: "#15754E",
    bgDark: "#07140F",
    city: "New York, NY (remote, North America)",
    heroNote:
      "Your own positioning is a “GPS for careers,” and the posting asks for coaching grounded in evidence, transitions you've observed in labor market data, not generic suggestions.",
    whatTheyAsked:
      "The role centers on coaching products that tell a job seeker not just what jobs exist, but which next step is most likely to move things forward, defensible against observed transitions and measured outcomes.",
    demoExplainer:
      "A small working path visualizer: pick a starting point, see a concrete, evidence-labeled path to a target role, the same shape as the coaching product the posting describes. The two paths below are sample data, not real labor market output.",
    sampleDataNote: "Sample career paths, built for this demo only, not FutureFit's real labor market data.",
    paths: [
      {
        id: "retail",
        fromRole: "Retail Associate",
        toRole: "Supply Chain Coordinator",
        steps: [
          { label: "Customer Service Skills", type: "skill", evidenceNote: "already demonstrated in current role" },
          { label: "Inventory Systems Certificate", type: "cert", evidenceNote: "4-week program, sample data" },
          { label: "Supply Chain Coordinator", type: "role", evidenceNote: "based on sample observed transitions" },
        ],
      },
      {
        id: "support",
        fromRole: "Customer Support Rep",
        toRole: "Technical Support Engineer",
        steps: [
          { label: "Troubleshooting Fundamentals", type: "skill", evidenceNote: "already demonstrated in current role" },
          { label: "Technical Support Certificate", type: "cert", evidenceNote: "6-week program, sample data" },
          { label: "Technical Support Engineer", type: "role", evidenceNote: "based on sample observed transitions" },
        ],
      },
    ],
  },

  "custodia-bank": {
    slug: "custodia-bank",
    demoKind: "registry",
    registryKey: "custodia-custody",
    companyName: "Custodia Bank",
    roleTitle: "Senior Frontend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/2959142-senior-frontend-engineer",
    companyUrl: "https://www.custodiabank.com/",
    accentColor: "#D4A24C",
    accentDark: "#B8872E",
    bgDark: "#0B1220",
    city: "Cheyenne, WY",
    heroNote:
      "Post-FTX, your whole differentiation is segregated custody instead of a commingled pool, but in a typical account dashboard that structural difference is invisible, both just show a number.",
    whatTheyAsked:
      "The role builds the frontend for a Wyoming-chartered bank offering bitcoin custody through segregated, non-omnibus accounts, where the bank holds keys to assets attributed to a specific customer.",
    demoExplainer:
      "A small working visualizer that makes the custody-model claim provable instead of asserted: toggle between how a typical exchange shows a balance (drawn from a shared pool) and how segregated custody would show it (a specific, attributable address). Not real account data, a demonstration of the structural difference.",
    sampleDataNote: "Illustrative accounts and addresses, built for this demo only, not real Custodia customer data.",
  },

  "virta-health": {
    slug: "virta-health",
    demoKind: "registry",
    registryKey: "virta-signal-chain",
    companyName: "Virta Health",
    roleTitle: "Software Engineer (Backend)",
    jobPostingUrl: "https://wellfound.com/jobs/4824894-software-engineer",
    companyUrl: "https://www.virtahealth.com/",
    accentColor: "#F43F5E",
    accentDark: "#E11D48",
    bgDark: "#1A0A0D",
    city: "Remote (US)",
    heroNote:
      "A nutrition-first reversal of type 2 diabetes without constant in-person supervision only works if a dangerous glucose reading reaches a physician fast enough to act on it, that's not generic data plumbing.",
    whatTheyAsked:
      "The role owns the member, client, and clinical-ops data pipelines behind a remote, physician-supervised program that adjusts medication as biometric readings come in.",
    demoExplainer:
      "A signal-to-intervention chain: inject a dangerous glucose/ketone spike and watch it move from device to coach dashboard to physician alert to a medication-adjustment decision, with a running latency clock at each hop, the mechanism that makes this model safe to run outside a clinic.",
    sampleDataNote: "Illustrative member and reading data, built for this demo only, not a real Virta member.",
  },

  yipitdata: {
    slug: "yipitdata",
    demoKind: "registry",
    registryKey: "yipit-pipeline-confidence",
    companyName: "YipitData",
    roleTitle: "Senior Software Engineer, AI",
    jobPostingUrl: "https://wellfound.com/jobs/4521165-senior-software-engineer-ai",
    companyUrl: "https://www.yipitdata.com/",
    accentColor: "#0891B2",
    accentDark: "#0E7490",
    bgDark: "#071317",
    city: "Remote (US)",
    heroNote:
      "Alternative data scraped from the web breaks silently, a changed page structure or a missing field, which is exactly why a 180-person analyst layer exists to catch what automated pipelines miss.",
    whatTheyAsked:
      "The role pushes AI further into the data pipeline itself, not just client-facing research products, triaging which incoming records can be trusted and which need a human analyst.",
    demoExplainer:
      "A live pipeline-confidence dashboard: one scraped-data pipeline, each record tagged with a confidence score and a flagged reason, branching live into auto-approve or route-to-analyst, AI triage of pipeline trust, not a replacement for the analysts.",
    sampleDataNote: "Illustrative scraped records and confidence scores, built for this demo only, not real YipitData pipeline output.",
  },

  "garner-health": {
    slug: "garner-health",
    demoKind: "registry",
    registryKey: "garner-ranking-audit",
    companyName: "Garner Health",
    roleTitle: "Staff Software Engineer (Developer Experience)",
    jobPostingUrl: "https://wellfound.com/jobs/4692242-staff-software-engineer-developer-experience",
    companyUrl: "https://www.garnerhealth.com/",
    accentColor: "#7C3AED",
    accentDark: "#6D28D9",
    bgDark: "#120B1F",
    city: "Remote (US)",
    heroNote:
      "Your whole pitch is that no provider can pay to rank higher, which means every change to the scoring pipeline needs to be fast AND auditable, a slow or opaque deploy isn't just a velocity problem here, it's a trust risk.",
    whatTheyAsked:
      "The role builds internal developer-experience tooling, agentic code review and on-call, for the systems that rank providers from 60B+ medical records across 80+ specialties.",
    demoExplainer:
      "A ranking-change auditor: mock a PR to the scoring algorithm and get an automated diff of which providers' scores moved, by how much, and which metric drove it, a blast-radius check that catches a biasing change before merge.",
    sampleDataNote: "Illustrative providers and scores, built for this demo only, not real Garner ranking data.",
  },

  nops: {
    slug: "nops",
    demoKind: "registry",
    registryKey: "nops-savings-ledger",
    companyName: "nOps",
    roleTitle: "Senior Data Platform Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4523416-senior-data-platform-engineer",
    companyUrl: "https://www.nops.io/",
    accentColor: "#EAB308",
    accentDark: "#CA8A04",
    bgDark: "#171206",
    city: "Remote (US)",
    heroNote:
      "You're paid a percentage of the savings you generate, which means the real product risk isn't the optimization algorithm, it's whether a customer can trust that the number on their invoice is real and traceable to one specific action.",
    whatTheyAsked:
      "The role owns the Databricks Lakehouse pipelines behind a FinOps platform automating commitment purchases/exchanges across $4B+ of cloud spend.",
    demoExplainer:
      "A savings-attribution ledger: replay an hour of spend, see the automated commitment decision as a savings-rate vs. lock-in tradeoff, then trace the resulting invoice line back to that exact decision, proving the bill is auditable, not just claimed.",
    sampleDataNote: "Illustrative spend and savings figures, built for this demo only, not real nOps customer data.",
  },

  arrepath: {
    slug: "arrepath",
    demoKind: "registry",
    registryKey: "arrepath-phenotype-explorer",
    companyName: "ArrePath Drug Discovery",
    roleTitle: "AI Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4851891-ai-engineer",
    companyUrl: "https://www.arrepath.com/",
    accentColor: "#10B981",
    accentDark: "#059669",
    bgDark: "#06130F",
    city: "Remote (US)",
    heroNote:
      "Standard antibiotic discovery asks \"did the bacteria die.\" Your differentiator is reading what a compound does mechanistically, via imaging, before its kill-mechanism is even known, exactly what's needed against resistant bacteria.",
    whatTheyAsked:
      "The role applies ML to imaging-based \"bacterial autopsy\" data to find new antibiotic mechanisms against multidrug-resistant bacteria.",
    demoExplainer:
      "A phenotype-fingerprint explorer: an illustrative embedding of bacterial imaging phenotypes clustered by known mechanism, with a new compound's phenotype landing near or far from those clusters, visualizing mechanism-first discovery before the mechanism is confirmed.",
    sampleDataNote: "Illustrative data only, ArrePath's real imaging data isn't public, nothing here is a real result.",
  },

  halliday: {
    slug: "halliday",
    demoKind: "registry",
    registryKey: "halliday-route-explainer",
    companyName: "Halliday",
    roleTitle: "Senior Frontend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/3209008-senior-frontend-engineer",
    companyUrl: "https://halliday.xyz/",
    accentColor: "#0D9488",
    accentDark: "#0F766E",
    bgDark: "#081413",
    city: "Remote (US)",
    heroNote:
      "Your routing engine hides real complexity so a user never signs multiple transactions, but that same black box is a trust problem in crypto, where a wrong or stuck route is a real financial risk nobody can currently see the reasoning behind.",
    whatTheyAsked:
      "The role builds the frontend and public SDKs for a one-interface onramp/cross-chain/swap/offramp product.",
    demoExplainer:
      "A route explainer: pick a token and chain pair, see 3 candidate routes side by side on fees, time, and hops, with the actually-chosen route highlighted and a one-line reason why, a visual audit trail for \"why did my transaction take this path.\"",
    sampleDataNote: "Illustrative routes and fees, built for this demo only, not live Halliday routing data.",
  },

  honor: {
    slug: "honor",
    demoKind: "registry",
    registryKey: "honor-care-ledger",
    companyName: "Honor",
    roleTitle: "Staff Engineer, Applied AI",
    jobPostingUrl: "https://wellfound.com/jobs/4410608-staff-engineer-applied-ai",
    companyUrl: "https://www.honorcare.com/",
    accentColor: "#D97B8F",
    accentDark: "#B5536A",
    bgDark: "#1C1420",
    city: "Remote (US)",
    heroNote:
      "Your franchise rollups mean the same care recipient can see five different caregivers across HomeInstead locations, this demo builds the exact memory layer your charter describes: capture a care fact once, surface it to whoever shows up next.",
    whatTheyAsked:
      "The role's charter is reusable memory and governed, auditable data pathways, plus a closed loop between audits, product changes, and business outcomes, so care context stops fragmenting across locations.",
    demoExplainer:
      "A small working ledger, not a mockup: a care recipient's timeline across three visits, where mobility notes, medication timing, and a comfort cue are captured once and auto-surfaced to the next caregiver's handoff screen, each fact traceable to the visit it came from, with sensitive facts held behind an explicit approval gate before they propagate.",
    sampleDataNote: "Sample care recipient, visits, and caregivers, built for this demo only, not a real Honor client or franchise record.",
  },

  "rhythm-energy": {
    slug: "rhythm-energy",
    demoKind: "registry",
    registryKey: "rhythm-spread-monitor",
    companyName: "Rhythm Energy",
    roleTitle: "Senior Data Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4823742-senior-data-engineer",
    companyUrl: "https://www.gotrhythm.com/",
    accentColor: "#38BDF8",
    accentDark: "#1E93C2",
    bgDark: "#0B1420",
    city: "Houston, TX (remote)",
    heroNote:
      "Folding Inspire's book of business into Rhythm's means two pricing histories now sit under one roof, this demo makes the integration risk the posting names, cross-region margin blindness, visible instead of implicit.",
    whatTheyAsked:
      "The posting's near-term priority is integrating data systems across Finance, Retail, Wholesale, and Marketing post-acquisition, specifically across the legacy Rhythm and newly folded-in Inspire books.",
    demoExplainer:
      "A working spread monitor: one time-of-use plan tracked against a simulated ERCOT-style wholesale feed, split by region, legacy Rhythm Texas versus the newly folded-in Inspire markets. Trigger a simulated Texas summer peak and watch the margin ribbon narrow in real time, the exact kind of margin-at-risk visibility that should exist before quarter-end, not after.",
    sampleDataNote: "Simulated wholesale prices and one sample plan, not a live ERCOT feed or a real Rhythm or Inspire customer.",
  },

  "spoiler-alert": {
    slug: "spoiler-alert",
    demoKind: "registry",
    registryKey: "spoiler-decay-clock",
    companyName: "Spoiler Alert",
    roleTitle: "Senior Data Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4849839-senior-data-engineer",
    companyUrl: "https://www.spoileralert.com/",
    accentColor: "#84CC16",
    accentDark: "#4D7C0F",
    bgDark: "#14101C",
    city: "Remote (US)",
    heroNote:
      "Your platform already moves surplus inventory, this demo is the AI pricing and demand-matching layer your roadmap names but hasn't shipped yet, built small and working instead of pitched.",
    whatTheyAsked:
      "Spoiler Alert is a B2B platform helping CPG brands recover value from surplus and closeout inventory, with AI-driven pricing and demand-matching planned as a future layer on top of the platform being built now.",
    demoExplainer:
      "A working decay clock for four sample SKUs, near-dated snacks, a closeout apparel run, each with a live urgency score that climbs as days-to-expiry shrink, dynamically re-ranking which buyer type, discount grocer, liquidator, export broker, the system would route the offer to next. Run the clock to watch items re-rank in real time.",
    sampleDataNote: "Sample SKUs and an accelerated clock, built for this demo only, not real Spoiler Alert inventory or client data.",
  },

  viaduct: {
    slug: "viaduct",
    demoKind: "registry",
    registryKey: "viaduct-warning-lag",
    companyName: "Viaduct",
    roleTitle: "Data Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/820667-data-engineer",
    companyUrl: "https://www.viaduct.ai/",
    accentColor: "#64748B",
    accentDark: "#475569",
    bgDark: "#0D1117",
    city: "Remote (US)",
    heroNote:
      "Your PACCAR partnership is built on catching systemic issues 3 to 6 months before conventional warranty analysis, this demo makes that lead time, and what breaks it, visible instead of asserted.",
    whatTheyAsked:
      "Viaduct's Temporal Structural Inference Engine claims detection of systemic quality issues 3 to 6 months earlier than conventional warranty analysis, documented in the PACCAR, Peterbilt, and Kenworth partnership.",
    demoExplainer:
      "The same injected fault signature replayed twice: with a complete telemetry pipeline, detection fires inside the documented 3-6 month early-warning window. Switch to a dropped ETL batch and replay again, the same signal slips silently past that window to the standard, much later warranty-claim detection point, the exact failure mode a data engineer on this pipeline has to prevent.",
    sampleDataNote: "Simulated fleet telemetry and an injected fault signature, not real PACCAR, Peterbilt, or Kenworth data.",
  },

  snout: {
    slug: "snout",
    demoKind: "registry",
    registryKey: "snout-plan-radar",
    companyName: "Snout",
    roleTitle: "Principal Software Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4399837-customer-support-specialist-tier-1-2-clone",
    companyUrl: "https://www.snout.com/",
    accentColor: "#2DD4BF",
    accentDark: "#0F9488",
    bgDark: "#0F1B1A",
    city: "Remote (US/Ontario)",
    heroNote:
      "A no-credit-check financing model has no credit score to lean on, this demo is the continuous portfolio visibility that would have to exist in its place, built as a working signal instead of a slide.",
    whatTheyAsked:
      "Snout is B2B2C veterinary wellness-plan financing, clinics offer monthly, interest-free, no-credit-check preventive-care plans backed by a $110M+ financing facility, with no traditional credit score standing between the plan and default risk.",
    demoExplainer:
      "A working plan health radar: four sample clinics, each with a cluster of wellness plans, scrub the week slider forward and watch one clinic's lapsing-risk signal climb and cross a threshold before it becomes default exposure against the financing facility. This opportunity is inferred from the financing structure, not a confirmed existing Snout feature.",
    sampleDataNote: "Sample clinics, plan counts, and risk trajectories, built for this demo only, not real Snout portfolio data. This is an inferred opportunity, not a confirmed existing Snout feature.",
  },

  august: {
    slug: "august",
    demoKind: "registry",
    registryKey: "august-cross-margin",
    companyName: "August",
    roleTitle: "Data Engineer, Data & Analytics",
    jobPostingUrl: "https://wellfound.com/jobs/3302243-data-engineer",
    companyUrl: "https://wellfound.com/jobs/3302243-data-engineer",
    accentColor: "#F472B6",
    accentDark: "#DB2777",
    bgDark: "#0A0612",
    city: "Remote (US)",
    heroNote:
      "Cross-margining DeFi and CeFi positions across 12+ chains means one price shock on one chain has to be felt by the whole blended account instantly, this demo makes that ripple visible.",
    whatTheyAsked:
      "August is an on-chain institutional prime brokerage: smart-contract multi-sig subaccounts, cross-margining DeFi and CeFi positions in a single account across 12+ chains and 70+ protocols, reporting roughly $7B a month in volume.",
    demoExplainer:
      "One simulated institutional account with collateral spread across five chains and protocols, staked ETH, an LP position, a lending position, a short hedge. Trigger a simulated ETH price shock and watch it ripple through correlated positions while the uncorrelated USDC lending position holds steady, all recalculated live into one blended margin ratio.",
    sampleDataNote: "Simulated account, positions, and price shock, built for this demo only, not a real August client account. august.com belongs to an unrelated company and is intentionally not linked anywhere on this page.",
  },

  tenna: {
    slug: "tenna",
    demoKind: "registry",
    registryKey: "tenna-telemetry",
    companyName: "Tenna",
    roleTitle: "Principal Data Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4639752-principal-data-engineer",
    companyUrl: "https://www.tenna.com/",
    accentColor: "#D97706",
    accentDark: "#B45309",
    bgDark: "#171310",
    city: "Remote (US)",
    heroNote:
      "370,000+ tracked assets means thousands of low-value BLE beacon pings landing every minute alongside the one signal that actually predicts a breakdown. Ingestion that can't tell them apart just makes a bigger pile of data.",
    whatTheyAsked:
      "The role reports to the CTO and owns IoT ingestion, replayability, and real-time distribution across a fleet mixing plug-in/solar hardware trackers and tiny BLE beacons, plus the AI/ML infra built on top of that stream.",
    demoExplainer:
      "A small replay console: scrub through a past jobsite window and switch between the raw telemetry stream (every asset, native frequency) and a filtered risk signal that correctly surfaces a developing maintenance-risk pattern on one excavator without it getting buried in beacon noise. Not real customer fleet data, a demonstration of the filtering problem.",
    sampleDataNote: "Illustrative jobsite and telemetry values, built for this demo only, not real Tenna customer data.",
  },

  covu: {
    slug: "covu",
    demoKind: "registry",
    registryKey: "covu-golden-record",
    companyName: "COVU",
    roleTitle: "Data Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4130979-data-engineer",
    companyUrl: "https://www.covu.com/",
    accentColor: "#2F81F7",
    accentDark: "#1D4ED8",
    bgDark: "#0A1220",
    city: "Remote (US)",
    heroNote:
      "Three carrier feeds can disagree on the same policy's renewal date or coverage limit on the same day. An AI router that acts on whichever value arrived last is one wrong auto-response away from a bad outcome.",
    whatTheyAsked:
      "The role builds the Golden Policy Journal and Golden Account Cluster: harmonizing conflicting carrier data into one source of truth, with quarantine logic that holds back anything unresolved from automated handling.",
    demoExplainer:
      "A reconciliation view: one policy arriving from three simulated carrier feeds, clean or deliberately conflicting. Run reconciliation and watch it resolve into a single Golden Policy with a visible confidence or conflict flag, then see what the AI router actually does with it, auto-handles a clean record, correctly routes a conflicted one to a human instead of guessing.",
    sampleDataNote: "Illustrative policy and carrier feed values, built for this demo only, not real COVU customer data.",
  },

  podium: {
    slug: "podium",
    demoKind: "registry",
    registryKey: "podium-call-health",
    companyName: "Podium",
    roleTitle: "Senior Software Engineer, VoIP",
    jobPostingUrl: "https://wellfound.com/jobs/4493438-senior-software-engineer-voip",
    companyUrl: "https://www.podium.com/",
    accentColor: "#A855F7",
    accentDark: "#9333EA",
    bgDark: "#140C1F",
    city: "Remote (US)",
    heroNote:
      "A jitter spike doesn't care that an AI Employee was about to pick up. Most VoIP stacks drop or garble the call at exactly the moment it mattered, the lead hangs up before anyone, human or AI, ever answers.",
    whatTheyAsked:
      "The role works on real SIP/VoIP infra (FreeSWITCH, Kamailio, Asterisk) plus WebRTC, keeping the AI Employee reliably on the line through the full inquiry-to-booking journey.",
    demoExplainer:
      "Inject a network degradation (packet loss, jitter spike) into a simulated inbound call and watch two stacks side by side: a typical setup drops or garbles the call right as the AI Employee should pick up, while proper jitter-buffering and failover keeps it on the line through the same degradation all the way to a confirmed booking.",
    sampleDataNote: "Illustrative call and network conditions, built for this demo only, not real Podium traffic.",
  },

  sniffspot: {
    slug: "sniffspot",
    demoKind: "registry",
    registryKey: "sniffspot-booking-integrity",
    companyName: "Sniffspot",
    roleTitle: "Senior Mobile Engineer, React Native",
    jobPostingUrl: "https://wellfound.com/jobs/4602575-senior-mobile-engineer-react-native",
    companyUrl: "https://www.sniffspot.com/",
    accentColor: "#65A30D",
    accentDark: "#4D7C0F",
    bgDark: "#11170A",
    city: "Remote (US, strongest West Coast)",
    heroNote:
      "The whole premium over a free public park is exclusivity and safety, one booking at a time, verified disclosures. If two guests can both land on the same slot, or a stale fence-height note slips through, that premium disappears.",
    whatTheyAsked:
      "The role builds the React Native app for a marketplace renting private yards by the hour, where single-booking exclusivity, reviewed hosts and guests, and accurate safety disclosures are the actual product, not a feature.",
    demoExplainer:
      "A phone-shaped booking simulator: fire two guests at the same yard slot within milliseconds of each other and watch the race resolve, one confirmed, the other redirected to open slots before ever seeing a confirmation screen. Paired with a live safety-disclosure checklist that has to stay verified before the confirm button will even work.",
    sampleDataNote: "Illustrative yard, guests, and timestamps, built for this demo only, not real Sniffspot listings.",
  },

  whatconverts: {
    slug: "whatconverts",
    demoKind: "registry",
    registryKey: "whatconverts-attribution-uptime",
    companyName: "WhatConverts",
    roleTitle: "DevOps Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4735230-devops-engineer",
    companyUrl: "https://www.whatconverts.com/",
    accentColor: "#DB2777",
    accentDark: "#BE185D",
    bgDark: "#120A14",
    city: "Remote (US)",
    heroNote:
      "Agencies resell this attribution data as part of their own client reporting. An instance failure that silently drops or misattributes leads for even twenty minutes isn't an ops metric, it's an agency telling its client the wrong thing about where their business came from.",
    whatTheyAsked:
      "The role owns CI/CD, EC2 auto-scaling, and building security into the pipeline (secret scanning, IAM hardening, SOC 2 evidence collection) for a bootstrapped call-tracking and attribution SaaS.",
    demoExplainer:
      "Inject a simulated instance failure against a live countdown to an agency's client-reporting deadline, and watch two pipelines diverge: a legacy setup silently drops attribution on over a third of its leads before the report goes out, while a pipeline with proper failover keeps every lead correctly attributed through the same incident.",
    sampleDataNote: "Illustrative lead counts and incident timing, built for this demo only, not real WhatConverts traffic.",
  },

  deepgram: {
    slug: "deepgram",
    demoKind: "registry",
    registryKey: "deepgram-trust-flow",
    companyName: "Deepgram",
    roleTitle: "Security Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4792072-security-engineer",
    companyUrl: "https://deepgram.com/",
    accentColor: "#06B6D4",
    accentDark: "#0891B2",
    bgDark: "#060F14",
    city: "Remote (US)",
    heroNote:
      "200,000+ developers send Deepgram their users' actual voices, biometric data in a lot of jurisdictions, and none of them can currently see where that audio goes, when it's encrypted, or when it's actually deleted.",
    whatTheyAsked:
      "The role secures a voice-AI API platform (speech-to-text, text-to-speech, voice agents) where every request carries real customer audio through ingest, processing, and retention.",
    demoExplainer:
      "A live pipeline visualizer: send a request and watch it move through the real stages, ingest, encrypted in transit, processed, encrypted at rest, retention, with a toggle between retaining audio and auto-deleting it on schedule. The kind of end-to-end transparency Deepgram's own developer base would want and doesn't have visible anywhere today.",
    sampleDataNote: "Illustrative request and retention timing, built for this demo only, not real Deepgram traffic.",
  },

  ravenna: {
    slug: "ravenna",
    demoKind: "registry",
    registryKey: "ravenna-escalation",
    companyName: "Ravenna",
    roleTitle: "Senior Fullstack Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/3982821-sr-fullstack-engineer",
    companyUrl: "https://www.ravenna.ai/",
    accentColor: "#3E8EDE",
    accentDark: "#2C6CB0",
    bgDark: "#15171E",
    city: "Seattle, WA (remote)",
    heroNote:
      "An AI service desk that answers from Notion, Confluence, and Slack history lives or dies on one judgment call per message: answer now, or hand it to a human. Get that call wrong on an HR issue and the AI's own guess is the thing that just got exposed.",
    whatTheyAsked:
      "The role builds the Slack-native agent that answers IT and HR questions from connected sources, or routes them to staff when it shouldn't answer at all.",
    demoExplainer:
      "A confidence simulator inside a mocked Slack thread. Toggle between a benign IT request and a sensitive HR issue, watch the agent's confidence score and cited source, and see the trust boundary in action: a confident answer gets posted in-channel, a sensitive one gets escalated privately, the agent's own guess never shown.",
    sampleDataNote: "Scripted scenarios and a fabricated Slack thread, built for this demo only, not a real Ravenna conversation.",
  },

  "rilian-technologies": {
    slug: "rilian-technologies",
    demoKind: "registry",
    registryKey: "rilian-provenance",
    companyName: "Rilian Technologies",
    roleTitle: "Senior Frontend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4677928-frontend-engineer-clone",
    companyUrl: "https://www.rilian.com/",
    accentColor: "#22D3EE",
    accentDark: "#139DB0",
    bgDark: "#0A0E12",
    city: "McLean, VA (remote)",
    heroNote:
      "On a shared board where autonomous agents and human operators both move pieces in real time, the one thing that has to be unambiguous is who did what. An operator who can't tell an agent's move from their own can't trust the board.",
    whatTheyAsked:
      "The posting describes Meridian, an infinite canvas where a human operator and AI agents work a live board together; this demo is illustrative of that concept, not a confirmed product detail.",
    demoExplainer:
      "A small tactical board with draggable nodes and a provenance log underneath it. Drag a node yourself and it's logged as an operator action; trigger a simulated agent action and it's logged with its own tag, its own color, and the reason it fired, so the audit trail never blurs who moved what.",
    sampleDataNote: "Invented nodes and flag reasons on a mocked board, built for this demo only, not real Rilian telemetry.",
  },

  "monte-carlo": {
    slug: "monte-carlo",
    demoKind: "registry",
    registryKey: "montecarlo-rootcause",
    companyName: "Monte Carlo",
    roleTitle: "Senior Backend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4787336-senior-backend-engineer",
    companyUrl: "https://www.montecarlodata.com/",
    accentColor: "#8B5CF6",
    accentDark: "#6940C9",
    bgDark: "#0F1420",
    city: "Remote (US)",
    heroNote:
      "When an agent's answer is wrong, \"the data was bad somewhere upstream\" isn't a diagnosis. Lineage tracing only earns its claim if someone can click backward through the chain and land on the one event that actually caused it.",
    whatTheyAsked:
      "The role centers on agent trust: tracing context quality and behavior from raw warehouse data through to an agent's action, with lineage that holds up when something goes wrong.",
    demoExplainer:
      "A root cause walk. Start at a bad agent output and trace back one hop at a time, retrieved context, source data, upstream pipeline run, each one flagged changed recently or not, until the walk lands on the single pipeline run that actually caused the bad answer.",
    sampleDataNote: "A fabricated refund-policy incident and lineage chain, built for this demo only, not real Monte Carlo customer data.",
  },

  dv01: {
    slug: "dv01",
    demoKind: "registry",
    registryKey: "dv01-loanlevel",
    companyName: "dv01",
    roleTitle: "Sr. Backend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4040879-sr-backend-engineer",
    companyUrl: "https://www.dv01.co/",
    accentColor: "#E5484D",
    accentDark: "#C53338",
    bgDark: "#111827",
    city: "Remote (US)",
    heroNote:
      "A portfolio-level delinquency chart can stay flat for months while a specific cohort quietly deteriorates underneath it. Loan-level data exists precisely to catch what the aggregate hides.",
    whatTheyAsked:
      "The role works on standardizing loan-level data, not portfolio aggregates, across mortgage, consumer, auto, student, and small-business loans for lenders and capital-markets investors.",
    demoExplainer:
      "A side-by-side view: a portfolio summary chart that looks healthy and flat, next to a loan-level drill-down. Filter to a specific cohort and a small, real cluster of loans moving into forbearance shows up, exactly what the portfolio chart can't surface on its own.",
    sampleDataNote: "Invented loan IDs and a synthetic cohort, built for this demo only, not real dv01 or lender data.",
  },

  substrakt: {
    slug: "substrakt",
    demoKind: "registry",
    registryKey: "substrakt-sync",
    companyName: "Substrakt",
    roleTitle: "Backend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4766885-backend-engineer",
    companyUrl: "https://www.substrakt.com/",
    accentColor: "#D6428C",
    accentDark: "#B22E70",
    bgDark: "#1A1217",
    city: "Remote (UK)",
    heroNote:
      "For a small arts organization, a public booking page that wrongly says sold out costs a visit that won't come back around. Whether that page reflects Spektrix in real time or a five-minute-old cache is the whole ballgame.",
    whatTheyAsked:
      "The role integrates Wagtail CMS sites for 90+ arts and culture organizations with Spektrix for ticketing, membership, and donations, keeping public pages honest about live seat state.",
    demoExplainer:
      "A mock public event page next to a mock Spektrix backend. Simulate a booking and watch, under a poll-cache setting, the public count sit stale until the next poll; switch to a webhook setting and watch the same booking land almost instantly, the sync boundary made visible instead of assumed.",
    sampleDataNote: "A fabricated event and seat count, built for this demo only, not a real Substrakt or Spektrix integration.",
  },

  "eight-sleep": {
    slug: "eight-sleep",
    demoKind: "registry",
    registryKey: "eightsleep-boundary",
    companyName: "Eight Sleep",
    roleTitle: "Security Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4756990-security-engineer",
    companyUrl: "https://www.eightsleep.com/",
    accentColor: "#F2994A",
    accentDark: "#D9792B",
    bgDark: "#0A0F1C",
    city: "Remote (US)",
    heroNote:
      "Eight Sleep's privacy policy already states personal data isn't used to train LLMs or third-party generative AI. That's a sentence most people never read. Here it's a boundary you can watch hold.",
    whatTheyAsked:
      "The Pod cover tracks HRV, heart rate, respiratory rate, and sleep stage without a wearable, and Autopilot adjusts temperature and elevation from that data in real time; the role secures that pipeline.",
    demoExplainer:
      "One night's simulated biometric stream animated through capture, encrypted sync, Autopilot's real-time loop, and stored history. Switch views and watch the same data attempt the path toward an AI model training pipeline and get stopped at a clearly marked wall, the privacy policy's claim made visually checkable instead of buried in a document.",
    sampleDataNote: "Simulated HRV, heart rate, and respiratory readings, built for this demo only, not real Eight Sleep user data.",
  },
};

export function getProofOfWorkPreview(slug: string): ProofOfWorkPreviewConfig | undefined {
  return proofOfWorkPreviews[slug];
}
