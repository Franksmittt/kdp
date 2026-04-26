(function () {
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  var grid = document.getElementById("projects-grid");
  if (grid) {
    var filters = document.querySelectorAll(".filter");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filter");
        filters.forEach(function (b) {
          b.classList.toggle("active", b === btn);
        });
        grid.querySelectorAll(".project-card").forEach(function (card) {
          var c = card.getAttribute("data-cat");
          var show = cat === "all" || c === cat;
          card.classList.toggle("hidden", !show);
        });
      });
    });
  }
})();
