// Loads each partial into its <div data-include="...">
document.addEventListener("DOMContentLoaded", () => {
  const hosts = document.querySelectorAll("[data-include]");
  const tasks = Array.from(hosts).map(async (el) => {
    const file = el.getAttribute("data-include");
    try {
      const res = await fetch(file);
      const html = await res.text();
      el.innerHTML = html;
    } catch (e) {
      console.error("Error loading:", file, e);
      el.innerHTML = `<!-- Failed to load ${file} -->`;
    }
  });

  Promise.all(tasks).then(() => {
    // Tell main.js that all sections are now in the DOM
    document.dispatchEvent(new Event("sections:loaded"));
  });
});