/**
 * ===================================================================
 * VẠN TƯỢNG — HỆ THỐNG MÀN CHƠI PIXEL 2D ĐI CẢNH NGANG (SIDE-SCROLLING 2D PIXEL STAGES)
 * ===================================================================
 * - Thay thế màn hình lựa chọn đáp án cũ bằng thế giới 2D Pixel đi cảnh ngang
 *   cho 3 hiện vật:
 *     1. mask    -> Ải I: Chiếu Tuồng Đặng Gia (Mặt Nạ Tuồng Tam Diện)
 *     2. ceramic -> Ải II: Lò Bầu Bát Tràng (Bình Gốm Men Rạn Thế Kỷ XVI)
 *     3. flute   -> Ải III: Làng Tranh Đông Hồ (Tranh Dân Gian Đông Hồ)
 * - Hỗ trợ 2 chế độ:
 *     + Chế độ 1 (Built-in Playable 2D Pixel Prototype): Điều khiển nhân vật
 *       A/D hoặc ⬅/➡ để di chuyển, W/Space để nhảy, E để thu thập 3 Mảnh Hồn Cổ Vật
 *       và khai mở Cổng Kết Ấn ở cuối màn.
 *     + Chế độ 2 (External Game Adapter): Sẵn sàng nhúng dự án game ngoài
 *       (Iframe HTML5 / Godot / Unity / Phaser / Custom Canvas) qua cấu hình
 *       EXTERNAL_GAME_URLS hoặc hàm window.vtPixelGame.registerExternalGame(stationId, urlOrMountFn).
 */

(function () {
  'use strict';

  // ===================================================================
  // 1. CẤU HÌNH DỰ ÁN GAME NGOÀI (DÀNH CHO LÚC GHÉP GAME THẬT VÀO SAU)
  // ===================================================================
  // Chỉ cần điền đường dẫn thư mục build game HTML5 (ví dụ: 'games/mask/index.html')
  // vào đây, hệ thống sẽ tự động tải dự án game đó vào khung вместо bản dựng sẵn!
  const EXTERNAL_GAME_URLS = {
    mask: 'mask%20game/index.html?v=20261110-integrated',
    ceramic: null, // Ví dụ sau này: 'games/bat-trang-pixel/index.html'
    flute: null    // Ví dụ sau này: 'games/dong-ho-pixel/index.html'
  };

  // ===================================================================
  // 2. DỮ LIỆU 3 THẾ GIỚI PIXEL 2D ĐI CẢNH NGANG
  // ===================================================================
  const PIXEL_WORLDS = {
    mask: {
      id: 'mask',
      actTag: 'ẢI I • THẾ GIỚI MẶT NẠ',
      title: 'HỌA DIỆN — THE DUAL MASK',
      artifactName: 'Mặt Nạ Tuồng Tam Diện',
      subtitle: 'Hành lang sân khấu cổ thế kỷ XVIII • Giải mã 3 Sắc Diện Trung - Oan - Nộ',
      rewardItem: {
        id: 'mask',
        name: 'Mặt Nạ Tuồng Tam Diện',
        desc: 'Mặt nạ gỗ mít bồi giấy bản phèn đen, lưu giữ linh hồn vị trung thần Đặng gia.',
        icon: '🎭'
      },
      rewardClue: 'Mật mã Tuồng Cổ: Ba lớp son chu sa ẩn giấu tọa độ mảnh ghép thứ nhất.',
      palette: {
        skyTop: '#160709',
        skyBottom: '#3c1115',
        moonColor: '#f5d77f',
        farMount: '#280d11',
        midRoof: '#4d181c',
        groundTop: '#842c2d',
        groundBody: '#220d0b',
        accent: '#f5a823',
        tokenColor: '#ff5252',
        portalColor: '#ffd54f'
      },
      worldWidth: 2400,
      tokens: [
        { x: 520, y: 310, label: 'Ấn Trung Thần (Son Đỏ)', collected: false },
        { x: 1180, y: 250, label: 'Ấn Oan Khiên (Phấn Trắng)', collected: false },
        { x: 1780, y: 270, label: 'Ấn Phẫn Nộ (Mực Nho)', collected: false }
      ],
      platforms: [
        { x: 380, y: 360, w: 220, h: 22 },
        { x: 720, y: 310, w: 190, h: 22 },
        { x: 1050, y: 300, w: 250, h: 22 },
        { x: 1420, y: 350, w: 180, h: 22 },
        { x: 1680, y: 320, w: 230, h: 22 }
      ],
      npcs: [
        {
          x: 240,
          name: 'Lão Nghệ Nhân Tuồng',
          hint: '“Hãy tiến về phía Đông sân khấu, thu thập đủ 3 Mảnh Sắc Diện rồi bước vào Cổng Chu Sa!”'
        },
        {
          x: 1150,
          name: 'Bóng Kép Tuồng Cổ',
          hint: '“Nét mày lưỡi mác chĩa thẳng lên trời — kẻ trung thần chẳng bao giờ cúi đầu!”'
        }
      ],
      portalX: 2180
    },

    ceramic: {
      id: 'ceramic',
      actTag: 'ẢI II • THẾ GIỚI CỔ VẬT PIXEL 2D',
      title: 'LÒ BẦU BÁT TRÀNG THẾ KỶ XVI',
      artifactName: 'Bình Gốm Men Rạn Bát Tràng',
      subtitle: 'Không gian lò gốm cổ bên sông Hồng • Thu thập Đất Phù Sa, Tro Trấu & Lửa Lò Bầu',
      rewardItem: {
        id: 'ceramic',
        name: 'Bình Gốm Men Rạn',
        desc: 'Tuyệt tác men rạn tam thái thế kỷ XVI thời Mạc của nghệ nhân Đặng Huyền Thông.',
        icon: '🏺'
      },
      rewardClue: 'Mật mã Men Rạn: Mạng lưới vết rạn mai rùa ghép thành bản đồ ngầm.',
      palette: {
        skyTop: '#08181b',
        skyBottom: '#15383c',
        moonColor: '#e6f5d0',
        farMount: '#0f262a',
        midRoof: '#1f494d',
        groundTop: '#2c6b6f',
        groundBody: '#0c1c1e',
        accent: '#4dd0e1',
        tokenColor: '#26c6da',
        portalColor: '#ffd54f'
      },
      worldWidth: 2400,
      tokens: [
        { x: 560, y: 300, label: 'Tinh Hoa Đất Sét Bạch Đàn', collected: false },
        { x: 1160, y: 240, label: 'Men Tro Trấu Nếp Cái', collected: false },
        { x: 1760, y: 280, label: 'Ngọn Lửa Lò Bầu 1200°C', collected: false }
      ],
      platforms: [
        { x: 430, y: 350, w: 230, h: 22 },
        { x: 760, y: 300, w: 200, h: 22 },
        { x: 1060, y: 290, w: 230, h: 22 },
        { x: 1410, y: 340, w: 200, h: 22 },
        { x: 1680, y: 330, w: 220, h: 22 }
      ],
      npcs: [
        {
          x: 250,
          name: 'Thợ Cả Lò Bầu',
          hint: '“Lửa lò bầu đã đỏ rực! Hãy nhảy qua các bệ gốm thu thập đủ Đất - Men - Lửa để khai mở bình cổ.”'
        },
        {
          x: 1140,
          name: 'Nghệ Nhân Vũ Đỗ',
          hint: '“Tiếng men rạn lách tách trong đêm chính là mật âm của trời đất!”'
        }
      ],
      portalX: 2180
    },

    flute: {
      id: 'flute',
      actTag: 'ẢI III • THẾ GIỚI CỔ VẬT PIXEL 2D',
      title: 'THẦN ĐỒ NGŨ HỔ HÀNG TRỐNG',
      artifactName: 'Tranh Dân Gian Ngũ Hổ',
      subtitle: 'Hành trình xuyên qua bức họa Ngũ Hổ trấn trạch • Khôi phục Ấn Phù Chú, Sắc Cản Màu & Hồn Ngũ Hành',
      rewardItem: {
        id: 'flute',
        name: 'Tranh Dân Gian Ngũ Hổ',
        desc: 'Bức tranh thờ Ngũ Hổ Hàng Trống uy nghiêm trấn trạch ngũ phương, cất giữ mật mã hội họa của tiền nhân.',
        icon: '🖼️'
      },
      rewardClue: 'Mật mã Tranh Ngũ Hổ: Năm sắc màu Ngũ Hành hội tụ nơi bệ ấn trung tâm.',
      palette: {
        skyTop: '#24180b',
        skyBottom: '#4a3216',
        moonColor: '#fff0c2',
        farMount: '#36230f',
        midRoof: '#63411c',
        groundTop: '#c6a052',
        groundBody: '#2b1b0c',
        accent: '#f5d77f',
        tokenColor: '#ffd54f',
        portalColor: '#ff7043'
      },
      worldWidth: 2400,
      tokens: [
        { x: 540, y: 300, label: 'Dấu Ấn Ngũ Phương', collected: false },
        { x: 1180, y: 250, label: 'Sắc Màu Ngũ Hành', collected: false },
        { x: 1790, y: 270, label: 'Nét Mộc Bản Hàng Trống', collected: false }
      ],
      platforms: [
        { x: 410, y: 350, w: 230, h: 22 },
        { x: 750, y: 305, w: 200, h: 22 },
        { x: 1080, y: 300, w: 230, h: 22 },
        { x: 1430, y: 345, w: 190, h: 22 },
        { x: 1690, y: 320, w: 240, h: 22 }
      ],
      npcs: [
        {
          x: 240,
          name: 'Nghệ Nhân Hàng Trống',
          hint: '“Ba mảnh ký ức đang thất lạc trong bức họa. Hãy tìm lại dấu ấn, sắc màu và nét vẽ!”'
        },
        {
          x: 1160,
          name: 'Hồn Tranh Ngũ Hổ',
          hint: '“Năm sắc màu tượng trưng ngũ hành. Mỗi nét cản màu lưu giữ dấu tay của người nghệ nhân.”'
        }
      ],
      portalX: 2180
    }
  };

  // ===================================================================
  // 3. BỘ ĐIỀU KHIỂN MÀN CHƠI 2D PIXEL (VTPIXELGAMEMANAGER)
  // ===================================================================
  class VTPixelGameManager {
    constructor() {
      this.activeStation = null;
      this.worldConfig = null;
      this.isRunning = false;
      this.rafId = null;
      this.customHandlers = {};

      // Trạng thái vật lý nhân vật Pixel 2D
      this.player = {
        x: 120,
        y: 340,
        vx: 0,
        vy: 0,
        w: 36,
        h: 52,
        facing: 1,
        onGround: false,
        animTick: 0
      };

      this.cameraX = 0;
      this.groundY = 430;
      this.keys = { left: false, right: false, up: false, interact: false };
      this.tokens = [];
      this.activeDialogue = '';
      this.stageCompleted = false;
      this.particles = [];

      this.dom = {};
      this.boundEvents = false;
      this.EXTERNAL_GAME_URLS = EXTERNAL_GAME_URLS;
      this.PIXEL_WORLDS = PIXEL_WORLDS;
    }

    initDOM() {
      this.dom = {
        view: document.getElementById('viewPixelGame'),
        canvas: document.getElementById('pixelGameCanvas'),
        externalMount: document.getElementById('pixelExternalGameMount'),
        actTag: document.getElementById('pixelHudActTag'),
        title: document.getElementById('pixelHudTitle'),
        artifactBadge: document.getElementById('pixelHudArtifactBadge'),
        tokenCount: document.getElementById('pixelHudTokenCount'),
        statusBanner: document.getElementById('pixelStageStatusBanner'),
        dialogueBar: document.getElementById('pixelBottomDialogue'),
        btnBackMuseum: document.getElementById('btnPixelBackMuseum'),
        btnResetStage: document.getElementById('btnPixelResetStage'),
        btnQuickClear: document.getElementById('btnPixelQuickComplete'),
        mobileLeft: document.getElementById('btnPixelTouchLeft'),
        mobileRight: document.getElementById('btnPixelTouchRight'),
        mobileJump: document.getElementById('btnPixelTouchJump')
      };

      if (!this.dom.canvas || this.boundEvents) return;
      this.boundEvents = true;

      // Sự kiện bàn phím cho game 2D đi cảnh ngang
      window.addEventListener('keydown', (e) => {
        if (!this.isRunning || this.externalMode) return;
        const code = e.code;
        if (code === 'ArrowLeft' || code === 'KeyA') {
          this.keys.left = true;
        } else if (code === 'ArrowRight' || code === 'KeyD') {
          this.keys.right = true;
        } else if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') {
          e.preventDefault();
          this.keys.up = true;
          this.tryJump();
        } else if (code === 'KeyE' || code === 'Enter') {
          this.keys.interact = true;
          this.tryInteractPortal();
        } else if (code === 'Escape') {
          this.exitToMuseum();
        }
      });

      window.addEventListener('keyup', (e) => {
        if (!this.isRunning || this.externalMode) return;
        const code = e.code;
        if (code === 'ArrowLeft' || code === 'KeyA') this.keys.left = false;
        if (code === 'ArrowRight' || code === 'KeyD') this.keys.right = false;
        if (code === 'ArrowUp' || code === 'KeyW' || code === 'Space') this.keys.up = false;
        if (code === 'KeyE' || code === 'Enter') this.keys.interact = false;
      });

      // Nút điều khiển trên thanh HUD
      if (this.dom.btnBackMuseum) {
        this.dom.btnBackMuseum.addEventListener('click', () => {
          this.exitToMuseum();
        });
      }

      if (this.dom.btnResetStage) {
        this.dom.btnResetStage.addEventListener('click', () => {
          if (this.activeStation) {
            this.startStage(this.activeStation);
          }
        });
      }

      if (this.dom.btnQuickClear) {
        this.dom.btnQuickClear.addEventListener('click', () => {
          this.completeCurrentStage();
        });
      }

      // Nút cảm ứng trên điện thoại / chuột
      const bindHold = (btn, keyName, onPress) => {
        if (!btn) return;
        const start = (e) => {
          e.preventDefault();
          this.keys[keyName] = true;
          if (onPress) onPress();
        };
        const end = (e) => {
          e.preventDefault();
          this.keys[keyName] = false;
        };
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
        btn.addEventListener('mouseleave', end);
        btn.addEventListener('touchstart', start, { passive: false });
        btn.addEventListener('touchend', end, { passive: false });
      };

      bindHold(this.dom.mobileLeft, 'left');
      bindHold(this.dom.mobileRight, 'right');
      bindHold(this.dom.mobileJump, 'up', () => this.tryJump());

      // Lắng nghe postMessage từ Iframe dự án game ngoài (khi bạn ghép game thật vào sau)
      window.addEventListener('message', (event) => {
        if (!this.externalMode || !this.isRunning || !this.externalFrame) return;
        if (event.source !== this.externalFrame.contentWindow || event.origin !== location.origin) return;
        const data = event.data;
        if (!data || typeof data !== 'object' || data.station !== this.activeStation) return;
        if (data.type === 'VT_PIXEL_STAGE_READY') {
          this.setExternalStatus('');
        } else if (data.type === 'VT_PIXEL_STAGE_COMPLETE') {
          this.onExternalGameComplete(data.station, data);
        } else if (data.type === 'VT_PIXEL_STAGE_EXIT') {
          this.exitToMuseum();
        }
      });
    }

    /**
     * API mở rộng để nhúng dự án game ngoài vào từng cổ vật
     * @param {'mask'|'ceramic'|'flute'} stationId
     * @param {string|Function} urlOrMountFn Đường dẫn file HTML5 hoặc hàm khởi tạo game
     */
    registerExternalGame(stationId, urlOrMountFn) {
      if (typeof urlOrMountFn === 'string') {
        EXTERNAL_GAME_URLS[stationId] = urlOrMountFn;
      } else if (typeof urlOrMountFn === 'function') {
        this.customHandlers[stationId] = urlOrMountFn;
      }
    }

    onExternalGameComplete(stationId, result = {}) {
      const st = stationId || this.activeStation;
      if (st !== this.activeStation || !this.isRunning || this.stageCompleted) return;
      if (st !== 'mask') {
        this.completeCurrentStage();
        return;
      }
      const endingId = result.endingId;
      if (![1, 2, 3].includes(endingId)) return;
      const endings = {
        1: { key: 'mask_hoa_dien_honor', title: 'Chân dung bất tử' },
        2: { key: 'mask_hoa_dien_ashes', title: 'Tro tàn kẻ thù dân' },
        3: { key: 'mask_hoa_dien_dual', title: 'Mặt nạ song diện & Khúc ca hòa giải' }
      };
      const ending = endings[endingId];
      const app = window.game;
      if (!app || !app.state) return;
      const gs = app.state;
      gs.solvedChambers = Array.isArray(gs.solvedChambers) ? gs.solvedChambers : [];
      gs.inventory = Array.isArray(gs.inventory) ? gs.inventory : [];
      gs.clues = Array.isArray(gs.clues) ? gs.clues : [];
      if (!gs.solvedChambers.includes('mask')) gs.solvedChambers.push('mask');
      if (!gs.inventory.includes(ending.key)) gs.inventory.push(ending.key);
      const clue = `HỌA DIỆN — Kết cục ${endingId}: ${ending.title}.`;
      if (!gs.clues.includes(clue)) gs.clues.push(clue);
      this.stageCompleted = true;
      ['updateHUD', 'updateJournal', 'updateMapProgress', 'updateRelicsProgress'].forEach((method) => {
        if (typeof app[method] === 'function') app[method]();
      });
      if (window.vtSupabase && typeof window.vtSupabase.saveGameProgress === 'function') {
        try {
          Promise.resolve(window.vtSupabase.saveGameProgress(gs)).catch((err) => {
            console.warn('Chưa lưu được kết quả HỌA DIỆN:', err);
          });
        } catch (err) {
          console.warn('Chưa lưu được kết quả HỌA DIỆN:', err);
        }
      }
    }

    handleExternalStageComplete(stationId, result = {}) {
      this.onExternalGameComplete(stationId || this.activeStation, result);
    }

    setExternalStatus(text, isError = false) {
      if (!this.externalStatus) return;
      this.externalStatus.textContent = text;
      this.externalStatus.hidden = !text;
      this.externalStatus.setAttribute('role', isError ? 'alert' : 'status');
      if (!text || isError) {
        clearTimeout(this.externalLoadTimer);
        this.externalLoadTimer = null;
      }
    }

    mountExternalGame(url) {
      const frame = document.createElement('iframe');
      frame.src = url;
      frame.title = this.activeStation === 'mask' ? 'HỌA DIỆN — The Dual Mask' : this.worldConfig.title;
      frame.allow = 'autoplay; fullscreen; gamepad';
      frame.setAttribute('allowfullscreen', '');
      this.externalFrame = frame;
      const status = document.createElement('div');
      status.className = 'pixel-external-status';
      this.externalStatus = status;
      this.dom.externalMount.replaceChildren(frame, status);
      this.setExternalStatus('Đang tải HỌA DIỆN…');
      this.externalLoadTimer = setTimeout(() => {
        if (this.externalFrame === frame) {
          this.setExternalStatus('Game đang tải lâu hơn dự kiến. Hãy kiểm tra kết nối hoặc quay lại thử lại.', true);
        }
      }, 30000);
      frame.addEventListener('load', () => {
        if (this.externalFrame !== frame) return;
        this.setExternalStatus('');
        try { frame.focus(); } catch (e) {}
      });
      frame.addEventListener('error', () => {
        if (this.externalFrame === frame) {
          this.setExternalStatus('Không tải được game.', true);
        }
      });
    }

    disposeExternalGame() {
      clearTimeout(this.externalLoadTimer);
      this.externalLoadTimer = null;
      if (this.externalFrame) {
        try {
          if (this.externalFrame.contentWindow && this.externalFrame.contentWindow.GameAudio && typeof this.externalFrame.contentWindow.GameAudio.dispose === 'function') {
            this.externalFrame.contentWindow.GameAudio.dispose();
          }
        } catch (e) {}
        this.externalFrame.remove();
      }
      if (typeof this.externalCleanup === 'function') {
        try { this.externalCleanup(); } catch (e) {}
      }
      this.externalFrame = null;
      this.externalCleanup = null;
      this.externalStatus = null;
      this.externalMode = false;
      this.keys = { left: false, right: false, up: false, interact: false };
      if (this.dom.externalMount) this.dom.externalMount.replaceChildren();
      if (this.dom.view) this.dom.view.classList.remove('external-game');
    }

    openArtifactWorld(stationId) {
      this.initDOM();
      const st = PIXEL_WORLDS[stationId] ? stationId : 'mask';
      if (this.externalMode && this.isRunning && !this.stageCompleted &&
          !window.confirm('HỌA DIỆN chưa lưu tiến trình câu đố. Rời lượt chơi này để mở thế giới khác?')) return;
      if (document.getElementById('viewMuseum3D')?.classList.contains('active') && window.vtMuseum3D?.saveMuseumSnapshot) {
        window.vtMuseum3D.saveMuseumSnapshot();
      }
      if (window.game && typeof window.game.switchView === 'function') {
        window.game.switchView('pixel-game', () => {
          this.startStage(st);
        }, 'none');
      } else {
        this.startStage(st);
      }
    }

    startStage(stationId) {
      this.initDOM();
      this.stopGameLoop();

      this.activeStation = stationId;
      this.worldConfig = PIXEL_WORLDS[stationId] || PIXEL_WORLDS.mask;
      this.stageCompleted = false;

      // Cập nhật HUD
      if (this.dom.actTag) this.dom.actTag.textContent = this.worldConfig.actTag;
      if (this.dom.title) this.dom.title.textContent = this.worldConfig.title;
      if (this.dom.artifactBadge) {
        this.dom.artifactBadge.textContent = `${this.worldConfig.rewardItem.icon} ${this.worldConfig.artifactName}`;
      }
      if (this.dom.statusBanner) {
        this.dom.statusBanner.classList.add('hidden');
      }

      // Kiểm tra nếu đã gắn dự án game ngoài (Iframe hoặc custom mount)
      const extUrl = EXTERNAL_GAME_URLS[stationId];
      const customMount = this.customHandlers[stationId];

      this.externalMode = !!(extUrl || customMount);
      if (this.dom.view) {
        this.dom.view.classList.toggle('external-game', this.externalMode);
      }

      if (extUrl && this.dom.externalMount) {
        this.dom.canvas.classList.add('hidden');
        this.dom.externalMount.classList.remove('hidden');
        this.isRunning = true;
        this.mountExternalGame(extUrl);
        return;
      }

      if (customMount && this.dom.externalMount) {
        this.dom.canvas.classList.add('hidden');
        this.dom.externalMount.classList.remove('hidden');
        this.dom.externalMount.innerHTML = '';
        this.isRunning = true;
        this.externalCleanup = customMount(this.dom.externalMount, {
          stationId,
          onComplete: (data) => this.onExternalGameComplete(stationId, data),
          onExit: () => this.exitToMuseum()
        });
        return;
      }

      // Chạy màn chơi 2D Pixel đi cảnh ngang dựng sẵn
      if (this.dom.externalMount) {
        this.dom.externalMount.classList.add('hidden');
        this.dom.externalMount.innerHTML = '';
      }
      this.dom.canvas.classList.remove('hidden');

      this.player.x = 120;
      this.player.y = 330;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.facing = 1;
      this.player.onGround = false;
      this.cameraX = 0;
      this.keys = { left: false, right: false, up: false, interact: false };

      this.tokens = this.worldConfig.tokens.map((t, idx) => ({
        ...t,
        id: idx,
        collected: false,
        floatOffset: idx * 1.4
      }));

      // Khởi tạo hạt bụi vàng cổ phong trong màn chơi
      this.particles = Array.from({ length: 45 }, () => ({
        x: Math.random() * this.worldConfig.worldWidth,
        y: Math.random() * 410,
        size: Math.random() * 3 + 2,
        speedY: -(Math.random() * 0.35 + 0.12),
        alpha: Math.random() * 0.65 + 0.25
      }));

      this.updateTokenHUD();
      if (this.dom.dialogueBar) {
        this.dom.dialogueBar.textContent = `🎮 Dùng phím [A / D] hoặc [⬅ / ➡] để di chuyển ngang, [W / Space] để nhảy thu thập 3 Mảnh Hồn Cổ Vật và tiến tới Cổng Kết Ấn ở cuối màn!`;
      }

      this.isRunning = true;
      this.loop();
    }

    stopLoop() {
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    stopGameLoop() {
      this.stopLoop();
      this.disposeExternalGame();
    }

    tryJump() {
      if (!this.isRunning || this.stageCompleted) return;
      if (this.player.onGround) {
        this.player.vy = -12.6;
        this.player.onGround = false;
        if (window.audio && typeof window.audio.playClick === 'function') {
          window.audio.playClick();
        }
      }
    }

    tryInteractPortal() {
      if (!this.isRunning || this.stageCompleted || !this.worldConfig) return;
      const dist = Math.abs((this.player.x + this.player.w / 2) - this.worldConfig.portalX);
      const collectedCount = this.tokens.filter(t => t.collected).length;
      if (dist < 90) {
        if (collectedCount >= this.tokens.length) {
          this.completeCurrentStage();
        } else if (this.dom.dialogueBar) {
          this.dom.dialogueBar.textContent = `⚠️ Cổng Kết Ấn chưa mở! Hãy thu thập đủ ${this.tokens.length} Mảnh Hồn Cổ Vật (Hiện tại: ${collectedCount}/${this.tokens.length}).`;
        }
      }
    }

    updateTokenHUD() {
      const collectedCount = this.tokens.filter(t => t.collected).length;
      if (this.dom.tokenCount) {
        this.dom.tokenCount.textContent = `${collectedCount} / ${this.tokens.length}`;
      }
    }

    updatePhysics() {
      const cfg = this.worldConfig;
      if (!cfg || this.stageCompleted) return;

      const moveSpeed = 5.4;
      if (this.keys.left) {
        this.player.vx = -moveSpeed;
        this.player.facing = -1;
        this.player.animTick += 0.22;
      } else if (this.keys.right) {
        this.player.vx = moveSpeed;
        this.player.facing = 1;
        this.player.animTick += 0.22;
      } else {
        this.player.vx *= 0.78;
        if (Math.abs(this.player.vx) < 0.1) this.player.vx = 0;
      }

      // Trọng lực
      const prevBottom = this.player.y + this.player.h;
      this.player.vy += 0.62;
      if (this.player.vy > 14) this.player.vy = 14;

      this.player.x += this.player.vx;
      this.player.y += this.player.vy;

      // Giới hạn biên trái/phải của thế giới
      if (this.player.x < 24) this.player.x = 24;
      if (this.player.x > cfg.worldWidth - this.player.w - 24) {
        this.player.x = cfg.worldWidth - this.player.w - 24;
      }

      this.player.onGround = false;

      // Kiểm tra va chạm với các bệ đỡ (Platforms)
      const pLeft = this.player.x + 6;
      const pRight = this.player.x + this.player.w - 6;
      const newBottom = this.player.y + this.player.h;

      if (this.player.vy >= 0) {
        for (const plat of cfg.platforms) {
          if (pRight > plat.x && pLeft < plat.x + plat.w) {
            if (prevBottom <= plat.y + 8 && newBottom >= plat.y) {
              this.player.y = plat.y - this.player.h;
              this.player.vy = 0;
              this.player.onGround = true;
              break;
            }
          }
        }
      }

      // Kiểm tra va chạm với mặt đất chính
      if (this.player.y + this.player.h >= this.groundY) {
        this.player.y = this.groundY - this.player.h;
        this.player.vy = 0;
        this.player.onGround = true;
      }

      // Kiểm tra nhặt Mảnh Hồn Cổ Vật (Tokens)
      const cx = this.player.x + this.player.w / 2;
      const cy = this.player.y + this.player.h / 2;

      this.tokens.forEach((tk) => {
        if (tk.collected) return;
        const dx = cx - tk.x;
        const dy = cy - tk.y;
        if (Math.hypot(dx, dy) < 42) {
          tk.collected = true;
          this.updateTokenHUD();
          if (window.audio && typeof window.audio.playSuccessChime === 'function') {
            window.audio.playSuccessChime();
          }
          const doneCount = this.tokens.filter(t => t.collected).length;
          if (this.dom.dialogueBar) {
            if (doneCount >= this.tokens.length) {
              this.dom.dialogueBar.textContent = `✨ Đã thu thập trọn vẹn 3/3 Mảnh Hồn (${tk.label})! Hãy tiến tới Cổng Kết Ấn ở cuối màn bên phải!`;
            } else {
              this.dom.dialogueBar.textContent = `✨ Đã thu thập: [${tk.label}] (${doneCount}/${this.tokens.length}). Tiếp tục tiến về phía Đông!`;
            }
          }
        }
      });

      // Kiểm tra lời thoại khi đi ngang qua NPC
      for (const npc of cfg.npcs) {
        if (Math.abs(cx - npc.x) < 68) {
          if (this.activeDialogue !== npc.hint && this.dom.dialogueBar) {
            this.activeDialogue = npc.hint;
            this.dom.dialogueBar.textContent = `💬 ${npc.name}: ${npc.hint}`;
          }
          break;
        }
      }

      // Kiểm tra chạm vào Cổng Kết Ấn khi đã đủ 3 mảnh
      const distPortal = Math.abs(cx - cfg.portalX);
      const collectedAll = this.tokens.every(t => t.collected);
      if (distPortal < 52 && collectedAll) {
        this.completeCurrentStage();
      }
    }

    renderCanvas() {
      const canvas = this.dom.canvas;
      const cfg = this.worldConfig;
      if (!canvas || !cfg) return;

      const ctx = canvas.getContext('2d');
      const W = canvas.width;
      const H = canvas.height;
      ctx.imageSmoothingEnabled = false;

      // Cập nhật Camera đi cảnh ngang bám theo nhân vật
      const targetCamX = this.player.x - W * 0.35;
      const maxCamX = cfg.worldWidth - W;
      this.cameraX += (Math.max(0, Math.min(maxCamX, targetCamX)) - this.cameraX) * 0.14;
      const camX = Math.round(this.cameraX);

      // 1. Nền bầu trời Pixel Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, cfg.palette.skyTop);
      skyGrad.addColorStop(1, cfg.palette.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Trăng rằm cổ phong (Parallax 0.12)
      const moonX = Math.round(720 - camX * 0.12);
      const moonY = 95;
      ctx.fillStyle = 'rgba(245, 215, 127, 0.14)';
      ctx.fillRect(moonX - 58, moonY - 58, 116, 116);
      ctx.fillStyle = cfg.palette.moonColor;
      ctx.fillRect(moonX - 40, moonY - 40, 80, 80);

      // 3. Dãy núi xa Pixel (Parallax 0.25)
      ctx.fillStyle = cfg.palette.farMount;
      for (let i = 0; i < 12; i++) {
        const mx = Math.round(i * 260 - (camX * 0.25) % 260);
        const mh = 130 + (i % 3) * 35;
        ctx.fillRect(mx, this.groundY - mh, 180, mh);
        ctx.fillRect(mx + 30, this.groundY - mh - 28, 120, 28);
      }

      // 4. Kiến trúc cổ / Đình chùa / Lò gốm / Khung tranh (Parallax 0.5)
      ctx.fillStyle = cfg.palette.midRoof;
      for (let i = 0; i < 10; i++) {
        const bx = Math.round(i * 340 - (camX * 0.5) % 340);
        ctx.fillRect(bx + 20, this.groundY - 110, 140, 110);
        // Mái đao cong kiểu pixel
        ctx.fillStyle = cfg.palette.accent;
        ctx.fillRect(bx, this.groundY - 122, 180, 12);
        ctx.fillRect(bx - 10, this.groundY - 130, 20, 8);
        ctx.fillRect(bx + 170, this.groundY - 130, 20, 8);
        ctx.fillStyle = cfg.palette.midRoof;
      }

      // 5. Hạt bụi linh khí lơ lửng
      ctx.fillStyle = cfg.palette.accent;
      this.particles.forEach(p => {
        p.y += p.speedY;
        if (p.y < 20) p.y = this.groundY - 20;
        const px = Math.round(p.x - camX * 0.8);
        if (px >= -10 && px <= W + 10) {
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(px, Math.round(p.y), p.size, p.size);
        }
      });
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.translate(-camX, 0);

      // 6. Vẽ các bệ nhảy Pixel (Platforms)
      cfg.platforms.forEach(plat => {
        ctx.fillStyle = cfg.palette.groundBody;
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
        ctx.fillStyle = cfg.palette.groundTop;
        ctx.fillRect(plat.x, plat.y, plat.w, 6);
        ctx.strokeStyle = cfg.palette.accent;
        ctx.lineWidth = 2;
        ctx.strokeRect(plat.x, plat.y, plat.w, plat.h);
      });

      // 7. Vẽ NPC hướng dẫn dọc đường
      cfg.npcs.forEach(npc => {
        const ny = this.groundY - 48;
        // Thân áo cổ phục
        ctx.fillStyle = '#c6a052';
        ctx.fillRect(npc.x - 14, ny + 14, 28, 34);
        // Đầu & khăn đóng
        ctx.fillStyle = '#f7ebd2';
        ctx.fillRect(npc.x - 10, ny, 20, 16);
        ctx.fillStyle = '#842c2d';
        ctx.fillRect(npc.x - 12, ny - 6, 24, 8);
        // Nhãn tên NPC
        ctx.fillStyle = '#f5d77f';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(npc.name, npc.x, ny - 14);
      });

      // 8. Vẽ 3 Mảnh Hồn Cổ Vật (Collectible Tokens)
      const time = performance.now() * 0.004;
      this.tokens.forEach((tk, idx) => {
        if (tk.collected) return;
        const bobY = Math.round(tk.y + Math.sin(time + tk.floatOffset) * 7);

        // Hào quang pixel
        ctx.fillStyle = 'rgba(255, 213, 79, 0.25)';
        ctx.fillRect(tk.x - 22, bobY - 22, 44, 44);

        // Viên ngọc / ấn ký cổ vật
        ctx.fillStyle = cfg.palette.tokenColor;
        ctx.fillRect(tk.x - 12, bobY - 12, 24, 24);
        ctx.strokeStyle = '#fff8e1';
        ctx.lineWidth = 2;
        ctx.strokeRect(tk.x - 12, bobY - 12, 24, 24);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`MẢNH ${idx + 1}`, tk.x, bobY - 20);
      });

      // 9. Vẽ Cổng Kết Ấn Cuối Màn (Portal Gate)
      const collectedAll = this.tokens.every(t => t.collected);
      const px = cfg.portalX;
      const py = this.groundY - 118;

      // Cột cổng tam quan pixel
      ctx.fillStyle = '#3e1e14';
      ctx.fillRect(px - 44, py, 16, 118);
      ctx.fillRect(px + 28, py, 16, 118);
      ctx.fillStyle = cfg.palette.accent;
      ctx.fillRect(px - 56, py - 14, 112, 18);

      // Lõi năng lượng cổng
      ctx.fillStyle = collectedAll ? 'rgba(255, 213, 79, 0.78)' : 'rgba(180, 60, 60, 0.35)';
      ctx.fillRect(px - 28, py + 16, 56, 102);

      ctx.fillStyle = '#fff3c4';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        collectedAll ? '✨ CỔNG ĐÃ MỞ (CHẠM HOẶC ẤN E)' : '🔒 CỔNG KẾT ẤN (CẦN 3/3 MẢNH)',
        px,
        py - 24
      );

      // 10. Vẽ Nhân Vật Chính (Lữ Khách Vạn Tượng - Pixel Character)
      const pl = this.player;
      const pxPos = Math.round(pl.x);
      const pyPos = Math.round(pl.y);
      const legSwing = Math.round(Math.sin(pl.animTick) * 5);

      // Bóng dưới chân
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(pxPos + 4, this.groundY - 4, pl.w - 8, 6);

      // Chân bước
      ctx.fillStyle = '#1b110c';
      ctx.fillRect(pxPos + 8, pyPos + 38, 8, 14 + (pl.vx !== 0 ? legSwing : 0));
      ctx.fillRect(pxPos + 20, pyPos + 38, 8, 14 - (pl.vx !== 0 ? legSwing : 0));

      // Áo tấc cổ phong đỏ son viền vàng
      ctx.fillStyle = '#a93d2e';
      ctx.fillRect(pxPos + 4, pyPos + 16, 28, 24);
      ctx.fillStyle = '#f5d77f';
      ctx.fillRect(pxPos + 4, pyPos + 26, 28, 4);

      // Đầu & Nón/Khăn
      ctx.fillStyle = '#f7ebd2';
      ctx.fillRect(pxPos + 8, pyPos + 2, 20, 15);
      ctx.fillStyle = '#2b1810';
      ctx.fillRect(pxPos + 4, pyPos - 4, 28, 7);

      // Mắt nhìn theo hướng di chuyển
      ctx.fillStyle = '#140a06';
      if (pl.facing >= 0) {
        ctx.fillRect(pxPos + 21, pyPos + 7, 4, 4);
      } else {
        ctx.fillRect(pxPos + 11, pyPos + 7, 4, 4);
      }

      // 11. Vẽ Mặt Đất Gạch Cổ (Tiled Ground)
      ctx.fillStyle = cfg.palette.groundBody;
      ctx.fillRect(0, this.groundY, cfg.worldWidth, H - this.groundY);
      ctx.fillStyle = cfg.palette.groundTop;
      ctx.fillRect(0, this.groundY, cfg.worldWidth, 10);

      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (let gx = 0; gx < cfg.worldWidth; gx += 48) {
        ctx.fillRect(gx, this.groundY + 14, 36, 6);
      }

      ctx.restore();
    }

    loop() {
      if (!this.isRunning) return;
      this.updatePhysics();
      this.renderCanvas();
      this.rafId = requestAnimationFrame(() => this.loop());
    }

    completeCurrentStage() {
      if (this.externalMode && this.activeStation === 'mask') return;
      if (!this.worldConfig || this.stageCompleted) return;
      this.stageCompleted = true;

      const st = this.activeStation;
      const cfg = this.worldConfig;

      // Đồng bộ trạng thái giải mã cổ vật vào hệ thống chính của Vạn Tượng
      if (window.game && window.game.state) {
        const gs = window.game.state;
        if (!gs.solvedChambers.includes(st)) {
          gs.solvedChambers.push(st);
        }
        if (cfg.rewardItem && !gs.inventory.some(i => i.id === cfg.rewardItem.id)) {
          gs.inventory.push(cfg.rewardItem);
        }
        if (cfg.rewardClue && !gs.clues.includes(cfg.rewardClue)) {
          gs.clues.push(cfg.rewardClue);
        }
        if (typeof window.game.updateHUD === 'function') window.game.updateHUD();
        if (typeof window.game.updateJournal === 'function') window.game.updateJournal();
        if (typeof window.game.toast === 'function') {
          window.game.toast(`🎉 Đã vượt qua thế giới Pixel 2D và thu phục [${cfg.artifactName}]!`);
        }
      }

      if (window.audio && typeof window.audio.playSuccessChime === 'function') {
        window.audio.playSuccessChime();
      }

      if (this.dom.statusBanner) {
        this.dom.statusBanner.classList.remove('hidden');
      }
      if (this.dom.dialogueBar) {
        this.dom.dialogueBar.textContent = `🏆 Đã hoàn thành màn chơi Pixel 2D của [${cfg.artifactName}]! Ấn ký cổ vật đã được khắc vào Bảo Tàng 3D.`;
      }
    }

    exitToMuseum() {
      if (this.externalMode && !this.stageCompleted &&
          !window.confirm('Quay về bảo tàng? Game chưa có lưu tiến trình câu đố; lượt chơi này sẽ bắt đầu lại khi vào lại.')) return;
      this.stopGameLoop();
      if (window.game && typeof window.game.switchView === 'function') {
        window.game.switchView('museum', null, 'dissolve');
      }
    }
  }

  window.vtPixelGame = new VTPixelGameManager();
})();
