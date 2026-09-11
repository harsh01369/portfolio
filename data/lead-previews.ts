// Per-lead preview pages for genuinely hot leads (sustained multi-day click
// engagement on a cold-outreach email, tracked via the &lead= param already
// on every dental campaign link). One shared page template
// (app/preview/[slug]/page.tsx) renders whichever config matches the slug in
// the URL, so adding the next hot lead is "add an entry here," not "build a
// new page." Real facts only, pulled directly from the business's own live
// site at the time the config was written -- never invented, per the
// no-fabricated-details rule this whole campaign runs under. If a fact isn't
// published anywhere on their real site, the chat prompt's RULES section
// says so explicitly rather than the AI guessing at it.

export interface LeadPreviewConfig {
  slug: string;
  opportunityId: string; // real OIE Opportunity.id, carried through as &lead= for click/contact tracking continuity
  businessName: string;
  tagline: string;
  phone: string; // real, shown on the booking section so the "Schedule" button has somewhere real to send someone
  city: string;
  accentColor: string;
  accentDark: string;
  heroNote: string; // one real, specific differentiator worth leading with
  closedWeekdays: number[]; // 0=Sun...6=Sat, drives the booking calendar demo, from their real hours
  journeySteps: { customerAsks: string; whatHappens: string }[]; // what the chat actually does, not a recap of facts they already know
  sourceUrl: string; // the real site these facts were pulled from
  chatSystemPrompt: string; // fully self-contained, real facts only
}

export const leadPreviews: Record<string, LeadPreviewConfig> = {
  "new-columbia-dentistry": {
    slug: "new-columbia-dentistry",
    opportunityId: "cmttoz4vp0008uxw433nyxude",
    businessName: "New Columbia Dentistry",
    tagline: "Modern dentistry that caters to you",
    phone: "202-918-1620",
    city: "Washington, DC",
    accentColor: "#247D8F",
    accentDark: "#1B5F6B",
    heroNote: "A wine bar in the lobby and Netflix in every treatment room, real differentiators most practices don't have",
    closedWeekdays: [0, 6],
    journeySteps: [
      {
        customerAsks: "A patient messages at 9pm asking about the Invisalign promotion",
        whatHappens: "Gets the real numbers back immediately, up to $1,500 off plus a free photo facial, instead of a message that sits unread until Monday.",
      },
      {
        customerAsks: "Someone tries to book for a Saturday",
        whatHappens: "Told plainly you're closed weekends and offered the next open weekday, instead of a booking request nobody sees until it's too late to answer.",
      },
      {
        customerAsks: "They're ready to actually book",
        whatHappens: "A calendar opens right inside the chat. No phone tag, no waiting on a callback during business hours.",
      },
    ],
    sourceUrl: "https://newcolumbiadentistry.com/",
    chatSystemPrompt: `You are the AI assistant for New Columbia Dentistry, a dental practice and beauty lab in Washington, DC run by Dr. Scott Brewster, DDS.

ADDRESS: 1140 3rd Street NE, Washington, DC 20002. Phone 202-918-1620.

HOURS: Monday-Friday 7am-7pm. Closed Saturday and Sunday.

WHAT MAKES THIS PRACTICE DIFFERENT: A fully-stocked wine bar in the lobby, guests are welcome to enjoy it before or after their appointment. Every treatment room has a TV with Netflix access and headphones. Family block appointments are available so a whole family can be seen at the same time, call ahead to arrange one. Same-day treatment after diagnosis whenever possible.

SERVICES: General and restorative dentistry, plus a dedicated Aesthetics side of the practice (New Columbia Dentistry & Beauty Lab) offering cosmetic smile makeovers and beauty treatments. Financing options are available.

CURRENT PROMOTION: Invisalign Day, up to $1,500 off Invisalign treatment, a free complementary photo facial laser treatment (worth $1,000), and a free Invisalign and beauty lab consultation with Dr. Brewster. HSA/FSA accounts can be used toward treatment.

APP: The practice partners with RepeatMD, patients can download the app for ongoing discounts on aesthetic and dental treatments.

RULES: Only use the facts given above. This practice has not published specific prices for individual treatments like exams, cleanings, fillings, or veneers beyond the Invisalign promotion numbers above, if asked for a price that isn't listed here, say a member of the team will follow up with exact pricing rather than guessing or inventing a number. Never invent a dentist's name, a policy, or medical advice that isn't listed here. Keep replies to 2-3 sentences.`,
  },
};

export function getLeadPreview(slug: string): LeadPreviewConfig | undefined {
  return leadPreviews[slug];
}

// Keyed by opportunityId (not slug) since that's what arrives in chat-demo's
// request body as `lead` -- the same id already threaded through every
// dental campaign link via &lead=.
export function getLeadPreviewByOpportunityId(opportunityId: string): LeadPreviewConfig | undefined {
  return Object.values(leadPreviews).find((p) => p.opportunityId === opportunityId);
}
