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
  // 3. Magnetic Button Effect
  // ---------------------------------------------------------------------------

  function initMagneticButtons() {
    try {
      if (shouldSkipHeavy() || isTouchDevice()) return;

      const buttons = $$('.neon-button');
      const MAX_SHIFT = 4; // px

      buttons.forEach((btn) => {
        const handleMove = (e) => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;

          // Normalised offset -1 … 1
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);

          const tx = clamp(dx * MAX_SHIFT, -MAX_SHIFT, MAX_SHIFT);
          const ty = clamp(dy * MAX_SHIFT, -MAX_SHIFT, MAX_SHIFT);

          btn.style.transform = `translate(${tx}px, ${ty}px)`;

          // Expose mouse position for CSS glow
          btn.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
          btn.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        };

        const handleLeave = () => {
          btn.style.transition = 'transform 0.35s cubic-bezier(.25,.46,.45,.94)';
          btn.style.transform = 'translate(0, 0)';
          // Remove inline transition after it completes so it doesn't
          // interfere with the mousemove transform.
          const onEnd = () => {
            btn.style.transition = '';
            btn.removeEventListener('transitionend', onEnd);
          };
          btn.addEventListener('transitionend', onEnd);
        };

        btn.addEventListener('mousemove', handleMove);
        btn.addEventListener('mouseleave', handleLeave);

        onCleanup(() => {
          btn.removeEventListener('mousemove', handleMove);
          btn.removeEventListener('mouseleave', handleLeave);
        });
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
  // 5. Tilt Effect on Cards
  // ---------------------------------------------------------------------------

  function initCardTilt() {
    try {
      if (shouldSkipHeavy() || isTouchDevice()) return;

      const MAX_ROT = 3; // degrees
      const cards = $$('.glass-card.hoverable');

      cards.forEach((card) => {
        // Ensure perspective on parent
        const parent = card.parentElement;
        if (parent && !parent.style.perspective) {
          parent.style.perspective = '800px';
        }

        const handleMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Normalise to -1 … 1
          const nx = (x / rect.width) * 2 - 1;
          const ny = (y / rect.height) * 2 - 1;

          // rotateX is driven by Y position (inverted), rotateY by X
          const rotX = clamp(-ny * MAX_ROT, -MAX_ROT, MAX_ROT);
          const rotY = clamp(nx * MAX_ROT, -MAX_ROT, MAX_ROT);

          card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        };

        const handleLeave = () => {
          card.style.transition =
            'transform 0.5s cubic-bezier(.25,.46,.45,.94)';
          card.style.transform = 'rotateX(0) rotateY(0)';
          const onEnd = () => {
            card.style.transition = '';
            card.removeEventListener('transitionend', onEnd);
          };
          card.addEventListener('transitionend', onEnd);
        };

        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', handleLeave);

        onCleanup(() => {
          card.removeEventListener('mousemove', handleMove);
          card.removeEventListener('mouseleave', handleLeave);
        });
      });
    } catch (_) { /* silent */ }
  }

  // ---------------------------------------------------------------------------
  // 6. Mouse Glow Follower
  // ---------------------------------------------------------------------------

  function initMouseGlow() {
    try {
      if (shouldSkipHeavy() || isTouchDevice()) return;

      const SIZE = 360; // px — radius of the glow
      const glow = document.createElement('div');
      glow.className = 'mouse-glow';
      Object.assign(glow.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        borderRadius: '50%',
        background:
          'radial-gradient(circle, var(--accent-blue, rgba(41,121,255,0.12)) 0%, transparent 70%)',
        opacity: '0.04',
        pointerEvents: 'none',
        zIndex: '-1',
        willChange: 'transform',
        filter: 'blur(40px)',
        transform: 'translate(-50%, -50%) translate(0px, 0px)',
      });

      document.body.appendChild(glow);

      // Current & target position
      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let cx = mx;
      let cy = my;
      let rafId = null;

      const onMove = (e) => {
        mx = e.clientX;
        my = e.clientY;
      };

      const tick = () => {
        cx = lerp(cx, mx, 0.08);
        cy = lerp(cy, my, 0.08);
        glow.style.transform = `translate(-50%, -50%) translate(${cx}px, ${cy}px)`;
        rafId = requestAnimationFrame(tick);
      };

      window.addEventListener('mousemove', onMove, { passive: true });
      rafId = requestAnimationFrame(tick);

      onCleanup(() => {
        window.removeEventListener('mousemove', onMove);
        cancelAnimationFrame(rafId);
        glow.remove();
      });
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

      // --- Heavy effects (skipped for low-end / reduced-motion) ---
      initMagneticButtons();
      initParallax();
      initCardTilt();
      initMouseGlow();
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
    initMagneticButtons,
    initParallax,
    initCardTilt,
    initMouseGlow,
    initHeroTextReveal,
    initSmoothCounters,
    initPageLoad,
    initScrollSpy,
  };
})();

// Auto-initialise when the DOM is ready.
document.addEventListener('DOMContentLoaded', FlexistFX.init);
