import {
  webinarDateLong, webinarGoogleCalendarUrl, webinarJoinUrl, webinarMeetingId, webinarName,
  webinarPasscode, webinarTimeText, whatsappCommunityUrl,
} from "@/lib/webinar";

// Registration confirmation, sent through Brevo's transactional email API right after sign-up.
const sender = { name: "Dataverse", email: "msalaudeen@dataversesolutions.org" };
const subject = "You're registered: Data Privacy Career Masterclass (Sat, Nov 21)";

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

const learnPoints = [
  "The 5-Step Transition Framework for moving into data privacy.",
  "The gap that may be holding you back.",
  "How to leverage your existing experience to pursue high-value privacy roles.",
  "How our Big Tech Interview Blueprint can guide your preparation.",
  "A roadmap to pursue data privacy opportunities paying $120K–$250K.",
];

function html(firstName: string) {
  const name = esc(firstName);
  const calendarUrl = esc(webinarGoogleCalendarUrl());
  const p = "margin:0 0 16px;font-size:16px;line-height:1.6;color:#1f1f29;";
  const btn = "display:inline-block;padding:14px 26px;border-radius:999px;background:#7c3aed;color:#ffffff;font-weight:700;text-decoration:none;";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f2fa;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2fa;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;padding:32px 28px;">
<tr><td>
<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#7c3aed;">Registration Confirmation</p>
<p style="${p}">Hi ${name},</p>
<p style="${p}">Thank you for registering for ${esc(webinarName)}!</p>
<p style="${p}">This webinar is not just about learning privacy regulations. It's about understanding how to turn your existing professional experience into a valuable career in data privacy.</p>
<p style="${p}"><strong>The results are already happening:</strong><br>A lawyer with no prior data privacy experience secured two data privacy roles in under six weeks.</p>
<p style="${p}margin-bottom:8px;"><strong>During the webinar, you'll understand:</strong></p>
${learnPoints.map((l) => `<p style="margin:0 0 6px;font-size:16px;line-height:1.5;color:#1f1f29;">✅ ${esc(l)}</p>`).join("")}
<div style="margin:24px 0;padding:20px;border-radius:12px;background:#f6f1ff;border-left:4px solid #7c3aed;">
<p style="margin:0 0 10px;font-size:14px;font-weight:700;letter-spacing:1px;color:#7c3aed;">👉 WEBINAR DETAILS</p>
<p style="margin:0 0 6px;font-size:16px;color:#1f1f29;"><strong>Date:</strong> ${esc(webinarDateLong)}</p>
<p style="margin:0 0 6px;font-size:16px;color:#1f1f29;"><strong>Time:</strong> ${esc(webinarTimeText)}</p>
<p style="margin:0 0 6px;font-size:16px;color:#1f1f29;"><strong>Location:</strong> <a href="${esc(webinarJoinUrl)}" style="color:#7c3aed;">Join on Zoom</a></p>
<p style="margin:0;font-size:16px;color:#1f1f29;"><strong>Meeting ID:</strong> ${esc(webinarMeetingId)} &nbsp;·&nbsp; <strong>Passcode:</strong> ${esc(webinarPasscode)}</p>
</div>
<p style="${p}margin-bottom:8px;"><strong>Do these now:</strong></p>
<p style="margin:0 0 6px;font-size:16px;color:#1f1f29;">1. <a href="${calendarUrl}" style="color:#7c3aed;">Add the webinar to your calendar</a>.</p>
<p style="margin:0 0 6px;font-size:16px;color:#1f1f29;">2. Bookmark the <a href="${esc(webinarJoinUrl)}" style="color:#7c3aed;">webinar room</a>.</p>
<p style="margin:0 0 20px;font-size:16px;color:#1f1f29;">3. Come prepared with your questions.</p>
<p style="margin:0 0 24px;"><a href="${esc(whatsappCommunityUrl)}" style="${btn}">Join Our WhatsApp Community</a></p>
<p style="margin:0;font-size:16px;line-height:1.6;color:#1f1f29;">See you live!<br>The Dataverse Team</p>
</td></tr></table>
</td></tr></table></body></html>`;
}

function text(firstName: string) {
  return [
    "Registration Confirmation",
    "",
    `Hi ${firstName},`,
    "",
    `Thank you for registering for ${webinarName}!`,
    "",
    "This webinar is not just about learning privacy regulations. It's about understanding how to turn your existing professional experience into a valuable career in data privacy.",
    "",
    "The results are already happening:",
    "A lawyer with no prior data privacy experience secured two data privacy roles in under six weeks.",
    "",
    "During the webinar, you'll understand:",
    ...learnPoints.map((l) => `- ${l}`),
    "",
    "WEBINAR DETAILS",
    `Date: ${webinarDateLong}`,
    `Time: ${webinarTimeText}`,
    `Location: ${webinarJoinUrl}`,
    `Meeting ID: ${webinarMeetingId}  Passcode: ${webinarPasscode}`,
    "",
    "Do these now:",
    `1. Add the webinar to your calendar: ${webinarGoogleCalendarUrl()}`,
    "2. Bookmark the webinar room.",
    "3. Come prepared with your questions.",
    "",
    `Join Our WhatsApp Community: ${whatsappCommunityUrl}`,
    "",
    "See you live!",
    "The Dataverse Team",
  ].join("\n");
}

/** Sends the registration confirmation via Brevo. Returns whether Brevo accepted it. */
export async function sendConfirmationEmail(to: { email: string; firstName: string; lastName: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return false;
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender,
      to: [{ email: to.email, name: `${to.firstName} ${to.lastName}`.trim() }],
      subject,
      htmlContent: html(to.firstName),
      textContent: text(to.firstName),
      tags: ["webinar-confirmation"],
    }),
  });
  if (!res.ok) console.error("Brevo confirmation email failed", res.status, await res.text());
  return res.ok;
}
