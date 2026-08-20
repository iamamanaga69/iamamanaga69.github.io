/* ============================================================================
   IndiaMap — India Growth Signal Map
   ----------------------------------------------------------------------------
   Renders India as a live dot-matrix silhouette with glowing city nodes,
   pulsing growth connections and traveling data-flow signals. The country
   outline is read from an inline <path id="india-outline"> (potrace-traced,
   1024 viewBox). City nodes are placed by geographic position and snapped to
   the nearest land dot so they always sit on the map.

   - Theme-aware: colours come from CSS custom properties.
   - Accessible: city chips drive the same "active city" state as hover.
   - Degrades gracefully: static single frame on low-end / reduced-motion,
     text-only readout if the canvas or path is unavailable.
   ========================================================================= */
const IndiaMap = (() => {
  "use strict";

  // Geographic bounds of India used to normalise city coordinates.
  const LNG0 = 68, LNG1 = 97, LAT0 = 8, LAT1 = 37;
  const geo = (lat, lng) => ({
    u: (lng - LNG0) / (LNG1 - LNG0),
    v: (LAT1 - lat) / (LAT1 - LAT0)
  });

  const CITIES = [
    { key: "delhi", label: "Delhi NCR", ...geo(28.6, 77.2), audience: "Founder, trading and policy circles", channels: ["Telegram", "X"] },
    { key: "up", label: "Uttar Pradesh", ...geo(26.85, 80.95), audience: "India's largest emerging retail base", channels: ["Telegram", "YouTube"] },
    { key: "kolkata", label: "Kolkata", ...geo(22.57, 88.36), audience: "Fast-moving retail group culture", channels: ["Telegram"] },
    { key: "ahmedabad", label: "Ahmedabad", ...geo(23.02, 72.57), audience: "Retail discovery and regional creators", channels: ["YouTube", "Telegram"] },
    { key: "mumbai", label: "Mumbai", ...geo(19.0, 72.83), audience: "Exchanges, fintech and capital", channels: ["X", "YouTube"] },
    { key: "hyderabad", label: "Hyderabad", ...geo(17.4, 78.49), audience: "Builder and event-driven audience", channels: ["X", "Discord"] },
    { key: "bengaluru", label: "Bengaluru", ...geo(12.97, 77.59), audience: "Developer-led Web3 adoption", channels: ["Discord", "X"] },
    { key: "chennai", label: "Chennai", ...geo(13.08, 80.27), audience: "Regional-language education and reach", channels: ["YouTube", "Telegram"] }
  ];

  const EDGE_KEYS = [
    ["delhi", "up"], ["delhi", "ahmedabad"], ["delhi", "kolkata"], ["delhi", "mumbai"],
    ["up", "kolkata"], ["up", "hyderabad"], ["ahmedabad", "mumbai"], ["mumbai", "hyderabad"],
    ["mumbai", "bengaluru"], ["hyderabad", "bengaluru"], ["hyderabad", "chennai"], ["bengaluru", "chennai"]
  ];

  // potrace transform baked into src/data/indiaOutline.js
  const T = { tx: 0, ty: 1024, sx: 0.1, sy: -0.1 };
  const VB = 1024;

  function hexToRgb(hex) {
    const m = hex.trim().replace("#", "");
    if (m.length === 3) return `${parseInt(m[0] + m[0], 16)}, ${parseInt(m[1] + m[1], 16)}, ${parseInt(m[2] + m[2], 16)}`;
    if (m.length === 6) return `${parseInt(m.slice(0, 2), 16)}, ${parseInt(m.slice(2, 4), 16)}, ${parseInt(m.slice(4, 6), 16)}`;
    return null;
  }

  function init() {
    const root = document.querySelector("[data-signal-map]");
    if (!root || root.dataset.mapReady === "true") return;
    root.dataset.mapReady = "true";

    const canvas = root.querySelector("[data-signal-canvas]");
    const outlineEl = document.getElementById("india-outline");
    const readout = root.querySelector("[data-signal-readout]");
    const chips = Array.from(root.querySelectorAll("[data-city]"));

    const nameEl = readout && readout.querySelector("[data-readout-name]");
    const audienceEl = readout && readout.querySelector("[data-readout-audience]");
    const channelsEl = readout && readout.querySelector("[data-readout-channels]");

    let activeKey = CITIES[0].key;
    let tourTimer = null;
    let tourIndex = 0;

    function cityByKey(key) {
      return CITIES.find((c) => c.key === key) || CITIES[0];
    }

    function setActive(key, fromUser) {
      activeKey = key;
      const c = cityByKey(key);
      if (nameEl) nameEl.textContent = c.label;
      if (audienceEl) audienceEl.textContent = c.audience;
      if (channelsEl) channelsEl.innerHTML = c.channels.map((ch) => `<span>${ch}</span>`).join("");
      chips.forEach((chip) => chip.classList.toggle("active", chip.dataset.city === key));
      if (fromUser) restartTour();
      if (typeof onActivate === "function") onActivate(c);
    }

    let onActivate = null;

    function startTour() {
      if (window.prefersReducedMotion) return;
      stopTour();
      tourTimer = window.setInterval(() => {
        tourIndex = (tourIndex + 1) % CITIES.length;
        setActive(CITIES[tourIndex].key, false);
      }, 2600);
    }
    function stopTour() { if (tourTimer) { window.clearInterval(tourTimer); tourTimer = null; } }
    function restartTour() {
      tourIndex = CITIES.findIndex((c) => c.key === activeKey);
      stopTour();
      window.clearTimeout(restartTour._t);
      restartTour._t = window.setTimeout(startTour, 5200);
    }

    // Chip interactions (keyboard + pointer + touch) drive the same state.
    chips.forEach((chip) => {
      const key = chip.dataset.city;
      chip.addEventListener("mouseenter", () => setActive(key, true));
      chip.addEventListener("focus", () => setActive(key, true));
      chip.addEventListener("click", () => setActive(key, true));
    });

    setActive(activeKey, false);

    // Text-only fallback if canvas or outline is unavailable.
    if (!canvas || !outlineEl || typeof window.Path2D === "undefined") {
      startTour();
      return;
    }

    const ctx = canvas.getContext("2d");
    const path = new Path2D(outlineEl.getAttribute("d"));
    let dpr = 1, cssW = 0, cssH = 0;
    let dotLayer = null;
    let nodes = [];
    let edges = [];
    let palette = { node: "0, 212, 255", edge: "0, 102, 255", live: "0, 255, 136" };
    let ping = null;

    function refreshPalette() {
      const s = getComputedStyle(document.documentElement);
      palette.node = (s.getPropertyValue("--network-node-rgb") || "").trim() || palette.node;
      palette.edge = (s.getPropertyValue("--network-edge-rgb") || "").trim() || palette.edge;
      const green = hexToRgb(s.getPropertyValue("--accent-green") || "");
      if (green) palette.live = green;
      if (dotLayer) buildDotLayer(); // re-tint dots on theme change
    }

    // Compose contain-fit of the 1024 viewBox into (cssW, cssH) with padding.
    function fitParams() {
      const pad = 0.94;
      const fit = (Math.min(cssW, cssH) / VB) * pad;
      const ox = (cssW - VB * fit) / 2;
      const oy = (cssH - VB * fit) / 2;
      return { fit, ox, oy };
    }
    function applyMapTransform(c, f) {
      c.translate(f.ox, f.oy);
      c.scale(f.fit, f.fit);
      c.translate(T.tx, T.ty);
      c.scale(T.sx, T.sy);
    }

    function buildDotLayer() {
      const f = fitParams();

      // 1. Render solid silhouette to a mask canvas at CSS resolution.
      const mask = document.createElement("canvas");
      mask.width = Math.max(1, Math.round(cssW));
      mask.height = Math.max(1, Math.round(cssH));
      const mctx = mask.getContext("2d");
      mctx.save();
      applyMapTransform(mctx, f);
      mctx.fillStyle = "#fff";
      mctx.fill(path);
      mctx.restore();
      const data = mctx.getImageData(0, 0, mask.width, mask.height).data;

      // 2. Sample a dot grid inside the silhouette.
      const step = window.isLowEnd ? 15 : (cssW < 430 ? 12 : 9.5);
      const dots = [];
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let y = step / 2; y < cssH; y += step) {
        for (let x = step / 2; x < cssW; x += step) {
          const idx = ((Math.floor(y) * mask.width) + Math.floor(x)) * 4 + 3;
          if (data[idx] > 130) {
            dots.push({ x, y });
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
          }
        }
      }

      // 3. Cache dots + faint coastline to an offscreen layer (hi-res).
      dotLayer = document.createElement("canvas");
      dotLayer.width = Math.round(cssW * dpr);
      dotLayer.height = Math.round(cssH * dpr);
      const lc = dotLayer.getContext("2d");
      lc.scale(dpr, dpr);

      // faint coastline glow
      lc.save();
      applyMapTransform(lc, f);
      lc.lineJoin = "round";
      lc.strokeStyle = `rgba(${palette.node}, 0.28)`;
      lc.lineWidth = 2.4 / f.fit;
      lc.shadowColor = `rgba(${palette.node}, 0.5)`;
      lc.shadowBlur = 6 / f.fit;
      lc.stroke(path);
      lc.restore();

      // dots
      const r = window.isLowEnd ? 1.1 : 1.35;
      dots.forEach((d) => {
        lc.beginPath();
        lc.arc(d.x, d.y, r, 0, Math.PI * 2);
        lc.fillStyle = `rgba(${palette.node}, 0.24)`;
        lc.fill();
      });

      // 4. Place city nodes: normalise into land bbox, snap to nearest dot.
      const bw = maxX - minX || 1, bh = maxY - minY || 1;
      nodes = CITIES.map((c) => {
        let px = minX + c.u * bw;
        let py = minY + c.v * bh;
        let best = null, bestD = Infinity;
        for (let i = 0; i < dots.length; i++) {
          const dd = (dots[i].x - px) ** 2 + (dots[i].y - py) ** 2;
          if (dd < bestD) { bestD = dd; best = dots[i]; }
        }
        if (best) { px = best.x; py = best.y; }
        return { key: c.key, label: c.label, x: px, y: py };
      });
      const nodeMap = Object.fromEntries(nodes.map((n) => [n.key, n]));
      edges = EDGE_KEYS
        .map(([a, b]) => ({ a: nodeMap[a], b: nodeMap[b] }))
        .filter((e) => e.a && e.b);
    }

    function resize() {
      cssW = canvas.clientWidth;
      cssH = canvas.clientHeight;
      if (cssW < 2 || cssH < 2) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDotLayer();
    }

    onActivate = (c) => {
      const n = nodes.find((nn) => nn.key === c.key);
      if (n && !window.prefersReducedMotion) ping = { x: n.x, y: n.y, t: 0 };
    };

    // Pointer hit-testing on the canvas itself.
    canvas.addEventListener("pointermove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      let hit = null, hd = 26 * 26;
      nodes.forEach((n) => {
        const dd = (n.x - mx) ** 2 + (n.y - my) ** 2;
        if (dd < hd) { hd = dd; hit = n; }
      });
      canvas.style.cursor = hit ? "pointer" : "default";
      if (hit && hit.key !== activeKey) setActive(hit.key, true);
    });

    function drawStatic() {
      ctx.clearRect(0, 0, cssW, cssH);
      if (dotLayer) ctx.drawImage(dotLayer, 0, 0, cssW, cssH);
      edges.forEach((e) => {
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.strokeStyle = `rgba(${palette.edge}, 0.32)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      nodes.forEach((n) => drawNode(n, n.key === activeKey, 0));
    }

    function drawNode(n, active, time) {
      const pulse = active ? 1 : 0.55 + Math.sin(time * 0.004 + n.x) * 0.12;
      const rgb = active ? palette.live : palette.node;
      const rBase = active ? 6.5 : 4;
      ctx.save();
      ctx.shadowColor = `rgba(${rgb}, ${active ? 0.95 : 0.6})`;
      ctx.shadowBlur = active ? 20 : 9;
      ctx.beginPath();
      ctx.arc(n.x, n.y, rBase, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${Math.min(1, pulse)})`;
      ctx.fill();
      ctx.restore();
      // outer ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, rBase + (active ? 6 : 4), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rgb}, ${active ? 0.5 : 0.22})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      // label
      ctx.font = "600 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillStyle = active ? `rgba(${rgb}, 0.96)` : `rgba(${palette.node}, 0.42)`;
      ctx.fillText(n.label.toUpperCase(), n.x, n.y - (active ? 15 : 12));
    }

    let raf = null;
    function frame(time) {
      ctx.clearRect(0, 0, cssW, cssH);
      if (dotLayer) ctx.drawImage(dotLayer, 0, 0, cssW, cssH);

      // scanning sweep — brightens the dot band it passes over
      const period = 6400;
      const band = cssH * 0.34;
      const sweepY = ((time % period) / period) * (cssH + band) - band / 2;
      const grad = ctx.createLinearGradient(0, sweepY - band / 2, 0, sweepY + band / 2);
      grad.addColorStop(0, `rgba(${palette.node}, 0)`);
      grad.addColorStop(0.5, `rgba(${palette.node}, 0.16)`);
      grad.addColorStop(1, `rgba(${palette.node}, 0)`);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = grad;
      ctx.fillRect(0, sweepY - band / 2, cssW, band);
      ctx.restore();

      // edges + flowing signals
      edges.forEach((e, i) => {
        ctx.beginPath();
        ctx.moveTo(e.a.x, e.a.y);
        ctx.lineTo(e.b.x, e.b.y);
        ctx.strokeStyle = `rgba(${palette.edge}, 0.3)`;
        ctx.lineWidth = 1;
        ctx.stroke();
        for (let k = 0; k < 2; k++) {
          const t = ((time * 0.00016 + i * 0.37 + k * 0.5) % 1);
          const px = e.a.x + (e.b.x - e.a.x) * t;
          const py = e.a.y + (e.b.y - e.a.y) * t;
          const fade = Math.sin(t * Math.PI);
          ctx.beginPath();
          ctx.arc(px, py, 1.7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${palette.node}, ${0.85 * fade})`;
          ctx.fill();
        }
      });

      // activation ping
      if (ping) {
        ping.t += 0.02;
        const rr = ping.t * 46;
        ctx.beginPath();
        ctx.arc(ping.x, ping.y, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${palette.live}, ${Math.max(0, 0.5 - ping.t * 0.5)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (ping.t >= 1) ping = null;
      }

      nodes.forEach((n) => drawNode(n, n.key === activeKey, time));
      raf = window.requestAnimationFrame(frame);
    }

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (window.prefersReducedMotion) drawStatic();
      }, 160);
    });
    window.addEventListener("flexist:themechange", () => {
      refreshPalette();
      if (window.prefersReducedMotion) drawStatic();
    });

    refreshPalette();
    resize();

    if (window.prefersReducedMotion) {
      drawStatic();
    } else {
      // Start the loop when the map scrolls into view; pause when off-screen.
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !raf) {
            raf = window.requestAnimationFrame(frame);
          } else if (!entry.isIntersecting && raf) {
            window.cancelAnimationFrame(raf);
            raf = null;
          }
        });
      }, { threshold: 0.05 });
      io.observe(canvas);
      startTour();
    }
  }

  return { init };
})();
