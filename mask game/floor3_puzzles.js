// HỌA DIỆN (The Dual Mask) - Tầng 3: Sân Khấu Tuồng Cổ & Căn Phòng Gác Mái Bí Mật
// Module câu đố & hồi kết nâng cấp theo GDD:
// 1. Gõ Đại Trống Chầu theo nhịp Tuồng Cổ 6 nhịp (TÙNG - TÙNG - CẮC - RỤP - RỤP - RỤP)
// 2. Kịch bản Tuồng thất truyền dưới ánh trăng (Bản thảo chép tay, dân thôn ai oán & Mệnh đề 3)
// 3. Khảo sát Căn Phòng Gác Mái Bí Mật (Khánh Đá Ngũ Hành, Tráp Mây Di Vật, Di Thư Lụa Cổ Đô, Lệnh Bài Hộ Quốc & Hội ngộ Bác Cảnh)
// 4. Bục Trưng Bày & Hồi Kết Đa Chiều (Chân Dung Bất Tử, Tro Tàn Kẻ Thù Dân, Mặt Nạ Song Diện & Khúc Ca Hòa Giải)

window.Floor3Puzzles = (function () {
  let activeModal = null;
  let currentContextualClose = null;
  let isClosing = false;
  const timers = new Set();

  function later(fn, ms) {
    const owner = activeModal;
    const id = setTimeout(() => {
      timers.delete(id);
      if (activeModal === owner) fn();
    }, ms);
    timers.add(id);
    return id;
  }

  // closeModal: Raw cleanup for internal transitions and teardown
  function closeModal() {
    timers.forEach(clearTimeout);
    timers.clear();
    currentContextualClose = null;
    isClosing = false;
    if (activeModal && activeModal.parentNode) {
      activeModal.parentNode.removeChild(activeModal);
    }
    activeModal = null;
    if (window.GameAudio && typeof window.GameAudio.journalClose === 'function') {
      window.GameAudio.journalClose();
    }
  }

  // requestClose: Exported contextual close invoked on Escape, close button or backdrop click
  function requestClose() {
    if (isClosing) return;
    if (typeof currentContextualClose === 'function') {
      isClosing = true;
      const cb = currentContextualClose;
      currentContextualClose = null;
      try {
        cb();
      } finally {
        isClosing = false;
      }
    } else {
      closeModal();
    }
  }

  // Modal keyboard capture to prevent background movement & leakage
  window.addEventListener('keydown', (e) => {
    if (activeModal) {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        requestClose();
        return;
      }
      if (['KeyA', 'KeyD', 'KeyE', 'Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }, true);

  // ----------------------------------------------------
  // CÂU ĐỐ 1: GÕ ĐẠI TRỐNG CHẦU SÂN KHẤU TUỒNG
  // Nhịp lệnh xuất tướng: TÙNG - TÙNG - CẮC - RỤP - RỤP - RỤP (6 nhịp)
  // ----------------------------------------------------
  function openDrumRhythmModal(onSuccess) {
    closeModal();
    if (window.GameAudio && typeof window.GameAudio.journalOpen === 'function') {
      window.GameAudio.journalOpen();
    }

    const world = (window.GameEngine && window.GameEngine.world) ? window.GameEngine.world : null;
    if (world && !world.floor3) world.floor3 = {};
    const hasDrumsticks = !!(world && world.floor3 && world.floor3.hasDrumsticks);

    const targetPattern = ['tung', 'tung', 'cac', 'rup', 'rup', 'rup'];
    let currentInput = [];
    let isLocked = false;
    let solved = false;

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal" style="max-width: 620px; border-color: #ecc554;">
        <div class="f2-header">
          <h3>🥁 ĐẠI TRỐNG CHẦU GÁNH HÁT TIÊN SƯ (1930)</h3>
          <button class="f2-btn-close" id="btnDrumClose" title="Đóng [ESC]">✕</button>
        </div>
        <div style="padding: 16px; display: flex; flex-direction: column; gap: 14px; background: #160f1b;">
          <div style="background: #24182b; border: 1px solid #7a5824; border-radius: 6px; padding: 12px; font-size: 12.5px; line-height: 1.6; color: #f5ecc9;">
            Mặt trống bịt da trâu già sơn son thếp vàng, viền đóng đinh đồng cổ kính.<br>
            Trên giá đỡ khắc khẩu quyết điểm binh cổ truyền: <b>« Nhị Tùng sơ khởi — Nhất Cắc định thần — Tam Rụp thu phong »</b>.<br>
            <span style="color: #ecc554;">(Gợi ý: Điểm đúng 6 nhịp Trống Chầu của tích Tuồng để kích hoạt cơ quan sân khấu).</span>
          </div>

          ${!hasDrumsticks ? `
            <div style="background: #381216; border: 1px solid #b71c1c; border-radius: 6px; padding: 10px 14px; color: #ffcdd2; font-size: 12px; line-height: 1.5;">
              ⚠️ <b>Chưa có Dùi Trống Chầu:</b> Tay không khó gõ thành tiếng trống lệnh vang rền. Bạn cần tìm cặp Dùi Trống Chầu của gánh hát để có thể điểm nhịp!
            </div>
          ` : ''}

          <!-- Visual Drum Strike Interface -->
          <div style="display: flex; justify-content: center; gap: 16px; padding: 10px 0; flex-wrap: wrap;">
            <button id="btnStrikeTung" style="background: radial-gradient(circle, #8a2424 0%, #4a1010 100%); border: 3px solid #ecc554; color: #fff; width: 130px; height: 105px; border-radius: 50%; font-size: 15px; font-weight: bold; cursor: ${hasDrumsticks ? 'pointer' : 'not-allowed'}; opacity: ${hasDrumsticks ? '1' : '0.45'}; box-shadow: 0 6px 18px rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3px;">
              <span>🔴 GÕ MẶT</span>
              <span style="font-size: 12px; color: #ecc554;">[TÙNG!]</span>
            </button>

            <button id="btnStrikeCac" style="background: radial-gradient(circle, #5c4738 0%, #2b1f17 100%); border: 3px solid #bcaaa4; color: #fff; width: 130px; height: 105px; border-radius: 50%; font-size: 15px; font-weight: bold; cursor: ${hasDrumsticks ? 'pointer' : 'not-allowed'}; opacity: ${hasDrumsticks ? '1' : '0.45'}; box-shadow: 0 6px 18px rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3px;">
              <span>⚪ GÕ VÀNH</span>
              <span style="font-size: 12px; color: #f5ecc9;">[CẮC!]</span>
            </button>

            <button id="btnStrikeRup" style="background: radial-gradient(circle, #3e3228 0%, #1c1712 100%); border: 3px solid #8d6e63; color: #fff; width: 130px; height: 105px; border-radius: 50%; font-size: 15px; font-weight: bold; cursor: ${hasDrumsticks ? 'pointer' : 'not-allowed'}; opacity: ${hasDrumsticks ? '1' : '0.45'}; box-shadow: 0 6px 18px rgba(0,0,0,0.8); display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3px;">
              <span>🔘 BỊT MẶT</span>
              <span style="font-size: 12px; color: #d7ccc8;">[RỤP!]</span>
            </button>
          </div>

          <!-- Pattern Input Display -->
          <div style="background: #0d0a11; border: 1px solid #4a3424; border-radius: 6px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; color: #aba291;">Nhịp đã đánh:</span>
            <div id="drumBeatsDisplay" style="display: flex; gap: 6px; font-weight: bold; font-size: 13px;">
              <span style="color: #666;">_ _ _ _ _ _</span>
            </div>
            <button id="btnDrumReset" style="background: #2b1f24; border: 1px solid #732b35; color: #ff9999; padding: 4px 10px; font-size: 11px; border-radius: 3px; cursor: pointer;">Làm lại</button>
          </div>

          <div id="drumStatusMsg" style="font-size: 12px; text-align: center; min-height: 20px; color: #aba291;">
            ${hasDrumsticks ? 'Nhấn Gõ Mặt [TÙNG], Gõ Vành [CẮC] hoặc Bịt Mặt [RỤP] theo nhịp...' : 'Chưa có Dùi Trống Chầu để gõ.'}
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-secondary" id="btnDrumExit">Rời Khỏi Trống</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) requestClose();
    });

    const finish = () => {
      closeModal();
    };
    currentContextualClose = finish;

    function playRupSound() {
      if (!window.GameAudio) return;
      if (typeof window.GameAudio.drumRup === 'function') {
        window.GameAudio.drumRup();
      } else if (typeof window.GameAudio.pinHammer === 'function') {
        window.GameAudio.pinHammer();
      } else if (typeof window.GameAudio.drumTung === 'function') {
        window.GameAudio.drumTung();
      }
    }

    function updateBeatsUI() {
      const display = document.getElementById('drumBeatsDisplay');
      if (!display) return;
      if (currentInput.length === 0) {
        display.innerHTML = '<span style="color:#666;">_ _ _ _ _ _</span>';
        return;
      }
      display.innerHTML = currentInput.map(b => {
        if (b === 'tung') {
          return '<span style="color:#d9463e; background:#300a0d; padding:2px 8px; border-radius:3px; border:1px solid #7a1f26;">TÙNG</span>';
        } else if (b === 'cac') {
          return '<span style="color:#ecc554; background:#292211; padding:2px 8px; border-radius:3px; border:1px solid #7a5824;">CẮC</span>';
        } else {
          return '<span style="color:#d7ccc8; background:#241d1a; padding:2px 8px; border-radius:3px; border:1px solid #6d4c41;">RỤP</span>';
        }
      }).join(' ');
    }

    function checkPattern() {
      const status = document.getElementById('drumStatusMsg');
      if (currentInput.length === 6) {
        isLocked = true;
        const matches = currentInput.every((val, idx) => val === targetPattern[idx]);
        if (matches) {
          solved = true;
          if (window.GameAudio) {
            if (typeof window.GameAudio.drumTung === 'function') window.GameAudio.drumTung();
            if (typeof window.GameAudio.doorUnlocked === 'function') window.GameAudio.doorUnlocked();
          }
          if (status) {
            status.innerHTML = '<b style="color: #58d68d;">★ CHÍNH XÁC! Âm vang Trống Chầu đủ 6 nhịp xuất tướng, cơ quan sân khấu đã chuyển động!</b>';
          }

          if (world && world.floor3) {
            world.floor3.drumCompleted = true;
            world.floor3.backstageChestOpened = true;
          }
          if (window.DeductionJournal && typeof window.DeductionJournal.addKeyword === 'function') {
            window.DeductionJournal.addKeyword('[Trống Chầu: Nhịp Tùng Tùng Cắc Rụp Rụp Rụp]');
          }

          later(() => {
            requestClose();
            if (window.GameEngine && typeof window.GameEngine.showToast === 'function') {
              window.GameEngine.showToast('★ ĐÃ GIẢI MÃ: Điểm đúng 6 nhịp Trống Chầu Tiên Sư!');
            }
            if (onSuccess) onSuccess();
          }, 1200);
        } else {
          if (window.GameAudio && typeof window.GameAudio.drumCac === 'function') {
            window.GameAudio.drumCac();
          }
          if (status) {
            status.innerHTML = '<span style="color: #e74c3c;">✗ Sai nhịp điệu! Tiếng trống lạc điệu, xin hãy thử lại.</span>';
          }
          later(() => {
            currentInput = [];
            updateBeatsUI();
            isLocked = false;
            if (status) status.innerHTML = 'Nhấn Gõ Mặt [TÙNG], Gõ Vành [CẮC] hoặc Bịt Mặt [RỤP] theo nhịp...';
          }, 1000);
        }
      }
    }

    function strikeBeat(type) {
      if (isLocked || solved || !hasDrumsticks) return;
      if (currentInput.length >= 6) return;
      if (type === 'tung') {
        if (window.GameAudio && typeof window.GameAudio.drumTung === 'function') window.GameAudio.drumTung();
      } else if (type === 'cac') {
        if (window.GameAudio && typeof window.GameAudio.drumCac === 'function') window.GameAudio.drumCac();
      } else if (type === 'rup') {
        playRupSound();
      }
      currentInput.push(type);
      updateBeatsUI();
      checkPattern();
    }

    const btnTung = document.getElementById('btnStrikeTung');
    if (btnTung) btnTung.onclick = () => strikeBeat('tung');

    const btnCac = document.getElementById('btnStrikeCac');
    if (btnCac) btnCac.onclick = () => strikeBeat('cac');

    const btnRup = document.getElementById('btnStrikeRup');
    if (btnRup) btnRup.onclick = () => strikeBeat('rup');

    const btnReset = document.getElementById('btnDrumReset');
    if (btnReset) {
      btnReset.onclick = () => {
        if (solved || isLocked) return;
        currentInput = [];
        updateBeatsUI();
        const status = document.getElementById('drumStatusMsg');
        if (status) status.innerHTML = 'Nhấn Gõ Mặt [TÙNG], Gõ Vành [CẮC] hoặc Bịt Mặt [RỤP] theo nhịp...';
      };
    }

    const btnClose = document.getElementById('btnDrumClose');
    if (btnClose) btnClose.onclick = requestClose;

    const btnExit = document.getElementById('btnDrumExit');
    if (btnExit) btnExit.onclick = requestClose;
  }

  // ----------------------------------------------------
  // CÂU ĐỐ 2: KHẢO SÁT KỊCH BẢN TUỒNG THẤT TRUYỀN
  // (Bản thảo chép tay: Lời oán thán thiêu thôn, kỹ nghệ sơn bồi mộc & Mệnh đề 3)
  // ----------------------------------------------------
  function openTuongScriptModal(onClose) {
    closeModal();
    if (window.GameAudio && typeof window.GameAudio.journalOpen === 'function') {
      window.GameAudio.journalOpen();
    }

    const world = (window.GameEngine && window.GameEngine.world) ? window.GameEngine.world : null;
    if (world && !world.floor3) world.floor3 = {};

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal" style="max-width: 640px;">
        <div class="f2-header">
          <h3>📜 BẢN THẢO KỊCH BẢN TUỒNG CỔ: « VŨ TƯỚNG CANH NGỌ TIÊU THỔ KÝ » (1930)</h3>
          <button class="f2-btn-close" id="btnScriptClose" title="Đóng [ESC]">✕</button>
        </div>
        <div style="padding: 18px; display: flex; flex-direction: column; gap: 14px; background: #160e1a;">
          <div class="f2-scroll-frame" style="padding: 16px 20px;">
            <div style="font-size: 13px; line-height: 1.65; color: #3e2723;">
              <h4 style="text-align: center; color: #b71c1c; font-size: 15px; margin-bottom: 8px;">TRÍCH ĐOẠN ĐÊM HỎA HOẠN 12.11.1930 & BÚT TÍCH BÊN LỀ</h4>

              <div style="border-bottom: 1px dashed #a1887f; padding-bottom: 10px; margin-bottom: 10px;">
                <b style="color: #8d2626;">[Lớp Diễn Thứ 5 — Tiếng Khóc Dân Làng & Tướng Vũ Mang Xiềng]:</b><br>
                <i>« Lửa ngút trời tro tàn xóm cũ!<br>
                Tướng quân họ Vũ cớ sao vung đuốc thiêu rụi mái nhà che mưa nắng, đốt sạch bồ thóc hạt giống của dân nghèo?<br>
                Lửa thiêu bách tính, tội ngập trời xanh, dẫu thác muôn lần chẳng rửa hết oan khiên! Tướng Vũ mang xiềng quỳ gào khóc giữa tro tàn... »</i>
              </div>

              <div>
                <b style="color: #4e342e;">[Ghi Chép Của Nghệ Nhân Chế Tác Mặt Nạ Gánh Hát]:</b><br>
                <i>« Mặt nạ tướng quân chế tác từ gỗ thị ngàn năm, phân định âm dương lưỡng diện.<br>
                Phía diện mạo chu sa đỏ rực uy nghi, người thợ mộc xưa đã gia công một lớp <b>sơn bồi vôi gai dày cộm</b> bọc kín vùng mắt và sống mũi, cốt để che chắn thớ mộng bên trong trước tàn tro khói lửa.<br>
                Muốn tìm ra then chốt của cơ quan liên kết, người đời sau chỉ có thể dùng <b>Dao cạo mộc</b> tỉ mỉ bóc đi lớp sơn bồi gai góc, chạm vào điểm then chốt ẩn nơi <b>con ngươi mắt trái</b>... »</i>
              </div>
            </div>
          </div>
          <div class="f2-clue-box">
            <span class="f2-clue-icon">💡</span>
            <div class="f2-clue-desc">
              <b>Ghi chép phục chế & Manh mối lịch sử:</b> Kịch bản hé lộ sự căm phẫn sâu sắc của dân làng trước ngọn lửa thiêu thôn, đồng thời xác nhận lớp vôi gai sần sùi trên <b>Nửa Mặt Nạ Đỏ</b> tại Xưởng Phục Chế là lớp sơn bồi bảo vệ mộng mộc.
            </div>
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-primary" id="btnScriptConfirm">Ghi Nhận Vào Sổ Tay [ESC]</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) requestClose();
    });

    if (window.DeductionJournal) {
      if (typeof window.DeductionJournal.addKeyword === 'function') {
        window.DeductionJournal.addKeyword('[Mệnh đề 3: Nỗi oan trong kịch bản Tuồng]');
        window.DeductionJournal.addKeyword('[Bí quyết cạo sơn bồi Nửa Mặt Nạ Đỏ]');
      }
      window.DeductionJournal.proposition3 = true;
    }

    if (world && world.floor3) {
      world.floor3.readTuongScript = true;
      world.floor3.proposition3 = true;
    }

    const finish = () => {
      closeModal();
      if (onClose) onClose();
    };
    currentContextualClose = finish;

    const btnClose = document.getElementById('btnScriptClose');
    if (btnClose) btnClose.onclick = requestClose;

    const btnConfirm = document.getElementById('btnScriptConfirm');
    if (btnConfirm) btnConfirm.onclick = requestClose;
  }

  // ----------------------------------------------------
  // TẦNG ẨN (GÁC MÁI): CÂU ĐỐ KHÁNH ĐÁ NGŨ HÀNH & TRÁP MÂY DI VẬT
  // ----------------------------------------------------
  function openSecretAtticModal(onComplete) {
    const world = (window.GameEngine && window.GameEngine.world) ? window.GameEngine.world : null;
    if (!world || !world.dragonKeyInserted) return;
    if (!world.floor3) world.floor3 = {};

    closeModal();
    if (window.GameAudio && typeof window.GameAudio.photoRevealed === 'function') {
      window.GameAudio.photoRevealed();
    }

    const isAlreadySolved = !!world.floor3.stoneBellsSolved;

    if (isAlreadySolved) {
      showLootModal(false);
    } else {
      showStoneBellsModal();
    }

    // 1. Phân cảnh Câu đố Khánh Đá Ngũ Hành
    function showStoneBellsModal() {
      const targetBells = ['thuy', 'moc', 'kim'];
      let currentBells = [];
      let isBellsLocked = false;

      const overlay = document.createElement('div');
      overlay.className = 'f2-overlay';
      overlay.innerHTML = `
        <div class="f2-modal" style="max-width: 660px; border-color: #ecc554; box-shadow: 0 0 30px rgba(236, 197, 84, 0.35);">
          <div class="f2-header">
            <h3>🔔 TẦNG ÁP MÁI — KHÁNH ĐÁ NGŨ HÀNH TRÊN NÓC RẠP</h3>
            <button class="f2-btn-close" id="btnBellsClose" title="Đóng [ESC]">✕</button>
          </div>
          <div style="padding: 18px; display: flex; flex-direction: column; gap: 14px; background: #140d18;">
            <div style="background: #23162a; border: 1px solid #8e6828; border-radius: 6px; padding: 14px; color: #f5ecc9; font-size: 12.5px; line-height: 1.65;">
              Giữa các vì kèo gỗ lim phủ bụi thời gian là một giá treo gồm <b>5 phiến khánh đá tự nhiên</b>, phía trên xà gồ có một chiếc ttráp mây bị khóa chặt bởi ròng rọc đồng.<br>
              Bút tích cổ khắc trên xà nóc truyền lại khẩu quyết: <br>
              <b style="color: #ecc554; font-size: 13px;">« Thủy khắc Hỏa giữ tâm không cháy (THỦY) — Mộc sinh Hỏa giữ thế không tàn (MỘC) — Điều hòa trục Kim bảo vật tự hạ (KIM). Hỏa dữ và Thổ bụi chỉ làm đục tiếng khánh thiêng. »</b><br>
              <span style="color: #aba291; font-size: 11.5px;">(Gợi ý: Gõ đúng 3 tiếng khánh đá tương sinh theo thứ tự để hạ tráp mây cổ).</span>
            </div>

            <!-- Visual Bell Buttons -->
            <div style="display: flex; justify-content: center; gap: 12px; padding: 10px 0; flex-wrap: wrap;">
              <button id="btnBellThuy" style="background: #153047; border: 2px solid #3498db; color: #85c1e9; min-width: 105px; height: 80px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                <span style="font-size: 18px;">💧</span>
                <span style="font-size: 12px;">THỦY</span>
                <span style="font-size: 10px; color: #aed6f1;">(Nước nguồn)</span>
              </button>

              <button id="btnBellMoc" style="background: #143823; border: 2px solid #2ecc71; color: #82e0aa; min-width: 105px; height: 80px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                <span style="font-size: 18px;">🌿</span>
                <span style="font-size: 12px;">MỘC</span>
                <span style="font-size: 10px; color: #abebc6;">(Rừng thiêng)</span>
              </button>

              <button id="btnBellKim" style="background: #423618; border: 2px solid #f1c40f; color: #f7dc6f; min-width: 105px; height: 80px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                <span style="font-size: 18px;">⚔️</span>
                <span style="font-size: 12px;">KIM</span>
                <span style="font-size: 10px; color: #f9e79f;">(Vàng quỳnh)</span>
              </button>

              <button id="btnBellHoa" style="background: #441818; border: 2px solid #e74c3c; color: #f1948a; min-width: 105px; height: 80px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                <span style="font-size: 18px;">🔥</span>
                <span style="font-size: 12px;">HỎA</span>
                <span style="font-size: 10px; color: #f5b7b1;">(Lửa thiêu)</span>
              </button>

              <button id="btnBellTho" style="background: #382a20; border: 2px solid #a08060; color: #d7ccc8; min-width: 105px; height: 80px; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
                <span style="font-size: 18px;">⛰️</span>
                <span style="font-size: 12px;">THỔ</span>
                <span style="font-size: 10px; color: #e5e0dc;">(Đất bụi)</span>
              </button>
            </div>

            <!-- Bell Input Status -->
            <div style="background: #0d0a11; border: 1px solid #4a3424; border-radius: 6px; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #aba291;">Thứ tự đã gõ:</span>
              <div id="bellsBeatsDisplay" style="display: flex; gap: 8px; font-weight: bold; font-size: 13px;">
                <span style="color: #666;">_ _ _</span>
              </div>
              <button id="btnBellReset" style="background: #2b1f24; border: 1px solid #732b35; color: #ff9999; padding: 4px 10px; font-size: 11px; border-radius: 3px; cursor: pointer;">Hồi Vị (Làm lại)</button>
            </div>

            <div id="bellsStatusMsg" style="font-size: 12px; text-align: center; min-height: 20px; color: #aba291;">
              Gõ các phiến khánh đá theo thứ tự khẩu quyết...
            </div>
          </div>
          <div class="f2-footer">
            <button class="f2-btn-secondary" id="btnBellsExit">Rời Khỏi Áp Mái</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      activeModal = overlay;

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) requestClose();
      });

      const finish = () => {
        closeModal();
      };
      currentContextualClose = finish;

      function updateBellsUI() {
        const display = document.getElementById('bellsBeatsDisplay');
        if (!display) return;
        if (currentBells.length === 0) {
          display.innerHTML = '<span style="color:#666;">_ _ _</span>';
          return;
        }
        display.innerHTML = currentBells.map(b => {
          const names = { thuy: 'THỦY', moc: 'MỘC', kim: 'KIM', hoa: 'HỎA', tho: 'THỔ' };
          const colors = { thuy: '#85c1e9', moc: '#82e0aa', kim: '#f7dc6f', hoa: '#f1948a', tho: '#d7ccc8' };
          return `<span style="color:${colors[b]}; background:rgba(0,0,0,0.5); padding:2px 8px; border-radius:3px; border:1px solid ${colors[b]};">${names[b]}</span>`;
        }).join(' ');
      }

      function checkBellsPattern() {
        const status = document.getElementById('bellsStatusMsg');
        if (currentBells.length === 3) {
          isBellsLocked = true;
          const matches = currentBells.every((val, idx) => val === targetBells[idx]);
          if (matches) {
            world.floor3.stoneBellsSolved = true;
            if (window.GameAudio) {
              if (typeof window.GameAudio.templeBell === 'function') window.GameAudio.templeBell();
              if (typeof window.GameAudio.chestOpen === 'function') window.GameAudio.chestOpen();
            }
            if (status) {
              status.innerHTML = '<b style="color: #58d68d;">★ CHÍNH XÁC! Âm khánh đá ngân vang thanh khiết, ròng rọc hạ chiếc Tráp Mây xuống bệ ngói!</b>';
            }
            later(() => {
              showLootModal(true);
            }, 1000);
          } else {
            if (window.GameAudio && typeof window.GameAudio.drumCac === 'function') {
              window.GameAudio.drumCac();
            }
            if (status) {
              status.innerHTML = '<span style="color: #e74c3c;">✗ Ngũ hành nghịch loạn! Tiếng khánh trầm đục. Xin gõ lại hoặc nhấn [Hồi Vị].</span>';
            }
            later(() => {
              currentBells = [];
              updateBellsUI();
              isBellsLocked = false;
              if (status) status.innerHTML = 'Gõ các phiến khánh đá theo thứ tự khẩu quyết...';
            }, 1000);
          }
        }
      }

      function strikeBell(bellKey) {
        if (isBellsLocked || currentBells.length >= 3) return;
        if (window.GameAudio && typeof window.GameAudio.templeBell === 'function') {
          window.GameAudio.templeBell();
        }
        currentBells.push(bellKey);
        updateBellsUI();
        checkBellsPattern();
      }

      ['Thuy', 'Moc', 'Kim', 'Hoa', 'Tho'].forEach(b => {
        const btn = document.getElementById(`btnBell${b}`);
        if (btn) btn.onclick = () => strikeBell(b.toLowerCase());
      });

      const btnReset = document.getElementById('btnBellReset');
      if (btnReset) {
        btnReset.onclick = () => {
          if (isBellsLocked) return;
          currentBells = [];
          updateBellsUI();
          const status = document.getElementById('bellsStatusMsg');
          if (status) status.innerHTML = 'Gõ các phiến khánh đá theo thứ tự khẩu quyết...';
        };
      }

      const btnClose = document.getElementById('btnBellsClose');
      if (btnClose) btnClose.onclick = requestClose;

      const btnExit = document.getElementById('btnBellsExit');
      if (btnExit) btnExit.onclick = requestClose;
    }

    // 2. Phân cảnh Thu Nhận Di Vật Trong Tráp Mây
    function showLootModal(isFirstSolve) {
      closeModal();
      if (window.GameAudio && typeof window.GameAudio.photoRevealed === 'function') {
        window.GameAudio.photoRevealed();
      }

      const pinAlreadyConsumed = !!(
        (window.InspectionMode && window.InspectionMode.state && window.InspectionMode.state.hasInsertedEbonyPin) ||
        (world && world.floor3 && world.floor3.hasDualMask1930)
      );

      // Persist state
      if (world && world.floor3) {
        world.floor3.hasWhiteHalf = true;
        if (!pinAlreadyConsumed) {
          world.floor3.hasEbonyPin = true;
        }
        world.floor3.hasMasterLetter = true;
        world.floor3.hasTokenHoQuoc = true;
      }

      if (window.DeductionJournal && typeof window.DeductionJournal.addKeyword === 'function') {
        window.DeductionJournal.addKeyword('[Di thư lụa Cổ Đô: Quyết định xé ruột 1930]');
        window.DeductionJournal.addKeyword('[Lệnh bài: Hộ Quốc]');
      }

      const overlay = document.createElement('div');
      overlay.className = 'f2-overlay';
      overlay.innerHTML = `
        <div class="f2-modal" style="max-width: 740px; border-color: #ecc554; box-shadow: 0 0 35px rgba(236, 197, 84, 0.4);">
          <div class="f2-header">
            <h3>🗝️ TẦNG ÁP MÁI — TRÁP MÂY DI VẬT KÉP HÁT TRƯỞNG (1930)</h3>
            <button class="f2-btn-close" id="btnAtticClose" title="Đóng [ESC]">✕</button>
          </div>
          <div style="padding: 18px; display: flex; flex-direction: column; gap: 14px; background: #140d18;">
            <div style="display: flex; gap: 16px; align-items: center; background: radial-gradient(circle at center, #2e1a38 0%, #170d1e 100%); border: 2px solid #9a742b; border-radius: 6px; padding: 14px; box-shadow: inset 0 0 20px rgba(0,0,0,0.8);">
              <div style="width: 84px; height: 96px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.45); border-radius: 6px; border: 1px solid #785420; flex-shrink: 0;">
                <img src="assets/mask_angles/mask_white_half.png" style="height: 82px; object-fit: contain; filter: drop-shadow(0 0 10px rgba(236, 197, 84, 0.8));" alt="Nửa Mặt Nạ Trắng" />
              </div>
              <div>
                <div style="display: inline-block; background: #471822; border: 1px solid #d9463e; color: #ecc554; padding: 2px 8px; border-radius: 3px; font-size: 10px; font-weight: bold; margin-bottom: 4px;">BẢO VẬT TẦNG ÁP MÁI</div>
                <h4 style="color: #ecc554; font-size: 15px; margin-bottom: 6px;">NỬA MẶT NẠ TRẮNG (BẠCH DIỆN BI THƯƠNG), CHỐT GỖ MUN & LỆNH BÀI HỘ QUỐC</h4>
                <p style="font-size: 12px; line-height: 1.6; color: #f5ecc9;">
                  Nằm trang trọng trong chiếc tráp mây cổ là <b>Nửa Mặt Nạ Trắng</b> phủ phấn vỏ điệp cùng giọt lệ vàng đọng trên gò má.<br>
                  Bên cạnh là <b>${pinAlreadyConsumed ? 'Dấu tích Chốt Gỗ Mun (đã ghép mộc)' : 'Một Chiếc Chốt Gỗ Mun vuông vắn'}</b>, <b>Mảnh Lệnh Bài Đồng khắc chữ « HỘ QUỐC »</b>, cùng bức <b>Huyết Thư Lụa Cổ Đô</b> của Kép Hát Trưởng.
                </p>
              </div>
            </div>

            <!-- Di Thư Lụa Cổ Đô -->
            <div style="background: #19101f; border-left: 4px solid #58d68d; padding: 14px 16px; border-radius: 0 4px 4px 0; font-size: 12.5px; line-height: 1.7; color: #e6dfd1;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <b style="color: #58d68d; font-size: 13px;">📜 HUYẾT THƯ TRÊN LỤA CỔ ĐÔ — KÉP HÁT TRƯỞNG (ĐÊM 12.11.1930):</b>
                <span style="font-size: 10px; color: #aba291; font-family: monospace;">BA CÂU KHẨU QUYẾT GHÉP MỘNG</span>
              </div>
              <div style="color: #f7edd4; background: rgba(0,0,0,0.35); padding: 12px 14px; border-radius: 4px; border: 1px dashed #6b5328; font-size: 12px; line-height: 1.65;">
                <i>« Kính lạy hồn thiêng gánh hát Tiên Sư và con dân trăm họ...<br>
                Đêm Canh Ngọ ấy, giặc Pháp đem binh siết chặt vòng vây, hòng cắt đứt tuyến chi viện huyết mạch và bắt giữ 20 đứa trẻ mồ côi cùng thương binh gánh hát đang náu mình sau rạp.<br>
                Trước giờ tử biệt, Tướng quân họ Vũ cùng gánh hát phải nuốt lệ đưa ra quyết định xé ruột: Tự tay châm ngọn lửa thiêu rụi xóm cũ và kho thóc để chặn bước quân thù, ngụy trang tuyến tiếp viện bí mật đưa các con vượt sông bình an.<br>
                Một đời vì nước vì dân, phút cuối chấp nhận mang danh đồ tể ngàn năm bia miệng... Nỗi đau ấy người trần mắt thịt nào hay!<br><br>
                <b>BA CÂU KHẨU QUYẾT GHÉP MỘNG TRUYỀN LẠI CHO HẬU THẾ:</b><br>
                1. « Đêm ấy trăng mờ mây phủ, chẳng gió chẳng mưa... »<br>
                2. « Ngoài mặt giận dữ thiêu làng, trong lòng nhỏ máu khóc than... »<br>
                3. « Thân xác hóa tro tàn, tinh thần bất diệt... »<br><br>
                Xin gửi lại nửa mặt nạ trắng cùng tín vật Hộ Quốc... Đợi người hiểu được nỗi oan này kết nối lại vẹn tròn! »</i>
              </div>
            </div>

            <div style="background: #251b30; border: 1px solid #7a5824; border-radius: 6px; padding: 12px; font-size: 12px; line-height: 1.55; color: #f5ecc9;">
              📦 <b>Vật phẩm thu nhận:</b> <b>Nửa Mặt Nạ Trắng</b>, <b>${pinAlreadyConsumed ? 'Chốt Gỗ Mun (đã lắp)' : 'Chốt Khóa Gỗ Mun'}</b>, <b>Di Thư Lụa Cổ Đô</b>, và <b>Mảnh Lệnh Bài Hộ Quốc</b>.<br>
              <span style="color: #ecc554; font-size: 11.5px;">👉 Hãy mang các di vật về <b>Bục Hiện Vật ở Xưởng Phục Chế (Tầng Trệt)</b> để tiến hành ghép mộng song diện cùng Nửa Mặt Nạ Đỏ!</span>
            </div>
          </div>
          <div class="f2-footer">
            <button class="f2-btn-primary" id="btnAtticConfirm">Thu Nhận Di Vật & Xuống Gác [ESC]</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      activeModal = overlay;

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) requestClose();
      });

      let exitTriggered = false;
      const handleAtticExit = () => {
        if (exitTriggered) return;
        exitTriggered = true;
        closeModal();

        if (window.GameEngine && typeof window.GameEngine.showToast === 'function') {
          window.GameEngine.showToast('★ ĐÃ THU NHẬN: Nửa Mặt Nạ Trắng, Chốt Gỗ Mun, Di Thư Lụa Cổ Đô & Mảnh Lệnh Bài Hộ Quốc!');
        }

        // Trigger reunion only once upon exit after collection
        if (world && !world.bacCanhReunionDone) {
          if (window.GameEngine && typeof window.GameEngine.playAtticReunion === 'function') {
            window.GameEngine.playAtticReunion(() => {
              if (onComplete) onComplete();
            });
            return;
          }
        }

        if (onComplete) onComplete();
      };

      currentContextualClose = handleAtticExit;

      const btnClose = document.getElementById('btnAtticClose');
      if (btnClose) btnClose.onclick = requestClose;

      const btnConfirm = document.getElementById('btnAtticConfirm');
      if (btnConfirm) btnConfirm.onclick = requestClose;
    }
  }

  // ----------------------------------------------------
  // HỒI KẾT TOÀN DIỆN & BÀI TRÍ TỦ KÍNH (TẠI ĐẠI SẢNH TẦNG 1)
  // ----------------------------------------------------
  function openPlacementModal(endingId, title, description) {
    const world = (window.GameEngine && window.GameEngine.world) ? window.GameEngine.world : null;
    if (!world || ![1, 2, 3].includes(endingId)) return;
    if (!world.floor3) world.floor3 = {};

    // Irreversible choice check: if already placed, route directly to view ending
    if (world.placedVitrine) {
      if (world.placedVitrine === endingId) {
        openEndingModal(endingId);
      } else {
        if (window.GameEngine && typeof window.GameEngine.showDialogue === 'function') {
          window.GameEngine.showDialogue('An', 'Hiện vật đã được đặt trong tủ kính mình chọn. Tủ này vẫn để trống.');
        }
      }
      return;
    }

    const hasRestoredMask = !!world.floor3.hasDualMask1930;
    const readRoyalEdict = !!(world.floor2 && world.floor2.readRoyalEdict);
    const developedPhoto1930 = !!(world.floor2 && world.floor2.developedPhoto1930);
    const readTuongScript = !!world.floor3.readTuongScript;
    const hasMasterLetter = !!world.floor3.hasMasterLetter;
    const hasTokenHoQuoc = !!world.floor3.hasTokenHoQuoc;
    const bacCanhReunionDone = !!world.bacCanhReunionDone;

    // Check conditions per endingId
    if (endingId === 1 || endingId === 2) {
      const canPlaceEarly = readRoyalEdict && developedPhoto1930 && readTuongScript;
      if (!hasRestoredMask && !canPlaceEarly) {
        if (window.GameEngine && typeof window.GameEngine.showDialogue === 'function') {
          window.GameEngine.showDialogue(
            'An',
            'Mình chưa thu thập đủ chứng cứ lịch sử cần thiết để đưa ra kết luận bài trí. Cần nghiên cứu thêm Sắc Phong, Bức Ảnh 1930 và Kịch Bản Tuồng.'
          );
        }
        return;
      }
    } else if (endingId === 3) {
      const canPlaceTrue = hasRestoredMask && hasMasterLetter && hasTokenHoQuoc && bacCanhReunionDone;
      if (!canPlaceTrue) {
        if (window.GameEngine && typeof window.GameEngine.showDialogue === 'function') {
          window.GameEngine.showDialogue(
            'An',
            'Giá đỡ xoay cho phép quan sát cả hai phía. Hiện vật của mình vẫn chưa toàn vẹn để đặt lên đây.'
          );
        }
        return;
      }
    }

    closeModal();
    if (window.GameAudio && typeof window.GameAudio.journalOpen === 'function') {
      window.GameAudio.journalOpen();
    }

    // Determine evidence displayed (no ending title/spoiler before confirmation)
    let evidenceImg = 'outputs/mask_tuong_transparent.png';
    let evidenceTitle = '';
    let evidenceDesc = '';

    if (endingId === 1) {
      if (hasRestoredMask) {
        evidenceImg = 'outputs/mask_tuong_transparent.png';
        evidenceTitle = 'Mặt Nạ Tuồng 1930 (Hướng Mặt Đỏ) & Bản Sắc Phong Triều Nguyễn';
        evidenceDesc = 'Bài trí tôn vinh khí tiết Tiết Nghĩa Trung Thần họ Vũ hy sinh bảo vệ gánh hát, dựa trên Sắc Phong Triều Đình và diện mạo chu sa uy nghiêm.';
      } else {
        evidenceImg = 'assets/mask_angles/mask_red_half.png';
        evidenceTitle = 'Nửa Mặt Nạ Đỏ Chu Sa & Bản Sắc Phong Triều Nguyễn';
        evidenceDesc = 'Bài trí dựa trên bảo vật Nửa Mặt Nạ Đỏ vớt từ tro tàn và Bản Sắc Phong ca ngợi trung thần ái quốc, chưa đề cập đến biến cố hỏa hoạn xóm cũ.';
      }
    } else if (endingId === 2) {
      if (hasRestoredMask) {
        evidenceImg = 'outputs/mask_tuong_transparent.png';
        evidenceTitle = 'Mặt Nạ Tuồng 1930 (Hướng Mặt Trắng), Bức Ảnh 1930 & Kịch Bản Tuồng';
        evidenceDesc = 'Bài trí tập trung vào bi kịch đêm lửa, bức ảnh năm 1930 và những dòng kịch bản ghi lại tiếng khóc oán than của dân làng về thảm cảnh thiêu thôn.';
      } else {
        evidenceImg = 'assets/floor2/anh_tu_lieu_1930.png';
        evidenceTitle = 'Bức Ảnh Đêm Hỏa Hoạn 1930 & Bản Thảo Kịch Bản Tuồng Thất Truyền';
        evidenceDesc = 'Bài trí phơi bày chứng cứ lịch sử về ngọn lửa thiêu rụi xóm cũ và kho thóc, phản ánh góc nhìn lên án gay gắt của con dân đối với vị võ tướng.';
      }
    } else if (endingId === 3) {
      evidenceImg = 'outputs/mask_tuong_transparent.png';
      evidenceTitle = 'Mặt Nạ Song Diện Hoàn Nguyên (Đỏ - Trắng), Di Thư Lụa Cổ Đô & Hai Nửa Lệnh Bài Hợp Nhất';
      evidenceDesc = 'Bài trí bệ xoay 360° hội tụ trọn vẹn hai nửa sự thật: Hào khí trung thần song hành cùng nỗi đau bi thương thầm lặng của cuộc đánh đổi cứu sống 20 đứa trẻ mồ côi.';
    }

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal" style="max-width: 520px; border-color: #ecc554;">
        <div class="f2-header">
          <h3>🏛️ XÁC NHẬN BÀI TRÍ TỦ KÍNH TRIỂN LÃM</h3>
          <button class="f2-btn-close" id="btnPlacementClose" title="Đóng [ESC]">✕</button>
        </div>
        <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px; background: #18111f; color: #f5ecc9; line-height: 1.65;">
          <h4 style="color: #ecc554; font-size: 15px; margin: 0;">${title}</h4>

          <div style="display: flex; gap: 14px; align-items: center; background: rgba(0,0,0,0.45); border-radius: 6px; padding: 12px 14px; border: 1px solid #7a5824;">
            <img src="${evidenceImg}" style="width: 54px; height: 60px; object-fit: contain; filter: drop-shadow(0 0 8px rgba(236, 197, 84, 0.5));" alt="Hiện vật bài trí" />
            <div>
              <div style="color: #ecc554; font-size: 12.5px; font-weight: bold; margin-bottom: 3px;">HIỆN VẬT & TƯ LIỆU BÀI TRÍ:</div>
              <div style="font-size: 12px; color: #fff; font-weight: 600; margin-bottom: 2px;">${evidenceTitle}</div>
              <div style="font-size: 11.5px; color: #d0c8b8;">${evidenceDesc}</div>
            </div>
          </div>

          <div style="background: #251b30; border: 1px solid #7a5824; border-radius: 4px; padding: 10px 12px; font-size: 11.5px; color: #f5ecc9;">
            ⚠️ <b>Lưu ý quan trọng:</b> Sau khi xác nhận đặt hiện vật vào tủ kính này, vị trí trưng bày sẽ được giữ cố định và hoàn tất hành trình đêm trực bảo tàng. Lựa chọn này là duy nhất.
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-secondary" id="cancelPlacement">Khoan đã, cháu muốn tìm hiểu tiếp</button>
          <button class="f2-btn-primary" id="confirmPlacement">Xác Nhận Bài Trí Vào Tủ</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) requestClose();
    });

    const finish = () => {
      closeModal();
    };
    currentContextualClose = finish;

    const btnCancel = overlay.querySelector('#cancelPlacement');
    if (btnCancel) btnCancel.onclick = requestClose;

    const btnClose = overlay.querySelector('#btnPlacementClose');
    if (btnClose) btnClose.onclick = requestClose;

    let isConfirmed = false;
    const btnConfirm = overlay.querySelector('#confirmPlacement');
    if (btnConfirm) {
      btnConfirm.onclick = () => {
        if (isConfirmed || world.placedVitrine) return;
        isConfirmed = true;
        world.placedVitrine = endingId;
        world.chosenEnding = endingId;
        world.readyForEnding = false;
        world.exhibitionHasDualMask = hasRestoredMask;
        try {
          window.dispatchEvent(new CustomEvent('hoa-dien-ending', {
            detail: {
              endingId,
              placedVitrine: endingId,
              exhibitionHasDualMask: !!hasRestoredMask
            }
          }));
        } catch (e) {}
        closeModal();
        openEndingModal(endingId);
      };
    }
  }

  // ----------------------------------------------------
  // HỒI KẾT: HIỂN THỊ KẾT QUẢ TRIỂN LÃM ĐA CHIỀU
  // ----------------------------------------------------
  function openEndingModal(endingId, onFinish) {
    const world = (window.GameEngine && window.GameEngine.world) ? window.GameEngine.world : null;
    if (!world || world.placedVitrine !== endingId) return;
    if (!world.floor3) world.floor3 = {};

    closeModal();
    if (window.GameAudio) {
      if (typeof window.GameAudio.drumTung === 'function') window.GameAudio.drumTung();
      if (typeof window.GameAudio.doorUnlocked === 'function') window.GameAudio.doorUnlocked();
    }

    // Merge token in true ending
    if (endingId === 3) {
      world.floor3.hasMergedToken = true;
    }

    const isDualMask = !!world.exhibitionHasDualMask;

    const endingData = {
      1: {
        title: '🎖️ HỒI KẾT: CHÂN DUNG BẤT TỬ',
        badge: 'KẾT CỤC: BẢO THỦ & VINH DANH ĐƠN CHIỀU',
        borderColor: '#ecc554',
        glowColor: 'rgba(236, 197, 84, 0.4)',
        bgGradient: 'linear-gradient(180deg, #2a1f0d 0%, #171109 100%)',
        icon: '⚔️',
        image: isDualMask ? 'outputs/mask_tuong_transparent.png' : 'assets/mask_angles/mask_red_half.png',
        itemLabel: isDualMask ? 'CỔ VẬT MẶT NẠ HOÀN NGUYÊN (HƯỚNG MẶT ĐỎ)' : 'NỬA MẶT NẠ ĐỎ & SẮC PHONG TRIỀU NGUYỄN',
        summary: 'Tôn vinh khí tiết Tiết Nghĩa Trung Thần họ Vũ, bỏ qua uẩn khúc thiêu làng.',
        content: `
          An quyết định bài trí hiện vật theo hướng vinh danh trung thần ái quốc dựa trên Bản Sắc Phong Triều Nguyễn và diện mạo chu sa uy dũng của Tướng quân họ Vũ.<br><br>
          Dưới ánh đèn vàng rực rỡ của tủ kính danh dự, hào khí kiên cường của người võ tướng tỏa sáng trang nghiêm. Khách tham quan và giới nghiên cứu tấm tắc ngợi khen khí tiết son sắt của tiền nhân gánh hát Tiên Sư thuở kháng Pháp.<br><br>
          Thế nhưng, giữa dòng người rộn rã, Bác Cảnh thủ từ đứng lặng phía sau hàng cột gỗ lim. Nhìn ánh hào quang đang che lấp đi một nửa sự thật đau đớn của người dân xóm cũ, ông cụ khẽ thở dài cay đắng, lặng lẽ đặt chùm chìa khóa bảo tàng lên băng ghế dài rồi bước đi trong thinh lặng. Bóng dáng già nua của người giữ đền dần khuất sau làn mưa mờ mịt trước cổng, mang theo nỗi niềm chưa bao giờ được tỏ bày...
        `
      },
      2: {
        title: '📜 HỒI KẾT: TRO TÀN KẺ THÙ DÂN',
        badge: 'KẾT CỤC: LÊN ÁN ĐƠN DIỆN & HOÀI NGHI',
        borderColor: '#e74c3c',
        glowColor: 'rgba(231, 76, 60, 0.4)',
        bgGradient: 'linear-gradient(180deg, #2a0f12 0%, #15080a 100%)',
        icon: '🕯️',
        image: isDualMask ? 'outputs/mask_tuong_transparent.png' : 'assets/floor2/anh_tu_lieu_1930.png',
        itemLabel: isDualMask ? 'CỔ VẬT MẶT NẠ HOÀN NGUYÊN (HƯỚNG MẶT TRẮNG)' : 'BỨC ẢNH NĂM 1930 & KỊCH BẢN TUỒNG THẤT TRUYỀN',
        summary: 'Lên án thảm cảnh thiêu làng, khép lại hồ sơ bằng một góc nhìn duy nhất.',
        content: `
          An chọn cách bài trí tập trung vào bức ảnh tư liệu năm 1930 cùng những trang kịch bản ghi lại tiếng khóc than ai oán của con dân thôn An Điền trước đám cháy thiêu rụi xóm cũ.<br><br>
          Góc trưng bày tạo nên một cơn chấn động dư luận. Các bài phóng sự nhanh chóng giật tít lên án hành động tàn bạo của người tướng quân, quy kết ông là kẻ đồ tể nhẫn tâm hy sinh đồng bào vì tư lợi chiến tranh.<br><br>
          Đêm xuống, khi đám đông hiếu kỳ đã ra về hết, đại sảnh bảo tàng chìm trong bóng tối lạnh lẽo. Bác Cảnh gục đầu bên bệ kính vắng lặng, hai vai run lên bần bật trong tiếng khóc nghẹn ngào đơn độc. Những chứng tích còn chưa được lắng nghe tiếp tục nằm im trong bóng tối, dưới sự phán xét nghiệt ngã một chiều của hậu thế...
        `
      },
      3: {
        title: '👑 TRUE ENDING: MẶT NẠ SONG DIỆN & KHÚC CA HÒA GIẢI',
        badge: 'TRUE ENDING: LƯỠNG DIỆN HOÀN NGUYÊN',
        borderColor: '#58d68d',
        glowColor: 'rgba(88, 214, 141, 0.4)',
        bgGradient: 'linear-gradient(180deg, #13241b 0%, #0a140f 100%)',
        icon: '🎭',
        image: 'outputs/mask_tuong_transparent.png',
        itemLabel: 'CỔ VẬT MẶT NẠ SONG DIỆN 1930 & LỆNH BÀI HỢP NHẤT',
        summary: 'Thân gánh vạn hỏa kiếp — Tâm chiếu nhất phiến đan. Khúc ca hòa giải giữa lịch sử và hiện tại.',
        content: `
          An trân trọng đặt chiếc <b>Mặt Nạ Song Diện 1930</b> đã được phục hồi nguyên vẹn lên <b>Trụ Kính Bệ Xoay 360°</b> chính giữa Đại Sảnh, đặt cạnh Di Thư Lụa Cổ Đô. Bác Cảnh tháo mảnh đồng « Thần Lực » khỏi thắt lưng, đặt vào mảnh « Hộ Quốc » trong tay An. Hai mép gãy khớp nhau thành lệnh bài <b>« HỘ QUỐC THẦN LỰC »</b>.<br><br>
          Bệ xoay từ từ chuyển động dưới hai luồng ánh sáng giao thoa: Nửa Đỏ trừng trừng chính khí song hành cùng Nửa Trắng bi thương đẫm lệ, làm sáng tỏ trọn vẹn sự thật về cuộc đánh đổi đau đớn để bảo vệ những mầm sống tương lai.<br><br>
          Bác Cảnh đứng cạnh An, đôi mắt nhạt nhòa ngấn lệ nhưng gương mặt rạng rỡ niềm an ủi thanh thản. Đặt bàn tay run rẩy lên vai An, ông cụ trân trọng trao lại chiếc chìa khóa cổ của bảo tàng cho chàng trai trẻ: <i>« Cậu An... Cậu không chỉ phục chế một pho mặt nạ, mà đã giải tỏa nỗi oan khiên gần trăm năm của tiền nhân gánh hát Tiên Sư. Từ nay, gánh nặng giữ gìn di sản này xin an tâm trao lại cho thế hệ các cháu... »</i><br><br>
          Ngoài hiên, cơn mưa rào đêm đã tạnh hẳn. Những tia nắng sớm rọi qua khung cửa vòm, mang theo tiếng đàn nhị ngân vang trong trẻo từ căn gác mái xưa — khúc ca hòa giải giữa bi thương và hào khí ngân dài đón chào ngày mới.
        `
      }
    };

    const ed = endingData[endingId] || endingData[3];

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal" style="max-width: 660px; border-color: ${ed.borderColor}; box-shadow: 0 0 35px ${ed.glowColor};">
        <div class="f2-header" style="border-bottom-color: ${ed.borderColor};">
          <h3>${ed.title}</h3>
          <button class="f2-btn-close" id="btnEndingClose" title="Đóng [ESC]">✕</button>
        </div>
        <div style="padding: 22px; display: flex; flex-direction: column; gap: 14px; background: ${ed.bgGradient};">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
            <span style="background: rgba(0,0,0,0.5); border: 1px solid ${ed.borderColor}; color: ${ed.borderColor}; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 4px;">${ed.badge}</span>
            <span style="font-size: 28px;">${ed.icon}</span>
          </div>

          <div style="display: flex; gap: 14px; align-items: center; background: rgba(0,0,0,0.45); border-radius: 6px; padding: 10px 14px; border: 1px solid ${ed.borderColor}; box-shadow: inset 0 0 15px rgba(0,0,0,0.6);">
            <img src="${ed.image}" style="width: 52px; height: 58px; object-fit: contain; filter: drop-shadow(0 0 8px ${ed.glowColor});" alt="${ed.itemLabel}" />
            <div>
              <div style="color: ${ed.borderColor}; font-size: 13px; font-weight: bold; margin-bottom: 2px;">${ed.itemLabel}</div>
              <div style="font-size: 11.5px; color: #d0c8b8;">${ed.summary}</div>
            </div>
          </div>

          <div style="font-size: 12.5px; line-height: 1.75; color: #f5ecc9; background: rgba(0,0,0,0.35); border-radius: 6px; padding: 14px 16px; border-left: 4px solid ${ed.borderColor};">
            ${ed.content}
          </div>

          <div style="background: rgba(255,255,255,0.04); border-radius: 6px; padding: 12px 16px; font-size: 12px; color: #aba291; display: flex; justify-content: space-between; align-items: center;">
            <span>🏛️ <b>Dự án:</b> HỌA DIỆN (The Dual Mask)</span>
            <span style="color: #ecc554;">★ HOÀN THÀNH HÀNH TRÌNH ĐÊM TRỰC BẢO TÀNG</span>
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-primary" id="btnEndingOk" style="background: ${ed.borderColor}; color: #1a1005; font-weight: bold;">
            Chiêm Ngưỡng & Tiếp Tục Khám Phá Bảo Tàng
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) requestClose();
    });

    let isFinished = false;
    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      closeModal();
      if (window.GameEngine && typeof window.GameEngine.showToast === 'function') {
        window.GameEngine.showToast(`★ ĐÃ MỞ KHÓA: ${ed.badge}!`);
      }
      if (onFinish) onFinish();
    };
    currentContextualClose = finish;

    const btnClose = document.getElementById('btnEndingClose');
    if (btnClose) btnClose.onclick = requestClose;

    const btnOk = document.getElementById('btnEndingOk');
    if (btnOk) btnOk.onclick = requestClose;
  }

  return {
    isActive: () => !!activeModal,
    closeModal,
    requestClose,
    openDrumRhythmModal,
    openTuongScriptModal,
    openSecretAtticModal,
    openEndingModal,
    openPlacementModal
  };
})();
