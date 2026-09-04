import type { Metadata } from 'next';
import Script from 'next/script';
import servicesData from '@/data/services.json';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import '@/styles/services.css';

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Web3 Marketing Services India',
  itemListElement: servicesData.services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.title,
      serviceType: service.title,
      provider: {
        '@type': 'Organization',
        name: 'Flexist',
        url: 'https://flexist.in'
      },
      areaServed: {
        '@type': 'Country',
        name: 'India'
      },
      description: service.description.replace(/\s+/g, ' ')
    }
  }))
};

const servicesFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What Web3 marketing services does Flexist offer in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Flexist offers Telegram community management, India market entry strategy, KOL campaigns, ambassador programs, partnership operations, and growth consulting for Web3 projects.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can Flexist support only one service?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Founders can start with one service such as Telegram community management or KOL campaigns, then combine services into a wider India growth system.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who are these services for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'These services are for Web3 founders, wallets, trading tools, communities, and crypto projects that want real Indian users and stronger local trust.'
      }
    }
  ]
};

export const metadata: Metadata = buildMetadata({
  title: 'Web3 & Crypto Marketing Services India | Flexist',
  description: 'Flexist offers Web3 community management, Telegram marketing, KOL campaigns, ambassador programs, and India market entry for crypto projects.',
  canonical: 'https://flexist.in/services'
});

export default function Page() {
  return (
    <>
      <JsonLd schema={[serviceSchema, servicesFaqSchema]} />
      <main id="main-content">
        <section className="page-hero"><div className="container page-hero-content"><p className="page-kicker">Services | Web3 Marketing India</p><h1 className="page-title">Web3 Marketing Services<br/><span className="gradient-text">for India Expansion</span></h1><p className="page-lede">Pick the growth support your project needs now. Flexist can help with one service or build the full India expansion plan.</p><div className="chip-row services-sticky-tabs" id="servicesTabs"><a className="tag-chip active" href="#community">Community</a><a className="tag-chip" href="#india-entry">Expansion</a><a className="tag-chip" href="#kol">Creators</a><a className="tag-chip" href="#ambassadors">Ambassadors</a><a className="tag-chip" href="#partnerships">Partnerships</a><a className="tag-chip" href="#consulting">Consulting</a></div></div></section>
        <section className="section"><div className="container services-list">

          {servicesData.services.map((service, idx) => {
            const isOdd = idx % 2 === 0;
            return (
              <div key={service.id}>
                <article className={`glass-card service-block ${isOdd ? 'odd-service' : 'even-service'}`} id={service.id}>
                  <span className="watermark-number">{String(idx + 1).padStart(2, '0')}</span>
                  {isOdd ? (
                    <>
                      <div className="service-main">
                        <span className="service-index">{service.index}</span>
                        <h2>{service.title}</h2>
                        {service.description.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                      <div className="service-deliverables">
                        <h3>What You Get</h3>
                        <ul className="value-list">
                          {service.what_you_get.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="service-deliverables">
                        <h3>What You Get</h3>
                        <ul className="value-list">
                          {service.what_you_get.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="service-main">
                        <span className="service-index">{service.index}</span>
                        <h2>{service.title}</h2>
                        {service.description.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                    </>
                  )}
                </article>
                {idx < servicesData.services.length - 1 && <div className="glowing-divider"></div>}
              </div>
            )
          })}

        </div></section>

        <section className="section">
          <div className="container">
            <div className="cta-block reveal">
              <span className="section-label">Ready For India?</span>
              <h2>Use the right service at the right time.</h2>

              <div className="services-tab-switcher">
                <div className="tab-pills">
                  <button type="button" className="tab-pill active" data-tab-target="inquiry">
                    Founder Inquiry
                  </button>
                  <button type="button" className="tab-pill" data-tab-target="flexistlabs">
                    India Readiness Check
                  </button>
                </div>

                <div className="tab-content-wrapper">
                  <div className="tab-panel active" id="tab-inquiry">
                    <p className="tab-description">Answer a few quick questions. We'll get your project stage, India goal, current community, budget, and where you need help first.</p>
                    <button type="button" className="neon-button services-drawer-trigger" data-target-url="inquiry">Open Founder Inquiry &rarr;</button>
                  </div>
                  <div className="tab-panel" id="tab-flexistlabs">
                    <p className="tab-description">Check how ready your project is for the Indian Web3 market across five areas: community, localized messaging, budget, regulatory awareness, and whether the timing fits.</p>
                    <button type="button" className="neon-button services-drawer-trigger" data-target-url="flexistlabs">Run India Check &rarr;</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="services-drawer" id="servicesDrawer">
        <div className="drawer-overlay" id="drawerOverlay"></div>
        <div className="drawer-content-box">
          <div className="drawer-header">
            <span className="drawer-title" id="drawerTitle">Loading Portal...</span>
            <button type="button" className="drawer-close" id="drawerClose" aria-label="Close drawer">&times;</button>
          </div>
          <div className="drawer-body" id="drawerBody">
            <div className="drawer-loader">
              <span className="pay-spinner"></span>
              <p>Loading portal...</p>
            </div>
          </div>
        </div>
      </div>

      <Script src="/scripts/services.js" strategy="afterInteractive" />
    </>
  );
}
