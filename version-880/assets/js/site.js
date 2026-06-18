(function () {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function one(selector, root) {
        return (root || document).querySelector(selector);
    }

    function norm(value) {
        return String(value || '').toLowerCase().trim();
    }

    function initMenu() {
        var toggle = one('[data-mobile-toggle]');
        var panel = one('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
            document.body.classList.toggle('menu-open', panel.classList.contains('is-open'));
        });
    }

    function initSearchForms() {
        all('[data-search-form]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = one('input[name="q"]', form);
                var target = form.getAttribute('data-target') || 'movies.html';
                var keyword = input ? input.value.trim() : '';
                window.location.href = keyword ? target + '?q=' + encodeURIComponent(keyword) : target;
            });
        });
    }

    function initHero() {
        var hero = one('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = all('[data-hero-slide]', hero);
        var dots = all('[data-hero-dot]', hero);
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle('is-active', position === index);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle('is-active', position === index);
            });
        }

        dots.forEach(function (dot, position) {
            dot.addEventListener('click', function () {
                show(position);
                start();
            });
        });

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        show(0);
        start();
    }

    function initFilters() {
        var panels = all('[data-filter-panel]');
        if (!panels.length) {
            return;
        }
        panels.forEach(function (panel) {
            var scope = panel.getAttribute('data-filter-scope') || 'body';
            var root = one(scope) || document;
            var keywordInput = one('[data-filter-keyword]', panel);
            var yearSelect = one('[data-filter-year]', panel);
            var typeSelect = one('[data-filter-type]', panel);
            var cards = all('[data-search-card]', root);
            var empty = one('[data-no-results]', root) || one('[data-no-results]');
            var params = new URLSearchParams(window.location.search);
            var q = params.get('q');
            if (q && keywordInput) {
                keywordInput.value = q;
            }

            function apply() {
                var keyword = norm(keywordInput && keywordInput.value);
                var year = norm(yearSelect && yearSelect.value);
                var type = norm(typeSelect && typeSelect.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var text = norm(card.getAttribute('data-search'));
                    var cardYear = norm(card.getAttribute('data-year'));
                    var cardType = norm(card.getAttribute('data-type'));
                    var ok = true;
                    if (keyword && text.indexOf(keyword) === -1) {
                        ok = false;
                    }
                    if (year && cardYear !== year) {
                        ok = false;
                    }
                    if (type && cardType !== type) {
                        ok = false;
                    }
                    card.classList.toggle('is-filter-hidden', !ok);
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            [keywordInput, yearSelect, typeSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener(control.tagName === 'SELECT' ? 'change' : 'input', apply);
                }
            });
            apply();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initSearchForms();
        initHero();
        initFilters();
    });
}());
