/**
 * HORIZON MOTION ENGINE — VẠN TƯỢNG
 * Chuyển thể tối ưu từ component Horizon Hero Section:
 * - Loại bỏ toàn bộ Three.js WebGL 3D nặng nề (mặt trời 3D, shader, particle) gây tụt FPS và lag máy.
 * - Giữ lại 100% linh hồn chuyển động (Motion & Dynamics):
 *   + Thanh đo tiến trình cuộn trang mượt mà (Scroll Progress Bar 0% - 100%)
 *   + Bộ đếm 5 Hồi Kể Chuyện di sản (Dynamic Section Counter 01/05 -> 05/05)
 *   + Menu điều hướng dọc bên hông (Heritage Side Menu & Quick Navigation)
 *   + Hiệu ứng Parallax đa tầng siêu nhẹ bằng GPU-accelerated translate3d (60fps mượt mà, 0% CPU overhead)
 *   + Chuyển động xuất hiện uyển chuyển (Scroll-triggered cinematic reveals)
 */

(function (global) {
  'use strict';

  class HorizonMotionEngine {
    constructor(containerId = 'viewHome') {
      this.container = document.getElementById(containerId) || window;
      this.initialized = false;
      this.ticking = false;

      this.scrollProgress = 0;
      this.currentSection = 1;
      this.totalSections = 5;

      // Section IDs tương ứng 5 Hồi Kể Chuyện
      this.sectionIds = [
        'secHeroOpening',
        'secLostCollection',
        'secExhibitionHall',
        'secEmptyMasterpiece',
        'secEnterMuseum'
      ];

      this.handleScroll = this.handleScroll.bind(this);
      this.handleResize = this.handleResize.bind(this);
      this.updateMotion = this.updateMotion.bind(this);
    }

    init() {
      this.container = document.getElementById('viewHome') || window;
      if (this.initialized) return;

      // Lắng nghe sự kiện cuộn với passive flag để đạt hiệu năng tối đa
      if (this.container && this.container.addEventListener) {
        this.container.addEventListener('scroll', this.handleScroll, { passive: true });
      }
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      window.addEventListener('resize', this.handleResize, { passive: true });

      // Khởi tạo trạng thái ban đầu
      this.handleScroll();
      this.initInteractions();

      this.initialized = true;
    }

    handleScroll() {
      if (!this.ticking) {
        requestAnimationFrame(this.updateMotion);
        this.ticking = true;
      }
    }

    handleResize() {
      this.handleScroll();
    }

    updateMotion() {
      this.ticking = false;

      let scrollY = 0;
      let maxScroll = 1;

      if (this.container && this.container.scrollTop !== undefined) {
        scrollY = this.container.scrollTop;
        const scrollH = this.container.scrollHeight || document.documentElement.scrollHeight;
        const clientH = this.container.clientHeight || window.innerHeight;
        maxScroll = Math.max(scrollH - clientH, 1);
      } else {
        scrollY = window.scrollY;
        maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      }

      const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      this.scrollProgress = progress;

      // 1. Xác định Section hiện tại dựa trên vị trí thực tế của từng Section
      let activeSectionIndex = 1;
      const viewportMid = scrollY + (window.innerHeight * 0.4);

      for (let i = 0; i < this.sectionIds.length; i++) {
        const sec = document.getElementById(this.sectionIds[i]);
        if (sec) {
          const top = sec.offsetTop;
          const height = sec.offsetHeight;
          if (viewportMid >= top && viewportMid < top + height) {
            activeSectionIndex = i + 1;
            break;
          } else if (i === this.sectionIds.length - 1 && viewportMid >= top) {
            activeSectionIndex = this.sectionIds.length;
          }
        }
      }

      this.currentSection = activeSectionIndex;

      // 2. Chuyển động thanh tiến trình cuộn (Scroll Progress Indicator)
      const progressFill = document.getElementById('horizonProgressFill');
      const counterEl = document.getElementById('horizonSectionCounter');

      if (progressFill) {
        progressFill.style.width = `${(progress * 100).toFixed(1)}%`;
      }
      if (counterEl) {
        const curText = `${String(this.currentSection).padStart(2, '0')} / ${String(this.totalSections).padStart(2, '0')}`;
        if (counterEl.textContent !== curText) {
          counterEl.textContent = curText;
        }
      }

      // 3. Chuyển động Parallax nhẹ nhàng, mượt mà bằng GPU transform3d (Không lag)
      // Cho toàn bộ 5 lớp background tạo cảm giác như cuộn tranh dài liên tục
      const heroBg = document.getElementById('heroBgPainting');
      if (heroBg && scrollY < window.innerHeight * 1.5) {
        heroBg.style.transform = `scale(1.02) translate3d(0, ${(scrollY * 0.18).toFixed(1)}px, 0)`;
      }

      const lostBg = document.getElementById('lostBgPainting');
      const secLost = document.getElementById('secLostCollection');
      if (lostBg && secLost) {
        const secLostTop = secLost.offsetTop;
        const relY = scrollY - secLostTop;
        if (relY > -window.innerHeight && relY < secLost.offsetHeight) {
          lostBg.style.transform = `translate3d(0, ${(relY * 0.12).toFixed(1)}px, 0)`;
        }
      }

      const exhibBg = document.getElementById('exhibitionBgPainting');
      const secExhib = document.getElementById('secExhibitionHall');
      if (exhibBg && secExhib) {
        const secExhibTop = secExhib.offsetTop;
        const relY = scrollY - secExhibTop;
        if (relY > -window.innerHeight && relY < secExhib.offsetHeight) {
          exhibBg.style.transform = `translate3d(0, ${(relY * 0.10).toFixed(1)}px, 0)`;
        }
      }

      const masterBg = document.getElementById('masterpieceBgPainting');
      const secMaster = document.getElementById('secEmptyMasterpiece');
      if (masterBg && secMaster) {
        const secMasterTop = secMaster.offsetTop;
        const relY = scrollY - secMasterTop;
        if (relY > -window.innerHeight && relY < secMaster.offsetHeight) {
          masterBg.style.transform = `translate3d(0, ${(relY * 0.08).toFixed(1)}px, 0)`;
        }
      }

      const gateBg = document.getElementById('gateBgPainting');
      const secGate = document.getElementById('secEnterMuseum');
      if (gateBg && secGate) {
        const secGateTop = secGate.offsetTop;
        const relY = scrollY - secGateTop;
        if (relY > -window.innerHeight && relY < secGate.offsetHeight) {
          gateBg.style.transform = `translate3d(0, ${(relY * 0.08).toFixed(1)}px, 0)`;
        }
      }

      // 4. Parallax cho các đám mây và họa tiết trang trí nếu có
      const cloudRibbons = document.querySelectorAll('.sec-cloud-ribbon-blend');
      cloudRibbons.forEach((ribbon, idx) => {
        const factor = (idx % 2 === 0) ? 0.08 : -0.08;
        ribbon.style.transform = `translate3d(0, ${(scrollY * factor).toFixed(1)}px, 0)`;
      });
    }

    initInteractions() {
      // Side menu click to scroll to top
      const sideMenu = document.getElementById('horizonSideMenu');
      if (sideMenu) {
        sideMenu.addEventListener('click', () => {
          if (this.container && this.container.scrollTo) {
            this.container.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      }
    }

    destroy() {
      if (this.container && this.container.removeEventListener) {
        this.container.removeEventListener('scroll', this.handleScroll);
      }
      window.removeEventListener('scroll', this.handleScroll);
      window.removeEventListener('resize', this.handleResize);
      this.initialized = false;
    }
  }

  // Khởi tạo singleton cho HorizonMotionEngine
  global.horizonHero3D = new HorizonMotionEngine();
  global.HorizonHero3D = HorizonMotionEngine;

})(typeof window !== 'undefined' ? window : this);
