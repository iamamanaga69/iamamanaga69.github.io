document.addEventListener("DOMContentLoaded", () => {
  const stateButtons = Array.from(document.querySelectorAll("[data-state-button]"));
  const stateOutput = document.querySelector("[data-state-output]");

  if (stateButtons.length && stateOutput) {
    const stateCopy = {
      delhi: ["Delhi NCR", "High community density", "Founder networks, trading communities, and event-led discovery make NCR useful for early launch visibility."],
      maharashtra: ["Maharashtra", "High community density", "Mumbai and Pune connect retail attention with fintech, exchange, and creator networks."],
      karnataka: ["Karnataka", "High builder density", "Bengaluru brings builders, developers, and product communities together."],
      gujarat: ["Gujarat", "Growing community density", "Regional creator distribution and Telegram-first retail groups create efficient activation loops."],
      westbengal: ["West Bengal", "Growing community density", "Education and local group leaders can move community-first launches well."],
      telangana: ["Telangana", "Growing tech adoption", "Hyderabad offers strong tech adoption and focused activation opportunities."],
      tamilnadu: ["Tamil Nadu", "Strong regional opportunity", "Regional language creators make education-led acquisition especially effective."]
    };

    function renderState(button) {
      stateButtons.forEach((item) => item.classList.toggle("active", item === button));
      const item = stateCopy[button.dataset.stateButton];
      stateOutput.innerHTML = `<h3>${item[0]}</h3><span class="tag-chip signal">${item[1]}</span><p>${item[2]}</p>`;
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
  const summary = document.querySelector("[data-result-summary]");
  const strengthsList = document.querySelector("[data-strengths]");
  const gapsList = document.querySelector("[data-gaps]");
  const stackList = document.querySelector("[data-stack]");
  const leadScore = document.querySelector("[data-lead-score]");
  const leadMessage = document.querySelector("[data-lead-message]");
  const leadForm = document.querySelector("[data-lab-lead]");
  const leadNote = document.querySelector("[data-lab-lead-note]");
  let current = 0;
  let latestScore = 0;
  let latestInsights = null;
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

  function pick(key) {
    const value = answers[key];
    return Array.isArray(value) ? value[0] : value;
  }

  function list(key) {
    const value = answers[key];
    return Array.isArray(value) ? value : [];
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function calculateScore() {
    const userPoints = { "<1k": 2, "1k-10k": 9, "10k-100k": 16, "100k+": 22 };
    const telegramPoints = { "<500": 2, "500-5k": 10, "5k-50k": 18, "50k+": 24 };
    const budgetPoints = { "<1k": 2, "1k-5k": 8, "5k-20k": 16, "20k+": 22 };
    const launchPoints = { "<1m": 9, "1-3m": 12, "3-6m": 9, flexible: 5 };
    const target = Number(answers.target || 0);
    const goals = list("goals");
    let score = 8;

    score += pick("chain") ? 5 : 0;
    score += userPoints[pick("users")] || 0;
    score += telegramPoints[pick("telegram")] || 0;
    score += budgetPoints[pick("budget")] || 0;
    score += launchPoints[pick("launch")] || 0;
    score += clamp(goals.length * 4, 0, 16);
    score += target >= 100000 ? 8 : target >= 25000 ? 6 : target >= 5000 ? 4 : 1;

    return clamp(Math.round(score), 12, 96);
  }

  function addUnique(items, fallback) {
    const clean = items.filter(Boolean);
    while (clean.length < 3 && fallback.length) {
      const item = fallback.shift();
      if (!clean.includes(item)) clean.push(item);
    }
    return clean.slice(0, 3);
  }

  function buildInsights(score) {
    const goals = list("goals");
    const target = Number(answers.target || 0);
    const strengths = [];
    const gaps = [];
    const stack = [];

    if (pick("telegram") === "5k-50k" || pick("telegram") === "50k+") strengths.push("Telegram already has enough activity to support AMAs, moderation, and launch moments.");
    else gaps.push("Telegram needs a stronger trust layer before heavy campaign spend.");

    if (pick("users") === "10k-100k" || pick("users") === "100k+") strengths.push("Existing traction gives Indian creators and ambassadors something real to validate.");
    else gaps.push("The India launch should start with trust-building before aggressive user targets.");

    if (pick("budget") === "5k-20k" || pick("budget") === "20k+") strengths.push("Budget can support connected creator, community, and ambassador work.");
    else gaps.push("Budget is tight for multiple channels, so clear order matters more than volume.");

    if (pick("launch") === "1-3m") strengths.push("The launch window is realistic for campaign prep and community warm-up.");
    if (pick("launch") === "<1m") gaps.push("The India launch window is short, so execution needs a fast triage plan.");
    if (pick("launch") === "flexible") gaps.push("A sharper launch milestone will make community and creator work easier to coordinate.");

    if (goals.includes("community")) stack.push("Community Architecture");
    if (goals.includes("kol")) stack.push("Influencer and KOL Campaigns");
    if (goals.includes("ambassadors")) stack.push("Ambassador Program Operations");
    if (goals.includes("partnerships") || goals.includes("listings")) stack.push("Partnership Development");
    if (goals.includes("acquisition")) stack.push("India Market Expansion Strategy");
    if (!stack.length) stack.push("Growth Consulting");

    if (target >= 100000 && score < 70) gaps.push("The 100K+ India target needs a larger distribution engine than the current inputs suggest.");
    if (goals.length >= 3) strengths.push("Your goals give enough context to design a connected India growth system.");

    return {
      summary:
        score >= 75
          ? "Your India setup has strong signals. The next move is clear execution: community ownership, creator timing, ambassador tasks, and weekly reporting."
          : score >= 50
            ? "Your project has useful signals, but the India plan needs stronger order before bigger spend."
            : "Your project is early for India expansion. Start with community trust, Telegram discipline, and a focused launch plan.",
      strengths: addUnique(strengths, ["India expansion intent is clear.", "The selected goals create a usable growth brief.", "There is enough context to map the first sprint."]),
      gaps: addUnique(gaps, ["Creator fit still needs validation.", "Regional community opportunities need mapping.", "A clearer reporting rhythm should be defined before launch."]),
      stack: addUnique(stack, ["India Market Expansion Strategy", "Community Architecture", "Growth Consulting"])
    };
  }

  function renderList(target, items) {
    if (!target) return;
    target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
  }

  function syncLeadFields() {
    if (leadScore) leadScore.value = String(latestScore);
    if (leadMessage) {
      leadMessage.value = [
        `FlexistLabs India Check score: ${latestScore}%`,
        `Summary: ${latestInsights?.summary || ""}`,
        `Answers: ${JSON.stringify(answers)}`
      ].join("\n");
    }
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

    latestScore = calculateScore();
    latestInsights = buildInsights(latestScore);
    form.hidden = true;
    result.classList.add("visible");
    result.querySelector("[data-gauge]").style.setProperty("--score", latestScore);
    result.querySelector("[data-score]").textContent = latestScore;
    if (summary) summary.textContent = latestInsights.summary;
    renderList(strengthsList, latestInsights.strengths);
    renderList(gapsList, latestInsights.gaps);
    renderList(stackList, latestInsights.stack);
    syncLeadFields();
  });

  if (leadForm) {
    leadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      syncLeadFields();
      if (leadNote) leadNote.textContent = "Sending your India Check...";

      try {
        const response = await fetch(leadForm.action, {
          method: "POST",
          body: new FormData(leadForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Lead form failed");
        leadForm.reset();
        if (leadNote) leadNote.textContent = "Sent. FLEXIST will receive your India Check by email.";
      } catch (error) {
        if (leadNote) leadNote.textContent = "Could not send here. Please email FlexistCrypto@gmail.com directly.";
      }
    });
  }

  render();
});
