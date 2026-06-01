const NetworkGraph = (() => {
  function init(canvasId = "network-canvas") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const context = canvas.getContext("2d");
    const mouse = { x: -1000, y: -1000 };
    let nodes = [];
    let width = 0;
    let height = 0;
    let nodeRgb = "0, 212, 255";
    let edgeRgb = "0, 102, 255";

    function refreshPalette() {
      const styles = getComputedStyle(document.documentElement);
      nodeRgb = styles.getPropertyValue("--network-node-rgb").trim() || nodeRgb;
      edgeRgb = styles.getPropertyValue("--network-edge-rgb").trim() || edgeRgb;
    }

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(88, Math.max(34, Math.floor(width / 18)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        radius: Math.random() * 1.7 + 0.7
      }));
    }

    function tick() {
      context.clearRect(0, 0, width, height);
      nodes.forEach((node, index) => {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 120 && distance > 0) {
          node.vx += (dx / distance) * 0.045;
          node.vy += (dy / distance) * 0.045;
        }
        node.vx *= 0.99;
        node.vy *= 0.99;
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${nodeRgb}, 0.75)`;
        context.fill();

        nodes.slice(index + 1).forEach((other) => {
          const gap = Math.hypot(node.x - other.x, node.y - other.y);
          if (gap < 130) {
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(${edgeRgb}, ${0.18 * (1 - gap / 130)})`;
            context.stroke();
          }
        });
      });
      requestAnimationFrame(tick);
    }

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });
    canvas.addEventListener("pointerleave", () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });
    window.addEventListener("resize", resize);
    window.addEventListener("flexist:themechange", refreshPalette);
    refreshPalette();
    resize();
    tick();
  }

  return { init };
})();
