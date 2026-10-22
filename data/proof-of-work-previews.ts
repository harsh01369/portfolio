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

  astra: {
    slug: "astra",
    demoKind: "registry",
    registryKey: "astra-routing",
    companyName: "Astra",
    roleTitle: "Backend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4869788-backend-engineer",
    companyUrl: "https://astrafi.com/",
    accentColor: "#4338CA",
    accentDark: "#322C96",
    bgDark: "#0A0E1F",
    city: "Remote (US)",
    heroNote:
      "Astra's pitch is intelligent routing across ACH, RTP, FedNow, Visa Direct, and Mastercard Move, but a sponsor-bank-agnostic router is only convincing if you can see it actually trading off speed, cost, and success rate per transaction, not just naming the rails.",
    whatTheyAsked:
      "The role builds the payments cloud backend that routes each transaction to the rail that wins on speed, cost, and success rate, with automatic failover when a rail is unavailable.",
    demoExplainer:
      "A routing decision simulator: pick a transfer amount, destination type, and urgency, and watch the 5 rails score and reorder live on their real tradeoffs. Trigger a simulated rail failure and watch live failover to the next-best rail with a latency readout, the actual mechanism behind sponsor-bank agnostic.",
    sampleDataNote: "Illustrative rail economics and success rates for this demo only, not Astra's live routing data.",
  },

  accountable: {
    slug: "accountable",
    demoKind: "registry",
    registryKey: "accountable-proof-vault",
    companyName: "Accountable",
    roleTitle: "Junior DVN Backend Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4844600-junior-dvn-backend-engineer",
    companyUrl: "https://accountable.capital/",
    accentColor: "#166534",
    accentDark: "#11492A",
    bgDark: "#06140D",
    city: "Remote (US)",
    heroNote:
      "YieldApp requires every vault to show Live Proof of Reserves, but a real marketplace listing shows a number either way, attested or self-reported look identical until something breaks.",
    whatTheyAsked:
      "The role builds the Data Verification Network: secure enclaves, zkTLS, and zero-knowledge proofs that attest financial claims like reserves and collateral without exposing raw data.",
    demoExplainer:
      "A vault dashboard where every stat carries a toggle between ZK-attested (click to see the enclave, zkTLS session, proof generation, and on-chain commitment steps) and self-reported (grey, no proof trail), making verifiable and claimed visually distinct, which nothing in YieldApp's current listings does.",
    sampleDataNote: "Illustrative vault, stats, and proof chain for this demo only, not a real fund or live DVN output.",
  },

  kovo: {
    slug: "kovo",
    demoKind: "registry",
    registryKey: "kovo-score-climb",
    companyName: "Kovo",
    roleTitle: "Backend Engineer (Senior Hire)",
    jobPostingUrl: "https://wellfound.com/jobs/4811867-backend-engineer-senior-hire",
    companyUrl: "https://www.kovocredit.com/",
    accentColor: "#9A3412",
    accentDark: "#7A2A0E",
    bgDark: "#1A0E08",
    city: "Remote (US)",
    heroNote:
      "$10/month, no credit check, reports to all 4 bureaus, milestone-based rewards, but builds your credit is abstract until you can see which FICO factor actually moves and when the milestones unlock.",
    whatTheyAsked:
      "The role is a senior backend hire on a 24-month, no-credit-check credit-builder loan product with milestone-based rewards tied to on-time payments.",
    demoExplainer:
      "A month-by-month payment-to-score simulator: pick a starting credit profile, log on-time payments, and watch the live FICO-factor breakdown update in sync with Kovo's own milestone unlocks, showing exactly which factor moved and why.",
    sampleDataNote: "Illustrative score model for this demo only, not a FICO-certified simulation or Kovo's actual bureau-reported trajectory.",
  },

  "constructor-io": {
    slug: "constructor-io",
    demoKind: "registry",
    registryKey: "constructor-reasoning",
    companyName: "Constructor.io",
    roleTitle: "Backend Engineer, Retail Media",
    jobPostingUrl: "https://wellfound.com/jobs/4263124-backend-engineer-retail-media",
    companyUrl: "https://constructor.com/",
    accentColor: "#334155",
    accentDark: "#24303F",
    bgDark: "#0C1118",
    city: "Remote (US)",
    heroNote:
      "Unlock paid revenue without hurting the shopping experience is the whole pitch, but nothing in a typical retail-media demo actually shows the relevance-versus-bid tradeoff happening in real time.",
    whatTheyAsked:
      "The role builds the Commerce Reasoning Engine that powers search, browse, recommendations, and retail media together on the same ranking logic.",
    demoExplainer:
      "A live search sandbox: type a query, see organic results ranked by relevance, then toggle retail media on and watch one slot swap to a sponsored product, with a side panel showing the actual relevance-score-vs-bid-adjusted-score math and a running relevance integrity meter.",
    sampleDataNote: "Mock catalog, relevance scores, and bid figures for this demo only, not Constructor's live ranking output.",
  },

  pepper: {
    slug: "pepper",
    demoKind: "registry",
    registryKey: "pepper-order-agent",
    companyName: "Pepper",
    roleTitle: "Mid-Level Full Stack Engineer, New Verticals",
    jobPostingUrl: "https://wellfound.com/jobs/4829656-mid-level-full-stack-engineer-new-verticals",
    companyUrl: "https://www.usepepper.com/",
    accentColor: "#9F1239",
    accentDark: "#7C0E2D",
    bgDark: "#1A0610",
    city: "Remote (US)",
    heroNote:
      "Order Agent already parses voice, text, images, and handwriting for independent food distributors, but the new c-store vertical adds a wrinkle generic order parsing doesn't handle: promo pricing that has to be caught and flagged, not just priced.",
    whatTheyAsked:
      "The role extends Pepper's Order Agent into convenience-store verticals, covering promotions, ordering, pricing, and payments on top of the existing distributor platform.",
    demoExplainer:
      "Order Agent, c-store edition: paste a messy order the way a store owner would text it in, and watch it parse into structured order lines against a mock catalog, with promo pricing auto-detected and flagged distinctly from standard pricing, plus the total promo savings called out.",
    sampleDataNote: "Mock c-store catalog and prices for this demo only, not Pepper's live Order Agent output.",
  },

  "vested-finance": {
    slug: "vested-finance",
    demoKind: "registry",
    registryKey: "vested-true-return",
    companyName: "Vested Finance",
    roleTitle: "Software Engineer (Mobile)",
    jobPostingUrl: "https://wellfound.com/jobs/4417481-software-engineer-mobile-react-native-flutter",
    companyUrl: "https://vestedfinance.com/",
    accentColor: "#86198F",
    accentDark: "#6B1374",
    bgDark: "#170A1A",
    city: "Remote (India)",
    heroNote:
      "Vested's INR-conversion returns calculator stops at currency movement, but an NRI investor's real number is smaller again after capital-gains tax and LRS remittance costs, the gap between what the app shows and what actually lands back in a bank account.",
    whatTheyAsked:
      "The role is a mobile engineer (React Native/Flutter) on the platform NRIs use to invest in US stocks and ETFs from India.",
    demoExplainer:
      "A True Return calculator: pick a stock, holding period, and amount, and watch three numbers build up live, raw USD return, return after currency movement, and return after approximate tax and remittance drag, the full picture Vested's current calculator doesn't show.",
    sampleDataNote: "Illustrative return, currency, and tax-drag model for this demo only, not investment or tax advice.",
  },

  cypherock: {
    slug: "cypherock",
    demoKind: "registry",
    registryKey: "cypherock-shard-map",
    companyName: "Cypherock",
    roleTitle: "Mobile Engineer (Contract)",
    jobPostingUrl: "https://wellfound.com/jobs/2523398-mobile-engineer-contract-based",
    companyUrl: "https://www.cypherock.com/",
    accentColor: "#00C9A7",
    accentDark: "#00A989",
    bgDark: "#0B1614",
    city: "Remote (India, contract)",
    heroNote:
      "X1 splits your private key into 5 shards across one Vault and four NFC Cards, so no single device ever holds the complete key, but that claim is just a sentence on a landing page until someone can watch it survive an actual loss.",
    whatTheyAsked:
      "The contract covers the mobile app for the X1 hardware wallet, where Shamir's Secret Sharing distributes key shards across the Vault and 4 NFC Cards instead of one seed phrase.",
    demoExplainer:
      "An interactive shard map: click any of the 5 shards to simulate losing it and watch recoverability update live against the real 3-of-5 threshold, toggled against a seed-phrase wallet where losing the one backup is total, permanent loss.",
    sampleDataNote: "Illustrative shard states only, simulated losses, not a real X1 session or real key material.",
  },

  "nex-playground": {
    slug: "nex-playground",
    demoKind: "registry",
    registryKey: "nex-crossdomain",
    companyName: "Nex",
    roleTitle: "Senior Business Data Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4869749-senior-business-data-engineer",
    companyUrl: "https://nex.inc/",
    accentColor: "#FF9F1C",
    accentDark: "#D97F0A",
    bgDark: "#15100A",
    city: "Remote (US)",
    heroNote:
      "Device sell-through and MDK content engagement live in separate systems today, so a holiday bundle that spikes both at once still shows up as two charts nobody thinks to put side by side.",
    whatTheyAsked:
      "The role spans Accounting, Finance, Supply Chain, and Publishing data for both the Nex Playground hardware and the third-party MDK content ecosystem built on top of it.",
    demoExplainer:
      "A joined report across the two domains you'd otherwise query separately: pick a promotional event and watch device sell-through by SKU/region and MDK content engagement by title spike together in the same week, with the correlation called out instead of left for someone to notice.",
    sampleDataNote: "Illustrative SKUs, titles, and weekly unit/session counts, not real Nex sales or MDK telemetry.",
  },

  "wynd-labs": {
    slug: "wynd-labs",
    demoKind: "registry",
    registryKey: "wyndlabs-trust-receipt",
    companyName: "Wynd Labs (Grass)",
    roleTitle: "Data Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4664636-data-engineer",
    companyUrl: "https://wynd.network/",
    accentColor: "#4ADE80",
    accentDark: "#2FBE63",
    bgDark: "#0A140D",
    city: "Remote (US)",
    heroNote:
      "Grass promises your idle bandwidth crawls public web data for AI training without ever touching your private browsing, but that promise is unverifiable from the outside unless you can see exactly what a session actually touched.",
    whatTheyAsked:
      "The role builds the data pipelines behind a bandwidth-sharing network that crawls public web data through idle user connections, where trust in never touching private sessions is the entire product.",
    demoExplainer:
      "A transparency receipt generator: run a simulated crawl session and watch it build a line-item receipt of anonymized categories, data types, bytes, and points earned, next to a fixed, explicit list of what a session never includes.",
    sampleDataNote: "A simulated single-node session with illustrative categories and byte counts, clearly not a live Grass crawl.",
  },

  "wheelhouse-pricing": {
    slug: "wheelhouse-pricing",
    demoKind: "registry",
    registryKey: "wheelhouse-price-provenance",
    companyName: "Wheelhouse",
    roleTitle: "Senior Data Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4234284-senior-data-engineer",
    companyUrl: "https://www.usewheelhouse.com/",
    accentColor: "#FFB020",
    accentDark: "#D99000",
    bgDark: "#140F08",
    city: "Remote (US)",
    heroNote:
      "Wheelhouse says if its pipelines slow down the core product stops working, 21M listings analyzed nightly, but the rate a host actually sees arrives with no visible reasoning behind it.",
    whatTheyAsked:
      "The role owns the data pipelines that turn nightly analysis of 21M listings into the pricing recommendations hosts rely on, where pipeline reliability is explicitly framed as the product.",
    demoExplainer:
      "A price provenance explorer: pick a sample listing and see the anonymized comp set, the signals that fed tonight's number (occupancy pacing, booking window, a seasonal event), each with its own freshness timestamp, building up to the suggested rate instead of just stating it.",
    sampleDataNote: "3 illustrative sample listings with fabricated comps and signals, not real Wheelhouse host or market data.",
  },

  "formcept-devops": {
    slug: "formcept-devops",
    demoKind: "registry",
    registryKey: "formcept-infra-ontology",
    companyName: "FORMCEPT",
    roleTitle: "DevOps Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/471484-devops-engineer",
    companyUrl: "https://www.formcept.com/",
    accentColor: "#6366F1",
    accentDark: "#4749C7",
    bgDark: "#0E0B1A",
    city: "Remote (India)",
    heroNote:
      "FORMCEPT's pitch is ontology-first, business entities sit above HDFS, Kafka, Spark, HBase, and Elasticsearch, but when infra breaks on a per-client hybrid deployment, nobody can see which named business metric just went stale until a dashboard quietly turns red.",
    whatTheyAsked:
      "The role runs on-prem/hybrid infrastructure (HDFS, HBase, Elasticsearch, Kafka, Spark) underneath an ontology-first platform where MecGPT/MecRAG agents sit on top of Domain Ontology and Chronology layers.",
    demoExplainer:
      "An infra-to-ontology map: inject a simulated Kafka consumer lag spike and watch it propagate visibly upward through ETL to the exact named business entities that go stale as a result, instead of a generic red status dot.",
    sampleDataNote: "A simulated single-incident walkthrough with illustrative entity names, not a real client deployment or real infra metrics.",
  },

  "metabase-sre": {
    slug: "metabase-sre",
    demoKind: "registry",
    registryKey: "metabase-upgrade-safety",
    companyName: "Metabase",
    roleTitle: "Senior SRE/DevOps Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4536791-senior-sre-devops-engineer",
    companyUrl: "https://www.metabase.com/",
    accentColor: "#509EE3",
    accentDark: "#2F7FC4",
    bgDark: "#0A121C",
    city: "Remote (US)",
    heroNote:
      "Metabase Cloud sells zero-downtime upgrades, but every self-hosted power user's real fear is a version bump silently breaking a custom dashboard or embed nobody's watching until a customer complains.",
    whatTheyAsked:
      "The role owns full lifecycle automation and zero-downtime upgrades for Metabase Cloud's managed hosting, where an upgrade that quietly breaks a saved question or embed is the exact failure mode to design against.",
    demoExplainer:
      "An upgrade safety simulator: run a mock instance's saved questions and dashboards through a simulated version bump and watch a live compatibility diff resolve each item to confirmed-safe or needs-review with a reason, before letting you cut traffic over.",
    sampleDataNote: "5 illustrative saved questions/dashboards and a simulated version diff, not a real Metabase Cloud instance or customer content.",
  },

  flox: {
    slug: "flox",
    demoKind: "registry",
    registryKey: "flox-chain-of-custody",
    companyName: "Flox",
    roleTitle: "Security Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4149909-security-engineer",
    companyUrl: "https://flox.dev/",
    accentColor: "#3B0764",
    accentDark: "#2B0550",
    bgDark: "#0B0B17",
    city: "Remote (US)",
    heroNote:
      "Flox sells signed, reproducible, audit-ready as the core product, every environment ships a signed SBOM and build provenance a customer's auditor can check. That promise only holds if tampering anywhere in the pipeline actually gets caught, not just claimed.",
    whatTheyAsked:
      "This is Flox's first dedicated security hire, securing the Nix-based dev-environment platform and the signing/provenance chain customers rely on for audits.",
    demoExplainer:
      "A chain-of-custody visualizer for Flox's own build pipeline. Pick a stage to tamper with, run it, and watch exactly where signature verification catches the altered artifact, or run it clean and watch every stage check out end to end.",
    sampleDataNote: "Illustrative manifest, build, and signature stages, built for this demo only, not a real Flox pipeline run.",
  },

  kargo: {
    slug: "kargo",
    demoKind: "registry",
    registryKey: "kargo-tower-trust",
    companyName: "Kargo",
    roleTitle: "Network Security Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4385586-network-security-engineer",
    companyUrl: "https://www.mykargo.com/",
    accentColor: "#C2410C",
    accentDark: "#8A2E09",
    bgDark: "#120C08",
    city: "Remote (US)",
    heroNote:
      "Kargo Towers sit at the loading dock verifying freight identity and condition by computer vision, then feed that straight into a customer's ERP/TMS/WMS. One compromised Tower on the floor, and bad data is now inside the warehouse system of record.",
    whatTheyAsked:
      "The role secures the network layer between edge Tower sensors and the backend, where device identity, firmware integrity, and signed CV readings all have to hold up before anything reaches the dashboard.",
    demoExplainer:
      "A Tower Trust Ledger: click any Tower on the mock dock floor and watch its scan event move through identity attestation, encrypted mesh link, firmware integrity check, and signed CV reading. Flip to the compromised scenario and watch one Tower get rejected before its data ever reaches the WMS.",
    sampleDataNote: "Invented Tower IDs and dock layout, built for this demo only, not a real Kargo customer site.",
  },

  "interra-health": {
    slug: "interra-health",
    demoKind: "registry",
    registryKey: "interra-guardrail-console",
    companyName: "Interra Health",
    roleTitle: "AI Security Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4718911-ai-security-engineer",
    companyUrl: "https://www.interrahealth.com/",
    accentColor: "#475569",
    accentDark: "#2E3A4D",
    bgDark: "#0D1117",
    city: "Remote (US)",
    heroNote:
      "Interra's real-time pharmacy benefit check runs on roughly 50 million prescriptions a year, telling a prescriber what a drug actually costs before the patient reaches the pharmacy. An alternative-drug assistant that can be talked out of the real formulary data is a coverage decision nobody can trust.",
    whatTheyAsked:
      "The role guards the AI layer sitting on top of real formulary and benefit data, where a prompt injection succeeding doesn't just produce a bad answer, it can misstate what a patient will actually be charged.",
    demoExplainer:
      "A guardrail stress-test console. Type or pick an adversarial line aimed at an alternative-drug-recommendation assistant, run the check, and watch a pattern-matching guardrail flag and neutralize the injection live, the final recommendation stays anchored to the same formulary data regardless of what the prompt tried to claim.",
    sampleDataNote: "Illustrative formulary figures and a simple keyword guardrail, built for this demo only, not real Interra plan data.",
  },

  spade: {
    slug: "spade",
    demoKind: "registry",
    registryKey: "spade-mtls-handshake",
    companyName: "Spade",
    roleTitle: "Senior Platform Security Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4607104-senior-platform-security-engineer",
    companyUrl: "https://www.spade.com/",
    accentColor: "#1D4ED8",
    accentDark: "#1538A0",
    bgDark: "#060B18",
    city: "Remote (US)",
    heroNote:
      "Spade enriches raw card-transaction data for issuers, fintechs, and banks. Selling upmarket into enterprise banks lives or dies on the mTLS cert lifecycle and webhook signing-secret rotation holding up under exactly the attacks a bank's own security team will try first.",
    whatTheyAsked:
      "The role owns platform security for the enrichment pipeline banks connect to, including the cert and secret-rotation infrastructure that gates every request before it reaches enrichment.",
    demoExplainer:
      "An mTLS handshake visualizer for one enrichment request. Switch between a normal handshake, a replay attack, and an expired cert, and watch exactly which step rejects the connection, both before any enriched data crosses the boundary.",
    sampleDataNote: "Illustrative handshake steps and attack scenarios, built for this demo only, not a real Spade connection.",
  },

  skylight: {
    slug: "skylight",
    demoKind: "registry",
    registryKey: "skylight-magic-import",
    companyName: "Skylight",
    roleTitle: "Principal/Staff Product Security Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4817874-principal-or-staff-product-security-engineer",
    companyUrl: "https://www.skylightframe.com/",
    accentColor: "#6EE7B7",
    accentDark: "#3FAE82",
    bgDark: "#07140F",
    city: "Remote (US)",
    heroNote:
      "Skylight Calendar's Magic Import forwards a school email or PDF and auto-builds a calendar event on a shared, child-visible touchscreen. That's an AI feature ingesting untrusted third-party content straight onto a family's wall, with no human review in between.",
    whatTheyAsked:
      "The role is Skylight's senior product security hire, responsible for exactly this class of risk: AI features that bring outside content onto a shared household device.",
    demoExplainer:
      "A Magic Import trust check. Feed in a normal forwarded school reminder and watch it build a clean calendar event, then switch to a poisoned version with a hidden instruction buried in the text and watch the sanitization layer strip it out, struck through and flagged, before the calendar ever sees it.",
    sampleDataNote: "Invented school email content and a hidden instruction, built for this demo only, not a real Skylight import.",
  },

  temporal: {
    slug: "temporal",
    demoKind: "registry",
    registryKey: "temporal-proxy-inspector",
    companyName: "Temporal Technologies",
    roleTitle: "Software Engineer II, Cloud Enablement",
    jobPostingUrl: "https://wellfound.com/jobs/4735397-software-engineer-ii-cloud-enablement",
    companyUrl: "https://temporal.io/",
    accentColor: "#A16207",
    accentDark: "#6B4405",
    bgDark: "#15100A",
    city: "Remote (US)",
    heroNote:
      "Temporal Proxy is the official open-source gRPC bridge letting self-hosted customers move to Temporal Cloud without touching application code, namespace translation, TLS termination, and payload encryption all happen in the Proxy, invisibly to the Worker.",
    whatTheyAsked:
      "The Cloud Enablement team owns exactly this bridge, making the self-hosted-to-Cloud migration path real for customers who can't rewrite their Workers to get there.",
    demoExplainer:
      "A Proxy inspector for a single Workflow call. Toggle between self-hosted only and self-hosted plus Cloud, start the call, and watch the payload move hop by hop, namespace rewritten in-flight, TLS terminated and re-established, payload bytes shown plaintext before the Proxy and ciphertext after, with the Worker's own code never changing between modes.",
    sampleDataNote: "Illustrative namespace, payload, and hop timing, built for this demo only, not real Temporal Cloud traffic.",
  },

  "intuition-machines": {
    slug: "intuition-machines",
    demoKind: "registry",
    registryKey: "hcaptcha-latency-risk",
    companyName: "Intuition Machines (hCaptcha)",
    roleTitle: "Site Reliability Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/1810253-site-reliability-engineer",
    companyUrl: "https://www.hcaptcha.com/",
    accentColor: "#C8463C",
    accentDark: "#A33429",
    bgDark: "#180C0B",
    city: "Remote (US)",
    heroNote:
      "hCaptcha scores millions of requests a second, when load forces latency down, the usual way to get it back is skipping risk-analysis depth, that's a security regression wearing a performance costume.",
    whatTheyAsked:
      "The role keeps a verification system that runs at massive scale fast and correct under load, where the tradeoff between challenge latency and bot-resistance is a live operational decision, not a one-time config.",
    demoExplainer:
      "A working latency-vs-risk dial: ramp a simulated request stream and watch p50/p99 latency and bot pass-through rise together. Toggle between degrading risk-analysis depth gracefully under load and refusing to, which forces a sudden fail-open once the queue breaches its latency budget.",
    sampleDataNote: "Simulated request-per-second ramp and derived latency/bot-pass curves, built for this demo only, not real hCaptcha traffic or thresholds.",
  },

  nametag: {
    slug: "nametag",
    demoKind: "registry",
    registryKey: "nametag-deletion-attestation",
    companyName: "Nametag",
    roleTitle: "Full Stack Engineer, Product Platform",
    jobPostingUrl: "https://wellfound.com/jobs/4797177-full-stack-engineer-product-platform",
    companyUrl: "https://www.getnametag.com/",
    accentColor: "#28406B",
    accentDark: "#1C2E4D",
    bgDark: "#0A0F1A",
    city: "Remote (US)",
    heroNote:
      "A biometric deletion request under BIPA or GDPR isn't done when one row disappears, it's done when the primary, the replica, the cache, and the backup all confirm it's gone, with proof.",
    whatTheyAsked:
      "The role owns tenant isolation at the schema level, region-aware routing, and biometric deletion that actually reaches replicas, caches, and backups, not just the primary record.",
    demoExplainer:
      "A working deletion attestation console: trigger a sample biometric-record deletion and watch a live sweep across four copies of the data, each returning its own signed absence confirmation, ending in one exportable cryptographic deletion certificate.",
    sampleDataNote: "Simulated record, node sweep, and certificate hash, built for this demo only, not real Nametag infrastructure or customer data.",
  },

  wellbeam: {
    slug: "wellbeam",
    demoKind: "registry",
    registryKey: "wellbeam-care-transition",
    companyName: "WellBeam",
    roleTitle: "Senior DevSecOps Engineer",
    jobPostingUrl: "https://wellfound.com/jobs/4824691-senior-devsecops-engineer",
    companyUrl: "https://well-beam.com/",
    accentColor: "#B5651D",
    accentDark: "#8F4F13",
    bgDark: "#160F08",
    city: "Remote (US)",
    heroNote:
      "Discharge, the handoff from acute to post-acute care, is the highest-risk moment for clinical data to cross an organizational boundary unlogged.",
    whatTheyAsked:
      "The role embeds security directly in the pipeline connecting hospital EMRs to home-health and hospice EMRs at the exact moment of patient discharge.",
    demoExplainer:
      "A working care-transition security trace: simulate one patient handoff record moving from an acute EMR into WellBeam and out to a home-health EMR, watching each infra control fire as the record crosses a boundary, ending in a per-record attestation summary.",
    sampleDataNote: "Simulated discharge record and control timings, built for this demo only, not real WellBeam infrastructure or patient data. Real domain is well-beam.com, not wellbeam.com (an unrelated supplement company).",
  },

  "jerry-ai": {
    slug: "jerry-ai",
    demoKind: "registry",
    registryKey: "jerry-tco-simulator",
    companyName: "Jerry.ai",
    roleTitle: "Data Scientist",
    jobPostingUrl: "https://wellfound.com/jobs/4869851-data-scientist",
    companyUrl: "https://getjerry.com/",
    accentColor: "#8C3B4A",
    accentDark: "#6E2C38",
    bgDark: "#140A0C",
    city: "Remote (US)",
    heroNote:
      "An insurance quote and a repair-cost estimate and a financing schedule each come from a different marketplace, a car-ownership super app needs them fused into one number, not three tabs.",
    whatTheyAsked:
      "The role builds the data fusion behind Jerry's expansion from insurance comparison into a full car-ownership super app, blending marketplaces that have never shared a model before.",
    demoExplainer:
      "A working true-cost-of-ownership simulator: pick a horizon and a keep-vs-trade plan, and watch insurance premium trend, predicted repair/maintenance cost, and financing payoff blend live into one cumulative total that recalculates as you adjust either control.",
    sampleDataNote: "Sample vehicle profile and cost curves, built for this demo only, not real Jerry.ai pricing or user data.",
  },

  northbeam: {
    slug: "northbeam",
    demoKind: "registry",
    registryKey: "northbeam-reconciliation",
    companyName: "Northbeam",
    roleTitle: "Data Scientist",
    jobPostingUrl: "https://wellfound.com/jobs/4787286-data-scientist",
    companyUrl: "https://www.northbeam.io/",
    accentColor: "#9C8238",
    accentDark: "#7A6428",
    bgDark: "#15120A",
    city: "Remote (US)",
    heroNote:
      "MTA and MMM+ agree on direction and disagree on magnitude, Incrementality is the causal check, but today it only reports the gap, it doesn't close it.",
    whatTheyAsked:
      "The role sits between Northbeam's MTA and MMM+ products and its newer Incrementality product, the calibration layer that today is one-way and Meta-only.",
    demoExplainer:
      "A working three-way reconciliation chart: one campaign's attributed value from MTA and MMM+ plotted against sparse incrementality test results, with a visible disagreement band. Run a new lift test and watch the correlational lines bend toward the causal number instead of just sitting next to it.",
    sampleDataNote: "Simulated campaign timeline and lift-test results, built for this demo only, not real Northbeam client data. This is an inferred roadmap opportunity, not a confirmed existing Northbeam feature.",
  },

  "oden-technologies": {
    slug: "oden-technologies",
    demoKind: "registry",
    registryKey: "oden-line-to-model",
    companyName: "Oden Technologies",
    roleTitle: "Forward Deployed Data Scientist",
    jobPostingUrl: "https://wellfound.com/jobs/4722684-forward-deployed-data-scientist",
    companyUrl: "https://oden.io/",
    accentColor: "#345B7D",
    accentDark: "#244459",
    bgDark: "#0C1620",
    city: "Remote (US)",
    heroNote:
      "Models don't transfer cleanly between factory lines, but the discovery-to-recommendation path that builds them should, that's the case for embedding on-site instead of shipping a generic dashboard.",
    whatTheyAsked:
      "The role is forward-deployed because Process AI's prescriptive recommendations have to be rebuilt against each new factory line's own sensor signature, not reused wholesale from the last one.",
    demoExplainer:
      "A working line-to-model onboarding simulator: feed in a never-seen factory line's sample sensor stream and watch it move through anomaly discovery, root-cause trace, and a prescriptive recommendation, which then lands in a visible, reusable pattern template library.",
    sampleDataNote: "Simulated multi-sensor time-series and discovered patterns, built for this demo only, not real Oden customer telemetry.",
  },

  "purpose-unlimited": {
    slug: "purpose-unlimited",
    demoKind: "registry",
    registryKey: "purpose-causal-trace",
    companyName: "Purpose Unlimited",
    roleTitle: "Staff Data Scientist",
    jobPostingUrl: "https://wellfound.com/jobs/4697900-staff-data-scientist",
    companyUrl: "https://www.purposeinvest.com/",
    accentColor: "#6B4F8C",
    accentDark: "#543D6E",
    bgDark: "#120A18",
    city: "Remote (Canada)",
    heroNote:
      "The advisors who opt into a rebalancing nudge were already more engaged before they saw it, the raw outcome gap mixes a real product effect with who was likely to click anyway.",
    whatTheyAsked:
      "The role builds measurement architecture and causal infrastructure connecting advisor-facing product decisions to client outcomes, for a platform that sells technology to advisors, not directly to retail investors.",
    demoExplainer:
      "A working decision-to-outcome causal trace: pick a simulated platform feature, watch advisor cohorts who saw it and didn't diverge over a timeline, then adjust for selection bias to reveal a causal-effect estimate with a confidence band, isolating the feature's real contribution from who chose to engage with it.",
    sampleDataNote: "Simulated advisor cohorts, outcome timelines, and causal estimates, built for this demo only, not real Purpose Unlimited client or advisor data.",
  },
};

export function getProofOfWorkPreview(slug: string): ProofOfWorkPreviewConfig | undefined {
  return proofOfWorkPreviews[slug];
}
