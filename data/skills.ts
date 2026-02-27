export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skills: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["Python", "TypeScript", "JavaScript (ES6+)", "SQL", "HTML5", "CSS3"],
  },
  {
    name: "Frontend",
    skills: [
      "React 19",
      "SvelteKit",
      "Svelte 5",
      "Tailwind CSS",
      "DaisyUI",
      "Framer Motion",
      "Vite",
    ],
  },
  {
    name: "Backend",
    skills: [
      "Node.js",
      "Express 5",
      "Fastify 5",
      "Flask",
      "REST APIs",
      "WebSocket",
      "Socket.IO",
    ],
  },
  {
    name: "AI / ML",
    skills: [
      "TensorFlow",
      "Hugging Face Transformers (BART)",
      "SpaCy",
      "VADER",
      "Groq LLM",
      "NLP",
    ],
  },
  {
    name: "Databases",
    skills: ["PostgreSQL", "MongoDB", "SQLite", "Prisma ORM", "Firebase"],
  },
  {
    name: "Tools & Deployment",
    skills: [
      "Git",
      "Docker",
      "Vercel",
      "Render",
      "Hostinger",
      "Puppeteer",
      "Stripe",
      "Brevo",
      "SendGrid",
      "pnpm",
      "Zod",
      "Vitest",
    ],
  },
];
