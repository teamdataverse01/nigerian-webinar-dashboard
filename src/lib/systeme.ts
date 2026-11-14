// Adds webinar registrants to systeme.io and tags them, using the public API.
const apiBase = "https://api.systeme.io/api";
/** "Webinar Registrants - November 21 2026 (Americans)" — change when the webinar date changes. */
export const webinarRegistrantTagId = 2292646;

type Registrant = { email: string; firstName: string; lastName: string; phone: string; country: string };

function apiKey() {
  return process.env.SYSTEME_API_KEY ?? process.env.SYSTEMEAPIKEY;
}

async function call(path: string, key: string, init: RequestInit = {}) {
  return fetch(`${apiBase}${path}`, {
    ...init,
    headers: { "X-API-Key": key, "Content-Type": "application/json", accept: "application/json", ...init.headers },
  });
}

/** Finds or creates the contact, then adds the webinar tag. Returns whether it worked. */
export async function tagWebinarRegistrant(r: Registrant) {
  const key = apiKey();
  if (!key) return false;

  const created = await call("/contacts", key, {
    method: "POST",
    body: JSON.stringify({
      email: r.email,
      fields: [
        { slug: "first_name", value: r.firstName },
        { slug: "surname", value: r.lastName },
        { slug: "phone_number", value: r.phone },
        { slug: "country", value: r.country },
      ],
    }),
  });

  let contactId: number | undefined;
  if (created.ok) {
    contactId = ((await created.json()) as { id?: number }).id;
  } else {
    // Usually "already exists": look the contact up by email instead.
    const found = await call(`/contacts?email=${encodeURIComponent(r.email)}`, key);
    if (found.ok) contactId = ((await found.json()) as { items?: { id: number }[] }).items?.[0]?.id;
    if (!contactId) {
      console.error("systeme.io contact create failed", created.status, await created.text());
      return false;
    }
  }

  const tagged = await call(`/contacts/${contactId}/tags`, key, { method: "POST", body: JSON.stringify({ tagId: webinarRegistrantTagId }) });
  if (!tagged.ok) console.error("systeme.io tagging failed", tagged.status, await tagged.text());
  return tagged.ok;
}
