export const metaPixelId = "1687140503016546";

/** Standard Meta events this site sends, each from both the browser pixel and the Conversions API. */
export type MetaEventName = "PageView" | "ViewContent" | "CompleteRegistration" | "SubmitApplication" | "Schedule";

/** Visiting any page with ?meta_test=TESTxxxx routes this browser's server events to Events Manager → Test Events. */
export const metaTestStorageKey = "meta_test";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function testEventCode() {
  try {
    return sessionStorage.getItem(metaTestStorageKey) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Fires a standard event on the browser pixel under the given ID, so Meta can pair it with the server copy.
 * Events fired on page load can run before the pixel snippet, so wait briefly for it.
 */
export function firePixelEvent(event: MetaEventName, eventId: string, waitedMs = 0) {
  if (window.fbq) {
    window.fbq("track", event, {}, { eventID: eventId });
  } else if (waitedMs < 5000) {
    window.setTimeout(() => firePixelEvent(event, eventId, waitedMs + 100), 100);
  }
}

/** Sends a standard event to the Meta Pixel and, with the same event ID, to the Conversions API via our server. */
export function trackConversion(event: MetaEventName) {
  const eventId = crypto.randomUUID();
  firePixelEvent(event, eventId);
  fetch("/api/meta-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ event_name: event, event_id: eventId, event_source_url: window.location.href, test_event_code: testEventCode() }),
  }).catch(() => {});
}
