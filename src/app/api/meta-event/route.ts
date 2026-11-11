import type { NextRequest } from "next/server";
import { metaPixelId as pixelId } from "@/lib/meta";

// Server-side copy of Meta Pixel events (Conversions API). The browser sends the
// same event_id to the pixel, so Meta deduplicates the pair into one conversion.
const graphApiVersion = "v27.0";
const allowedEvents = new Set(["PageView", "CompleteRegistration", "Schedule"]);

type Body = { event_name?: string; event_id?: string; event_source_url?: string; test_event_code?: string };

export async function POST(request: NextRequest) {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!accessToken) return Response.json({ ok: false, error: "not configured" }, { status: 503 });

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  const { event_name, event_id, event_source_url, test_event_code } = body;
  if (!event_name || !allowedEvents.has(event_name) || !event_id || event_id.length > 100) {
    return Response.json({ ok: false, error: "invalid event" }, { status: 400 });
  }

  const userData: Record<string, string> = {};
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
      event_name,
      event_id,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: event_source_url?.slice(0, 1000),
      user_data: userData,
    }],
  };
  if (test_event_code && /^TEST\w{1,20}$/.test(test_event_code)) payload.test_event_code = test_event_code;

  const res = await fetch(`https://graph.facebook.com/${graphApiVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error("Meta Conversions API error", res.status, await res.text());
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
