(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");

    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var timer;

      function showSlide(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
      }

      function startTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          showSlide(index + 1);
        }, 5200);
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          showSlide(dotIndex);
          startTimer();
        });
      });

      if (slides.length > 1) {
        startTimer();
      }
    }

    var inputs = Array.prototype.slice.call(document.querySelectorAll(".movie-search"));

    inputs.forEach(function (input) {
      var scope = input.closest(".search-scope") || document;
      var items = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-row"));

      input.addEventListener("input", function () {
        var query = input.value.trim().toLowerCase();

        items.forEach(function (item) {
          var text = (item.getAttribute("data-search") || item.textContent || "").toLowerCase();
          item.classList.toggle("is-hidden-by-search", query && text.indexOf(query) === -1);
        });
      });
    });
  });
})();
