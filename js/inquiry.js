document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-inquiry-form]");
  const success = document.querySelector("[data-inquiry-success]");
  if (!form || !success) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.hidden = true;
    success.classList.add("visible");
  });
});
