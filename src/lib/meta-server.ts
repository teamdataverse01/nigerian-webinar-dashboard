import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { metaPixelId, type MetaEventName } from "@/lib/meta";

const graphApiVersion = "v27.0";

/** Meta requires personal details to be normalized and SHA-256 hashed before they are sent. */
export const hashForMeta = (value: string) => createHash("sha256").update(value.trim().toLowerCase()).digest("hex");

export type MetaServerEvent = {
  eventName: MetaEventName;
  eventId: string;
  eventSourceUrl?: string;
  testEventCode?: string;
  /** Already-hashed customer details (em, ph, fn, ln, country), each as Meta's array form. */
  hashedUserData?: Record<string, string[]>;
};

/** Sends one event to the Conversions API, adding the visitor's IP, browser and Meta cookies. Returns whether Meta accepted it. */
export async function sendMetaEvent(request: NextRequest, event: MetaServerEvent) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) return false;

  const userData: Record<string, string | string[]> = { ...event.hashedUserData };
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = request.headers.get("user-agent");
  const fbp = request.cookies.get("_fbp")?.value;
  const fbc = request.cookies.get("_fbc")?.value;
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  const payload: Record<string, unknown> = {
    data: [{
      event_name: event.eventName,
      event_id: event.eventId,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: event.eventSourceUrl?.slice(0, 1000),
      user_data: userData,
    }],
  };
  if (event.testEventCode && /^TEST\w{1,20}$/.test(event.testEventCode)) payload.test_event_code = event.testEventCode;

  const res = await fetch(`https://graph.facebook.com/${graphApiVersion}/${metaPixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.error("Meta Conversions API error", res.status, await res.text());
  return res.ok;
}
