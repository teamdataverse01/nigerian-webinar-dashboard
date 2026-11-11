import type { NextRequest } from "next/server";
import { sendMetaEvent, type MetaServerEvent } from "@/lib/meta-server";

// Server-side copy of Meta Pixel events (Conversions API). The browser sends the
// same event_id to the pixel, so Meta deduplicates the pair into one conversion.
const allowedEvents = new Set<MetaServerEvent["eventName"]>(["PageView", "CompleteRegistration", "Schedule"]);

type Body = { event_name?: string; event_id?: string; event_source_url?: string; test_event_code?: string };

export async function POST(request: NextRequest) {
  if (!process.env.META_CAPI_ACCESS_TOKEN) return Response.json({ ok: false, error: "not configured" }, { status: 503 });

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid body" }, { status: 400 });
  }
  const { event_name, event_id, event_source_url, test_event_code } = body;
  if (!event_name || !allowedEvents.has(event_name as MetaServerEvent["eventName"]) || !event_id || event_id.length > 100) {
    return Response.json({ ok: false, error: "invalid event" }, { status: 400 });
  }

  const ok = await sendMetaEvent(request, {
    eventName: event_name as MetaServerEvent["eventName"],
    eventId: event_id,
    eventSourceUrl: event_source_url,
    testEventCode: test_event_code,
  });
  return ok ? Response.json({ ok: true }) : Response.json({ ok: false }, { status: 502 });
}
