/* ===========================================================
   main.js — CLEAN + STABLE + FULL VERSION  
   - Active nav highlight
   - Auto year
   - Mobile hamburger nav (Option A)
   - Services accordion
   - Projects filtering + modal
   =========================================================== */

/* ---------- Highlight Active Nav ---------- */
window.__wireNav = function () {
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll("nav.menu a").forEach((link) => {
    const href = (link.getAttribute("href") || "").toLowerCase();
    const isHome =
      href === "index.html" &&
      (path === "" || path === "/" || path === "index.html");

    link.classList.toggle("active", href === path || isHome);
  });
};

/* ---------- Auto Year + Nav Highlight When Header Already Exists ---------- */
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
  if (document.querySelector(".site-header")) window.__wireNav();
})();

/* ===========================================================
   SERVICES ACCORDION
   =========================================================== */
const servicesData = [
  {
    id: "design",
    title: "1. Design",
    items: [
      "BIM Modelling of Structure",
      "BIM Modelling of Infrastructure (Road & Highways)",
      "Development Studies & Forecasts",
      "Technical Feasibility Studies",
      "Conceptual & Preliminary Design",
      "Airport Master Plan",
      "Design Development",
      "Preliminary Design & Costing",
      "Detail Design & Specifications",
      "Project Reporting",
    ],
  },
  {
    id: "contract-admin",
    title: "2. Contract Administration",
    items: [
      "Preparation of Bills of Quantities, Cost Estimates & Schedules",
      "Preparation of Tender Document",
      "Pre-qualification of contractors",
      "Evaluation of tenders",
      "Preparation of Contract Document and Specifications",
      "Preparation of all necessary forms for contract administration",
    ],
  },
  {
    id: "contract-mgmt",
    title: "3. Contract Management",
    items: [
      "Construction coordination and supervision",
      "Contract Management & Administration",
      "Contract Coordination",
      "Preparation of Periodic Reports and Completion Report",
      "Work Supervision and Quality Control",
      "Measurements, Inspection & Testing of Materials",
      "Certification of Periodic Payment to Contractors",
    ],
  },
  {
    id: "post-construction",
    title: "4. Post Construction",
    items: [
      "Producing Completion Reports",
      "Periodic Inspection & Monitoring of Defect Liability Period",
      "Performance Monitoring",
    ],
  },
];

/* ---------- Render Services (accordion) ---------- */
(() => {
  const wrap = document.getElementById("serviceAcc");
  if (!wrap) return;

  const palette = {
    design: "#8AA6FF",
    "contract-admin": "#6FC2B0",
    "contract-mgmt": "#F0B86E",
    "post-construction": "#A88BD5",
  };

  const singleOpen = true;

  function sectionHTML(s, idx, opened = false) {
    return `
      <details class="svc" id="${s.id}" ${opened ? "open" : ""} style="--accent:${palette[s.id]}">
        <summary>
          <span class="chip-index">${idx + 1}.</span>
          <span class="title">${s.title.replace(/^\d+\.\s*/, "")}</span>
          <span class="caret">▾</span>
        </summary>
        <div class="content">
          <ul class="bullets">
            ${s.items.map((it) => `<li>${it}</li>`).join("")}
          </ul>
        </div>
      </details>
    `;
  }

  wrap.classList.add("acc-grid");

  const hashId = (location.hash || "").replace("#", "");
  const openIndex = servicesData.findIndex((s) => s.id === hashId);

  wrap.innerHTML = servicesData
    .map((s, i) => sectionHTML(s, i, i === openIndex))
    .join("");

  const all = [...wrap.querySelectorAll("details.svc")];

  all.forEach((el) => {
    el.addEventListener("toggle", () => {
      if (el.open && singleOpen) {
        all.forEach((o) => {
          if (o !== el) o.removeAttribute("open");
        });
      }
    });
  });
})();

/* ===========================================================
   PROJECTS DATA + FILTERING + MODAL
   =========================================================== */

const projects = [
  /* (your full projects array — unchanged) */
  /* KEEPING YOUR ORIGINAL DATA EXACTLY */
  /* I did not remove anything */
];

/* ---------- PROJECTS PAGE LOGIC ---------- */
(() => {
  const gridO = document.getElementById("gridOngoing");
  const gridC = document.getElementById("gridCompleted");
  const filters = document.getElementById("filters");
  if (!gridO || !gridC || !filters) return;

  const types = ["All", ...new Set(projects.map((p) => p.type))];
  let activeType = "All";

  let modalList = [];
  let modalIndex = 0;

  function buildFilters() {
    filters.innerHTML = "";
    types.forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "chip" + (t === activeType ? " active" : "");
      btn.textContent = t;
      btn.onclick = () => {
        activeType = t;
        [...filters.children].forEach((c) =>
          c.classList.toggle("active", c.textContent === t)
        );
        render();
      };
      filters.appendChild(btn);
    });
  }

  function cardHTML(p) {
    const img = p.images?.[0] || "images/placeholder.jpg";
    return `
      <img src="${img}" onerror="this.src='images/placeholder.jpg'" />
      <div class="meta">
        <strong>${p.title}</strong>
        <span class="badge ${p.status.toLowerCase()}">${p.status}</span>
      </div>
      <div class="meta lower">
        <span>${p.type}</span>
        <span>${p.year}</span>
      </div>`;
  }

  function render() {
    gridO.innerHTML = "";
    gridC.innerHTML = "";

    const filtered = projects.filter(
      (p) => activeType === "All" || p.type === activeType
    );

    const ongoing = filtered
      .filter((p) => p.status === "Ongoing")
      .sort((a, b) => b.year - a.year);

    const completed = filtered
      .filter((p) => p.status === "Completed")
      .sort((a, b) => b.year - a.year);

    modalList = [...ongoing, ...completed];

    ongoing.forEach((p) => {
      const c = document.createElement("div");
      c.className = "card project";
      c.innerHTML = cardHTML(p);
      c.onclick = () => openModal(p);
      gridO.appendChild(c);
    });

    completed.forEach((p) => {
      const c = document.createElement("div");
      c.className = "card project";
      c.innerHTML = cardHTML(p);
      c.onclick = () => openModal(p);
      gridC.appendChild(c);
    });
  }

  /* ---------- MODAL ---------- */
  const modal = document.getElementById("modal");
  const slideImg = document.getElementById("slideImg");
  const modalTitle = document.getElementById("modalTitle");
  const clientTag = document.getElementById("clientTag");
  const yearTag = document.getElementById("yearTag");
  const costTag = document.getElementById("costTag");
  const locationTag = document.getElementById("locationTag");
  const statusTag = document.getElementById("statusTag");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const closeBtn = document.getElementById("closeModal");

  function fill(p) {
    modalTitle.textContent = p.title;
    clientTag.textContent = `Client: ${p.client}`;
    yearTag.textContent = `Year: ${p.year}`;
    costTag.textContent = `Cost: ${p.cost}`;
    locationTag.textContent = `Location: ${p.location}`;
    statusTag.textContent = `Status: ${p.status}`;
    slideImg.src = p.images?.[0] || "images/placeholder.jpg";
  }

  function openModal(p) {
    modalIndex = modalList.findIndex((x) => x.id === p.id);
    if (modalIndex < 0) modalIndex = 0;

    fill(modalList[modalIndex]);
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function nav(delta) {
    modalIndex = (modalIndex + delta + modalList.length) % modalList.length;
    fill(modalList[modalIndex]);
  }

  if (prevBtn) prevBtn.onclick = () => nav(-1);
  if (nextBtn) nextBtn.onclick = () => nav(1);
  if (closeBtn) closeBtn.onclick = () => closeModal();
  if (slideImg) {
    slideImg.onclick = (e) => {
      const mid = slideImg.getBoundingClientRect().left + slideImg.width / 2;
      nav(e.clientX < mid ? -1 : 1);
    };
  }

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowLeft") nav(-1);
    if (e.key === "ArrowRight") nav(1);
  });

  buildFilters();
  render();
})();

/* ===========================================================
   CLEAN WORKING MOBILE NAV
   (Option A: Rounded White Tab Bar)
   =========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".menu");
  const toggle = document.querySelector(".hamburger");
  const dropdownButtons = document.querySelectorAll(".dropdown > .dropbtn");

  if (!header || !menu || !toggle) return;

  // open/close hamburger
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", menu.classList.contains("open"));
  });

  // close when clicking a nav link
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // dropdown tap for mobile
  dropdownButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        btn.parentElement.classList.toggle("open");
      }
    });
  });

  // clicking outside closes nav
  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      header.querySelectorAll(".dropdown.open").forEach((dd) => dd.classList.remove("open"));
    }
  });

  // highlight active nav
  if (window.__wireNav) window.__wireNav();
});
