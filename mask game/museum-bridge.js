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

  function initBridge() {
    initMuteButton();

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
