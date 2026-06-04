document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".influencer-card"));
  const filters = Array.from(document.querySelectorAll("[data-filter]"));
  const search = document.querySelector("[data-directory-search]");
  const count = document.querySelector("[data-directory-count]");
  let active = "all";

  function filterCards() {
    const query = search.value.toLowerCase().trim();
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = active === "all" || card.dataset.categories.includes(active);
      const matchesQuery = card.textContent.toLowerCase().includes(query);
      const show = matchesCategory && matchesQuery;
      card.hidden = !show;
      if (show) visible += 1;
    });
    count.textContent = `${visible} curated nodes visible`;
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      active = filter.dataset.filter;
      filters.forEach((button) => button.classList.toggle("active", button === filter));
      filterCards();
    });
  });
  search.addEventListener("input", filterCards);
  filterCards();
});
