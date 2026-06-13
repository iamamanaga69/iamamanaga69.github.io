document.addEventListener("DOMContentLoaded", () => {
  const entries = document.querySelectorAll(".timeline-entry");
  
  /* Scroll animation using IntersectionObserver */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -60px 0px"
  };

  const observer = new IntersectionObserver((entriesList, observerInstance) => {
    entriesList.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("timeline-visible");
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  entries.forEach((entry) => {
    observer.observe(entry);
  });
});
