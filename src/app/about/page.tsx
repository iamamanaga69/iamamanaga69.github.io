import Script from 'next/script';
import { buildMetadata } from '@/lib/seo';
import aboutData from '@/data/about.json';
import '@/styles/about.css';

export const metadata = buildMetadata({
  title: 'About Us | Flexist',
  description: 'Flexist helps Web3 projects enter India with community support, creator campaigns, ambassadors, partnerships, and clear growth plans.',
  canonical: 'https://flexist.in/about',
});

export default function AboutPage() {
  return (
    <>
      <main id="main-content">
        <section className="page-hero"><div className="container page-hero-content"><p className="page-kicker">About Flexist | India Growth Partner</p><h1 className="page-title">WEB3 PROJECTS<br/><span className="gradient-text">GROW IN INDIA.</span></h1><p className="page-lede">Flexist helps founders enter India with a clear plan, trusted community support, local creators, ambassadors, and useful partnerships.</p></div></section>

        <section className="section"><div className="container split-layout">
          <div className="manifesto-copy reveal">
            <span className="section-label">Origin Story</span>
            <h2 className="section-title">{aboutData.manifesto_title}</h2>
            {aboutData.manifesto_copy.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="terminal-box reveal">
            <div className="terminal-head"><span>Flexist Mission</span><span className="terminal-status">Clear</span></div>
            <p><span className="terminal-prompt">Mission</span> {aboutData.mission}</p>
            <p><span className="terminal-prompt">Vision</span> {aboutData.vision}</p>
            <p><span className="terminal-prompt">Values</span> {aboutData.values}</p>
          </div>
        </div></section>

        <section className="section section-dark"><div className="container"><div className="section-header reveal"><span className="section-label">Market Opportunity</span><h2 className="section-title">India is not one simple audience.</h2><p>Users discover projects through Telegram, X, YouTube, regional voices, friends, and trusted communities. Strong launches connect these places instead of spending on random attention.</p></div><div className="grid-4"><div className="glass-card mini-stat reveal"><strong>100M+</strong><span>Market Potential</span></div><div className="glass-card mini-stat reveal"><strong>24/7</strong><span>Community Rhythm</span></div><div className="glass-card mini-stat reveal"><strong>4</strong><span>Main Growth Channels</span></div><div className="glass-card mini-stat reveal"><strong>1</strong><span>India Growth Partner</span></div></div></div></section>

        <section className="section"><div className="container"><div className="section-header reveal"><span className="section-label">Positioning</span><h2 className="section-title">This is more than basic community work.</h2></div><div className="compare-grid">
          <article className="glass-card compare-card negative reveal"><h3>What We Are Not</h3><ul className="value-list"><li>Community manager for hire</li><li>Reactive chat moderator</li><li>Generic freelancer</li><li>Social media executive</li></ul></article>
          <article className="glass-card compare-card positive reveal"><h3>What We Are</h3><ul className="value-list"><li>India growth partner</li><li>Community builder</li><li>Creator campaign planner</li><li>Expansion support for Web3 founders</li></ul></article>
        </div></div></section>

        <section className="section section-dark"><div className="container"><div className="section-header reveal"><span className="section-label">Core Capabilities</span><h2 className="section-title">The work behind the growth.</h2></div><div className="accordion">
          <article className="accordion-item"><button className="accordion-toggle" type="button" aria-expanded="false">Community Building</button><div className="accordion-panel"><p>We build Telegram and Discord communities that reply fast, stay active, stay well-moderated, and turn members into real users.</p></div></article>
          <article className="accordion-item"><button className="accordion-toggle" type="button" aria-expanded="false">India Market Entry</button><div className="accordion-panel"><p>We turn your goals into a clear India launch plan — the right channels, the right creators, and simple growth targets you can actually hit.</p></div></article>
          <article className="accordion-item"><button className="accordion-toggle" type="button" aria-expanded="false">Creator Campaigns</button><div className="accordion-panel"><p>We pick creators by how much their audience trusts them, how they behave on each platform, and whether they fit your goal — not just follower count.</p></div></article>
          <article className="accordion-item"><button className="accordion-toggle" type="button" aria-expanded="false">Ambassador Programs</button><div className="accordion-panel"><p>We recruit and manage advocates with clear tasks, training, incentives, and regular progress updates.</p></div></article>
          <article className="accordion-item"><button className="accordion-toggle" type="button" aria-expanded="false">Partnership Development</button><div className="accordion-panel"><p>We build real relationships with other projects, communities, and partners that keep users coming in.</p></div></article>
        </div></div></section>

        <section className="section section-dark"><div className="container split-layout"><div className="reveal"><span className="section-label">Skill Set & Philosophy</span><h2 className="section-title">Skills shaped for fast-moving Web3 teams.</h2><p>We pair community building and local know-how with real commercial sense. We work remote-first, follow the data, and build for long-term trust — not short-term attention spikes.</p><div className="chip-row" style={{ marginTop: '20px' }}><span className="tag-chip">AI-Integrated Workflow</span><span className="tag-chip">Community Support</span><span className="tag-chip">Partnership Ops</span><span className="tag-chip">Local Hinglish Advocacy</span><span className="tag-chip">Cost Discipline</span></div></div><div className="language-row reveal"><div className="language-item"><span>English</span><div className="proficiency"><i className="level-96"></i></div><span>Fluent</span></div><div className="language-item"><span>Turkish</span><div className="proficiency"><i className="level-92"></i></div><span>Fluent</span></div><div className="language-item"><span>Vietnamese</span><div className="proficiency"><i className="level-64"></i></div><span>Written</span></div><div className="language-item"><span>Hinglish</span><div className="proficiency"><i className="level-100"></i></div><span>Native</span></div></div></div></section>

        <section className="section"><div className="container"><div className="section-header reveal"><span className="section-label">Founder Credentials</span><h2 className="section-title">Commercial foundation. Practical growth instincts.</h2></div><div className="grid-2"><article className="glass-card credential reveal" style={{ padding: '24px' }}><small>Bachelor of Commerce</small><h3>Xavier's University</h3><p>Business fundamentals, commercial thinking, and a structured approach to growth decisions.</p></article><article className="glass-card credential reveal" style={{ padding: '24px' }}><small>Cost & Management Accountancy - Pursuing</small><h3>ICMAI</h3><p>Management accounting discipline applied to running lean and measuring what actually works.</p></article></div></div></section>

        <section className="section section-dark"><div className="container"><div className="cta-block reveal"><span className="section-label">Start The India Plan</span><h2>India is too large for generic growth.</h2><p>Build a local plan around how users discover, evaluate, and join Web3 projects.</p><div className="button-row"><a className="neon-button" href="/inquiry">Book Strategy Call</a><a className="ghost-button" href="/flexistlabs">Open FlexistLabs</a></div></div></div></section>
      </main>

      <Script src="/scripts/about.js" strategy="afterInteractive" />
    </>
  );
}
