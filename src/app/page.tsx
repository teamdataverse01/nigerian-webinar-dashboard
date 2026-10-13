"use client";

import { useEffect, useState } from "react";

const seatUrl = "https://calendly.com/data-privacy_beginner_01/new-meeting-1";
const strategyUrl = "https://calendly.com/data-privacy_beginner_01/30min";
const webinarDate = new Date("2026-10-17T12:00:00-07:00").getTime();

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
  return { days, hours, minutes, seconds };
}

function SeatButton({ final = false }: { final?: boolean }) {
  return (
    <div className="cta-block">
      <a className="cta" href={seatUrl} target="_blank" rel="noopener noreferrer">
        <span className="cta-main">{final ? "Save My Free Webinar Seat Now" : "Register for the Free Live Masterclass"} <span aria-hidden="true">→</span></span>
        <span className="cta-sub">Limited spots available this week</span>
      </a>
      {final ? <p className="cta-note">No replay will be available. Show up live.</p> : null}
    </div>
  );
}

const learningPoints = [
  "The Background Mapping Matrix: Know precisely which high-paying Privacy roles to target based on your specific professional history (so you never waste time applying blindly).",
  "Execution-Ready Skills: Gain the exact practical, day-one privacy deliverables employers actually look for on the job.",
  "The ‘Value Translation’ Brand Makeover: Position your LinkedIn profile and resume so recruiters come to you, viewing your past experience as an asset, not a liability.",
  "The Interview Playbook: Build the bulletproof confidence and technical fluency to command top-of-market salaries.",
  "Done-With-You Support: Get direct mentorship and active job-search execution support until you land your first (or next) high-paying role.",
];

const testimonials = [
  { metric: "Privacy role at Meta", context: "Former HR Manager → Privacy Leader at Meta", image: "image1.webp", alt: "Confident African woman in her late 30s in a modern tech office environment", quote: "“After almost 10 years in HR, I felt completely stuck. This program taught me how to translate my people operations background into privacy governance—and I landed a Data Privacy role at Meta!”", name: "Former HR Manager", role: "Privacy Leader at Meta" },
  { metric: "Two six-figure offers", context: "Former Sales Representative → Data Privacy Specialist", image: "image2.webp", alt: "Enthusiastic African man in his early 30s in a modern co-working space", quote: "“I went from struggling in sales to having two competing six-figure Data Privacy offers on the table in less than 6 weeks.”", name: "Former Sales Representative", role: "Data Privacy Specialist" },
  { metric: "Doubled salary", context: "Former Bank Customer Care Rep → Senior Data Privacy Analyst", image: "image3.webp", alt: "Focused African woman in her late 20s at a sleek corporate desk", quote: "“I was working front-line Customer Care at a bank. Joining this program allowed me to double my salary on my very next career move.”", name: "Former Bank Customer Care Rep", role: "Senior Data Privacy Analyst" },
  { metric: "First remote privacy role", context: "Pharmacist (20 Yrs Experience) → Senior Remote Data Privacy Professional", image: "image4.webp", alt: "Distinguished African man in his late 40s working in a bright modern home office", quote: "“After 20 years as a pharmacist, I wanted out of the grind. Temi’s framework helped me secure my very first remote Data Privacy position as a Senior Professional.”", name: "Pharmacist (20 Yrs Experience)", role: "Senior Remote Data Privacy Professional" },
];

function StrategyButton({ label = "Book a Free 1:1 Career Strategy Call With Temi" }: { label?: string }) {
  return <a className="cta strategy-cta" href={strategyUrl} target="_blank" rel="noopener noreferrer"><span className="cta-main">📞 {label} <span aria-hidden="true">→</span></span></a>;
}

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
        <a href="#top" aria-label="DataVerse Solutions home"><img className="topbar-logo" src="/sites/dataverse/DATAVERSELOGO.jpeg" alt="DataVerse Solutions" /></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="wrap center">
            <p className="badge-outline"><span className="dot" />$120K+ Data Privacy Career</p>
            <h1>Land a <span className="hl nw">$120K+ Data Privacy Career</span> in 90 Days Without Writing a Single Line of Code (Or Starting Over From Scratch)</h1>
            <p className="hero-sub">Learn the exact transition blueprint used by professionals in customer service, banking, sales, and marketing to break into one of the highest-paying, most secure niches in tech.</p>

            <div className="hero-media">
              <img src="/sites/dataverse/temifirst.jpeg" alt="Temi, host of the DataVerse masterclass" />
              <div className="hero-countdown">
                <p className="countdown-label">Webinar starts in:</p>
                <div className="countdown">
                  {Object.entries(countdown).map(([unit, value]) => <div key={unit}><strong>{String(value).padStart(2, "0")}</strong><span>{unit}</span></div>)}
                </div>
              </div>
            </div>

            <div className="cta-block" id="hero-cta">
              <StrategyButton />
              <a className="cta" href={seatUrl} target="_blank" rel="noopener noreferrer"><span className="cta-main">Register for the Free Live Masterclass <span aria-hidden="true">→</span></span><span className="cta-sub">Limited spots available this week</span></a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">Stop buying the big lie</p>
            <h2 className="reveal">You Do Not Need to <span className="hl">Start Over</span></h2>
            <div className="stuck-card reveal">
              <p>If you want to switch into Data Privacy, you’ve probably been told you need a law degree, a computer science background, or years of starting at the bottom making peanuts. <strong>That is completely false.</strong></p>
              <p>If you already have experience in customer service, Sales, Marketing,, Risk, Legal, HR, Audit, Finance, Operations, or Project Management… you are sitting on a goldmine.</p>
              <p>Your background isn’t a disadvantage. It’s the unfair advantage you need to skip the line.</p>
              <p>Companies aren’t looking for textbook theorists who can quote regulations. They are looking for professionals who understand business and can execute privacy frameworks.</p>
              <p>Let us show you how to map what you already know directly onto a $120K+ Data Privacy role—without quitting your job or going back to school.</p>
            </div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center">
            <p className="pill reveal">What you’ll master</p>
            <h2 className="reveal">The Exact Roadmap From “Stuck &amp; Underpaid” to <span className="hl">$120K–$150K+ Privacy Leader</span></h2>
            <p className="lede reveal">We don’t do “theory” or academic fluff. Here is what you walk away with:</p>
            <ul className="checklist reveal">{learningPoints.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">Meet your coach: Temi</p>
            <h2 className="reveal">From $75K to a <span className="hl">$400K+ Big Tech Privacy Leader</span></h2>
            <figure className="host-photo reveal"><img src="/sites/dataverse/temisecond.jpeg" alt="Temi speaking at a DataVerse session" loading="lazy" /></figure>
            <div className="host-bio reveal">
              <p>Over the past 9+ years, Temi has designed and executed massive privacy programs at global powerhouses like <strong>Deloitte</strong> and <strong>Meta</strong>.</p>
              <p className="host-lead">She’s sat on the inside. She knows what hiring managers look for, what makes a resume hit the trash pile, and what skills command a six-figure salary.</p>
              <p>Through DataVerse Solutions, she strips away the complex legal jargon and teaches you her simple, repeatable 3-step framework:</p>
              <ol className="host-steps"><li>Understand the regulation.</li><li>Understand the business.</li><li>Execute and communicate your value.</li></ol>
              <p className="host-quote">“My mission is simple: to save you years of trial and error and give you the exact execution playbook companies are desperately paying top dollar for.”<br /><strong>— Temi</strong></p>
            </div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center">
            <p className="pill reveal">Real people. Zero prior privacy experience.</p>
            <h2 className="reveal">Six-Figure <span className="hl">Results.</span></h2>
            <div className="results-shell reveal">{testimonials.map((testimonial) => <article className="result-card" key={testimonial.name}>
              <p className="result-metric">{testimonial.metric}</p><p className="result-context">{testimonial.context}</p>
              <img className="result-photo" src={`/sites/dataverse/${testimonial.image}`} alt={testimonial.alt} loading="lazy" />
              <blockquote>{testimonial.quote}</blockquote>
              <div className="result-person"><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div>
            </article>)}</div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center narrow">
            <p className="pill reveal">Join our free live training</p>
            <h2 className="reveal">The Data Privacy Career Transition <span className="hl">Masterclass</span></h2>
            <p className="lede reveal">Prefer to join a group session first? Get live access to our weekly session where we break down current market trends, real-world privacy scenarios, and the step-by-step roadmap to land a high-paying role this year.</p>
            <p className="countdown-label training-countdown-label">Webinar starts in · Saturday, October 17th · 12:00 PM PT</p>
            <div className="countdown training-countdown">{Object.entries(countdown).map(([unit, value]) => <div key={unit}><strong>{String(value).padStart(2, "0")}</strong><span>{unit}</span></div>)}</div>
            <a className="cta reveal" href={seatUrl} target="_blank" rel="noopener noreferrer"><span className="cta-main">🎟 Save My Free Seat for the Masterclass <span aria-hidden="true">→</span></span><span className="cta-sub">Limited spots available · 100% free</span></a>
          </div>
        </section>

        <section className="section">
          <div className="wrap center">
            <p className="pill reveal">Instant Action Bonus</p>
            <h2 className="reveal">Get Immediate Access to the DataVerse <span className="hl">WhatsApp VIP Community</span></h2>
            <p className="lede reveal">Don’t wait until Saturday to start building your future. Register for the masterclass today and get immediate access to our private WhatsApp VIP group.</p>
            <div className="bonus-grid">
              <article className="bonus-card reveal"><div className="bonus-top"><strong>Instant Access</strong></div><p className="bonus-title">Execution cheat sheets</p><p>Pre-webinar execution cheat sheets and career transition starter guides.</p></article>
              <article className="bonus-card reveal"><div className="bonus-top"><strong>Direct Access</strong></div><p className="bonus-title">Direct Access</p><p>Real-world privacy teardowns, insider market updates, and direct peer support.</p></article>
            </div>
            <a className="ghost-link reveal" href="https://chat.whatsapp.com/FFVu9ZZEi5C0FhvsisOlMe?mode=gi_t" target="_blank" rel="noopener noreferrer">Join the WhatsApp VIP Community →</a>
          </div>
        </section>

        <section className="section final">
          <div className="wrap center narrow">
            <p className="pill reveal">Event details</p>
            <h2 className="reveal">Join the Free Live Training</h2>
            <dl className="event-facts reveal"><div><dt>Date</dt><dd>Saturday, October 17th</dd></div><div><dt>Time</dt><dd>12:00 PM PT</dd></div><div><dt>Cost</dt><dd>100% Free</dd></div></dl>
            <div className="reveal"><SeatButton final /></div>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">Want to skip the wait and get a customized 1:1 plan?</p>
            <h2 className="reveal">Get a <span className="hl">Customized 1:1 Plan</span></h2>
            <p className="lede reveal">Don’t wait for the webinar if you’re ready to make your move now. Schedule a 30-minute private 1:1 Career Audit &amp; Strategy Call directly with Temi to evaluate your current background, pinpoint your target role, and map out your fastest path to a $120K+ Data Privacy career.</p>
            <div className="reveal"><StrategyButton label="Schedule Your Private 1:1 Strategy Call Now" /></div>
            <a className="ghost-link reveal" href={seatUrl} target="_blank" rel="noopener noreferrer">🎟 Register for the free live webinar →</a>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="wrap center">
        <img className="footer-logo" src="/sites/dataverse/DATAVERSELOGO.jpeg" alt="DataVerse Solutions" />
        <p>© 2026 DataVerse Solutions. All rights reserved.</p>
      </div></footer>

      <div className="sticky-bar" data-sticky><div><strong>Free Live Masterclass</strong><span>Sat, Oct 17 · 12:00 PM PT</span></div><a href={seatUrl} target="_blank" rel="noopener noreferrer">Register</a></div>
    </>
  );
}
