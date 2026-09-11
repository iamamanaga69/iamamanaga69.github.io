// Automatically detect and set performance mode for low-end hardware or prefers-reduced-motion
(() => {
  const memory = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const isLowMemory = memory !== undefined && memory <= 4;
  const isLowCPU = cores !== undefined && cores < 4;
  
  if (isLowMemory || isLowCPU || prefersReducedMotion) {
    document.documentElement.classList.add("performance-mode");
    window.isLowEnd = true;
  } else {
    window.isLowEnd = false;
  }
  window.prefersReducedMotion = prefersReducedMotion;
})();

const Flexist = (() => {
  const themeKey = "flexist-theme";

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
    const show = (el) => el.classList.add("visible");
    // No IntersectionObserver support: reveal everything up front.
    if (!("IntersectionObserver" in window)) {
      targets.forEach(show);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    targets.forEach((target) => {
      // Failsafe: elements already in (or straddling) the viewport on load —
      // including any taller than the viewport that never reach the 14%
      // threshold — are revealed immediately instead of staying hidden.
      const rect = target.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) show(target);
      else observer.observe(target);
    });
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
      document.querySelector("[data-subscribe-note]").textContent = "Thanks. You are on the update list.";
    });
  }

  function init() {
    applyTheme(getPreferredTheme());
    bindTheme();
    bindNav();
    bindReveals();
    bindAccordions();
    bindSubscribe();
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", Flexist.init);
