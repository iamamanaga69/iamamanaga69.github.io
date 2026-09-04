'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

const PLAN_PATHS = ['/plans', '/plans/india-entry', '/plans/india-growth', '/plans/india-partner'];

export function SiteNav() {
  const pathname = usePathname() || '/';
  const is = (p: string) => (pathname === p ? 'active' : '');
  const plansActive = PLAN_PATHS.includes(pathname) ? 'active' : '';

  return (
    <div data-site-nav>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-nav">
        <div className="container nav-inner">
          <Link className="brand brand-premium" href="/" aria-label="Flexist home">
            <span className="brand-mark">
              <img className="brand-avatar" src="/assets/images/flexist-avatar-192.png" alt="Flexist Logo" />
              <i></i>
            </span>
            <span className="brand-copy">
              <span className="wordmark gradient-text">Flexist</span>
              <small>Web3 India Labs</small>
            </span>
          </Link>
          <nav className="nav-links" id="site-menu" aria-label="Primary navigation">
            <Link className={is('/')} href="/">Home</Link>
            <Link className={is('/flexistlabs')} href="/flexistlabs">FlexistLabs</Link>
            <Link className={is('/services')} href="/services">Services</Link>
            <Link className={is('/resources')} href="/resources">Resources</Link>

            <div className={`nav-group ${plansActive}`}>
              <Link className={`nav-group-label ${plansActive}`} href="/plans">Plans</Link>
              <div className="nav-panel" aria-label="Plans links">
                <Link className={is('/plans')} href="/plans"><strong>Compare Plans</strong><small>Bundled India growth packages</small></Link>
                <Link className={is('/plans/india-entry')} href="/plans/india-entry"><strong>India Entry</strong><small>Pre-launch essentials</small></Link>
                <Link className={is('/plans/india-growth')} href="/plans/india-growth"><strong>India Growth</strong><small>Full community and campaigns</small></Link>
                <Link className={is('/plans/india-partner')} href="/plans/india-partner"><strong>India Partner</strong><small>Total India ownership</small></Link>
              </div>
            </div>

            <Link className={is('/experience')} href="/experience">Experience</Link>
            <Link className={is('/about')} href="/about">About</Link>
            <Link className={is('/contact')} href="/contact">Contact</Link>
            <Link className="nav-mobile-cta" href="/inquiry">Start Expansion</Link>
          </nav>
          <div className="nav-actions">
            <div className="nav-socials" aria-label="Social links">
              <a className="social-icon" href={site.telegram} target="_blank" rel="noreferrer" aria-label="Telegram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3 11.2l6.8 2.4L17 8.2l-5.4 6.8.2 5.1 3.1-3.5 4.2 3L21 4Z"></path></svg>
              </a>
              <a className="social-icon" href={site.x} target="_blank" rel="noreferrer" aria-label="X">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 12.4 16H20L7.6 4H4Zm16 0-7.3 8.2M11.4 15.2 4 20"></path></svg>
              </a>
              <a className="social-icon" href={site.linktree} target="_blank" rel="noreferrer" aria-label="Linktree">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5M4 12h16"></path></svg>
              </a>
            </div>
            <button className="theme-toggle" data-theme-toggle type="button" aria-label="Switch theme" title="Switch theme">
              <svg className="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"></circle><path d="M12 2v3m0 14v3M4.9 4.9 7 7m10 10 2.1 2.1M2 12h3m14 0h3M4.9 19.1 7 17m10-10 2.1-2.1"></path></svg>
              <svg className="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8 8 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"></path></svg>
            </button>
            <Link className="ghost-button" href="/inquiry">Book Call</Link>
            <Link className="neon-button" href="/inquiry">Start Expansion <span>&rarr;</span></Link>
            <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
