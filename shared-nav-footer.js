const contactForm = `
<form action="https://formspree.io/f/xredwjao" method="POST" class="space-y-6 bg-zinc-900 p-6 rounded-xl">
  <input type="text" name="name" placeholder="Your name" class="w-full p-3 bg-zinc-800" required>
  <input type="email" name="email" placeholder="Email" class="w-full p-3 bg-zinc-800" required>
  <select name="type" class="w-full p-3 bg-zinc-800"><option>Project Inquiry</option><option>Influencer Collab</option><option>Ambassador</option><option>Consulting</option><option>Other</option></select>
  <textarea name="message" rows="4" placeholder="Tell me about your project or collab" class="w-full p-3 bg-zinc-800"></textarea>
  <input type="hidden" name="_subject" value="flexist.in Enquiry">
  <button type="submit" class="w-full bg-emerald-500 py-4 font-bold text-lg">SEND MESSAGE → Reaches Aman Instantly</button>
</form>`;

const navLinks = [
  ["Home", "./"],
  ["Services", "services"],
  ["India Hub", "india-hub"],
  ["Experience", "experience"],
  ["Community", "community"],
  ["Influencers", "influencers"],
  ["Ambassadors", "ambassadors"],
  ["Partnerships", "partnerships"],
  ["Book Call", "#book-call"],
  ["Contact", "contact"]
];

function renderSharedShell() {
  const navTarget = document.querySelector("[data-nav]");
  const footerTarget = document.querySelector("[data-footer]");
  if (navTarget) {
    navTarget.innerHTML = `
      <header class="sticky top-0 z-50 border-b border-emerald-500/20 bg-black/85 backdrop-blur-xl">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <a href="./" class="flex items-center gap-3 font-black tracking-tight text-white">
            <img src="assets/images/flexist-avatar-192.png" alt="" class="h-10 w-10 rounded-full border border-emerald-400/50">
            <span>FLEXIST <span class="text-emerald-400">CRYPTO</span></span>
          </a>
          <nav class="hidden items-center gap-5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:flex">
            ${navLinks.map(([label, href]) => `<a class="hover:text-emerald-400" href="${href}">${label}</a>`).join("")}
          </nav>
          <button type="button" data-menu-toggle class="rounded-lg border border-emerald-500/30 px-3 py-2 text-sm font-bold text-emerald-300 lg:hidden">Menu</button>
        </div>
        <nav data-mobile-menu class="hidden border-t border-emerald-500/20 bg-black px-4 py-4 lg:hidden">
          <div class="grid gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-zinc-300">
            ${navLinks.map(([label, href]) => `<a class="rounded-lg border border-zinc-800 px-4 py-3 hover:border-emerald-500/50 hover:text-emerald-400" href="${href}">${label}</a>`).join("")}
          </div>
        </nav>
      </header>`;
  }

  if (footerTarget) {
    footerTarget.innerHTML = `
      <footer class="border-t border-emerald-500/20 bg-black px-4 py-14 text-zinc-300">
        <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr_1.1fr]">
          <div>
            <div class="mb-4 flex items-center gap-3 font-black text-white">
              <img src="assets/images/flexist-avatar-192.png" alt="" class="h-10 w-10 rounded-full border border-emerald-400/50">
              FLEXIST <span class="text-emerald-400">CRYPTO</span>
            </div>
            <p class="max-w-sm text-sm leading-7 text-zinc-400">India growth infrastructure for Web3 projects ready to turn attention into durable adoption.</p>
            <div class="mt-6 flex flex-wrap gap-3 text-sm">
              <a class="rounded-full border border-zinc-800 px-4 py-2 hover:border-emerald-500 hover:text-emerald-400" href="https://t.me/FlexistCrypto" target="_blank" rel="noreferrer">Telegram</a>
              <a class="rounded-full border border-zinc-800 px-4 py-2 hover:border-emerald-500 hover:text-emerald-400" href="https://x.com/flexistcrypto" target="_blank" rel="noreferrer">X</a>
              <a class="rounded-full border border-zinc-800 px-4 py-2 hover:border-emerald-500 hover:text-emerald-400" href="https://linktr.ee/FlexistWeb3" target="_blank" rel="noreferrer">Linktree</a>
              <a class="rounded-full border border-zinc-800 px-4 py-2 hover:border-emerald-500 hover:text-emerald-400" href="mailto:FlexistCrypto@gmail.com">Email</a>
            </div>
          </div>
          <div>
            <h3 class="mb-4 text-sm font-black uppercase tracking-[0.22em] text-emerald-400">Mega Links</h3>
            <div class="grid grid-cols-2 gap-3 text-sm">
              ${navLinks.map(([label, href]) => `<a class="text-zinc-400 hover:text-emerald-400" href="${href}">${label}</a>`).join("")}
              <a class="text-zinc-400 hover:text-emerald-400" href="founder">Founder</a>
              <a class="text-zinc-400 hover:text-emerald-400" href="projects">Projects</a>
              <a class="text-zinc-400 hover:text-emerald-400" href="case-studies">Case Studies</a>
              <a class="text-zinc-400 hover:text-emerald-400" href="testimonials">Testimonials</a>
            </div>
          </div>
          <div>
            <h3 class="mb-4 text-sm font-black uppercase tracking-[0.22em] text-emerald-400">Quick Contact</h3>
            ${contactForm}
          </div>
        </div>
        <div class="mx-auto mt-10 max-w-7xl border-t border-zinc-900 pt-6 text-xs uppercase tracking-[0.18em] text-zinc-600">© ${new Date().getFullYear()} Flexist Crypto · Built for Web3 founders</div>
      </footer>`;
  }

  document.body.insertAdjacentHTML("beforeend", `
    <button type="button" data-message-open class="fixed bottom-5 right-5 z-50 rounded-full bg-emerald-500 px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-black shadow-2xl shadow-emerald-500/30">Message Aman</button>
    <div data-message-modal class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/80 p-4 backdrop-blur">
      <div class="w-full max-w-xl rounded-2xl border border-emerald-500/30 bg-zinc-950 p-4">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-xl font-black text-white">Message Aman</h2>
          <button type="button" data-message-close class="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300">Close</button>
        </div>
        ${contactForm}
      </div>
    </div>`);
}

function bindSharedShell() {
  document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => {
    document.querySelector("[data-mobile-menu]")?.classList.toggle("hidden");
  });
  const modal = document.querySelector("[data-message-modal]");
  document.querySelector("[data-message-open]")?.addEventListener("click", () => {
    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
  });
  document.querySelector("[data-message-close]")?.addEventListener("click", () => {
    modal?.classList.add("hidden");
    modal?.classList.remove("flex");
  });
  window.addEventListener("scroll", () => {
    const progress = document.querySelector("[data-scroll-progress]");
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleY(${value})`;
  }, { passive: true });
}

function initReadinessQuiz() {
  const quiz = document.querySelector("[data-readiness-quiz]");
  if (!quiz) return;
  const answers = {};
  const progress = document.querySelector("[data-quiz-progress]");
  const scoreText = document.querySelector("[data-quiz-score]");
  const result = document.querySelector("[data-quiz-result]");
  const targetInput = document.querySelector("[data-quiz-target]");
  function updateProgress() {
    const completed = Object.keys(answers).filter((key) => answers[key].length).length;
    if (progress) progress.style.transform = `scaleX(${completed / 7})`;
  }
  quiz.querySelectorAll("[data-quiz-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.key;
      const multi = button.dataset.multi === "true";
      if (!multi) {
        quiz.querySelectorAll(`[data-key="${key}"]`).forEach((item) => item.classList.remove("border-emerald-400", "bg-emerald-500/10", "text-white"));
        answers[key] = [button.dataset.value];
      } else {
        answers[key] = answers[key] || [];
        if (answers[key].includes(button.dataset.value)) {
          answers[key] = answers[key].filter((value) => value !== button.dataset.value);
        } else {
          answers[key].push(button.dataset.value);
        }
      }
      button.classList.toggle("border-emerald-400");
      button.classList.toggle("bg-emerald-500/10");
      button.classList.toggle("text-white");
      updateProgress();
    });
  });
  targetInput?.addEventListener("input", () => {
    answers.target = targetInput.value ? [targetInput.value] : [];
    updateProgress();
  });
  document.querySelector("[data-quiz-submit]")?.addEventListener("click", () => {
    const count = Object.values(answers).flat().length;
    let score = Math.min(96, 28 + count * 7);
    if ((answers.telegram || [])[0] !== "<500") score += 8;
    if ((answers.budget || [])[0] !== "<1k") score += 8;
    score = Math.min(96, score);
    if (scoreText) scoreText.textContent = `${score}%`;
    if (result) result.classList.remove("hidden");
  });
}

function initDirectory() {
  const search = document.querySelector("[data-directory-search]");
  const cards = Array.from(document.querySelectorAll("[data-influencer-card]"));
  if (!search || !cards.length) return;
  function filter() {
    const query = search.value.toLowerCase();
    cards.forEach((card) => {
      card.classList.toggle("hidden", !card.innerText.toLowerCase().includes(query));
    });
  }
  search.addEventListener("input", filter);
}

document.addEventListener("DOMContentLoaded", () => {
  renderSharedShell();
  bindSharedShell();
  initReadinessQuiz();
  initDirectory();
});
