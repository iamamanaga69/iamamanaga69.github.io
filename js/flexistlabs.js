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

  const form = document.getElementById("assessment-form");
  const result = document.getElementById("assessment-result");

  if (form && result) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get values
      const q1 = parseInt(form.elements["q1"].value || "0");
      const q2 = parseInt(form.elements["q2"].value || "0");
      const q3 = parseInt(form.elements["q3"].value || "0");
      const q4 = parseInt(form.elements["q4"].value || "0");
      const q5 = parseInt(form.elements["q5"].value || "0");

      const score = q1 + q2 + q3 + q4 + q5;
      
      // Update hidden inputs for Web3Forms email submission
      const scoreHidden = document.getElementById("score-hidden");
      const tierHidden = document.getElementById("tier-hidden");
      if (scoreHidden) scoreHidden.value = String(score);
      
      let tier = "Early Stage";
      if (score >= 40) tier = "India Ready";
      else if (score >= 20) tier = "Needs Optimization";
      if (tierHidden) tierHidden.value = tier;

      // Show loading feedback on submit button
      const submitBtn = form.querySelector(".assessment-submit");
      if (submitBtn) {
        submitBtn.textContent = "Calculating & Submitting...";
        submitBtn.disabled = true;
      }

      // Submit to Web3Forms in background
      try {
        const formData = new FormData(form);
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });
      } catch (err) {
        console.error("Submission error:", err);
      }

      // Hide form and show results
      form.hidden = true;
      result.hidden = false;
      result.classList.add("visible");

      // Animate score SVG circle
      // 2 * PI * r = 2 * 3.14159 * 52 = 326.7
      const arc = document.getElementById("score-arc");
      if (arc) {
        const maxOffset = 326.7;
        const offset = maxOffset - (score / 50) * maxOffset;
        
        // Force repaint
        arc.getBoundingClientRect();
        arc.style.strokeDashoffset = offset;
      }

      // Counter animation for value
      const scoreVal = document.getElementById("score-value");
      if (scoreVal) {
        let count = 0;
        const duration = 1000; // 1s
        const stepTime = Math.abs(Math.floor(duration / (score || 1)));
        if (score > 0) {
          const timer = setInterval(() => {
            count++;
            scoreVal.textContent = count;
            if (count >= score) {
              clearInterval(timer);
            }
          }, stepTime);
        } else {
          scoreVal.textContent = "0";
        }
      }

      // Set Tier tag and message
      const tierTag = document.getElementById("score-tier");
      const scoreMsg = document.getElementById("score-message");
      if (tierTag) {
        tierTag.textContent = tier;
        tierTag.className = "tag-chip signal";
        if (score >= 40) {
          tierTag.classList.add("tier-ready");
        } else if (score >= 20) {
          tierTag.classList.add("tier-optimization");
        } else {
          tierTag.classList.add("tier-early");
        }
      }
      
      if (scoreMsg) {
        if (score >= 40) {
          scoreMsg.textContent = "Your project has strong local foundations. You are ready to launch scale campaigns and capture high-velocity growth.";
        } else if (score >= 20) {
          scoreMsg.textContent = "You have established initial signals, but the growth loops are fragmented. Strengthen your community rhythm and content playbooks before scaling paid outreach.";
        } else {
          scoreMsg.textContent = "Your local foundations are empty. Focus on setting up Telegram moderation, recruiting primary ambassadors, and launching small creator tests.";
        }
      }

      // Generate breakdown logs
      const breakdownContent = document.getElementById("breakdown-content");
      if (breakdownContent) {
        breakdownContent.innerHTML = "";
        
        const logs = [];
        logs.push({ type: "info", text: `[init] Initializing India Readiness Audit...` });
        logs.push({ type: "info", text: `[eval] Scanning operational indicators...` });

        // Q1 Log
        if (q1 === 10) {
          logs.push({ type: "success", text: `[pass] Community: Active Indian community hub is ready for event-led activation.` });
        } else if (q1 === 5) {
          logs.push({ type: "warning", text: `[warn] Community: Early signals detected, but active engagement loops are required.` });
        } else {
          logs.push({ type: "error", text: `[fail] Community: No localized community hub; high friction for regional trust building.` });
        }

        // Q2 Log
        if (q2 === 10) {
          logs.push({ type: "success", text: `[pass] Creators: Stable creator network exists to drive recurring retail waves.` });
        } else if (q2 === 5) {
          logs.push({ type: "warning", text: `[warn] Creators: Creator contact established, but single-pulse campaigns need alignment.` });
        } else {
          logs.push({ type: "error", text: `[fail] Creators: No creator distribution makes initial discovery difficult.` });
        }

        // Q3 Log
        if (q3 === 10) {
          logs.push({ type: "success", text: `[pass] Advocacy: Active ambassador team extends localized moderation muscle.` });
        } else if (q3 === 5) {
          logs.push({ type: "warning", text: `[warn] Advocacy: Strategy in planning. Establish task tracking to filter noise.` });
        } else {
          logs.push({ type: "error", text: `[fail] Advocacy: Lack of advocates makes moderation and local support resource-heavy.` });
        }

        // Q4 Log
        if (q4 === 10) {
          logs.push({ type: "success", text: `[pass] Localization: Dedicated Hinglish content maximizes regional conversion.` });
        } else if (q4 === 5) {
          logs.push({ type: "warning", text: `[warn] Localization: Basic translation active. Focus on native Hinglish rewrites.` });
        } else {
          logs.push({ type: "error", text: `[fail] Localization: English-only content fails to connect with 70%+ of retail users.` });
        }

        // Q5 Log
        if (q5 === 10) {
          logs.push({ type: "success", text: `[pass] Metrics: Granular India dashboard provides clean optimization loops.` });
        } else if (q5 === 5) {
          logs.push({ type: "warning", text: `[warn] Metrics: Basic geo-tracking active. Dedicated dashboard recommended.` });
        } else {
          logs.push({ type: "error", text: `[fail] Metrics: Lumping metrics in global hides actual CPA and regional drop-offs.` });
        }

        logs.push({ type: "info", text: `[done] Assessment completed. Score: ${score}/50 (${tier}).` });

        // Animate log typing/printing effect
        logs.forEach((log, index) => {
          setTimeout(() => {
            const div = document.createElement("div");
            div.className = `log-line log-${log.type}`;
            div.textContent = log.text;
            breakdownContent.appendChild(div);
          }, index * 150);
        });
      }
    });

    // Retake button handler
    const retakeBtn = document.getElementById("retake-btn");
    if (retakeBtn) {
      retakeBtn.addEventListener("click", () => {
        form.reset();
        
        // Reset submit button state
        const submitBtn = form.querySelector(".assessment-submit");
        if (submitBtn) {
          submitBtn.textContent = "Calculate My India Readiness →";
          submitBtn.disabled = false;
        }
        
        form.hidden = false;
        result.hidden = true;
        result.classList.remove("visible");
        
        // Reset circle dashoffset
        const arc = document.getElementById("score-arc");
        if (arc) {
          arc.style.strokeDashoffset = "326.7";
        }

        // FIX 8 — Reset progressive reveal state on retake
        const allQuestions = form.querySelectorAll(".assessment-question[data-question]");
        allQuestions.forEach(q => {
          q.classList.remove("question-revealed", "question-answered");
        });
        const emailSection = form.querySelector(".assessment-email");
        if (emailSection) emailSection.classList.remove("question-revealed");
        const submitBtnReveal = form.querySelector(".assessment-submit");
        if (submitBtnReveal) submitBtnReveal.classList.remove("question-revealed");
      });
    }
  }

  // FIX 8 START — INDIA READINESS PROGRESSIVE REVEAL
  function initProgressiveReveal() {
    const form = document.getElementById("assessment-form");
    if (!form) return;

    const totalQuestions = 5;
    const answeredState = {};

    // Listen for radio input changes on each question
    for (let i = 1; i <= totalQuestions; i++) {
      const radios = form.querySelectorAll(`input[type="radio"][name="q${i}"]`);
      radios.forEach(radio => {
        radio.addEventListener("change", () => {
          answeredState[i] = true;

          // Mark current question as answered
          const currentQ = form.querySelector(`.assessment-question[data-question="${i}"]`);
          if (currentQ) {
            currentQ.classList.add("question-answered");
          }

          // Reveal next question
          if (i < totalQuestions) {
            const nextQ = form.querySelector(`.assessment-question[data-question="${i + 1}"]`);
            if (nextQ && !nextQ.classList.contains("question-revealed")) {
              nextQ.classList.add("question-revealed");

              // Smooth scroll to next question after transition starts
              setTimeout(() => {
                nextQ.scrollIntoView({ behavior: "smooth", block: "center" });
              }, 200);
            }
          }

          // If all questions answered, reveal email section and submit button
          const allAnswered = Object.keys(answeredState).length >= totalQuestions;
          if (allAnswered) {
            const emailSection = form.querySelector(".assessment-email");
            const submitBtn = form.querySelector(".assessment-submit");

            if (emailSection && !emailSection.classList.contains("question-revealed")) {
              emailSection.classList.add("question-revealed");
            }

            setTimeout(() => {
              if (submitBtn && !submitBtn.classList.contains("question-revealed")) {
                submitBtn.classList.add("question-revealed");
                setTimeout(() => {
                  submitBtn.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 200);
              }
            }, 300);
          }
        });
      });
    }
  }
  // FIX 8 END

  // FIX 8 — Initialize progressive reveal
  initProgressiveReveal();
});
