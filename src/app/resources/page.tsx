import type { Metadata } from 'next';
import blogArticles from '@/data/blogArticles.json';
import { buildMetadata } from '@/lib/seo';

const clusters = [...new Set(blogArticles.map((article) => article.cluster))];

export const metadata: Metadata = buildMetadata({
  title: 'Web3 Growth Resources India | Flexist',
  description: 'Guides, blog articles, and case-study resources on Web3 marketing, Telegram community growth, KOL campaigns, and India market entry.',
  canonical: 'https://flexist.in/resources'
});

export default function Page() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container page-hero-content">
          <p className="page-kicker">Resources</p>
          <h1 className="page-title">Web3 Growth Resources<br/><span className="gradient-text">for India Expansion</span></h1>
          <p className="page-lede">Founder-friendly guides on Telegram marketing, India Web3 market entry, KOL campaigns, ambassador programs, and community-led growth.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-3">
          {clusters.map((cluster, i) => (
            <article key={i} className="glass-card reveal">
              <span className="section-label">{cluster}</span>
              <h2>{cluster}</h2>
              <p>Read practical notes and playbooks for this topic cluster.</p>
              <a className="ghost-button" href="/resources/blog">Open Blog</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
