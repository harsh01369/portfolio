import { NextResponse } from "next/server";

// Simple in-memory rate limiter: 60 messages per IP per hour.
// Note: on localhost with no reverse proxy, x-forwarded-for is unset, so every
// dev session shares one "unknown" bucket. Keep this generous enough that
// normal testing/demoing doesn't trip it; a real deploy behind Vercel gets
// real per-visitor IPs.
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 3600_000 });
    return false;
  }
  if (entry.count >= 60) return true;
  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    const { messages, systemPrompt } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages required" }, { status: 400 });
    }

    // Tone layer applied on top of every industry's own knowledge, so it doesn't
    // need repeating in each prompt. Warm and natural, but honest if asked directly
    // whether it's a bot — real disclosure laws (EU AI Act Art. 50, California's bot
    // law) require that, and pretending otherwise is a bad bet for a real business.
    const toneInstruction = "Talk like a real, friendly member of staff, not a formal script: use contractions, keep it warm and casual, don't repeat 'I'm an AI' or similar every message. If someone directly and sincerely asks whether you're a bot or an AI, say yes honestly rather than denying it.";

    const groqMessages = [
      { role: "system", content: `${toneInstruction}\n\n${systemPrompt || "You are a helpful business assistant."}` },
      ...messages.slice(-10), // Last 10 messages only
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq API error:", err);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I could not generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat demo error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
