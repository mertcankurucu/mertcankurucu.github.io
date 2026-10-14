document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("bibsearch");
  if (!input) return;
  const items = [...document.querySelectorAll(".bibliography > li")];
  const status = document.getElementById("bibsearch-status");

  const filterItems = () => {
    const term = input.value.trim().toLocaleLowerCase();
    let visible = 0;
    items.forEach((item) => {
      // Search visible citation metadata, not hidden export fields.
      const fields = item.querySelectorAll(".publication-title, .publication-authors, .publication-venue, .publication-summary");
      const text = [...fields]
        .map((field) => field.textContent)
        .join(" ")
        .toLocaleLowerCase();
      item.classList.toggle("unloaded", !text.includes(term));
      if (text.includes(term)) visible++;
    });
    document.querySelectorAll("h2.bibliography").forEach((heading) => {
      const list = heading.nextElementSibling;
      const empty = list && !list.querySelector("li:not(.unloaded)");
      heading.classList.toggle("unloaded", empty);
      if (list) list.classList.toggle("unloaded", empty);
    });
    status.textContent = term ? (visible ? `${visible} publication${visible === 1 ? "" : "s"} found.` : "No publications found.") : "";
  };

  const updateFromHash = () => {
    let hash;
    try {
      hash = decodeURIComponent(location.hash.slice(1));
    } catch {
      hash = "";
    }
    // Citation permalinks must remain anchors, not become search queries.
    const anchor = hash && document.getElementById(hash);
    input.value = anchor ? "" : hash;
    filterItems();
    if (anchor) anchor.scrollIntoView({ block: "start" });
  };

  let timeout;
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(filterItems, 150);
  });
  window.addEventListener("hashchange", updateFromHash);
  updateFromHash();
});
