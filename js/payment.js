const FlexistPayment = (() => {
  "use strict";

  const WALLETS = {
    ethereum: "0xB9807eBBb24b6E08A2ba4b87685542A3e6e14E25",
    bnb: "0xB9807eBBb24b6E08A2ba4b87685542A3e6e14E25",
    polygon: "0xB9807eBBb24b6E08A2ba4b87685542A3e6e14E25",
    base: "0xB9807eBBb24b6E08A2ba4b87685542A3e6e14E25",
    arbitrum: "0xB9807eBBb24b6E08A2ba4b87685542A3e6e14E25",
    solana: "GrpojUaB1pVpxEw6UmNGLWkMTPwhj3qorMM7CUeekvLV",
    tron: "TS3TSSFGtrUFPf7difKRMqP2rLH2MP9inA"
  };

  const WORKER_URL = "https://flexist-payment-verifier.flexistcrypto.workers.dev";
  const STORAGE_KEY = "flexist_payments";

  const CHAINS = [
    { id: "ethereum", name: "Ethereum", color: "#627EEA", tokens: ["ETH", "USDT"] },
    { id: "bnb",      name: "BNB Chain", color: "#F0B90B", tokens: ["BNB", "USDT"] },
    { id: "polygon",  name: "Polygon",   color: "#8247E5", tokens: ["POL", "USDT"] },
    { id: "solana",   name: "Solana",    color: "#14F195", tokens: ["SOL", "USDT"] },
    { id: "base",     name: "Base",      color: "#0052FF", tokens: ["ETH", "USDT"] },
    { id: "arbitrum", name: "Arbitrum",   color: "#28A0F0", tokens: ["ETH", "USDT"] },
    { id: "tron",     name: "TRON",      color: "#FF0013", tokens: ["TRX", "USDT"] }
  ];

  const CHAIN_ICONS = {
    ethereum: `<svg viewBox="0 0 24 24" class="chain-icon-svg"><path d="M11.944 17.854L4.72 13.59l7.224-4.264 7.22 4.264-7.22 4.264zm0-16.744L4.72 5.374l7.224 4.264 7.22-4.264-7.22-4.264zM4.72 6.55l7.224 4.264v7.915L4.72 14.464V6.55zm14.444 0v7.915l-7.22 4.264V10.814l7.22-4.264z" fill="currentColor"/></svg>`,
    bnb: `<svg viewBox="0 0 24 24" class="chain-icon-svg"><path d="M12 2l3.464 2v4L12 6 8.536 8v-4zm0 20l-3.464-2v-4L12 18l3.464-2v4zm8-8l2-3.464h-4l-2 3.464 2 3.464zm-16 0l-2-3.464h4l2 3.464-2 3.464zM12 9.5l2.165 1.25v2.5L12 14.5l-2.165-1.25v-2.5z" fill="currentColor"/></svg>`,
    polygon: `<svg viewBox="0 0 24 24" class="chain-icon-svg"><path d="M12 2.69l5.63 3.25v6.5L12 15.69l-5.63-3.25v-6.5zm0 18.62l-5.63-3.25v-6.5L12 14.81l5.63-3.25v6.5z" fill="currentColor"/></svg>`,
    solana: `<svg viewBox="0 0 24 24" class="chain-icon-svg"><path d="M3.73 5.4H20.27L17 8.67H.46L3.73 5.4ZM.46 11.23H17L20.27 14.5H3.73L.46 11.23ZM3.73 17.07H20.27L17 20.33H.46L3.73 17.07Z" fill="currentColor"/></svg>`,
    base: `<svg viewBox="0 0 24 24" class="chain-icon-svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="6" fill="currentColor"/></svg>`,
    arbitrum: `<svg viewBox="0 0 24 24" class="chain-icon-svg"><path d="M12 2L2 19.33h20L12 2zm0 6l5 8.67H7L12 8z" fill="currentColor"/></svg>`,
    tron: `<svg viewBox="0 0 24 24" class="chain-icon-svg"><path d="M12 2L2 22h20L12 2zm-1 5.3L17.7 18H6.3l4.7-10.7z" fill="currentColor"/></svg>`
  };

  function getWalletAddress(chainId) {
    if (!chainId) return WALLETS.ethereum;
    return WALLETS[chainId.toLowerCase()] || WALLETS.ethereum;
  }

  /* ── Helpers ─────────────────────────────────────────── */
  function getParams() {
    const p = new URLSearchParams(window.location.search);
    return {
      plan:   p.get("plan")   || "Custom",
      type:   p.get("type")   || "onetime",
      amount: p.get("amount") || "0"
    };
  }

  function generatePaymentId(planName, chainName) {
    const prefix = "FLX";
    const planShort = (planName || "CSM").slice(0, 3).toUpperCase();
    const chainShort = (chainName || "ETH").slice(0, 3).toUpperCase();
    const timestampBase36 = Date.now().toString(36).toUpperCase().slice(-5);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${planShort}-${chainShort}-${timestampBase36}${randomSuffix}`;
  }

  function savePayment(record) {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    all.unshift(record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function findPayment(query) {
    if (!query) return null;
    const cleanQuery = query.trim().toLowerCase();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return all.find(r => 
      (r.txid && r.txid.toLowerCase() === cleanQuery) || 
      (r.paymentId && r.paymentId.toLowerCase() === cleanQuery)
    ) || null;
  }

  function formatType(t) {
    return t === "monthly" ? "Monthly Retainer" : "One-Time Payment";
  }

  function validateTxid(txid, chainId) {
    if (!txid) return false;
    const cleanTxid = txid.trim();
    if (["ethereum", "bnb", "polygon", "base", "arbitrum"].includes(chainId)) {
      return /^0x[0-9a-fA-F]{64}$/.test(cleanTxid);
    } else if (chainId === "solana") {
      return /^[1-9A-HJ-NP-Za-km-z]{87,88}$/.test(cleanTxid);
    } else if (chainId === "tron") {
      return /^[0-9a-fA-F]{64}$/.test(cleanTxid);
    }
    return cleanTxid.length > 20;
  }

  /* ── QR Code Loader ──────────────────────────────────── */
  function loadQRLibrary() {
    return new Promise((resolve, reject) => {
      if (window.QRCode) return resolve();
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("QR library failed"));
      document.head.appendChild(s);
    });
  }

  function generateQR(container, text) {
    if (!container || !window.QRCode) return;
    container.innerHTML = "";
    new QRCode(container, {
      text: text,
      width: 200,
      height: 200,
      colorDark: "#f0f4ff",
      colorLight: "#0a1020",
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  /* ═══════════════════════════════════════════════════════
     PAYMENT INDEX PAGE
     ═══════════════════════════════════════════════════════ */
  function initPaymentPage() {
    const { plan, type, amount } = getParams();
    let selectedChain = null;
    let currentStep = 1;

    // Populate order summary
    const planEl = document.getElementById("order-plan");
    const typeEl = document.getElementById("order-type");
    const amountEl = document.getElementById("order-amount");
    if (planEl) planEl.textContent = plan;
    if (typeEl) typeEl.textContent = formatType(type);
    if (amountEl) amountEl.textContent = "$" + Number(amount).toLocaleString();

    // Hero subtitle
    const heroSub = document.getElementById("pay-hero-plan");
    if (heroSub) heroSub.textContent = plan !== "Custom" ? `Plan: ${plan}` : "";

    // Render chain cards
    const chainGrid = document.getElementById("chain-grid");
    if (chainGrid) {
      chainGrid.innerHTML = CHAINS.map(c => `
        <div class="chain-card" data-chain="${c.id}" style="--chain-color: ${c.color}">
          <div class="chain-icon">${CHAIN_ICONS[c.id] || c.name.charAt(0)}</div>
          <span class="chain-name">${c.name}</span>
          <span class="chain-tokens">${c.tokens.join(" · ")}</span>
        </div>
      `).join("");

      chainGrid.addEventListener("click", e => {
        const card = e.target.closest(".chain-card");
        if (!card) return;
        const chainId = card.dataset.chain;
        const chain = CHAINS.find(c => c.id === chainId);
        if (!chain) return;

        // Clear previous selection
        chainGrid.querySelectorAll(".chain-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedChain = chain;

        // Move to step 2
        goToStep(2);
      });
    }

    // Step management
    const panels = {
      1: document.getElementById("step-1"),
      2: document.getElementById("step-2"),
      3: document.getElementById("step-3")
    };
    const successPanel = document.getElementById("pay-success");

    const txidInput = document.getElementById("form-txid");
    const txidFeedback = document.getElementById("txid-feedback");
    const submitBtn = document.getElementById("btn-submit");

    function checkTxid() {
      if (!txidInput) return;
      const val = txidInput.value.trim();
      const chainId = selectedChain ? selectedChain.id : "";
      
      if (!val) {
        txidInput.classList.remove("is-valid", "is-invalid");
        if (txidFeedback) txidFeedback.textContent = "";
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      const isValid = validateTxid(val, chainId);
      if (isValid) {
        txidInput.classList.remove("is-invalid");
        txidInput.classList.add("is-valid");
        if (txidFeedback) {
          txidFeedback.textContent = "✓ Valid transaction hash format";
          txidFeedback.className = "txid-feedback valid";
        }
        if (submitBtn) submitBtn.disabled = false;
      } else {
        txidInput.classList.remove("is-valid");
        txidInput.classList.add("is-invalid");
        if (txidFeedback) {
          let expectedFormat = "transaction hash";
          if (chainId === "solana") expectedFormat = "Solana signature (87-88 chars)";
          else if (["ethereum", "bnb", "polygon", "base", "arbitrum"].includes(chainId)) expectedFormat = "EVM hash (66 chars starting with 0x)";
          else if (chainId === "tron") expectedFormat = "TRON hash (64 hex chars)";
          txidFeedback.textContent = "Invalid format. Expected " + expectedFormat;
          txidFeedback.className = "txid-feedback invalid";
        }
        if (submitBtn) submitBtn.disabled = true;
      }
    }

    if (txidInput) {
      txidInput.addEventListener("input", checkTxid);
    }

    function goToStep(step) {
      currentStep = step;

      // Update step indicators
      document.querySelectorAll(".pay-step").forEach(el => {
        const s = parseInt(el.dataset.step);
        el.classList.remove("active", "completed");
        if (s < step) el.classList.add("completed");
        if (s === step) el.classList.add("active");
      });

      // Fill step lines
      document.querySelectorAll(".pay-step-line").forEach(el => {
        const after = parseInt(el.dataset.after);
        el.classList.toggle("filled", after < step);
      });

      // Show/hide panels
      for (const [k, panel] of Object.entries(panels)) {
        if (panel) {
          if (parseInt(k) === step) {
            panel.hidden = false;
            panel.style.animation = "none";
            panel.offsetHeight; // force reflow
            panel.style.animation = "";
          } else {
            panel.hidden = true;
          }
        }
      }

      // Setup step 2 content
      if (step === 2 && selectedChain) {
        const activeWallet = getWalletAddress(selectedChain.id);
        const chainLabel = document.getElementById("wallet-chain");
        if (chainLabel) chainLabel.textContent = `● ${selectedChain.name} Network`;

        const addrEl = document.getElementById("wallet-addr");
        if (addrEl) addrEl.textContent = activeWallet;

        const warningChain = document.getElementById("warning-chain");
        if (warningChain) warningChain.textContent = selectedChain.name;

        // Generate QR
        loadQRLibrary().then(() => {
          const qrContainer = document.getElementById("qr-container");
          generateQR(qrContainer, activeWallet);
        }).catch(() => {});
      }

      // Setup step 3 form
      if (step === 3 && selectedChain) {
        const chainSelect = document.getElementById("form-chain");
        if (chainSelect) chainSelect.value = selectedChain.id;

        const tokenSelect = document.getElementById("form-token");
        if (tokenSelect) {
          tokenSelect.innerHTML = selectedChain.tokens.map(t =>
            `<option value="${t}">${t}</option>`
          ).join("");
        }

        const amountInput = document.getElementById("form-amount");
        if (amountInput && amount !== "0") amountInput.value = amount;

        checkTxid();
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Copy wallet address
    const copyBtn = document.getElementById("copy-wallet");
    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const activeWallet = getWalletAddress(selectedChain ? selectedChain.id : null);
        try {
          await navigator.clipboard.writeText(activeWallet);
          copyBtn.classList.add("copied");
          copyBtn.innerHTML = "✓ Copied";
          setTimeout(() => {
            copyBtn.classList.remove("copied");
            copyBtn.innerHTML = "⧉ Copy";
          }, 2500);
        } catch {
          // Fallback
          const ta = document.createElement("textarea");
          ta.value = activeWallet;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          copyBtn.classList.add("copied");
          copyBtn.innerHTML = "✓ Copied";
          setTimeout(() => {
            copyBtn.classList.remove("copied");
            copyBtn.innerHTML = "⧉ Copy";
          }, 2500);
        }
      });
    }

    // "I have sent" button
    const sentBtn = document.getElementById("btn-sent");
    if (sentBtn) {
      sentBtn.addEventListener("click", () => goToStep(3));
    }

    // Back buttons
    document.querySelectorAll("[data-back]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = parseInt(btn.dataset.back);
        goToStep(target);
      });
    });

    // Confirmation form submission
    const form = document.getElementById("pay-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());

        // Hide any previous error message on submission retry
        const existingError = form.querySelector(".form-error-msg");
        if (existingError) existingError.hidden = true;

        // Show loading state
        const submitBtn = form.querySelector("button[type='submit']");
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="pay-spinner" style="display:inline-block;width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:rotate 800ms linear infinite;vertical-align:middle;margin-right:8px"></span> Verifying transaction on-chain...';

        // Obtain Turnstile challenge token
        let turnstileToken = "";
        if (window.turnstile) {
          turnstileToken = window.turnstile.getResponse();
        }

        if (!turnstileToken) {
          // Fallback to checking the formdata input if Turnstile was rendered directly
          turnstileToken = fd.get("cf-turnstile-response") || "";
        }

        // Submit to Cloudflare Worker verifier endpoint
        try {
          const payload = {
            plan: plan,
            paymentType: type,
            chain: data.chain,
            token: data.token,
            txHash: data.txid,
            name: data.name,
            email: data.email,
            telegram: data.telegram,
            project: data.project,
            turnstileToken: turnstileToken
          };

          const res = await fetch(`${WORKER_URL}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.error || "Payment verification failed.");
          }

          // Save transaction to local cache for UI history logs (Optional local records)
          const txRecord = {
            paymentId: result.paymentId,
            name: data.name,
            email: data.email,
            telegram: data.telegram,
            projectName: data.project,
            plan: plan,
            amount_sent: result.actualAmount || 0,
            chain: data.chain,
            token: data.token,
            txid: data.txid,
            timestamp: new Date().toISOString(),
            status: "verified"
          };
          savePayment(txRecord);

          // Show success screen
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;

          for (const panel of Object.values(panels)) {
            if (panel) panel.hidden = true;
          }

          if (successPanel) {
            successPanel.hidden = false;
            const txEl = document.getElementById("success-txid");
            if (txEl) {
              txEl.innerHTML = `
                <strong>Payment Reference ID:</strong><br/>
                <code style="font-size:1.15rem;color:var(--accent-cyan);font-family:var(--font-mono);">${result.paymentId}</code><br/><br/>
                <strong>Transaction Hash (TxID):</strong><br/>
                <code style="font-size:0.85rem;color:var(--text-secondary);font-family:var(--font-mono);">${data.txid || "—"}</code>
              `;
            }
          }

          // Update steps to all completed
          document.querySelectorAll(".pay-step").forEach(el => el.classList.add("completed"));
          document.querySelectorAll(".pay-step-line").forEach(el => el.classList.add("filled"));

          // Redirect after delay
          setTimeout(() => {
            window.location.href = `thank-you.html?paymentId=${encodeURIComponent(result.paymentId)}`;
          }, 3000);

        } catch (err) {
          // Display error message directly on the page
          let errorEl = form.querySelector(".form-error-msg");
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
            form.insertBefore(errorEl, form.querySelector(".pay-action-row"));
          }
          errorEl.textContent = `Verification Failed: ${err.message}`;
          errorEl.hidden = false;

          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          if (window.turnstile) {
            window.turnstile.reset();
          }
        }
      });
    }

    // Initialize step 1
    goToStep(1);
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
          const statusLabel = statusClass.charAt(0).toUpperCase() + statusClass.slice(1);
          
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
      const statusLabel = statusClass.charAt(0).toUpperCase() + statusClass.slice(1);

      document.getElementById("res-badge").className = `status-badge ${statusClass}`;
      document.getElementById("res-badge").textContent = statusLabel;
      document.getElementById("res-name").textContent = record.name || "—";
      document.getElementById("res-email").textContent = record.email || "—";
      document.getElementById("res-plan").textContent = record.plan || "—";
      document.getElementById("res-chain").textContent = record.chain || "—";
      document.getElementById("res-token").textContent = record.token || "—";
      document.getElementById("res-amount").textContent = record.actual_amount ? "$" + record.actual_amount : (record.expected_amount ? "$" + record.expected_amount : "—");
      document.getElementById("res-txid").textContent = record.tx_hash || record.txid || "—";
      
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
    const urlParams = new URLSearchParams(window.location.search);
    const urlPaymentId = urlParams.get("paymentId");

    if (urlPaymentId) {
      if (paymentIdEl) paymentIdEl.textContent = urlPaymentId;
      const parent = document.querySelector("[data-ty-txid]");
      if (parent) parent.hidden = false;

      // Query database via Worker dynamically using the paymentId to resolve details
      try {
        const res = await fetch(`${WORKER_URL}/payment-status?txid=${encodeURIComponent(urlPaymentId)}`);
        const result = await res.json();
        if (res.ok && result.payment) {
          if (txidEl) txidEl.textContent = result.payment.tx_hash || "—";
          if (planEl && result.payment.plan) {
            planEl.textContent = result.payment.plan;
          }
        }
      } catch (err) {
        console.error("Failed to fetch payment details for thank you page status", err);
      }
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

  return { init, CHAINS, WALLETS, findPayment, generatePaymentId };
})();
