import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GridBackground from "@/components/grid-background";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harshkhetia.dev"),
  title: {
    default: "Harsh Khetia | Full Stack Developer",
    template: "%s | Harsh Khetia",
  },
  description:
    "Full Stack Developer and AI Engineer with experience building scalable web applications, payment systems, and AI pipelines. Based in the UK.",
  keywords: [
    "Harsh Khetia",
    "Full Stack Developer",
    "AI Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "Node.js",
  ],
  authors: [{ name: "Harsh Khetia" }],
  creator: "Harsh Khetia",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://harshkhetia.dev",
    siteName: "Harsh Khetia",
    title: "Harsh Khetia | Full Stack Developer",
    description:
      "Full Stack Developer and AI Engineer building scalable web applications, payment systems, and AI pipelines.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Harsh Khetia — Full-Stack Developer & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harsh Khetia | Full Stack Developer",
    description:
      "Full Stack Developer and AI Engineer building scalable web applications, payment systems, and AI pipelines.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-text-primary font-sans antialiased" suppressHydrationWarning>
        <div className="noise-overlay" />
        <GridBackground />
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
