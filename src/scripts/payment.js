const FlexistPayment = (() => {
  "use strict";

  const WORKER_URL = "https://flexist-payment-verifier.flexistcrypto.workers.dev";
  const STORAGE_KEY = "flexist_payments";

  function getParams() {
    const p = new URLSearchParams(window.location.search);
    return {
      plan:   p.get("plan")   || "Custom",
      type:   p.get("type")   || "onetime",
      amount: p.get("amount") || "0"
    };
  }

  function savePayment(record) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    all.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function formatType(t) {
    return t === "monthly" ? "Monthly Retainer" : "One-Time Payment";
  }

  /* ═══════════════════════════════════════════════════════
     PAYMENT INDEX PAGE
     ═══════════════════════════════════════════════════════ */
  function initPaymentPage() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Default to Custom plan if no plan is specified
    let { plan, type, amount } = getParams();
    let isCustomPlan = false;

    if (!urlParams.has("plan")) {
      plan = "Custom";
      type = "onetime";
      amount = "0";
      isCustomPlan = true;
    } else if (plan.toLowerCase() === "custom") {
      isCustomPlan = true;
    }

    // Populate onboarding details from URL query parameters if present
    const nameParam = urlParams.get("name");
    const emailParam = urlParams.get("email");
    const telegramParam = urlParams.get("telegram");
    const projectParam = urlParams.get("project");
    if (nameParam) {
      const nameInput = document.getElementById("form-name");
      if (nameInput) nameInput.value = nameParam;
    }
    if (emailParam) {
      const emailInput = document.getElementById("form-email");
      if (emailInput) emailInput.value = emailParam;
    }
    if (telegramParam) {
      const telegramInput = document.getElementById("form-telegram");
      if (telegramInput) telegramInput.value = telegramParam;
    }
    if (projectParam) {
      const projectInput = document.getElementById("form-project");
      if (projectInput) projectInput.value = projectParam;
    }

    // Populate order summary
    const planEl = document.getElementById("order-plan");
    const typeEl = document.getElementById("order-type");
    const amountEl = document.getElementById("order-amount");
    if (planEl) planEl.textContent = plan;
    if (typeEl) typeEl.textContent = formatType(type);
    
    if (isCustomPlan) {
      // Show custom amount field in the form
      const amountRow = document.getElementById("custom-amount-row");
      if (amountRow) amountRow.style.display = "block";
      const amountInput = document.getElementById("form-amount");
      if (amountInput) {
        amountInput.required = true;
        if (amount && amount !== "0") {
          amountInput.value = amount;
          if (amountEl) amountEl.textContent = "$" + Number(amount).toLocaleString();
        } else {
          if (amountEl) amountEl.textContent = "—";
        }
        
        // Dynamically update Order Summary amount on input
        amountInput.addEventListener("input", () => {
          const val = amountInput.value || "0";
          if (amountEl) {
            amountEl.textContent = val !== "0" && val !== "" ? "$" + Number(val).toLocaleString() : "—";
          }
        });
      }
    } else {
      if (amountEl) amountEl.textContent = "$" + Number(amount).toLocaleString();
    }

    // Update change-plan link anchor
    const changeLink = document.getElementById("change-plan-link");
    if (changeLink) {
      let anchor = "";
      if (plan.toLowerCase().includes("entry")) anchor = "#plan-india-entry";
      else if (plan.toLowerCase().includes("growth")) anchor = "#plan-india-growth";
      else if (plan.toLowerCase().includes("partner")) anchor = "#plan-india-partner";
      changeLink.href = `../plans${anchor}`;
    }

    // Hero subtitle
    const heroSub = document.getElementById("pay-hero-plan");
    if (heroSub) heroSub.textContent = plan !== "Custom" ? `Plan: ${plan}` : "Plan: Custom Invoice";

    const form = document.getElementById("checkout-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Clear previous error message
        let errorEl = form.querySelector(".form-error-msg");
        if (errorEl) errorEl.hidden = true;

        const submitBtn = document.getElementById("btn-submit");
        const originalText = submitBtn.innerHTML;

        // Collect inputs
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());

        // For custom plan, get amount directly from form input
        const finalAmount = isCustomPlan ? data.amount : amount;

        if (isCustomPlan && (!finalAmount || parseFloat(finalAmount) <= 0)) {
          alert("Please enter a valid payment amount.");
          return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="pay-spinner" style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:rotate 800ms linear infinite;vertical-align:middle;margin-right:8px"></span> Redirecting to secure payment checkout...';

        try {
          const payload = {
            plan: plan,
            paymentType: type,
            name: data.name,
            email: data.email,
            telegram: data.telegram,
            project: data.project,
            amount: finalAmount
          };

          const res = await fetch(`${WORKER_URL}/create-nowpayment-invoice`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          let result = {};
          try {
            result = await res.json();
          } catch (_) {
            // Worker unreachable or returned non-JSON (e.g. a 404 "Not Found" page).
            result = {};
          }
          if (!res.ok || !result.invoiceUrl) {
            throw new Error(result.error || "checkout-unavailable");
          }

          // Save transaction to local cache for status history
          const txRecord = {
            paymentId: result.paymentId,
            name: data.name,
            email: data.email,
            telegram: data.telegram,
            projectName: data.project,
            plan: plan,
            amount_sent: finalAmount,
            chain: "NOWPayments",
            token: "crypto",
            txid: "",
            timestamp: new Date().toISOString(),
            status: "pending_payment"
          };
          savePayment(txRecord);

          // Redirect to invoice page
          window.location.href = result.invoiceUrl;

        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          // Display error
          if (!errorEl) {
            errorEl = document.createElement("div");
            errorEl.className = "form-error-msg";
            errorEl.style.color = "var(--accent-red, #ff4a4a)";
            errorEl.style.backgroundColor = "rgba(255, 74, 74, 0.1)";
            errorEl.style.border = "1px solid rgba(255, 74, 74, 0.2)";
            errorEl.style.padding = "12px";
            errorEl.style.borderRadius = "6px";
            errorEl.style.marginTop = "15px";
            errorEl.style.fontSize = "0.9rem";
            errorEl.style.textAlign = "center";
            form.appendChild(errorEl);
          }
          const known = err && err.message && err.message !== "checkout-unavailable";
          const detail = known
            ? `<span style="display:block;margin-bottom:8px;font-weight:600">${err.message}</span>`
            : "";
          errorEl.innerHTML = `${detail}Automatic checkout is temporarily unavailable. To finish your payment, message us on <a href="https://t.me/FlexistCrypto" target="_blank" rel="noreferrer" style="color:var(--accent-cyan);font-weight:600;text-decoration:underline">Telegram @FlexistCrypto</a> or email <a href="mailto:FlexistCrypto@gmail.com" style="color:var(--accent-cyan);font-weight:600;text-decoration:underline">FlexistCrypto@gmail.com</a> and we'll set it up for you personally.`;
          errorEl.hidden = false;
        }
      });
    }
  }

  /* ═══════════════════════════════════════════════════════
     STATUS PAGE
     ═══════════════════════════════════════════════════════ */
  function initStatusPage() {
    const searchForm = document.getElementById("status-search-form");
    const resultDiv = document.getElementById("status-result");
    const emptyDiv = document.getElementById("status-empty");
    const loadingDiv = document.getElementById("status-loading");

    if (!searchForm) return;

    // Load and render payment history table
    const historyRows = document.getElementById("history-rows");
    const noHistoryMsg = document.getElementById("no-history-msg");
    const historyTable = document.getElementById("history-table");

    function renderHistory() {
      if (!historyRows) return;
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      
      if (all.length === 0) {
        if (historyTable) historyTable.style.display = "none";
        if (noHistoryMsg) noHistoryMsg.style.display = "block";
      } else {
        if (historyTable) historyTable.style.display = "table";
        if (noHistoryMsg) noHistoryMsg.style.display = "none";
        
        historyRows.innerHTML = all.map(record => {
          const dateObj = new Date(record.timestamp);
          const dateStr = dateObj.toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
          
          const statusClass = record.status || "pending";
          const statusLabel = statusClass === "pending_payment" ? "Pending" : (statusClass.charAt(0).toUpperCase() + statusClass.slice(1));
          
          return `
            <tr>
              <td data-label="Date">${dateStr}</td>
              <td data-label="Reference ID">
                <code class="ref-code">${record.paymentId || "—"}</code>
              </td>
              <td data-label="Plan">${record.plan || "—"}</td>
              <td data-label="Amount">$${record.amount_sent || "—"}</td>
              <td data-label="Chain/Token">
                <span class="chain-badge">${record.token} (${record.chain})</span>
              </td>
              <td data-label="Status">
                <span class="status-badge ${statusClass}">${statusLabel}</span>
              </td>
            </tr>
          `;
        }).join("");
      }
    }

    renderHistory();

    searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = document.getElementById("status-txid");
      const txid = (input.value || "").trim();
      if (!txid) return;

      // Show loading
      if (resultDiv) resultDiv.hidden = true;
      if (emptyDiv) emptyDiv.hidden = true;
      if (loadingDiv) loadingDiv.hidden = false;

      try {
        const res = await fetch(`${WORKER_URL}/payment-status?txid=${encodeURIComponent(txid)}`);
        const result = await res.json();
        
        if (loadingDiv) loadingDiv.hidden = true;
        
        if (!res.ok || !result.payment) {
          throw new Error(result.error || "Payment record not found.");
        }
        
        showStatusResult(result.payment);
      } catch (err) {
        if (loadingDiv) loadingDiv.hidden = true;
        if (emptyDiv) {
          emptyDiv.hidden = false;
          emptyDiv.textContent = `Search failed: ${err.message}`;
        }
      }
    });

    function showStatusResult(record) {
      if (!resultDiv) return;
      resultDiv.hidden = false;

      const statusClass = record.status || "pending";
      const statusLabel = statusClass === "pending_payment" ? "Pending" : (statusClass.charAt(0).toUpperCase() + statusClass.slice(1));

      document.getElementById("res-badge").className = `status-badge ${statusClass}`;
      document.getElementById("res-badge").textContent = statusLabel;
      document.getElementById("res-name").textContent = record.name || "—";
      document.getElementById("res-email").textContent = record.email || "—";
      document.getElementById("res-plan").textContent = record.plan || "—";
      document.getElementById("res-chain").textContent = record.chain || "NOWPayments";
      document.getElementById("res-token").textContent = record.token || "crypto";
      document.getElementById("res-amount").textContent = record.actual_amount ? "$" + record.actual_amount : (record.expected_amount ? "$" + record.expected_amount : "—");
      document.getElementById("res-txid").textContent = record.tx_hash || record.txid || record.id || "—";
      
      const rawDate = record.created_at || record.timestamp;
      document.getElementById("res-date").textContent = rawDate ? new Date(rawDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    }
  }

  /* ═══════════════════════════════════════════════════════
     THANK YOU PAGE
     ═══════════════════════════════════════════════════════ */
  async function initThankYouPage() {
    const params = getParams();
    const planEl = document.getElementById("ty-plan");
    if (planEl && params.plan !== "Custom") {
      planEl.textContent = params.plan;
    }

    const txidEl = document.getElementById("ty-txid");
    const paymentIdEl = document.getElementById("ty-payment-id");
    const statusEl = document.getElementById("ty-status");
    const urlParams = new URLSearchParams(window.location.search);
    const urlPaymentId = urlParams.get("paymentId");

    if (urlPaymentId) {
      if (paymentIdEl) paymentIdEl.textContent = urlPaymentId;
      const parent = document.querySelector("[data-ty-txid]");
      if (parent) parent.hidden = false;

      let checkInterval;
      
      async function checkStatus() {
        try {
          const res = await fetch(`${WORKER_URL}/payment-status?txid=${encodeURIComponent(urlPaymentId)}`);
          const result = await res.json();
          if (res.ok && result.payment) {
            if (txidEl && result.payment.tx_hash) {
              txidEl.textContent = result.payment.tx_hash;
            }
            if (planEl && result.payment.plan) {
              planEl.textContent = result.payment.plan;
            }
            
            const status = result.payment.status;
            
            // Local Cache Sync
            const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            const cachedIndex = all.findIndex(r => r.paymentId === urlPaymentId);
            if (cachedIndex !== -1) {
              all[cachedIndex].status = status;
              if (result.payment.tx_hash) {
                all[cachedIndex].txid = result.payment.tx_hash;
              }
              localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            }

            if (status === "verified") {
              if (statusEl) {
                statusEl.className = "status-badge verified";
                statusEl.textContent = "Verified";
              }
              
              // Add Join Discussion Bot button
              showTelegramBotButton(urlPaymentId);

              // Stop Polling
              clearInterval(checkInterval);
            } else {
              if (statusEl) {
                statusEl.className = "status-badge pending";
                statusEl.textContent = "Verifying On-Chain";
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch payment status:", err);
        }
      }

      function showTelegramBotButton(paymentId) {
        // Find or create CTA bot button
        let ctaContainer = document.getElementById("onboarding-cta-container");
        if (!ctaContainer) {
          const actionsGrid = document.querySelector(".ty-actions");
          if (actionsGrid) {
            // Prepend a nice card for direct onboarding
            const botCard = document.createElement("a");
            botCard.id = "onboarding-cta-container";
            botCard.className = "ty-action-card reveal visible";
            botCard.style.borderColor = "var(--accent-green)";
            botCard.style.background = "rgba(0, 255, 136, 0.03)";
            botCard.href = `https://t.me/FlexistGroupBot?start=inquiry_${paymentId}`;
            botCard.target = "_blank";
            botCard.innerHTML = `
              <div class="ty-action-icon" style="color: var(--accent-green);">🚀</div>
              <h3>Join Discussion Group</h3>
              <p>Your thread is active! Click here to launch our onboarding bot and enter your project supergroup thread.</p>
            `;
            actionsGrid.insertBefore(botCard, actionsGrid.firstChild);
          }
        }
      }

      // Initial check & start polling
      await checkStatus();
      checkInterval = setInterval(checkStatus, 3000);
    }
  }

  /* ── Router ──────────────────────────────────────────── */
  function init() {
    const page = document.body.dataset.page;
    if (page === "payment") initPaymentPage();
    else if (page === "payment-status") initStatusPage();
    else if (page === "payment-thankyou") initThankYouPage();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { init, findPayment: () => null };
})();
