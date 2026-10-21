"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  accentColor: string;
  bgDark: string;
}

interface EventWeek {
  label: string;
  deviceUnits: number;
  contentSessions: number;
  isEventWeek: boolean;
}

interface PromoEvent {
  id: string;
  label: string;
  skuNote: string;
  titleNote: string;
  weeks: EventWeek[];
  liftDevice: string;
  liftContent: string;
}

const EVENTS: PromoEvent[] = [
  {
    id: "holiday",
    label: "Holiday bundle",
    skuNote: "Nex Playground + 2 controllers, US/CA retail",
    titleNote: "Dance Party Vol. 2 (MDK title)",
    weeks: [
      { label: "W47", deviceUnits: 4200, contentSessions: 38000, isEventWeek: false },
      { label: "W48", deviceUnits: 4800, contentSessions: 41000, isEventWeek: false },
      { label: "W49", deviceUnits: 14600, contentSessions: 112000, isEventWeek: true },
      { label: "W50", deviceUnits: 16200, contentSessions: 128000, isEventWeek: true },
      { label: "W51", deviceUnits: 9100, contentSessions: 86000, isEventWeek: false },
    ],
    liftDevice: "+3.4x units",
    liftContent: "+2.9x sessions",
  },
  {
    id: "launch",
    label: "Launch week",
    skuNote: "Nex Playground, global retail + direct",
    titleNote: "Core pack: Reflex Arena, Mirror Fit",
    weeks: [
      { label: "W1", deviceUnits: 21000, contentSessions: 9000, isEventWeek: true },
      { label: "W2", deviceUnits: 12400, contentSessions: 54000, isEventWeek: true },
      { label: "W3", deviceUnits: 6800, contentSessions: 61000, isEventWeek: false },
      { label: "W4", deviceUnits: 5100, contentSessions: 48000, isEventWeek: false },
      { label: "W5", deviceUnits: 4300, contentSessions: 39000, isEventWeek: false },
    ],
    liftDevice: "+4.1x units",
    liftContent: "ramps 1 week behind",
  },
  {
    id: "backtoschool",
    label: "Back to school",
    skuNote: "Nex Playground, US retail only",
    titleNote: "Focus Sprints (MDK, 3rd-party dev)",
    weeks: [
      { label: "W33", deviceUnits: 3900, contentSessions: 22000, isEventWeek: false },
      { label: "W34", deviceUnits: 5600, contentSessions: 29000, isEventWeek: false },
      { label: "W35", deviceUnits: 11200, contentSessions: 67000, isEventWeek: true },
      { label: "W36", deviceUnits: 9800, contentSessions: 71000, isEventWeek: true },
      { label: "W37", deviceUnits: 6100, contentSessions: 44000, isEventWeek: false },
    ],
    liftDevice: "+2.1x units",
    liftContent: "+2.4x sessions",
  },
];

function Bars({
  weeks,
  metric,
  accentColor,
  max,
}: {
  weeks: EventWeek[];
  metric: "deviceUnits" | "contentSessions";
  accentColor: string;
  max: number;
}) {
  return (
    <div className="flex items-end gap-2 h-[72px]">
      {weeks.map((w, i) => (
        <div key={w.label} className="flex-1 flex flex-col items-center gap-1">
          <motion.div
            className="w-full rounded-t-sm"
            initial={{ height: 0 }}
            animate={{ height: `${(w[metric] / max) * 100}%` }}
            transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 28 }}
            style={{
              background: w.isEventWeek ? accentColor : "rgba(255,255,255,0.15)",
              minHeight: 3,
            }}
          />
          <span className="text-white/30 text-[8px] font-mono tabular-nums">{w.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function NexCrossDomainDemo({ accentColor, bgDark }: Props) {
  const [eventId, setEventId] = useState(EVENTS[0].id);
  const event = EVENTS.find((e) => e.id === eventId) ?? EVENTS[0];
  const maxDevice = Math.max(...EVENTS.flatMap((e) => e.weeks.map((w) => w.deviceUnits)));
  const maxContent = Math.max(...EVENTS.flatMap((e) => e.weeks.map((w) => w.contentSessions)));

  return (
    <div className="w-full max-w-lg">
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgDark, border: `1px solid ${accentColor}2E` }}
      >
        <div
          className="absolute -top-24 -right-20 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, opacity: 0.08, filter: "blur(60px)" }}
        />

        <div className="relative p-7">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white/40 text-[11px] uppercase tracking-[0.2em]">Cross-domain event report</p>
          </div>

          <div
            className="flex rounded-full p-0.5 mb-5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {EVENTS.map((e) => (
              <button
                key={e.id}
                onClick={() => setEventId(e.id)}
                className="relative flex-1 text-[10.5px] font-semibold px-2 py-1.5 rounded-full transition-colors"
                style={{ color: eventId === e.id ? bgDark : "rgba(255,255,255,0.55)" }}
              >
                {eventId === e.id && (
                  <motion.div
                    layoutId="nex-event-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: accentColor }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{e.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="rounded-lg px-3.5 py-3 mb-2.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-xs font-semibold">Device sell-through</p>
                  <span className="text-[10px] font-mono tabular-nums font-semibold" style={{ color: accentColor }}>
                    {event.liftDevice}
                  </span>
                </div>
                <p className="text-white/35 text-[10px] mb-2">{event.skuNote}</p>
                <Bars weeks={event.weeks} metric="deviceUnits" accentColor={accentColor} max={maxDevice} />
              </div>

              <div className="flex items-center justify-center my-1">
                <motion.div
                  className="h-4 w-px"
                  style={{ background: accentColor }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </div>

              <div className="rounded-lg px-3.5 py-3 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white text-xs font-semibold">MDK content engagement</p>
                  <span className="text-[10px] font-mono tabular-nums font-semibold" style={{ color: accentColor }}>
                    {event.liftContent}
                  </span>
                </div>
                <p className="text-white/35 text-[10px] mb-2">{event.titleNote}</p>
                <Bars weeks={event.weeks} metric="contentSessions" accentColor={accentColor} max={maxContent} />
              </div>

              <div className="rounded-lg px-3.5 py-3" style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}` }}>
                <p className="text-white/70 text-[11px] leading-relaxed">
                  Hardware and MDK content report through separate systems today. Joined on event week, the{" "}
                  <span style={{ color: accentColor }} className="font-semibold">
                    {event.label.toLowerCase()}
                  </span>{" "}
                  shows both domains spiking together, not two disconnected charts someone has to eyeball side by
                  side at close.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
