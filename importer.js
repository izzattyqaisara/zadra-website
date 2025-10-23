// importer.js — load HTML partials like nav.html / hero.html
document.querySelectorAll("[data-include]").forEach(async (slot) => {
  const file = slot.getAttribute("data-include");
  try {
    const res = await fetch(file, { cache: "no-cache" });
    slot.innerHTML = await res.text();
    // Re-run nav wiring after the nav is injected
    if (file.includes("nav.html")) window.__wireNav && window.__wireNav();
  } catch (e) {
    slot.innerHTML = "<!-- include failed: " + file + " -->";
  }
});
