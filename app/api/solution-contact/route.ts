import { NextResponse } from "next/server";
import { appendToInbox } from "@/lib/github-inbox";

// Simple in-memory rate limiter, same pattern as chat-demo: 10 submissions per
// IP per hour. This endpoint had none before, which combined with the raw
// unescaped HTML interpolation below made it an easy target to spam or abuse.
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 3600_000 });
    return false;
  }
  if (entry.count >= 10) return true;
  entry.count++;
  return false;
}

// Every field below used to go straight into htmlContent unescaped -- a
// submitted businessName like "<img src=x onerror=...>" would render as live
// HTML in the email Harsh opens. Standard entity-escape before interpolating
// anything user-supplied into HTML.
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 300;
const MAX_MESSAGE_LENGTH = 3000;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }

    const { businessName, need, email, phone, website, message, industry, solution, estimate, leadId, campaign } = await request.json();

    if (!businessName || !need || !email) {
      return NextResponse.json({ error: "Business name, service needed, and email are required" }, { status: 400 });
    }
    if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    if (typeof businessName !== "string" || businessName.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: "Business name is too long" }, { status: 400 });
    }
    if (typeof message === "string" && message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    const estimateLine = estimate
      ? `${estimate.oneTime > 0 ? `$${estimate.oneTime.toLocaleString()} one-time` : ""}${estimate.oneTime > 0 && estimate.monthly > 0 ? " + " : ""}${estimate.monthly > 0 ? `$${estimate.monthly}/mo` : ""}${estimate.discountPct > 0 ? ` (${estimate.discountPct}% bundle discount)` : ""}${estimate.bonusUnlocked ? ", Review Requests included free" : ""}`
      : null;

    // Durable record in OIE's inbox, independent of whether the Brevo email
    // below succeeds -- a lead should never be silently lost to a Brevo
    // hiccup. Best-effort: failure here is logged, not surfaced to the
    // visitor, since the Brevo notification below is still the primary path.
    // Awaited (not fire-and-forget) since a serverless function can be frozen
    // the moment the response is sent, which would kill an un-awaited write.
    const inboxResult = await appendToInbox("solution-contact", {
      businessName, need, email, phone, website, message, industry, solution, estimate, leadId, campaign,
    });
    if (!inboxResult.ok) console.error("solution-contact: inbox write failed:", inboxResult.error);

    // Subject lines and the replyTo name don't render as HTML, but a raw
    // newline in either can still smuggle extra email headers -- strip them.
    const safeSubjectName = String(businessName).replace(/[\r\n]/g, " ").slice(0, MAX_FIELD_LENGTH);
    const safeSubjectNeed = String(need).replace(/[\r\n]/g, " ").slice(0, MAX_FIELD_LENGTH);

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": process.env.BREVO_API_KEY! },
      body: JSON.stringify({
        sender: { name: "Solution Lead", email: process.env.BREVO_SENDER_EMAIL! },
        to: [{ email: process.env.BREVO_SENDER_EMAIL! }],
        replyTo: { name: safeSubjectName, email },
        subject: `New Lead: ${safeSubjectName} — ${safeSubjectNeed} (${escapeHtml(industry)})`,
        htmlContent: `
          <h2>New Solution Page Lead</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Business</td><td style="padding:8px;border:1px solid #e2e8f0;">${escapeHtml(businessName)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Industry</td><td style="padding:8px;border:1px solid #e2e8f0;">${escapeHtml(industry)}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Modules</td><td style="padding:8px;border:1px solid #e2e8f0;">${escapeHtml(need)}</td></tr>
            ${estimateLine ? `<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Estimate</td><td style="padding:8px;border:1px solid #e2e8f0;">${escapeHtml(estimateLine)}</td></tr>` : ""}
            <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #e2e8f0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #e2e8f0;">${escapeHtml(phone)}</td></tr>` : ""}
            ${website ? `<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Website</td><td style="padding:8px;border:1px solid #e2e8f0;">${escapeHtml(website)}</td></tr>` : ""}
          </table>
          ${message ? `<h3>Message:</h3><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>` : ""}
          <hr /><p style="color:#94a3b8;font-size:12px;">From harshkhetia.dev/solutions/${escapeHtml(solution)}?industry=${escapeHtml(industry)}</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Brevo error:", error);
      return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Solution contact error:", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
