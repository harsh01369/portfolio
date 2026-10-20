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

export type ProofOfWorkPreviewConfig = DataVideoPreview | DiscoveryJourneyPreview | CareerPathPreview;

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
};

export function getProofOfWorkPreview(slug: string): ProofOfWorkPreviewConfig | undefined {
  return proofOfWorkPreviews[slug];
}
