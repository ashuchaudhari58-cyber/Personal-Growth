/* ============================================================
   main.js — rendering + interactions
   ============================================================ */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", savedTheme || (prefersDark ? "dark" : "light"));
  $("#themeToggle")?.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav ---------- */
  const burger = $("#navBurger"), navLinks = $("#navLinks");
  function closeMenu() {
    burger?.classList.remove("is-open");
    navLinks?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("is-locked");
  }
  burger?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
  });
  $$("#navLinks a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Nav scroll state + progress + active link ---------- */
  const nav = $("#nav"), progress = $("#scrollProgress");
  const sections = $$("main section[id]");
  const navAnchors = $$('#navLinks a[href^="#"]');
  function onScroll() {
    const y = window.scrollY;
    nav?.classList.toggle("is-scrolled", y > 10);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    let current = "";
    const mid = y + window.innerHeight * 0.32;
    sections.forEach((sec) => { if (sec.offsetTop <= mid) current = sec.id; });
    navAnchors.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + current));
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  function observeReveals() {
    const els = $$(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-visible")); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((en, i) => {
        if (en.isIntersecting) {
          en.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
          en.target.classList.add("is-visible");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Animated counters ---------- */
  function runCounters() {
    $$(".stat__num").forEach((el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || "";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = target + suffix; return; }
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          obs.disconnect();
          const dur = 1400, t0 = performance.now();
          (function tick(now) {
            const p = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          })(t0);
        });
      }, { threshold: 0.5 });
      io.observe(el);
    });
  }

  /* ---------- Render: Projects ---------- */
  const grid = $("#projectGrid");
  function renderProjects() {
    if (!grid || typeof PROJECTS === "undefined") return;
    grid.innerHTML = PROJECTS.map((p) => `
      <article class="card reveal" data-cat="${p.cat}" data-id="${p.id}" tabindex="0" role="button" aria-label="Open case study: ${p.title}">
        <div class="card__visual">
          <span class="card__tag">${p.tag}</span>
          ${p.visual(p.id)}
        </div>
        <div class="card__body">
          <h3 class="card__title">${p.title}</h3>
          <p class="card__desc">${p.desc}</p>
          <div class="card__tools">${p.tools.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
          <span class="card__more">Read case study
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M5 12h12l-5-5 1.4-1.4L21 12l-7.6 6.4L12 17l5-5H5z"/></svg>
          </span>
        </div>
      </article>`).join("");

    $$(".card", grid).forEach((card) => {
      const open = () => openModal(card.dataset.id);
      card.addEventListener("click", open);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  /* ---------- Project filters ---------- */
  $("#projectFilters")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;
    $$(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
    const f = btn.dataset.filter;
    $$(".card", grid).forEach((card) => {
      card.classList.toggle("is-hidden", !(f === "all" || card.dataset.cat === f));
    });
  });

  /* ---------- Modal / case study ---------- */
  const modal = $("#projectModal"), modalContent = $("#modalContent");
  let lastFocus = null;
  function openModal(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;
    const snap = Object.entries(p.snapshot).map(([k, v]) =>
      `<div class="cs__snap"><div class="cs__snap-k">${k}</div><div class="cs__snap-v">${v}</div></div>`).join("");
    modalContent.innerHTML = `
      <div class="cs__hero">${p.visual(p.id + "-modal").replace("xMidYMid slice", "xMidYMid meet")}</div>
      <div class="cs__body">
        <span class="cs__tag">${p.tag}</span>
        <h2 class="cs__title" id="modalTitle">${p.title}</h2>
        <p class="cs__outcome">${p.outcome}</p>
        <div class="cs__snapshot">${snap}</div>
        <div class="cs__section"><h3 class="cs__h">Problem</h3><p>${p.problem}</p></div>
        <div class="cs__section"><h3 class="cs__h">My scope</h3><p>${p.objective}</p></div>
        <div class="cs__section"><h3 class="cs__h">Approach</h3><ul class="cs__list">${p.approach.map((a) => `<li>${a}</li>`).join("")}</ul></div>
        ${p.figures ? `<div class="cs__section"><h3 class="cs__h">Key figures</h3><div class="cs__figs">${p.figures.map(([k, v]) => `<div class="cs__fig"><div class="cs__fig-v">${v}</div><div class="cs__fig-k">${k}</div></div>`).join("")}</div></div>` : ""}
        <div class="cs__section"><h3 class="cs__h">Outcome</h3><ul class="cs__list">${p.results.map((r) => `<li>${r}</li>`).join("")}</ul></div>
        ${p.codes ? `<div class="cs__section"><h3 class="cs__h">Codes &amp; methods</h3><div class="cs__tools">${p.codes.map((t) => `<span class="chip chip--code">${t}</span>`).join("")}</div></div>` : ""}
        <div class="cs__section">
          <h3 class="cs__h">Tools</h3>
          <div class="cs__tools">${p.tools.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
        </div>
      </div>`;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
    modal.querySelector(".modal__close")?.focus();
    modal.querySelector(".modal__panel").scrollTop = 0;
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    lastFocus?.focus();
  }
  modal?.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

  /* ---------- Render: About ---------- */
  const aboutBody = $("#aboutBody");
  if (aboutBody && typeof ABOUT !== "undefined") aboutBody.innerHTML = ABOUT.map((p) => `<p>${p}</p>`).join("");

  /* ---------- Render: Capabilities ---------- */
  const capGrid = $("#capGrid");
  if (capGrid && typeof CAPABILITIES !== "undefined") {
    capGrid.innerHTML = CAPABILITIES.map((c) => `
      <article class="cap reveal">
        <div class="cap__head"><span class="cap__code">${c.code}</span><h3 class="cap__title">${c.title}</h3></div>
        <p class="cap__lede">${c.lede}</p>
        <ul class="cap__list">${c.points.map((p) => `<li>${p}</li>`).join("")}</ul>
        <div class="cap__codes">${c.codes.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      </article>`).join("");
  }

  /* ---------- Render: Methodologies ---------- */
  const methodGrid = $("#methodGrid");
  if (methodGrid && typeof METHODOLOGIES !== "undefined") {
    methodGrid.innerHTML = METHODOLOGIES.map((m) => `
      <article class="method reveal">
        <span class="method__tag">${m.tag}</span>
        <h3 class="method__title">${m.title}</h3>
        <p class="method__desc">${m.desc}</p>
        <div class="method__keys">${m.keys.map((k) => `<span class="chip">${k}</span>`).join("")}</div>
      </article>`).join("");
  }

  /* ---------- Render: Tools ---------- */
  const toolsGrid = $("#toolsGrid");
  if (toolsGrid && typeof TOOLS !== "undefined") {
    toolsGrid.innerHTML = TOOLS.map((t) => `
      <article class="tool reveal">
        <div class="tool__head">
          <h3 class="tool__title">${t.name}</h3>
          <span class="tool__stack">${t.stack}</span>
        </div>
        <p class="tool__desc">${t.desc}</p>
        <ul class="tool__list">${t.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        ${t.url ? `<a class="tool__link" href="${t.url}" target="_blank" rel="noopener">Open live tool
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3zM5 5h6v2H5v12h12v-6h2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"/></svg></a>` : ""}
      </article>`).join("");
  }
  const calcGrid = $("#calcGrid");
  if (calcGrid && typeof CALC_LIBRARY !== "undefined") {
    calcGrid.innerHTML = CALC_LIBRARY.map((g) => `
      <div class="calc reveal">
        <h4 class="calc__title">${g.group}</h4>
        <ul class="calc__list">${g.items.map(([n, b]) => `<li><span class="calc__name">${n}</span><span class="calc__basis">${b}</span></li>`).join("")}</ul>
      </div>`).join("");
  }

  /* ---------- Render: Standards ---------- */
  const stdGrid = $("#stdGrid");
  if (stdGrid && typeof STANDARDS !== "undefined") {
    stdGrid.innerHTML = STANDARDS.map((s) => `
      <div class="std reveal">
        <h3 class="std__title">${s.area}</h3>
        <ul class="std__list">${s.items.map(([code, use]) => `<li><span class="std__code">${code}</span><span class="std__use">${use}</span></li>`).join("")}</ul>
      </div>`).join("");
  }

  /* ---------- Render: Analysis mini-cards ---------- */
  const miniGrid = $("#miniGrid");
  if (miniGrid && typeof ANALYSIS !== "undefined") {
    miniGrid.innerHTML = ANALYSIS.map((a) => `
      <article class="mini reveal">
        <span class="mini__tag">${a.tag}</span>
        <h3 class="mini__title">${a.title}</h3>
        <p class="mini__desc">${a.desc}</p>
        <div class="mini__tools">${a.tools.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
      </article>`).join("");
  }

  /* ---------- Render: Skills ---------- */
  const skillsGrid = $("#skillsGrid");
  if (skillsGrid && typeof SKILL_GROUPS !== "undefined") {
    skillsGrid.innerHTML = SKILL_GROUPS.map((g) => `
      <div class="skill-group reveal">
        <div class="skill-group__head">
          <span class="skill-group__icon">${g.icon}</span>
          <h3 class="skill-group__title">${g.title}</h3>
        </div>
        <div class="skill-group__items">
          ${g.items.map(([name, lvl]) => `<span class="skill" data-level="${lvl}">${name}</span>`).join("")}
        </div>
      </div>`).join("");
  }

  /* ---------- Render: Experience ---------- */
  const timeline = $("#timeline");
  if (timeline && typeof EXPERIENCE !== "undefined") {
    timeline.innerHTML = EXPERIENCE.map((x) => `
      <li class="timeline__item ${x.current ? "timeline__item--current" : ""} reveal">
        <div class="timeline__period">${x.period}</div><div class="timeline__body">
        <h3 class="timeline__role">${x.role}</h3>
        <div class="timeline__company">${x.company} <span>· ${x.location}</span></div>
        <ul class="timeline__list">${x.points.map((p) => `<li>${p}</li>`).join("")}</ul></div>
      </li>`).join("");
  }

  /* ---------- Render: Education / Certs / Languages ---------- */
  function credItem(it) {
    return `<div class="cred__item">
      <div class="cred__item-title">${it.title}</div>
      <div class="cred__item-sub">${it.sub}</div>
      <span class="cred__item-year">${it.year}</span>
    </div>`;
  }
  const eduList = $("#eduList"); if (eduList && typeof EDUCATION !== "undefined") eduList.innerHTML = EDUCATION.map(credItem).join("");
  const certList = $("#certList"); if (certList && typeof CERTIFICATIONS !== "undefined") certList.innerHTML = CERTIFICATIONS.map(credItem).join("");
  const langList = $("#langList");
  if (langList && typeof LANGUAGES !== "undefined") {
    langList.innerHTML = LANGUAGES.map((l) => `
      <div class="lang">
        <div class="lang__top"><span>${l.name}</span><span>${l.level}</span></div>
        <div class="lang__bar"><span class="lang__fill" data-pct="${l.pct}"></span></div>
      </div>`).join("");
    // animate bars on view
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          $$(".lang__fill", langList).forEach((f) => { f.style.width = f.dataset.pct + "%"; });
          obs.disconnect();
        });
      }, { threshold: 0.3 });
      io.observe(langList);
    } else {
      $$(".lang__fill", langList).forEach((f) => { f.style.width = f.dataset.pct + "%"; });
    }
  }

  /* ---------- Contact form → mailto (no backend needed) ---------- */
  const form = $("#contactForm"), note = $("#cfNote");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#cf-name"), email = $("#cf-email"), msg = $("#cf-msg");
    let ok = true;
    [name, email, msg].forEach((el) => {
      const valid = el.value.trim() !== "" && (el.type !== "email" || /\S+@\S+\.\S+/.test(el.value));
      el.closest(".field").classList.toggle("is-error", !valid);
      if (!valid) ok = false;
    });
    if (!ok) { note.textContent = "Please complete all fields with a valid email."; note.classList.remove("is-success"); return; }
    const subject = encodeURIComponent(`Portfolio enquiry — ${name.value.trim()}`);
    const body = encodeURIComponent(`${msg.value.trim()}\n\n— ${name.value.trim()}\n${email.value.trim()}`);
    window.location.href = `mailto:ashutosh17chaudhari@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = "Opening your email app… if nothing happens, email ashutosh17chaudhari@gmail.com directly.";
    note.classList.add("is-success");
  });

  /* ---------- Init ---------- */
  renderProjects();
  observeReveals();
  runCounters();
  onScroll();
})();
