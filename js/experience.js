document.addEventListener("DOMContentLoaded", () => {
  const entries = document.querySelectorAll(".timeline-entry");
  entries.forEach((entry) => {
    const button = entry.querySelector(".timeline-trigger");
    button.addEventListener("click", () => {
      const wasOpen = entry.classList.contains("active");
      entries.forEach((item) => {
        item.classList.remove("active");
        item.querySelector(".timeline-trigger").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        entry.classList.add("active");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
});
