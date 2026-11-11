declare global {
  interface Window {
    Calendly?: { initPopupWidget: (options: { url: string }) => void };
    fbq?: (...args: unknown[]) => void;
  }
}

export const calendlyScriptUrl = "https://assets.calendly.com/assets/external/widget.js";

/** Opens a Calendly pop-up where the visitor is. Returns false if Calendly's script hasn't loaded yet. */
export function openCalendlyPopup(url: string) {
  if (!window.Calendly) return false;
  window.Calendly.initPopupWidget({ url });
  return true;
}

/** Calls `onScheduled` when someone completes a booking in an embedded Calendly widget. Returns a cleanup function. */
export function onCalendlyScheduled(onScheduled: () => void) {
  const handler = (e: MessageEvent) => {
    if (e.origin !== "https://calendly.com") return;
    if ((e.data as { event?: string } | null)?.event === "calendly.event_scheduled") onScheduled();
  };
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

/** Sends a standard Meta Pixel event, if the pixel has loaded. */
export function trackPixel(event: "CompleteRegistration" | "Schedule") {
  window.fbq?.("track", event);
}
