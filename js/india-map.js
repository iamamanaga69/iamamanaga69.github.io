const IndiaMap = (() => {
  const signals = {
    delhi: ["Delhi NCR", "High-density founder and trading communities", "Telegram + X"],
    maharashtra: ["Maharashtra", "Strong builder, exchange and fintech overlap", "X + YouTube"],
    karnataka: ["Karnataka", "Developer-led adoption around Bengaluru", "Discord + X"],
    gujarat: ["Gujarat", "Retail discovery and regional creator influence", "Telegram + YouTube"],
    westbengal: ["West Bengal", "Fast-moving retail communities with active group culture", "Telegram"],
    telangana: ["Telangana", "Tech-forward audience with strong event potential", "X + Discord"],
    tamilnadu: ["Tamil Nadu", "Regional-language education unlocks reach", "YouTube + Telegram"]
  };

  function init() {
    const map = document.querySelector("[data-india-map]");
    const tooltip = document.querySelector("[data-map-tooltip]");
    if (!map || !tooltip) return;
    const paths = Array.from(map.querySelectorAll("path[data-state]"));
    let index = 0;

    function show(path) {
      paths.forEach((item) => item.classList.toggle("active", item === path));
      const signal = signals[path.dataset.state];
      tooltip.innerHTML = `<strong>${signal[0]}</strong><br>${signal[1]}<br><span class="terminal-status">${signal[2]}</span>`;
      tooltip.classList.add("visible");
    }

    paths.forEach((path) => {
      path.addEventListener("mouseenter", () => show(path));
      path.addEventListener("focus", () => show(path));
    });

    show(paths[0]);
    if (!window.prefersReducedMotion) {
      window.setInterval(() => {
        index = (index + 1) % paths.length;
        show(paths[index]);
      }, 1800);
    }
  }

  return { init, signals };
})();
