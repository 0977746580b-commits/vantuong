// HỌA DIỆN (The Dual Mask) - Altar Mode (Bàn Thờ Tam Vị Thánh Tổ Nghề Sân Khấu)
// Cận cảnh Án gian sơn son thếp vàng, hoành phi "Thần truyền chánh khí", Lư đồng cổ & Nghi thức dâng lễ
window.AltarMode = (function () {
  const FONT_SANS = '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const state = {
    active: false,
    placedBetel: false,
    placedIncense: false,
    completed: false,
    smokeParticles: []
  };

  let mousePos = { x: -1, y: -1 };

  // Init smoke particles
  for (let i = 0; i < 22; i++) {
    state.smokeParticles.push({
      x: 240 + (Math.random() - 0.5) * 6,
      y: 135 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 8,
      vy: -14 - Math.random() * 12,
      alpha: Math.random() * 0.45,
      size: 1.2 + Math.random() * 2
    });
  }

  // Mouse position tracking on canvas for responsive hover feedback
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

    if (e.code === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      close();
      return;
    }

    if (['KeyA', 'KeyD', 'KeyE', 'Space', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.code)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }, true);

  function isActive() {
    return state.active;
  }

  function open(hasOfferings, hasMatches, onDialogue) {
    state.active = true;
    if (window.GameAudio) window.GameAudio.journalOpen();

    if (onDialogue) {
      if (state.completed) {
        onDialogue(
          'An',
          'Khói hương trầm vẫn bay nghi ngút, đĩa trầu cau ngũ phương thơm đượm lòng thành.\nBác Cảnh đã trao chiếc chìa khóa cổ để mở Cửa sắt lên Thư khố Tầng 2.'
        );
      } else if (!hasOfferings) {
        onDialogue(
          'An',
          'Án gian thờ Tam Vị Thánh Tổ Hát Bội uy nghiêm, nhưng khói hương đã tàn lạnh...\nĐể xin phép Tổ nghề và chiếm trọn lòng tin của Bác Cảnh, mình cần về ngăn kéo xưởng phục chế lấy Đĩa trầu cau khô và Bó hương trầm!'
        );
      } else if (!hasMatches) {
        onDialogue(
          'An',
          'Đã mang theo đủ lễ vật từ xưởng phục chế: Đĩa trầu têm cánh phượng và ba nén hương trầm...\nNhưng An chưa có diêm để châm lửa thắp nhang! Hãy ra chiếc bàn gỗ nhỏ của Bác Cảnh ngoài hành lang để lấy Hộp diêm quẹt.'
        );
      } else {
        onDialogue(
          'An',
          'Đã có đủ lễ vật và hộp diêm quẹt của Bác Cảnh.\nHãy thành kính đặt đĩa trầu cau lên án gian, châm lửa vào ba nén hương trầm và cắm vào lư đồng tam khí theo đúng nghi thức dân gian!'
        );
      }
    }
  }

  function close() {
    state.active = false;
    if (window.GameAudio) window.GameAudio.journalClose();
  }

  function update(dt) {
    if (!state.active) return;

    // Animate incense smoke when incense is burning
    if (state.placedIncense || state.completed) {
      state.smokeParticles.forEach(p => {
        p.y += p.vy * dt;
        p.x += p.vx * dt + Math.sin(p.y * 0.08) * 0.4;
        p.alpha -= dt * 0.22;
        p.size += dt * 0.8;
        if (p.y < 50 || p.alpha <= 0) {
          p.y = 138;
          p.x = 240 + (Math.random() - 0.5) * 6;
          p.vx = (Math.random() - 0.5) * 10;
          p.vy = -16 - Math.random() * 14;
          p.alpha = 0.45 + Math.random() * 0.3;
          p.size = 1.2;
        }
      });
    }
  }

  function render(ctx, V_WIDTH, V_HEIGHT) {
    if (!state.active) return;

    const mx = mousePos.x;
    const my = mousePos.y;
    const cx = 240;
    const cy = 138;

    // 1. Dark Sacred Background
    ctx.fillStyle = 'rgba(14, 8, 12, 0.96)';
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    // Gold Double Border
    ctx.strokeStyle = '#c89d42';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 8, V_WIDTH - 20, V_HEIGHT - 16);
    ctx.strokeStyle = '#6e501e';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 12, V_WIDTH - 28, V_HEIGHT - 24);

    // 2. Header Bar
    ctx.fillStyle = '#221118';
    ctx.fillRect(16, 14, V_WIDTH - 32, 22);
    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 8.5px ${FONT_SANS}`;
    ctx.fillText('🏮 CẬN CẢNH: BÀN THỜ TAM VỊ THÁNH TỔ NGHỀ SÂN KHẤU (GIAN THỜ TỔ)', 24, 28);

    // Close Button [ESC / X]
    const isCloseHover = (mx >= V_WIDTH - 92 && mx <= V_WIDTH - 18 && my >= 14 && my <= 36);
    ctx.fillStyle = isCloseHover ? '#4a1d22' : '#2b161c';
    ctx.fillRect(V_WIDTH - 92, 16, 74, 18);
    ctx.strokeStyle = isCloseHover ? '#ff4d4d' : '#8c3535';
    ctx.lineWidth = 1;
    ctx.strokeRect(V_WIDTH - 92, 16, 74, 18);

    ctx.fillStyle = isCloseHover ? '#ffffff' : '#ff8787';
    ctx.font = `bold 8px monospace`;
    ctx.fillText('ĐÓNG [ESC / X]', V_WIDTH - 86, 28);

    // 3. Hoành Phi "THẦN TRUYỀN CHÁNH KHÍ" (神 傳 正 氣)
    const isPlaqueHover = (mx >= cx - 100 && mx <= cx + 100 && my >= 42 && my <= 68);
    ctx.fillStyle = isPlaqueHover ? '#6e1414' : '#5c1010';
    ctx.fillRect(cx - 100, 42, 200, 26);
    ctx.strokeStyle = isPlaqueHover ? '#fff' : '#ecc554';
    ctx.lineWidth = isPlaqueHover ? 2.5 : 2;
    ctx.strokeRect(cx - 100, 42, 200, 26);

    // Gold Corner Accents on Plaque
    ctx.fillStyle = '#ecc554';
    ctx.fillRect(cx - 98, 44, 4, 4);
    ctx.fillRect(cx + 94, 44, 4, 4);
    ctx.fillRect(cx - 98, 62, 4, 4);
    ctx.fillRect(cx + 94, 62, 4, 4);

    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 11px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('THẦN TRUYỀN CHÁNH KHÍ', cx, 55);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';

    if (isPlaqueHover) {
      ctx.fillStyle = 'rgba(236, 197, 84, 0.9)';
      ctx.font = `6px ${FONT_SANS}`;
      ctx.fillText('[Click: Khảo sát Hoành Phi]', cx - 44, 38);
    }

    // 4. Ba Bài Vị Tam Vị Thánh Tổ Sơn Son Thếp Vàng
    const tablets = [
      { x: cx - 48, label: 'TIỀN HIỀN\nKHAI SÁNG' },
      { x: cx,      label: 'THẬP NHỊ\nBAN TỔ' },
      { x: cx + 48, label: 'HẬU TẤN\nTÔN SƯ' }
    ];
    const isTabletsHover = (mx >= cx - 72 && mx <= cx + 72 && my >= 70 && my <= 122);

    tablets.forEach(t => {
      const tabW = 40;
      const tabH = 44;
      const tabX = t.x - tabW / 2;
      const tabY = 74;

      // Wooden Tablet Body
      ctx.fillStyle = isTabletsHover ? '#9e2222' : '#8a1c1c';
      ctx.fillRect(tabX, tabY, tabW, tabH);
      ctx.strokeStyle = isTabletsHover ? '#fff' : '#ecc554';
      ctx.lineWidth = isTabletsHover ? 2 : 1.5;
      ctx.strokeRect(tabX, tabY, tabW, tabH);

      // Inner subtle gold border
      ctx.strokeStyle = 'rgba(236, 197, 84, 0.45)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(tabX + 2, tabY + 2, tabW - 4, tabH - 4);

      // Gold lotus crown atop tablet
      ctx.fillStyle = '#ecc554';
      ctx.beginPath();
      ctx.arc(t.x, tabY, 5.5, Math.PI, 0);
      ctx.fill();

      // Tablet Text - centered, bold, fitted with maxWidth so it never overflows
      ctx.fillStyle = '#ecc554';
      ctx.font = `bold 5.2px ${FONT_SANS}`;
      ctx.textAlign = 'center';
      const lines = t.label.split('\n');
      ctx.fillText(lines[0], t.x, tabY + 18, tabW - 6);
      ctx.fillText(lines[1], t.x, tabY + 30, tabW - 6);
      ctx.textAlign = 'left';
    });

    if (isTabletsHover) {
      ctx.fillStyle = 'rgba(236, 197, 84, 0.9)';
      ctx.font = `6px ${FONT_SANS}`;
      ctx.fillText('[Click: Chiêm bái Bài Vị]', cx - 36, 73);
    }

    // 5. Án Gian Thờ Gỗ Sơn Son Thếp Vàng (Main Altar Table)
    ctx.fillStyle = '#451010';
    ctx.fillRect(cx - 130, 118, 260, 56);
    ctx.fillStyle = '#802020';
    ctx.fillRect(cx - 135, 118, 270, 8);
    ctx.strokeStyle = '#ecc554';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx - 135, 118, 270, 56);

    // Decorative carved golden apron on altar table
    ctx.strokeStyle = '#d4a237';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = cx - 120; x <= cx + 120; x += 20) {
      ctx.moveTo(x, 126);
      ctx.lineTo(x + 10, 134);
      ctx.lineTo(x + 20, 126);
    }
    ctx.stroke();

    // 6. Đôi Chân Đèn Dầu Đồng thắp sáng lung linh (Hai bên)
    const lamps = [cx - 95, cx + 95];
    lamps.forEach(lx => {
      const isLampHover = (mx >= lx - 14 && mx <= lx + 14 && my >= 114 && my <= 156);
      // Brass Candlestick / Lamp
      ctx.fillStyle = isLampHover ? '#d49b33' : '#b88628';
      ctx.fillRect(lx - 4, 126, 8, 26);
      ctx.fillRect(lx - 8, 148, 16, 5);
      ctx.fillRect(lx - 7, 124, 14, 4);

      // Flame glow
      const flicker = Math.sin(performance.now() * 0.008 + lx) * 1.5;
      const glowRadius = (isLampHover ? 22 : 16) + flicker;
      const fg = ctx.createRadialGradient(lx, 118, 1, lx, 118, glowRadius);
      fg.addColorStop(0, 'rgba(255, 235, 140, 0.75)');
      fg.addColorStop(0.5, 'rgba(235, 95, 30, 0.25)');
      fg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(lx, 118, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Flame tip
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lx, 118, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 7. Lư Đồng Cổ Tam Khí (Chính Giữa: cx = 240, y = 138)
    const isIncenseHover = (mx >= cx - 24 && mx <= cx + 24 && my >= 98 && my <= 166);

    ctx.fillStyle = isIncenseHover ? '#6e532b' : '#5c4524';
    ctx.beginPath();
    ctx.ellipse(cx, 146, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isIncenseHover ? '#fff' : '#c89d42';
    ctx.lineWidth = isIncenseHover ? 2 : 1.5;
    ctx.stroke();

    // Lư base and handles
    ctx.fillStyle = '#7a5a2e';
    ctx.fillRect(cx - 12, 158, 24, 6);
    // Left & right lion ear handles
    ctx.strokeStyle = isIncenseHover ? '#fff' : '#c89d42';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx - 24, 144, 5, 0, Math.PI * 2);
    ctx.arc(cx + 24, 144, 5, 0, Math.PI * 2);
    ctx.stroke();

    // 8. Slot 1: Đĩa Trầu Cau Ngũ Phương (bên trái: cx - 62 = 178, y = 145)
    const betelX = cx - 62;
    const betelY = 145;
    const isBetelHover = (mx >= betelX - 26 && mx <= betelX + 26 && my >= 122 && my <= 168);

    if (state.placedBetel || state.completed) {
      // Blue-and-white porcelain dish
      ctx.fillStyle = '#dbe5f0';
      ctx.beginPath();
      ctx.ellipse(betelX, betelY + 2, 18, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isBetelHover ? '#ecc554' : '#2b4d75';
      ctx.lineWidth = isBetelHover ? 2 : 1;
      ctx.stroke();

      // 5 Betel leaves arranged in pentagon (Lá trầu ngũ phương têm cánh phượng)
      ctx.fillStyle = '#2d6a36';
      for (let a = 0; a < 5; a++) {
        const rad = a * (Math.PI * 2 / 5);
        ctx.beginPath();
        ctx.ellipse(betelX + Math.cos(rad) * 7, betelY + Math.sin(rad) * 4, 5, 3, rad, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4 Areca Nut Quarters (Quả cau bổ tư vẹn tròn)
      ctx.fillStyle = '#c4894d';
      ctx.beginPath();
      ctx.arc(betelX - 3, betelY, 3, 0, Math.PI * 2);
      ctx.arc(betelX + 3, betelY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#58d68d';
      ctx.font = `bold 5.5px ${FONT_SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText('✓ ĐĨA TRẦU CAU', betelX - 2, betelY + 23);
      ctx.textAlign = 'left';
    } else {
      // Dotted slot for Betel Dish with active hover highlight
      ctx.strokeStyle = isBetelHover ? '#ffffff' : 'rgba(236, 197, 84, 0.7)';
      ctx.lineWidth = isBetelHover ? 2 : 1.2;
      ctx.setLineDash(isBetelHover ? [] : [3, 3]);
      ctx.strokeRect(betelX - 22, betelY - 14, 44, 28);
      ctx.setLineDash([]);

      ctx.fillStyle = isBetelHover ? '#ffffff' : 'rgba(236, 197, 84, 0.85)';
      ctx.font = `bold 6.5px ${FONT_SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText('[Ô ĐẶT LỄ]', betelX, betelY);
      ctx.fillText('Đĩa Trầu Cau', betelX, betelY + 9);

      if (isBetelHover) {
        ctx.fillStyle = '#58d68d';
        ctx.font = `bold 6px ${FONT_SANS}`;
        ctx.fillText('👉 CLICK ĐỂ ĐẶT LỄ', betelX, betelY - 18);
      }
      ctx.textAlign = 'left';
    }

    // 9. Slot 2: Ba Nén Tâm Nhang Trầm trong Lư Đồng (cx = 240, y = 138)
    if (state.placedIncense || state.completed) {
      // 3 Incense Sticks standing straight in bronze burner
      const stickXs = [cx - 4, cx, cx + 4];
      stickXs.forEach(sx => {
        ctx.strokeStyle = '#943828';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx, 144);
        ctx.lineTo(sx, 108);
        ctx.stroke();

        // Glowing red ember tip
        ctx.fillStyle = '#ff4d2e';
        ctx.beginPath();
        ctx.arc(sx, 108, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw smoke particles
      ctx.fillStyle = 'rgba(235, 225, 210, 0.35)';
      state.smokeParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#58d68d';
      ctx.font = `bold 5.5px ${FONT_SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText('✓ BA NÉN TÂM NHANG', cx + 10, 172);
      ctx.textAlign = 'left';
    } else {
      ctx.strokeStyle = isIncenseHover ? '#ffffff' : 'rgba(236, 197, 84, 0.7)';
      ctx.lineWidth = isIncenseHover ? 2 : 1;
      ctx.setLineDash(isIncenseHover ? [] : [2, 2]);
      ctx.strokeRect(cx - 18, 106, 36, 30);
      ctx.setLineDash([]);

      ctx.fillStyle = isIncenseHover ? '#ffffff' : 'rgba(236, 197, 84, 0.85)';
      ctx.font = `bold 6.5px ${FONT_SANS}`;
      ctx.textAlign = 'center';
      ctx.fillText('[Ô CẮM]', cx, 120);
      ctx.fillText('3 Nén Hương', cx, 128);

      if (isIncenseHover) {
        ctx.fillStyle = '#58d68d';
        ctx.font = `bold 6px ${FONT_SANS}`;
        ctx.fillText('👉 CLICK ĐỂ CẮM HƯƠNG', cx, 98);
      }
      ctx.textAlign = 'left';
    }

    // 10. Left Action Controls Panel (x: 20..230, y: 182..232)
    ctx.fillStyle = '#1c0f16';
    ctx.fillRect(20, 182, 210, 50);
    ctx.strokeStyle = '#5a3418';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 182, 210, 50);

    // Button 1: Dâng Đĩa Trầu Cau (x: 26..122, y: 188..226)
    const isBtn1Hover = (mx >= 26 && mx <= 122 && my >= 188 && my <= 226);
    ctx.fillStyle = state.placedBetel ? '#1f3a22' : (isBtn1Hover ? '#4a2536' : '#331a26');
    ctx.fillRect(26, 188, 96, 38);
    ctx.strokeStyle = state.placedBetel ? '#58d68d' : (isBtn1Hover ? '#ffeb80' : '#c89d42');
    ctx.lineWidth = isBtn1Hover ? 1.5 : 1;
    ctx.strokeRect(26, 188, 96, 38);

    ctx.fillStyle = state.placedBetel ? '#58d68d' : '#f5ecc9';
    ctx.font = `bold 7px ${FONT_SANS}`;
    ctx.fillText(state.placedBetel ? '✓ ĐÃ DÂNG TRẦU CAU' : '1. DÂNG TRẦU CAU', 31, 202);
    ctx.font = `6px ${FONT_SANS}`;
    ctx.fillStyle = '#aba291';
    ctx.fillText('Trầu têm cánh phượng', 31, 213);
    ctx.fillText('Cau bổ tư ngũ phương', 31, 221);

    // Button 2: Châm 3 Nén Tâm Nhang (x: 128..224, y: 188..226)
    const isBtn2Hover = (mx >= 128 && mx <= 224 && my >= 188 && my <= 226);
    ctx.fillStyle = state.placedIncense ? '#1f3a22' : (isBtn2Hover ? '#4a2536' : '#331a26');
    ctx.fillRect(128, 188, 96, 38);
    ctx.strokeStyle = state.placedIncense ? '#58d68d' : (isBtn2Hover ? '#ffeb80' : '#c89d42');
    ctx.lineWidth = isBtn2Hover ? 1.5 : 1;
    ctx.strokeRect(128, 188, 96, 38);

    ctx.fillStyle = state.placedIncense ? '#58d68d' : '#f5ecc9';
    ctx.font = `bold 7px ${FONT_SANS}`;
    ctx.fillText(state.placedIncense ? '✓ ĐÃ CẮM 3 NÉN HƯƠNG' : '2. CẮM TÂM NHANG', 133, 202);
    ctx.font = `6px ${FONT_SANS}`;
    ctx.fillStyle = '#aba291';
    ctx.fillText('Ba nén hương trầm', 133, 213);
    ctx.fillText('Cắm thẳng tấc lòng', 133, 221);

    // 11. Right Narrative Status Panel (x: 240..460, y: 182..232)
    ctx.fillStyle = '#1c0f16';
    ctx.fillRect(240, 182, 220, 50);
    ctx.strokeStyle = '#5a3418';
    ctx.lineWidth = 1;
    ctx.strokeRect(240, 182, 220, 50);

    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 7.5px ${FONT_SANS}`;
    ctx.fillText('NGHI THỨC GIẢI MÃ LÒNG TIN BÁC CẢNH:', 248, 194);

    ctx.font = `6.5px ${FONT_SANS}`;
    if (state.completed) {
      ctx.fillStyle = '#58d68d';
      ctx.fillText('★ HOÀN THÀNH: Bác Cảnh đã trao chìa khóa cổ!', 248, 208);
      ctx.fillStyle = '#f5ecc9';
      ctx.fillText('Cửa sắt lên Thư khố Tầng 2 đã mở.', 248, 220);
    } else {
      ctx.fillStyle = state.placedBetel ? '#58d68d' : '#aba291';
      ctx.fillText(`• ${state.placedBetel ? '✓ Đã đặt Đĩa trầu cau têm cánh phượng' : 'Chưa dâng đĩa trầu cau khô'}`, 248, 208);
      ctx.fillStyle = state.placedIncense ? '#58d68d' : '#aba291';
      ctx.fillText(`• ${state.placedIncense ? '✓ Đã cắm 3 nén tâm nhang vào lư đồng' : 'Chưa thắp ba nén hương trầm'}`, 248, 220);
    }
  }

  function handleClick(x, y, hasOfferings, hasMatches, onDialogue, onCompleted) {
    if (!state.active) return false;

    // Close button [ESC / X] (top right: x >= 388, y <= 36)
    if (x >= 388 && y <= 36) {
      close();
      return true;
    }

    // Direct Physical Target 1: Hoành Phi "THẦN TRUYỀN CHÁNH KHÍ" (x: 140..340, y: 42..68)
    if (x >= 140 && x <= 340 && y >= 42 && y <= 68) {
      if (onDialogue) {
        onDialogue(
          'An',
          'Bức hoành phi sơn son thếp vàng bốn chữ "Thần truyền chánh khí" (神傳正氣) — lời răn dạy muôn đời của tiền nhân: người bước lên sân khấu tuồng phải giữ trọn khí tiết trung thần và đạo đức thánh hiền.'
        );
      }
      return true;
    }

    // Direct Physical Target 2: Ba Bài Vị Tam Vị Thánh Tổ (x: 170..310, y: 70..122)
    if (x >= 170 && x <= 310 && y >= 70 && y <= 122) {
      if (onDialogue) {
        onDialogue(
          'An',
          'Ba bài vị tôn kính: Tiền Hiền Khai Sáng, Thập Nhị Ban Tổ, Hậu Tấn Tôn Sư.\nNghệ sĩ hát bội trước mỗi đêm diễn đều phải thành tâm đảnh lễ trước án thờ này để cầu xin ơn Tổ soi đường.'
        );
      }
      return true;
    }

    // Direct Physical Target 3: Đôi Chân Đèn Dầu Đồng (Left: 134..156, Right: 324..346, y: 116..156)
    if ((x >= 134 && x <= 156 && y >= 116 && y <= 156) ||
        (x >= 324 && x <= 346 && y >= 116 && y <= 156)) {
      if (onDialogue) {
        onDialogue(
          'An',
          'Đôi chân đèn dầu bằng đồng cổ tỏa ánh sáng lung linh ấm áp, xua tan lạnh lẽo của gian thờ đêm mưa gió.'
        );
      }
      return true;
    }

    // Direct Physical Target 4 & Button 1: Dâng Đĩa Trầu Cau
    // Physical slot & plate target: x: 154..210, y: 122..170 | Control Button: x: 26..122, y: 188..226
    if ((x >= 154 && x <= 210 && y >= 122 && y <= 170) ||
        (x >= 26 && x <= 122 && y >= 188 && y <= 226)) {
      if (state.placedBetel) {
        if (onDialogue) onDialogue('An', 'Đĩa trầu cau ngũ phương têm cánh phượng đã được đặt ngay ngắn trên án gian thờ Tổ.');
        return true;
      }
      if (!hasOfferings) {
        if (onDialogue) onDialogue('An', 'Chưa có Đĩa trầu cau khô! Cần quay lại ngăn kéo xưởng phục chế để lấy lễ vật.');
        return true;
      }

      state.placedBetel = true;
      if (window.GameAudio) window.GameAudio.slotDrop();

      checkFullRitual(onDialogue, onCompleted);
      return true;
    }

    // Direct Physical Target 5 & Button 2: Châm 3 Nén Tâm Nhang
    // Physical bronze burner & sticks target: x: 216..264, y: 98..166 | Control Button: x: 128..224, y: 188..226
    if ((x >= 216 && x <= 264 && y >= 98 && y <= 166) ||
        (x >= 128 && x <= 224 && y >= 188 && y <= 226)) {
      if (state.placedIncense) {
        if (onDialogue) onDialogue('An', 'Ba nén tâm nhang trầm đã được châm lửa và cắm thẳng tấc lòng vào lư đồng tam khí.');
        return true;
      }
      if (!hasOfferings) {
        if (onDialogue) onDialogue('An', 'Chưa có Bó hương trầm! Cần quay lại ngăn kéo xưởng phục chế để lấy lễ vật.');
        return true;
      }
      if (!hasMatches) {
        if (onDialogue) onDialogue('An', 'Đã có ba nén hương trầm nhưng chưa có diêm để châm lửa!\nHãy ra chiếc bàn gỗ nhỏ của Bác Cảnh ngoài hành lang để lấy Hộp diêm quẹt.');
        return true;
      }

      state.placedIncense = true;
      if (window.GameAudio) window.GameAudio.slotDrop();

      checkFullRitual(onDialogue, onCompleted);
      return true;
    }

    return false;
  }

  function checkFullRitual(onDialogue, onCompleted) {
    if (state.placedBetel && state.placedIncense && !state.completed) {
      state.completed = true;
      if (window.GameAudio) {
        window.GameAudio.templeBell();
        setTimeout(() => window.GameAudio.doorUnlocked(), 600);
      }
      if (onCompleted) onCompleted();
    }
  }

  return {
    state,
    isActive,
    open,
    close,
    closeModal: close,
    update,
    render,
    handleClick
  };
})();
