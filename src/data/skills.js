// All skills data organized by category
export const skillCategories = [
  {
    id: 'technical-dev',
    title: 'Technical & Development',
    icon: '💻',
    subcategories: [
      {
        title: 'Programming Languages',
        skills: [
          { name: 'Python', proficiency: 'Advanced', icon: '🐍' },
          { name: 'JavaScript (ES6+)', proficiency: 'Advanced', icon: '⚡' },
          { name: 'TypeScript', proficiency: 'Advanced', icon: '📘' },
          { name: 'Java', proficiency: 'Intermediate', icon: '☕' },
          { name: 'C', proficiency: 'Intermediate', icon: '🔧' },
          { name: 'PHP', proficiency: 'Intermediate', icon: '🐘' },
          { name: 'HTML5', proficiency: 'Expert', icon: '🌐' },
          { name: 'CSS3', proficiency: 'Expert', icon: '🎨' },
        ],
      },
      {
        title: 'Frameworks & Libraries',
        skills: [
          { name: 'React', proficiency: 'Advanced', icon: '⚛️' },
          { name: 'SvelteKit', proficiency: 'Advanced', icon: '🔥' },
          { name: 'Node.js', proficiency: 'Advanced', icon: '📦' },
          { name: 'Express.js', proficiency: 'Advanced', icon: '🚂' },
          { name: 'Fastify', proficiency: 'Advanced', icon: '⚡' },
          { name: 'Socket.IO', proficiency: 'Advanced', icon: '🔌' },
          { name: 'Prisma ORM', proficiency: 'Advanced', icon: '🔷' },
          { name: 'Firebase', proficiency: 'Intermediate', icon: '🔥' },
          { name: 'Tailwind CSS', proficiency: 'Advanced', icon: '🎨' },
          { name: 'spaCy', proficiency: 'Intermediate', icon: '🤖' },
        ],
      },
      {
        title: 'Databases',
        skills: [
          { name: 'SQL', proficiency: 'Advanced', icon: '🗄️' },
          { name: 'PostgreSQL', proficiency: 'Advanced', icon: '🐘' },
          { name: 'MongoDB', proficiency: 'Advanced', icon: '🍃' },
          { name: 'Supabase (Postgres with RLS)', proficiency: 'Intermediate', icon: '⚡' },
        ],
      },
      {
        title: 'Web Development',
        skills: [
          { name: 'MERN Stack', proficiency: 'Advanced', icon: '📚' },
          { name: 'REST APIs', proficiency: 'Advanced', icon: '🔌' },
          { name: 'WebSocket / Real-time Communication', proficiency: 'Advanced', icon: '⚡' },
          { name: 'JWT Authentication', proficiency: 'Advanced', icon: '🔐' },
          { name: 'Stripe & SendGrid integrations', proficiency: 'Advanced', icon: '💳' },
          { name: 'WordPress basics', proficiency: 'Beginner', icon: '📝' },
        ],
      },
      {
        title: 'Tools & Platforms',
        skills: [
          { name: 'Git', proficiency: 'Advanced', icon: '🔀' },
          { name: 'GitHub', proficiency: 'Advanced', icon: '🐙' },
          { name: 'VS Code', proficiency: 'Expert', icon: '💻' },
          { name: 'PyCharm', proficiency: 'Advanced', icon: '🐍' },
          { name: 'Google Colab', proficiency: 'Advanced', icon: '📊' },
          { name: 'CoPilot', proficiency: 'Advanced', icon: '🤖' },
          { name: 'Docker', proficiency: 'Intermediate', icon: '🐳' },
          { name: 'Render', proficiency: 'Advanced', icon: '☁️' },
          { name: 'Hostinger', proficiency: 'Intermediate', icon: '🌐' },
          { name: 'Zapier', proficiency: 'Intermediate', icon: '⚙️' },
          { name: 'Storyblok CMS', proficiency: 'Intermediate', icon: '📄' },
          { name: 'Vercel', proficiency: 'Advanced', icon: '▲' },
          { name: 'pnpm', proficiency: 'Advanced', icon: '📦' },
        ],
      },
      {
        title: 'Cloud & Infrastructure',
        skills: [
          { name: 'Azure Functions', proficiency: 'Beginner', icon: '☁️' },
          { name: 'Kubernetes (basic familiarity)', proficiency: 'Beginner', icon: '⎈' },
          { name: 'Serverless deployment', proficiency: 'Intermediate', icon: '⚡' },
        ],
      },
    ],
  },

  {
    id: 'ai-data-automation',
    title: 'AI, Data & Automation',
    icon: '🤖',
    subcategories: [
      {
        title: 'AI/LLM Tools',
        skills: [
          { name: 'ChatGPT', proficiency: 'Expert', icon: '🤖' },
          { name: 'Groq API', proficiency: 'Advanced', icon: '⚡' },
          { name: 'Grok', proficiency: 'Advanced', icon: '🔮' },
          { name: 'Claude', proficiency: 'Advanced', icon: '💬' },
          { name: 'Perplexity Pro', proficiency: 'Advanced', icon: '🔍' },
          { name: 'AI image generation tools', proficiency: 'Advanced', icon: '🎨' },
        ],
      },
      {
        title: 'Automation',
        skills: [
          { name: 'Flask API integration', proficiency: 'Advanced', icon: '🔧' },
          { name: 'Content scheduling', proficiency: 'Advanced', icon: '📅' },
          { name: 'RSS/YouTube/Twitter monitoring', proficiency: 'Advanced', icon: '📡' },
        ],
      },
      {
        title: 'Data Analysis',
        skills: [
          { name: 'Sentiment analysis', proficiency: 'Advanced', icon: '😊' },
          { name: 'SEO keyword research', proficiency: 'Advanced', icon: '🔍' },
          { name: 'KPI tracking', proficiency: 'Advanced', icon: '📊' },
          { name: 'Reinforcement learning concepts', proficiency: 'Intermediate', icon: '🎮' },
        ],
      },
    ],
  },

  {
    id: 'marketing-growth',
    title: 'Digital Marketing & Growth',
    icon: '📈',
    subcategories: [
      {
        title: 'SEO & Content Marketing',
        skills: [
          { name: 'Keyword research', proficiency: 'Advanced', icon: '🔑' },
          { name: 'Internal/external linking strategies', proficiency: 'Advanced', icon: '🔗' },
          { name: 'Blog/article optimization', proficiency: 'Advanced', icon: '📝' },
          { name: 'Funnel analysis', proficiency: 'Intermediate', icon: '🎯' },
        ],
      },
      {
        title: 'Social Media Management',
        skills: [
          { name: 'Instagram', proficiency: 'Expert', icon: '📸' },
          { name: 'TikTok', proficiency: 'Advanced', icon: '🎵' },
          { name: 'LinkedIn', proficiency: 'Advanced', icon: '💼' },
          { name: 'Reddit engagement strategies', proficiency: 'Intermediate', icon: '🔄' },
        ],
      },
      {
        title: 'Content Creation',
        skills: [
          { name: 'Video editing (CapCut, FL Studio)', proficiency: 'Advanced', icon: '🎬' },
          { name: 'AI-generated visuals', proficiency: 'Advanced', icon: '🖼️' },
          { name: 'Canva', proficiency: 'Expert', icon: '🎨' },
          { name: 'Copywriting', proficiency: 'Advanced', icon: '✍️' },
          { name: 'Blog drafting', proficiency: 'Advanced', icon: '📰' },
        ],
      },
      {
        title: 'Ads & Campaigns',
        skills: [
          { name: 'Google Ads', proficiency: 'Intermediate', icon: '🎯' },
          { name: 'Meta Business Suite (campaign setup and analysis)', proficiency: 'Advanced', icon: '📊' },
        ],
      },
      {
        title: 'Email Marketing',
        skills: [
          { name: 'Automated flows', proficiency: 'Advanced', icon: '📧' },
          { name: 'Newsletters', proficiency: 'Advanced', icon: '📬' },
          { name: 'Customer engagement using SendGrid', proficiency: 'Advanced', icon: '💌' },
        ],
      },
    ],
  },

  {
    id: 'business-skills',
    title: 'Customer-Facing & Business Skills',
    icon: '💼',
    subcategories: [
      {
        title: 'Customer Experience',
        skills: [
          { name: 'Client support', proficiency: 'Advanced', icon: '🤝' },
          { name: 'Troubleshooting', proficiency: 'Advanced', icon: '🔧' },
          { name: 'Service excellence (SPAR, Nisa Local, UWEAR)', proficiency: 'Advanced', icon: '⭐' },
        ],
      },
      {
        title: 'Team Collaboration',
        skills: [
          { name: 'Agile ceremonies', proficiency: 'Intermediate', icon: '🔄' },
          { name: 'Sprint planning', proficiency: 'Intermediate', icon: '📋' },
          { name: 'Retrospectives', proficiency: 'Intermediate', icon: '🔙' },
          { name: 'Stakeholder communication', proficiency: 'Advanced', icon: '💬' },
        ],
      },
      {
        title: 'Project Management',
        skills: [
          { name: 'ClickUp', proficiency: 'Intermediate', icon: '✅' },
          { name: 'Time-sensitive execution', proficiency: 'Advanced', icon: '⏱️' },
        ],
      },
      {
        title: 'Leadership & Communication',
        skills: [
          { name: 'Supervising teams', proficiency: 'Intermediate', icon: '👥' },
          { name: 'Guiding customers through technical and service workflows', proficiency: 'Advanced', icon: '🧭' },
          { name: 'Presenting data-driven solutions', proficiency: 'Advanced', icon: '📊' },
        ],
      },
    ],
  },

  {
    id: 'creative-research',
    title: 'Creative & Research-Oriented',
    icon: '✨',
    subcategories: [
      {
        title: 'Content Writing',
        skills: [
          { name: 'Articles', proficiency: 'Advanced', icon: '📄' },
          { name: 'Poetry', proficiency: 'Advanced', icon: '📜' },
          { name: 'Cultural/spiritual writings', proficiency: 'Expert', icon: '🕉️' },
          { name: 'Technical reviews', proficiency: 'Advanced', icon: '🔬' },
        ],
      },
      {
        title: 'Academic Research',
        skills: [
          { name: 'Reinforcement learning applications in high-frequency trading', proficiency: 'Advanced', icon: '📊' },
          { name: 'Algorithmic adaptability', proficiency: 'Intermediate', icon: '⚙️' },
          { name: 'Ethical analysis', proficiency: 'Advanced', icon: '⚖️' },
        ],
      },
      {
        title: 'Brand Development',
        skills: [
          { name: 'Built Bhairav Aaradhyaa from scratch with integrated strategy (SEO + content + community building)', proficiency: 'Expert', icon: '🚀' },
        ],
      },
    ],
  },
];

// Helper functions
export const getAllSkills = () => {
  const allSkills = [];
  skillCategories.forEach(category => {
    category.subcategories.forEach(sub => {
      allSkills.push(...sub.skills);
    });
  });
  return allSkills;
};

export const getSkillsByProficiency = (proficiency) => {
  return getAllSkills().filter(skill => skill.proficiency === proficiency);
};

export const getSkillCategoryById = (id) => skillCategories.find(cat => cat.id === id);
