import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Web3 Growth Guides India | Flexist',
  description: 'Founder guides for Web3 marketing, India market entry, Telegram community growth, KOL campaigns, and ambassador programs.',
  canonical: 'https://flexist.in/resources/guides',
  robots: 'noindex, follow'
});

export default function Page() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container page-hero-content">
          <p className="page-kicker">Guides</p>
          <h1 className="page-title">Web3 Growth Guides<br/><span className="gradient-text">for India</span></h1>
          <p className="page-lede">Founder-first playbooks pulled straight from live India campaigns — Telegram community building, KOL sourcing, and market entry. Start with the blog for tactical breakdowns, or ask us for the exact playbook your project needs.</p>
          <div className="button-row"><a className="neon-button" href="/resources/blog">Read Blog</a><a className="ghost-button" href="/inquiry">Ask Flexist</a></div>
        </div>
      </section>
    </main>
  );
}
