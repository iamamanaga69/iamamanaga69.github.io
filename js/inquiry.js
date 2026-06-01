document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-inquiry-engine]");
  if (!form) return;

  const totalSteps = 7;
  let currentStep = 1;
  const formData = {};
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");
  const note = document.querySelector("[data-inquiry-note]");
  const back = document.querySelector("[data-back]");
  const next = document.querySelector("[data-next]");
  const steps = Array.from(document.querySelectorAll(".inquiry-step"));

  function updateProgress() {
    steps.forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === currentStep));
    progressFill.style.transform = `scaleX(${currentStep / totalSteps})`;
    progressLabel.textContent = `Step ${currentStep} / ${totalSteps}`;
    back.hidden = currentStep === 1;
    next.textContent = currentStep === totalSteps ? "Generate Inquiry Ticket" : "Continue";
    note.textContent = "";
  }

  function selected(field) {
    return document.querySelector(`.option-card.selected[data-field="${field}"]`)?.dataset.value || "";
  }

  function capture() {
    formData.projectName = document.getElementById("projectName").value.trim();
    formData.projectUrl = document.getElementById("projectUrl").value.trim();
    formData.chain = document.getElementById("projectChain").value;
    formData.category = document.getElementById("projectCategory").value;
    formData.stage = selected("stage");
    formData.launchStatus = document.getElementById("launchStatus").value;
    formData.telegram = Number(document.getElementById("telegramSize").value);
    formData.discord = Number(document.getElementById("discordSize").value);
    formData.twitter = Number(document.getElementById("twitterSize").value);
    formData.users = Number(document.getElementById("totalUsers").value);
    formData.indiaTarget = document.getElementById("indiaTarget").value;
    formData.platforms = Array.from(document.querySelectorAll(".india-platform:checked")).map((item) => item.value);
    formData.budget = selected("budget");
    formData.urgency = document.getElementById("launchUrgency").value;
    formData.services = Array.from(document.querySelectorAll(".service-select:checked")).map((item) => item.value);
    formData.founderName = document.getElementById("founderName").value.trim();
    formData.founderEmail = document.getElementById("founderEmail").value.trim();
    formData.founderTelegram = document.getElementById("founderTelegram").value.trim();
    formData.context = document.getElementById("founderContext").value.trim();
  }

  function validateStep() {
    capture();
    if (currentStep === 1 && !formData.projectName) return "Project name is required.";
    if (currentStep === 2 && !formData.stage) return "Select the project stage.";
    if (currentStep === 4 && !formData.indiaTarget) return "Add a 6-month India user target.";
    if (currentStep === 5 && !formData.budget) return "Select the India marketing budget.";
    if (currentStep === 6 && !formData.services.length) return "Select at least one growth layer.";
    if (currentStep === 7 && (!formData.founderEmail || !formData.projectName)) return "Project name and founder email are required.";
    return "";
  }

  function calculateScore() {
    let score = 0;
    score += formData.telegram * 8;
    score += formData.discord * 4;
    score += formData.twitter * 4;
    score += formData.users * 5;
    score += ({ sub1k: 0, "1to5k": 5, "5to20k": 10, "20kplus": 15 }[formData.budget] || 0);
    score += ({ "1month": 10, "3months": 8, "6months": 5, flexible: 3 }[formData.urgency] || 0);
    score += Math.min(formData.services.length * 2, 10);
    if (formData.platforms.includes("telegram")) score += 5;
    return Math.min(Math.round(score), 100);
  }

  function insights(score) {
    const strengths = [];
    const gaps = [];
    const actions = [];
    if (formData.telegram >= 3) strengths.push("Strong Telegram community base");
    else gaps.push("Telegram community needs foundational work");
    if (formData.twitter >= 2) strengths.push("Twitter/X presence is visible");
    else gaps.push("Twitter/X distribution is thin");
    if (formData.budget && formData.budget !== "sub1k") strengths.push("Budget supports structured campaign execution");
    else gaps.push("Budget may limit multi-channel execution");
    if (["1month", "3months"].includes(formData.urgency)) strengths.push("Clear India launch timeline defined");
    else gaps.push("Timeline needs a stronger launch milestone");
    if (formData.services.length >= 3) strengths.push("Multi-layer growth approach identified");
    else gaps.push("Single-layer growth will limit compounding");
    if (formData.platforms.includes("telegram")) strengths.push("Telegram-first India focus is correct");
    else gaps.push("Telegram should become the core India trust channel");
    if (score < 45) actions.push("Start with community architecture and market-entry planning");
    else if (score < 70) actions.push("Add KOL sequencing and ambassador recruitment around the launch window");
    else actions.push("Move into full India execution with reporting and retention loops");
    actions.push("Package creator briefs around the primary project category");
    actions.push("Open a founder strategy call with the generated ticket context");
    return { strengths: strengths.slice(0, 3), gaps: gaps.slice(0, 3), actions: actions.slice(0, 3) };
  }

  function label(value, map) {
    return map[value] || value || "Not specified";
  }

  function renderList(id, items) {
    document.getElementById(id).innerHTML = items.map((item) => `<li>${item}</li>`).join("");
  }

  function submitInquiry() {
    capture();
    const score = calculateScore();
    const result = insights(score);
    const ticketId = `FC-${Date.now().toString(36).toUpperCase()}`;
    const serviceLabels = {
      community: "Community Architecture",
      expansion: "India Market Expansion",
      kol: "Influencer / KOL Campaigns",
      ambassador: "Ambassador Program",
      partnerships: "Partnership Development",
      consulting: "Growth Consulting"
    };
    document.getElementById("ticketId").textContent = ticketId;
    document.getElementById("ticketProject").textContent = formData.projectName || "-";
    document.getElementById("ticketChain").textContent = label(formData.chain, {}).toUpperCase();
    document.getElementById("ticketStage").textContent = label(formData.stage, {}).toUpperCase();
    document.getElementById("ticketTarget").textContent = formData.indiaTarget ? `${Number(formData.indiaTarget).toLocaleString()} users` : "-";
    document.getElementById("ticketBudget").textContent = label(formData.budget, { sub1k: "Under $1K", "1to5k": "$1K - $5K", "5to20k": "$5K - $20K", "20kplus": "$20K+" });
    document.getElementById("ticketServices").textContent = formData.services.map((item) => serviceLabels[item]).join(", ") || "General inquiry";
    document.getElementById("scoreNumber").textContent = `${score}/100`;
    document.getElementById("scoreGaugeFill").style.transform = `scaleX(${score / 100})`;
    renderList("strengthsList", result.strengths);
    renderList("gapsList", result.gaps);
    renderList("actionsList", result.actions);
    const body = encodeURIComponent(`Ticket: ${ticketId}\nProject: ${formData.projectName}\nScore: ${score}/100\nServices: ${document.getElementById("ticketServices").textContent}\nContext: ${formData.context}`);
    document.getElementById("ticketEmail").href = `mailto:FlexistCrypto@gmail.com?subject=Founder Inquiry ${ticketId}&body=${body}`;
    form.hidden = true;
    document.querySelector("[data-inquiry-progress]").hidden = true;
    document.getElementById("inquiryTicket").hidden = false;
  }

  document.querySelectorAll(".option-card").forEach((card) => {
    card.addEventListener("click", () => {
      document.querySelectorAll(`.option-card[data-field="${card.dataset.field}"]`).forEach((item) => item.classList.remove("selected"));
      card.classList.add("selected");
    });
  });
  back.addEventListener("click", () => {
    currentStep = Math.max(1, currentStep - 1);
    updateProgress();
  });
  next.addEventListener("click", () => {
    const error = validateStep();
    if (error) {
      note.textContent = error;
      return;
    }
    if (currentStep < totalSteps) {
      currentStep += 1;
      updateProgress();
    } else {
      submitInquiry();
    }
  });
  updateProgress();
});
