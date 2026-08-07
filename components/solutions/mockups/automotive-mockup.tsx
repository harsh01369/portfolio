"use client";

import { useState } from "react";

const services = [
  { name: "MOT Test", price: "£39.99", time: "1 hr", icon: "🔍", tag: "Best Value" },
  { name: "Full Service", price: "£149", time: "3 hrs", icon: "🔧", tag: "Popular" },
  { name: "Interim Service", price: "£89", time: "1.5 hrs", icon: "⚙️", tag: "" },
  { name: "Brake Pads (front)", price: "from £89", time: "1.5 hrs", icon: "🛞", tag: "" },
  { name: "Tyre Fitting (each)", price: "from £45", time: "30 min", icon: "🔩", tag: "" },
  { name: "Diagnostics Check", price: "£49", time: "45 min", icon: "💻", tag: "" },
  { name: "Air Con Regas", price: "£59", time: "1 hr", icon: "❄️", tag: "" },
  { name: "Battery Replacement", price: "from £89", time: "30 min", icon: "🔋", tag: "" },
];

const reviews = [
  { name: "Dave T.", text: "Honest pricing, no upselling. Will definitely be back.", date: "1 week ago" },
  { name: "Sarah M.", text: "Fixed my brakes same day. Excellent service and communication.", date: "2 weeks ago" },
  { name: "James K.", text: "Best MOT experience I've had. Quick, thorough, and fair.", date: "3 weeks ago" },
  { name: "Priya R.", text: "Found an issue others missed. Trustworthy and professional.", date: "1 month ago" },
];

export default function AutomotiveMockup() {
  const [view, setView] = useState<"services" | "mot" | "reviews">("services");
  const [selectedSvc, setSelectedSvc] = useState<string | null>(null);

  return (
    <div className="bg-white text-[#0f172a] font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1e293b] text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#475569] flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div>
            <span className="font-bold text-sm">Apex Auto</span>
            <span className="text-[9px] text-[#94a3b8] block leading-none">MOT & Service Centre</span>
          </div>
        </div>
        <span className="text-[10px] font-medium text-[#94a3b8]">0161 XXX XXXX</span>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#334155] to-[#475569] text-white px-5 py-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <h1 className="text-xl font-bold leading-tight relative">
          Your Car, Our<br /><span className="text-[#94a3b8]">Expertise.</span>
        </h1>
        <p className="text-xs text-[#94a3b8] mt-2">Honest pricing. No surprises. Guaranteed work.</p>
        <div className="flex gap-2 mt-5">
          <button className="px-5 py-2.5 bg-white text-[#334155] text-xs font-bold rounded-xl">
            Book MOT £39.99
          </button>
          <button className="px-5 py-2.5 bg-white/10 text-white text-xs font-medium rounded-xl border border-white/20">
            All Services
          </button>
        </div>
        <div className="flex gap-5 mt-5 text-[10px] text-[#94a3b8]">
          <span>⭐ 4.8 rated</span><span>|</span><span>2,000+ vehicles serviced</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4">
        <div className="flex gap-1 bg-[#f1f5f9] rounded-xl p-1">
          {(["services", "mot", "reviews"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-2 text-[10px] font-semibold rounded-lg capitalize transition-all ${
                view === v ? "bg-white text-[#475569] shadow-sm" : "text-[#64748b]"
              }`}>{v === "mot" ? "MOT Reminder" : v}</button>
          ))}
        </div>
      </div>

      {/* Services */}
      {view === "services" && (
        <div className="px-5 py-4 space-y-2">
          {services.map((s, i) => (
            <button key={i} onClick={() => setSelectedSvc(selectedSvc === s.name ? null : s.name)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedSvc === s.name ? "border-[#475569] bg-[#f8fafc]" : "border-[#f1f5f9] hover:border-[#475569]/30 bg-[#fafbfc]"
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#0f172a]">{s.name}</p>
                      {s.tag && (
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                          s.tag === "Best Value" ? "bg-green-100 text-green-700" : "bg-[#f1f5f9] text-[#475569]"
                        }`}>{s.tag}</span>
                      )}
                    </div>
                    <p className="text-[9px] text-[#94a3b8]">{s.time}</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-[#475569]">{s.price}</p>
              </div>
              {selectedSvc === s.name && (
                <div className="mt-2 pt-2 border-t border-[#e2e8f0]">
                  <button className="px-4 py-1.5 bg-[#475569] text-white text-[10px] font-medium rounded-lg">Book This Service</button>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* MOT Reminder */}
      {view === "mot" && (
        <div className="px-5 py-5 space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] border border-[#e2e8f0] text-center">
            <p className="text-3xl mb-2">🔔</p>
            <h3 className="text-sm font-bold text-[#0f172a]">Never Miss Your MOT</h3>
            <p className="text-[10px] text-[#475569] mt-1">Enter your reg and we&apos;ll remind you 4 weeks before it&apos;s due.</p>
          </div>
          <div className="flex gap-2">
            <input placeholder="AB12 CDE" className="flex-1 px-4 py-3 text-sm rounded-xl border border-[#e2e8f0] bg-white uppercase font-mono tracking-wider text-center outline-none focus:border-[#475569]" />
            <button className="px-5 py-3 bg-[#475569] text-white text-xs font-bold rounded-xl whitespace-nowrap">Check MOT</button>
          </div>
          <div className="p-4 rounded-xl bg-[#fafbfc] border border-[#f1f5f9]">
            <p className="text-[10px] font-semibold text-[#0f172a] mb-2">Your MOT reminder includes:</p>
            <div className="space-y-1.5">
              {["Email reminder 4 weeks before", "Text reminder 1 week before", "Easy online booking link", "Price guarantee (no surprises)"].map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#059669] text-xs">✓</span>
                  <span className="text-[10px] text-[#475569]">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[8px] text-[#94a3b8] text-center">We&apos;ll never spam you. Reminder emails only.</p>
        </div>
      )}

      {/* Reviews */}
      {view === "reviews" && (
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div>
              <p className="text-3xl font-bold text-[#475569]">4.8</p>
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-500 text-xs">★</span>)}</div>
            </div>
            <div>
              <p className="text-xs font-semibold">Google Reviews</p>
              <p className="text-[10px] text-[#475569]">156 reviews</p>
            </div>
          </div>
          {reviews.map((r, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#fafbfc] border border-[#f1f5f9]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold">{r.name}</p>
                <p className="text-[8px] text-[#94a3b8]">{r.date}</p>
              </div>
              <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map(j => <span key={j} className="text-yellow-500 text-[9px]">★</span>)}</div>
              <p className="text-[10px] text-[#475569] italic">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 bg-[#1e293b] text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold">Apex Auto</p>
            <p className="text-[8px] text-[#94a3b8]">Unit 5, Industrial Estate, M12 4AA</p>
          </div>
          <div className="flex gap-1.5">
            {["MOT", "RAC"].map((b) => (
              <span key={b} className="text-[7px] px-1.5 py-0.5 rounded border border-[#334155] text-[#94a3b8]">{b}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
