"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/mdx";

export default function LatestPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-5xl px-6 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.01 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <p className="text-sm font-medium text-accent mb-2">Blog</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
            Latest Writing
          </h2>
        </div>
        <Link
          href="/blog"
          className="group text-sm text-text-muted hover:text-accent transition-colors flex items-center gap-1"
        >
          All posts
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </motion.div>

      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.01 }}
          >
            <Link href={`/blog/${post.slug}`} className="group block">
              <div className="rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-border-hover hover:bg-surface-hover">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors truncate">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted line-clamp-1">
                      {post.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted shrink-0">
                    <span>{post.readingTime}</span>
                    <span>&middot;</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
