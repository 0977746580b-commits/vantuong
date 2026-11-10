// HỌA DIỆN (The Dual Mask) - Deduction Journal System [TAB Key]
window.DeductionJournal = (function () {
  const FONT_SANS = '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  const PAGE_SIZE = 5;

  const state = {
    active: false,
    keywords: [], // List of discovered keyword strings e.g. ['[Trọng lượng 600g]', ...]
    selectedKeyword: null, // Keyword currently selected by player to place
    // Proposition slots: [Hình thái ngoài] + [Trọng lượng] + [Dấu vết niêm phong]
    slots: [null, null, null],
    isSolved: false,
    page: 0,
    pageSize: PAGE_SIZE
  };

  let mousePos = { x: -1, y: -1 };

  window.addEventListener('mousemove', (e) => {
    if (!state.active) return;
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 480 / rect.width;
    const scaleY = 250 / rect.height;
    mousePos.x = (e.clientX - rect.left) * scaleX;
    mousePos.y = (e.clientY - rect.top) * scaleY;
  });

  // Modal keyboard capture to prevent background movement & leakage
  window.addEventListener('keydown', (e) => {
    if (!state.active) return;

    if (e.code === 'Escape' || e.code === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      toggle();
      return;
    }

    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (state.page > 0) {
        state.page--;
        if (window.GameAudio) window.GameAudio.talkBlip(440);
      }
      return;
    }

    if (e.code === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const totalPages = Math.max(1, Math.ceil(state.keywords.length / state.pageSize));
      if (state.page < totalPages - 1) {
        state.page++;
        if (window.GameAudio) window.GameAudio.talkBlip(440);
      }
      return;
    }

    if (['KeyA', 'KeyD', 'KeyE', 'Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true);

  // Target solution for Stage 1 (Hồi 1 - Xưởng Phục Chế):
  // Slot 1: [Phôi gỗ thô bám bụi]
  // Slot 2: [Trọng lượng 600g]
  // Slot 3: [Khoang rỗng sáp ong]
  const targetSolution = ['[Phôi gỗ thô bám bụi]', '[Trọng lượng 600g]', '[Khoang rỗng sáp ong]'];

  function isActive() {
    return state.active;
  }

  function close() {
    if (state.active) {
      state.active = false;
      if (window.GameAudio) window.GameAudio.journalClose();
    }
  }

  function toggle() {
    if (!state.active) {
      // Don't open if other closeups/modals are active
      if (window.AltarMode && typeof window.AltarMode.isActive === 'function' && window.AltarMode.isActive()) return;
      if (window.Floor2Puzzles && typeof window.Floor2Puzzles.isActive === 'function' && window.Floor2Puzzles.isActive()) return;
      if (window.MuseumMap && typeof window.MuseumMap.isOpen === 'function' && window.MuseumMap.isOpen()) return;
    }

    state.active = !state.active;
    if (state.active) {
      // Clamp page
      const totalPages = Math.max(1, Math.ceil(state.keywords.length / state.pageSize));
      if (state.page >= totalPages) state.page = totalPages - 1;
      if (window.GameAudio) window.GameAudio.journalOpen();
    } else {
      if (window.GameAudio) window.GameAudio.journalClose();
    }
  }

  function addKeyword(keyword) {
    if (!state.keywords.includes(keyword)) {
      state.keywords.push(keyword);
    }
  }

  function hasKeyword(keyword) {
    return state.keywords.includes(keyword);
  }

  function isMapDiscovered() {
    if (window.MuseumMap) {
      if (typeof window.MuseumMap.isDiscovered === 'function') {
        return window.MuseumMap.isDiscovered();
      }
      if (window.MuseumMap.discovered) return true;
    }
    if (window.GameEngine && window.GameEngine.world && window.GameEngine.world.floor2 && window.GameEngine.world.floor2.hasDiscoveredMap) {
      return true;
    }
    return false;
  }

  function render(ctx, V_WIDTH, V_HEIGHT) {
    if (!state.active) return;

    const mx = mousePos.x;
    const my = mousePos.y;

    // 1. Dark Overlay Vignette
    ctx.fillStyle = 'rgba(10, 8, 14, 0.94)';
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    // Book/Journal Leather Border Frame
    ctx.strokeStyle = '#c89d42';
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 12, V_WIDTH - 32, V_HEIGHT - 24);

    // Top Header Bar
    ctx.fillStyle = '#22182c';
    ctx.fillRect(18, 14, V_WIDTH - 36, 26);
    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 9px ${FONT_SANS}`;
    ctx.fillText('📖 SỔ TAY SUY LUẬN & SA BÀN MỆNH ĐỀ [PHÍM TAB]', 28, 30);

    // Map Shortcut (ONLY rendered when discoverable item has been collected on Floor 2)
    const mapUnlocked = isMapDiscovered();
    if (mapUnlocked) {
      const isMapHover = (mx >= V_WIDTH - 245 && mx <= V_WIDTH - 98 && my >= 16 && my <= 36);
      ctx.fillStyle = isMapHover ? '#243a4e' : '#182736';
      ctx.fillRect(V_WIDTH - 240, 18, 140, 18);
      ctx.strokeStyle = isMapHover ? '#ecc554' : '#5dade2';
      ctx.lineWidth = 1;
      ctx.strokeRect(V_WIDTH - 240, 18, 140, 18);

      ctx.fillStyle = isMapHover ? '#fff' : '#5dade2';
      ctx.font = `bold 8px ${FONT_SANS}`;
      ctx.fillText('🗺️ [M] BẢN ĐỒ BẢO TÀNG', V_WIDTH - 232, 30);
    }

    // Close Button [TAB / ESC]
    const isCloseHover = (mx >= V_WIDTH - 92 && mx <= V_WIDTH - 20 && my >= 16 && my <= 36);
    ctx.fillStyle = isCloseHover ? '#4a1d22' : '#2b161c';
    ctx.fillRect(V_WIDTH - 92, 18, 70, 18);
    ctx.strokeStyle = isCloseHover ? '#ff4d4d' : '#a33a3a';
    ctx.lineWidth = 1;
    ctx.strokeRect(V_WIDTH - 92, 18, 70, 18);

    ctx.fillStyle = isCloseHover ? '#ffffff' : '#ff8787';
    ctx.font = `bold 8px monospace`;
    ctx.fillText('ĐÓNG [ESC]', V_WIDTH - 84, 30);

    // 2. Left Column: Discovered Keywords List with Pagination (x: 24..174, y: 46..238)
    ctx.fillStyle = '#17111e';
    ctx.fillRect(24, 46, 150, 192);
    ctx.strokeStyle = '#4e3922';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 46, 150, 192);

    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 7.5px ${FONT_SANS}`;
    ctx.fillText('THẺ TỪ KHÓA ĐÃ THU THẬP:', 30, 59);

    const totalKeywords = state.keywords.length;
    const totalPages = Math.max(1, Math.ceil(totalKeywords / state.pageSize));
    const curPage = Math.min(Math.max(0, state.page), totalPages - 1);
    const startIdx = curPage * state.pageSize;
    const visibleKws = state.keywords.slice(startIdx, startIdx + state.pageSize);

    if (totalKeywords === 0) {
      ctx.fillStyle = '#7a7062';
      ctx.font = `6.5px ${FONT_SANS}`;
      ctx.fillText('(Chưa có từ khóa nào.', 30, 80);
      ctx.fillText('Hãy đi khảo sát đồ vật trong', 30, 92);
      ctx.fillText('xưởng và phôi gỗ để thu thập)', 30, 104);
    } else {
      visibleKws.forEach((kw, i) => {
        const ky = 67 + i * 26;
        const isSelected = state.selectedKeyword === kw;
        const isPlaced = state.slots.includes(kw);
        const isHover = (mx >= 28 && mx <= 170 && my >= ky && my <= ky + 22);

        if (isSelected) {
          ctx.fillStyle = '#5c381d';
        } else if (isPlaced) {
          ctx.fillStyle = isHover ? '#251c30' : '#1c1524';
        } else {
          ctx.fillStyle = isHover ? '#382846' : '#281d33';
        }
        ctx.fillRect(28, ky, 142, 22);

        ctx.strokeStyle = isSelected ? '#ecc554' : isPlaced ? '#3a2e46' : (isHover ? '#d4a237' : '#6b4d24');
        ctx.lineWidth = isSelected ? 1.5 : 1;
        ctx.strokeRect(28, ky, 142, 22);

        ctx.fillStyle = isPlaced ? '#887d94' : '#f5ecc9';
        ctx.font = `bold 7px ${FONT_SANS}`;
        ctx.fillText(kw, 34, ky + 14);

        if (isPlaced) {
          ctx.fillStyle = '#58d68d';
          ctx.font = `6px ${FONT_SANS}`;
          ctx.fillText('✓ Đã dùng', 128, ky + 14);
        }
      });
    }

    // Pagination Footer Controls (x: 28..170, y: 204..228)
    ctx.fillStyle = '#110c17';
    ctx.fillRect(28, 204, 142, 24);
    ctx.strokeStyle = '#3d2e1f';
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 204, 142, 24);

    const hasPrev = curPage > 0;
    const hasNext = curPage < totalPages - 1;
    const isPrevHover = hasPrev && (mx >= 30 && mx <= 62 && my >= 206 && my <= 226);
    const isNextHover = hasNext && (mx >= 136 && mx <= 168 && my >= 206 && my <= 226);

    // Prev Button
    ctx.fillStyle = isPrevHover ? '#5c3e21' : (hasPrev ? '#2b1e33' : '#18121f');
    ctx.fillRect(30, 206, 32, 20);
    ctx.strokeStyle = hasPrev ? (isPrevHover ? '#ecc554' : '#735123') : '#33263a';
    ctx.strokeRect(30, 206, 32, 20);
    ctx.fillStyle = hasPrev ? (isPrevHover ? '#fff' : '#ecc554') : '#554a5c';
    ctx.font = `bold 8px ${FONT_SANS}`;
    ctx.textAlign = 'center';
    ctx.fillText('◀', 46, 219);

    // Page indicator
    ctx.fillStyle = '#f5ecc9';
    ctx.font = `7px ${FONT_SANS}`;
    ctx.fillText(`${curPage + 1} / ${totalPages}`, 99, 219);

    // Next Button
    ctx.fillStyle = isNextHover ? '#5c3e21' : (hasNext ? '#2b1e33' : '#18121f');
    ctx.fillRect(136, 206, 32, 20);
    ctx.strokeStyle = hasNext ? (isNextHover ? '#ecc554' : '#735123') : '#33263a';
    ctx.strokeRect(136, 206, 32, 20);
    ctx.fillStyle = hasNext ? (isNextHover ? '#fff' : '#ecc554') : '#554a5c';
    ctx.font = `bold 8px ${FONT_SANS}`;
    ctx.fillText('▶', 152, 219);
    ctx.textAlign = 'left';

    // 3. Right Column: Sa Bàn Mệnh Đề (x: 182..456, y: 46..238)
    ctx.fillStyle = '#17111e';
    ctx.fillRect(182, 46, 274, 192);
    ctx.strokeStyle = '#4e3922';
    ctx.lineWidth = 1;
    ctx.strokeRect(182, 46, 274, 192);

    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 8px ${FONT_SANS}`;
    ctx.fillText('SA BÀN KỊCH MINI — GHÉP MỆNH ĐỀ SỰ THẬT:', 190, 60);

    ctx.fillStyle = '#aba291';
    ctx.font = `7px ${FONT_SANS}`;
    ctx.fillText('Hồi 1: Những dấu hiệu bất thường của Khối gỗ số 47 là gì?', 190, 73);
    ctx.fillStyle = '#7a7062';
    ctx.font = `italic 6.5px ${FONT_SANS}`;
    ctx.fillText('(Cần: phôi gỗ thô, trọng lượng 600g và 2 nốt sáp ong niêm phong trái/phải)', 190, 83);

    // Slot 1: [Hình thái ngoài] + Slot 2: [Trọng lượng] + Slot 3: [Dấu vết niêm phong]
    const slotNames = ['[Hình thái ngoài]', '[Trọng lượng]', '[Dấu vết niêm phong (2 nút sáp ong)]'];
    const slotX = 190;

    for (let i = 0; i < 3; i++) {
      const sy = 88 + i * 35;
      const isSlotHover = (mx >= slotX && mx <= slotX + 258 && my >= sy && my <= sy + 25);

      ctx.fillStyle = isSlotHover ? '#2a1f38' : '#22192d';
      ctx.fillRect(slotX, sy, 258, 25);
      ctx.strokeStyle = state.slots[i] ? '#ecc554' : (isSlotHover ? '#9e7938' : '#5a4325');
      ctx.lineWidth = 1;
      ctx.strokeRect(slotX, sy, 258, 25);

      ctx.fillStyle = '#ecc554';
      ctx.font = `bold 6.5px ${FONT_SANS}`;
      ctx.fillText(`Ô #${i + 1} ${slotNames[i]}:`, slotX + 6, sy + 10);

      if (state.slots[i]) {
        ctx.fillStyle = '#58d68d';
        ctx.font = `bold 7.5px ${FONT_SANS}`;
        ctx.fillText(state.slots[i], slotX + 80, sy + 17);

        if (!state.isSolved) {
          ctx.fillStyle = '#ff8787';
          ctx.font = `6.5px monospace`;
          ctx.fillText('[Gỡ]', slotX + 236, sy + 17);
        } else {
          ctx.fillStyle = '#58d68d';
          ctx.font = `6.5px ${FONT_SANS}`;
          ctx.fillText('✓ Khóa', slotX + 226, sy + 17);
        }
      } else {
        ctx.fillStyle = '#6e6475';
        ctx.font = `italic 7px ${FONT_SANS}`;
        ctx.fillText('(Click một từ khóa bên trái để đưa vào đây)', slotX + 70, sy + 17);
      }
    }

    // Confirmation Button & Cultural Drum Feedback
    const btnY = 197;
    const isBtnHover = !state.isSolved && (mx >= slotX && mx <= slotX + 258 && my >= btnY && my <= btnY + 28);

    ctx.fillStyle = state.isSolved ? '#204a32' : (isBtnHover ? '#6b2b28' : '#54201e');
    ctx.fillRect(slotX, btnY, 258, 28);
    ctx.strokeStyle = state.isSolved ? '#58d68d' : (isBtnHover ? '#ffeb80' : '#ecc554');
    ctx.lineWidth = 1.5;
    ctx.strokeRect(slotX, btnY, 258, 28);

    ctx.fillStyle = '#f5ecc9';
    ctx.font = `bold 8px ${FONT_SANS}`;
    ctx.textAlign = 'center';
    if (state.isSolved) {
      ctx.fillText('✓ XÁC NHẬN HỒI 1: KHỐI GỖ NÀY GIẤU MẬT KHOANG!', slotX + 129, btnY + 18);
    } else {
      ctx.fillText('🥁 GÕ TRỐNG CHẦU XÁC NHẬN (TÙNG / CẮC)', slotX + 129, btnY + 18);
    }
    ctx.textAlign = 'left';
  }

  function handleClick(x, y, onSolvedCallback) {
    if (!state.active) return false;

    // Close button [ESC]
    if (x >= 385 && y <= 38) {
      toggle();
      return true;
    }

    // Map button (if discovered)
    if (isMapDiscovered()) {
      if (x >= 240 && x <= 380 && y >= 16 && y <= 38) {
        if (window.MuseumMap) {
          window.MuseumMap.open();
        }
        return true;
      }
    }

    const totalKeywords = state.keywords.length;
    const totalPages = Math.max(1, Math.ceil(totalKeywords / state.pageSize));
    const curPage = Math.min(Math.max(0, state.page), totalPages - 1);

    // Prev Button
    if (x >= 30 && x <= 62 && y >= 206 && y <= 226) {
      if (curPage > 0) {
        state.page = curPage - 1;
        if (window.GameAudio) window.GameAudio.talkBlip(440);
      }
      return true;
    }

    // Next Button
    if (x >= 136 && x <= 168 && y >= 206 && y <= 226) {
      if (curPage < totalPages - 1) {
        state.page = curPage + 1;
        if (window.GameAudio) window.GameAudio.talkBlip(440);
      }
      return true;
    }

    // Click on Left Keywords list
    if (x >= 28 && x <= 170 && y >= 67 && y <= 197) {
      const relY = y - 67;
      const slotIdx = Math.floor(relY / 26);
      const inBox = (relY % 26) <= 22;
      const startIdx = curPage * state.pageSize;
      const actualIdx = startIdx + slotIdx;

      if (inBox && actualIdx >= 0 && actualIdx < state.keywords.length) {
        const clickedKw = state.keywords[actualIdx];
        if (state.selectedKeyword === clickedKw) {
          state.selectedKeyword = null;
        } else {
          state.selectedKeyword = clickedKw;
          if (window.GameAudio) window.GameAudio.talkBlip(520);
        }
        return true;
      }
    }

    // Click on Right Slots
    const slotX = 190;
    for (let i = 0; i < 3; i++) {
      const sy = 88 + i * 35;
      if (x >= slotX && x <= slotX + 258 && y >= sy && y <= sy + 25) {
        if (state.isSolved) {
          // Solved slots are locked
          return true;
        }
        if (state.selectedKeyword) {
          // Place selected keyword into this slot
          state.slots[i] = state.selectedKeyword;
          state.selectedKeyword = null;
          if (window.GameAudio) window.GameAudio.slotDrop();
        } else if (state.slots[i]) {
          // Remove keyword from slot
          state.slots[i] = null;
          if (window.GameAudio) window.GameAudio.drumCac();
        }
        return true;
      }
    }

    // Click on Confirm Button
    const btnY = 197;
    if (x >= slotX && x <= slotX + 258 && y >= btnY && y <= btnY + 28) {
      checkSolution(onSolvedCallback);
      return true;
    }

    return false;
  }

  function checkSolution(onSolvedCallback) {
    if (state.isSolved) return;

    // Check if all 3 slots match target items
    const hasAllThree = state.slots.every(s => targetSolution.includes(s)) && (new Set(state.slots).size === 3);

    if (hasAllThree) {
      state.isSolved = true;
      if (window.GameAudio) window.GameAudio.drumTung();
      if (onSolvedCallback) onSolvedCallback();
    } else {
      // Wrong deduction: "CẮC!" rim strike
      if (window.GameAudio) window.GameAudio.drumCac();
    }
  }

  return {
    state,
    isActive,
    close,
    closeModal: close,
    toggle,
    addKeyword,
    hasKeyword,
    render,
    handleClick
  };
})();
