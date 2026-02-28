import { projects } from "@/data/projects";
import { getAllPosts } from "@/lib/mdx";
import { createMetadata, createJsonLd, personJsonLd, websiteJsonLd } from "@/lib/metadata";
import HeroSection from "@/components/hero-section";
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

      <HeroSection />
      <FeaturedProjects projects={featuredProjects} />
      <StatsSection />
      <LatestPosts posts={latestPosts} />
    </>
  );
}
