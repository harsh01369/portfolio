"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { IndustryConfig, SolutionConfig } from "@/data/solutions-config";
import Icon from "./icon";

interface Props { industry: IndustryConfig; solution: SolutionConfig; }

export default function SolutionContactForm({ industry, solution }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ businessName: "", need: solution.slug as string, email: "", phone: "", website: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/solution-contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, industry: industry.slug, solution: solution.slug }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ businessName: "", need: solution.slug, email: "", phone: "", website: "", message: "" });
    } catch { setStatus("error"); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-shadow";

  return (
    <section id="contact-form" className="py-20" style={{ backgroundColor: industry.accentLight }}>
      <div className="mx-auto max-w-2xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>Get Started</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-2">Ready to Talk It Through?</h2>
          <p className="text-[#475569] mb-8">A free, no-pressure call. I&apos;ll look at your online presence and show you exactly what&apos;s possible.</p>
        </motion.div>
        {status === "sent" ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-lg border border-[#e2e8f0] bg-white p-10 text-center">
            <Icon name="check" className="w-10 h-10 mx-auto mb-4" style={{ color: industry.accentColor }} />
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">Request Sent</h3>
            <p className="text-sm text-[#475569]">I&apos;ll review your business and get in touch within 24 hours.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-lg border border-[#e2e8f0] bg-white p-8 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-[#0f172a] mb-1">Business Name *</label>
                <input id="businessName" required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="Your Business Name" />
              </div>
              <div>
                <label htmlFor="need" className="block text-sm font-medium text-[#0f172a] mb-1">What You Need *</label>
                <select id="need" required value={form.need} onChange={(e) => setForm({ ...form, need: e.target.value })}
                  className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties}>
                  <option value="ai-chatbot">AI Chatbot</option>
                  <option value="booking-system">Booking System</option>
                  <option value="speed-optimization">Speed Optimization</option>
                  <option value="website-rebuild">Website Rebuild</option>
                  <option value="review-system">Review System</option>
                </select>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0f172a] mb-1">Email *</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="you@business.com" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#0f172a] mb-1">Phone (optional)</label>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="07xxx xxxxxx" />
              </div>
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-[#0f172a] mb-1">Current Website (optional)</label>
              <input id="website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="https://yourbusiness.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#0f172a] mb-1">Tell me about your needs (optional)</label>
              <textarea id="message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputCls} resize-none`} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="What's the biggest problem with your current setup?" />
            </div>
            <button type="submit" disabled={status === "sending"}
              className="w-full py-3.5 rounded-md text-white font-bold text-sm uppercase tracking-wide hover:opacity-90 disabled:opacity-60 transition-opacity" style={{ backgroundColor: industry.accentColor }}>
              {status === "sending" ? "Sending..." : "Send My Request"}
            </button>
            {status === "error" && <p className="text-sm text-red-500 text-center">Something went wrong. Please try again.</p>}
            <p className="text-xs text-[#94a3b8] text-center flex items-center justify-center gap-1.5">
              <Icon name="lock" className="w-3.5 h-3.5" />
              Your information is never shared.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}