"use client";

import { useState } from "react";

const shootTypes = ["All", "Wedding", "Portrait", "Corporate", "Events", "Product"];
const gallery = [
  { type: "Wedding", label: "Sarah & James", location: "Cheshire" },
  { type: "Portrait", label: "Studio Session", location: "Manchester" },
  { type: "Corporate", label: "Team Headshots", location: "MediaCityUK" },
  { type: "Wedding", label: "Garden Ceremony", location: "Lake District" },
  { type: "Events", label: "Charity Gala", location: "The Midland" },
  { type: "Portrait", label: "Family Portrait", location: "Heaton Park" },
  { type: "Product", label: "Jewellery Collection", location: "Studio" },
  { type: "Wedding", label: "First Dance", location: "Didsbury" },
  { type: "Corporate", label: "Office Interiors", location: "Spinningfields" },
  { type: "Events", label: "Product Launch", location: "Northern Quarter" },
  { type: "Portrait", label: "Graduation", location: "University" },
  { type: "Wedding", label: "Winter Wedding", location: "Peak District" },
];

const packages = [
  { name: "Wedding Full Day", price: "from £1,200", desc: "8+ hours coverage, 500+ edited images, online gallery" },
  { name: "Wedding Half Day", price: "from £750", desc: "4 hours coverage, 250+ edited images" },
  { name: "Portrait Session", price: "from £150", desc: "1 hour, 20 edited images, studio or location" },
  { name: "Corporate Headshots", price: "from £75/person", desc: "Professional headshots, same-day delivery" },
  { name: "Event Coverage", price: "from £400", desc: "3+ hours, all highlights, fast turnaround" },
];

export default function PhotographyMockup() {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"portfolio" | "packages" | "enquire">("portfolio");
  const filtered = filter === "All" ? gallery : gallery.filter((g) => g.type === filter);

  return (
    <div className="bg-white text-[#0f172a] font-sans min-h-[500px]">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <span className="text-sm font-light tracking-[0.2em] uppercase text-[#1F2937]">Lens & Light</span>
          <span className="text-[8px] text-[#9ca3af] block tracking-[0.15em]">Photography Studio</span>
        </div>
        <button className="px-3 py-1.5 text-[10px] font-medium bg-[#1F2937] text-white rounded-sm">Enquire</button>
      </div>

      {/* Hero */}
      <div className="relative h-52 bg-gradient-to-b from-[#1F2937] to-[#374151] flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#9ca3af] mb-3">Manchester Photography Studio</p>
          <h1 className="text-3xl font-light tracking-wide">Moments, Captured</h1>
          <p className="text-xs text-[#9ca3af] mt-3 tracking-widest uppercase">Wedding | Portrait | Corporate</p>
          <div className="flex justify-center gap-5 mt-4 text-[10px] text-[#6b7280]">
            <span>⭐ 5.0 rated</span><span>|</span><span>200+ weddings</span><span>|</span><span>10 years</span>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="px-6 pt-4">
        <div className="flex border-b border-[#f3f4f6]">
          {(["portfolio", "packages", "enquire"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-2.5 text-[10px] font-medium capitalize transition-colors ${
                view === v ? "text-[#1F2937] border-b border-[#1F2937]" : "text-[#9ca3af] hover:text-[#1F2937]"
              }`}>{v}</button>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      {view === "portfolio" && (
        <>
          <div className="px-6 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="flex gap-3">
              {shootTypes.map((t) => (
                <button key={t} onClick={() => setFilter(t)}
                  className={`text-[10px] whitespace-nowrap pb-1 transition-colors ${
                    filter === t ? "text-[#1F2937] font-medium border-b border-[#1F2937]" : "text-[#9ca3af]"
                  }`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="px-6 py-2 grid grid-cols-3 gap-1">
            {filtered.map((item, i) => (
              <div key={i} className="group relative aspect-[3/4] bg-[#f3f4f6] cursor-pointer overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e5e7eb] to-[#d1d5db] flex items-center justify-center">
                  <span className="text-2xl opacity-10 group-hover:opacity-20 transition-opacity">📷</span>
                </div>
                <div className="absolute inset-0 bg-[#1F2937]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <div>
                    <p className="text-[8px] text-[#9ca3af] uppercase tracking-wider">{item.type}</p>
                    <p className="text-[10px] text-white font-medium">{item.label}</p>
                    <p className="text-[8px] text-[#6b7280]">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Packages */}
      {view === "packages" && (
        <div className="px-6 py-4 space-y-2">
          {packages.map((p, i) => (
            <div key={i} className="p-3 border border-[#f3f4f6] hover:border-[#1F2937]/20 transition-colors">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[#1F2937]">{p.name}</p>
                <p className="text-xs font-bold text-[#1F2937]">{p.price}</p>
              </div>
              <p className="text-[9px] text-[#6b7280] mt-1">{p.desc}</p>
            </div>
          ))}
          <p className="text-[8px] text-[#9ca3af] text-center pt-2">All packages include online gallery with download links. Bespoke packages available.</p>
        </div>
      )}

      {/* Enquiry */}
      {view === "enquire" && (
        <div className="px-6 py-5 space-y-3">
          <h3 className="text-sm font-light text-[#1F2937] tracking-wide">Enquire About Your Shoot</h3>
          <select className="w-full px-3 py-2.5 text-xs border border-[#e5e7eb] bg-white outline-none focus:border-[#1F2937]">
            <option>Type of shoot</option>
            {shootTypes.filter(s => s !== "All").map((t) => <option key={t}>{t}</option>)}
          </select>
          <input type="date" className="w-full px-3 py-2.5 text-xs border border-[#e5e7eb] bg-white outline-none focus:border-[#1F2937]" />
          <input placeholder="Your name" className="w-full px-3 py-2.5 text-xs border border-[#e5e7eb] bg-white outline-none focus:border-[#1F2937]" />
          <input placeholder="Email" className="w-full px-3 py-2.5 text-xs border border-[#e5e7eb] bg-white outline-none focus:border-[#1F2937]" />
          <textarea placeholder="Tell us about your vision..." rows={2}
            className="w-full px-3 py-2.5 text-xs border border-[#e5e7eb] bg-white outline-none focus:border-[#1F2937] resize-none" />
          <button className="w-full py-2.5 bg-[#1F2937] text-white text-xs font-medium tracking-wider uppercase">
            Send Enquiry
          </button>
        </div>
      )}

      {/* Client Gallery */}
      <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#f3f4f6]">
        <div className="flex items-center gap-3 p-3 border border-[#e5e7eb]">
          <span className="text-xl">🔒</span>
          <div>
            <p className="text-xs font-medium text-[#1F2937]">Client Gallery</p>
            <p className="text-[9px] text-[#9ca3af]">Password-protected albums for your shoots</p>
          </div>
        </div>
      </div>

    </div>
  );
}
