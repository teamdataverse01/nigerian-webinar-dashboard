import {
  webinarDateLong, webinarGoogleCalendarUrl, webinarJoinUrl, webinarMeetingId, webinarName,
  webinarPasscode, webinarTimeText, whatsappCommunityUrl,
} from "@/lib/webinar";

// Registration confirmation, sent through Brevo's transactional email API right after sign-up.
// Wording follows the team's "SALES, MARKETING AND ONBOARDING EMAILS" doc word for word.
// Must be a verified sender in the Brevo account that BREVO_API_KEY belongs to.
const sender = { name: "Dataverse Solutions", email: "info@dataversesolutions.org" };
const subject = "Registration Confirmation";

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
  const link = "color:#1a73e8;";
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f4f2fa;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2fa;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;padding:32px 28px;">
<tr><td>
<p style="${p}">Hi ${name},</p>
<p style="${p}">Thank you for registering for ${esc(webinarName)}!</p>
<p style="${p}">This webinar is not just about learning privacy regulations. It's about understanding how to turn your existing professional experience into a valuable career in data privacy.</p>
<p style="${p}margin-bottom:8px;"><strong>The results are already happening:</strong></p>
<p style="${p}padding-left:24px;"><em>A lawyer with no prior data privacy experience secured two data privacy roles in under six weeks.</em></p>
<p style="${p}margin-bottom:8px;"><strong>During the webinar, you'll understand:</strong></p>
${learnPoints.map((l) => `<p style="margin:0 0 8px;font-size:16px;line-height:1.5;color:#1f1f29;">✅ ${esc(l)}</p>`).join("")}
<p style="${p}margin-top:20px;"><strong>👉 WEBINAR DETAILS:</strong></p>
<p style="${p}margin-bottom:8px;"><strong>DATE: ${esc(webinarDateLong)}</strong></p>
<p style="${p}margin-bottom:8px;"><strong>TIME: ${esc(webinarTimeText)}</strong></p>
<p style="${p}margin-bottom:4px;"><strong>Location:</strong></p>
<p style="margin:0 0 4px;font-size:16px;line-height:1.5;word-break:break-all;"><a href="${esc(webinarJoinUrl)}" style="${link}">${esc(webinarJoinUrl)}</a></p>
<p style="${p}">MEETING ID: ${esc(webinarMeetingId)} PASSCODE: ${esc(webinarPasscode)}</p>
<p style="${p}margin-bottom:8px;"><strong>Do these now:</strong></p>
<ul style="margin:0 0 16px;padding-left:24px;font-size:16px;line-height:1.7;color:#1f1f29;">
<li><a href="${calendarUrl}" style="${link}">Add the webinar to your calendar.</a></li>
<li>Bookmark the webinar room.</li>
<li>Come prepared with your questions.</li>
<li><a href="${esc(whatsappCommunityUrl)}" style="${link}">Join Our WhatsApp Community here</a></li>
</ul>
<p style="margin:0;font-size:16px;line-height:1.6;color:#1f1f29;">See you live!</p>
</td></tr></table>
</td></tr></table></body></html>`;
}

function text(firstName: string) {
  return [
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
    ...learnPoints.map((l) => `✅ ${l}`),
    "",
    "👉 WEBINAR DETAILS:",
    "",
    `DATE: ${webinarDateLong}`,
    "",
    `TIME: ${webinarTimeText}`,
    "",
    "Location:",
    webinarJoinUrl,
    `MEETING ID: ${webinarMeetingId} PASSCODE: ${webinarPasscode}`,
    "",
    "Do these now:",
    `• Add the webinar to your calendar. ${webinarGoogleCalendarUrl()}`,
    "• Bookmark the webinar room.",
    "• Come prepared with your questions.",
    `• Join Our WhatsApp Community here: ${whatsappCommunityUrl}`,
    "",
    "See you live!",
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
