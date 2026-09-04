import Script from 'next/script';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import experienceData from '@/data/experience.json';
import '@/styles/experience.css';

export const metadata = buildMetadata({
  title: 'Web3 Marketing Experience | Flexist — 5+ Years in Crypto',
  description: "See Flexist's track record: Maestro Bots, UXUY Wallet, Unielon Wallet, and more. Real Web3 projects, real India growth results.",
  canonical: 'https://flexist.in/experience',
});

const experienceSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flexist.in/' },
    { '@type': 'ListItem', position: 2, name: 'Web3 Marketing Experience', item: 'https://flexist.in/experience' }
  ]
};

export default function ExperiencePage() {
  return (
    <>
      <JsonLd schema={experienceSchema} />
      <main id="main-content">
        <section className="page-hero"><div className="container page-hero-content"><p className="page-kicker">Experience | 2020 to Present</p><h1 className="page-title">REAL WORK IN<br/><span className="gradient-text">LIVE PROJECTS.</span></h1><p className="page-lede">This page shows where Flexist learned community growth, user support, collaborations, wallet promotion, and India ambassador work.</p></div></section>
        <section className="section"><div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }} className="reveal">
            <span className="section-label">Web3 Track Record</span>
            <p style={{ fontSize: '1.18rem', color: 'var(--text-secondary)', maxWidth: '780px', margin: '0 auto', lineHeight: '1.65' }}>
              <strong><u>5.5+ Years</u></strong> of active Web3 operations. Built direct lines of communication and personal relationships with <strong><u>75% of all key Web3 influencers and public figures</u></strong> in the crypto space. Grown <strong><u>10,000+ active investing members</u></strong> (real investors, no fake bots) across 5 major client operations.
            </p>
          </div>
          <div className="experience-timeline">

            {experienceData.projects.map((proj, idx) => {
              const isActive = idx === 0;
              return (
                <article key={idx} className={`timeline-entry ${isActive ? 'active' : ''} ${proj.is_current ? 'current-role' : ''}`}>
                  <button className="timeline-trigger" type="button" aria-expanded={isActive ? "true" : "false"}>
                    <time>{proj.date_range} {proj.is_current && <span className="current-badge">CURRENT</span>}</time>
                    <strong>{proj.company}</strong>
                    <span>{proj.role}</span>
                    <i>{isActive ? '-' : '+'}</i>
                  </button>
                  <div className="timeline-detail">
                    <div className="timeline-detail-inner">
                      {proj.bullets.length > 0 && (
                        <>
                          <p dangerouslySetInnerHTML={{ __html: proj.bullets[0] }} />
                          <ul>
                            {proj.bullets.slice(1).map((bullet, i) => <li key={i} dangerouslySetInnerHTML={{ __html: bullet }} />)}
                          </ul>
                        </>
                      )}
                      {proj.traction && <div className="achievement" dangerouslySetInnerHTML={{ __html: proj.traction }} />}
                      <div className="chip-row">
                        {proj.tags.map((tag, i) => <span key={i} className="tag-chip">{tag}</span>)}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}

          </div>
        </div></section>
        <section className="section section-dark"><div className="container"><div className="cta-block reveal"><span className="section-label">Next Step</span><h2>Bring real Web3 experience into your India launch.</h2><p>The best India strategies are designed by people who understand what happens after the campaign goes live.</p><div className="button-row"><a className="neon-button" href="/inquiry">Start Founder Inquiry</a><a className="ghost-button" href="/services">Review Services</a></div></div></div></section>
      </main>

      <Script src="/scripts/experience.js" strategy="afterInteractive" />
    </>
  );
}
