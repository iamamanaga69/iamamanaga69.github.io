document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-inquiry-engine]");
  if (!form) return;

  // Auto-select services from query parameters
  const params = new URLSearchParams(window.location.search);
  const chosenServices = (params.get("services") || params.get("service") || "").split(",").filter(Boolean);
  const serviceMapping = {
    "ama": "consulting",
    "content": "consulting",
    "india-expansion": "expansion",
    "ambassadors": "ambassador"
  };
  chosenServices.forEach((service) => {
    const val = serviceMapping[service] || service;
    const checkbox = document.querySelector(`.service-select[value="${val}"]`);
    if (checkbox) {
      checkbox.checked = true;
    }
  });

  // Setup checkbox card toggles (Step 4 & Step 6)
  document.querySelectorAll(".checkbox-group label, .checkbox-grid label").forEach((label) => {
    const cb = label.querySelector("input[type='checkbox']");
    if (cb) {
      // Set initial selected class
      if (cb.checked) label.classList.add("selected");
      cb.addEventListener("change", () => {
        label.classList.toggle("selected", cb.checked);
        // Clear validation errors dynamically on selection
        if (cb.classList.contains("service-select")) {
          const checkedServices = document.querySelectorAll(".service-select:checked");
          if (checkedServices.length > 0) {
            clearFieldError(cb.closest(".checkbox-grid"));
          }
        }
      });
    }
  });

  const totalSteps = 7;
  let currentStep = 1;
  const formData = {};
  const progressFill = document.getElementById("progressFill");
  const progressLabel = document.getElementById("progressLabel");
  const note = document.querySelector("[data-inquiry-note]");
  const back = document.querySelector("[data-back]");
  const next = document.querySelector("[data-next]");
  const steps = Array.from(document.querySelectorAll(".inquiry-step"));

  const stepNames = [
    "Project Details",
    "Stage And Funding",
    "Current Community",
    "India Goals",
    "Budget And Timeline",
    "Support Needed",
    "Founder Contact"
  ];

  // Aside content mapping for each step
  const asideContent = {
    1: {
      tip: "Your project name and chain help us understand which India channels apply.",
      context: "Project identity, URL, and category set the baseline for target market segmentation.",
      next: "We use this to identify the right Telegram and Discord channels for your niche."
    },
    2: {
      tip: "Stage and funding context helps us match the right India entry pace.",
      context: "Early stage teams focus on community building, while scale-ups focus on growth loops.",
      next: "Your launching status determines the urgency of influencer coordination."
    },
    3: {
      tip: "Community size tells us where India growth can compound fastest.",
      context: "Current socials allow us to evaluate where your strongest organic advocates are.",
      next: "India expansion scales faster when built on top of existing momentum."
    },
    4: {
      tip: "India goals help us sequence platforms and creators correctly.",
      context: "Defining a clear user acquisition target lets us run budget efficiency checks.",
      next: "Platform focus decides whether YouTube KOLs or Telegram alpha callers lead."
    },
    5: {
      tip: "Budget and timeline shape which services make sense first.",
      context: "Realistic timelines prevent waste and align creator campaigns with token events.",
      next: "Every tier has a dedicated strategy — from bootstrapping to ecosystem scale."
    },
    6: {
      tip: "Select everything you need — we'll prioritise based on your stage.",
      context: "Combining community architecture with influencer outreach creates the best flywheel.",
      next: "FLEXIST customizes execution based on your specific mix of selected support."
    },
    7: {
      tip: "Almost done. Your details go straight to the FLEXIST growth desk.",
      context: "We verify your Telegram handle to schedule the initial alignment call.",
      next: "Expect a response and your full India Strategy proposal within 24 hours."
    }
  };

  function updateProgress() {
    // Toggle active, past, and future classes for transition animations
    steps.forEach((step) => {
      const stepNum = Number(step.dataset.step);
      step.classList.toggle("active", stepNum === currentStep);
      step.classList.toggle("past", stepNum < currentStep);
      step.classList.toggle("future", stepNum > currentStep);
    });

    progressFill.style.transform = `scaleX(${currentStep / totalSteps})`;
    progressLabel.textContent = `Step ${currentStep} / ${totalSteps}`;

    // Update sticky progress bar elements
    const stickyStep = document.getElementById("stickyProgressStep");
    const stickyName = document.getElementById("stickyProgressName");
    const stickyFill = document.getElementById("stickyProgressFill");
    if (stickyStep) stickyStep.textContent = `Step ${currentStep} of ${totalSteps}`;
    if (stickyName) stickyName.textContent = stepNames[currentStep - 1] || "";
    if (stickyFill) stickyFill.style.transform = `scaleX(${currentStep / totalSteps})`;

    // Hide Back button on Step 1 (display: none)
    back.style.display = currentStep === 1 ? "none" : "inline-block";
    next.textContent = currentStep === totalSteps ? "Get My India Score →" : "Continue";
    note.textContent = "";

    // Dynamic aside panel update
    const asideCards = document.querySelectorAll(".inquiry-aside .glass-card");
    if (asideCards.length >= 3) {
      const content = asideContent[currentStep];
      if (content) {
        asideCards[0].querySelector("p").textContent = content.tip;
        asideCards[1].querySelector("p").textContent = content.context;
        asideCards[2].querySelector("p").textContent = content.next;
      }
    }
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

  // Validation styling helpers
  function showFieldError(element, message) {
    if (!element) return;
    const container = element.closest(".field") || element.closest(".option-grid") || element.closest(".checkbox-grid") || element.closest(".checkbox-group");
    if (!container) return;

    if (element.classList.contains("option-grid") || element.classList.contains("checkbox-grid") || element.classList.contains("checkbox-group")) {
      const cards = element.querySelectorAll(".option-card, label");
      cards.forEach(card => card.classList.add("error-border"));
    } else {
      element.classList.add("error-border");
    }

    let errorMsg = container.querySelector(".error-message");
    if (!errorMsg) {
      errorMsg = document.createElement("span");
      errorMsg.className = "error-message";
      container.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    errorMsg.style.display = "block";
  }

  function clearFieldError(element) {
    if (!element) return;
    const container = element.closest(".field") || element.closest(".option-grid") || element.closest(".checkbox-grid") || element.closest(".checkbox-group");
    if (!container) return;

    if (element.classList.contains("option-grid") || element.classList.contains("checkbox-grid") || element.classList.contains("checkbox-group")) {
      const cards = element.querySelectorAll(".option-card, label");
      cards.forEach(card => card.classList.remove("error-border"));
    } else {
      element.classList.remove("error-border");
    }

    const errorMsg = container.querySelector(".error-message");
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  function validateStep() {
    capture();
    let errorMsg = "";
    let firstInvalidEl = null;

    // Clear previous validation error highlights
    document.querySelectorAll(".error-border").forEach((el) => {
      if (el.classList.contains("option-card") || el.tagName === "LABEL") {
        const grid = el.closest(".option-grid") || el.closest(".checkbox-grid") || el.closest(".checkbox-group");
        if (grid) clearFieldError(grid);
      } else {
        clearFieldError(el);
      }
    });

    if (currentStep === 1) {
      const prjName = document.getElementById("projectName");
      if (!formData.projectName) {
        errorMsg = "Project name is required.";
        showFieldError(prjName, errorMsg);
        if (!firstInvalidEl) firstInvalidEl = prjName;
      }
    }
    if (currentStep === 2) {
      const stageGrid = document.querySelector(".option-grid");
      if (!formData.stage) {
        errorMsg = "Select the project stage.";
        showFieldError(stageGrid, errorMsg);
        if (!firstInvalidEl) firstInvalidEl = stageGrid;
      }
    }
    if (currentStep === 4) {
      const target = document.getElementById("indiaTarget");
      if (!formData.indiaTarget) {
        errorMsg = "Add a 6-month India user target.";
        showFieldError(target, errorMsg);
        if (!firstInvalidEl) firstInvalidEl = target;
      }
    }
    if (currentStep === 5) {
      const budgetGrid = document.querySelector(".option-grid.two-col");
      if (!formData.budget) {
        errorMsg = "Select the India marketing budget.";
        showFieldError(budgetGrid, errorMsg);
        if (!firstInvalidEl) firstInvalidEl = budgetGrid;
      }
    }
    if (currentStep === 6) {
      const servicesGrid = document.querySelector(".checkbox-grid");
      if (!formData.services.length) {
        errorMsg = "Select at least one service.";
        showFieldError(servicesGrid, errorMsg);
        if (!firstInvalidEl) firstInvalidEl = servicesGrid;
      }
    }
    if (currentStep === 7) {
      const name = document.getElementById("founderName");
      const email = document.getElementById("founderEmail");

      if (!formData.founderName) {
        errorMsg = "Founder name is required.";
        showFieldError(name, errorMsg);
        if (!firstInvalidEl) firstInvalidEl = name;
      }
      if (!formData.founderEmail) {
        errorMsg = "Founder email is required.";
        showFieldError(email, errorMsg);
        if (!firstInvalidEl) firstInvalidEl = email;
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.founderEmail)) {
          errorMsg = "Please enter a valid email address.";
          showFieldError(email, errorMsg);
          if (!firstInvalidEl) firstInvalidEl = email;
        }
      }
    }

    if (firstInvalidEl) {
      const container = firstInvalidEl.closest(".field") || firstInvalidEl.closest(".option-grid") || firstInvalidEl.closest(".checkbox-grid") || firstInvalidEl.closest(".checkbox-group");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return errorMsg;
  }

  // Attach real-time input error clearing listeners
  document.getElementById("projectName").addEventListener("input", function() {
    if (this.value.trim()) clearFieldError(this);
  });
  document.getElementById("indiaTarget").addEventListener("input", function() {
    if (this.value.trim()) clearFieldError(this);
  });
  document.getElementById("founderName").addEventListener("input", function() {
    if (this.value.trim()) clearFieldError(this);
  });
  document.getElementById("founderEmail").addEventListener("input", function() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value.trim() && emailPattern.test(this.value.trim())) {
      clearFieldError(this);
    }
  });

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
    if (formData.services.length >= 3) strengths.push("Several growth services are clearly needed");
    else gaps.push("One service alone may limit growth momentum");
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
      expansion: "India Expansion",
      kol: "KOL Campaigns",
      ambassador: "Ambassador Program",
      partnerships: "Partnerships",
      consulting: "Growth Consulting"
    };
    document.getElementById("ticketId").textContent = ticketId;
    document.getElementById("ticketProject").textContent = formData.projectName || "-";
    document.getElementById("ticketChain").textContent = label(formData.chain, {}).toUpperCase();
    document.getElementById("ticketStage").textContent = label(formData.stage, {}).toUpperCase();
    document.getElementById("ticketTarget").textContent = formData.indiaTarget ? `${Number(formData.indiaTarget).toLocaleString()} users` : "-";
    document.getElementById("ticketBudget").textContent = label(formData.budget, { sub1k: "Under $1K", "1to5k": "$1K - $5K", "5to20k": "$5K - $20K", "20kplus": "$20K+" });
    document.getElementById("ticketServices").textContent = formData.services.map((item) => serviceLabels[item]).join(", ") || "General inquiry";
    
    renderList("strengthsList", result.strengths);
    renderList("gapsList", result.gaps);
    renderList("actionsList", result.actions);

    // Build plain-text detailed email summary
    const emailBody = `FLEXIST FOUNDER INQUIRY SUMMARY
----------------------------------------
Ticket ID: ${ticketId}
India Readiness Score: ${score}/100

STEP 1: PROJECT DETAILS
- Project Name: ${formData.projectName}
- Website URL: ${formData.projectUrl || "Not specified"}
- Blockchain: ${formData.chain ? formData.chain.toUpperCase() : "Not specified"}
- Category: ${formData.category ? formData.category.toUpperCase() : "Not specified"}

STEP 2: STAGE AND FUNDING
- Project Stage: ${formData.stage ? formData.stage.toUpperCase() : "Not specified"}
- Launch Status: ${formData.launchStatus || "Not specified"}

STEP 3: CURRENT COMMUNITY
- Telegram Members: ${label(formData.telegram, {0: "No Telegram", 1: "Under 500", 2: "500 - 5K", 3: "5K - 50K", 4: "50K+"})}
- Discord Members: ${label(formData.discord, {0: "No Discord", 1: "Under 1K", 2: "1K - 10K", 3: "10K+"})}
- Twitter/X Followers: ${label(formData.twitter, {0: "No presence", 1: "Under 1K", 2: "1K - 10K", 3: "10K - 100K", 4: "100K+"})}
- Users / Holders: ${label(formData.users, {0: "Under 1,000", 1: "1K - 10K", 2: "10K - 100K", 3: "100K+"})}

STEP 4: INDIA GOALS
- Target Indian Users (6 months): ${formData.indiaTarget ? Number(formData.indiaTarget).toLocaleString() : "Not specified"}
- Priority Platforms: ${formData.platforms.join(", ") || "None specified"}

STEP 5: BUDGET AND TIMELINE
- Monthly Budget: ${label(formData.budget, { sub1k: "Under $1K/mo", "1to5k": "$1K - $5K/mo", "5to20k": "$5K - $20K/mo", "20kplus": "$20K+/mo" })}
- India Launch Timing: ${label(formData.urgency, { "1month": "Within 1 month", "3months": "1 - 3 months", "6months": "3 - 6 months", flexible: "Flexible" })}

STEP 6: SUPPORT NEEDED
- Services Needed: ${document.getElementById("ticketServices").textContent}

STEP 7: FOUNDER CONTACT
- Founder Name: ${formData.founderName}
- Email: ${formData.founderEmail}
- Telegram Handle: ${formData.founderTelegram || "Not specified"}
- Additional Context: ${formData.context || "None provided"}`;

    const subject = `FLEXIST Inquiry — ${formData.projectName}`;
    document.getElementById("ticketEmail").href = `mailto:FlexistCrypto@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Set Telegram Group Bot start link with ticket ID parameter
    const discussBtn = document.getElementById("ticketDiscussTelegram");
    if (discussBtn) {
      discussBtn.href = `https://t.me/FlexistGroupBot?start=inquiry_${ticketId}`;
    }

    // Register ticket with worker in the background for spam-guarded Telegram creation
    const WORKER_URL = "https://flexist-payment-verifier.flexistcrypto.workers.dev";
    fetch(`${WORKER_URL}/register-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ticketId: ticketId,
        projectName: formData.projectName,
        telegramHandle: formData.founderTelegram
      })
    }).catch((err) => console.error("Failed to register ticket with verifier worker:", err));
    
    form.hidden = true;
    document.querySelector("[data-inquiry-progress]").hidden = true;

    // Hide estimated time indicator
    const estTime = document.getElementById("formEstTime");
    if (estTime) estTime.style.display = "none";

    // Hide sticky progress bar
    const stickyBar = document.getElementById("stickyProgressBar");
    if (stickyBar) {
      stickyBar.classList.remove("visible");
      stickyBar.style.display = "none";
    }

    // Show ticket and animate in
    const ticket = document.getElementById("inquiryTicket");
    ticket.hidden = false;
    requestAnimationFrame(() => {
      ticket.classList.add("revealed");
    });

    // Animate circular gauge and score counter
    const scoreNumberEl = document.getElementById("scoreNumber");
    const gaugeCircleFill = document.getElementById("gaugeCircleFill");
    const maxOffset = 251.2;
    const targetOffset = maxOffset - (score / 100) * maxOffset;

    scoreNumberEl.textContent = "0/100";
    if (gaugeCircleFill) {
      gaugeCircleFill.style.strokeDashoffset = maxOffset;
    }

    const animDuration = 1500;
    const animStart = performance.now();

    function animateScoreGauge(timestamp) {
      const elapsed = timestamp - animStart;
      const progress = Math.min(elapsed / animDuration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad

      const currentScoreVal = Math.round(easeProgress * score);
      scoreNumberEl.textContent = `${currentScoreVal}/100`;

      if (gaugeCircleFill) {
        const currentOffset = maxOffset - (easeProgress * (score / 100)) * maxOffset;
        gaugeCircleFill.style.strokeDashoffset = currentOffset;
      }

      if (progress < 1) {
        requestAnimationFrame(animateScoreGauge);
      } else {
        scoreNumberEl.textContent = `${score}/100`;
        if (gaugeCircleFill) {
          gaugeCircleFill.style.strokeDashoffset = targetOffset;
        }

        // Score number pulse
        scoreNumberEl.classList.add("neon-pulse-active");
        
        // Terminal border flash
        const terminal = document.getElementById("inquiryTerminal");
        if (terminal) {
          terminal.classList.add("success-pulse");
        }
      }
    }

    setTimeout(() => {
      requestAnimationFrame(animateScoreGauge);
    }, 400);
  }

  document.querySelectorAll(".option-card").forEach((card) => {
    card.addEventListener("click", () => {
      const grid = card.closest(".option-grid");
      document.querySelectorAll(`.option-card[data-field="${card.dataset.field}"]`).forEach((item) => item.classList.remove("selected"));
      card.classList.add("selected");
      if (grid) {
        clearFieldError(grid);
      }
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

  // Sticky progress bar scroll listener
  const stickyBar = document.getElementById("stickyProgressBar");
  const handleScroll = () => {
    if (!stickyBar) return;
    if (window.scrollY > 200 && !form.hidden) {
      stickyBar.classList.add("visible");
    } else {
      stickyBar.classList.remove("visible");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
});
