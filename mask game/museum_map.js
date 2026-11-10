// HỌA DIỆN (The Dual Mask) - Museum Architectural Cross-Section Blueprint (Floor 2 Item)
window.MuseumMap = (function () {
  let activeOverlay = null;
  let discovered = false;

  function isDiscovered() {
    if (discovered) return true;
    if (window.GameEngine && window.GameEngine.world && window.GameEngine.world.floor2 && window.GameEngine.world.floor2.hasDiscoveredMap) {
      discovered = true;
      return true;
    }
    return false;
  }

  function discover() {
    discovered = true;
    if (window.GameEngine && window.GameEngine.world && window.GameEngine.world.floor2) {
      window.GameEngine.world.floor2.hasDiscoveredMap = true;
    }
    if (window.DeductionJournal && window.DeductionJournal.addKeyword) {
      window.DeductionJournal.addKeyword('[Bản vẽ mặt cắt kiến trúc bảo tàng]');
    }
  }

  function isOpen() {
    return activeOverlay !== null;
  }

  function isActive() {
    return isOpen();
  }

  function close() {
    if (activeOverlay && activeOverlay.parentNode) {
      activeOverlay.parentNode.removeChild(activeOverlay);
    }
    activeOverlay = null;
    if (window.GameAudio) window.GameAudio.journalClose();
  }

  function getFloorName(scene) {
    switch (scene) {
      case 'workshop': return 'Xưởng Phục Chế Cổ Vật (Tầng Trệt - Cánh Trái)';
      case 'floor1': return 'Đại Sảnh & Gian Thờ Tổ (Tầng 1 - Cánh Phải)';
      case 'floor2': return 'Thư Khố & Phòng Tối Tráng Ảnh (Tầng 2)';
      case 'floor3': return 'Sân Khấu Tuồng Cổ Tiên Sư (Tầng 3)';
      default: return 'Bảo Tàng Gánh Hát Nam Kỳ';
    }
  }

  function open(fromTrigger) {
    if (isOpen()) {
      close();
      return;
    }

    const curScene = window.GameEngine && window.GameEngine.world ? window.GameEngine.world.scene : 'floor2';

    // Must be discovered on Floor 2 before being accessible as an item
    if (!isDiscovered()) {
      if (fromTrigger === true || curScene === 'floor2') {
        discover();
        if (window.GameAudio) window.GameAudio.clueDiscovered();
        if (window.GameEngine && window.GameEngine.showToast) {
          window.GameEngine.showToast('★ ĐÃ THU THẬP: Bản vẽ mặt cắt kiến trúc bảo tàng!');
        }
      } else {
        if (window.GameEngine && window.GameEngine.showToast) {
          window.GameEngine.showToast('Chưa tìm thấy bản đồ! Cần tìm bản vẽ mặt cắt ở Thư khố Tầng 2.');
        }
        return;
      }
    }

    if (window.GameAudio) window.GameAudio.journalOpen();

    const world = window.GameEngine ? window.GameEngine.world : null;
    const curLoc = getFloorName(curScene);

    // Dynamic spoiler-free legend descriptions based on player discovery progress
    const f3Visited = (curScene === 'floor3' || (world && world.floor3 && world.floor3.drumCompleted));
    const f3Label = f3Visited
      ? 'Sân Khấu Tuồng Cổ & Đại Trống Chầu'
      : 'Sân Khấu Tuồng Cổ & Khán Phòng';

    const hasSecretAttic = world && world.dragonKeyInserted;

    const overlay = document.createElement('div');
    overlay.className = 'map-overlay';
    overlay.innerHTML = `
      <div class="map-modal">
        <div class="f2-header">
          <h3>🏛️ BẢN VẼ KIẾN TRÚC BẢO TÀNG GÁNH HÁT NAM KỲ</h3>
          <button class="f2-btn-close" id="btnMapClose" title="Đóng [ESC]">✕</button>
        </div>
        <div class="map-body">
          <div class="map-view-frame">
            <img src="assets/map/bao_tang_cross_section.webp" alt="Bản vẽ mặt cắt kiến trúc bảo tàng" class="map-img" />
          </div>

          <div style="background:#130e1a; border:1px solid #9a742b; border-radius:4px; padding:8px 12px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
            <span>📍 <b>Vị trí hiện tại:</b> <span style="color:#ecc554">${curLoc}</span></span>
            <span style="color:#aba291; font-size:11px;">Nhấn [ESC] để đóng</span>
          </div>

          <div class="map-legend">
            ${hasSecretAttic ? `
              <div class="legend-item" style="border: 1px solid #d4a237; background: #2b180d; padding: 3px 6px; border-radius: 4px;">
                <span class="legend-badge" style="background:#873600; border-color:#ecc554;">GÁC MÁI</span>
                <span style="color:#ecc554; font-weight:bold;">Gian Gác Mái Bí Mật (Đã thả thang dây)</span>
              </div>
            ` : ''}
            <div class="legend-item">
              <span class="legend-badge">TẦNG 3</span>
              <span>${f3Label}</span>
            </div>
            <div class="legend-item">
              <span class="legend-badge">TẦNG 2</span>
              <span>Thư Khố Tư Liệu & Phòng Tráng Ảnh</span>
            </div>
            <div class="legend-item">
              <span class="legend-badge">TẦNG 1</span>
              <span>Đại Sảnh Trưng Bày & Gian Thờ Tổ</span>
            </div>
            <div class="legend-item">
              <span class="legend-badge">TRỆT</span>
              <span>Xưởng Phục Chế Cổ Vật</span>
            </div>
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-primary" id="btnMapOk">Đóng Bản Vẽ [ESC]</button>
        </div>
      </div>
    `;

    // Prevent background canvas leakage from mouse events
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target === overlay) close();
    });
    overlay.addEventListener('mousedown', (e) => e.stopPropagation());

    document.body.appendChild(overlay);
    activeOverlay = overlay;

    document.getElementById('btnMapClose').onclick = close;
    document.getElementById('btnMapOk').onclick = close;
  }

  // Capturing keydown listener to completely eliminate background leakage while map is active
  window.addEventListener('keydown', (e) => {
    if (isOpen()) {
      if (e.key === 'Escape' || e.code === 'Escape' || e.code === 'KeyM') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        close();
        return;
      }
      // Block all character movement & game interaction keys from background
      if (['KeyA', 'KeyD', 'KeyE', 'Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    } else if (e.code === 'KeyM') {
      // Hotkey [M] only works once discovered
      if (isDiscovered()) {
        e.preventDefault();
        open();
      }
    }
  }, true);

  return {
    open,
    close,
    closeModal: close,
    isOpen,
    isActive,
    isDiscovered,
    discover
  };
})();
