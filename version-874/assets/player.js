(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
            return;
        }
        document.addEventListener("DOMContentLoaded", fn);
    }

    ready(function () {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (box) {
            var video = box.querySelector("video");
            var button = box.querySelector("[data-play]");
            var url = box.getAttribute("data-src");
            var hls = null;
            var prepared = false;

            var prepare = function () {
                if (prepared || !video || !url) {
                    return;
                }
                prepared = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 60
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
            };

            var start = function () {
                prepare();
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {});
                }
            };

            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    start();
                });
            }

            box.addEventListener("click", function (event) {
                if (event.target.closest("button") || event.target.closest("a")) {
                    return;
                }
                start();
            });

            video.addEventListener("play", function () {
                box.classList.add("is-playing");
            });

            video.addEventListener("pause", function () {
                box.classList.remove("is-playing");
            });

            video.addEventListener("ended", function () {
                box.classList.remove("is-playing");
            });

            window.addEventListener("beforeunload", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
            });
        });
    });
})();
