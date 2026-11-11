"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { calendlyScriptUrl, onCalendlyScheduled, openCalendlyPopup, trackPixel } from "@/lib/calendly";

const calendlyUrl = "https://calendly.com/data-privacy_beginner_01/30min";
const qualifyingFunding = ["funds_ready", "payment_plan"];
const qualifyingStart = ["immediately", "30_days", "1_3_months"];
const qualifyingLocations = ["us", "ca", "au"];
const socials = {
  youtube: "https://youtu.be/MVLanDqTgCk?si=K0VGjEtKN0FOBju0",
  linkedin: "https://www.linkedin.com/in/temiloluolaniyan/",
  instagram: "https://www.instagram.com/reel/DdvgMrbIdfN/?stkn=MWVjZTB2YmR3YTVhOQ==",
};
const letters = "ABCDEFGHIJ";

type Option = { value: string; label: string };
type IntroLine = string | { note: string };
type Step = {
  id: string;
  type: "single" | "multi" | "text" | "textarea";
  title: string;
  hint?: string;
  placeholder?: string;
  intro?: IntroLine[];
  options?: Option[];
};
type AnswerValue = string | string[];
type Outcome = "not_fit" | "not_yet" | "outside_region" | "no_commit";

const steps: Step[] = [
  {
    id: "goal",
    type: "single",
    title: "Are you looking to build hands-on Data Privacy experience to land a high-paying job?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    id: "why_now",
    type: "multi",
    title: "Why is a Data Privacy role important to you now?",
    hint: "Choose all that apply.",
    options: [
      { value: "income", label: "I want to increase my income and financial security" },
      { value: "flexibility", label: "I want more flexibility and a better work-life balance" },
      { value: "invested", label: "I've invested in training or certifications and want to turn that into a Data Privacy role" },
    ],
  },
  {
    id: "min_salary",
    type: "single",
    title: "What is the minimum salary you would accept that would also be a step up from your current role?",
    options: [
      { value: "under_80", label: "Under $80K" },
      { value: "80_100", label: "$80K – $100K" },
      { value: "100_130", label: "$100K – $130K" },
      { value: "over_130", label: "Over $130K" },
    ],
  },
  {
    id: "missing",
    type: "multi",
    title: "What do you feel you're missing to confidently pursue a Data Privacy role?",
    hint: "Choose all that apply.",
    options: [
      { value: "knowledge", label: "Practical knowledge of Data Privacy frameworks, tools, and processes" },
      { value: "projects", label: "Hands-on Data Privacy project experience to show employers" },
      { value: "presenting", label: "Presenting my skills and experience clearly on my resume and in interviews" },
      { value: "unsure", label: "I'm not sure yet and would like help identifying my gaps" },
    ],
  },
  {
    id: "situation",
    type: "multi",
    title: "Which of the following describe your current situation?",
    hint: "Choose all that apply.",
    options: [
      { value: "working", label: "Working (employed, self-employed, or contracting)" },
      { value: "not_working_short", label: "Not working, for less than six months" },
      { value: "not_working_long", label: "Not working, for six months or longer" },
      { value: "studying", label: "Currently enrolled in an education or training program" },
    ],
  },
  {
    id: "profession",
    type: "text",
    title: "What is your current or most recent profession, and how many years of experience do you have in that field?",
    placeholder: "E.g. Project Manager, 5 years",
  },
  {
    id: "tried",
    type: "textarea",
    title: "What have you tried so far to move into Data Privacy?",
    hint: "One or two sentences is enough. If you're just starting, say so.",
    placeholder: "Type your answer here…",
  },
  {
    id: "funding",
    type: "single",
    title: "If we're a fit, how would you fund the program?",
    intro: ["Our program fees range between $3,500 and $5,000."],
    hint: "Choose one.",
    options: [
      { value: "funds_ready", label: "I have the funds ready" },
      { value: "payment_plan", label: "I can afford the fees on a payment plan" },
      { value: "find_way", label: "I need to find a way to pay" },
      { value: "cant_afford", label: "I can't afford it right now" },
    ],
  },
  {
    id: "start",
    type: "single",
    title: "If we're a fit, how soon could you start?",
    hint: "Choose one.",
    options: [
      { value: "immediately", label: "Immediately" },
      { value: "30_days", label: "Within 30 days" },
      { value: "1_3_months", label: "In 1–3 months" },
      { value: "3_6_months", label: "In 3–6 months" },
      { value: "exploring", label: "Just exploring" },
    ],
  },
  {
    id: "decision",
    type: "single",
    title: "Is there anyone else who needs to be supportive of this decision?",
    options: [
      { value: "mine", label: "No, it's my decision" },
      { value: "partner", label: "Yes, my partner or spouse" },
      { value: "someone_else", label: "Yes, someone else (parent, employer, etc.)" },
    ],
  },
  {
    id: "location",
    type: "single",
    title: "Where are you currently located?",
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "au", label: "Australia" },
      { value: "other", label: "Other" },
    ],
  },
  {
    id: "attend",
    type: "single",
    title: "Will you attend at the time you book?",
    intro: [
      "On your admissions call, a Data Privacy Career Consultant will help you spot gaps in your skills and experience.",
      "Together, you'll discuss your next steps and whether our program fits your goals.",
      { note: "Choose a time you can attend. If your plans change, tell us before the call. We do not reschedule no-shows." },
    ],
    options: [
      { value: "yes", label: "Yes, I'll be there" },
      { value: "no", label: "No" },
    ],
  },
];

const ArrowIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
const HeartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.2a4.3 4.3 0 017.5 2.6C19.5 15.4 12 20 12 20z" /></svg>;
const CalendarIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>;
const BookIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5v-15z" /><path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5" /></svg>;
const UsersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" /><path d="M16 4.8a3.5 3.5 0 010 6.4M18.5 14.8c1.6.8 2.7 2.6 3 5.2" /></svg>;
const SparkIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" /></svg>;
const YoutubeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15.1V8.9l5.8 3.1-5.8 3.1z" /></svg>;
const LinkedinIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 2H3.6A1.6 1.6 0 002 3.6v16.8A1.6 1.6 0 003.6 22h16.8a1.6 1.6 0 001.6-1.6V3.6A1.6 1.6 0 0020.4 2zM8 19H5V9.5h3V19zM6.5 8.2a1.7 1.7 0 110-3.5 1.7 1.7 0 010 3.5zM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3V9.5h2.9v1.3a3.2 3.2 0 012.8-1.5c3 0 3.6 2 3.6 4.6V19z" /></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;

/** The logo asset has a black background; un-screen it to transparency so it sits cleanly on white. */
function useTransparentLogo(src: string) {
  const [logo, setLogo] = useState<string | null>(null);
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas");
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const p = data.data;
        for (let i = 0; i < p.length; i += 4) {
          const a = Math.max(p[i], p[i + 1], p[i + 2]);
          if (a < 12) { p[i + 3] = 0; continue; }
          p[i] = Math.min(255, (p[i] * 255) / a);
          p[i + 1] = Math.min(255, (p[i + 1] * 255) / a);
          p[i + 2] = Math.min(255, (p[i + 2] * 255) / a);
          p[i + 3] = a;
        }
        ctx.putImageData(data, 0, 0);
        setLogo(canvas.toDataURL("image/png"));
      } catch {
        setLogo(src);
      }
    };
    img.src = src;
  }, [src]);
  return logo;
}

function SocialsStep() {
  return (
    <div className="ap-step">
      <div className="ap-step-icon"><UsersIcon /></div>
      <div>
        <b>Follow us for free privacy career content</b>
        <span>Practical tips, career advice and free resources to move you forward right now.</span>
        <div className="ap-socials">
          <a className="ap-social" href={socials.youtube} target="_blank" rel="noopener noreferrer"><YoutubeIcon /> YouTube</a>
          <a className="ap-social" href={socials.linkedin} target="_blank" rel="noopener noreferrer"><LinkedinIcon /> LinkedIn</a>
          <a className="ap-social" href={socials.instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /> Instagram</a>
        </div>
      </div>
    </div>
  );
}

const Signoff = () => <p className="ap-signoff">Rooting for you,<br />The Dataverse Team</p>;

function notYetMessage(answers: Record<string, AnswerValue>) {
  if (answers.funding === "find_way") return "It's clear you're serious about your growth, and it's wise to make sure the timing is right financially before you commit. The right season matters, and there's no rush.";
  if (answers.funding === "cant_afford") return "Starting with free resources is a great way to build your foundation, and there's a lot you can learn before taking the next step.";
  if (answers.start === "exploring") return "Taking time to weigh your options before you commit is a smart move. A decision this important deserves careful thought.";
  if (answers.start === "3_6_months") return "Planning a few months ahead is a smart move. When your start date gets closer, we'd love to hear from you again.";
  return "We appreciate you taking the time to share where you are right now.";
}

export function ApplicationForm() {
  const [current, setCurrent] = useState(0); // 0..n-1 = steps, n = result
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [error, setError] = useState("");
  const [blinking, setBlinking] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<number | null>(null);
  const advancing = useRef(false);
  const screenRefs = useRef<(HTMLElement | null)[]>([]);
  const logo = useTransparentLogo("/sites/dataverse/dataverse-logo.webp");

  useEffect(() => onCalendlyScheduled(() => trackPixel("Schedule")), []);

  const total = steps.length;
  const onResult = current >= total;

  const go = useCallback((idx: number) => {
    if (idx < 0 || idx > total || idx === current) return;
    if (idx > current) {
      setLeaving(current);
      window.setTimeout(() => setLeaving(null), 650);
    }
    setCurrent(idx);
    setError("");
  }, [current, total]);

  const end = useCallback((kind: Outcome) => {
    setOutcome(kind);
    go(total);
  }, [go, total]);

  const submit = useCallback((final: Record<string, AnswerValue> = answers) => {
    if (current >= total) return;
    const step = steps[current];
    const answer = final[step.id];
    if (step.type === "single" && !answer) { setError("Please select an option to continue."); return; }
    if (step.type === "multi" && !(Array.isArray(answer) && answer.length)) { setError("Please select at least one option."); return; }
    if ((step.type === "text" || step.type === "textarea") && !(typeof answer === "string" && answer.trim())) { setError("Please fill this in to continue."); return; }

    // Routing
    if (step.id === "goal" && final.goal === "no") return end("not_fit");
    if (step.id === "start" && !(qualifyingFunding.includes(final.funding as string) && qualifyingStart.includes(final.start as string))) return end("not_yet");
    if (step.id === "location" && !qualifyingLocations.includes(final.location as string)) return end("outside_region");
    if (step.id === "attend") {
      if (final.attend === "yes") {
        // Book on this page so the completed booking can be tracked; go to Calendly directly if its script hasn't loaded.
        if (!openCalendlyPopup(calendlyUrl)) window.location.href = calendlyUrl;
        return;
      }
      return end("no_commit");
    }
    go(current + 1);
  }, [answers, current, end, go, total]);

  const pick = useCallback((step: Step, option: Option) => {
    if (advancing.current) return;
    setError("");
    if (step.type === "multi") {
      const prev = Array.isArray(answers[step.id]) ? (answers[step.id] as string[]) : [];
      const next = prev.includes(option.value) ? prev.filter(v => v !== option.value) : [...prev, option.value];
      setAnswers({ ...answers, [step.id]: next });
      return; // multi-select waits for OK
    }
    const next = { ...answers, [step.id]: option.value };
    setAnswers(next);
    setBlinking(option.value);
    window.setTimeout(() => setBlinking(null), 700);
    // Typeform-style auto-advance
    advancing.current = true;
    window.setTimeout(() => { advancing.current = false; submit(next); }, 650);
  }, [answers, submit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (current >= total) return;
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === "Enter") {
        if (tag === "TEXTAREA" && e.shiftKey) return; // new line
        e.preventDefault();
        submit();
        return;
      }
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const step = steps[current];
      const k = letters.indexOf(e.key.toUpperCase());
      if (step.options && k >= 0 && k < step.options.length) pick(step, step.options[k]);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, pick, submit, total]);

  const lastFocused = useRef(current);
  useEffect(() => {
    // Only move focus after navigating; on first load the ring looks like a preselected answer.
    if (lastFocused.current === current) return;
    lastFocused.current = current;
    if (!window.matchMedia("(min-width: 601px)").matches) return;
    const el = screenRefs.current[current]?.querySelector<HTMLElement>("[data-field], .ap-choice.selected, .ap-choice, .ap-social");
    const t = window.setTimeout(() => el?.focus({ preventScroll: true }), 300);
    return () => window.clearTimeout(t);
  }, [current]);

  const screenClass = (i: number) => `ap-screen${i === current ? " active" : ""}${i === leaving ? " leave-up" : ""}`;
  const isSelected = (step: Step, value: string) => {
    const a = answers[step.id];
    return Array.isArray(a) ? a.includes(value) : a === value;
  };

  return (
    <div className="ap-root">
      <Script src={calendlyScriptUrl} strategy="afterInteractive" />
      <div className="ap-progress"><div className="ap-progress-fill" style={{ width: `${(Math.min(current, total) / total) * 100}%` }} /></div>
      <Link className="ap-brand" href="/" aria-label="DataVerse Solutions home">
        {/* eslint-disable-next-line @next/next/no-img-element -- processed data URL */}
        {logo && <img src={logo} alt="DataVerse Solutions" />}
      </Link>

      <main className="ap-stage">
        {steps.map((step, i) => {
          const isActive = i === current;
          const tab = isActive ? 0 : -1;
          return (
            <section key={step.id} className={screenClass(i)} ref={el => { screenRefs.current[i] = el; }} aria-hidden={!isActive}>
              <div className="ap-inner">
                <div className="ap-q-num">{i + 1} <ArrowIcon /></div>
                {step.intro && (
                  <div className="ap-intro">
                    {step.intro.map((line, k) => typeof line === "string"
                      ? <p key={k}>{line}</p>
                      : <p key={k} className="ap-note">{line.note}</p>)}
                  </div>
                )}
                <h2>{step.title}</h2>
                {step.hint && <p className="ap-hint">{step.hint}</p>}

                {step.options && (
                  <div className="ap-choices">
                    {step.options.map((o, k) => (
                      <button
                        key={o.value}
                        type="button"
                        tabIndex={tab}
                        className={`ap-choice${isSelected(step, o.value) ? " selected" : ""}${isActive && blinking === o.value ? " blink" : ""}`}
                        onClick={() => pick(step, o)}
                      >
                        <span className="ap-key">{letters[k]}</span>
                        <span className="ap-choice-label">{o.label}</span>
                        <span className="ap-check"><CheckIcon /></span>
                      </button>
                    ))}
                  </div>
                )}

                {step.type === "text" && (
                  <div className="ap-field-wrap">
                    <input
                      data-field
                      tabIndex={tab}
                      className="ap-text-input"
                      type="text"
                      placeholder={step.placeholder}
                      aria-label={step.title}
                      value={(answers[step.id] as string) ?? ""}
                      onChange={e => { setAnswers({ ...answers, [step.id]: e.target.value }); setError(""); }}
                    />
                  </div>
                )}
                {step.type === "textarea" && (
                  <div className="ap-field-wrap">
                    <textarea
                      data-field
                      tabIndex={tab}
                      rows={3}
                      className="ap-text-input ap-text-area"
                      placeholder={step.placeholder}
                      aria-label={step.title}
                      value={(answers[step.id] as string) ?? ""}
                      onChange={e => { setAnswers({ ...answers, [step.id]: e.target.value }); setError(""); }}
                    />
                  </div>
                )}

                <div className="ap-error" aria-live="polite">{isActive ? error : ""}</div>
                <div className="ap-actions">
                  <button type="button" className="ap-btn" tabIndex={tab} onClick={() => submit()}>
                    {i === total - 1 ? "Submit" : "OK"} <CheckIcon />
                  </button>
                  <span className="ap-enter-hint">
                    press <b>Enter ↵</b>{step.type === "textarea" && <> · <b>Shift + Enter</b> for a new line</>}
                  </span>
                </div>
              </div>
            </section>
          );
        })}

        <section className={`${screenClass(total)} ap-result`} ref={el => { screenRefs.current[total] = el; }} aria-hidden={!onResult}>
          {onResult && outcome === "not_fit" && (
            <div className="ap-inner">
              <div className="ap-badge"><HeartIcon /></div>
              <div className="ap-eyebrow">Thank you for your interest</div>
              <h1>Thanks for being honest with us.</h1>
              <p>Our program is built for people who want hands-on Data Privacy experience so they can land a high-paying role. It sounds like that isn&apos;t what you&apos;re looking for right now, and that&apos;s completely okay.</p>
              <p><strong>If your goals change, the door stays open.</strong></p>
              <div className="ap-steps">
                <SocialsStep />
                <div className="ap-step"><div className="ap-step-icon"><SparkIcon /></div><div><b>Come back any time</b><span>If you decide to pursue a Data Privacy role, you&apos;re always welcome to apply again.</span></div></div>
              </div>
              <Signoff />
            </div>
          )}

          {onResult && outcome === "outside_region" && (
            <div className="ap-inner">
              <div className="ap-badge"><HeartIcon /></div>
              <div className="ap-eyebrow">Thank you for applying</div>
              <h1>Thank you. Your journey into privacy is just getting started.</h1>
              <p>Thank you for your interest in growing your privacy career. Right now, our program is only open to professionals based in the United States, Canada and Australia.</p>
              <p>That means we can&apos;t offer you an admissions call at the moment, but it doesn&apos;t change what you&apos;re capable of. <strong>Your goals are valid, and the door stays open.</strong></p>
              <div className="ap-steps">
                <SocialsStep />
                <div className="ap-step"><div className="ap-step-icon"><SparkIcon /></div><div><b>Come back when we&apos;re in your region</b><span>If we open the program to your country, or you move to one of these countries, you&apos;re always welcome to apply again. We&apos;d be glad to hear from you.</span></div></div>
              </div>
              <Signoff />
            </div>
          )}

          {onResult && outcome === "no_commit" && (
            <div className="ap-inner">
              <div className="ap-badge"><CalendarIcon /></div>
              <div className="ap-eyebrow">No problem</div>
              <h1>Book when you know you can be there.</h1>
              <p>Our consultants set aside dedicated time for every admissions call, so we only book calls that people are sure they can attend.</p>
              <p>When you&apos;re ready to commit to a time, come back and we&apos;ll get you booked in. <strong>We&apos;d be glad to hear from you.</strong></p>
              <div className="ap-actions">
                <button type="button" className="ap-btn ap-btn-ghost" onClick={() => go(total - 1)}>I can make it after all</button>
              </div>
              <div className="ap-steps"><SocialsStep /></div>
              <Signoff />
            </div>
          )}

          {onResult && outcome === "not_yet" && (
            <div className="ap-inner">
              <div className="ap-badge"><HeartIcon /></div>
              <div className="ap-eyebrow">Thank you for applying</div>
              <h1>Thank you. Your journey into privacy is just getting started.</h1>
              <p>{notYetMessage(answers)}</p>
              <p>Our program is an intensive, hands-on commitment, so we save our admissions calls for people who are ready to start now. That isn&apos;t the right next step for you yet, and that&apos;s completely okay. <strong>Your goals are valid, and the door stays open.</strong></p>
              <div className="ap-steps">
                <SocialsStep />
                <div className="ap-step"><div className="ap-step-icon"><BookIcon /></div><div><b>Keep building momentum</b><span>Look out for our free webinars and content. They&apos;re designed to move you forward right now.</span></div></div>
                <div className="ap-step"><div className="ap-step-icon"><SparkIcon /></div><div><b>Come back when you&apos;re ready</b><span>When the timing is right, you&apos;re always welcome to apply again. We&apos;d be glad to hear from you.</span></div></div>
              </div>
              <Signoff />
            </div>
          )}
        </section>
      </main>

      <div className={`ap-nav${onResult ? " hidden" : ""}`}>
        <button type="button" aria-label="Previous question" disabled={current === 0} onClick={() => go(current - 1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
        </button>
        <button type="button" aria-label="Next question" onClick={() => submit()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </button>
      </div>
    </div>
  );
}
