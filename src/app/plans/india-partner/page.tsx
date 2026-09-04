import type { Metadata } from 'next';
import Script from 'next/script';
import plansData from '@/data/plans.json';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import '@/styles/plans.css';

// Single-source plan prices from plans.json (source of truth).
const plan = plansData.plans.find((p) => p.id === 'india-partner')!;
const priceDisplay = plan.price_monthly.replace('/mo', ''); // "$1,800" (partner is a monthly retainer)
const schemaPrice = plan.price_monthly.replace(/[^0-9.]/g, ''); // "1800"

const planSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'India Partner Plan',
  serviceType: 'Web3 marketing and community growth',
  provider: { '@type': 'Organization', name: 'Flexist', url: 'https://flexist.in' },
  areaServed: { '@type': 'Country', name: 'India' },
  description: 'India Partner plan — full India ownership for Web3 projects that want a dedicated growth partner with unlimited KOL campaigns, partnerships, and weekly founder calls.',
  url: 'https://flexist.in/plans/india-partner',
  offers: [
    { '@type': 'Offer', name: 'Monthly Retainer', price: schemaPrice, priceCurrency: 'USD', url: 'https://flexist.in/plans/india-partner' },
  ],
};

export const metadata: Metadata = buildMetadata({
  title: 'India Partner Plan | Flexist',
  description: 'India Partner plan — full India ownership for Web3 projects that want a dedicated growth partner with unlimited KOL campaigns, partnerships, and weekly founder calls.',
  canonical: 'https://flexist.in/plans/india-partner',
});

export default function IndiaPartnerPage() {
  return (
    <>
      <JsonLd schema={planSchema} />
      <main id="main-content">
        {/* Hero */}
        <section className="plan-detail-hero">
          <div className="container plan-detail-content">
            <span className="plan-badge">Full India Ownership</span>
            <h1 className="plan-detail-title gradient-text">India Partner</h1>
            <p className="plan-detail-subtitle">Your dedicated India growth arm. Unlimited campaigns, weekly founder calls, full ambassador management, and a continuous partnership pipeline. We become your India team.</p>
            <p className="plan-detail-price" style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '.95rem', color: 'var(--text-secondary)', letterSpacing: '.02em' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>{priceDisplay}</strong>/mo retainer
            </p>
            <div className="button-row" style={{ marginTop: '20px' }}>
              <a className="neon-button" href="/inquiry">Start India Partner →</a>
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
                    <span><strong>Everything in India Growth</strong> — Market audit, full community setup, standard KOL campaign, ambassador program, partnerships, content calendar, strategy calls, reporting.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Unlimited KOL Campaigns</strong> — Continuous influencer activation with no cap on creator count or content cycles.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Full Ambassador Management</strong> — The whole program: recruitment, training, task management, performance reviews, and rewards.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Monthly Partnership Pipeline</strong> — Ongoing deal flow with Indian Web3 projects, communities, and ecosystem players.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Monthly AMA Coordination</strong> — Organized AMAs with the Indian community, including host, promotion, and moderation.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>App Review Management</strong> — Structured campaign to improve your app store ratings with real Indian users.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Dedicated Indian Support</strong> — Priority response, local timezone availability, and a named point of contact.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Full Network Access</strong> — Introductions to Flexist's Indian Web3 network: founders, exchanges, VCs, and media.</span>
                  </li>
                  <li>
                    <span className="feature-bullet">✓</span>
                    <span><strong>Weekly Founder Call</strong> — Direct weekly sync with Flexist on strategy, execution, and market intelligence.</span>
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
                    <h4>Full Deployment</h4>
                    <p>Complete market audit. All community platforms set up and staffed. Ambassador and KOL pipelines activated. First founder call with strategy roadmap.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="timeline-week">Week 2‑3</span>
                    <h4>Maximum Output</h4>
                    <p>First KOL wave live. Ambassador team operational. Partnership outreach in progress. Content calendar in execution. AMA planned.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="timeline-week">Month 2</span>
                    <h4>Momentum Builds</h4>
                    <p>Second KOL wave. First partnerships closed. AMA completed. App review campaign launched. Full monthly report delivered.</p>
                  </div>
                  <div className="timeline-node">
                    <span className="timeline-week">Month 3+</span>
                    <h4>India Ownership</h4>
                    <p>Continuous operations across all channels. New KOL cycles every month. Partnership pipeline flowing. Weekly founder calls driving strategic direction.</p>
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
                <h4>India‑First Protocols</h4>
                <p>India is your primary growth market and you need a permanent, always-on growth partner — not just a one-off campaign.</p>
              </div>
              <div className="use-case">
                <h4>Well‑Funded Projects</h4>
                <p>You have the budget for sustained growth and want maximum ROI across every India channel simultaneously.</p>
              </div>
              <div className="use-case">
                <h4>Exchange Listing Prep</h4>
                <p>You're preparing for Indian exchange listings and need verifiable community metrics, KOL coverage, and local credibility.</p>
              </div>
              <div className="use-case">
                <h4>Long‑Term Market Builders</h4>
                <p>You think in quarters and years, not weeks. You want growth that keeps building, with a partner who's embedded in the ecosystem.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section">
          <div className="container">
            <div className="cta-block reveal plans-cta-strip">
              <h2>Compare All Plans</h2>
              <p>See how India Partner compares to Entry and Growth tiers in a side-by-side feature comparison.</p>
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
