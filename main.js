/* =========================
   ZADRA – main.js (all pages)
   ========================= */

/* ---------- Mobile nav toggle ---------- */
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('show');
}

/* ---------- Scroll-shrink navbar (logo only, fixed header height) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 10) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };

  onScroll(); // initial state
  window.addEventListener('scroll', onScroll, { passive: true });
});

/* ---------- Reveal-on-scroll animations ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const revealables = document.querySelectorAll('.fade-in, .slide-up, .zoom-in');
  if (!revealables.length) return;

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );

  revealables.forEach((el) => io.observe(el));
});

/* ---------- Services accordion (if present) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  window.toggleService = function (header) {
    const details = header?.nextElementSibling;
    if (!details) return;

    const isOpen = details.style.display === 'block';
    document.querySelectorAll('.service-details').forEach((el) => (el.style.display = 'none'));
    details.style.display = isOpen ? 'none' : 'block';
  };
});

/* ---------- Projects: per-side category filters ---------- */
/* Expects:
   - .filter-bar[data-side="previous|current"] with .filter buttons (data-category)
   - .project-card[data-side="previous|current"][data-category="space separated list"]
*/
document.addEventListener('DOMContentLoaded', () => {
  const bars = document.querySelectorAll('.filter-bar');
  if (!bars.length) return;

  bars.forEach((bar) => {
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter');
      if (!btn) return;

      // activate clicked button
      bar.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const side = bar.getAttribute('data-side'); // "previous" or "current"
      const category = btn.dataset.category || 'all';
      const cards = document.querySelectorAll(`.project-card[data-side="${side}"]`);

      cards.forEach((card) => {
        if (category === 'all') { card.classList.remove('hidden'); return; }
        const tags = (card.getAttribute('data-category') || '').toLowerCase().split(/\s+/);
        if (tags.includes(category.toLowerCase())) card.classList.remove('hidden');
        else card.classList.add('hidden');
      });
    });
  });
});

/* ---------- Auto-sort projects by year (desc) per list ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const lists = document.querySelectorAll('.project-list');
  lists.forEach((list) => {
    const cards = Array.from(list.querySelectorAll('.project-card'));
    cards.sort((a, b) => {
      const ya = parseInt(a.getAttribute('data-year') || '0', 10);
      const yb = parseInt(b.getAttribute('data-year') || '0', 10);
      return yb - ya; // newest first
    });
    cards.forEach((c) => list.appendChild(c));
  });
});
/* ===== ABOUT sub-tabs ===== */
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.about-tab');
  const panels = document.querySelectorAll('.about-panel');
  if (!tabs.length || !panels.length) return;

  const activate = (key) => {
    tabs.forEach(t => {
      const is = t.dataset.tab === key;
      t.classList.toggle('active', is);
      t.setAttribute('aria-selected', String(is));
    });
    panels.forEach(p => p.classList.toggle('active', p.id === `panel-${key}`));
    // Update hash for deep links
    history.replaceState(null, '', `#${key}`);
  };

  // Clicks
  tabs.forEach(t => t.addEventListener('click', () => activate(t.dataset.tab)));

  // Load from hash (e.g., about.html#services)
  const fromHash = (location.hash || '').replace('#','');
  if (fromHash && document.getElementById(`panel-${fromHash}`)) {
    activate(fromHash);
  }
});
/* ===== NAV dropdown: mobile tap to open/close ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Only needed on mobile widths; harmless elsewhere.
  document.querySelectorAll('.has-submenu > a.submenu-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      // If nav is in mobile mode (menu expanded), toggle submenu
      const navLinks = document.getElementById('navLinks');
      const parent = toggle.closest('.has-submenu');
      if (navLinks && navLinks.classList.contains('show') && parent) {
        e.preventDefault();
        const isOpen = parent.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      }
    });
  });
});

// Contact form: mailto via JS
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements['name'].value.trim();
    const email = form.elements['email'].value.trim();
    const message = form.elements['message'].value.trim();

    const subject = encodeURIComponent('Website Contact');
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    const mailto = `mailto:zadrac007@gmail.com?subject=${subject}&body=${body}`;

    // Try to open the mail client
    window.location.href = mailto;

    // Show a gentle hint in case nothing happens
    const note = document.getElementById('contactNote');
    if (note) {
      note.style.display = 'block';
      note.textContent = "If your email app didn’t open, your device may not have a mail client set up. You can email us at zadrac007@gmail.com.";
    }
  });
});

// ===== Contact form (Formspree async) =====
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const statusEl = document.getElementById('formStatus');
  const btn = document.getElementById('contactSubmit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // basic front-end validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // disable while sending
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    statusEl.textContent = '';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        statusEl.textContent = 'Thanks! Your message has been sent.';
        statusEl.classList.remove('error');
        statusEl.classList.add('ok');
      } else {
        // try to read Formspree errors
        const json = await res.json().catch(() => ({}));
        const msg = (json && json.errors && json.errors.map(e => e.message).join(', ')) || 'Something went wrong. Please try again later.';
        statusEl.textContent = msg;
        statusEl.classList.remove('ok');
        statusEl.classList.add('error');
      }
    } catch (err) {
      statusEl.textContent = 'Network error. Please check your connection and try again.';
      statusEl.classList.remove('ok');
      statusEl.classList.add('error');
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
});

// Compute header height for mobile panel offset
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    const setH = () => {
      document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    };
    setH();
    window.addEventListener('resize', setH);
  }
});

// Burger toggle
function toggleMenu(){
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;
  navLinks.classList.toggle('show');
  document.body.classList.toggle('menu-open', navLinks.classList.contains('show'));
  // close any open submenus when closing the panel
  if (!navLinks.classList.contains('show')) {
    document.querySelectorAll('.has-submenu.open').forEach(p => p.classList.remove('open'));
  }
}

// Mobile: tap “About” to open/close its submenu
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.has-submenu > a.submenu-toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      const navLinks = document.getElementById('navLinks');
      const parent = toggle.closest('.has-submenu');
      // Only hijack on mobile (when panel is open)
      if (navLinks && navLinks.classList.contains('show') && parent) {
        e.preventDefault();
        parent.classList.toggle('open');
      }
    });
  });
});



