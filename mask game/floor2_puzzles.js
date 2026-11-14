// HỌA DIỆN (The Dual Mask) - Tầng 2: Thư Khố & Phòng Tối Tráng Ảnh
// Module giải đố 3 giai đoạn:
// 1. Tủ kính Sắc phong Triều Nguyễn & Hòm sắt thợ ảnh Pháp (Mã 1930)
// 2. Nhận diện 3 lọ hóa chất bằng khứu giác & xúc giác
// 3. Mini-game tráng phim kẹp tre canh nhịp đồng hồ & Xô nước fail-safe

window.Floor2Puzzles = (function () {
  let activeModal = null;
  let activeTimerInterval = null;
  const pendingTimers = new Set();
  function later(fn, ms) {
    const owner = activeModal;
    const id = setTimeout(() => {
      pendingTimers.delete(id);
      if (activeModal === owner) fn();
    }, ms);
    pendingTimers.add(id);
    return id;
  }

  function isOpen() {
    return activeModal !== null;
  }

  function isActive() {
    return isOpen();
  }

  function closeModal() {
    pendingTimers.forEach(clearTimeout);
    pendingTimers.clear();
    if (activeTimerInterval) {
      clearInterval(activeTimerInterval);
      activeTimerInterval = null;
    }
    if (activeModal && activeModal.parentNode) {
      activeModal.parentNode.removeChild(activeModal);
    }
    activeModal = null;
    if (window.GameAudio) window.GameAudio.journalClose();
  }

  // Modal keyboard capture to prevent background movement & leakage
  window.addEventListener('keydown', (e) => {
    if (isActive()) {
      if (e.key === 'Escape' || e.code === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const photoConfirm = activeModal.querySelector('#btnPhotoConfirm');
        if (photoConfirm) photoConfirm.click();
        else closeModal();
        return;
      }
      if (['KeyA', 'KeyD', 'KeyE', 'Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }
  }, true);

  // ----------------------------------------------------
  // GIAI ĐOẠN 1: MODAL TỦ KÍNH SẮC PHONG TRIỀU NGUYỄN
  // ----------------------------------------------------
  function openRoyalEdictModal(onClose) {
    closeModal();
    if (window.GameAudio) window.GameAudio.journalOpen();

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal f2-edict-modal">
        <div class="f2-header">
          <h3>📜 BẢN SẮC PHONG TRIỀU NGUYỄN — TỦ KÍNH THƯ KHỐ</h3>
          <button class="f2-btn-close" id="btnEdictClose" title="Đóng [ESC]">✕</button>
        </div>
        <div class="f2-edict-body">
          <div class="f2-real-img-frame" style="max-height: 230px;">
            <img src="assets/floor2/sac_phong_trieu_nguyen.png" alt="Sắc phong triều Nguyễn" class="f2-real-img" />
          </div>
          <div class="f2-scroll-frame" style="padding: 12px 16px;">
            <div class="f2-scroll-text">
              <h4 class="f2-scroll-title" style="margin-bottom:6px;">BẢN DỊCH HÁN NÔM — SẮC MỆNH TRUY TẶNG</h4>
              <p class="f2-verse" style="font-size:12px; line-height:1.5;">
                <i>"Khâm thử Hoàng đế sắc tứ:</i> Xét gương <b>Tiết Nghĩa Trung Thần họ Vũ</b>,
                Chưởng Vệ Quân họ Vũ: Tận trung báo quốc, tử thủ thành trì, thân hóa tro tàn bảo toàn xã tắc.<br>
                Xảy trận đại hỏa hoạn năm <b>Canh Ngọ</b>, dũng liệt hy sinh, lòng son vẹn tiết!<br>
                Nay ban sắc chỉ ngợi ca, đời đời thờ phụng nơi Thư khố Tiên Sư."
              </p>
              <div class="f2-seals-bottom" style="margin-top:8px;">
                <span class="f2-red-seal">Ngự Tiền Chi Bảo</span>
                <span class="f2-date">Bảo Đại Năm Thứ 5 (Năm Canh Ngọ) — Khâm Định</span>
              </div>
            </div>
          </div>
          <div class="f2-clue-box">
            <span class="f2-clue-icon">💡</span>
            <div class="f2-clue-desc">
              <b>Dữ kiện trinh thám đã nạp vào Sổ Tay [TAB]:</b><br>
              • <code>[Tướng họ Vũ: Trung thần ái quốc]</code><br>
              • <code>[Năm Canh Ngọ: Đại Hỏa Hoạn]</code> (Niên hiệu Bảo Đại năm thứ 5 — thời điểm đống tro tàn lớn)
            </div>
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-primary" id="btnEdictConfirm">Đã ghi nhớ vào Sổ tay [ESC]</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    // Record clues into world state
    if (window.GameEngine && window.GameEngine.world && window.GameEngine.world.floor2) {
      window.GameEngine.world.floor2.readRoyalEdict = true;
    }
    if (window.DeductionJournal && window.DeductionJournal.addKeyword) {
      window.DeductionJournal.addKeyword('[Tướng họ Vũ: Trung thần ái quốc]');
      window.DeductionJournal.addKeyword('[Năm Canh Ngọ: Đại Hỏa Hoạn]');
    }
    if (window.GameAudio) window.GameAudio.clueDiscovered();

    const finish = () => {
      closeModal();
      if (onClose) onClose();
    };

    document.getElementById('btnEdictClose').onclick = finish;
    document.getElementById('btnEdictConfirm').onclick = finish;
    overlay.onclick = (e) => {
      if (e.target === overlay) finish();
    };
  }

  // ----------------------------------------------------
  // GIAI ĐOẠN 1: MODAL HÒM SẮT THỢ ẢNH PHÁP (MÃ 1930)
  // ----------------------------------------------------
  function openFrenchChestModal(onSuccess) {
    closeModal();
    if (window.GameAudio) window.GameAudio.journalOpen();

    const world = window.GameEngine ? window.GameEngine.world : null;
    let digits = [0, 0, 0, 0];

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal f2-chest-modal">
        <div class="f2-header">
          <h3>🔐 HÒM SẮT CỦA THỢ ẢNH PHÁP</h3>
          <button class="f2-btn-close" id="btnChestClose" title="Đóng [ESC]">✕</button>
        </div>
        <div class="f2-chest-body">
          <div class="f2-real-img-frame" style="max-height: 220px;">
            <img src="assets/floor2/hom_sat_phap.png" alt="Hòm sắt thợ ảnh Pháp" class="f2-real-img" />
          </div>

          <div class="f2-chest-lid" style="padding: 8px 14px;">
            <div class="f2-french-inscription" style="font-size:16px;">
              « L’année de la grande cendre »
            </div>
            <div class="f2-lid-subtext">(Khắc trên thân hòm: "Năm của đống tro tàn lớn")</div>
            <div style="margin-top:6px; padding:8px; border:1px solid #9a742b; font-size:11px; color:#f3dcb1;">
              📏 <b>Thước Đo Niên Biểu Can Chi</b>: <code>Mậu Thìn (1928) ➔ Kỷ Tỵ (1929) ➔ Canh Ngọ [?]</code>
            </div>
          </div>

          <div class="f2-lock-container" style="padding: 10px 18px;">
            <div class="f2-lock-plate">
              <div class="f2-lock-rim"></div>
              <div class="f2-dials-row">
                ${[0, 1, 2, 3].map(i => `
                  <div class="f2-dial-col" data-dial="${i}" title="Lăn chuột hoặc bấm nút để đổi số">
                    <button class="f2-dial-btn" data-dial="${i}" data-dir="up">▲</button>
                    <div class="f2-dial-display" id="f2DialVal${i}" data-dial="${i}" style="cursor:pointer;" title="Click để tăng số">0</div>
                    <button class="f2-dial-btn" data-dial="${i}" data-dir="down">▼</button>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="f2-chest-status" id="f2ChestStatus">
            Nhập 4 chữ số năm xảy ra đại hỏa hoạn để mở chốt khóa cơ...
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-secondary" id="btnChestHint">Xem Gợi Ý</button>
          <button class="f2-btn-primary" id="btnChestUnlock">Gạt Cần Mở Khóa</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    function updateDials() {
      for (let i = 0; i < 4; i++) {
        const el = document.getElementById(`f2DialVal${i}`);
        if (el) el.textContent = digits[i];
      }
    }

    // Dial button clicks
    overlay.querySelectorAll('.f2-dial-btn').forEach(btn => {
      btn.onclick = () => {
        const d = parseInt(btn.dataset.dial);
        const dir = btn.dataset.dir;
        if (dir === 'up') {
          digits[d] = (digits[d] + 1) % 10;
        } else {
          digits[d] = (digits[d] + 9) % 10;
        }
        if (window.GameAudio) window.GameAudio.dialClick();
        updateDials();
      };
    });

    // Dial display direct click to advance digit
    overlay.querySelectorAll('.f2-dial-display').forEach(disp => {
      disp.onclick = () => {
        const d = parseInt(disp.dataset.dial);
        digits[d] = (digits[d] + 1) % 10;
        if (window.GameAudio) window.GameAudio.dialClick();
        updateDials();
      };
    });

    // Mouse wheel support on dials
    overlay.querySelectorAll('.f2-dial-col').forEach(col => {
      col.addEventListener('wheel', (e) => {
        e.preventDefault();
        const d = parseInt(col.dataset.dial);
        if (e.deltaY < 0) {
          digits[d] = (digits[d] + 1) % 10;
        } else {
          digits[d] = (digits[d] + 9) % 10;
        }
        if (window.GameAudio) window.GameAudio.dialClick();
        updateDials();
      });
    });

    document.getElementById('btnChestHint').onclick = () => {
      const statusEl = document.getElementById('f2ChestStatus');
      if (world && world.floor2 && world.floor2.readRoyalEdict) {
        statusEl.innerHTML = `<span style="color:#ecc554">💡 <b>Gợi ý suy luận:</b> Sắc phong trong tủ kính ghi biến cố đống tro tàn lớn xảy ra vào <b>Năm Canh Ngọ (Bảo Đại năm thứ 5)</b>. Hãy đối chiếu chuỗi Can Chi trên thước đo đồng (1928 ➔ 1929 ➔ Canh Ngọ) để suy ra 4 chữ số mở khóa!</span>`;
      } else {
        statusEl.innerHTML = `<span style="color:#aba291">💡 Hãy soi tủ kính Sắc phong Triều Nguyễn ở gian giữa để tìm niên hiệu Can Chi của năm xảy ra trận đại hỏa hoạn.</span>`;
      }
    };

    document.getElementById('btnChestUnlock').onclick = () => {
      const code = digits.join('');
      const statusEl = document.getElementById('f2ChestStatus');

      if (code === '1930') {
        if (window.GameAudio) window.GameAudio.chestOpen();
        statusEl.innerHTML = `<span style="color:#58d68d">✓ TÁCH! Chốt sắt bật mở thành công!</span>`;

        if (world && world.floor2) {
          world.floor2.frenchChestUnlocked = true;
          world.floor2.hasRawGlassFilm = true;
          world.floor2.hasPhotoNotebook = true;
          world.floor2.darkroomCurtainOpen = true;
        }

        later(() => {
          closeModal();
          // Call onSuccess callback directly if provided by game.js; fallback to showChestLootModal()
          if (typeof onSuccess === 'function') {
            onSuccess();
          } else {
            showChestLootModal();
          }
        }, 700);
      } else {
        if (window.GameAudio) window.GameAudio.drumCac();
        statusEl.innerHTML = `<span style="color:#d9463e">✗ Ổ khóa kẹt cứng! Mã số ${code} không chính xác.</span>`;
      }
    };

    document.getElementById('btnChestClose').onclick = closeModal;
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };
  }

  function showChestLootModal(onComplete) {
    closeModal();
    if (window.GameAudio) window.GameAudio.clueDiscovered();

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal f2-loot-modal">
        <div class="f2-header">
          <h3>📦 VẬT PHẨM TRONG HÒM SẮT</h3>
          <button class="f2-btn-close" id="btnLootClose" title="Đóng [ESC]">✕</button>
        </div>
        <div class="f2-loot-body">
          <div class="f2-loot-item">
            <div class="f2-item-icon">🎞️</div>
            <div class="f2-item-info">
              <h4>Tấm Phim Kính Đen Trắng 1930</h4>
              <p>Mặt kính đục ngầu, xước xát, phủ bạc halogenua chưa qua thuốc hãm. Cần mang vào <b>Phòng Tối</b> để tráng mới hiện rõ hình ảnh.</p>
            </div>
          </div>
          <div class="f2-loot-item">
            <div class="f2-item-icon">📓</div>
            <div class="f2-item-info">
              <h4>Mẩu Sổ Tay Thợ Ảnh Pháp</h4>
              <p><i>"Thời chiến nhãn mác trôi sạch, phải dùng ngũ giác mà phân:<br>
              • <b>Thuốc Hiện (Developer)</b>: Nồng nặc mùi lưu huỳnh trứng thối.<br>
              • <b>Thuốc Dừng (Stop Bath)</b>: Mùi chua gắt xộc mũi như giấm thanh.<br>
              • <b>Thuốc Hãm (Fixer)</b>: Không mùi, miết ngón tay thấy trơn nhớt như mỡ cá."</i></p>
            </div>
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-primary" id="btnLootConfirm">Cất Vào Túi & Vào Phòng Tối [ESC]</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    const finish = () => {
      closeModal();
      if (window.GameEngine && window.GameEngine.showToast) {
        window.GameEngine.showToast('Đã nhận: Tấm Phim Kính 1930 & Sổ Tay Thợ Ảnh!');
      }
      if (onComplete) onComplete();
    };

    document.getElementById('btnLootClose').onclick = finish;
    document.getElementById('btnLootConfirm').onclick = finish;
    overlay.onclick = (e) => {
      if (e.target === overlay) finish();
    };
  }

  // ----------------------------------------------------
  // GIAI ĐOẠN 2: MODAL NHẬN DIỆN 3 LỌ HÓA CHẤT (A, B, C)
  // ----------------------------------------------------
  function openChemicalInspectionModal(onFinish) {
    closeModal();
    if (window.GameAudio) window.GameAudio.journalOpen();

    const world = window.GameEngine ? window.GameEngine.world : null;
    // Internal tracking object for each chemical bottle
    const identified = {
      A: world && world.floor2 && world.floor2.identifiedChemicals === true,
      B: world && world.floor2 && world.floor2.identifiedChemicals === true,
      C: world && world.floor2 && world.floor2.identifiedChemicals === true
    };

    let inspectionLog = "Chọn một lọ hóa chất và dùng giác quan (Khứu giác / Xúc giác) để nhận diện...";

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal f2-chem-modal">
        <div class="f2-header">
          <h3>🧪 NHẬN DIỆN 3 LỌ HÓA CHẤT TRONG PHÒNG TỐI</h3>
          <button class="f2-btn-close" id="btnChemClose" title="Đóng [ESC]">✕</button>
        </div>
        <div class="f2-chem-body">
          <div class="f2-real-img-frame" style="max-height: 220px;">
            <img src="assets/floor2/3_lo_hoa_chat.png" alt="3 Lọ Hóa Chất Phòng Tối" class="f2-real-img" />
          </div>
          <div class="f2-bottles-rack">
            <!-- Lọ A -->
            <div class="f2-bottle-card" id="cardBottleA">
              <div class="f2-bottle-art bottle-a" style="height:45px;">
                <span class="f2-bottle-tag">LỌ A</span>
              </div>
              <div class="f2-bottle-actions">
                <button class="f2-btn-sense" data-bot="A" data-act="smell">👃 Ngửi mùi</button>
                <button class="f2-btn-sense" data-bot="A" data-act="touch">✋ Miết tay</button>
              </div>
              <div class="f2-bottle-deduce" id="deduceA">${identified.A ? '<b style="color:#58d68d">THUỐC DỪNG</b>' : 'Chưa nhận diện'}</div>
            </div>

            <!-- Lọ B -->
            <div class="f2-bottle-card" id="cardBottleB">
              <div class="f2-bottle-art bottle-b" style="height:45px;">
                <span class="f2-bottle-tag">LỌ B</span>
              </div>
              <div class="f2-bottle-actions">
                <button class="f2-btn-sense" data-bot="B" data-act="smell">👃 Ngửi mùi</button>
                <button class="f2-btn-sense" data-bot="B" data-act="touch">✋ Miết tay</button>
              </div>
              <div class="f2-bottle-deduce" id="deduceB">${identified.B ? '<b style="color:#ecc554">THUỐC HIỆN HÌNH</b>' : 'Chưa nhận diện'}</div>
            </div>

            <!-- Lọ C -->
            <div class="f2-bottle-card" id="cardBottleC">
              <div class="f2-bottle-art bottle-c" style="height:45px;">
                <span class="f2-bottle-tag">LỌ C</span>
              </div>
              <div class="f2-bottle-actions">
                <button class="f2-btn-sense" data-bot="C" data-act="smell">👃 Ngửi mùi</button>
                <button class="f2-btn-sense" data-bot="C" data-act="touch">✋ Miết tay</button>
              </div>
              <div class="f2-bottle-deduce" id="deduceC">${identified.C ? '<b style="color:#5dade2">THUỐC HÃM</b>' : 'Chưa nhận diện'}</div>
            </div>
          </div>

          <div class="f2-chem-log" id="chemLogBox">
            ${inspectionLog}
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-secondary" id="btnOpenNotebookHint">📖 Tra Sổ Tay Thợ Ảnh</button>
          <button class="f2-btn-primary" id="btnProceedToTrays">Sang Bàn Tráng Phim (3 Khay) ➔</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    const logBox = document.getElementById('chemLogBox');

    function checkAllIdentified() {
      if (identified.A && identified.B && identified.C) {
        if (world && world.floor2) {
          world.floor2.identifiedChemicals = true;
        }
        logBox.innerHTML += `<br><span style="color:#58d68d; font-weight:bold;">★ ĐÃ NHẬN DIỆN ĐỦ 3 LỌ! Có thể tiến hành tráng phim ngay.</span>`;
        if (window.GameAudio) window.GameAudio.clueDiscovered();
      }
    }

    overlay.querySelectorAll('.f2-btn-sense').forEach(btn => {
      btn.onclick = () => {
        const bot = btn.dataset.bot;
        const act = btn.dataset.act;
        if (window.GameAudio) window.GameAudio.liquidPour();

        if (bot === 'A') {
          if (act === 'smell') {
            logBox.innerHTML = `<b>Lọ A (Ngửi):</b> Mùi chua gắt xộc thẳng lên mũi, đúng là giấm thanh pha loãng.<br><span style="color:#58d68d">➔ Kết luận: Lọ A là THUỐC DỪNG (Stop Bath)</span>`;
            document.getElementById('deduceA').innerHTML = `<b style="color:#58d68d">THUỐC DỪNG</b>`;
            identified.A = true;
            checkAllIdentified();
          } else {
            logBox.innerHTML = `<b>Lọ A (Miết tay):</b> Chất lỏng loãng như nước giấm, miết vào hơi châm chích nhẹ đầu ngón tay.`;
          }
        } else if (bot === 'B') {
          if (act === 'smell') {
            logBox.innerHTML = `<b>Lọ B (Ngửi):</b> Mùi hôi khét lẹt nồng nặc của bột lưu huỳnh và trứng ung bốc lên sực nức.<br><span style="color:#ecc554">➔ Kết luận: Lọ B là THUỐC HIỆN HÌNH (Developer)</span>`;
            document.getElementById('deduceB').innerHTML = `<b style="color:#ecc554">THUỐC HIỆN HÌNH</b>`;
            identified.B = true;
            checkAllIdentified();
          } else {
            logBox.innerHTML = `<b>Lọ B (Miết tay):</b> Nước có độ ấm nhẹ và cợn li ti của bột lưu huỳnh.`;
          }
        } else if (bot === 'C') {
          if (act === 'smell') {
            logBox.innerHTML = `<b>Lọ C (Ngửi):</b> Chất lỏng trong vắt, hoàn toàn không có mùi gì bốc lên.`;
          } else {
            logBox.innerHTML = `<b>Lọ C (Miết tay):</b> Nhỏ ra ngón tay miết thử thấy trơn tuột, nhớt dính như mỡ cá biển.<br><span style="color:#5dade2">➔ Kết luận: Lọ C là THUỐC HÃM (Fixer)</span>`;
            document.getElementById('deduceC').innerHTML = `<b style="color:#5dade2">THUỐC HÃM</b>`;
            identified.C = true;
            checkAllIdentified();
          }
        }
      };
    });

    document.getElementById('btnOpenNotebookHint').onclick = () => {
      logBox.innerHTML = `<b>Trích sổ tay thợ ảnh:</b><br>
      • Thuốc hiện: Mùi lưu huỳnh khét trứng thối.<br>
      • Thuốc dừng: Mùi giấm thanh chua gắt.<br>
      • Thuốc hãm: Không mùi, trơn nhớt như mỡ cá.`;
    };

    document.getElementById('btnProceedToTrays').onclick = () => {
      closeModal();
      if (identified.A && identified.B && identified.C && world && world.floor2) {
        world.floor2.identifiedChemicals = true;
      }
      openDarkroomTraysModal(onFinish);
    };

    const finish = () => {
      closeModal();
      if (identified.A && identified.B && identified.C && typeof onFinish === 'function') {
        onFinish();
      }
    };

    document.getElementById('btnChemClose').onclick = finish;
    overlay.onclick = (e) => {
      if (e.target === overlay) finish();
    };
  }

  // ----------------------------------------------------
  // GIAI ĐOẠN 3: MINI-GAME TRÁNG PHIM CANH NHỊP (RED SAFELIGHT)
  // ----------------------------------------------------
  function openDarkroomTraysModal(onSuccess) {
    closeModal();
    if (window.GameAudio) window.GameAudio.journalOpen();

    const world = window.GameEngine ? window.GameEngine.world : null;
    let poured = { 1: null, 2: null, 3: null }; // 1: B (Hiện), 2: A (Dừng), 3: C (Hãm)
    let selectedBottle = null;

    // Developing simulation states
    let stage = 0; // 0: chưa ngâm, 1: đang khay 1, 2: khay 2, 3: khay 3, 4: xong
    let timerVal = 0;
    let timerInterval = null;
    let filmQuality = 'raw'; // raw, under, perfect, burned, fixed

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay darkroom-safe-overlay';
    overlay.innerHTML = `
      <div class="f2-modal f2-darkroom-modal">
        <div class="f2-darkroom-lamp">
          <div class="f2-lamp-glow"></div>
          <span class="f2-safelight-tag">🔴 ĐÈN PHÒNG TỐI (RED SAFELIGHT) — KHÔNG ĐƯỢC BẬT ĐÈN TRẮNG</span>
        </div>

        <div class="f2-header">
          <h3>🎞️ BÀN TRÁNG PHIM THỦ CÔNG — KẸP TRE & 3 KHAY MEN</h3>
          <button class="f2-btn-close" id="btnDarkClose" title="Đóng [ESC]">✕</button>
        </div>

        <div class="f2-darkroom-body">
          <div class="f2-real-img-frame" style="max-height: 190px;">
            <img src="assets/floor2/ban_trang_phim.png" alt="Bàn Tráng Phim Phòng Tối" class="f2-real-img" />
          </div>

          <!-- Hóa chất rót vào khay -->
          <div class="f2-pour-section" id="f2PourSection">
            <div class="f2-section-desc">
              Bước 1: Chọn lọ hóa chất bên dưới và đổ vào đúng khay men (Quy trình: <b>Hiện hình ➔ Dừng ➔ Hãm</b>):
            </div>
            <div class="f2-bottles-picker">
              <button class="f2-btn-bottle" data-bot="A" id="btnPickA">Lọ A (Dừng giấm)</button>
              <button class="f2-btn-bottle" data-bot="B" id="btnPickB">Lọ B (Hiện hình)</button>
              <button class="f2-btn-bottle" data-bot="C" id="btnPickC">Lọ C (Hãm nhớt)</button>
            </div>
          </div>

          <!-- 3 Khay Men với trực tiếp tương tác click -->
          <div class="f2-trays-container">
            <!-- Khay 1 -->
            <div class="f2-tray-box" id="trayBox1" data-tray="1" title="Click để rót hoặc nhúng/nhấc phim">
              <div class="f2-tray-label">KHAY 1 (HIỆN HÌNH)</div>
              <div class="f2-tray-liquid" id="trayLiquid1">Trống</div>
              <div class="f2-film-slot" id="slotTray1"></div>
            </div>

            <!-- Khay 2 -->
            <div class="f2-tray-box" id="trayBox2" data-tray="2" title="Click để rót hoặc nhúng phim">
              <div class="f2-tray-label">KHAY 2 (DỪNG PHẢN ỨNG)</div>
              <div class="f2-tray-liquid" id="trayLiquid2">Trống</div>
              <div class="f2-film-slot" id="slotTray2"></div>
            </div>

            <!-- Khay 3 -->
            <div class="f2-tray-box" id="trayBox3" data-tray="3" title="Click để rót hoặc nhúng khóa nét">
              <div class="f2-tray-label">KHAY 3 (HÃM KHÓA NÉT)</div>
              <div class="f2-tray-liquid" id="trayLiquid3">Trống</div>
              <div class="f2-film-slot" id="slotTray3"></div>
            </div>
          </div>

          <!-- Cây kẹp tre & Tấm phim kính -->
          <div class="f2-tongs-bench">
            <div class="f2-tongs-visual">
              <div class="f2-film-preview" id="filmGraphic">
                <div class="f2-film-glass" id="filmGlassInner">
                  <span id="filmStatusText">Tấm phim đục ngầu</span>
                </div>
              </div>
            </div>
            <div class="f2-clock-indicator" id="clockIndicator">
              <div class="f2-clock-pendulum" id="pendulum"></div>
              <div class="f2-clock-time" id="clockTime">0s</div>
              <div class="f2-clock-note">Nhịp đồng hồ: Cắc... tùng... cắc... tùng...</div>
            </div>
          </div>

          <!-- Khu vực tương tác hành động -->
          <div class="f2-actions-bar" id="f2ActionsBar">
            <div class="f2-msg-banner" id="darkroomMsg">
              Hãy rót đủ 3 lọ hóa chất vào 3 khay theo đúng quy trình nhiếp ảnh cổ điển.
            </div>
            <div class="f2-btn-group" id="darkroomControls">
              <!-- Render dynamically -->
            </div>
          </div>
        </div>

        <div class="f2-footer">
          <button class="f2-btn-danger" id="btnWaterReset">🪣 Nhúng Xô Nước Rửa Lại Phim [Làm Lại]</button>
          <button class="f2-btn-secondary" id="btnDarkroomExit">Tạm Thoát [ESC]</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    // Bottle picker logic
    overlay.querySelectorAll('.f2-btn-bottle').forEach(btn => {
      btn.onclick = () => {
        overlay.querySelectorAll('.f2-btn-bottle').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedBottle = btn.dataset.bot;
        document.getElementById('darkroomMsg').innerHTML = `Đang cầm <b>Lọ ${selectedBottle}</b>. Bấm vào một khay men để rót vào.`;
      };
    });

    // Direct Tray Click Handling (both for pouring chemical & dipping film)
    overlay.querySelectorAll('.f2-tray-box').forEach(trayEl => {
      trayEl.onclick = () => {
        const t = parseInt(trayEl.dataset.tray);

        // If pouring phase:
        if (!poured[1] || !poured[2] || !poured[3] || poured[1] !== 'B' || poured[2] !== 'A' || poured[3] !== 'C') {
          if (!selectedBottle) {
            document.getElementById('darkroomMsg').innerHTML = `Hãy chọn một lọ thuốc ở trên trước khi rót vào khay!`;
            return;
          }

          poured[t] = selectedBottle;
          if (window.GameAudio) window.GameAudio.liquidPour();

          const liqEl = document.getElementById(`trayLiquid${t}`);
          const bottleNames = {
            'B': 'Thuốc Hiện (Lọ B)',
            'A': 'Thuốc Dừng (Lọ A)',
            'C': 'Thuốc Hãm (Lọ C)'
          };
          liqEl.innerHTML = `<span style="color:#ecc554">${bottleNames[selectedBottle] || selectedBottle}</span>`;
          liqEl.classList.add('filled');

          checkTraysReady();
          return;
        }

        // Developing phase direct tray clicks:
        if (t === 1) {
          if (stage === 0) {
            startDevelopingTray1();
          } else if (stage === 1) {
            stopDevelopingTray1();
          }
        } else if (t === 2) {
          if (stage === 1 && filmQuality === 'perfect') {
            startDevelopingTray2();
          }
        } else if (t === 3) {
          if (stage === 2) {
            startDevelopingTray3();
          }
        }
      };
    });

    function checkTraysReady() {
      if (poured[1] && poured[2] && poured[3]) {
        // Correct sequence: Khay 1 = B (Hiện), Khay 2 = A (Dừng), Khay 3 = C (Hãm)
        if (poured[1] === 'B' && poured[2] === 'A' && poured[3] === 'C') {
          document.getElementById('f2PourSection').style.display = 'none';
          document.getElementById('darkroomMsg').innerHTML = `<b>3 khay thuốc đã chuẩn bị hoàn hảo!</b> Bấm nút hoặc click trực tiếp vào <b>Khay 1 (Hiện hình)</b> trong đúng <b>5 nhịp (5 giây)</b>.`;
          renderTray1Controls();
        } else {
          if (window.GameAudio) window.GameAudio.drumCac();
          document.getElementById('darkroomMsg').innerHTML = `<span style="color:#d9463e"><b>Thứ tự rót hóa chất bị sai!</b> Quy trình chuẩn: Khay 1 (Hiện hình - B) ➔ Khay 2 (Dừng - A) ➔ Khay 3 (Hãm - C). Hãy bấm <b>[Làm Lại]</b> để đổ lại.</span>`;
        }
      }
    }

    // Controls for Tray 1 (Developer - 5s)
    function renderTray1Controls() {
      const controls = document.getElementById('darkroomControls');
      controls.innerHTML = `
        <button class="f2-btn-primary" id="btnDipTray1">🥢 Nhúng Phim Vào Khay 1 (Hiện Hình)</button>
      `;

      document.getElementById('btnDipTray1').onclick = () => {
        startDevelopingTray1();
      };
    }

    function startDevelopingTray1() {
      stage = 1;
      timerVal = 0;
      if (window.GameAudio) window.GameAudio.waterSplash();

      const filmInner = document.getElementById('filmGlassInner');
      const statusText = document.getElementById('filmStatusText');
      const clockTime = document.getElementById('clockTime');
      const controls = document.getElementById('darkroomControls');
      const pendulum = document.getElementById('pendulum');

      controls.innerHTML = `
        <button class="f2-btn-danger" id="btnLiftTray1">🥢 Nhấc Kẹp Tre Lên (Dừng Ngâm Khay 1)</button>
      `;

      document.getElementById('btnLiftTray1').onclick = () => {
        stopDevelopingTray1();
      };

      if (activeTimerInterval) clearInterval(activeTimerInterval);
      timerInterval = setInterval(() => {
        timerVal++;
        clockTime.textContent = `${timerVal}s`;
        if (pendulum) pendulum.classList.toggle('tick');
        if (window.GameAudio) window.GameAudio.darkroomTick(timerVal % 2 === 0);

        // Visual change of film developing under red safelight
        if (timerVal <= 3) {
          filmInner.style.backgroundColor = 'rgba(70, 50, 40, 0.7)';
          statusText.textContent = `Mờ nhạt (${timerVal}s)...`;
          if (timerVal === 1) document.getElementById('darkroomMsg').innerHTML = `<i>"Doucement... Chậm thôi chàng thợ mộc..."</i> — Tiếng thì thầm của Pierre Nguyễn như vọng bên tai. Hãy đợi đến <b>4–6 giây</b>!`;
        } else if (timerVal >= 4 && timerVal <= 6) {
          filmInner.style.backgroundColor = 'rgba(190, 130, 90, 0.9)';
          statusText.innerHTML = `<b style="color:#58d68d">Nổi rõ nét (${timerVal}s)! Nhấc ngay!</b>`;
        } else if (timerVal > 6) {
          filmInner.style.backgroundColor = 'rgba(20, 15, 18, 0.98)';
          statusText.innerHTML = `<b style="color:#d9463e">CHÁY ĐEN (${timerVal}s)! Hỏng phim!</b>`;
        }
      }, 1000);
      activeTimerInterval = timerInterval;
    }

    function stopDevelopingTray1() {
      if (timerInterval) clearInterval(timerInterval);
      activeTimerInterval = null;

      const clockTime = document.getElementById('clockTime');
      const statusText = document.getElementById('filmStatusText');
      const filmInner = document.getElementById('filmGlassInner');
      const controls = document.getElementById('darkroomControls');

      if (timerVal < 4) {
        filmQuality = 'under';
        if (window.GameAudio) window.GameAudio.drumCac();
        document.getElementById('darkroomMsg').innerHTML = `<span style="color:#d9463e"><b>Nhấc ra quá sớm (${timerVal}s)!</b> Phim chưa đủ thời gian phản ứng, hình ảnh mờ căm. Hãy bấm <b>[Làm Lại]</b> để rửa phim tráng lại.</span>`;
        controls.innerHTML = ``;
      } else if (timerVal > 6) {
        filmQuality = 'burned';
        if (window.GameAudio) window.GameAudio.filmBurned();
        document.getElementById('darkroomMsg').innerHTML = `<span style="color:#d9463e"><b>Ngâm quá lâu (${timerVal}s)!</b> Thuốc ngấm quá độ, phim đã cháy đen thui. Hãy bấm <b>[Làm Lại]</b> bằng xô nước sạch để rửa lại bản gốc.</span>`;
        controls.innerHTML = ``;
      } else {
        // Perfect 4..6s
        filmQuality = 'perfect';
        if (window.GameAudio) window.GameAudio.drumTung();
        document.getElementById('darkroomMsg').innerHTML = `<span style="color:#58d68d"><b>Rất chuẩn xác (${timerVal}s)!</b> Hình ảnh làng cháy và gánh hát đã nổi lên rõ ràng. Mau nhúng sang <b>Khay 2 (Thuốc Dừng)</b> trong <b>2 giây</b> để ngắt phản ứng hóa học!</span>`;
        renderTray2Controls();
      }
    }

    // Controls for Tray 2 (Stop Bath - 2s)
    function renderTray2Controls() {
      const controls = document.getElementById('darkroomControls');
      controls.innerHTML = `
        <button class="f2-btn-primary" id="btnDipTray2">🥢 Nhúng Sang Khay 2 (Thuốc Dừng 2 Giây)</button>
      `;

      document.getElementById('btnDipTray2').onclick = () => {
        startDevelopingTray2();
      };
    }

    function startDevelopingTray2() {
      stage = 2;
      timerVal = 0;
      if (window.GameAudio) {
        window.GameAudio.waterSplash();
        window.GameAudio.chemicalSizzle();
      }

      const clockTime = document.getElementById('clockTime');
      const pendulum = document.getElementById('pendulum');
      const statusText = document.getElementById('filmStatusText');

      statusText.textContent = 'Đang hãm thuốc dừng...';
      document.getElementById('darkroomMsg').textContent = 'Thuốc dừng đang trung hòa axit lưu huỳnh... Đếm 2 giây!';

      if (activeTimerInterval) clearInterval(activeTimerInterval);
      timerInterval = setInterval(() => {
        timerVal++;
        clockTime.textContent = `${timerVal}s`;
        if (pendulum) pendulum.classList.toggle('tick');
        if (window.GameAudio) window.GameAudio.darkroomTick(false);

        if (timerVal >= 2) {
          clearInterval(timerInterval);
          activeTimerInterval = null;
          if (window.GameAudio) window.GameAudio.drumTung();
          document.getElementById('darkroomMsg').innerHTML = `<span style="color:#58d68d"><b>Thuốc dừng đã khóa ngấm!</b> Mau gắp phim sang <b>Khay 3 (Thuốc Hãm)</b> để cố định nét vĩnh viễn!</span>`;
          renderTray3Controls();
        }
      }, 1000);
      activeTimerInterval = timerInterval;
    }

    // Controls for Tray 3 (Fixer - Final)
    function renderTray3Controls() {
      const controls = document.getElementById('darkroomControls');
      controls.innerHTML = `
        <button class="f2-btn-primary" id="btnDipTray3">🥢 Nhúng Sang Khay 3 (Thuốc Hãm - Khóa Nét)</button>
      `;

      document.getElementById('btnDipTray3').onclick = () => {
        startDevelopingTray3();
      };
    }

    function startDevelopingTray3() {
      if (stage === 3) return;
      stage = 3;
      document.getElementById('darkroomControls').innerHTML = '';
      document.getElementById('btnWaterReset').disabled = true;
      if (window.GameAudio) {
        window.GameAudio.waterSplash();
        window.GameAudio.photoRevealed();
      }

      document.getElementById('darkroomMsg').innerHTML = `<span style="color:#58d68d"><b>HOÀN TẤT TRÁNG PHIM!</b> Muối bạc halogenua chưa phản ứng đã bị rửa trôi. Tấm ảnh năm 1930 đã lộ diện! Dưới đáy khay, lớp sáp niêm phong vừa bong ra để lộ một <b>Chìa khóa sắt hoen gỉ</b>.</span>`;

      if (world && world.floor2) {
        world.floor2.developedPhoto1930 = true;
      }

      later(() => {
        closeModal();
        // Invoke onSuccess directly if provided by game.js; fallback to showHistoricalPhotoModal()
        if (typeof onSuccess === 'function') {
          onSuccess();
        } else {
          showHistoricalPhotoModal();
        }
      }, 1200);
    }

    // FAIL-SAFE: Xô nước sạch rửa lại phim
    document.getElementById('btnWaterReset').onclick = () => {
      if (timerInterval) clearInterval(timerInterval);
      activeTimerInterval = null;
      if (window.GameAudio) window.GameAudio.waterSplash();

      timerVal = 0;
      stage = 0;
      filmQuality = 'raw';
      poured = { 1: null, 2: null, 3: null };
      selectedBottle = null;

      document.getElementById('clockTime').textContent = '0s';
      const filmInner = document.getElementById('filmGlassInner');
      filmInner.style.backgroundColor = 'rgba(40, 35, 38, 0.9)';
      document.getElementById('filmStatusText').textContent = 'Tấm phim đục ngầu (Đã rửa sạch)';

      for (let i = 1; i <= 3; i++) {
        const liqEl = document.getElementById(`trayLiquid${i}`);
        liqEl.textContent = 'Trống';
        liqEl.classList.remove('filled');
      }

      document.getElementById('f2PourSection').style.display = 'block';
      overlay.querySelectorAll('.f2-btn-bottle').forEach(b => b.classList.remove('active'));

      document.getElementById('darkroomMsg').innerHTML = `<i>An nhúng tấm phim vào xô nước sạch, gột sạch thuốc thử để làm lại từ đầu.</i>`;
      document.getElementById('darkroomControls').innerHTML = ``;
    };

    const cleanup = () => {
      if (timerInterval) clearInterval(timerInterval);
      activeTimerInterval = null;
      closeModal();
    };

    document.getElementById('btnDarkClose').onclick = cleanup;
    document.getElementById('btnDarkroomExit').onclick = cleanup;
    overlay.onclick = (e) => {
      if (e.target === overlay) cleanup();
    };
  }

  // ----------------------------------------------------
  // GIAI ĐOẠN 3: MODAL BỨC ẢNH ĐEN TRẮNG SỰ KIỆN NĂM 1930
  // ----------------------------------------------------
  function showHistoricalPhotoModal(onComplete) {
    closeModal();
    if (window.GameAudio) window.GameAudio.photoRevealed();

    const overlay = document.createElement('div');
    overlay.className = 'f2-overlay';
    overlay.innerHTML = `
      <div class="f2-modal f2-photo-modal">
        <div class="f2-header">
          <h3>📷 ẢNH TƯ LIỆU GÁNH HÁT TIÊN SƯ (CANH NGỌ 1930)</h3>
          <button class="f2-btn-close" id="btnPhotoClose" title="Đóng [ESC]">✕</button>
        </div>
        <div class="f2-photo-body">
          <div class="f2-vintage-photo-frame" style="max-width: 480px;">
            <div class="f2-photo-glass-reflection"></div>
            <img src="assets/floor2/anh_tu_lieu_1930.png" alt="Ảnh tư liệu Gánh hát Tiên Sư 1930" style="width:100%; max-height:240px; object-fit:contain; display:block; border-radius:3px;" />
            <div class="f2-photo-caption" style="margin-top:6px;">
              <i>Tư liệu quân sự Pháp tịch thu — Đêm hỏa hoạn Gánh hát Tiên Sư 1930</i>
            </div>
          </div>
          <div class="f2-photo-analysis">
            <h4>CHI TIẾT LỊCH SỬ TỪ BỨC ẢNH:</h4>
            <p>
              • <b>Hiện trường hỏa hoạn:</b> Tấm ảnh chụp lại cảnh kho lương và thôn trang chìm trong biển lửa ngút trời vào đêm định mệnh năm Canh Ngọ (1930). Dân làng quỳ ôm nhau than khóc trong tuyệt vọng.<br>
              • <b>Nhân vật trên lưng ngựa:</b> Phía góc phải là bóng lưng một võ tướng mang đoản kiếm cưỡi ngựa đứng nhìn đám cháy – hoàn toàn trùng khớp với hình dáng Tướng quân họ Vũ được ca tụng trong bản Sắc Phong ở Thư khố.<br>
              • <b>Ghi chú quân sự Pháp (góc ảnh):</b> <i>“Rapport: Lực lượng bản xứ tự phóng hỏa thiêu hủy toàn bộ thôn làng trước khi triệt thoái.”</i>
            </p>
            <h4 style="margin-top: 10px; color: #ff8a80;">SUY LUẬN CỦA AN (DEDUCTION):</h4>
            <p style="font-style: italic; color: #f5ecc9;">
              “Tại sao một người được triều đình phong tặng ‘Tiết Nghĩa Trung Thần’ lại đích thân ra lệnh thiêu rụi nhà cửa và kho thóc của chính con dân mình? Lịch sử đã bị bóp méo, hay còn điều gì khủng khiếp hơn bị che giấu?”<br>
              <span style="font-style: normal; color: #ecc554; font-weight: 600;">(Thu thập Mệnh đề 2: Kẻ đồ tể thiêu thôn vào Sổ tay suy luận).</span>
            </p>
          </div>
        </div>
        <div class="f2-footer">
          <button class="f2-btn-primary" id="btnPhotoConfirm">Ghi Nhận Tư Liệu & Tiếp Tục [ESC]</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    activeModal = overlay;

    if (window.DeductionJournal && window.DeductionJournal.addKeyword) {
      window.DeductionJournal.addKeyword('[Mệnh đề 2: Kẻ đồ tể thiêu thôn]');
    }

    let isFinished = false;
    const finish = () => {
      if (isFinished) return;
      isFinished = true;
      closeModal();
      const eng = window.GameEngine;
      if (eng && eng.showToast) eng.showToast('Đã thu thập: [Mệnh đề 2: Kẻ đồ tể thiêu thôn]!');
      if (eng && !eng.world.bacCanhConfrontationDone && typeof eng.playDarkroomConfrontation === 'function') {
        eng.playDarkroomConfrontation(onComplete);
        return;
      }
      if (onComplete) onComplete();
    };

    document.getElementById('btnPhotoClose').onclick = finish;
    document.getElementById('btnPhotoConfirm').onclick = finish;
    overlay.onclick = (e) => {
      if (e.target === overlay) finish();
    };
  }

  // ----------------------------------------------------
  // QUY TẮC ĐÈN TRẮNG PHÒNG TỐI (THE RED LIGHT RULE)
  // ----------------------------------------------------
  function triggerWhiteLightWarning() {
    if (window.GameAudio) window.GameAudio.drumCac();
    if (window.GameEngine && window.GameEngine.showDialogue) {
      window.GameEngine.showDialogue(
        'An (Hốt hoảng)',
        'Không được bật đèn trắng! Ánh sáng thường sẽ làm cháy hỏng tấm phim kính vĩnh viễn!\n' +
        'Trong phòng tối chỉ được phép dùng ánh đèn đỏ (Red Safelight) để thao tác hóa chất.'
      );
    }
  }

  return {
    openRoyalEdictModal,
    openFrenchChestModal,
    showChestLootModal,
    openChemicalInspectionModal,
    openDarkroomTraysModal,
    showHistoricalPhotoModal,
    triggerWhiteLightWarning,
    isOpen,
    isActive,
    close: closeModal,
    closeModal
  };
})();
