/* ============================================================
   SHADAB KHAN — PORTFOLIO INTERACTIONS
   Small, dependency-free. Four features:
     1. Mobile nav toggle
     2. Scroll-reveal animations (IntersectionObserver)
     3. Scroll progress bar + nav shadow + active link highlight
     4. Animated number count-up on the hero stats
   All effects respect prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- 1. Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu after tapping a link
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- 2. Scroll-reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    // No animation: just show everything
    revealEls.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target); // animate once only
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- 3. Scroll progress + nav state + active section ---------- */
  const progressBar = document.querySelector(".scroll-progress");
  const nav = document.getElementById("nav");
  const sections = document.querySelectorAll("section[id]");
  const menuAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar width
    progressBar.style.width =
      docHeight > 0 ? (scrollTop / docHeight) * 100 + "%" : "0%";

    // Nav border/shadow once the page moves
    nav.classList.toggle("scrolled", scrollTop > 10);

    // Highlight the nav link for the section currently in view
    let currentId = "";
    sections.forEach((section) => {
      if (scrollTop >= section.offsetTop - 120) {
        currentId = section.id;
      }
    });
    menuAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + currentId);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // set initial state

  /* ---------- 4. Hero stat count-up ---------- */
  // Numbers animate from 0 to their real value the first time they scroll
  // into view. Values come from data-count / data-suffix attributes, so the
  // HTML always contains the correct final number even if JS is disabled.
  const statNums = document.querySelectorAll(".stat-num[data-count]");

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1200; // ms
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    statNums.forEach((el) => statObserver.observe(el));
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
