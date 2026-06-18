(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    var input = root.querySelector('[data-search-input]');
    var genreFilter = root.querySelector('[data-genre-filter]');
    var regionFilter = root.querySelector('[data-region-filter]');
    var noResult = root.querySelector('[data-no-result]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var query = normalize(input && input.value);
      var genre = normalize(genreFilter && genreFilter.value);
      var region = normalize(regionFilter && regionFilter.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year')
        ].join(' '));
        var cardGenre = normalize(card.getAttribute('data-genre'));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var matched = true;

        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }

        if (genre && cardGenre.indexOf(genre) === -1) {
          matched = false;
        }

        if (region && cardRegion.indexOf(region) === -1) {
          matched = false;
        }

        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (noResult) {
        noResult.hidden = visible !== 0;
      }
    }

    [input, genreFilter, regionFilter].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });

  var hlsMap = new WeakMap();

  function prepareVideo(video) {
    var url = video.getAttribute('data-stream');

    if (!url) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = url;
      }
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!hlsMap.has(video)) {
        var hls = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hlsMap.set(video, hls);
      }
      return;
    }

    if (!video.src) {
      video.src = url;
    }
  }

  document.querySelectorAll('.player-shell').forEach(function (shell) {
    var video = shell.querySelector('.movie-player');
    var overlay = shell.querySelector('.player-overlay');

    if (!video) {
      return;
    }

    function playVideo() {
      prepareVideo(video);

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      var started = video.play();

      if (started && typeof started.catch === 'function') {
        started.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
  });
})();
