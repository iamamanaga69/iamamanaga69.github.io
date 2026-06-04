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

  document.addEventListener("DOMContentLoaded", () => {
    initPriceToggle();
    initSmoothScroll();
  });
})();
