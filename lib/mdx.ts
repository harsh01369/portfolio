import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  content: string;
}

export interface BlogFrontmatter {
  title: string;
  date: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  readingTime?: string;
}

function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((filename) => {
    const slug = filename.replace(".mdx", "");
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const frontmatter = data as BlogFrontmatter;

    return {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      description: frontmatter.excerpt || frontmatter.description || "",
      tags: frontmatter.tags || [],
      readingTime: frontmatter.readingTime || calculateReadingTime(content),
      content,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const frontmatter = data as BlogFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    description: frontmatter.excerpt || frontmatter.description || "",
    tags: frontmatter.tags || [],
    readingTime: frontmatter.readingTime || calculateReadingTime(content),
    content,
  };
}
