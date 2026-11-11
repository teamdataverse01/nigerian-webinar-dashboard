"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const defaultEventTitle = "Free Data Privacy Career Masterclass – DataVerse Solutions";
const calendarDetails = "Free live masterclass with Temi and DataVerse Solutions. Your join link is in your Calendly confirmation email.";
const whatsappUrl = "https://chat.whatsapp.com/EQGgwCtcU1k5M3GOTYByij?s=cl&p=i&ilr=4&iam=2";
const defaultDurationMs = 60 * 60 * 1000;

type Registration = { firstName: string; title: string; start: Date | null; end: Date | null };

/** Calendly passes these when the event is set to redirect with event details. */
function readRegistration(): Registration {
  const q = new URLSearchParams(window.location.search);
  const start = q.get("event_start_time") ? new Date(q.get("event_start_time") as string) : null;
  const validStart = start && !Number.isNaN(start.getTime()) ? start : null;
  const end = q.get("event_end_time") ? new Date(q.get("event_end_time") as string) : null;
  const validEnd = end && !Number.isNaN(end.getTime()) ? end : validStart && new Date(validStart.getTime() + defaultDurationMs);
  return {
    firstName: q.get("invitee_first_name") ?? (q.get("invitee_full_name") ?? "").split(" ")[0],
    title: q.get("event_type_name") || defaultEventTitle,
    start: validStart,
    end: validEnd,
  };
}

const utcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function googleCalendarUrl(r: Registration) {
  const q = new URLSearchParams({ action: "TEMPLATE", text: r.title, dates: `${utcStamp(r.start!)}/${utcStamp(r.end!)}`, details: calendarDetails });
  return `https://calendar.google.com/calendar/render?${q}`;
}

function outlookCalendarUrl(r: Registration) {
  const q = new URLSearchParams({ path: "/calendar/action/compose", rru: "addevent", subject: r.title, startdt: r.start!.toISOString(), enddt: r.end!.toISOString(), body: calendarDetails });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${q}`;
}

function downloadIcs(r: Registration) {
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DataVerse Solutions//Masterclass//EN", "BEGIN:VEVENT",
    `UID:${utcStamp(r.start!)}-masterclass@dataverse`, `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(r.start!)}`, `DTEND:${utcStamp(r.end!)}`,
    `SUMMARY:${r.title}`, `DESCRIPTION:${calendarDetails}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "dataverse-masterclass.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function formatWhen(d: Date) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(d);
}

export function ThankYou() {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [attendingOnly, setAttendingOnly] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the query string only exists in the browser
  useEffect(() => setRegistration(readRegistration()), []);

  const hasDate = !!registration?.start;

  return (
    <>
      <header className="topbar">
        <Link href="/" aria-label="DataVerse Solutions home">
          {/* eslint-disable-next-line @next/next/no-img-element -- matches the landing page */}
          <img className="topbar-logo" src="/sites/dataverse/dataverse-logo.webp" alt="DataVerse Solutions" />
        </Link>
      </header>

      <main>
        <section className="hero ty-hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="wrap center narrow">
            <p className="badge-outline"><span className="dot" />Registration confirmed</p>
            <h1>You&apos;re In{registration?.firstName ? `, ${registration.firstName}` : ""}! <span className="hl nw">Your Seat Is Saved.</span></h1>

            <div className="ty-card">
              <p className="ty-label">Free Live Masterclass</p>
              {hasDate
                ? <p className="ty-when">{formatWhen(registration!.start!)}</p>
                : <p className="ty-when ty-when-pending">Your date, time and join link are in your confirmation email.</p>}
              <p className="ty-note">Check your inbox (and spam folder) for your confirmation and join link.</p>

              {hasDate && (
                <div className="ty-calendar">
                  <p className="ty-label">Add it to your calendar</p>
                  <div className="ty-calendar-buttons">
                    <a className="ty-cal-btn" href={googleCalendarUrl(registration!)} target="_blank" rel="noopener noreferrer">Google Calendar</a>
                    <button type="button" className="ty-cal-btn" onClick={() => downloadIcs(registration!)}>Apple Calendar</button>
                    <a className="ty-cal-btn" href={outlookCalendarUrl(registration!)} target="_blank" rel="noopener noreferrer">Outlook</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="section section-glow ty-upsell">
          <div className="wrap center narrow">
            {attendingOnly ? (
              <>
                <p className="pill">See you there</p>
                <h2>Perfect. <span className="hl">We&apos;ll See You at the Webinar.</span></h2>
                <p className="lede">Watch your inbox for reminders and your join link. In the meantime, join our WhatsApp VIP community for cheat sheets and career transition starter guides.</p>
                <a className="cta" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><span className="cta-main">Join the WhatsApp VIP Community <span aria-hidden="true">→</span></span></a>
              </>
            ) : (
              <>
                <p className="pill">Don&apos;t want to wait?</p>
                <h2>Want to Fast-Track Your Transition Into a <span className="hl">$140K–$250K Data Privacy Career?</span></h2>
                <p className="lede">You don&apos;t have to wait until the webinar to take the next step. Book a free 1:1 career strategy call with Temi and her team to discuss your background, career goals, and potential pathway into data privacy.</p>
                <div className="cta-block">
                  <Link className="cta" href="/apply"><span className="cta-main">📞 Book My Free Career Strategy Call <span aria-hidden="true">→</span></span></Link>
                  <button type="button" className="ghost-link ty-decline" onClick={() => setAttendingOnly(true)}>I&apos;ll Attend the Webinar Instead</button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="footer"><div className="wrap center">
        {/* eslint-disable-next-line @next/next/no-img-element -- matches the landing page */}
        <img className="footer-logo" src="/sites/dataverse/dataverse-logo.webp" alt="DataVerse Solutions" />
        <p>© 2026 DataVerse Solutions. All rights reserved.</p>
      </div></footer>
    </>
  );
}
