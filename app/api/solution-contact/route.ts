import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { businessName, need, email, phone, website, message, industry, solution } = await request.json();

    if (!businessName || !need || !email) {
      return NextResponse.json({ error: "Business name, service needed, and email are required" }, { status: 400 });
    }

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/json", "api-key": process.env.BREVO_API_KEY! },
      body: JSON.stringify({
        sender: { name: "Solution Lead", email: process.env.BREVO_SENDER_EMAIL! },
        to: [{ email: process.env.BREVO_SENDER_EMAIL! }],
        replyTo: { name: businessName, email },
        subject: `New Lead: ${businessName} — ${need} (${industry})`,
        htmlContent: `
          <h2>New Solution Page Lead</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px;">
            <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Business</td><td style="padding:8px;border:1px solid #e2e8f0;">${businessName}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Industry</td><td style="padding:8px;border:1px solid #e2e8f0;">${industry}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Need</td><td style="padding:8px;border:1px solid #e2e8f0;">${need}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #e2e8f0;"><a href="mailto:${email}">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Phone</td><td style="padding:8px;border:1px solid #e2e8f0;">${phone}</td></tr>` : ""}
            ${website ? `<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:bold;">Website</td><td style="padding:8px;border:1px solid #e2e8f0;">${website}</td></tr>` : ""}
          </table>
          ${message ? `<h3>Message:</h3><p>${message.replace(/\n/g, "<br />")}</p>` : ""}
          <hr /><p style="color:#94a3b8;font-size:12px;">From harshkhetia.dev/solutions/${solution}?industry=${industry}</p>
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
