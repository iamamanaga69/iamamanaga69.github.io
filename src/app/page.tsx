import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Flexist — Web3 Growth & Community for India',
  description: 'India-focused Web3 marketing and community growth: Telegram communities, KOL campaigns, ambassador programs, and India market entry.',
};

// Phase 1 shell verification placeholder. Real home is ported in Phase 3.
export default function HomePage() {
  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container page-hero-content">
          <p className="page-kicker">Phase 1 · Shell</p>
          <h1 className="page-title gradient-text">Flexist</h1>
          <p className="page-lede">Next.js shell is live. Nav, footer, theme toggle, fonts, and the design system are ported. Pages land in the next phases.</p>
        </div>
      </section>
    </main>
  );
}
