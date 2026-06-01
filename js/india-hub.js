document.addEventListener("DOMContentLoaded", () => {
  const stateButtons = Array.from(document.querySelectorAll("[data-state-button]"));
  const stateOutput = document.querySelector("[data-state-output]");
  if (stateButtons.length && stateOutput) {
    const copy = {
      delhi: ["Delhi NCR", "High", "Founder networks, trading communities, and event-led discovery make NCR a launch amplifier."],
      maharashtra: ["Maharashtra", "High", "Mumbai and Pune connect retail attention with fintech, exchange, and operator networks."],
      karnataka: ["Karnataka", "High", "Bengaluru is the technical credibility node: builders, developers, and product communities."],
      gujarat: ["Gujarat", "Growing", "Regional creator distribution and Telegram-first retail groups create efficient activation loops."],
      westbengal: ["West Bengal", "Growing", "Community-first launches work when education and local group operators move together."],
      telangana: ["Telangana", "Growing", "Hyderabad offers strong tech adoption and compact on-ground activation opportunities."],
      tamilnadu: ["Tamil Nadu", "Growing", "Regional language creators make education-led acquisition especially effective."]
    };
    function renderState(button) {
      stateButtons.forEach((item) => item.classList.toggle("active", item === button));
      const item = copy[button.dataset.stateButton];
      stateOutput.innerHTML = `<h3>${item[0]}</h3><span class="tag-chip signal">${item[1]} community density</span><p>${item[2]}</p>`;
    }
    stateButtons.forEach((button) => button.addEventListener("click", () => renderState(button)));
    renderState(stateButtons[0]);
  }

  const form = document.querySelector("[data-assessment]");
  if (!form) return;
  const steps = Array.from(form.querySelectorAll(".assessment-step"));
  const progress = form.querySelector("[data-progress-line]");
  const progressText = form.querySelector("[data-progress-text]");
  const back = form.querySelector("[data-assessment-back]");
  const next = form.querySelector("[data-assessment-next]");
  const result = document.querySelector("[data-assessment-result]");
  let current = 0;
  const answers = {};

  function render() {
    steps.forEach((step, index) => step.classList.toggle("active", index === current));
    progress.style.transform = `scaleX(${(current + 1) / steps.length})`;
    progressText.textContent = `Step ${current + 1} / ${steps.length}`;
    back.hidden = current === 0;
    next.textContent = current === steps.length - 1 ? "Generate Score" : "Continue";
  }

  function capture() {
    const step = steps[current];
    const key = step.dataset.key;
    const input = step.querySelector("input");
    const selected = Array.from(step.querySelectorAll(".option-button.selected")).map((button) => button.dataset.value);
    answers[key] = input ? input.value : selected;
    return input ? Boolean(input.value) : selected.length > 0;
  }

  form.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", () => {
      const step = button.closest(".assessment-step");
      if (!step.dataset.multi) {
        step.querySelectorAll(".option-button").forEach((item) => item.classList.remove("selected"));
      }
      button.classList.toggle("selected");
    });
  });

  back.addEventListener("click", () => {
    current = Math.max(0, current - 1);
    render();
  });

  next.addEventListener("click", () => {
    if (!capture()) {
      next.textContent = "Select an option";
      return;
    }
    if (current < steps.length - 1) {
      current += 1;
      render();
      return;
    }
    const values = Object.values(answers).flat();
    let score = 32 + values.length * 4;
    if (answers.users && answers.users[0] !== "<1k") score += 8;
    if (answers.telegram && answers.telegram[0] !== "<500") score += 8;
    if (answers.budget && answers.budget[0] !== "<1k") score += 8;
    score = Math.min(score, 94);
    form.hidden = true;
    result.classList.add("visible");
    result.querySelector("[data-gauge]").style.setProperty("--score", score);
    result.querySelector("[data-score]").textContent = score;
  });
  render();
});
