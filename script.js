document.addEventListener("DOMContentLoaded", function () {

  lucide.createIcons();

  /* ------------------------------------------------------------------
     Mobile hamburger nav: toggle the dropdown open/closed, close it
     after tapping a link, and close it if the user taps outside it
     ------------------------------------------------------------------ */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navMenu.querySelectorAll(".nav-item").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (e) {
      if (navMenu.classList.contains("is-open") &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Auto-close the mobile dropdown if the viewport is resized/rotated
    // into the desktop layout while it happens to be open
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 1040 && navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ------------------------------------------------------------------
     Resume request form: builds a mailto link from the form fields
     and opens the visitor's email app with it pre-filled
     ------------------------------------------------------------------ */
  var resumeForm = document.getElementById("resumeRequestForm");
  if (resumeForm) {
    resumeForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("reqName").value.trim();
      var email = document.getElementById("reqEmail").value.trim();
      var message = document.getElementById("reqMessage").value.trim();

      var subject = encodeURIComponent("Resume Request from " + name);
      var body = encodeURIComponent(
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        "Message:\n" + (message || "(no message provided)")
      );

      window.location.href = "mailto:jlimbo.m11182@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  /* ------------------------------------------------------------------
     Scroll-reveal: fade/slide elements with class "reveal" into view
     as they enter the viewport (used on showcase/detail pages)
     ------------------------------------------------------------------ */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Fallback for very old browsers: just show everything immediately
      revealEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* ------------------------------------------------------------------
     Staggered scroll-reveal: like "reveal" above, but each element with
     class "reveal-stagger" gets an increasing delay based on its order,
     so a grid of cards animates in one after another
     ------------------------------------------------------------------ */
  var staggerEls = document.querySelectorAll(".reveal-stagger");
  if (staggerEls.length) {
    if ("IntersectionObserver" in window) {
      var staggerObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var idx = Array.prototype.indexOf.call(staggerEls, el);
            el.style.transitionDelay = (idx % 6) * 90 + "ms";
            el.classList.add("is-visible");
            staggerObserver.unobserve(el);
          }
        });
      }, { threshold: 0.15 });

      staggerEls.forEach(function (el) {
        staggerObserver.observe(el);
      });
    } else {
      staggerEls.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* ------------------------------------------------------------------
     Sticky scroll feature showcase: invisible ".feature-scroll__trigger"
     zones provide scroll height. As each one crosses the center of the
     viewport, swap the pinned image AND text to match its "data-feature"
     value — both stay fixed in place and crossfade (used on project
     showcase pages)
     ------------------------------------------------------------------ */
  var scrollTriggers = document.querySelectorAll(".feature-scroll__trigger");
  var scrollImages = document.querySelectorAll(".feature-scroll__image");
  var scrollDetails = document.querySelectorAll(".feature-scroll__detail");

  if (scrollTriggers.length && "IntersectionObserver" in window) {
    var featureScrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var feature = entry.target.getAttribute("data-feature");

          scrollImages.forEach(function (img) {
            img.classList.toggle("is-active", img.getAttribute("data-feature") === feature);
          });

          scrollDetails.forEach(function (detail) {
            detail.classList.toggle("is-active", detail.getAttribute("data-feature") === feature);
          });
        }
      });
    }, {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0
    });

    scrollTriggers.forEach(function (trigger) {
      featureScrollObserver.observe(trigger);
    });
  }

  /* ------------------------------------------------------------------
     Page-load reveal: fade out the loading screen once ready
     ------------------------------------------------------------------ */
  var loader = document.getElementById("pageLoader");
  if (loader) {
    window.requestAnimationFrame(function () {
      setTimeout(function () {
        loader.classList.add("page-loader--hidden");
        setTimeout(function () {
          loader.remove();
        }, 500);
      }, 250);
    });
  }

  /* ------------------------------------------------------------------
     Page-transition animation: fade out before navigating away
     ------------------------------------------------------------------ */
  document.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href");
    if (!href) return;

    // Ignore same-page anchors, external links, mail/tel links, and modified clicks
    var isSamePageAnchor = href.indexOf("#") === 0;
    var isExternal = /^https?:\/\//i.test(href) || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0;
    var opensNewTab = link.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;

    if (isSamePageAnchor || isExternal || opensNewTab) return;

    // Internal navigation to another page (index.html or others.html, with or without an anchor)
    e.preventDefault();
    var overlay = document.createElement("div");
    overlay.className = "page-transition";
    overlay.innerHTML = '<div class="page-transition__spinner"></div>';
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add("page-transition--visible");
    });

    setTimeout(function () {
      window.location.href = href;
    }, 320);
  });

});