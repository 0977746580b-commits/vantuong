// HỌA DIỆN (The Dual Mask) - Inspection Mode & Two-Stage Close-up Puzzles
// Giai đoạn 0: Soi đèn 360° phôi gỗ thô bám bồ hóng & Cạy nút sáp ong niêm phong mặt sau
// Giai đoạn 1: Bóc tách lớp sơn bồi vôi gai & Kéo nắp trượt hốc mắt lấy Chìa Khóa Lá Mía
// Giai đoạn 2: Ghép mộng song diện, Cân chỉnh 3 chốt Âm Dương, Trượt mộng đuôi én & Lạc khoản dát vàng

window.InspectionMode = (function () {
  const FONT_SANS = '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const state = {
    active: false,
    stage: 0, // 0: Soi đèn dầu & Gỡ sáp ong, 1: Cạo sơn bồi & Chìa lá mía, 2: Ghép mộng song diện
    lampAngle: 0, // Degrees: 0..360 (90 = overhead, 270 = chin-up)
    isBackSide: false, // Lật mặt trước / mặt sau

    // Mouse Hover & Drag states for Close-up visual cues
    hoverTarget: null,
    mouseX: 220,
    mouseY: 135,
    isDraggingLamp: false,

    // Stage 0 Clues & Wax Seal Removal Mechanic (Mặt sau)
    discoveredTop: false,
    discoveredBottom: false,
    discoveredDual: false,
    discoveredBack: false,
    waxLeftProgress: 0,   // 0..3 clicks/scrapes to pry off Left Temple Wax Seal
    waxRightProgress: 0,  // 0..3 clicks/scrapes to pry off Right Temple Wax Seal
    waxCenterProgress: 0, // 0..3 clicks/scrapes to pry off Center Spine Wax Seal
    waxParticles: [],     // Flying amber beeswax crumbs

    // Stage 1: Scraping & Secret Eye Compartment
    hasToolChisel: false,
    isScraping: false,
    scrapeGrid: [], // 14x12 grid for paint scraping tracking
    scrapePercent: 0,
    scrapeDust: [],
    compartmentUnlocked: false,
    eyeMolePressed: false,
    eyeMoleHoldTimer: 0,
    isDraggingEyeLid: false,
    dragStartX: 0,
    slideOffset: 0, // 0..30px
    silkPacketOpened: false,
    hasLaMiaKey: false,

    // Stage 2: Dovetail Assembly & 3 Tumbler Pins
    pin1_weather: 0, // 0: Mưa, 1: Nắng, 2: Mây (ĐÚNG), 3: Gió
    pin2_emotion: 0, // 0: Hỉ, 1: Nộ, 2: Bi (ĐÚNG)
    pin3_fire: 0,    // 0: Hỏa Diệm, 1: Tro Tàn (ĐÚNG)
    pinsUnlocked: false,
    whiteHalfSlideY: -24, // -68px (chưa trượt) .. 0px (đã khớp)
    isDraggingWhiteHalf: false,
    dragStartY: 0,
    dovetailLocked: false,
    ebonyPinSelected: false,
    hasInsertedEbonyPin: false,
    kintsugiGlow: 0,
    goldCalligraphyRevealed: false
  };

  // Weather, Emotion, Fire definitions with visual icons
  const WEATHER_OPTS = ['🌧️ Mưa', '☀️ Nắng', '☁️ Mây', '🍃 Gió'];
  const EMOTION_OPTS = ['😊 Hỉ (Cười)', '😠 Nộ (Giận)', '😢 Bi (Khóc)'];
  const FIRE_OPTS = ['🔥 Hỏa Diệm', '🌑 Tro Tàn'];

  function initScrapeGrid() {
    state.scrapeGrid = [];
    for (let r = 0; r < 14; r++) {
      const row = [];
      for (let c = 0; c < 12; c++) {
        // Phủ sơn bồi lên vùng mắt và sống mũi của nửa mặt nạ đỏ
        const isTarget = (c >= 1 && c <= 10 && r >= 2 && r <= 11);
        row.push(isTarget ? 1.0 : 0.0);
      }
      state.scrapeGrid.push(row);
    }
    state.scrapePercent = 0;
  }

  function spawnWaxCrumbs(x, y, color = '#d48b28') {
    for (let i = 0; i < 8; i++) {
      state.waxParticles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 65,
        vy: -25 - Math.random() * 45,
        size: 1.5 + Math.random() * 2.2,
        alpha: 1.0,
        color
      });
    }
  }

  function getAngleIndex(deg) {
    const norm = ((deg % 360) + 360) % 360;
    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
    let closest = 90;
    let minDiff = 999;
    for (const a of angles) {
      let diff = Math.abs(norm - a);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closest = a;
      }
    }
    return closest;
  }

  function open(onDialogueRequest) {
    state.active = true;
    state.hoverTarget = null;
    if (window.GameAudio) window.GameAudio.drumCac();

    const world = window.GameEngine && window.GameEngine.world ? window.GameEngine.world : {};

    if (world.floor3 && world.floor3.hasWhiteHalf) {
      state.stage = 2;
      state.isBackSide = false;
      if (onDialogueRequest && !state.dovetailLocked) {
        onDialogueRequest(
          'An (Đặt Nửa Trắng bên cạnh Nửa Đỏ)',
          'Nửa Mặt Nạ Đỏ và Nửa Trắng đặt cạnh nhau, để lộ đường rãnh sống mũi có ba ổ chốt âm dương.\nMình hãy đối chiếu với ba câu thơ trong Di Thư Kép Hát Trưởng để xoay các chốt gỗ và kéo ghép hai nửa lại.'
        );
      }
    } else if (world.floor3 && world.floor3.readTuongScript) {
      state.stage = 1;
      state.isBackSide = false;
      // Chon dao cao moc chu dong
      if (state.scrapeGrid.length === 0) initScrapeGrid();
      if (onDialogueRequest && !state.compartmentUnlocked) {
        onDialogueRequest(
          'An (Cầm Dao Cạo Mộc)',
          'Kịch bản ở Tầng 3 chỉ rõ lớp vôi gai sần sùi trên mặt nạ đỏ chính là lớp sơn bồi ngụy trang!\nMình hãy giữ chuột trái và rê lưỡi dao qua lại trên vùng mắt và sống mũi để cạo sạch lớp sơn bồi.'
        );
      }
    } else {
      state.stage = 0;
      state.isBackSide = false;
      if (onDialogueRequest && !state.discoveredDual) {
        onDialogueRequest(
          'An (Quan sát Phôi gỗ số 47)',
          'Khối gỗ mít bám bồ hóng đen kịt, lớp vecni ố vàng đóng vảy che kín các đường ghép mộc.\nHãy giữ chuột kéo ngọn đèn dầu xoay quanh mặt nạ, và lật mặt sau để kiểm tra lớp sáp ong niêm phong.'
        );
      }
    }
  }

  function close() {
    state.active = false;
    state.isDraggingLamp = false;
    state.isDraggingEyeLid = false;
    state.isDraggingWhiteHalf = false;
    cancelGesture();
    if (window.GameAudio) window.GameAudio.drumCac();
  }

  // Phong to hien vat de quan sat ro hon ma khong lech toa do goc
  function artifactPoint(x, y) {
    return (x > 122 && x < 326) ? { x: 220 + (x - 220) / 1.25, y: 135 + (y - 135) / 1.25 } : { x, y };
  }
  let held = false;
  let lastPoint = null;
  let revealDelay = -1;
  function cancelGesture() {
    held = false;
    lastPoint = null;
    state.isDraggingLamp = false;
    state.isDraggingEyeLid = false;
    state.isDraggingWhiteHalf = false;
    state.isScraping = false;
  }
  function detectHoverTarget(mx, my) {
    const cx = 220;
    const cy = 135;

    // 1. Nút Đóng
    if (mx >= 395 && my <= 32) return 'close_btn';

    // 2. Ngọn đèn dầu hoặc vành quỹ đạo đèn
    const rad = -state.lampAngle * Math.PI / 180;
    const lampX = cx + Math.cos(rad) * 74;
    const lampY = cy + Math.sin(rad) * 74;
    if (Math.hypot(mx - lampX, my - lampY) <= 14) return 'lamp_handle';

    if (state.stage === 0) {
      if (mx >= 24 && mx <= 114 && my >= 62 && my <= 84) return 'flip_btn';
      if (mx >= 24 && mx <= 114 && my >= 90 && my <= 108) return 'preset_90';
      if (mx >= 24 && mx <= 114 && my >= 114 && my <= 132) return 'preset_270';

      // Mặt sau: 3 miếng sáp ong niêm phong cực rõ nét trên phôi mặt nạ
      if (state.isBackSide) {
        if (state.waxLeftProgress < 3 && Math.hypot(mx - (cx - 18), my - (cy - 18)) <= 13) return 'wax_left';
        if (state.waxRightProgress < 3 && Math.hypot(mx - (cx - 18), my - (cy + 18)) <= 13) return 'wax_right';

      }
    } else if (state.stage === 1) {
      if (mx >= 24 && mx <= 116 && my >= 62 && my <= 94) return 'tool_chisel';
      // Vùng cạo sơn bồi trên Nửa Mặt Nạ Đỏ (cx - 44 .. cx, cy - 50 .. cy + 50 => x: 176..220, y: 85..185)
      if (!state.compartmentUnlocked && mx >= cx - 46 && mx <= cx + 4 && my >= cy - 50 && my <= cy + 50) {
        return 'scrape_zone';
      }
      if (state.compartmentUnlocked && !state.eyeMolePressed) {
        const eyeX = cx - 36 + state.slideOffset;
        const eyeY = cy - 22;
        if (Math.hypot(mx - (eyeX + 13), my - (eyeY + 9)) <= 10 || (mx >= 24 && mx <= 114 && my >= 132 && my <= 154)) {
          return 'eye_mole';
        }
      }
      if (state.eyeMolePressed && state.slideOffset < 28) {
        const eyeX = cx - 36 + state.slideOffset;
        const eyeY = cy - 22;
        if ((mx >= eyeX - 4 && mx <= eyeX + 32 && my >= eyeY - 4 && my <= eyeY + 22) || (mx >= 24 && mx <= 114 && my >= 160 && my <= 182)) {
          return 'eye_drawer';
        }
      }
      if (state.slideOffset >= 28 && !state.silkPacketOpened) {
        if ((mx >= cx - 38 && mx <= cx - 10 && my >= cy - 24 && my <= cy - 2) || (mx >= 24 && mx <= 114 && my >= 160 && my <= 188)) {
          return 'silk_packet';
        }
      }
    } else if (state.stage === 2) {
      if (!state.dovetailLocked) {
        // 3 ổ chốt xoay trực tiếp trên sống mũi (cx) hoặc bảng bên trái
        if ((mx >= 24 && mx <= 114 && my >= 70 && my <= 92) || Math.hypot(mx - cx, my - (cy - 28)) <= 10) return 'pin_1';
        if ((mx >= 24 && mx <= 114 && my >= 98 && my <= 120) || Math.hypot(mx - cx, my - cy) <= 10) return 'pin_2';
        if ((mx >= 24 && mx <= 114 && my >= 126 && my <= 148) || Math.hypot(mx - cx, my - (cy + 28)) <= 10) return 'pin_3';

        if (state.pinsUnlocked) {
          const whiteY = (cy - 50) + state.whiteHalfSlideY;
          if ((mx >= cx - 2 && mx <= cx + 46 && my >= whiteY && my <= whiteY + 100) || (mx >= 24 && mx <= 114 && my >= 156 && my <= 180)) {
            return 'white_half_drag';
          }
        }
      } else if (!state.hasInsertedEbonyPin) {
        if (mx >= 24 && mx <= 116 && my >= 156 && my <= 180) return 'select_ebony';
        if (Math.hypot(mx - cx, my - (cy + 47)) <= 14 || (mx >= 24 && mx <= 114 && my >= 156 && my <= 180)) {
          return 'chin_mortise';
        }
      } else {
        if (mx >= 24 && mx <= 114 && my >= 186 && my <= 208) return 'flip_gold_btn';
      }
    }

    return null;
  }

  function update(dt, mouse, isMouseDown, addJournalClue, onDialogueRequest) {
    if (!state.active) return;

    mouse = artifactPoint(mouse.x, mouse.y);
    const pressed = isMouseDown && !held;
    held = isMouseDown;
    if (pressed) {
      const target = detectHoverTarget(mouse.x, mouse.y);
      state.isDraggingLamp = target === 'lamp_handle';
      state.isDraggingEyeLid = target === 'eye_drawer' && mouse.x > 122;
      state.isDraggingWhiteHalf = target === 'white_half_drag' && mouse.x > 122;
      state.isScraping = target === 'scrape_zone' && state.hasToolChisel;
      state.dragStartX = mouse.x - state.slideOffset;
      state.dragStartY = mouse.y - state.whiteHalfSlideY;
    }
    const movement = lastPoint ? Math.hypot(mouse.x - lastPoint.x, mouse.y - lastPoint.y) : 0;
    lastPoint = { x: mouse.x, y: mouse.y };
    if (revealDelay >= 0) {
      revealDelay -= dt;
      if (revealDelay < 0) state.isBackSide = true;
    }
    const combo = (state.pin1_weather === 2 && state.pin2_emotion === 2 && state.pin3_fire === 1);
    if (combo && !state.pinsUnlocked && window.GameAudio) window.GameAudio.springClick();
    state.pinsUnlocked = combo;
    state.mouseX = mouse.x;
    state.mouseY = mouse.y;
    state.hoverTarget = detectHoverTarget(mouse.x, mouse.y);

    const cx = 220;
    const cy = 135;

    // Cập nhật hạt sáp ong / bụi sơn bay
    for (let i = state.waxParticles.length - 1; i >= 0; i--) {
      const p = state.waxParticles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 120 * dt; // Trọng lực
      p.alpha -= dt * 1.4;
      if (p.alpha <= 0) state.waxParticles.splice(i, 1);
    }

    // Xoay đèn dầu trên quỹ đạo 360° (khi không kéo mảnh mặt nạ hay cạo sơn)
    const dx = mouse.x - cx;
    const dy = mouse.y - cy;
    const dist = Math.hypot(dx, dy);

    if (!isMouseDown) {
      state.isDraggingLamp = false;
      state.isDraggingEyeLid = false;
      state.isDraggingWhiteHalf = false;
    }

    if (isMouseDown && state.isDraggingLamp) {
      state.lampAngle = Math.round((Math.atan2(-dy, dx) * 180 / Math.PI + 360) % 360);
    }

    // --- GIAI ĐOẠN 0: SOI ĐÈN 360 ĐỘ ---
    if (state.stage === 0) {
      const normAngle = ((state.lampAngle % 360) + 360) % 360;
      if (!state.isBackSide && Math.abs(normAngle - 90) <= 25 && !state.discoveredTop) {
        state.discoveredTop = true;
        if (window.GameAudio) window.GameAudio.clueDiscovered();
        if (onDialogueRequest) {
          onDialogueRequest(
            'An (Rọi đèn từ đỉnh đầu 90°)',
            'Ánh đèn rọi từ đỉnh đầu làm hiện rõ các vết đục mộc dở dang và lớp bồ hóng bám dày đặc.\nLớp bồ hóng sần sùi che kín các đường ghép bên trong, chưa thể nhận ra sắc diện.'
          );
        }
      }
      if (!state.isBackSide && Math.abs(normAngle - 270) <= 25 && !state.discoveredBottom) {
        state.discoveredBottom = true;
        if (window.GameAudio) window.GameAudio.clueDiscovered();
        if (onDialogueRequest) {
          onDialogueRequest(
            'An (Hắt đèn từ dưới cằm 270°)',
            'Ánh đèn hắt từ cằm lên làm nổi bật sống mũi gỗ mít già cùng các hốc đục tối đen dở dang.\nVân gỗ mít đổi sắc theo hướng sáng, các hốc đục tối hiện lên rõ nét hơn.'
          );
        }
      }
      if (state.discoveredTop && state.discoveredBottom && !state.discoveredDual) {
        state.discoveredDual = true;
        if (addJournalClue) addJournalClue('[Phôi gỗ thô bám bụi]');
        if (window.GameAudio) window.GameAudio.drumTung();
      }
    }

    // --- GIAI ĐOẠN 1: CẠO SƠN BỒI (SỬA CHUẨN TỌA ĐỘ NỬA MẶT NẠ ĐỎ x: 176..220, y: 85..185) ---
    if (state.stage === 1 && state.hasToolChisel && state.isScraping && movement > 0.25 && isMouseDown && !state.compartmentUnlocked) {
      const maskLeft = cx - 44; // 176
      const maskTop = cy - 50;  // 85
      const maskW = 44;
      const maskH = 100;

      if (mouse.x >= maskLeft - 4 && mouse.x <= maskLeft + maskW + 4 && mouse.y >= maskTop && mouse.y <= maskTop + maskH) {
        const col = Math.max(0, Math.min(11, Math.floor(((mouse.x - maskLeft) / maskW) * 12)));
        const row = Math.max(0, Math.min(13, Math.floor(((mouse.y - maskTop) / maskH) * 14)));

        // Cạo vùng 3x3 quanh mũi dao để thao tác mượt và nhạy
        let didScrape = false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const rr = row + dr;
            const cc = col + dc;
            if (state.scrapeGrid[rr] && state.scrapeGrid[rr][cc] > 0) {
              const factor = Math.min(movement, 8) * ((dr === 0 && dc === 0) ? 0.16 : 0.08);
              state.scrapeGrid[rr][cc] = Math.max(0, state.scrapeGrid[rr][cc] - factor);
              didScrape = true;
            }
          }
        }

        if (didScrape) {
          if (Math.random() < 0.35 && window.GameAudio) {
            window.GameAudio.scrapePaint();
          }
          if (Math.random() < 0.4) {
            spawnWaxCrumbs(mouse.x, mouse.y, '#8c6239');
          }

          let total = 0;
          let scraped = 0;
          for (let r = 0; r < 14; r++) {
            for (let c = 0; c < 12; c++) {
              if (c >= 1 && c <= 10 && r >= 2 && r <= 11) {
                total += 1.0;
                scraped += (1.0 - state.scrapeGrid[r][c]);
              }
            }
          }
          state.scrapePercent = Math.min(100, Math.round((scraped / total) * 100));

          if (state.scrapePercent >= 75 && !state.compartmentUnlocked) {
            state.scrapePercent = 100;
            state.compartmentUnlocked = true;
            if (window.GameAudio) {
              window.GameAudio.clueDiscovered();
              window.GameAudio.drumTung();
            }
            if (onDialogueRequest) {
              onDialogueRequest(
                'An (Bóc sạch lớp sơn bồi)',
                'Lớp vôi gai đã bong hết, để lộ thớ gỗ mít vàng sẫm cùng đường rãnh chữ nhật quanh hốc mắt!\nChính giữa con ngươi gỗ có một nốt ruồi son chạm nổi, hãy click nhấn vào nốt ruồi đó.'
              );
            }
          }
        }
      }
    }

    // --- GIAI ĐOẠN 1: KÉO TRƯỢT NẮP HỐC MẮT BẰNG CHUỘT ---
    if (state.stage === 1 && state.eyeMolePressed && state.slideOffset < 30 && isMouseDown) {
      const eyeX = cx - 36 + state.slideOffset;
      const eyeY = cy - 22;
      if (false) {
        state.isDraggingEyeLid = true;
        state.dragStartX = mouse.x - state.slideOffset;
      }
      if (state.isDraggingEyeLid) {
        const newOffset = Math.max(0, Math.min(30, mouse.x - state.dragStartX));
        if (Math.abs(newOffset - state.slideOffset) >= 4 && window.GameAudio) {
          window.GameAudio.woodSlideStep();
        }
        state.slideOffset = newOffset;
        if (state.slideOffset >= 28) {
          state.slideOffset = 30;
          state.isDraggingEyeLid = false;
          if (window.GameAudio) window.GameAudio.springClick();
          if (onDialogueRequest) {
            onDialogueRequest(
              'An (Kéo mở nắp trượt hốc mắt)',
              'Mảng gỗ hốc mắt đã trượt mở sang ngang, để lộ khoang rỗng chứa gói vải lụa điều!\nHãy click trực tiếp vào gói vải lụa đỏ để mở dây buộc.'
            );
          }
        }
      }
    }

    // --- GIAI ĐOẠN 2: KÉO TRƯỢT NỬA MẶT NẠ TRẮNG TỪ TRÊN ĐỈNH ĐẦU XUỐNG ---
    if (state.stage === 2 && state.pinsUnlocked && !state.dovetailLocked && isMouseDown) {
      const whiteY = (cy - 50) + state.whiteHalfSlideY;
      if (false) {
        state.isDraggingWhiteHalf = true;
        state.dragStartY = mouse.y - state.whiteHalfSlideY;
      }
      if (state.isDraggingWhiteHalf) {
        const nextY = Math.max(-24, Math.min(0, mouse.y - state.dragStartY));
        if (Math.abs(nextY - state.whiteHalfSlideY) >= 8 && window.GameAudio) {
          window.GameAudio.woodSlideStep();
        }
        state.whiteHalfSlideY = nextY;
        if (state.whiteHalfSlideY >= -4) {
          state.whiteHalfSlideY = 0;
          state.dovetailLocked = true;
          state.isDraggingWhiteHalf = false;
          if (window.GameAudio) window.GameAudio.woodLockSnap();
          if (window.GameEngine && window.GameEngine.showToast) {
            window.GameEngine.showToast('★ RẮC... RẮC... KHẮC! Mộng đuôi én đã khóa chặt!');
          }
          if (onDialogueRequest) {
            onDialogueRequest(
              'An (Trượt mộng đuôi én)',
              'Hai nửa mặt nạ trượt khít vào nhau theo trục sống mũi với tiếng ma sát đanh giòn: Rắc... rắc... KHẮC!\nDưới cằm đã lộ ra lỗ mộng vuông, hãy click đóng Chốt Gỗ Mun vào để khóa vĩnh viễn.'
            );
          }
        }
      }
    }

    // Hiệu ứng phát sáng Kintsugi ở Giai đoạn 2
    if (state.stage === 2 && state.hasInsertedEbonyPin && state.kintsugiGlow < 1.0) {
      state.kintsugiGlow = Math.min(1.0, state.kintsugiGlow + dt * 1.5);
    }
  }

  function renderWaxSealNode(ctx, x, y, radius, progress, label, isHovered) {
    if (progress >= 3) {
      // Đã gỡ sạch sáp: Lộ lỗ mộng / khoang rỗng sâu bên trong
      ctx.fillStyle = '#0d0704';
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#58d68d';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 1]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ánh kim loại lấp lánh bên trong lỗ khoang rỗng
      ctx.fillStyle = '#ecc554';
      ctx.fillRect(x - 2, y - 1, 4, 2);
      return;
    }

    // Miếng sáp ong ruồi màu hổ phách nổi khối rõ nét, có vết nứt theo số lần cạy
    const pulse = Math.sin(performance.now() * 0.006) * 1.5;
    if (isHovered) {
      ctx.fillStyle = 'rgba(255, 220, 110, 0.32)';
      ctx.beginPath();
      ctx.arc(x, y, radius + 4 + pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    // Đổ bóng khối sáp
    ctx.fillStyle = 'rgba(15, 8, 4, 0.7)';
    ctx.beginPath();
    ctx.arc(x + 1.5, y + 2, radius, 0, Math.PI * 2);
    ctx.fill();

    // Thân miếng sáp ong hổ phách
    const waxGrad = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, radius);
    waxGrad.addColorStop(0, '#ffcf6b');
    waxGrad.addColorStop(0.55, '#d48822');
    waxGrad.addColorStop(1, '#7a430d');
    ctx.fillStyle = waxGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius * (1 - progress * 0.12), 0, Math.PI * 2);
    ctx.fill();

    // Viền sáp & dấu triện cổ
    ctx.strokeStyle = isHovered ? '#ffffff' : '#ffe082';
    ctx.lineWidth = isHovered ? 1.5 : 1;
    ctx.stroke();

    // Vết rạn nứt khi đang cạy (progress = 1 hoặc 2)
    if (progress > 0) {
      ctx.strokeStyle = '#2b1204';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - 5, y - 4);
      ctx.lineTo(x + 1, y + 1);
      ctx.lineTo(x + 5, y - 2);
      if (progress === 2) {
        ctx.moveTo(x + 1, y + 1);
        ctx.lineTo(x - 3, y + 6);
      }
      ctx.stroke();
    }

    // Nhãn gợi ý nhỏ
    if (isHovered) {
      ctx.fillStyle = '#181220';
      ctx.fillRect(x - 30, y - radius - 14, 60, 11);
      ctx.strokeStyle = '#ecc554';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x - 30, y - radius - 14, 60, 11);
      ctx.fillStyle = '#ffe082';
      ctx.font = `bold 5.8px ${FONT_SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText(`🔨 Click cạy ${label} (${progress}/3)`, x, y - radius - 6);
      ctx.textAlign = 'left';
    }
  }

  function render(ctx, V_WIDTH, V_HEIGHT) {
    if (!state.active) return;

    // 1. Phông nền tối phòng khảo sát cận cảnh
    ctx.fillStyle = 'rgba(12, 9, 16, 0.96)';
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    // Khung viền thếp vàng cổ kính
    ctx.strokeStyle = '#c89d42';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 8, V_WIDTH - 20, V_HEIGHT - 16);

    // Thanh tiêu đề
    ctx.fillStyle = '#22162a';
    ctx.fillRect(12, 10, V_WIDTH - 24, 24);
    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 8px ${FONT_SANS}`;
    const titles = [
      '🔍 KHẢO SÁT PHÔI GỖ SỐ 47 — SOI ĐÈN 360° & GỠ SÁP ONG NIÊM PHONG',
      '🔪 GIAI ĐOẠN 1: DÙNG CHUỘT CẠO SƠN BỒI & MỞ HỐC MẮT LẤY CHÌA LÁ MÍA',
      '🎭 GIAI ĐOẠN 2: XOAY 3 CHỐT ÂM DƯƠNG & KÉO TRƯỢT MỘNG ĐUÔI ÉN'
    ];
    ctx.fillText(titles[state.stage] || titles[0], 18, 25);

    // Nút Đóng [ESC / X]
    ctx.fillStyle = state.hoverTarget === 'close_btn' ? '#ff5252' : '#3a1c24';
    ctx.fillRect(V_WIDTH - 86, 13, 70, 18);
    ctx.strokeStyle = '#ff8787';
    ctx.lineWidth = 1;
    ctx.strokeRect(V_WIDTH - 86, 13, 70, 18);
    ctx.fillStyle = '#ffdada';
    ctx.font = `bold 7px monospace`;
    ctx.fillText('ĐÓNG [ESC/X]', V_WIDTH - 80, 24.5);

    const cx = 220;
    const cy = 135;

    ctx.save();
    ctx.translate(220, 135);
    ctx.scale(1.25, 1.25);
    ctx.translate(-220, -135);
    // 2. Vòng tròn quỹ đạo đèn dầu 360 độ
    ctx.strokeStyle = 'rgba(236, 197, 84, 0.24)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(cx, cy, 74, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    const rad = -state.lampAngle * Math.PI / 180;
    const lampX = cx + Math.cos(rad) * 74;
    const lampY = cy + Math.sin(rad) * 74;

    // 3. Vệt nón sáng đèn rọi lên hiện vật
    const lightGrad = ctx.createRadialGradient(lampX, lampY, 8, cx, cy, 108);
    lightGrad.addColorStop(0, 'rgba(255, 235, 140, 0.58)');
    lightGrad.addColorStop(0.45, 'rgba(235, 145, 45, 0.22)');
    lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.arc(lampX, lampY, 96, 0, Math.PI * 2);
    ctx.fill();

    // 4. Giá đỡ gỗ của thợ mộc
    ctx.fillStyle = '#2c180e';
    ctx.fillRect(cx - 44, cy + 50, 88, 22);
    ctx.fillStyle = '#7a4b22';
    ctx.fillRect(cx - 48, cy + 48, 96, 4);

    // 5. HIỂN THỊ HIỆN VẬT THEO TỪNG GIAI ĐOẠN

    if (state.stage === 0) {
      if (!state.isBackSide) {
        const closestAngle = getAngleIndex(state.lampAngle);
        const angleImg = window.GameAssets.maskAngles ? window.GameAssets.maskAngles[closestAngle] : null;

        if (angleImg) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(cx - 44, cy - 50, 46, 100);
          ctx.clip();
          ctx.drawImage(angleImg, cx - 44, cy - 50, 88, 100);
          ctx.restore();
        } else {
          ctx.fillStyle = '#4a331e';
          ctx.beginPath();
          ctx.ellipse(cx - 18, cy, 22, 44, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Lớp bồ hóng sần sùi che kín (Hồi 1)
        ctx.fillStyle = 'rgba(24, 18, 16, 0.58)';
        ctx.beginPath();
        ctx.arc(cx - 16, cy - 14, 16, 0, Math.PI * 2);
        ctx.arc(cx + 12, cy + 10, 18, 0, Math.PI * 2);
        ctx.arc(cx, cy - 24, 14, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // MẶT SAU GÁY: Khuôn gỗ mít trũng + 3 nút sáp ong ruồi niêm phong nổi khối rõ nét
        if (window.GameAssets.maskBackClean) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(cx - 46, cy - 50, 52, 100);
          ctx.clip();
          ctx.drawImage(window.GameAssets.maskBackClean, cx - 44, cy - 50, 88, 100);
          ctx.restore();
        } else {
          ctx.fillStyle = '#3a2414';
          ctx.beginPath();
          ctx.ellipse(cx, cy, 32, 44, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vẽ đường rãnh mộng ngầm sau gáy
        ctx.strokeStyle = 'rgba(20, 10, 5, 0.75)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 44);
        ctx.lineTo(cx, cy + 44);
        ctx.stroke();

        // 3 Nút Sáp Ong Ruồi Niêm Phong Tương Tác Trực Tiếp Bằng Chuột:
        // 1. Nút sáp thái dương trái
        renderWaxSealNode(ctx, cx - 18, cy - 18, 8.5, state.waxLeftProgress, 'Sáp Trên', state.hoverTarget === 'wax_left');
        // 2. Nút sáp thái dương phải
        renderWaxSealNode(ctx, cx - 18, cy + 18, 8.5, state.waxRightProgress, 'Sáp Dưới', state.hoverTarget === 'wax_right');
        // 3. Nút sáp đại phong sống gáy


        // Chỉ dẫn trực quan ngay dưới mặt nạ khi ở mặt sau
        const totalWaxRemoved = (state.waxLeftProgress >= 3 ? 1 : 0) + (state.waxRightProgress >= 3 ? 1 : 0);
        ctx.fillStyle = 'rgba(18, 12, 24, 0.9)';
        ctx.fillRect(cx - 64, cy + 54, 128, 16);
        ctx.strokeStyle = totalWaxRemoved === 2 ? '#58d68d' : '#ecc554';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 64, cy + 54, 128, 16);
        ctx.fillStyle = totalWaxRemoved === 2 ? '#58d68d' : '#ffe082';
        ctx.font = `bold 6.2px ${FONT_SANS}`;
        ctx.textAlign = 'center';
        ctx.fillText(
          totalWaxRemoved === 2
            ? '✓ Đã gỡ cả 2 nút sáp ong niêm phong!'
            : `🖱️ Click chuột cạy 2 nút sáp ong (${totalWaxRemoved}/2)`,
          cx,
          cy + 64
        );
        ctx.textAlign = 'left';
      }
    } else if (state.stage === 1) {
      // --- GIAI ĐOẠN 1: BÓC TÁCH LỚP SƠN BỒI VÔI GAI NỬA MẶT NẠ ĐỎ ---
      const redImg = window.GameAssets.maskRedHalf;
      if (redImg) {
        ctx.drawImage(redImg, cx - 44, cy - 50, 44, 100);
      } else {
        ctx.fillStyle = '#8a201c';
        ctx.fillRect(cx - 44, cy - 50, 44, 100);
      }

      // Vẽ lớp sơn bồi vôi gai sần sùi lên vùng mắt và sống mũi nếu chưa cạo sạch
      if (state.scrapePercent < 100) {
        for (let r = 0; r < 14; r++) {
          for (let c = 0; c < 12; c++) {
            const alphaVal = state.scrapeGrid[r] ? state.scrapeGrid[r][c] : 0;
            if (alphaVal > 0) {
              const px = (cx - 44) + c * (44 / 12);
              const py = (cy - 50) + r * (100 / 14);
              ctx.fillStyle = `rgba(38, 28, 22, ${alphaVal * 0.9})`;
              ctx.fillRect(px, py, 4.2, 7.8);
              if ((r + c) % 2 === 0) {
                ctx.fillStyle = `rgba(175, 145, 105, ${alphaVal * 0.78})`;
                ctx.fillRect(px + 1, py + 1, 2, 2);
              }
            }
          }
        }

        // Khung gợi ý vùng rê chuột cạo sơn
        ctx.strokeStyle = 'rgba(255, 220, 110, 0.55)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(cx - 42, cy - 36, 40, 72);
        ctx.setLineDash([]);
      }

      // Khi cạo đạt >= 75%: Để lộ đường nứt hình chữ nhật hốc mắt & Nốt ruồi son
      if (state.compartmentUnlocked) {
        const eyeX = cx - 36 + state.slideOffset;
        const eyeY = cy - 22;

        // Khe khoang rỗng bên trong
        ctx.fillStyle = '#100a06';
        ctx.fillRect(cx - 36, eyeY, 26, 18);
        ctx.strokeStyle = '#ecc554';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 36, eyeY, 26, 18);

        // Gói vải lụa điều bên trong nếu chưa mở
        if (!state.silkPacketOpened) {
          const pktHover = state.hoverTarget === 'silk_packet';
          ctx.fillStyle = pktHover ? '#d93838' : '#a62424';
          ctx.fillRect(cx - 33, eyeY + 3, 20, 12);
          ctx.strokeStyle = '#ffe082';
          ctx.lineWidth = pktHover ? 1.5 : 1;
          ctx.strokeRect(cx - 33, eyeY + 3, 20, 12);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 5.5px sans-serif';
          ctx.fillText('🎁 LỤA', cx - 31, eyeY + 11);
        } else {
          ctx.fillStyle = '#ecc554';
          ctx.font = 'bold 5.5px sans-serif';
          ctx.fillText('🔑 CHÌA', cx - 31, eyeY + 11);
        }

        // Mảng gỗ hốc mắt trượt sang ngang
        const drawerHover = (state.hoverTarget === 'eye_drawer' || state.hoverTarget === 'eye_mole');
        ctx.fillStyle = '#5c361c';
        ctx.fillRect(eyeX, eyeY, 26, 18);
        ctx.strokeStyle = drawerHover ? '#ffe082' : '#99632f';
        ctx.lineWidth = drawerHover ? 1.5 : 1;
        ctx.strokeRect(eyeX, eyeY, 26, 18);

        // Con ngươi gỗ & Nốt ruồi son chạm nổi
        ctx.fillStyle = '#1c1008';
        ctx.beginPath();
        ctx.ellipse(eyeX + 13, eyeY + 9, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Nốt ruồi son nổi bật
        const molePulse = !state.eyeMolePressed ? Math.sin(performance.now() * 0.008) * 1.2 : 0;
        ctx.fillStyle = state.eyeMolePressed ? '#58d68d' : '#ff3b30';
        ctx.beginPath();
        ctx.arc(eyeX + 13, eyeY + 9, (state.eyeMolePressed ? 2.2 : 3.2) + molePulse * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Mũi tên hướng dẫn kéo nắp trượt khi đã ấn nốt ruồi son
        if (state.eyeMolePressed && state.slideOffset < 28) {
          ctx.fillStyle = '#ffe082';
          ctx.font = `bold 6.5px ${FONT_SANS}`;
          ctx.fillText('➔ Kéo ngang', eyeX + 28, eyeY + 12);
        }
      }
    } else if (state.stage === 2) {
      // --- GIAI ĐOẠN 2: GHÉP MỘNG SONG DIỆN & 3 CHỐT ÂM DƯƠNG ---
      if (!state.isBackSide) {
        // Nửa đỏ cố định bên trái
        if (window.GameAssets.maskRedHalf) {
          ctx.drawImage(window.GameAssets.maskRedHalf, cx - 44, cy - 50, 44, 100);
        } else {
          ctx.fillStyle = '#8a201c';
          ctx.fillRect(cx - 44, cy - 50, 44, 100);
        }

        // Vẽ 3 Ổ Chốt Gỗ Tròn (Tumbler Pins) dọc theo đường rãnh sống mũi (cx) khi chưa khóa mộng
        if (!state.dovetailLocked) {
          const pinStates = [
            { y: cy - 28, ok: state.pinsUnlocked, hover: state.hoverTarget === 'pin_1', label: 'Trán' },
            { y: cy,      ok: state.pinsUnlocked, hover: state.hoverTarget === 'pin_2', label: 'Mũi' },
            { y: cy + 28, ok: state.pinsUnlocked,    hover: state.hoverTarget === 'pin_3', label: 'Cằm' }
          ];
          pinStates.forEach((p, idx) => {
            // Chốt nhô ra chặn đường rãnh nếu chưa đúng, thụt sâu vào trong nếu đã đúng
            const protrudeX = p.ok ? cx - 3 : cx + 3;
            ctx.fillStyle = p.ok ? '#2b5434' : '#8a5a2b';
            ctx.beginPath();
            ctx.arc(protrudeX, p.y, p.hover ? 6.5 : 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = p.ok ? '#58d68d' : (p.hover ? '#ffffff' : '#ecc554');
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 5.5px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${idx + 1}`, protrudeX, p.y + 2);
            ctx.textAlign = 'left';
          });
        }

        // Nửa trắng trượt từ trên xuống
        const whiteY = (cy - 50) + state.whiteHalfSlideY;
        const whiteX = state.dovetailLocked ? cx : cx + 4;
        if (window.GameAssets.maskWhiteHalf) {
          ctx.drawImage(window.GameAssets.maskWhiteHalf, whiteX, whiteY, 44, 100);
        } else {
          ctx.fillStyle = '#eae2d3';
          ctx.fillRect(whiteX, whiteY, 44, 100);
        }

        // Khung gợi ý kéo trượt Nửa Trắng khi 3 chốt đã mở
        if (state.pinsUnlocked && !state.dovetailLocked) {
          ctx.strokeStyle = '#58d68d';
          ctx.lineWidth = 1.2;
          ctx.setLineDash([3, 2]);
          ctx.strokeRect(whiteX, whiteY, 44, 100);
          ctx.setLineDash([]);
          ctx.fillStyle = '#58d68d';
          ctx.font = `bold 6.5px ${FONT_SANS}`;
          ctx.fillText('⬇️ Kéo xuống', whiteX + 2, whiteY - 4);
        }

        // Đường chỉ sáng Kintsugi & Lỗ mộng dưới cằm khi đã trượt khít
        if (state.dovetailLocked) {
          ctx.strokeStyle = state.hasInsertedEbonyPin ? `rgba(255, 222, 90, ${state.kintsugiGlow})` : '#573b26';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 48);
          ctx.lineTo(cx, cy + 48);
          ctx.stroke();

          // Lỗ mộng vuông dưới cằm hoặc Chốt gỗ mun đã đóng
          const chinHover = state.hoverTarget === 'chin_mortise';
          ctx.fillStyle = state.hasInsertedEbonyPin ? '#140f18' : (chinHover ? '#58d68d' : '#080504');
          ctx.fillRect(cx - 4, cy + 43, 8, 8);
          ctx.strokeStyle = state.hasInsertedEbonyPin ? '#ecc554' : '#58d68d';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(cx - 4, cy + 43, 8, 8);

          if (!state.hasInsertedEbonyPin) {
            ctx.fillStyle = '#58d68d';
            ctx.font = `bold 6px ${FONT_SANS}`;
            ctx.textAlign = 'center';
            ctx.fillText('⬆️ Click đóng Chốt Gỗ Mun', cx, cy + 61);
            ctx.textAlign = 'left';
          }
        }
      } else {
        // Mặt sau gáy: Lạc khoản chữ Nôm dát vàng phát sáng
        const backImg = state.goldCalligraphyRevealed
          ? window.GameAssets.maskBackGold
          : window.GameAssets.maskBackClean;
        if (backImg) {
          ctx.drawImage(backImg, cx - 44, cy - 50, 88, 100);
        } else {
          ctx.fillStyle = '#3a2414';
          ctx.fillRect(cx - 44, cy - 50, 88, 100);
        }
      }
    }

    // Vẽ hạt sáp ong / bụi sơn văng ra
    state.waxParticles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1.0;

    // 6. Ngọn đèn dầu tương tác xoay 360 độ
    ctx.fillStyle = state.hoverTarget === 'lamp_handle' || state.isDraggingLamp ? '#ffe082' : '#d49b32';
    ctx.beginPath();
    ctx.arc(lampX, lampY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(lampX, lampY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffe082';
    ctx.font = `bold 6.5px ${FONT_SANS}`;
    ctx.fillText(`🏮 ${state.lampAngle}°`, lampX - 14, lampY - 12);

    ctx.restore();
    // 7. BẢNG ĐIỀU KHIỂN & CÂU ĐỐ BÊN TRÁI (x: 18..120, y: 38..234)
    ctx.fillStyle = '#181220';
    ctx.fillRect(18, 38, 104, 196);
    ctx.strokeStyle = '#4e3922';
    ctx.strokeRect(18, 38, 104, 196);

    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 7.2px ${FONT_SANS}`;
    ctx.fillText('THAO TÁC CHUỘT:', 24, 52);

    if (state.stage === 0) {
      // Nút Lật Mặt Trước / Sau
      ctx.fillStyle = state.hoverTarget === 'flip_btn' ? '#8c4f2b' : (state.isBackSide ? '#6e3c1e' : '#281c34');
      ctx.fillRect(24, 62, 92, 22);
      ctx.strokeStyle = '#ecc554';
      ctx.strokeRect(24, 62, 92, 22);
      ctx.fillStyle = '#fff';
      ctx.font = `bold 6.8px ${FONT_SANS}`;
      ctx.fillText(state.isBackSide ? '↻ Lật Ra Mặt Trước' : '↺ Lật Xem Mặt Sau', 28, 76);

      // Nút Preset góc sáng
      ctx.fillStyle = state.hoverTarget === 'preset_90' ? '#3a2a4a' : '#22182c';
      ctx.fillRect(24, 90, 92, 18);
      ctx.strokeStyle = '#755423';
      ctx.strokeRect(24, 90, 92, 18);
      ctx.fillStyle = '#f5ecc9';
      ctx.font = `6.5px ${FONT_SANS}`;
      ctx.fillText('💡 Rọi Đỉnh Đầu (90°)', 28, 102);

      ctx.fillStyle = state.hoverTarget === 'preset_270' ? '#3a2a4a' : '#22182c';
      ctx.fillRect(24, 114, 92, 18);
      ctx.strokeStyle = '#755423';
      ctx.strokeRect(24, 114, 92, 18);
      ctx.fillStyle = '#f5ecc9';
      ctx.fillText('💡 Hắt Từ Cằm (270°)', 28, 126);

      ctx.fillStyle = '#c8beae';
      ctx.font = `6px ${FONT_SANS}`;
      ctx.fillText('• Kéo đèn 🏮 xoay 360°', 24, 150);
      ctx.fillText('• Lật mặt sau & click chuột', 24, 162);
      ctx.fillText('  vào 2 nút sáp ong vàng', 24, 173);
      ctx.fillText('  để cạy lớp niêm phong.', 24, 184);
    } else if (state.stage === 1) {
      // Công cụ Dao cạo mộc
      ctx.fillStyle = '#4a2518';
      ctx.fillRect(24, 62, 92, 32);
      ctx.strokeStyle = '#ecc554';
      ctx.strokeRect(24, 62, 92, 32);
      ctx.fillStyle = '#ecc554';
      ctx.font = `bold 6.8px ${FONT_SANS}`;
      ctx.fillText(state.hasToolChisel ? '✓ Đang cầm dao cạo' : '👉 Chọn dao cạo mộc', 26, 75);
      ctx.fillStyle = '#f5ecc9';
      ctx.font = `5.8px ${FONT_SANS}`;
      ctx.fillText('Giữ chuột trái rê lên mặt nạ', 26, 87);

      // Thanh Tiến độ cạo
      ctx.fillStyle = '#22182c';
      ctx.fillRect(24, 102, 92, 22);
      ctx.fillStyle = 'rgba(88, 214, 141, 0.28)';
      ctx.fillRect(24, 102, Math.round(92 * (state.scrapePercent / 100)), 22);
      ctx.strokeStyle = '#58d68d';
      ctx.strokeRect(24, 102, 92, 22);
      ctx.fillStyle = '#58d68d';
      ctx.font = `bold 6.8px ${FONT_SANS}`;
      ctx.fillText(`ĐÃ CẠO SƠN: ${state.scrapePercent}%`, 29, 116);

      if (state.compartmentUnlocked) {
        ctx.fillStyle = state.eyeMolePressed ? '#1f3d28' : '#8a2424';
        ctx.fillRect(24, 132, 92, 22);
        ctx.strokeStyle = '#ecc554';
        ctx.strokeRect(24, 132, 92, 22);
        ctx.fillStyle = '#fff';
        ctx.font = `bold 6.2px ${FONT_SANS}`;
        ctx.fillText(state.eyeMolePressed ? '✓ ĐÃ BẬT LÒ XO TRE' : '🔴 CLICK NỐT RUỒI SON', 27, 146);

        if (state.eyeMolePressed) {
          ctx.fillStyle = state.slideOffset >= 28 ? '#1f3d28' : '#302244';
          ctx.fillRect(24, 160, 92, 22);
          ctx.strokeStyle = '#a882dd';
          ctx.strokeRect(24, 160, 92, 22);
          ctx.fillStyle = '#fff';
          ctx.font = `bold 6.2px ${FONT_SANS}`;
          ctx.fillText(state.slideOffset >= 28 ? (state.silkPacketOpened ? '✓ ĐÃ MỞ GÓI LỤA' : '🎁 CLICK MỞ GÓI LỤA') : '➡️ KÉO TRƯỢT HỐC MẮT', 27, 174);
        }

        if (state.hasLaMiaKey) {
          ctx.fillStyle = '#ecc554';
          ctx.font = `bold 6.2px ${FONT_SANS}`;
          ctx.fillText('★ ĐÃ LẤY CHÌA LÁ MÍA!', 25, 202);
        }
      }
    } else if (state.stage === 2) {
      ctx.fillStyle = '#ecc554';
      ctx.font = `bold 6.2px ${FONT_SANS}`;
      ctx.fillText('3 CHỐT ÂM DƯƠNG (CLICK XOAY):', 22, 63);

      // Chốt 1: Trán ("Thần") - không tô xanh lộ đáp án lẻ tẻ, chỉ báo khi cả 3 chốt khớp!
      ctx.fillStyle = state.hoverTarget === 'pin_1' ? '#352744' : '#22182c';
      ctx.fillRect(24, 70, 92, 22);
      ctx.strokeStyle = state.pinsUnlocked ? '#58d68d' : '#88622c';
      ctx.strokeRect(24, 70, 92, 22);
      ctx.fillStyle = '#f5ecc9';
      ctx.font = `6.2px ${FONT_SANS}`;
      ctx.fillText(`1.Trán: ${WEATHER_OPTS[state.pin1_weather]}`, 27, 84);

      // Chốt 2: Sống Mũi ("Tâm")
      ctx.fillStyle = state.hoverTarget === 'pin_2' ? '#352744' : '#22182c';
      ctx.fillRect(24, 98, 92, 22);
      ctx.strokeStyle = state.pinsUnlocked ? '#58d68d' : '#88622c';
      ctx.strokeRect(24, 98, 92, 22);
      ctx.fillStyle = '#f5ecc9';
      ctx.fillText(`2.Mũi: ${EMOTION_OPTS[state.pin2_emotion]}`, 27, 112);

      // Chốt 3: Cằm ("Khí")
      ctx.fillStyle = state.hoverTarget === 'pin_3' ? '#352744' : '#22182c';
      ctx.fillRect(24, 126, 92, 22);
      ctx.strokeStyle = state.pinsUnlocked ? '#58d68d' : '#88622c';
      ctx.strokeRect(24, 126, 92, 22);
      ctx.fillStyle = '#f5ecc9';
      ctx.fillText(`3.Cằm: ${FIRE_OPTS[state.pin3_fire]}`, 27, 140);

      if (state.pinsUnlocked && !state.dovetailLocked) {
        ctx.fillStyle = state.hoverTarget === 'white_half_drag' ? '#8c4f2b' : '#6e3c1e';
        ctx.fillRect(24, 156, 92, 24);
        ctx.strokeStyle = '#58d68d';
        ctx.strokeRect(24, 156, 92, 24);
        ctx.fillStyle = '#fff';
        ctx.font = `bold 6.2px ${FONT_SANS}`;
        ctx.fillText('⬇️ KÉO TRƯỢT NỬA TRẮNG', 26, 171);
      }

      if (state.dovetailLocked && !state.hasInsertedEbonyPin) {
        ctx.fillStyle = state.hoverTarget === 'chin_mortise' ? '#2c4736' : '#1c2826';
        ctx.fillRect(24, 156, 92, 24);
        ctx.strokeStyle = '#58d68d';
        ctx.strokeRect(24, 156, 92, 24);
        ctx.fillStyle = '#58d68d';
        ctx.font = `bold 6.2px ${FONT_SANS}`;
        ctx.fillText(state.ebonyPinSelected ? '✓ Đã chọn chốt mun' : '👉 Chọn chốt gỗ mun', 27, 171);
      }

      if (state.dovetailLocked && state.hasInsertedEbonyPin) {
        ctx.fillStyle = state.isBackSide ? '#2e1c38' : '#6e3c1e';
        ctx.fillRect(24, 186, 92, 22);
        ctx.strokeStyle = '#ecc554';
        ctx.strokeRect(24, 186, 92, 22);
        ctx.fillStyle = '#ecc554';
        ctx.font = `bold 6.2px ${FONT_SANS}`;
        ctx.fillText(state.isBackSide ? '↻ Xem Mặt Trước' : '📜 LẬT XEM LẠC KHOẢN', 27, 200);
      }
    }

    // 8. BẢNG SUY LUẬN & TƯ LIỆU BÊN PHẢI (x: 326..468, y: 38..234)
    ctx.fillStyle = '#181220';
    ctx.fillRect(326, 38, 142, 196);
    ctx.strokeStyle = '#4e3922';
    ctx.strokeRect(326, 38, 142, 196);

    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 7.2px ${FONT_SANS}`;
    ctx.fillText('SỔ TAY QUAN SÁT:', 332, 52);

    if (state.stage === 0) {
      const totalWax = (state.waxLeftProgress >= 3 ? 1 : 0) + (state.waxRightProgress >= 3 ? 1 : 0);
      ctx.font = `6.2px ${FONT_SANS}`;
      ctx.fillStyle = state.discoveredTop ? '#58d68d' : '#888';
      ctx.fillText(`• Góc 90°: ${state.discoveredTop ? '✓ Vết đục & bồ hóng' : 'Chưa soi đỉnh đầu'}`, 332, 70);
      ctx.fillStyle = state.discoveredBottom ? '#58d68d' : '#888';
      ctx.fillText(`• Góc 270°: ${state.discoveredBottom ? '✓ Hốc tối dở dang' : 'Chưa soi hắt cằm'}`, 332, 86);
      ctx.fillStyle = state.discoveredDual ? '#58d68d' : '#888';
      ctx.fillText(`• Phôi thô: ${state.discoveredDual ? '✓ Đã nhận diện' : 'Cần xoay đủ 2 góc'}`, 332, 102);
      ctx.fillStyle = state.discoveredBack ? '#58d68d' : '#888';
      ctx.fillText(`• Sáp ong: ${state.discoveredBack ? '✓ Đã gỡ 2 nút sáp' : `Đã gỡ ${totalWax}/2 nút sáp`}`, 332, 118);

      ctx.fillStyle = '#aba291';
      ctx.font = `5.8px ${FONT_SANS}`;
      ctx.fillText('👉 Lật mặt sau và dùng chuột', 332, 144);
      ctx.fillText('click cạy đủ 2 nút sáp ong', 332, 156);
      ctx.fillText('ruồi màu hổ phách để thu thập', 332, 168);
      ctx.fillText('dấu vết bí mật dưới lớp niêm phong.', 332, 180);
    } else if (state.stage === 1) {
      ctx.font = `6.2px ${FONT_SANS}`;
      ctx.fillStyle = '#ecc554';
      ctx.fillText('BÍ MẬT KỊCH BẢN TẦNG 3:', 332, 70);
      ctx.fillStyle = '#f5ecc9';
      ctx.font = `5.8px ${FONT_SANS}`;
      ctx.fillText('« Thân dẫu cháy, Hồn chẳng phai »', 332, 84);
      ctx.fillText('Lớp vôi gai che kín đường ghép mộc.', 332, 96);
      ctx.fillText('1. Rê chuột cạo sạch sơn bồi.', 332, 110);
      if (state.compartmentUnlocked) ctx.fillText('2. Quan sát nốt ruồi son vừa lộ ra.', 332, 122);
      if (state.eyeMolePressed) ctx.fillText('3. Giữ chuột kéo ngang nắp hốc mắt.', 332, 134);

      if (state.hasLaMiaKey) {
        ctx.fillStyle = '#58d68d';
        ctx.font = `bold 6.2px ${FONT_SANS}`;
        ctx.fillText('✓ VẬT TÍN ĐÃ THU NHẬN:', 332, 156);
        ctx.fillStyle = '#f5ecc9';
        ctx.font = `5.8px ${FONT_SANS}`;
        ctx.fillText('• Chìa khóa lá mía đồng thau', 332, 170);
        ctx.fillText('• Khẩu quyết: "Mộng tại tâm,', 332, 182);
        ctx.fillText('  thần tại nhãn"', 332, 194);
      }
    } else if (state.stage === 2) {
      // Trích nguyên văn thơ trong Di Thư để người chơi tự suy luận, không ghi sẵn đáp án lộ liễu
      ctx.font = `6.2px ${FONT_SANS}`;
      ctx.fillStyle = '#ecc554';
      ctx.fillText('TRÍCH DI THƯ KÉP TRƯỞNG:', 332, 68);
      ctx.fillStyle = '#f5ecc9';
      ctx.font = `5.8px ${FONT_SANS}`;
      ctx.fillText('« Đêm ấy trăng mờ mây phủ,', 332, 84);
      ctx.fillText('  chẳng gió chẳng mưa... »', 332, 95);
      ctx.fillText('« Ngoài mặt giận dữ thiêu làng,', 332, 111);
      ctx.fillText('  trong lòng nhỏ máu khóc than »', 332, 122);
      ctx.fillText('« Thân xác hóa tro tàn,', 332, 138);
      ctx.fillText('  tinh thần bất diệt... »', 332, 149);

      if (state.dovetailLocked && state.hasInsertedEbonyPin) {
        ctx.fillStyle = '#58d68d';
        ctx.font = `bold 6.2px ${FONT_SANS}`;
        ctx.fillText('★ MẶT NẠ ĐÃ HOÀN NGUYÊN!', 332, 172);
        ctx.fillStyle = '#ecc554';
        ctx.font = `5.8px ${FONT_SANS}`;
        ctx.fillText('Lạc khoản chữ Nôm sáng bừng:', 332, 186);
        ctx.fillText('« Thân gánh vạn hỏa kiếp »', 332, 198);
        ctx.fillText('« Tâm chiếu nhất phiến đan »', 332, 210);
      } else if (state.pinsUnlocked) {
        ctx.fillStyle = '#58d68d';
        ctx.font = `bold 6px ${FONT_SANS}`;
        ctx.fillText('✓ 3 chốt đã mở! Hãy kéo trượt', 332, 174);
        ctx.fillText('Nửa Mặt Nạ Trắng xuống khớp.', 332, 186);
      }
    }

    // 9. Vẽ biểu tượng dụng cụ đi theo con trỏ chuột (Visual Tool Cursor)
    if (state.stage === 1 && state.hasToolChisel && !state.compartmentUnlocked && state.hoverTarget === 'scrape_zone') {
      ctx.save();
      // Hit-testing uses artifact coordinates; the cursor is drawn outside its scaled layer.
      ctx.translate(220 + (state.mouseX - 220) * 1.25, 135 + (state.mouseY - 135) * 1.25);
      ctx.fillStyle = '#d49b32';
      ctx.fillRect(0, 0, 14, 4);
      ctx.fillStyle = '#dfe6e9';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -4);
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function checkAllWaxRemoved(addJournalClue, onDialogueRequest) {
    if (state.waxLeftProgress >= 3 && state.waxRightProgress >= 3 && !state.discoveredBack) {
      state.discoveredBack = true;
      if (addJournalClue) addJournalClue('[Khoang rỗng sáp ong]');
      if (window.GameAudio) {
        window.GameAudio.clueDiscovered();
        window.GameAudio.drumTung();
      }
      if (onDialogueRequest) {
        onDialogueRequest(
          'An (Cạy sạch hai nút sáp ong niêm phong)',
          'Hai nút sáp ong ruồi màu hổ phách vừa bong ra, để lộ hai hốc rỗng sâu bên trong thớ gỗ!\nBên trong khối gỗ mít này chắc chắn đang cất giấu một cơ quan bí mật của tiền nhân.'
        );
      }
    }
  }

  function handleClick(x, y, addJournalClue, onDialogueRequest) {
    if (!state.active) return false;

    const pt = artifactPoint(x, y);
    const realX = x; const realY = y;
    x = pt.x; y = pt.y;
    const cx = 220;
    const cy = 135;

    // Nút Đóng [X]
    if (x >= 395 && y <= 32) {
      close();
      return true;
    }

    // --- XỬ LÝ CLICK GIAI ĐOẠN 0 ---
    if (state.stage === 0) {
      // Nút Lật Mặt Trước / Sau
      if (x >= 24 && x <= 116 && y >= 62 && y <= 84) {
        state.isBackSide = !state.isBackSide;
        if (window.GameAudio) window.GameAudio.drumCac();
        return true;
      }

      // Cạy 3 nút sáp ong ở mặt sau
      if (state.isBackSide) {
        if (state.waxLeftProgress < 3 && Math.hypot(x - (cx - 18), y - (cy - 18)) <= 14) {
          state.waxLeftProgress++;
          spawnWaxCrumbs(cx - 18, cy - 18);
          if (window.GameAudio) window.GameAudio.scrapePaint();
          checkAllWaxRemoved(addJournalClue, onDialogueRequest);
          return true;
        }
        if (state.waxRightProgress < 3 && Math.hypot(x - (cx - 18), y - (cy + 18)) <= 14) {
          state.waxRightProgress++;
          spawnWaxCrumbs(cx - 18, cy + 18);
          if (window.GameAudio) window.GameAudio.scrapePaint();
          checkAllWaxRemoved(addJournalClue, onDialogueRequest);
          return true;
        }

      }

      // Preset 90°
      if (x >= 24 && x <= 116 && y >= 90 && y <= 108) {
        state.lampAngle = 90;
        if (window.GameAudio) window.GameAudio.drumCac();
        return true;
      }

      // Preset 270°
      if (x >= 24 && x <= 116 && y >= 114 && y <= 132) {
        state.lampAngle = 270;
        if (window.GameAudio) window.GameAudio.drumCac();
        return true;
      }
    }

    // --- XỬ LÝ CLICK GIAI ĐOẠN 1 ---
    if (state.stage === 1) {
      if (realX >= 24 && realX <= 116 && realY >= 62 && realY <= 94) { state.hasToolChisel = !state.hasToolChisel; return true; }
      const eyeX = cx - 36 + state.slideOffset;
      const eyeY = cy - 22;

      const eyeMoleHit = (state.compartmentUnlocked && !state.eyeMolePressed && (
        Math.hypot(x - (eyeX + 13), y - (eyeY + 9)) <= 12 ||
        (x >= 24 && x <= 116 && y >= 132 && y <= 154)
      ));

      if (eyeMoleHit) {
        state.eyeMolePressed = true;
        if (window.GameAudio) window.GameAudio.springClick();
        if (window.GameEngine && window.GameEngine.showToast) {
          window.GameEngine.showToast('★ TÁCH! Lò xo tre bật chốt, hãy kéo ngang nắp hốc mắt!');
        }
        if (onDialogueRequest) {
          onDialogueRequest(
            'An (Nhấn nốt ruồi son)',
            'Tiếng lò xo tre bật tách bên trong thớ gỗ mít, chốt ngầm giữ nắp trượt đã mở!\nBây giờ mình có thể giữ chuột kéo ngang mảng gỗ hốc mắt (kéo sang phải) để lộ khoang rỗng.'
          );
        }
        return true;
      }

      const packetHit = (state.slideOffset >= 28 && !state.silkPacketOpened && (
        (x >= cx - 38 && x <= cx - 8 && y >= eyeY - 4 && y <= eyeY + 22) ||
        (x >= 24 && x <= 116 && y >= 160 && y <= 190)
      ));

      if (packetHit) {
        state.silkPacketOpened = true;
        state.hasLaMiaKey = true;
        if (window.GameAudio) {
          window.GameAudio.clueDiscovered();
          window.GameAudio.doorUnlocked();
        }
        if (window.GameEngine && window.GameEngine.world) {
          window.GameEngine.world.hasLaMiaKey = true;
        }
        if (addJournalClue) {
          addJournalClue('[Chìa khóa lá mía đồng thau]');
          addJournalClue('[Khẩu quyết: Mộng tại tâm, thần tại nhãn]');
        }
        if (window.GameEngine && window.GameEngine.showToast) {
          window.GameEngine.showToast('🏆 ĐÃ THU NHẬN: CHÌA KHÓA LÁ MÍA & MẨU GIẤY GHI CHÚ!');
        }
        if (onDialogueRequest) {
          onDialogueRequest(
            'An (Gỡ gói vải lụa điều)',
            'Bên trong là chiếc chìa khóa lá mía bằng đồng thau cùng mảnh giấy: "Mộng tại tâm, thần tại nhãn".\nChuôi chìa có hình vảy rồng đồng bộ với hoa văn cột cái ở đại sảnh.'
          );
        }
        return true;
      }
    }

    // --- XỬ LÝ CLICK GIAI ĐOẠN 2 ---
    if (state.stage === 2) {
      // Click xoay Chốt 1 (Trán) trên bảng hoặc trực tiếp trên chốt số 1 ở sống mũi
      if (!state.dovetailLocked && ((x >= 24 && x <= 116 && y >= 70 && y <= 92) || Math.hypot(x - cx, y - (cy - 28)) <= 11)) {
        state.pin1_weather = (state.pin1_weather + 1) % 4;
        if (window.GameAudio) window.GameAudio.dialClick();
        return true;
      }

      // Click xoay Chốt 2 (Sống Mũi)
      if (!state.dovetailLocked && ((x >= 24 && x <= 116 && y >= 98 && y <= 120) || Math.hypot(x - cx, y - cy) <= 11)) {
        state.pin2_emotion = (state.pin2_emotion + 1) % 3;
        if (window.GameAudio) window.GameAudio.dialClick();
        return true;
      }

      // Click xoay Chốt 3 (Cằm)
      if (!state.dovetailLocked && ((x >= 24 && x <= 116 && y >= 126 && y <= 148) || Math.hypot(x - cx, y - (cy + 28)) <= 11)) {
        state.pin3_fire = (state.pin3_fire + 1) % 2;
        if (window.GameAudio) window.GameAudio.dialClick();
        return true;
      }

      if (state.dovetailLocked && !state.hasInsertedEbonyPin && realX >= 24 && realX <= 116 && realY >= 156 && realY <= 180) {
        state.ebonyPinSelected = !!(window.GameEngine && window.GameEngine.world && window.GameEngine.world.floor3 && window.GameEngine.world.floor3.hasEbonyPin);
        if (state.ebonyPinSelected) {
          if (window.GameAudio) window.GameAudio.slotDrop();
          if (window.GameEngine && window.GameEngine.showToast) {
            window.GameEngine.showToast('★ ĐÃ CHỌN CHỐT GỖ MUN: Hãy click vào lỗ mộng dưới cằm!');
          }
        }
        return true;
      }

      // Đóng then khóa gỗ mun
      const insertPinHit = (state.dovetailLocked && !state.hasInsertedEbonyPin && (
        Math.hypot(x - cx, y - (cy + 47)) <= 15 ||
        (x >= 24 && x <= 116 && y >= 156 && y <= 180)
      ));

      if (insertPinHit && state.ebonyPinSelected && window.GameEngine && window.GameEngine.world && window.GameEngine.world.floor3 && window.GameEngine.world.floor3.hasEbonyPin && realX > 122) {
        state.hasInsertedEbonyPin = true;
        state.goldCalligraphyRevealed = true;
        if (window.GameAudio) {
          window.GameAudio.pinHammer();
          window.GameAudio.drumTung();
          window.GameAudio.photoRevealed();
        }

        window.GameEngine.world.floor3.hasEbonyPin = false;
        revealDelay = 0.8;

        if (window.GameEngine && window.GameEngine.world) {
          window.GameEngine.world.floor3.hasDualMask1930 = true;
          window.GameEngine.world.readyForEnding = true;
        }

        if (onDialogueRequest) {
          onDialogueRequest(
            'An (Kinh ngạc trước Lạc Khoản dát vàng)',
            'Chiếc then khóa gỗ mun vừa cắm vào, một đường chỉ sáng vàng chạy dọc sống mũi nối liền hai nửa!\nPhía sau gáy, hai dòng lạc khoản chữ Nôm sáng bừng lên: "Thân gánh vạn hỏa kiếp — Tâm chiếu nhất phiến đan".',
            () => {
              onDialogueRequest(
                'An',
                'Bác Cảnh... cháu đã hiểu vì sao cụ thân sinh không bao giờ phá chiếc mặt nạ này ra.\nCụ không muốn xóa bỏ tội ác, nhưng cụ muốn người đời hiểu được nỗi đau đằng sau tội ác đó.',
                () => {
                  onDialogueRequest(
                    'Bác Cảnh',
                    'Gần một thế kỷ... cuối cùng cũng có người đọc được trọn vẹn gương mặt của ông ấy.\nHãy mang chiếc mặt nạ ra đặt lên tủ kính ngoài Đại Sảnh để hoàn tất buổi trưng bày đi cháu!'
                  );
                }
              );
            }
          );
        }
        return true;
      }

      // Nút Lật Mặt Trước / Lạc Khoản sau gáy
      if (state.dovetailLocked && state.hasInsertedEbonyPin && x >= 24 && x <= 116 && y >= 186 && y <= 208) {
        state.isBackSide = !state.isBackSide;
        if (window.GameAudio) window.GameAudio.drumCac();
        return true;
      }
    }

    return false;
  }

  return {
    state,
    open,
    close,
    update,
    render,
    handleClick,
    cancelGesture,
    hoverAt: (x, y) => { const p = artifactPoint(x, y); return detectHoverTarget(p.x, p.y); }
  };
})();
