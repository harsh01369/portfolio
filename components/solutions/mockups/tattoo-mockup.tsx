"use client";

import { useState } from "react";

const styles = ["All", "Traditional", "Fine Line", "Realism", "Japanese", "Blackwork", "Neo-Traditional"];

const portfolio = [
  { style: "Realism", label: "Portrait Sleeve", artist: "Jake" },
  { style: "Fine Line", label: "Botanical Arm", artist: "Maya" },
  { style: "Japanese", label: "Koi Back Piece", artist: "Chris" },
  { style: "Traditional", label: "Eagle Chest", artist: "Jake" },
  { style: "Blackwork", label: "Geometric Band", artist: "Maya" },
  { style: "Realism", label: "Wildlife Leg", artist: "Jake" },
  { style: "Neo-Traditional", label: "Wolf Portrait", artist: "Chris" },
  { style: "Fine Line", label: "Script Ribcage", artist: "Maya" },
  { style: "Japanese", label: "Dragon Sleeve", artist: "Chris" },
  { style: "Traditional", label: "Anchor Forearm", artist: "Jake" },
  { style: "Blackwork", label: "Mandala Shoulder", artist: "Maya" },
  { style: "Realism", label: "Lion Chest", artist: "Jake" },
];

const artists = [
  { name: "Jake", fullName: "Jake Morrison", specialty: "Realism & Traditional", years: "8 years", emoji: "🎨" },
  { name: "Maya", fullName: "Maya Santos", specialty: "Fine Line & Blackwork", years: "6 years", emoji: "✒️" },
  { name: "Chris", fullName: "Chris Tanaka", specialty: "Japanese & Neo-Trad", years: "10 years", emoji: "🐉" },
];

const pricing = [
  { size: "Tiny (1-2\")", price: "from £60", time: "30 min" },
  { size: "Small (2-4\")", price: "from £80", time: "1 hr" },
  { size: "Medium (4-8\")", price: "from £200", time: "2-3 hrs" },
  { size: "Large (8\"+)", price: "from £400", time: "4+ hrs" },
  { size: "Half Sleeve", price: "from £500", time: "Multiple sessions" },
  { size: "Full Sleeve", price: "from £1,200", time: "Multiple sessions" },
];

export default function TattooMockup() {
  const [activeStyle, setActiveStyle] = useState("All");
  const [activeSection, setActiveSection] = useState<"portfolio" | "artists" | "pricing">("portfolio");

  const filtered = activeStyle === "All" ? portfolio : portfolio.filter((p) => p.style === activeStyle);

  return (
    <div className="bg-[#0a0a0a] text-white font-sans min-h-[500px]">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
        <div>
          <span className="text-sm font-black tracking-[0.15em] uppercase">Valley Ink</span>
          <span className="text-[9px] text-[#666] block tracking-[0.3em] uppercase">Studio - Est. 2018</span>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#DC2626] text-white text-[10px] font-bold rounded-lg">
            Book Consult
          </button>
          <button className="px-3 py-1.5 border border-[#333] text-[#999] text-[10px] font-medium rounded-lg">
            Contact
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#DC2626]/10 via-transparent to-transparent" />
        <div className="relative px-5 py-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#DC2626] mb-3">Manchester&apos;s Premier Tattoo Studio</p>
          <h1 className="text-3xl font-black uppercase tracking-tight leading-none" style={{ fontFamily: "Georgia, serif" }}>
            Your Story.<br />Our Ink.
          </h1>
          <p className="text-xs text-[#666] mt-3 max-w-xs mx-auto">
            Award-winning custom tattoos. Three artists. One mission: turning your vision into art.
          </p>
          <div className="flex justify-center gap-6 mt-5 text-[10px] text-[#666]">
            <span>⭐ 4.9 rated</span>
            <span>|</span>
            <span>500+ pieces</span>
            <span>|</span>
            <span>Walk-ins welcome</span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="px-5">
        <div className="flex border-b border-[#1f1f1f]">
          {(["portfolio", "artists", "pricing"] as const).map((s) => (
            <button key={s} onClick={() => setActiveSection(s)}
              className={`flex-1 py-3 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                activeSection === s ? "text-[#DC2626] border-b-2 border-[#DC2626]" : "text-[#555] hover:text-white"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Portfolio Section */}
      {activeSection === "portfolio" && (
        <>
          <div className="px-5 pt-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex gap-1.5 min-w-max">
              {styles.map((s) => (
                <button key={s} onClick={() => setActiveStyle(s)}
                  className={`px-3 py-1.5 text-[10px] font-medium rounded-full transition-all whitespace-nowrap ${
                    activeStyle === s
                      ? "bg-[#DC2626] text-white"
                      : "text-[#666] border border-[#222] hover:border-[#DC2626] hover:text-[#DC2626]"
                  }`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="px-5 py-4 grid grid-cols-3 gap-1.5">
            {filtered.map((item, i) => (
              <div key={i} className="group relative aspect-square bg-[#151515] rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-[#DC2626] transition-all">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] flex items-center justify-center">
                  <span className="text-2xl opacity-10 group-hover:opacity-20 transition-opacity">🎨</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <div>
                    <p className="text-[8px] text-[#DC2626] font-bold uppercase tracking-wider">{item.style}</p>
                    <p className="text-[10px] text-white font-medium">{item.label}</p>
                    <p className="text-[8px] text-[#666]">by {item.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Artists Section */}
      {activeSection === "artists" && (
        <div className="px-5 py-5 space-y-3">
          {artists.map((a, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#111] border border-[#1f1f1f] hover:border-[#DC2626]/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#DC2626]/20 to-[#1f1f1f] flex items-center justify-center text-2xl">{a.emoji}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{a.fullName}</p>
                  <p className="text-[10px] text-[#DC2626] font-medium">{a.specialty}</p>
                  <p className="text-[9px] text-[#555]">{a.years} experience</p>
                </div>
                <button className="px-3 py-1.5 bg-[#DC2626] text-white text-[9px] font-bold rounded-lg">Book</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Section */}
      {activeSection === "pricing" && (
        <div className="px-5 py-5">
          <div className="space-y-1">
            {pricing.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
                <div>
                  <p className="text-xs font-medium text-white">{p.size}</p>
                  <p className="text-[9px] text-[#555]">{p.time}</p>
                </div>
                <p className="text-xs font-bold text-[#DC2626]">{p.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-[#111] border border-[#1f1f1f]">
            <p className="text-[10px] text-[#666] leading-relaxed">
              Prices are estimates. Final price depends on design complexity, placement, and detail level. All custom work requires a consultation (free, 30 min).
            </p>
          </div>
        </div>
      )}

      {/* Consultation CTA */}
      <div className="px-5 py-6 bg-gradient-to-b from-[#0a0a0a] to-[#111] border-t border-[#1a1a1a]">
        <div className="text-center">
          <h3 className="text-sm font-bold" style={{ fontFamily: "Georgia, serif" }}>Book a Free Consultation</h3>
          <p className="text-[10px] text-[#555] mt-1">Discuss your design, get a quote, meet your artist</p>
        </div>
        <div className="space-y-3 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <select className="px-3 py-2.5 text-[10px] rounded-xl bg-[#151515] border border-[#222] text-white outline-none focus:border-[#DC2626]">
              <option>Choose Artist</option>
              {artists.map((a) => <option key={a.name}>{a.fullName}</option>)}
            </select>
            <select className="px-3 py-2.5 text-[10px] rounded-xl bg-[#151515] border border-[#222] text-white outline-none focus:border-[#DC2626]">
              <option>Style</option>
              {styles.filter(s => s !== "All").map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="border border-dashed border-[#222] rounded-xl p-4 text-center cursor-pointer hover:border-[#DC2626] transition-colors">
            <p className="text-lg mb-1">📎</p>
            <p className="text-[10px] text-[#555]">Upload reference images</p>
            <p className="text-[8px] text-[#333]">JPG, PNG up to 10MB</p>
          </div>
          <button className="w-full py-3 bg-[#DC2626] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#DC2626]/20">
            Request Consultation
          </button>
          <p className="text-[8px] text-[#333] text-center">£50 deposit to secure your slot. Free consultation.</p>
        </div>
      </div>

    </div>
  );
}
