(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll(".movie-player"));

    players.forEach(function (player) {
      var video = player.querySelector("video");
      var overlay = player.querySelector(".player-overlay");
      var playButton = player.querySelector(".play-toggle");
      var muteButton = player.querySelector(".mute-toggle");
      var fullscreenButton = player.querySelector(".fullscreen-toggle");
      var loading = player.querySelector(".player-loading");
      var source = player.getAttribute("data-video-url");
      var hls = null;
      var loaded = false;

      function setLoading(text) {
        if (loading) {
          loading.textContent = text || "";
        }
      }

      function attachSource() {
        if (loaded || !source || !video) {
          return;
        }

        loaded = true;
        setLoading("正在加载");

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false,
            maxBufferLength: 30,
            maxMaxBufferLength: 60
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setLoading("");
          });
          hls.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              setLoading("播放加载中");
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.addEventListener("loadedmetadata", function () {
            setLoading("");
          }, { once: true });
        } else {
          video.src = source;
          video.addEventListener("loadedmetadata", function () {
            setLoading("");
          }, { once: true });
        }
      }

      function updateState() {
        if (!playButton || !muteButton) {
          return;
        }

        playButton.textContent = video.paused ? "▶" : "❚❚";
        playButton.setAttribute("aria-label", video.paused ? "播放" : "暂停");
        muteButton.textContent = video.muted ? "静音" : "音量";
        muteButton.setAttribute("aria-label", video.muted ? "取消静音" : "静音");
      }

      function playVideo() {
        attachSource();
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.then === "function") {
          promise.then(function () {
            setLoading("");
          }).catch(function () {
            setLoading("");
          });
        }
      }

      function togglePlay() {
        if (video.paused) {
          playVideo();
        } else {
          video.pause();
        }
      }

      if (overlay) {
        overlay.addEventListener("click", playVideo);
      }

      if (playButton) {
        playButton.addEventListener("click", togglePlay);
      }

      if (muteButton) {
        muteButton.addEventListener("click", function () {
          video.muted = !video.muted;
          updateState();
        });
      }

      if (fullscreenButton) {
        fullscreenButton.addEventListener("click", function () {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (player.requestFullscreen) {
            player.requestFullscreen();
          }
        });
      }

      video.addEventListener("click", togglePlay);
      video.addEventListener("play", updateState);
      video.addEventListener("pause", updateState);
      video.addEventListener("ended", updateState);

      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });

      updateState();
    });
  });
})();
