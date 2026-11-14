(function () {
  'use strict';

  function updateMuteButton(btn) {
    if (!btn || !window.GameAudio) return;
    const isMuted = window.GameAudio.isMuted();
    btn.textContent = isMuted ? '🔇 Bật tiếng' : '🔊 Tắt tiếng';
    btn.setAttribute('aria-pressed', isMuted ? 'true' : 'false');
    btn.setAttribute('aria-label', isMuted ? 'Bật tiếng game' : 'Tắt tiếng game');
  }

  function initMuteButton() {
    const btn = document.getElementById('btnMute');
    if (!btn) return;
    updateMuteButton(btn);
    btn.onclick = function () {
      if (window.GameAudio && typeof window.GameAudio.toggleMute === 'function') {
        window.GameAudio.toggleMute();
      }
    };
    window.addEventListener('hoa-dien-mute-change', function () {
      updateMuteButton(btn);
    });
  }

  function updateFullscreenButton(btn) {
    if (!btn) return;
    const isFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
    btn.textContent = isFs ? '🗗 Thu nhỏ' : '⛶ Toàn màn hình';
    btn.setAttribute('aria-pressed', isFs ? 'true' : 'false');
    btn.setAttribute('aria-label', isFs ? 'Thu nhỏ màn hình' : 'Toàn màn hình');
    if (isFs) {
      document.body.classList.add('is-fullscreen');
    } else {
      document.body.classList.remove('is-fullscreen');
    }
  }

  function toggleFullscreen() {
    const isFs = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    if (!isFs) {
      const target = document.documentElement;
      const req = target.requestFullscreen ||
                  target.webkitRequestFullscreen ||
                  target.mozRequestFullScreen ||
                  target.msRequestFullscreen;
      if (req) {
        req.call(target).catch(function (err) {
          console.warn('Lỗi bật toàn màn hình:', err);
          if (window.parent && window.parent !== window) {
            try {
              const pDoc = window.parent.document;
              const pTarget = pDoc.getElementById('viewPixelGame') || pDoc.documentElement;
              const pReq = pTarget.requestFullscreen || pTarget.webkitRequestFullscreen;
              if (pReq) pReq.call(pTarget);
            } catch (e) {}
          }
        });
      }
    } else {
      const exit = document.exitFullscreen ||
                   document.webkitExitFullscreen ||
                   document.mozCancelFullScreen ||
                   document.msExitFullscreen;
      if (exit) {
        exit.call(document).catch(function (err) {
          console.warn('Lỗi thoát toàn màn hình:', err);
        });
      }
      if (window.parent && window.parent !== window) {
        try {
          if (window.parent.document.fullscreenElement) {
            window.parent.document.exitFullscreen();
          }
        } catch (e) {}
      }
    }
  }

  function initFullscreenButton() {
    const btn = document.getElementById('btnFullscreen');
    if (!btn) return;
    updateFullscreenButton(btn);
    btn.onclick = toggleFullscreen;

    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(function (ev) {
      document.addEventListener(ev, function () {
        updateFullscreenButton(btn);
      });
    });

    window.addEventListener('keydown', function (e) {
      if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    });
  }

  function initBridge() {
    initMuteButton();
    initFullscreenButton();

    window.addEventListener('hoa-dien-ending', function (event) {
      if (!event || !event.detail) return;
      const endingId = event.detail.endingId;
      if (![1, 2, 3].includes(endingId)) return;
      if (window.parent && window.parent !== window) {
        try {
          window.parent.postMessage({
            type: 'VT_PIXEL_STAGE_COMPLETE',
            station: 'mask',
            endingId: endingId,
            exhibitionHasDualMask: !!event.detail.exhibitionHasDualMask
          }, window.location.origin);
        } catch (e) {
          console.warn('Lỗi gửi kết quả về bảo tàng Vạn Tượng:', e);
        }
      }
    });

    window.addEventListener('message', function (event) {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'VT_SET_MUTE' && window.GameAudio) {
        if (typeof window.GameAudio.setMuted === 'function') {
          window.GameAudio.setMuted(!!data.muted);
        }
      } else if (data.type === 'VT_DISPOSE_AUDIO' && window.GameAudio) {
        if (typeof window.GameAudio.dispose === 'function') {
          window.GameAudio.dispose();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBridge);
  } else {
    initBridge();
  }
})();
