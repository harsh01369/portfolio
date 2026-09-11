import { NextResponse } from "next/server";
import { getContentFor, isValidIndustrySlug, isValidSolutionSlug } from "@/lib/solutions";
import { getLeadPreviewByOpportunityId } from "@/data/lead-previews";

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

// Standalone preview sites (levee-dental-preview, magnolia-dental-preview, etc.)
// reuse this endpoint cross-origin rather than duplicating the Groq wiring and
// tone rules per site, each sending its own bespoke systemPrompt (these are
// one-off businesses, not part of the industry/solution taxonomy below, so
// there's no server-side prompt to look up for them). A wildcard origin used
// to be allowed here on the theory that no secrets are exposed and the route
// is IP rate-limited -- that undersold the real risk: an open systemPrompt
// input on a public endpoint doubles as a free, unrestricted Groq proxy for
// anyone who finds the URL, unrelated to Harsh's business entirely. Origin is
// now checked against an explicit allowlist, and the raw-systemPrompt path
// below is gated on passing that check.
const ALLOWED_ORIGINS = new Set(["https://harshkhetia.dev", "https://www.harshkhetia.dev"]);
// Preview-site deployments live on Vercel's own subdomain and their exact
// hostname can change per-deploy (preview URLs get a hash suffix), so this
// matches by prefix + suffix rather than an exact string.
const PREVIEW_SITE_ORIGIN_PATTERN = /^https:\/\/(levee-dental-preview|magnolia-dental-preview)[a-z0-9-]*\.vercel\.app$/;

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.has(origin) || PREVIEW_SITE_ORIGIN_PATTERN.test(origin);
}

function withCors(response: NextResponse, origin: string | null): NextResponse {
  if (isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin!);
    response.headers.set("Vary", "Origin");
  }
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS(request: Request) {
  return withCors(new NextResponse(null, { status: 204 }), request.headers.get("origin"));
}

// Max length for a preview site's bespoke systemPrompt -- generous enough for
// a real per-business prompt, small enough to bound abuse if the origin check
// is ever bypassed some other way.
const MAX_CUSTOM_PROMPT_LENGTH = 4000;

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return withCors(NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      ), origin);
    }

    const { messages, systemPrompt, industry, solution, lead } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return withCors(NextResponse.json({ error: "Messages required" }, { status: 400 }), origin);
    }

    // Resolve the actual system prompt server-side whenever possible, so a
    // caller can never inject arbitrary instructions just by sending their
    // own systemPrompt string. The portfolio's own solution-page widgets
    // always take this path (they already know their industry/solution).
    //
    // A `lead` id (the same real Opportunity id already carried through every
    // dental campaign link as &lead=) takes priority over the generic
    // industry/solution lookup when it matches a known per-lead preview --
    // this is what makes a hot-lead's preview page talk about their actual
    // business instead of the generic "Bright Smile Dental" demo copy. Still
    // fully server-resolved: `lead` is looked up against a fixed config map,
    // never used to build a prompt directly, so it carries none of the
    // injection risk a free-text systemPrompt would.
    let resolvedPrompt: string;
    const leadPreview = typeof lead === "string" ? getLeadPreviewByOpportunityId(lead) : undefined;
    if (leadPreview) {
      resolvedPrompt = leadPreview.chatSystemPrompt;
    } else if (typeof industry === "string" && typeof solution === "string" && isValidIndustrySlug(industry) && isValidSolutionSlug(solution)) {
      resolvedPrompt = getContentFor(solution, industry).chatSystemPrompt;
    } else if (typeof systemPrompt === "string" && systemPrompt.trim() && isAllowedOrigin(origin)) {
      // Only the known standalone preview sites take this path, and only
      // when their origin actually matches -- a bespoke prompt for a
      // one-off business that isn't part of the industry/solution config.
      resolvedPrompt = systemPrompt.slice(0, MAX_CUSTOM_PROMPT_LENGTH);
    } else if (typeof systemPrompt === "string" && systemPrompt.trim()) {
      return withCors(NextResponse.json({ error: "Not authorized for a custom prompt" }, { status: 403 }), origin);
    } else {
      return withCors(NextResponse.json({ error: "A valid industry/solution pair or an authorized systemPrompt is required" }, { status: 400 }), origin);
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
      { role: "system", content: `${toneInstruction}\n\n${bookingButtonInstruction}\n\n${resolvedPrompt}` },
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
      return withCors(NextResponse.json({ error: "AI service unavailable" }, { status: 502 }), origin);
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

    return withCors(NextResponse.json({ reply }), origin);
  } catch (error) {
    console.error("Chat demo error:", error);
    return withCors(NextResponse.json({ error: "Something went wrong" }, { status: 500 }), origin);
  }
}
