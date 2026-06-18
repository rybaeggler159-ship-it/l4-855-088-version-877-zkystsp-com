(function () {
  function initMoviePlayer(source) {
    var panel = document.querySelector('[data-player]');

    if (!panel) {
      return;
    }

    var video = panel.querySelector('video');
    var button = panel.querySelector('[data-player-button]');
    var hls = null;
    var ready = false;

    function prepare() {
      if (ready || !video || !source) {
        return;
      }

      ready = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      if (!video) {
        return;
      }

      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    function start() {
      prepare();
      playVideo();
    }

    if (button) {
      button.addEventListener('click', function () {
        button.classList.add('is-hidden');
        start();
      });
    }

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
