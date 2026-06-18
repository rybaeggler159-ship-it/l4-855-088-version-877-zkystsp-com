(function () {
  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupFilters() {
    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var search = scope.querySelector('.movie-search');
      var controls = Array.prototype.slice.call(scope.querySelectorAll('.filter-control'));
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .rank-item'));
      var empty = scope.querySelector('[data-empty-state]');
      function apply() {
        var term = normalize(search ? search.value : '');
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-year'),
            card.getAttribute('data-category'),
            card.getAttribute('data-tags')
          ].join(' '));
          var ok = !term || haystack.indexOf(term) !== -1;
          controls.forEach(function (control) {
            var field = control.getAttribute('data-filter-field');
            var selected = normalize(control.value);
            if (selected && normalize(card.getAttribute('data-' + field)) !== selected) {
              ok = false;
            }
          });
          card.style.display = ok ? '' : 'none';
          if (ok) visible += 1;
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }
      if (search) search.addEventListener('input', apply);
      controls.forEach(function (control) {
        control.addEventListener('change', apply);
      });
      apply();
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    if (prev) prev.addEventListener('click', function () { show(index - 1); start(); });
    if (next) next.addEventListener('click', function () { show(index + 1); start(); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupFilters();
    setupHero();
  });
})();
