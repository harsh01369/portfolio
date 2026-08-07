"use client";

import { useState } from "react";

const groomingServices = [
  { name: "Full Groom (Small)", price: "£35", time: "1 hr", icon: "🐕", desc: "Bath, dry, clip, nails, ears, cologne" },
  { name: "Full Groom (Medium)", price: "£45", time: "1.5 hrs", icon: "🐕‍🦺", desc: "Full service for medium breeds" },
  { name: "Full Groom (Large)", price: "£65", time: "2 hrs", icon: "🦮", desc: "Full service for large breeds" },
  { name: "Bath & Brush", price: "from £25", time: "45 min", icon: "🛁", desc: "Deep clean, brush out, nail trim" },
  { name: "Puppy First Groom", price: "£30", time: "30 min", icon: "🐶", desc: "Gentle intro for puppies under 6 months", tag: "Popular" },
  { name: "Cat Groom", price: "£45", time: "1 hr", icon: "🐱", desc: "Specialist feline grooming" },
  { name: "Nail Trim Only", price: "£10", time: "10 min", icon: "✂️", desc: "Walk-in welcome, no appointment needed" },
  { name: "De-matting", price: "from £15", time: "Varies", icon: "🪮", desc: "Added to any groom service" },
];

const happyPets = [
  { name: "Max", breed: "Golden Retriever", service: "Full Groom", owner: "Lisa T." },
  { name: "Bella", breed: "Cockapoo", service: "Puppy First Groom", owner: "Sarah M." },
  { name: "Charlie", breed: "French Bulldog", service: "Bath & Brush", owner: "James K." },
];

export default function PetCareMockup() {
  const [activeTab, setActiveTab] = useState<"services" | "gallery" | "book">("services");
  const [stamps] = useState(7);

  return (
    <div className="bg-white text-[#0f172a] font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#d1fae5]/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center">
            <span className="text-white text-sm">🐾</span>
          </div>
          <div>
            <span className="font-bold text-sm text-[#0f172a]">Pawfect Groom</span>
            <span className="text-[9px] text-[#059669] block leading-none">Pet Grooming Salon</span>
          </div>
        </div>
        <button className="px-3 py-1.5 bg-[#059669] text-white text-[10px] font-semibold rounded-full shadow-sm shadow-[#059669]/25">
          Book Now
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ecfdf5] via-[#d1fae5] to-[#a7f3d0]" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#059669]/10 rounded-full blur-3xl" />
        <div className="relative px-5 py-10">
          <div className="inline-flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-[#a7f3d0] rounded-full px-3 py-1 mb-4">
            <span className="text-[10px] text-[#059669] font-medium">500+ happy pets groomed</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] leading-tight">
            Happy Pets,<br /><span className="text-[#059669]">Happy Owners</span> 🐾
          </h1>
          <p className="text-xs text-[#475569] mt-3 max-w-sm">
            Professional grooming with genuine love and care. Every pet leaves looking and feeling their best.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
            <span className="text-[10px] text-[#64748b]">4.9/5 on Google</span>
          </div>
          <button className="mt-5 px-5 py-2.5 bg-[#059669] text-white text-xs font-semibold rounded-full shadow-lg shadow-[#059669]/25">
            Book Your Pet In
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3">
        <div className="flex gap-1 bg-[#ecfdf5] rounded-xl p-1">
          {(["services", "gallery", "book"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 text-[10px] font-semibold rounded-lg capitalize transition-all ${
                activeTab === t ? "bg-white text-[#059669] shadow-sm" : "text-[#64748b]"
              }`}>{t === "book" ? "Book Now" : t}</button>
          ))}
        </div>
      </div>

      {/* Services */}
      {activeTab === "services" && (
        <div className="px-5 py-4 space-y-2">
          {groomingServices.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#fafbfc] border border-[#f1f5f9] hover:border-[#059669]/30 transition-colors">
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-[#0f172a]">{s.name}</p>
                  {s.tag && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669]">{s.tag}</span>}
                </div>
                <p className="text-[9px] text-[#94a3b8]">{s.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-[#059669]">{s.price}</p>
                <p className="text-[8px] text-[#94a3b8]">{s.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery */}
      {activeTab === "gallery" && (
        <div className="px-5 py-4 space-y-3">
          <p className="text-xs font-semibold text-[#0f172a] mb-2">Recent Transformations</p>
          {happyPets.map((p, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#ecfdf5] border border-[#d1fae5]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-16 h-16 rounded-xl bg-[#d1fae5] flex items-center justify-center text-xs text-[#059669] font-medium">Before</div>
                  <div className="flex items-center text-[#059669]">→</div>
                  <div className="w-16 h-16 rounded-xl bg-[#a7f3d0] flex items-center justify-center text-xs text-[#047857] font-medium">After</div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold">{p.name} the {p.breed}</p>
                  <p className="text-[9px] text-[#059669]">{p.service}</p>
                  <p className="text-[8px] text-[#94a3b8]">Owner: {p.owner}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book */}
      {activeTab === "book" && (
        <div className="px-5 py-5 space-y-3">
          <h3 className="text-sm font-bold text-[#0f172a]">Tell Us About Your Pet</h3>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Pet name" className="px-3 py-2.5 text-xs rounded-xl border border-[#d1fae5] bg-white outline-none focus:border-[#059669]" />
            <select className="px-3 py-2.5 text-xs rounded-xl border border-[#d1fae5] bg-white outline-none focus:border-[#059669]">
              <option>Dog</option><option>Cat</option><option>Rabbit</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input placeholder="Breed" className="px-3 py-2.5 text-xs rounded-xl border border-[#d1fae5] bg-white outline-none focus:border-[#059669]" />
            <select className="px-3 py-2.5 text-xs rounded-xl border border-[#d1fae5] bg-white outline-none focus:border-[#059669]">
              <option>Small (0-10kg)</option><option>Medium (10-25kg)</option><option>Large (25kg+)</option>
            </select>
          </div>
          <select className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#d1fae5] bg-white outline-none focus:border-[#059669]">
            <option>Select a service</option>
            {groomingServices.map(s => <option key={s.name}>{s.name} - {s.price}</option>)}
          </select>
          <textarea placeholder="Any special notes? (temperament, allergies, matting...)" rows={2}
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#d1fae5] bg-white resize-none outline-none focus:border-[#059669]" />
          <button className="w-full py-3 bg-gradient-to-r from-[#059669] to-[#047857] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#059669]/25">
            Book Appointment
          </button>
        </div>
      )}

      {/* Loyalty Card */}
      <div className="px-5 py-5 bg-[#ecfdf5] border-t border-[#d1fae5]">
        <h3 className="text-xs font-bold text-[#0f172a] mb-2">🦴 Loyalty Card</h3>
        <div className="p-3 rounded-xl bg-white border border-[#d1fae5]">
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                i < stamps ? "bg-[#059669] text-white" : "bg-[#ecfdf5] border border-[#d1fae5]"
              }`}>{i < stamps ? "🐾" : ""}</div>
            ))}
          </div>
          <p className="text-[8px] text-center mt-2 text-[#059669] font-medium">{stamps >= 9 ? "Next groom is FREE!" : `${9 - stamps} more visits for a FREE groom!`}</p>
        </div>
      </div>

      {/* Reminder Banner */}
      <div className="px-5 py-3 border-t border-[#d1fae5]">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fef3c7] border border-[#fde68a]">
          <span className="text-xl">🔔</span>
          <div>
            <p className="text-[10px] font-semibold text-[#92400e]">Auto-Reminders</p>
            <p className="text-[8px] text-[#92400e]">We text you when your pet is due. Never miss a groom!</p>
          </div>
        </div>
      </div>

    </div>
  );
}
