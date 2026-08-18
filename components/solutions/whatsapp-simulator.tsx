"use client";

// Pixel-styled WhatsApp conversation simulator. Runs the exact same AI backend
// as the floating ChatbotDemo widget (same /api/chat-demo route, same per-industry
// system prompt) but wrapped in a WhatsApp-accurate shell so a business owner sees
// the specific channel their own customers already use, not a generic chat box.
//
// The thing this proves that a plain chat widget can't: when the AI decides it's
// time to book, it emits a [[BOOK: label]] marker (instructed server-side) which
// renders here as a real tappable WhatsApp-style CTA button, not just described
// in text. Clicking it scrolls to the real contact form on this page, closing the
// loop from "customer asks a question" to "customer takes a booking action" in
// one visible thread, which is the actual claim being made.

import { useState, useRef, useEffect, useCallback } from "react";
import type { IndustryConfig, SolutionIndustryContent } from "@/data/solutions-config";

interface Message {
  role: "user" | "assistant";
  content: string;
  bookLabel?: string;
  time: string;
}

function nowStamp(): string {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

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

// Strips a trailing [[BOOK: label]] marker out of the display text and returns
// the label separately so it can be rendered as a button, not read as text.
function parseBookingMarker(raw: string): { text: string; bookLabel?: string } {
  const match = raw.match(/\[\[BOOK:\s*(.+?)\s*\]\]/);
  if (!match) return { text: raw.trim() };
  return { text: raw.replace(match[0], "").trim(), bookLabel: match[1].trim() };
}

interface Props {
  industry: IndustryConfig;
  content: SolutionIndustryContent;
}

export default function WhatsAppSimulator({ industry, content }: Props) {
  const businessName = DEMO_BUSINESS_NAMES[industry.slug] ?? `${industry.label} Business`;

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! Thanks for messaging ${businessName} 👋 How can I help?`, time: nowStamp() },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Reset the thread when the visitor switches industry tabs.
  useEffect(() => {
    setMessages([{ role: "assistant", content: `Hi! Thanks for messaging ${businessName} 👋 How can I help?`, time: nowStamp() }]);
  }, [industry.slug, businessName]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: Message = { role: "user", content: text.trim(), time: nowStamp() };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch("/api/chat-demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
            systemPrompt: content.chatSystemPrompt,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeout);
        const data = await res.json();

        if (res.ok && data.reply) {
          const { text: replyText, bookLabel } = parseBookingMarker(data.reply);
          setMessages((prev) => [...prev, { role: "assistant", content: replyText, bookLabel, time: nowStamp() }]);
        } else if (res.status === 429) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "This demo's had a lot of messages this hour and needs a short break. A real deployment wouldn't rate-limit your actual customers, this is just to keep the demo server steady.", time: nowStamp() },
          ]);
        } else {
          setMessages((prev) => [...prev, { role: "assistant", content: "Having trouble replying right now, try again in a moment.", time: nowStamp() }]);
        }
      } catch (err) {
        const timedOut = err instanceof Error && err.name === "AbortError";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: timedOut ? "That took too long, try again." : "Connection error, try again in a moment.", time: nowStamp() },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, content.chatSystemPrompt]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleBookClick = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mx-auto max-w-sm rounded-[2rem] border-[10px] border-[#111b21] bg-[#111b21] shadow-2xl overflow-hidden">
      {/* WhatsApp header */}
      <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {businessName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{businessName}</p>
          <p className="text-[#d1e7e2] text-[11px]">{loading ? "typing…" : "online"}</p>
        </div>
        <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 20.5H7A2.5 2.5 0 0 1 4.5 18V6A2.5 2.5 0 0 1 7 3.5h10A2.5 2.5 0 0 1 19.5 6v12a2.5 2.5 0 0 1-2.5 2.5zM12 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
        </svg>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="h-[420px] overflow-y-auto px-3 py-3 space-y-2"
        style={{
          backgroundColor: "#0b141a",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.035) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[82%] flex flex-col gap-1">
              <div
                className={`px-3 py-2 rounded-lg text-[13px] leading-snug shadow-sm ${
                  msg.role === "user" ? "bg-[#005c4b] text-white rounded-tr-none" : "bg-[#202c33] text-[#e9edef] rounded-tl-none"
                }`}
              >
                <span>{msg.content}</span>
                <span className={`flex items-center gap-1 mt-1 text-[10px] ${msg.role === "user" ? "justify-end text-white/70" : "justify-end text-[#8696a0]"}`}>
                  {msg.time}
                  {msg.role === "user" && (
                    <span className="text-[#53bdeb]" aria-label="Read">✓✓</span>
                  )}
                </span>
              </div>
              {msg.bookLabel && (
                <button
                  onClick={handleBookClick}
                  className="px-3 py-2 rounded-lg text-[13px] font-medium text-[#53bdeb] bg-[#202c33] flex items-center justify-center gap-2 hover:bg-[#28343c] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  {msg.bookLabel}
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#202c33] px-3 py-2 rounded-lg rounded-tl-none">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#8696a0] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="bg-[#202c33] px-3 py-2.5 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-full bg-[#2a3942] text-[#e9edef] text-[13px] placeholder-[#8696a0] outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center text-white disabled:opacity-40 transition-opacity shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}