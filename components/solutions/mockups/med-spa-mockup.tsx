"use client";

import { useState } from "react";

const categories = ["Injectables", "Skin", "Laser", "Wellness"];
const services: Record<string, { name: string; price: string; duration: string; popular?: boolean }[]> = {
  Injectables: [
    { name: "Botox", price: "from £180", duration: "30 min", popular: true },
    { name: "Dermal Filler", price: "from £220", duration: "45 min" },
    { name: "Lip Filler", price: "from £200", duration: "30 min" },
    { name: "Consultation", price: "Free", duration: "20 min" },
  ],
  Skin: [
    { name: "Chemical Peel", price: "from £75", duration: "45 min", popular: true },
    { name: "Microneedling", price: "from £120", duration: "1 hr" },
    { name: "HydraFacial", price: "£95", duration: "1 hr" },
    { name: "LED Light Therapy", price: "£45", duration: "30 min" },
  ],
  Laser: [
    { name: "Laser Hair Removal", price: "from £45/session", duration: "30 min", popular: true },
    { name: "Skin Resurfacing", price: "from £250", duration: "1 hr" },
    { name: "Vein Treatment", price: "from £150", duration: "45 min" },
  ],
  Wellness: [
    { name: "IV Vitamin Drip", price: "from £85", duration: "45 min" },
    { name: "B12 Injection", price: "£25", duration: "10 min" },
    { name: "Weight Loss Consult", price: "Free", duration: "30 min", popular: true },
  ],
};

const practitioners = [
  { name: "Dr. Sarah Lin", role: "Injectables", clients: "1,200+", emoji: "💉" },
  { name: "Mia Torres", role: "Skin Treatments", clients: "900+", emoji: "✨" },
];

export default function MedSpaMockup() {
  const [cat, setCat] = useState("Injectables");

  return (
    <div className="bg-white text-[#0f172a] font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#f3e4e8]/50 bg-white">
        <div>
          <span className="text-sm font-bold text-[#0f172a]" style={{ fontFamily: "Georgia, serif" }}>Radiance</span>
          <span className="text-[9px] text-[#A8677A] block leading-none">Aesthetics Clinic</span>
        </div>
        <button className="px-3 py-1.5 bg-[#A8677A] text-white text-[10px] font-semibold rounded-full shadow-sm shadow-[#A8677A]/25">
          Book Now
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf1f3] via-[#f3e4e8] to-[#ecd2da]" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#A8677A]/10 rounded-full blur-3xl" />
        <div className="relative px-5 py-10 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-[#f3e4e8] rounded-full px-3 py-1 mb-4">
            <span className="text-[10px] text-[#A8677A] font-medium">Richmond&apos;s Trusted Aesthetics Clinic</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
            Look Like the Best<br /><span className="text-[#A8677A]">Version of You</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-3 max-w-xs mx-auto">
            Board-certified practitioners, real results, and a clinic experience built around you.
          </p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
            <span className="text-[10px] text-[#64748b]">5.0/5 (150+ reviews)</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-5 pt-3 sticky top-0 bg-white z-10 border-b border-[#f3e4e8]/50">
        <div className="flex">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`flex-1 py-3 text-[10px] font-semibold transition-all ${
                cat === c
                  ? "text-[#A8677A] border-b-2 border-[#A8677A]"
                  : "text-[#94a3b8] hover:text-[#A8677A]"
              }`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Treatment Menu */}
      <div className="px-5 py-4">
        <div className="space-y-1">
          {services[cat]?.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#f3e4e8]/30 last:border-0 group">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-[#0f172a]">{s.name}</p>
                  {s.popular && (
                    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-[#faf1f3] text-[#A8677A]">Popular</span>
                  )}
                </div>
                <p className="text-[9px] text-[#94a3b8]">{s.duration}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#0f172a]">{s.price}</span>
                <button className="px-2.5 py-1 text-[9px] font-semibold text-[#A8677A] border border-[#A8677A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#faf1f3]">
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practitioners */}
      <div className="px-5 py-6 bg-gradient-to-b from-[#faf1f3] to-white">
        <h3 className="text-sm font-bold text-[#0f172a] mb-4" style={{ fontFamily: "Georgia, serif" }}>Our Practitioners</h3>
        <div className="grid grid-cols-2 gap-3">
          {practitioners.map((s, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white border border-[#f3e4e8] text-center shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#f3e4e8] to-[#ecd2da] flex items-center justify-center text-xl mb-2">{s.emoji}</div>
              <p className="text-xs font-semibold text-[#0f172a]">{s.name}</p>
              <p className="text-[9px] text-[#A8677A] font-medium">{s.role}</p>
              <p className="text-[8px] text-[#94a3b8] mt-0.5">{s.clients} clients</p>
              <button className="mt-2 w-full py-1.5 text-[9px] font-semibold bg-[#A8677A] text-white rounded-full">Book</button>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offer */}
      <div className="px-5 py-5">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#A8677A] to-[#7F4E5D] text-white text-center">
          <p className="text-[10px] uppercase tracking-widest opacity-80">New Client Offer</p>
          <p className="text-lg font-bold mt-1" style={{ fontFamily: "Georgia, serif" }}>Free Consultation</p>
          <p className="text-[10px] opacity-80 mt-1">Book online, no obligation</p>
          <button className="mt-3 px-5 py-2 bg-white text-[#A8677A] text-[10px] font-bold rounded-full">
            Claim Offer
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#0f172a] text-center">
        <p className="text-[9px] text-[#94a3b8]">Radiance Aesthetics | Richmond, VA</p>
      </div>

    </div>
  );
}