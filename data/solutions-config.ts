import type { IconName } from "@/components/solutions/icon";

export type IndustrySlug =
  | "medico" | "pet-care" | "tattoo" | "salon" | "trades"
  | "restaurant" | "cafe" | "fitness" | "photography" | "moving" | "automotive" | "med-spa";

export type SolutionSlug =
  | "ai-chatbot" | "booking-system" | "speed-optimization" | "website-rebuild" | "review-system";

// Pricing ceiling tracks the vertical, not the country (confirmed via market research
// across UK/US/Canada/EU): home/health services tolerate meaningfully higher recurring
// spend than appearance/hospitality/creative ones, everywhere.
export type IndustryTier = "A" | "B";

export interface IndustryConfig {
  slug: IndustrySlug;
  label: string;
  accentColor: string;
  accentLight: string;
  accentDark: string;
  workVerb: string;
  businessNoun: string;
  tier: IndustryTier;
}

export interface SolutionConfig {
  slug: SolutionSlug;
  title: string;
  tagline: string;
  description: string;
  icon: IconName;
}

export interface ROIDefaults { missedPerWeek: number; avgValue: number; label: string; }
export interface FAQ { question: string; answer: string; }

// Recurring items (chatbot, booking, reviews) are tiered by willingness-to-pay per
// vertical. One-time items (speed optimization, rebuild) are tiered by build
// complexity instead — a trades/dental site typically needs more pages and
// integrations than a cafe/tattoo site, so the higher price there is defensible
// as more work, not just "they can afford it."
export interface PricingModel {
  kind: "hybrid" | "monthly-flat" | "one-time";
  setup?: Record<IndustryTier, number>;
  monthly?: Record<IndustryTier, number>;
  oneTime?: Record<IndustryTier, [number, number]>;
  trustLine?: string;
}

// Repriced against real 2026 market comparables (AI receptionist tools, Acuity/
// Setmore, NiceJob/Birdeye/Podium) rather than guessed. See MODULES below for the
// canonical per-module numbers used by the interactive package builder; this map
// stays in sync with those same figures so a visitor landing directly on a single
// solution page (and the ROI calculator on it) sees consistent pricing either way.
export const pricing: Record<SolutionSlug, PricingModel> = {
  "ai-chatbot": { kind: "hybrid", setup: { A: 249, B: 179 }, monthly: { A: 79, B: 49 } },
  "booking-system": { kind: "monthly-flat", monthly: { A: 45, B: 29 }, trustLine: "No commission, ever, unlike most booking platforms" },
  "review-system": { kind: "monthly-flat", monthly: { A: 39, B: 29 } },
  "speed-optimization": { kind: "one-time", oneTime: { A: [349, 349], B: [199, 199] } },
  "website-rebuild": { kind: "one-time", oneTime: { A: [1800, 3500], B: [1200, 2500] } },
};

// ============================================================
// PACKAGE BUILDER — the 4 sellable, mix-and-match modules plus the one bonus
// that only unlocks at the full bundle. Review Requests is deliberately not
// independently pickable: it's invisible background automation with no felt
// daily pain, easy to DIY for free (Google already gives every business a
// shareable review link), and untested as a standalone sell. It earns its
// place as the reward for committing to everything else, not as a 5th thing
// a stranger has to independently believe in.
// ============================================================

export type ModuleSlug = "website" | "ai-receptionist" | "smart-booking" | "speed-optimization";

export interface PackageModule {
  slug: ModuleSlug;
  name: string;
  description: string;
  oneTimeFrom?: Record<IndustryTier, number>; // "starting at", final scope confirmed on the call
  setup?: Record<IndustryTier, number>;
  monthly?: Record<IndustryTier, number>;
}

export const packageModules: PackageModule[] = [
  {
    slug: "website",
    name: "Website & Mobile-First Build",
    description: "A fast, modern site built for your business, SEO structure included, not bolted on after.",
    oneTimeFrom: { A: 1800, B: 1200 },
  },
  {
    slug: "ai-receptionist",
    name: "AI Receptionist",
    description: "One AI, trained on your business, live on your website, WhatsApp, Instagram, and Messenger.",
    setup: { A: 249, B: 179 },
    monthly: { A: 79, B: 49 },
  },
  {
    slug: "smart-booking",
    name: "Smart Booking",
    description: "The real calendar engine underneath: live slots, no double-booking, confirmations and reminders.",
    monthly: { A: 45, B: 29 },
  },
  {
    slug: "speed-optimization",
    name: "Speed Optimization",
    description: "A one-time technical fix for a slow existing site, most local business sites take 8+ seconds on mobile.",
    oneTimeFrom: { A: 349, B: 199 },
  },
];

export const bonusModule = {
  name: "Review Requests",
  description: "Automatic post-appointment review requests, with unhappy customers routed to you privately, not to Google.",
  monthly: { A: 39, B: 29 } as Record<IndustryTier, number>,
};

// Escalating discount for committing to more modules at once, applied to the
// combined one-time total and combined monthly total separately. Hitting all 4
// also unlocks Review Requests free, the actual incentive to go all-in rather
// than an arbitrary bigger percentage.
export function getBundleDiscountPct(moduleCount: number): number {
  if (moduleCount >= 4) return 25;
  if (moduleCount === 3) return 15;
  if (moduleCount === 2) return 10;
  return 0;
}

export interface ResolvedPricing {
  kind: "hybrid" | "monthly-flat" | "one-time";
  setup?: number;
  monthly?: number;
  oneTimeLow?: number;
  oneTimeHigh?: number;
  trustLine?: string;
}

export function getPricing(solutionSlug: string, industrySlug: string): ResolvedPricing {
  const model = pricing[solutionSlug as SolutionSlug];
  const industry = industries.find((i) => i.slug === industrySlug);
  const tier: IndustryTier = industry?.tier ?? "B";
  if (!model) return { kind: "monthly-flat", monthly: 39 };
  const [oneTimeLow, oneTimeHigh] = model.oneTime?.[tier] ?? [];
  return {
    kind: model.kind,
    setup: model.setup?.[tier],
    monthly: model.monthly?.[tier],
    oneTimeLow,
    oneTimeHigh,
    trustLine: model.trustLine,
  };
}

export interface SolutionIndustryContent {
  heroHeadline: string;
  heroSubheadline: string;
  problemStory: string;
  painPoints: string[];
  features: { icon: IconName; title: string; description: string }[];
  roiDefaults: ROIDefaults;
  faqs: FAQ[];
  proofStat: string;
  proofDescription: string;
  chatSystemPrompt: string;
}

// Muted, restrained accent per industry — one working color, not a saturated rainbow.
export const industries: IndustryConfig[] = [
  { slug: "medico", label: "Medico", accentColor: "#3A6D8C", accentLight: "#F4F7F8", accentDark: "#2A5266", workVerb: "treating", businessNoun: "practice", tier: "A" },
  { slug: "pet-care", label: "Pet Care", accentColor: "#4C7A6D", accentLight: "#F4F7F6", accentDark: "#385C52", workVerb: "grooming", businessNoun: "business", tier: "B" },
  { slug: "tattoo", label: "Tattoo", accentColor: "#5B4A45", accentLight: "#F6F5F4", accentDark: "#43372F", workVerb: "inking", businessNoun: "studio", tier: "B" },
  { slug: "salon", label: "Salon", accentColor: "#8C5A6D", accentLight: "#F8F5F6", accentDark: "#6B4252", workVerb: "styling", businessNoun: "salon", tier: "B" },
  { slug: "trades", label: "Trades", accentColor: "#8A6D3B", accentLight: "#F8F6F1", accentDark: "#6B542C", workVerb: "fixing", businessNoun: "business", tier: "A" },
  { slug: "restaurant", label: "Restaurant", accentColor: "#A85D3B", accentLight: "#F8F4F1", accentDark: "#7E452B", workVerb: "cooking", businessNoun: "restaurant", tier: "B" },
  { slug: "cafe", label: "Cafe", accentColor: "#6B4A2E", accentLight: "#F7F4F0", accentDark: "#4F3620", workVerb: "brewing", businessNoun: "cafe", tier: "B" },
  { slug: "fitness", label: "Fitness", accentColor: "#5B5390", accentLight: "#F5F4F8", accentDark: "#433D6B", workVerb: "training", businessNoun: "gym", tier: "B" },
  { slug: "photography", label: "Photography", accentColor: "#33383F", accentLight: "#F5F5F6", accentDark: "#21252A", workVerb: "shooting", businessNoun: "studio", tier: "B" },
  { slug: "moving", label: "Moving", accentColor: "#3D6E8C", accentLight: "#F3F6F8", accentDark: "#2C5266", workVerb: "moving", businessNoun: "company", tier: "A" },
  { slug: "automotive", label: "Automotive", accentColor: "#4C5A6B", accentLight: "#F4F5F7", accentDark: "#37424F", workVerb: "repairing", businessNoun: "garage", tier: "A" },
  { slug: "med-spa", label: "Med Spa", accentColor: "#A8677A", accentLight: "#F9F4F5", accentDark: "#7F4E5D", workVerb: "enhancing", businessNoun: "clinic", tier: "A" },
];

export const solutions: SolutionConfig[] = [
  { slug: "ai-chatbot", title: "AI Chatbot & Receptionist", tagline: "Never miss a customer, even at 3am", description: "An AI-powered chatbot that answers customer questions, books appointments, and captures leads around the clock.", icon: "chat" },
  { slug: "booking-system", title: "Online Booking System", tagline: "Let customers book anytime, from anywhere", description: "A modern booking system that lets customers schedule appointments or request quotes directly from your website.", icon: "calendar" },
  { slug: "speed-optimization", title: "Speed & Mobile Optimization", tagline: "A site that loads in under 2 seconds", description: "Most local business websites take 8+ seconds to load on mobile. This rebuilds for speed.", icon: "route" },
  { slug: "website-rebuild", title: "Modern Website Rebuild", tagline: "A website that works as hard as you do", description: "A complete website rebuild with modern design, SEO optimization, and a conversion-focused layout.", icon: "badge" },
  { slug: "review-system", title: "Review & Reputation Management", tagline: "Turn happy customers into 5-star reviews", description: "Automatically send review requests after every appointment and build the reputation your business deserves.", icon: "star" },
];

export const solutionContent: Record<string, SolutionIndustryContent> = {
  "ai-chatbot:medico": {
    heroHeadline: "Your Patients Call After Hours.\nNobody Answers.",
    heroSubheadline: "Missed after-hours calls are missed bookings. An AI receptionist can answer every call and book every appointment, even at 3am.",
    problemStory: "It's 8pm. Sarah searches 'dentist near me.' She finds your practice, but there's no way to book online. She calls and gets voicemail. A competitor with an AI chatbot answers instantly and books her in. You never knew Sarah existed.",
    painPoints: [
      "No online booking, so patients call and you miss a share of them after hours",
      "Website is slow to load on mobile",
      "No way to answer questions outside office hours",
      "Competitors are already using AI chat and pulling ahead",
    ],
    features: [
      { icon: "chat", title: "AI Receptionist", description: "Answers patient questions around the clock: treatment info, pricing, availability" },
      { icon: "calendar", title: "Smart Booking", description: "Patients book directly from the chat, synced with your calendar" },
      { icon: "mobile", title: "Mobile-First", description: "A fast, clean experience on any phone" },
      { icon: "search", title: "SEO Optimized", description: "Built to rank for 'dentist near me' searches in your area" },
      { icon: "chart", title: "Analytics Dashboard", description: "Track every booking, missed call, and patient inquiry" },
      { icon: "star", title: "Review Requests", description: "Automatic review requests sent after every appointment" },
    ],
    roiDefaults: { missedPerWeek: 12, avgValue: 85, label: "per appointment" },
    faqs: [
      { question: "How much does it cost?", answer: "£249 one-time to build and set up your practice's AI receptionist, then £79 a month to keep it running. No long-term contract, cancel anytime." },
      { question: "How long does setup take?", answer: "Most practices are live within 14 days, with no technical work required on your side." },
      { question: "Does it work with my existing booking system?", answer: "Yes. It can connect to whatever practice management software you already use, or I can set up a standalone booking flow if you don't have one yet." },
      { question: "What if a patient asks something outside what the AI knows?", answer: "It says a member of the team will follow up personally rather than guessing. It only answers from the exact information you give it, nothing invented." },
      { question: "Can patients ask about specific treatments?", answer: "Yes. The AI is trained on your specific services, pricing, and policies." },
    ],
    proofStat: "Real-time AI chat",
    proofDescription: "built and shipped on a production Groq-powered chat system",
    chatSystemPrompt: `You are the AI receptionist for Bright Smile Dental, a private dental practice (no NHS patients, private only).

PRICES: New patient exam & X-rays £65. Check-up & clean (existing patient) £45. Single X-ray £25. Filling from £85. Root canal from £350. Crown from £450. Teeth whitening £299. Invisalign from £2,800 (free consultation). Emergency appointment £85, same-day if booked before 2pm.

DENTISTS: Dr. Sarah Chen (general and cosmetic dentistry), Dr. James Okafor (implants and oral surgery). New patients are usually seen by whichever dentist has the next available slot.

HOURS: Mon-Fri 8am-6pm, Sat 9am-2pm, closed Sundays.

POLICIES: 24 hours' notice needed to cancel or reschedule, otherwise a £25 fee applies. Payment plans are available for treatment over £500, ask and someone will call to set it up. Free parking on-site.

BOOKING: If someone wants to book, ask what treatment they need and their preferred day and time, then say you'll confirm by text or email.

RULES: Only use the facts given above. Never invent a price, a dentist's name, a policy, or medical advice that isn't listed here. If asked something outside this list, say a member of the team will follow up personally rather than guessing. Keep replies to 2-3 sentences.`,
  },
  "ai-chatbot:tattoo": {
    heroHeadline: "Your Art Deserves a Gallery,\nNot Just an Instagram Feed.",
    heroSubheadline: "A website with a live consultation assistant can show your portfolio, answer style questions, and book deposits while you're in the chair.",
    problemStory: "Jake wants a half-sleeve. He's browsing studios at midnight, comparing portfolios. Your Instagram is strong, but there's no website, no way to book, no price info. A studio down the road has an AI that shows styles, gives estimates, and takes a deposit. Jake books there.",
    painPoints: [
      "Portfolio lives only on Instagram, not searchable on Google",
      "No online consultation booking, so clients message and wait days",
      "No way to show pricing or style specialties on a website",
      "Missed walk-in inquiries when all chairs are busy",
    ],
    features: [
      { icon: "chat", title: "AI Consultation Bot", description: "Answers style questions, gives estimates, books consultations around the clock" },
      { icon: "gallery", title: "Portfolio Gallery", description: "Filterable by style: traditional, fine line, realism, Japanese, and more" },
      { icon: "coin", title: "Instant Estimates", description: "Ballpark pricing based on size, placement, and style" },
      { icon: "calendar", title: "Deposit & Booking", description: "Clients book and pay deposits directly, no more back-and-forth messages" },
      { icon: "mobile", title: "Mobile Gallery", description: "A swipeable, full-screen portfolio that loads instantly" },
      { icon: "search", title: "Google Ranking", description: "Built to rank for 'tattoo studio near me', not just Instagram hashtags" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 200, label: "per custom piece" },
    faqs: [
      { question: "Can the AI understand different tattoo styles?", answer: "Yes. It's trained on your specific style specialties, pricing tiers, and consultation process." },
      { question: "What about deposit collection?", answer: "The AI can collect deposits via Stripe directly in the chat, for example a standard £50 deposit to secure a consultation slot." },
      { question: "How do clients share reference images?", answer: "The consultation booking includes a reference image upload, and the AI categorizes it by style." },
      { question: "Will it replace my receptionist?", answer: "No. It handles the repetitive questions so your team can focus on custom design work." },
      { question: "Can it handle multiple artists' portfolios?", answer: "Yes. Each artist gets their own gallery section and bio, and the AI routes bookings to the right artist." },
    ],
    proofStat: "Stripe deposit flow",
    proofDescription: "built and shipped on a production e-commerce payment system",
    chatSystemPrompt: "You are an AI assistant for Valley Ink Studio. Help clients explore styles (traditional, fine line, realism, Japanese, blackwork), get estimates (small from £80, medium from £200, half-sleeve from £500+), and book consultations (£50 deposit). Artists: Jake (realism), Maya (fine line), Chris (Japanese). Keep responses concise (2-3 sentences max).",
  },
  "ai-chatbot:trades": {
    heroHeadline: "Capture Jobs While\nYou're on Another Job.",
    heroSubheadline: "A missed call while you're under a sink is a job gone to the next plumber on Google. An AI receptionist answers every call.",
    problemStory: "It's 6pm on a Friday. Mrs. Thompson's boiler breaks down. She Googles 'emergency plumber near me' and calls three numbers. Two go to voicemail. The third has an AI that answers instantly, asks what's wrong, and books an emergency callout for 7pm. You were one of the voicemails. That was a £350 job.",
    painPoints: [
      "Missed calls while on jobs, each one a potential £150-500 job lost",
      "No online presence beyond a basic trade directory listing",
      "Customers can't request quotes outside working hours",
      "Competitors with proper websites are getting the Google traffic",
    ],
    features: [
      { icon: "chat", title: "AI Call Handler", description: "Answers customer calls around the clock, captures the job, gets photos, books you in" },
      { icon: "alert", title: "Emergency Routing", description: "Urgent jobs get flagged immediately; you choose to accept or reschedule" },
      { icon: "image", title: "Photo Quotes", description: "Customers upload photos of the problem and get a preliminary estimate" },
      { icon: "badge", title: "Trust Badges", description: "Your certifications (Gas Safe, NICEIC, and similar) displayed clearly for instant trust" },
      { icon: "calendar", title: "Job Scheduling", description: "Customers book available slots directly, synced with your calendar" },
      { icon: "star", title: "Review Collection", description: "Automatic review requests after every completed job" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 180, label: "per job" },
    faqs: [
      { question: "I'm not tech-savvy, is this complicated?", answer: "No. Everything is set up for you, and job notifications land on your phone just like a text message." },
      { question: "What if it's an emergency callout?", answer: "Emergency requests are flagged as urgent and sent to you immediately by text and email. You decide whether to accept." },
      { question: "Can customers send photos of the problem?", answer: "Yes. The AI asks customers to upload a photo, which helps you assess the job before arriving." },
      { question: "Does it work for multiple trades?", answer: "Yes. Whether you're a plumber, electrician, builder, or multi-trade, the AI adapts to your services." },
      { question: "What does it cost?", answer: "£249 one-time setup, then £79 a month. It typically pays for itself with one extra job, and there's no long-term contract." },
    ],
    proofStat: "Automation pipeline",
    proofDescription: "built and shipped scraping and scheduling automation in production",
    chatSystemPrompt: "You are an AI assistant for Smith & Son Plumbing. Handle emergency callouts (24/7), routine bookings, and quote requests. Services: Emergency callout (£85 fee), boiler repair (from £120), boiler installation (from £1,800), bathroom fitting. Gas Safe registered, fully insured. Keep responses concise (2-3 sentences max).",
  },
  "ai-chatbot:salon": {
    heroHeadline: "Chairs Empty After 6pm?\nThey Don't Have to Be.",
    heroSubheadline: "Stylists fully booked at noon but empty by 4pm is a booking-friction problem. An AI assistant can fill every slot, morning, noon, and midnight.",
    problemStory: "Emma wants a balayage for her friend's wedding on Saturday. It's 10pm and she's browsing salons. She finds yours on Google, with strong work on Instagram. But the website has no booking, just a phone number. She finds a competitor with instant online booking and books there in 30 seconds.",
    painPoints: [
      "Phone-only booking loses evening and weekend inquiries",
      "No-shows cost hundreds per month with no deposit system",
      "Best work isn't showcased beyond Instagram",
      "Walk-in-only model limits scheduling efficiency",
    ],
    features: [
      { icon: "chat", title: "AI Style Advisor", description: "Recommends treatments based on client needs, with natural upsells" },
      { icon: "calendar", title: "24/7 Booking", description: "Clients book anytime: stylist, service, date, and time" },
      { icon: "gallery", title: "Service Menu", description: "A clean digital menu with prices, durations, and before/after photos" },
      { icon: "coin", title: "Deposit System", description: "Automatic deposit collection to reduce no-shows" },
      { icon: "mobile", title: "Mobile Perfect", description: "Most salon bookings happen on phones; this is built for that" },
      { icon: "star", title: "Loyalty & Reviews", description: "Track visits, reward regulars, collect Google reviews" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per appointment" },
    faqs: [
      { question: "Can clients choose their stylist?", answer: "Yes. Each stylist gets their own profile with specialties, portfolio, and availability." },
      { question: "How does the deposit system work?", answer: "When a client books, they pay a small deposit. Salons typically see a significant reduction in no-shows." },
      { question: "Can I showcase before/after transformations?", answer: "Yes. The website becomes a living portfolio of your best work." },
      { question: "What about product recommendations?", answer: "The AI can recommend products after appointments and link to an online shop." },
      { question: "Does it integrate with salon software?", answer: "It can connect to whatever booking software you already use, or run as a standalone system if you don't have one." },
    ],
    proofStat: "Admin dashboard",
    proofDescription: "built and shipped with real-time analytics and order tracking",
    chatSystemPrompt: "You are an AI assistant for Glow & Grace Salon. Services: Cut & Style (from £45), Balayage (from £120), Full Colour (from £85), Extensions (from £250), Gel Manicure (£35). Stylists: Amy (colour), Jade (nails), Priya (extensions). Keep responses concise (2-3 sentences max).",
  },
  "ai-chatbot:restaurant": {
    heroHeadline: "Stop Paying 30%\nto Delivery Apps.",
    heroSubheadline: "Every order through a delivery app costs a large commission. A direct ordering system lets customers order from you, keeping that margin in your pocket.",
    problemStory: "It's Saturday night. A family searches 'Italian restaurant near me.' They find you, but the website has a PDF menu from 2019. They check a delivery app instead and order from a competitor. That's a lost order, plus a chunk of the next delivery-app order going to the platform.",
    painPoints: [
      "Delivery apps take a large commission on every order",
      "Menu is a PDF or outdated, not mobile-friendly",
      "No online reservation system, phone only during busy hours",
      "No way to capture customer data from third-party orders",
    ],
    features: [
      { icon: "chat", title: "AI Order Assistant", description: "Takes orders, answers menu questions, handles dietary requirements" },
      { icon: "utensils", title: "Direct Ordering", description: "Customers order directly, so you keep the full margin" },
      { icon: "calendar", title: "Table Reservations", description: "Instant booking by party size, date, time, and special requests" },
      { icon: "mobile", title: "Digital Menu", description: "A clean, mobile-first menu with photos and dietary filters" },
      { icon: "chart", title: "Customer Data", description: "Own your customer relationships: names, preferences, order history" },
      { icon: "star", title: "Review Management", description: "Streamlined responses to Google and TripAdvisor reviews" },
    ],
    roiDefaults: { missedPerWeek: 15, avgValue: 28, label: "per order" },
    faqs: [
      { question: "Can it handle dietary requirements?", answer: "Yes. The AI knows your full menu, including allergens and vegan or vegetarian options." },
      { question: "How does direct ordering save money?", answer: "Delivery apps typically charge 25-35% commission. On meaningful monthly volume, that adds up to real money kept in-house." },
      { question: "What about delivery logistics?", answer: "You can use your own drivers, or connect to a last-mile delivery service at a fraction of the app commission." },
      { question: "Can customers reorder favourites?", answer: "Yes. Repeat customers get a quick-reorder option for past favourites." },
      { question: "Does it work for table reservations too?", answer: "Yes. The AI handles both ordering and reservations." },
    ],
    proofStat: "Full e-commerce build",
    proofDescription: "shipped with Stripe payments and an order management dashboard",
    chatSystemPrompt: `You are the AI host for Bella Vista Kitchen, a family-run Mediterranean restaurant.

MENU - Starters: Hummus & Pitta £6.50 (vegan), Grilled Halloumi £7.95 (vegetarian), Falafel Plate £7.50 (vegan), Calamari £8.95. Mains: Lamb Kofta Wrap £12.50, Chicken Shawarma Plate £13.95, Grilled Sea Bass £16.50, Vegetable Moussaka £11.95 (vegetarian, gluten-free), Mixed Grill £18.50 (serves 1, feeds 2 as sharer). Desserts: Baklava £5.50, Baked Cheesecake £6.00. Kids menu available, ask for details.

DIETARY: Vegan and vegetarian dishes marked above. Gluten-free bases available for most mains, ask when ordering. Full allergen list available on request, always confirm severe allergies with the kitchen directly rather than relying on chat.

HOURS: Tuesday to Sunday, 12pm-10pm. Closed Mondays. Kitchen closes for orders at 9:30pm.

RESERVATIONS: Online booking for parties up to 8. Larger groups should call the restaurant directly. Outdoor seating is dog-friendly, weather permitting. High chairs available.

ORDERING: Direct pickup orders take about 30-40 minutes. No delivery via third-party apps currently, pickup and dine-in only.

RULES: Only use the facts given above. Never invent a menu item, price, or allergen claim that isn't listed here. For anything about severe allergies, tell the customer to confirm with the kitchen directly rather than answering yourself. Keep replies to 2-3 sentences.`,
  },
  "ai-chatbot:pet-care": {
    heroHeadline: "Every Pet Owner Books.\nEven at Midnight.",
    heroSubheadline: "Pet parents browse at all hours. An AI assistant can answer their questions, show before/after grooming photos, and book their next appointment while you sleep.",
    problemStory: "It's Sunday evening. Lisa notices Max needs a groom before a family photo on Thursday. She Googles 'dog grooming near me', but there's no online booking, just 'call between 9-5 Mon-Fri.' She books with a competitor who has instant booking instead.",
    painPoints: [
      "Phone-only booking loses evening and weekend inquiries",
      "Customers can't see grooming work or service options online",
      "No automated reminders means missed regular appointments",
      "Competitors with online booking are winning regular clients",
    ],
    features: [
      { icon: "chat", title: "AI Pet Advisor", description: "Answers breed-specific questions, recommends services, books instantly" },
      { icon: "paw", title: "Pet Profiles", description: "Each pet gets a profile: breed, size, temperament, grooming history" },
      { icon: "gallery", title: "Before/After Gallery", description: "Showcases transformations, one of the best ways groomers win new clients" },
      { icon: "bell", title: "Auto-Reminders", description: "Texts clients when their pet is due, filling the calendar automatically" },
      { icon: "calendar", title: "24/7 Booking", description: "Clients book grooming, daycare, or walking anytime" },
      { icon: "star", title: "Review Boost", description: "Automatic review requests with before/after photos attached" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 55, label: "per grooming session" },
    faqs: [
      { question: "Can the AI handle different pet types?", answer: "Yes, dogs, cats, rabbits. It knows breed-specific grooming requirements." },
      { question: "How do auto-reminders work?", answer: "Based on breed and coat type, the AI calculates when each pet is due and sends a one-tap booking link." },
      { question: "Can clients see photos of their pet during grooming?", answer: "A client portal can be set up for progress and completion photos." },
      { question: "What about pet temperament notes?", answer: "Each pet profile includes temperament, allergies, and special handling notes." },
      { question: "Does it integrate with my existing system?", answer: "It can connect to whatever grooming software you already use, or run as a standalone system." },
    ],
    proofStat: "Automated content pipeline",
    proofDescription: "built and shipped generating assets across multiple platforms",
    chatSystemPrompt: "You are an AI assistant for Pawfect Groom. Services: Full Groom (dog £35-65, cat £45), Bath & Brush (£25-40), Nail Trim (£10), Puppy First Groom (£30). Open Mon-Sat 8am-6pm. Ask about breed and size. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:medico": {
    heroHeadline: "Stop Playing Phone Tag\nWith Your Patients.",
    heroSubheadline: "Every call your front desk can't take is a booking that might not come back. Let patients pick a slot and lock it in themselves, day or night.",
    problemStory: "It's Tuesday afternoon and the phone hasn't stopped ringing. A new patient calls to book a cleaning, gets voicemail, and books with the practice down the road instead, the one with a 'Book Now' button on their site.",
    painPoints: [
      "Front desk loses hours a day just booking and rebooking over the phone",
      "Patients calling after hours get voicemail, not a booking",
      "No-shows go untracked, with no automatic reminder to stop them",
      "Rescheduling a booked slot means another phone call, both ways",
    ],
    features: [
      { icon: "calendar", title: "Live Availability", description: "Patients see real open slots and book instantly, no back-and-forth calls" },
      { icon: "bell", title: "Automatic Reminders", description: "Text and email reminders sent before every appointment, cutting no-shows" },
      { icon: "clock", title: "Self-Serve Rescheduling", description: "Patients move their own appointment without calling the front desk" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two patients never land on the same slot" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
      { icon: "chart", title: "Full Booking History", description: "See every booking, cancellation, and reschedule in one place" },
    ],
    roiDefaults: { missedPerWeek: 12, avgValue: 85, label: "per appointment" },
    faqs: [
      { question: "Does this replace my front desk?", answer: "No. It takes the repetitive booking calls off their plate so they can focus on patients in the building." },
      { question: "What about patients who prefer to call?", answer: "They still can. This just gives everyone else the option to book without waiting on hold." },
      { question: "Can it handle different appointment types?", answer: "Yes. Each service (cleaning, treatment, consultation) can have its own duration and buffer time." },
      { question: "What if a patient needs to cancel?", answer: "They cancel or reschedule from the same link, no phone call needed, and the slot reopens automatically." },
      { question: "How much does it cost?", answer: "£45 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: `You are the booking assistant for Bright Smile Dental, a private dental practice (no NHS patients, private only).

PRICES: New patient exam & X-rays £65. Check-up & clean (existing patient) £45. Filling from £85. Emergency appointment £85, same-day if booked before 2pm.

DENTISTS: Dr. Sarah Chen (general and cosmetic), Dr. James Okafor (implants and oral surgery).

HOURS: Mon-Fri 8am-6pm, Sat 9am-2pm, closed Sundays.

BOOKING: Ask what treatment they need and their preferred day and time, then confirm the slot.

RULES: Only use the facts given above. Never invent a price, dentist name, or medical advice not listed here. Keep replies to 2-3 sentences.`,
  },
  "booking-system:tattoo": {
    heroHeadline: "Stop Losing Deposits\nTo 'I'll Message You Back.'",
    heroSubheadline: "Consultation requests that sit in your DMs for days go cold. A real booking calendar lets clients lock in a slot and pay their deposit right there.",
    problemStory: "A client messages your Instagram at 11pm asking about a forearm piece. You reply the next afternoon between clients. By then they've already booked a consultation with a studio that let them pick a slot and pay a deposit on the spot.",
    painPoints: [
      "Consultation requests pile up in DMs and go cold waiting on a reply",
      "No deposit collected up front, so booked slots get no-showed",
      "Rebooking after a no-show means starting the DM thread over",
      "No visibility into which artist has room this week",
    ],
    features: [
      { icon: "calendar", title: "Instant Consultation Booking", description: "Clients pick an open slot with their preferred artist and lock it in immediately" },
      { icon: "coin", title: "Deposit on Booking", description: "A deposit is collected the moment a slot is booked, so no-shows drop" },
      { icon: "image", title: "Reference Upload", description: "Clients attach reference images right when they book, so you walk in prepared" },
      { icon: "clock", title: "Per-Artist Calendars", description: "Each artist has their own availability, no manual coordinating" },
      { icon: "bell", title: "Reminder Texts", description: "Automatic reminders before the appointment cut down last-minute no-shows" },
      { icon: "mobile", title: "Books From Your Bio Link", description: "One link in your Instagram bio takes clients straight to booking, no app needed" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 200, label: "per custom piece" },
    faqs: [
      { question: "Does each artist need their own calendar?", answer: "Yes. Every artist gets their own availability and booking link, managed from one place." },
      { question: "How does the deposit work?", answer: "A standard deposit (for example £50) is collected via Stripe at booking, and deducted from the final price." },
      { question: "What if someone books the wrong artist?", answer: "Bookings can be moved between artists manually, no need to cancel and start over." },
      { question: "Can clients still DM instead of booking online?", answer: "Yes, this is in addition to DMs, not a replacement. It just gives people a faster option." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Stripe deposit flow",
    proofDescription: "built and shipped on a production e-commerce payment system",
    chatSystemPrompt: "You are the booking assistant for Valley Ink Studio. Help clients pick an artist and book a consultation (£50 deposit, deducted from final price). Artists: Jake (realism), Maya (fine line), Chris (Japanese). Estimates: small from £80, medium from £200, half-sleeve from £500+. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:photography": {
    heroHeadline: "Every 'Let Me Check My Calendar'\nIs a Client Booking Elsewhere.",
    heroSubheadline: "Couples and families shopping for a photographer book with whoever lets them lock in a date fastest. A live calendar does that for you, automatically.",
    problemStory: "A couple emails asking if you're free for their wedding date in June. You're mid-shoot and don't reply until the next day. By then they've already booked another photographer, the one with a 'Check Availability' button right on the site.",
    painPoints: [
      "Date availability lives in your head or a paper diary, not online",
      "Email inquiries about specific dates go unanswered for a day or more",
      "Package details get explained over email, again and again",
      "No deposit collected until well after the date is already agreed",
    ],
    features: [
      { icon: "calendar", title: "Live Date Availability", description: "Clients see exactly which dates are open before they even have to ask" },
      { icon: "image", title: "Package Selector", description: "Clients pick a shoot type (portrait, wedding, event) and see what's included before booking" },
      { icon: "coin", title: "Deposit to Confirm", description: "A booking only locks in once the deposit is paid, protecting your calendar" },
      { icon: "bell", title: "Automatic Confirmations", description: "Clients get an instant confirmation, then a reminder as the date approaches" },
      { icon: "mobile", title: "Books From Any Device", description: "Most inquiries happen on a phone between other things, this is built for that" },
      { icon: "route", title: "No Double-Booked Dates", description: "One calendar, so a date is never accidentally promised to two clients" },
    ],
    roiDefaults: { missedPerWeek: 3, avgValue: 450, label: "per booking" },
    faqs: [
      { question: "Can clients see different packages before booking?", answer: "Yes. Portrait, wedding, and event packages are each laid out with what's included and starting price." },
      { question: "What about the deposit?", answer: "A deposit (commonly 20% of the package) is collected via Stripe to confirm the date." },
      { question: "What if I need to block out personal dates?", answer: "You can block any date manually at any time, and it simply stops showing as available." },
      { question: "Does this work for different shoot types?", answer: "Yes. Weddings, portraits, and events can each have their own duration and pricing." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same real-time slot-locking logic used in production booking systems",
    chatSystemPrompt: "You are the booking assistant for Frame & Light Studio. Packages: Portrait session £150, Family session £220, Event coverage from £350, Wedding package from £1,200 (20% deposit to confirm). Photographer: Alex. Ask what type of shoot and preferred date. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:medico": {
    heroHeadline: "8 Seconds to Load.\n3 Seconds to Lose the Patient.",
    heroSubheadline: "Most local practice websites take 8+ seconds to load on mobile. Most patients leave before it finishes. This is a technical rebuild for speed, not a redesign.",
    problemStory: "A patient searches 'emergency dentist near me' from their phone, in pain, in a hurry. Your site takes 9 seconds to load on mobile data. They're back on Google before your homepage finishes painting, tapping the practice listed below you instead.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local practice site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Patients on mobile data or a weak signal give up before the page loads",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first, desktop second" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Photos resized and compressed without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 85, label: "per appointment" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£349, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Sub-2-second loads",
    proofDescription: "the same performance budget every production site I've shipped is held to",
    chatSystemPrompt: "You are the assistant for Bright Smile Dental, a private dental practice. Prices: check-up & clean £45, new patient exam £65, filling from £85, emergency appointment £85. Hours: Mon-Fri 8am-6pm, Sat 9am-2pm. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:tattoo": {
    heroHeadline: "Your Portfolio Takes 8 Seconds\nTo Load a Single Photo.",
    heroSubheadline: "A slow gallery kills the exact thing that's supposed to sell your work. This is a technical rebuild so every image loads instantly, not a redesign.",
    problemStory: "Someone taps a link to your portfolio from Instagram, on mobile data, in a waiting room. The gallery takes 8 seconds to load the first image. They're gone before the second one appears, back to scrolling Instagram instead.",
    painPoints: [
      "High-resolution portfolio images load slowly on mobile connections",
      "Google ranks slow sites lower, hurting 'tattoo studio near me' visibility",
      "Visitors bounce before the gallery finishes loading",
      "Every extra second of load time costs real visitors, measurably",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image and script on the current site gets measured" },
      { icon: "image", title: "Smart Image Compression", description: "Portfolio photos load fast without losing visible detail" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "Built to load fast on a phone first, where most traffic comes from" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The metrics Google uses to rank sites, brought into range" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, not just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, the current look stays unless a redesign is wanted too" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 200, label: "per custom piece" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£199, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Image-heavy sites, optimized",
    proofDescription: "portfolio and gallery-driven builds tuned for fast mobile load in production",
    chatSystemPrompt: "You are the assistant for Valley Ink Studio. Styles: traditional, fine line, realism, Japanese, blackwork. Estimates: small from £80, medium from £200, half-sleeve from £500+. Consultation deposit £50. Artists: Jake, Maya, Chris. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:photography": {
    heroHeadline: "A Slow Gallery Is the One Thing\nA Photographer's Site Can't Afford.",
    heroSubheadline: "If the portfolio that's supposed to prove your work is slow to load, it proves the opposite. This is a technical speed rebuild, not a redesign.",
    problemStory: "A bride-to-be taps your portfolio link from a vendor list, on her phone, on a break at work. The gallery takes 9 seconds to load. She doesn't wait, she's already back on the list, tapping the next photographer instead.",
    painPoints: [
      "High-resolution photos load slowly, especially on mobile",
      "Google ranks slower sites lower, hurting search visibility",
      "Visitors bounce before the portfolio finishes loading",
      "Every extra second of load time measurably costs real inquiries",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image and script on the current site gets measured" },
      { icon: "image", title: "Smart Image Compression", description: "Full-resolution photos load fast without a visible quality drop" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "Built to load fast on a phone first, where most inquiries start" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The metrics Google uses to rank sites, brought into range" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, not just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, the current look stays unless a redesign is wanted too" },
    ],
    roiDefaults: { missedPerWeek: 3, avgValue: 450, label: "per booking" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£199, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Image-heavy sites, optimized",
    proofDescription: "portfolio and gallery-driven builds tuned for fast mobile load in production",
    chatSystemPrompt: "You are the assistant for Frame & Light Studio. Packages: Portrait session £150, Family session £220, Event coverage from £350, Wedding package from £1,200 (20% deposit). Photographer: Alex. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:pet-care": {
    heroHeadline: "Every Booking Call Comes\nBetween Grooms.",
    heroSubheadline: "Your hands are full of a wet dog when the phone rings. Let pet parents pick a slot themselves, so the calendar fills without you touching your phone.",
    problemStory: "Lisa wants to book Max in before Thursday. She calls at 2pm, but you're mid-groom and can't get to the phone. She tries the groomer down the street instead, the one with a booking button on their site, and gets it done in 30 seconds.",
    painPoints: [
      "Phone rings mid-groom and there's no way to answer without stopping",
      "Voicemails from evening and weekend inquiries often go unreturned in time",
      "No-shows go untracked, with no automatic reminder to stop them",
      "Rebooking regulars means another phone call every single time",
    ],
    features: [
      { icon: "calendar", title: "Live Availability", description: "Pet parents see real open slots and book instantly, no back-and-forth calls" },
      { icon: "bell", title: "Automatic Reminders", description: "Text reminders sent before every appointment, cutting no-shows" },
      { icon: "paw", title: "Pet Profiles", description: "Breed, size, and temperament notes attached to every booking automatically" },
      { icon: "clock", title: "Self-Serve Rescheduling", description: "Clients move their own appointment without calling" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two dogs never land on the same slot" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 55, label: "per grooming session" },
    faqs: [
      { question: "Does this replace phone bookings?", answer: "No. It just gives clients the option to skip the call, they can still ring if they'd rather." },
      { question: "Can it handle different pet sizes and breeds?", answer: "Yes. Each service can have its own duration based on size, so a large dog groom doesn't get booked into a 30-minute slot." },
      { question: "What about regulars who book the same slot every month?", answer: "They can rebook their usual slot in one tap once it's set up." },
      { question: "What if a client needs to cancel?", answer: "They cancel or reschedule from the same link, no phone call needed." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for Pawfect Groom. Services: Full Groom (dog £35-65, cat £45), Bath & Brush (£25-40), Nail Trim (£10), Puppy First Groom (£30). Open Mon-Sat 8am-6pm. Ask about breed and size when booking. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:pet-care": {
    heroHeadline: "8 Seconds to Load.\nThey've Already Called Someone Else.",
    heroSubheadline: "Pet parents searching on their phone won't wait for a slow site to load. This is a technical rebuild for speed, not a redesign.",
    problemStory: "Someone searches 'dog groomer near me' on their phone between errands. Your site takes 8 seconds to load. They're back on Google before it finishes, tapping the groomer listed below you instead.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local pet-care site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Visitors on the go give up before the page loads",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Before/after grooming photos load fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 55, label: "per grooming session" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£199, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Image-heavy sites, optimized",
    proofDescription: "portfolio and gallery-driven builds tuned for fast mobile load in production",
    chatSystemPrompt: "You are the assistant for Pawfect Groom. Services: Full Groom (dog £35-65, cat £45), Bath & Brush (£25-40), Nail Trim (£10). Open Mon-Sat 8am-6pm. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:pet-care": {
    heroHeadline: "Your Grooming Is 5-Star.\nYour Website Isn't.",
    heroSubheadline: "A dated, slow website undersells work this good. This is a full rebuild, modern design, mobile-first, built to actually convert visitors into bookings.",
    problemStory: "A new client finds your Instagram, the work looks great, but your website looks like it hasn't been touched since 2016. They assume the business itself is behind the times too, and book somewhere with a site that matches the quality of the work.",
    painPoints: [
      "Website design doesn't reflect the quality of the actual grooming work",
      "No mobile-first layout, most visitors are on their phone",
      "No clear place to see pricing, services, or before/after photos",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, professional layout that matches the quality of your work" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most visitors are" },
      { icon: "gallery", title: "Before/After Gallery", description: "Showcase transformations, one of the best ways groomers win new clients" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for 'dog groomer near me' searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 55, label: "per grooming session" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, a phone-shot before/after gallery still works well if that's what's available." },
      { question: "How much does it cost?", answer: "£1,200–£2,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Pawfect Groom. Services: Full Groom (dog £35-65, cat £45), Bath & Brush (£25-40), Nail Trim (£10). Open Mon-Sat 8am-6pm. Keep responses concise (2-3 sentences max).",
  },
  "review-system:pet-care": {
    heroHeadline: "Happy Pet Parents Forget\nTo Leave a Review.",
    heroSubheadline: "A great groom gets a 'thank you!' text, not a Google review. Automatic requests after every appointment turn happy clients into public proof.",
    problemStory: "Someone picks up their freshly groomed dog, thrilled, and drives off. They meant to leave a review. They never did. Multiply that by every happy client this month, and it's a lot of 5-star reviews that just never got written down.",
    painPoints: [
      "Happy clients rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering to bring it up",
      "Unhappy clients are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and look more trusted",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the appointment, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when clients are happiest, not mid-appointment" },
      { icon: "alert", title: "Private Routing", description: "Unhappy clients are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Clients tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 55, label: "per grooming session" },
    faqs: [
      { question: "What if a client had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the appointment does the request go out?", answer: "Usually a few hours later, timed so it's not mid-visit but still fresh." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every appointment." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Pawfect Groom. Services: Full Groom (dog £35-65, cat £45), Bath & Brush (£25-40), Nail Trim (£10). Open Mon-Sat 8am-6pm. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:salon": {
    heroHeadline: "Stop Booking Clients\nBetween Blow-Dries.",
    heroSubheadline: "Every minute spent booking over the phone is a minute not behind the chair. Let clients pick a stylist, service, and time themselves.",
    problemStory: "Emma wants a balayage before her friend's wedding. She calls at 3pm, but you're mid-colour and can't pick up. She books online with the salon down the street instead, done in under a minute.",
    painPoints: [
      "Booking over the phone eats into time behind the chair",
      "Evening and weekend calls often go to voicemail",
      "No-shows go untracked, with no automatic reminder to stop them",
      "Rebooking regulars means another phone call every time",
    ],
    features: [
      { icon: "calendar", title: "Live Availability", description: "Clients see real open slots per stylist and book instantly" },
      { icon: "bell", title: "Automatic Reminders", description: "Text reminders sent before every appointment, cutting no-shows" },
      { icon: "clock", title: "Per-Stylist Calendars", description: "Each stylist has their own availability, no manual juggling" },
      { icon: "coin", title: "Deposit Option", description: "Optional deposit collection to protect against no-shows" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two clients never land on the same slot" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per appointment" },
    faqs: [
      { question: "Can clients choose their stylist?", answer: "Yes. Each stylist has their own profile and availability." },
      { question: "What about deposits for colour services?", answer: "A deposit can be required for higher-value services like colour or extensions, to protect the slot." },
      { question: "What if a client needs to reschedule?", answer: "They can move their own appointment from the same link, no phone call needed." },
      { question: "Does it work alongside walk-ins?", answer: "Yes. You control how many slots stay open for walk-ins versus online booking." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for Glow & Grace Salon. Services: Cut & Style (£45), Balayage (£120), Full Colour (£85), Extensions (£250), Gel Manicure (£35). Stylists: Amy (colour), Jade (nails), Priya (extensions). Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:salon": {
    heroHeadline: "A Slow Site Loses Bookings\nBefore It Even Loads.",
    heroSubheadline: "Most local salon websites take 8+ seconds to load on mobile. Most clients leave before it finishes. This is a technical rebuild for speed, not a redesign.",
    problemStory: "Someone searches 'balayage near me' on their phone. Your gallery of colour work takes 8 seconds to load. They're gone before the first photo appears, back to scrolling Instagram instead.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local salon site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Visitors on mobile data give up before the gallery loads",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Colour work and gallery photos load fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per appointment" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£199, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Image-heavy sites, optimized",
    proofDescription: "portfolio and gallery-driven builds tuned for fast mobile load in production",
    chatSystemPrompt: "You are the assistant for Glow & Grace Salon. Services: Cut & Style (£45), Balayage (£120), Full Colour (£85), Extensions (£250), Gel Manicure (£35). Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:salon": {
    heroHeadline: "Your Website Doesn't Look Like\nSomewhere You'd Book a Cut.",
    heroSubheadline: "A dated site undersells great work. This is a full rebuild, modern design, mobile-first, built to actually convert visitors into bookings.",
    problemStory: "A client finds your Instagram, the colour work looks incredible, but the website linked in your bio looks a decade old. They assume the salon itself hasn't kept up either, and book with a competitor whose site matches the work.",
    painPoints: [
      "Website design doesn't reflect the quality of the actual work",
      "No mobile-first layout, most visitors are on their phone",
      "No clear place to see services, pricing, or stylist portfolios",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, professional layout that matches the quality of your work" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most visitors are" },
      { icon: "gallery", title: "Stylist Portfolios", description: "Each stylist gets their own gallery and bio" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local salon searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per appointment" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, existing work photos usually still work well." },
      { question: "How much does it cost?", answer: "£1,200–£2,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Glow & Grace Salon. Services: Cut & Style (£45), Balayage (£120), Full Colour (£85), Extensions (£250), Gel Manicure (£35). Keep responses concise (2-3 sentences max).",
  },
  "review-system:salon": {
    heroHeadline: "Your Best Work Walks Out the Door\nWithout Leaving a Review.",
    heroSubheadline: "A great colour appointment gets a compliment in the chair, not a Google review. Automatic requests after every visit turn happy clients into public proof.",
    problemStory: "A client leaves thrilled with a fresh balayage, tells you it's the best it's ever looked, and drives off. She meant to leave a review. She never did. Multiply that by every happy client this month.",
    painPoints: [
      "Happy clients rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy clients are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and look more trusted",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the appointment, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when clients are happiest, not mid-appointment" },
      { icon: "alert", title: "Private Routing", description: "Unhappy clients are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Clients tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per appointment" },
    faqs: [
      { question: "What if a client had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the appointment does the request go out?", answer: "Usually a few hours later, timed so it's not mid-visit but still fresh." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every appointment." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Glow & Grace Salon. Services: Cut & Style (£45), Balayage (£120), Full Colour (£85), Extensions (£250), Gel Manicure (£35). Keep responses concise (2-3 sentences max).",
  },
  "booking-system:trades": {
    heroHeadline: "Let Customers Book the Job\nWithout Waiting for a Callback.",
    heroSubheadline: "A missed call while you're under a sink is a job that might book with the next plumber on Google instead. Let customers pick a slot themselves.",
    problemStory: "Mrs Thompson's boiler breaks down on a Friday evening. She Googles 'emergency plumber near me' and finds three sites. Two have just a phone number. The third has a 'Book Now' button showing tonight's slots, so she books there.",
    painPoints: [
      "Missed calls while on a job, each one a potential job lost",
      "No way for customers to see availability without calling first",
      "Quote requests outside working hours go unanswered until the next morning",
      "Rescheduling a job means another phone call, both ways",
    ],
    features: [
      { icon: "calendar", title: "Live Availability", description: "Customers see real open slots and book instantly" },
      { icon: "bell", title: "Automatic Reminders", description: "Text reminders sent before every appointment" },
      { icon: "alert", title: "Emergency Slots", description: "Urgent callouts can be flagged with shorter notice windows" },
      { icon: "image", title: "Photo Uploads", description: "Customers attach photos of the problem when they book, so you arrive prepared" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two jobs never land on the same slot" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 180, label: "per job" },
    faqs: [
      { question: "Does this replace phone bookings?", answer: "No. It just gives customers the option to skip the call." },
      { question: "Can customers send photos of the problem?", answer: "Yes. Photo upload is part of the booking, so you know what you're walking into." },
      { question: "How does it handle emergencies?", answer: "Emergency slots can be flagged separately with shorter notice windows." },
      { question: "What if I need to block out a day?", answer: "You can block any day or time manually, it just stops showing as available." },
      { question: "How much does it cost?", answer: "£45 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for Smith & Son Plumbing. Services: Emergency callout (£85 fee), boiler repair (from £120), boiler installation (from £1,800), bathroom fitting. Gas Safe registered. Ask what the problem is and preferred time. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:trades": {
    heroHeadline: "Your Site Loads Slower\nThan the Van Down the Road.",
    heroSubheadline: "Most local trade sites take 8+ seconds to load on mobile, right when someone's searching in an emergency. This is a technical rebuild for speed, not a redesign.",
    problemStory: "Someone's boiler just died. They search 'emergency plumber near me' on their phone, in a hurry. Your site takes 9 seconds to load. They're already calling the next name on the list before your homepage finishes.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local trade site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Customers in an emergency won't wait for a slow page to load",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Job photos load fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 180, label: "per job" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£349, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Sub-2-second loads",
    proofDescription: "the same performance budget every production site I've shipped is held to",
    chatSystemPrompt: "You are the assistant for Smith & Son Plumbing. Services: Emergency callout (£85 fee), boiler repair (from £120), boiler installation (from £1,800), bathroom fitting. Gas Safe registered. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:trades": {
    heroHeadline: "Customers Judge Trust\nBy Your Website First.",
    heroSubheadline: "Before anyone calls a trade, they check the website. A dated site raises doubt before you've said a word. This is a full rebuild built to earn trust fast.",
    problemStory: "Someone needs a boiler installed, a big spend. They check three plumbers' websites before calling anyone. Two look outdated with no certifications shown. The third looks professional, lists Gas Safe registration clearly, and gets the call.",
    painPoints: [
      "An outdated website undercuts trust before a customer even calls",
      "Certifications and insurance aren't displayed clearly, if at all",
      "No mobile-first layout, most searches happen on a phone",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Trust Badges", description: "Certifications like Gas Safe or NICEIC displayed clearly for instant trust" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most searches happen" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local trade searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "image", title: "Job Gallery", description: "Before/after photos of completed jobs, one of the best ways trades win new customers" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 180, label: "per job" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, phone-shot job photos usually still work well." },
      { question: "How much does it cost?", answer: "£1,800–£3,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Smith & Son Plumbing. Services: Emergency callout (£85 fee), boiler repair (from £120), boiler installation (from £1,800), bathroom fitting. Gas Safe registered. Keep responses concise (2-3 sentences max).",
  },
  "review-system:trades": {
    heroHeadline: "A Great Job Deserves\nMore Than a Handshake.",
    heroSubheadline: "A job well done gets a thank-you at the door, not a Google review. Automatic requests after every job turn satisfied customers into public proof.",
    problemStory: "You fix an emergency leak at 9pm on a Sunday, the customer is hugely relieved and grateful. They mean to leave a review. Life gets busy. It never happens. Multiply that by every job this month.",
    painPoints: [
      "Grateful customers rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy customers are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and win more emergency searches",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the job, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when customers are happiest" },
      { icon: "alert", title: "Private Routing", description: "Unhappy customers are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Customers tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 180, label: "per job" },
    faqs: [
      { question: "What if a customer had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the job does the request go out?", answer: "Usually a few hours later, timed so it's fresh but not intrusive." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every job." },
      { question: "How much does it cost?", answer: "£45 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Smith & Son Plumbing. Services: Emergency callout (£85 fee), boiler repair (from £120), boiler installation (from £1,800), bathroom fitting. Gas Safe registered. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:restaurant": {
    heroHeadline: "Stop Losing Reservations\nTo a Busy Phone Line.",
    heroSubheadline: "During the dinner rush, nobody's free to answer the phone. Let guests book a table themselves, any time, from any device.",
    problemStory: "A family wants a table for Saturday night. They call at 7pm, but the line's busy, everyone's on the floor. They book elsewhere instead, somewhere with a reservation button right on the site.",
    painPoints: [
      "Phone-only reservations lose calls during the busiest hours",
      "No way for guests to see table availability without calling",
      "Large party requests get missed in the chaos of service",
      "Rebooking a changed reservation means another phone call",
    ],
    features: [
      { icon: "calendar", title: "Live Availability", description: "Guests see real open tables and book instantly" },
      { icon: "bell", title: "Automatic Reminders", description: "A reminder text goes out before the reservation" },
      { icon: "clock", title: "Party Size Filters", description: "Guests filter by party size and see exactly what's open" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two parties never land on the same table" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
      { icon: "chart", title: "Full Reservation List", description: "See every booking for the night in one place" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per table visit" },
    faqs: [
      { question: "Can it handle large parties?", answer: "Yes. Party size limits can be set, with larger groups flagged for a follow-up call." },
      { question: "What about walk-ins?", answer: "You control how many tables stay open for walk-ins versus online booking." },
      { question: "Can guests add special requests?", answer: "Yes. A notes field is included for dietary needs or occasions." },
      { question: "What if a table needs to be moved?", answer: "Reservations can be adjusted manually any time without cancelling and restarting." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for Bella Vista Kitchen, a family-run Mediterranean restaurant. Reservations available for parties up to 8, larger groups should call directly. Hours: Tuesday to Sunday, 12pm-10pm, closed Mondays. Ask party size, date, and time. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:restaurant": {
    heroHeadline: "Nobody Waits 8 Seconds\nFor a Menu to Load.",
    heroSubheadline: "Most local restaurant sites take 8+ seconds to load on mobile, right when someone's deciding where to eat tonight. This is a technical rebuild for speed, not a redesign.",
    problemStory: "A couple stands outside deciding where to eat. They pull up your menu on mobile data. It takes 8 seconds just to load the first photo. They walk to the restaurant next door instead, whose menu loaded instantly.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local restaurant site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Hungry visitors on the go won't wait for a slow menu to load",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Food photography loads fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per table visit" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£199, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Image-heavy sites, optimized",
    proofDescription: "portfolio and gallery-driven builds tuned for fast mobile load in production",
    chatSystemPrompt: "You are the assistant for Bella Vista Kitchen, a family-run Mediterranean restaurant. Hours: Tuesday to Sunday, 12pm-10pm, closed Mondays. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:restaurant": {
    heroHeadline: "Your Food Looks Incredible.\nYour Website Doesn't Match It.",
    heroSubheadline: "A PDF menu and a dated layout undersell food this good. This is a full rebuild, modern design, mobile-first, built to actually get people through the door.",
    problemStory: "Someone searches your restaurant, expecting to see the food. Instead they find a 2019 PDF menu that takes forever to open on mobile. They close the tab and pick somewhere with a proper website instead.",
    painPoints: [
      "Menu lives as a PDF, slow and awkward to read on mobile",
      "Website design doesn't reflect the quality of the food itself",
      "No mobile-first layout, most visitors are on their phone",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, professional layout that matches the quality of your food" },
      { icon: "mobile", title: "Mobile-First Menu", description: "A real digital menu, not a PDF, built to load fast on any phone" },
      { icon: "gallery", title: "Food Photography Layout", description: "A layout built to showcase dishes properly, not bury them in a PDF" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local restaurant searches from day one" },
      { icon: "calendar", title: "Reservations Built In", description: "Online booking included, not bolted on separately" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per table visit" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional food photos yet?", answer: "That gets discussed on the free call, this can be scoped into the project if needed." },
      { question: "How much does it cost?", answer: "£1,200–£2,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Bella Vista Kitchen, a family-run Mediterranean restaurant. Hours: Tuesday to Sunday, 12pm-10pm, closed Mondays. Keep responses concise (2-3 sentences max).",
  },
  "review-system:restaurant": {
    heroHeadline: "Happy Diners Leave Full.\nThey Rarely Leave a Review.",
    heroSubheadline: "A great meal gets a compliment to the waiter, not a Google review. Automatic requests after the visit turn happy diners into public proof.",
    problemStory: "A table of six has a brilliant night, incredible food, great service. They mean to leave a review on the way out. They never do. Multiply that by every good night this month.",
    painPoints: [
      "Happy diners rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy diners are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and get picked first",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the visit, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when diners are happiest" },
      { icon: "alert", title: "Private Routing", description: "Unhappy diners are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Diners tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 65, label: "per table visit" },
    faqs: [
      { question: "What if a diner had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the visit does the request go out?", answer: "Usually a few hours later, timed so it's fresh but not intrusive." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every visit." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Bella Vista Kitchen, a family-run Mediterranean restaurant. Hours: Tuesday to Sunday, 12pm-10pm, closed Mondays. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:cafe": {
    heroHeadline: "Reserve a Table Without\nCalling During the Rush.",
    heroSubheadline: "Mornings are chaos behind the counter. Let regulars and groups reserve a table online instead of calling in during the rush.",
    problemStory: "A group of six wants to reserve a table for a Saturday morning catch-up. They call at 8am, but the line's swamped with orders and nobody picks up. They head to the café down the street instead.",
    painPoints: [
      "Phone calls during the morning rush often go unanswered",
      "No way for groups to reserve a table without calling ahead",
      "Regulars have no easy way to book their usual spot",
      "Rebooking a changed reservation means another phone call",
    ],
    features: [
      { icon: "calendar", title: "Live Availability", description: "Guests see real open tables and book instantly" },
      { icon: "bell", title: "Automatic Reminders", description: "A reminder text goes out before the reservation" },
      { icon: "clock", title: "Group Size Filters", description: "Guests filter by group size and see exactly what's open" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two groups never land on the same table" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
      { icon: "chart", title: "Full Reservation List", description: "See every booking for the morning in one place" },
    ],
    roiDefaults: { missedPerWeek: 12, avgValue: 18, label: "per table visit" },
    faqs: [
      { question: "Can it handle large groups?", answer: "Yes. Group size limits can be set, with larger groups flagged for a follow-up." },
      { question: "What about walk-ins?", answer: "You control how many tables stay open for walk-ins versus online booking." },
      { question: "Can regulars book their usual table?", answer: "Yes. Once set up, a favourite spot can be rebooked in one tap." },
      { question: "What if a reservation needs to change?", answer: "It can be adjusted manually any time without cancelling and restarting." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for Corner Bean Café. Coffee from £3, pastries from £2.50, breakfast and brunch menu available 7am-4pm daily. Table reservations available for groups of 4 or more. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:cafe": {
    heroHeadline: "A Slow Menu Page\nSends Them Next Door.",
    heroSubheadline: "Most local café sites take 8+ seconds to load on mobile, right when someone's deciding where to grab coffee. This is a technical rebuild for speed, not a redesign.",
    problemStory: "Someone's standing outside deciding between two cafés. Yours takes 8 seconds to load the menu on their phone. They walk into the one next door instead, whose site loaded instantly.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local café site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Visitors deciding in the moment won't wait for a slow page to load",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Menu and interior photos load fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 12, avgValue: 18, label: "per table visit" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£199, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Image-heavy sites, optimized",
    proofDescription: "portfolio and gallery-driven builds tuned for fast mobile load in production",
    chatSystemPrompt: "You are the assistant for Corner Bean Café. Coffee from £3, pastries from £2.50, breakfast and brunch menu available 7am-4pm daily. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:cafe": {
    heroHeadline: "A Website That Feels As Good\nAs Your Coffee Does.",
    heroSubheadline: "A dated, cluttered site undersells a great café. This is a full rebuild, modern design, mobile-first, built to actually get people through the door.",
    problemStory: "Someone searches your café hoping to see the menu and vibe. Instead they find a slow, cluttered site that doesn't reflect the place at all. They pick a competitor whose website actually looks like somewhere worth visiting.",
    painPoints: [
      "Website design doesn't reflect the actual look and feel of the café",
      "No mobile-first layout, most visitors are on their phone",
      "No clear place to see the menu, hours, or photos",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, professional layout that matches the feel of the café" },
      { icon: "mobile", title: "Mobile-First Menu", description: "Built for phones first, since that's where most visitors are" },
      { icon: "gallery", title: "Photo Gallery", description: "Interior and menu photography that actually sells the place" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local café searches from day one" },
      { icon: "calendar", title: "Reservations Built In", description: "Online booking included, not bolted on separately" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 12, avgValue: 18, label: "per table visit" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, phone-shot photos of the space usually still work well." },
      { question: "How much does it cost?", answer: "£1,200–£2,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Corner Bean Café. Coffee from £3, pastries from £2.50, breakfast and brunch menu available 7am-4pm daily. Keep responses concise (2-3 sentences max).",
  },
  "review-system:cafe": {
    heroHeadline: "Regulars Love You.\nThey Just Never Say So Online.",
    heroSubheadline: "A regular's favourite order gets a smile, not a Google review. Automatic requests after a visit turn loyal customers into public proof.",
    problemStory: "A regular comes in three times a week, loves the place, tells their friends in person. They've just never left a review. Multiply that across every loyal customer, and it's a lot of trust that never made it online.",
    painPoints: [
      "Loyal customers rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy customers are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and get picked first",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the visit, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when customers are happiest" },
      { icon: "alert", title: "Private Routing", description: "Unhappy customers are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Customers tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 12, avgValue: 18, label: "per table visit" },
    faqs: [
      { question: "What if a customer had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the visit does the request go out?", answer: "Usually a few hours later, timed so it's fresh but not intrusive." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every visit." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Corner Bean Café. Coffee from £3, pastries from £2.50, breakfast and brunch menu available 7am-4pm daily. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:fitness": {
    heroHeadline: "Stop Booking Classes\nOne DM at a Time.",
    heroSubheadline: "Class spots filling through Instagram DMs is booking friction, not community. Let members book a class or session themselves, any time.",
    problemStory: "Someone wants to try Saturday's HIIT class. They message your Instagram, but you're mid-session and don't see it until that evening, after the class filled up through word of mouth. They try a competitor's app-based studio instead.",
    painPoints: [
      "Class bookings happen through DMs and get missed mid-session",
      "No way to see which classes still have space without asking",
      "Personal training slots get double-booked without a shared calendar",
      "Rebooking a missed class means another back-and-forth message",
    ],
    features: [
      { icon: "calendar", title: "Live Class Availability", description: "Members see real open spots and book instantly" },
      { icon: "bell", title: "Automatic Reminders", description: "A reminder text goes out before every class or session" },
      { icon: "clock", title: "PT Slot Booking", description: "Personal training sessions book directly against your real calendar" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two members never land on the same slot" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
      { icon: "chart", title: "Full Booking History", description: "See every class and session booking in one place" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 35, label: "per session" },
    faqs: [
      { question: "Can members book recurring classes?", answer: "Yes. A weekly spot can be booked in one go rather than each week separately." },
      { question: "What about class capacity limits?", answer: "Each class has a set capacity, and it stops taking bookings once full." },
      { question: "Can it handle both classes and 1:1 training?", answer: "Yes. Both can be booked from the same calendar." },
      { question: "What if someone needs to cancel?", answer: "They cancel from the same link, and the spot reopens automatically." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for Iron Peak Fitness. Classes: HIIT, Spin, Yoga (drop-in £12, or included in £45/month membership). Personal training £35/session. Ask which class or session they're interested in. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:fitness": {
    heroHeadline: "They Bounce Before Your Class\nSchedule Even Loads.",
    heroSubheadline: "Most local gym sites take 8+ seconds to load on mobile, right when someone's checking today's class times. This is a technical rebuild for speed, not a redesign.",
    problemStory: "Someone's deciding whether to try your 6pm class. They check the schedule on their phone on the way. It takes 8 seconds to load. They give up and go to the gym that already has an app that opens instantly.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local gym site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Visitors checking class times on the go won't wait for a slow page",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Class and facility photos load fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 35, label: "per session" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£199, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Sub-2-second loads",
    proofDescription: "the same performance budget every production site I've shipped is held to",
    chatSystemPrompt: "You are the assistant for Iron Peak Fitness. Classes: HIIT, Spin, Yoga (drop-in £12, or included in £45/month membership). Personal training £35/session. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:fitness": {
    heroHeadline: "Your Gym Looks Incredible.\nYour Website Looks Abandoned.",
    heroSubheadline: "A dated site undersells a gym people love training at. This is a full rebuild, modern design, mobile-first, built to actually convert visitors into members.",
    problemStory: "Someone finds your gym through a friend's recommendation, checks the website to see class times and pricing, and finds a site that looks untouched in years. They assume the gym itself might be the same, and try a competitor with a site that matches the energy of the place.",
    painPoints: [
      "Website design doesn't reflect the energy or quality of the gym",
      "No mobile-first layout, most visitors are on their phone",
      "No clear place to see class schedules, pricing, or trainer bios",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, energetic layout that matches the gym itself" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most visitors are" },
      { icon: "gallery", title: "Class & Facility Gallery", description: "Photos and videos that actually show what training here feels like" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local gym searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 35, label: "per session" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, phone footage from the gym floor usually still works well." },
      { question: "How much does it cost?", answer: "£1,200–£2,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Iron Peak Fitness. Classes: HIIT, Spin, Yoga (drop-in £12, or included in £45/month membership). Personal training £35/session. Keep responses concise (2-3 sentences max).",
  },
  "review-system:fitness": {
    heroHeadline: "Members Who Love Your Gym\nRarely Say So on Google.",
    heroSubheadline: "A great class gets a high-five, not a Google review. Automatic requests after a session turn loyal members into public proof.",
    problemStory: "A member crushes a personal best in class, thanks the coach on the way out, buzzing. They mean to leave a review that night. It never happens. Multiply that across every great session this month.",
    painPoints: [
      "Happy members rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy members are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and get picked first by new members",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the session, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when members are happiest" },
      { icon: "alert", title: "Private Routing", description: "Unhappy members are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Members tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 35, label: "per session" },
    faqs: [
      { question: "What if a member had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the session does the request go out?", answer: "Usually a few hours later, timed so it's fresh but not intrusive." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every session." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Iron Peak Fitness. Classes: HIIT, Spin, Yoga (drop-in £12, or included in £45/month membership). Personal training £35/session. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:moving": {
    heroHeadline: "Let Customers Lock In\nMoving Day Themselves.",
    heroSubheadline: "Quote requests that sit for two days go cold, people book whoever answers first. Let customers pick a date and lock it in the same day they inquire.",
    problemStory: "Someone's moving in three weeks and requests quotes from four movers online. Three reply within the hour with a way to book a date directly. You reply the next afternoon by email. They've already booked with someone else.",
    painPoints: [
      "Quote requests sit for a day or more before anyone follows up",
      "No way for customers to see date availability without calling",
      "Slow replies lose jobs to movers who respond and book faster",
      "Rescheduling a booked date means another phone call, both ways",
    ],
    features: [
      { icon: "calendar", title: "Live Date Availability", description: "Customers see real open dates and book instantly" },
      { icon: "bell", title: "Automatic Reminders", description: "A reminder goes out as moving day approaches" },
      { icon: "route", title: "Estimate Calculator", description: "Customers get a rough cost estimate based on move size before booking" },
      { icon: "lock", title: "No Double-Booked Dates", description: "One calendar, so a date is never accidentally promised to two customers" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
      { icon: "chart", title: "Full Booking History", description: "See every booked move in one place" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 550, label: "per move" },
    faqs: [
      { question: "Can customers get an estimate before booking?", answer: "Yes. A rough estimate based on move size and distance is shown before they commit." },
      { question: "What if the move size changes later?", answer: "The estimate is adjusted on the in-home or video survey, this is just to get the date locked in." },
      { question: "How does it handle long-distance moves?", answer: "Long-distance requests can be flagged for a callback rather than instant booking, if that suits your process better." },
      { question: "What if a date needs to move?", answer: "Customers can request a reschedule from the same link, no phone call needed." },
      { question: "How much does it cost?", answer: "£45 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for SwiftMove. Local moves from £250, long-distance from £800, free in-home or video estimate available. Ask about move size, origin, destination, and preferred date. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:moving": {
    heroHeadline: "A Slow Quote Page\nLoses the Job Before It Starts.",
    heroSubheadline: "Most local moving company sites take 8+ seconds to load on mobile, right when someone's comparing quotes. This is a technical rebuild for speed, not a redesign.",
    problemStory: "Someone's comparing five moving companies on their phone, tab after tab. Yours takes 9 seconds to load the quote form. They've already filled out a competitor's form before yours finishes loading.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local moving company site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Customers comparing multiple movers won't wait for a slow page to load",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Truck and crew photos load fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 550, label: "per move" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£349, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Sub-2-second loads",
    proofDescription: "the same performance budget every production site I've shipped is held to",
    chatSystemPrompt: "You are the assistant for SwiftMove. Local moves from £250, long-distance from £800, free in-home or video estimate available. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:moving": {
    heroHeadline: "A Website That Builds Trust\nBefore the Truck Even Shows Up.",
    heroSubheadline: "Handing over your belongings to strangers is a trust decision, made on the website first. This is a full rebuild built to earn that trust fast.",
    problemStory: "Someone's choosing between movers for a big cross-town move. Two sites look outdated with no insurance info visible. The third looks professional, shows credentials clearly, and gets the booking.",
    painPoints: [
      "An outdated website raises doubt before a customer even calls",
      "Insurance and credentials aren't displayed clearly, if at all",
      "No mobile-first layout, most quote requests start on a phone",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Trust Badges", description: "Insurance and credentials displayed clearly for instant trust" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most quote requests start" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local moving company searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "route", title: "Estimate Calculator", description: "A built-in tool that gives customers a rough cost before they call" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 550, label: "per move" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, photos of the crew and trucks in action usually still work well." },
      { question: "How much does it cost?", answer: "£1,800–£3,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for SwiftMove. Local moves from £250, long-distance from £800, free in-home or video estimate available. Keep responses concise (2-3 sentences max).",
  },
  "review-system:moving": {
    heroHeadline: "A Smooth Move Deserves\nMore Than a Thank You Text.",
    heroSubheadline: "A stress-free move gets a text of relief, not a Google review. Automatic requests after the job turn satisfied customers into public proof.",
    problemStory: "A move goes perfectly, nothing broken, right on time. The customer texts their thanks and moves on with unpacking. They meant to leave a review. It never happens. Multiply that by every smooth move this month.",
    painPoints: [
      "Relieved customers rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy customers are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and win more quote requests",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the move, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land once the dust settles, not mid-move" },
      { icon: "alert", title: "Private Routing", description: "Unhappy customers are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Customers tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 550, label: "per move" },
    faqs: [
      { question: "What if a customer had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the move does the request go out?", answer: "Usually a day or two later, once everything's unpacked and settled." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every move." },
      { question: "How much does it cost?", answer: "£45 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for SwiftMove. Local moves from £250, long-distance from £800, free in-home or video estimate available. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:automotive": {
    heroHeadline: "Stop Losing Bookings\nTo 'We'll Call You Back.'",
    heroSubheadline: "A customer who has to wait for a callback often books with the garage that let them pick a slot instantly instead. Let them book online.",
    problemStory: "Someone's car needs an MOT before the deadline. They call your garage, get told someone will call back to confirm a slot. By the time anyone does, they've already booked with the garage that had online booking.",
    painPoints: [
      "Phone-only booking loses customers who want to book right away",
      "Callback promises lose customers to garages with instant booking",
      "No way to see which bays are free without calling",
      "Rescheduling a booked slot means another phone call, both ways",
    ],
    features: [
      { icon: "calendar", title: "Live Availability", description: "Customers see real open bays and book instantly" },
      { icon: "bell", title: "Automatic Reminders", description: "A reminder text goes out before the appointment" },
      { icon: "route", title: "Service Type Selector", description: "Customers pick MOT, service, or repair and see the right slot length" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two cars never land on the same bay" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
      { icon: "chart", title: "Full Booking History", description: "See every booking in one place" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 120, label: "per service" },
    faqs: [
      { question: "Can customers book different service types?", answer: "Yes. MOT, full service, and diagnostic checks can each have their own duration." },
      { question: "What if the job takes longer than expected?", answer: "Bays can be manually adjusted, this just handles the initial booking." },
      { question: "Does it handle drop-off and collection times separately?", answer: "Yes. Both can be captured as part of the booking." },
      { question: "What if a customer needs to cancel?", answer: "They cancel or reschedule from the same link, no phone call needed." },
      { question: "How much does it cost?", answer: "£45 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for Apex Auto. Services: MOT (£45), full service (from £120), diagnostic check (£40), tyre fitting (from £20 each). Ask what service and preferred drop-off time. Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:automotive": {
    heroHeadline: "They Won't Wait 8 Seconds\nFor Your Booking Page to Load.",
    heroSubheadline: "Most local garage sites take 8+ seconds to load on mobile, right when someone's trying to book an MOT before a deadline. This is a technical rebuild for speed, not a redesign.",
    problemStory: "Someone's MOT is due tomorrow. They search 'MOT near me' on their phone, in a hurry. Your site takes 9 seconds to load. They've already booked with the garage listed below you before yours finishes.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local garage site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Customers booking against a deadline won't wait for a slow page",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Workshop and vehicle photos load fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 120, label: "per service" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£349, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Sub-2-second loads",
    proofDescription: "the same performance budget every production site I've shipped is held to",
    chatSystemPrompt: "You are the assistant for Apex Auto. Services: MOT (£45), full service (from £120), diagnostic check (£40), tyre fitting (from £20 each). Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:automotive": {
    heroHeadline: "Your Garage Is Trusted Locally.\nYour Website Doesn't Show It.",
    heroSubheadline: "Handing over your car is a trust decision, made on the website first. This is a full rebuild built to earn that trust fast.",
    problemStory: "Someone's choosing a garage for a repair they don't fully understand. Two sites look outdated with no certifications visible. The third looks professional, lists qualifications clearly, and gets the booking.",
    painPoints: [
      "An outdated website undercuts trust before a customer even calls",
      "Certifications and guarantees aren't displayed clearly, if at all",
      "No mobile-first layout, most searches happen on a phone",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Trust Badges", description: "Certifications and guarantees displayed clearly for instant trust" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most searches happen" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local garage searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "image", title: "Work Gallery", description: "Before/after photos of completed jobs build confidence fast" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 120, label: "per service" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, workshop photos usually still work well." },
      { question: "How much does it cost?", answer: "£1,800–£3,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Apex Auto. Services: MOT (£45), full service (from £120), diagnostic check (£40), tyre fitting (from £20 each). Keep responses concise (2-3 sentences max).",
  },
  "review-system:automotive": {
    heroHeadline: "Customers Trust You With Their Car.\nThey Just Don't Tell Google.",
    heroSubheadline: "A job done right gets a nod on the way out, not a Google review. Automatic requests after every service turn satisfied customers into public proof.",
    problemStory: "A tricky repair gets fixed right, on budget, on time. The customer's relieved and grateful picking up the keys. They meant to leave a review. It never happens. Multiply that by every good job this month.",
    painPoints: [
      "Satisfied customers rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy customers are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and win more local searches",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the service, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when customers are happiest" },
      { icon: "alert", title: "Private Routing", description: "Unhappy customers are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Customers tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 120, label: "per service" },
    faqs: [
      { question: "What if a customer had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the service does the request go out?", answer: "Usually a few hours later, timed so it's fresh but not intrusive." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every service." },
      { question: "How much does it cost?", answer: "£45 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Apex Auto. Services: MOT (£45), full service (from £120), diagnostic check (£40), tyre fitting (from £20 each). Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:medico": {
    heroHeadline: "A Website That Doesn't Match\nThe Practice You've Built.",
    heroSubheadline: "Patients judge trust by your website before they ever call. A dated site undercuts a practice this good. This is a full rebuild built to earn that trust fast.",
    problemStory: "A new patient is choosing between two dental practices nearby. Both have good reviews. One website looks professional and modern, the other looks like it hasn't changed since 2012. They book with the one that looks like they'd trust their teeth to it.",
    painPoints: [
      "An outdated website undercuts trust before a patient even calls",
      "No mobile-first layout, most searches happen on a phone",
      "No clear place to see treatments, pricing, or dentist bios",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, professional layout that matches the practice you've built" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most searches happen" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for 'dentist near me' searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "chart", title: "Treatment & Pricing Pages", description: "Clear, easy-to-find information on services and cost" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 85, label: "per appointment" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, this can be scoped into the project if needed." },
      { question: "How much does it cost?", answer: "£1,800–£3,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Bright Smile Dental, a private dental practice. Prices: check-up & clean £45, new patient exam £65, filling from £85, emergency appointment £85. Hours: Mon-Fri 8am-6pm, Sat 9am-2pm. Keep responses concise (2-3 sentences max).",
  },
  "review-system:medico": {
    heroHeadline: "Every Happy Patient Who Doesn't\nLeave a Review Is a Missed One.",
    heroSubheadline: "A great check-up gets a 'see you next time,' not a Google review. Automatic requests after every appointment turn happy patients into public proof.",
    problemStory: "A patient leaves genuinely pleased with a painless filling and a friendly front desk. They meant to leave a review. Life happens, it never gets written. Multiply that by every happy patient this month.",
    painPoints: [
      "Happy patients rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy patients are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and get picked first by new patients",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the appointment, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when patients are happiest" },
      { icon: "alert", title: "Private Routing", description: "Unhappy patients are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Patients tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 10, avgValue: 85, label: "per appointment" },
    faqs: [
      { question: "What if a patient had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the appointment does the request go out?", answer: "Usually a few hours later, timed so it's fresh but not intrusive." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every appointment." },
      { question: "How much does it cost?", answer: "£39 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Bright Smile Dental, a private dental practice. Prices: check-up & clean £45, new patient exam £65, filling from £85, emergency appointment £85. Hours: Mon-Fri 8am-6pm, Sat 9am-2pm. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:tattoo": {
    heroHeadline: "Your Art Deserves a Site\nThat Doesn't Look Like 2014.",
    heroSubheadline: "Your Instagram is strong, but a clunky website undersells the work. This is a full rebuild, modern design, mobile-first, built to actually convert visitors into bookings.",
    problemStory: "Someone finds your Instagram, the work is incredible, then clicks through to a website that looks a decade old with a broken contact form. They assume the studio itself might be just as behind, and book a consultation with a studio whose site matches the quality of the art.",
    painPoints: [
      "Website design doesn't reflect the quality of the actual tattoo work",
      "No mobile-first layout, most visitors are on their phone",
      "No clear place to see pricing, styles, or artist portfolios",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, professional layout that matches the quality of your work" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most visitors are" },
      { icon: "gallery", title: "Artist Portfolios", description: "Each artist gets their own filterable gallery and bio" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for 'tattoo studio near me' searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online consultation booking included, not bolted on separately" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 200, label: "per custom piece" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional photos yet?", answer: "That gets discussed on the free call, existing portfolio shots usually still work well." },
      { question: "How much does it cost?", answer: "£1,200–£2,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Valley Ink Studio. Styles: traditional, fine line, realism, Japanese, blackwork. Estimates: small from £80, medium from £200, half-sleeve from £500+. Consultation deposit £50. Artists: Jake, Maya, Chris. Keep responses concise (2-3 sentences max).",
  },
  "review-system:tattoo": {
    heroHeadline: "Every Piece You Finish\nIs a Review You Never Asked For.",
    heroSubheadline: "A client loves their new piece, posts it on their own story, and forgets to leave a Google review. Automatic requests after every session turn happy clients into public proof.",
    problemStory: "A client leaves thrilled with a finished half-sleeve, posts it to their own Instagram immediately. They never think to leave a Google review. Multiply that by every finished piece this month.",
    painPoints: [
      "Happy clients post the work themselves but rarely leave a Google review",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy clients are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher for 'tattoo studio near me'",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the session, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when clients are happiest" },
      { icon: "alert", title: "Private Routing", description: "Unhappy clients are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Clients tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 200, label: "per custom piece" },
    faqs: [
      { question: "What if a client had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the session does the request go out?", answer: "Usually a few hours later, timed so it's fresh but not intrusive." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every session." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Valley Ink Studio. Styles: traditional, fine line, realism, Japanese, blackwork. Estimates: small from £80, medium from £200, half-sleeve from £500+. Consultation deposit £50. Artists: Jake, Maya, Chris. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:photography": {
    heroHeadline: "Your Portfolio Deserves\nMore Than a Template Site.",
    heroSubheadline: "A generic template undersells work this good. This is a full rebuild, modern design, mobile-first, built to actually convert visitors into bookings.",
    problemStory: "A couple is choosing a wedding photographer, comparing portfolios side by side. Yours is stunning, but the site is a slow, generic template with tiny thumbnails. A competitor's site shows the same quality of work in a fast, full-screen gallery, and gets the inquiry.",
    painPoints: [
      "Generic template sites undersell the quality of the actual photography",
      "No mobile-first layout, most visitors are on their phone",
      "No clear place to see packages, pricing, or availability",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, professional layout that matches the quality of your work" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most visitors are" },
      { icon: "gallery", title: "Full-Screen Galleries", description: "Photos shown the way they're meant to be seen, not tiny thumbnails" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local photographer searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 3, avgValue: 450, label: "per booking" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "Can it showcase multiple shoot types?", answer: "Yes. Weddings, portraits, and events can each get their own gallery section." },
      { question: "How much does it cost?", answer: "£1,200–£2,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Frame & Light Studio. Packages: Portrait session £150, Family session £220, Event coverage from £350, Wedding package from £1,200 (20% deposit). Photographer: Alex. Keep responses concise (2-3 sentences max).",
  },
  "review-system:photography": {
    heroHeadline: "Couples Love Their Photos.\nThey Forget to Say So Publicly.",
    heroSubheadline: "A couple cries happy tears looking through their wedding gallery, then forgets to leave a Google review. Automatic requests after delivery turn happy clients into public proof.",
    problemStory: "A couple receives their wedding gallery, absolutely thrilled, sharing photos with family immediately. They mean to leave a review. It quietly never happens. Multiply that by every delivered gallery this year.",
    painPoints: [
      "Happy clients share photos privately but rarely leave a public review",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy clients are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and get picked first by couples comparing photographers",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after gallery delivery, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land when clients are happiest" },
      { icon: "alert", title: "Private Routing", description: "Unhappy clients are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Clients tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 3, avgValue: 450, label: "per booking" },
    faqs: [
      { question: "What if a client had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after delivery does the request go out?", answer: "Usually a few days later, once they've had time to actually look through the gallery." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every delivered gallery." },
      { question: "How much does it cost?", answer: "£29 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Frame & Light Studio. Packages: Portrait session £150, Family session £220, Event coverage from £350, Wedding package from £1,200 (20% deposit). Photographer: Alex. Keep responses concise (2-3 sentences max).",
  },
  "ai-chatbot:med-spa": {
    heroHeadline: "A £400 Filler Client\nJust Messaged a Competitor Instead.",
    heroSubheadline: "Aesthetic clients research treatments at night and expect an instant answer on pricing and availability. No AI chat means every after-hours inquiry goes to whoever answers first, and it's rarely you.",
    problemStory: "Jess is scrolling Instagram at 9pm, deciding between three clinics for her first Botox appointment. Yours has the best reviews. But the website just has a phone number and a contact form. She messages a competitor's Instagram instead, who has an assistant that answers instantly with pricing and books her in for Saturday. You never even knew she looked.",
    painPoints: [
      "After-hours inquiries about pricing and suitability go unanswered until morning",
      "Staff spend hours a week answering the same 'how much is X' questions by phone",
      "No-shows on high-value consultations cost hundreds in lost chair time",
      "New clients can't tell which treatment fits their goals without a consultation call",
    ],
    features: [
      { icon: "chat", title: "AI Treatment Advisor", description: "Answers pricing and suitability questions for Botox, fillers, laser, and facials instantly" },
      { icon: "calendar", title: "24/7 Consultation Booking", description: "Clients book a consultation or treatment slot anytime, no phone tag" },
      { icon: "gallery", title: "Before/After Gallery", description: "Chat can surface real results matched to the treatment being asked about" },
      { icon: "coin", title: "Deposit Collection", description: "Automatic deposit on high-value bookings to cut no-shows" },
      { icon: "mobile", title: "Mobile-First", description: "Built for the way aesthetic clients actually research, on their phone, at night" },
      { icon: "sparkle", title: "Treatment Matching", description: "Asks a few questions and recommends the right treatment instead of a generic price list" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 300, label: "per consultation" },
    faqs: [
      { question: "Can it handle pricing for different treatments?", answer: "Yes. It's given your actual price ranges for each treatment and answers accordingly, not a vague 'contact us for pricing.'" },
      { question: "Can it book consultations separately from treatments?", answer: "Yes, a free or paid consultation slot can be booked separately from an actual treatment slot." },
      { question: "Can it show before/after photos?", answer: "Yes, matched to whatever treatment the client is asking about." },
      { question: "Does it handle sensitive medical questions well?", answer: "It's instructed to keep suitability questions general and always point to an in-person consultation for anything requiring clinical judgment." },
      { question: "How much does it cost?", answer: "£249 one-time to build and set up your clinic's AI receptionist, then £79 a month to keep it running. No long-term contract, cancel anytime." },
    ],
    proofStat: "AI chat system",
    proofDescription: "built and shipped handling full conversations with knowledge base integration",
    chatSystemPrompt: "You are the assistant for Radiance Aesthetics. Treatments: Botox from £180, Dermal Fillers from £220, Laser Hair Removal from £45/session, Chemical Peel from £75, Microneedling from £120, Consultation free. Practitioners: Dr. Sarah Lin (injectables), Mia Torres (skin treatments). Hours: Tue-Sat 9am-6pm, closed Sun-Mon. Keep responses concise (2-3 sentences max).",
  },
  "booking-system:med-spa": {
    heroHeadline: "Stop Losing Consultations\nTo Phone Tag.",
    heroSubheadline: "Every high-value booking lost to a missed call is a client who found a clinic with instant online booking instead. Let clients pick a treatment and time themselves.",
    problemStory: "A client wants a filler consultation before a wedding in three weeks. She calls at 2pm, mid-treatment, and it goes to voicemail. She books online with the clinic down the road instead, done in under a minute.",
    painPoints: [
      "Booking over the phone eats into treatment room time",
      "Evening and weekend calls often go to voicemail",
      "No-shows on high-value slots go untracked, with no automatic reminder",
      "Rebooking maintenance appointments (Botox top-ups, laser sessions) means another call every time",
    ],
    features: [
      { icon: "calendar", title: "Live Availability", description: "Clients see real open slots per practitioner and book instantly" },
      { icon: "bell", title: "Automatic Reminders", description: "Text reminders sent before every appointment, cutting no-shows" },
      { icon: "clock", title: "Per-Practitioner Calendars", description: "Each practitioner has their own availability, no manual juggling" },
      { icon: "coin", title: "Deposit Option", description: "Deposit collection on high-value treatments to protect the slot" },
      { icon: "lock", title: "No Double-Booking", description: "One calendar, synced everywhere, so two clients never land on the same slot" },
      { icon: "mobile", title: "Books From Any Phone", description: "No app download, just a link that works on any device" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 300, label: "per consultation" },
    faqs: [
      { question: "Can clients choose their practitioner?", answer: "Yes. Each practitioner has their own profile and availability." },
      { question: "What about deposits for high-value treatments?", answer: "A deposit can be required for treatments like filler or laser packages, to protect the slot." },
      { question: "What if a client needs to reschedule?", answer: "They can move their own appointment from the same link, no phone call needed." },
      { question: "Does it handle recurring maintenance appointments?", answer: "Yes, clients can rebook Botox top-ups or laser sessions from the same system." },
      { question: "How much does it cost?", answer: "£45 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Zero-conflict scheduling logic",
    proofDescription: "the same double-booking prevention built into production calendar systems",
    chatSystemPrompt: "You are the booking assistant for Radiance Aesthetics. Treatments: Botox from £180, Dermal Fillers from £220, Laser Hair Removal from £45/session, Chemical Peel from £75, Microneedling from £120, Consultation free. Practitioners: Dr. Sarah Lin (injectables), Mia Torres (skin treatments). Keep responses concise (2-3 sentences max).",
  },
  "speed-optimization:med-spa": {
    heroHeadline: "A Slow Site Loses Consultations\nBefore It Even Loads.",
    heroSubheadline: "Most local med spa websites take 8+ seconds to load on mobile. Most clients leave before it finishes. This is a technical rebuild for speed, not a redesign.",
    problemStory: "Someone searches 'Botox near me' on their phone. Your before/after gallery takes 8 seconds to load. They're gone before the first photo appears, back to scrolling Instagram instead.",
    painPoints: [
      "Mobile load time over 8 seconds on the average local clinic site",
      "Google ranks faster sites higher, so slow sites lose search visibility too",
      "Visitors on mobile data give up before the gallery loads",
      "Every extra second of load time measurably increases the chance they leave",
    ],
    features: [
      { icon: "route", title: "Full Speed Audit", description: "Every image, script, and render-blocking resource on the current site gets measured" },
      { icon: "mobile", title: "Mobile-First Rebuild", description: "The technical layer gets rebuilt to load fast on a phone first" },
      { icon: "search", title: "Core Web Vitals Fixed", description: "The same metrics Google uses to rank sites, brought into the passing range" },
      { icon: "image", title: "Image Compression", description: "Before/after and treatment photos load fast without a visible quality drop" },
      { icon: "chart", title: "Before/After Report", description: "A real load-time comparison, so the improvement isn't just a claim" },
      { icon: "lock", title: "No Redesign Required", description: "A technical fix, your current site's look stays the same unless you want it changed" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 300, label: "per consultation" },
    faqs: [
      { question: "Does this change how my site looks?", answer: "No. This is purely a technical fix underneath, the design stays exactly as it is unless you want it changed too." },
      { question: "How is the improvement measured?", answer: "Google PageSpeed and Core Web Vitals scores are pulled before and after, and sent over so you can see the real numbers." },
      { question: "How long does it take?", answer: "Typically a few days once access to the site is provided." },
      { question: "What if my site is built on Wix, Squarespace, or similar?", answer: "Some platforms limit how much can be fixed directly. That gets assessed honestly on the free call before anything is agreed." },
      { question: "How much does it cost?", answer: "£349, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Image-heavy sites, optimized",
    proofDescription: "portfolio and gallery-driven builds tuned for fast mobile load in production",
    chatSystemPrompt: "You are the assistant for Radiance Aesthetics. Treatments: Botox from £180, Dermal Fillers from £220, Laser Hair Removal from £45/session, Chemical Peel from £75, Microneedling from £120, Consultation free. Keep responses concise (2-3 sentences max).",
  },
  "website-rebuild:med-spa": {
    heroHeadline: "Your Website Doesn't Look Like\nSomewhere You'd Get Filler.",
    heroSubheadline: "A dated site undersells real results. This is a full rebuild, modern design, mobile-first, built to actually convert visitors into consultations.",
    problemStory: "A client finds your Instagram, the results look incredible, but the website linked in your bio looks a decade old. She assumes the clinic itself hasn't kept up either, and books with a competitor whose site matches the work.",
    painPoints: [
      "Website design doesn't reflect the quality of actual results",
      "No mobile-first layout, most visitors are on their phone",
      "No clear place to see treatments, pricing, or practitioner credentials",
      "Doesn't rank well against competitors with modern, SEO-built sites",
    ],
    features: [
      { icon: "badge", title: "Modern Design", description: "A clean, professional layout that matches the quality of your results" },
      { icon: "mobile", title: "Mobile-First Build", description: "Built for phones first, since that's where most visitors are" },
      { icon: "gallery", title: "Before/After Gallery", description: "A real results gallery, organized by treatment" },
      { icon: "search", title: "SEO Structure", description: "Built to rank for local aesthetics searches from day one" },
      { icon: "calendar", title: "Booking Built In", description: "Online booking included, not bolted on separately" },
      { icon: "star", title: "Review Display", description: "Your best Google reviews shown right on the homepage" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 300, label: "per consultation" },
    faqs: [
      { question: "How is this different from just fixing my current site?", answer: "This is a full rebuild from the ground up, not patches on the old one, so the design, speed, and structure are all handled together." },
      { question: "Can I keep my current domain and branding?", answer: "Yes. Your domain, logo, and colours carry over, only the site itself is rebuilt." },
      { question: "How long does it take?", answer: "Typically 14 days from when content and photos are provided." },
      { question: "What if I don't have professional before/after photos yet?", answer: "That gets discussed on the free call, existing result photos usually still work well." },
      { question: "How much does it cost?", answer: "£1,800–£3,500, one-time, scoped to your business on a free call." },
    ],
    proofStat: "Conversion-focused builds",
    proofDescription: "the same fast, mobile-first foundation used across every production site shipped",
    chatSystemPrompt: "You are the assistant for Radiance Aesthetics. Treatments: Botox from £180, Dermal Fillers from £220, Laser Hair Removal from £45/session, Chemical Peel from £75, Microneedling from £120, Consultation free. Keep responses concise (2-3 sentences max).",
  },
  "review-system:med-spa": {
    heroHeadline: "Your Best Results Walk Out the Door\nWithout Leaving a Review.",
    heroSubheadline: "A great result gets a compliment in the chair, not a Google review. Automatic requests after every visit turn happy clients into public proof.",
    problemStory: "A client leaves thrilled with her filler results, tells you it's exactly what she wanted, and drives off. She meant to leave a review. She never did. Multiply that by every happy client this month.",
    painPoints: [
      "Happy clients rarely leave a review without being asked at the right moment",
      "No consistent system for asking, so it depends on remembering",
      "Unhappy clients are more likely to leave unprompted reviews than happy ones",
      "Competitors with more reviews rank higher and look more trusted",
    ],
    features: [
      { icon: "bell", title: "Automatic Requests", description: "A review request goes out right after the appointment, while it's fresh" },
      { icon: "chat", title: "Smart Timing", description: "Requests are timed to land once results have settled, not mid-appointment" },
      { icon: "alert", title: "Private Routing", description: "Unhappy clients are routed to you privately first, not straight to Google" },
      { icon: "star", title: "Review Display", description: "Your best reviews get pulled onto your website automatically" },
      { icon: "chart", title: "Simple Reporting", description: "See exactly how many requests went out and how many converted" },
      { icon: "mobile", title: "One-Tap Reviews", description: "Clients tap a link and leave a review in under a minute" },
    ],
    roiDefaults: { missedPerWeek: 5, avgValue: 300, label: "per consultation" },
    faqs: [
      { question: "What if a client had a bad experience?", answer: "They're routed to a private form first, so you hear about it before it becomes a public review." },
      { question: "How soon after the appointment does the request go out?", answer: "Timed to land once results have settled, usually a week or two out for injectables." },
      { question: "Can I control which platform reviews go to?", answer: "Yes. Google is the default, but it can point wherever matters most to your business." },
      { question: "Do I need to do anything manually?", answer: "No. Once it's set up it runs automatically after every appointment." },
      { question: "How much does it cost?", answer: "£39 a month, no setup fee. No long-term contract, cancel anytime." },
    ],
    proofStat: "Automated notification pipelines",
    proofDescription: "the same reliable trigger and follow-up logic used in production automation",
    chatSystemPrompt: "You are the assistant for Radiance Aesthetics. Treatments: Botox from £180, Dermal Fillers from £220, Laser Hair Removal from £45/session, Chemical Peel from £75, Microneedling from £120, Consultation free. Keep responses concise (2-3 sentences max).",
  },
};

export function getContentKey(s: string, i: string) { return `${s}:${i}`; }

export function getContent(s: string, i: string): SolutionIndustryContent | null {
  return solutionContent[getContentKey(s, i)] ?? null;
}

export function getFallbackContent(solutionSlug: string, industrySlug: string): SolutionIndustryContent {
  const industry = industries.find((i) => i.slug === industrySlug);
  const solution = solutions.find((s) => s.slug === solutionSlug);
  const name = industry?.label ?? industrySlug;
  const noun = industry?.businessNoun ?? "business";
  const priced = getPricing(solutionSlug, industrySlug);
  const costAnswer =
    priced.kind === "hybrid" ? `£${priced.setup} one-time to build and set up, then £${priced.monthly} a month. No long-term contract, cancel anytime.`
    : priced.kind === "monthly-flat" ? `£${priced.monthly} a month, no setup fee. No long-term contract, cancel anytime.`
    : `${priced.oneTimeLow === priced.oneTimeHigh ? `£${priced.oneTimeLow?.toLocaleString()}` : `£${priced.oneTimeLow?.toLocaleString()}–£${priced.oneTimeHigh?.toLocaleString()}`}, one-time, scoped to your business on a free call.`;
  return {
    heroHeadline: `Your ${name} Business Deserves\nBetter Technology.`,
    heroSubheadline: `Outdated websites lose customers to competitors. This builds ${solution?.title.toLowerCase() ?? "a solution"} specifically for ${name.toLowerCase()} businesses.`,
    problemStory: `Every day, potential customers search for ${name.toLowerCase()} services near them. They find your ${noun}, but an outdated website sends them to a competitor instead.`,
    painPoints: [
      "No online booking, so customers leave when they can't book instantly",
      "Website looks outdated compared to competitors",
      "No way to capture leads outside business hours",
      "Missing out on 'near me' Google searches",
    ],
    features: [
      { icon: "chat", title: "AI Assistant", description: `Answers ${name.toLowerCase()} customer questions around the clock` },
      { icon: "calendar", title: "Online Booking", description: "Customers book anytime, no phone calls needed" },
      { icon: "mobile", title: "Mobile-First", description: "A fast, clean experience on every device" },
      { icon: "search", title: "SEO Optimized", description: `Built to rank for '${name.toLowerCase()} near me' searches` },
      { icon: "chart", title: "Analytics", description: "Track every booking, inquiry, and customer interaction" },
      { icon: "star", title: "Reviews", description: "Automatic collection of 5-star reviews from happy customers" },
    ],
    roiDefaults: { missedPerWeek: 8, avgValue: 75, label: "per customer" },
    faqs: [
      { question: "How much does it cost?", answer: costAnswer },
      { question: "How long does setup take?", answer: "Most businesses are live within 14 days, with everything handled for you." },
      { question: "Do I need to be tech-savvy?", answer: "No. If you can use a smartphone, you can use this." },
      { question: "What if I already have a website?", answer: "An existing site can be enhanced, or rebuilt if that makes more sense." },
      { question: "Is there a contract?", answer: "No long-term contract. Month to month, cancel anytime." },
    ],
    proofStat: "Production systems",
    proofDescription: "shipped across e-commerce, automation, and real-time applications",
    chatSystemPrompt: `You are a friendly AI assistant for a ${name.toLowerCase()} ${noun}. Help with booking and service questions. Keep responses concise (2-3 sentences max).`,
  };
}