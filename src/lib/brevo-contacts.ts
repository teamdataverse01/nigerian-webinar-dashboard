// Adds webinar registrants to a Brevo contact list, so the team can send them
// scheduled email/SMS reminders from Brevo.

/** "Webinar Nov 21 Registrants" in the company Brevo account — change for the next webinar. */
export const webinarRegistrantListId = 5;

type Registrant = { email: string; firstName: string; lastName: string; phone: string; country: string; smsConsent: boolean };

/**
 * Brevo's SMS field needs the full international number, e.g. +12025550199.
 * The form asks for the country code, but people often type local numbers, so the
 * common US/Canada and Nigerian local formats are converted; anything else is used as typed.
 */
export function toInternationalPhone(phone: string, country: string) {
  const digits = phone.replace(/\D/g, "");
  const typedPlus = phone.trim().startsWith("+");
  if (country === "US" || country === "CA") {
    if (digits.length === 10) return `+1${digits}`;
    if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  }
  if (country === "NG" && !typedPlus) {
    if (digits.length === 11 && digits.startsWith("0")) return `+234${digits.slice(1)}`;
    if (digits.length === 10) return `+234${digits}`;
  }
  return `+${digits}`;
}

/**
 * Creates or updates the contact and adds it to the webinar list. The phone number is only
 * saved for SMS when the registrant ticked the SMS consent box. Returns "ok" or where it stopped.
 */
export async function addWebinarRegistrantToBrevo(r: Registrant): Promise<string> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return "no-key";

  const save = (attributes: Record<string, string>) => fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ email: r.email, attributes, listIds: [webinarRegistrantListId], updateEnabled: true }),
  });

  const names = { FIRSTNAME: r.firstName, LASTNAME: r.lastName };
  if (!r.smsConsent) {
    const res = await save(names);
    if (!res.ok) console.error("Brevo contact save failed", await res.text());
    return res.ok ? "ok-email-only" : `contact:${res.status}`;
  }
  let res = await save({ ...names, SMS: toInternationalPhone(r.phone, r.country) });
  if (!res.ok) {
    // Brevo rejects a number it considers invalid or already used by another contact; keep the email contact anyway.
    const firstError = await res.text();
    res = await save(names);
    if (!res.ok) {
      console.error("Brevo contact save failed", firstError, await res.text());
      return `contact:${res.status}`;
    }
    console.error("Brevo contact saved without SMS number", firstError);
    return "ok-no-sms";
  }
  return "ok";
}
