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
  jobTitle: "Full Stack Developer & AI Engineer",
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
};
