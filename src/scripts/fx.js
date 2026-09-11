/* ============================================================================
   FlexistFX — Premium Animation Engine
   Flexist Web3 Agency · Dark-Theme Interactive Layer
   ============================================================================
   Self-contained animation system that layers on top of the CSS animation
   framework and global.js reveal system. Every effect gracefully degrades
   on low-end hardware and respects prefers-reduced-motion.

   GPU-accelerated properties only (transform, opacity).
   All scroll / pointer listeners are passive where possible.
   ========================================================================= */

const FlexistFX = (() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  /** True when the device has a coarse primary pointer (touch). */
  const isTouchDevice = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  /** Whether heavy effects should be skipped. */
  const shouldSkipHeavy = () =>
    window.isLowEnd === true || window.prefersReducedMotion === true;

  /** Linear interpolation. */
  const lerp = (a, b, t) => a + (b - a) * t;

  /** Clamp value between min and max. */
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  /** EaseOutExpo curve used by the counter animation. */
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

  /** Safely query elements — always returns an array. */
  const $$ = (sel, root = document) => {
    try {
      return Array.from(root.querySelectorAll(sel));
    } catch (_) {
      return [];
    }
  };

  // Stores for cleanup
  const _cleanups = [];

  /**
   * Register a cleanup callback so we can tear everything down later if
   * needed (SPA navigation, etc.).
   */
  const onCleanup = (fn) => _cleanups.push(fn);

  // ---------------------------------------------------------------------------
  // 1. Enhanced Stagger Reveals
  // ---------------------------------------------------------------------------

  function initStaggerReveals() {
    try {
      const containers = $$('.reveal-stagger');
      containers.forEach((container) => {
        const children = $$('.reveal', container);
        children.forEach((child, i) => {
          child.style.setProperty('--stagger-i', i);
        });
      });
    } catch (_) { /* silent */ }
  }

  // ---------------------------------------------------------------------------
  // 2. Scroll Progress Bar
  // ---------------------------------------------------------------------------

  function initScrollProgress() {
    try {
      // Create the progress bar element
      const bar = document.createElement('div');
      bar.className = 'scroll-progress';
      // Inline critical styles so the bar works even if the CSS class is
      // missing from the stylesheet.
      Object.assign(bar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '3px',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
        background:
          'linear-gradient(90deg, var(--accent-cyan, #00e5ff), var(--accent-blue, #2979ff))',
        zIndex: '9999',
        pointerEvents: 'none',
        willChange: 'transform',
      });

      document.body.prepend(bar);

      let ticking = false;

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const scrollTop =
            window.scrollY || document.documentElement.scrollTop;
          const docHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          const progress = docHeight > 0 ? clamp(scrollTop / docHeight, 0, 1) : 0;
          bar.style.transform = `scaleX(${progress})`;
          ticking = false;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      // Initial call
      onScroll();

      onCleanup(() => {
        window.removeEventListener('scroll', onScroll);
        bar.remove();
      });
    } catch (_) { /* silent */ }
  }

  // ---------------------------------------------------------------------------
  // 4. Parallax Elements
  // ---------------------------------------------------------------------------

  function initParallax() {
    try {
      if (shouldSkipHeavy()) return;

      const els = $$('[data-parallax]');
      if (!els.length) return;

      let ticking = false;

      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          els.forEach((el) => {
            const speed = parseFloat(el.dataset.parallax) || 0.05;
            const rect = el.getBoundingClientRect();
            // Offset from centre of viewport
            const offset =
              rect.top + rect.height / 2 - window.innerHeight / 2;
            const ty = offset * speed * -1;
            el.style.transform = `translateY(${ty}px)`;
          });
          ticking = false;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      onCleanup(() => window.removeEventListener('scroll', onScroll));
    } catch (_) { /* silent */ }
  }

  // ---------------------------------------------------------------------------
  // 7. Text Split Animation for Hero Titles
  // ---------------------------------------------------------------------------

  function initHeroTextReveal() {
    try {
      const titles = $$('.hero-title');
      if (!titles.length) return;

      // Base delay between each letter (ms)
      const LETTER_STAGGER = 30;

      titles.forEach((title) => {
        // Avoid re-processing
        if (title.dataset.fxSplit === 'true') return;

        // Skip gradient (background-clip:text) titles. Splitting them into
        // per-letter spans breaks the clip mask in WebKit/Blink: the glyphs
        // end up in transformed, overflow-hidden child spans that inherit the
        // parent's transparent text-fill, so the clipped gradient has nothing
        // to paint and the whole heading renders invisible. These titles keep
        // their native markup (including <br>) and come alive via the CSS
        // gradient-pan animation instead.
        if (title.classList.contains('gradient-text')) return;

        title.dataset.fxSplit = 'true';

        const text = title.textContent.trim();
        if (!text) return;

        // Preserve original text for a11y via aria-label
        title.setAttribute('aria-label', text);

        // Clear contents
        title.textContent = '';

        const words = text.split(/\s+/);
        let letterIndex = 0;

        words.forEach((word, wi) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          wordSpan.style.whiteSpace = 'nowrap';

          word.split('').forEach((char) => {
            // Overflow-hidden wrapper
            const wrapper = document.createElement('span');
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'bottom';

            // The letter itself
            const letterSpan = document.createElement('span');
            letterSpan.textContent = char;
            letterSpan.style.display = 'inline-block';
            letterSpan.style.transform = 'translateY(110%)';
            letterSpan.style.willChange = 'transform';
            letterSpan.style.transition = `transform 0.55s cubic-bezier(.19,1,.22,1) ${letterIndex * LETTER_STAGGER}ms`;
            letterSpan.setAttribute('data-fx-letter-idx', letterIndex);

            wrapper.appendChild(letterSpan);
            wordSpan.appendChild(wrapper);
            letterIndex++;
          });

          title.appendChild(wordSpan);

          // Add a real space between words (not after last word)
          if (wi < words.length - 1) {
            const space = document.createTextNode('\u00A0');
            title.appendChild(space);
          }
        });

        const totalLetters = letterIndex;

        // Intersection Observer triggers the reveal
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              // Reveal: move every letter to translateY(0)
              const letters = $$('span[data-fx-letter-idx]', title);
              letters.forEach((l) => {
                l.style.transform = 'translateY(0)';
              });

              // After animation completes, mark as done
              const totalDuration =
                totalLetters * LETTER_STAGGER + 550; // transition-duration
              setTimeout(() => {
                title.classList.add('animated');
              }, totalDuration);

              observer.unobserve(title);
            });
          },
          { threshold: 0 }
        );

        observer.observe(title);

        onCleanup(() => observer.disconnect());
      });
    } catch (_) { /* silent */ }
  }

  // ---------------------------------------------------------------------------
  // 8. Smooth Number Counters
  // ---------------------------------------------------------------------------

  function initSmoothCounters() {
    try {
      const counters = $$('[data-count-to]');
      if (!counters.length) return;

      const DURATION = 2000; // ms

      counters.forEach((el) => {
        const raw = el.dataset.countTo || '0';
        // Extract numeric part and suffix (e.g. "150+" → 150, "+")
        const match = raw.match(/^([\d.]+)(.*)$/);
        if (!match) return;

        const target = parseFloat(match[1]);
        const suffix = match[2] || '';
        const isFloat = match[1].includes('.');
        const decimals = isFloat ? (match[1].split('.')[1] || '').length : 0;

        // Set initial value
        el.textContent = `0${suffix}`;

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              observer.unobserve(el);

              let start = null;

              const step = (ts) => {
                if (!start) start = ts;
                const elapsed = ts - start;
                const progress = clamp(elapsed / DURATION, 0, 1);
                const eased = easeOutExpo(progress);
                const current = eased * target;

                el.textContent = isFloat
                  ? `${current.toFixed(decimals)}${suffix}`
                  : `${Math.round(current)}${suffix}`;

                if (progress < 1) {
                  requestAnimationFrame(step);
                }
              };

              requestAnimationFrame(step);
            });
          },
          { threshold: 0.3 }
        );

        observer.observe(el);
        onCleanup(() => observer.disconnect());
      });
    } catch (_) { /* silent */ }
  }

  // ---------------------------------------------------------------------------
  // 9. Page Load Orchestration
  // ---------------------------------------------------------------------------

  function initPageLoad() {
    try {
      // Short delay lets the browser finish its first paint before
      // triggering the CSS page-enter animation.
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, 100);
    } catch (_) { /* silent */ }
  }

  // ---------------------------------------------------------------------------
  // 10. Active Section Highlighting (Scroll Spy)
  // ---------------------------------------------------------------------------

  function initScrollSpy() {
    try {
      const sections = $$('section[id]');
      if (!sections.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              document.body.setAttribute(
                'data-active-section',
                entry.target.id
              );
            }
          });
        },
        {
          // The section that covers the most of the top-centre band wins.
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0,
        }
      );

      sections.forEach((s) => observer.observe(s));

      onCleanup(() => observer.disconnect());
    } catch (_) { /* silent */ }
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  /**
   * Initialise every animation module.
   * Safe to call multiple times (idempotent where practical).
   */
  function init() {
    try {
      // --- Always-on (lightweight) ---
      initStaggerReveals();
      initScrollProgress();
      initPageLoad();
      initScrollSpy();
      initHeroTextReveal();
      initSmoothCounters();

      // --- Light effects (skipped for low-end / reduced-motion) ---
      initParallax();
    } catch (_) { /* silent */ }
  }

  /**
   * Tear down all effects — removes DOM nodes, observers, and listeners
   * that were registered during init().
   */
  function destroy() {
    _cleanups.forEach((fn) => {
      try { fn(); } catch (_) { /* silent */ }
    });
    _cleanups.length = 0;
  }

  // Expose individual modules for selective initialisation as well as the
  // aggregate init / destroy lifecycle methods.
  return {
    init,
    destroy,
    initStaggerReveals,
    initScrollProgress,
    initParallax,
    initHeroTextReveal,
    initSmoothCounters,
    initPageLoad,
    initScrollSpy,
  };
})();

// Auto-initialise when the DOM is ready.
document.addEventListener('DOMContentLoaded', FlexistFX.init);
