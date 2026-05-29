(function () {
  var popupDelay = 10000;
  var enquiryEmail = "info@nexvora.com";

  var organizationSizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501+ employees"
  ];

  var solutions = [
    "CRM Solutions",
    "ERP Systems",
    "Custom Software Development",
    "Business Automation",
    "Web Applications",
    "Analytics & Dashboards",
    "Smart Retail Solutions"
  ];

  function createOptions(items, placeholder) {
    return ['<option value="">' + placeholder + "</option>"].concat(items.map(function (item) {
      return '<option value="' + item + '">' + item + "</option>";
    })).join("");
  }

  function createPopup() {
    if (document.querySelector("[data-demo-popup]")) {
      return document.querySelector("[data-demo-popup]");
    }

    var overlay = document.createElement("div");
    overlay.className = "demo-popup-overlay";
    overlay.setAttribute("data-demo-popup", "");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "demo-popup-title");
    overlay.innerHTML = [
      '<div class="demo-popup-modal" role="document">',
      '<button class="demo-popup-close" type="button" aria-label="Close demo enquiry form">&times;</button>',
      '<div class="demo-popup-header">',
      '<h2 class="demo-popup-title" id="demo-popup-title">Enquiry for Free Demo</h2>',
      '<p class="demo-popup-copy">Tell us a little about your business and we will help you choose the right Nexvora solution.</p>',
      "</div>",
      '<form class="demo-popup-form" id="demo-enquiry-form">',
      '<div class="demo-popup-field">',
      '<label class="demo-popup-label" for="demo-first-name">First Name: *</label>',
      '<input class="demo-popup-input w-input" id="demo-first-name" name="First Name" data-name="First Name" maxlength="256" placeholder="Enter your first name" type="text" required>',
      "</div>",
      '<div class="demo-popup-field">',
      '<label class="demo-popup-label" for="demo-last-name">Last Name: *</label>',
      '<input class="demo-popup-input w-input" id="demo-last-name" name="Last Name" data-name="Last Name" maxlength="256" placeholder="Enter your last name" type="text" required>',
      "</div>",
      '<div class="demo-popup-field full-width">',
      '<label class="demo-popup-label" for="demo-business-email">Business Email *</label>',
      '<input class="demo-popup-input w-input" id="demo-business-email" name="Business Email" data-name="Business Email" maxlength="256" placeholder="Enter your work email" type="email" required>',
      "</div>",
      '<div class="demo-popup-field full-width">',
      '<label class="demo-popup-label" for="demo-company-name">Company Name: *</label>',
      '<input class="demo-popup-input w-input" id="demo-company-name" name="Company Name" data-name="Company Name" maxlength="256" placeholder="Enter your company" type="text" required>',
      "</div>",
      '<div class="demo-popup-field full-width">',
      '<label class="demo-popup-label" for="demo-organization-size">Organization Size *</label>',
      '<select class="demo-popup-select w-select" id="demo-organization-size" name="Organization Size" data-name="Organization Size" required>',
      createOptions(organizationSizes, "Select..."),
      "</select>",
      "</div>",
      '<div class="demo-popup-field full-width">',
      '<label class="demo-popup-label" for="demo-solution-interest">Solution of Interest *</label>',
      '<select class="demo-popup-select w-select" id="demo-solution-interest" name="Solution of Interest" data-name="Solution of Interest" required>',
      createOptions(solutions, "Please Select"),
      "</select>",
      "</div>",
      '<div class="demo-popup-field full-width phone-full-width">',
      '<label class="demo-popup-label" for="demo-phone">Phone</label>',
      '<input class="demo-popup-input w-input" id="demo-phone" name="Phone" data-name="Phone" maxlength="256" placeholder="Enter your phone number" type="tel">',
      "</div>",
      '<div class="demo-popup-success">Thank you. Your email app is opening with the enquiry details.</div>',
      '<button class="demo-popup-submit w-button" type="submit">Request Free Demo</button>',
      "</form>",
      "</div>"
    ].join("");

    document.body.appendChild(overlay);
    return overlay;
  }

  function openPopup(overlay) {
    overlay.classList.add("is-visible");
    document.body.classList.add("demo-popup-lock");

    window.setTimeout(function () {
      overlay.classList.add("is-open");
      var firstInput = overlay.querySelector("input, select, button");
      if (firstInput) {
        firstInput.focus();
      }
    }, 20);
  }

  function closePopup(overlay) {
    overlay.classList.remove("is-open");
    document.body.classList.remove("demo-popup-lock");

    window.setTimeout(function () {
      overlay.classList.remove("is-visible");
    }, 200);
  }

  function getFormValue(form, name) {
    var field = form.elements[name];
    return field ? field.value.trim() : "";
  }

  function bindPopup(overlay) {
    var closeButton = overlay.querySelector(".demo-popup-close");
    var form = overlay.querySelector("#demo-enquiry-form");

    closeButton.addEventListener("click", function () {
      closePopup(overlay);
    });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closePopup(overlay);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-visible")) {
        closePopup(overlay);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var subject = "Free Demo Enquiry - " + getFormValue(form, "Company Name");
      var body = [
        "First Name: " + getFormValue(form, "First Name"),
        "Last Name: " + getFormValue(form, "Last Name"),
        "Business Email: " + getFormValue(form, "Business Email"),
        "Company Name: " + getFormValue(form, "Company Name"),
        "Organization Size: " + getFormValue(form, "Organization Size"),
        "Solution of Interest: " + getFormValue(form, "Solution of Interest"),
        "Phone: " + (getFormValue(form, "Phone") || "Not provided")
      ].join("\n");

      form.classList.add("is-submitted");
      window.location.href = "mailto:" + enquiryEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  function init() {
    var overlay = createPopup();
    bindPopup(overlay);
    window.setTimeout(function () {
      openPopup(overlay);
    }, popupDelay);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
