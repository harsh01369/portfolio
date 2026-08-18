"use client";

// A pixel-styled website booking widget, the counterpart to the WhatsApp
// simulator. Where the WhatsApp demo proves the AI Receptionist channel
// (conversational, lives in chat apps), this proves the Smart Booking
// capability on its default channel: a widget embedded directly on the
// business's own website. Same underlying idea, no back-and-forth, a real
// slot gets picked and locked in, just surfaced as a click-through flow
// instead of a conversation.
//
// Front-end simulation only, same as the WhatsApp demo: no real calendar
// backend, deterministic "full" days and "taken" slots so the demo looks
// realistic without relying on random state that could ever mismatch
// between server and client render.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IndustryConfig } from "@/data/solutions-config";
import Icon from "./icon";

const DEMO_BUSINESS_NAMES: Record<string, string> = {
  medico: "Bright Smile Dental",
  "pet-care": "Pawfect Groom",
  tattoo: "Valley Ink Studio",
  salon: "Glow & Grace Salon",
  trades: "Smith & Son Plumbing",
  restaurant: "Bella Vista Kitchen",
  cafe: "Corner Bean Café",
  fitness: "Iron Peak Fitness",
  photography: "Frame & Light Studio",
  moving: "SwiftMove",
  automotive: "Apex Auto",
};

const DEMO_SERVICES: Record<string, string[]> = {
  medico: ["Check-up & Clean · 30 min", "New Patient Exam · 45 min", "Emergency Appointment · 20 min"],
  "pet-care": ["Full Groom · 60 min", "Bath & Brush · 30 min", "Nail Trim · 15 min"],
  tattoo: ["Consultation · 30 min", "Small Piece · 90 min", "Half-Sleeve Session · 3 hr"],
  salon: ["Cut & Style · 45 min", "Balayage · 2 hr", "Gel Manicure · 30 min"],
  trades: ["Callout & Quote · 30 min", "Boiler Repair · 90 min", "Emergency Callout · ASAP"],
  restaurant: ["Table for 2", "Table for 4", "Table for 6+"],
  cafe: ["Table Reservation · 45 min"],
  fitness: ["Personal Training · 60 min", "Class Trial · 45 min", "Consultation · 20 min"],
  photography: ["Portrait Session · 1 hr", "Family Session · 1.5 hr", "Wedding Consultation · 30 min"],
  moving: ["In-Home Estimate · 30 min", "Local Move", "Long-Distance Move"],
  automotive: ["MOT & Service · 60 min", "Diagnostic Check · 30 min", "Tyre Fitting · 20 min"],
};

const TIME_SLOTS = ["9:00 AM", "9:30 AM", "10:30 AM", "11:00 AM", "1:00 PM", "2:00 PM", "2:30 PM", "3:30 PM"];
const TAKEN_SLOT_INDICES = new Set([1, 5]);
const FULL_DAY_INDICES = new Set([2, 5]);

function nextDays(count: number): { label: string; sub: string }[] {
  const out: { label: string; sub: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push({
      label: d.toLocaleDateString([], { weekday: "short" }),
      sub: d.toLocaleDateString([], { day: "numeric", month: "short" }),
    });
  }
  return out;
}

export default function BookingWidgetDemo({ industry }: { industry: IndustryConfig }) {
  const businessName = DEMO_BUSINESS_NAMES[industry.slug] ?? `${industry.label} Business`;
  const services = DEMO_SERVICES[industry.slug] ?? ["General Appointment · 30 min"];
  const [days] = useState(() => nextDays(7));

  const [service, setService] = useState<string | null>(null);
  const [dayIndex, setDayIndex] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const reset = () => {
    setService(null);
    setDayIndex(null);
    setTime(null);
    setName("");
    setConfirmed(false);
  };

  const canConfirm = !!service && dayIndex !== null && !!time && name.trim().length > 0;

  if (confirmed && dayIndex !== null) {
    const day = days[dayIndex];
    return (
      <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white">
        <BrowserChrome businessName={businessName} />
        <div className="p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: industry.accentLight, color: industry.accentColor }}>
            <Icon name="check" className="w-6 h-6" />
          </div>
          <p className="text-base font-semibold text-[#0f172a]">You&apos;re booked in</p>
          <p className="text-sm text-[#475569] mt-2">
            {service}<br />
            {day.label} {day.sub} at {time}
          </p>
          <p className="text-xs text-[#94a3b8] mt-4 pt-4 border-t border-[#e2e8f0]">A confirmation text just went to your phone, with a reminder before the appointment.</p>
          <button onClick={reset} className="mt-5 text-xs font-semibold" style={{ color: industry.accentColor }}>
            Book another slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-white">
      <BrowserChrome businessName={businessName} />
      <div className="p-5 space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>1. Choose a service</p>
          <div className="space-y-1.5">
            {services.map((s) => (
              <button
                key={s}
                onClick={() => { setService(s); setDayIndex(null); setTime(null); }}
                className="w-full text-left px-3 py-2.5 rounded-lg border-2 text-sm transition-colors"
                style={{ borderColor: service === s ? industry.accentColor : "#e2e8f0", color: service === s ? industry.accentColor : "#334155", fontWeight: service === s ? 600 : 400 }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {service && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>2. Pick a day</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {days.map((d, i) => {
                  const full = FULL_DAY_INDICES.has(i);
                  const selected = dayIndex === i;
                  return (
                    <button
                      key={i}
                      disabled={full}
                      onClick={() => { setDayIndex(i); setTime(null); }}
                      className="shrink-0 w-14 py-2 rounded-lg border-2 text-center transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
                      style={{ borderColor: selected ? industry.accentColor : "#e2e8f0", backgroundColor: selected ? industry.accentColor : "white" }}
                    >
                      <p className="text-[10px] font-medium" style={{ color: selected ? "white" : "#94a3b8" }}>{d.label}</p>
                      <p className="text-xs font-semibold" style={{ color: selected ? "white" : "#0f172a" }}>{d.sub.split(" ")[0]}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {service && dayIndex !== null && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>3. Pick a time</p>
              <div className="grid grid-cols-4 gap-1.5">
                {TIME_SLOTS.map((t, i) => {
                  const taken = TAKEN_SLOT_INDICES.has(i);
                  const selected = time === t;
                  return (
                    <button
                      key={t}
                      disabled={taken}
                      onClick={() => setTime(t)}
                      className="py-2 rounded-lg border-2 text-xs font-medium transition-colors disabled:opacity-35 disabled:cursor-not-allowed disabled:line-through"
                      style={{ borderColor: selected ? industry.accentColor : "#e2e8f0", backgroundColor: selected ? industry.accentColor : "white", color: selected ? "white" : "#334155" }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {service && dayIndex !== null && time && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: industry.accentColor }}>4. Your details</p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] outline-none focus:border-current"
                />
              </div>
              <button
                onClick={() => canConfirm && setConfirmed(true)}
                disabled={!canConfirm}
                className="w-full py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wide disabled:opacity-40 transition-opacity"
                style={{ backgroundColor: industry.accentColor }}
              >
                Confirm Booking
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BrowserChrome({ businessName }: { businessName: string }) {
  const url = `${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/book`;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0]">
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="px-3 py-1 rounded-md bg-white border border-[#e2e8f0] text-[11px] text-[#94a3b8] max-w-[220px] truncate">{url}</div>
      </div>
      <div className="w-[42px]" />
    </div>
  );
}