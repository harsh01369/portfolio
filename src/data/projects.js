// All project data centralized
export const projects = [
  {
    id: 'helec',
    title: 'HELEC - AI-Powered E-commerce Chat Assistant',
    link: 'https://helec-frontend.vercel.app',
    brief: 'A real-time customer support chat system for e-commerce stores with AI-powered responses. Features WebSocket communication, conversation memory, session persistence, and intelligent context-aware answers using Groq\'s llama-3.3-70b model.',
    details: `HELEC (Helpful E-commerce Live Engine for Customers) is a complete chat support system that provides intelligent, context-aware customer assistance in real-time. Built as a full-stack TypeScript monorepo, it showcases modern web architecture with real-time communication, AI integration, and production-ready deployment practices.

 1) Real-Time Communication Architecture :
The system uses Socket.IO for bidirectional WebSocket communication between the SvelteKit frontend and Fastify backend. When a customer sends a message, it's instantly transmitted to the server, processed, saved to PostgreSQL, sent to the AI for a response, and the answer is emitted back to the client in real-time. This creates a seamless chat experience with typing indicators and instant message delivery.

 2) AI-Powered Conversation Intelligence :
Integrated Groq's llama-3.3-70b model for lightning-fast AI responses (100+ tokens/sec, 10x faster than OpenAI). The system maintains conversation context by fetching recent message history before generating each response, allowing the AI to remember what customers asked earlier and provide contextually relevant answers. Custom system prompts ensure the AI understands store policies, products, and maintains a helpful, professional tone.

 3) Backend Architecture (Fastify + TypeScript) :
Built with Fastify for high-performance HTTP handling (2x faster than Express). The server is structured with modular routes, services, and configuration:
- routes/ → API endpoints for messaging and conversation retrieval
- services/ → Business logic including LLM integration with Groq SDK
- lib/ → Shared utilities and Prisma database client
- Socket.IO integration for real-time event handling (join_conversation, send_message, new_message, typing, error)
All TypeScript with strict typing for type safety across the stack.

 4) Database Design (Prisma + PostgreSQL) :
Uses Prisma ORM for type-safe database queries with auto-generated TypeScript types. Schema includes Conversation and Message models with proper relationships, timestamps, and indexing. Migrations are version-controlled and deployed automatically. Database runs on Render's managed PostgreSQL in production, Docker Compose for local development.

 5) Frontend (SvelteKit 2.0 + Svelte 5) :
Modern reactive UI built with Svelte 5's runes system for cleaner state management. Features a floating chat widget with smooth animations, message history, typing indicators, and error handling. Styled with TailwindCSS + DaisyUI for consistent, responsive design. Socket.IO client manages WebSocket connections with auto-reconnection logic. The bundle size is 40% smaller than equivalent React implementations.

 6) Deployment & DevOps :
- Frontend deployed on Vercel with auto-deployment from GitHub
- Backend deployed on Render.com with health checks and auto-scaling
- PostgreSQL database on Render's managed service
- Environment-based configuration for development/production
- Local development uses Docker Compose for PostgreSQL
- Monorepo structure with pnpm workspaces for efficient dependency management

 7) Session Persistence & Memory :
Conversations are persisted in PostgreSQL with unique IDs. Users can refresh the page and their chat history remains. The backend fetches the last 10 messages before each AI request to provide context. This allows for natural, multi-turn conversations where the AI remembers earlier context (e.g., "What colors does it come in?" after asking about a product).

 8) Error Handling & Reliability :
- Auto-reconnection for WebSocket failures
- User-friendly error messages displayed in chat
- Backend validates all inputs and handles Groq API failures gracefully
- Rate limiting ready (not enabled in demo)
- Comprehensive logging for debugging
- Health check endpoint for monitoring

 9) Key Technical Highlights :
- Full TypeScript monorepo with shared types between frontend and backend
- Real-time bidirectional communication with Socket.IO
- AI responses 10x faster than OpenAI using Groq's infrastructure
- Type-safe database queries with Prisma ORM
- Production deployment on Vercel + Render with PostgreSQL
- 40% smaller bundle size using SvelteKit vs React
- Conversation memory with context-aware AI responses
- Mobile-responsive floating chat widget
- Docker Compose for local development consistency

 10) Production Considerations :
The current demo runs on free tiers (Render spins down after 15 minutes, causing 30-60s cold starts). In production, I'd add:
- Redis caching for frequently asked questions
- Admin dashboard for support staff
- User authentication and multi-device sync
- Product catalog integration for real inventory data
- File upload support for screenshots
- Multi-language detection and response
- Rate limiting per IP/user
- Analytics dashboard (response time, satisfaction, common questions)

 11) Tech Stack & Tools :
Backend: Node.js, TypeScript, Fastify, Socket.IO, Prisma, PostgreSQL, Groq SDK
Frontend: SvelteKit 2.0, Svelte 5, TailwindCSS, DaisyUI, Socket.IO Client, TypeScript
Infrastructure: Vercel (frontend), Render (backend + database), Docker Compose (local dev)
AI: Groq API with llama-3.3-70b model
Tooling: pnpm workspaces, ESLint, Prettier, Git

 12) What Makes This Stand Out :
- Built entirely solo from architecture to deployment
- Modern tech choices (Svelte 5, Fastify, Groq) for performance
- Production-ready with proper error handling and deployment
- Real-time features that actually work reliably
- Conversation memory for natural multi-turn dialogs
- Type safety across the entire stack
- Monorepo structure with clean separation of concerns
- Live demo deployed and accessible`,
    images: [
      '/images/helec/1.png',
      '/images/helec/2.png',
      '/images/helec/3.png',
      '/images/helec/4.png',
    ],
    techStack: ['TypeScript', 'SvelteKit', 'Fastify', 'Socket.IO', 'Prisma', 'PostgreSQL', 'Groq AI', 'TailwindCSS', 'Docker', 'Vercel', 'Render'],
    category: 'Full-Stack Web Development',
    featured: true,
  },

  {
    id: 'geo-news-bot',
    title: 'AI-Powered Geopolitics News Bot',
    link: 'https://github.com/harsh01369/AI-powered-Geo-politics-news-bot',
    brief: 'An intelligent, end-to-end AI-driven news automation bot that fetches, analyzes, verifies, summarizes, and posts breaking geopolitical content from YouTube, RSS feeds, and Twitter (X) using advanced NLP and API integrations.',
    details: `The Geopolitics News Bot is a fully autonomous AI application I built from scratch to monitor and summarize real-time global political developments. It continuously aggregates news from YouTube, Twitter (X), and major RSS feeds (BBC, Reuters, Al Jazeera, AP, The Hindu), processes it through multi-layered AI pipelines, and intelligently posts summarized, verified insights to social platforms. The system is designed for speed, reliability, and fact verification capable of generating comprehensive tweet threads or news summaries within seconds of breaking events.

 1) Data Collection :
Fetches data from Twitter (X) using the Tweepy API, YouTube channels via YouTube Data API, and global RSS feeds using Feedparser.
Automatically filters geopolitical news through relevance and sensitivity detection using SpaCy NLP and VADER sentiment analysis.

 2) Language & Content Processing :
Detects and translates content across 12+ languages using langdetect and GoogleTranslator.
Summarizes and extracts key points using Hugging Face Transformers (BART) models.
Generates contextual threads with historical and geopolitical context (e.g., "India–Pakistan", "US–China", "NATO", etc.) from a custom knowledge base.

 3) Claim Verification & Fact Checking :
Each extracted claim is automatically verified using Google search scraping and a confidence-based credibility system (Reuters, BBC, AP, etc.).
Stores claim logs, source URLs, and confidence scores for transparency and auditability.

 4) Automated Posting & Moderation :
Posts verified content threads directly to Twitter (X) via Tweepy with a built-in approval system.
Supports human moderation via Flask endpoints (/approve_claim, /reject_claim) and stores approved claims in an SQLite database.
Includes metrics tracking and a real-time log monitoring endpoint (/logs).

 5) Scheduling & Automation :
Uses the schedule and asyncio libraries to periodically fetch, process, and post new content without downtime.
Tasks run in multi-threaded mode via ThreadPoolExecutor for concurrent YouTube, RSS, and X processing.

 6) Intelligence Features :
- AI-based content summarization and key-point extraction (BART Transformer).
- Sentiment filtering to block negative or violent content.
- Contextual enrichment of threads using predefined geopolitical data.
- Smart fact verification pipeline with automated confidence scoring.
- Multi-language translation and processing pipeline for non-English news.

 7) APIs & Libraries Integrated :
- Twitter API (Tweepy)
- YouTube Data API
- Google Translator API
- Hugging Face Transformers (BART)
- SpaCy, VADER Sentiment Analyzer, BeautifulSoup, Feedparser, Flask, SQLite, TensorFlow, Tenacity (for retry logic)

 8) Backend & Storage :
- SQLite database with structured tables for claims, threads, metrics, and processed_content.
- Flask REST API for moderation, analytics, and log inspection.
- Thread-safe, concurrent DB handling with global locking to prevent race conditions.

 9) Security & Reliability :
- API credentials stored securely in .env.
- Auto-fallbacks and retry logic for API failures.
- Multi-layered logging system (newsbot.log + console output).
- Supports test mode for safe simulation without live posting.

 10) Key Highlights :
- Built entirely solo integrating AI, NLP, automation, and web APIs.
- Autonomous operation fetches, verifies, summarizes, and posts news in real time.
- Fact-checking and moderation pipeline ensures credible content sharing.
- Contextually aware adds relevant geopolitical background for better audience understanding.
- Fully modular and scalable, capable of integrating new domains like spiritual or economic news in future.

 11) Tech Stack & Tools :
- Languages: Python
- Frameworks: Flask, TensorFlow
- AI/NLP: Transformers (BART), SpaCy, VADER
- Database: SQLite
- Automation: Schedule, AsyncIO, ThreadPoolExecutor
- APIs: Twitter (X), YouTube, Google Translate
- Utilities: BeautifulSoup, Feedparser, Langdetect, Deep Translator`,
    images: [
      '/images/bot/1.jpg',
      '/images/bot/2.png',
      '/images/bot/3.png',
      '/images/bot/4.png',
      '/images/bot/5.png',
    ],
    techStack: ['Python', 'Flask', 'TensorFlow', 'Transformers', 'SpaCy', 'Twitter API', 'YouTube API', 'SQLite', 'NLP'],
    category: 'AI & Automation',
    featured: true,
  },

  {
    id: 'uwear-uk',
    title: 'UWEAR UK E-Commerce Platform',
    link: 'https://uwearuk.com/',
    brief: 'A complete full-stack e-commerce platform built entirely from scratch, including a customer-facing website, admin dashboard, and backend server. Designed and developed solo, this project powers UwearUK, a clothing brand that connects wholesale and retail operations in real time.',
    details: `UwearUK is a full-scale e-commerce ecosystem I built completely on my own from system architecture to front-end UI, backend logic, and admin management tools. The project runs on a three-tier structure:

 1) Frontend :
The main customer-facing website where users browse, shop, and manage accounts.
Built with React.js and modular components (navbar, productlist, login, signup, cartpage, etc.)
Supports real-time product updates, category-based filtering, cart/wishlist persistence, and secure user authentication via JWT.
Product, wishlist, and cart data sync seamlessly with the backend.

2) Backend Server :
Acts as the central brain of the system, connecting both frontend and admin dashboard.
Developed using Node.js, Express, and MongoDB (Atlas + Compass).
Structured with modular directories:
- controllers/ (product, category, order, user)
- models/ (userModel, productModel)
- routes/ (userRoutes, productRoutes, categoryRoutes, orderRoutes)
- middleware/ (authMiddleware for token validation)
Integrated Stripe for secure payments, with webhooks to automate order confirmations and sales tracking.
Uses SendGrid for customer email notifications and marketing campaigns.
Follows GDPR standards all sensitive financial information is handled by Stripe, keeping the platform safe from financial risks.

 3) Admin Dashboard (admin-side):
A dedicated, secure portal that gives full control over the platform's data and analytics.
Built with React.js and connected directly to the backend API.
Admins can add/edit products, manage categories, monitor orders, and view customer details.
The sales and analytics modules show trending products, top wishlisted items, and frequently purchased categories.
Login is secured via environment-based credentials and JWT tokens.

 4) Tech Stack & Tools:
Frontend: React.js, React Router, Tailwind CSS
Backend: Node.js, Express.js, MongoDB
Authentication: JWT (JSON Web Tokens)
Payments: Stripe API + Webhooks
Email Services: SendGrid API
AI Integration: Product trend analysis to auto-highlight popular items
Security & Compliance: GDPR, HTTPS, CORS, Stripe-handled financial data`,
    images: [
      '/images/uwear/1.png',
      '/images/uwear/2.png',
      '/images/uwear/3.png',
      '/images/uwear/4.png',
      '/images/uwear/5.png',
      '/images/uwear/6.png',
      '/images/uwear/7.png',
      '/images/uwear/9.png',
    ],
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe', 'SendGrid', 'JWT', 'Tailwind CSS'],
    category: 'Full-Stack Web Development',
    featured: true,
  },

  {
    id: 'rl-trading',
    title: 'Enhancing Reinforcement Learning in High-Frequency Trading',
    link: 'https://colab.research.google.com/drive/1VqGT41gxVGRac4hZDJUVP4UZaPZVrGeS?usp=sharing',
    brief: 'A research-driven project exploring how Reinforcement Learning (RL) optimizes decision-making in High-Frequency Trading environments. Implemented and tested on Google Colab using TensorFlow.',
    details: `This project investigates the integration of Reinforcement Learning within the ultra-fast world of High-Frequency Trading, where algorithms must make millisecond-level decisions. Built entirely from scratch and executed on Google Colab, the system uses deep RL methods to simulate, train, and evaluate autonomous trading agents capable of learning dynamic buy-sell strategies from market data.

 1) Environment Design & Data Acquisition :
Simulated high-frequency market with price-tick data representing realistic trading noise.

 2) Agent Training :
RL agents learn optimal actions through continuous feedback, balancing exploration vs exploitation.

 3) Reward Function Engineering :
Custom reward metrics reflecting risk-adjusted profit, latency, and transaction cost.

 4) Evaluation & Analysis :
Comparison of model performance across algorithms, including convergence stability and trading profitability.

 5) Technical Approach :
The work builds on key literature exploring Deep Q-Learning (DQN), PPO, and policy-gradient architectures, benchmarking their adaptability and stability under volatile market conditions. The notebook includes full environment setup, GPU configuration, and TensorFlow-based model training to ensure computational efficiency during back-testing.

 6) Key Highlights :
- Developed entirely by me as a solo research project.
- Implements RL agents capable of adapting to rapid market fluctuations.
- Benchmarks different RL architectures for speed, profitability, and stability.
- Integrates ethical and security considerations in AI-based trading design.
- Combines academic research and practical model implementation for realistic simulation of financial markets.

 7) Tech Stack & Frameworks :
- Programming: Python (Colab / Jupyter Notebook)
- Libraries: TensorFlow, NumPy, Pandas, Matplotlib
- Machine Learning: Deep Q-Learning, Policy Gradient Methods, Reinforcement Learning Frameworks
- Environment: Google Colab GPU Runtime
- Domain: Algorithmic Trading / Quantitative Finance`,
    images: [
      '/images/rl/11.jpg',
      '/images/rl/1.png',
      '/images/rl/2.png',
      '/images/rl/3.png',
      '/images/rl/4.png',
      '/images/rl/5.png',
      '/images/rl/6.png',
    ],
    techStack: ['Python', 'TensorFlow', 'NumPy', 'Pandas', 'Matplotlib', 'Reinforcement Learning', 'DQN', 'PPO'],
    category: 'AI & Machine Learning',
    featured: true,
  },

  {
    id: 'bhairav-aaradhyaa',
    title: 'Bhairav Aaradhyaa — Content Creation & Digital Platform',
    link: 'https://www.instagram.com/bhairav.aaradhyaa/',
    brief: 'A growing digital platform dedicated to spreading spirituality, wisdom, and higher consciousness through modern content creation. Built organically from zero to 700K reach in six months.',
    details: `Bhairav Aaradhyaa is my self-created digital content platform and community that blends spirituality, philosophy, and creative storytelling. What began in April 2025 as a humble Instagram page with zero followers has organically grown into a multi-platform presence with over 6,000 engaged followers and a monthly reach of 700,000+ people all achieved without paid promotion, ads, or influencer support. The core idea is to bring ancient wisdom into the modern digital world through content that inspires peace, understanding, self-awareness, and inner growth.

 1) Content Strategy & Growth :
- Platforms: Instagram, Facebook (and upcoming YouTube documentary channel).
- Growth Journey:
  - April 2025 → 500 reach
  - May 2025 → 7K reach
  - June 2025 → 50K reach
  - July 2025 → 350K reach
  - August 2025 → 520K reach
  - September 2025 → 700K+ reach
- Followers (combined): 6,000+ genuine, organic audience.
The strategy focuses on authentic connection, consistent posting, and deep thematic alignment with spiritual and philosophical values rather than algorithmic manipulation or paid boosts.

 2) Content Creation & Tools Used :
- Editing & Design: CapCut, PicsArt, Canva, Adobe Creative Suite, CyberLink PowerDirector
- AI Tools: AI-generated imagery, AI voiceovers, and post-caption refinement using language models
- Analytics & Optimization: SEO optimization, hashtag strategy, trend alignment, audience location targeting, and engagement timing
- Creative References: Inspired by anime visuals, cinematic storytelling, and mythological symbolism

 3) Content Themes :
- Spirituality & Hindu Philosophy deeper understanding of dharma, deities, and divine traditions
- Science & Spirituality bridging ancient wisdom with modern physics and cosmology
- Motivation & Perspective, daily thoughts on living with balance, discipline, and purpose
- Higher Consciousness, meditative reflections, awareness, and the journey of self-realization
- Practical Life & Philosophy discussions on habits, values, and the essence of simple, meaningful living
Every post, article, and reel aims to uplift, educate, and heal, turning social media into a space of awareness rather than distraction.

 4) Future Vision & Expansion :
This project is expanding into a full-fledged digital ecosystem:
- Dedicated Website: A platform to publish long-form writings, spiritual articles, and personal reflections.
- YouTube Documentary Platform: Exploring ancient Indian philosophies, quantum spirituality, and modern relevance.
- E-commerce Store: Selling spiritual items incense sticks, perfumes, and pooja materials crafted with intention and purity.
- Charity Initiative: A portion of profits will go towards food seva for hungry children and education support, spreading both knowledge and compassion.
The ultimate goal is to build a digital spiritual ecosystem that unites knowledge, devotion, and service making the world a more peaceful and conscious place.

 5) Tools & Technologies :
- Content Tools: CapCut, PicsArt, Canva, Adobe Suite, CyberLink PowerDirector
- AI Tools: Deep AI Image Generation, AI Voiceover Tools, SEO & Engagement Analyzers
- Social Platforms: Instagram, Facebook, YouTube (in development)
- Content Strategy: SEO Optimization, Hashtag Mapping, Trend Analysis, Location Targeting

 6) Key Highlights :
- Built organically from zero to 700K reach in under six months.
- Produces daily content-> 2 reels, 1 post, and stories with spiritual imagery and reflections.
- 100% self-created, designed, written, edited, and optimized without paid promotion.
- Focused on making spirituality relatable in the modern digital age.
- Expanding into a documentary series, website, and e-commerce platform with social impact goals.`,
    images: [
      '/images/bhairavMaa/11.jpg',
      '/images/bhairavMaa/1.jpg',
      '/images/bhairavMaa/2.jpg',
      '/images/bhairavMaa/3.jpg',
      '/images/bhairavMaa/4.jpg',
      '/images/bhairavMaa/5.jpg',
      '/images/bhairavMaa/6.jpg',
      '/images/bhairavMaa/7.jpg',
      '/images/bhairavMaa/8.jpg',
      '/images/bhairavMaa/9.jpg',
    ],
    techStack: ['CapCut', 'PicsArt', 'Canva', 'Adobe Creative Suite', 'AI Image Generation', 'Social Media Marketing', 'SEO'],
    category: 'Digital Marketing & Content Creation',
    featured: true,
  },

  {
    id: 'car-price-prediction',
    title: 'AI-Powered Used Car Price Prediction with Random Forest Regression',
    link: 'https://colab.research.google.com/drive/1dF35FXnz0mZehVuitJUkawH5Y5Qeawpb?usp=sharing',
    brief: 'A machine learning project analyzing used car advertisement data to build a predictive model for vehicle prices. Utilizes Random Forest Regression on Google Colab for accurate forecasting based on key attributes like mileage, registration year, and vehicle specs.',
    details: `This project develops a robust predictive model for estimating used car prices from advertisement data, leveraging ensemble machine learning techniques to handle diverse vehicle features. Executed on Google Colab, the analysis processes a large dataset of over 400,000 car listings, cleans and engineers features, trains a Random Forest Regressor, and evaluates performance metrics to uncover pricing insights for the automotive market.

  1) Data Acquisition & Exploration :
Loaded a comprehensive CSV dataset of car adverts with columns like public_reference, mileage, reg_code, standard_colour, standard_make, standard_model, vehicle_condition, year_of_registration, price, body_type, crossover_car_and_van, and fuel_type. Performed initial EDA using pandas to inspect data types, missing values (e.g., ~2-8% nulls in key fields), and summary statistics, revealing insights such as average price (~£17,342), mileage (~37,744 miles), and registration year (~2015).

 2) Feature Engineering :
Derived additional features like vehicle_age from year_of_registration. Encoded categorical variables (e.g., one-hot encoding for standard_make, standard_model, body_type) to prepare a high-dimensional feature set. Handled missing values and outliers to ensure model robustness, focusing on numerical (mileage, year) and categorical (make, model) predictors for price estimation.

 3) Model Training :
Split data into train/test sets using train_test_split. Initialized and fitted a Random Forest Regressor (n_estimators=100, random_state=42) on engineered features (X_train) to predict price (y_train), capturing non-linear relationships in the dataset.

 4) Evaluation & Analysis :
Computed Root Mean Squared Error (RMSE) on test predictions to quantify accuracy. Analyzed feature importances, highlighting year_of_registration (0.39), mileage (0.13), and body_type_Hatchback (0.12) as top influencers. Visualized importances via pandas Series for interpretability, aiding in understanding key price drivers like age and condition.

 5) Hyperparameter Tuning :
Implemented GridSearchCV for optimizing Random Forest parameters (n_estimators: [100,200,300], max_depth: [None,10,20], min_samples_split: [2,5,10]) with 5-fold cross-validation and parallel processing (n_jobs=-1) to enhance model performance and generalization.

 6) Key Highlights :
- Solo-developed project on real-world automotive data for practical price forecasting.
- Achieved interpretable insights into pricing factors, with year and mileage dominating predictions.
- Demonstrates end-to-end ML pipeline from data loading to tuning, despite handling large-scale data challenges.
- Includes error handling for incomplete fits and exploratory stats for data quality assessment.
- Applicable for dealerships or buyers seeking fair market value estimates.

 7) Tech Stack & Frameworks :
- Programming: Python (Google Colab / Jupyter Notebook)
- Libraries: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn (RandomForestRegressor, GridSearchCV, train_test_split, mean_squared_error)
- Machine Learning: Ensemble Methods (Random Forest), Feature Engineering, Cross-Validation
- Environment: Google Colab with Drive Integration
- Domain: Predictive Analytics / Automotive Pricing`,
    images: [
      '/images/ai/1.jpg',
      '/images/ai/2.png',
      '/images/ai/3.png',
      '/images/ai/4.png',
      '/images/ai/5.png',
      '/images/ai/6.jpg',
    ],
    techStack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Random Forest', 'Machine Learning'],
    category: 'AI & Machine Learning',
    featured: false,
  },
];

// Helper functions
export const getFeaturedProjects = () => projects.filter(p => p.featured);
export const getProjectsByCategory = (category) => projects.filter(p => p.category === category);
export const getProjectById = (id) => projects.find(p => p.id === id);
