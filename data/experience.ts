export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  type: "work" | "education";
  description: string[];
  technologies?: string[];
  link?: string;
}

export const experiences: Experience[] = [
  {
    title: "Founder and Lead Developer",
    company: "Bhairav Aaradhyaa",
    location: "Manchester, UK",
    period: "Apr 2025 - Present",
    type: "work",
    description: [
      "Designed and shipped a full-stack spiritual tech platform with React 19, Express 5, PostgreSQL, Prisma, and Firebase Auth.",
      "Integrated dual payment processing: Stripe for international transactions and Instamojo for India-based users.",
      "Automated SEO indexing with a Puppeteer pipeline that pre-renders 192 pages to static HTML without an SSR framework.",
      "Developed a content automation pipeline that produced 3,500+ social media assets across 4 platforms with Brevo handling email delivery.",
      "Organic reach hit 700K+ monthly through automated content scheduling and data-driven publishing.",
    ],
    technologies: [
      "React 19",
      "Express 5",
      "PostgreSQL",
      "Prisma",
      "Firebase",
      "Stripe",
      "Instamojo",
      "Puppeteer",
    ],
    link: "https://bhairavaaradhyaa.com",
  },
  {
    title: "Web Developer",
    company: "UWEAR UK",
    location: "Manchester, UK",
    period: "Sep 2024 - Present",
    type: "work",
    description: [
      "Shipped a React 18 e-commerce storefront with product catalog, cart, checkout, and order management backed by MongoDB.",
      "Created an admin dashboard with Chart.js sales analytics, inventory tracking, and order processing workflows.",
      "Integrated Stripe payment processing, SendGrid transactional emails, and JWT authentication with role-based access control.",
      "Deployed frontend on Hostinger with Express backend on Render.",
    ],
    technologies: [
      "React",
      "Tailwind CSS",
      "Node.js",
      "MongoDB",
      "Stripe",
      "SendGrid",
      "Hostinger",
      "Render",
    ],
    link: "https://uwearuk.com",
  },
  {
    title: "IT Work Placement",
    company: "KPMG",
    location: "Remote",
    period: "Mar 2024 - Apr 2024",
    type: "work",
    description: [
      "Completed 4-week IT placement covering business analysis and technical problem-solving with senior consultants.",
    ],
    technologies: ["Business Analysis", "IT Consulting"],
  },
  {
    title: "Team Supervisor",
    company: "SPAR",
    location: "Manchester, UK",
    period: "Sep 2023 - Present",
    type: "work",
    description: [
      "Managed customer service operations handling 100+ daily interactions with 95% first-contact resolution.",
    ],
  },
  {
    title: "BSc (Hons) Computer Science",
    company: "University Academy 92 (Lancaster University)",
    location: "Manchester, UK",
    period: "Apr 2022 - Jul 2024",
    type: "education",
    description: [
      "Graduated with a 3.5/4.0 GPA. Studied software engineering, data structures, algorithms, and database systems.",
    ],
  },
];
