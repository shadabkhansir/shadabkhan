/* ============================================================
   SHADAB KHAN — PORTFOLIO INTERACTIONS
   Vanilla JS, no libraries.

   ARCHITECTURE NOTE (important):
   Every feature is registered through feature() below, which wraps it
   in its own try/catch. If one feature fails on some browser or
   version, the others still run — a single early error can no longer
   silently kill everything defined after it.

   Order matters: the most visible features (theme switch, lifecycle
   animation, sliders) are registered FIRST.
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
      if (window.console && console.warn) console.warn("[portfolio] " + name + " failed:", err);
    }
  }

  /* ================= 1. THEME SWITCH (Dark ↔ Light) ================= */
  feature("theme", function () {
    var root = document.documentElement;
    var btn = document.getElementById("themeToggle");
    var label = document.getElementById("themeLabel");
    if (!btn) return;

    function isLight() {
      return root.getAttribute("data-theme") === "light";
    }

    function sync() {
      var light = isLight();
      // The label names the theme you are currently viewing.
      if (label) label.textContent = light ? "Light" : "Dark";
      btn.setAttribute("aria-checked", light ? "true" : "false");
      btn.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    }

    btn.addEventListener("click", function () {
      var goingLight = !isLight();
      if (goingLight) {
        root.setAttribute("data-theme", "light");
      } else {
        root.removeAttribute("data-theme");
      }
      // Persist, but never let a storage failure block the visual switch.
      try {
        localStorage.setItem("theme", goingLight ? "light" : "dark");
      } catch (e) { /* private mode / file:// — switch still works this session */ }
      sync();
    });

    sync();
  });

  /* ================= 2. LIFECYCLE LOOP ANIMATION ================= */
  // Two dots travel the full customer journey, driven by
  // requestAnimationFrame sampling the hidden #loopTrack path (SVG SMIL
  // proved unreliable in some desktop browsers). Runs regardless of the
  // OS "reduce motion" setting — it is the site's signature, small and slow.
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

    // Only animate while the diagram is on screen, so it doesn't use CPU
    // (and battery) while the visitor reads the rest of the page.
    var running = false;
    function frame(now) {
      if (!running) return;
      var t = (now % CYCLE) / CYCLE;
      for (var i = 0; i < dots.length; i++) {
        var p = track.getPointAtLength(((t + dots[i].offset) % 1) * len);
        dots[i].el.setAttribute("cx", p.x.toFixed(1));
        dots[i].el.setAttribute("cy", p.y.toFixed(1));
      }
      requestAnimationFrame(frame);
    }
    function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
    function stop() { running = false; }

    var section = track.closest ? track.closest(".loop-section") : null;
    if (section && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { rootMargin: "100px" }).observe(section);
    } else {
      start();
    }
  });

  /* ================= 3. TOOLS & CHANNELS SLIDERS ================= */
  // Any .slider containing a .slider-track list auto-revolves.
  //   data-speed     = pixels per second (default 40)
  //   data-direction = "left" | "right" (default left)
  // The original <li> items are cloned (aria-hidden) until the track is
  // long enough to loop without gaps, so adding or removing items in the
  // HTML needs no other change. Hover / focus pauses a row. Rows also
  // pause while off-screen to save battery.
  feature("sliders", function () {
    var sliders = Array.prototype.slice.call(document.querySelectorAll(".slider"));
    if (!sliders.length) return;

    var rows = sliders.map(function (el) {
      var track = el.querySelector(".slider-track");
      var row = {
        el: el,
        track: track,
        speed: parseFloat(el.getAttribute("data-speed")) || 40,
        dir: el.getAttribute("data-direction") === "right" ? -1 : 1,
        pos: 0,
        setWidth: 0,
        hovered: false,
        onScreen: true,
      };
      el.addEventListener("mouseenter", function () { row.hovered = true; });
      el.addEventListener("mouseleave", function () { row.hovered = false; });
      el.addEventListener("focusin", function () { row.hovered = true; });
      el.addEventListener("focusout", function () { row.hovered = false; });
      return row;
    });

    // (Re)build clones so the track covers one full set + the visible width.
    function build(row) {
      if (!row.track) return;
      var clones = row.track.querySelectorAll("[data-clone]");
      for (var i = 0; i < clones.length; i++) clones[i].parentNode.removeChild(clones[i]);

      var originals = Array.prototype.slice.call(row.track.children);
      if (!originals.length) return;

      row.setWidth = row.track.offsetWidth;          // width of one full set
      if (!row.setWidth) return;

      var guard = 0;
      while (row.track.offsetWidth < row.setWidth + row.el.clientWidth + 1 && guard < 50) {
        originals.forEach(function (li) {
          var c = li.cloneNode(true);
          c.setAttribute("aria-hidden", "true");
          c.setAttribute("data-clone", "");
          row.track.appendChild(c);
        });
        guard++;
      }
      row.pos = row.pos % row.setWidth;
    }

    function buildAll() { rows.forEach(build); }
    buildAll();

    // Widths change once web fonts arrive and on resize — rebuild then.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildAll);
    window.addEventListener("load", buildAll);
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(buildAll, 150);
    });

    // Pause rows that are off-screen.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          rows.forEach(function (r) {
            if (r.el === entry.target) r.onScreen = entry.isIntersecting;
          });
        });
      });
      rows.forEach(function (r) { io.observe(r.el); });
    }

    var last = null;
    function frame(now) {
      // cap dt so a backgrounded tab doesn't cause a big jump on return
      var dt = last === null ? 0 : Math.min((now - last) / 1000, 0.05);
      last = now;
      rows.forEach(function (r) {
        if (!r.setWidth || r.hovered || !r.onScreen) return;
        r.pos += r.dir * r.speed * dt;
        r.pos = ((r.pos % r.setWidth) + r.setWidth) % r.setWidth;
        r.track.style.transform = "translate3d(" + (-r.pos).toFixed(2) + "px,0,0)";
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });

  /* ================= 4. MOBILE MENU ================= */
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

  /* ================= 5. SCROLL REVEALS ================= */
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

  /* ================= 6. PROGRESS BAR + NAV + ACTIVE LINK ================= */
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

  /* ================= 7. CASE-STUDY ACCORDIONS ================= */
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

  /* ================= 8. CAPABILITY TABS ================= */
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

  /* ================= 9. PORTRAIT TILT ================= */
  // The About photo leans gently toward the cursor (max ~6°).
  // Desktop pointers only; skipped for reduced motion.
  feature("photo-tilt", function () {
    var tilt = document.getElementById("photoTilt");
    if (!tilt || reduceMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var area = tilt.closest(".about-grid") || tilt;

    area.addEventListener("mousemove", function (e) {
      var r = tilt.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / r.width;   // ~ -1..1
      var y = (e.clientY - (r.top + r.height / 2)) / r.height;
      x = Math.max(-1, Math.min(1, x));
      y = Math.max(-1, Math.min(1, y));
      tilt.style.transform =
        "perspective(900px) rotateY(" + (x * 6).toFixed(2) + "deg) rotateX(" + (-y * 5).toFixed(2) + "deg)";
    });
    area.addEventListener("mouseleave", function () {
      tilt.style.transform = "";
    });
  });

  /* ================= 10. EXPERIENCE DURATIONS ================= */
  // Each .xp carries data-start="YYYY-MM" and data-end="YYYY-MM"|"present".
  // The tenure label is computed so the current role stays accurate.
  feature("durations", function () {
    var items = document.querySelectorAll(".xp[data-start]");
    var now = new Date();

    function parse(v) {
      if (!v || v === "present") return { y: now.getFullYear(), m: now.getMonth() + 1 };
      var p = v.split("-");
      return { y: parseInt(p[0], 10), m: parseInt(p[1], 10) };
    }

    for (var i = 0; i < items.length; i++) {
      var s = parse(items[i].getAttribute("data-start"));
      var e = parse(items[i].getAttribute("data-end"));
      var months = (e.y - s.y) * 12 + (e.m - s.m) + 1; // inclusive, LinkedIn-style
      if (!(months > 0)) continue;
      var y = Math.floor(months / 12);
      var m = months % 12;
      var parts = [];
      if (y) parts.push(y + (y === 1 ? " yr" : " yrs"));
      if (m) parts.push(m + (m === 1 ? " mo" : " mos"));
      var out = items[i].querySelector(".xp-dur");
      if (out) out.textContent = parts.join(" ");
    }
  });

  /* ================= 11. CERTIFICATES + LIGHTBOX ================= */
  // Each "view certificate" is a plain link to the image (like the résumé
  // button). Nothing is downloaded on page load: the image is fetched only
  // when someone clicks, and shown in the on-page viewer. Without JS the
  // link still works and opens the image in a new tab.
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

    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("a.cred-view");
      if (!link || !lightbox) return;
      // let modified clicks (new tab / new window) behave like a normal link
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      open(link.getAttribute("href"), link.getAttribute("data-cert-title") || "Certificate", link);
    });
  });

  /* ================= 12. TESTIMONIAL CAROUSEL ================= */
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

  /* ================= 13. CURSOR GLOW ================= */
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

  /* ================= 14. FOOTER YEAR ================= */
  feature("year", function () {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  });
})();
