// Zero-cost bridge between this deployed app and the OIE campaign database,
// which lives in a local-only Postgres instance no cloud service can reach
// (see the plan this implements: dental_leadgen_pipeline memory / Harsh's
// 2026-09-09 call to avoid Supabase on cost grounds). Instead of writing to a
// database directly, each event gets committed as its own small JSON file into
// the OIE repo via the GitHub Contents API. A live Claude/Harsh session then
// `git pull`s and syncs new files into the real local DB periodically
// (src/scripts/sync-inbox.ts in the OIE repo), the same "someone runs a script
// periodically" pattern already used for follow-up sending.
//
// Each event is its own file (never an update to a shared file), so concurrent
// webhook deliveries can never race or clobber each other -- no read-before-write
// needed, unlike updating one shared JSON blob.

const INBOX_OWNER = "harsh01369";
const INBOX_REPO = "opportunity-intelligence-engine";
const INBOX_PATH = "data/inbox";

function randomId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export async function appendToInbox(kind: string, data: unknown): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.GITHUB_INBOX_TOKEN;
  if (!token) {
    console.error("appendToInbox: GITHUB_INBOX_TOKEN not set, dropping event", kind);
    return { ok: false, error: "not configured" };
  }

  const filename = `${kind}-${Date.now()}-${randomId()}.json`;
  const path = `${INBOX_PATH}/${filename}`;
  const content = Buffer.from(JSON.stringify({ kind, receivedAt: new Date().toISOString(), data }, null, 2)).toString("base64");

  try {
    const res = await fetch(`https://api.github.com/repos/${INBOX_OWNER}/${INBOX_REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `inbox: ${kind}`,
        content,
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("appendToInbox: GitHub API error", res.status, errText);
      return { ok: false, error: `GitHub API ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("appendToInbox: request failed", err);
    return { ok: false, error: "request failed" };
  }
}
