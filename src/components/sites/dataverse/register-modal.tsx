"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { firePixelEvent, testEventCode } from "@/lib/meta";

// ISO 3166-1 alpha-2 codes; names come from the browser so they're always spelled correctly.
const countryCodes = "AF AX AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VE VN VG VI WF EH YE ZM ZW".split(" ");
const pinnedCountries = ["US", "CA", "GB", "AU"];
const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"];

type Fields = { first_name: string; last_name: string; email: string; country: string; phone: string };
const emptyFields: Fields = { first_name: "", last_name: "", email: "", country: "", phone: "" };

function useCountryOptions() {
  return useMemo(() => {
    const names = new Intl.DisplayNames(["en"], { type: "region" });
    const toOption = (code: string) => ({ code, name: names.of(code) ?? code });
    const rest = countryCodes.filter((c) => !pinnedCountries.includes(c)).map(toOption).sort((a, b) => a.name.localeCompare(b.name));
    return [...pinnedCountries.map(toOption), ...rest];
  }, []);
}

export function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const countries = useCountryOptions();
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstInput.current?.focus(), 50);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!fields.country) { setError("Please select your country."); return; }
    setSubmitting(true);
    setError("");
    const eventId = crypto.randomUUID();
    const applicationEventId = crypto.randomUUID();
    const search = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(utmKeys.filter((k) => search.get(k)).map((k) => [k, search.get(k) as string]));
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Submitting the form is the consent (see the notice under the button).
        body: JSON.stringify({ ...fields, sms_consent: true, event_id: eventId, application_event_id: applicationEventId, page_url: window.location.href, utm, test_event_code: testEventCode() }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      firePixelEvent("CompleteRegistration", eventId);
      firePixelEvent("SubmitApplication", applicationEventId);
      // Give the pixel a moment to send, then load the thank-you page fully so its PageView is paired too.
      await new Promise((resolve) => window.setTimeout(resolve, 800));
      window.location.assign(new URL(`/thank-you?${new URLSearchParams({ invitee_first_name: fields.first_name.trim() })}`, window.location.href).href);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="rg-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rg-modal" role="dialog" aria-modal="true" aria-labelledby="rg-title">
        <button type="button" className="rg-close" aria-label="Close" onClick={onClose}>×</button>
        <p className="rg-eyebrow">Free Live Masterclass</p>
        <h2 id="rg-title" className="rg-title">Save Your Free Seat</h2>
        <p className="rg-sub">Enter your details to save your spot.</p>

        <form className="rg-form" onSubmit={submit}>
          <div className="rg-row">
            <label className="rg-field">
              <span>First Name</span>
              <input ref={firstInput} required autoComplete="given-name" maxLength={100} value={fields.first_name} onChange={(e) => set("first_name", e.target.value)} />
            </label>
            <label className="rg-field">
              <span>Last Name</span>
              <input required autoComplete="family-name" maxLength={100} value={fields.last_name} onChange={(e) => set("last_name", e.target.value)} />
            </label>
          </div>
          <label className="rg-field">
            <span>Email Address</span>
            <input required type="email" autoComplete="email" maxLength={254} value={fields.email} onChange={(e) => set("email", e.target.value)} />
          </label>
          <label className="rg-field">
            <span>Country</span>
            <select required autoComplete="country" value={fields.country} onChange={(e) => set("country", e.target.value)}>
              <option value="" disabled>Select country</option>
              {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </label>
          <label className="rg-field">
            <span>Phone (with country code)</span>
            <input required type="tel" autoComplete="tel" placeholder="+1 234 567 8900" maxLength={30} pattern="[+]?[0-9 ()\-.]{7,}" title="Include your country code, e.g. +1 234 567 8900" value={fields.phone} onChange={(e) => set("phone", e.target.value)} />
          </label>
          {error && <p className="rg-error" role="alert">{error}</p>}
          <button type="submit" className="cta rg-submit" disabled={submitting}>
            <span className="cta-main">{submitting ? "Saving your spot…" : "Save My Spot"}</span>
          </button>
          <p className="rg-consent">By clicking Save My Spot, you agree to receive emails and text messages from Dataverse with information about the webinar, including the date, time, join link and reminders. Message and data rates may apply. Reply STOP to opt out.</p>
        </form>
      </div>
    </div>
  );
}
