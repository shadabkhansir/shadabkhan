/* ============================================================
   SHADAB KHAN — PORTFOLIO INTERACTIONS
   Vanilla JS, no libraries. Features:
     1. Mobile full-screen menu
     2. Scroll reveals (IntersectionObserver)
     3. Reading-progress line + nav border + active section link
     4. Case-study accordions (accessible)
     5. Cursor glow (fine pointers only)
   Everything defers to prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Mobile menu ---------- */
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("mobileMenu");

  function setMenu(open) {
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  setMenu(false);

  burger.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) setMenu(false);
  });

  /* ---------- 2. Scroll reveals ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- 3. Progress line + nav state + active link ---------- */
  const progress = document.querySelector(".progress");
  const nav = document.getElementById("nav");
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? (y / max) * 100 + "%" : "0%";
    nav.classList.toggle("scrolled", y > 10);

    let current = "";
    sections.forEach((s) => {
      if (y >= s.offsetTop - 140) current = s.id;
    });
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Case-study accordions ---------- */
  // Buttons carry aria-expanded; panels animate open via the
  // grid-template-rows 0fr→1fr transition in CSS.
  document.querySelectorAll(".case-head[aria-controls]").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.classList.toggle("open", !open);
    });
  });

  /* ---------- 5. Capability tabs ---------- */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      tabPanels.forEach((p) => {
        const on = p.id === btn.getAttribute("aria-controls");
        p.hidden = !on;
        // re-toggling .active restarts the chip cascade animation
        p.classList.remove("active");
        if (on) requestAnimationFrame(() => p.classList.add("active"));
      });
    });
  });
  // arrow-key support on the tablist
  document.querySelector(".tab-list")?.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const list = Array.from(tabBtns);
    const i = list.indexOf(document.activeElement);
    if (i === -1) return;
    const next = list[(i + (e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length];
    next.focus();
    next.click();
  });

  /* ---------- 6. Certificate images (graceful) ---------- */
  // Each credential can declare data-cert="certs/<file>". We probe the file
  // with an off-screen Image: if it loads, a "view certificate" button is
  // injected that opens the lightbox. If it 404s, nothing happens — the
  // credential simply shows without a view option. No errors surface.
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCap = document.getElementById("lightboxCap");
  const lightboxClose = document.getElementById("lightboxClose");
  let lastCertTrigger = null;

  function openLightbox(src, title, trigger) {
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxCap.textContent = title;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lastCertTrigger = trigger;
    lightboxClose.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastCertTrigger) lastCertTrigger.focus();
  }
  if (lightbox) {
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  }

  document.querySelectorAll(".cred[data-cert]").forEach((li) => {
    const src = li.dataset.cert;
    const title = li.dataset.certTitle || "Certificate";
    if (!src) return;
    const probe = new Image();
    probe.onload = () => {
      const btn = document.createElement("button");
      btn.className = "cred-view";
      btn.textContent = "view certificate ↗";
      btn.addEventListener("click", () => openLightbox(src, title, btn));
      li.querySelector(".cred-meta").prepend(btn);
    };
    // onerror: intentionally do nothing — missing file, no button, no error
    probe.src = src;
  });

  /* ---------- 7. Testimonials carousel ---------- */
  const track = document.getElementById("testiTrack");
  const carousel = document.getElementById("testiCarousel");
  const dots = document.querySelectorAll(".testi-dot");
  let testiIndex = 0;
  let testiTimer = null;

  function goTo(i) {
    testiIndex = (i + dots.length) % dots.length;
    track.style.transform = `translateX(-${testiIndex * 100}%)`;
    dots.forEach((d, n) => {
      d.classList.toggle("active", n === testiIndex);
      d.setAttribute("aria-selected", String(n === testiIndex));
    });
  }
  function startAuto() {
    if (reduceMotion || testiTimer) return;
    testiTimer = setInterval(() => goTo(testiIndex + 1), 6000);
  }
  function stopAuto() {
    clearInterval(testiTimer);
    testiTimer = null;
  }

  if (track && dots.length) {
    dots.forEach((d, n) =>
      d.addEventListener("click", () => { goTo(n); stopAuto(); startAuto(); })
    );
    // pause while the reader is engaging with it
    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);
    startAuto();
  }

  /* ---------- 8. Cursor glow ---------- */
  // A large, very faint accent radial that trails the pointer.
  // Skipped for touch devices and reduced-motion users.
  const glow = document.querySelector(".cursor-glow");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (glow && finePointer && !reduceMotion) {
    let gx = 0, gy = 0, tx = 0, ty = 0, raf = null;

    function tick() {
      // ease toward the target for a soft trailing feel
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx - 280}px, ${gy - 280}px)`;
      if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    window.addEventListener("pointermove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    window.addEventListener("pointerleave", () => { glow.style.opacity = "0"; });
  }

  /* ---------- 9. Lifecycle loop dots (cross-browser) ---------- */
  // SMIL animateMotion proved unreliable on some desktop setups, so the
  // travelling dots are driven by requestAnimationFrame along the hidden
  // #loopTrack path instead. This is the site's signature animation and
  // runs regardless of OS motion settings (it's small and contained).
  const loopTrack = document.getElementById("loopTrack");
  const loopDots = [
    { el: document.getElementById("loopDot1"), offset: 0 },
    { el: document.getElementById("loopDot2"), offset: 0.5 },
  ];

  if (loopTrack && loopDots.every((d) => d.el) && loopTrack.getTotalLength) {
    const trackLen = loopTrack.getTotalLength();
    const CYCLE_MS = 12000;

    function moveDots(now) {
      const t = (now % CYCLE_MS) / CYCLE_MS;
      loopDots.forEach((d) => {
        const pt = loopTrack.getPointAtLength(((t + d.offset) % 1) * trackLen);
        d.el.setAttribute("cx", pt.x.toFixed(1));
        d.el.setAttribute("cy", pt.y.toFixed(1));
      });
      requestAnimationFrame(moveDots);
    }
    requestAnimationFrame(moveDots);
  }

  /* ---------- 10. Theme switch (normal ↔ black & white) ---------- */
  // The <head> snippet applies the saved theme before first paint;
  // this button just flips it and keeps the label in sync.
  const themeBtn = document.getElementById("themeToggle");

  function syncThemeButton() {
    const mono = document.documentElement.getAttribute("data-theme") === "mono";
    themeBtn.textContent = mono ? "◐ Colour" : "◐ B/W";
    themeBtn.setAttribute(
      "aria-label",
      mono ? "Switch to colour theme" : "Switch to black and white theme"
    );
  }
  if (themeBtn) {
    syncThemeButton();
    themeBtn.addEventListener("click", () => {
      const mono = document.documentElement.getAttribute("data-theme") === "mono";
      if (mono) {
        document.documentElement.removeAttribute("data-theme");
      } else {
        document.documentElement.setAttribute("data-theme", "mono");
      }
      try { localStorage.setItem("theme", mono ? "normal" : "mono"); } catch (e) { /* ignore */ }
      syncThemeButton();
    });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
