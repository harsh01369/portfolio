![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

# Portfolio

Personal portfolio website showcasing projects, skills, and experience.

[Live Site](https://portfoliowebsite-psi-sepia.vercel.app)

## Tech Stack

| Tech | Purpose |
|------|---------|
| React 19 | UI framework |
| Tailwind CSS | Utility-first styling with custom design tokens |
| Framer Motion | Scroll-triggered animations and page transitions |
| React Router v7 | Client-side routing with lazy-loaded pages |
| EmailJS | Contact form email delivery |
| Vercel | Hosting and deployment |

## Sections

**Hero.** Animated landing with rotating taglines, floating orbs, and stats grid (projects, reach, technologies, experience).

**About.** Bio, education (BSc Computer Science, Lancaster University), and a searchable skills section organized into 5 categories with proficiency levels.

**Projects.** Filterable project grid with category tabs. Each project opens a modal with image carousel, full description, and tech stack. Categories: Full Stack, AI/Automation, AI/ML, Digital Marketing.

**Experience.** Alternating timeline layout showing education and work history with technology tags and responsibility lists.

**Contact.** Contact form (EmailJS integration) with email, phone (UK + India), and social links.

## Design

Navy blue (#0066FF) and gold (#FFC300) color palette. Custom animations: fade-in, slide-in, scale-in, float, gradient-shift. Glassmorphism effects with backdrop blur. Responsive mobile-first layout. Custom scrollbar styling.

## Getting Started

```bash
git clone https://github.com/harsh01369/portfolio.git
cd portfolio
npm install
npm start
# Opens at http://localhost:3000
```

## Deployment

Hosted on Vercel. Pushes to main trigger automatic deployments.
