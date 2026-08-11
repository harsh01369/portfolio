import type { IconName } from "@/components/solutions/icon";

export type IndustrySlug =
  | "medico" | "pet-care" | "tattoo" | "salon" | "trades"
  | "restaurant" | "cafe" | "fitness" | "photography" | "moving" | "automotive";

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

export const pricing: Record<SolutionSlug, PricingModel> = {
  "ai-chatbot": { kind: "hybrid", setup: { A: 199, B: 129 }, monthly: { A: 59, B: 39 } },
  "booking-system": { kind: "monthly-flat", monthly: { A: 39, B: 25 }, trustLine: "No commission, ever, unlike most booking platforms" },
  "review-system": { kind: "monthly-flat", monthly: { A: 25, B: 15 } },
  "speed-optimization": { kind: "one-time", oneTime: { A: [349, 349], B: [199, 199] } },
  "website-rebuild": { kind: "one-time", oneTime: { A: [1800, 3500], B: [1200, 2500] } },
};

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
      { question: "How much does it cost?", answer: "£199 one-time to build and set up your practice's AI receptionist, then £59 a month to keep it running. No long-term contract, cancel anytime." },
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
      { question: "What does it cost?", answer: "£199 one-time setup, then £59 a month. It typically pays for itself with one extra job, and there's no long-term contract." },
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