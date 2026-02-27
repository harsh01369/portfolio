"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/mdx";
import CardSpotlight from "./card-spotlight";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <CardSpotlight className="h-full rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-border-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-text-primary group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="mt-2 text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-md bg-white/5 border border-white/5 px-2 py-0.5 text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardSpotlight>
    </Link>
  );
}
