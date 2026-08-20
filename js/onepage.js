document.addEventListener("DOMContentLoaded", function () {

  /* ---------- Scrollspy: highlight nav link for section in view ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".main-nav a[href^='#']");

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("in-view", link.getAttribute("href") === "#" + id);
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- Login / Sign up modal ---------- */
  var overlay = document.getElementById("auth-overlay");
  var openBtns = document.querySelectorAll("[data-auth-open]");
  var closeBtns = document.querySelectorAll("[data-auth-close]");
  var tabs = document.querySelectorAll(".auth-tab");
  var panels = document.querySelectorAll(".auth-panel");

  function openAuth(which) {
    if (!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    if (which) switchAuthTab(which);
  }
  function closeAuth() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  function switchAuthTab(which) {
    tabs.forEach(function (t) { t.classList.toggle("active", t.dataset.authTab === which); });
    panels.forEach(function (p) { p.classList.toggle("active", p.dataset.authPanel === which); });
  }

  openBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      openAuth(btn.dataset.authOpen === "signup" ? "signup" : "login");
    });
  });
  closeBtns.forEach(function (btn) { btn.addEventListener("click", closeAuth); });
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeAuth();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAuth();
  });
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { switchAuthTab(tab.dataset.authTab); });
  });

  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      closeAuth();
    });
  }
  var signupForm = document.getElementById("signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      closeAuth();
    });
  }

  /* ---------- Password show/hide toggles ---------- */
  document.querySelectorAll("[data-eye-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.dataset.eyeToggle);
      if (!input) return;
      var showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
      btn.classList.toggle("is-visible", !showing);
    });
  });

  /* ---------- Footer newsletter ---------- */
  var newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("newsletter-msg");
      if (msg) {
        msg.textContent = "Thanks for subscribing! Check your inbox to confirm.";
        msg.classList.add("show");
      }
      newsletterForm.reset();
    });
  }
});
