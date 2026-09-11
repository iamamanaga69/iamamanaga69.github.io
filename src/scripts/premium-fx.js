/* ============================================================================
   Flexist Premium FX — Cursor-follow spotlight, text shimmer, grain, smooth scroll
   Layers on top of fx.js + animations.css. Gracefully degrades on low-end.
   ========================================================================= */

const PremiumFX = (() => {
  'use strict';

  const shouldSkip = () =>
    window.isLowEnd === true || window.prefersReducedMotion === true;

  const isTouch = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  const $$ = (sel, root = document) => {
    try { return Array.from(root.querySelectorAll(sel)); }
    catch (_) { return []; }
  };

  const _cleanups = [];
  const onCleanup = (fn) => _cleanups.push(fn);

  /* -----------------------------------------------------------------------
     1. SPOTLIGHT CARDS
     A radial glow that follows the cursor within each .glass-card.hoverable
     ----------------------------------------------------------------------- */

  function initSpotlight() {
    try {
      if (shouldSkip() || isTouch()) return;

      const cards = $$('.glass-card.hoverable, .signal-map, .hero-brand-art, .founder-contact-card');
      if (!cards.length) return;

      cards.forEach((card) => {
        card.style.setProperty('--spot-x', '50%');
        card.style.setProperty('--spot-y', '50%');
        card.style.setProperty('--spot-opacity', '0');
        card.classList.add('has-spotlight');

        const handleMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty('--spot-x', `${x}%`);
          card.style.setProperty('--spot-y', `${y}%`);
          card.style.setProperty('--spot-opacity', '1');
        };

        const handleLeave = () => {
          card.style.setProperty('--spot-opacity', '0');
        };

        card.addEventListener('mousemove', handleMove, { passive: true });
        card.addEventListener('mouseleave', handleLeave, { passive: true });

        onCleanup(() => {
          card.removeEventListener('mousemove', handleMove);
          card.removeEventListener('mouseleave', handleLeave);
        });
      });
    } catch (_) { /* silent */ }
  }

  /* -----------------------------------------------------------------------
     2. SECTION TITLE SHIMMER
     A slow gradient sweep across h2.section-title and .page-title elements
     triggered when they enter the viewport.
     ----------------------------------------------------------------------- */

  function initTitleShimmer() {
    try {
      const titles = $$('.section-title, .page-title, .hero-title');
      if (!titles.length) return;

      titles.forEach((el) => {
        el.classList.add('has-shimmer');
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('shimmer-active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      titles.forEach((t) => observer.observe(t));
      onCleanup(() => observer.disconnect());
    } catch (_) { /* silent */ }
  }

  /* -----------------------------------------------------------------------
     3. GRAIN OVERLAY
     A subtle SVG noise texture layered over the whole page for depth.
     CSS-only, no JS cost beyond injection.
     ----------------------------------------------------------------------- */

  function initGrain() {
    try {
      if (shouldSkip()) return;

      // Don't double-inject
      if (document.querySelector('.grain-overlay')) return;

      const grain = document.createElement('div');
      grain.className = 'grain-overlay';
      grain.setAttribute('aria-hidden', 'true');
      document.body.appendChild(grain);

      onCleanup(() => grain.remove());
    } catch (_) { /* silent */ }
  }

  /* -----------------------------------------------------------------------
     4. ENHANCED STAT COUNTERS
     Adds a subtle scale-up bounce when counters finish animating.
     The actual counting is handled by counters.js — this just adds polish.
     ----------------------------------------------------------------------- */

  function initCounterPulse() {
    try {
      const counters = $$('.stat-counter');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;

          // Wait for the counter animation to finish (~1.8s), then pulse
          setTimeout(() => {
            el.classList.add('counter-pulsed');
          }, 1800);

          observer.unobserve(el);
        });
      }, { threshold: 0.3 });

      counters.forEach((c) => observer.observe(c));
      onCleanup(() => observer.disconnect());
    } catch (_) { /* silent */ }
  }

  /* -----------------------------------------------------------------------
     5. SMOOTH ANCHOR SCROLL
     Override anchor clicks with a smooth lerp scroll for premium feel.
     ----------------------------------------------------------------------- */

  function initSmoothAnchors() {
    try {
      const handleClick = (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        const id = link.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();

        const start = window.scrollY;
        const end = target.getBoundingClientRect().top + start - 100;
        const distance = end - start;
        const duration = 800;
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = clamp(elapsed / duration, 0, 1);
          // easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          window.scrollTo(0, start + distance * eased);
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      };

      document.addEventListener('click', handleClick);
      onCleanup(() => document.removeEventListener('click', handleClick));
    } catch (_) { /* silent */ }
  }

  /* -----------------------------------------------------------------------
     6. SCROLL-DRIVEN SECTION REVEALS
     Parallax-lite: sections gently translate up as they enter view.
     Uses CSS transforms + IntersectionObserver (no per-frame scroll handler).
     ----------------------------------------------------------------------- */

  function initSectionReveals() {
    try {
      const sections = $$('.signal-section, .section-dark, #services, #difference');
      if (!sections.length) return;

      sections.forEach((section) => {
        section.classList.add('premium-reveal');
      });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('premium-reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      sections.forEach((s) => observer.observe(s));
      onCleanup(() => observer.disconnect());
    } catch (_) { /* silent */ }
  }

  /* -----------------------------------------------------------------------
     7. MARQUEE HOVER PAUSE
     Pause the logo marquee on hover for readability.
     ----------------------------------------------------------------------- */

  function initMarqueePause() {
    try {
      const marquees = $$('.logo-marquee');
      if (!marquees.length) return;

      marquees.forEach((m) => {
        m.addEventListener('mouseenter', () => m.classList.add('marquee-paused'));
        m.addEventListener('mouseleave', () => m.classList.remove('marquee-paused'));
      });
    } catch (_) { /* silent */ }
  }

  /* -----------------------------------------------------------------------
     Public
     ----------------------------------------------------------------------- */

  function init() {
    try {
      initSpotlight();
      initTitleShimmer();
      initGrain();
      initCounterPulse();
      initSmoothAnchors();
      initSectionReveals();
      initMarqueePause();
    } catch (_) { /* silent */ }
  }

  function destroy() {
    _cleanups.forEach((fn) => {
      try { fn(); } catch (_) { /* silent */ }
    });
    _cleanups.length = 0;
  }

  return { init, destroy };
})();

document.addEventListener('DOMContentLoaded', PremiumFX.init);
