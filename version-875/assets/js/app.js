(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');

  if (header && toggle) {
    toggle.addEventListener('click', function () {
      header.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    var scopeId = panel.getAttribute('data-filter-panel');
    var scope = document.querySelector('[data-filter-scope="' + scopeId + '"]');
    var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll('.movie-card')) : [];
    var empty = document.querySelector('[data-empty-for="' + scopeId + '"]');
    var queryInput = panel.querySelector('[data-filter-query]');
    var regionSelect = panel.querySelector('[data-filter-region]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var genreSelect = panel.querySelector('[data-filter-genre]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (initialQuery && queryInput) {
      queryInput.value = initialQuery;
    }

    function getValue(element) {
      return element ? element.value.trim().toLowerCase() : '';
    }

    function applyFilters() {
      var query = getValue(queryInput);
      var region = getValue(regionSelect);
      var year = getValue(yearSelect);
      var genre = getValue(genreSelect);
      var visible = 0;

      cards.forEach(function (card) {
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
        var cardYear = (card.getAttribute('data-year') || '').toLowerCase();
        var cardGenre = (card.getAttribute('data-genre') || '').toLowerCase();
        var matched = true;

        if (query && title.indexOf(query) === -1 && text.indexOf(query) === -1) {
          matched = false;
        }

        if (region && cardRegion !== region) {
          matched = false;
        }

        if (year && cardYear !== year) {
          matched = false;
        }

        if (genre && cardGenre.indexOf(genre) === -1) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [queryInput, regionSelect, yearSelect, genreSelect].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilters);
        element.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  });
})();
