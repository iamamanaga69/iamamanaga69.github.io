const Counters = (() => {
  const counterConfig = {
    years: { target: 5.5, suffix: "+", decimals: 1 },
    projects: { target: 5, suffix: "+" },
    members: { target: 10000, suffix: "+", useLocale: true },
    languages: { target: 4, suffix: "" },
    loops: { target: Infinity, suffix: "" }
  };

  function formatCounter(value, config) {
    if (config.decimals) return `${value.toFixed(config.decimals)}${config.suffix || ""}`;
    const rounded = Math.floor(value);
    return `${config.useLocale ? rounded.toLocaleString("en-US") : rounded}${config.suffix || ""}`;
  }

  function animateCounter(element, config) {
    if (config.target === Infinity) {
      element.textContent = "∞";
      return;
    }

    const start = performance.now();
    const duration = 1600;
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = formatCounter(eased * config.target, config);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll("[data-counter], [data-count]");
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        if (element.dataset.animated) return;
        element.dataset.animated = "true";

        const key = element.dataset.counter;
        const config = key && counterConfig[key]
          ? counterConfig[key]
          : { target: Number(element.dataset.count), suffix: element.dataset.suffix || "" };

        animateCounter(element, config);
        observer.unobserve(element);
      });
    }, { threshold: 0.3 });

    counters.forEach((counter) => observer.observe(counter));
  }

  return { init };
})();

if (document.readyState !== "loading") Counters.init();
else document.addEventListener("DOMContentLoaded", Counters.init);
