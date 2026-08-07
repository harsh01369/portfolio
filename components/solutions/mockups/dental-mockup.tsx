"use client";

import { useState } from "react";

const services = [
  { name: "Check-up & Clean", price: "£45", duration: "30 min", icon: "🦷", desc: "Comprehensive exam, scale & polish, oral health assessment" },
  { name: "Teeth Whitening", price: "£299", duration: "1 hr", icon: "✨", desc: "Professional Zoom whitening, up to 8 shades brighter" },
  { name: "Dental Implants", price: "from £2,500", duration: "Consultation", icon: "🔩", desc: "Permanent tooth replacement, titanium implant + crown" },
  { name: "Invisalign", price: "from £1,800", duration: "6-18 months", icon: "😁", desc: "Clear aligners, virtually invisible, removable" },
  { name: "Emergency", price: "£85", duration: "Same day", icon: "🚨", desc: "Toothache, broken tooth, lost filling, swelling" },
  { name: "Veneers", price: "from £450/tooth", duration: "2 visits", icon: "💎", desc: "Porcelain veneers, natural look, long-lasting" },
];

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"];

const reviews = [
  { name: "Sarah T.", text: "Best dental experience ever. The team made me feel completely at ease.", rating: 5, date: "2 weeks ago" },
  { name: "James M.", text: "Whitening results were incredible. Wish I'd done it sooner!", rating: 5, date: "1 month ago" },
  { name: "Priya K.", text: "Emergency appointment within the hour. Can't recommend enough.", rating: 5, date: "3 weeks ago" },
];

const team = [
  { name: "Dr. Emily Chen", role: "Lead Dentist", specialty: "Cosmetic & Implants", emoji: "👩‍⚕️" },
  { name: "Dr. James Walker", role: "Dentist", specialty: "Orthodontics", emoji: "👨‍⚕️" },
  { name: "Sophie Adams", role: "Hygienist", specialty: "Preventive Care", emoji: "🧑‍⚕️" },
];

export default function DentalMockup() {
  const [selectedSvc, setSelectedSvc] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"services" | "team" | "reviews">("services");

  return (
    <div className="bg-white text-[#0f172a] font-sans">
      {/* Top Bar */}
      <div className="bg-[#1e40af] text-white text-[10px] px-5 py-1.5 flex items-center justify-between">
        <span>Mon-Fri 8am-6pm | Sat 9am-2pm | Emergency 24/7</span>
        <span className="font-medium">01onal 234 5678</span>
      </div>

      {/* Navbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#e2e8f0] bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#1e40af] flex items-center justify-center">
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <div>
            <span className="font-bold text-sm text-[#0f172a]">Bright Smile</span>
            <span className="text-[10px] text-[#64748b] block leading-none">Dental Practice</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#2563EB] text-white text-[10px] font-semibold rounded-lg shadow-sm shadow-[#2563EB]/25">
            Book Online
          </button>
          <button className="px-3 py-1.5 border border-[#2563EB] text-[#2563EB] text-[10px] font-semibold rounded-lg">
            Call Us
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#eff6ff] via-[#dbeafe] to-[#bfdbfe]" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#2563EB]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3b82f6]/10 rounded-full blur-2xl" />
        <div className="relative px-5 py-10">
          <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-[#bfdbfe] rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-[#2563EB] font-medium">Accepting new patients</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f172a] leading-tight">
            Your Smile Deserves<br />
            <span className="text-[#2563EB]">Expert Care</span>
          </h1>
          <p className="text-sm text-[#475569] mt-3 leading-relaxed max-w-sm">
            Award-winning dental care in the heart of Manchester. From routine check-ups to complete smile makeovers.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex -space-x-2">
              {["👩", "👨", "👩‍🦰", "👴"].map((e, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-[#dbeafe] border-2 border-white flex items-center justify-center text-xs">{e}</div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}
              </div>
              <p className="text-[10px] text-[#64748b]">4.8/5 from 127 Google reviews</p>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button className="px-5 py-2.5 bg-[#2563EB] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#2563EB]/25 hover:shadow-xl transition-shadow">
              Book Appointment
            </button>
            <button className="px-5 py-2.5 bg-white text-[#2563EB] text-xs font-semibold rounded-xl border border-[#bfdbfe]">
              View Services
            </button>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="px-5 py-4 bg-white border-y border-[#e2e8f0]">
        <div className="flex items-center justify-between text-center">
          {[
            { value: "15+", label: "Years" },
            { value: "10K+", label: "Patients" },
            { value: "4.8★", label: "Rating" },
            { value: "Private", label: "Practice" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-sm font-bold text-[#2563EB]">{s.value}</p>
              <p className="text-[9px] text-[#94a3b8]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-5 pt-5">
        <div className="flex gap-1 bg-[#f1f5f9] rounded-xl p-1">
          {(["services", "team", "reviews"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[10px] font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab ? "bg-white text-[#2563EB] shadow-sm" : "text-[#64748b]"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="px-5 py-4 space-y-2">
          {services.map((s) => (
            <button key={s.name} onClick={() => setSelectedSvc(selectedSvc === s.name ? null : s.name)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${
                selectedSvc === s.name
                  ? "border-[#2563EB] bg-[#eff6ff] shadow-sm"
                  : "border-[#f1f5f9] hover:border-[#bfdbfe] bg-[#fafbfc]"
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-[#0f172a]">{s.name}</p>
                    <p className="text-[10px] text-[#94a3b8]">{s.duration}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#2563EB]">{s.price}</p>
                </div>
              </div>
              {selectedSvc === s.name && (
                <div className="mt-2 pt-2 border-t border-[#bfdbfe]/30">
                  <p className="text-[10px] text-[#475569]">{s.desc}</p>
                  <button className="mt-2 px-3 py-1 bg-[#2563EB] text-white text-[10px] font-medium rounded-lg">
                    Book This Service
                  </button>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div className="px-5 py-4 space-y-3">
          {team.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#fafbfc] border border-[#f1f5f9]">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] flex items-center justify-center text-2xl">{t.emoji}</div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#0f172a]">{t.name}</p>
                <p className="text-[10px] text-[#2563EB] font-medium">{t.role}</p>
                <p className="text-[10px] text-[#94a3b8]">{t.specialty}</p>
              </div>
              <button className="px-2.5 py-1 text-[9px] font-medium border border-[#2563EB] text-[#2563EB] rounded-lg">Book</button>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-[#eff6ff] to-[#dbeafe]">
            <div>
              <p className="text-3xl font-bold text-[#2563EB]">4.8</p>
              <div className="flex gap-0.5 mt-0.5">{[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400 text-xs">★</span>)}</div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-[#0f172a]">127 Reviews</p>
              <p className="text-[10px] text-[#475569]">on Google</p>
            </div>
          </div>
          {reviews.map((r, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#fafbfc] border border-[#f1f5f9]">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-[#0f172a]">{r.name}</p>
                <p className="text-[9px] text-[#94a3b8]">{r.date}</p>
              </div>
              <div className="flex gap-0.5 mb-1.5">{[1,2,3,4,5].map(j => <span key={j} className="text-yellow-400 text-[10px]">★</span>)}</div>
              <p className="text-[10px] text-[#475569] leading-relaxed">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      )}

      {/* Booking Widget */}
      <div className="px-5 py-6 bg-gradient-to-b from-[#f8fafc] to-white border-t border-[#e2e8f0]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
            <span className="text-white text-sm">📅</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">Book an Appointment</h3>
            <p className="text-[10px] text-[#94a3b8]">Choose your service, date, and time</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-medium text-[#475569] block mb-1">Service</label>
            <select value={selectedSvc ?? ""} onChange={(e) => setSelectedSvc(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e2e8f0] bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 outline-none transition-all">
              <option value="">Choose a service</option>
              {services.map((s) => <option key={s.name} value={s.name}>{s.name} - {s.price}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#475569] block mb-1">Preferred Date</label>
            <input type="date"
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#e2e8f0] bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 outline-none transition-all" />
          </div>
          <div>
            <label className="text-[10px] font-medium text-[#475569] block mb-2">Available Slots</label>
            <div className="grid grid-cols-5 gap-1.5">
              {timeSlots.map((t) => (
                <button key={t} onClick={() => setSelectedTime(t)}
                  className={`py-2 text-[10px] font-medium rounded-lg border transition-all ${
                    selectedTime === t
                      ? "bg-[#2563EB] text-white border-[#2563EB] shadow-sm shadow-[#2563EB]/25"
                      : "border-[#e2e8f0] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB]"
                  }`}>{t}</button>
              ))}
            </div>
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] text-white text-xs font-semibold rounded-xl shadow-lg shadow-[#2563EB]/25 hover:shadow-xl transition-all">
            Confirm Booking
          </button>
          <p className="text-[9px] text-[#94a3b8] text-center">Free cancellation up to 24 hours before</p>
        </div>
      </div>

      {/* Location */}
      <div className="px-5 py-5 border-t border-[#e2e8f0]">
        <div className="rounded-xl bg-[#f1f5f9] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2563EB]/10 flex items-center justify-center text-lg">📍</div>
          <div>
            <p className="text-xs font-semibold text-[#0f172a]">123 Deansgate, Manchester M3 2BQ</p>
            <p className="text-[10px] text-[#475569]">Free parking available | Wheelchair accessible</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-[#0f172a] text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold">Bright Smile Dental</p>
            <p className="text-[9px] text-[#94a3b8]">Caring for Manchester&apos;s smiles since 2009</p>
          </div>
          <div className="flex gap-2">
            {["CQC", "BDA", "GDC"].map((b) => (
              <span key={b} className="text-[8px] px-1.5 py-0.5 rounded border border-[#334155] text-[#94a3b8]">{b}</span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
