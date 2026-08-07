"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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

export default function ChatbotDemo({ industry, content }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! I'm an AI assistant demo for your ${industry.label.toLowerCase()} business. Ask me anything!` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check speech support on mount
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      setSpeechSupported(true);
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-GB";
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript;
        if (transcript) {
          setInput(transcript);
          // Auto-submit after voice input
          setTimeout(() => {
            const form = document.getElementById("chat-demo-form") as HTMLFormElement;
            form?.requestSubmit();
          }, 100);
        }
      };
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Reset messages when industry changes
  useEffect(() => {
    setMessages([
      { role: "assistant", content: `Hi! I'm an AI assistant demo for your ${industry.label.toLowerCase()} business. Ask me anything!` },
    ]);
  }, [industry.slug, industry.label]);

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
        // Speak the response
        if (window.speechSynthesis && listening) {
          const utterance = new SpeechSynthesisUtterance(data.reply);
          utterance.rate = 1;
          utterance.pitch = 1;
          window.speechSynthesis.speak(utterance);
        }
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
  }, [messages, loading, content.chatSystemPrompt, listening]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        style={{ backgroundColor: industry.accentColor, zIndex: 9999 }}
        aria-label={open ? "Close chat demo" : "Open chat demo"}
      >
        {open ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <Icon name="chat" className="w-6 h-6" />
        )}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#e2e8f0] overflow-hidden flex flex-col"
            style={{ zIndex: 9998, maxHeight: "min(500px, 70vh)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 text-white flex items-center justify-between shrink-0" style={{ backgroundColor: industry.accentColor }}>
              <div>
                <p className="text-sm font-semibold">Live AI Demo</p>
                <p className="text-[10px] opacity-80">Try asking it anything</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20">Demo</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "text-white rounded-tr-sm"
                        : "bg-[#f1f5f9] text-[#334155] rounded-tl-sm"
                    }`}
                    style={msg.role === "user" ? { backgroundColor: industry.accentColor } : undefined}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#f1f5f9] px-3 py-2 rounded-xl rounded-tl-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#94a3b8] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form id="chat-demo-form" onSubmit={handleSubmit} className="p-3 border-t border-[#e2e8f0] flex gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a] focus:outline-none focus:ring-1"
                style={{ "--tw-ring-color": industry.accentColor } as React.CSSProperties}
                disabled={loading}
              />
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all ${
                    listening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
                  }`}
                  aria-label={listening ? "Stop recording" : "Start voice input"}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-lg text-white flex items-center justify-center text-sm disabled:opacity-40 transition-opacity"
                style={{ backgroundColor: industry.accentColor }}
              >
                ↑
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
