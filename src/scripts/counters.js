const Counters = (() => {
  const counterConfig = {
    years: { target: 5, suffix: "+" },
    projects: { target: 5, suffix: "+" },
    members: { target: 500, suffix: "+" },
    languages: { target: 4, suffix: "" },
    loops: { target: Infinity, suffix: "" }
  };

  function animateCounter(element, target, suffix) {
    if (target === Infinity) {
      element.textContent = "∞";
      return;
    }
    const start = performance.now();
    const duration = 1600;
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      element.textContent = `${Math.floor(eased * target)}${suffix}`;
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
        if (key && counterConfig[key]) {
          animateCounter(element, counterConfig[key].target, counterConfig[key].suffix);
        } else {
          animateCounter(element, Number(element.dataset.count), element.dataset.suffix || "");
        }
        observer.unobserve(element);
      });
    }, { threshold: 0.3 });
    counters.forEach((counter) => {
      const key = counter.dataset.counter;
      if (key && counterConfig[key]) {
        counter.textContent = counterConfig[key].target === Infinity ? "∞" : `0${counterConfig[key].suffix}`;
      }
      observer.observe(counter);
    });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", Counters.init);
