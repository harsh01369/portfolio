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
}

export const projects: Project[] = [
  {
    slug: "bhairav-aaradhyaa",
    title: "Bhairav Aaradhyaa",
    tagline:
      "Full-stack spiritual tech platform with dual payments and Puppeteer SEO",
    description:
      "A spiritual tech platform serving users in India and internationally. React 19 frontend with 65 Bhairava forms, 45 stotras, 35 stories, 23 articles, japa counter with streak gamification, and a life purpose questionnaire algorithm. Express 5 backend with PostgreSQL, dual payment processing (Stripe + Instamojo), and a Puppeteer pipeline pre-rendering 192 pages for SEO.",
    longDescription: `Bhairav Aaradhyaa is a spiritual tech platform I built from scratch to make Bhairava worship accessible to practitioners across India and the world. The frontend acts as the single source of truth for all spiritual content: 65 Bhairava divine forms with mantras, iconography, and philosophical significance, 45 Sanskrit stotras with transliterations and translations, 35 shastra stories, 23 articles, and 19 tattva deep-dives on spiritual philosophy.

The core challenge was handling two completely different payment ecosystems within a unified checkout. Indian users pay in INR through Instamojo, and international users pay in GBP through Stripe. The backend uses MaxMind GeoIP detection to route users to the correct payment gateway automatically. Both gateways verify payments through webhook signatures: HMAC-SHA256 for Stripe and SHA1 MAC for Instamojo.

The japa (mantra counting) feature works offline-first. Users can track mantras without internet, and the counter syncs sessions to the backend when connectivity returns. It includes streak gamification, achievement badges, and session statistics like average bead speed.

The life purpose questionnaire runs a 6-step scoring algorithm across 3 dimensions and recommends a personalised Bhairava form with a confidence score. Users who pay get access to a full sadhana tracker for 11, 40, or 90-day practice journeys with daily completion logging.

SEO was the hardest problem. Since the frontend is a single-page React app, search engines could not index any content. I built a Puppeteer-based pre-rendering pipeline that launches headless Chrome, navigates to each of the 192 routes, waits for React to render fully, and saves the resulting HTML as static files. Google indexing went from 0 pages to full coverage.

The backend runs Express 5 with TypeScript strict mode, Prisma ORM on Neon.tech serverless PostgreSQL, Firebase Admin SDK for authentication, and Brevo for transactional emails with custom HTML templates.`,
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
    ],
    features: [
      "65 Bhairava forms with mantras, iconography, and philosophy",
      "45 Sanskrit stotras with transliterations and translations",
      "Dual payment processing with geo-based routing (Stripe + Instamojo)",
      "Puppeteer pre-rendering pipeline for 192 pages",
      "Offline-first japa counter with streak gamification",
      "Life purpose questionnaire algorithm with confidence scoring",
      "Sadhana tracker for 11/40/90-day practice journeys",
      "Firebase Auth with Google OAuth support",
      "GDPR-compliant data export and account deletion",
    ],
    image: "/images/projects/bhairav-aaradhyaa/thumbnail.png",
    images: [
      { src: "/images/projects/bhairav-aaradhyaa/hero.png", alt: "Bhairav Aaradhyaa — platform overview with key metrics" },
      { src: "/images/projects/bhairav-aaradhyaa/architecture.png", alt: "System architecture: frontend, backend, payments, and services" },
    ],
    live: "https://bhairavaaradhyaa.com",
    github: "https://github.com/harsh01369/bhairav-aaradhya-showcase",
    featured: true,
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
      { src: "/images/projects/contentforge/hero.png", alt: "ContentForge — content automation engine overview" },
      { src: "/images/projects/contentforge/architecture.png", alt: "Content pipeline: data source → extractors → render → schedule → publish" },
    ],
    github: "https://github.com/harsh01369/contentforge-showcase",
    featured: true,
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
      { src: "/images/projects/uwear/hero.png", alt: "UWEAR UK — e-commerce ecosystem overview" },
      { src: "/images/projects/uwear/architecture.png", alt: "Architecture: storefront, backend API, and admin dashboard" },
    ],
    live: "https://uwearuk.com",
    github: "https://github.com/harsh01369/uwear-platform-showcase",
    featured: true,
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
      { src: "/images/projects/geobot/hero.png", alt: "GeoThreadBot — AI news pipeline overview" },
      { src: "/images/projects/geobot/architecture.png", alt: "7-stage pipeline: fetch → NLP → summarise → verify → publish" },
    ],
    github: "https://github.com/harsh01369/AI-powered-Geo-politics-news-bot",
    featured: true,
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
      { src: "/images/projects/helec/hero.png", alt: "HELEC — AI customer support chat overview" },
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
      { src: "/images/projects/cybership/hero.png", alt: "CyberShip — shipping rate aggregator overview" },
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
      "My portfolio and blog rebuilt from a Create React App with zero SEO into a Next.js 15 static site. All 22 pages pre-rendered at build time with unique metadata, Open Graph tags, JSON-LD structured data, and an auto-generated sitemap. MDX blog system with syntax highlighting. Modern dark theme with cursor spotlight, dot grid backgrounds, and Framer Motion animations.",
    longDescription: `This portfolio is a ground-up rebuild of my previous Create React App site. The old version had zero SEO because everything was client-rendered JavaScript. Google could not index a single page. Searching for my name returned nothing.

The rebuild uses Next.js 15 with the App Router and static site generation. Every page is pre-rendered at build time as full HTML. Each project and blog post gets its own URL with unique title, meta description, Open Graph tags, and JSON-LD structured data (Person, WebSite, BlogPosting, SoftwareApplication schemas). The sitemap.ts auto-generates a sitemap covering all routes.

The blog system uses MDX (Markdown + JSX) loaded through gray-matter for frontmatter parsing and next-mdx-remote for rendering. Code blocks use sugar-high for lightweight syntax highlighting.

The design follows a modern dark theme with interactive effects: a page-level cursor spotlight that follows mouse movement, dot grid backgrounds with radial fading, gradient text on headings, card spotlight effects on hover, a noise texture overlay, and staggered entrance animations via Framer Motion. The flip words component cycles through roles on the hero section.

Tailwind CSS 4 handles all styling with custom theme tokens defined as CSS variables. Inter and JetBrains Mono are self-hosted via next/font for zero external requests.`,
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
      "Static site generation for all 22 pages",
      "MDX blog with syntax highlighting",
      "SEO: unique metadata, Open Graph, JSON-LD, sitemap",
      "Cursor spotlight and dot grid background effects",
      "Framer Motion staggered entrance animations",
      "Self-hosted Inter + JetBrains Mono fonts",
      "Modern dark theme with noise texture overlay",
    ],
    image: "/images/projects/portfolio/thumbnail.png",
    images: [
      { src: "/images/projects/portfolio/hero.png", alt: "Portfolio Website — Next.js 15 SSG overview" },
      { src: "/images/projects/portfolio/architecture.png", alt: "Architecture: App Router → SSG → SEO layer → Vercel" },
    ],
    github: "https://github.com/harsh01369/portfolio-website",
    live: "https://harshkhetia.dev",
    featured: false,
  },
];
