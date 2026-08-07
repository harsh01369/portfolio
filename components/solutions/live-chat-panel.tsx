"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type { IndustryConfig, SolutionIndustryContent } from "@/data/solutions-config";
import Icon from "./icon";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  industry: IndustryConfig;
  content: SolutionIndustryContent;
}

// The real, live chat agent — embedded directly in the site mockup, not a separate
// floating widget. This is what "See It Live" actually points to, so it has to be real.
export default function LiveChatPanel({ industry, content }: Props) {
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! I'm the live AI assistant for this ${industry.label.toLowerCase()} business. Ask me anything, this is a real conversation, not a script.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      { role: "assistant", content: `Hi! I'm the live AI assistant for this ${industry.label.toLowerCase()} business. Ask me anything, this is a real conversation, not a script.` },
    ]);
  }, [industry.slug, industry.label]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
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
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else if (res.status === 429) {
        setMessages((prev) => [...prev, { role: "assistant", content: "This demo has had a lot of messages in the last hour and needs a short break. Use the contact form below and I'll get back to you directly." }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble replying right now. You can try again, or use the contact form below to reach a real person." }]);
      }
    } catch (err) {
      const timedOut = err instanceof Error && err.name === "AbortError";
      setMessages((prev) => [...prev, { role: "assistant", content: timedOut
        ? "That took too long to answer. Try again, or use the contact form below to reach a real person."
        : "Connection error. Try again in a moment, or use the contact form below to reach a real person." }]);
    } finally {
      setLoading(false);
    }
  }, [messages, loading, content.chatSystemPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute bottom-4 right-4 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-[#e2e8f0] overflow-hidden flex flex-col"
      style={{ zIndex: 20, maxHeight: minimized ? "auto" : 380 }}
    >
      <button
        onClick={() => setMinimized((m) => !m)}
        className="px-3 py-2.5 text-white flex items-center justify-between shrink-0 w-full text-left"
        style={{ backgroundColor: industry.accentColor }}
      >
        <div className="flex items-center gap-2">
          <Icon name="chat" className="w-4 h-4" />
          <p className="text-xs font-semibold">Live AI Chat</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" /> Live
          </span>
          <Icon name="arrow-right" className={`w-3.5 h-3.5 transition-transform ${minimized ? "-rotate-90" : "rotate-90"}`} />
        </div>
      </button>

      {!minimized && (
      <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[140px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] px-2.5 py-1.5 rounded-lg text-[11px] leading-relaxed ${
                msg.role === "user" ? "text-white rounded-tr-sm" : "bg-[#f1f5f9] text-[#334155] rounded-tl-sm"
              }`}
              style={msg.role === "user" ? { backgroundColor: industry.accentColor } : undefined}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f1f5f9] px-2.5 py-1.5 rounded-lg rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-2 border-t border-[#e2e8f0] flex gap-1.5 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a real question..."
          className="flex-1 px-2.5 py-1.5 text-[11px] rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] focus:outline-none focus:ring-1"
          style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-8 h-8 rounded-md text-white flex items-center justify-center text-sm disabled:opacity-40 transition-opacity shrink-0"
          style={{ backgroundColor: industry.accentColor }}
        >
          <Icon name="arrow-right" className="w-4 h-4 -rotate-90" />
        </button>
      </form>
      </>
      )}
    </motion.div>
  );
}