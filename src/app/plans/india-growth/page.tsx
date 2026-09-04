import type { Metadata } from 'next';
import Script from 'next/script';
import plansData from '@/data/plans.json';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import '@/styles/plans.css';

// Single-source plan prices from plans.json (source of truth).
const plan = plansData.plans.find((p) => p.id === 'india-growth')!;
const priceOne = plan.price_one; // "$1,200"
const priceMonthly = plan.price_monthly.replace('/mo', ''); // "$800"
const schemaPriceOne = plan.price_one.replace(/[^0-9.]/g, ''); // "1200"
const schemaPriceMonthly = plan.price_monthly.replace(/[^0-9.]/g, ''); // "800"

const planSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'India Growth Plan',
  serviceType: 'Web3 marketing and community growth',
  provider: { '@type': 'Organization', name: 'Flexist', url: 'https://flexist.in' },
  areaServed: { '@type': 'Country', name: 'India' },
  description: 'India Growth plan — the most popular plan for Web3 projects scaling their India presence with full community, KOL, and ambassador programs.',
  url: 'https://flexist.in/plans/india-growth',
  offers: [
    { '@type': 'Offer', name: 'One-Time Setup', price: schemaPriceOne, priceCurrency: 'USD', url: 'https://flexist.in/plans/india-growth' },
    { '@type': 'Offer', name: 'Monthly Retainer', price: schemaPriceMonthly, priceCurrency: 'USD', url: 'https://flexist.in/plans/india-growth' },
  ],
};

export const metadata: Metadata = buildMetadata({
  title: 'India Growth Plan | Flexist',
  description: 'India Growth plan — the most popular plan for Web3 projects scaling their India presence with full community, KOL, and ambassador programs.',
  canonical: 'https://flexist.in/plans/india-growth',
});

export default function IndiaGrowthPage() {
  return (
    <>
      <JsonLd schema={planSchema} />
      <main id="main-content">
        {/* Hero */}
        <section className="plan-detail-hero">
          <div className="container plan-detail-content">
            <span className="plan-badge" style={{ background: 'rgba(0,102,255,0.12)', borderColor: 'rgba(0,102,255,0.4)', color: 'var(--accent-cyan)' }}>Most Popular</span>
            <h1 className="plan-detail-title gradient-text">India Growth</h1>
            <p className="plan-detail-subtitle">The complete India growth setup. We run your Telegram and Discord communities, serious KOL campaigns, a real ambassador program, and partnerships — with regular strategy calls to keep it all pointed the same way.</p>
            <p className="plan-detail-price" style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '.95rem', color: 'var(--text-secondary)', letterSpacing: '.02em' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>{priceOne}</strong> one‑time&nbsp;&nbsp;·&nbsp;&nbsp;<strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>{priceMonthly}</strong>/mo
            </p>
            <div className="button-row" style={{ marginTop: '20px' }}>
              <a className="neon-button" href="/inquiry">Start India Growth →</a>
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
                    <span><strong>Everything in India Entry</strong> — Market audit, Telegram setup, micro KOL campaign, ambassador recruitment, weekly report.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Full Telegram + Discord Setup</strong> — Both platforms built out properly with bots, roles, and moderation that actually holds up.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>KOL Standard Campaign (10‑15 Creators)</strong> — Larger-scale influencer activation across YouTube, Twitter, and Telegram with Indian crypto creators.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Full Ambassador Program</strong> — Complete ambassador pipeline with recruitment, training, KPI tracking, and reward management.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>2 Strategic Partnerships</strong> — Identifying and closing partnerships with complementary Indian Web3 projects or communities.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Content Calendar</strong> — Monthly content strategy with scheduled posts, engagement hooks, and community event planning.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Bi‑Weekly Strategy Call</strong> — Direct access to Flexist for alignment, feedback, and growth optimization.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Monthly Report</strong> — Comprehensive performance analytics covering all active channels and campaigns.</span>
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
                    <h4>Strategy & Setup</h4>
                    <p>Market audit. Telegram and Discord set up. Content calendar drafted. Ambassador sourcing begins. First strategy call.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="timeline-week">Week 2</span>
                    <h4>Activation</h4>
                    <p>KOL shortlist finalized, outreach begins. Ambassador interviews and selection. Community seeding campaigns across both platforms.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="timeline-week">Week 3‑4</span>
                    <h4>Momentum</h4>
                    <p>KOL content goes live. Full ambassador team onboarded. Partnership outreach initiated. Second strategy call with first performance data.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="timeline-week">Month 2+</span>
                    <h4>Sustained Growth</h4>
                    <p>Ongoing community management. Content calendar execution. Partnership closes. Monthly reporting. Continuous optimization through bi-weekly calls.</p>
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
                <h4>Scaling Projects</h4>
                <p>You already have product-market fit and need a full-stack India presence — community, creators, partners, and ambassadors working together.</p>
              </div>
              <div className="use-case">
                <h4>Serious About India</h4>
                <p>India isn't a "nice to have" — it's a core market in your roadmap and you want professional execution.</p>
              </div>
              <div className="use-case">
                <h4>Multi‑Platform Presence</h4>
                <p>You need both Telegram and Discord running with active, real communities — not ghost towns.</p>
              </div>
              <div className="use-case">
                <h4>VC-Backed Protocols</h4>
                <p>Your investors expect structured growth and measurable community metrics. This plan delivers both.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section">
          <div className="container">
            <div className="cta-block reveal plans-cta-strip">
              <h2>Compare All Plans</h2>
              <p>See how India Growth stacks up against Entry and Partner tiers in a side-by-side feature comparison.</p>
              <div className="button-row" style={{ justifyContent: 'center' }}>
                <a className="neon-button" href="/plans#compare">View Comparison →</a>
                <a className="ghost-button" href="/plans/india-partner">See India Partner →</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Script src="/scripts/plans.js" strategy="afterInteractive" />
    </>
  );
}
