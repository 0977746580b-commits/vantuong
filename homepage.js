/**
 * VẠN TƯỢNG - Tương Tác GSAP Parallax & Cuộn Trang Chủ (Modular Homepage Motion)
 */

    document.addEventListener('DOMContentLoaded', () => {
      const viewHome = document.getElementById('viewHome');
      if (!viewHome) return;

      // 0. Khởi tạo 3D Horizon WebGL Engine (Three.js Multi-Layer Mountains & Scroll Camera)
      if (window.horizonHero3D && typeof window.horizonHero3D.init === 'function') {
        try {
          window.horizonHero3D.init();
        } catch(e) {
          console.warn('[Horizon3D] Lỗi khởi tạo:', e);
        }
      }

      const navbar = document.getElementById('homeNavbar');
      const heroBg = document.getElementById('heroBgPainting');

      // 1. Navbar Scrolled Effect & Hero Parallax
      viewHome.addEventListener('scroll', () => {
        const sy = viewHome.scrollTop;
        if (navbar) {
          if (sy > 50) navbar.classList.add('scrolled');
          else navbar.classList.remove('scrolled');
        }
        // Parallax nhẹ nhàng cho background painting của Hero
        if (heroBg && sy < window.innerHeight) {
          heroBg.style.transform = `scale(1.02) translateY(${sy * 0.28}px)`;
        }
      }, { passive: true });

      // 2. The Vanishing Ink Mystery (Section 04)
      const doPaper = document.getElementById('doPaperSurface');
      const inkLayer = document.getElementById('inkVanishingLayer');
      if (doPaper && inkLayer) {
        doPaper.addEventListener('mousemove', (e) => {
          const rect = doPaper.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
          const maxDist = 360, minDist = 80;
          let opacity = 0.88;
          if (dist < maxDist) {
            const factor = Math.max(0, (dist - minDist) / (maxDist - minDist));
            opacity = Math.max(0.02, factor * 0.88);
          }
          inkLayer.style.opacity = opacity.toFixed(2);
        });
        doPaper.addEventListener('mouseleave', () => {
          inkLayer.style.opacity = '0.88';
        });
      }

      // 3. Kích hoạt Luồng Nhập Môn Di Sản: Thư Mời -> Quy Thức -> Bảo Tàng 3D
      // TUYỆT ĐỐI KHÔNG BỎ QUA THƯ MỜI & HƯỚNG DẪN DƯỚI MỌI HÌNH THỨC
      const startJourneyAction = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        // Ẩn trang Sáng Lập nếu đang mở để hiển thị sạch sẽ Thư Mời
        const viewFounders = document.getElementById('viewFounders');
        if (viewFounders) viewFounders.classList.remove('active');
        const viewHome = document.getElementById('viewHome');
        if (viewHome) viewHome.classList.add('active');

        // Reset snapshot bảo tàng cũ nếu có
        if (window.vtMuseum3D && window.vtMuseum3D.clearMuseumSnapshot) {
          window.vtMuseum3D.clearMuseumSnapshot();
        }
        try { sessionStorage.removeItem('VT_MUSEUM_SNAPSHOT'); } catch(err) {}

        // Kích hoạt qua game engine nếu đã khởi tạo
        if (window.game && typeof window.game.startJourney === 'function') {
          window.game.startJourney();
        } else if (window.game && typeof window.game.openOnboarding === 'function') {
          window.game.openOnboarding('invitation');
        } else {
          // Fallback kích hoạt DOM Thư Mời
          const invView = document.getElementById('viewInvitation');
          if (invView) {
            invView.classList.add('active');
            invView.scrollTop = 0;
          }
        }
      };

      // Cơ chế bảo vệ tuyệt đối: Mọi lệnh enterMuseumAction nếu còn sót lại đều chuyển hướng vào startJourneyAction
      const enterMuseumAction = startJourneyAction;

      const btnHeroEnter = document.getElementById('btnHeroEnterMuseum');
      const btnFinalEnter = document.getElementById('btnEnterMuseumFinal');
      const navStart = document.getElementById('navStartBtn');

      if (btnHeroEnter) btnHeroEnter.addEventListener('click', startJourneyAction);
      if (btnFinalEnter) btnFinalEnter.addEventListener('click', startJourneyAction);
      if (navStart) navStart.addEventListener('click', startJourneyAction);

      // 3.1. Chuyển sang trang Tác Giả & Sáng Lập (Tách biệt khỏi Homepage)
      const navFounders = document.getElementById('navFoundersBtn');
      const goToFounders = (e) => {
        if (e) e.preventDefault();
        if (window.game && typeof window.game.switchView === 'function') {
          window.game.switchView('founders', null, 'dissolve');
        } else {
          document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
          const vf = document.getElementById('viewFounders');
          if (vf) {
            vf.classList.add('active');
            vf.scrollTop = 0;
          }
        }
      };

      const backToHome = (e) => {
        if (e) e.preventDefault();
        if (window.game && typeof window.game.switchView === 'function') {
          window.game.switchView('home', null, 'dissolve');
        } else {
          document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
          const vh = document.getElementById('viewHome');
          if (vh) {
            vh.classList.add('active');
            vh.scrollTop = 0;
          }
        }
      };

      if (navFounders) navFounders.addEventListener('click', goToFounders);

      const btnBackFounders = document.getElementById('btnBackHomeFromFounders');
      const btnBackFoundersBottom = document.getElementById('btnBackHomeFromFoundersBottom');
      const foundersBrandBack = document.getElementById('foundersBrandBack');

      if (btnBackFounders) btnBackFounders.addEventListener('click', backToHome);
      if (btnBackFoundersBottom) btnBackFoundersBottom.addEventListener('click', backToHome);
      if (foundersBrandBack) foundersBrandBack.addEventListener('click', backToHome);

      const btnMuseumFounders = document.getElementById('btnEnterMuseumFromFounders');
      const btnMuseumFoundersBottom = document.getElementById('btnEnterMuseumFromFoundersBottom');
      if (btnMuseumFounders) btnMuseumFounders.addEventListener('click', startJourneyAction);
      if (btnMuseumFoundersBottom) btnMuseumFoundersBottom.addEventListener('click', startJourneyAction);

      // 4. Smooth Anchor Scrolling inside #viewHome
      document.querySelectorAll('#viewHome a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (!targetId || targetId === '#') return;
          const targetEl = document.querySelector(targetId);
          if (targetEl && viewHome) {
            e.preventDefault();
            const topOffset = targetEl.offsetTop - (navbar ? navbar.offsetHeight : 0);
            viewHome.scrollTo({ top: topOffset, behavior: 'smooth' });
          }
        });
      });
    });
