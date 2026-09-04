import Script from 'next/script';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import '@/styles/flexistlabs.css';

export const metadata = buildMetadata({
  title: 'FlexistLabs — India Market Entry Assessment for Web3 Projects',
  description: "Use FlexistLabs to assess your Web3 project's readiness for the Indian crypto market across community, messaging, budget, and strategy dimensions.",
  canonical: 'https://flexist.in/flexistlabs',
});

const flexistLabsSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flexist.in/' },
    { '@type': 'ListItem', position: 2, name: 'FlexistLabs', item: 'https://flexist.in/flexistlabs' }
  ]
};

export default function FlexistLabsPage() {
  return (
    <>
      <JsonLd schema={flexistLabsSchema} />
      <main id="main-content">

        {/* HERO */}
        <section className="page-hero">
          <div className="container">
            <div className="page-hero-content">
              <p className="page-kicker">// flexistlabs</p>
              <h1 className="page-title"><span className="gradient-text">Flexist Labs</span></h1>
              <p className="page-lede">Experimental growth tools and frameworks for Web3 projects entering India. Test your readiness, study the playbook, and build your India engine — before you spend a single dollar on campaigns.</p>
              <div className="button-row" style={{ marginTop: '28px' }}>
                <a className="neon-button" href="#assessment">Take the Assessment →</a>
                <a className="ghost-button" href="#framework">View Growth Framework</a>
              </div>
            </div>
          </div>
        </section>

        {/* INDIA READINESS ASSESSMENT */}
        <section className="section section-dark" id="assessment">
          <div className="container">
            <div className="section-header centered reveal">
              <span className="section-label">Interactive Assessment</span>
              <h2 className="section-title">India Readiness<br/><span className="gradient-text">Score Card</span></h2>
              <p className="section-copy" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Answer five questions about your current India operations. We'll score your readiness out of 50 and tell you exactly where you stand — and what to do next.</p>
            </div>

            <div className="assessment-wrapper reveal">
              <form id="assessment-form" className="assessment-form glass-card">
                <input type="hidden" name="access_key" value="8188cc9d-3ea6-45ee-b6a4-bde1a146e6a0"/>
                <input type="hidden" name="subject" value="FlexistLabs — India Readiness Assessment"/>
                <input type="hidden" name="from_name" value="FlexistLabs Assessment"/>

                {/* Q1 */}
                <div className="assessment-question" data-question="1">
                  <div className="question-header">
                    <span className="question-number">01</span>
                    <h3>Do you have an active Indian community?</h3>
                  </div>
                  <p className="question-context">An active community means regular engagement in Telegram, Discord, or Twitter from Indian users — not just member count.</p>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="q1" value="0" required/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>No</strong>
                        <small>No dedicated India community exists</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q1" value="5"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Small</strong>
                        <small>Some Indian users, but no focused activity</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q1" value="10"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Active</strong>
                        <small>Dedicated India group with regular engagement</small>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Q2 */}
                <div className="assessment-question" data-question="2">
                  <div className="question-header">
                    <span className="question-number">02</span>
                    <h3>Have you run India-specific KOL campaigns?</h3>
                  </div>
                  <p className="question-context">Campaigns with Indian crypto creators — YouTube, Twitter threads, Instagram reels, or Telegram callouts targeted at Indian audiences.</p>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="q2" value="0" required/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Never</strong>
                        <small>No India-specific creator campaigns</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q2" value="5"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Once</strong>
                        <small>Tried one-off campaigns, limited results</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q2" value="10"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Regularly</strong>
                        <small>Recurring KOL partnerships in India</small>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Q3 */}
                <div className="assessment-question" data-question="3">
                  <div className="question-header">
                    <span className="question-number">03</span>
                    <h3>Do you have Indian ambassadors?</h3>
                  </div>
                  <p className="question-context">Brand ambassadors or community leads based in India who represent your project locally, run events, and create vernacular content.</p>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="q3" value="0" required/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>No</strong>
                        <small>No ambassador presence in India</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q3" value="5"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Planning</strong>
                        <small>Considering an ambassador program</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q3" value="10"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Active Program</strong>
                        <small>Structured ambassador team operating</small>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Q4 */}
                <div className="assessment-question" data-question="4">
                  <div className="question-header">
                    <span className="question-number">04</span>
                    <h3>Is your content available in Hindi / Hinglish?</h3>
                  </div>
                  <p className="question-context">Localized content goes beyond translation. Hinglish (Hindi + English) is how India's crypto audience actually communicates. Memes, threads, and videos in this format perform 3-5× better.</p>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="q4" value="0" required/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>No</strong>
                        <small>English-only content</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q4" value="5"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Some</strong>
                        <small>Occasional Hindi posts or translations</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q4" value="10"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Fully Localized</strong>
                        <small>Dedicated Hindi/Hinglish content pipeline</small>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Q5 */}
                <div className="assessment-question" data-question="5">
                  <div className="question-header">
                    <span className="question-number">05</span>
                    <h3>Do you have India-specific growth metrics?</h3>
                  </div>
                  <p className="question-context">Tracking India separately — geo-tagged signups, India Telegram growth rate, regional conversion funnels, Hindi content engagement — vs. lumping India into "global."</p>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="q5" value="0" required/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>No</strong>
                        <small>No India-specific tracking</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q5" value="5"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Basic</strong>
                        <small>Some geo data, no dedicated dashboards</small>
                      </span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="q5" value="10"/>
                      <span className="radio-mark"></span>
                      <span className="radio-label">
                        <strong>Detailed</strong>
                        <small>Full India growth dashboard and KPIs</small>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Email (optional) */}
                <div className="assessment-question assessment-email">
                  <div className="question-header">
                    <span className="question-number">✉</span>
                    <h3>Get your results emailed (optional)</h3>
                  </div>
                  <div className="field">
                    <label htmlFor="assess-email">Email Address</label>
                    <input type="email" id="assess-email" name="email" placeholder="founder@project.xyz"/>
                  </div>
                  <div className="field">
                    <label htmlFor="assess-project">Project Name</label>
                    <input type="text" id="assess-project" name="project_name" placeholder="Your project name"/>
                  </div>
                </div>

                <input type="hidden" id="score-hidden" name="readiness_score" value=""/>
                <input type="hidden" id="tier-hidden" name="readiness_tier" value=""/>

                <button type="submit" className="neon-button assessment-submit">
                  Calculate My India Readiness →
                </button>
              </form>

              {/* Results Panel */}
              <div id="assessment-result" className="assessment-result glass-card" hidden>
                <div className="result-header">
                  <span className="section-label">Assessment Complete</span>
                  <h2 className="result-title">Your Score</h2>
                </div>
                <div className="score-display">
                  <div className="score-ring">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" className="score-track"></circle>
                      <circle cx="60" cy="60" r="52" className="score-fill" id="score-arc"></circle>
                    </svg>
                    <div className="score-number">
                      <span id="score-value">0</span>
                      <small>/50</small>
                    </div>
                  </div>
                  <div className="score-meta">
                    <span className="tag-chip signal" id="score-tier">—</span>
                    <p id="score-message">Calculating...</p>
                  </div>
                </div>
                <div className="result-breakdown terminal-box" id="result-breakdown">
                  <div className="terminal-head">
                    <span>breakdown.log</span>
                    <span className="terminal-status">● complete</span>
                  </div>
                  <div id="breakdown-content"></div>
                </div>
                <div className="button-row" style={{ marginTop: '28px' }}>
                  <a className="neon-button" href="/plans">See Growth Plans →</a>
                  <button className="ghost-button" id="retake-btn">Retake Assessment</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GROWTH FRAMEWORK */}
        <section className="section" id="framework">
          <div className="container">
            <div className="section-header centered reveal">
              <span className="section-label">Strategic Framework</span>
              <h2 className="section-title">The India Growth<br/><span className="gradient-text">Playbook</span></h2>
              <p className="section-copy" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Every India expansion that works follows the same three phases. Skip one and the whole thing falls apart. Here's the order we run them in.</p>
            </div>

            <div className="framework-timeline reveal">
              {/* Phase 1 */}
              <div className="framework-phase glass-card hoverable">
                <div className="phase-header">
                  <span className="phase-number">01</span>
                  <span className="tag-chip">Phase 1</span>
                </div>
                <h3>Foundation</h3>
                <p>Before any outreach, you need a clear read on the Indian crypto market and where your project fits in it. This phase is research and setup — the groundwork everything else stands on.</p>
                <ul className="phase-deliverables">
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>Market Audit</strong>
                      <small>We map your competitors, size the audience, and check where you fit — regulation, exchange presence, and how to position in your vertical.</small>
                    </div>
                  </li>
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>Community Setup</strong>
                      <small>We set up your India Telegram group, moderation rules, welcome flows, and message templates in Hindi/Hinglish.</small>
                    </div>
                  </li>
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>Initial KOL Outreach</strong>
                      <small>We shortlist 20-40 relevant Indian creators across YouTube, Twitter, and Instagram, and start building relationships before you pay for anything.</small>
                    </div>
                  </li>
                </ul>
                <div className="phase-duration">
                  <span className="tag-chip signal">2–4 Weeks</span>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="framework-phase glass-card hoverable">
                <div className="phase-header">
                  <span className="phase-number">02</span>
                  <span className="tag-chip">Phase 2</span>
                </div>
                <h3>Traction</h3>
                <p>With the foundation in place, Phase 2 launches your first real India programs. This is where scattered interest turns into steady, measurable growth.</p>
                <ul className="phase-deliverables">
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>Ambassador Programs</strong>
                      <small>We recruit, onboard, and manage 10-25 Indian ambassadors, with clear tasks, rewards, and performance tracking.</small>
                    </div>
                  </li>
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>Content Calendar</strong>
                      <small>Weekly content schedule spanning Twitter threads, Telegram updates, YouTube collaborations, and community AMAs — all localized for Indian audiences.</small>
                    </div>
                  </li>
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>Partnership Pipeline</strong>
                      <small>Collaborations with Indian projects, exchanges, DAOs, and communities — joint campaigns that bring in real, active users.</small>
                    </div>
                  </li>
                </ul>
                <div className="phase-duration">
                  <span className="tag-chip signal">4–8 Weeks</span>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="framework-phase glass-card hoverable">
                <div className="phase-header">
                  <span className="phase-number">03</span>
                  <span className="tag-chip">Phase 3</span>
                </div>
                <h3>Scale</h3>
                <p>The last phase hands the India work from Flexist over to your own team. The goal is simple: your India operation keeps running without us.</p>
                <ul className="phase-deliverables">
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>Full KOL Campaigns</strong>
                      <small>Large paid campaigns with top Indian creators — coordinated video drops, Twitter raids, Telegram AMAs, and community events.</small>
                    </div>
                  </li>
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>India Ownership Transfer</strong>
                      <small>Hand off community management, content creation, and ambassador coordination to your internal India team with full SOPs and playbooks.</small>
                    </div>
                  </li>
                  <li>
                    <span className="deliverable-icon">◆</span>
                    <div>
                      <strong>Weekly Founder Calls</strong>
                      <small>Regular check-ins with your founding team to review India KPIs, adjust spend, and plan the next quarter.</small>
                    </div>
                  </li>
                </ul>
                <div className="phase-duration">
                  <span className="tag-chip signal">8–12 Weeks</span>
                </div>
              </div>
            </div>

            {/* Phase connector line (visual) */}
            <div className="framework-connector reveal">
              <div className="connector-line"></div>
              <div className="connector-labels">
                <span>Research</span>
                <span>Activate</span>
                <span>Own</span>
              </div>
            </div>
          </div>
        </section>

        {/* TOOLS & RESOURCES */}
        <section className="section section-dark" id="tools">
          <div className="container">
            <div className="section-header centered reveal">
              <span className="section-label">Tools & Resources</span>
              <h2 className="section-title">Growth<br/><span className="gradient-text">Toolkit</span></h2>
              <p className="section-copy" style={{ marginLeft: 'auto', marginRight: 'auto' }}>Frameworks, templates, and data snapshots built from real India campaigns. Each one is free on request — active clients get them first. Message us and we'll send the ones that fit your stage.</p>
            </div>

            <div className="grid-3 reveal">
              {/* Tool 1 */}
              <article className="glass-card hoverable tool-card">
                <div className="tool-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <span className="tag-chip tool-status">Free · On Request</span>
                <h3>India Market Brief</h3>
                <p>A one-page read on India's crypto market: active user estimates, top exchanges, regulatory status, what content actually lands, and who you're up against. Updated quarterly from Flexist's on-ground work.</p>
                <ul className="tool-includes">
                  <li>Market size & user demographics</li>
                  <li>Exchange penetration breakdown</li>
                  <li>Content format performance data</li>
                  <li>Regulatory environment summary</li>
                </ul>
              </article>

              {/* Tool 2 */}
              <article className="glass-card hoverable tool-card">
                <div className="tool-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <span className="tag-chip tool-status">Free · On Request</span>
                <h3>KOL Directory Preview</h3>
                <p>A curated sample of Flexist's India creator network — categorized by vertical (DeFi, gaming, NFT, Layer 1/2), audience size, engagement rate, and content format. This is the same network used across Flexist's active campaigns.</p>
                <ul className="tool-includes">
                  <li>Creator profiles by vertical</li>
                  <li>Engagement rate benchmarks</li>
                  <li>Content format specializations</li>
                  <li>Historical campaign performance</li>
                </ul>
              </article>

              {/* Tool 3 */}
              <article className="glass-card hoverable tool-card">
                <div className="tool-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                </div>
                <span className="tag-chip tool-status">Free · On Request</span>
                <h3>Community Health Template</h3>
                <p>The exact metrics framework Flexist uses to track weekly community health for India-focused channels. Covers Telegram activity ratios, Discord engagement, Twitter growth velocity, and ambassador performance scoring.</p>
                <ul className="tool-includes">
                  <li>Weekly health score formula</li>
                  <li>Engagement-to-member ratios</li>
                  <li>Ambassador performance KPIs</li>
                  <li>Growth velocity benchmarks</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section">
          <div className="container reveal">
            <div className="cta-block">
              <h2>Ready to start<br/><span className="gradient-text">building in India?</span></h2>
              <p>FlexistLabs gives you the clarity. Flexist's growth plans give you the execution. Pick the plan that matches your stage and budget — and start building real India traction this week.</p>
              <div className="button-row">
                <a className="neon-button" href="/plans">View Growth Plans →</a>
                <a className="ghost-button" href="/contact">Talk to Aman</a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Script src="/scripts/flexistlabs.js" strategy="afterInteractive" />
    </>
  );
}
