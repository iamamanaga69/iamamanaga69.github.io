document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  const note = document.querySelector("[data-contact-note]");
  const clock = document.querySelector("[data-ist-clock]");

  function updateClock() {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(new Date());
  }

  updateClock();
  window.setInterval(updateClock, 1000);

  if (!form || !note) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("contact-email").value.trim();
    const topic = document.getElementById("contact-topic").value;
    const message = document.getElementById("contact-message").value.trim();
    const body = encodeURIComponent(`Email: ${email}\nTopic: ${topic}\n\n${message}`);
    note.innerHTML = `Message staged. <a href="mailto:FlexistCrypto@gmail.com?subject=${encodeURIComponent(topic)}&body=${body}">Open email draft</a> to send the thread.`;
    form.reset();
  });
});
