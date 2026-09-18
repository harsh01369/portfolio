import { NextResponse } from "next/server";

// Enamel is a fully static export site (no API routes of its own), so its
// contact form calls this route cross-origin instead of duplicating a whole
// second Brevo-backed backend. Scoped to the specific known origins rather
// than "*" so this doesn't become an open mail relay for anyone's site.
const ALLOWED_ORIGINS = [
  "https://enamel-lemon.vercel.app",
  "http://localhost:3411", // enamel local dev
];

function corsHeaders(origin: string | null): Record<string, string> {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }
  return {};
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const cors = corsHeaders(origin);

  try {
    const { name, email, message, source } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400, headers: cors }
      );
    }

    // source lets Enamel's cross-origin submissions be told apart from the
    // portfolio's own form in the inbox, without needing a second endpoint.
    const isEnamel = source === "enamel";
    const label = isEnamel ? "Enamel Contact" : "Portfolio Contact";

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: label,
          email: process.env.BREVO_SENDER_EMAIL!,
        },
        to: [{ email: process.env.BREVO_SENDER_EMAIL! }],
        replyTo: { name, email },
        subject: `${label}: ${name}`,
        htmlContent: `
          <h2>New message from ${isEnamel ? "Enamel" : "your portfolio"}</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Brevo error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500, headers: cors }
      );
    }

    return NextResponse.json({ success: true }, { headers: cors });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500, headers: cors }
    );
  }
}
