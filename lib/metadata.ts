import type { Metadata } from "next";

const BASE_URL = "https://www.harshkhetia.dev";

const DEFAULT_IMAGE = {
  url: "/og-card.png",
  width: 1200,
  height: 630,
  alt: "Harsh Khetia, full-stack and AI engineer",
};

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
  // A page's openGraph replaces the one in the root layout, so every field
  // the preview card needs has to be set here too.
  const card = image ? { url: image, width: 1200, height: 630, alt: title } : DEFAULT_IMAGE;
  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: "Harsh Khetia",
      title,
      description,
      url,
      images: [card],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [card.url],
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
  image: `${BASE_URL}/og-card.png`,
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
    image: `${BASE_URL}/og-card.png`,
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
