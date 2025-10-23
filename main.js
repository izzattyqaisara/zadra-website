/* ===========================
   main.js (full file)
   ===========================
   - Auto year in footer
   - Mobile burger + active nav link
   - Projects page:
     • Uses local JPG/PNG (images/…)
     • Filters by Type
     • Two sections: Ongoing & Completed (year desc)
     • Modal with Client/Year/Cost/Location/Status
     • Prev/Next navigate ACROSS PROJECTS in current filter order
     • Click image: left half = prev project, right half = next project
     • Esc closes; robust image fallback
   Requirements in projects.html:
     #filters, #gridOngoing, #gridCompleted
     #modal #slideImg #modalTitle
     #clientTag #yearTag #costTag #locationTag #statusTag
     #prevBtn #nextBtn #closeModal
     images/placeholder.jpg
=========================== */

// ------- Global: nav wiring (called after nav.html loads) -------
window.__wireNav = function () {
  const burger = document.querySelector(".hamburger");
  const menu = document.getElementById("menu");
  if (burger && menu) burger.addEventListener("click", () => menu.classList.toggle("open"));

  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".menu a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    const isHome = href === "index.html" && (path === "" || path === "/" || path === "index.html");
    a.classList.toggle("active", href === path || isHome);
  });
};

// ------- Global init: year + (if nav already present) wire it ----
(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (document.querySelector(".site-header")) window.__wireNav();
})();

/* ===== SERVICES — data ===== */
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

/* ===== SERVICES — render (accordion, deep-links, single-open) ===== */
(() => {
  const wrap = document.getElementById("serviceAcc");
  if (!wrap) return; // only on services.html

  const palette = {
    design:             "#8AA6FF",
    "contract-admin":   "#6FC2B0",
    "contract-mgmt":    "#F0B86E",
    "post-construction":"#A88BD5",
  };
  const singleOpen = true;

  function sectionHTML(s, idx, opened = false){
    const color = palette[s.id] || "var(--accent, #e9dfd2)";
    return `
      <details class="svc" id="${s.id}" ${opened ? "open" : ""} style="--accent:${color}">
        <summary>
          <span class="chip-index">${idx + 1}.</span>
          <span class="title">${s.title.replace(/^\d+\.\s*/, "")}</span>
          <span class="caret" aria-hidden="true">▾</span>
        </summary>
        <div class="content">
          <ul class="bullets">
            ${s.items.map(it => `<li>${it}</li>`).join("")}
          </ul>
        </div>
      </details>`;
  }

  wrap.classList.add("acc-grid");

  const hashId = (location.hash || "").replace("#", "");
  const initialIndex = servicesData.findIndex(s => s.id === hashId);

  wrap.innerHTML = servicesData
    .map((s, i) => sectionHTML(s, i, i === initialIndex))
    .join("");

  const all = Array.from(wrap.querySelectorAll("details.svc"));

  all.forEach(d => {
    d.addEventListener("toggle", () => {
      if (d.open) {
        if (singleOpen) all.forEach(o => { if (o !== d) o.removeAttribute("open"); });
        history.replaceState(null, "", `services.html#${d.id}`);
        d.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        const anyOpen = all.some(o => o.open);
        if (!anyOpen) history.replaceState(null, "", "services.html");
      }
    });
  });

  // Support opening via hash changes (e.g., clicking from homepage tiles)
  window.addEventListener("hashchange", () => {
    const id = (location.hash || "").replace("#", "");
    const target = id && wrap.querySelector(`details#${CSS.escape(id)}`);
    if (!target) return;
    if (singleOpen) all.forEach(o => { if (o !== target) o.removeAttribute("open"); });
    target.setAttribute("open", "");
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();

/* ====== PROJECTS DATA (authoritative) ====== */
const projects = [
  // CURRENT
  { id:"cur01", title:"Darul Ittihad Mosque, Kuching", type:"Religious", client:"JAIS", year:2025, cost:"RM 51M", location:"Kuching, Sarawak", status:"Ongoing", images:["images/ittihad.jpg"] },
  { id:"cur02", title:"Sarawak Islamic Secondary School Development", type:"Education", client:"Yayasan Sarawak", year:2024, cost:"RM 80M", location:"Sarawak", status:"Ongoing", images:["images/sissd.jpg"] },
  { id:"cur03", title:"Sungai Bedaun Mosque, Santubong (Kuching)", type:"Religious", client:"PELITA", year:2024, cost:"RM 27M", location:"Santubong, Kuching", status:"Ongoing", images:["images/bedaun.jpg"] },
  { id:"cur04", title:"217 Double-Storey Detached Houses, Jln Sultan Tengah", type:"Residential", client:"PELITA", year:2024, cost:"RM 30M", location:"Kuching, Sarawak", status:"Ongoing", images:["images/detached.jpg"] },
  { id:"cur05", title:"Mukah Waterfront Development", type:"Landscape", client:"DID Sarawak", year:2024, cost:"RM 64M", location:"Mukah, Sarawak", status:"Ongoing", images:["images/mukahwf.jpg"] },
  { id:"cur06", title:"Mukah Integrated Market (New)", type:"Commercial", client:"MDDM", year:2024, cost:"RM 40M", location:"Mukah, Sarawak", status:"Ongoing", images:["images/mukahmarket.jpeg"] },
  { id:"cur07", title:"HIKMAH Islamic Tech College, KG & Tahfiz Secondary", type:"Education", client:"UDA", year:2024, cost:"RM 40M", location:"Kuching, Sarawak", status:"Ongoing", images:["images/hikmahtahfiz.jpg"] },
  { id:"cur08", title:"SMK Tinjar: 14 Teachers’ Quarters", type:"Education", client:"JKR", year:2024, cost:"RM 14M", location:"Miri, Sarawak", status:"Ongoing", images:["images/quarters.jpg"] },
  { id:"cur09", title:"Simunjan Rural Roads (Lubuk Samsu, Sabang, Semanggal, Sg Labi, Tanjung)", type:"Civil", client:"JKR", year:2020, cost:"RM 64M", location:"Simunjan, Sarawak", status:"Ongoing", images:["images/ruralroads.jpeg"] },
  { id:"cur10", title:"Belaga District Police HQ (IPD)", type:"Institutional", client:"JKR", year:2020, cost:"RM 80M", location:"Belaga, Sarawak", status:"Ongoing", images:["images/policedistrict.jpg"] },

  // PREVIOUS
  { id:"prev01", title:"Tahfiz Primary School (2-Storey), Kuching", type:"Education", client:"HIKMAH", year:2021, cost:"RM 17M", location:"Kuching, Sarawak", status:"Completed", images:["images/tahfizprimary.jpg"] },
  { id:"prev02", title:"Tambirat Hawker Centre", type:"Commercial", client:"MPKS", year:2020, cost:"RM 5M", location:"Kota Samarahan, Sarawak", status:"Completed", images:["images/tambirathawker.jpg"] },
  { id:"prev03", title:"Serian Division Mosque Upgrade", type:"Religious", client:"MIS", year:2019, cost:"RM 10M", location:"Serian, Sarawak", status:"Completed", images:["images/masjid serian.jpeg"] },
  { id:"prev04", title:"Kampung Bakam Mosque (Design & Build)", type:"Religious", client:"MIS", year:2018, cost:"RM 5M", location:"Miri, Sarawak", status:"Completed", images:["images/masjid bakam.jpeg"] },
  { id:"prev05", title:"Fairy & Wind Caves Nature Reserves Upgrade", type:"Landscape", client:"SFC", year:2017, cost:"RM 12M", location:"Bau, Sarawak", status:"Completed", images:["images/fairy cave.jpeg"] },
  { id:"prev06", title:"Cocoa & Chocolate Processing Centre Refurbishment", type:"Industrial", client:"Lembaga Koko Malaysia", year:2017, cost:"RM 5M", location:"Kota Samarahan, Sarawak", status:"Completed", images:["images/projek koko.jpeg"] },
  { id:"prev07", title:"Pan Borneo Highway WPC03: Serian–Pantu Junction", type:"Infrastructure", client:"JKR", year:2016, cost:"RM 90M", location:"Serian–Pantu, Sarawak", status:"Completed", images:["images/PB SPJ.jpeg"] },
  { id:"prev08", title:"Fort Lily Conservation & Upgrade", type:"Heritage", client:"JKR", year:2016, cost:"RM 5M", location:"Betong, Sarawak", status:"Completed", images:["images/kubu lili.jpeg"] },
  { id:"prev09", title:"Pan Borneo Highway: Telok Melano–Sematan", type:"Infrastructure", client:"JKR", year:2015, cost:"RM 70M", location:"Telok Melano–Sematan, Sarawak", status:"Completed", images:["images/PB teluk melano.jpeg"] },
  { id:"prev10", title:"UNIMAS Sports & Recreation Complex", type:"Institutional", client:"UNIMAS", year:2007, cost:"RM 40M", location:"Kota Samarahan, Sarawak", status:"Completed", images:["images/unimas.jpg"] },
  { id:"prev11", title:"Kpg Patrikan–SMK Merapok Road: Detailed Design & Supervision", type:"Civil", client:"DID", year:2007, cost:"RM 20M", location:"Lawas, Sarawak", status:"Completed", images:["images/merapokroad.jpg"] },
  { id:"prev12", title:"Sarawak Schools & Hostels (Package A) — Build/Upgrade/Repair", type:"Education", client:"KPM", year:2007, cost:"RM 69M", location:"Sarawak (statewide)", status:"Completed", images:["images/school.jpg"] }
];

/* ===== Projects page logic ===== */
(function(){
  const gridOngoing   = document.getElementById('gridOngoing');
  const gridCompleted = document.getElementById('gridCompleted');
  const filtersEl     = document.getElementById('filters');
  if (!gridOngoing || !gridCompleted || !filtersEl) return; // Only run on projects.html

  // ---- Filters: by Type (plus "All") ----
  const types = ['All', ...Array.from(new Set(projects.map(p => p.type)))];
  let activeType = 'All';

  // This will hold the CURRENT ordered list of projects visible in the modal navigation
  let modalList = [];
  let modalIndex = -1;

  function buildFilters(){
    filtersEl.innerHTML = '';
    types.forEach(t => {
      const b = document.createElement('button');
      b.className = 'chip' + (t===activeType ? ' active' : '');
      b.textContent = t;
      b.addEventListener('click', () => {
        activeType = t;
        Array.from(filtersEl.querySelectorAll('.chip')).forEach(c =>
          c.classList.toggle('active', c.textContent===t)
        );
        render();
      });
      filtersEl.appendChild(b);
    });
  }

  // ---- Card template + behavior ----
  function cardHTML(p){
    const thumb = (p.images && p.images[0]) ? p.images[0] : 'images/placeholder.jpg';
    const statusClass = (p.status || '').toLowerCase(); // 'ongoing' | 'completed'
    return `
      <img src="${thumb}" alt="${p.title}" onerror="this.onerror=null;this.src='images/placeholder.jpg'">
      <div class="meta">
        <strong>${p.title}</strong>
        <span class="badge ${statusClass}">${p.status || ''}</span>
      </div>
      <div class="meta lower">
        <span>${p.type || ''}</span>
        <span>${p.year || ''}</span>
      </div>`;
  }

  function attachCardBehavior(card, p){
    card.addEventListener('click', () => openModal(p));
  }

  // ---- Render both groups ----
  function render(){
    gridOngoing.innerHTML = '';
    gridCompleted.innerHTML = '';

    const filtered = projects.filter(p => activeType==='All' || p.type===activeType);

    const ongoing = filtered
      .filter(p => (p.status||'').toLowerCase()==='ongoing')
      .sort((a,b)=> (b.year||0)-(a.year||0));

    const completed = filtered
      .filter(p => (p.status||'').toLowerCase()==='completed')
      .sort((a,b)=> (b.year||0)-(a.year||0));

    // The sequence used by the modal: ongoing first (new→old), then completed (new→old)
    modalList = [...ongoing, ...completed];

    const countO = document.getElementById('countOngoing');
    const countC = document.getElementById('countCompleted');
    if (countO) countO.textContent = `(${ongoing.length})`;
    if (countC) countC.textContent = `(${completed.length})`;

    if (ongoing.length===0) {
      gridOngoing.innerHTML = `<div class="empty">No ongoing projects for “${activeType}”.</div>`;
    } else {
      ongoing.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card project';
        card.innerHTML = cardHTML(p);
        attachCardBehavior(card, p);
        gridOngoing.appendChild(card);
      });
    }

    if (completed.length===0) {
      gridCompleted.innerHTML = `<div class="empty">No completed projects for “${activeType}”.</div>`;
    } else {
      completed.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card project';
        card.innerHTML = cardHTML(p);
        attachCardBehavior(card, p);
        gridCompleted.appendChild(card);
      });
    }
  }

  /* ===== Modal / Lightbox: navigate across projects ===== */
  const modal       = document.getElementById('modal');
  const slideImg    = document.getElementById('slideImg');
  const modalTitle  = document.getElementById('modalTitle');
  const clientTag   = document.getElementById('clientTag');
  const yearTag     = document.getElementById('yearTag');
  const costTag     = document.getElementById('costTag');
  const locationTag = document.getElementById('locationTag');
  const statusTag   = document.getElementById('statusTag');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const closeBtn    = document.getElementById('closeModal');

  function fallback(imgEl){
    imgEl.onerror = null;
    imgEl.src = 'images/placeholder.jpg';
  }

  function setPanel(p){
    modalTitle.textContent   = p.title || "";
    clientTag.textContent    = `Client: ${p.client || "-"}`;
    yearTag.textContent      = `Year: ${p.year || "-"}`;
    costTag.textContent      = `Cost: ${p.cost || "-"}`;
    locationTag.textContent  = `Location: ${p.location || "-"}`;
    statusTag.textContent    = `Status: ${p.status || "-"}`;
    slideImg.src = (p.images && p.images[0]) ? p.images[0] : 'images/placeholder.jpg';
  }

  function openModal(p){
    // find index of this project in current modalList
    modalIndex = modalList.findIndex(x => x.id === p.id);
    if (modalIndex < 0) { modalList.push(p); modalIndex = modalList.length - 1; }

    setPanel(modalList[modalIndex]);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';

    updateNavState();
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function updateNavState(){
    const n = modalList.length;
    if (prevBtn) prevBtn.disabled = n <= 1;
    if (nextBtn) nextBtn.disabled = n <= 1;
  }

  function navProject(delta){
    if (!modalList || modalList.length <= 1) return;
    modalIndex = (modalIndex + delta + modalList.length) % modalList.length;
    setPanel(modalList[modalIndex]);
    updateNavState();
  }

  // Buttons
  if (prevBtn)  prevBtn.addEventListener('click', () => navProject(-1));
  if (nextBtn)  nextBtn.addEventListener('click', () => navProject(1));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Click backdrop to close
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Keyboard: Esc / ← / →
  document.addEventListener('keydown', (e)=>{
    if (!modal || !modal.classList.contains('open')) return;
    if (e.key === 'Escape')    { e.preventDefault(); closeModal(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); navProject(-1); }
    if (e.key === 'ArrowRight'){ e.preventDefault(); navProject(1); }
  });

  // Click image left/right halves to navigate projects
  if (slideImg){
    slideImg.addEventListener('click', (e)=>{
      const rect = slideImg.getBoundingClientRect();
      const mid  = rect.left + rect.width/2;
      if (e.clientX < mid) navProject(-1); else navProject(1);
    });
    slideImg.onerror = function(){ fallback(this); };
  }

  // Init
  buildFilters();
  render();
})();

/* === Mobile Hamburger Navigation === */
(function () {
  function init() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    const toggle = nav.querySelector('.nav-toggle');
    const menu   = nav.querySelector('.menu');
    if (!toggle || !menu) return;

    // Toggle main drawer open/close
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Toggle "About" dropdown on mobile
    nav.querySelectorAll('li.has-sub > a').forEach(a => {
      a.addEventListener('click', (e) => {
        if (window.matchMedia('(max-width: 820px)').matches) {
          e.preventDefault();
          const li = a.parentElement;
          li.classList.toggle('open');
          a.setAttribute('aria-expanded', li.classList.contains('open'));
        }
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) nav.classList.remove('open');
    });
  }

  // Wait until nav is injected by importer.js
  const start = () => setTimeout(init, 0);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  document.addEventListener('include:loaded', start);
})();

