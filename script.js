/* ============================================================
   SHADAB KHAN — PORTFOLIO INTERACTIONS
   Vanilla JS, no libraries.

   ARCHITECTURE NOTE (important):
   Every feature is registered through feature() below, which wraps it
   in its own try/catch. If one feature fails on some browser or
   version, the others still run — previously a single early error
   could silently kill everything defined after it.

   Order matters: the two most visible features (theme switch and the
   lifecycle animation) are registered FIRST so nothing else can
   affect them.
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) { /* older browsers: assume motion is fine */ }

  /** Run a feature in isolation — a failure here never blocks the rest. */
  function feature(name, fn) {
    try {
      fn();
    } catch (err) {
      // Logged for debugging; the page keeps working without this feature.
      if (window.console && console.warn) console.warn("[portfolio] " + name + " failed:", err);
    }
  }

  /* ================= 1. THEME SWITCH (Normal ↔ Mono) ================= */
  feature("theme", function () {
    var root = document.documentElement;
    var btn = document.getElementById("themeToggle");
    var label = document.getElementById("themeLabel");
    if (!btn) return;

    function isMono() {
      return root.getAttribute("data-theme") === "mono";
    }

    function sync() {
      var mono = isMono();
      if (label) label.textContent = mono ? "Mono" : "Normal";
      btn.setAttribute("aria-checked", mono ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        mono ? "Switch to normal colour view" : "Switch to black and white view"
      );
    }

    btn.addEventListener("click", function () {
      var goingMono = !isMono();
      if (goingMono) {
        root.setAttribute("data-theme", "mono");
      } else {
        root.removeAttribute("data-theme");
      }
      // Persist, but never let a storage failure block the visual switch.
      try {
        localStorage.setItem("theme", goingMono ? "mono" : "normal");
      } catch (e) { /* private mode / file:// — switch still works this session */ }
      sync();
    });

    sync();
  });

  /* ================= 2. LIFECYCLE LOOP ANIMATION ================= */
  // Two dots travel the full customer journey. Driven by
  // requestAnimationFrame sampling the hidden #loopTrack path, which works
  // consistently across browsers (SVG SMIL did not). Runs regardless of the
  // OS "reduce motion" setting — this diagram is the site's signature and
  // is small, contained, and non-flashing.
  feature("lifecycle-loop", function () {
    var track = document.getElementById("loopTrack");
    var dot1 = document.getElementById("loopDot1");
    var dot2 = document.getElementById("loopDot2");
    if (!track || !dot1 || !dot2 || typeof track.getTotalLength !== "function") return;

    var len = track.getTotalLength();
    if (!len) return;

    var CYCLE = 12000; // ms for one full lap
    var dots = [
      { el: dot1, offset: 0 },
      { el: dot2, offset: 0.5 },
    ];

    function frame(now) {
      var t = (now % CYCLE) / CYCLE;
      for (var i = 0; i < dots.length; i++) {
        var p = track.getPointAtLength(((t + dots[i].offset) % 1) * len);
        dots[i].el.setAttribute("cx", p.x.toFixed(1));
        dots[i].el.setAttribute("cy", p.y.toFixed(1));
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });

  /* ================= 3. MOBILE MENU ================= */
  feature("mobile-menu", function () {
    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("mobileMenu");
    if (!burger || !menu) return;

    function setMenu(open) {
      menu.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    }
    setMenu(false);

    burger.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) setMenu(false);
    });
  });

  /* ================= 4. SCROLL REVEALS ================= */
  feature("reveals", function () {
    var els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) els[i].classList.add("visible");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    for (var j = 0; j < els.length; j++) io.observe(els[j]);
  });

  /* ================= 5. PROGRESS BAR + NAV + ACTIVE LINK ================= */
  feature("scroll-state", function () {
    var progress = document.querySelector(".progress");
    var nav = document.getElementById("nav");
    var sections = document.querySelectorAll("section[id]");
    var anchors = document.querySelectorAll(".nav-links a[href^='#']");

    function onScroll() {
      var y = window.scrollY;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = max > 0 ? (y / max) * 100 + "%" : "0%";
      if (nav) nav.classList.toggle("scrolled", y > 10);

      var current = "";
      for (var i = 0; i < sections.length; i++) {
        if (y >= sections[i].offsetTop - 140) current = sections[i].id;
      }
      for (var j = 0; j < anchors.length; j++) {
        anchors[j].classList.toggle("active", anchors[j].getAttribute("href") === "#" + current);
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });

  /* ================= 6. CASE-STUDY ACCORDIONS ================= */
  feature("accordions", function () {
    var heads = document.querySelectorAll(".case-head[aria-controls]");
    for (var i = 0; i < heads.length; i++) {
      (function (btn) {
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        if (!panel) return;
        btn.addEventListener("click", function () {
          var open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!open));
          panel.classList.toggle("open", !open);
        });
      })(heads[i]);
    }
  });

  /* ================= 7. CAPABILITY TABS ================= */
  feature("tabs", function () {
    var btns = document.querySelectorAll(".tab-btn");
    var panels = document.querySelectorAll(".tab-panel");
    if (!btns.length) return;

    function activate(btn) {
      for (var i = 0; i < btns.length; i++) {
        var on = btns[i] === btn;
        btns[i].classList.toggle("active", on);
        btns[i].setAttribute("aria-selected", String(on));
      }
      for (var j = 0; j < panels.length; j++) {
        (function (p) {
          var on = p.id === btn.getAttribute("aria-controls");
          p.hidden = !on;
          p.classList.remove("active"); // restart the chip cascade
          if (on) requestAnimationFrame(function () { p.classList.add("active"); });
        })(panels[j]);
      }
    }

    for (var k = 0; k < btns.length; k++) {
      (function (b) {
        b.addEventListener("click", function () { activate(b); });
      })(btns[k]);
    }

    var list = document.querySelector(".tab-list");
    if (list) {
      list.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var arr = Array.prototype.slice.call(btns);
        var i = arr.indexOf(document.activeElement);
        if (i === -1) return;
        var next = arr[(i + (e.key === "ArrowRight" ? 1 : arr.length - 1)) % arr.length];
        next.focus();
        next.click();
      });
    }
  });

  /* ================= 8. CERTIFICATES + LIGHTBOX ================= */
  // Each credential may declare data-cert="certs/<file>". The file is probed
  // with an off-screen Image: if it loads, a "view certificate" button is
  // injected. If it is missing, nothing appears and no error is shown.
  feature("certificates", function () {
    var lightbox = document.getElementById("lightbox");
    var img = document.getElementById("lightboxImg");
    var cap = document.getElementById("lightboxCap");
    var closeBtn = document.getElementById("lightboxClose");
    var lastTrigger = null;

    function open(src, title, trigger) {
      if (!lightbox) return;
      img.src = src;
      img.alt = title;
      cap.textContent = title;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lastTrigger = trigger;
      closeBtn.focus();
    }
    function close() {
      if (!lightbox) return;
      lightbox.hidden = true;
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    }

    if (lightbox && closeBtn) {
      closeBtn.addEventListener("click", close);
      lightbox.addEventListener("click", function (e) {
        if (e.target === lightbox) close();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !lightbox.hidden) close();
      });
    }

    var creds = document.querySelectorAll(".cred[data-cert]");
    for (var i = 0; i < creds.length; i++) {
      (function (li) {
        var src = li.getAttribute("data-cert");
        var title = li.getAttribute("data-cert-title") || "Certificate";
        if (!src) return;
        var probe = new Image();
        probe.onload = function () {
          var meta = li.querySelector(".cred-meta");
          if (!meta) return;
          var btn = document.createElement("button");
          btn.className = "cred-view";
          btn.textContent = "view certificate ↗";
          btn.addEventListener("click", function () { open(src, title, btn); });
          meta.insertBefore(btn, meta.firstChild);
        };
        // no onerror handler: a missing file simply means no button
        probe.src = src;
      })(creds[i]);
    }
  });

  /* ================= 9. TESTIMONIAL CAROUSEL ================= */
  feature("testimonials", function () {
    var track = document.getElementById("testiTrack");
    var carousel = document.getElementById("testiCarousel");
    var dots = document.querySelectorAll(".testi-dot");
    if (!track || !carousel || !dots.length) return;

    var index = 0;
    var timer = null;

    function goTo(i) {
      index = (i + dots.length) % dots.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      for (var n = 0; n < dots.length; n++) {
        dots[n].classList.toggle("active", n === index);
        dots[n].setAttribute("aria-selected", String(n === index));
      }
    }
    function start() {
      if (reduceMotion || timer) return;
      timer = setInterval(function () { goTo(index + 1); }, 6000);
    }
    function stop() {
      clearInterval(timer);
      timer = null;
    }

    for (var d = 0; d < dots.length; d++) {
      (function (n) {
        dots[n].addEventListener("click", function () { goTo(n); stop(); start(); });
      })(d);
    }
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);
    start();
  });

  /* ================= 10. CURSOR GLOW ================= */
  feature("cursor-glow", function () {
    var glow = document.querySelector(".cursor-glow");
    if (!glow || reduceMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var gx = 0, gy = 0, tx = 0, ty = 0, raf = null;

    function tick() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = "translate(" + (gx - 280) + "px," + (gy - 280) + "px)";
      if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
      }
    }

    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    }, { passive: true });

    window.addEventListener("pointerleave", function () { glow.style.opacity = "0"; });
  });

  /* ================= 11. FOOTER YEAR ================= */
  feature("year", function () {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  });
})();
