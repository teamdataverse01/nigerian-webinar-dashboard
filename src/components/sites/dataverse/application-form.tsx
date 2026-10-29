"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const calendlyUrl = "https://calendly.com/data-privacy_beginner_01/30min";
const qualifyingInvestment = ["invest_full", "invest_plan"];
const disqualifyingTimeline = ["exploring"];
const socials = {
  youtube: "https://youtu.be/MVLanDqTgCk?si=K0VGjEtKN0FOBju0",
  linkedin: "https://www.linkedin.com/company/dataverse-consulting-solutions/",
  instagram: "https://www.instagram.com/reel/DdvgMrbIdfN/?stkn=MWVjZTB2YmR3YTVhOQ==",
};
const letters = "ABCDEFGHIJ";

type Option = { value: string; label: string; other?: boolean };
type Question = { id: string; title: string; hint?: string; options: Option[] };
type Answer = { value: string; detail?: string };

const questions: Question[] = [
  {
    id: "background",
    title: "Which best describes your current professional background?",
    options: [
      { value: "tech", label: "IT, cybersecurity, engineering or data analytics" },
      { value: "regulated", label: "Law, HR, healthcare or compliance" },
      { value: "business", label: "Project management, sales, marketing or customer service" },
      { value: "privacy", label: "I already work in data privacy or data protection" },
      { value: "other", label: "Other professional fields" },
    ],
  },
  {
    id: "goal",
    title: "What is your main goal for joining this program?",
    options: [
      { value: "first_role", label: "Secure my first data privacy role" },
      { value: "senior_role", label: "Advance into a more senior privacy role" },
      { value: "skills", label: "Build practical privacy skills for my current job" },
    ],
  },
  {
    id: "challenge",
    title: "What is your biggest challenge right now?",
    options: [
      { value: "start", label: "I don't know where to start or which roles to target" },
      { value: "experience", label: "I've studied privacy but lack practical experience" },
      { value: "recruiters", label: "Recruiters aren't reaching out" },
      { value: "no_interviews", label: "I apply for roles but rarely receive interview invitations" },
      { value: "no_offers", label: "I get interviews but struggle to secure offers" },
    ],
  },
  {
    id: "current_salary",
    title: "What is your current annual salary range?",
    hint: "In USD. This helps us understand where you're starting from.",
    options: [
      { value: "lt45", label: "Below $45K" },
      { value: "45_70", label: "$45K – under $70K" },
      { value: "70_100", label: "$70K – under $100K" },
      { value: "100p", label: "$100K+" },
    ],
  },
  {
    id: "commitment",
    title: "Can you commit 5 hours each week for 90 days to coaching and career preparation?",
    options: [
      { value: "yes", label: "Yes, I can consistently commit that time" },
      { value: "yes_rearrange", label: "Yes, but I need to rearrange my schedule before starting" },
      { value: "unsure", label: "I'm unsure whether I can commit that time" },
      { value: "no", label: "No, I can't commit that time right now" },
    ],
  },
  {
    id: "target_salary",
    title: "What salary range are you targeting in your next data privacy role?",
    hint: "Annual, in USD.",
    options: [
      { value: "100_125", label: "$100K – $125K" },
      { value: "125_150", label: "$125K – $150K" },
      { value: "150_175", label: "$150K – $175K" },
      { value: "175_200", label: "$175K – $200K" },
      { value: "200p", label: "$200K+" },
    ],
  },
  {
    id: "investment",
    title: "How willing are you to invest in your career through our 90-day data privacy coaching program?",
    options: [
      { value: "invest_full", label: "I'm ready to invest and can pay in full" },
      { value: "invest_plan", label: "I'm ready to invest through the available payment plan" },
      { value: "need_time", label: "I'm interested, but need more time to prepare financially" },
      { value: "exploring", label: "I'm exploring options and haven't decided whether to invest" },
      { value: "free", label: "I'm currently looking for free resources or mentorship" },
    ],
  },
  {
    id: "timeline",
    title: "How soon are you looking to start and get this implemented?",
    options: [
      { value: "asap", label: "ASAP / Within the next 1–2 weeks" },
      { value: "30_days", label: "Within the next 30 days" },
      { value: "1_3_months", label: "1 to 3 months out" },
      { value: "exploring", label: "Just exploring options / Researching for later" },
    ],
  },
  {
    id: "location",
    title: "Where are you currently located?",
    options: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "uk", label: "United Kingdom" },
      { value: "au", label: "Australia" },
      { value: "other", label: "Other", other: true },
    ],
  },
];

const tailoredMessages: Record<string, string> = {
  need_time: "It's clear you're serious about your growth, and it's wise to make sure the timing is right financially before you commit. The right season matters, and there's no rush.",
  exploring: "Taking time to weigh your options before you commit is a smart move. A decision this important deserves careful thought.",
  free: "Starting with free resources is a great way to build your foundation, and there's a lot you can learn before taking the next step.",
};

const ArrowIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
const HeartIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7.2a4.3 4.3 0 017.5 2.6C19.5 15.4 12 20 12 20z" /></svg>;
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

export function ApplicationForm() {
  const [current, setCurrent] = useState(0); // 0..n-1 = questions, n = result
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");
  const [blinking, setBlinking] = useState<string | null>(null);
  const [leaving, setLeaving] = useState<number | null>(null);
  const advancing = useRef(false);
  const otherInput = useRef<HTMLInputElement>(null);
  const screenRefs = useRef<(HTMLElement | null)[]>([]);
  const logo = useTransparentLogo("/sites/dataverse/dataverse-logo.webp");

  const total = questions.length;
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

  const finish = useCallback((final: Record<string, Answer>) => {
    if (qualifyingInvestment.includes(final.investment?.value) && !disqualifyingTimeline.includes(final.timeline?.value)) {
      window.location.href = calendlyUrl;
      return;
    }
    go(total);
  }, [go, total]);

  const submit = useCallback((final: Record<string, Answer> = answers) => {
    if (current >= total) return;
    const q = questions[current];
    const answer = final[q.id];
    if (!answer) { setError("Please select an option to continue."); return; }
    let next = final;
    if (answer.value === "other" && q.options.some(o => o.other)) {
      const detail = otherText.trim();
      if (!detail) { setError("Please tell us where you're located."); return; }
      next = { ...final, [q.id]: { ...answer, detail } };
      setAnswers(next);
    }
    if (current === total - 1) finish(next);
    else go(current + 1);
  }, [answers, current, finish, go, otherText, total]);

  const pick = useCallback((q: Question, option: Option) => {
    if (advancing.current) return;
    const next = { ...answers, [q.id]: { value: option.value } };
    setAnswers(next);
    setError("");
    setBlinking(option.value);
    window.setTimeout(() => setBlinking(null), 700);
    if (option.other) {
      window.setTimeout(() => otherInput.current?.focus(), 120);
      return; // wait for them to type
    }
    // Typeform-style auto-advance
    advancing.current = true;
    window.setTimeout(() => { advancing.current = false; submit(next); }, 650);
  }, [answers, submit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (current >= total) return;
      if (e.key === "Enter") { e.preventDefault(); submit(); return; }
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const q = questions[current];
      const k = letters.indexOf(e.key.toUpperCase());
      if (k >= 0 && k < q.options.length) pick(q, q.options[k]);
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
    const el = screenRefs.current[current]?.querySelector<HTMLElement>(".ap-choice.selected, .ap-choice, .ap-social");
    const t = window.setTimeout(() => el?.focus({ preventScroll: true }), 300);
    return () => window.clearTimeout(t);
  }, [current]);

  const screenClass = (i: number) => `ap-screen${i === current ? " active" : ""}${i === leaving ? " leave-up" : ""}`;
  const tailored = tailoredMessages[answers.investment?.value ?? ""]
    ?? (answers.timeline?.value === "exploring" ? tailoredMessages.exploring : undefined)
    ?? "We appreciate you taking the time to share where you are right now.";

  return (
    <div className="ap-root">
      <div className="ap-progress"><div className="ap-progress-fill" style={{ width: `${(Math.min(current, total) / total) * 100}%` }} /></div>
      <Link className="ap-brand" href="/" aria-label="DataVerse Solutions home">
        {/* eslint-disable-next-line @next/next/no-img-element -- processed data URL */}
        {logo && <img src={logo} alt="DataVerse Solutions" />}
      </Link>

      <main className="ap-stage">
        {questions.map((q, i) => {
          const selected = answers[q.id]?.value;
          return (
            <section key={q.id} className={screenClass(i)} ref={el => { screenRefs.current[i] = el; }} aria-hidden={i !== current}>
              <div className="ap-inner">
                <div className="ap-q-num">{i + 1} <ArrowIcon /></div>
                <h2>{q.title}</h2>
                {q.hint && <p className="ap-hint">{q.hint}</p>}
                <div className="ap-choices">
                  {q.options.map((o, k) => (
                    <button
                      key={o.value}
                      type="button"
                      tabIndex={i === current ? 0 : -1}
                      className={`ap-choice${selected === o.value ? " selected" : ""}${i === current && blinking === o.value ? " blink" : ""}`}
                      onClick={() => pick(q, o)}
                    >
                      <span className="ap-key">{letters[k]}</span>
                      <span className="ap-choice-label">{o.label}</span>
                      <span className="ap-check"><CheckIcon /></span>
                    </button>
                  ))}
                </div>
                {q.options.some(o => o.other) && selected === "other" && (
                  <div className="ap-other">
                    <input
                      ref={otherInput}
                      className="ap-text-input"
                      type="text"
                      placeholder="Please specify your country…"
                      aria-label="Please specify your country"
                      value={otherText}
                      onChange={e => { setOtherText(e.target.value); setError(""); }}
                    />
                  </div>
                )}
                <div className="ap-error" aria-live="polite">{i === current ? error : ""}</div>
                <div className="ap-actions">
                  <button type="button" className="ap-btn" tabIndex={i === current ? 0 : -1} onClick={() => submit()}>
                    {i === total - 1 ? "Submit" : "OK"} <CheckIcon />
                  </button>
                  <span className="ap-enter-hint">press <b>Enter ↵</b></span>
                </div>
              </div>
            </section>
          );
        })}

        <section className={`${screenClass(total)} ap-result`} ref={el => { screenRefs.current[total] = el; }} aria-hidden={!onResult}>
          {onResult && (
            <div className="ap-inner">
              <div className="ap-badge"><HeartIcon /></div>
              <div className="ap-eyebrow">Thank you for applying</div>
              <h1>Thank you. Your journey into privacy is just getting started.</h1>
              <p>{tailored}</p>
              <p>Our 90-day coaching program is an intensive, hands-on commitment, so we save our strategy sessions for people who are ready to start now. That isn&apos;t the right next step for you yet, and that&apos;s completely okay. <strong>Your goals are valid, and the door stays open.</strong></p>
              <div className="ap-steps">
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
                <div className="ap-step"><div className="ap-step-icon"><BookIcon /></div><div><b>Keep building momentum</b><span>Look out for our free webinars and content. They&apos;re designed to move you forward right now.</span></div></div>
                <div className="ap-step"><div className="ap-step-icon"><SparkIcon /></div><div><b>Come back when you&apos;re ready</b><span>When the timing is right, you&apos;re always welcome to apply again. We&apos;d be glad to hear from you.</span></div></div>
              </div>
              <p className="ap-signoff">Rooting for you,<br />The Dataverse Team</p>
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
