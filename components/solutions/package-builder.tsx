"use client";

// Replaces the old static "one flat price" card and the separate contact form
// with a single interactive flow: pick modules (mix, match, or just one),
// watch the price update live with the bundle discount applied, then submit
// the request with exactly what was picked already attached. A lead landing
// here is self-qualified before Harsh ever sees it, not a generic "call me".

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { IndustryConfig, ModuleSlug } from "@/data/solutions-config";
import { packageModules, bonusModule, getBundleDiscountPct } from "@/data/solutions-config";
import Icon, { IconName } from "./icon";

const MODULE_ICONS: Record<ModuleSlug, IconName> = {
  website: "mobile",
  "ai-receptionist": "chat",
  "smart-booking": "calendar",
  "speed-optimization": "route",
};

export default function PackageBuilder({ industry }: { industry: IndustryConfig }) {
  const tier = industry.tier;
  const [selected, setSelected] = useState<Set<ModuleSlug>>(new Set());
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ businessName: "", email: "", phone: "", website: "", message: "" });

  function toggle(slug: ModuleSlug) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }

  const summary = useMemo(() => {
    const chosen = packageModules.filter((m) => selected.has(m.slug));
    const discountPct = getBundleDiscountPct(chosen.length);
    const rawOneTime = chosen.reduce((sum, m) => sum + (m.oneTimeFrom?.[tier] ?? 0) + (m.setup?.[tier] ?? 0), 0);
    const rawMonthly = chosen.reduce((sum, m) => sum + (m.monthly?.[tier] ?? 0), 0);
    const discountMult = (100 - discountPct) / 100;
    const hasWebsite = selected.has("website");
    return {
      chosen,
      discountPct,
      oneTime: Math.round(rawOneTime * discountMult),
      monthly: Math.round(rawMonthly * discountMult),
      unlockedBonus: chosen.length >= 4,
      hasWebsite,
    };
  }, [selected, tier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.chosen.length === 0) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/solution-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          need: summary.chosen.map((m) => m.name).join(" + "),
          industry: industry.slug,
          solution: "package-builder",
          modules: summary.chosen.map((m) => m.slug),
          estimate: { oneTime: summary.oneTime, monthly: summary.monthly, discountPct: summary.discountPct, bonusUnlocked: summary.unlockedBonus },
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ businessName: "", email: "", phone: "", website: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-shadow";

  return (
    <section id="contact-form" className="py-20" style={{ backgroundColor: industry.accentLight }}>
      <div className="mx-auto max-w-3xl px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>Build Your Package</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-2">Pick What You Actually Need</h2>
          <p className="text-[#475569] mb-8">Mix and match, or just take one. The more you bundle, the more you save, and going all-in unlocks Review Requests free.</p>
        </motion.div>

        {/* Module checkboxes */}
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          {packageModules.map((m) => {
            const isChosen = selected.has(m.slug);
            const priceLine = m.setup
              ? `£${m.setup[tier]} setup + £${m.monthly![tier]}/mo`
              : m.monthly
              ? `£${m.monthly[tier]}/mo`
              : `from £${m.oneTimeFrom![tier].toLocaleString()} one-time`;
            return (
              <button
                key={m.slug}
                type="button"
                onClick={() => toggle(m.slug)}
                className="text-left p-4 rounded-lg border-2 transition-colors bg-white"
                style={{ borderColor: isChosen ? industry.accentColor : "#e2e8f0" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: isChosen ? industry.accentColor : industry.accentLight, color: isChosen ? "white" : industry.accentColor }}
                  >
                    <Icon name={MODULE_ICONS[m.slug]} className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0f172a]">{m.name}</p>
                    <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">{m.description}</p>
                    <p className="text-xs font-bold mt-1.5" style={{ color: industry.accentColor }}>{priceLine}</p>
                  </div>
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5"
                    style={{ borderColor: isChosen ? industry.accentColor : "#cbd5e1", backgroundColor: isChosen ? industry.accentColor : "transparent" }}
                  >
                    {isChosen && <Icon name="check" className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bonus module banner */}
        <div
          className="p-4 rounded-lg border-2 border-dashed mb-6 flex items-center gap-3 transition-opacity"
          style={{ borderColor: summary.unlockedBonus ? industry.accentColor : "#cbd5e1", opacity: summary.unlockedBonus ? 1 : 0.6 }}
        >
          <Icon name="star" className="w-5 h-5 shrink-0" style={{ color: summary.unlockedBonus ? industry.accentColor : "#94a3b8" }} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#0f172a]">
              {bonusModule.name} {summary.unlockedBonus ? "— unlocked free" : `— free at 4 modules (worth £${bonusModule.monthly[tier]}/mo)`}
            </p>
            <p className="text-xs text-[#64748b]">{bonusModule.description}</p>
          </div>
        </div>

        {/* Live price summary */}
        {summary.chosen.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-lg text-white mb-6" style={{ backgroundColor: industry.accentDark }}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60 mb-1">
                  {summary.chosen.length} module{summary.chosen.length > 1 ? "s" : ""} selected
                  {summary.discountPct > 0 && ` · ${summary.discountPct}% bundle discount applied`}
                </p>
                <p className="text-2xl font-bold">
                  {summary.oneTime > 0 && `£${summary.oneTime.toLocaleString()} one-time`}
                  {summary.oneTime > 0 && summary.monthly > 0 && " + "}
                  {summary.monthly > 0 && `£${summary.monthly}/mo`}
                </p>
                {summary.hasWebsite && <p className="text-xs text-white/50 mt-1">Website scope confirmed on your free call, this is a starting estimate.</p>}
              </div>
            </div>
          </motion.div>
        )}

        {status === "sent" ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-lg border border-[#e2e8f0] bg-white p-10 text-center">
            <Icon name="check" className="w-10 h-10 mx-auto mb-4" style={{ color: industry.accentColor }} />
            <h3 className="text-xl font-bold text-[#0f172a] mb-2">Request Sent</h3>
            <p className="text-sm text-[#475569]">I&apos;ll review your business and get in touch within 24 hours.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-lg border border-[#e2e8f0] bg-white p-8 space-y-5">
            {summary.chosen.length === 0 && (
              <p className="text-sm text-[#94a3b8] text-center py-2">Pick at least one module above to send your request.</p>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-[#0f172a] mb-1">Business Name *</label>
                <input id="businessName" required value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="Your Business Name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#0f172a] mb-1">Email *</label>
                <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="you@business.com" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-[#0f172a] mb-1">Phone (optional)</label>
                <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="07xxx xxxxxx" />
              </div>
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-[#0f172a] mb-1">Current Website (optional)</label>
                <input id="website" type="url" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className={inputCls} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="https://yourbusiness.com" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#0f172a] mb-1">Anything else? (optional)</label>
              <textarea id="message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={`${inputCls} resize-none`} style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties} placeholder="What's the biggest problem with your current setup?" />
            </div>
            <button type="submit" disabled={status === "sending" || summary.chosen.length === 0}
              className="w-full py-3.5 rounded-md text-white font-bold text-sm uppercase tracking-wide hover:opacity-90 disabled:opacity-40 transition-opacity" style={{ backgroundColor: industry.accentColor }}>
              {status === "sending" ? "Sending..." : summary.chosen.length > 0 ? "Send My Request" : "Pick a Module First"}
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