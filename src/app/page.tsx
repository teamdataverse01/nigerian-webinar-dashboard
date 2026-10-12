"use client";

import { useEffect, useState } from "react";

const seatUrl = "https://calendly.com/data-privacy_beginner_01/new-meeting-1";
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
  "What a Data Protection Officer actually does day to day",
  "The core skills and privacy deliverables every DPO should understand",
  "How to transition into Data Privacy from Law, Accounting, Technology, HR and other careers",
  "How to gain practical experience even if you’ve never worked in Privacy before",
  "How to position yourself for DPO jobs, appointments and consulting opportunities",
  "Live Q&A — get your Data Privacy career questions answered",
];

const testimonials = [
  { metric: "First DPO contract", context: "within 45 days of applying the execution steps", image: "testimonial1-ibukunoluwa.jpeg", alt: "Ibukunoluwa", quote: "“I went from completely stuck in traditional compliance to landing my first DPO contract within 45 days of applying these execution steps.”", name: "Ibukunoluwa", role: "From Corporate and Commercial Litigator to Data Protection Officer" },
  { metric: "₦1M+ in DPO contracts", context: "landed before the transition plan was even finished", image: "testimonial2-mary.jpeg", alt: "Mary", quote: "“The framework showed me how to turn my experience as a lawyer into a privacy asset. I went from litigation to landing over ₦1M in DPO contracts before I even finished my transition plan.”", name: "Mary", role: "From Litigation Lawyer to Data Protection Officer" },
  { metric: "1 year saved", context: "of trial and error, with the exact deliverables expected on the job", image: "testimonial3-david.jpg", alt: "David", quote: "“No fluff, just the exact deliverables expected on the job. This saved me at least a year of trial and error.”", name: "David", role: "From Operations and Process Improvement Professional to Data Protection Officer" },
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
        <a href="#top" aria-label="DataVerse Solutions home"><img className="topbar-logo" src="/sites/dataverse/DATAVERSELOGO.jpeg" alt="DataVerse Solutions" /></a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="wrap center">
            <p className="hero-date">Saturday, October 17th · 5:00 PM WAT</p>
            <p className="badge-outline"><span className="dot" />100% Free Live Masterclass</p>
            <h1>How to Land <span className="hl"><span className="nw">₦700k –</span> <span className="nw">₦1.5M/Month</span></span> Data Protection Officer (DPO) Deals in 90 Days — Even Without Prior Privacy Experience</h1>
            <p className="hero-sub">Stop studying regulations. Learn how the work is actually done inside top tech &amp; enterprise companies.</p>

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
              <a className="cta" href={seatUrl} target="_blank" rel="noopener noreferrer"><span className="cta-main">Save My Free Seat <span aria-hidden="true">→</span></span><span className="cta-sub">Limited spots available</span></a>
              <p className="cta-note">We’re keeping the session focused and interactive so attendees can ask real questions and get practical guidance. Reserve your seat now and join us live on Saturday.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">Why most professionals get stuck</p>
            <h2 className="reveal">Companies Don’t Hire People Who Know The Law. They Hire People Who Know How To <span className="hl">Execute Privacy Operations.</span></h2>
            <div className="stuck-card reveal"><p>Most legal, HR, tech, and accounting professionals spend months reading privacy laws, taking certifications, and sending resumes into black holes — only to get rejected for <strong>“lack of practical experience.”</strong></p><p className="stuck-bypass">This masterclass shows you how to bypass that, by learning how the work is actually done.</p></div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center">
            <p className="pill reveal">What you’ll learn live</p>
            <h2 className="reveal">The Fastest &amp; Safest Path To Closing <span className="hl nw">₦700k – ₦1.5M</span> Deals In Leading Organizations</h2>
            <ul className="checklist reveal">{learningPoints.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>
        </section>

        <section className="section">
          <div className="wrap center narrow">
            <p className="pill reveal">Meet your host: Temi</p>
            <h2 className="reveal">How Temi Scaled Her Business To <span className="hl">₦50M+</span> Client Projects</h2>
            <figure className="host-photo reveal"><img src="/sites/dataverse/temisecond.jpeg" alt="Temi speaking at a DataVerse session" loading="lazy" /></figure>
            <div className="host-bio reveal">
              <p className="host-lead">From Big Tech Privacy Leader to Building Nigeria’s Next Generation of DPOs.</p>
              <p>Over the past 9+ years, I’ve built a career leading high-impact privacy projects at industry giants like <strong>Deloitte</strong> and <strong>Meta</strong>. I launched Dataverse Consulting to empower aspiring DPOs with real-world execution skills.</p>
              <p>After leveraging this exact framework to build my own brand and secure over ₦50M in client engagements, I’ve helped professionals land DPO positions and close ₦1M–₦1.5M deals.</p>
              <p>In this session, I’ll share the entire playbook without holding back.</p>
            </div>
          </div>
        </section>

        <section className="section section-glow">
          <div className="wrap center">
            <p className="pill reveal">Real results from our students</p>
            <h2 className="reveal">See What’s Possible When You Have <span className="hl">The Practical Roadmap</span></h2>
            <div className="results-shell reveal">{testimonials.map((testimonial) => <article className="result-card" key={testimonial.name}>
              <p className="result-metric">{testimonial.metric}</p><p className="result-context">{testimonial.context}</p>
              <img className="result-photo" src={`/sites/dataverse/${testimonial.image}`} alt={testimonial.alt} loading="lazy" />
              <blockquote>{testimonial.quote}</blockquote>
              <div className="result-person"><strong>{testimonial.name}</strong><span>{testimonial.role}</span></div>
            </article>)}</div>
          </div>
        </section>

        <section className="section">
          <div className="wrap center">
            <p className="pill reveal">Free bonus when you register today</p>
            <h2 className="reveal">Access To The DataVerse <span className="hl">WhatsApp VIP Community</span></h2>
            <p className="lede reveal">Don’t wait until Saturday to start learning. Register now and gain instant access to our private WhatsApp VIP group to get:</p>
            <div className="bonus-grid">
              <article className="bonus-card reveal"><div className="bonus-top"><strong>Instant Access</strong><span>Included</span></div><p className="bonus-title">Execution cheat sheets</p><p>Pre-webinar execution cheat sheets and starter guides.</p></article>
              <article className="bonus-card reveal"><div className="bonus-top"><strong>Direct Access</strong><span>Ongoing</span></div><p className="bonus-title">Teardowns &amp; insights</p><p>Practical privacy teardowns, industry insights, and event updates.</p></article>
            </div>
            <a className="ghost-link reveal" href="https://chat.whatsapp.com/FFVu9ZZEi5C0FhvsisOlMe?mode=gi_t" target="_blank" rel="noopener noreferrer">Join the WhatsApp VIP Community →</a>
          </div>
        </section>

        <section className="section final">
          <div className="wrap center narrow">
            <p className="pill reveal">Claim your free seat now</p>
            <h2 className="reveal">Join Us Live, <span className="hl">Before The Seats Run Out</span></h2>
            <dl className="event-facts reveal"><div><dt>Date</dt><dd>Saturday, October 17th</dd></div><div><dt>Time</dt><dd>5:00 PM WAT</dd></div><div><dt>Cost</dt><dd>100% Free</dd></div></dl>
            <div className="reveal"><SeatButton final /></div>
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
