(function() {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var nextButton = hero.querySelector('[data-hero-next]');
        var prevButton = hero.querySelector('[data-hero-prev]');
        var index = 0;

        function showSlide(nextIndex) {
            slides[index].classList.remove('is-active');
            index = (nextIndex + slides.length) % slides.length;
            slides[index].classList.add('is-active');
        }

        if (slides.length > 1) {
            if (nextButton) {
                nextButton.addEventListener('click', function() {
                    showSlide(index + 1);
                });
            }

            if (prevButton) {
                prevButton.addEventListener('click', function() {
                    showSlide(index - 1);
                });
            }

            window.setInterval(function() {
                showSlide(index + 1);
            }, 5200);
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-search-area]')).forEach(function(area) {
        var input = area.querySelector('[data-search-input]');
        var cards = Array.prototype.slice.call(area.querySelectorAll('[data-search-card]'));
        var chips = Array.prototype.slice.call(area.querySelectorAll('[data-filter-value]'));
        var activeFilter = 'all';

        function normalize(value) {
            return String(value || '').toLowerCase().replace(/\s+/g, '');
        }

        function applyFilter() {
            var query = normalize(input ? input.value : '');
            cards.forEach(function(card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-tags')
                ].join(' '));
                var filterText = normalize(card.getAttribute('data-tags') || '');
                var matchesQuery = !query || haystack.indexOf(query) !== -1;
                var matchesFilter = activeFilter === 'all' || filterText.indexOf(normalize(activeFilter)) !== -1;
                card.classList.toggle('is-hidden-card', !(matchesQuery && matchesFilter));
            });
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        chips.forEach(function(chip) {
            chip.addEventListener('click', function() {
                chips.forEach(function(item) {
                    item.classList.remove('is-active');
                });
                chip.classList.add('is-active');
                activeFilter = chip.getAttribute('data-filter-value') || 'all';
                applyFilter();
            });
        });
    });

    var backTop = document.querySelector('[data-back-top]');
    if (backTop) {
        window.addEventListener('scroll', function() {
            backTop.classList.toggle('is-visible', window.scrollY > 420);
        });
        backTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
})();
