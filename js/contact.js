document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  const note = document.querySelector("[data-contact-note]");
  if (!form || !note) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    note.textContent = "Message staged. Email FlexistCrypto@gmail.com to open the thread.";
    form.reset();
  });
});
