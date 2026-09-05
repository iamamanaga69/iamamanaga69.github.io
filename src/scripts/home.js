document.addEventListener("DOMContentLoaded", () => {
  const startNetworkGraph = () => NetworkGraph.init();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(startNetworkGraph, { timeout: 1800 });
  } else {
    window.setTimeout(startNetworkGraph, 900);
  }
  IndiaMap.init();

  const form = document.querySelector("[data-mini-readiness]");
  const result = document.querySelector("[data-mini-result]");
  const track = document.querySelector("[data-mini-track]");
  if (form && result && track) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const project = new FormData(form).get("project") || "Your project";
      const chain = new FormData(form).get("chain");
      const base = Array.from(project).reduce((sum, letter) => sum + letter.charCodeAt(0), 0);
      const score = 28 + ((base + chain.length) % 33);
      track.classList.remove("complete");
      track.classList.add("loading");
      result.textContent = "Analyzing India signal density...";
      window.setTimeout(() => {
        track.classList.remove("loading");
        track.classList.add("complete");
        result.textContent = `${project} is ${score}% India-ready. The gap is an opportunity.`;
      }, 900);
    });
  }

  const trackEl = document.querySelector("[data-carousel-track]");
  const dots = Array.from(document.querySelectorAll("[data-carousel-dot]"));
  if (trackEl && dots.length) {
    let active = 0;
    let startX = 0;
    function setSlide(index) {
      active = (index + dots.length) % dots.length;
      trackEl.style.transform = `translateX(-${active * 100}%)`;
      dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === active));
    }
    dots.forEach((dot, index) => dot.addEventListener("click", () => setSlide(index)));
    trackEl.addEventListener("touchstart", (event) => { startX = event.touches[0].clientX; }, { passive: true });
    trackEl.addEventListener("touchend", (event) => {
      const distance = event.changedTouches[0].clientX - startX;
      if (Math.abs(distance) > 45) setSlide(active + (distance < 0 ? 1 : -1));
    }, { passive: true });
    if (!window.prefersReducedMotion) {
      window.setInterval(() => setSlide(active + 1), 5200);
    }
  }
});
