"use client";

import { useState } from "react";

export default function MovingMockup() {
  const [rooms, setRooms] = useState(2);
  const [showQuote, setShowQuote] = useState(false);
  const [view, setView] = useState<"quote" | "services" | "reviews">("quote");
  const basePrice = 250 + rooms * 120;

  return (
    <div className="bg-white text-[#0f172a] font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#bae6fd]/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0284C7] flex items-center justify-center">
            <span className="text-white text-sm">🚚</span>
          </div>
          <div>
            <span className="font-bold text-sm">SwiftMove</span>
            <span className="text-[9px] text-[#0284C7] block leading-none">Removals & Storage</span>
          </div>
        </div>
        <a href="tel:08004567890" className="px-3 py-1.5 bg-[#0284C7] text-white text-[10px] font-bold rounded-lg">
          0800 456 789
        </a>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0284C7] to-[#0369A1] text-white px-5 py-10 text-center">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <h1 className="text-2xl font-bold leading-tight relative">
          Quote in 30 Seconds.<br /><span className="text-[#bae6fd]">Not 3 Business Days.</span>
        </h1>
        <p className="text-xs text-[#bae6fd] mt-2">Manchester&apos;s most trusted removals company</p>
        <div className="flex justify-center gap-6 mt-5">
          {[{ v: "500+", l: "Moves" }, { v: "4.9★", l: "Rating" }, { v: "100%", l: "Insured" }].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-lg font-bold">{s.v}</p>
              <p className="text-[8px] text-[#bae6fd] uppercase tracking-wider">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4">
        <div className="flex gap-1 bg-[#f0f9ff] rounded-xl p-1">
          {(["quote", "services", "reviews"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-2 text-[10px] font-semibold rounded-lg capitalize transition-all ${
                view === v ? "bg-white text-[#0284C7] shadow-sm" : "text-[#64748b]"
              }`}>{v === "quote" ? "Instant Quote" : v}</button>
          ))}
        </div>
      </div>

      {/* Quote Calculator */}
      {view === "quote" && (
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-[#475569] block mb-1">Moving from</label>
            <input placeholder="Enter postcode (e.g. M1 4BT)" className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#bae6fd] bg-white outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]/20" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[#475569] block mb-1">Moving to</label>
            <input placeholder="Enter postcode (e.g. SK9 1AB)" className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#bae6fd] bg-white outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]/20" />
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[#475569] block mb-2">Number of bedrooms</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => { setRooms(n); setShowQuote(false); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    rooms === n ? "bg-[#0284C7] text-white shadow-sm shadow-[#0284C7]/25" : "bg-[#f0f9ff] text-[#0284C7] border border-[#bae6fd]"
                  }`}>{n}{n === 5 ? "+" : ""}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-semibold text-[#475569] block mb-1">Preferred date</label>
            <input type="date" className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#bae6fd] bg-white outline-none focus:border-[#0284C7]" />
          </div>
          <button onClick={() => setShowQuote(true)}
            className="w-full py-3 bg-gradient-to-r from-[#0284C7] to-[#0369A1] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#0284C7]/25">
            Get My Quote
          </button>

          {showQuote && (
            <div className="p-5 rounded-2xl bg-[#f0f9ff] border-2 border-[#0284C7] mt-2">
              <p className="text-[10px] text-[#475569]">Estimated price for {rooms} bedroom move</p>
              <p className="text-4xl font-bold text-[#0284C7] mt-1">£{basePrice}</p>
              <div className="mt-3 space-y-1 text-[10px] text-[#475569]">
                <div className="flex justify-between"><span>Base rate</span><span>£250</span></div>
                <div className="flex justify-between"><span>{rooms} bedroom(s)</span><span>£{rooms * 120}</span></div>
                <div className="flex justify-between"><span>2 professional movers</span><span>Included</span></div>
                <div className="flex justify-between"><span>Full insurance</span><span>Included</span></div>
              </div>
              <button className="w-full mt-4 py-2.5 bg-[#0284C7] text-white text-xs font-bold rounded-xl">
                Confirm & Book
              </button>
              <p className="text-[8px] text-[#94a3b8] text-center mt-2">Final price confirmed after survey. No hidden fees.</p>
            </div>
          )}
        </div>
      )}

      {/* Services */}
      {view === "services" && (
        <div className="px-5 py-4 space-y-2">
          {[
            { name: "Home Removals", desc: "Full packing, loading, transport, unpacking", price: "from £250" },
            { name: "Office Moves", desc: "Weekend moves, minimal disruption", price: "from £500" },
            { name: "Packing Service", desc: "We pack everything safely", price: "from £150" },
            { name: "Storage", desc: "Secure, climate-controlled units", price: "from £30/wk" },
            { name: "Single Items", desc: "Sofa, wardrobe, piano, etc.", price: "from £75" },
            { name: "Student Moves", desc: "Special rates for students", price: "from £99", tag: "Popular" },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#fafbfc] border border-[#f1f5f9]">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold">{s.name}</p>
                  {s.tag && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-[#f0f9ff] text-[#0284C7]">{s.tag}</span>}
                </div>
                <p className="text-[9px] text-[#94a3b8]">{s.desc}</p>
              </div>
              <p className="text-xs font-bold text-[#0284C7]">{s.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {view === "reviews" && (
        <div className="px-5 py-4 space-y-3">
          {[
            { name: "Emily R.", text: "Smooth move from Manchester to Leeds. Team was punctual, careful, and friendly.", stars: 5 },
            { name: "David W.", text: "Moved our 4-bed house. Not a single item damaged. Incredible service.", stars: 5 },
            { name: "Aisha K.", text: "Student move was so affordable. Wish I found them sooner!", stars: 5 },
          ].map((r, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#fafbfc] border border-[#f1f5f9]">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold">{r.name}</p>
                <div className="flex gap-0.5">{Array.from({length: r.stars}, (_, j) => <span key={j} className="text-yellow-500 text-[9px]">★</span>)}</div>
              </div>
              <p className="text-[10px] text-[#475569] italic">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      )}

      {/* Trust */}
      <div className="px-5 py-3 bg-[#f0f9ff] border-t border-[#bae6fd]/50">
        <div className="flex items-center justify-between text-center">
          {["Licensed", "Fully Insured", "No Hidden Fees", "BAR Member"].map((b) => (
            <span key={b} className="text-[8px] font-semibold text-[#0369A1]">✅ {b}</span>
          ))}
        </div>
      </div>

    </div>
  );
}
