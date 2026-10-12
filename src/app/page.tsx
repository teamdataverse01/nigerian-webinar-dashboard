"use client";

import { useEffect, useState } from "react";

const seatUrl = "https://calendly.com/data-privacy_beginner_01/new-meeting-1";
const strategyUrl = "https://calendly.com/data-privacy_beginner_01/30min";
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
  return { days, hours, minutes, seconds };
}

function SeatButton({ final = false }: { final?: boolean }) {
  return (
    <div className="cta-block">
      <a className="cta" href={seatUrl} target="_blank" rel="noopener noreferrer">
        <span className="cta-main">{final ? "Save My Free Seat Now!" : "Save My Free Seat"} <span aria-hidden="true">→</span></span>
        <span className="cta-sub">Limited spots available</span>
      </a>
      {final ? <p className="cta-note">Replay will not be available. Join us live on Saturday, October 17th.</p> : <p className="cta-note">We’re keeping the session focused and interactive so attendees can ask real questions and get practical guidance. Reserve your seat now and join us live on Saturday.</p>}
    </div>
  );
}

const learningPoints = [
  "The Background Mapping Matrix: know which high-paying privacy roles to target based on your professional history, so you never waste time applying blindly.",
  "Execution-Ready Skills: learn the practical, day-one privacy deliverables employers look for on the job.",
  "The Value Translation Brand Makeover: position your LinkedIn profile and resume so recruiters see your past experience as an asset.",
  "The Interview Playbook: build the confidence and technical fluency to compete for top-of-market salaries.",
  "Done-With-You Support: get direct mentorship and job-search execution support as you work toward your next role.",
];

const testimonials = [
  { metric: "Privacy role at Meta", context: "after translating nearly a decade in HR into privacy governance", quote: "“After almost 10 years in HR, I felt completely stuck. This program taught me how to translate my people operations background into privacy governance—and I landed a Data Privacy role at Meta!”", name: "Former HR Manager", role: "Privacy Leader at Meta" },
  { metric: "Two six-figure offers", context: "in less than six weeks after struggling in sales", quote: "“I went from struggling in sales to having two competing six-figure Data Privacy offers on the table in less than 6 weeks.”", name: "Former Sales Representative", role: "Data Privacy Specialist" },
  { metric: "Doubled salary", context: "on the very next career move", quote: "“I was working front-line Customer Care at a bank. Joining this program allowed me to double my salary on my very next career move.”", name: "Former Bank Customer Care Rep", role: "Senior Data Privacy Analyst" },
  { metric: "First remote privacy role", context: "after 20 years as a pharmacist", quote: "“After 20 years as a pharmacist, I wanted out of the grind. Temi’s framework helped me secure my very first remote Data Privacy position as a Senior Professional.”", name: "Pharmacist (20 years experience)", role: "Senior Remote Data Privacy Professional" },
];

function StrategyButton({ label = "Book a Free 1:1 Career Strategy Call With Temi" }: { label?: string }) {
  return <a className="cta strategy-cta" href={strategyUrl} target="_blank" rel="noopener noreferrer"><span className="cta-main">📞 {label} <span aria-hidden="true">→</span></span><span className="cta-sub">Free 30-minute private career audit</span></a>;
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
            <p className="hero-date">Build your next chapter in Data Privacy</p>
            <p className="badge-outline"><span className="dot" />A practical career transition blueprint</p>
            <h1>Land a <span className="hl nw">$120K+ Data Privacy Career</span> in 90 Days — Without Writing a Single Line of Code or Starting Over</h1>
            <p className="hero-sub">Learn the transition blueprint used by professionals in Tech, Compliance, Legal, HR, Finance, and Operations to break into one of tech’s highest-paying, most secure niches.</p>

            <div className="hero-media">
              <img src="/sites/dataverse/temifirst.jpeg" alt="Temi, host of the DataVerse masterclass" />
              <div className="hero-countdown">
                <p className="countdown-label">Webinar starts in</p>
                <div className="countdown">
                  {Object.entries(countdown).map(([unit, value]) => <div key={unit}><strong>{String(value).padStart(2, "0")}</strong><span>{unit}</span></div>)}
                </div>
              </div>
            </div>

            <div className="cta-block" id="hero-cta">
              <StrategyButton />
              <p className="cta-note">Want a personalized plan? Book a free 1:1 call with Temi.</p>
              <a className="cta" href={seatUrl} target="_blank" rel="noopener noreferrer"><span className="cta-main">Save My Free Seat <span aria-hidden="true">→</span></span><span className="cta-sub">Limited spots available</span></a>
              <p className="cta-note">🎟 Register for the free live masterclass. Limited spots are available this week.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">Stop buying the big lie</p>
            <h2 className="reveal">You Do Not Need to <span className="hl">Start Over</span></h2>
            <div className="stuck-card reveal"><p>If you want to switch into Data Privacy, you may have been told you need a law degree, a computer science background, or years of starting at the bottom making peanuts. <strong>That is completely false.</strong></p><p className="stuck-bypass">Your experience in customer service, sales, marketing, risk, legal, HR, audit, finance, operations, or project management is an unfair advantage. Companies need professionals who understand business and can execute privacy frameworks—not textbook theorists. Map what you already know to a $120K+ privacy role without quitting your job or going back to school.</p></div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center">
            <p className="pill reveal">What you’ll master</p>
            <h2 className="reveal">The Roadmap From “Stuck &amp; Underpaid” to <span className="hl">$120K–$150K+ Privacy Leader</span></h2>
            <ul className="checklist reveal">{learningPoints.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">Meet your coach: Temi</p>
            <h2 className="reveal">From $75K to a <span className="hl">$400K+ Big Tech Privacy Leader</span></h2>
            <figure className="host-photo reveal"><img src="/sites/dataverse/temisecond.jpeg" alt="Temi speaking at a DataVerse session" loading="lazy" /></figure>
            <div className="host-bio reveal">
              <p className="host-lead">She’s sat on the inside. She knows what hiring managers look for, what makes a resume hit the trash pile, and what skills command a six-figure salary.</p>
              <p>Over the past 9+ years, Temi has designed and executed privacy programs at global powerhouses like <strong>Deloitte</strong> and <strong>Meta</strong>. Through DataVerse Solutions, she strips away complex legal jargon and teaches a simple, repeatable framework:</p>
              <ol className="host-steps"><li>Understand the regulation.</li><li>Understand the business.</li><li>Execute and communicate your value.</li></ol>
              <p className="host-quote">“My mission is simple: to save you years of trial and error and give you the exact execution playbook companies are desperately paying top dollar for.”<br /><strong>— Temi</strong></p>
            </div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center">
            <p className="pill reveal">Real people. Zero prior privacy experience.</p>
            <h2 className="reveal">Six-Figure <span className="hl">Career Results</span></h2>
            <div className="results-shell reveal">{testimonials.map((testimonial) => <article className="result-card" key={testimonial.name}>
              <p className="result-metric">{testimonial.metric}</p><p className="result-context">{testimonial.context}</p>
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
            <p className="countdown-label training-countdown-label">Webinar starts in · Saturday, October 17th · 5:00 PM WAT</p>
            <div className="countdown training-countdown">{Object.entries(countdown).map(([unit, value]) => <div key={unit}><strong>{String(value).padStart(2, "0")}</strong><span>{unit}</span></div>)}</div>
            <a className="cta reveal" href={seatUrl} target="_blank" rel="noopener noreferrer"><span className="cta-main">🎟 Save My Free Seat for the Masterclass <span aria-hidden="true">→</span></span><span className="cta-sub">Limited spots available · 100% free</span></a>
          </div>
        </section>

        <section className="section">
          <div className="wrap center">
            <p className="pill reveal">Free bonus when you register today</p>
            <h2 className="reveal">Access To The DataVerse <span className="hl">WhatsApp VIP Community</span></h2>
            <p className="lede reveal">Don’t wait until Saturday to start building your future. Register for the masterclass today and get immediate access to our private WhatsApp VIP group.</p>
            <div className="bonus-grid">
              <article className="bonus-card reveal"><div className="bonus-top"><strong>Instant Access</strong><span>Included</span></div><p className="bonus-title">Execution cheat sheets</p><p>Pre-webinar execution cheat sheets and starter guides.</p></article>
              <article className="bonus-card reveal"><div className="bonus-top"><strong>Direct Access</strong><span>Ongoing</span></div><p className="bonus-title">Teardowns &amp; peer support</p><p>Real-world privacy teardowns, insider market updates, and direct peer support.</p></article>
            </div>
            <a className="ghost-link reveal" href="https://chat.whatsapp.com/FFVu9ZZEi5C0FhvsisOlMe?mode=gi_t" target="_blank" rel="noopener noreferrer">Join the WhatsApp VIP Community →</a>
          </div>
        </section>

        <section className="section final">
          <div className="wrap center narrow">
            <p className="pill reveal">Event details</p>
            <h2 className="reveal">Join the Free Live Training</h2>
            <dl className="event-facts reveal"><div><dt>Date</dt><dd>Saturday, October 17th</dd></div><div><dt>Time</dt><dd>5:00 PM WAT</dd></div><div><dt>Cost</dt><dd>100% Free</dd></div></dl>
            <div className="reveal"><SeatButton final /></div>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">Ready to skip the wait?</p>
            <h2 className="reveal">Get a <span className="hl">Customized 1:1 Plan</span></h2>
            <p className="lede reveal">Schedule a 30-minute private Career Audit &amp; Strategy Call directly with Temi. Evaluate your background, pinpoint your target role, and map your fastest path to a $120K+ Data Privacy career.</p>
            <div className="reveal"><StrategyButton label="Schedule Your Private 1:1 Strategy Call Now" /></div>
            <a className="ghost-link reveal" href={seatUrl} target="_blank" rel="noopener noreferrer">🎟 Register for the free live webinar instead →</a>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="wrap center">
        <img className="footer-logo" src="/sites/dataverse/DATAVERSELOGO.jpeg" alt="DataVerse Solutions" />
        <p className="disclaimer">Disclaimer: Testimonials reflect individual experiences and do not represent typical results. Outcomes depend on many factors unique to each individual, including commitment and effort. DataVerse Solutions makes no guarantee of any job, appointment or financial gain from attending this masterclass.</p>
        <p>© 2026 DataVerse Solutions. All rights reserved.</p>
      </div></footer>

      <div className="sticky-bar" data-sticky><div><strong>Free Live Masterclass</strong><span>Sat, Oct 17 · 5:00 PM WAT</span></div><a href={seatUrl} target="_blank" rel="noopener noreferrer">Register</a></div>
    </>
  );
}
