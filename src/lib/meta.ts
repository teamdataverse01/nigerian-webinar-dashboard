export const metaPixelId = "1687140503016546";

/** Visiting any page with ?meta_test=TESTxxxx routes this browser's server events to Events Manager → Test Events. */
export const metaTestStorageKey = "meta_test";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function testEventCode() {
  try {
    return sessionStorage.getItem(metaTestStorageKey) ?? undefined;
  } catch {
    return undefined;
  }
}

/** Sends a standard event to the Meta Pixel and, with the same event ID, to the Conversions API via our server. */
export function trackConversion(event: "CompleteRegistration" | "Schedule") {
  const eventId = crypto.randomUUID();
  window.fbq?.("track", event, {}, { eventID: eventId });
  fetch("/api/meta-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ event_name: event, event_id: eventId, event_source_url: window.location.href, test_event_code: testEventCode() }),
  }).catch(() => {});
}
