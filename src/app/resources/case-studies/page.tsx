import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Web3 Growth Case Studies India | Flexist',
  description: 'Flexist case-study hub for Web3 community growth, India market entry, KOL campaigns, ambassador programs, and crypto marketing results.',
  canonical: 'https://flexist.in/resources/case-studies',
  robots: 'noindex, follow'
});

export default function Page() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container page-hero-content">
          <p className="page-kicker">Case Studies</p>
          <h1 className="page-title">Web3 Growth Proof<br/><span className="gradient-text">from Real Projects</span></h1>
          <p className="page-lede">Founder-safe results from real projects — Maestro Bots, UXUY Wallet, Unielon Wallet, Fabwelt, and RRG Ventures. See the full track record on the experience page, or ask about work in your category.</p>
          <div className="button-row"><a className="neon-button" href="/experience">View Experience</a><a className="ghost-button" href="/inquiry">Discuss Your Project</a></div>
        </div>
      </section>
    </main>
  );
}
