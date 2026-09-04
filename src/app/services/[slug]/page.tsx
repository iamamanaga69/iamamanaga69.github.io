import type { Metadata } from 'next';
import seoServices from '@/data/seoServices.json';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import '@/styles/services.css';

export function generateStaticParams() {
  return seoServices.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = seoServices.find((s) => s.slug === params.slug)!;
  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    canonical: `/services/${service.slug}`
  });
}

export default function Page({ params }: { params: { slug: string } }) {
  const service = seoServices.find((s) => s.slug === params.slug)!;
  const relatedServices = seoServices.filter((item) => service.related.includes(item.slug));
  const serviceUrl = `https://flexist.in/services/${service.slug}`;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer }
    }))
  };
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.keyword,
    url: serviceUrl,
    provider: {
      '@type': 'Organization',
      name: 'Flexist',
      url: 'https://flexist.in'
    },
    areaServed: { '@type': 'Country', name: 'India' },
    description: service.metaDescription
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flexist.in/' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://flexist.in/services' },
      { '@type': 'ListItem', position: 3, name: service.title, item: serviceUrl }
    ]
  };

  return (
    <>
      <JsonLd schema={[serviceSchema, faqSchema, breadcrumbSchema]} />
      <main id="main-content">
        <nav className="breadcrumb container" aria-label="Breadcrumb">
          <a href="/">Home</a> <span>→</span> <a href="/services">Services</a> <span>→</span> <span>{service.title}</span>
        </nav>

        <section className="page-hero">
          <div className="container page-hero-content">
            <p className="page-kicker">{service.keyword}</p>
            <h1 className="page-title">{service.h1}</h1>
            <p className="page-lede">{service.opening}</p>
            <div className="button-row">
              <a className="neon-button" href={`/inquiry?service=${service.slug}`}>Open Founder Inquiry</a>
              <a className="ghost-button" href="/services">View All Services</a>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container split-layout">
            <div className="manifesto-copy reveal">
              <span className="section-label">What This Includes</span>
              <h2 className="section-title">{service.keyword} built for founder outcomes.</h2>
              <p>Founders do not need disconnected tasks. They need a service that explains what happens first, what happens next, and how each channel helps India become a real user acquisition market.</p>
              <ul className="value-list">
                {service.includes.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
            <aside className="glass-card reveal">
              <img src="/assets/images/flexist-avatar-192.png" alt={`${service.keyword} by Flexist`} loading="lazy" style={{ width: '76px', height: '76px', borderRadius: '50%', marginBottom: '18px' }} />
              <h3>Built Around India</h3>
              <p>{service.whyIndia}</p>
            </aside>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-label">Why Flexist</span>
              <h2 className="section-title">How Flexist does this differently.</h2>
            </div>
            <div className="comparison-grid">
              <article className="glass-card compare-column negative reveal">
                <h3>Generic Campaign Work</h3>
                <ul>
                  <li>Follower-count decisions without context</li>
                  <li>One-off posts with no community follow-through</li>
                  <li>Reports based on screenshots, not market signal</li>
                </ul>
              </article>
              <div className="vs-divider">VS</div>
              <article className="glass-card compare-column positive reveal">
                <h3>Flexist India Growth</h3>
                <p>{service.difference}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container split-layout">
            <div className="reveal">
              <span className="section-label">Proof</span>
              <h2 className="section-title">Real Web3 operating experience.</h2>
              <p>{service.proof}</p>
              <a className="ghost-button" href="/experience">View Experience</a>
            </div>
            <div className="glass-card reveal">
              <h3>Related Services</h3>
              <ul className="value-list">
                {relatedServices.map((item, i) => <li key={i}><a href={`/services/${item.slug}`}>{item.title}</a></li>)}
                <li><a href="/resources/blog/how-to-enter-the-india-web3-market">Read: How to enter the India Web3 market</a></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container faq-layout">
            <div className="section-header reveal">
              <span className="section-label">FAQ</span>
              <h2 className="section-title">{service.keyword} questions founders ask.</h2>
            </div>
            <div className="accordion reveal">
              {service.faqs.map(([question, answer], index) => (
                <article key={index} className={`accordion-item ${index === 0 ? 'open' : ''}`}>
                  <button className="accordion-toggle" type="button" aria-expanded={index === 0 ? 'true' : 'false'}>{question}<span className="faq-icon"></span></button>
                  <div className="accordion-panel"><p>{answer}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta-block reveal">
              <span className="section-label">Next Step</span>
              <h2>Want {service.keyword.toLowerCase()} handled properly?</h2>
              <p>Send your project stage, current community, India target, budget range, and main bottleneck. Flexist will return with a clear recommendation.</p>
              <div className="button-row">
                <a className="neon-button" href={`/inquiry?service=${service.slug}`}>Open Founder Inquiry</a>
                <a className="ghost-button" href="https://t.me/FlexistCrypto">Message Telegram</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
