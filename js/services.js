// // FIX 5 & 6 — Services Bottom Drawer and Tab Switcher
(() => {
  "use strict";

  // Cache stylesheet loader
  function loadStyles(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  // Dynamic script runner
  async function loadAndExecuteScript(scriptUrl) {
    try {
      const res = await fetch(scriptUrl);
      if (!res.ok) throw new Error(`Script fetch failed: ${res.status}`);
      const code = await res.text();
      
      // Clean previous dynamic script tag
      const oldScript = document.querySelector(`script[data-dynamic-source="${scriptUrl}"]`);
      if (oldScript) oldScript.remove();

      // Rewrite DOMContentLoaded listener to IIFE for synchronous execution
      const cleanCode = code
        .replace(/document\.addEventListener\(\s*['"]DOMContentLoaded['"]\s*,\s*(\(\)\s*=>|function\s*\(\))\s*\{/, "(() => {")
        .replace(/\}\)\s*;\s*$/, "})();");

      const scriptEl = document.createElement("script");
      scriptEl.textContent = cleanCode;
      scriptEl.setAttribute("data-dynamic-source", scriptUrl);
      document.body.appendChild(scriptEl);
    } catch (err) {
      console.error("Failed to run dynamic page script:", err);
    }
  }

  function initTabSwitcher() {
    const pills = document.querySelectorAll(".tab-pill");
    const panels = document.querySelectorAll(".tab-panel");
    if (!pills.length) return;

    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        const target = pill.dataset.tabTarget;
        
        // Update pills
        pills.forEach(p => p.classList.toggle("active", p === pill));
        
        // Update panels
        panels.forEach(panel => {
          const isActive = panel.id === `tab-${target}`;
          panel.classList.toggle("active", isActive);
        });
      });
    });
  }

  function initBottomDrawer() {
    const drawer = document.getElementById("servicesDrawer");
    const overlay = document.getElementById("drawerOverlay");
    const closeBtn = document.getElementById("drawerClose");
    const titleEl = document.getElementById("drawerTitle");
    const bodyEl = document.getElementById("drawerBody");
    const triggers = document.querySelectorAll(".services-drawer-trigger");

    if (!drawer || !overlay || !closeBtn || !bodyEl) return;

    const titles = {
      inquiry: "Founder Inquiry Portal",
      flexistlabs: "India Readiness Assessment"
    };

    const loaderHTML = `
      <div class="drawer-loader">
        <span class="pay-spinner"></span>
        <p>Loading portal...</p>
      </div>
    `;

    async function openDrawer(targetUrl) {
      // Lock parent page scrolling
      document.body.style.overflow = "hidden";
      
      // Update header title and show loader
      titleEl.textContent = titles[targetUrl] || "Loading...";
      bodyEl.innerHTML = loaderHTML;
      
      // Show drawer modal
      drawer.classList.add("open");

      try {
        // Fetch target page HTML
        const res = await fetch(`${targetUrl}.html`);
        if (!res.ok) throw new Error(`HTML fetch failed: ${res.status}`);
        const htmlText = await res.text();
        
        // Parse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        
        let contentToInject = "";
        
        if (targetUrl === "inquiry") {
          // Extract inquiry layout (form + aside content)
          const layout = doc.querySelector(".inquiry-layout");
          contentToInject = layout ? layout.innerHTML : doc.body.innerHTML;
          
          // Load inquiry styling and script
          loadStyles("css/inquiry.css");
          bodyEl.innerHTML = `<div class="inquiry-layout">${contentToInject}</div>`;
          await loadAndExecuteScript("js/inquiry.js");
        } else if (targetUrl === "flexistlabs") {
          // Extract assessment wrapper
          const wrapper = doc.querySelector(".assessment-wrapper");
          contentToInject = wrapper ? wrapper.innerHTML : doc.body.innerHTML;
          
          // Load assessment styling and script
          loadStyles("css/flexistlabs.css");
          bodyEl.innerHTML = `<div class="assessment-wrapper">${contentToInject}</div>`;
          await loadAndExecuteScript("js/flexistlabs.js");
        }

      } catch (err) {
        bodyEl.innerHTML = `
          <div class="drawer-loader" style="color: var(--accent-red)">
            <p>Error loading content: ${err.message}</p>
            <button type="button" class="ghost-button" onclick="location.reload()" style="margin-top:12px;">Retry</button>
          </div>
        `;
      }
    }

    function closeDrawer() {
      // Unlock page scrolling
      document.body.style.overflow = "";
      
      // Close drawer modal
      drawer.classList.remove("open");
      
      // Clear contents after animation ends
      setTimeout(() => {
        bodyEl.innerHTML = "";
      }, 400);
    }

    // Bind triggers
    triggers.forEach(trigger => {
      trigger.addEventListener("click", () => {
        const target = trigger.dataset.targetUrl;
        if (target) openDrawer(target);
      });
    });

    // Bind close events
    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    // Bind Esc key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("open")) {
        closeDrawer();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTabSwitcher();
    initBottomDrawer();
  });
})();
