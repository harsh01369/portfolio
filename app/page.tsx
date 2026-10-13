import { projects } from "@/data/projects";
import { getAllPosts } from "@/lib/mdx";
import { createMetadata, createJsonLd, personJsonLd, websiteJsonLd } from "@/lib/metadata";
import MascotPortfolioHero from "@/components/mascot-portfolio-hero";
import FeaturedProjects from "@/components/featured-projects";
import StatsSection from "@/components/stats-section";
import LatestPosts from "@/components/latest-posts";

export const metadata = createMetadata({
  title: "Harsh Khetia | Full Stack Developer & AI Engineer",
  description:
    "Full Stack Developer and AI Engineer building scalable web applications, payment systems, and AI pipelines. Based in Manchester, UK.",
  path: "/",
});

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured);
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={createJsonLd(personJsonLd)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={createJsonLd(websiteJsonLd)}
      />

      <MascotPortfolioHero
        index="FS/AI"
        discipline="Full-stack & AI engineering"
        tagline="Ship it working"
        collection={["Selected", "Projects"]}
        reel={["Live case studies", "Full-stack & AI"]}
        year="2026"
        initials="HK"
        badge="Taking projects"
        line2="Full-Stack"
        line3="Dev"
        word="Ship"
        verticalTag="Systems"
        bracketed="AI"
        seekingLabel="Starting*"
        seeking="A new build"
        href="/contact"
        services={["Web apps", "Payment systems", "AI pipelines", "E-commerce"]}
        greetings={["Hi, I'm Harsh!", "Let's build something solid.", "Psst — I'm taking on projects.", "Okay you can stop clicking :)"]}
        accent="#14b8a6"
      />
      <FeaturedProjects projects={featuredProjects} />
      <StatsSection />
      <LatestPosts posts={latestPosts} />
    </>
  );
}
