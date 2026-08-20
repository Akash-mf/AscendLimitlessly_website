/* ==========================================================================
   EmailJS configuration
   --------------------------------------------------------------------------
   1. Create a free account at https://www.emailjs.com
   2. Add an Email Service (Gmail) and copy its Service ID
   3. Create the "Contact Us" lead template, then link an Auto-Reply
      template to it from the template's "Auto-Reply" tab in the EmailJS
      dashboard — EmailJS will then send both emails automatically from
      a single request below.
   4. Copy your Public Key from Account > General
   5. Paste your Public Key, Service ID, and Lead Template ID below
   ========================================================================== */
var EMAILJS_PUBLIC_KEY = "GU5Xcrd0a_LfAQTJK";
var EMAILJS_SERVICE_ID = "service_cqihmsp";
var EMAILJS_TEMPLATE_LEAD = "template_nocrtrd"; // notifies akashlenin51@gmail.com; auto-reply is linked in the EmailJS dashboard

// Google Sheets lead log — every submission also gets appended as a row here
// as a backup/simple CRM, independent of email delivery.
var GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbymrMEYhUoeku4G-0RbG_Q0goO-3IZt2Kst_94jwsJ7CYnYuBRaYXA0LIHCphRs0cZLJQ/exec";

if (typeof emailjs !== "undefined" && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

document.addEventListener("DOMContentLoaded", function () {
  // Mobile nav toggle
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
      });
    });
  }

  // Portfolio filter tabs (client-side, no server needed)
  var filterTabs = document.querySelectorAll(".filter-tabs a");
  var projectGrid = document.getElementById("project-grid");
  if (filterTabs.length && projectGrid) {
    var cards = projectGrid.querySelectorAll(".project-card");
    filterTabs.forEach(function (tab) {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        filterTabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");
        var filter = tab.getAttribute("data-filter");
        cards.forEach(function (card) {
          var category = card.querySelector(".project-card-overlay span");
          var cardCategory = category ? category.textContent.trim() : "";
          card.style.display = (filter === "all" || cardCategory === filter) ? "" : "none";
        });
      });
    });
  }

  // Contact form: sends a lead notification email to Ascend Limitlessly.
  // The auto-reply to the client is sent automatically by EmailJS because
  // the auto-reply template is linked to this template's "Auto-Reply" tab
  // in the EmailJS dashboard — no separate call needed here. No backend
  // server required; see the EmailJS config block at the top of this file.
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var contactMsgBox = document.getElementById("form-message");
    var contactSubmitBtn = document.getElementById("contact-submit-btn");
    var contactBtnLabel = contactSubmitBtn ? contactSubmitBtn.querySelector(".btn-label") : null;

    function showContactMessage(text, isError) {
      if (!contactMsgBox) return;
      contactMsgBox.textContent = text;
      contactMsgBox.classList.toggle("alert-success", !isError);
      contactMsgBox.classList.toggle("alert-error", isError);
      contactMsgBox.style.display = "block";
    }

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (typeof emailjs === "undefined" || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
        showContactMessage("Email service isn't configured yet. Please add your EmailJS keys in js/main.js.", true);
        return;
      }

      var formData = new FormData(contactForm);
      var selectedService = contactForm.querySelector('input[name="service"]:checked');

      var templateParams = {
        name: formData.get("name") || "",
        email: formData.get("email") || "",
        whatsapp: formData.get("whatsapp") || "Not provided",
        service: selectedService ? selectedService.value : "Not specified",
        details: formData.get("details") || ""
      };

      if (contactSubmitBtn) contactSubmitBtn.disabled = true;
      if (contactBtnLabel) contactBtnLabel.textContent = "Sending...";

      // Log this lead to Google Sheets in the background. This is a
      // fire-and-forget backup log — mode:'no-cors' means we can't read
      // the response, so any failure here is silent and never blocks or
      // delays the email flow below.
      if (GOOGLE_SHEETS_WEBHOOK_URL && GOOGLE_SHEETS_WEBHOOK_URL.indexOf("YOUR_") === -1) {
        fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(templateParams)
        }).catch(function (err) {
          console.error("Google Sheets log error:", err);
        });
      }

      // EmailJS sends the lead notification to Ascend Limitlessly AND the
      // linked auto-reply to the client's {{email}} from this one call.
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_LEAD, templateParams)
        .then(function () {
          showContactMessage("Thanks for reaching out! We've sent a confirmation to your email and will get back to you within 24 hours.", false);
          contactForm.reset();
        })
        .catch(function (err) {
          console.error("EmailJS error:", err);
          showContactMessage("Something went wrong sending your message. Please try again or email us directly at akashlenin51@gmail.com.", true);
        })
        .finally(function () {
          if (contactSubmitBtn) contactSubmitBtn.disabled = false;
          if (contactBtnLabel) contactBtnLabel.textContent = "Send Message";
        });
    });
  }

  // Auto-dismiss alerts
  document.querySelectorAll(".alert").forEach(function (alert) {
    if (alert.id === "form-message") return; // keep the contact success message visible
    setTimeout(function () {
      alert.style.transition = "opacity .4s ease";
      alert.style.opacity = "0";
      setTimeout(function () { alert.remove(); }, 400);
    }, 5000);
  });
});
