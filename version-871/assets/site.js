(function () {
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var currentSlide = 0;
  var heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  function startHeroTimer() {
    if (heroTimer) {
      window.clearInterval(heroTimer);
    }

    if (slides.length > 1) {
      heroTimer = window.setInterval(function () {
        showSlide(currentSlide + 1);
      }, 5200);
    }
  }

  if (slides.length) {
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startHeroTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(currentSlide - 1);
        startHeroTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(currentSlide + 1);
        startHeroTimer();
      });
    }

    startHeroTimer();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var regionFilter = document.querySelector('[data-region-filter]');
  var cardGrid = document.querySelector('[data-card-grid]');
  var resultCounter = document.querySelector('[data-result-counter]');

  function filterCards() {
    if (!cardGrid) {
      return;
    }

    var keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
    var region = regionFilter ? regionFilter.value : '';
    var cards = Array.prototype.slice.call(cardGrid.querySelectorAll('.searchable-card'));
    var visibleCount = 0;

    cards.forEach(function (card) {
      var text = (card.getAttribute('data-card-text') || '').toLowerCase();
      var cardRegion = card.getAttribute('data-region') || '';
      var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchedRegion = !region || cardRegion === region;
      var visible = matchedKeyword && matchedRegion;

      card.style.display = visible ? '' : 'none';
      if (visible) {
        visibleCount += 1;
      }
    });

    if (resultCounter) {
      resultCounter.textContent = visibleCount + ' 部影片';
    }
  }

  if (filterInput) {
    filterInput.addEventListener('input', filterCards);
  }

  if (regionFilter) {
    regionFilter.addEventListener('change', filterCards);
  }

  function getQuery(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function movieCardTemplate(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="movie-card searchable-card" data-card-text="' + escapeHtml(movie.searchText) + '">' +
      '  <a class="card-cover" href="./' + escapeHtml(movie.file) + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + ' 高清封面" loading="lazy">' +
      '    <span class="quality-badge">HD</span>' +
      '    <span class="play-float" aria-hidden="true">▶</span>' +
      '  </a>' +
      '  <div class="card-body">' +
      '    <div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span></div>' +
      '    <h3><a href="./' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '    <p>' + escapeHtml(movie.oneLine) + '</p>' +
      '    <div class="tag-row">' + tags + '</div>' +
      '  </div>' +
      '</article>';
  }

  function renderSearchPage() {
    var results = document.getElementById('search-results');
    var input = document.querySelector('[data-search-page-input]');
    var title = document.querySelector('[data-search-title]');
    var summary = document.querySelector('[data-search-summary]');

    if (!results || !window.MOVIES_INDEX) {
      return;
    }

    var query = getQuery('q').trim();
    if (input) {
      input.value = query;
    }

    var normalized = query.toLowerCase();
    var matched = window.MOVIES_INDEX.filter(function (movie) {
      return !normalized || movie.searchText.toLowerCase().indexOf(normalized) !== -1;
    });

    if (!query) {
      matched = window.MOVIES_INDEX.slice(0, 30);
    }

    results.innerHTML = matched.slice(0, 240).map(movieCardTemplate).join('');

    if (title) {
      title.textContent = query ? '“' + query + '” 的搜索结果' : '推荐影片';
    }

    if (summary) {
      var suffix = matched.length > 240 ? '，当前显示前 240 部' : '';
      summary.textContent = (query ? '共匹配 ' + matched.length + ' 部影片' : '默认展示片库前 30 部内容') + suffix + '。';
    }
  }

  var searchForm = document.querySelector('[data-search-page-form]');
  if (searchForm) {
    searchForm.addEventListener('submit', function (event) {
      var input = searchForm.querySelector('input[name="q"]');
      if (input && !input.value.trim()) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  }

  renderSearchPage();

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
