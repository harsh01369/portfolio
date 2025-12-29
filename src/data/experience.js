// Experience and Education data centralized
export const education = [
  {
    id: 'lancaster-uni',
    degree: 'BSc (Hons) Computer Science',
    institution: 'Lancaster University',
    location: 'Lancaster, UK',
    period: '2022 - 2024',
    description: 'Graduated with honors, focusing on full-stack development, AI/ML, and software engineering principles.',
    achievements: [
      'Specialized in Reinforcement Learning and AI applications',
      'Completed dissertation on High-Frequency Trading algorithms',
      'Active participant in coding competitions and hackathons',
    ],
  },
];

export const experience = [
  {
    id: 'uwear-uk',
    title: 'Junior Web Developer',
    company: 'UWEAR UK',
    location: 'Remote',
    period: 'September 2024 - Present',
    type: 'Full-time',
    description: 'Full-stack development role building and maintaining e-commerce platform from scratch.',
    responsibilities: [
      'Designed and developed complete MERN stack e-commerce platform',
      'Implemented secure payment processing with Stripe integration',
      'Built admin dashboard for product and order management',
      'Integrated SendGrid for automated email marketing campaigns',
      'Implemented JWT authentication and user management system',
      'Developed real-time inventory and sales analytics features',
    ],
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Stripe', 'SendGrid', 'JWT', 'Tailwind CSS'],
    current: true,
  },
  {
    id: 'content-creator',
    title: 'Content Creator',
    company: 'Self-Employed',
    location: 'Remote',
    period: 'April 2025 - Present',
    type: 'Self-employed',
    description: 'Built and scaled Bhairav Aaradhyaa digital platform from 0 to 700K monthly reach organically.',
    responsibilities: [
      'Create daily content (reels, posts, stories) focused on spirituality and philosophy',
      'Grew audience from 0 to 6,000+ followers organically without paid ads',
      'Achieved 700K+ monthly reach through strategic SEO and content optimization',
      'Manage content strategy, video editing, graphic design, and community engagement',
      'Utilize AI tools for content creation, image generation, and voiceovers',
      'Implement data-driven growth strategies using analytics and trend analysis',
    ],
    technologies: ['CapCut', 'PicsArt', 'Canva', 'Adobe Creative Suite', 'AI Tools', 'Social Media Marketing', 'SEO'],
    current: true,
  },
  {
    id: 'kpmg',
    title: 'Work Experience Program Participant',
    company: 'KPMG',
    location: 'UK',
    period: 'March 2024 - April 2024',
    type: 'Internship',
    description: 'Gained exposure to professional consulting environment and business processes.',
    responsibilities: [
      'Participated in team collaboration and agile ceremonies',
      'Learned about stakeholder communication and project management',
      'Exposed to enterprise-level software development practices',
      'Developed understanding of business analysis and consulting workflows',
    ],
    technologies: ['Agile', 'Project Management', 'Team Collaboration'],
    current: false,
  },
];

// Helper functions
export const getCurrentExperience = () => experience.filter(exp => exp.current);
export const getAllExperience = () => experience;
export const getExperienceById = (id) => experience.find(exp => exp.id === id);
