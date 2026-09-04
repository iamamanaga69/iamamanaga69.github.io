import Script from 'next/script';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import '@/styles/contact.css';

export const metadata = buildMetadata({
  title: 'Contact Us | Flexist',
  description: 'Contact Flexist for India Web3 growth, community building, creator campaigns, partnerships, and founder inquiries.',
  canonical: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <main id="main-content">
        <section className="page-hero">
          <div className="container page-hero-content">
            <p className="page-kicker">Contact Flexist | India Growth Support</p>
            <h1 className="page-title">START THE<br /><span className="gradient-text">CONVERSATION.</span></h1>
            <p className="page-lede">Use this page if you want to discuss India growth, creator campaigns, partnerships, community support, or a founder strategy call.</p>
          </div>
        </section>

        <section className="section">
          <div className="container contact-grid">
            <section className="terminal-box contact-terminal reveal" aria-labelledby="contact-terminal-title">
              <div className="terminal-topbar">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
                <span className="terminal-path">Flexist contact page <span className="cursor">_</span></span>
              </div>

              <div className="contact-status-grid">
                <article title="Active — typically replies within 24 hours">
                  <span className="status-light" title="Active — typically replies within 24 hours"></span>
                  <strong>Available for focused founder inquiries</strong>
                  <small>Best fit: Web3 projects planning India growth.</small>
                </article>
                <article>
                  <span>IST Clock</span>
                  <strong data-ist-clock>--:--:--</strong>
                  <small>India Standard Time</small>
                </article>
                <article>
                  <span>Based In</span>
                  <strong>India</strong>
                  <small>Remote-first, global reach.</small>
                </article>
                <article>
                  <span>Response Time</span>
                  <strong>&lt; 24 Hours</strong>
                  <small>Mon &ndash; Sat, IST</small>
                </article>
              </div>

              <div className="contact-method-grid">
                <a className="glass-card contact-method" href={site.emailHref}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v12H4V6Zm0 0 8 7 8-7" /></svg>
                  <span>Email</span>
                  <strong>{site.email}</strong>
                  <small>Founder briefs, project context, partnership notes.</small>
                </a>
                <a className="glass-card contact-method" href={site.telegram} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4 3 11.2l6.8 2.4L17 8.2l-5.4 6.8.2 5.1 3.1-3.5 4.2 3L21 4Z" /></svg>
                  <span>Telegram</span>
                  <strong>{site.telegramHandle}</strong>
                  <small>Fastest route for Web3-native conversations.</small>
                </a>
                <a className="glass-card contact-method" href={site.x} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 4 12.4 16H20L7.6 4H4Zm16 0-7.3 8.2M11.4 15.2 4 20" /></svg>
                  <span>Twitter / X</span>
                  <strong>@flexistcrypto</strong>
                  <small>Updates and simple India growth notes.</small>
                </a>
                <a className="glass-card contact-method" href={site.linktree} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5M4 12h16" /></svg>
                  <span>Linktree</span>
                  <strong>FlexistWeb3</strong>
                  <small>All public links in one place.</small>
                </a>
                <a className="glass-card contact-method" href="/inquiry">
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14v16H5V4Zm4 5h6M9 13h6M9 17h4" /></svg>
                  <span>Founder Portal</span>
                  <strong>Open Inquiry Form</strong>
                  <small>Best route when you want a structured India plan.</small>
                </a>
              </div>
            </section>

            <aside className="glass-card direct-brief reveal">
              <span className="tag-chip signal">Direct Brief</span>
              <h2 id="contact-terminal-title">Send the right first message.</h2>
              <p>Share your project name, stage, India goal, timeline, and the main problem you want Flexist to solve.</p>
              <form data-contact-form action="https://api.web3forms.com/submit" method="POST">
                <input type="hidden" name="access_key" value="8188cc9d-3ea6-45ee-b6a4-bde1a146e6a0" />
                <input type="hidden" name="subject" value="New Flexist website message" />
                <input type="checkbox" name="botcheck" className="hidden-field" tabIndex={-1} autoComplete="off" />
                <div className="field">
                  <label htmlFor="contact-name">Your name</label>
                  <input id="contact-name" name="name" type="text" required placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Your email</label>
                  <input id="contact-email" name="email" type="email" required placeholder="founder@project.xyz" />
                </div>
                <div className="field">
                  <label>Topic</label>
                  <input type="hidden" id="contact-topic" name="topic" value="Founder strategy call" />
                  <div className="topic-chips" id="topicChips">
                    <button className="topic-chip active" type="button" data-value="Founder strategy call">Founder Strategy Call</button>
                    <button className="topic-chip" type="button" data-value="India expansion">India Expansion</button>
                    <button className="topic-chip" type="button" data-value="Partnership opportunity">Partnership</button>
                    <button className="topic-chip" type="button" data-value="Creator campaign">Creator Campaign</button>
                    <button className="topic-chip" type="button" data-value="Media request">Media</button>
                  </div>
                </div>
                <div className="field message-field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" name="message" rows={6} required placeholder="Project name, stage, India target, timeline, and what you need Flexist to solve."></textarea>
                  <div className="char-counter" id="charCounter">0 / 500</div>
                </div>
                <button className="neon-button" type="submit">Send Message</button>
                <p className="form-note" data-contact-note></p>
              </form>
            </aside>
          </div>
        </section>

        <section className="section section-dark">
          <div className="container">
            <div className="cta-block reveal">
              <span className="section-label">Founder Fast Track</span>
              <h2>Need a structured growth conversation?</h2>
              <p>The founder inquiry portal gives us enough context to make the first call useful.</p>
              <div className="button-row">
                <a className="neon-button" href="/inquiry">Open Founder Inquiry Portal</a>
                <a className="ghost-button" href="/services">View Services &rarr;</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Script src="/scripts/contact.js" strategy="afterInteractive" />
    </>
  );
}
