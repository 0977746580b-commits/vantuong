/**
 * ===================================================================
 * VẠN TƯỢNG — CINEMATIC NARRATOR DIALOGUE SYSTEM (3D MUSEUM)
 * ===================================================================
 * - Tách biệt dữ liệu kịch bản dẫn truyện (NARRATION_SCRIPTS) và
 *   logic điều khiển tương tác (VTMuseumNarrator).
 * - Chỉ hiển thị văn bản bằng hiệu ứng gõ chữ Typewriter (Text-Only,
 *   tuyệt đối không dùng voice-over hay TTS).
 * - Hỗ trợ đầy đủ Unicode tiếng Việt, phím tắt [E] và nhấp chuột.
 */

(function () {
  'use strict';

  // ===================================================================
  // 1. DỮ LIỆU KỊCH BẢN DẪN TRUYỆN (TÁCH BIỆT ĐỂ DỄ CHỈNH SỬA)
  // ===================================================================
  const NARRATION_SCRIPTS = {
    // Chuỗi dẫn nhập khi khách tham quan lần đầu bước vào Tiền Sảnh Bảo Tàng 3D
    intro: [
      {
        speaker: 'LỜI DẪN • KHÔNG GIAN VẠN TƯỢNG',
        text: 'Triển lãm Vạn Tượng được tổ chức tại một không gian nghệ thuật lâu đời ở trung tâm Hà Nội, thu hút sự chú ý của giới sưu tầm, các nhà nghiên cứu mỹ thuật, nghệ nhân và đông đảo công chúng. Sự kiện được giới thiệu là lần đầu tiên công chúng có cơ hội chiêm ngưỡng một bộ sưu tập tranh dân gian Việt Nam đặc biệt, bao gồm những tác phẩm được cho là đã thất truyền qua nhiều thế hệ.'
      },
      {
        speaker: 'LỜI DẪN • NHÀ SƯU TẦM BÍ ẨN',
        text: 'Người đứng sau triển lãm là một nhà sưu tầm kín tiếng, người tuyên bố đã dành gần như cả cuộc đời để lần theo dấu vết của những dòng tranh cổ. Theo lời ông, các tác phẩm được tập hợp từ nhiều nguồn khác nhau: những căn nhà cổ bị bỏ hoang, các bộ sưu tập tư nhân không còn người thừa kế, những kho lưu trữ thất lạc và cả những di vật chưa từng được giới nghiên cứu ghi nhận.'
      },
      {
        speaker: 'LỜI DẪN • NGUỒN GỐC BỎ NGỎ',
        text: 'Tuy nhiên, khi được hỏi về nguồn gốc cụ thể của từng tác phẩm, ban tổ chức chỉ đưa ra những thông tin sơ lược, viện dẫn lý do quyền riêng tư của người hiến tặng và quá trình xác minh vẫn chưa hoàn tất. Điều khiến giới chuyên môn xôn xao không chỉ là tuổi đời của bộ sưu tập, mà còn là những điểm bất thường xuất hiện trên một số hiện vật.'
      },
      {
        speaker: 'LỜI DẪN • NHỮNG DỊ BẢN MÂU THUẪN',
        text: 'Phía góc trái phòng trưng bày, một chiếc mặt nạ được đặt trang trọng bên trong tủ kính, kèm theo tấm biển thông tin về nguồn gốc và lịch sử lưu truyền. Thay vì cung cấp một xuất xứ rõ ràng như thông lệ, hồ sơ của chiếc mặt nạ lại dẫn đến ba nguồn tư liệu với những lời giải thích mâu thuẫn nhau: khi là biểu tượng của một vị trung thần, khi lại gắn liền với hình ảnh kẻ bị cả làng buộc tội, thậm chí được xếp vào nhóm nhân vật phản diện trong một vở tuồng cổ.'
      },
      {
        speaker: 'LỜI DẪN • HỌA TIẾT CHƯA TỪNG GHI NHẬN',
        text: 'Bên cạnh đó, một số sản phẩm gốm cổ Bát Tràng cũng thu hút sự chú ý bởi những hoa văn chạm khắc khó lý giải. Những đường nét tưởng chừng chỉ mang tính trang trí lại ẩn chứa các hình thù kỳ lạ, không xuất hiện trong những bản ghi chép hay hình ảnh lưu trữ mà giới nghiên cứu từng biết đến.'
      },
      {
        speaker: 'LỜI DẪN • MẬT MÃ GIỮA CÁC DI VẬT',
        text: 'Dù vậy, tất cả những chi tiết này vẫn chỉ được xem là những dị bản chưa được giải thích, hoặc dấu vết của những lần phục chế trong quá khứ. Với phần lớn khách tham quan, chúng đơn giản khiến bộ sưu tập trở nên hấp dẫn hơn. Nhưng với những người thực sự am hiểu tác phẩm dân gian, các tác phẩm dường như đang chứa đựng một hệ thống hình ảnh có chủ ý, như thể ai đó đã cài vào chúng những thông điệp chỉ có thể được giải mã khi đặt các tác phẩm cạnh nhau.'
      },
      {
        speaker: 'HƯỚNG DẪN THƯỞNG LÃM & TƯƠNG TÁC',
        text: 'Hãy kéo chuột để quan sát toàn cảnh sảnh vòm, hoặc nhấp trực tiếp vào từng tủ kính trưng bày (hay thanh điều hướng phía trên) để tiếp cận hiện vật, xoay 360° và soi chiếu những điểm nhãn bí ẩn.'
      }
    ],

    // Lời dẫn ngữ cảnh khi khách tham quan tiếp cận từng hiện vật
    stations: {
      mask: [
        {
          speaker: 'GIAN TÂY • MẶT NẠ TUỒNG TAM DIỆN',
          text: 'Phía góc trái phòng trưng bày, một chiếc mặt nạ được đặt trang trọng bên trong tủ kính, kèm theo tấm biển thông tin về nguồn gốc và lịch sử lưu truyền. Tuy nhiên, thay vì cung cấp một xuất xứ rõ ràng như thông lệ, hồ sơ của chiếc mặt nạ lại dẫn đến ba nguồn tư liệu với những lời giải thích mâu thuẫn nhau: khi là biểu tượng của một vị trung thần, khi lại gắn liền với hình ảnh kẻ bị cả làng buộc tội, thậm chí được xếp vào nhóm nhân vật phản diện trong một vở tuồng cổ.'
        }
      ],
      ceramic: [
        {
          speaker: 'GIAN TRUNG • BÌNH GỐM MEN RẠN BÁT TRÀNG',
          text: 'Bên cạnh đó, một số sản phẩm gốm cổ Bát Tràng cũng thu hút sự chú ý bởi những hoa văn chạm khắc khó lý giải. Những đường nét tưởng chừng chỉ mang tính trang trí lại ẩn chứa các hình thù kỳ lạ, không xuất hiện trong những bản ghi chép hay hình ảnh lưu trữ mà giới nghiên cứu từng biết đến.'
        }
      ],
      flute: [
        {
          speaker: 'GIAN ĐÔNG • TRANH DÂN GIAN NGŨ HỔ',
          text: 'Ở gian trưng bày phía đông, bức tranh thờ Ngũ Hổ thuộc dòng tranh dân gian Hàng Trống cổ được lồng trong khung gỗ sơn son thếp vàng và đặt trang trọng trên giá đỡ gỗ trắc. Năm vị Thần Hổ trấn giữ năm phương — Hoàng Hổ uy nghiêm ngự chính giữa cùng Thanh Hổ, Bạch Hổ, Xích Hổ, Hắc Hổ vờn mây — kết hợp kỹ thuật in mộc bản và cản màu tay tinh xảo của nghệ nhân Thăng Long xưa. Thế nhưng dưới lớp màu khoáng trầm mặc ấy lại ẩn giấu một dị bản thất truyền chỉ phát lộ khi đặt cạnh chiếc mặt nạ tuồng và bình gốm Bát Tràng.'
        }
      ]
    }
  };

  // ===================================================================
  // 2. BỘ ĐIỀU KHIỂN HỘP THOẠI DẪN TRUYỆN (NARRATOR ENGINE)
  // ===================================================================
  class VTMuseumNarrator {
    constructor(scripts) {
      this.scripts = scripts;
      this.currentQueue = [];
      this.currentIndex = 0;
      this.isTyping = false;
      this.typingTimer = null;
      this.charIndex = 0;
      this.currentCharacters = [];
      this.typeSpeedMs = 18; // Tốc độ gõ mượt mà cho đoạn văn dài tiếng Việt

      this.hasPlayedIntro = false;
      this.visitedStations = new Set();
      this.lastRelevantQueue = this.scripts.intro;
      this.lastRelevantKey = 'intro';
      this.isMinimized = true;
      this.boundEvents = false;

      this.dom = {};
    }

    initDOM() {
      this.dom = {
        overlay: document.getElementById('vtNarratorOverlay'),
        frame: document.getElementById('vtNarratorFrame'),
        speaker: document.getElementById('vtNarratorSpeaker'),
        stepBadge: document.getElementById('vtNarratorStepBadge'),
        skipBtn: document.getElementById('vtNarratorSkipBtn'),
        textContent: document.getElementById('vtNarratorTextContent'),
        cursor: document.getElementById('vtNarratorCursor'),
        continueBtn: document.getElementById('vtNarratorContinueBtn'),
        actionLabel: document.getElementById('vtNarratorActionLabel'),
        reopenBtn: document.getElementById('vtNarratorReopenBtn'),
        museumView: document.getElementById('viewMuseum3D')
      };

      if (!this.dom.overlay || this.boundEvents) return;
      this.boundEvents = true;

      // Ngăn sự kiện chuột trên hộp thoại lan xuống Canvas Three.js
      const stopCanvasPropagation = (e) => {
        e.stopPropagation();
      };
      ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'wheel', 'touchstart', 'touchend'].forEach((evt) => {
        this.dom.overlay.addEventListener(evt, stopCanvasPropagation, { passive: true });
        if (this.dom.reopenBtn) {
          this.dom.reopenBtn.addEventListener(evt, stopCanvasPropagation, { passive: true });
        }
      });

      // Nhấp vào khung hoặc nút Tiếp tục -> Hoàn tất câu đang gõ hoặc sang đoạn tiếp theo
      if (this.dom.frame) {
        this.dom.frame.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleAdvance();
        });
      }

      if (this.dom.continueBtn) {
        this.dom.continueBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleAdvance();
        });
      }

      // Nút Thu gọn
      if (this.dom.skipBtn) {
        this.dom.skipBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.minimize();
        });
      }

      // Nút Mở lại Lời Dẫn gần nhất
      if (this.dom.reopenBtn) {
        this.dom.reopenBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.reopenLastRelevant();
        });
      }

      // Lắng nghe phím [E] toàn cục (chỉ hoạt động khi đang ở trong #viewMuseum3D và không mở modal khác)
      this._onKeyDown = (e) => {
        if (!this.isMuseumActive()) return;
        // Không bắt phím nếu đang gõ trong input/textarea
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) return;

        // Không bắt phím nếu các modal lớn (Sổ tay, Cổ đồ...) đang mở
        const manualModal = document.getElementById('heritageManualModal');
        const mapModal = document.getElementById('ancientMapModal');
        if ((manualModal && !manualModal.classList.contains('hidden')) ||
            (mapModal && !mapModal.classList.contains('hidden'))) {
          return;
        }

        if (e.key === 'e' || e.key === 'E') {
          if (!this.isMinimized) {
            e.preventDefault();
            this.handleAdvance();
          }
        }
      };
      window.addEventListener('keydown', this._onKeyDown);
    }

    isMuseumActive() {
      const mv = this.dom.museumView || document.getElementById('viewMuseum3D');
      return Boolean(mv && mv.classList.contains('active'));
    }

    // Kích hoạt khi người dùng bước vào Bảo Tàng 3D
    onEnterMuseum() {
      this.initDOM();
      if (!this.hasPlayedIntro) {
        this.hasPlayedIntro = true;
        this.startSequence(this.scripts.intro, 'intro');
      } else if (!this.isMinimized && this.lastRelevantKey === 'intro') {
        // Nếu chuỗi intro vừa được khởi chạy từ onStationChanged('entrance'), giữ nguyên không thu gọn
        return;
      } else {
        // Nếu đã xem intro ở lần vào trước đó, giữ hộp thoại ở trạng thái thu gọn kèm nút mở lại
        this.minimize();
      }
    }

    // Kích hoạt khi người dùng chuyển trạm trong Bảo Tàng 3D
    onStationChanged(stationId) {
      this.initDOM();
      if (!stationId || stationId === 'entrance') {
        // Khi ở Tiền Sảnh: cập nhật nội dung gần nhất là intro
        this.lastRelevantQueue = this.scripts.intro;
        this.lastRelevantKey = 'intro';
        if (!this.hasPlayedIntro) {
          this.hasPlayedIntro = true;
          this.startSequence(this.scripts.intro, 'intro');
        }
        return;
      }

      const stationScript = this.scripts.stations[stationId];
      if (stationScript && stationScript.length > 0) {
        this.lastRelevantQueue = stationScript;
        this.lastRelevantKey = stationId;
        // Hiển thị dẫn truyện ngữ cảnh khi khách tiếp cận cổ vật
        this.startSequence(stationScript, stationId);
      }
    }

    startSequence(queue, key = 'intro') {
      this.initDOM();
      if (!queue || !queue.length || !this.dom.overlay) return;

      this.clearTypingTimer();
      this.currentQueue = queue;
      this.currentIndex = 0;
      this.lastRelevantQueue = queue;
      this.lastRelevantKey = key;
      this.isMinimized = false;

      this.dom.overlay.classList.remove('minimized', 'hidden');
      if (this.dom.reopenBtn) {
        this.dom.reopenBtn.classList.add('hidden');
      }

      this.renderCurrentEntry();
    }

    renderCurrentEntry() {
      this.clearTypingTimer();
      const entry = this.currentQueue[this.currentIndex];
      if (!entry) {
        this.minimize();
        return;
      }

      if (this.dom.speaker) {
        this.dom.speaker.textContent = entry.speaker || 'NGƯỜI DẪN TRUYỆN • VẠN TƯỢNG';
      }

      if (this.dom.stepBadge) {
        if (this.currentQueue.length > 1) {
          this.dom.stepBadge.style.display = 'inline-block';
          this.dom.stepBadge.textContent = `${this.currentIndex + 1} / ${this.currentQueue.length}`;
        } else {
          this.dom.stepBadge.style.display = 'none';
        }
      }

      // Chuẩn hóa chuỗi Unicode NFC và tách mảng codepoint để không bao giờ cắt rời dấu tiếng Việt
      const normalizedText = String(entry.text || '').normalize('NFC');
      this.currentCharacters = Array.from(normalizedText);
      this.charIndex = 0;
      this.isTyping = true;

      if (this.dom.textContent) {
        this.dom.textContent.textContent = '';
      }
      if (this.dom.cursor) {
        this.dom.cursor.classList.remove('done');
      }
      this.updateActionButtonLabel();

      const step = () => {
        if (!this.isTyping) return;
        // Gõ 2 ký tự mỗi nhịp để mượt mà và giữ nhịp đọc tự nhiên cho câu văn dài
        const charsPerTick = 2;
        const nextIndex = Math.min(this.currentCharacters.length, this.charIndex + charsPerTick);
        if (this.dom.textContent) {
          this.dom.textContent.textContent = this.currentCharacters.slice(0, nextIndex).join('');
        }
        this.charIndex = nextIndex;

        // Tự cuộn khung chữ xuống nếu đoạn văn nhiều dòng
        const bodyEl = this.dom.textContent ? this.dom.textContent.parentElement?.parentElement : null;
        if (bodyEl) {
          bodyEl.scrollTop = bodyEl.scrollHeight;
        }

        if (this.charIndex >= this.currentCharacters.length) {
          this.finishTypingCurrent();
        } else {
          this.typingTimer = setTimeout(step, this.typeSpeedMs);
        }
      };

      this.typingTimer = setTimeout(step, this.typeSpeedMs);
    }

    finishTypingCurrent() {
      this.clearTypingTimer();
      this.isTyping = false;
      if (this.dom.textContent) {
        this.dom.textContent.textContent = this.currentCharacters.join('');
      }
      if (this.dom.cursor) {
        this.dom.cursor.classList.add('done');
      }
      this.updateActionButtonLabel();
    }

    updateActionButtonLabel() {
      if (!this.dom.actionLabel) return;
      if (this.isTyping) {
        this.dom.actionLabel.textContent = 'Hiện nhanh';
      } else if (this.currentIndex < this.currentQueue.length - 1) {
        this.dom.actionLabel.textContent = 'Tiếp tục';
      } else {
        this.dom.actionLabel.textContent = 'Khám phá';
      }
    }

    handleAdvance() {
      if (this.isTyping) {
        // Nếu chữ đang chạy -> Hiện trọn vẹn câu hiện tại ngay lập tức
        this.finishTypingCurrent();
        return;
      }

      // Nếu đã chạy xong chữ -> Chuyển sang đoạn tiếp theo hoặc thu gọn khi hết chuỗi
      if (this.currentIndex < this.currentQueue.length - 1) {
        this.currentIndex += 1;
        this.renderCurrentEntry();
      } else {
        this.minimize();
      }
    }

    minimize() {
      this.clearTypingTimer();
      this.isTyping = false;
      this.isMinimized = true;

      if (this.dom.overlay) {
        this.dom.overlay.classList.add('minimized');
      }
      if (this.dom.reopenBtn) {
        this.dom.reopenBtn.classList.remove('hidden');
      }
    }

    reopenLastRelevant() {
      const queue = (this.lastRelevantQueue && this.lastRelevantQueue.length)
        ? this.lastRelevantQueue
        : this.scripts.intro;
      this.startSequence(queue, this.lastRelevantKey || 'intro');
    }

    clearTypingTimer() {
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
        this.typingTimer = null;
      }
    }
  }

  // Khởi tạo instance toàn cục
  window.vtMuseumNarrator = new VTMuseumNarrator(NARRATION_SCRIPTS);
})();
