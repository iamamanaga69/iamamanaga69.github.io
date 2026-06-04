/* ===================================================================
   FLEXIST — Onboarding JavaScript
   Brief form, portal data, checklist persistence, welcome page
   =================================================================== */
(() => {
  "use strict";

  const WEB3FORMS_KEY = "8188cc9d-3ea6-45ee-b6a4-bde1a146e6a0";
  const LS_PAYMENTS = "flexist_payments";
  const LS_BRIEFS = "flexist_briefs";
  const LS_CHECKLIST = "flexist_checklist";

  /* ─── Utility ─── */
  function lsGet(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }
  function lsSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /* ─── Welcome Page ─── */
  function initWelcome() {
    const container = document.querySelector("[data-welcome-receipt]");
    if (!container) return;

    const payments = lsGet(LS_PAYMENTS);
    if (!payments || !payments.length) {
      container.innerHTML = '<p class="empty-state">No payment data found. Complete a payment first.</p>';
      return;
    }

    const last = payments[payments.length - 1];
    container.innerHTML = `
      <div class="receipt-head">Payment Receipt</div>
      <div class="receipt-body">
        <div class="receipt-row">
          <span class="receipt-label">Plan</span>
          <span class="receipt-value">${last.plan || "—"}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Type</span>
          <span class="receipt-value">${last.type || "—"}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Amount</span>
          <span class="receipt-value">${last.amount ? "$" + last.amount + " USDT" : "—"}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Chain</span>
          <span class="receipt-value">${last.chain || "—"}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">TxID</span>
          <span class="receipt-value" style="word-break:break-all;max-width:260px">${last.txid || "—"}</span>
        </div>
        <div class="receipt-row">
          <span class="receipt-label">Status</span>
          <span class="receipt-value" style="color:var(--accent-green)">${last.status || "Pending"}</span>
        </div>
      </div>`;
  }

  /* ─── Brief Form ─── */
  function initBriefForm() {
    const form = document.getElementById("briefForm");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      /* Collect multi-select goals */
      const goals = [];
      form.querySelectorAll('input[name="goals"]:checked').forEach((cb) => {
        goals.push(cb.value);
      });
      data.goals = goals.join(", ");
      data.timestamp = new Date().toISOString();

      /* Save to localStorage */
      const briefs = lsGet(LS_BRIEFS) || [];
      briefs.push(data);
      lsSet(LS_BRIEFS, briefs);

      /* Submit to Web3Forms */
      try {
        const payload = new FormData();
        payload.append("access_key", WEB3FORMS_KEY);
        payload.append("subject", "FLEXIST Brief: " + (data.project_name || "Unknown"));
        Object.entries(data).forEach(([k, v]) => payload.append(k, v));

        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: payload,
        });
      } catch {
        /* Silently fail — data is saved locally */
      }

      /* Show success state */
      form.style.display = "none";
      const success = document.getElementById("briefSuccess");
      if (success) success.style.display = "flex";

      /* Redirect to portal after 3 seconds */
      setTimeout(() => {
        window.location.href = "portal";
      }, 3000);
    });
  }

  /* ─── Portal ─── */
  function initPortal() {
    const planContainer = document.querySelector("[data-portal-plan]");
    const briefContainer = document.querySelector("[data-portal-brief]");

    /* Plan Status */
    if (planContainer) {
      const payments = lsGet(LS_PAYMENTS);
      if (payments && payments.length) {
        const last = payments[payments.length - 1];
        planContainer.innerHTML = `
          <div class="receipt-row"><span class="receipt-label">Plan</span><span class="receipt-value">${last.plan || "—"}</span></div>
          <div class="receipt-row"><span class="receipt-label">Type</span><span class="receipt-value">${last.type || "—"}</span></div>
          <div class="receipt-row"><span class="receipt-label">Amount</span><span class="receipt-value">${last.amount ? "$" + last.amount : "—"}</span></div>
          <div class="receipt-row"><span class="receipt-label">Status</span><span class="receipt-value" style="color:var(--accent-green)">${last.status || "Pending"}</span></div>`;
      } else {
        planContainer.innerHTML = '<p class="empty-state">No active plan found. <a href="../plans/" style="color:var(--accent-cyan)">Choose a plan →</a></p>';
      }
    }

    /* Brief Status */
    if (briefContainer) {
      const briefs = lsGet(LS_BRIEFS);
      if (briefs && briefs.length) {
        const last = briefs[briefs.length - 1];
        briefContainer.innerHTML = `
          <div class="receipt-row"><span class="receipt-label">Project</span><span class="receipt-value">${last.project_name || "—"}</span></div>
          <div class="receipt-row"><span class="receipt-label">Blockchain</span><span class="receipt-value">${last.blockchain || "—"}</span></div>
          <div class="receipt-row"><span class="receipt-label">Goals</span><span class="receipt-value" style="max-width:220px;text-align:right">${last.goals || "—"}</span></div>
          <div class="receipt-row"><span class="receipt-label">Submitted</span><span class="receipt-value">${last.timestamp ? new Date(last.timestamp).toLocaleDateString() : "—"}</span></div>`;
      } else {
        briefContainer.innerHTML = '<p class="empty-state">No brief submitted yet. <a href="brief" style="color:var(--accent-cyan)">Submit brief →</a></p>';
      }
    }

    /* Checklist */
    initChecklist();
  }

  function initChecklist() {
    const checklist = document.querySelector("[data-checklist]");
    if (!checklist) return;

    const saved = lsGet(LS_CHECKLIST) || {};
    const items = checklist.querySelectorAll(".checklist-item");
    let total = items.length;

    function updateProgress() {
      const checked = Object.values(lsGet(LS_CHECKLIST) || {}).filter(Boolean).length;
      const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
      const fill = document.querySelector("[data-progress-fill]");
      const label = document.querySelector("[data-progress-label]");
      if (fill) fill.style.width = pct + "%";
      if (label) label.textContent = checked + " / " + total + " complete";
    }

    items.forEach((item) => {
      const cb = item.querySelector('input[type="checkbox"]');
      const key = cb.dataset.key;

      if (saved[key]) {
        cb.checked = true;
        item.classList.add("checked");
      }

      cb.addEventListener("change", () => {
        const current = lsGet(LS_CHECKLIST) || {};
        current[key] = cb.checked;
        lsSet(LS_CHECKLIST, current);
        item.classList.toggle("checked", cb.checked);
        updateProgress();
      });
    });

    updateProgress();
  }

  /* ─── Init on DOMContentLoaded ─── */
  document.addEventListener("DOMContentLoaded", () => {
    initWelcome();
    initBriefForm();
    initPortal();
  });
})();
