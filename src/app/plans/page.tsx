import type { Metadata } from 'next';
import Script from 'next/script';
import plansData from '@/data/plans.json';
import { buildMetadata } from '@/lib/seo';
import '@/styles/plans.css';

export const metadata: Metadata = buildMetadata({
  title: 'Plans & Pricing | Flexist',
  description: 'Simple bundled plans for India Web3 growth. Entry, Growth, and Partner tiers with clear deliverables.',
  canonical: 'https://flexist.in/plans',
});

export default function PlansPage() {
  return (
    <>
      <main id="main-content">
        {/* Hero */}
        <section className="page-hero">
          <div className="container page-hero-content">
            <span className="page-kicker">// plans</span>
            <h1 className="page-title gradient-text">Simple Plans.<br />Clear Deliverables.</h1>
            <p className="page-lede">Bundled plans combine the most important services into one India growth system — saving 30‑40% vs buying individually.</p>
            {/* Desktop quick navigation */}
            <div className="hero-quick-nav">
              <span className="quick-nav-label">Jump to:</span>
              <a className="quick-nav-link" href="#plan-india-entry">India Entry</a>
              <span className="quick-nav-separator">&middot;</span>
              <a className="quick-nav-link" href="#plan-india-growth">India Growth</a>
              <span className="quick-nav-separator">&middot;</span>
              <a className="quick-nav-link" href="#plan-india-partner">India Partner</a>
              <span className="quick-nav-separator">&middot;</span>
              <a className="quick-nav-link" href="#compare">Compare Matrix</a>
            </div>
          </div>
        </section>

        {/* Sticky plan navigation */}
        <div className="plan-sticky-nav" id="plan-sticky-nav">
          <div className="container plan-sticky-inner">
            <a className="plan-pill active" href="#plan-india-entry" data-plan-pill>India Entry</a>
            <a className="plan-pill" href="#plan-india-growth" data-plan-pill>India Growth</a>
            <a className="plan-pill" href="#plan-india-partner" data-plan-pill>India Partner</a>
            <a className="plan-pill" href="#compare" data-plan-pill>Compare</a>
          </div>
        </div>

        {/* Price Toggle + Plan Cards */}
        <section className="section">
          <div className="container">
            <div className="price-toggle">
              <button className="active" data-price-mode="one" type="button">One‑Time</button>
              <button data-price-mode="monthly" type="button">Monthly</button>
            </div>

            <div className="plan-grid">
              {plansData.plans.map((plan, i) => {
                const isHighlight = plan.id === 'india-growth';
                const isPartner = plan.id === 'india-partner';
                return (
                  <article className={`plan-card reveal ${isHighlight ? 'plan-highlight' : ''}`} id={`plan-${plan.id}`} key={i}>
                    <span className="plan-badge">
                      {plan.id === 'india-entry' && 'Best for Pre‑Launch'}
                      {plan.id === 'india-growth' && 'Most Popular'}
                      {plan.id === 'india-partner' && 'Full India Ownership'}
                    </span>
                    <h3>{plan.name}</h3>
                    <p className="plan-price" data-one={plan.price_one} data-monthly={plan.price_monthly}>{plan.price_one}</p>
                    <p className="plan-price-note">{isPartner ? 'Monthly retainer' : 'One‑time setup'}</p>
                    <ul className="plan-features">
                      {plan.features.map((feat, j) => <li key={j}><strong><em>{feat}</em></strong></li>)}
                    </ul>
                    <div className="plan-ctas">
                      <a className="neon-button" href="/inquiry">Start {plan.name} →</a>
                    </div>
                    <a className="plan-link" href={`/plans/${plan.id}`}>See Full Plan →</a>
                  </article>
                );
              })}
            </div>

            {/* Professional Fees Disclaimer */}
            <p className="plan-disclaimer" style={{ marginTop: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '680px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.5' }}>
              * <strong>Important Note:</strong> Plan pricing consists solely of the professional services and execution fees of Flexist. Any external campaign costs, network fees, or specific influencer/KOL reward budgets for creators brought into your client project are separate and to be funded directly by the client.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="section section-dark" id="compare">
          <div className="container">
            <div className="section-header centered reveal">
              <span className="section-label">Feature Matrix</span>
              <h2 className="section-title">Full Comparison</h2>
            </div>

            <div className="compare-wrap reveal">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>India Entry</th>
                    <th className="th-highlight">India Growth</th>
                    <th>India Partner</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Market audit</td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Telegram setup</td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Discord setup</td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>KOL campaign</td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Ambassador program</td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Partnerships</td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Content calendar</td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-check">✓</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>AMA coordination</td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Weekly founder call</td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                  <tr>
                    <td>Full India ownership</td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-dash">—</span></td>
                    <td><span className="compare-check">✓</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section">
          <div className="container">
            <div className="cta-block reveal plans-cta-strip">
              <h2>Need just one service?</h2>
              <p>Not every project needs a full plan. Pick individual services like community management, KOL campaigns, or ambassador programs.</p>
              <div className="button-row">
                <a className="neon-button" href="/services">View All Services →</a>
                <a className="ghost-button" href="/services">Or build your own →</a>
              </div>
              <p className="cta-fallback" style={{ marginTop: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Not sure which plan fits? &rarr; <a href="/inquiry" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', borderBottom: '1px dashed var(--accent-cyan)', transition: 'color 0.15s ease, border-color 0.15s ease' }}>Open Founder Inquiry</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Script src="/scripts/plans.js" strategy="afterInteractive" />
    </>
  );
}
