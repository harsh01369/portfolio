import type { Metadata } from "next";

const BASE_URL = "https://harshkhetia.dev";

export function createMetadata({
  title,
  description,
  path = "",
  image,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${BASE_URL}${path}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      ...(image && { images: [{ url: image, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: url,
    },
  };
}

export function createJsonLd(data: Record<string, unknown>) {
  return {
    __html: JSON.stringify(data),
  };
}

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Harsh Khetia",
  url: BASE_URL,
  image: `${BASE_URL}/og-image.png`,
  jobTitle: "Full Stack Developer & AI Engineer",
  addressLocality: "Manchester",
  addressCountry: "GB",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University Academy 92 (Lancaster University)",
  },
  knowsAbout: [
    "React", "Next.js", "TypeScript", "Node.js", "Python",
    "PostgreSQL", "MongoDB", "Express", "AI/ML Pipelines", "Payment Integration",
  ],
  sameAs: [
    "https://github.com/harsh01369",
    "https://linkedin.com/in/harsh-khetia111",
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Harsh Khetia",
  url: BASE_URL,
  description:
    "Full Stack Developer and AI Engineer building scalable web applications, payment systems, and AI pipelines.",
  author: {
    "@type": "Person",
    name: "Harsh Khetia",
  },
};

export function blogPostJsonLd({
  title,
  description,
  date,
  slug,
}: {
  title: string;
  description: string;
  date: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    dateModified: date,
    url: `${BASE_URL}/blog/${slug}`,
    mainEntityOfPage: `${BASE_URL}/blog/${slug}`,
    image: `${BASE_URL}/og-image.png`,
    author: {
      "@type": "Person",
      name: "Harsh Khetia",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Harsh Khetia",
      url: BASE_URL,
    },
  };
}
