document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  const note = document.querySelector("[data-contact-note]");
  const clock = document.querySelector("[data-ist-clock]");

  // 1. Live IST clock ticking
  function updateClock() {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  // 2. Topic chips interactive selector
  const hiddenTopicInput = document.getElementById("contact-topic");
  const topicChips = document.querySelectorAll("#topicChips .topic-chip");

  topicChips.forEach(chip => {
    chip.addEventListener("click", () => {
      topicChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      if (hiddenTopicInput) {
        hiddenTopicInput.value = chip.dataset.value;
      }
    });
  });

  // 3. Message character counter
  const messageInput = document.getElementById("contact-message");
  const charCounter = document.getElementById("charCounter");

  if (messageInput && charCounter) {
    const handleCharCount = () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      charCounter.classList.remove("cnt-short", "cnt-good", "cnt-long");

      if (len === 0 || len < 100) {
        charCounter.classList.add("cnt-short");
      } else if (len <= 500) {
        charCounter.classList.add("cnt-good");
      } else {
        charCounter.classList.add("cnt-long");
      }
    };

    messageInput.addEventListener("input", handleCharCount);
    // Initial trigger
    handleCharCount();
  }

  if (!form || !note) return;

  // 4. Form Validation & Error Styling
  function showFieldError(element, message) {
    if (!element) return;
    element.classList.add("error-border");
    const container = element.closest(".field");
    if (container) {
      let errorMsg = container.querySelector(".error-message");
      if (!errorMsg) {
        errorMsg = document.createElement("span");
        errorMsg.className = "error-message";
        container.appendChild(errorMsg);
      }
      errorMsg.textContent = message;
    }
  }

  function clearFieldError(element) {
    if (!element) return;
    element.classList.remove("error-border");
    const container = element.closest(".field");
    if (container) {
      const errorMsg = container.querySelector(".error-message");
      if (errorMsg) errorMsg.remove();
    }
  }

  function validateForm() {
    let isValid = true;
    let firstInvalidEl = null;

    // Clear previous highlights
    document.querySelectorAll(".error-border").forEach(el => el.classList.remove("error-border"));
    document.querySelectorAll(".error-message").forEach(el => el.remove());

    const nameInput = document.getElementById("contact-name");
    const emailInput = document.getElementById("contact-email");

    if (nameInput && !nameInput.value.trim()) {
      isValid = false;
      showFieldError(nameInput, "Your name is required.");
      if (!firstInvalidEl) firstInvalidEl = nameInput;
    }

    if (emailInput) {
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        isValid = false;
        showFieldError(emailInput, "Your email is required.");
        if (!firstInvalidEl) firstInvalidEl = emailInput;
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailVal)) {
          isValid = false;
          showFieldError(emailInput, "Please enter a valid email address.");
          if (!firstInvalidEl) firstInvalidEl = emailInput;
        }
      }
    }

    if (messageInput && !messageInput.value.trim()) {
      isValid = false;
      showFieldError(messageInput, "A message is required.");
      if (!firstInvalidEl) firstInvalidEl = messageInput;
    }

    if (firstInvalidEl) {
      firstInvalidEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return isValid;
  }

  // Real-time validation clearance
  document.getElementById("contact-name").addEventListener("input", function() {
    if (this.value.trim()) clearFieldError(this);
  });
  document.getElementById("contact-email").addEventListener("input", function() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value.trim() && emailPattern.test(this.value.trim())) {
      clearFieldError(this);
    }
  });
  if (messageInput) {
    messageInput.addEventListener("input", function() {
      if (this.value.trim()) clearFieldError(this);
    });
  }

  // 5. Success State Card Renderer
  function renderSuccessState() {
    const aside = document.querySelector(".direct-brief");
    if (!aside) return;

    // Replace the inner contents of direct-brief aside with success card details
    aside.innerHTML = `
      <div class="success-card" style="opacity: 0; transform: translateY(10px);">
        <div class="success-icon">✓</div>
        <h3>Message received.</h3>
        <p>Flexist will reply within 24 hours. Check your inbox or Telegram.</p>
        <a class="ghost-button" href="./">Go back to Homepage</a>
      </div>
    `;

    const successCard = aside.querySelector(".success-card");
    if (successCard) {
      // Transition fade-in slide up
      requestAnimationFrame(() => {
        successCard.style.transition = "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        successCard.style.opacity = "1";
        successCard.style.transform = "translateY(0)";
      });
    }
  }

  // 6. Submit handler with loading and success integrations
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Client-side validations
    if (!validateForm()) return;

    const submitBtn = form.querySelector("button[type='submit']");
    const originalBtnText = submitBtn.textContent;

    // Loading states
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    note.textContent = "";

    // Web3Forms API submission
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form)
    })
    .then(async (response) => {
      const res = await response.json();
      if (response.ok && res.success) {
        form.reset();
        renderSuccessState();
      } else {
        throw new Error(res.message || "Something went wrong.");
      }
    })
    .catch((err) => {
      // Restore submit button
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
      note.textContent = err.message || "Failed to send message. Please try again.";
      note.classList.add("error-message");
    });
  });
});
