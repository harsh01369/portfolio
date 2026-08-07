"use client";

import { useState } from "react";

const menuTabs = ["Starters", "Mains", "Desserts", "Drinks"];
const menu: Record<string, { name: string; price: string; desc: string; tag?: string }[]> = {
  Starters: [
    { name: "Hummus & Warm Pitta", price: "£6.50", desc: "House-made hummus, za'atar oil, charred pitta", tag: "V" },
    { name: "Grilled Halloumi", price: "£7.95", desc: "Pan-fried, honey drizzle, mint, pomegranate" },
    { name: "Lamb Kofta Bites", price: "£8.50", desc: "Spiced lamb, tzatziki, pickled chilli" },
    { name: "Soup of the Day", price: "£5.50", desc: "Freshly made, served with crusty sourdough", tag: "GF" },
  ],
  Mains: [
    { name: "Lamb Kofta Wrap", price: "£12.50", desc: "Spiced lamb, tahini, pickled onion, herbs", tag: "Best Seller" },
    { name: "Mediterranean Bowl", price: "£11.95", desc: "Falafel, tabbouleh, roasted veg, hummus", tag: "V" },
    { name: "Chicken Shawarma", price: "£13.50", desc: "Slow-roasted, garlic sauce, saffron rice" },
    { name: "Grilled Sea Bass", price: "£16.95", desc: "Pan-seared, lemon butter, seasonal vegetables", tag: "GF" },
    { name: "Aubergine Moussaka", price: "£12.50", desc: "Layered aubergine, spiced lentil, bechamel", tag: "V" },
  ],
  Desserts: [
    { name: "Pistachio Baklava", price: "£5.50", desc: "Layers of filo, honey syrup, crushed pistachio" },
    { name: "Chocolate Fondant", price: "£7.50", desc: "Warm molten centre, vanilla bean ice cream" },
    { name: "Orange Blossom Panna Cotta", price: "£6.50", desc: "Rose water, candied petals" },
  ],
  Drinks: [
    { name: "Fresh Mint Lemonade", price: "£3.50", desc: "Hand-pressed, fresh mint leaves" },
    { name: "Turkish Coffee", price: "£3.00", desc: "Traditional preparation, cardamom" },
    { name: "House Wine (175ml)", price: "£6.50", desc: "Red: Merlot | White: Pinot Grigio" },
    { name: "Signature Cocktails", price: "from £9", desc: "Ask your server for our seasonal menu" },
  ],
};

export default function RestaurantMockup() {
  const [tab, setTab] = useState("Starters");
  const [partySize, setPartySize] = useState(2);
  const [view, setView] = useState<"menu" | "reserve">("menu");

  return (
    <div className="bg-white text-[#0f172a] font-sans">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#f5e6d3]/50">
        <span className="text-sm font-bold" style={{ fontFamily: "Georgia, serif" }}>Bella Vista Kitchen</span>
        <div className="flex gap-2">
          <button onClick={() => setView("menu")}
            className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${view === "menu" ? "bg-[#EA580C] text-white" : "text-[#EA580C] border border-[#EA580C]"}`}>
            Menu
          </button>
          <button onClick={() => setView("reserve")}
            className={`px-3 py-1.5 text-[10px] font-semibold rounded-lg transition-colors ${view === "reserve" ? "bg-[#EA580C] text-white" : "text-[#EA580C] border border-[#EA580C]"}`}>
            Reserve
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1917] to-[#292524]" />
        <div className="absolute inset-0 bg-[#EA580C]/5" />
        <div className="relative px-5 py-10 text-center text-white">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#EA580C]">Authentic Mediterranean</p>
          <h1 className="text-2xl font-bold mt-2" style={{ fontFamily: "Georgia, serif" }}>
            Fresh Ingredients,<br />Family Recipes
          </h1>
          <p className="text-xs text-[#a8a29e] mt-3">Award-winning Mediterranean cuisine in the heart of Manchester</p>
          <div className="flex justify-center gap-5 mt-4 text-[10px] text-[#a8a29e]">
            <span>⭐ 4.7 on Google</span>
            <span>|</span>
            <span>TripAdvisor Top 10</span>
          </div>
          <div className="flex justify-center gap-3 mt-5">
            <button className="px-5 py-2.5 bg-[#EA580C] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#EA580C]/25">
              Order for Pickup
            </button>
            <button className="px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white text-xs font-medium rounded-xl border border-white/20">
              Reserve a Table
            </button>
          </div>
        </div>
      </div>

      {/* Savings Banner */}
      <div className="px-5 py-2.5 bg-[#fef3c7] border-y border-[#fde68a]/50 text-center">
        <p className="text-[10px] text-[#92400e] font-medium">
          Order direct and save. No delivery app fees, 30% less than ordering through Just Eat.
        </p>
      </div>

      {view === "menu" ? (
        <>
          {/* Menu Tabs */}
          <div className="px-5 pt-4">
            <div className="flex gap-1 bg-[#faf5f0] rounded-xl p-1">
              {menuTabs.map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-[10px] font-semibold rounded-lg transition-all ${
                    tab === t ? "bg-white text-[#EA580C] shadow-sm" : "text-[#78716c]"
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          <div className="px-5 py-4 space-y-1">
            {menu[tab]?.map((item, i) => (
              <div key={i} className="py-3 border-b border-[#f5f0eb] last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold text-[#0f172a]">{item.name}</p>
                      {item.tag && (
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.tag === "Best Seller" ? "bg-[#EA580C]/10 text-[#EA580C]"
                          : item.tag === "V" ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                        }`}>{item.tag}</span>
                      )}
                    </div>
                    <p className="text-[9px] text-[#78716c] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                  <p className="text-xs font-bold text-[#EA580C] shrink-0">{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <button className="w-full py-3 bg-gradient-to-r from-[#EA580C] to-[#c2410c] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#EA580C]/25">
              Order for Pickup
            </button>
            <p className="text-[8px] text-[#94a3b8] text-center mt-2">Ready in 20-30 minutes</p>
          </div>
        </>
      ) : (
        /* Reservation Form */
        <div className="px-5 py-6 space-y-4">
          <div>
            <label className="text-[10px] font-semibold text-[#475569] block mb-2">Party size</label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button key={n} onClick={() => setPartySize(n)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    partySize === n ? "bg-[#EA580C] text-white shadow-sm" : "bg-[#faf5f0] text-[#78716c] hover:bg-[#f5efe6]"
                  }`}>{n}{n === 6 ? "+" : ""}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold text-[#475569] block mb-1">Date</label>
              <select className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e7e0d8] bg-white focus:border-[#EA580C] outline-none">
                <option>Tonight</option><option>Tomorrow</option><option>This Weekend</option><option>Next Week</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#475569] block mb-1">Time</label>
              <select className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e7e0d8] bg-white focus:border-[#EA580C] outline-none">
                {["6:00pm", "6:30pm", "7:00pm", "7:30pm", "8:00pm", "8:30pm", "9:00pm"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <textarea placeholder="Special requests (allergies, celebrations, seating preferences...)"
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e7e0d8] bg-white resize-none outline-none focus:border-[#EA580C]" rows={2} />
          <button className="w-full py-3 bg-gradient-to-r from-[#EA580C] to-[#c2410c] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#EA580C]/25">
            Confirm Reservation
          </button>
          <p className="text-[8px] text-[#94a3b8] text-center">Instant confirmation. Free cancellation up to 2 hours before.</p>
        </div>
      )}

      {/* Hours & Location */}
      <div className="px-5 py-4 bg-[#faf5f0] border-t border-[#e7e0d8]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EA580C]/10 flex items-center justify-center text-lg">📍</div>
          <div>
            <p className="text-xs font-semibold">78 Deansgate, Manchester M3 2FW</p>
            <p className="text-[9px] text-[#78716c]">Tue-Sun 12pm-10pm | Closed Monday</p>
          </div>
        </div>
      </div>

    </div>
  );
}
