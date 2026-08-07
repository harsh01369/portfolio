import type { Metadata } from "next";
import Link from "next/link";
import { solutions } from "@/data/solutions-config";
import Icon from "@/components/solutions/icon";

export const metadata: Metadata = {
  title: "Solutions | AI-Powered Tools for Local Businesses",
  description: "Transform your local business with AI chatbots, booking systems, speed optimization, and modern website rebuilds.",
};

export default function SolutionsCatalog() {
  return (
    <div className="solutions-theme relative z-10">
      <div className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0f172a] mb-4">
              AI-Powered Solutions for Local Businesses
            </h1>
            <p className="text-lg text-[#475569] max-w-2xl mx-auto">
              Real working examples, built for your industry. See what&apos;s possible before you commit to anything.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <Link key={s.slug} href={`/solutions/${s.slug}`} className="group p-8 rounded-lg border border-[#e2e8f0] transition-colors hover:border-[#2563eb]">
                <div className="w-10 h-10 rounded-md flex items-center justify-center mb-4 bg-[#eff6ff] text-[#2563eb]">
                  <Icon name={s.icon} className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-[#2563eb] transition-colors">{s.title}</h2>
                <p className="text-sm text-[#475569] mb-4">{s.tagline}</p>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{s.description}</p>
                <div className="mt-6 flex items-center text-sm font-medium text-[#2563eb] group-hover:gap-2 transition-all">
                  See it live <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}