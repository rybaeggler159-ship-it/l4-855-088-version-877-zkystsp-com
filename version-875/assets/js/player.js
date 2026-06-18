(function () {
  function initPlayer(root) {
    var video = root.querySelector('video');
    var button = root.querySelector('[data-player-play]');
    var status = root.querySelector('[data-player-status]');
    var url = video ? video.getAttribute('data-video-url') : '';
    var hls = null;
    var attached = false;

    if (!video || !url) {
      return;
    }

    function setStatus(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function attachSource() {
      if (attached) {
        return;
      }

      attached = true;
      setStatus('正在载入');

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('可以播放');
        });

        hls.on(window.Hls.Events.ERROR, function () {
          setStatus('重新点击播放');
        });
      } else {
        video.src = url;
        setStatus('可以播放');
      }
    }

    function requestPlay() {
      attachSource();

      var result = video.play();

      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          setStatus('点击后开始播放');
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        requestPlay();
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        requestPlay();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      root.classList.add('is-playing');
      setStatus('正在播放');
    });

    video.addEventListener('pause', function () {
      root.classList.remove('is-playing');
      setStatus('已暂停');
    });

    video.addEventListener('loadedmetadata', function () {
      setStatus('可以播放');
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-video-player]')).forEach(initPlayer);
})();
