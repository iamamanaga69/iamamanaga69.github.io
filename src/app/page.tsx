import Script from 'next/script';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import homepageData from '@/data/homepage.json';
import { INDIA_OUTLINE } from '@/data/indiaOutline.js';
import '@/styles/home.css';

export const metadata = buildMetadata({
  title: 'Web3 Marketing Agency India | Flexist — India Growth Partner',
  description: 'Flexist is India\'s Web3 marketing agency. We help crypto projects enter India through Telegram community growth, KOL campaigns, ambassador programs, and partnership development.',
  canonical: 'https://flexist.in/',
});

const homeSchema = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Flexist',
    url: 'https://flexist.in',
    logo: 'https://flexist.in/assets/images/flexist-avatar-192.png',
    description: "India's Web3 marketing and community growth agency",
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'FlexistCrypto@gmail.com',
      contactType: 'sales',
    },
    sameAs: [
      'https://x.com/flexistcrypto',
      'https://t.me/FlexistCrypto',
      'https://linktr.ee/FlexistWeb3',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Flexist',
    url: 'https://flexist.in',
    description: "India's Web3 marketing agency for crypto community growth, KOL campaigns, ambassador programs, and market entry.",
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this only community management?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Community is where trust starts, but Flexist also helps with creators, ambassadors, partnerships, support, and user retention.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can early-stage projects work with Flexist?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Flexist works best when a project has a clear product thesis and wants a serious India plan before spending on disconnected campaigns.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best first step?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Open the founder inquiry form or use FlexistLabs to share your category, stage, budget, community, and India growth target.',
        },
      },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd schema={homeSchema} />
      <main id="main-content">
        <section className="home-hero">
          <canvas id="network-canvas" aria-hidden="true"></canvas>
          <div className="container hero-grid hero-grid-premium">
            <div className="hero-content">
              <span className="section-label hero-live">India&apos;s Web3 Growth Partner</span>
              <h1 className="hero-title gradient-text" dangerouslySetInnerHTML={{ __html: homepageData.hero_title }} />
              <p className="hero-tagline">{homepageData.hero_tagline}</p>
              <p className="hero-copy">{homepageData.hero_copy}</p>
              <ul className="hero-proof-list" aria-label="What Flexist delivers">
                <li>An honest read on whether India is worth it for your project</li>
                <li>Communities where real people reply — not bots or airdrop farmers</li>
                <li>One team across creators, ambassadors, and partnerships</li>
              </ul>
              <div className="button-row">
                <a className="neon-button" href="/inquiry">Start India Expansion <span>&rarr;</span></a>
                <a className="ghost-button" href="/flexistlabs#assessment">Open FlexistLabs</a>
              </div>
              <p className="hero-trustline"><span aria-hidden="true">◷</span> Reply within 24 hours &nbsp;·&nbsp; No retainer to start &nbsp;·&nbsp; Founder to founder</p>
            </div>
            <aside className="hero-command-card glass-card reveal" aria-label="Flexist India growth desk">
              <figure className="hero-brand-art">
                <img src="/assets/images/flexist-hero-operator.png" alt="Flexist Web3 marketing agency India growth identity" loading="eager" fetchPriority="high" />
                <figcaption>India growth desk — live</figcaption>
              </figure>
              <div className="hero-float-badge" aria-hidden="true">
                <strong>10,000+</strong>
                <span>Real members grown</span>
              </div>
            </aside>
          </div>
          <div className="scroll-cue">Explore the growth system</div>
        </section>

        <div className="logo-marquee proof-marquee" aria-label="Projects and ecosystems operated">
          <div className="logo-track">
            {homepageData.marquee_projects.map((proj, i) => <span key={`a${i}`}>{proj}</span>)}
            {homepageData.marquee_projects.map((proj, i) => <span key={`b${i}`}>{proj}</span>)}
            {homepageData.marquee_projects.map((proj, i) => <span key={`c${i}`}>{proj}</span>)}
          </div>
        </div>

        <section className="metric-strip" aria-label="Flexist track record">
          <div className="container metric-grid">
            <div className="stat-counter"><strong data-counter="years">5.5+</strong><span>Years In Crypto</span></div>
            <div className="stat-counter"><strong data-counter="projects">5+</strong><span>Projects Operated</span></div>
            <div className="stat-counter"><strong data-counter="members">10,000+</strong><span>Real Members Grown</span></div>
            <div className="stat-counter"><strong data-counter="languages">4</strong><span>Languages Used</span></div>
          </div>
        </section>

        <section className="section signal-section" id="india">
          <div className="container signal-layout" data-signal-map>
            <div className="signal-copy reveal">
              <span className="section-label">The India Opportunity</span>
              <h2 className="section-title">Your next <span className="gradient-text">100,000 users</span> are already in India.</h2>
              <p>India is not one audience. It&apos;s trading desks in Delhi, builders in Bengaluru, exchanges in Mumbai, and fast-moving retail groups from Kolkata to Chennai. Reaching them means the right channel in the right city — not one message blasted to everyone.</p>
              <p className="signal-hint">Hover a city to read its growth signal — or watch the map find them for you.</p>
              <div className="signal-cities" data-signal-cities aria-label="Explore India growth signals by city">
                <button className="signal-chip" type="button" data-city="delhi">Delhi NCR</button>
                <button className="signal-chip" type="button" data-city="up">Uttar Pradesh</button>
                <button className="signal-chip" type="button" data-city="ahmedabad">Ahmedabad</button>
                <button className="signal-chip" type="button" data-city="mumbai">Mumbai</button>
                <button className="signal-chip" type="button" data-city="kolkata">Kolkata</button>
                <button className="signal-chip" type="button" data-city="hyderabad">Hyderabad</button>
                <button className="signal-chip" type="button" data-city="bengaluru">Bengaluru</button>
                <button className="signal-chip" type="button" data-city="chennai">Chennai</button>
              </div>
              <a className="neon-button" href="/services/india-market-entry-services">See the India play <span>&rarr;</span></a>
            </div>
            <div className="signal-map reveal">
              <div className="signal-map-head"><span>India Growth Signal</span><span className="terminal-status">Live</span></div>
              <div className="signal-canvas-wrap">
                <canvas data-signal-canvas aria-hidden="true"></canvas>
                <svg className="signal-outline-src" viewBox="0 0 1024 1024" width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
                  <path id="india-outline" d={INDIA_OUTLINE.d}></path>
                </svg>
              </div>
              <div className="signal-readout" data-signal-readout>
                <strong data-readout-name>Delhi NCR</strong>
                <span data-readout-audience>Founder, trading and policy circles</span>
                <div className="signal-channels" data-readout-channels></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-dark" id="services">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-label">Main Growth Services</span>
              <h2 className="section-title">Built for the full India expansion cycle.</h2>
              <p className="section-copy">Flexist was built inside live Web3 communities, not from a marketing course. Start with one service, or run them together as your full India plan.</p>
            </div>
            <div className="grid-3">
              <article className="glass-card hoverable service-card reveal">
                <div className="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /><path d="M16 8a6 6 0 0 1 5 6" /></svg></div>
                <h3>Community Management</h3>
                <p>Telegram and Discord communities run by people who reply, handle support, and keep members around.</p>
                <a href="/services/telegram-community-management">Learn More &rarr;</a>
              </article>
              <article className="glass-card hoverable service-card reveal">
                <div className="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /><path d="M12 2a8 8 0 0 1 7.5 5.3M12 2a8 8 0 0 0-7.5 5.3" /></svg></div>
                <h3>India Market Expansion</h3>
                <p>A complete India entry plan shaped around how Indian crypto users discover and trust projects.</p>
                <a href="/services/india-market-entry-services">Learn More &rarr;</a>
              </article>
              <article className="glass-card hoverable service-card reveal">
                <div className="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M23 9c.7 1 1 2.2 1 3.5s-.3 2.5-1 3.5" /><path d="M19.1 10.1c.4.6.6 1.2.6 1.9s-.2 1.3-.6 1.9" /><path d="M15.5 11.2c.2.2.3.5.3.8s-.1.6-.3.8" /></svg></div>
                <h3>Influencer &amp; KOL Campaigns</h3>
                <p>Indian crypto YouTubers, X voices, educators, and regional creators aligned to campaign intent.</p>
                <a href="/services/kol-influencer-marketing-india">Learn More &rarr;</a>
              </article>
              <article className="glass-card hoverable service-card reveal">
                <div className="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><polygon points="12 2 13.5 5 16.5 5.5 14.3 7.7 14.8 10.7 12 9.3 9.2 10.7 9.7 7.7 7.5 5.5 10.5 5" /></svg></div>
                <h3>Ambassador Programs</h3>
                <p>Recruitment, training, rewards, tasks, and reporting for local ambassadors.</p>
                <a href="/services/ambassador-program-management">Learn More &rarr;</a>
              </article>
              <article className="glass-card hoverable service-card reveal">
                <div className="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M8 3H3v5M16 21h5v-5M8 21H3v-5" /><circle cx="8" cy="12" r="4" /><circle cx="16" cy="12" r="4" /></svg></div>
                <h3>Partnership Operations</h3>
                <p>Cross-project collabs, ecosystem intros, and campaign partners that move deals forward.</p>
                <a href="/services/india-market-entry-services">Learn More &rarr;</a>
              </article>
              <article className="glass-card hoverable service-card reveal">
                <div className="icon-box"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><path d="m22 2-7.5 7.5" /></svg></div>
                <h3>Growth Consulting</h3>
                <p>Positioning, launch timing, and a straight assessment of your community — with a roadmap you can act on.</p>
                <a href="/services/web3-marketing-agency-india">Learn More &rarr;</a>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="framework">
          <div className="container">
            <div className="section-header centered reveal">
              <span className="section-label">Growth Framework</span>
              <h2 className="section-title">Four steps from first call to steady growth.</h2>
            </div>
            <div className="growth-flow growth-flow-four">
              <article className="glass-card flow-step reveal">
                <span className="flow-index">01</span>
                <h3>Founder Brief</h3>
                <p>We map your category, stage, user target, budget, and India bottleneck.</p>
              </article>
              <article className="glass-card flow-step reveal">
                <span className="flow-index">02</span>
                <h3>Market Workshop</h3>
                <p>We decide which channels to run first, and in what order, based on your launch and budget.</p>
              </article>
              <article className="glass-card flow-step reveal">
                <span className="flow-index">03</span>
                <h3>Execution Sprint</h3>
                <p>Campaigns and communities go live, and we report what&apos;s actually working — not vanity numbers.</p>
              </article>
              <article className="glass-card flow-step reveal">
                <span className="flow-index">04</span>
                <h3>Retention Loop</h3>
                <p>We keep the users you win and turn the active ones into people who bring others in.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-dark" id="difference">
          <div className="container">
            <div className="section-header centered reveal">
              <span className="section-label">The Flexist Difference</span>
              <h2 className="section-title">Not a marketing vendor. Your <span className="gradient-text">India growth team</span>.</h2>
            </div>
            <div className="advantage-grid">
              <article className="glass-card hoverable advantage-card reveal">
                <span className="watermark-text">01</span>
                <span>Operators, not observers</span>
                <h3>We&apos;ve run the rooms we talk about.</h3>
                <p>Five-plus years inside live Web3 projects — moderating, supporting, and growing real members. You get people who have done the work, not a pitch deck.</p>
              </article>
              <article className="glass-card hoverable advantage-card reveal">
                <span className="watermark-text">02</span>
                <span>Built for India</span>
                <h3>City by city, not one blast to everyone.</h3>
                <p>Delhi trades differently than Bengaluru builds. We match the channel, language, and creator to each pocket of India&apos;s crypto audience.</p>
              </article>
              <article className="glass-card hoverable advantage-card reveal">
                <span className="watermark-text">03</span>
                <span>One accountable team</span>
                <h3>Every growth lever, run from one desk.</h3>
                <p>No stitching five vendors into one story. Community, KOLs, ambassadors, and partnerships move together — and we report what is actually working.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="why-flexist">
          <div className="container">
            <div className="section-header centered reveal">
              <span className="section-label">Why Founders Switch</span>
              <h2 className="section-title">The difference you feel by <span className="gradient-text">week two</span>.</h2>
            </div>
            <div className="comparison-grid reveal">
              <div className="glass-card compare-column negative">
                <h3>A generic agency</h3>
                <ul>
                  <li>One message blasted to &quot;India&quot; like it is a single audience</li>
                  <li>Follower spikes that quietly leave once the campaign ends</li>
                  <li>Five vendors, five dashboards, no one owning the result</li>
                  <li>KOLs picked by follower count, not by who your users trust</li>
                  <li>Reports full of impressions, light on real members</li>
                </ul>
              </div>
              <span className="vs-divider">VS</span>
              <div className="glass-card compare-column positive">
                <h3>Flexist</h3>
                <ul>
                  <li>The right city, channel, and language for each part of India</li>
                  <li>Communities built to keep the users you actually win</li>
                  <li>One accountable team across every growth lever</li>
                  <li>Creators matched to campaign intent and real audience trust</li>
                  <li>Straight reporting on members, activity, and retention</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-dark" id="experience">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-label">Project Experience</span>
              <h2 className="section-title">Built inside live Web3 projects.</h2>
              <p className="section-copy">Real communities, real users, real momentum — across five years of hands-on Web3 work.</p>
            </div>
            <div className="timeline-rail" role="list">
              <article className="glass-card milestone" role="listitem"><small>2020 &ndash; 2021</small><h3>Fabwelt</h3><p>Moderated Telegram and Discord while helping users and working with the wider team.</p></article>
              <article className="glass-card milestone" role="listitem"><small>2021 &ndash; 2022</small><h3>RRG Ventures</h3><p>Handled community allocations, sourced campaign marketers, and managed collaboration flow.</p></article>
              <article className="glass-card milestone" role="listitem"><small>Mar 2022 &ndash; Nov 2023</small><h3>Unielon Wallet</h3><p>Grew Telegram discussion by 500+ active members and managed the social content rhythm.</p></article>
              <article className="glass-card milestone" role="listitem"><small>Jul 2023 &ndash; Dec 2024</small><h3>UXUY Wallet</h3><p>Promoted the project on X while supporting users across Telegram and Discord.</p></article>
              <article className="glass-card milestone" role="listitem"><small>Jul 2024 &ndash; Present</small><h3>Maestro Bots</h3><p>Supported India-focused ambassador work and translated product momentum into local trust.</p></article>
            </div>
            <div className="button-row"><a className="ghost-button" href="/experience">View Full Experience &rarr;</a></div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="container faq-layout">
            <div className="section-header reveal">
              <span className="section-label">Founder FAQ</span>
              <h2 className="section-title">Common questions before entering India.</h2>
              <p className="section-copy">Still deciding? These are the questions founders ask on the first call.</p>
            </div>
            <div className="accordion reveal">
              <article className="accordion-item open">
                <button className="accordion-toggle" type="button" aria-expanded="true">Is this only community management? <span className="faq-icon"></span></button>
                <div className="accordion-panel"><p>No. Community is where trust starts, but Flexist also helps with creators, ambassadors, partnerships, support, and user retention.</p></div>
              </article>
              <article className="accordion-item">
                <button className="accordion-toggle" type="button" aria-expanded="false">Can early-stage projects work with Flexist? <span className="faq-icon"></span></button>
                <div className="accordion-panel"><p>Yes, if the project has a clear product thesis and wants a serious India plan before spending budget on disconnected campaigns.</p></div>
              </article>
              <article className="accordion-item">
                <button className="accordion-toggle" type="button" aria-expanded="false">What is the best first step? <span className="faq-icon"></span></button>
                <div className="accordion-panel"><p>Open the founder inquiry form or use FlexistLabs to share your category, stage, budget, and biggest India priority.</p></div>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="cta-block founder-contact reveal">
              <div>
                <span className="section-label">Founder Entry Point</span>
                <h2>Ready to build your India user base?</h2>
                <p>Every week without an India plan is a week of users going to someone else. Tell us your project, your target, and where you&apos;re stuck — we&apos;ll come back with a plan you can actually run.</p>
                <div className="button-row">
                  <a className="neon-button" href="/inquiry">Open Founder Inquiry <span>&rarr;</span></a>
                  <a className="ghost-button" href="/contact">Contact Flexist</a>
                </div>
              </div>
              <div className="founder-contact-card">
                <img src="/assets/images/flexist-avatar-192.png" alt="Flexist avatar" loading="lazy" />
                <strong>Flexist</strong>
                <span>Private Web3 growth desk</span>
                <a href="mailto:FlexistCrypto@gmail.com">FlexistCrypto@gmail.com</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Script src="/scripts/network-graph.js" strategy="afterInteractive" />
      <Script src="/scripts/counters.js" strategy="afterInteractive" />
      <Script src="/scripts/india-map.js" strategy="afterInteractive" />
      <Script src="/scripts/home.js" strategy="afterInteractive" />
    </>
  );
}
