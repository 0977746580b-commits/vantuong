// HỌA DIỆN (The Dual Mask) - Main Engine (Workshop V3 Architecture)
// 2D Panoramic Side-view Platformer, Point-and-Click Inspection & Deduction Journal
(function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  // Viewport & Room Dimensions (Matches 2000x489 Panoramic Master Art)
  const V_WIDTH = 480;
  const V_HEIGHT = 250;
  const ROOM_WIDTH = 1022;
  const ROOM_HEIGHT = 250;
  const FLOOR_Y = 236;

  // Hi-DPI crisp 2x internal resolution (960x500 canvas buffer for razor-sharp typography)
  const RENDER_SCALE = 2;
  canvas.width = V_WIDTH * RENDER_SCALE;
  canvas.height = V_HEIGHT * RENDER_SCALE;

  const FONT_SANS = '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // Camera horizontal tracking
  const camera = {
    x: 0,
    targetX: 0
  };

  // --- GAME STATE ---
  const world = {
    scene: 'workshop', // 'workshop' | 'floor1' | 'floor2' | 'floor3'
    doorUnlocked: true,
    drawerOpen: false,
    collectedOfferings: false,
    hasMatches: false,
    floor1AltarCompleted: false,
    archivesDoorUnlocked: false,
    hasLaMiaKey: false,
    dragonKeyInserted: false,
    placedVitrine: null, // 1: Vitrine Trái, 2: Vitrine Phải, 3: Trụ Giữa Bệ Xoay // Cơ cấu Cột Cái Đầu Rồng kích hoạt thả thang dây Tầng 3
    readyForEnding: false,
    chosenEnding: null,
    exhibitionHasDualMask: false,
    bacCanhIntroduced: false,
    bacCanhConfrontationDone: false,
    bacCanhReunionDone: false,
    earlyTrapTriggered: false,
    storyScene: null,
    cutsceneStep: 0,
    rainDrops: [],
    lightningTimer: 0,
    lightningFlash: 0,
    floor2: {
      readRoyalEdict: false,
      frenchChestUnlocked: false,
      hasRawGlassFilm: false,
      hasPhotoNotebook: false,
      identifiedChemicals: false,
      darkroomCurtainOpen: false,
      developedPhoto1930: false,
      hasRustyKey: false,
      floor3DoorUnlocked: false
    },
    floor3: {
      hasDrumsticks: false,
      drumCompleted: false,
      backstageChestOpened: false,
      readTuongScript: false,
      stoneBellsSolved: false,
      hasWhiteHalf: false,
      hasEbonyPin: false,
      hasMasterLetter: false,
      hasTokenHoQuoc: false,
      hasMergedToken: false,
      hasDualMask1930: false
    }
  };

  // Raindrop particles for window area (x: 48..148, y: 55..185 in room coords)
  for (let i = 0; i < 28; i++) {
    world.rainDrops.push({
      x: 48 + Math.random() * 100,
      y: 55 + Math.random() * 130,
      speed: 150 + Math.random() * 110,
      len: 4 + Math.random() * 4
    });
  }

  // --- PLAYER ENTITY (AN) ---
  const player = {
    x: 100,
    y: FLOOR_Y, // Floor contact line y=236
    speed: 130,
    facing: 1, // 1: right, -1: left (flip_h)
    currentAnim: 'idle',
    frameIdx: 0,
    animTimer: 0,
    isMoving: false,
    stepTimer: 0
  };

  // --- INPUT CONTROLLER ---
  const keys = {};
  const justPressed = {};
  const mouse = { x: 0, y: 0, worldX: 0, isDown: false };

  // --- TOAST NOTIFICATIONS ---
  const toast = { text: '', timer: 0 };
  function showToast(text, duration = 3.2) {
    toast.text = text;
    toast.timer = duration;
  }

  // --- DIALOGUE SYSTEM ---
  const dialogue = {
    active: false,
    speaker: '',
    text: '',
    pages: [],
    page: 0,
    onClose: null
  };

  // --- THUẬT TOÁN NGẮT DÒNG CHUẨN XÁC TRÀN ĐẦY Ô THOẠI (GREEDY PIXEL WRAPPING) ---
  // Đo trực tiếp độ rộng chữ theo pixel font Canvas (ctx.measureText), đảm bảo chữ chạy
  // tràn đầy khung ngang (368px) rồi mới được xuống dòng, tuyệt đối không ngắt lửng lơ.
  // Mỗi trang (page) chứa tối đa 2 dòng văn bản đầy đặn, rõ ràng, chuẩn visual novel.
  function formatDialogue(text, maxLineWidth = 368, maxLinesPerPage = 2) {
    if (!text) return [[]];

    // Hàm đo pixel trực tiếp trên canvas font chữ đối thoại
    const measureWidth = (str) => {
      if (ctx) {
        ctx.save();
        ctx.font = `500 8.2px ${FONT_SANS}`;
        const w = ctx.measureText(str).width;
        ctx.restore();
        return w;
      }
      return str.length * 4.4;
    };

    // Ngắt một chuỗi thành các dòng tối đa maxLineWidth
    const wrapToLines = (str) => {
      const words = str.trim().split(/\s+/);
      const lines = [];
      let curLine = '';
      for (let i = 0; i < words.length; i++) {
        const w = words[i];
        const test = curLine ? curLine + ' ' + w : w;
        if (measureWidth(test) <= maxLineWidth) {
          curLine = test;
        } else {
          if (curLine) lines.push(curLine);
          curLine = w;
        }
      }
      if (curLine) lines.push(curLine);
      return lines;
    };

    // Chuẩn hóa xuống dòng và gom các câu trọn vẹn vào từng trang 2 dòng, tuyệt đối không cắt ngang câu giữa 2 trang
    const normalized = text.replace(/\r\n/g, '\n').replace(/\n+/g, ' ').trim();
    const sentences = normalized.split(/(?<=[.!?…])\s+/).filter(Boolean);
    const pages = [];
    let curPageText = '';

    sentences.forEach((sent) => {
      const testText = curPageText ? curPageText + ' ' + sent : sent;
      const testLines = wrapToLines(testText);
      if (testLines.length <= maxLinesPerPage) {
        curPageText = testText;
      } else {
        if (curPageText) {
          pages.push(wrapToLines(curPageText));
        }
        const sentLines = wrapToLines(sent);
        if (sentLines.length <= maxLinesPerPage) {
          curPageText = sent;
        } else {
          // Keep a long sentence together; the frame grows upward to fit it.
          pages.push(sentLines);
          curPageText = '';
        }
      }
    });

    if (curPageText) {
      pages.push(wrapToLines(curPageText));
    }

    return pages.length > 0 ? pages : [[text]];
  }

  function showDialogue(speaker, text, onClose) {
    dialogue.active = true;
    dialogue.speaker = speaker;
    dialogue.text = text;
    dialogue.onClose = onClose || null;

    // Phân tích và ngắt dòng tràn đầy ô thoại
    dialogue.pages = formatDialogue(text, 368, 2);
    dialogue.page = 0;
    if (window.GameAudio) window.GameAudio.talkBlip(440);
  }

  function advanceDialogue() {
    if (!dialogue.active) return;
    dialogue.page++;
    if (dialogue.page >= dialogue.pages.length) {
      dialogue.active = false;
      const cb = dialogue.onClose;
      dialogue.onClose = null;
      if (cb) cb();
    } else {
      if (window.GameAudio) window.GameAudio.talkBlip(460);
    }
  }

  function showDialogueSequence(entries, onComplete) {
    if (!Array.isArray(entries) || entries.length === 0) {
      if (onComplete) onComplete();
      return;
    }
    let idx = 0;
    const step = () => {
      if (idx >= entries.length) {
        if (onComplete) onComplete();
        return;
      }
      const cur = entries[idx++];
      if (cur && typeof cur.onStart === 'function') cur.onStart();
      showDialogue(cur.speaker || 'An', cur.text || '', step);
    };
    step();
  }

  function playDarkroomConfrontation(onComplete) {
    if (world.bacCanhConfrontationDone) {
      if (onComplete) onComplete();
      return;
    }
    world.bacCanhConfrontationDone = true;
    world.storyScene = 'darkroom_confrontation';
    if (window.GameAudio) window.GameAudio.step();
    showDialogueSequence([
      {
        speaker: 'An (Giật mình trong ánh đèn đỏ)',
        text: 'Tiếng gậy trúc gõ nhịp cọt kẹt ngoài hành lang gỗ... Bác Cảnh?! Sao bác lại lên tận phòng tối này?\nBức ảnh này chụp năm 1930... Tướng Vũ mà bảo tàng tôn sùng chính tay hạ lệnh thiêu rụi kho lương và làng mạc! Ông ấy là một kẻ sát nhân!'
      },
      {
        speaker: 'Bác Cảnh',
        onStart: () => { if (window.GameAudio) window.GameAudio.drumCac(); },
        text: 'Sát nhân? Đúng... Với người làng năm ấy, ông ấy là ác quỷ. Nhưng cậu có biết phía sau ngôi làng đó là gì không?\nLà đường tiếp tế lương thảo của ba vạn nghĩa binh! Nếu kho lương lọt vào tay giặc Pháp, ba vạn người sẽ chết đói, cả xứ này sẽ chìm trong bể máu!'
      },
      {
        speaker: 'Bác Cảnh',
        text: 'Có người chịu chết vì nước, nhưng cũng có người phải cắn răng mang tiếng nhơ thiên cổ để đất nước được sống!\nChẳng phải tự nhiên mà các cụ giữ lại cả bức ảnh lẫn bản sắc phong trong cùng một mái nhà này đâu cậu An.'
      },
      {
        speaker: 'An',
        text: 'Vậy... giữa bản sắc phong ca tụng trung thần và bức ảnh biển lửa này, lịch sử rốt cuộc phải tin vào đâu hả bác?'
      },
      {
        speaker: 'Bác Cảnh',
        onStart: () => {
          world.floor2.hasRustyKey = true;
          world.floor2.floor3DoorUnlocked = true;
          if (window.GameAudio) window.GameAudio.clueDiscovered();
        },
        text: 'Cầm lấy chiếc chìa khóa sắt hoen gỉ vừa bong lớp sáp dưới đáy khay kia đi.\nBước lên rạp hát Tầng 3 mà xem... Vở tuồng của các cụ trên đó khóc cho ai, và nguyền rủa ai!'
      }
    ], () => {
      world.storyScene = null;
      if (window.DeductionJournal) window.DeductionJournal.addKeyword('[Chìa khóa sắt hoen gỉ]');
      showToast('★ ĐÃ NHẬN: Chìa khóa sắt hoen gỉ & mở khóa Cửa Lên Tầng 3!');
      if (onComplete) onComplete();
    });
  }

  function playAtticReunion(onComplete) {
    if (world.bacCanhReunionDone) {
      if (onComplete) onComplete();
      return;
    }
    world.bacCanhReunionDone = true;
    world.floor3.hasTokenHoQuoc = true;
    world.storyScene = 'attic_reunion';
    if (window.DeductionJournal) {
      window.DeductionJournal.addKeyword('[Thẻ bài đồng: Hộ Quốc]');
      window.DeductionJournal.addKeyword('[Thẻ bài đồng: Thần Lực]');
    }
    if (window.GameAudio) window.GameAudio.step();
    showDialogueSequence([
      {
        speaker: 'Bác Cảnh (Đứng đợi dưới ánh trăng)',
        text: 'Cậu An... Tiếng ròng rọc trên vì kèo vừa chuyển động. Cậu đã lên được Gác Sào Màn rồi sao?'
      },
      {
        speaker: 'An',
        text: 'Bác Cảnh... Trong rương mây trên gác mái có nửa mặt nạ trắng, bức di thư lụa Cổ Đô và nửa mảnh thẻ bài đồng khắc hai chữ "Hộ Quốc".\nCòn mảnh đồng gãy mép gài ở chùm chìa khóa bên thắt lưng bác khắc hai chữ "Thần Lực" đúng không? Đứa trẻ mồ côi được cứu sống năm ấy... chính là cụ cố nội của bác!'
      },
      {
        speaker: 'Bác Cảnh (Rơi lệ dưới ánh trăng)',
        onStart: () => { if (window.GameAudio) window.GameAudio.drumTung(); },
        text: 'Đúng... Cụ cố của lão cả đời ôm nỗi đau này đến lúc nhắm mắt. Hai nửa thẻ bài "Hộ Quốc - Thần Lực" phân ly từ đêm lửa Canh Ngọ nay mới gặp lại nhau.\nBa đời nhà lão trông coi rạp hát này, chỉ mong một ngày tìm được người có đủ cái tâm để ghép lại khuôn mặt thật của lịch sử... Cảm ơn cậu, cậu An!'
      },
      {
        speaker: 'An',
        text: 'Bác Cảnh, đi xuống Tầng 1 với cháu. Đêm nay cháu sẽ phục chế lại chiếc mặt nạ hoàn chỉnh này.\nSáng mai, cả thế giới sẽ được nhìn thấy sự thật trọn vẹn của tiền nhân!'
      }
    ], () => {
      world.storyScene = null;
      showToast('★ ĐÃ ĐỐI CHIẾU TÍN VẬT: Hai nửa thẻ bài « Hộ Quốc - Thần Lực »!');
      if (onComplete) onComplete();
    });
  }

  function getBacCanhDialogueState() {
    if (world.placedVitrine) return 'placed';
    if (world.floor3 && world.floor3.hasDualMask1930) return 'restored_mask';
    if (world.bacCanhReunionDone || (world.floor3 && world.floor3.hasWhiteHalf)) return 'post_reunion';
    if (world.floor3 && world.floor3.readTuongScript) return 'early_trap';
    if (world.bacCanhConfrontationDone || (world.floor2 && world.floor2.developedPhoto1930)) return 'post_darkroom';
    if (world.floor1AltarCompleted) return 'post_altar';
    return 'prologue';
  }

  // --- WORKSHOP INTERACTABLE TRIGGERS (Aligned with 2000x489 Master Art) ---
  const triggers = [
    {
      id: 'window_rain',
      x: 99,
      w: 60,
      title: 'Cửa Sổ Hướng Tây',
      label: '[ E ] Nhìn ra Cửa Sổ Đêm Mưa',
      onInteract: () => {
        showDialogue(
          'An',
          'Mưa gió đêm khuya vẫn quất liên hồi vào mái ngói âm dương cổ kính bên ngoài gian xưởng.\nTám giờ sáng mai là lễ khai mạc rồi, mình phải sớm hoàn tất công việc trong đêm nay.'
        );
      }
    },
    {
      id: 'tea_table',
      x: 160,
      w: 42,
      title: 'Bàn Trà Suy Ngẫm',
      label: '[ E ] Ngồi Bên Bàn Trà Suy Ngẫm',
      onInteract: () => {
        showDialogue(
          'An',
          'Gió lạnh luồn qua khe cửa gỗ nhưng chén trà nóng trên bàn làm việc vẫn tỏa hương dịu nhẹ.\nKhối gỗ số 47 bám đầy bồ hóng đen kịt, mình cần lên lầu tìm hồ sơ lưu trữ đối chiếu trước.'
        );
      }
    },
    {
      id: 'tuong_rules',
      x: 220,
      w: 44,
      title: 'Tranh Cuộn Hát Bội',
      label: '[ E ] Đọc Tranh Cuộn Quy Ước Hát Bội',
      onInteract: () => {
        showDialogue(
          'Tranh Cuộn Hát Bội',
          'Mặt đỏ son chu sa biểu trưng cho bậc trung thần ái quốc, mặt trắng là kẻ gian nịnh.\nĐôi mày mác vươn cao thể hiện chí khí kiên cường, nét mày nhăn trăn trở nỗi niềm.'
        );
      }
    },
    {
      id: 'lamp_prop',
      x: 290,
      w: 36,
      title: 'Đèn Dầu Đồng',
      label: '[ E ] Kiểm tra Đèn Dầu Đồng',
      onInteract: () => {
        showDialogue(
          'An',
          'Ngọn đèn dầu đồng cổ vẫn cháy liu riu tỏa ánh sáng ấm áp khắp mặt bàn làm việc.\nHơi nóng dịu nhẹ từ bóng đèn thủy tinh giúp xua bớt cái lạnh ẩm ướt của đêm mưa.'
        );
      }
    },
    {
      id: 'tools_wine',
      x: 345,
      w: 34,
      title: 'Khăn Xô & Rượu Gừng',
      label: '[ E ] Khảo sát Khăn Xô Rượu Gừng',
      onInteract: () => {
        showDialogue(
          'An',
          'Khăn xô mềm đặt cạnh bình rượu gừng hạ thổ theo phương pháp gia truyền của nghệ nhân.\nDung dịch này giúp làm sạch lớp bụi bẩn lâu năm mà vẫn bảo tồn màu sơn ta nguyên bản.'
        );
      }
    },
    {
      id: 'scale',
      x: 406,
      w: 44,
      title: 'Cân Tiểu Ly',
      label: '[ E ] Đo Trọng Lượng Hiện Vật',
      onInteract: () => {
        showDialogue(
          'An',
          'Kim cân đồng dừng lại ở đúng vạch sáu lạng, nặng gấp đôi mặt nạ gỗ thông thường.\nMình nên ghi chú lại thông số trọng lượng khác thường này vào sổ tay để đối chiếu.',
          () => {
            if (!window.DeductionJournal.hasKeyword('[Trọng lượng 600g]')) {
              window.DeductionJournal.addKeyword('[Trọng lượng 600g]');
              showToast('Đã thêm từ khóa: [Trọng lượng 600g] vào Sổ tay!');
              if (window.GameAudio) window.GameAudio.clueDiscovered();
            }
          }
        );
      }
    },
    {
      id: 'chisel',
      x: 455,
      w: 32,
      title: 'Dao Trổ & Rượu Gừng',
      label: '[ E ] Khảo sát Dụng cụ Phục chế',
      onInteract: () => {
        if (world.floor3 && world.floor3.readTuongScript) {
          showDialogue(
            'An',
            'Kịch bản Tuồng cổ đã xác nhận lớp vôi gai trên Nửa Mặt Nạ Đỏ chỉ là lớp sơn bồi bảo vệ giả tạo.\nMình có thể dùng dao trổ trên Bục Hiện Vật Số 47 để bóc tách lớp vôi này một cách an toàn.'
          );
        } else {
          showDialogue(
            'An',
            'Không được! Lớp sơn đỏ này đang bị mủn vôi phong hóa, chưa rõ kết cấu gỗ bên dưới.\nNếu dùng dao trổ cạo bừa lúc này sẽ làm rách nát hoàn toàn hiện vật mất!'
          );
        }
      }
    },
    {
      id: 'mask_workbench',
      x: 518,
      w: 48,
      title: 'Bục Hiện Vật Số 47',
      get label() {
        if (world.placedVitrine) {
          return '[ E / Click ] Bục Hiện Vật (Đã Trưng Bày Ngoài Đại Sảnh)';
        }
        if (world.floor3 && world.floor3.hasDualMask1930) {
          return '[ E / Click ] Chiêm ngưỡng Mặt Nạ Hoàn Nguyên';
        }
        if (world.floor3 && world.floor3.hasWhiteHalf) {
          return '[ E / Click ] Ghép Mộng Song Diện (Giai đoạn 2)';
        }
        if (world.floor3 && world.floor3.readTuongScript) {
          return '[ E / Click ] Cạo Sơn Bồi Tìm Chìa Lá Mía (Giai đoạn 1)';
        }
        return '[ E / Click ] Khảo sát Phôi Gỗ Số 47';
      },
      onInteract: () => {
        if (world.placedVitrine) {
          showDialogue(
            'An',
            'Hiện vật Mặt Nạ Số 47 đã được phục chế hoàn nguyên và chuyển ra trưng bày trang trọng trong tủ kính tại Đại Sảnh Tầng 1.'
          );
          return;
        }
        window.InspectionMode.open(showDialogue);
      }
    },
    {
      id: 'magnifier',
      x: 615,
      w: 34,
      title: 'Kính Lúp Cán Đồng',
      label: '[ E ] Cầm Kính Lúp Phóng Đại',
      onInteract: () => {
        showDialogue(
          'An',
          'Chiếc kính lúp cán đồng có độ phóng đại lớn giúp quan sát rõ từng đường vân gỗ mít già.\nDưới lớp bồ hóng đen sẫm và lớp sáp ong cũ kỹ vẫn còn thấp thoáng những vệt màu sơn cổ.'
        );
      }
    },
    {
      id: 'archive_paper',
      x: 665,
      w: 38,
      title: 'Biên Bản Rách #47',
      label: '[ E ] Đọc Tờ Biên Bản Bị Xé',
      onInteract: () => {
        showDialogue(
          'Tờ Biên Bản Bàn Giao',
          'Tờ biên bản ghi nhận hiện vật số 47 thuộc gánh hát Tiên Sư nhưng phần xuất xứ đã bị rách.\nDòng ghi chú cuối trang dặn phải đối chiếu thêm văn bản gốc tại Thư khố Tầng 2 trước đã.',
          () => {
            let added = false;
            if (!window.DeductionJournal.hasKeyword('[Hồ sơ bị xé]')) {
              window.DeductionJournal.addKeyword('[Hồ sơ bị xé]');
              added = true;
            }
            if (!window.DeductionJournal.hasKeyword('[Manh mối Thư khố Tầng 2]')) {
              window.DeductionJournal.addKeyword('[Manh mối Thư khố Tầng 2]');
              added = true;
            }
            if (added) {
              showToast('Đã thêm: [Hồ sơ bị xé] & [Manh mối Thư khố Tầng 2]!');
              if (window.GameAudio) window.GameAudio.clueDiscovered();
            }
          }
        );
      }
    },
    {
      id: 'drawer_prop',
      x: 715,
      w: 44,
      title: 'Ngăn Kéo Bàn Tư Liệu',
      label: '[ E ] Mở Ngăn Kéo Bàn Tư Liệu',
      onInteract: () => {
        if (!world.drawerOpen) {
          world.drawerOpen = true;
          world.collectedOfferings = true;
          if (window.GameAudio) window.GameAudio.slotDrop();
          showToast('★ Đã mở ngăn kéo: Tìm thấy Bó hương trầm & Đĩa trầu cau khô!');
          showDialogue(
            'An',
            'Ngăn kéo bàn gỗ vừa mở ra để lộ bó hương trầm thơm ngát cùng đĩa trầu cau khô.\nMình hãy mang theo lễ vật này sang Gian Thờ Tổ ở Tầng 1 để dâng lên các bậc tiền bối.'
          );
        } else {
          showDialogue(
            'An',
            'Ngăn kéo bàn tư liệu đã mở sẵn và toàn bộ lễ vật bên trong đều đã được thu dọn.\nMình có thể mang bó hương trầm cùng đĩa trầu cau sang Gian Thờ Tổ ở Tầng 1 ngay.'
          );
        }
      }
    },
    {
      id: 'color_tray',
      x: 765,
      w: 36,
      title: 'Khay Màu Truyền Thống',
      label: '[ E ] Khảo sát Khay Màu Sơn Ta',
      onInteract: () => {
        showDialogue(
          'An',
          'Khay gốm đựng bột chu sa đỏ son, phấn vỏ điệp trắng ngà và nhựa sơn ta dậy mùi thơm.\nNhững nguyên liệu khoáng chất tự nhiên này giúp mặt nạ tuồng giữ màu sắc qua thế kỷ.'
        );
      }
    },
    {
      id: 'rules_sheet',
      x: 835,
      w: 40,
      title: 'Quy Chế Nghi Lễ Hát Bội',
      label: '[ E ] Đọc Bản Quy Chế Nghi Lễ',
      onInteract: () => {
        showDialogue(
          'Bản Quy Chế Nghi Lễ',
          'Theo lệ xưa của gánh hát, muốn lên lầu tra cứu cổ thư phải ghé Gian Thờ Tổ làm lễ.\nLễ phẩm gồm năm lá trầu xếp hướng ngũ phương, một quả cau bổ tư và ba nén tâm nhang.'
        );
      }
    },
    {
      id: 'door',
      x: 956,
      w: 55,
      title: 'Cửa Gỗ Sang Tầng 1',
      label: '[ E ] Bước qua Cửa Sang Tầng 1',
      onInteract: () => {
        switchScene('floor1', 55, 1);
      }
    }
  ];

  // --- SCENE SWITCHING (WORKSHOP <-> FLOOR 1 <-> FLOOR 2 <-> FLOOR 3) ---
  function switchScene(sceneName, playerX, facing = 1) {
    world.scene = sceneName;
    player.x = playerX;
    player.facing = facing;
    player.y = (sceneName === 'floor3' || sceneName === 'floor2') ? 215 : (sceneName === 'floor1' ? 232 : 236);
    const curW = (sceneName === 'floor3' || sceneName === 'floor2') ? 750 : (sceneName === 'floor1' ? 786 : 1022);
    camera.targetX = Math.max(0, Math.min(curW - V_WIDTH, player.x - V_WIDTH / 2));
    camera.x = camera.targetX;

    if (sceneName === 'floor3') {
      if (window.GameAudio) {
        window.GameAudio.stopSafezoneAmbience();
        window.GameAudio.startHallAmbience();
      }
      showToast('🎭 ĐÃ BƯỚC LÊN TẦNG 3: SÂN KHẤU TUỒNG CỔ TIÊN SƯ');
    } else if (sceneName === 'floor2') {
      if (window.GameAudio) {
        window.GameAudio.stopSafezoneAmbience();
        window.GameAudio.startHallAmbience();
      }
      showToast('📜 ĐÃ BƯỚC LÊN TẦNG 2: THƯ KHỐ & PHÒNG TỐI TRÁNG ẢNH');
    } else if (sceneName === 'floor1') {
      if (window.GameAudio) {
        window.GameAudio.stopSafezoneAmbience();
        window.GameAudio.startHallAmbience();
      }
      showToast('🏮 ĐÃ BƯỚC VÀO TẦNG 1: ĐẠI SẢNH BẢO TÀNG & GIAN THỜ TỔ');
    } else {
      if (window.GameAudio) {
        window.GameAudio.stopHallAmbience();
        window.GameAudio.startSafezoneAmbience();
      }
      showToast('🏛️ ĐÃ TRỞ VỀ CHÁI TÂY: XƯỞNG PHỤC CHẾ (SAFEZONE)');
    }
  }

  function onRitualCompleted() {
    world.floor1AltarCompleted = true;
    world.archivesDoorUnlocked = true;
    showToast('★ GIẢI MÃ LÒNG TIN THÀNH CÔNG: BÁC CẢNH ĐÃ TRAO CHÌA KHÓA CỔ!');
    showDialogue(
      'Bác Cảnh',
      'Nhìn cách cậu bày lễ trầu cau và thắp ba nén tâm nhang ngay ngắn là biết lòng kính nghề.\nCầm lấy chiếc chìa khóa đồng cổ này để mở cửa sắt lên Thư khố Tầng 2 tra cứu tư liệu.',
      () => {
        if (window.GameAudio) window.GameAudio.drumTung();
      }
    );
  }

  // --- FLOOR 1 INTERACTABLE TRIGGERS (786px Panoramic Museum Gallery & Ancestral Altar) ---
  const triggersFloor1 = [
    {
      id: 'door_to_workshop',
      x: 25,
      w: 44,
      title: 'Cửa Về Xưởng',
      label: '[ E ] Quay lại Xưởng Phục Chế',
      onInteract: () => {
        switchScene('workshop', 930, -1);
      }
    },
    {
      id: 'bronze_drum_crane',
      x: 65,
      w: 44,
      title: 'Trống Đồng & Đôi Hạc',
      label: '[ E ] Khảo sát Trống Đồng Đông Sơn & Đôi Hạc Ngự',
      onInteract: () => {
        showDialogue(
          'An',
          'Trống đồng cổ ngàn năm đặt trang trọng bên đôi hạc đồng ngự lưng rùa chạm khắc tỉ mỉ.\nĐây là biểu tượng văn hóa khởi nguồn cho âm hưởng hào hùng của sân khấu tuồng cổ.'
        );
      }
    },
    {
      id: 'arch_window',
      x: 112,
      w: 38,
      title: 'Cửa Sổ Vòm Kiểu Pháp',
      label: '[ E ] Nhìn ra Cửa Sổ Vòm Trời Đêm',
      onInteract: () => {
        showDialogue(
          'An',
          'Khung cửa sổ vòm kiểu Pháp hướng ra khoảng sân bảo tàng chìm trong màn mưa rả rích.\nKhông gian đại sảnh rộng lớn giờ đây tĩnh lặng đến mức nghe rõ tiếng mưa rơi ngoài hiên.'
        );
      }
    },
    {
      id: 'conical_hat_box',
      x: 158,
      w: 42,
      title: 'Nón Quai Thao & Hộp Tráp Cổ',
      label: '[ E ] Ngắm Nón Quai Thao & Hộp Tráp Sơn Mài',
      onInteract: () => {
        showDialogue(
          'An',
          'Chiếc nón quai thao đính dải lụa điều nằm cạnh hộp tráp gỗ sơn mài cẩn xà cừ ngũ sắc.\nNhững kỷ vật mộc mạc này từng theo chân gánh hát biểu diễn khắp các vùng quê Nam Kỳ.'
        );
      }
    },
    {
      id: 'royal_robe',
      x: 212,
      w: 46,
      title: 'Áo Long Bào Triều Nguyễn',
      label: '[ E ] Khảo sát Long Bào Thêu Chỉ Ngũ Sắc',
      onInteract: () => {
        showDialogue(
          'An',
          'Tấm áo long bào sân khấu được thêu hình rồng cuộn sóng lửa bằng sợi chỉ kim tuyến vàng.\nDù đã trải qua nhiều thập kỷ nhưng từng nếp lụa vẫn giữ nguyên vẻ uy nghiêm cổ kính.'
        );
      }
    },
    ...[
      {id: 'vitrine_left_ending1', x:327, ending:1, title:'Tủ kính danh tướng', desc:'Bảng giới thiệu tôn vinh khí tiết người kép hát. Ánh đèn vàng rọi xuống đệm nhung.'},
      {id: 'vitrine_center_ending3', x:377, ending:3, title:'Tủ kính trung tâm', desc:'Giá đỡ ở giữa có thể xoay, cho phép quan sát cả hai mặt hiện vật.'},
      {id: 'vitrine_right_ending2', x:427, ending:2, title:'Tủ kính sử liệu', desc:'Tủ kính bên phải có ngăn dành cho những trang tư liệu đi kèm hiện vật.'}
    ].map(v => ({
      id:v.id, x:v.x, w:32, title:v.title,
      get label() {
        const canPlaceThis = v.ending === 3
          ? (world.floor3.hasDualMask1930 && world.floor3.hasMasterLetter && world.floor3.hasTokenHoQuoc && world.bacCanhReunionDone)
          : (world.floor3.hasDualMask1930 || (world.floor2.readRoyalEdict && world.floor2.developedPhoto1930 && world.floor3.readTuongScript));
        return '[ E / Click ] ' + (world.placedVitrine === v.ending ? 'Xem hiện vật · ' : canPlaceThis && !world.placedVitrine ? 'Chọn trưng bày · ' : 'Khảo sát · ') + v.title;
      },
      onInteract() {
        if (world.placedVitrine === v.ending) { window.Floor3Puzzles.openEndingModal(v.ending); return; }
        if (world.placedVitrine) { showDialogue('An', 'Hiện vật đã được đặt trong tủ kính mình chọn. Tủ này vẫn để trống.'); return; }
        if (!world.floor3.hasDualMask1930 && !world.floor3.readTuongScript) { showDialogue('An', v.desc); return; }
        if (v.ending === 3 && !(world.floor3.hasDualMask1930 && world.floor3.hasMasterLetter && world.floor3.hasTokenHoQuoc && world.bacCanhReunionDone)) {
          showDialogue('An', 'Giá đỡ xoay cho phép quan sát cả hai phía. Hiện vật của mình vẫn chưa toàn vẹn để đặt lên đây.');
          return;
        }
        window.Floor3Puzzles.openPlacementModal(v.ending, v.title, v.desc);
      }
    })),
    {
      id: 'iron_archives_door',
      x: 548,
      w: 44,
      title: 'Cửa Sắt Thư Khố Étage 2',
      get label() {
        return world.archivesDoorUnlocked ? '[ E ] Mở Cửa Sắt Lên Thư Khố Tầng 2' : '[ E ] Khảo sát Cửa Sắt Thư Khố';
      },
      onInteract: () => {
        if (world.archivesDoorUnlocked) {
          showDialogue(
            'An',
            'Chiếc chìa khóa đồng của Bác Cảnh vừa tra vào ổ thì chốt sắt đã bật mở rất nhẹ nhàng.\nLối cầu thang xoắn ốc dẫn lên khu vực Thư khố và Phòng tối ở Tầng 2 đã thông suốt.',
            () => {
              switchScene('floor2', 35, 1);
            }
          );
        } else {
          showDialogue(
            'An',
            'Cánh cửa sắt uốn hoa văn kiểu Pháp dẫn lên Thư khố Tầng 2 đang khóa bằng ổ khóa đồng.\nBác Cảnh thủ từ ngồi ngay bàn trà bên cạnh là người trông coi và giữ chìa khóa cửa này.'
          );
        }
      }
    },
    {
      id: 'dragon_head_pillar',
      x: 588,
      w: 42,
      title: 'Cột Cái Chạm Đầu Rồng',
      get label() {
        if (world.dragonKeyInserted) {
          return '[ E / Click ] Cột Cái Đầu Rồng (Chìa Khóa Đã Tra)';
        }
        if (world.hasLaMiaKey) {
          return '[ E / Click ] Tra Chìa Khóa Lá Mía Vào Miệng Rồng';
        }
        return '[ E / Click ] Khảo sát Cột Cái Chạm Đầu Rồng';
      },
      onInteract: () => {
        if (world.dragonKeyInserted) {
          showDialogue(
            'An',
            'Chiếc chìa khóa lá mía đồng thau đã khớp chặt vào rãnh đồng bên trong miệng rồng.\nTiếng dây cáp đồng và trục ròng rọc chuyển động đã vọng dọc thân cột lên tận lầu cao.'
          );
        } else if (world.hasLaMiaKey) {
          world.dragonKeyInserted = true;
          if (window.GameAudio) {
            window.GameAudio.doorUnlocked();
            window.GameAudio.drumTung();
          }
          showToast('★ ĐÃ KÍCH HOẠT: TRỤC RÒNG RỌC TRONG CỘT GỖ ĐÃ CHUYỂN ĐỘNG!');
          if (window.DeductionJournal) {
            window.DeductionJournal.addKeyword('[Cơ Quan Đầu Rồng: Đã Kích Hoạt]');
          }
          showDialogue(
            'An',
            'Chiếc chìa khóa lá mía bằng đồng thau vừa tra vào miệng rồng thì chốt ngầm đã bật mở.\nKhi vừa xoay nhẹ chuôi chìa khóa, tiếng ròng rọc thả thang dây vang lên trên Tầng 3.'
          );
        } else {
          showDialogue(
            'An',
            'Cây cột cái bằng gỗ mít cổ thụ chống đỡ toàn bộ hệ vì kèo với phần đầu rồng chạm nổi.\nPhần gỗ quanh miệng rồng có màu sẫm bóng như từng được tay người chạm vào nhiều lần.'
          );
        }
      }
    },
    {
      id: 'npc_bac_canh',
      x: 642,
      w: 36,
      title: 'Bác Cảnh',
      label: '[ E ] Trò chuyện với Bác Cảnh',
      onInteract: () => {
        const stage = getBacCanhDialogueState();
        const conversations = {
          placed: [{speaker:'An', text: world.placedVitrine === 3
            ? 'Bác Cảnh đã trao lại chùm chìa khóa. Mình sẽ giữ gìn cả hiện vật lẫn câu chuyện của những người đã khuất.'
            : world.placedVitrine === 1 ? 'Chiếc ghế bên bàn trà đã trống. Bác Cảnh lặng lẽ rời đi từ lúc nào...'
            : 'Bác Cảnh ngồi lặng ở góc sảnh. Những lời kết tội trên báo vẫn chưa làm nỗi đau của bác vơi đi.'}],
          restored_mask: [
            {speaker:'An',text:'Hai nửa khuôn mặt đã khớp lại, nhưng cháu sẽ không dùng việc phục chế để xóa đi dấu vết đêm lửa ấy.'},
            {speaker:'Bác Cảnh',text:'Gỗ còn sẹo thì người đời mới biết nó từng chịu đau. Hãy để người xem nhìn được cả hai mặt và đọc được những chứng tích đi cùng.'}
          ],
          post_reunion: [
            {speaker:'Bác Cảnh',text:'Cụ cố của lão đã đợi ngày này gần một thế kỷ... Mang những di vật về xưởng đi cậu An. Lão sẽ chờ cậu ở đại sảnh.'},
            {speaker:'An',text:'Cháu sẽ giữ nguyên những gì còn lại trên gỗ. Nửa mặt nạ trắng và di thư này không thể lại bị cất quên thêm một lần nữa.'}
          ],
          early_trap: [
            {speaker:'Bác Cảnh',text:'Một bên sử triều đình ngợi ca Trung Thần, một bên vở tuồng của dân làng kết tội Kẻ Đồ Tể. Cậu đã sẵn sàng chốt phương án bài trí cho sáng mai chưa?'},
            {speaker:'An',text:'Cháu có thể trình bày những tư liệu đang có. Nhưng nếu vẫn còn điều uẩn khúc, cháu muốn tiếp tục đối chiếu trước khi chốt.'},
            {speaker:'Bác Cảnh',text:'Quyết định là ở cậu. Đừng vì giờ khai mạc đã gần mà coi một mảnh chứng tích là toàn bộ cuộc đời một con người.'}
          ],
          post_darkroom: [
            {speaker:'An',text:'Chuyện ba vạn nghĩa binh bác vừa kể vẫn chỉ là lời truyền lại. Cháu muốn tìm được chứng tích để kiểm tra điều ấy.'},
            {speaker:'Bác Cảnh',text:'Cậu nói phải. Chiếc chìa khóa sắt sẽ mở cửa sân khấu Tầng 3. Cứ đọc xem người làng năm ấy đã khóc cho ai, nguyền rủa ai.'}
          ],
          post_altar: [
            {speaker:'An',text: world.floor2.readRoyalEdict ? 'Bản sắc phong trong thư khố ca ngợi Tướng Vũ là Tiết Nghĩa Trung Thần. Bác đã trông coi nó từ bao giờ?' : 'Cháu cảm ơn bác đã trao chìa khóa. Cháu sẽ lên thư khố đối chiếu hồ sơ hiện vật.'},
            {speaker:'Bác Cảnh',text:'Lão ở đây đủ lâu để nhớ cả tiếng từng bậc thang. Cậu cứ tra cứu, nhưng nhớ lời lão: có những góc ngưng đọng thời gian lâu quá rồi, động vào không chịu nổi đâu.'}
          ]
        };
        if (stage === 'early_trap') world.earlyTrapTriggered = true;
        if (conversations[stage]) {
          showDialogueSequence(conversations[stage]);
          return;
        }
        const prep = !world.hasMatches ? 'Trên bàn cạnh lão có hộp diêm khô, cậu cứ lấy mà dùng. ' : '';
        const offering = !world.collectedOfferings
          ? 'Hương trầm và trầu cau còn trong ngăn kéo bàn tư liệu bên xưởng. Nhớ mang theo vào Gian Thờ Tổ.'
          : 'Lễ vật đã tươm tất rồi, cậu vào Gian Thờ Tam Vị Thánh Tổ dâng lễ đi.';
        if (!world.bacCanhIntroduced) {
          world.bacCanhIntroduced = true;
          showDialogueSequence([
            {speaker:'Bác Cảnh',text:'Gọt gỗ của các cụ thì dễ, giữ được cái hồn các cụ gửi vào thớ gỗ mới là khó. Đêm nay sửa xong thì nghỉ sớm, đừng táy máy lên các tầng trên...'},
            {speaker:'An',text:'Bác Cảnh, trên chùm chìa khóa của bác có một nửa thẻ bài đồng gãy mép. Hai chữ này là “Thần Lực” phải không ạ?'},
            {speaker:'Bác Cảnh',text:'Đồ gia truyền thôi cậu. Lão giữ nó bên mình lâu rồi... Muốn lên thư khố thì trước hết phải bái Tổ cho trọn đạo nghề.'},
            {speaker:'Bác Cảnh',text:prep + offering}
          ], () => window.DeductionJournal.addKeyword('[Thẻ bài đồng: Thần Lực]'));
        } else {
          showDialogueSequence([
            {speaker:'Bác Cảnh',text:prep + offering},
            {speaker:'An',text:'Dạ, cháu sẽ làm lễ cẩn thận. Hiện vật còn chưa rõ lai lịch thì cháu chưa vội tác động lên gỗ đâu bác.'}
          ]);
        }
      }
    },
    {
      id: 'matchbox_table',
      x: 691,
      w: 32,
      title: 'Bàn Đựng Hộp Diêm',
      get label() {
        return world.hasMatches ? '[ E ] Khảo sát Bàn Gỗ Của Bác Cảnh' : '[ E ] Lấy Hộp Diêm Trên Bàn Gỗ';
      },
      onInteract: () => {
        if (!world.hasMatches) {
          world.hasMatches = true;
          showToast('Đã lấy: Hộp Diêm Quẹt Thắp Nhang!');
          if (window.GameAudio) window.GameAudio.clueDiscovered();
          showDialogue(
            'An',
            'Một hộp diêm gỗ bọc giấy điều đỏ đặt ngay ngắn trên bàn trà với những que diêm khô ráo.\nCó hộp diêm này cùng lễ vật, mình đã có thể vào Gian Thờ Tổ để châm lửa thắp nén nhang.'
          );
        } else {
          showDialogue(
            'An',
            'Chiếc bàn trà bằng gỗ mộc giản dị nơi Bác Cảnh vẫn thường ngồi trông coi sảnh mỗi đêm.\nMình đã cất hộp diêm quẹt vào túi áo cẩn thận để chuẩn bị cho nghi lễ tại Gian Thờ Tổ.'
          );
        }
      }
    },
    {
      id: 'ancestral_altar_door',
      x: 745,
      w: 42,
      title: 'Gian Thờ Tam Vị Thánh Tổ',
      label: '[ E ] Vào Gian Thờ Tam Vị Thánh Tổ',
      onInteract: () => {
        if (window.AltarMode) {
          window.AltarMode.open(world.collectedOfferings, world.hasMatches, showDialogue);
        }
      }
    }
  ];

  // --- FLOOR 2 INTERACTABLE TRIGGERS (750px Panoramic Archives & Darkroom) ---
  const triggersFloor2 = [
    {
      id: 'f2_staircase_down',
      x: 35,
      w: 40,
      title: 'Cầu Thang Xuống Tầng 1',
      label: '[ E ] Xuống lại Tầng 1 (Đại Sảnh)',
      onInteract: () => {
        switchScene('floor1', 548, -1);
      }
    },
    {
      id: 'f2_study_desk',
      x: 115,
      w: 50,
      title: 'Bàn Thư Tịch Cổ',
      label: '[ E ] Khảo sát Bàn Thư Tịch & Đèn Dầu',
      onInteract: () => {
        showDialogue(
          'An',
          'Bàn làm việc của người thủ thư xưa vẫn còn lưu lại nhiều tập ghi chép về gánh hát Tiên Sư.\nNgay kế bên là cuộn bản vẽ mặt cắt kiến trúc tòa nhà cùng tủ kính Sắc Phong Triều Nguyễn.'
        );
      }
    },
    {
      id: 'f2_architectural_blueprint',
      x: 210,
      w: 48,
      title: 'Bản Vẽ Mặt Cắt Bảo Tàng',
      label: '[ E ] Xem Bản Vẽ Mặt Cắt Kiến Trúc Bảo Tàng',
      onInteract: () => {
        if (window.MuseumMap) {
          window.MuseumMap.open();
        }
      }
    },
    {
      id: 'f2_royal_edict',
      x: 308,
      w: 60,
      title: 'Tủ Kính Sắc Phong Triều Nguyễn',
      label: '[ E ] Soi Kính Sắc Phong Triều Nguyễn',
      onInteract: () => {
        if (window.Floor2Puzzles) {
          window.Floor2Puzzles.openRoyalEdictModal(() => {
            world.floor2.readRoyalEdict = true;
          });
        }
      }
    },
    {
      id: 'f2_french_chest',
      x: 422,
      w: 50,
      title: 'Hòm Sắt Thợ Ảnh Pháp',
      get label() {
        return world.floor2.frenchChestUnlocked
          ? '[ E ] Khảo sát Hòm Sắt Thợ Ảnh (Đã Mở)'
          : '[ E ] Mở Khóa Hòm Sắt Thợ Ảnh Pháp';
      },
      onInteract: () => {
        if (world.floor2.frenchChestUnlocked) {
          showDialogue(
            'An',
            'Chiếc hòm sắt quân nhu kiểu Pháp đã mở khóa, bên trong có sổ tay và tấm phim âm bản.\nMình hãy mang tấm phim kính này sang khu vực buồng tối bên cạnh để tiến hành tráng rửa.'
          );
        } else if (window.Floor2Puzzles) {
          window.Floor2Puzzles.openFrenchChestModal(() => {
            world.floor2.frenchChestUnlocked = true;
            world.floor2.hasRawGlassFilm = true;
            world.floor2.hasPhotoNotebook = true;
            if (window.Floor2Puzzles.showChestLootModal) {
              window.Floor2Puzzles.showChestLootModal();
            }
          });
        }
      }
    },
    {
      id: 'f2_white_light_switch',
      x: 545,
      w: 22,
      title: 'Công Tắc Đèn Phòng Tối',
      label: '[ E ] Bật Đèn Phòng Tối',
      onInteract: () => {
        if (window.Floor2Puzzles) {
          window.Floor2Puzzles.triggerWhiteLightWarning();
        }
      }
    },
    {
      id: 'f2_chemical_bottles',
      x: 572,
      w: 32,
      title: '3 Lọ Hóa Chất Chưa Dán Nhãn',
      label: '[ E ] Thẩm Định 3 Lọ Hóa Chất (A, B, C)',
      onInteract: () => {
        if (window.Floor2Puzzles) {
          window.Floor2Puzzles.openChemicalInspectionModal(() => {
            world.floor2.identifiedChemicals = true;
          });
        }
      }
    },
    {
      id: 'f2_darkroom_trays',
      x: 612,
      w: 55,
      title: 'Bàn Tráng Phim (3 Khay Men)',
      label: '[ E ] Bàn Tráng Phim Thủ Công',
      onInteract: () => {
        if (!world.floor2.hasRawGlassFilm) {
          showDialogue(
            'An',
            'Ba chiếc khay sứ tráng men trắng đang được xếp ngay ngắn dưới ánh đèn đỏ của buồng tối.\nMình cần tìm được tấm phim kính âm bản lưu giữ trong thư khố trước khi bắt đầu tráng ảnh.'
          );
          return;
        }
        if (world.floor2.developedPhoto1930) {
          if (window.Floor2Puzzles) {
            window.Floor2Puzzles.showHistoricalPhotoModal();
          }
        } else if (window.Floor2Puzzles) {
          window.Floor2Puzzles.openDarkroomTraysModal(() => {
            world.floor2.developedPhoto1930 = true;
            if (window.Floor2Puzzles.showHistoricalPhotoModal) {
              window.Floor2Puzzles.showHistoricalPhotoModal();
            }
          });
        }
      }
    },
    {
      id: 'f2_wash_bucket',
      x: 558,
      w: 26,
      title: 'Xô Nước Sạch Dự Phòng',
      label: '[ E ] Khảo sát Xô Nước Sạch Rửa Phim',
      onInteract: () => {
        showDialogue(
          'An',
          'Một xô nước sạch tinh khiết đặt cạnh bàn pha chế để rửa trôi hóa chất dư thừa trên phim.\nNếu thao tác ngâm thuốc bị lệch thời gian, mình có thể rửa sạch phim để làm lại từ đầu.'
        );
      }
    },
    {
      id: 'f2_door_floor3',
      x: 720,
      w: 35,
      title: 'Cửa Lên Tầng 3 (Sân Khấu Tuồng Cổ)',
      get label() {
        return world.floor2.floor3DoorUnlocked
          ? '[ E ] Mở Khóa Sắt & Bước Lên Sân Khấu Tầng 3'
          : '[ E ] Khảo sát Cửa Gỗ Lên Tầng 3';
      },
      onInteract: () => {
        if (world.floor2.floor3DoorUnlocked) {
          showDialogue(
            'An',
            'Chiếc chìa khóa sắt hoen gỉ từ đáy khay tráng phim vừa tra vào ổ khóa cửa gỗ lim đã xoay tách một tiếng.\nMình hãy bước lên Sân Khấu Tuồng Cổ ở Tầng 3 xem vở tuồng năm 1930 khóc cho ai và nguyền rủa ai.',
            () => {
              switchScene('floor3', 45, 1);
            }
          );
        } else {
          showDialogue(
            'An',
            'Cánh cửa gỗ lim dẫn lên khu vực Sân Khấu Tuồng Cổ ở Tầng 3 đang bị khóa bằng một ổ khóa sắt cổ.\nMình nên hoàn tất việc tráng tấm phim kính trong Phòng tối ở Tầng 2 trước.'
          );
        }
      }
    }
  ];

  // --- FLOOR 3 INTERACTABLE TRIGGERS (750px Panoramic Tuồng Stage & Rooftop Attic Secret) ---
  const triggersFloor3 = [
    {
      id: 'f3_staircase_down',
      x: 32,
      w: 38,
      title: 'Cầu Thang Xuống Tầng 2',
      label: '[ E ] Bước Xuống Tầng 2 (Thư Khố)',
      onInteract: () => {
        switchScene('floor2', 710, -1);
      }
    },
    {
      id: 'f3_secret_ladder',
      x: 68,
      w: 36,
      title: 'Vì Kèo Trần Gỗ',
      get label() {
        return world.dragonKeyInserted
          ? '[ E ] Leo Thang Dây Lên Gác Mái'
          : '[ E ] Khảo sát Vì Kèo Trần Nhà';
      },
      onInteract: () => {
        if (world.dragonKeyInserted) {
          showDialogue(
            'An',
            'Một chiếc thang dây bện thừng chắc chắn với các bậc gỗ lim vừa thả xuống từ trên vì kèo.\nMình hãy vịn theo chiếc thang dây này leo lên Gác Sào Màn để kiểm tra các di vật trên nóc rạp.',
            () => {
              if (window.Floor3Puzzles) {
                window.Floor3Puzzles.openSecretAtticModal(() => {
                  if (!world.bacCanhReunionDone) {
                    playAtticReunion();
                  }
                });
              }
            }
          );
        } else {
          showDialogue(
            'An',
            'Hệ vì kèo gỗ lim trên trần nhà được ghép mộng vô cùng kiên cố theo lối kiến trúc cổ xưa.\nPhía sát đầu cột cái có một sợi dây cáp đồng nhỏ chạy dọc theo thân gỗ xuống tầng dưới.'
          );
        }
      }
    },
    {
      id: 'f3_moonlight_window',
      x: 160,
      w: 44,
      title: 'Cửa Sổ Vòm & Lan Can Trăng Rọi',
      label: '[ E ] Ngắm Ánh Trăng Rọi Qua Cửa Vòm',
      onInteract: () => {
        showDialogue(
          'An',
          'Ánh trăng bàng bạc xuyên qua khung cửa sổ vòm cao vút, trải lớp sáng dịu lên sàn gỗ lim.\nTiếng mưa đêm ngoài hiên hòa cùng gió lạnh khiến không gian sân khấu thêm trầm mặc.'
        );
      }
    },
    {
      id: 'f3_stage_costumes',
      x: 255,
      w: 44,
      title: 'Dàn Trang Phục Tuồng Cổ',
      label: '[ E ] Khảo sát Giá Treo Mão & Trang Phục',
      onInteract: () => {
        if (!world.floor3.hasDrumsticks) {
          world.floor3.hasDrumsticks = true;
          if (window.GameAudio) window.GameAudio.clueDiscovered();
          showToast('★ ĐÃ TÌM THẤY: Đôi dùi trống gỗ mun gánh hát!');
          if (window.DeductionJournal) {
            window.DeductionJournal.addKeyword('[Đôi dùi trống gỗ mun]');
          }
          showDialogue(
            'An',
            'Sau tấm mãng bào thêu rồng, mình tìm thấy một Đôi dùi trống bằng gỗ mun sừng đen nhánh bọc lụa điều.\nCầm đôi dùi này, mình đã có thể gõ Đại Trống Chầu theo đúng nhịp phách của gánh hát cổ!'
          );
        } else {
          showDialogue(
            'An',
            'Trên giá gỗ là hàng loạt bộ mãng bào thêu kim tuyến, mão kim khôi và cờ lệnh đoàn hát.\nMình đã lấy đôi dùi trống gỗ mun cài phía sau giá treo này.'
          );
        }
      }
    },
    {
      id: 'f3_tuong_script',
      x: 365,
      w: 44,
      title: 'Bàn Kịch Bản Tuồng Thất Truyền',
      label: '[ E ] Đọc Kịch Bản Tuồng: Vũ Tướng Canh Ngọ Tiêu Thổ Ký',
      onInteract: () => {
        if (!world.floor3.backstageChestOpened && !world.floor3.drumCompleted) {
          showDialogue(
            'An',
            'Bàn để kịch bản tuồng này chỉ còn giá đỡ bằng gỗ trắc trống không.\nNgười ta đã cất bản thảo tuồng thất truyền vào rương sơn son sau cánh gà để tránh ẩm mốc.'
          );
          return;
        }
        if (window.Floor3Puzzles) {
          window.Floor3Puzzles.openTuongScriptModal(() => {
            world.floor3.readTuongScript = true;
          });
        }
      }
    },
    {
      id: 'f3_stage_center',
      x: 475,
      w: 50,
      title: 'Sàn Diễn Tuồng Cổ Tiên Sư',
      label: '[ E ] Đứng Giữa Sân Khấu Hát Bội',
      onInteract: () => {
        showDialogue(
          'An',
          'Đứng giữa mặt sàn gỗ lim của sân khấu Tiên Sư, như vẫn nghe nhịp bước các bậc đào kép.\nChính tại nơi này vào đêm cuối năm 1930, vở tuồng lịch sử đã khép lại giữa biến cố lớn.'
        );
      }
    },
    {
      id: 'f3_ceremonial_drum',
      x: 585,
      w: 48,
      title: 'Đại Trống Chầu Sân Khấu',
      get label() {
        return world.floor3.drumCompleted
          ? '[ E ] Đại Trống Chầu (Đã Định Thần)'
          : world.floor3.hasDrumsticks
            ? '[ E ] Dùng Dùi Gỗ Mun Gõ Trống Chầu'
            : '[ E ] Khảo sát Đại Trống Chầu';
      },
      onInteract: () => {
        if (!world.floor3.hasDrumsticks) {
          showDialogue(
            'An',
            'Mặt trống bịt da trâu già căng đét, viền đóng đinh đồng cổ kính.\nMuốn đánh vang đúng nhịp phách kinh điển, mình cần tìm Đôi dùi trống gỗ mun của kép đánh trống chầu xưa.'
          );
          return;
        }
        if (window.Floor3Puzzles) {
          window.Floor3Puzzles.openDrumRhythmModal(() => {
            world.floor3.drumCompleted = true;
            world.floor3.backstageChestOpened = true;
          });
        }
      }
    },
    {
      id: 'f3_backstage_props',
      x: 685,
      w: 42,
      title: 'Rương Sơn Son Cánh Gà',
      get label() {
        return world.floor3.backstageChestOpened
          ? '[ E ] Khảo sát Rương Sơn Son (Đã Mở)'
          : '[ E ] Khảo sát Rương Sơn Son Sau Cánh Gà';
      },
      onInteract: () => {
        if (!world.floor3.drumCompleted) {
          showDialogue(
            'An',
            'Chiếc rương gỗ sơn son thếp vàng sau cánh gà đang bị khóa bằng then ngầm liên động với giá trống chầu.\nPhải điểm đúng 6 nhịp trống xuất tướng thì then ngầm mới nhả khóa.'
          );
          return;
        }
        world.floor3.backstageChestOpened = true;
        if (window.Floor3Puzzles) {
          window.Floor3Puzzles.openTuongScriptModal(() => {
            world.floor3.readTuongScript = true;
          });
        }
      }
    }
  ];

  // --- EVENT LISTENERS ---
  function isDOMModalActive() {
    return (window.Floor2Puzzles && window.Floor2Puzzles.isActive && window.Floor2Puzzles.isActive()) ||
           (window.Floor3Puzzles && window.Floor3Puzzles.isActive && window.Floor3Puzzles.isActive()) ||
           (window.MuseumMap && window.MuseumMap.isActive && window.MuseumMap.isActive());
  }

  window.addEventListener('keydown', (e) => {
    if (isDOMModalActive()) {
      if (e.code === 'Escape') {
        if (window.Floor3Puzzles && window.Floor3Puzzles.isActive && window.Floor3Puzzles.isActive()) {
          if (typeof window.Floor3Puzzles.requestClose === 'function') window.Floor3Puzzles.requestClose();
          else window.Floor3Puzzles.closeModal();
        } else if (window.Floor2Puzzles && window.Floor2Puzzles.isActive && window.Floor2Puzzles.isActive()) {
          window.Floor2Puzzles.closeModal();
        } else if (window.MuseumMap && window.MuseumMap.isActive && window.MuseumMap.isActive()) {
          window.MuseumMap.closeModal();
        }
      }
      return;
    }
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      e.preventDefault();
    }
    keys[e.code] = true;
    justPressed[e.code] = true;

    // TAB key toggles Deduction Journal
    if (e.code === 'Tab') {
      e.preventDefault();
      if (!dialogue.active && !window.InspectionMode.state.active) {
        window.DeductionJournal.toggle();
      }
    }

    // ESC key closes modal
    if (e.code === 'Escape') {
      if (window.InspectionMode.state.active) {
        window.InspectionMode.close();
      } else if (window.DeductionJournal.state.active) {
        window.DeductionJournal.toggle();
      } else if (window.AltarMode && window.AltarMode.state.active) {
        window.AltarMode.close();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });

  function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = V_WIDTH / rect.width;
    const scaleY = V_HEIGHT / rect.height;
    return {
      x: Math.max(0, Math.min(V_WIDTH, (e.clientX - rect.left) * scaleX)),
      y: Math.max(0, Math.min(V_HEIGHT, (e.clientY - rect.top) * scaleY))
    };
  }

  canvas.addEventListener('mousemove', (e) => {
    const c = getCanvasCoords(e);
    mouse.x = c.x;
    mouse.y = c.y;
    mouse.worldX = c.x + camera.x;
    if (pointerStart && mouse.isDown && Math.hypot(c.x-pointerStart.x,c.y-pointerStart.y)>3) dragged = true;

    // Đổi con trỏ chuột sang pointer khi rê vào vật thể tương tác hoặc nút trong modal
    if (window.InspectionMode.state.active) {
      const t = window.InspectionMode.hoverAt(c.x, c.y);
      canvas.style.cursor = t ? (/lamp|drawer|drag/.test(t) ? (mouse.isDown ? 'grabbing' : 'grab') : 'pointer') : 'default';
    } else if (window.DeductionJournal.state.active || (window.AltarMode && window.AltarMode.state.active) || dialogue.active) {
      canvas.style.cursor = 'pointer';
    } else {
      const curTriggers = world.scene === 'floor3'
        ? triggersFloor3
        : (world.scene === 'floor2'
          ? triggersFloor2
          : (world.scene === 'floor1' ? triggersFloor1 : triggers));
      const hoveredTrigger = curTriggers.find(t => Math.abs(mouse.worldX - t.x) <= t.w * 0.75 && mouse.y >= 45 && mouse.y <= 245);
      const hoveredHudJournal = (mouse.x >= V_WIDTH - 142 && mouse.x <= V_WIDTH - 8 && mouse.y >= 8 && mouse.y <= 26);
      const hoveredBottomPrompt = (mouse.y >= V_HEIGHT - 28 && mouse.y <= V_HEIGHT - 4 && curTriggers.some(t => Math.abs(player.x - t.x) <= t.w * 0.7));
      canvas.style.cursor = (hoveredTrigger || hoveredHudJournal || hoveredBottomPrompt) ? 'pointer' : 'default';
    }
  });

  let pointerStart = null;
  let dragged = false;
  canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || isDOMModalActive()) return;
    const c = getCanvasCoords(e);
    mouse.x = c.x;
    mouse.y = c.y;
    mouse.worldX = c.x + camera.x;
    mouse.isDown = true;
    pointerStart = c; dragged = false;
    if (window.InspectionMode.state.active && !dialogue.active) {
      window.InspectionMode.update(0, mouse, true, clue => window.DeductionJournal.addKeyword(clue), showDialogue);
    }
  });

  window.addEventListener('mouseup', () => {
    mouse.isDown = false;
    pointerStart = null;
    if (window.InspectionMode.cancelGesture) window.InspectionMode.cancelGesture();
  });
  window.addEventListener('blur', () => {
    mouse.isDown=false; pointerStart=null; dragged=false;
    Object.keys(keys).forEach(k => delete keys[k]);
    Object.keys(justPressed).forEach(k => delete justPressed[k]);
    if (window.InspectionMode.cancelGesture) window.InspectionMode.cancelGesture();
  });

  canvas.addEventListener('click', (e) => {
    if (dragged) { dragged=false; return; }
    if (isDOMModalActive()) return;
    const c = getCanvasCoords(e);

    // Dialogue progression on click
    if (dialogue.active) {
      advanceDialogue();
      return;
    }

    // Deduction Journal click handling (Screen coords)
    if (window.DeductionJournal.state.active) {
      window.DeductionJournal.handleClick(c.x, c.y, () => {
        // Solved deduction -> Unlock artifact insight
        showToast('★ SUY LUẬN CHÍNH XÁC: ĐÃ GIẢI MÃ PHÔI GỖ SỐ 47!');
        if (window.GameAudio) window.GameAudio.drumTung();
        window.DeductionJournal.toggle();
        showDialogue(
          'An (Giác ngộ Hồi 1)',
          'Cả ba manh mối đã khớp hoàn toàn! Một phôi gỗ thô bám đầy bồ hóng, nặng gấp đôi bình thường, và sau gáy có hai nốt sáp ong ruồi niêm phong khoang rỗng.\nChắc chắn bên trong khối gỗ này đang cất giấu bí mật của tiền nhân!\nGiờ là lúc bước ra ngoài Đại sảnh, tiến lên Thư khố Tầng 2 để tìm biên bản giám định gốc.',
          () => {
            if (window.GameAudio) window.GameAudio.drumTung();
          }
        );
      });
      return;
    }

    // Inspection Mode click handling (Screen coords)
    if (window.InspectionMode.state.active) {
      window.InspectionMode.handleClick(c.x, c.y, (clue) => {
        window.DeductionJournal.addKeyword(clue);
        showToast(`Đã thêm từ khóa: ${clue}!`);
      }, showDialogue);
      return;
    }

    // Altar Mode Sacred Ritual click handling (Screen coords)
    if (window.AltarMode && window.AltarMode.state.active) {
      window.AltarMode.handleClick(c.x, c.y, world.collectedOfferings, world.hasMatches, showDialogue, onRitualCompleted);
      return;
    }

    // Click vào nút Sổ tay Suy luận ở góc phải trên HUD (x: V_WIDTH - 142 .. V_WIDTH - 8, y: 8 .. 26)
    if (c.x >= V_WIDTH - 142 && c.x <= V_WIDTH - 8 && c.y >= 8 && c.y <= 26) {
      window.DeductionJournal.toggle();
      return;
    }

    // Click vào thanh gợi ý tương tác ở dưới đáy HUD
    const curTriggers = world.scene === 'floor3'
      ? triggersFloor3
      : (world.scene === 'floor2'
        ? triggersFloor2
        : (world.scene === 'floor1' ? triggersFloor1 : triggers));

    if (c.y >= V_HEIGHT - 28 && c.y <= V_HEIGHT - 4) {
      const nearTrigger = curTriggers.find(t => Math.abs(player.x - t.x) <= t.w * 0.7);
      if (nearTrigger) {
        nearTrigger.onInteract();
        return;
      }
    }

    // Click chuột trực tiếp vào vật phẩm / NPC trong thế giới để tương tác (Point-and-Click)
    const clickWorldX = c.x + camera.x;
    const clickedTrigger = curTriggers.find(t => Math.abs(clickWorldX - t.x) <= t.w * 0.75 && c.y >= 45 && c.y <= 245);
    if (clickedTrigger) {
      // Quay mặt An về phía vật phẩm và bước lại gần nếu ở gần, rồi kích hoạt tương tác ngay
      if (Math.abs(player.x - clickedTrigger.x) > 10) {
        player.facing = clickedTrigger.x > player.x ? 1 : -1;
      }
      player.x = clickedTrigger.x - player.facing * 12;
      const curRoomWidth = (world.scene === 'floor3' || world.scene === 'floor2') ? 750 : (world.scene === 'floor1' ? 786 : 1022);
      player.x = Math.max(25, Math.min(curRoomWidth - 25, player.x));
      clickedTrigger.onInteract();
      return;
    }
  });

  // --- GAME UPDATE LOOP ---
  let lastTime = performance.now();

  function update(dt) {
    // Toast update
    if (toast.timer > 0) {
      toast.timer = Math.max(0, toast.timer - dt);
    }

    // Cutscene active
    if (world.scene === 'altar_cutscene') {
      if (dialogue.active) {
        if (justPressed['KeyE'] || justPressed['Space'] || justPressed['Enter']) {
          advanceDialogue();
        }
      }
      return;
    }

    if (isDOMModalActive()) {
      mouse.isDown=false;
      Object.keys(keys).forEach(k => delete keys[k]);
      Object.keys(justPressed).forEach(k => delete justPressed[k]);
      return;
    }
    if (dialogue.active) {
      mouse.isDown=false;
      if (window.InspectionMode.cancelGesture) window.InspectionMode.cancelGesture();
      if (justPressed.KeyE || justPressed.Space || justPressed.Enter) advanceDialogue();
      return;
    }
    // Inspection Mode active
    if (window.InspectionMode.state.active) {
      player.currentAnim = 'inspect';
      player.animTimer += dt;
      if (player.animTimer >= 0.35) {
        player.animTimer = 0;
        const frames = window.GameAssets.anims ? (window.GameAssets.anims.inspect || []) : [];
        if (frames.length > 0) player.frameIdx = (player.frameIdx + 1) % frames.length;
      }
      window.InspectionMode.update(dt, mouse, mouse.isDown, (clue) => {
        window.DeductionJournal.addKeyword(clue);
        showToast(`Đã nhận từ khóa: ${clue}!`);
      }, showDialogue);
      return;
    }

    // Deduction Journal active
    if (window.DeductionJournal.state.active) {
      player.currentAnim = 'write';
      player.animTimer += dt;
      if (player.animTimer >= 0.35) {
        player.animTimer = 0;
        const frames = window.GameAssets.anims ? (window.GameAssets.anims.write || []) : [];
        if (frames.length > 0) player.frameIdx = (player.frameIdx + 1) % frames.length;
      }
      return;
    }

    // Altar Mode Sacred Ritual active
    if (window.AltarMode && window.AltarMode.state.active) {
      player.currentAnim = 'inspect';
      player.animTimer += dt;
      if (player.animTimer >= 0.35) {
        player.animTimer = 0;
        const frames = window.GameAssets.anims ? (window.GameAssets.anims.inspect || []) : [];
        if (frames.length > 0) player.frameIdx = (player.frameIdx + 1) % frames.length;
      }
      window.AltarMode.update(dt);
      return;
    }

    // Dialogue active
    if (dialogue.active) {
      if (justPressed['KeyE'] || justPressed['Space'] || justPressed['Enter']) {
        advanceDialogue();
      }
      return;
    }

    // --- PLAYER MOVEMENT ---
    let moveDir = 0;
    if (keys['KeyA'] || keys['ArrowLeft']) moveDir -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) moveDir += 1;

    player.isMoving = moveDir !== 0;

    const curRoomWidth = (world.scene === 'floor3' || world.scene === 'floor2') ? 750 : (world.scene === 'floor1' ? 786 : 1022);

    if (player.isMoving) {
      player.facing = moveDir;
      player.x += moveDir * player.speed * dt;
      // Clamp player within panoramic room
      player.x = Math.max(25, Math.min(curRoomWidth - 25, player.x));
      player.currentAnim = 'walk';

      // Footstep sound cadence
      player.stepTimer += dt;
      if (player.stepTimer >= 0.28) {
        player.stepTimer = 0;
        if (window.GameAudio) {
          if (world.scene === 'floor1') {
            window.GameAudio.stepMarble();
          } else if (world.scene === 'floor2' || world.scene === 'floor3') {
            window.GameAudio.step();
          } else {
            window.GameAudio.step();
          }
        }
      }
    } else {
      player.currentAnim = 'idle';
      player.stepTimer = 0.2;
    }

    // Update Camera position to smoothly follow player
    camera.targetX = Math.max(0, Math.min(curRoomWidth - V_WIDTH, player.x - V_WIDTH / 2));
    camera.x += (camera.targetX - camera.x) * Math.min(1, dt * 8);

    // Raindrop animation in window area
    world.rainDrops.forEach(r => {
      r.y += r.speed * dt;
      r.x -= r.speed * 0.15 * dt;
      if (r.y > 196) {
        r.y = 76;
        r.x = 54 + Math.random() * 54;
      }
    });

    // Lightning flash timer
    world.lightningTimer += dt;
    if (world.lightningTimer >= 8.5) {
      world.lightningTimer = 0;
      world.lightningFlash = 1.0;
      if (window.GameAudio) window.GameAudio.thunder();
    }
    if (world.lightningFlash > 0) {
      world.lightningFlash = Math.max(0, world.lightningFlash - dt * 2.8);
    }

    // Interaction with [E] or Space
    if (justPressed['KeyE'] || justPressed['Space']) {
      const curTriggers = world.scene === 'floor3'
        ? triggersFloor3
        : (world.scene === 'floor2'
          ? triggersFloor2
          : (world.scene === 'floor1' ? triggersFloor1 : triggers));
      const activeTrigger = curTriggers.find(t => Math.abs(player.x - t.x) <= t.w * 0.7);
      if (activeTrigger) {
        activeTrigger.onInteract();
      }
    }

    // Sprite Animation ticking
    player.animTimer += dt;
    if (player.animTimer >= (player.isMoving ? 0.15 : 0.4)) {
      player.animTimer = 0;
      const frames = window.GameAssets.anims ? (window.GameAssets.anims[player.currentAnim] || []) : [];
      if (frames.length > 0) {
        player.frameIdx = (player.frameIdx + 1) % frames.length;
      }
    }
  }

  // --- RENDERING ---
  function drawPlayer() {
    if (!window.GameAssets || !window.GameAssets.anims) return;
    const frames = window.GameAssets.anims[player.currentAnim] || window.GameAssets.anims.idle;
    const frame = frames[player.frameIdx % frames.length] || frames[0];

    ctx.save();
    ctx.translate(Math.round(player.x), Math.round(player.y));

    // Subtle yellow lantern halo around An
    const halo = ctx.createRadialGradient(0, -50, 8, 0, -50, 96);
    halo.addColorStop(0, 'rgba(255, 220, 125, 0.22)');
    halo.addColorStop(1, 'rgba(255, 220, 125, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, -50, 96, 0, Math.PI * 2);
    ctx.fill();

    // Flip horizontally when walking left
    ctx.scale(player.facing, 1);
    ctx.drawImage(frame, -48, -118);
    ctx.restore();
  }

  function drawWorkshopScene() {
    // 1. Background Pixel Art (Layer 1: Empty room with doorway)
    if (window.GameAssets && window.GameAssets.bgWorkshop) {
      ctx.drawImage(window.GameAssets.bgWorkshop, 0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    } else {
      ctx.fillStyle = '#1c151e';
      ctx.fillRect(0, 0, ROOM_WIDTH, ROOM_HEIGHT);
    }

    // 2. Window Rain & Lightning (Room coords: x: 48..150, y: 55..185)
    if (world.lightningFlash > 0) {
      ctx.fillStyle = `rgba(220, 235, 255, ${world.lightningFlash * 0.35})`;
      ctx.fillRect(48, 55, 102, 130);
    }
    ctx.strokeStyle = 'rgba(180, 210, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (const r of world.rainDrops) {
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - 2, r.y + r.len * 0.7);
    }
    ctx.stroke();

    // 3. Center Pedestal Spotlight & Tuồng Mask (Pedestal center x: 518, top y: 133)
    const flicker = Math.sin(performance.now() * 0.007) * 2;
    const rad = 28 + flicker;
    const grad = ctx.createRadialGradient(518, 126, 3, 518, 126, rad);
    grad.addColorStop(0, 'rgba(255, 230, 130, 0.38)');
    grad.addColorStop(0.6, 'rgba(235, 145, 45, 0.12)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(518, 126, rad, 0, Math.PI * 2);
    ctx.fill();

    // Draw Mask resting on pedestal ONLY if not yet placed in a vitrine
    if (!world.placedVitrine && window.GameAssets) {
      if (world.floor3 && world.floor3.hasDualMask1930 && window.GameAssets.maskTuong) {
        ctx.drawImage(window.GameAssets.maskTuong, 507, 119, 22, 22);
      } else if (world.floor3 && (world.floor3.readTuongScript || world.floor3.hasWhiteHalf) && window.GameAssets.maskRedHalf) {
        ctx.drawImage(window.GameAssets.maskRedHalf, 511, 119, 12, 22);
      } else if (window.GameAssets.maskTuong) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(507, 119, 13, 22);
        ctx.clip();
        ctx.drawImage(window.GameAssets.maskTuong, 507, 119, 22, 22);
        ctx.restore();
      }
    } else if (world.placedVitrine) {
      // Small paper note on empty workshop workbench
      ctx.fillStyle = '#f5ecc9';
      ctx.fillRect(511, 128, 14, 8);
      ctx.strokeStyle = '#8c6239';
      ctx.lineWidth = 0.6;
      ctx.strokeRect(511, 128, 14, 8);
      ctx.fillStyle = '#6a431d';
      ctx.font = 'bold 3px sans-serif';
      ctx.fillText('ĐÃ TRƯNG BÀY', 512, 133);
    }

    // 4. Drawer State on Research Desk (x: 715, y: 176)
    if (world.drawerOpen) {
      // Open drawer sliding out under desk surface
      ctx.fillStyle = '#22140d';
      ctx.fillRect(702, 175, 42, 16);
      ctx.fillStyle = '#4a2b18';
      ctx.fillRect(700, 177, 46, 16);
      ctx.strokeStyle = '#855628';
      ctx.lineWidth = 1;
      ctx.strokeRect(700, 177, 46, 16);
      // Brass handle
      ctx.fillStyle = '#ecc554';
      ctx.fillRect(720, 184, 6, 2);

      // Ritual items revealed inside drawer
      if (window.GameAssets && window.GameAssets.baoHuongTram) {
        ctx.drawImage(window.GameAssets.baoHuongTram, 704, 162, 18, 20);
      }
      if (window.GameAssets && window.GameAssets.diaTrauCauKho) {
        ctx.drawImage(window.GameAssets.diaTrauCauKho, 724, 168, 20, 10);
      }
    }

    // 5. Doorway & Door State (x: 905..1006, y: 72..235)
    // Dùng nguyên vẹn cánh cửa gỗ tự nhiên có sẵn trong tranh gốc theo yêu cầu, không vẽ đè lớp overlay.
    // Tương tác chốt cửa và chuyển cảnh sang Gian Thờ Tổ vẫn được xử lý qua trigger door (x: 956).

    // 8. Draw Active Trigger Overhead Prompt
    if (!dialogue.active && !window.InspectionMode.state.active && !window.DeductionJournal.state.active) {
      const activeTrigger = triggers.find(t => Math.abs(player.x - t.x) <= t.w * 0.7);
      if (activeTrigger) {
        // Floating [E] tag above object
        ctx.fillStyle = '#201828';
        ctx.strokeStyle = '#ecc554';
        ctx.lineWidth = 1;
        ctx.fillRect(activeTrigger.x - 14, 118, 28, 14);
        ctx.strokeRect(activeTrigger.x - 14, 118, 28, 14);
        ctx.fillStyle = '#ecc554';
        ctx.font = 'bold 7.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('[ E ]', activeTrigger.x, 128);
        ctx.textAlign = 'left';
      }
    }
  }

  function drawExhibitedMask() {
    if (!world.placedVitrine) return;
    const cx = {1:327, 3:377, 2:427}[world.placedVitrine];
    const assets = window.GameAssets || {};
    ctx.save();
    // Keep the restored artifact inside the existing glass enclosure.
    ctx.beginPath(); ctx.rect(cx - 16, 145, 32, 43); ctx.clip();
    const light = ctx.createRadialGradient(cx, 166, 1, cx, 166, 22);
    light.addColorStop(0, 'rgba(255,222,140,0.3)'); light.addColorStop(1, 'rgba(255,222,140,0)');
    ctx.fillStyle=light; ctx.fillRect(cx-16,145,32,43);
    ctx.fillStyle='#4b3322'; ctx.fillRect(cx-1,173,2,13);
    ctx.fillStyle='#a17b42'; ctx.fillRect(cx-9,184,18,3);
    if (world.exhibitionHasDualMask && assets.maskRedHalf && assets.maskWhiteHalf) {
      ctx.drawImage(assets.maskRedHalf,cx-11,152,11,29);
      ctx.drawImage(assets.maskWhiteHalf,cx,152,11,29);
      ctx.strokeStyle='#ffe09a'; ctx.lineWidth=0.7;
      ctx.beginPath(); ctx.moveTo(cx,153); ctx.lineTo(cx,179); ctx.stroke();
    } else if (world.placedVitrine === 1) {
      if (assets.maskRedHalf) ctx.drawImage(assets.maskRedHalf,cx-11,151,11,28);
      ctx.fillStyle='#e8d5a6'; ctx.fillRect(cx+2,157,11,21);
      ctx.fillStyle='#9f3028'; ctx.fillRect(cx+5,172,4,4);
      ctx.fillStyle='#826137'; ctx.fillRect(cx+4,161,7,1); ctx.fillRect(cx+4,165,7,1);
    } else {
      // Mounted historical photograph and manuscript, not a missing restored mask.
      ctx.fillStyle='#e8ddc7'; ctx.fillRect(cx-13,153,25,18);
      ctx.fillStyle='#44403b'; ctx.fillRect(cx-11,155,21,14);
      ctx.fillStyle='#aaa18a'; ctx.fillRect(cx-8,159,6,8); ctx.fillRect(cx+2,157,5,10);
      ctx.fillStyle='#f1dfb9'; ctx.fillRect(cx-8,173,19,9);
      ctx.fillStyle='#765936'; ctx.fillRect(cx-6,175,14,1); ctx.fillRect(cx-6,178,12,1);
    }
    // Glass reflection in front of the mask, not an opaque floating sticker.
    ctx.fillStyle='rgba(225,240,255,0.08)'; ctx.fillRect(cx-13,147,2,34);
    ctx.restore();
  }

  function drawFloor1Scene() {
    // 1. Panoramic Floor 1 Pixel Art Background (786 x 250)
    if (window.GameAssets && window.GameAssets.bgFloor1) {
      ctx.drawImage(window.GameAssets.bgFloor1, 0, 0, 786, 250);
    } else {
      ctx.fillStyle = '#1e1822';
      ctx.fillRect(0, 0, 786, 250);
    }

    // 2. Soft Moonbeams & Vitrine Lighting Effects
    // Vitrine 1 (Left - Ending 1: Danh Tướng / Warm Golden Spotlight)
    const vg1 = ctx.createLinearGradient(327, 145, 327, 187);
    vg1.addColorStop(0, 'rgba(240, 200, 90, 0.12)');
    vg1.addColorStop(1, 'rgba(240, 200, 90, 0.01)');
    ctx.fillStyle = vg1;
    ctx.fillRect(312, 145, 30, 43);

    // Vitrine 2 (Center - Ending 3: Trụ kính bệ xoay / Dual Golden & Silver Beams)
    const vg2 = ctx.createLinearGradient(377, 145, 377, 187);
    vg2.addColorStop(0, 'rgba(255, 245, 180, 0.16)');
    vg2.addColorStop(0.5, 'rgba(180, 225, 255, 0.12)');
    vg2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = vg2;
    ctx.fillRect(361, 145, 32, 43);

    // Vitrine 3 (Right - Ending 2: Sự thật lịch sử / Somber Crimson Spotlight)
    const vg3 = ctx.createLinearGradient(427, 145, 427, 187);
    vg3.addColorStop(0, 'rgba(215, 80, 60, 0.12)');
    vg3.addColorStop(1, 'rgba(215, 80, 60, 0.01)');
    ctx.fillStyle = vg3;
    ctx.fillRect(412, 145, 30, 43);

    // Render Mask inside the Chosen Vitrine
    drawExhibitedMask();

    // 3. Cửa Sắt Thư Khố Étage 2 (x: 548, y: 196) - Ổ Khóa Đồng Cổ Trạng Thái
    const lockX = 548;
    const lockY = 196;
    if (world.archivesDoorUnlocked) {
      // Ổ khóa đồng đã bật chốt (Shackle opened with green aura)
      ctx.fillStyle = 'rgba(88, 214, 141, 0.22)';
      ctx.beginPath();
      ctx.arc(lockX, lockY, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#58d68d';
      ctx.fillRect(lockX - 3, lockY - 1, 6, 6);
      ctx.strokeStyle = '#221122';
      ctx.lineWidth = 1;
      ctx.strokeRect(lockX - 3, lockY - 1, 6, 6);
      // Móc khóa mở
      ctx.strokeStyle = '#58d68d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(lockX - 1, lockY - 4, 3, Math.PI, 0);
      ctx.stroke();
    } else {
      // Ổ khóa đồng cổ to bản nặng trịch ban đầu
      ctx.fillStyle = '#b88628';
      ctx.fillRect(lockX - 4, lockY - 2, 8, 8);
      ctx.strokeStyle = '#5a4014';
      ctx.lineWidth = 1;
      ctx.strokeRect(lockX - 4, lockY - 2, 8, 8);
      // Quai khóa
      ctx.strokeStyle = '#8a6422';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(lockX, lockY - 4, 3.5, Math.PI, 0);
      ctx.stroke();
      // Lỗ tra chìa
      ctx.fillStyle = '#221108';
      ctx.fillRect(lockX - 1, lockY + 1, 2, 3);
    }

    // 4. Cây Cột Cái chạm Đầu Rồng (x: 588) - Ánh phản chiếu khe cắm kim loại bí mật
    const dragX = 588;
    const dragY = 65;
    const dgGlow = ctx.createRadialGradient(dragX, dragY, 1, dragX, dragY, 16);
    dgGlow.addColorStop(0, 'rgba(236, 197, 84, 0.32)');
    dgGlow.addColorStop(0.5, 'rgba(236, 197, 84, 0.12)');
    dgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = dgGlow;
    ctx.beginPath();
    ctx.arc(dragX, dragY, 16, 0, Math.PI * 2);
    ctx.fill();

    // Subtle metallic glint spark on dragon mouth
    const glintTime = performance.now() * 0.003;
    const glintAlpha = 0.4 + Math.sin(glintTime * 2) * 0.3;
    ctx.fillStyle = `rgba(255, 255, 220, ${glintAlpha})`;
    ctx.fillRect(dragX - 1, dragY - 1, 2, 2);

    // 5. NPC Bác Cảnh (Thủ từ) ngồi trên ghế gỗ (x: 642, y: 166, w: 34, h: 66)
    if (window.GameAssets && window.GameAssets.npcBacCanhAnim) {
      // 8-frame subtle breathing & blinking animation (~400ms per frame)
      const frameIdx = Math.floor((performance.now() / 400) % 8);
      const frameW = 34;
      const frameH = 66;
      const sx = frameIdx * frameW;
      const dx = 642;
      const dy = 166; // 232 - 66, perfectly seated on the chair seat with feet on floor

      ctx.drawImage(
        window.GameAssets.npcBacCanhAnim,
        sx, 0, frameW, frameH,
        dx, dy, frameW, frameH
      );
    }

    // 6. Bàn Gỗ Đựng Hộp Diêm của Bác Cảnh (x: 691, y: 182)
    if (!world.hasMatches) {
      const pulse = Math.sin(performance.now() * 0.005) * 2;
      const mGlow = ctx.createRadialGradient(691, 182, 1, 691, 182, 12 + pulse);
      mGlow.addColorStop(0, 'rgba(255, 225, 110, 0.55)');
      mGlow.addColorStop(0.6, 'rgba(235, 95, 30, 0.2)');
      mGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mGlow;
      ctx.beginPath();
      ctx.arc(691, 182, 12 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Hộp diêm quẹt cổ màu đỏ son trên mặt bàn
      ctx.fillStyle = '#b33927';
      ctx.fillRect(689, 181, 5, 3);
      ctx.strokeStyle = '#ecc554';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(689, 181, 5, 3);
    }

    // 7. Gian Thờ Tổ (x: 745) - Đèn Lồng Đỏ & Khói Trầm Nghi Ngút
    const lanternFlicker = Math.sin(performance.now() * 0.006) * 2;
    const altarGlow = ctx.createRadialGradient(745, 140, 8, 745, 140, 48 + lanternFlicker);
    altarGlow.addColorStop(0, world.floor1AltarCompleted ? 'rgba(235, 75, 45, 0.35)' : 'rgba(215, 60, 40, 0.18)');
    altarGlow.addColorStop(0.7, 'rgba(180, 80, 30, 0.08)');
    altarGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = altarGlow;
    ctx.beginPath();
    ctx.arc(745, 140, 48 + lanternFlicker, 0, Math.PI * 2);
    ctx.fill();

    if (world.floor1AltarCompleted) {
      const t = performance.now() * 0.002;
      ctx.strokeStyle = 'rgba(240, 230, 210, 0.32)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(745, 135);
      ctx.bezierCurveTo(
        738 + Math.sin(t) * 4, 115,
        742 + Math.cos(t) * 5, 95,
        740 + Math.sin(t * 1.5) * 6, 75
      );
      ctx.stroke();
    }

    // 7. Active Trigger Overhead Prompt on Floor 1
    if (!dialogue.active && !window.InspectionMode.state.active && !window.DeductionJournal.state.active && !(window.AltarMode && window.AltarMode.state.active)) {
      const activeTrigger = triggersFloor1.find(t => Math.abs(player.x - t.x) <= t.w * 0.7);
      if (activeTrigger) {
        ctx.fillStyle = '#201828';
        ctx.strokeStyle = '#ecc554';
        ctx.lineWidth = 1;
        ctx.fillRect(Math.round(activeTrigger.x - 14), 148, 28, 14);
        ctx.strokeRect(Math.round(activeTrigger.x - 14), 148, 28, 14);
        ctx.fillStyle = '#ecc554';
        ctx.font = 'bold 7.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('[ E ]', activeTrigger.x, 158);
        ctx.textAlign = 'left';
      }
    }
  }

  function drawStoryBacCanh(x, y) {
    if (!window.GameAssets || !window.GameAssets.npcBacCanh) return;
    ctx.save();
    ctx.drawImage(window.GameAssets.npcBacCanh, x - 23, y - 97, 46, 97);
    ctx.strokeStyle = '#986b37'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 21, y - 38); ctx.lineTo(x + 21, y); ctx.stroke();
    ctx.restore();
  }

  function drawFloor2Scene() {
    // 1. Panoramic Floor 2 Pixel Art Background (750 x 250)
    if (window.GameAssets && window.GameAssets.bgFloor2) {
      ctx.drawImage(window.GameAssets.bgFloor2, 0, 0, 750, 250);
    } else {
      ctx.fillStyle = '#18121d';
      ctx.fillRect(0, 0, 750, 250);
    }

    // 2. Moonlight Beam from Study Window (x: 100..180)
    const mg = ctx.createLinearGradient(140, 25, 140, 220);
    mg.addColorStop(0, 'rgba(160, 210, 255, 0.16)');
    mg.addColorStop(0.6, 'rgba(120, 180, 240, 0.08)');
    mg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = mg;
    ctx.fillRect(95, 30, 80, 190);

    // 2b. Architectural Cross-Section Blueprint Scroll on Floor 2 Table (x: 210, y: 175)
    const bpX = 200;
    const bpY = 172;
    ctx.fillStyle = '#e8d8b0';
    ctx.fillRect(bpX, bpY, 20, 11);
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 1;
    ctx.strokeRect(bpX, bpY, 20, 11);
    // Blueprint grid lines
    ctx.fillStyle = '#3b5998';
    ctx.fillRect(bpX + 3, bpY + 3, 14, 1.2);
    ctx.fillRect(bpX + 3, bpY + 6, 10, 1.2);
    // Rolled scroll edges
    ctx.fillStyle = '#c89d42';
    ctx.fillRect(bpX - 2, bpY - 1, 2.5, 13);
    ctx.fillRect(bpX + 19.5, bpY - 1, 2.5, 13);

    // 3. Royal Edict Vitrine Warm Spotlight (x: 308, y: 135)
    const edGlow = ctx.createRadialGradient(308, 135, 6, 308, 135, 52);
    edGlow.addColorStop(0, 'rgba(245, 215, 120, 0.28)');
    edGlow.addColorStop(0.6, 'rgba(215, 160, 60, 0.1)');
    edGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = edGlow;
    ctx.beginPath();
    ctx.arc(308, 135, 52, 0, Math.PI * 2);
    ctx.fill();

    // 4. French Photographer's Chest (x: 422, y: 205)
    const chestX = 422;
    const chestY = 205;
    if (world.floor2.frenchChestUnlocked) {
      // Unlocked: subtle green aura + opened lid indicator
      ctx.fillStyle = 'rgba(88, 214, 141, 0.25)';
      ctx.beginPath();
      ctx.arc(chestX, chestY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#58d68d';
      ctx.fillRect(chestX - 3, chestY - 4, 6, 4);
    } else {
      // Locked: brass dials glint
      const glint = 0.4 + Math.sin(performance.now() * 0.005) * 0.35;
      ctx.fillStyle = `rgba(236, 197, 84, ${glint})`;
      ctx.fillRect(chestX - 2, chestY - 2, 4, 4);
    }

    // 5. RED SAFELIGHT ZONE (Tích hợp trực tiếp từ bóng đèn treo có sẵn trong ảnh tại x: 544, y: 88)
    const redLampX = 544;
    const redLampY = 88;
    const bulbPulse = Math.sin(performance.now() * 0.004) * 0.12;

    // Red safelight ambient glow cast over trays and bench from existing lamp
    const darkroomGlow = ctx.createRadialGradient(redLampX, redLampY, 4, redLampX, redLampY + 30, 115);
    darkroomGlow.addColorStop(0, `rgba(255, 45, 50, ${0.38 + bulbPulse})`);
    darkroomGlow.addColorStop(0.35, `rgba(220, 25, 35, ${0.20 + bulbPulse * 0.5})`);
    darkroomGlow.addColorStop(0.7, 'rgba(140, 10, 20, 0.06)');
    darkroomGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = darkroomGlow;
    ctx.beginPath();
    ctx.arc(redLampX, redLampY + 30, 115, 0, Math.PI * 2);
    ctx.fill();

    // 7. Three Enamel Trays on the Bench (x: 612, y: 182)
    const trayBaseX = 596;
    const trayY = 182;
    for (let i = 0; i < 3; i++) {
      const tx = trayBaseX + i * 16;
      ctx.fillStyle = '#eaecee';
      ctx.fillRect(tx, trayY, 13, 6);
      ctx.strokeStyle = '#5d6d7e';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(tx, trayY, 13, 6);

      // Liquid sheen in tray
      if (world.floor2.identifiedChemicals || world.floor2.developedPhoto1930) {
        ctx.fillStyle = i === 0 ? 'rgba(212, 172, 13, 0.45)' : (i === 1 ? 'rgba(180, 30, 40, 0.45)' : 'rgba(180, 180, 190, 0.45)');
        ctx.fillRect(tx + 1.5, trayY + 1.5, 10, 3);
      }
    }

    // 8. Clean Water Fail-Safe Bucket (x: 558, y: 198)
    ctx.fillStyle = '#4a5568';
    ctx.fillRect(554, 198, 10, 12);
    ctx.fillStyle = 'rgba(100, 180, 240, 0.4)';
    ctx.fillRect(555, 199, 8, 3);

    // 9. Floor 3 Exit Door (x: 720, y: 145)
    const d3X = 720;
    const d3Y = 145;
    if (world.floor2.floor3DoorUnlocked) {
      // Unlocked: Green signal light above door
      ctx.fillStyle = '#58d68d';
      ctx.beginPath();
      ctx.arc(d3X, d3Y - 14, 3, 0, Math.PI * 2);
      ctx.fill();

      const dGlow = ctx.createRadialGradient(d3X, d3Y, 2, d3X, d3Y, 18);
      dGlow.addColorStop(0, 'rgba(88, 214, 141, 0.35)');
      dGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = dGlow;
      ctx.beginPath();
      ctx.arc(d3X, d3Y, 18, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Locked: Red signal light
      ctx.fillStyle = '#d9463e';
      ctx.beginPath();
      ctx.arc(d3X, d3Y - 14, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (world.storyScene === 'darkroom_confrontation') drawStoryBacCanh(575, 231);

    // 10. Draw Active Trigger Overhead Prompt on Floor 2
    if (!dialogue.active && !window.InspectionMode.state.active && !window.DeductionJournal.state.active) {
      const activeTrigger = triggersFloor2.find(t => Math.abs(player.x - t.x) <= t.w * 0.7);
      if (activeTrigger) {
        ctx.fillStyle = '#201828';
        ctx.strokeStyle = '#ecc554';
        ctx.lineWidth = 1;
        ctx.fillRect(Math.round(activeTrigger.x - 14), 138, 28, 14);
        ctx.strokeRect(Math.round(activeTrigger.x - 14), 138, 28, 14);
        ctx.fillStyle = '#ecc554';
        ctx.font = 'bold 7.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('[ E ]', activeTrigger.x, 148);
        ctx.textAlign = 'left';
      }
    }
  }

  function drawFloor3Scene() {
    // 1. Panoramic Floor 3 Pixel Art Background (750 x 250)
    if (window.GameAssets && window.GameAssets.bgFloor3) {
      ctx.drawImage(window.GameAssets.bgFloor3, 0, 0, 750, 250);
    } else {
      ctx.fillStyle = '#18101e';
      ctx.fillRect(0, 0, 750, 250);
    }

    // 2. Secret Rope Ladder mechanism (x: 55..82, y: 10..220)
    // "bức ảnh thứ 2 là cầu thang dẫn tới căn phòng bí mật sau khi nhét chìa khóa vào đầu rồng ở tầng 1.
    // lưu ý cái cầu thang này ko hiện luôn mà chỉ hiện sau khi nhét chìa khóa. vị trí cầu thang sẽ ở đầu của tầng 3, ở khoảng trống."
    if (world.dragonKeyInserted && window.GameAssets && window.GameAssets.ladderSecret) {
      // Warm golden ethereal aura around the dropped ladder
      const pulse = Math.sin(performance.now() * 0.004) * 0.08;
      const ladderGlow = ctx.createRadialGradient(68, 115, 8, 68, 115, 55);
      ladderGlow.addColorStop(0, `rgba(236, 197, 84, ${0.28 + pulse})`);
      ladderGlow.addColorStop(0.6, `rgba(212, 143, 56, ${0.12 + pulse * 0.5})`);
      ladderGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ladderGlow;
      ctx.beginPath();
      ctx.arc(68, 115, 55, 0, Math.PI * 2);
      ctx.fill();

      // Open ceiling hatch aperture
      ctx.fillStyle = '#0a0604';
      ctx.fillRect(52, 6, 33, 8);
      ctx.strokeStyle = '#ecc554';
      ctx.lineWidth = 1;
      ctx.strokeRect(52, 6, 33, 8);

      // Render trimmed pixel-art secret rope ladder sprite
      ctx.drawImage(window.GameAssets.ladderSecret, 55, 12, 27, 210);

      // Hanging hook glints
      ctx.fillStyle = '#ffe082';
      ctx.fillRect(58, 12, 4, 3);
      ctx.fillRect(75, 12, 4, 3);
    } else {
      // Locked wooden trapdoor in rafters before key insertion
      ctx.fillStyle = '#22150c';
      ctx.fillRect(52, 6, 33, 8);
      ctx.strokeStyle = '#5a3b22';
      ctx.lineWidth = 1;
      ctx.strokeRect(52, 6, 33, 8);

      // Iron lock plate & chain ring
      ctx.fillStyle = '#855628';
      ctx.fillRect(66, 7, 5, 6);
      ctx.strokeStyle = '#b88628';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(68.5, 10, 2.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Arched Window Moonlight Beams (x: 130..200)
    const mg = ctx.createLinearGradient(165, 20, 165, 230);
    mg.addColorStop(0, 'rgba(175, 220, 255, 0.18)');
    mg.addColorStop(0.5, 'rgba(130, 190, 245, 0.09)');
    mg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.moveTo(140, 20);
    ctx.lineTo(190, 20);
    ctx.lineTo(210, 230);
    ctx.lineTo(125, 230);
    ctx.closePath();
    ctx.fill();

    // 4. Tuồng Costumes Display Warm Glow (x: 255, y: 130)
    const cg = ctx.createRadialGradient(255, 130, 6, 255, 130, 48);
    cg.addColorStop(0, 'rgba(235, 120, 50, 0.16)');
    cg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.arc(255, 130, 48, 0, Math.PI * 2);
    ctx.fill();

    // 5. Lost Script Stand Lighting (x: 365, y: 155)
    const sg = ctx.createRadialGradient(365, 155, 4, 365, 155, 38);
    sg.addColorStop(0, 'rgba(255, 230, 140, 0.22)');
    sg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(365, 155, 38, 0, Math.PI * 2);
    ctx.fill();

    // 6. Stage Center Theatrical Spotlight (x: 475, y: 150)
    const stageGlow = ctx.createRadialGradient(475, 150, 12, 475, 150, 75);
    stageGlow.addColorStop(0, 'rgba(255, 245, 190, 0.22)');
    stageGlow.addColorStop(0.6, 'rgba(220, 175, 75, 0.08)');
    stageGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = stageGlow;
    ctx.beginPath();
    ctx.arc(475, 150, 75, 0, Math.PI * 2);
    ctx.fill();

    // 7. Ceremonial Drum Spotlight & Rhythm Resonance (x: 585, y: 155)
    const drumPulse = Math.sin(performance.now() * 0.005) * 2;
    const dg = ctx.createRadialGradient(585, 155, 8, 585, 155, 52 + drumPulse);
    if (world.floor3.drumCompleted) {
      dg.addColorStop(0, 'rgba(88, 214, 141, 0.32)');
      dg.addColorStop(0.6, 'rgba(46, 139, 87, 0.12)');
    } else {
      dg.addColorStop(0, 'rgba(217, 70, 62, 0.26)');
      dg.addColorStop(0.6, 'rgba(236, 197, 84, 0.10)');
    }
    dg.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = dg;
    ctx.beginPath();
    ctx.arc(585, 155, 52 + drumPulse, 0, Math.PI * 2);
    ctx.fill();

    // 8. Makeup Desk Lantern Glint (x: 685, y: 160)
    const mug = ctx.createRadialGradient(685, 160, 4, 685, 160, 32);
    mug.addColorStop(0, 'rgba(240, 180, 100, 0.18)');
    mug.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = mug;
    ctx.beginPath();
    ctx.arc(685, 160, 32, 0, Math.PI * 2);
    ctx.fill();

    if (world.storyScene === 'attic_reunion') drawStoryBacCanh(145, 231);

    // 9. Draw Active Trigger Overhead Prompt on Floor 3
    if (!dialogue.active && !window.InspectionMode.state.active && !window.DeductionJournal.state.active) {
      const activeTrigger = triggersFloor3.find(t => Math.abs(player.x - t.x) <= t.w * 0.7);
      if (activeTrigger) {
        ctx.fillStyle = '#201828';
        ctx.strokeStyle = '#ecc554';
        ctx.lineWidth = 1;
        ctx.fillRect(Math.round(activeTrigger.x - 14), 138, 28, 14);
        ctx.strokeRect(Math.round(activeTrigger.x - 14), 138, 28, 14);
        ctx.fillStyle = '#ecc554';
        ctx.font = 'bold 7.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('[ E ]', activeTrigger.x, 148);
        ctx.textAlign = 'left';
      }
    }
  }

  function drawAltarCutscene() {
    // Background Altar of Tuồng Ancestor (Gian Thờ Tổ Tầng 1)
    ctx.fillStyle = '#2a1616';
    ctx.fillRect(0, 0, V_WIDTH, V_HEIGHT);

    // Altar Table
    ctx.fillStyle = '#541c1c';
    ctx.fillRect(160, 95, 160, 115);
    ctx.strokeStyle = '#ecc554';
    ctx.lineWidth = 2;
    ctx.strokeRect(160, 95, 160, 115);

    // Hoành phi "TIÊN SƯ HÁT BỘI"
    ctx.fillStyle = '#8a1c1c';
    ctx.fillRect(150, 32, 180, 28);
    ctx.strokeStyle = '#ecc554';
    ctx.strokeRect(150, 32, 180, 28);
    ctx.fillStyle = '#ecc554';
    ctx.font = 'bold 11px serif';
    ctx.textAlign = 'center';
    ctx.fillText('TIÊN SƯ HÁT BỘI', 240, 50);

    // Tea table & Bác Cảnh
    ctx.fillStyle = '#3a2416';
    ctx.fillRect(75, 165, 52, 45);
    if (window.GameAssets && window.GameAssets.npcBacCanh) {
      ctx.drawImage(window.GameAssets.npcBacCanh, 45, 136, 46, 74);
    } else {
      ctx.fillStyle = '#5c3a28';
      ctx.fillRect(52, 140, 28, 70);
    }
    ctx.fillStyle = '#ecc554';
    ctx.font = 'bold 7.5px sans-serif';
    ctx.fillText('Bác Cảnh (Thủ từ)', 68, 130);

    // An standing on the right
    if (window.GameAssets && window.GameAssets.anims && window.GameAssets.anims.idle) {
      ctx.drawImage(window.GameAssets.anims.idle[0], 360 - 48, 244 - 118);
      ctx.fillStyle = '#58d68d';
      ctx.font = 'bold 7.5px sans-serif';
      ctx.fillText('An', 360, 122);
    }
    ctx.textAlign = 'left';
  }

  function drawHUD() {
    // 1. Room Title Badge
    ctx.fillStyle = 'rgba(18, 14, 24, 0.88)';
    ctx.fillRect(8, 8, 256, 18);
    ctx.strokeStyle = '#c89d42';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, 256, 18);

    ctx.fillStyle = '#ecc554';
    ctx.font = `bold 8px ${FONT_SANS}`;
    const roomTitle = world.scene === 'workshop'
      ? '🏛️ CHÁI TÂY: XƯỞNG PHỤC CHẾ (SAFEZONE)'
      : (world.scene === 'floor1'
        ? '🏮 TẦNG 1: ĐẠI SẢNH BẢO TÀNG & GIAN THỜ TỔ'
        : (world.scene === 'floor2'
          ? '📜 TẦNG 2: THƯ KHỐ & PHÒNG TỐI TRÁNG ẢNH'
          : '🎭 TẦNG 3: SÂN KHẤU TUỒNG CỔ TIÊN SƯ'));
    ctx.fillText(roomTitle, 13, 20.5);

    // 2. Journal Shortcut Prompt Badge [TAB]
    if (!dialogue.active && !window.InspectionMode.state.active && !(window.AltarMode && window.AltarMode.state.active)) {
      ctx.fillStyle = 'rgba(18, 14, 24, 0.88)';
      ctx.fillRect(V_WIDTH - 142, 8, 134, 18);
      ctx.strokeStyle = '#c89d42';
      ctx.lineWidth = 1;
      ctx.strokeRect(V_WIDTH - 142, 8, 134, 18);

      ctx.fillStyle = '#58d68d';
      ctx.font = `bold 8px ${FONT_SANS}`;
      ctx.fillText('📖 [TAB] SỔ TAY SUY LUẬN', V_WIDTH - 136, 20.5);
    }

    // 3. Bottom Banner Prompt for Current Active Trigger
    if (!dialogue.active && !window.InspectionMode.state.active && !window.DeductionJournal.state.active && !(window.AltarMode && window.AltarMode.state.active)) {
      const curTriggers = world.scene === 'floor3'
        ? triggersFloor3
        : (world.scene === 'floor2'
          ? triggersFloor2
          : (world.scene === 'floor1' ? triggersFloor1 : triggers));
      const activeTrigger = curTriggers.find(t => Math.abs(player.x - t.x) <= t.w * 0.7);
      if (activeTrigger) {
        ctx.font = `bold 8px ${FONT_SANS}`;
        const tw = ctx.measureText(activeTrigger.label).width + 24;
        const bx = Math.round((V_WIDTH - tw) / 2);
        ctx.fillStyle = 'rgba(18, 14, 24, 0.94)';
        ctx.fillRect(bx, V_HEIGHT - 26, tw, 20);
        ctx.strokeStyle = '#ecc554';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, V_HEIGHT - 26, tw, 20);
        ctx.fillStyle = '#ecc554';
        ctx.textAlign = 'center';
        ctx.fillText(activeTrigger.label, bx + tw / 2, V_HEIGHT - 13);
        ctx.textAlign = 'left';
      }
    }

    // 4. Toast Message
    if (toast.timer > 0 && toast.text) {
      ctx.font = `bold 8.5px ${FONT_SANS}`;
      const tw = ctx.measureText(toast.text).width + 24;
      const tx = Math.round((V_WIDTH - tw) / 2);
      ctx.fillStyle = 'rgba(20, 48, 36, 0.95)';
      ctx.fillRect(tx, 32, tw, 20);
      ctx.strokeStyle = '#58d68d';
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, 32, tw, 20);
      ctx.fillStyle = '#f5ecc9';
      ctx.textAlign = 'center';
      ctx.fillText(toast.text, tx + tw / 2, 45);
      ctx.textAlign = 'left';
    }

    // 5. Dialogue Box
    if (dialogue.active) {
      const boxW = V_WIDTH - 32;
      const curLines = dialogue.pages[dialogue.page] || [];
      const boxH = Math.max(74, 58 + Math.max(0, curLines.length - 1) * 16);
      const boxX = 16;
      const boxY = V_HEIGHT - boxH - 10;

      // Dark Lacquer Frame
      ctx.fillStyle = 'rgba(16, 12, 22, 0.96)';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#c89d42';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      // Gold Corner Accents
      ctx.fillStyle = '#ecc554';
      ctx.fillRect(boxX + 2, boxY + 2, 4, 1.5);
      ctx.fillRect(boxX + 2, boxY + 2, 1.5, 4);
      ctx.fillRect(boxX + boxW - 6, boxY + 2, 4, 1.5);
      ctx.fillRect(boxX + boxW - 3.5, boxY + 2, 1.5, 4);

      // Portrait Box
      ctx.fillStyle = '#22192d';
      ctx.fillRect(boxX + 8, boxY + 9, 44, 56);
      ctx.strokeStyle = '#5a4224';
      ctx.lineWidth = 1;
      ctx.strokeRect(boxX + 8, boxY + 9, 44, 56);

      // Character Portrait Icon
      if (dialogue.speaker.includes('Bác Cảnh') && window.GameAssets && window.GameAssets.npcBacCanh) {
        ctx.drawImage(window.GameAssets.npcBacCanh, boxX + 8, boxY + 9, 44, 56);
      } else if (window.GameAssets && window.GameAssets.fullSheet) {
        // High quality face crop from 4x4 master sheet (An's head in cell 0,0)
        ctx.drawImage(window.GameAssets.fullSheet, 115, 14, 80, 98, boxX + 8, boxY + 9, 44, 56);
      } else if (window.GameAssets && window.GameAssets.anims && window.GameAssets.anims.idle) {
        ctx.drawImage(window.GameAssets.anims.idle[0], boxX + 8 - 26, boxY + 9 - 20, 96, 120);
      }

      // Speaker Name
      ctx.fillStyle = '#ecc554';
      ctx.font = `bold 9px ${FONT_SANS}`;
      ctx.fillText(dialogue.speaker, boxX + 60, boxY + 18);

      // Text Lines for Current Page
      ctx.fillStyle = '#f5ecc9';
      ctx.font = `500 8.2px ${FONT_SANS}`;
      const startY = curLines.length === 1 ? boxY + 38 : boxY + 34;
      const lineGap = 16;
      curLines.forEach((line, idx) => {
        ctx.fillText(line, boxX + 60, startY + idx * lineGap);
      });

      // Continue Prompt
      const pageInfo = dialogue.pages.length > 1 ? `[${dialogue.page + 1}/${dialogue.pages.length}] ` : '';
      ctx.fillStyle = '#58d68d';
      ctx.font = `bold 7px ${FONT_SANS}`;
      ctx.textAlign = 'right';
      ctx.fillText(`${pageInfo}[E / Click] Tiếp tục ▸`, boxX + boxW - 10, boxY + boxH - 8);
      ctx.textAlign = 'left';
    }
  }

  function render() {
    ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
    ctx.clearRect(0, 0, V_WIDTH, V_HEIGHT);

    if (world.scene === 'workshop') {
      ctx.save();
      // Apply horizontal camera scroll
      ctx.translate(-Math.round(camera.x), 0);
      drawWorkshopScene();
      drawPlayer();
      ctx.restore();
    } else if (world.scene === 'floor1') {
      ctx.save();
      // Apply horizontal camera scroll for 1332px panorama
      ctx.translate(-Math.round(camera.x), 0);
      drawFloor1Scene();
      drawPlayer();
      ctx.restore();
    } else if (world.scene === 'floor2') {
      ctx.save();
      // Apply horizontal camera scroll for 750px panorama
      ctx.translate(-Math.round(camera.x), 0);
      drawFloor2Scene();
      drawPlayer();
      ctx.restore();
    } else if (world.scene === 'floor3') {
      ctx.save();
      // Apply horizontal camera scroll for 750px panorama
      ctx.translate(-Math.round(camera.x), 0);
      drawFloor3Scene();
      drawPlayer();
      ctx.restore();
    } else if (world.scene === 'altar_cutscene') {
      drawAltarCutscene();
    }

    drawHUD();

    // Inspection Mode Overlay (Screen coords)
    window.InspectionMode.render(ctx, V_WIDTH, V_HEIGHT);

    // Deduction Journal Overlay (Screen coords)
    window.DeductionJournal.render(ctx, V_WIDTH, V_HEIGHT);

    // Altar Mode Sacred Ritual Overlay (Screen coords)
    if (window.AltarMode) {
      window.AltarMode.render(ctx, V_WIDTH, V_HEIGHT);
    }
  }

  function loop(now) {
    const dt = Math.min(0.1, (now - lastTime) / 1000);
    lastTime = now;

    update(dt);
    render();

    // Clear one-shot input triggers
    for (const k in justPressed) delete justPressed[k];

    requestAnimationFrame(loop);
  }

  // --- INITIALIZATION ---
  window.SpriteLoader.init(() => {
    // Cultural Safezone Sound Ambience Init (Rain, clock, oil lamp, and Dan Tranh)
    if (window.GameAudio) {
      window.GameAudio.init();
      window.GameAudio.startSafezoneAmbience();
    }

    // Auto-resume audio on first user gesture if restricted by browser autoplay policy
    const enableAudioGesture = () => {
      if (window.GameAudio) {
        window.GameAudio.init();
        window.GameAudio.startSafezoneAmbience();
      }
      window.removeEventListener('keydown', enableAudioGesture);
      window.removeEventListener('click', enableAudioGesture);
    };
    window.addEventListener('keydown', enableAudioGesture);
    window.addEventListener('click', enableAudioGesture);

    // Trigger Opening Monologue (21:00 đêm tại xưởng)
    showDialogue(
      'An (Thở dài, nhìn đồng hồ)',
      'Đã chín giờ tối rồi mà cả viện bảo tàng rộng lớn chỉ còn lại một mình mình ở lại trực đêm.\nTám giờ sáng mai triển lãm khai mạc, mình phải hoàn tất hồ sơ cho hiện vật số 47 này.'
    );

    requestAnimationFrame(loop);
  });

  // Global Engine Hook for inspection & testing
  window.GameEngine = {
    world,
    player,
    camera,
    triggers,
    triggersFloor1,
    triggersFloor2,
    triggersFloor3,
    switchScene,
    dialogue,
    advanceDialogue,
    showDialogue,
    showDialogueSequence,
    playDarkroomConfrontation,
    playAtticReunion,
    getBacCanhDialogueState,
    showToast
  };
})();
