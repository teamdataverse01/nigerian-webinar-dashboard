"use client";

import { useEffect, useState } from "react";

const seatUrl = "https://calendly.com/data-privacy_beginner_01/new-meeting-1";
const strategyUrl = "https://calendly.com/data-privacy_beginner_01/30min";
const communityUrl = "https://chat.whatsapp.com/FFVu9ZZEi5C0FhvsisOlMe?mode=gi_t";
const webinarDate = new Date("2026-10-17T17:00:00+01:00").getTime();

function useCountdown() {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const updateCountdown = () => setRemaining(Math.max(0, webinarDate - Date.now()));
    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return [days, hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className="cta" href={href} target="_blank" rel="noopener noreferrer"><span className="cta-main">{children}</span></a>;
}

const roadmap = [
  "The Background Mapping Matrix: Know precisely which high-paying Privacy roles to target based on your specific professional history (so you never waste time applying blindly).",
  "Execution-Ready Skills: Gain the exact practical, day-one privacy deliverables employers actually look for on the job.",
  "The \"Value Translation\" Brand Makeover: Position your LinkedIn profile and resume so recruiters come to you, viewing your past experience as an asset, not a liability.",
  "The Interview Playbook: Build the bulletproof confidence and technical fluency to command top-of-market salaries.",
  "Done-With-You Support: Get direct mentorship and active job-search execution support until you land your first (or next) high-paying role.",
];

const testimonials = [
  { quote: "After almost 10 years in HR, I felt completely stuck. This program taught me how to translate my people operations background into privacy governance—and I landed a Data Privacy role at Meta!", result: "Former HR Manager → Privacy Leader at Meta" },
  { quote: "I went from struggling in sales to having two competing six-figure Data Privacy offers on the table in less than 6 weeks.", result: "Former Sales Representative → Data Privacy Specialist" },
  { quote: "I was working front-line Customer Care at a bank. Joining this program allowed me to double my salary on my very next career move.", result: "Former Bank Customer Care Rep → Senior Data Privacy Analyst" },
  { quote: "After 20 years as a pharmacist, I wanted out of the grind. Temi’s framework helped me secure my very first remote Data Privacy position as a Senior Professional.", result: "Pharmacist (20 Yrs Experience) → Senior Remote Data Privacy Professional" },
];

export default function Home() {
  const countdown = useCountdown();

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));

    const heroCta = document.getElementById("hero-cta");
    const stickyBar = document.querySelector("[data-sticky]");
    const updateStickyBar = () => stickyBar?.classList.toggle("show", (heroCta?.getBoundingClientRect().bottom ?? 0) < 0);
    window.addEventListener("scroll", updateStickyBar, { passive: true });
    updateStickyBar();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateStickyBar);
    };
  }, []);

  return (
    <>
      <header className="topbar">
        <a href="#top" aria-label="DataVerse Solutions"><img className="topbar-logo" src="/sites/dataverse/DATAVERSELOGO.jpeg" alt="DataVerse Solutions" /></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="wrap center">
            <h1>Land a <span className="hl">$120K+ Data Privacy Career</span> in 90 Days Without Writing a Single Line of Code (Or Starting Over From Scratch)</h1>
            <div className="hero-media"><img src="/sites/dataverse/temifirst.jpeg" alt="Picture 1" loading="eager" /></div>
            <p className="hero-sub">Learn the exact transition blueprint used by professionals from Tech, Compliance, Legal, HR, Finance, and Operations to break into one of the highest-paying, most secure niches in tech.</p>

            <div className="cta-block" id="hero-cta">
              <ActionLink href={strategyUrl}>📞 Book a Free 1:1 Career Strategy Call With Temi →</ActionLink>
              <ActionLink href={seatUrl}>🎟 Register for the Free Live Masterclass →</ActionLink>
            </div>
            <p className="countdown-label">LIMITED SPOTS AVAILABLE THIS WEEK</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <h2 className="reveal">Stop Buying the Big Lie: You Do Not Need to Start Over.</h2>
            <div className="stuck-card reveal">
              <p>If you want to switch into Data Privacy, you’ve probably been told you need a law degree, a computer science background, or years of starting at the bottom making peanuts.</p>
              <p>That is completely false.</p>
              <p>If you already have experience in customer service, Sales, Marketing,, Risk, Legal, HR, Audit, Finance, Operations, or Project Management… you are sitting on a goldmine.</p>
              <p>Your background isn’t a disadvantage. It’s the unfair advantage you need to skip the line.</p>
              <p>Companies aren&apos;t looking for textbook theorists who can quote regulations. They are looking for professionals who understand business and can execute privacy frameworks.</p>
              <p>Let us show you how to map what you already know directly onto a $120K+ Data Privacy role—without quitting your job or going back to school.</p>
            </div>
            <div className="cta-block reveal"><ActionLink href={strategyUrl}>📞 Schedule Your Free 1:1 Transition Call Now →</ActionLink></div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center">
            <div className="cta-block reveal"><ActionLink href={seatUrl}>🎟 Reserve Your Seat for the Free Masterclass →</ActionLink></div>
            <p className="pill reveal">WHAT YOU’LL MASTER</p>
            <h2 className="reveal">The Exact Roadmap From &quot;Stuck &amp; Underpaid&quot; to $120K–$150K+ Privacy Leader</h2>
            <p className="lede reveal">We don’t do &quot;theory&quot; or academic fluff. Here is what you walk away with:</p>
            <ul className="checklist reveal">{roadmap.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="cta-block reveal">
              <ActionLink href={strategyUrl}>📞 Book Your 1:1 Roadmap Call To Map Your Background →</ActionLink>
              <ActionLink href={seatUrl}>🎟 Claim Your Spot in the Free Webinar →</ActionLink>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">MEET YOUR COACH: TEMI</p>
            <figure className="host-photo reveal"><img src="/sites/dataverse/temisecond.jpeg" alt="Picture 2" loading="lazy" /></figure>
            <h2 className="reveal">From $75K to a $400K+ Big Tech Privacy Leader</h2>
            <div className="host-bio reveal">
              <p className="host-lead">Over the past 9+ years, Temi has designed and executed massive privacy programs at global powerhouses like Deloitte and Meta.</p>
              <p>She’s sat on the inside. She knows what hiring managers look for, what makes a resume hit the trash pile, and what skills command a six-figure salary.</p>
              <p>Through DataVerse Solutions, she strips away the complex legal jargon and teaches you her simple, repeatable 3-step framework:</p>
              <ol className="host-steps"><li>Understand the regulation.</li><li>Understand the business.</li><li>Execute and communicate your value.</li></ol>
              <p className="host-quote">&quot;My mission is simple: to save you years of trial and error and give you the exact execution playbook companies are desperately paying top dollar for.&quot; — Temi</p>
            </div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center">
            <p className="pill reveal">REAL PEOPLE. ZERO PRIOR PRIVACY EXPERIENCE. SIX-FIGURE RESULTS.</p>
            <div className="results-shell reveal">{testimonials.map((testimonial) => <article className="result-card" key={testimonial.result}>
              <blockquote>&quot;{testimonial.quote}&quot;</blockquote>
              <div className="result-person"><span>{testimonial.result}</span></div>
            </article>)}</div>
            <div className="cta-block reveal"><ActionLink href={strategyUrl}>📞 Ready For Similar Results? Book a 1:1 Strategy Call →</ActionLink></div>
            <div className="cta-block reveal"><ActionLink href={seatUrl}>🎟 Join the Free Live Training First →</ActionLink></div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center narrow">
            <p className="pill reveal">JOIN OUR FREE LIVE TRAINING:</p>
            <h2 className="reveal">The Data Privacy Career Transition Masterclass</h2>
            <p className="lede reveal">Prefer to join a group session first? Get live access to our weekly session where we break down current market trends, real-world privacy scenarios, and the step-by-step roadmap to land a high-paying role this year.</p>
            <p className="countdown-label training-countdown-label">⏳ WEBINAR STARTS IN:</p>
            <div className="countdown training-countdown" role="timer" aria-label="COUNTDOWN TIMER">{countdown}</div>
            <ActionLink href={seatUrl}>🎟 SAVE MY FREE SEAT FOR THE MASTERCLASS NOW →</ActionLink>
            <p className="cta-note">(Direct Link: <a href={seatUrl}>{seatUrl}</a>)</p>
            <p className="countdown-label">LIMITED SPOTS AVAILABLE • 100% FREE</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap center">
            <p className="pill reveal">🎁 INSTANT ACTION BONUS:</p>
            <h2 className="reveal"><a href={communityUrl} target="_blank" rel="noopener noreferrer">Get Immediate Access to the DataVerse WhatsApp VIP Community</a></h2>
            <p className="lede reveal">Don’t wait until Saturday to start building your future. Register for the masterclass today and unlock instant access to our private WhatsApp VIP group:</p>
            <div className="bonus-grid">
              <article className="bonus-card reveal"><p className="bonus-title">Instant Access:</p><p>Pre-webinar execution cheat sheets and career transition starter guides.</p></article>
              <article className="bonus-card reveal"><p className="bonus-title">Direct Access:</p><p>Real-world privacy teardowns, insider market updates, and direct peer support.</p></article>
            </div>
          </div>
        </section>

        <section className="section final">
          <div className="wrap center narrow">
            <p className="pill reveal">EVENT DETAILS</p>
            <dl className="event-facts reveal">
              <div><dt> Date: </dt><dd>Saturday, October 17th</dd></div>
              <div><dt> Time: </dt><dd>5:00 PM WAT</dd></div>
              <div><dt> Cost: </dt><dd>100% Free (⚠ Note: No replay will be available. Show up live.)</dd></div>
            </dl>
            <ActionLink href={seatUrl}>🎟 SAVE MY FREE WEBINAR SEAT NOW →</ActionLink>
            <p className="cta-note">(Direct Link: <a href={seatUrl}>{seatUrl}</a>)</p>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">🚨 WANT TO SKIP THE WAIT AND GET A CUSTOMIZED 1:1 PLAN?</p>
            <p className="lede reveal">Don&apos;t wait for the webinar if you&apos;re ready to make your move now. Schedule a 30-minute private 1:1 Career Audit &amp; Strategy Call directly with Temi to evaluate your current background, pinpoint your target role, and map out your fastest path to a $120K+ Data Privacy career.</p>
            <div className="cta-block reveal">
              <ActionLink href={strategyUrl}>📞 SCHEDULE YOUR PRIVATE 1:1 STRATEGY CALL NOW →</ActionLink>
              <ActionLink href={seatUrl}>🎟 REGISTER FOR THE FREE LIVE WEBINAR INSTEAD →</ActionLink>
            </div>
          </div>
        </section>
      </main>

      <div className="sticky-bar" data-sticky>
        <div><strong>Free Live Masterclass</strong><span>Saturday, October 17th · 5:00 PM WAT</span></div>
        <a href={seatUrl} target="_blank" rel="noopener noreferrer">🎟 SAVE MY FREE WEBINAR SEAT NOW →</a>
      </div>
    </>
  );
}
