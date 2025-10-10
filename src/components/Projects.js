import React, { useState } from 'react';
import './Projects.css';

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);
    const [modalImage, setModalImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const projects = [
        {
            title: 'UWEAR UK E-Commerce Platform',
            link: 'https://uwearuk.com/',
            brief: 'A complete full-stack e-commerce platform built entirely from scratch, including a customer-facing website, admin dashboard, and backend server. Designed and developed solo, this project powers UwearUK, a clothing brand that connects wholesale and retail operations in real time.',
            details: `UwearUK is a full-scale e-commerce ecosystem I built completely on my own from system architecture to front-end UI, backend logic, and admin management tools. The project runs on a three-tier structure:\n\n 1) Frontend :\nThe main customer-facing website where users browse, shop, and manage accounts.\nBuilt with React.js and modular components (navbar, productlist, login, signup, cartpage, etc.)\nSupports real-time product updates, category-based filtering, cart/wishlist persistence, and secure user authentication via JWT.\nProduct, wishlist, and cart data sync seamlessly with the backend.\n\n2) Backend Server :\nActs as the central brain of the system, connecting both frontend and admin dashboard.\nDeveloped using Node.js, Express, and MongoDB (Atlas + Compass).\nStructured with modular directories:\n- controllers/ (product, category, order, user)\n- models/ (userModel, productModel)\n- routes/ (userRoutes, productRoutes, categoryRoutes, orderRoutes)\n- middleware/ (authMiddleware for token validation)\nIntegrated Stripe for secure payments, with webhooks to automate order confirmations and sales tracking.\nUses SendGrid for customer email notifications and marketing campaigns.\nFollows GDPR standards all sensitive financial information is handled by Stripe, keeping the platform safe from financial risks.\n\n 3) Admin Dashboard (admin-side):\nA dedicated, secure portal that gives full control over the platform’s data and analytics.\nBuilt with React.js and connected directly to the backend API.\nAdmins can add/edit products, manage categories, monitor orders, and view customer details.\nThe sales and analytics modules show trending products, top wishlisted items, and frequently purchased categories.\nLogin is secured via environment-based credentials and JWT tokens.\n\n 4) Tech Stack & Tools:\nFrontend: React.js, React Router, Tailwind CSS\nBackend: Node.js, Express.js, MongoDB\nAuthentication: JWT (JSON Web Tokens)\nPayments: Stripe API + Webhooks\nEmail Services: SendGrid API\nAI Integration: Product trend analysis to auto-highlight popular items\nSecurity & Compliance: GDPR, HTTPS, CORS, Stripe-handled financial data`,
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
        },

        {
            title: 'Enhancing Reinforcement Learning in High-Frequency Trading',
            link: 'https://colab.research.google.com/drive/1VqGT41gxVGRac4hZDJUVP4UZaPZVrGeS?usp=sharing',
            brief: 'A research-driven project exploring how Reinforcement Learning (RL) optimizes decision-making in High-Frequency Trading environments. Implemented and tested on Google Colab using TensorFlow.',
            details: `This project investigates the integration of Reinforcement Learning within the ultra-fast world of High-Frequency Trading, where algorithms must make millisecond-level decisions. Built entirely from scratch and executed on Google Colab, the system uses deep RL methods to simulate, train, and evaluate autonomous trading agents capable of learning dynamic buy-sell strategies from market data.\n\n 1) Environment Design & Data Acquisition :\nSimulated high-frequency market with price-tick data representing realistic trading noise.\n\n 2) Agent Training :\nRL agents learn optimal actions through continuous feedback, balancing exploration vs exploitation.\n\n 3) Reward Function Engineering :\nCustom reward metrics reflecting risk-adjusted profit, latency, and transaction cost.\n\n 4) Evaluation & Analysis :\nComparison of model performance across algorithms, including convergence stability and trading profitability.\n\n 5) Technical Approach :\nThe work builds on key literature exploring Deep Q-Learning (DQN), PPO, and policy-gradient architectures, benchmarking their adaptability and stability under volatile market conditions. The notebook includes full environment setup, GPU configuration, and TensorFlow-based model training to ensure computational efficiency during back-testing.\n\n 6) Key Highlights :\n- Developed entirely by me as a solo research project.\n- Implements RL agents capable of adapting to rapid market fluctuations.\n- Benchmarks different RL architectures for speed, profitability, and stability.\n- Integrates ethical and security considerations in AI-based trading design.\n- Combines academic research and practical model implementation for realistic simulation of financial markets.\n\n 7) Tech Stack & Frameworks :\n- Programming: Python (Colab / Jupyter Notebook)\n- Libraries: TensorFlow, NumPy, Pandas, Matplotlib\n- Machine Learning: Deep Q-Learning, Policy Gradient Methods, Reinforcement Learning Frameworks\n- Environment: Google Colab GPU Runtime\n- Domain: Algorithmic Trading / Quantitative Finance`,
            images: [
                '/images/rl/11.jpg',
                '/images/rl/1.png',
                '/images/rl/2.png',
                '/images/rl/3.png',
                '/images/rl/4.png',
                '/images/rl/5.png',
                '/images/rl/6.png',
            ],
        },

        {
            title: 'AI-Powered Geopolitics News Bot',
            link: 'https://github.com/harsh01369/AI-powered-Geo-politics-news-bot',
            brief: 'An intelligent, end-to-end AI-driven news automation bot that fetches, analyzes, verifies, summarizes, and posts breaking geopolitical content from YouTube, RSS feeds, and Twitter (X) using advanced NLP and API integrations.',
            details: `The Geopolitics News Bot is a fully autonomous AI application I built from scratch to monitor and summarize real-time global political developments. It continuously aggregates news from YouTube, Twitter (X), and major RSS feeds (BBC, Reuters, Al Jazeera, AP, The Hindu), processes it through multi-layered AI pipelines, and intelligently posts summarized, verified insights to social platforms. The system is designed for speed, reliability, and fact verification capable of generating comprehensive tweet threads or news summaries within seconds of breaking events.\n\n 1) Data Collection :\nFetches data from Twitter (X) using the Tweepy API, YouTube channels via YouTube Data API, and global RSS feeds using Feedparser.\nAutomatically filters geopolitical news through relevance and sensitivity detection using SpaCy NLP and VADER sentiment analysis.\n\n 2) Language & Content Processing :\nDetects and translates content across 12+ languages using langdetect and GoogleTranslator.\nSummarizes and extracts key points using Hugging Face Transformers (BART) models.\nGenerates contextual threads with historical and geopolitical context (e.g., “India–Pakistan”, “US–China”, “NATO”, etc.) from a custom knowledge base.\n\n 3) Claim Verification & Fact Checking :\nEach extracted claim is automatically verified using Google search scraping and a confidence-based credibility system (Reuters, BBC, AP, etc.).\nStores claim logs, source URLs, and confidence scores for transparency and auditability.\n\n 4) Automated Posting & Moderation :\nPosts verified content threads directly to Twitter (X) via Tweepy with a built-in approval system.\nSupports human moderation via Flask endpoints (/approve_claim, /reject_claim) and stores approved claims in an SQLite database.\nIncludes metrics tracking and a real-time log monitoring endpoint (/logs).\n\n 5) Scheduling & Automation :\nUses the schedule and asyncio libraries to periodically fetch, process, and post new content without downtime.\nTasks run in multi-threaded mode via ThreadPoolExecutor for concurrent YouTube, RSS, and X processing.\n\n 6) Intelligence Features :\n- AI-based content summarization and key-point extraction (BART Transformer).\n- Sentiment filtering to block negative or violent content.\n- Contextual enrichment of threads using predefined geopolitical data.\n- Smart fact verification pipeline with automated confidence scoring.\n- Multi-language translation and processing pipeline for non-English news.\n\n 7) APIs & Libraries Integrated :\n- Twitter API (Tweepy)\n- YouTube Data API\n- Google Translator API\n- Hugging Face Transformers (BART)\n- SpaCy, VADER Sentiment Analyzer, BeautifulSoup, Feedparser, Flask, SQLite, TensorFlow, Tenacity (for retry logic)\n\n 8) Backend & Storage :\n- SQLite database with structured tables for claims, threads, metrics, and processed_content.\n- Flask REST API for moderation, analytics, and log inspection.\n- Thread-safe, concurrent DB handling with global locking to prevent race conditions.\n\n 9) Security & Reliability :\n- API credentials stored securely in .env.\n- Auto-fallbacks and retry logic for API failures.\n- Multi-layered logging system (newsbot.log + console output).\n- Supports test mode for safe simulation without live posting.\n\n 10) Key Highlights :\n- Built entirely solo integrating AI, NLP, automation, and web APIs.\n- Autonomous operation fetches, verifies, summarizes, and posts news in real time.\n- Fact-checking and moderation pipeline ensures credible content sharing.\n- Contextually aware adds relevant geopolitical background for better audience understanding.\n- Fully modular and scalable, capable of integrating new domains like spiritual or economic news in future.\n\n 11) Tech Stack & Tools :\n- Languages: Python\n- Frameworks: Flask, TensorFlow\n- AI/NLP: Transformers (BART), SpaCy, VADER\n- Database: SQLite\n- Automation: Schedule, AsyncIO, ThreadPoolExecutor\n- APIs: Twitter (X), YouTube, Google Translate\n- Utilities: BeautifulSoup, Feedparser, Langdetect, Deep Translator`,
            images: [
                '/images/bot/1.jpg',
                '/images/bot/2.png',
                '/images/bot/3.png',
                '/images/bot/4.png',
                '/images/bot/5.png',
            ],
        },

        {
            title: 'Bhairav Aaradhyaa — Content Creation & Digital Platform',
            link: 'https://www.instagram.com/bhairav.aaradhyaa/',
            brief: 'A growing digital platform dedicated to spreading spirituality, wisdom, and higher consciousness through modern content creation. Built organically from zero to 700K reach in six months.',
            details: `Bhairav Aaradhyaa is my self-created digital content platform and community that blends spirituality, philosophy, and creative storytelling. What began in April 2025 as a humble Instagram page with zero followers has organically grown into a multi-platform presence with over 6,000 engaged followers and a monthly reach of 700,000+ people all achieved without paid promotion, ads, or influencer support. The core idea is to bring ancient wisdom into the modern digital world through content that inspires peace, understanding, self-awareness, and inner growth.\n\n 1) Content Strategy & Growth :\n- Platforms: Instagram, Facebook (and upcoming YouTube documentary channel).\n- Growth Journey:\n  - April 2025 → 500 reach\n  - May 2025 → 7K reach\n  - June 2025 → 50K reach\n  - July 2025 → 350K reach\n  - August 2025 → 520K reach\n  - September 2025 → 700K+ reach\n- Followers (combined): 6,000+ genuine, organic audience.\nThe strategy focuses on authentic connection, consistent posting, and deep thematic alignment with spiritual and philosophical values rather than algorithmic manipulation or paid boosts.\n\n 2) Content Creation & Tools Used :\n- Editing & Design: CapCut, PicsArt, Canva, Adobe Creative Suite, CyberLink PowerDirector\n- AI Tools: AI-generated imagery, AI voiceovers, and post-caption refinement using language models\n- Analytics & Optimization: SEO optimization, hashtag strategy, trend alignment, audience location targeting, and engagement timing\n- Creative References: Inspired by anime visuals, cinematic storytelling, and mythological symbolism\n\n 3) Content Themes :\n- Spirituality & Hindu Philosophy deeper understanding of dharma, deities, and divine traditions\n- Science & Spirituality bridging ancient wisdom with modern physics and cosmology\n- Motivation & Perspective, daily thoughts on living with balance, discipline, and purpose\n- Higher Consciousness, meditative reflections, awareness, and the journey of self-realization\n- Practical Life & Philosophy discussions on habits, values, and the essence of simple, meaningful living\nEvery post, article, and reel aims to uplift, educate, and heal, turning social media into a space of awareness rather than distraction.\n\n 4) Future Vision & Expansion :\nThis project is expanding into a full-fledged digital ecosystem:\n- Dedicated Website: A platform to publish long-form writings, spiritual articles, and personal reflections.\n- YouTube Documentary Platform: Exploring ancient Indian philosophies, quantum spirituality, and modern relevance.\n- E-commerce Store: Selling spiritual items incense sticks, perfumes, and pooja materials crafted with intention and purity.\n- Charity Initiative: A portion of profits will go towards food seva for hungry children and education support, spreading both knowledge and compassion.\nThe ultimate goal is to build a digital spiritual ecosystem that unites knowledge, devotion, and service making the world a more peaceful and conscious place.\n\n 5) Tools & Technologies :\n- Content Tools: CapCut, PicsArt, Canva, Adobe Suite, CyberLink PowerDirector\n- AI Tools: Deep AI Image Generation, AI Voiceover Tools, SEO & Engagement Analyzers\n- Social Platforms: Instagram, Facebook, YouTube (in development)\n- Content Strategy: SEO Optimization, Hashtag Mapping, Trend Analysis, Location Targeting\n\n 6) Key Highlights :\n- Built organically from zero to 700K reach in under six months.\n- Produces daily content-> 2 reels, 1 post, and stories with spiritual imagery and reflections.\n- 100% self-created, designed, written, edited, and optimized without paid promotion.\n- Focused on making spirituality relatable in the modern digital age.\n- Expanding into a documentary series, website, and e-commerce platform with social impact goals.`,
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
        },

        {
            title: 'AI-Powered Used Car Price Prediction with Random Forest Regression',
            link: 'https://colab.research.google.com/drive/1dF35FXnz0mZehVuitJUkawH5Y5Qeawpb?usp=sharing',
            brief: 'A machine learning project analyzing used car advertisement data to build a predictive model for vehicle prices. Utilizes Random Forest Regression on Google Colab for accurate forecasting based on key attributes like mileage, registration year, and vehicle specs.',
            details: `This project develops a robust predictive model for estimating used car prices from advertisement data, leveraging ensemble machine learning techniques to handle diverse vehicle features. Executed on Google Colab, the analysis processes a large dataset of over 400,000 car listings, cleans and engineers features, trains a Random Forest Regressor, and evaluates performance metrics to uncover pricing insights for the automotive market.\n\n  1) Data Acquisition & Exploration :\nLoaded a comprehensive CSV dataset of car adverts with columns like public_reference, mileage, reg_code, standard_colour, standard_make, standard_model, vehicle_condition, year_of_registration, price, body_type, crossover_car_and_van, and fuel_type. Performed initial EDA using pandas to inspect data types, missing values (e.g., ~2-8% nulls in key fields), and summary statistics, revealing insights such as average price (~£17,342), mileage (~37,744 miles), and registration year (~2015).\n\n 2) Feature Engineering :\nDerived additional features like vehicle_age from year_of_registration. Encoded categorical variables (e.g., one-hot encoding for standard_make, standard_model, body_type) to prepare a high-dimensional feature set. Handled missing values and outliers to ensure model robustness, focusing on numerical (mileage, year) and categorical (make, model) predictors for price estimation.\n\n 3) Model Training :\nSplit data into train/test sets using train_test_split. Initialized and fitted a Random Forest Regressor (n_estimators=100, random_state=42) on engineered features (X_train) to predict price (y_train), capturing non-linear relationships in the dataset.\n\n 4) Evaluation & Analysis :\nComputed Root Mean Squared Error (RMSE) on test predictions to quantify accuracy. Analyzed feature importances, highlighting year_of_registration (0.39), mileage (0.13), and body_type_Hatchback (0.12) as top influencers. Visualized importances via pandas Series for interpretability, aiding in understanding key price drivers like age and condition.\n\n 5) Hyperparameter Tuning :\nImplemented GridSearchCV for optimizing Random Forest parameters (n_estimators: [100,200,300], max_depth: [None,10,20], min_samples_split: [2,5,10]) with 5-fold cross-validation and parallel processing (n_jobs=-1) to enhance model performance and generalization.\n\n 6) Key Highlights :\n- Solo-developed project on real-world automotive data for practical price forecasting.\n- Achieved interpretable insights into pricing factors, with year and mileage dominating predictions.\n- Demonstrates end-to-end ML pipeline from data loading to tuning, despite handling large-scale data challenges.\n- Includes error handling for incomplete fits and exploratory stats for data quality assessment.\n- Applicable for dealerships or buyers seeking fair market value estimates.\n\n 7) Tech Stack & Frameworks :\n- Programming: Python (Google Colab / Jupyter Notebook)\n- Libraries: Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn (RandomForestRegressor, GridSearchCV, train_test_split, mean_squared_error)\n- Machine Learning: Ensemble Methods (Random Forest), Feature Engineering, Cross-Validation\n- Environment: Google Colab with Drive Integration\n- Domain: Predictive Analytics / Automotive Pricing`,
            images: [
                '/images/ai/1.jpg',
                '/images/ai/2.png',
                '/images/ai/3.png',
                '/images/ai/4.png',
                '/images/ai/5.png',
                '/images/ai/6.jpg',             
            ],
        },

    ];

    const openDetails = (index) => {
        setSelectedProject(index);
    };

    const closeDetails = () => {
        setSelectedProject(null);
    };

    const openImageModal = (images, index) => {
        setModalImage(images);
        setCurrentImageIndex(index);
    };

    const closeImageModal = () => {
        setModalImage(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % modalImage.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + modalImage.length) % modalImage.length);
    };

    return (
        <section id="projects" className="projects">
            <div className="content-wrapper">
                <h1 className="projects-title">Projects</h1>
                <div className="projects-list">
                    {projects.map((project, index) => (
                        <div key={index} className="project-card">
                            <div className="project-content">
                                <div className="project-slideshow">
                                    <div className="slideshow-container">
                                        {project.images.map((image, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={image}
                                                alt={`${project.title} screenshot ${imgIndex + 1}`}
                                                className={imgIndex === 0 ? 'active' : ''}
                                                onClick={() => openImageModal(project.images, imgIndex)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="project-info">
                                    <h2 className="card-title">
                                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                                            {project.title}
                                        </a>
                                    </h2>
                                    <p className="brief" onClick={() => openDetails(index)}>
                                        {project.brief}
                                    </p>
                                    <button className="view-more" onClick={() => openDetails(index)}>
                                        View More
                                    </button>
                                </div>
                            </div>
                            {selectedProject === index && (
                                <div className="project-details">
                                    <h3>{project.title}</h3>
                                    <p>{project.details}</p>
                                    <button className="close-details" onClick={closeDetails}>
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {modalImage && (
                    <div className="image-modal">
                        <div className="modal-content">
                            <img src={modalImage[currentImageIndex]} alt="Project screenshot" />
                            <div className="modal-nav">
                                <button onClick={prevImage} disabled={modalImage.length <= 1}>
                                    Previous
                                </button>
                                <span>{`${currentImageIndex + 1} / ${modalImage.length}`}</span>
                                <button onClick={nextImage} disabled={modalImage.length <= 1}>
                                    Next
                                </button>
                                <button onClick={closeImageModal}>Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Projects;