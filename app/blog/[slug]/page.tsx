import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { createMetadata, createJsonLd, blogPostJsonLd } from "@/lib/metadata";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getPostBySlug(slug);
    if (!post) return {};
    return createMetadata({
      title: post.title,
      description: post.description,
      path: `/blog/${post.slug}`,
    });
  });
}

function Code({ children, ...props }: React.ComponentProps<"code">) {
  const isInline = !props.className;
  if (isInline) {
    return (
      <code className="rounded bg-surface-hover px-1.5 py-0.5 text-sm font-mono text-accent-hover">
        {children}
      </code>
    );
  }

  return (
    <code className="block overflow-x-auto rounded-lg bg-surface border border-border p-4 text-sm font-mono leading-relaxed">
      {children}
    </code>
  );
}

const mdxComponents = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1
      className="mt-10 mb-4 text-2xl font-bold tracking-tight text-text-primary"
      {...props}
    />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-8 mb-3 text-xl font-semibold tracking-tight text-text-primary"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="mt-6 mb-2 text-lg font-semibold text-text-primary"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-4 text-text-secondary leading-relaxed" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-text-secondary" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="mb-4 ml-6 list-decimal space-y-1 text-text-secondary"
      {...props}
    />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mb-4 border-l-2 border-accent pl-4 text-text-muted italic"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre className="mb-4 overflow-x-auto" {...props} />
  ),
  code: Code,
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-border" />,
  strong: (props: React.ComponentProps<"strong">) => (
    <strong className="font-semibold text-text-primary" {...props} />
  ),
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = blogPostJsonLd({
    title: post.title,
    description: post.description,
    date: post.date,
    slug: post.slug,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={createJsonLd(jsonLd)}
      />

      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <header className="mb-10">
          <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-lg text-text-secondary">{post.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-surface-hover px-2.5 py-0.5 text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="blog-content">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </article>
    </>
  );
}
