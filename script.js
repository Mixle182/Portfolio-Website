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

  /* Brand Guide image fan: keep one image centered until the visitor opens it */
  var imageFans = document.querySelectorAll(".mission-vision__fan");
  imageFans.forEach(function (fan) {
    function toggleFan() {
      var isExpanded = fan.classList.toggle("is-spread");
      fan.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    }

    fan.addEventListener("click", toggleFan);
    fan.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFan();
      }
    });
  });

  /* ------------------------------------------------------------------
     Page-load reveal: fade out the loading screen once ready.
     On browser back/forward, skip the loader so the restored page appears
     immediately instead of waiting through the loading animation.
     ------------------------------------------------------------------ */
  var loader = document.getElementById("pageLoader");
  var navType = window.performance && performance.getEntriesByType("navigation")[0]
    ? performance.getEntriesByType("navigation")[0].type
    : "navigate";

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("page-loader--hidden");
    setTimeout(function () {
      loader.remove();
    }, 180);
  }

  if (loader) {
    if (navType === "back_forward") {
      hideLoader();
    } else {
      window.requestAnimationFrame(function () {
        setTimeout(hideLoader, 180);
      });
    }
  }

  window.addEventListener("pageshow", function (event) {
    if (event.persisted || performance.getEntriesByType("navigation")[0]?.type === "back_forward") {
      if (loader) hideLoader();
    }
  });

  /* ------------------------------------------------------------------
     Page-transition animation: fade out before navigating away.
     Skips the artificial delay for browser back/forward navigation.
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

    // Keep the page transition for normal internal navigation, but avoid
    // slowing down browser history restores.
    e.preventDefault();

    var themeMap = {
      "index.html": { bg: "#0b0f1a", accent: "#00d9ff" },
      "others.html": { bg: "#160a14", accent: "#ff2d55" },
      "digital-work-news-website.html": { bg: "#0c3049", accent: "#dd9a35" },
      "digital-work-mixle.html": { bg: "#17171a", accent: "#ef7d8a" },
      "digital-work-scamester.html": { bg: "#0b0f14", accent: "#4ee6c2" },
      "digital-work-brand-guide.html": { bg: "#0c3049", accent: "#dd9a35" }
    };

    function resolveTheme(hrefValue) {
      var page = hrefValue.split("?")[0].split("#")[0].split("/").pop() || "index.html";
      return themeMap[page] || { bg: getComputedStyle(document.body).backgroundColor || "#0b0f1a", accent: getComputedStyle(document.documentElement).getPropertyValue("--page-loader-accent") || "#00d9ff" };
    }

    var currentTheme = resolveTheme(window.location.pathname || "index.html");
    var nextTheme = resolveTheme(href);
    var overlay = document.createElement("div");
    overlay.className = "page-transition";
    overlay.style.setProperty("--page-transition-from", currentTheme.bg);
    overlay.style.setProperty("--page-transition-to", nextTheme.bg);
    overlay.style.setProperty("--page-transition-accent", nextTheme.accent);
    overlay.innerHTML = '<div class="page-transition__spinner"></div>';
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add("page-transition--visible");
    });

    setTimeout(function () {
      window.location.href = href;
    }, 220);
  });

});