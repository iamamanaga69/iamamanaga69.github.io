const Flexist = (() => {
  const route = document.body.dataset.page || "home";
  const themeKey = "flexist-theme";

  const navItems = [
    ["home", "./", "Home"],
    ["about", "about", "About"],
    ["services", "services", "Services"],
    ["india-hub", "india-hub", "India Hub"],
    ["projects", "projects", "Projects"],
    ["insights", "blog", "Insights"],
    ["contact", "contact", "Contact"]
  ];

  const footerLinks = [
    ["About Flexist", "about"],
    ["Founder", "founder"],
    ["Experience", "experience"],
    ["India Growth Services", "services"],
    ["India Expansion Hub", "india-hub"],
    ["Founder Inquiry", "inquiry"]
  ];

  const socialItems = [
    ["Telegram", "https://t.me/FlexistCrypto", '<path d="M21 4 3 11.2l6.8 2.4L17 8.2l-5.4 6.8.2 5.1 3.1-3.5 4.2 3L21 4Z"/>'],
    ["X", "https://x.com/flexistcrypto", '<path d="m4 4 12.4 16H20L7.6 4H4Zm16 0-7.3 8.2M11.4 15.2 4 20"/>'],
    ["Linktree", "https://linktr.ee/FlexistWeb3", '<path d="M12 3v18M7 8l5-5 5 5M7 16l5 5 5-5M4 12h16"/>']
  ];

  function getPreferredTheme() {
    const preview = new URLSearchParams(window.location.search).get("theme");
    if (preview === "light" || preview === "dark") return preview;
    const saved = window.localStorage.getItem(themeKey);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme, persist = false) {
    document.documentElement.dataset.theme = theme;
    if (persist) window.localStorage.setItem(themeKey, theme);
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      const nextTheme = theme === "dark" ? "light" : "dark";
      toggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
      toggle.setAttribute("title", `Switch to ${nextTheme} mode`);
    }
    window.dispatchEvent(new CustomEvent("flexist:themechange", { detail: { theme } }));
  }

  function socialLink([label, href, icon], withText = false) {
    return `<a class="social-icon" href="${href}" target="_blank" rel="noreferrer" aria-label="${label}">
      <svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg>${withText ? `<span>${label}</span>` : ""}
    </a>`;
  }

  function renderShell() {
    const nav = document.querySelector("[data-site-nav]");
    const footer = document.querySelector("[data-site-footer]");
    const favicon = document.querySelector('link[rel="icon"]') || document.createElement("link");
    favicon.rel = "icon";
    favicon.type = "image/png";
    favicon.href = "assets/images/flexist-avatar-192.png";
    document.head.appendChild(favicon);

    if (nav) {
      nav.innerHTML = `
        <a class="skip-link" href="#main-content">Skip to content</a>
        <header class="site-nav">
          <div class="container nav-inner">
            <a class="brand" href="./" aria-label="Flexist Crypto home">
              <img class="brand-avatar" src="assets/images/flexist-avatar-192.png" alt="">
              <span class="gradient-text">FLEXIST CRYPTO</span>
            </a>
            <nav class="nav-links" id="site-menu" aria-label="Primary navigation">
              ${navItems.map(([key, href, label]) => `<a class="${route === key ? "active" : ""}" href="${href}">${label}</a>`).join("")}
              <a class="nav-mobile-cta" href="inquiry">Start Expansion</a>
            </nav>
            <div class="nav-actions">
              <div class="nav-socials" aria-label="Social links">
                ${socialItems.map((item) => socialLink(item)).join("")}
              </div>
              <button class="theme-toggle" data-theme-toggle type="button" aria-label="Switch theme" title="Switch theme">
                <svg class="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v3m0 14v3M4.9 4.9 7 7m10 10 2.1 2.1M2 12h3m14 0h3M4.9 19.1 7 17m10-10 2.1-2.1"/></svg>
                <svg class="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8 8 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"/></svg>
              </button>
              <a class="ghost-button" href="contact">Schedule Call</a>
              <a class="neon-button" href="inquiry">Start Expansion <span>&rarr;</span></a>
              <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="Toggle menu">
                <span></span><span></span><span></span>
              </button>
            </div>
          </div>
        </header>`;
    }

    if (footer) {
      footer.innerHTML = `
        <footer class="footer">
          <div class="container footer-grid">
            <div>
              <a class="brand" href="./"><img class="brand-avatar" src="assets/images/flexist-avatar-192.png" alt=""><span class="gradient-text">FLEXIST CRYPTO</span></a>
              <p class="footer-copy">India growth infrastructure for Web3 projects ready to turn attention into durable adoption.</p>
              <div class="social-links">
                ${socialItems.map((item) => socialLink(item, true)).join("")}
                <a class="social-icon" href="mailto:FlexistCrypto@gmail.com" aria-label="Email">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4V6Zm0 0 8 7 8-7"/></svg><span>Email</span>
                </a>
              </div>
            </div>
            <div>
              <h3 class="footer-title">Route Map</h3>
              <div class="footer-links">${footerLinks.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</div>
            </div>
            <div>
              <h3 class="footer-title">Start Growing In India</h3>
              <p class="footer-copy">Receive focused Web3 growth notes and India market signals.</p>
              <form class="subscribe-form" data-subscribe-form>
                <input type="email" aria-label="Email address" placeholder="founder@protocol.xyz" required>
                <button type="submit">Join</button>
              </form>
              <div class="form-note" data-subscribe-note></div>
            </div>
          </div>
          <div class="container footer-bottom">
            <span>&copy; ${new Date().getFullYear()} Flexist Crypto</span>
            <span>Built for Web3 founders // India node online</span>
          </div>
        </footer>`;
    }
  }

  function bindNav() {
    const header = document.querySelector(".site-nav");
    const menuButton = document.querySelector(".menu-toggle");
    const links = document.querySelector(".nav-links");
    if (!header || !menuButton || !links) return;

    const syncHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
    menuButton.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      links.classList.toggle("open", open);
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  function bindTheme() {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    applyTheme(document.documentElement.dataset.theme || getPreferredTheme());
    toggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
    });
  }

  function bindReveals() {
    const targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    targets.forEach((target) => observer.observe(target));
  }

  function bindAccordions() {
    document.querySelectorAll(".accordion-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const item = button.closest(".accordion-item");
        const open = item.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
      });
    });
  }

  function bindSubscribe() {
    const form = document.querySelector("[data-subscribe-form]");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();
      document.querySelector("[data-subscribe-note]").textContent = "Signal received. Welcome to the node.";
    });
  }

  function init() {
    applyTheme(getPreferredTheme());
    renderShell();
    bindTheme();
    bindNav();
    bindReveals();
    bindAccordions();
    bindSubscribe();
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", Flexist.init);
