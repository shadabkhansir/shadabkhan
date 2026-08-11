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

  /* ---------- 5. Cursor glow ---------- */
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

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
