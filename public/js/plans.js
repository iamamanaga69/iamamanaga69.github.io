/* ===================================================================
   FLEXIST — Plans Page JavaScript
   Price toggle, active state management, smooth scroll
   =================================================================== */
(() => {
  "use strict";

  function initPriceToggle() {
    const buttons = document.querySelectorAll("[data-price-mode]");
    const prices = document.querySelectorAll("[data-one][data-monthly]");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.priceMode;

        /* Update active state on toggle buttons */
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        /* Swap displayed prices */
        prices.forEach((el) => {
          if (mode === "one") {
            el.textContent = el.dataset.one || el.dataset.monthly;
          } else {
            el.textContent = el.dataset.monthly;
          }
        });

        /* Show/hide one-time CTA buttons */
        document.querySelectorAll("[data-cta-onetime]").forEach((a) => {
          a.style.display = mode === "one" ? "" : "none";
        });
      });
    });

    /* Set initial state */
    const defaultBtn = document.querySelector('[data-price-mode="one"]');
    if (defaultBtn) defaultBtn.classList.add("active");
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  // Sticky plan navigation features
  function initPlanStickyNav() {
    const pills = document.querySelectorAll("[data-plan-pill]");
    const stickyNav = document.getElementById("plan-sticky-nav");
    if (!pills.length || !stickyNav) return;

    // Smooth scroll on pill click
    pills.forEach(pill => {
      pill.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = pill.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          const siteNav = document.querySelector(".site-nav");
          const siteNavHeight = siteNav ? siteNav.offsetHeight : 76;
          const navHeight = siteNavHeight + stickyNav.offsetHeight + 16;
          const y = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });

    // Smooth scroll on hero quick-nav click
    document.querySelectorAll(".quick-nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);
        if (target) {
          const siteNav = document.querySelector(".site-nav");
          const siteNavHeight = siteNav ? siteNav.offsetHeight : 76;
          const navHeight = siteNavHeight + stickyNav.offsetHeight + 16;
          const y = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });

    // IntersectionObserver for active pill tracking
    const sections = [];
    pills.forEach(pill => {
      const targetId = pill.getAttribute("href").slice(1);
      const el = document.getElementById(targetId);
      if (el) sections.push({ el, pill });
    });

    if (sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            pills.forEach(p => p.classList.remove("active"));
            const match = sections.find(s => s.el === entry.target);
            if (match) match.pill.classList.add("active");
          }
        });
      }, {
        rootMargin: "-120px 0px -50% 0px",
        threshold: 0
      });

      sections.forEach(s => observer.observe(s.el));
    }

    // Add shadow on scroll
    const checkScroll = () => stickyNav.classList.toggle("scrolled", window.scrollY > 200);
    checkScroll();
    window.addEventListener("scroll", checkScroll, { passive: true });
  }


  document.addEventListener("DOMContentLoaded", () => {
    initPriceToggle();
    initSmoothScroll();

    initPlanStickyNav();
  });
})();
