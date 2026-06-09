(function () {
  function initHomeFaqAccordion() {
    var accordion = document.querySelector(".home-faq-accordion");
    if (!accordion) return;

    var items = Array.prototype.slice.call(accordion.querySelectorAll(".home-faq-item"));
    if (!items.length) return;

    function setPanelHeight(item, height) {
      var panel = item.querySelector(".home-faq-answer-wrap");
      if (panel) {
        panel.style.height = height;
      }
    }

    function openItem(item) {
      var panel = item.querySelector(".home-faq-answer-wrap");
      if (!panel || item.open) return;

      item.open = true;
      setPanelHeight(item, "0px");
      window.requestAnimationFrame(function () {
        setPanelHeight(item, panel.scrollHeight + "px");
      });
    }

    function closeItem(item) {
      var panel = item.querySelector(".home-faq-answer-wrap");
      if (!panel || !item.open) return;

      setPanelHeight(item, panel.scrollHeight + "px");
      window.requestAnimationFrame(function () {
        setPanelHeight(item, "0px");
      });

      window.setTimeout(function () {
        if (panel.style.height === "0px") {
          item.open = false;
        }
      }, 260);
    }

    items.forEach(function (item) {
      var panel = item.querySelector(".home-faq-answer-wrap");
      var summary = item.querySelector(".home-faq-question");
      if (!panel || !summary) return;

      panel.style.height = item.open ? panel.scrollHeight + "px" : "0px";

      summary.addEventListener("click", function (event) {
        event.preventDefault();

        if (item.open) {
          closeItem(item);
          return;
        }

        items.forEach(function (otherItem) {
          if (otherItem !== item) {
            closeItem(otherItem);
          }
        });

        openItem(item);
      });

      panel.addEventListener("transitionend", function () {
        if (item.open && panel.style.height !== "0px") {
          panel.style.height = "auto";
        }
      });
    });
  }

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
      '<h2 class="demo-popup-title" id="demo-popup-title">Lets Get <span class="gradient-heading-text">Started</span> </h2>',
      '<p class="demo-popup-copy">Tell us a little about your business and we will help you choose the right Nexvora solution.</p>',
      "</div>",
      '<form class="demo-popup-form" id="demo-enquiry-form">',
      // '<div class="demo-popup-field">',
      // '<label class="demo-popup-label" for="demo-first-name">First Name: *</label>',
      // '<input class="demo-popup-input w-input" id="demo-first-name" name="First Name" data-name="First Name" maxlength="256" placeholder="Enter your first name" type="text" required>',
      // "</div>",
      // '<div class="demo-popup-field">',
      // '<label class="demo-popup-label" for="demo-last-name">Last Name: *</label>',
      // '<input class="demo-popup-input w-input" id="demo-last-name" name="Last Name" data-name="Last Name" maxlength="256" placeholder="Enter your last name" type="text" required>',
      // "</div>",
      '<div class="demo-popup-field">',
'<label class="demo-popup-label" for="demo-name">Name *</label>',
'<input class="demo-popup-input w-input" id="demo-name" name="Name" maxlength="100" placeholder="Enter your name" type="text" pattern="[A-Za-z ]{3,100}" title="Only letters allowed" required>',      "</div>",
     '<div class="demo-popup-field">',
'<label class="demo-popup-label" for="demo-phone">Contact Number *</label>',
'<input class="demo-popup-input w-input" id="demo-phone" name="Phone" maxlength="10" minlength="10" placeholder="Contact Number" type="tel" inputmode="numeric" pattern="[0-9]{10}" oninput="this.value=this.value.replace(/[^0-9]/g,\'\')" required>',
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
'<label class="demo-popup-label" id="demo-solution-label">Solution of Interest *</label>',
'<div class="demo-multiselect" data-demo-multiselect>',
'<button class="demo-multiselect-toggle" type="button" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="demo-solution-label demo-solution-selected">',
'<span id="demo-solution-selected" data-demo-multiselect-text>Select solutions...</span>',
'<span class="demo-multiselect-arrow" aria-hidden="true"></span>',
'</button>',
'<div class="demo-multiselect-menu" role="listbox" aria-multiselectable="true">',
solutions.map(function (solution) {
  return '<label class="demo-multiselect-option"><input type="checkbox" name="solution" value="' + solution + '"> <span>' + solution + '</span></label>';
}).join(""),
'</div>',
'<div class="demo-multiselect-selected-list" data-demo-multiselect-selected aria-live="polite"></div>',
'</div>',
'</div>',
      '<div class="demo-popup-field full-width">',
      '<label class="demo-popup-label" for="demo-organization-size">Organization Size *</label>',
      '<select class="demo-popup-select w-select" id="demo-organization-size" name="Organization Size" data-name="Organization Size" required>',
      createOptions(organizationSizes, "Select..."),
      "</select>",
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
        //firstInput.focus();
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

  function hasFormInput(form) {
    return Array.prototype.some.call(form.elements, function (field) {
      if (!field.name || field.type === "submit" || field.type === "button") {
        return false;
      }

      if (field.type === "checkbox" || field.type === "radio") {
        return field.checked;
      }

      return field.value && field.value.trim() !== "";
    });
  }

  function initMultiSelect(overlay) {
    var multiSelect = overlay.querySelector("[data-demo-multiselect]");
    if (!multiSelect) return;

    var toggle = multiSelect.querySelector(".demo-multiselect-toggle");
    var text = multiSelect.querySelector("[data-demo-multiselect-text]");
    var selectedList = multiSelect.querySelector("[data-demo-multiselect-selected]");
    var checkboxes = Array.prototype.slice.call(multiSelect.querySelectorAll('input[type="checkbox"]'));

    function getSelectedValues() {
      return checkboxes.filter(function (checkbox) {
        return checkbox.checked;
      }).map(function (checkbox) {
        return checkbox.value;
      });
    }

    function updateText() {
      var selectedValues = getSelectedValues();
      text.textContent = selectedValues.length ? selectedValues.length + " selected" : "Select solutions...";
      selectedList.innerHTML = selectedValues.map(function (value) {
        return '<span class="demo-multiselect-chip">' + value + "</span>";
      }).join("");
      multiSelect.classList.toggle("has-selection", selectedValues.length > 0);
      if (selectedValues.length) {
        multiSelect.classList.remove("has-error");
      }
    }

    function closeMenu() {
      multiSelect.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var isOpen = multiSelect.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    checkboxes.forEach(function (checkbox) {
      checkbox.addEventListener("change", updateText);
    });

    document.addEventListener("click", function (event) {
      if (!multiSelect.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    updateText();
  }

  function bindPopup(overlay) {
    var closeButton = overlay.querySelector(".demo-popup-close");
    var form = overlay.querySelector("#demo-enquiry-form");
    var multiSelect = overlay.querySelector("[data-demo-multiselect]");
    initMultiSelect(overlay);

    closeButton.addEventListener("click", function () {
      closePopup(overlay);
    });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay && !hasFormInput(form)) {
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
      var selectedSolutions = Array.from(form.querySelectorAll('input[name="solution"]:checked'))
        .map(function (el) { return el.value; });

      if (!selectedSolutions.length) {
        if (multiSelect) {
          multiSelect.classList.add("has-error");
          multiSelect.querySelector(".demo-multiselect-toggle").focus();
        }
        return;
      }

      if (multiSelect) {
        multiSelect.classList.remove("has-error");
      }

      var subject = "Free Demo Enquiry - " + getFormValue(form, "Company Name");
      var body = [
        "Name: " + getFormValue(form, "Name"),
        "Business Email: " + getFormValue(form, "Business Email"),
        "Company Name: " + getFormValue(form, "Company Name"),
        "Organization Size: " + getFormValue(form, "Organization Size"),
        "Solution of Interest: " + selectedSolutions.join(", "),
        "Phone: " + (getFormValue(form, "Phone") || "Not provided")
      ].join("\n");

      form.classList.add("is-submitted");
      window.location.href = "mailto:" + enquiryEmail + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  function init() {
    initHomeFaqAccordion();

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
