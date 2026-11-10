/**
 * VẠN TƯỢNG - Core Game Controller & Ambient Canvas
 */

// Đồng nhất biến dữ liệu cốt truyện GAME_DATA / STORY_DATA trên toàn dự án
const STORY_DATA = window.GAME_DATA || window.STORY_DATA || (typeof GAME_DATA !== 'undefined' ? GAME_DATA : {});

class VanTuongGame {
  constructor() {
    this.state = JSON.parse(JSON.stringify(STORY_DATA.initialState));
    this.currentNodeId = "start_lobby";

    // DOM Elements
    this.dom = {
      sanityBar: document.getElementById('sanityBar'),
      sanityValue: document.getElementById('sanityValue'),
      chapterIndicator: document.getElementById('chapterIndicator'),
      soundToggleBtn: document.getElementById('soundToggleBtn'),
      soundIcon: document.getElementById('soundIcon'),
      journalToggleBtn: document.getElementById('journalToggleBtn'),
      journalBadge: document.getElementById('journalBadge'),
      restartBtn: document.getElementById('restartBtn'),

      // Visual stage
      sceneImage: document.getElementById('sceneImage'),
      artLocationTag: document.getElementById('artLocationTag'),
      artDateTag: document.getElementById('artDateTag'),
      mysticTextOverlay: document.getElementById('mysticTextOverlay'),
      viewportWrapper: document.getElementById('viewportWrapper'),

      // Narrative
      narrativeText: document.getElementById('narrativeText'),
      choicesContainer: document.getElementById('choicesContainer'),
      storyPanel: document.getElementById('storyPanel'),

      // Modals & FX
      journalModal: document.getElementById('journalModal'),
      closeJournalBtn: document.getElementById('closeJournalBtn'),
      inventoryGrid: document.getElementById('inventoryGrid'),
      cluesList: document.getElementById('cluesList'),
      historyLogList: document.getElementById('historyLogList'),
      invCount: document.getElementById('invCount'),
      clueCount: document.getElementById('clueCount'),
      toastNotification: document.getElementById('toastNotification'),
      flashOverlay: document.getElementById('flashOverlay')
    };

    this.initCanvas();
    this.initEventListeners();
    this.initImageFallback();
    this.loadScene(this.currentNodeId);
  }

  initImageFallback() {
    this.dom.sceneImage.addEventListener('error', () => {
      // Fallback sang hình ảnh sơn dầu / mỹ thuật cổ đảm bảo luôn hiển thị
      this.dom.sceneImage.src = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80';
    });
  }

  // -----------------------------------------------------------------
  // 1. Khởi tạo Ambient Canvas hiệu ứng Mực Tàu & Bão Giấy Dó Cổ
  // -----------------------------------------------------------------
  initCanvas() {
    const canvas = document.getElementById('ambientCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Mảng hạt mực và sợi giấy dó trôi bồng bềnh
    const particles = [];
    const PARTICLE_COUNT = 45;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 0.6,
        alpha: Math.random() * 0.45 + 0.1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.35 ? '#d4af37' : '#a81c22'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      requestAnimationFrame(render);
    };

    render();
  }

  // -----------------------------------------------------------------
  // 2. Lắng nghe sự kiện người dùng
  // -----------------------------------------------------------------
  initEventListeners() {
    // Kích hoạt audio khi người dùng click lần đầu
    document.addEventListener('click', () => {
      if (window.gameAudio) {
        window.gameAudio.init();
      }
    }, { once: true });

    // Toggle âm thanh
    this.dom.soundToggleBtn.addEventListener('click', () => {
      if (window.gameAudio) {
        window.gameAudio.init();
        const isMuted = window.gameAudio.toggleMute();
        this.dom.soundIcon.textContent = isMuted ? '🔇' : '🔊';
        this.showToast(isMuted ? 'Đã tắt âm thanh' : 'Đã bật âm thanh');
      }
    });

    // Mở / Đóng nhật ký
    this.dom.journalToggleBtn.addEventListener('click', () => this.toggleJournal(true));
    this.dom.closeJournalBtn.addEventListener('click', () => this.toggleJournal(false));

    this.dom.journalModal.addEventListener('click', (e) => {
      if (e.target === this.dom.journalModal) {
        this.toggleJournal(false);
      }
    });

    // Chuyển tab nhật ký
    const tabs = this.dom.journalModal.querySelectorAll('.tab-btn');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.classList.remove('active'));
        this.dom.journalModal.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Nút chơi lại
    this.dom.restartBtn.addEventListener('click', () => {
      if (confirm('Bạn có muốn khởi động lại hành trình từ sảnh triển lãm không?')) {
        this.restartGame();
      }
    });
  }

  // -----------------------------------------------------------------
  // 3. Tải và dựng cảnh (Load Scene)
  // -----------------------------------------------------------------
  loadScene(nodeId) {
    const node = STORY_DATA.nodes[nodeId];
    if (!node) {
      console.error(`Không tìm thấy node cốt truyện: ${nodeId}`);
      return;
    }

    this.currentNodeId = nodeId;
    this.state.visitedNodes.push(nodeId);

    // Cập nhật âm thanh và hiệu ứng
    this.handleNodeEffects(node);

    // Xử lý thêm vật phẩm hoặc manh mối
    if (node.addItem && !this.state.inventory.includes(node.addItem)) {
      this.state.inventory.push(node.addItem);
      const itemInfo = STORY_DATA.artifacts[node.addItem];
      this.showToast(`Thu thập cổ vật: ${itemInfo.name}`);
      if (window.gameAudio) window.gameAudio.playBronzeGong();
    }

    if (node.addExtraItem && !this.state.inventory.includes(node.addExtraItem)) {
      this.state.inventory.push(node.addExtraItem);
      const itemInfo = STORY_DATA.artifacts[node.addExtraItem];
      this.showToast(`Thu thập cổ vật: ${itemInfo.name}`);
    }

    if (node.addClue && !this.state.clues.includes(node.addClue)) {
      this.state.clues.push(node.addClue);
      this.showToast(`Manh mối mới: ${node.addClue}`);
    }

    // Cập nhật giao diện hình ảnh
    this.dom.sceneImage.src = node.image;
    this.dom.artLocationTag.textContent = node.location || 'TRIỂN LÃM VẠN TƯỢNG';
    this.dom.artDateTag.textContent = node.date || 'Hà Nội';
    this.dom.mysticTextOverlay.textContent = node.floatingText || '';
    this.dom.chapterIndicator.textContent = node.chapter || 'VẠN TƯỢNG';

    // Cập nhật văn bản câu chuyện
    this.dom.narrativeText.innerHTML = node.text;
    this.dom.storyPanel.scrollTop = 0;

    // Cập nhật danh sách lựa chọn
    this.renderChoices(node.choices);

    // Cập nhật thanh trạng thái
    this.updateHUD();
    this.updateJournalContent();
  }

  // -----------------------------------------------------------------
  // 4. Xử lý hiệu ứng âm thanh & hình ảnh rung chấn cõi mực
  // -----------------------------------------------------------------
  handleNodeEffects(node) {
    // Rung lắc khung nhìn (Camera Shake)
    if (node.ambientFx === 'shake' || node.ambientFx === 'storm') {
      document.body.classList.remove('camera-shake');
      void document.body.offsetWidth; // Force reflow
      document.body.classList.add('camera-shake');
      setTimeout(() => document.body.classList.remove('camera-shake'), 700);

      if (window.gameAudio) {
        window.gameAudio.playDeepDrum();
      }
    }

    // Chớp sáng kịch tính (Flash FX)
    if (node.id === 'ink_awakening' || node.id === 'the_threshold' || node.id === 'final_confrontation') {
      this.dom.flashOverlay.classList.add('flash');
      setTimeout(() => this.dom.flashOverlay.classList.remove('flash'), 300);
      if (window.gameAudio) window.gameAudio.playDramaticSting();
    }
  }

  // -----------------------------------------------------------------
  // 5. Hiển thị các nút lựa chọn
  // -----------------------------------------------------------------
  renderChoices(choices) {
    this.dom.choicesContainer.innerHTML = '';
    if (!choices || choices.length === 0) return;

    choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';

      // Kiểm tra điều kiện vật phẩm
      let isLocked = false;
      if (choice.requireItem && !this.state.inventory.includes(choice.requireItem)) {
        isLocked = true;
        btn.classList.add('locked');
        const reqName = STORY_DATA.artifacts[choice.requireItem]?.name || 'Cổ vật cần thiết';
        btn.innerHTML = `<span class="locked-icon">🔒</span> ${choice.text} <em style="color:var(--state-error); font-size:0.8rem; margin-left:auto;">[Thiếu ${reqName}]</em>`;
      } else {
        btn.innerHTML = `<span>${choice.text}</span>`;
      }

      if (!isLocked) {
        btn.addEventListener('click', () => {
          // Âm thanh tương tác
          if (window.gameAudio) {
            if (choice.sound === 'drum') window.gameAudio.playDeepDrum();
            else if (choice.sound === 'sting') window.gameAudio.playDramaticSting();
            else if (choice.sound === 'gong') window.gameAudio.playBronzeGong();
            else if (choice.sound === 'paper') window.gameAudio.playPaperRustle();
            else window.gameAudio.playInkDrip();
          }

          // Hiệu ứng định lực (Sanity)
          if (choice.sanityEffect) {
            this.adjustSanity(choice.sanityEffect);
          }

          // Nhận manh mối nếu có
          if (choice.clue && !this.state.clues.includes(choice.clue)) {
            this.state.clues.push(choice.clue);
            this.showToast(`Manh mối mới: ${choice.clue}`);
          }

          // Reset game nếu bấm nút kết thúc
          if (choice.resetGame) {
            this.restartGame();
            return;
          }

          // Chuyển scene tiếp theo
          this.loadScene(choice.nextNode);
        });
      }

      this.dom.choicesContainer.appendChild(btn);
    });
  }

  // -----------------------------------------------------------------
  // 6. Điều chỉnh Định Lực (Sanity)
  // -----------------------------------------------------------------
  adjustSanity(amount) {
    this.state.sanity = Math.max(0, Math.min(100, this.state.sanity + amount));
    this.updateHUD();

    if (amount < 0) {
      this.showToast(`Định lực giảm ${Math.abs(amount)}%!`);
    } else if (amount > 0) {
      this.showToast(`Định lực phục hồi +${amount}%!`);
    }

    // Nếu định lực về 0, chuyển ngay sang Kết cục bi thảm
    if (this.state.sanity <= 0 && this.currentNodeId !== 'ending_trapped') {
      setTimeout(() => {
        this.showToast('Định lực cạn kiệt! Bạn bị mực đen nuốt chửng!');
        this.loadScene('ending_trapped');
      }, 500);
    }
  }

  // -----------------------------------------------------------------
  // 7. Cập nhật HUD & Thanh trạng thái
  // -----------------------------------------------------------------
  updateHUD() {
    this.dom.sanityValue.textContent = `${this.state.sanity}%`;
    this.dom.sanityBar.style.width = `${this.state.sanity}%`;

    // Đổi màu thanh định lực
    if (this.state.sanity <= 25) {
      this.dom.sanityBar.style.background = 'var(--state-error)';
    } else if (this.state.sanity <= 55) {
      this.dom.sanityBar.style.background = 'linear-gradient(90deg, var(--state-error), var(--accent-burnt-orange))';
    } else {
      this.dom.sanityBar.style.background = 'linear-gradient(90deg, var(--accent-cinnabar), var(--accent-imperial-gold))';
    }

    const badgeTotal = this.state.inventory.length + this.state.clues.length;
    this.dom.journalBadge.textContent = badgeTotal;
    this.dom.invCount.textContent = this.state.inventory.length;
    this.dom.clueCount.textContent = this.state.clues.length;
  }

  // -----------------------------------------------------------------
  // 8. Cập nhật Nội dung Modal Nhật Ký & Cổ Vật
  // -----------------------------------------------------------------
  updateJournalContent() {
    // Inventory
    if (this.state.inventory.length === 0) {
      this.dom.inventoryGrid.innerHTML = '<p class="empty-hint">Chưa có cổ vật nào được cất giữ...</p>';
    } else {
      this.dom.inventoryGrid.innerHTML = this.state.inventory.map((itemId) => {
        const item = STORY_DATA.artifacts[itemId];
        if (!item) return '';
        return `
          <div class="item-card">
            <div class="item-head">
              <span class="item-icon">${item.icon}</span>
              <span class="item-name">${item.name}</span>
            </div>
            <p class="item-desc">${item.desc}</p>
          </div>
        `;
      }).join('');
    }

    // Clues
    if (this.state.clues.length === 0) {
      this.dom.cluesList.innerHTML = '<li class="empty-hint">Chưa ghi nhận được manh mối cốt lõi nào...</li>';
    } else {
      this.dom.cluesList.innerHTML = this.state.clues.map((c) => `<li class="clue-item">🔍 ${c}</li>`).join('');
    }

    // History Log
    this.dom.historyLogList.innerHTML = this.state.visitedNodes.map((nid, index) => {
      const n = STORY_DATA.nodes[nid];
      if (!n) return '';
      return `
        <div class="history-item">
          <strong>Bước ${index + 1}:</strong> ${n.location || 'Sảnh Triển Lãm'} — <em>${n.chapter || ''}</em>
        </div>
      `;
    }).join('');
  }

  toggleJournal(show) {
    if (show) {
      this.dom.journalModal.classList.remove('hidden');
      if (window.gameAudio) window.gameAudio.playPaperRustle();
    } else {
      this.dom.journalModal.classList.add('hidden');
    }
  }

  // Toast Notification
  showToast(msg) {
    const toast = this.dom.toastNotification;
    toast.textContent = msg;
    toast.classList.remove('hidden');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  // Khởi động lại game
  restartGame() {
    this.state = JSON.parse(JSON.stringify(STORY_DATA.initialState));
    this.loadScene('start_lobby');
    this.showToast('Hành trình đã được khởi tạo lại.');
  }
}

// Khởi chạy game khi tài liệu sẵn sàng
window.addEventListener('DOMContentLoaded', () => {
  window.gameApp = new VanTuongGame();
});
