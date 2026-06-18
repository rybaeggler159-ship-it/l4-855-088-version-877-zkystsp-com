import { H as Hls } from './hls-vendor.js';

function initializePlayer(playerRoot) {
  var video = playerRoot.querySelector('video[data-hls-src]');
  var bigPlay = playerRoot.querySelector('[data-big-play]');
  var toggleButton = playerRoot.querySelector('[data-player-toggle]');
  var muteButton = playerRoot.querySelector('[data-player-mute]');
  var fullscreenButton = playerRoot.querySelector('[data-player-fullscreen]');

  if (!video) {
    return;
  }

  var source = video.getAttribute('data-hls-src');
  var hlsInstance = null;

  if (source) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 60
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);

      if (Hls.Events && Hls.Events.ERROR) {
        hlsInstance.on(Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (Hls.ErrorTypes && data.type === Hls.ErrorTypes.MEDIA_ERROR && hlsInstance.recoverMediaError) {
            hlsInstance.recoverMediaError();
          } else if (hlsInstance.startLoad) {
            hlsInstance.startLoad();
          }
        });
      }
    } else {
      video.src = source;
    }
  }

  function playOrPause() {
    if (video.paused) {
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    } else {
      video.pause();
    }
  }

  if (bigPlay) {
    bigPlay.addEventListener('click', playOrPause);
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', playOrPause);
  }

  if (muteButton) {
    muteButton.addEventListener('click', function () {
      video.muted = !video.muted;
      muteButton.textContent = video.muted ? '取消静音' : '静音';
    });
  }

  if (fullscreenButton) {
    fullscreenButton.addEventListener('click', function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (playerRoot.requestFullscreen) {
        playerRoot.requestFullscreen();
      }
    });
  }

  video.addEventListener('play', function () {
    if (bigPlay) {
      bigPlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (bigPlay) {
      bigPlay.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance && hlsInstance.destroy) {
      hlsInstance.destroy();
    }
  });
}

Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initializePlayer);
