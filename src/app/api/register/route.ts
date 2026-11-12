import type { NextRequest } from "next/server";
import { sendConfirmationEmail } from "@/lib/confirmation-email";
import { hashForMeta, sendMetaEvent } from "@/lib/meta-server";

// Webinar registration: appends the registrant to the Google Sheet (through the
// sheet's Apps Script web app) and reports CompleteRegistration to Meta with
// hashed contact details. The browser fires the pixel event with the same ID.

type Body = {
  first_name?: string;
  last_name?: string;
  email?: string;
  country?: string;
  phone?: string;
  sms_consent?: boolean;
  event_id?: string;
  page_url?: string;
  utm?: Record<string, string>;
  test_event_code?: string;
};

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: NextRequest) {
  const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  if (!sheetUrl) return Response.json({ ok: false, error: "Registration is not set up yet." }, { status: 503 });

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const firstName = clean(body.first_name, 100);
  const lastName = clean(body.last_name, 100);
  const email = clean(body.email, 254).toLowerCase();
  const country = clean(body.country, 2).toUpperCase();
  const phone = clean(body.phone, 30);
  const phoneDigits = phone.replace(/\D/g, "");
  const eventId = clean(body.event_id, 100);

  if (!firstName || !lastName) return Response.json({ ok: false, error: "Please enter your first and last name." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  if (!/^[A-Z]{2}$/.test(country)) return Response.json({ ok: false, error: "Please select your country." }, { status: 400 });
  if (phoneDigits.length < 7 || phoneDigits.length > 15) return Response.json({ ok: false, error: "Please enter a valid phone number with country code." }, { status: 400 });
  if (!eventId) return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const utm = body.utm ?? {};
  const sheetRes = await fetch(sheetUrl, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email,
      country,
      phone,
      sms_consent: body.sms_consent === true,
      utm_source: clean(utm.utm_source),
      utm_medium: clean(utm.utm_medium),
      utm_campaign: clean(utm.utm_campaign),
      utm_content: clean(utm.utm_content),
      page_url: clean(body.page_url, 500),
    }),
  }).catch(() => null);
  const sheetOk = sheetRes?.ok && ((await sheetRes.json().catch(() => null)) as { ok?: boolean } | null)?.ok === true;
  if (!sheetOk) {
    console.error("Google Sheet registration failed", sheetRes?.status);
    return Response.json({ ok: false, error: "We couldn't save your registration. Please try again." }, { status: 502 });
  }

  // The registration is already saved, so email or Meta failures are logged rather than shown to the visitor.
  const confirmation = sendConfirmationEmail({ email, firstName, lastName })
    .catch((e) => console.error("Brevo confirmation email error", e));
  const metaEvent = sendMetaEvent(request, {
    eventName: "CompleteRegistration",
    eventId,
    eventSourceUrl: clean(body.page_url, 1000),
    testEventCode: clean(body.test_event_code, 30),
    hashedUserData: {
      em: [hashForMeta(email)],
      ph: [hashForMeta(phoneDigits)],
      fn: [hashForMeta(firstName)],
      ln: [hashForMeta(lastName)],
      country: [hashForMeta(country)],
    },
  }).catch((e) => console.error("Meta Conversions API error", e));
  await Promise.all([confirmation, metaEvent]);

  return Response.json({ ok: true });
}
