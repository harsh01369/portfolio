"use client";

import { useState } from "react";

const menuSections = ["Coffee", "Food", "Cold Drinks"];
const menuItems: Record<string, { name: string; price: string; desc: string; tag?: string }[]> = {
  Coffee: [
    { name: "Flat White", price: "£3.20", desc: "Double ristretto, velvety microfoam", tag: "Best Seller" },
    { name: "Oat Latte", price: "£3.80", desc: "Oatly Barista, single origin espresso", tag: "Vegan" },
    { name: "Matcha Latte", price: "£4.00", desc: "Ceremonial grade matcha, your choice of milk" },
    { name: "Pour Over", price: "£4.50", desc: "V60, single origin, brewed to order" },
    { name: "Americano", price: "£2.80", desc: "Double shot, hot water" },
    { name: "Espresso", price: "£2.20", desc: "Single or double shot" },
  ],
  Food: [
    { name: "Avocado Toast", price: "£7.50", desc: "Sourdough, smashed avo, chilli flakes, poached egg", tag: "Popular" },
    { name: "Croissant", price: "£2.80", desc: "Baked fresh every morning, butter or almond" },
    { name: "Banana Bread", price: "£3.50", desc: "Homemade, served warm with butter" },
    { name: "Granola Bowl", price: "£6.50", desc: "Greek yoghurt, house granola, seasonal fruit", tag: "Vegan opt." },
    { name: "Toastie", price: "£5.50", desc: "Cheese & ham or mushroom & gruyere" },
  ],
  "Cold Drinks": [
    { name: "Iced Latte", price: "£3.80", desc: "Espresso over ice, your choice of milk" },
    { name: "Cold Brew", price: "£3.50", desc: "18-hour steeped, smooth and strong" },
    { name: "Fresh Lemonade", price: "£3.50", desc: "Hand-pressed, mint, lemon" },
    { name: "Smoothie", price: "£5.00", desc: "Berry blast or mango & passion fruit" },
  ],
};

export default function CafeMockup() {
  const [section, setSection] = useState("Coffee");
  const [stamps] = useState(7);

  return (
    <div className="text-[#0f172a] font-sans" style={{ backgroundColor: "#faf7f2" }}>
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e8dfd3]" style={{ backgroundColor: "#f5efe6" }}>
        <div>
          <span className="text-sm font-bold text-[#92400E]" style={{ fontFamily: "Georgia, serif" }}>The Brew Room</span>
          <span className="text-[9px] text-[#a8896c] block leading-none">Specialty Coffee</span>
        </div>
        <button className="px-3 py-1.5 bg-[#92400E] text-white text-[10px] font-semibold rounded-full">
          Order Ahead
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ backgroundColor: "#ede4d6" }}>
        <div className="px-5 py-10 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#92400E]">Est. 2019 - Manchester</p>
          <h1 className="text-2xl font-bold text-[#0f172a] mt-2" style={{ fontFamily: "Georgia, serif" }}>
            Your Neighbourhood<br /><span className="text-[#92400E]">Coffee Shop</span>
          </h1>
          <p className="text-xs text-[#78716c] mt-3">Specialty coffee. Homemade food. Good vibes.</p>
          <div className="flex justify-center gap-5 mt-4 text-[10px] text-[#78716c]">
            <span>⭐ 4.8 rated</span><span>|</span><span>Dog friendly 🐕</span>
          </div>
        </div>
      </div>

      {/* Quick Reorder */}
      <div className="px-5 py-3 border-b border-[#e8dfd3]/50">
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#fef3c7" }}>
          <span className="text-2xl">☕</span>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-[#92400E]">Your usual?</p>
            <p className="text-[9px] text-[#78350F]">Oat Latte, Medium, Extra shot</p>
          </div>
          <button className="px-3 py-1.5 bg-[#92400E] text-white text-[9px] font-bold rounded-full">Reorder</button>
        </div>
      </div>

      {/* Menu Tabs */}
      <div className="px-5 pt-4">
        <div className="flex gap-1 rounded-xl p-1" style={{ backgroundColor: "#ede4d6" }}>
          {menuSections.map((s) => (
            <button key={s} onClick={() => setSection(s)}
              className={`flex-1 py-2 text-[10px] font-semibold rounded-lg transition-all ${
                section === s ? "bg-white text-[#92400E] shadow-sm" : "text-[#78716c]"
              }`}>{s}</button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5 py-4 space-y-1">
        {menuItems[section]?.map((item, i) => (
          <div key={i} className="py-3 border-b border-[#e8dfd3]/30 last:border-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-[#0f172a]">{item.name}</p>
                  {item.tag && (
                    <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.tag === "Best Seller" ? "bg-[#92400E]/10 text-[#92400E]"
                      : item.tag === "Vegan" || item.tag === "Vegan opt." ? "bg-green-100 text-green-700"
                      : "bg-[#fef3c7] text-[#92400E]"
                    }`}>{item.tag}</span>
                  )}
                </div>
                <p className="text-[9px] text-[#78716c] mt-0.5">{item.desc}</p>
              </div>
              <p className="text-xs font-bold text-[#92400E] shrink-0">{item.price}</p>
            </div>
          </div>
        ))}
        <p className="text-[8px] text-[#a8896c] text-center pt-2">All milk alternatives free. Decaf available for all espresso drinks.</p>
      </div>

      {/* Daily Specials Board */}
      <div className="px-5 py-5">
        <div className="rounded-2xl p-5 text-center" style={{ backgroundColor: "#2d2319", color: "#f5efe6" }}>
          <p className="text-[9px] uppercase tracking-[0.3em] text-[#d4a76a]">Today&apos;s Specials</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">Lavender Latte</span>
              <span className="text-xs text-[#d4a76a]">£4.20</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">Sourdough French Toast</span>
              <span className="text-xs text-[#d4a76a]">£8.50</span>
            </div>
          </div>
          <p className="text-[8px] text-[#8b7355] mt-3">While stocks last</p>
        </div>
      </div>

      {/* Loyalty Card */}
      <div className="px-5 py-4" style={{ backgroundColor: "#f5efe6" }}>
        <h3 className="text-xs font-bold text-[#0f172a] mb-2" style={{ fontFamily: "Georgia, serif" }}>☕ Loyalty Card</h3>
        <div className="p-3 rounded-xl bg-white border border-[#e8dfd3]">
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm ${
                i < stamps ? "bg-[#92400E] text-white" : "border border-[#e8dfd3]"
              }`} style={i >= stamps ? { backgroundColor: "#f5efe6" } : undefined}>
                {i < stamps ? "☕" : <span className="text-[9px] text-[#d4c4b0]">{i + 1}</span>}
              </div>
            ))}
          </div>
          <p className="text-[8px] text-center mt-2 text-[#92400E] font-medium">
            {stamps >= 9 ? "Your next drink is FREE!" : `${9 - stamps} more for a FREE drink!`}
          </p>
        </div>
      </div>

      {/* Dog Friendly + WiFi */}
      <div className="px-5 py-3 border-t border-[#e8dfd3]/50">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-[#ecfdf5] border border-[#d1fae5]">
            <span className="text-lg">🐕</span>
            <div>
              <p className="text-[9px] font-bold text-[#059669]">Dog Friendly</p>
              <p className="text-[7px] text-[#047857]">Water + treats!</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-[#eff6ff] border border-[#bfdbfe]">
            <span className="text-lg">📶</span>
            <div>
              <p className="text-[9px] font-bold text-[#2563EB]">Free WiFi</p>
              <p className="text-[7px] text-[#1d4ed8]">Laptop friendly</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
