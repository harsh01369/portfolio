"use client";

import { useState } from "react";

const categories = ["Hair", "Nails", "Lashes", "Facial"];
const services: Record<string, { name: string; price: string; duration: string; popular?: boolean }[]> = {
  Hair: [
    { name: "Cut & Blowdry", price: "from £45", duration: "45 min" },
    { name: "Balayage", price: "from £120", duration: "2.5 hrs", popular: true },
    { name: "Full Colour", price: "from £85", duration: "2 hrs" },
    { name: "Highlights", price: "from £95", duration: "2 hrs" },
    { name: "Extensions", price: "from £250", duration: "3 hrs" },
    { name: "Keratin Treatment", price: "£180", duration: "2 hrs" },
  ],
  Nails: [
    { name: "Gel Manicure", price: "£35", duration: "45 min", popular: true },
    { name: "Acrylic Full Set", price: "£45", duration: "1 hr" },
    { name: "Nail Art", price: "from £10", duration: "20 min" },
    { name: "Spa Pedicure", price: "£45", duration: "1 hr" },
  ],
  Lashes: [
    { name: "Classic Full Set", price: "£55", duration: "1.5 hrs", popular: true },
    { name: "Volume Full Set", price: "£75", duration: "2 hrs" },
    { name: "Infills (2 week)", price: "£35", duration: "1 hr" },
    { name: "Lash Lift & Tint", price: "£40", duration: "45 min" },
  ],
  Facial: [
    { name: "Express Glow", price: "£35", duration: "30 min" },
    { name: "Deep Cleanse", price: "£55", duration: "1 hr", popular: true },
    { name: "Anti-Ageing", price: "£75", duration: "1 hr" },
    { name: "LED Light Therapy", price: "£45", duration: "30 min" },
  ],
};

const stylists = [
  { name: "Amy", role: "Colour Specialist", clients: "2,000+", emoji: "👩‍🦰" },
  { name: "Jade", role: "Nails & Lashes", clients: "1,500+", emoji: "💅" },
  { name: "Priya", role: "Styling & Extensions", clients: "1,800+", emoji: "💇‍♀️" },
  { name: "Sophie", role: "Skincare & Facials", clients: "900+", emoji: "✨" },
];

export default function SalonMockup() {
  const [cat, setCat] = useState("Hair");

  return (
    <div className="bg-white text-[#0f172a] font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#fce7f3]/50 bg-white">
        <div>
          <span className="text-sm font-bold text-[#0f172a]" style={{ fontFamily: "Georgia, serif" }}>Glow & Grace</span>
          <span className="text-[9px] text-[#DB2777] block leading-none">Beauty Salon</span>
        </div>
        <button className="px-3 py-1.5 bg-[#DB2777] text-white text-[10px] font-semibold rounded-full shadow-sm shadow-[#DB2777]/25">
          Book Now
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8]" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#DB2777]/10 rounded-full blur-3xl" />
        <div className="relative px-5 py-10 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-[#fce7f3] rounded-full px-3 py-1 mb-4">
            <span className="text-[10px] text-[#DB2777] font-medium">Manchester&apos;s #1 Rated Salon</span>
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
            Where Beauty Meets<br /><span className="text-[#DB2777]">Confidence</span>
          </h1>
          <p className="text-xs text-[#64748b] mt-3 max-w-xs mx-auto">
            Expert stylists, premium products, and an experience that makes you feel like the best version of yourself.
          </p>
          <div className="flex justify-center items-center gap-2 mt-4">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
            <span className="text-[10px] text-[#64748b]">4.9/5 (200+ reviews)</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-5 pt-3 sticky top-0 bg-white z-10 border-b border-[#fce7f3]/50">
        <div className="flex">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`flex-1 py-3 text-[10px] font-semibold transition-all ${
                cat === c
                  ? "text-[#DB2777] border-b-2 border-[#DB2777]"
                  : "text-[#94a3b8] hover:text-[#DB2777]"
              }`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Service Menu */}
      <div className="px-5 py-4">
        <div className="space-y-1">
          {services[cat]?.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#fce7f3]/30 last:border-0 group">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-[#0f172a]">{s.name}</p>
                  {s.popular && (
                    <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-[#fdf2f8] text-[#DB2777]">Popular</span>
                  )}
                </div>
                <p className="text-[9px] text-[#94a3b8]">{s.duration}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-[#0f172a]">{s.price}</span>
                <button className="px-2.5 py-1 text-[9px] font-semibold text-[#DB2777] border border-[#DB2777] rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#fdf2f8]">
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stylists */}
      <div className="px-5 py-6 bg-gradient-to-b from-[#fdf2f8] to-white">
        <h3 className="text-sm font-bold text-[#0f172a] mb-4" style={{ fontFamily: "Georgia, serif" }}>Our Team</h3>
        <div className="grid grid-cols-2 gap-3">
          {stylists.map((s, i) => (
            <div key={i} className="p-3 rounded-2xl bg-white border border-[#fce7f3] text-center shadow-sm">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#fce7f3] to-[#fbcfe8] flex items-center justify-center text-xl mb-2">{s.emoji}</div>
              <p className="text-xs font-semibold text-[#0f172a]">{s.name}</p>
              <p className="text-[9px] text-[#DB2777] font-medium">{s.role}</p>
              <p className="text-[8px] text-[#94a3b8] mt-0.5">{s.clients} clients</p>
              <button className="mt-2 w-full py-1.5 text-[9px] font-semibold bg-[#DB2777] text-white rounded-full">Book</button>
            </div>
          ))}
        </div>
      </div>

      {/* Special Offer */}
      <div className="px-5 py-5">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#DB2777] to-[#be185d] text-white text-center">
          <p className="text-[10px] uppercase tracking-widest opacity-80">New Client Offer</p>
          <p className="text-lg font-bold mt-1" style={{ fontFamily: "Georgia, serif" }}>20% Off Your First Visit</p>
          <p className="text-[10px] opacity-80 mt-1">Book online and use code WELCOME20</p>
          <button className="mt-3 px-5 py-2 bg-white text-[#DB2777] text-[10px] font-bold rounded-full">
            Claim Offer
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#0f172a] text-center">
        <p className="text-[9px] text-[#94a3b8]">Glow & Grace Salon | 45 King Street, Manchester M2 4WQ</p>
      </div>

    </div>
  );
}
