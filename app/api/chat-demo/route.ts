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
    //
    // Written to the same bar as the outreach email copywriting elsewhere in this
    // project: reply to the actual thing the person asked, don't pivot to a script.
    // A real front-desk person doesn't recite a menu of services when asked one
    // specific question, they answer that question, then let the conversation lead
    // naturally to the next thing. That's the read-aloud test here too: if a real
    // employee wouldn't say it that way out loud, rewrite it.
    const toneInstruction = "Talk like a real, friendly member of staff who has done this job for years, not a script reading off a services list. Answer the specific thing they just asked before adding anything else. Use contractions, keep sentences short and conversational, vary how you open replies instead of always restating their question back at them. Never use em dashes, use a comma or period instead. Don't repeat 'I'm an AI' or similar every message, and don't pad replies with corporate filler like 'I'd be happy to help' or 'great question'. If someone directly and sincerely asks whether you're a bot or an AI, say yes honestly rather than denying it.";

    // Booking-button layer: the moment the conversation reaches "let's get you
    // booked", emit a machine-parseable marker so the frontend can render a real
    // tappable button instead of just describing one in text. This is what turns
    // the demo from "the AI can answer questions" into "watch it actually hand the
    // visitor a booking action", which is the whole point of the WhatsApp demo.
    // Keep the label short and put the marker on its own final line so it has room
    // to finish inside the token budget rather than getting cut off mid-marker.
    const bookingButtonInstruction = "The moment you'd naturally offer to book something (a slot, appointment, consultation, or table) rather than just answer a question, finish your reply, then on a new final line add exactly: [[BOOK: <button label, 2-4 words max>]]. Keep the label very short so the whole marker fits easily. Only include this marker when you are genuinely ready to hand off to booking, not on every message, and never more than one per reply. Do not explain or mention the marker itself, it's rendered as a button, not read as text.";

    const groqMessages = [
      { role: "system", content: `${toneInstruction}\n\n${bookingButtonInstruction}\n\n${systemPrompt || "You are a helpful business assistant."}` },
      ...messages.slice(-10), // Last 10 messages only
    ];

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: groqMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq API error:", err);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    const data = await res.json();
    let reply: string = data.choices?.[0]?.message?.content ?? "Sorry, I could not generate a response.";

    // Safety net, not the primary fix: strip any em dash the model slips in
    // despite the instruction. Also drop a [[BOOK: ...]] marker that got cut off
    // mid-way (hit the token limit before the closing ]]), catching it from the
    // last unclosed "[[" onward rather than requiring "[[BOOK:" specifically,
    // since a truncation can land before the colon even finishes.
    reply = reply.replace(/—/g, ",");
    const lastOpen = reply.lastIndexOf("[[");
    if (lastOpen !== -1 && !reply.slice(lastOpen).includes("]]")) {
      reply = reply.slice(0, lastOpen);
    }
    reply = reply.trim();

    // If stripping that fragment left nothing (the model's entire truncated
    // output was the marker itself, no sentence before it), fall back to a safe
    // line rather than showing a blank bubble.
    if (!reply) {
      reply = "Let me get that sorted for you, one moment.";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat demo error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
