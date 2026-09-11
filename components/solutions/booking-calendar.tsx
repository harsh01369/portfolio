"use client";

// Small illustrative booking calendar shown after a visitor taps the
// [[BOOK]] button inside the WhatsApp demo. Not wired to a real calendar,
// this exists to show a lead what the last step of the journey looks like:
// their patient picks a day and time without ever leaving the chat, instead
// of being told to call during business hours. Closed days come from the
// lead's own real hours (closedWeekdays), never invented.

import { useState } from "react";

interface Props {
  businessName: string;
  accentColor: string;
  closedWeekdays: number[]; // 0 = Sunday ... 6 = Saturday
}

const TIME_SLOTS = ["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

function nextDays(count: number): Date[] {
  const days: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  for (let i = 1; days.length < count; i++) {
    const next = new Date(d);
    next.setDate(d.getDate() + i);
    days.push(next);
  }
  return days;
}

export default function BookingCalendar({ businessName, accentColor, closedWeekdays }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const days = nextDays(10);

  if (selectedDate && selectedTime) {
    return (
      <div className="rounded-2xl border border-text-primary/10 p-6 md:p-8">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: `${accentColor}1a`, color: accentColor }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">Booked</h3>
        <p className="text-sm text-text-primary/70 mb-4">
          {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} at {selectedTime}, with {businessName}.
        </p>
        <p className="text-xs text-text-primary/40">
          This is a demo booking to show the flow. Connected for real, this writes straight to your calendar and texts the patient a confirmation, no one on your end has to pick up a phone.
        </p>
        <button
          onClick={() => {
            setSelectedDate(null);
            setSelectedTime(null);
          }}
          className="mt-4 text-sm font-medium underline decoration-text-primary/20 hover:decoration-text-primary/60 transition-colors"
          style={{ color: accentColor }}
        >
          Try another slot
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-text-primary/10 p-6 md:p-8">
      <h3 className="text-lg font-semibold text-text-primary mb-1">
        {selectedDate ? "Pick a time" : "Pick a day"}
      </h3>
      <p className="text-sm text-text-primary/60 mb-5">
        This is what a patient sees the moment they're ready to book, right where the conversation already is.
      </p>

      {!selectedDate && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => {
            const closed = closedWeekdays.includes(day.getDay());
            return (
              <button
                key={day.toISOString()}
                disabled={closed}
                onClick={() => setSelectedDate(day)}
                className="shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-xl border text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                style={
                  closed
                    ? { borderColor: "var(--color-text-primary)", opacity: 0.15 }
                    : { borderColor: `${accentColor}40` }
                }
              >
                <span className="text-text-primary/50">{day.toLocaleDateString(undefined, { weekday: "short" })}</span>
                <span className="text-base font-semibold text-text-primary">{day.getDate()}</span>
              </button>
            );
          })}
        </div>
      )}

      {selectedDate && (
        <div>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-xs text-text-primary/50 hover:text-text-primary/80 mb-4 transition-colors"
          >
            ← {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </button>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className="px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:text-white"
                style={{ borderColor: `${accentColor}60`, color: accentColor }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
