"use client";

import { motion } from "framer-motion";
import type { SolutionIndustryContent, IndustryConfig, SolutionConfig } from "@/data/solutions-config";
import Icon from "./icon";
import WhatsAppSimulator from "./whatsapp-simulator";
import BookingWidgetDemo from "./booking-widget-demo";

interface Props { content: SolutionIndustryContent; industry: IndustryConfig; solution: SolutionConfig; }

// Only the two solutions this demo directly proves get a live demo in the
// hero, and each gets the demo that matches what it's actually selling:
// ai-chatbot proves the conversational channel (WhatsApp/Instagram/Messenger),
// booking-system proves the website booking widget. Same underlying Smart
// Booking engine powers both in the real product, this just shows each
// solution's own front door instead of reusing one demo for both.
const CHAT_DEMO_SOLUTIONS = new Set(["ai-chatbot"]);
const BOOKING_DEMO_SOLUTIONS = new Set(["booking-system"]);

export default function SolutionHero({ content, industry, solution }: Props) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const showChatDemo = CHAT_DEMO_SOLUTIONS.has(solution.slug);
  const showBookingDemo = BOOKING_DEMO_SOLUTIONS.has(solution.slug);
  const showLiveDemo = showChatDemo || showBookingDemo;

  return (
    <section className="border-b border-[#e2e8f0]" style={showLiveDemo ? { backgroundColor: "#0b141a" } : undefined}>
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: industry.accentColor }}>
              Built for {industry.label} Businesses
            </p>
            <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight whitespace-pre-line ${showLiveDemo ? "text-white" : "text-[#0f172a]"}`}>
              {content.heroHeadline}
            </h1>
            <p className={`mt-6 text-lg leading-relaxed max-w-xl ${showLiveDemo ? "text-white/70" : "text-[#475569]"}`}>{content.heroSubheadline}</p>
            {showChatDemo && (
              <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5 max-w-xl">
                <p className="text-white/90 text-sm leading-relaxed">
                  <span className="font-semibold">This is an AI employee that lives inside WhatsApp, Instagram, and Messenger</span>,
                  the apps your customers already have open. It answers their questions and books them in, day or
                  night, without you touching your phone.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {["WhatsApp", "Instagram", "Messenger"].map((platform) => (
                    <span key={platform} className="px-3 py-1 rounded-full text-xs font-medium text-white/80 border border-white/20 bg-white/10">
                      {platform}
                    </span>
                  ))}
                  <span className="text-white/50 text-xs">try the real thing on the right →</span>
                </div>
              </div>
            )}
            {showBookingDemo && (
              <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/5 max-w-xl">
                <p className="text-white/90 text-sm leading-relaxed">
                  <span className="font-semibold">This is a live booking widget that lives on your website</span>,
                  the exact page a customer lands on from Google. They pick a service, pick a slot, and lock it in
                  themselves, no phone calls, no back-and-forth. The same calendar also powers booking straight
                  inside WhatsApp chat when paired with an AI Receptionist.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {["No App to Download", "Instant Confirmation", "Live Calendar"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium text-white/80 border border-white/20 bg-white/10">
                      {tag}
                    </span>
                  ))}
                  <span className="text-white/50 text-xs">try the real thing on the right →</span>
                </div>
              </div>
            )}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button onClick={() => scrollTo("contact-form")} className="px-7 py-3.5 rounded-md text-white font-bold text-sm uppercase tracking-wide transition-opacity hover:opacity-90" style={{ backgroundColor: industry.accentColor }}>
                Book a Free Call
              </button>
              <button onClick={() => scrollTo("mockup-section")} className={`px-7 py-3.5 rounded-md font-bold text-sm uppercase tracking-wide border-2 transition-colors hover:text-white ${showLiveDemo ? "border-white/30 text-white/90" : ""}`}
                style={showLiveDemo ? undefined : { borderColor: industry.accentColor, color: industry.accentColor }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = showLiveDemo ? "rgba(255,255,255,0.1)" : industry.accentColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                See the Site Demo
              </button>
            </div>
            {showChatDemo && (
              <p className="text-white/40 text-xs leading-relaxed max-w-md mt-6">
                This preview runs in your browser so you can test it instantly. The real version connects to your
                actual WhatsApp, Instagram, and Messenger accounts, and only ever answers questions, books
                appointments, and follows up, nothing else.
              </p>
            )}
            {showBookingDemo && (
              <p className="text-white/40 text-xs leading-relaxed max-w-md mt-6">
                This preview runs in your browser so you can test it instantly. The real version connects to your
                actual calendar, and only ever offers slots that are genuinely open, nothing gets double-booked.
              </p>
            )}
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}>
            {showChatDemo ? (
              <WhatsAppSimulator industry={industry} content={content} />
            ) : showBookingDemo ? (
              <BookingWidgetDemo industry={industry} />
            ) : (
              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center">
                <div className="w-12 h-12 mx-auto rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: industry.accentLight, color: industry.accentColor }}>
                  <Icon name={solution.icon} className="w-6 h-6" />
                </div>
                <p className="text-lg font-semibold text-[#0f172a]">{solution.title}</p>
                <p className="text-sm text-[#475569] mt-1">{solution.tagline}</p>
                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg border border-[#e2e8f0] p-4">
                    <p className="text-2xl font-bold" style={{ color: industry.accentColor }}>24/7</p>
                    <p className="text-xs text-[#94a3b8]">Availability</p>
                  </div>
                  <div className="rounded-lg border border-[#e2e8f0] p-4">
                    <p className="text-2xl font-bold" style={{ color: industry.accentColor }}>&lt;2s</p>
                    <p className="text-xs text-[#94a3b8]">Load Time</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
