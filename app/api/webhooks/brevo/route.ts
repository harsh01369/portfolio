import { NextResponse } from "next/server";
import { appendToInbox } from "@/lib/github-inbox";

// Receiver for Brevo's transactional webhook (opened/clicked/delivered/
// hardBounce/softBounce/blocked/unsubscribed/etc). Registered in Brevo's
// dashboard under Transactional > Settings > Webhooks, pointed at this route
// with a ?token=<BREVO_WEBHOOK_SECRET> query param so random internet traffic
// can't write into the inbox.
//
// This route deliberately does NOT try to interpret the payload -- it stores
// the raw event faithfully and lets the OIE-side sync script
// (src/scripts/sync-inbox.ts) do the interpretation, since that script can be
// iterated on freely in local dev without needing a redeploy here. Brevo can
// also batch multiple events into a single POST as a JSON array, so this
// handles both a single object and an array the same way.

function isAuthorized(request: Request): boolean {
  const secret = process.env.BREVO_WEBHOOK_SECRET;
  if (!secret) return false;
  const url = new URL(request.url);
  return url.searchParams.get("token") === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const events = Array.isArray(body) ? body : [body];
  const results = await Promise.all(events.map((e) => appendToInbox("brevo-event", e)));
  const failed = results.filter((r) => !r.ok).length;
  if (failed > 0) {
    console.error(`brevo webhook: ${failed}/${events.length} inbox writes failed`);
  }

  // Always 200 regardless of inbox write outcome -- Brevo retries/disables a
  // webhook that keeps returning errors, and losing one event to a transient
  // GitHub API hiccup is far better than Brevo giving up on the whole webhook.
  return NextResponse.json({ received: events.length });
}
