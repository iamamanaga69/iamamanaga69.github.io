import type { Metadata } from 'next';
import Script from 'next/script';
import plansData from '@/data/plans.json';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import '@/styles/plans.css';

// Single-source plan prices from plans.json (source of truth).
const plan = plansData.plans.find((p) => p.id === 'india-entry')!;
const priceOne = plan.price_one; // "$500"
const priceMonthly = plan.price_monthly.replace('/mo', ''); // "$350"
const schemaPriceOne = plan.price_one.replace(/[^0-9.]/g, ''); // "500"
const schemaPriceMonthly = plan.price_monthly.replace(/[^0-9.]/g, ''); // "350"

const planSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'India Entry Plan',
  serviceType: 'Web3 marketing and community growth',
  provider: { '@type': 'Organization', name: 'Flexist', url: 'https://flexist.in' },
  areaServed: { '@type': 'Country', name: 'India' },
  description: 'India Entry plan — the ideal starting point for pre-launch Web3 projects entering the Indian market.',
  url: 'https://flexist.in/plans/india-entry',
  offers: [
    { '@type': 'Offer', name: 'One-Time Setup', price: schemaPriceOne, priceCurrency: 'USD', url: 'https://flexist.in/plans/india-entry' },
    { '@type': 'Offer', name: 'Monthly Retainer', price: schemaPriceMonthly, priceCurrency: 'USD', url: 'https://flexist.in/plans/india-entry' },
  ],
};

export const metadata: Metadata = buildMetadata({
  title: 'India Entry Plan | Flexist',
  description: 'India Entry plan — the ideal starting point for pre-launch Web3 projects entering the Indian market.',
  canonical: 'https://flexist.in/plans/india-entry',
});

export default function IndiaEntryPage() {
  return (
    <>
      <JsonLd schema={planSchema} />
      <main id="main-content">
        {/* Hero */}
        <section className="plan-detail-hero">
          <div className="container plan-detail-content">
            <span className="plan-badge">Best for Pre‑Launch</span>
            <h1 className="plan-detail-title gradient-text">India Entry</h1>
            <p className="plan-detail-subtitle">Your launchpad into India. We set up your community, run your first influencer campaign, and recruit your first ambassadors — everything you need to land with traction.</p>
            <p className="plan-detail-price" style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '.95rem', color: 'var(--text-secondary)', letterSpacing: '.02em' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>{priceOne}</strong> one‑time&nbsp;&nbsp;·&nbsp;&nbsp;<strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>{priceMonthly}</strong>/mo
            </p>
            <div className="button-row" style={{ marginTop: '20px' }}>
              <a className="neon-button" href="/inquiry">Start India Entry →</a>
              <a className="ghost-button" href="/plans#compare">Compare Plans →</a>
            </div>
          </div>
        </section>

        {/* What's Included + Timeline */}
        <section className="section">
          <div className="container">
            <div className="plan-split">
              {/* Left: Features */}
              <div className="reveal">
                <span className="section-label">What's Included</span>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>Full Deliverable List</h2>
                <ul className="feature-list" style={{ marginTop: '28px' }}>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>India Market Audit</strong> — Competitive landscape, opportunity sizing, and recommended positioning for the Indian crypto user base.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Telegram Setup + 30 Days Management</strong> — Full group setup, welcome flows, anti-spam bots, and daily community management for one month.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>KOL Micro Campaign (3‑5 Creators)</strong> — Handpicked Indian crypto influencers creating authentic content about your project.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Ambassador Recruitment (Up to 10)</strong> — Sourcing, vetting, and onboarding local ambassadors who represent your brand in India.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Weekly Report</strong> — Clear performance data on community growth, engagement, and campaign metrics.</span>
                  </li>
                </ul>
              </div>

              {/* Right: Timeline */}
              <div className="reveal">
                <span className="section-label">Execution Timeline</span>
                <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>How We Roll Out</h2>
                <div className="plan-timeline" style={{ marginTop: '28px' }}>
                  <div className="timeline-node">
                    <span className="timeline-week">Week 1</span>
                    <h4>Foundation</h4>
                    <p>Market audit delivery. Telegram group setup with bot configuration, welcome flows, and rules. Begin ambassador sourcing.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="timeline-week">Week 2</span>
                    <h4>Activation</h4>
                    <p>KOL outreach and creator selection. Ambassador interviews begin. Community seeding and initial engagement campaigns.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="timeline-week">Week 3+</span>
                    <h4>Growth</h4>
                    <p>KOL content goes live. Ambassadors onboarded and active. Weekly reporting begins. Ongoing Telegram management and moderation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Is This For */}
        <section className="section section-dark">
          <div className="container">
            <div className="section-header centered reveal">
              <span className="section-label">Ideal For</span>
              <h2 className="section-title">Who Is This For?</h2>
            </div>
            <div className="use-case-grid reveal">
              <div className="use-case">
                <h4>Pre‑Launch Projects</h4>
                <p>You're about to launch or just launched and need a real community presence in India — not bots, real users.</p>
              </div>
              <div className="use-case">
                <h4>Testing India Market Fit</h4>
                <p>You want to understand if India is the right market before committing to a full growth program.</p>
              </div>
              <div className="use-case">
                <h4>Bootstrap Budgets</h4>
                <p>Your budget is tight but you still want professional-grade community setup and influencer activation.</p>
              </div>
              <div className="use-case">
                <h4>First India Expansion</h4>
                <p>You've never operated in India before and need an experienced partner to set the right foundation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section">
          <div className="container">
            <div className="cta-block reveal plans-cta-strip">
              <h2>Compare All Plans</h2>
              <p>See how India Entry stacks up against Growth and Partner tiers in a side-by-side feature comparison.</p>
              <div className="button-row" style={{ justifyContent: 'center' }}>
                <a className="neon-button" href="/plans#compare">View Comparison →</a>
                <a className="ghost-button" href="/plans/india-growth">See India Growth →</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Script src="/scripts/plans.js" strategy="afterInteractive" />
    </>
  );
}
