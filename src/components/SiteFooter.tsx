import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  return (
    <div data-site-footer>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <Link className="brand brand-premium" href="/"><span className="brand-mark"><img className="brand-avatar" src="/assets/images/flexist-avatar-192.png" alt="Flexist Logo" loading="lazy" /><i></i></span><span className="brand-copy"><span className="wordmark gradient-text">Flexist</span><small>Web3 India Labs</small></span></Link>
            <p className="footer-copy">{site.footerCopy}</p>
            <div className="social-links">
              <a className="social-icon" href={site.telegram} target="_blank" rel="noreferrer" aria-label="Telegram">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4 3 11.2l6.8 2.4L17 8.2l-5.4 6.8.2 5.1 3.1-3.5 4.2 3L21 4Z"></path></svg><span>Telegram</span>
              </a>
              <a className="social-icon" href={site.x} target="_blank" rel="noreferrer" aria-label="X">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 4 12.4 16H20L7.6 4H4Zm16 0-7.3 8.2M11.4 15.2 4 20"></path></svg><span>X</span>
              </a>
              <a className="social-icon" href={site.linktree} target="_blank" rel="noreferrer" aria-label="Linktree">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5M4 12h16"></path></svg><span>Linktree</span>
              </a>
              <a className="social-icon" href={site.emailHref} aria-label="Email">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4V6Zm0 0 8 7 8-7"></path></svg><span>Email</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="footer-title">Route Map</h3>
            <div className="footer-map">
              <div className="footer-group">
                <strong>Founder Journey</strong>
                <Link href="/flexistlabs">FlexistLabs</Link>
                <Link href="/services">Growth Services</Link>
                <Link href="/plans">Plans &amp; Pricing</Link>
                <Link href="/resources">Resources</Link>
                <Link href="/inquiry">Founder Inquiry</Link>
              </div>
              <div className="footer-group">
                <strong>Platform</strong>
                <Link href="/about">About Flexist</Link>
                <Link href="/experience">Experience</Link>
                <Link href="/contact">Contact</Link>
              </div>
            </div>
          </div>
          <div>
            <h3 className="footer-title">Start Growing In India</h3>
            <p className="footer-copy">Receive focused Web3 growth notes and India market signals.</p>
            <form className="subscribe-form" data-subscribe-form>
              <input type="email" aria-label="Email address" placeholder="founder@project.xyz" required />
              <button type="submit">Join</button>
            </form>
            <div className="form-note" data-subscribe-note></div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>&copy; {new Date().getFullYear()} Flexist</span>
          <span>Built for Web3 founders growing in India</span>
        </div>
      </footer>
    </div>
  );
}
