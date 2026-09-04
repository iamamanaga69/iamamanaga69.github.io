import Script from 'next/script';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import '@/styles/inquiry.css';

export const metadata = buildMetadata({
  title: 'Founder Inquiry | Flexist',
  description: "Tell Flexist about your Web3 project and get a clear first step for India growth.",
  canonical: '/inquiry',
});

export default function InquiryPage() {
  return (
    <>
      <main id="main-content">
        <div className="sticky-progress-bar" id="stickyProgressBar">
          <div className="progress-bar-container">
            <div className="progress-bar-text">
              <span className="progress-step-num" id="stickyProgressStep">Step 1 of 7</span>
              <span className="progress-step-divider">&mdash;</span>
              <span className="progress-step-name" id="stickyProgressName">Project Details</span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" id="stickyProgressFill"></div>
            </div>
          </div>
        </div>

        <section className="page-hero"><div className="container page-hero-content"><p className="page-kicker">Founder Inquiry | Start The India Plan</p><h1 className="page-title">TELL US ABOUT<br /><span className="gradient-text">YOUR PROJECT.</span></h1><p className="page-lede">Answer a few quick questions. We&apos;ll get your project stage, India goal, current community, budget, and where you need help first.</p></div></section>

        <section className="section"><div className="container inquiry-layout">
          <div className="terminal-box inquiry-terminal" id="inquiryTerminal">
            <div className="terminal-topbar">
              <span className="terminal-dot red"></span><span className="terminal-dot yellow"></span><span className="terminal-dot green"></span>
              <span className="terminal-path">Founder inquiry form <span className="cursor">_</span></span>
            </div>
            <div className="inquiry-progress" data-inquiry-progress>
              <div className="progress-track"><div className="progress-fill" id="progressFill"></div></div>
              <span className="progress-label" id="progressLabel">Step 1 / 7</span>
            </div>
            <div className="form-est-time" id="formEstTime">🕒 Takes about 3 minutes</div>

            <form className="inquiry-steps" id="inquirySteps" data-inquiry-engine>
              <section className="inquiry-step active" data-step="1">
                <div className="step-label">Step 1 - Project Details</div>
                <h2 className="step-heading">Tell us about the project.</h2>
                <div className="field-grid">
                  <div className="field"><label htmlFor="projectName">Project name</label><input id="projectName" name="projectName" required placeholder="Project name" /></div>
                  <div className="field"><label htmlFor="projectUrl">Website URL</label><input id="projectUrl" name="projectUrl" type="url" placeholder="https://project.xyz" /></div>
                  <div className="field"><label htmlFor="projectChain">Blockchain</label><select id="projectChain" name="chain"><option value="">Select blockchain</option><option value="ethereum">Ethereum</option><option value="solana">Solana</option><option value="bnb">BNB Chain</option><option value="base">Base</option><option value="polygon">Polygon</option><option value="other">Other</option></select></div>
                  <div className="field"><label htmlFor="projectCategory">Category</label><select id="projectCategory" name="category"><option value="">Project category</option><option value="defi">DeFi</option><option value="gamefi">GameFi</option><option value="nft">NFT</option><option value="infra">Infrastructure</option><option value="wallet">Wallet</option><option value="exchange">Exchange / DEX</option><option value="other">Other</option></select></div>
                </div>
              </section>

              <section className="inquiry-step" data-step="2">
                <div className="step-label">Step 2 - Stage And Funding</div>
                <h2 className="step-heading">What stage is the project at?</h2>
                <div className="option-grid">
                  <button className="option-card" type="button" data-field="stage" data-value="bootstrapped">Bootstrapped</button>
                  <button className="option-card" type="button" data-field="stage" data-value="preseed">Pre-seed</button>
                  <button className="option-card" type="button" data-field="stage" data-value="seed">Seed</button>
                  <button className="option-card" type="button" data-field="stage" data-value="seriesa">Series A</button>
                  <button className="option-card" type="button" data-field="stage" data-value="public">Token launched</button>
                  <button className="option-card" type="button" data-field="stage" data-value="scaling">Scaling ecosystem</button>
                </div>
                <div className="field spaced"><label htmlFor="launchStatus">Launch status</label><select id="launchStatus" name="launchStatus"><option value="">Launch status</option><option value="prelaunched">Not yet launched</option><option value="soft">Soft launch</option><option value="live">Live product</option></select></div>
              </section>

              <section className="inquiry-step" data-step="3">
                <div className="step-label">Step 3 - Current Community</div>
                <h2 className="step-heading">Where is your community today?</h2>
                <div className="field-grid">
                  <div className="field"><label htmlFor="telegramSize">Telegram members</label><select id="telegramSize"><option value="0">No Telegram</option><option value="1">Under 500</option><option value="2">500 - 5K</option><option value="3">5K - 50K</option><option value="4">50K+</option></select></div>
                  <div className="field"><label htmlFor="discordSize">Discord members</label><select id="discordSize"><option value="0">No Discord</option><option value="1">Under 1K</option><option value="2">1K - 10K</option><option value="3">10K+</option></select></div>
                  <div className="field"><label htmlFor="twitterSize">Twitter / X followers</label><select id="twitterSize"><option value="0">No presence</option><option value="1">Under 1K</option><option value="2">1K - 10K</option><option value="3">10K - 100K</option><option value="4">100K+</option></select></div>
                  <div className="field"><label htmlFor="totalUsers">Users / holders</label><select id="totalUsers"><option value="0">Under 1,000</option><option value="1">1K - 10K</option><option value="2">10K - 100K</option><option value="3">100K+</option></select></div>
                </div>
              </section>

              <section className="inquiry-step" data-step="4">
                <div className="step-label">Step 4 - India Goals</div>
                <h2 className="step-heading">What does success in India look like?</h2>
                <div className="field"><label htmlFor="indiaTarget">Target Indian users in 6 months</label><input id="indiaTarget" type="number" min="0" placeholder="100000" /></div>
                <div className="checkbox-group"><p className="field-label">Priority platforms</p><label><input type="checkbox" value="telegram" className="india-platform" /> 💬 Telegram</label><label><input type="checkbox" value="youtube" className="india-platform" /> 📺 YouTube</label><label><input type="checkbox" value="twitter" className="india-platform" /> 𝕏 Twitter / X</label><label><input type="checkbox" value="discord" className="india-platform" /> 👾 Discord</label></div>
              </section>

              <section className="inquiry-step" data-step="5">
                <div className="step-label">Step 5 - Budget And Timeline</div>
                <h2 className="step-heading">What resources are available?</h2>
                <div className="option-grid two-col">
                  <button className="option-card" type="button" data-field="budget" data-value="sub1k">Under $1K/mo</button>
                  <button className="option-card" type="button" data-field="budget" data-value="1to5k">$1K - $5K/mo</button>
                  <button className="option-card" type="button" data-field="budget" data-value="5to20k">$5K - $20K/mo</button>
                  <button className="option-card" type="button" data-field="budget" data-value="20kplus">$20K+/mo</button>
                </div>
                <div className="field spaced"><label htmlFor="launchUrgency">India launch timing</label><select id="launchUrgency"><option value="">India launch timing</option><option value="1month">Within 1 month</option><option value="3months">1 - 3 months</option><option value="6months">3 - 6 months</option><option value="flexible">Flexible</option></select></div>
              </section>

              <section className="inquiry-step" data-step="6">
                <div className="step-label">Step 6 - Support Needed</div>
                <h2 className="step-heading">What help do you need from Flexist?</h2>
                <div className="checkbox-grid">
                  <label><input type="checkbox" value="community" className="service-select" /> 🏗️ Community Building</label>
                  <label><input type="checkbox" value="expansion" className="service-select" /> 🇮🇳 India Expansion</label>
                  <label><input type="checkbox" value="kol" className="service-select" /> 📢 KOL Campaigns</label>
                  <label><input type="checkbox" value="ambassador" className="service-select" /> 🤝 Ambassador Program</label>
                  <label><input type="checkbox" value="partnerships" className="service-select" /> 💼 Partnerships</label>
                  <label><input type="checkbox" value="consulting" className="service-select" /> 📈 Growth Consulting</label>
                </div>
              </section>

              <section className="inquiry-step" data-step="7">
                <div className="step-label">Step 7 - Founder Contact</div>
                <h2 className="step-heading">Where should Flexist reply?</h2>
                <div className="field-grid"><div className="field"><label htmlFor="founderName">Founder name</label><input id="founderName" required placeholder="Your name" /></div><div className="field"><label htmlFor="founderEmail">Email</label><input id="founderEmail" type="email" required placeholder="founder@project.xyz" /></div><div className="field"><label htmlFor="founderTelegram">Telegram</label><input id="founderTelegram" placeholder="@username" /></div></div>
                <div className="field"><label htmlFor="founderContext">Context</label><textarea id="founderContext" rows={5} placeholder="Share traction, launch goals, blockers, and the exact India outcome you want."></textarea></div>
              </section>

              <div className="step-nav"><button className="ghost-button" type="button" data-back>Back</button><button className="neon-button" type="button" data-next>Continue</button></div>
              <p className="form-note" data-inquiry-note></p>
            </form>

            <section className="inquiry-ticket" id="inquiryTicket" hidden>
              <div className="ticket-header"><span className="tag-chip signal">Inquiry Ticket</span><strong id="ticketId">FC-0000</strong></div>
              <div className="ticket-score">
                <div className="score-gauge">
                  <i id="scoreGaugeFill" style={{ display: 'none' }}></i>
                  <svg className="circular-gauge" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent-blue)" />
                        <stop offset="100%" stopColor="var(--accent-green)" />
                      </linearGradient>
                    </defs>
                    <circle className="gauge-bg" cx="50" cy="50" r="40" />
                    <circle className="gauge-fill" cx="50" cy="50" r="40" id="gaugeCircleFill" />
                  </svg>
                  <span id="scoreNumber">0/100</span>
                </div>
              </div>
              <div className="ticket-grid">
                <div><span>Project</span><strong id="ticketProject">-</strong></div>
                <div><span>Chain</span><strong id="ticketChain">-</strong></div>
                <div><span>Stage</span><strong id="ticketStage">-</strong></div>
                <div><span>India Target</span><strong id="ticketTarget">-</strong></div>
                <div><span>Budget</span><strong id="ticketBudget">-</strong></div>
                <div><span>Services</span><strong id="ticketServices">-</strong></div>
              </div>
              <div className="recommendation-grid ticket-insights">
                <article className="glass-card recommendation"><h4>Strengths</h4><ul id="strengthsList"></ul></article>
                <article className="glass-card recommendation"><h4>Gaps</h4><ul id="gapsList"></ul></article>
                <article className="glass-card recommendation"><h4>Next Actions</h4><ul id="actionsList"></ul></article>
              </div>
              <div className="button-row" id="ticketButtonRow" style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', marginTop: '24px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
                  <a className="neon-button" id="ticketDiscussTelegram" href="#" target="_blank" style={{ flex: 1, minWidth: '200px', textAlign: 'center' }}>Discuss with Flexist (Auto Group)</a>
                  <a className="ghost-button" id="ticketDirectTelegram" href={site.telegram} target="_blank" style={{ flex: 1, minWidth: '200px', textAlign: 'center', borderColor: 'rgba(255,255,255,0.1)' }}>Direct Founder Chat (t.me/FlexistCrypto)</a>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
                  <a className="ghost-button" id="ticketEmail" href={site.emailHref} style={{ flex: 1, minWidth: '200px', textAlign: 'center' }}>Send Details By Email</a>
                  <a className="ghost-button" href="/contact" style={{ flex: 1, minWidth: '200px', textAlign: 'center' }}>Open Contact Page</a>
                </div>
              </div>
            </section>
          </div>

          <aside className="inquiry-aside"><article className="glass-card"><span className="tag-chip signal">Result</span><h3>India Score</h3><p>Based on your community, budget, timing, and the kind of support you need.</p></article><article className="glass-card"><span className="tag-chip">Summary</span><h3>Founder Context</h3><p>Creates a simple summary of your project and the next steps we&apos;d recommend.</p></article><article className="glass-card"><span className="tag-chip">Next</span><h3>Founder Conversation</h3><p>The email button sends your details straight into a direct founder chat.</p></article></aside>
        </div></section>
      </main>
      <Script src="/scripts/inquiry.js" strategy="afterInteractive" />
    </>
  );
}
