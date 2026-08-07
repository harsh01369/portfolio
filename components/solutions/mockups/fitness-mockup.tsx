"use client";

import { useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const classes: Record<string, { name: string; time: string; coach: string; spots: number; color: string }[]> = {
  Mon: [{ name: "HIIT", time: "6:00am", coach: "Tom", spots: 3, color: "#DC2626" }, { name: "Yoga Flow", time: "9:00am", coach: "Lily", spots: 8, color: "#059669" }, { name: "Spin", time: "12:00pm", coach: "Marcus", spots: 5, color: "#2563EB" }, { name: "Boxing", time: "6:00pm", coach: "Ryan", spots: 2, color: "#D97706" }],
  Tue: [{ name: "Pilates", time: "7:00am", coach: "Lily", spots: 6, color: "#DB2777" }, { name: "CrossFit", time: "12:00pm", coach: "Tom", spots: 4, color: "#DC2626" }, { name: "HIIT", time: "5:30pm", coach: "Ryan", spots: 1, color: "#DC2626" }, { name: "Yoga", time: "7:30pm", coach: "Lily", spots: 10, color: "#059669" }],
  Wed: [{ name: "Spin", time: "6:00am", coach: "Marcus", spots: 7, color: "#2563EB" }, { name: "Boxing", time: "12:00pm", coach: "Ryan", spots: 3, color: "#D97706" }, { name: "HIIT", time: "6:00pm", coach: "Tom", spots: 2, color: "#DC2626" }],
  Thu: [{ name: "Yoga", time: "7:00am", coach: "Lily", spots: 9, color: "#059669" }, { name: "CrossFit", time: "12:00pm", coach: "Tom", spots: 5, color: "#DC2626" }, { name: "Pilates", time: "5:30pm", coach: "Lily", spots: 4, color: "#DB2777" }],
  Fri: [{ name: "HIIT", time: "6:00am", coach: "Ryan", spots: 3, color: "#DC2626" }, { name: "Spin", time: "12:00pm", coach: "Marcus", spots: 6, color: "#2563EB" }, { name: "Yoga", time: "5:30pm", coach: "Lily", spots: 8, color: "#059669" }],
  Sat: [{ name: "CrossFit", time: "8:00am", coach: "Tom", spots: 4, color: "#DC2626" }, { name: "Yoga", time: "10:00am", coach: "Lily", spots: 12, color: "#059669" }, { name: "HIIT", time: "12:00pm", coach: "Ryan", spots: 2, color: "#DC2626" }],
};

export default function FitnessMockup() {
  const [day, setDay] = useState("Mon");
  const [view, setView] = useState<"classes" | "trial">("classes");

  return (
    <div className="bg-[#0f0f0f] text-white font-sans min-h-[500px]">
      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f1f]">
        <div>
          <span className="font-black text-sm tracking-tight">FORGE</span>
          <span className="text-[9px] text-[#7C3AED] block leading-none font-medium">FITNESS</span>
        </div>
        <button className="px-3 py-1.5 bg-[#7C3AED] text-white text-[10px] font-bold rounded-lg shadow-sm shadow-[#7C3AED]/30">
          Free Trial
        </button>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/20 to-transparent" />
        <div className="relative px-5 py-10 text-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
            Transform<br /><span className="text-[#7C3AED]">Your Body</span>
          </h1>
          <p className="text-xs text-[#888] mt-3">Manchester&apos;s most results-driven gym. 30+ classes per week.</p>
          <div className="flex justify-center gap-8 mt-5">
            {[{ v: "500+", l: "Members" }, { v: "30+", l: "Classes/wk" }, { v: "4.8★", l: "Rating" }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-lg font-black text-[#7C3AED]">{s.v}</p>
                <p className="text-[8px] text-[#666] uppercase tracking-wider">{s.l}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 px-6 py-3 bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#7C3AED]/30">
            Start Your Free Trial
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="px-5 pt-3">
        <div className="flex gap-1 bg-[#1a1a1a] rounded-xl p-1">
          {(["classes", "trial"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`flex-1 py-2 text-[10px] font-semibold rounded-lg capitalize transition-all ${
                view === v ? "bg-[#7C3AED] text-white" : "text-[#666]"
              }`}>{v === "trial" ? "Free Trial" : "Class Schedule"}</button>
          ))}
        </div>
      </div>

      {/* Classes */}
      {view === "classes" && (
        <div className="px-5 py-4">
          <div className="flex gap-1 mb-4">
            {days.map((d) => (
              <button key={d} onClick={() => setDay(d)}
                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                  day === d ? "bg-[#7C3AED] text-white" : "bg-[#1a1a1a] text-[#666] hover:text-white"
                }`}>{d}</button>
            ))}
          </div>
          <div className="space-y-2">
            {classes[day]?.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#1a1a1a] border border-[#222] hover:border-[#7C3AED]/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: c.color }} />
                  <div>
                    <p className="text-xs font-bold text-white">{c.name}</p>
                    <p className="text-[9px] text-[#666]">{c.time} | Coach {c.coach}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[9px] font-bold ${c.spots <= 3 ? "text-red-400" : "text-[#059669]"}`}>
                    {c.spots} spots left
                  </p>
                  <button className="mt-1 px-3 py-1 text-[9px] font-bold bg-[#7C3AED] text-white rounded-lg">Book</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Trial */}
      {view === "trial" && (
        <div className="px-5 py-5 space-y-3">
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#7C3AED]/20 to-[#6D28D9]/10 border border-[#7C3AED]/20 text-center">
            <p className="text-lg font-black text-[#7C3AED]">7-DAY FREE TRIAL</p>
            <p className="text-[10px] text-[#888] mt-1">No commitment. No card. Just results.</p>
          </div>
          <input placeholder="Full name" className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#1a1a1a] border border-[#222] text-white outline-none focus:border-[#7C3AED]" />
          <input placeholder="Email" type="email" className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#1a1a1a] border border-[#222] text-white outline-none focus:border-[#7C3AED]" />
          <input placeholder="Phone" type="tel" className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#1a1a1a] border border-[#222] text-white outline-none focus:border-[#7C3AED]" />
          <select className="w-full px-3 py-2.5 text-xs rounded-xl bg-[#1a1a1a] border border-[#222] text-white outline-none focus:border-[#7C3AED]">
            <option>Which class interests you?</option><option>HIIT</option><option>Yoga</option><option>Spin</option><option>Boxing</option><option>CrossFit</option><option>Pilates</option>
          </select>
          <button className="w-full py-3 bg-[#7C3AED] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#7C3AED]/30">
            Claim My Free Trial
          </button>
        </div>
      )}

    </div>
  );
}
