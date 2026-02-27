import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import BlogCard from "@/components/blog-card";
import AnimatedPageHeader from "@/components/animated-page-header";
import { createMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Technical blog posts about full stack development, AI pipelines, payment systems, and software architecture.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <AnimatedPageHeader
        label="Writing"
        title="Blog"
        description="Writing about things I have built and lessons learned along the way."
      />

      {posts.length === 0 ? (
        <p className="text-text-secondary">No posts yet. Check back soon.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
