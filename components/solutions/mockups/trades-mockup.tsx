"use client";

import { useState } from "react";

const problems = [
  { name: "Leaking Pipe", icon: "💧", urgent: true },
  { name: "Boiler Not Working", icon: "🔥", urgent: true },
  { name: "No Hot Water", icon: "🚿", urgent: true },
  { name: "Blocked Drain", icon: "🚽", urgent: true },
  { name: "Radiator Issue", icon: "🌡️", urgent: false },
  { name: "Tap Replacement", icon: "🔧", urgent: false },
  { name: "Bathroom Fitting", icon: "🛁", urgent: false },
  { name: "General Plumbing", icon: "🔩", urgent: false },
];

const services = [
  { name: "Emergency Callout", price: "£85", desc: "call-out fee, 24/7", tag: "🚨 Emergency" },
  { name: "Boiler Repair", price: "from £120", desc: "diagnosis + repair", tag: "" },
  { name: "Boiler Installation", price: "from £1,800", desc: "supply + fit, warranty", tag: "Popular" },
  { name: "Bathroom Fitting", price: "from £2,500", desc: "full design + install", tag: "" },
  { name: "Power Flush", price: "£350", desc: "full system clean", tag: "" },
  { name: "Leak Detection", price: "£95", desc: "thermal imaging", tag: "" },
];

const recentJobs = [
  { title: "Emergency Boiler Repair", location: "Didsbury, M20", time: "Same day", review: "Came within the hour. Fixed our boiler before bedtime. Absolute lifesaver!", reviewer: "Mrs. Thompson", rating: 5 },
  { title: "Full Bathroom Refit", location: "Chorlton, M21", time: "5 days", review: "Transformed our dated bathroom into something out of a magazine. Incredible attention to detail.", reviewer: "David & Sarah K.", rating: 5 },
  { title: "Central Heating Install", location: "Withington, M20", time: "2 days", review: "Honest quote, clean work, no hidden extras. Will use again.", reviewer: "James P.", rating: 5 },
];

export default function TradesMockup() {
  const [urgency, setUrgency] = useState("this-week");
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"quote" | "services" | "reviews">("quote");

  return (
    <div className="bg-white text-[#0f172a] font-sans">
      {/* Emergency Top Bar */}
      <div className="bg-[#DC2626] text-white text-[10px] font-bold px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>24/7 EMERGENCY CALLOUTS</span>
        </div>
        <button className="px-2.5 py-0.5 bg-white text-[#DC2626] rounded font-bold text-[9px]">CALL NOW</button>
      </div>

      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e2e8f0] bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D97706] flex items-center justify-center">
            <span className="text-white text-sm font-bold">S&S</span>
          </div>
          <div>
            <span className="font-bold text-sm text-[#0f172a]">Smith & Son</span>
            <span className="text-[9px] text-[#94a3b8] block leading-none">Plumbing & Heating</span>
          </div>
        </div>
        <a href="tel:08001234567" className="flex items-center gap-1 px-3 py-1.5 bg-[#D97706] text-white text-[10px] font-bold rounded-lg">
          📞 0800 123 456
        </a>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-5 py-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D97706]/20 rounded-full blur-3xl" />
        <h1 className="text-xl font-black leading-tight relative">
          Plumbing Emergency?<br />
          <span className="text-[#D97706]">We&apos;re There in 60 Minutes.</span>
        </h1>
        <p className="text-xs text-[#94a3b8] mt-2">Manchester&apos;s most trusted plumber. Gas Safe registered. No call-out charge for booked appointments.</p>
        <div className="flex gap-3 mt-5">
          <button className="px-5 py-2.5 bg-[#D97706] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#D97706]/25">
            Get Free Quote
          </button>
          <button className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-xl border border-white/20">
            Our Services
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="px-5 py-3 bg-[#fefce8] border-y border-[#fde68a]/50">
        <div className="flex items-center justify-between">
          {[
            { icon: "🛡️", text: "Gas Safe" },
            { icon: "✅", text: "Checkatrade 9.8" },
            { icon: "🔒", text: "Fully Insured" },
            { icon: "⭐", text: "4.9 Stars" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-xs">{b.icon}</span>
              <span className="text-[9px] font-semibold text-[#92400e]">{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="px-5 pt-4">
        <div className="flex gap-1 bg-[#f1f5f9] rounded-xl p-1">
          {(["quote", "services", "reviews"] as const).map((v) => (
            <button key={v} onClick={() => setActiveView(v)}
              className={`flex-1 py-2 text-[10px] font-semibold rounded-lg capitalize transition-all ${
                activeView === v ? "bg-white text-[#D97706] shadow-sm" : "text-[#64748b]"
              }`}>
              {v === "quote" ? "Free Quote" : v}
            </button>
          ))}
        </div>
      </div>

      {/* Quote Form */}
      {activeView === "quote" && (
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-[#475569] block mb-2">What&apos;s the problem?</label>
            <div className="grid grid-cols-4 gap-1.5">
              {problems.map((p) => (
                <button key={p.name} onClick={() => setSelectedProblem(p.name)}
                  className={`p-2 rounded-xl text-center transition-all ${
                    selectedProblem === p.name
                      ? "bg-[#D97706] text-white shadow-sm"
                      : "bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#D97706]"
                  }`}>
                  <span className="text-lg block">{p.icon}</span>
                  <span className="text-[8px] font-medium block mt-0.5 leading-tight">{p.name}</span>
                  {p.urgent && <span className="text-[7px] text-red-500 font-bold">URGENT</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#475569] block mb-2">How urgent is this?</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "emergency", l: "Emergency", sub: "Within 1 hour", c: "#DC2626" },
                { v: "this-week", l: "This Week", sub: "Flexible timing", c: "#D97706" },
                { v: "flexible", l: "Not Urgent", sub: "Best price", c: "#059669" },
              ].map((o) => (
                <button key={o.v} onClick={() => setUrgency(o.v)}
                  className={`p-3 rounded-xl text-center border-2 transition-all ${
                    urgency === o.v ? "text-white" : "border-[#e2e8f0] text-[#475569]"
                  }`}
                  style={{
                    backgroundColor: urgency === o.v ? o.c : "transparent",
                    borderColor: urgency === o.v ? o.c : undefined,
                  }}>
                  <p className="text-[10px] font-bold">{o.l}</p>
                  <p className="text-[8px] mt-0.5 opacity-70">{o.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#475569] block mb-1">Upload a photo (helps us quote faster)</label>
            <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-5 text-center cursor-pointer hover:border-[#D97706] transition-colors">
              <p className="text-2xl mb-1">📸</p>
              <p className="text-[10px] text-[#475569] font-medium">Tap to take photo or upload</p>
              <p className="text-[8px] text-[#94a3b8]">This helps us give you a more accurate quote</p>
            </div>
          </div>

          <button className="w-full py-3.5 bg-gradient-to-r from-[#D97706] to-[#b45309] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#D97706]/25">
            Get My Free Quote
          </button>
          <p className="text-[8px] text-[#94a3b8] text-center">No obligation. We respond within 15 minutes.</p>
        </div>
      )}

      {/* Services */}
      {activeView === "services" && (
        <div className="px-5 py-4 space-y-2">
          {services.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#fafbfc] border border-[#f1f5f9] hover:border-[#D97706]/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-[#0f172a]">{s.name}</p>
                  {s.tag && (
                    <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                      s.tag.includes("Emergency") ? "bg-red-100 text-red-600" : "bg-[#fef3c7] text-[#92400e]"
                    }`}>{s.tag}</span>
                  )}
                </div>
                <p className="text-[9px] text-[#94a3b8]">{s.desc}</p>
              </div>
              <p className="text-xs font-bold text-[#D97706] ml-3">{s.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {activeView === "reviews" && (
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#fffbeb] to-[#fef3c7]">
            <div>
              <p className="text-3xl font-bold text-[#D97706]">4.9</p>
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-500 text-xs">★</span>)}</div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0f172a]">Checkatrade Verified</p>
              <p className="text-[10px] text-[#475569]">89 reviews | 500+ jobs completed</p>
            </div>
          </div>
          {recentJobs.map((j, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#fafbfc] border border-[#f1f5f9]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-[#D97706]">{j.title}</p>
                <p className="text-[8px] text-[#94a3b8]">{j.location}</p>
              </div>
              <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(k => <span key={k} className="text-yellow-500 text-[9px]">★</span>)}</div>
              <p className="text-[10px] text-[#475569] italic leading-relaxed">&ldquo;{j.review}&rdquo;</p>
              <p className="text-[9px] text-[#94a3b8] mt-1">- {j.reviewer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-4 bg-[#0f172a] text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold">Smith & Son Plumbing</p>
            <p className="text-[8px] text-[#94a3b8]">Serving Manchester since 2012</p>
          </div>
          <div className="flex gap-1.5">
            {["Gas Safe", "CIPHE"].map((b) => (
              <span key={b} className="text-[7px] px-1.5 py-0.5 rounded border border-[#334155] text-[#94a3b8]">{b}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
