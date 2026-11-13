/**
 * VẠN TƯỢNG - Bộ Điều Khiển Trung Tâm Ứng Dụng (Modular Controller)
 */

    /* --- BỘ ĐIỀU KHIỂN CHÍNH ỨNG DỤNG (CONTROLLER) --- */
    class GameApp {
      constructor() {
        this.state = {
          sanity: 100,
          currentScene: 'prologue_context1',
          inventory: [],
          clues: [],
          solvedChambers: [],
          history: []
        };

        this.dom = {
          viewHome: document.getElementById('viewHome'),
          viewFounders: document.getElementById('viewFounders'),
          viewInvitation: document.getElementById('viewInvitation'),
          viewRules: document.getElementById('viewRules'),
          viewGame: document.getElementById('viewGame'),
          guidePopupModal: document.getElementById('guidePopupModal'),

          homeStartBtn: document.getElementById('homeStartBtn'),
          homeGuidePopupBtn: document.getElementById('homeGuidePopupBtn'),
          closeGuidePopupX: document.getElementById('closeGuidePopupX'),
          closeGuidePopupBtn: document.getElementById('closeGuidePopupBtn'),
          homeSealBtn: document.getElementById('homeSealBtn'),

          navStartBtn: document.getElementById('navStartBtn'),
          navGuideBtn: document.getElementById('navGuideBtn'),
          navOnboardingBtn: document.getElementById('navOnboardingBtn'),
          ctaStartBtn: document.getElementById('ctaStartBtn'),
          ctaGuideBtn: document.getElementById('ctaGuideBtn'),
          screenTransitionOverlay: document.getElementById('screenTransitionOverlay'),

          btnSkipInvitation: document.getElementById('btnSkipInvitation'),
          btnHomeFromInvitation: document.getElementById('btnHomeFromInvitation'),
          btnHomeFromRules: document.getElementById('btnHomeFromRules'),
          btnSkipRulesToMuseum: document.getElementById('btnSkipRulesToMuseum'),
          waxSealBtn: document.getElementById('waxSealBtn'),
          btnProceedToRules: document.getElementById('btnProceedToRules'),
          btnBackToInvitation: document.getElementById('btnBackToInvitation'),
          btnEnterMuseumFromRules: document.getElementById('btnEnterMuseumFromRules'),
          museumRulesBtn: document.getElementById('museumRulesBtn'),

          sanityValue: document.getElementById('sanityValue'),
          sanityBar: document.getElementById('sanityBar'),
          phaseTag: document.getElementById('phaseTag'),
          soundToggleBtn: document.getElementById('soundToggleBtn'),
          soundIcon: document.getElementById('soundIcon'),
          openGuideBtn: document.getElementById('openGuideBtn'),
          journalModalBtn: document.getElementById('journalModalBtn'),
          journalCount: document.getElementById('journalCount'),
          backHomeBtn: document.getElementById('backHomeBtn'),
          gameSealIcon: document.getElementById('gameSealIcon'),

          stageImg: document.getElementById('stageImg'),
          proceduralSvg: document.getElementById('proceduralSvg'),
          stageQuote: document.getElementById('stageQuote'),
          locationTag: document.getElementById('locationTag'),
          dateTag: document.getElementById('dateTag'),

          storyContent: document.getElementById('storyContent'),
          chamberGridContainer: document.getElementById('chamberGridContainer'),
          choiceContainer: document.getElementById('choiceContainer'),
          narrativeStage: document.getElementById('narrativeStage'),

          journalModal: document.getElementById('journalModal'),
          closeJournalX: document.getElementById('closeJournalX'),
          artifactGrid: document.getElementById('artifactGrid'),
          clueList: document.getElementById('clueList'),
          historyLog: document.getElementById('historyLog'),
          countArtifacts: document.getElementById('countArtifacts'),
          countClues: document.getElementById('countClues'),
          gameToast: document.getElementById('gameToast'),
          flashOverlay: document.getElementById('flashOverlay'),

          // Supabase Auth & Profile elements
          navAuthBtn: document.getElementById('navAuthBtn'),
          navAuthSeal: document.getElementById('navAuthSeal'),
          navAuthLabel: document.getElementById('navAuthLabel'),
          navCloudDot: document.getElementById('navCloudDot'),
          authModal: document.getElementById('authModal'),
          closeAuthModalX: document.getElementById('closeAuthModalX'),
          hudCloudSaveBtn: document.getElementById('hudCloudSaveBtn'),
          hudCloudIcon: document.getElementById('hudCloudIcon'),
          hudCloudText: document.getElementById('hudCloudText'),
          hudAuthBtn: document.getElementById('hudAuthBtn'),
          hudAuthSeal: document.getElementById('hudAuthSeal'),
          hudAuthName: document.getElementById('hudAuthName'),

          // Cổ Đồ Vạn Tượng & Điểm Nhãn Tương Tác Bối Cảnh
          ancientMapBtn: document.getElementById('ancientMapBtn'),
          ancientMapModal: document.getElementById('ancientMapModal'),
          closeAncientMapBtn: document.getElementById('closeAncientMapBtn'),
          mapSwitchToRelicsBtn: document.getElementById('mapSwitchToRelicsBtn'),
          mapProgressBadge: document.getElementById('mapProgressBadge'),
          mapProgressCount: document.getElementById('mapProgressCount'),

          // Màn Hình 3 Đại Di Khí (Unlock Ải Cổ Vật theo ref image4)
          museumRelicsBtn: document.getElementById('museumRelicsBtn'),
          relicsUnlockModal: document.getElementById('relicsUnlockModal'),
          btnCloseRelicsUnlock: document.getElementById('btnCloseRelicsUnlock'),
          relicsSwitchToMapBtn: document.getElementById('relicsSwitchToMapBtn'),
          relicsCollectedCount: document.getElementById('relicsCollectedCount'),
          sceneHotspotLayer: document.getElementById('sceneHotspotLayer'),
          hotspotDialogBubble: document.getElementById('hotspotDialogBubble'),
          closeBubbleBtn: document.getElementById('closeBubbleBtn'),
          bubbleIcon: document.getElementById('bubbleIcon'),
          bubbleName: document.getElementById('bubbleName'),
          bubbleDynastyTag: document.getElementById('bubbleDynastyTag'),
          bubbleContent: document.getElementById('bubbleContent'),
          bubbleActions: document.getElementById('bubbleActions'),

          // Không Gian Bảo Tàng 3D Đại Việt
          viewMuseum3D: document.getElementById('viewMuseum3D'),
          museum3DCanvasWrap: document.getElementById('museum3DCanvasWrap'),
          museumBackHomeBtn: document.getElementById('museumBackHomeBtn'),
          museumMapBtn: document.getElementById('museumMapBtn'),
          museumAudioToggleBtn: document.getElementById('museumAudioToggleBtn'),
          museumInspectionCard: document.getElementById('museumInspectionCard'),
          toggleCollapseCardBtn: document.getElementById('toggleCollapseCardBtn'),
          inspectionCardBody: document.getElementById('inspectionCardBody'),
          closeInspectionCardBtn: document.getElementById('closeInspectionCardBtn'),
          inspectArtifactIcon: document.getElementById('inspectArtifactIcon'),
          inspectArtifactTitle: document.getElementById('inspectArtifactTitle'),
          inspectArtifactDynasty: document.getElementById('inspectArtifactDynasty'),
          inspectArtifactDesc: document.getElementById('inspectArtifactDesc'),
          inspectArtifactDetails: document.getElementById('inspectArtifactDetails'),
          inspectHotspotBox: document.getElementById('inspectHotspotBox'),
          hotspotBoxTitle: document.getElementById('hotspotBoxTitle'),
          hotspotBoxDesc: document.getElementById('hotspotBoxDesc'),
          btnEnterRelicWorld: document.getElementById('btnEnterRelicWorld'),
          btnReturnEntrance: document.getElementById('btnReturnEntrance'),
          btnRotateLeft: document.getElementById('btnRotateLeft'),
          btnToggleAutoRotate: document.getElementById('btnToggleAutoRotate'),
          btnRotateRight: document.getElementById('btnRotateRight'),
          btnResetView: document.getElementById('btnResetView'),
          hudMuseumBtn: document.getElementById('hudMuseumBtn'),
          museumReopenCardBtn: document.getElementById('museumReopenCardBtn'),

          // Sổ Tay Khảo Cứu Di Sản (Review Manual - 3 Tabs)
          heritageManualModal: document.getElementById('heritageManualModal'),
          closeHeritageManualX: document.getElementById('closeHeritageManualX'),
          tabBtnManualLetter: document.getElementById('tabBtnManualLetter'),
          tabBtnManualRules: document.getElementById('tabBtnManualRules'),
          tabBtnManualSurvival: document.getElementById('tabBtnManualSurvival'),
          manualTabContentLetter: document.getElementById('manualTabContentLetter'),
          manualTabContentRules: document.getElementById('manualTabContentRules'),
          manualTabContentSurvival: document.getElementById('manualTabContentSurvival'),
          navManualBtn: document.getElementById('navManualBtn'),
          manualSwitchToRulesBtn: document.getElementById('manualSwitchToRulesBtn'),
          manualSwitchToRulesBtn2: document.getElementById('manualSwitchToRulesBtn2'),
          manualSwitchToLetterBtn: document.getElementById('manualSwitchToLetterBtn')
        };

        this.initCanvas();
        this.initEvents();
        this.initAuth();
      }

      // ===================================================================
      // HẠT BỤI VÀNG LINH KHÍ TOÀN TRANG (KHÔNG VẼ ĐÈ LÊN TRỐNG ĐỒNG)
      // ===================================================================
      initCanvas() {
        const canvas = document.getElementById('ambientCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w = canvas.width = Math.max(320, window.innerWidth || 1280);
        let h = canvas.height = Math.max(240, window.innerHeight || 800);

        window.addEventListener('resize', () => {
          w = canvas.width = Math.max(320, window.innerWidth || 1280);
          h = canvas.height = Math.max(240, window.innerHeight || 800);
        });

        // Hạt bụi vàng lơ lửng rất nhẹ nhàng (30 hạt)
        const particles = [];
        for (let i = 0; i < 30; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.8 + 0.5,
            vy: Math.random() * 0.25 + 0.08,
            vx: (Math.random() - 0.5) * 0.2,
            alpha: Math.random() * 0.35 + 0.1,
            color: '#fcd55c'
          });
        }

        const loop = () => {
          ctx.clearRect(0, 0, w, h);

          // Render hạt bụi vàng linh khí nhẹ siêu tối ưu (không lạm dụng ctx.save/restore)
          ctx.fillStyle = '#fcd55c';
          particles.forEach(p => {
            p.y -= p.vy;
            p.x += p.vx;
            if (p.y < 0) { p.y = h; p.x = Math.random() * w; }
            if (p.x < 0) p.x = w;
            if (p.x > w) p.x = 0;

            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          });

          if (this.isAmbientCanvasRunning) {
            this.ambientAnimId = requestAnimationFrame(loop);
          }
        };

        this.startAmbientCanvas = () => {
          if (this.isAmbientCanvasRunning) return;
          this.isAmbientCanvasRunning = true;
          loop();
        };

        this.stopAmbientCanvas = () => {
          this.isAmbientCanvasRunning = false;
          if (this.ambientAnimId) {
            cancelAnimationFrame(this.ambientAnimId);
            this.ambientAnimId = null;
          }
        };

        this.startAmbientCanvas();

        // Chế độ Trình Diễn / Ban Giám Khảo: Nạp sẵn quyền mở khóa toàn bộ gói trải nghiệm
        try {
          localStorage.setItem('VT_UNLOCKED_PACKS', JSON.stringify(['mask', 'ceramic', 'flute', 'brush', 'all', 'combo_all']));
        } catch(e) {}
      }

      // Hiệu ứng chuyển cảnh loang mực tàu phong cách "The Boat" (Sumi-e Ink Bleed Wipe)
      transitionWithTheBoatInk(onMidpoint, onComplete) {
        audio.playInkSwoosh();
        const inkOverlay = document.getElementById('theBoatTransition') || this.dom.screenTransitionOverlay;
        if (inkOverlay) {
          inkOverlay.classList.remove('active');
          void inkOverlay.offsetWidth;
          inkOverlay.classList.add('active');

          setTimeout(() => {
            if (onMidpoint) onMidpoint();

            setTimeout(() => {
              inkOverlay.classList.remove('active');
              if (onComplete) onComplete();
            }, 360);
          }, 380);
        } else {
          if (onMidpoint) onMidpoint();
          if (onComplete) onComplete();
        }
      }

      // Chuyển view với hiệu ứng lốc xoáy mực tàu hoặc tan biến thành mực
      switchView(viewName, onDone, transitionType = 'vortex') {
        const doSwitch = () => {
          document.querySelectorAll('.app-view').forEach(v => v.classList.remove('active'));
          if (viewName !== 'pixel-game' && window.vtPixelGame && typeof window.vtPixelGame.stopGameLoop === 'function') {
            window.vtPixelGame.stopGameLoop();
          }
          // Đóng toàn bộ các modal overlay để không che phủ giao diện 3D
          const curatorialModal = document.getElementById('curatorialInspectionModal');
          if (curatorialModal) curatorialModal.classList.remove('active');
          const guideModal = document.getElementById('guidePopupModal');
          if (guideModal) guideModal.classList.add('hidden');
          const manualModal = document.getElementById('heritageManualModal');
          if (manualModal) manualModal.classList.add('hidden');
          const mapModal = document.getElementById('ancientMapModal');
          if (mapModal) mapModal.classList.add('hidden');

          const drum = document.querySelector('.dong-son-container');
          if (drum) drum.style.display = (viewName === 'home') ? 'flex' : 'none';

          if (viewName === 'home') {
            if (window.vtMuseumNarrator && typeof window.vtMuseumNarrator.minimize === 'function') {
              window.vtMuseumNarrator.minimize();
            }
            if (this.startAmbientCanvas) this.startAmbientCanvas();
            if (window.vtMuseum3D) {
              window.vtMuseum3D.stop();
              if (window.vtMuseum3D.clearMuseumSnapshot) {
                window.vtMuseum3D.clearMuseumSnapshot();
              } else {
                window.vtMuseum3D.savedSnapshot = null;
                try { sessionStorage.removeItem('VT_MUSEUM_SNAPSHOT'); } catch(e) {}
              }
            }
            if (window.vtStylizedWorld) {
              window.vtStylizedWorld.unloadCurrentWorld();
            }
            this.dom.viewHome.classList.add('active');
            this.dom.viewHome.scrollTop = 0;
          } else if (viewName === 'museum') {
            if (this.stopAmbientCanvas) this.stopAmbientCanvas();
            if (window.vtStylizedWorld) {
              window.vtStylizedWorld.unloadCurrentWorld();
            }
            if (window.vtPixelGame && typeof window.vtPixelGame.stopGameLoop === 'function') {
              window.vtPixelGame.stopGameLoop();
            }
            if (this.dom.viewMuseum3D) {
              this.dom.viewMuseum3D.classList.add('active');
              const container = document.getElementById('museum3DCanvasWrap');
              if (window.vtMuseum3D && container) {
                if (!window.vtMuseum3D.renderer) {
                  window.vtMuseum3D.init(container);
                  this.bindMuseum3DEvents();
                }
                // Khi bước vào từ trang chủ: Luôn xóa snapshot và mở góc nhìn toàn cảnh sảnh Rotunda (entrance)
                const currentActive = document.querySelector('.app-view.active');
                const fromHome = !currentActive || currentActive.id === 'viewHome';
                if (fromHome && window.vtMuseum3D.clearMuseumSnapshot) {
                  window.vtMuseum3D.clearMuseumSnapshot();
                }
                const shouldRestore = !fromHome && window.vtMuseum3D.hasSavedSnapshot();
                window.vtMuseum3D.start(shouldRestore);
                if (!shouldRestore) {
                  window.vtMuseum3D.navigateToStation('entrance');
                }
                // Kích hoạt Hệ thống Hộp Thoại Dẫn Truyện Điện Ảnh Bảo Tàng 3D
                if (window.vtMuseumNarrator && typeof window.vtMuseumNarrator.onEnterMuseum === 'function') {
                  window.vtMuseumNarrator.onEnterMuseum();
                }
              }
              if (this.dom.museumInspectionCard) {
                this.dom.museumInspectionCard.classList.add('hidden');
              }
            }
          } else if (viewName === 'pixel-game') {
            if (window.vtMuseumNarrator && typeof window.vtMuseumNarrator.minimize === 'function') {
              window.vtMuseumNarrator.minimize();
            }
            if (this.stopAmbientCanvas) this.stopAmbientCanvas();
            if (window.vtMuseum3D) window.vtMuseum3D.stop();
            const vpg = document.getElementById('viewPixelGame');
            if (vpg) vpg.classList.add('active');
          } else if (viewName === 'game') {
            if (window.vtMuseumNarrator && typeof window.vtMuseumNarrator.minimize === 'function') {
              window.vtMuseumNarrator.minimize();
            }
            if (this.stopAmbientCanvas) this.stopAmbientCanvas();
            if (window.vtMuseum3D) window.vtMuseum3D.stop();
            if (window.vtPixelGame && typeof window.vtPixelGame.stopGameLoop === 'function') {
              window.vtPixelGame.stopGameLoop();
            }
            this.dom.viewGame.classList.add('active');
          } else if (viewName === 'invitation') {
            if (this.stopAmbientCanvas) this.stopAmbientCanvas();
            if (this.dom.viewInvitation) this.dom.viewInvitation.classList.add('active');
          } else if (viewName === 'rules') {
            if (this.stopAmbientCanvas) this.stopAmbientCanvas();
            if (this.dom.viewRules) this.dom.viewRules.classList.add('active');
          } else if (viewName === 'founders') {
            if (this.stopAmbientCanvas) this.stopAmbientCanvas();
            if (window.vtMuseum3D) window.vtMuseum3D.stop();
            const vf = document.getElementById('viewFounders');
            if (vf) {
              vf.classList.add('active');
              vf.scrollTop = 0;
            }
          }
          if (onDone) onDone();
        };

        if (transitionType === 'none') {
          doSwitch();
        } else if (transitionType === 'dissolve' && window.vtInkVortex && typeof window.vtInkVortex.startDissolve === 'function') {
          window.vtInkVortex.startDissolve(doSwitch);
        } else if (window.vtInkVortex) {
          window.vtInkVortex.start(doSwitch);
        } else {
          this.transitionWithTheBoatInk(doSwitch);
        }
      }

      // Khởi động trải nghiệm: Mở cánh cửa không gian Bảo Tàng 3D Đại Việt
      startJourney() {
        audio.init();
        audio.playDrum();

        // Luôn mở Thư Mời & Vé Thông Hành di sản đầu tiên để người dùng thưởng lãm trọn vẹn
        this.openOnboarding('invitation');
      }

      // Quản lý luồng Nhập môn (Thư Mời & Luật Chơi - Chế độ Onboarding ban đầu có đầy đủ điều hướng)
      openOnboarding(stage = 'invitation') {
        audio.init();
        audio.playPaper();
        if (stage === 'invitation') {
          const vf = document.getElementById('viewFounders');
          if (vf) vf.classList.remove('active');
          if (this.dom.viewHome) this.dom.viewHome.classList.add('active');
          if (this.dom.viewInvitation) {
            this.dom.viewInvitation.classList.add('active');
            this.dom.viewInvitation.scrollTop = 0;
          }
          if (this.dom.viewRules) {
            this.dom.viewRules.classList.remove('active', 'mode-review');
          }
        } else if (stage === 'rules') {
          if (this.dom.viewInvitation) this.dom.viewInvitation.classList.remove('active');
          if (this.dom.viewRules) {
            this.dom.viewRules.classList.remove('mode-review'); // Luồng ban đầu hiển thị đầy đủ nút điều hướng
            this.dom.viewRules.classList.add('active');
            this.dom.viewRules.scrollTop = 0;
          }
        }
      }

      closeOnboarding() {
        if (this.dom.viewInvitation) this.dom.viewInvitation.classList.remove('active');
        if (this.dom.viewRules) {
          this.dom.viewRules.classList.remove('active');
          this.dom.viewRules.classList.remove('mode-review');
        }
        const vf = document.getElementById('viewFounders');
        if (vf) vf.classList.remove('active');
        if (this.dom.viewHome) this.dom.viewHome.classList.add('active');
      }

      // Mở bảng Quy Thức ở chế độ Xem Lại (Dành cho Xem lại trong Bảo tàng / Game: chỉ có nội dung 4 điều, không có nút trang chủ hay vào bảo tàng)
      openRulesReview() {
        audio.init();
        audio.playPaper();
        if (this.dom.viewInvitation) this.dom.viewInvitation.classList.remove('active');
        if (this.dom.viewRules) {
          this.dom.viewRules.classList.add('mode-review'); // Ẩn điều hướng, chỉ hiện nội dung & nút đóng
          this.dom.viewRules.classList.add('active');
          this.dom.viewRules.scrollTop = 0;
        }
      }

      closeRulesReview() {
        audio.init();
        audio.playPaper();
        if (this.dom.viewRules) {
          this.dom.viewRules.classList.remove('active');
          this.dom.viewRules.classList.remove('mode-review');
        }
      }

      proceedFromInvitationToRules() {
        audio.init();
        audio.playDrum();
        this.openOnboarding('rules');
      }

      completeOnboardingAndEnterMuseum() {
        audio.init();
        audio.playDrum();
        this.closeOnboarding();
        if (window.vtMuseum3D && window.vtMuseum3D.clearMuseumSnapshot) {
          window.vtMuseum3D.clearMuseumSnapshot();
        }
        try { sessionStorage.removeItem('VT_MUSEUM_SNAPSHOT'); } catch(e) {}
        this.switchView('museum', () => {
          if (window.vtMuseum3D) {
            window.vtMuseum3D.navigateToStation('entrance');
          }
        });
      }

      // Quản lý Sổ Tay Khảo Cứu Di Sản (Review Manual - 3 Tabs: Chiếu Thư, Quy Thức, Định Lực)
      openManual(tab = 'letter') {
        audio.init();
        audio.playPaper();
        if (this.dom.heritageManualModal) {
          this.dom.heritageManualModal.classList.remove('hidden');
          this.switchManualTab(tab);
        }
      }

      closeManual() {
        audio.playPaper();
        if (this.dom.heritageManualModal) {
          this.dom.heritageManualModal.classList.add('hidden');
        }
      }

      switchManualTab(tabName = 'letter') {
        audio.playPaper();
        const tabList = [
          { name: 'letter', btn: this.dom.tabBtnManualLetter, pane: this.dom.manualTabContentLetter },
          { name: 'rules', btn: this.dom.tabBtnManualRules, pane: this.dom.manualTabContentRules },
          { name: 'survival', btn: this.dom.tabBtnManualSurvival, pane: this.dom.manualTabContentSurvival }
        ];

        tabList.forEach(t => {
          if (t.btn) t.btn.classList.toggle('active', t.name === tabName);
          if (t.pane) t.pane.classList.toggle('active', t.name === tabName);
        });
      }

      // Thiết lập sự kiện và đồng bộ giao diện cho Bảo Tàng 3D
      bindMuseum3DEvents() {
        if (!window.vtMuseum3D) return;

        // 1. Đồng bộ khi Camera di chuyển tới các trạm hiện vật
        window.vtMuseum3D.onStationChanged = (stationId, wp) => {
          // Highlight nút rail nav
          document.querySelectorAll('.rail-nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.station === stationId);
          });

          // Đồng bộ Hệ thống Dẫn Truyện Ngữ Cảnh (Cinematic Narrator Dialogue)
          if (window.vtMuseumNarrator && typeof window.vtMuseumNarrator.onStationChanged === 'function') {
            window.vtMuseumNarrator.onStationChanged(stationId);
          }

          const card = this.dom.museumInspectionCard;
          if (!card) return;

          if (stationId === 'entrance') {
            card.classList.add('hidden');
            if (this.dom.museumReopenCardBtn) {
              this.dom.museumReopenCardBtn.classList.add('hidden');
            }
          } else {
            const artifactInfo = {
              mask: {
                icon: '🎭',
                title: 'MẶT NẠ TUỒNG TAM DIỆN',
                dynasty: 'CHIẾU TUỒNG ĐẶNG GIA • THẾ KỶ XVIII',
                desc: 'Chiếc mặt nạ gỗ mít bồi giấy bản, phối ba sắc diện biểu trưng lòng trung trinh, nỗi oan khiên và chí khí quật cường của vị tướng soái thời loạn.',
                details: 'Tạo tác từ cốt gỗ mít lõi bền chắc không nứt vỡ, bồi 5 lớp giấy bản giã mịn ngâm phèn đen. Sắc diện sơn son chu sa truyền thống kết hợp nét mực nho than lá dừa. Râu tơ tằm ba chòm đặc trưng lối vẽ mặt kép tuồng cổ Đặng gia thế kỷ XVIII.'
              },
              ceramic: {
                icon: '🏺',
                title: 'BÌNH GỐM MEN RẠN THẾ KỶ XVI',
                dynasty: 'LÒ BẦU BÁT TRÀNG • NGHỆ NHÂN VŨ ĐỖ',
                desc: 'Tác phẩm gốm men rạn đỉnh cao thời Mạc (thế kỷ XVI), kết tinh giữa xương đất sét phù sa sông Hồng và lớp men tro trấu nếp cái hoa vàng.',
                details: 'Cốt gốm sa mốt nung củi gỗ trên 1200°C. Kỹ thuật tạo rạn do độ co ngót chênh lệch giữa xương gốm và men tro vỏ trấu nếp, xoa nước gừng hoặc mực tàu nhuộm nổi rõ lưới rạn mai rùa. Tai quai mây đao mác đắp nổi thủ công trứ danh nghệ nhân Đặng Huyền Thông.'
              },
              flute: {
                icon: '🖼️',
                title: 'TRANH DÂN GIAN NGŨ HỔ',
                dynasty: 'TRANH THỜ HÀNG TRỐNG • NGŨ HỔ',
                desc: 'Bức tranh thờ Ngũ Hổ nổi tiếng của dòng tranh dân gian Hàng Trống (Thăng Long), kết hợp ván khắc nét đen và nghệ thuật dùng cọ vờn cản màu tay uy linh sống động.',
                details: 'Năm vị Thần Hổ trấn giữ ngũ phương: Hoàng Hổ (Thổ - Trung ương) đạp bệ ấn phù chú ở chính giữa, xung quanh là Thanh Hổ (Mộc - Đông), Bạch Hổ (Kim - Tây), Xích Hổ (Hỏa - Nam) và Hắc Hổ (Thủy - Bắc) vờn mây cổ.'
              },
              brush: {
                icon: '🖌️',
                title: 'ÁN THƯ TIỀN NHÂN & NGỌN BÚT LÔNG',
                dynasty: 'ĐIỆN THỜ TIỀN NHÂN • THẾ KỶ XVIII',
                desc: 'Chiếc án thư gỗ mun khảm xà cừ, lưu giữ bút lông đuôi chồn và nghiên mực đá chu sa. Nơi khởi sinh linh khí điểm nhãn mở khóa bí mật ngàn năm.',
                details: 'Bàn án thư gỗ mun đen tuyền thế kỷ XVIII chạm hoa sen. Nghiên mực tạc từ đá núi Yên Tử chứa mực son chu sa không bao giờ đông kết. Ngọn bút lông đuôi chồn cán trúc ngà khâu đồng nạm vàng, bảo vật định hình đại kết cục Vạn Tượng Quy Nhất.'
              }
            };

            let info = { ...artifactInfo[stationId] };
            const solved = this.state.solvedChambers || [];
            const required = ['mask', 'ceramic', 'flute'];
            const solvedCount = required.filter(c => solved.includes(c)).length;
            const isBrushUnlocked = solvedCount === 3;

            if (stationId === 'brush') {
              if (!isBrushUnlocked) {
                info.title = 'HẬU CUNG • ĐIỆN THỜ TIỀN NHÂN [ĐANG PHONG ẤN]';
                info.desc = `Điện Thờ Tiền Nhân được niêm phong bởi cấm chú của Tiền Nhân. Hãy giải mã cả 3 di vật thất truyền ở Tiền Sảnh (Tiến độ: ${solvedCount}/3) để khai mở phong ấn Hậu Cung, bước vào diện kiến Cụ Tổ Nghề Tranh và đón nhận Bút Lông Điểm Nhãn!`;
                if (this.dom.btnEnterRelicWorld) {
                  this.dom.btnEnterRelicWorld.innerHTML = `<span>🔒 PHONG ẤN HẬU CUNG (CẦN GIẢI ${solvedCount}/3)</span>`;
                  this.dom.btnEnterRelicWorld.style.borderColor = 'var(--state-error)';
                  this.dom.btnEnterRelicWorld.style.background = 'rgba(192, 38, 38, 0.25)';
                }
              } else {
                info.title = 'HẬU CUNG • ĐIỆN THỜ TIỀN NHÂN [ĐÃ KHAI MỞ]';
                info.desc = `Ba di vật thất truyền đã tề tựu! Phong ấn Hậu Cung đã khai quang rực rỡ. Hãy bước vào Hậu Cung diện kiến Cụ Tổ Nghề Tranh để tiếp nhận y bát và ngọn Bút Lông Đuôi Chồn!`;
                if (this.dom.btnEnterRelicWorld) {
                  this.dom.btnEnterRelicWorld.innerHTML = `<span>✨ BƯỚC VÀO ĐIỆN THỜ TIỀN NHÂN ➔</span>`;
                  this.dom.btnEnterRelicWorld.style.borderColor = 'var(--accent-imperial-gold)';
                  this.dom.btnEnterRelicWorld.style.background = 'linear-gradient(135deg, rgba(245, 168, 35, 0.35), rgba(168, 28, 34, 0.35))';
                }
              }
            } else {
              if (this.dom.btnEnterRelicWorld) {
                const isPaid = (stationId === 'ceramic' || stationId === 'flute');
                const isUnlocked = this.isArtifactUnlocked(stationId);
                if (isPaid && !isUnlocked) {
                  this.dom.btnEnterRelicWorld.innerHTML = `<span>🔒 BƯỚC VÀO THẾ GIỚI (GÓI MỞ RỘNG)</span>`;
                  this.dom.btnEnterRelicWorld.style.borderColor = 'rgba(245, 168, 35, 0.7)';
                  this.dom.btnEnterRelicWorld.style.background = 'rgba(245, 168, 35, 0.16)';
                } else {
                  this.dom.btnEnterRelicWorld.innerHTML = `<span>BƯỚC VÀO THẾ GIỚI NÀY ➔</span>`;
                  this.dom.btnEnterRelicWorld.style.borderColor = '';
                  this.dom.btnEnterRelicWorld.style.background = '';
                }
              }
            }

            if (info) {
              if (this.dom.inspectArtifactIcon) this.dom.inspectArtifactIcon.textContent = info.icon;
              if (this.dom.inspectArtifactTitle) this.dom.inspectArtifactTitle.textContent = info.title;
              if (this.dom.inspectArtifactDynasty) this.dom.inspectArtifactDynasty.textContent = info.dynasty;
              if (this.dom.inspectArtifactDesc) this.dom.inspectArtifactDesc.textContent = info.desc;
              if (this.dom.inspectArtifactDetails) this.dom.inspectArtifactDetails.textContent = info.details;
              if (this.dom.inspectHotspotBox) this.dom.inspectHotspotBox.classList.add('hidden');
              this.currentRelicStation = stationId;
              card.classList.remove('hidden');
              card.classList.remove('collapsed');
              if (this.dom.museumReopenCardBtn) {
                this.dom.museumReopenCardBtn.classList.add('hidden');
              }
              if (this.dom.toggleCollapseCardBtn) {
                this.dom.toggleCollapseCardBtn.textContent = '⚊';
                this.dom.toggleCollapseCardBtn.title = 'Thu gọn bảng';
              }
            }
          }
        };

        // 1.1 Đồng bộ khi người dùng nhấp vào Điểm Nhãn 3D Hotspot trên hiện vật
        window.vtMuseum3D.onHotspotClicked = (hotspotInfo, stationId) => {
          if (this.dom.inspectHotspotBox && hotspotInfo) {
            this.dom.inspectHotspotBox.classList.remove('hidden');
            if (this.dom.hotspotBoxTitle) this.dom.hotspotBoxTitle.textContent = hotspotInfo.title;
            if (this.dom.hotspotBoxDesc) this.dom.hotspotBoxDesc.textContent = hotspotInfo.desc;
            // Rung nhẹ thẻ giám định để người dùng chú ý
            if (this.dom.museumInspectionCard) {
              this.dom.museumInspectionCard.classList.remove('hidden');
              if (this.dom.museumReopenCardBtn) {
                this.dom.museumReopenCardBtn.classList.add('hidden');
              }
              this.dom.museumInspectionCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        };

        // 2. Nhấn nút trên thanh Rail Navigation & Cuộn mượt thanh trượt
        const railNavEl = document.querySelector('.museum-rail-nav');
        if (railNavEl) {
          railNavEl.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
              e.preventDefault();
              railNavEl.scrollLeft += (e.deltaY > 0 ? 70 : -70);
            }
          }, { passive: false });
        }

        document.querySelectorAll('.rail-nav-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const st = btn.dataset.station;
            if (st && window.vtMuseum3D) {
              window.vtMuseum3D.navigateToStation(st);
            }
            try {
              btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } catch (e) {}
          });
        });

        // 2.9 Thu gọn / Mở rộng thẻ giám định
        if (this.dom.toggleCollapseCardBtn) {
          this.dom.toggleCollapseCardBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.dom.museumInspectionCard) {
              const isCollapsed = this.dom.museumInspectionCard.classList.toggle('collapsed');
              this.dom.toggleCollapseCardBtn.textContent = isCollapsed ? '⛶' : '⚊';
              this.dom.toggleCollapseCardBtn.title = isCollapsed ? 'Mở rộng bảng' : 'Thu gọn bảng';
            }
          });
        }

        const inspectHeader = document.getElementById('inspectionCardHeader');
        if (inspectHeader) {
          inspectHeader.addEventListener('click', () => {
            if (this.dom.museumInspectionCard && this.dom.museumInspectionCard.classList.contains('collapsed')) {
              this.dom.museumInspectionCard.classList.remove('collapsed');
              if (this.dom.toggleCollapseCardBtn) {
                this.dom.toggleCollapseCardBtn.textContent = '⚊';
                this.dom.toggleCollapseCardBtn.title = 'Thu gọn bảng';
              }
            }
          });
        }

        // 3. Đóng thẻ giám định
        if (this.dom.closeInspectionCardBtn) {
          this.dom.closeInspectionCardBtn.addEventListener('click', () => {
            if (this.dom.museumInspectionCard) {
              this.dom.museumInspectionCard.classList.add('hidden');
              if (this.dom.museumReopenCardBtn) {
                this.dom.museumReopenCardBtn.classList.remove('hidden');
              }
            }
          });
        }

        // 3.1 Mở lại thẻ giám định khi đang ở trạm hiện vật
        if (this.dom.museumReopenCardBtn) {
          this.dom.museumReopenCardBtn.addEventListener('click', () => {
            if (this.dom.museumInspectionCard) {
              this.dom.museumInspectionCard.classList.remove('hidden');
              this.dom.museumReopenCardBtn.classList.add('hidden');
            }
          });
        }

        // 4. Trở về tiền sảnh từ thẻ giám định
        if (this.dom.btnReturnEntrance) {
          this.dom.btnReturnEntrance.addEventListener('click', () => {
            if (window.vtMuseum3D) {
              window.vtMuseum3D.navigateToStation('entrance');
            }
            if (this.dom.museumReopenCardBtn) {
              this.dom.museumReopenCardBtn.classList.add('hidden');
            }
          });
        }

        // 4.1. Điều khiển xoay hiện vật 360 độ từ thanh công cụ
        if (this.dom.btnRotateLeft) {
          this.dom.btnRotateLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.vtMuseum3D) {
              window.vtMuseum3D.rotateArtifact(-Math.PI / 4);
            }
          });
        }
        if (this.dom.btnRotateRight) {
          this.dom.btnRotateRight.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.vtMuseum3D) {
              window.vtMuseum3D.rotateArtifact(Math.PI / 4);
            }
          });
        }
        if (this.dom.btnToggleAutoRotate) {
          this.dom.btnToggleAutoRotate.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.vtMuseum3D) {
              const isAuto = window.vtMuseum3D.toggleAutoRotate();
              this.dom.btnToggleAutoRotate.textContent = isAuto ? '⚡ Tự Xoay: BẬT' : '⏸ Tự Xoay: TẮT';
              this.dom.btnToggleAutoRotate.classList.toggle('active', isAuto);
            }
          });
        }
        if (this.dom.btnResetView) {
          this.dom.btnResetView.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.vtMuseum3D) {
              window.vtMuseum3D.resetArtifactView();
              if (this.dom.btnToggleAutoRotate) {
                this.dom.btnToggleAutoRotate.textContent = '⚡ Tự Xoay: BẬT';
                this.dom.btnToggleAutoRotate.classList.add('active');
              }
            }
          });
        }

        // 5. Bước vào thế giới cách điệu của hiện vật (Chamber Storyline)
        if (this.dom.btnEnterRelicWorld) {
          this.dom.btnEnterRelicWorld.addEventListener('click', () => {
            const st = this.currentRelicStation || 'mask';
            const solved = this.state.solvedChambers || [];
            const required = ['mask', 'ceramic', 'flute'];
            const solvedCount = required.filter(c => solved.includes(c)).length;

            if (st === 'brush' && solvedCount < 3) {
              audio.init();
              audio.playDrum();
              this.toast(`🔒 Điện Thờ Tiền Nhân còn phong ấn! Cần giải mã cả 3 di vật ở Tiền Sảnh (${solvedCount}/3) trước khi bước vào Hậu Cung.`);
              return;
            }

            // Kiểm tra phân quyền Gói Mở Rộng:
            const isPaid = (st === 'ceramic' || st === 'flute');
            const isUnlocked = this.isArtifactUnlocked(st);
            if (isPaid && !isUnlocked) {
              audio.init();
              audio.playDrum();
              this.showExpansionPackModal(st);
              return;
            }

            const sceneMap = {
              mask: 'chamber_mask_intro',
              ceramic: 'chamber_ceramic_intro',
              flute: 'chamber_flute_intro',
              brush: 'chamber_brush_intro'
            };
            const targetScene = sceneMap[st] || 'chamber_mask_intro';
            audio.init();

            // Chuyển động GSAP zoom xuyên lồng kính kết hợp chuyển cảnh Bespoke độc bản
            const triggerWorldEntry = () => {
              // Lưu trạng thái quan sát của Bảo Tàng (Persistent Museum Snapshot) trước khi vào thế giới
              if (window.vtMuseum3D && typeof window.vtMuseum3D.saveMuseumSnapshot === 'function') {
                window.vtMuseum3D.saveMuseumSnapshot();
              }
              // Với 3 hiện vật chính (mask, ceramic, flute): Mở thẳng Thế giới Game Pixel 2D đi cảnh ngang!
              if (['mask', 'ceramic', 'flute'].includes(st) && window.vtPixelGame && typeof window.vtPixelGame.openArtifactWorld === 'function') {
                window.vtPixelGame.openArtifactWorld(st);
                return;
              }
              this.switchView('game', () => {
                this.loadScene(targetScene);
              }, 'none');
            };

            const startBespokeTransition = () => {
              if (window.vtStylizedWorld && typeof window.vtStylizedWorld.playBespokeTransition === 'function') {
                window.vtStylizedWorld.playBespokeTransition(st, triggerWorldEntry);
              } else {
                audio.playDrum();
                triggerWorldEntry();
              }
            };

            if (window.vtMuseum3D && typeof window.vtMuseum3D.zoomIntoArtifact === 'function') {
              window.vtMuseum3D.zoomIntoArtifact(st, startBespokeTransition);
            } else {
              startBespokeTransition();
            }
          });
        }

        // Nút quay lại bảo tàng từ Gameplay HUD (Khôi phục nguyên vẹn snapshot và hiệu ứng tan thành mực)
        if (this.dom.hudMuseumBtn) {
          this.dom.hudMuseumBtn.addEventListener('click', () => {
            audio.init();
            audio.playPaper();
            this.toast('🏛️ Quay lại Bảo Tàng 3D • Khôi phục vị trí & góc nhìn cổ vật');
            this.switchView('museum', null, 'dissolve');
          });
        }

        // 6. Trở về Trang Chủ từ Bảo Tàng 3D
        if (this.dom.museumBackHomeBtn) {
          this.dom.museumBackHomeBtn.addEventListener('click', () => {
            audio.playPaper();
            this.switchView('home');
          });
        }

        // 7. Mở Cổ Đồ Vạn Tượng từ Bảo Tàng 3D
        if (this.dom.museumMapBtn) {
          this.dom.museumMapBtn.addEventListener('click', () => {
            this.toggleAncientMap(true);
          });
        }

        // 8. Bật/Tắt âm thanh trong Bảo Tàng 3D
        if (this.dom.museumAudioToggleBtn) {
          this.dom.museumAudioToggleBtn.addEventListener('click', () => {
            const muted = audio.toggleMute();
            this.dom.museumAudioToggleBtn.textContent = muted ? '🔇' : '🔊';
            if (this.dom.soundIcon) this.dom.soundIcon.textContent = muted ? '🔇' : '🔊';
          });
        }

        // Hỗ trợ Kéo & Thả (Drag & Drop) trực tiếp file .GLB vào sảnh bảo tàng cho nhà phát triển
        const processBatchGlbFiles = (fileList) => {
          if (!fileList || !fileList.length || !window.vtMuseum3D) return;
          Array.from(fileList).forEach(file => {
            const name = file.name.toLowerCase();
            let st = null;
            if (name.includes('mask') || name.includes('tuong') || name.includes('thieu')) {
              st = 'mask';
            } else if (name.includes('ceramic') || name.includes('gom') || name.includes('bat_trang')) {
              st = 'ceramic';
            } else if (name.includes('flute') || name.includes('buffalo') || name.includes('trau') || name.includes('dong_ho')) {
              st = 'flute';
            }
            if (st) {
              window.vtMuseum3D.loadGLBFromFile(st, file, () => {
                if (window.audio && typeof window.audio.playBell === 'function') {
                  window.audio.playBell();
                }
              });
            }
          });
        };

        const museumView = document.getElementById('viewMuseum3D');
        if (museumView) {
          museumView.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          });
          museumView.addEventListener('drop', (e) => {
            e.preventDefault();
            const files = e.dataTransfer.files;
            if (files && files.length) {
              processBatchGlbFiles(files);
            }
          });
        }

        // 10. Bộ Điều Khiển Chất Lượng Đồ Họa (Graphics Quality Manager)
        const updateQualityLabels = (mode, tier) => {
          const tierNames = {
            high: 'Cao',
            medium: 'Vừa',
            low: 'Tiết Kiệm'
          };
          const text = mode === 'auto'
            ? `Tự Động (${tierNames[tier] || tier.toUpperCase()})`
            : `Đồ Họa: ${tierNames[tier] || tier}`;
          const mLabel = document.getElementById('museumQualityLabel');
          if (mLabel) mLabel.textContent = text;
          const hLabel = document.getElementById('hudQualityLabel');
          if (hLabel) hLabel.textContent = text;
        };

        if (window.vtMuseum3D) {
          window.vtMuseum3D.onQualityChanged = (mode, tier) => {
            updateQualityLabels(mode, tier);
            if (window.vtStylizedWorld && typeof window.vtStylizedWorld.setGraphicsQuality === 'function') {
              window.vtStylizedWorld.setGraphicsQuality(tier);
            }
          };
          updateQualityLabels(window.vtMuseum3D.graphicsQuality, window.vtMuseum3D.effectiveTier);
        }

        const handleQualityToggle = () => {
          audio.init();
          audio.playPaper();
          if (!window.vtMuseum3D) return;
          const current = window.vtMuseum3D.graphicsQuality || 'medium';
          const cycle = { auto: 'high', high: 'medium', medium: 'low', low: 'auto' };
          const next = cycle[current] || 'medium';
          window.vtMuseum3D.setGraphicsQuality(next);
          const toastTips = {
            auto: '⚡ Đã bật Tự Động điều chỉnh chất lượng theo thiết bị (FPS Adaptive)',
            high: '🌟 Chế độ Đồ Họa Cao: Đầy đủ bóng đổ mượt & hiệu ứng hạt tối đa',
            medium: '⚖️ Chế độ Đồ Họa Vừa: Cân bằng mượt mà cho laptop phổ thông',
            low: '🔋 Chế độ Tiết Kiệm: Tắt bóng đổ, giảm hạt, tối ưu 60 FPS'
          };
          this.toast(toastTips[next] || `Đã chuyển mức đồ họa: ${next}`);
        };

        const mQualityBtn = document.getElementById('museumQualityToggleBtn');
        if (mQualityBtn) mQualityBtn.addEventListener('click', handleQualityToggle);
        const hQualityBtn = document.getElementById('hudQualityBtn');
        if (hQualityBtn) hQualityBtn.addEventListener('click', handleQualityToggle);
      }

      // Hiệu ứng cuộn mượt phát hiện phần tử (Scroll Reveal)
      initScrollReveal() {
        const items = document.querySelectorAll('.reveal-item');
        if (!('IntersectionObserver' in window)) {
          items.forEach(el => el.classList.add('revealed'));
          return;
        }
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        }, { threshold: 0.1 });

        items.forEach(el => observer.observe(el));
      }

      // Khởi tạo Modal Thưởng Lãm 3D 360° Giám Định Cổ Vật Hoàng Gia (Giai đoạn 6)
      initCuratorialModal() {
        const modal = document.getElementById('curatorialInspectionModal');
        if (!modal) return;

        const modalCloseX = document.getElementById('modalCloseX');
        const modalDynastyTag = document.getElementById('modalDynastyTag');
        const modalArtifactName = document.getElementById('modalArtifactName');
        const modalAccessionNo = document.getElementById('modalAccessionNo');
        const modalArtifactVisual = document.getElementById('modalArtifactVisual');
        const modalCuratorialDetails = document.getElementById('modalCuratorialDetails');
        const modalCuratorialBullets = document.getElementById('modalCuratorialBullets');
        const rotationRange = document.getElementById('modalRotationRange');
        const lblAngle = document.getElementById('lblAngle');
        const btnRotateLeft = document.getElementById('modalBtnRotateLeft');
        const btnRotateRight = document.getElementById('modalBtnRotateRight');
        const btnAutoSpin = document.getElementById('modalBtnAutoSpin');
        const modalBtnEnterStation = document.getElementById('modalBtnEnterStation');

        let currentAngle = 0;
        let autoSpinInterval = null;
        let activeKey = 'mask';

        const ARTIFACT_DATA = {
          mask: {
            id: 'mask',
            name: 'MẶT NẠ TUỒNG TAM DIỆN',
            dynasty: 'CHIẾU TUỒNG ĐẶNG GIA • THẾ KỶ XVIII',
            accession: 'VT-MSK-1740',
            desc: 'Cốt gỗ mít bồi giấy bản ngâm phèn đen, phối ba sắc diện sơn son chu sa biểu trưng lòng trung trinh, nỗi oan khiên và chí khí quật cường của vị tướng soái thời loạn.',
            bullets: [
              'Kỹ thuật sơn son then thếp vàng truyền thống thời Hậu Lê.',
              'Ba sắc thái chuyển tiếp: Trung Thần - Kép Hát - Tội Nhân.',
              'Tích hợp cơ chế điểm nhãn tương tác 360 độ trong bảo tàng 3D.'
            ],
            svg: `<svg viewBox="0 0 280 240" width="100%" height="200">
              <circle cx="140" cy="120" r="90" fill="rgba(158,42,43,0.2)"/>
              <path d="M 85 45 C 85 45, 140 18, 195 45 C 220 120, 200 185, 140 215 C 80 185, 60 120, 85 45 Z" fill="#201712" stroke="#D4AF37" stroke-width="2.5"/>
              <path d="M 140 22 C 140 22, 195 45, 195 45 C 220 120, 200 185, 140 215 Z" fill="#9E2A2B" opacity="0.95"/>
              <ellipse cx="115" cy="100" rx="14" ry="7" fill="#0C0A08" stroke="#D4AF37" stroke-width="1.2"/>
              <ellipse cx="165" cy="100" rx="14" ry="7" fill="#0C0A08" stroke="#D4AF37" stroke-width="1.2"/>
              <circle cx="115" cy="100" r="3" fill="#FFF"/>
              <circle cx="165" cy="100" r="3" fill="#FFF"/>
              <path d="M 112 150 Q 140 175 168 150" stroke="#9E2A2B" stroke-width="4.5" stroke-linecap="round" fill="none"/>
            </svg>`
          },
          ceramic: {
            id: 'ceramic',
            name: 'BÌNH GỐM MEN RẠN THỜI MẠC',
            dynasty: 'LÒ BẦU BÁT TRÀNG • NGHỆ NHÂN VŨ ĐỖ',
            accession: 'VT-CER-1580',
            desc: 'Đỉnh cao gốm men rạn thời Mạc kết tinh từ đất phù sa sông Hồng và tro trấu nếp hoa vàng. Tai quai mây đao mác đắp nổi và mạng lưới rạn mai rùa huyền ảo.',
            bullets: [
              'Chế tác bởi dòng họ nghệ nhân Vũ Đỗ niên hiệu Đoan Thái (1586).',
              'Vân rạn men lam độc bản phủ lớp sa mốt bóng nhẹ.',
              'Họa tiết hoa cúc và mây cuộn pháp lam khảm nổi quanh thân bình.'
            ],
            svg: `<svg viewBox="0 0 280 240" width="100%" height="200">
              <circle cx="140" cy="120" r="90" fill="rgba(14,59,94,0.2)"/>
              <path d="M 110 40 L 170 40 L 195 95 Q 220 170 140 205 Q 60 170 85 95 Z" fill="#132338" stroke="#1B4D3E" stroke-width="3"/>
              <ellipse cx="140" cy="40" rx="30" ry="7" fill="#1B4D3E" stroke="#D4AF37" stroke-width="1.5"/>
              <path d="M 90 85 Q 65 105 92 130" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
              <path d="M 190 85 Q 215 105 188 130" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
              <path d="M 115 75 L 140 105 L 130 145 L 160 180" stroke="#D4AF37" stroke-width="1.2" fill="none" opacity="0.85"/>
            </svg>`
          },
          flute: {
            id: 'flute',
            name: 'TRANH DÂN GIAN NGŨ HỔ',
            dynasty: 'TRANH THỜ HÀNG TRỐNG • THĂNG LONG',
            accession: 'VT-PNT-NGUHO',
            desc: 'Bức tranh thờ Ngũ Hổ thuộc dòng tranh dân gian Hàng Trống, khắc họa năm vị thần hổ trấn giữ ngũ phương với kỹ thuật vờn cản màu tay bậc thầy trên giấy dó.',
            bullets: [
              'Hoàng Hổ ngự chính giữa đạp ấn phù chú trấn trạch trung ương.',
              'Tứ phương Thanh - Bạch - Xích - Hắc Hổ tương ứng Ngũ Hành.',
              'Kỹ thuật in nét mộc bản kết hợp cọ mềm cản màu chuyển sắc.'
            ],
            svg: `<img src="assets/van_tuong/folk-art/tranh_ngu_ho_hang_trong.webp" alt="Tranh Ngũ Hổ Hàng Trống" style="display:block;width:100%;height:200px;object-fit:contain;" />`
          }
        };

        const updateVisualAngle = (angle) => {
          currentAngle = angle;
          if (rotationRange) rotationRange.value = angle;
          if (lblAngle) lblAngle.textContent = angle + '°';
          const scaleX = Math.cos((angle * Math.PI) / 180);
          if (modalArtifactVisual) modalArtifactVisual.style.transform = `scaleX(${scaleX})`;
        };

        const openArtifactModal = (key) => {
          activeKey = key || 'mask';
          const data = ARTIFACT_DATA[activeKey] || ARTIFACT_DATA.mask;
          if (modalDynastyTag) modalDynastyTag.textContent = data.dynasty;
          if (modalArtifactName) modalArtifactName.textContent = data.name;
          if (modalAccessionNo) modalAccessionNo.textContent = data.accession;
          if (modalCuratorialDetails) modalCuratorialDetails.textContent = data.desc;
          if (modalArtifactVisual) modalArtifactVisual.innerHTML = data.svg;
          if (modalCuratorialBullets) {
            modalCuratorialBullets.innerHTML = data.bullets.map(b => `<li>${b}</li>`).join('');
          }
          updateVisualAngle(0);

          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
          if (window.audio) {
            window.audio.init();
            window.audio.playPaper();
          }
        };

        const closeModal = () => {
          modal.classList.remove('active');
          document.body.style.overflow = '';
          if (autoSpinInterval) {
            clearInterval(autoSpinInterval);
            autoSpinInterval = null;
            if (btnAutoSpin) btnAutoSpin.textContent = 'TỰ XOAY';
          }
          if (window.audio) window.audio.playPaper();
        };

        document.querySelectorAll('.btn-inspect-360').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const key = btn.getAttribute('data-artifact') || 'mask';
            openArtifactModal(key);
          });
        });

        if (modalCloseX) modalCloseX.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
        });

        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
          }
        });

        if (rotationRange) {
          rotationRange.addEventListener('input', (e) => {
            updateVisualAngle(parseInt(e.target.value, 10));
          });
        }

        if (btnRotateLeft) {
          btnRotateLeft.addEventListener('click', () => {
            let a = (currentAngle - 15 + 360) % 360;
            updateVisualAngle(a);
          });
        }

        if (btnRotateRight) {
          btnRotateRight.addEventListener('click', () => {
            let a = (currentAngle + 15) % 360;
            updateVisualAngle(a);
          });
        }

        if (btnAutoSpin) {
          btnAutoSpin.addEventListener('click', () => {
            if (autoSpinInterval) {
              clearInterval(autoSpinInterval);
              autoSpinInterval = null;
              btnAutoSpin.textContent = 'TỰ XOAY';
            } else {
              btnAutoSpin.textContent = 'TẠM DỪNG';
              autoSpinInterval = setInterval(() => {
                let a = (currentAngle + 3) % 360;
                updateVisualAngle(a);
              }, 30);
            }
          });
        }

        if (modalBtnEnterStation) {
          modalBtnEnterStation.addEventListener('click', () => {
            closeModal();
            this.switchView('museum', () => {
              if (window.vtMuseum3D) {
                window.vtMuseum3D.navigateToStation(activeKey);
              }
            }, 'dissolve');
          });
        }
      }

      initEvents() {
        const unlockAudio = () => {
          audio.init();
          audio.resume();
        };
        ['click', 'touchstart', 'keydown'].forEach(evt => {
          document.addEventListener(evt, unlockAudio, { once: true });
        });
        this.initScrollReveal();
        this.initCuratorialModal();

        // Khởi tạo theo yêu cầu (Lazy Load On-Demand) Bảo Tàng 3D khi người dùng tương tác
        const prepareMuseum3D = () => {
          const container = document.getElementById('museum3DCanvasWrap');
          if (window.vtMuseum3D && container && !window.vtMuseum3D.renderer) {
            window.vtMuseum3D.init(container);
            this.bindMuseum3DEvents();
          }
        };

        // NÚT BẮT ĐẦU HÀNH TRÌNH (Trang chủ hero, Navbar & CTA cuối trang)
        const handleStart = () => {
          if (window.vtMuseum3D && window.vtMuseum3D.clearMuseumSnapshot) {
            window.vtMuseum3D.clearMuseumSnapshot();
          }
          try { sessionStorage.removeItem('VT_MUSEUM_SNAPSHOT'); } catch(e) {}
          prepareMuseum3D();
          this.startJourney();
        };
        if (this.dom.homeStartBtn) this.dom.homeStartBtn.addEventListener('click', handleStart);
        if (this.dom.navStartBtn) this.dom.navStartBtn.addEventListener('click', handleStart);
        if (this.dom.ctaStartBtn) this.dom.ctaStartBtn.addEventListener('click', handleStart);

        // NÚT ĐIỀU HƯỚNG ONBOARDING: THƯ MỜI & LUẬT CHƠI DI SẢN (STITCH PALETTES DMC)
        if (this.dom.btnSkipInvitation) {
          this.dom.btnSkipInvitation.addEventListener('click', () => {
            this.completeOnboardingAndEnterMuseum();
          });
        }
        if (this.dom.btnHomeFromInvitation) {
          this.dom.btnHomeFromInvitation.addEventListener('click', () => {
            this.closeOnboarding();
          });
        }
        if (this.dom.btnHomeFromRules) {
          this.dom.btnHomeFromRules.addEventListener('click', () => {
            this.closeOnboarding();
          });
        }
        if (this.dom.btnSkipRulesToMuseum) {
          this.dom.btnSkipRulesToMuseum.addEventListener('click', () => {
            this.completeOnboardingAndEnterMuseum();
          });
        }
        if (this.dom.waxSealBtn) {
          this.dom.waxSealBtn.addEventListener('click', () => {
            this.proceedFromInvitationToRules();
          });
        }
        if (this.dom.btnProceedToRules) {
          this.dom.btnProceedToRules.addEventListener('click', () => {
            this.proceedFromInvitationToRules();
          });
        }
        if (this.dom.btnBackToInvitation) {
          this.dom.btnBackToInvitation.addEventListener('click', () => {
            this.openOnboarding('invitation');
          });
        }
        if (this.dom.btnEnterMuseumFromRules) {
          this.dom.btnEnterMuseumFromRules.addEventListener('click', () => {
            this.completeOnboardingAndEnterMuseum();
          });
        }
        // ===================================================================
        // SỰ KIỆN MỞ THƯ MỜI & QUY THỨC TỪ CÁC VỊ TRÍ TRÊN GIAO DIỆN
        // ===================================================================
        if (this.dom.navManualBtn) {
          this.dom.navManualBtn.addEventListener('click', () => {
            this.openOnboarding('invitation');
          });
        }
        if (this.dom.navOnboardingBtn) {
          this.dom.navOnboardingBtn.addEventListener('click', () => {
            this.openOnboarding('invitation');
          });
        }
        if (this.dom.museumRulesBtn) {
          this.dom.museumRulesBtn.addEventListener('click', () => {
            this.openRulesReview();
          });
        }
        if (this.dom.openGuideBtn) {
          this.dom.openGuideBtn.addEventListener('click', () => {
            this.openRulesReview();
          });
        }
        // Đóng bảng Quy Thức ở chế độ Xem Lại
        const closeRulesReviewTop = document.getElementById('btnCloseRulesReviewTop');
        if (closeRulesReviewTop) {
          closeRulesReviewTop.addEventListener('click', () => {
            this.closeRulesReview();
          });
        }
        const closeRulesReviewBottom = document.getElementById('btnCloseRulesReviewBottom');
        if (closeRulesReviewBottom) {
          closeRulesReviewBottom.addEventListener('click', () => {
            this.closeRulesReview();
          });
        }
        if (this.dom.viewRules) {
          this.dom.viewRules.addEventListener('click', (e) => {
            if (e.target === this.dom.viewRules && this.dom.viewRules.classList.contains('mode-review')) {
              this.closeRulesReview();
            }
          });
        }
        if (this.dom.homeGuidePopupBtn) {
          this.dom.homeGuidePopupBtn.addEventListener('click', () => {
            this.openOnboarding('invitation');
          });
        }
        if (this.dom.ctaGuideBtn) {
          this.dom.ctaGuideBtn.addEventListener('click', () => {
            this.openOnboarding('rules');
          });
        }
        if (this.dom.navGuideBtn) {
          this.dom.navGuideBtn.addEventListener('click', () => {
            this.openOnboarding('rules');
          });
        }

        // Đóng Sổ Tay Di Sản
        if (this.dom.closeHeritageManualX) {
          this.dom.closeHeritageManualX.addEventListener('click', () => {
            this.closeManual();
          });
        }
        document.querySelectorAll('.close-manual-action').forEach(btn => {
          btn.addEventListener('click', () => {
            this.closeManual();
          });
        });
        if (this.dom.heritageManualModal) {
          this.dom.heritageManualModal.addEventListener('click', (e) => {
            if (e.target === this.dom.heritageManualModal) {
              this.closeManual();
            }
          });
        }

        // Chuyển Tab trong Sổ Tay Di Sản
        if (this.dom.tabBtnManualLetter) {
          this.dom.tabBtnManualLetter.addEventListener('click', () => {
            this.switchManualTab('letter');
          });
        }
        if (this.dom.tabBtnManualRules) {
          this.dom.tabBtnManualRules.addEventListener('click', () => {
            this.switchManualTab('rules');
          });
        }
        if (this.dom.tabBtnManualSurvival) {
          this.dom.tabBtnManualSurvival.addEventListener('click', () => {
            this.switchManualTab('survival');
          });
        }

        // Các nút chuyển Tab điều hướng nhanh bên trong nội dung
        if (this.dom.manualSwitchToRulesBtn) {
          this.dom.manualSwitchToRulesBtn.addEventListener('click', () => {
            this.switchManualTab('rules');
          });
        }
        if (this.dom.manualSwitchToRulesBtn2) {
          this.dom.manualSwitchToRulesBtn2.addEventListener('click', () => {
            this.switchManualTab('rules');
          });
        }
        if (this.dom.manualSwitchToLetterBtn) {
          this.dom.manualSwitchToLetterBtn.addEventListener('click', () => {
            this.switchManualTab('letter');
          });
        }

        // Phím Escape đóng Sổ Tay hoặc bảng Xem Lại Quy Thức
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            if (this.dom.viewRules && this.dom.viewRules.classList.contains('active') && this.dom.viewRules.classList.contains('mode-review')) {
              this.closeRulesReview();
            }
            if (this.dom.heritageManualModal && !this.dom.heritageManualModal.classList.contains('hidden')) {
              this.closeManual();
            }
            if (this.dom.relicsUnlockModal && !this.dom.relicsUnlockModal.classList.contains('hidden')) {
              this.toggleRelicsUnlock(false);
            }
            if (this.dom.ancientMapModal && !this.dom.ancientMapModal.classList.contains('hidden')) {
              this.toggleAncientMap(false);
            }
          }
        });

        // Cuộn mượt khi click các liên kết điều hướng trên trang chủ
        document.querySelectorAll('#viewHome a[href^="#"]').forEach(anchor => {
          anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href').substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              e.preventDefault();
              const container = document.getElementById('viewHome');
              if (container) {
                const targetY = targetEl.offsetTop - 64;
                container.scrollTo({ top: targetY, behavior: 'smooth' });
              }
            }
          });
        });

        // Con dấu trang chủ mở Thư Mời Khảo Cứu Di Sản
        if (this.dom.homeSealBtn) {
          this.dom.homeSealBtn.addEventListener('click', () => {
            audio.init();
            audio.playBell();
            this.openOnboarding('invitation');
          });
        }

        // Nút quay về bảo tàng 3D từ màn chơi 2D có chuyển cảnh êm dịu
        const goHomeConfirm = () => {
          if (confirm('Quay về gian trưng bày bảo tàng 3D? Tiến trình thám hiểm của bạn vẫn được lưu giữ.')) {
            audio.playPaper();
            this.switchView('museum');
          }
        };
        if (this.dom.backHomeBtn) this.dom.backHomeBtn.addEventListener('click', goHomeConfirm);
        if (this.dom.gameSealIcon) this.dom.gameSealIcon.addEventListener('click', goHomeConfirm);

        // Toggle âm thanh
        if (this.dom.soundToggleBtn) {
          this.dom.soundToggleBtn.addEventListener('click', () => {
            audio.init();
            const muted = audio.toggleMute();
            if (this.dom.soundIcon) this.dom.soundIcon.textContent = muted ? '🔇' : '🔊';
            this.toast(muted ? 'Đã tắt âm thanh' : 'Đã bật âm thanh');
          });
        }

        // Modal nhật ký cổ vật
        if (this.dom.journalModalBtn && this.dom.journalModal) {
          this.dom.journalModalBtn.addEventListener('click', () => {
            audio.playPaper();
            this.dom.journalModal.classList.remove('hidden');
          });
        }
        if (this.dom.closeJournalX && this.dom.journalModal) {
          this.dom.closeJournalX.addEventListener('click', () => {
            this.dom.journalModal.classList.add('hidden');
          });
        }
        if (this.dom.journalModal) {
          this.dom.journalModal.addEventListener('click', (e) => {
            if (e.target === this.dom.journalModal) {
              this.dom.journalModal.classList.add('hidden');
            }
          });
        }

        // Tabs trong nhật ký
        const navTabs = this.dom.journalModal.querySelectorAll('.tab-item-nav');
        navTabs.forEach(tab => {
          tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            this.dom.journalModal.querySelectorAll('.tab-view').forEach(v => {
              v.style.display = 'none';
              v.classList.remove('active');
            });
            tab.classList.add('active');
            const target = document.getElementById(tab.getAttribute('data-tab'));
            if (target) {
              target.style.display = 'block';
              target.classList.add('active');
            }
          });
        });

        // ===================================================================
        // SỰ KIỆN CỔ ĐỒ VẠN TƯỢNG & ĐIỂM NHÃN TƯƠNG TÁC
        // ===================================================================
        const handleOpenAncientMap = () => {
          audio.init();
          this.toggleAncientMap(true);
        };
        if (this.dom.ancientMapBtn) {
          this.dom.ancientMapBtn.addEventListener('click', handleOpenAncientMap);
        }
        const navMapBtn = document.getElementById('navMapBtn');
        if (navMapBtn) navMapBtn.addEventListener('click', handleOpenAncientMap);
        const homeMapBtn = document.getElementById('homeMapBtn');
        if (homeMapBtn) homeMapBtn.addEventListener('click', handleOpenAncientMap);
        const featOpenMapBtn = document.getElementById('featOpenMapBtn');
        if (featOpenMapBtn) featOpenMapBtn.addEventListener('click', handleOpenAncientMap);

        if (this.dom.closeAncientMapBtn) {
          this.dom.closeAncientMapBtn.addEventListener('click', () => this.toggleAncientMap(false));
        }
        if (this.dom.ancientMapModal) {
          this.dom.ancientMapModal.addEventListener('click', (e) => {
            if (e.target === this.dom.ancientMapModal) this.toggleAncientMap(false);
          });
        }

        // ===================================================================
        // SỰ KIỆN MÀN HÌNH 3 ĐẠI DI KHÍ (UNLOCK ẢI THEO REF IMAGE4)
        // ===================================================================
        if (this.dom.museumRelicsBtn) {
          this.dom.museumRelicsBtn.addEventListener('click', () => this.toggleRelicsUnlock(true));
        }
        if (this.dom.btnCloseRelicsUnlock) {
          this.dom.btnCloseRelicsUnlock.addEventListener('click', () => this.toggleRelicsUnlock(false));
        }
        if (this.dom.relicsSwitchToMapBtn) {
          this.dom.relicsSwitchToMapBtn.addEventListener('click', () => {
            this.toggleRelicsUnlock(false);
            this.toggleAncientMap(true);
          });
        }
        if (this.dom.mapSwitchToRelicsBtn) {
          this.dom.mapSwitchToRelicsBtn.addEventListener('click', () => {
            this.toggleAncientMap(false);
            this.toggleRelicsUnlock(true);
          });
        }
        if (this.dom.relicsUnlockModal) {
          this.dom.relicsUnlockModal.addEventListener('click', (e) => {
            if (e.target === this.dom.relicsUnlockModal) this.toggleRelicsUnlock(false);
          });
        }

        // Click các nút tương tác trong Thẻ Cổ Vật (VÀO BỆ 3D & KHẢO CỨU ẢI)
        document.querySelectorAll('.btn-relic-teleport').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const station = btn.getAttribute('data-station');
            this.toggleRelicsUnlock(false);
            this.switchView('museum', () => {
              if (window.vtMuseum3D && typeof window.vtMuseum3D.navigateToStation === 'function') {
                window.vtMuseum3D.navigateToStation(station);
              }
            }, 'dissolve');
          });
        });

        document.querySelectorAll('.btn-relic-quest').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const chamber = btn.getAttribute('data-chamber');
            const stationMap = {
              tuong: 'mask',
              'bat-trang': 'ceramic',
              'song-duong': 'flute'
            };
            const targetStation = stationMap[chamber] || 'mask';
            const isPaid = (targetStation === 'ceramic' || targetStation === 'flute');
            const isUnlocked = this.isArtifactUnlocked(targetStation);
            if (isPaid && !isUnlocked) {
              this.toggleRelicsUnlock(false);
              audio.init();
              audio.playDrum();
              this.showExpansionPackModal(targetStation);
              return;
            }
            this.toggleRelicsUnlock(false);
            audio.init();
            audio.playBell();
            if (window.vtPixelGame && typeof window.vtPixelGame.openArtifactWorld === 'function') {
              window.vtPixelGame.openArtifactWorld(targetStation);
            }
          });
        });
        if (this.dom.closeBubbleBtn) {
          this.dom.closeBubbleBtn.addEventListener('click', () => this.resetHotspotFocus());
        }

        // Click các nút địa danh trên Cổ Đồ
        document.querySelectorAll('.map-node').forEach(node => {
          node.addEventListener('click', () => {
            const chamber = node.getAttribute('data-chamber');
            this.handleMapNodeClick(chamber);
          });
        });

        // Click ra ngoài vùng hotspot bubble để thu hồi camera zoom
        const artFrame = document.getElementById('artFrame');
        if (artFrame) {
          artFrame.addEventListener('click', (e) => {
            if (!e.target.closest('.scene-hotspot-pin') && !e.target.closest('#hotspotDialogBubble')) {
              this.resetHotspotFocus();
            }
          });
        }

        // Fallback ảnh lỗi
        this.dom.stageImg.addEventListener('error', () => {
          this.dom.stageImg.style.display = 'none';
          this.dom.proceduralSvg.style.display = 'block';
        });
      }

      /* --- QUẢN LÝ ĐĂNG NHẬP, HỒ SƠ & SUPABASE CLOUD SAVE --- */
      initAuth() {
        if (!window.vtSupabase) return;

        // Mở / Đóng Modal Bảng Mộc Lữ Khách
        const openAuth = () => {
          audio.playPaper();
          this.dom.authModal.classList.remove('hidden');
          this.refreshAuthModalView();
        };
        const closeAuth = () => {
          this.dom.authModal.classList.add('hidden');
        };

        if (this.dom.navAuthBtn) this.dom.navAuthBtn.addEventListener('click', openAuth);
        if (this.dom.hudAuthBtn) this.dom.hudAuthBtn.addEventListener('click', openAuth);
        if (this.dom.closeAuthModalX) this.dom.closeAuthModalX.addEventListener('click', closeAuth);
        if (this.dom.authModal) {
          this.dom.authModal.addEventListener('click', (e) => {
            if (e.target === this.dom.authModal) closeAuth();
          });
        }

        // Chuyển Tabs trong Auth Modal
        const authTabs = document.querySelectorAll('.auth-tab-btn');
        authTabs.forEach(tab => {
          tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-tab-pane').forEach(p => {
              p.style.display = 'none';
              p.classList.remove('active');
            });
            tab.classList.add('active');
            const target = document.getElementById(tab.getAttribute('data-tab'));
            if (target) {
              target.style.display = 'block';
              target.classList.add('active');
            }
          });
        });

        // Chọn Ấn Triện Hộ Thân khi đăng ký
        const sealOptions = document.querySelectorAll('.seal-option-card');
        sealOptions.forEach(opt => {
          opt.addEventListener('click', () => {
            sealOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            audio.playInk();
          });
        });

        // Xử lý Đăng Nhập
        const submitLoginBtn = document.getElementById('submitLoginBtn');
        if (submitLoginBtn) {
          submitLoginBtn.addEventListener('click', async () => {
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const alertEl = document.getElementById('authStatusAlert');

            submitLoginBtn.disabled = true;
            submitLoginBtn.innerHTML = '<span>ĐANG XÁC THỰC MỘC BẢN...</span>';

            const res = await window.vtSupabase.signIn(email, password);
            submitLoginBtn.disabled = false;
            submitLoginBtn.innerHTML = '<span>ĐĂNG NHẬP CÕI MỰC</span><span>➔</span>';

            if (res.success) {
              audio.playBell();
              this.showAuthAlert(alertEl, 'success', `Chào mừng ${res.profile.displayName} đã trở lại Cõi Mực!`);
              setTimeout(() => {
                closeAuth();
                this.toast(`🏮 Kính chào Lữ Khách: ${res.profile.displayName}`);
              }, 700);
            } else {
              this.showAuthAlert(alertEl, 'error', res.message);
            }
          });
        }

        // Xử lý Tài Khoản Demo Nhanh
        const quickDemoBtn = document.getElementById('quickDemoBtn');
        if (quickDemoBtn) {
          quickDemoBtn.addEventListener('click', async () => {
            document.getElementById('loginEmail').value = 'admin@vantuong.vn';
            document.getElementById('loginPassword').value = 'vantuong2026';
            if (submitLoginBtn) submitLoginBtn.click();
          });
        }

        // Xử lý Khai Danh (Đăng Ký)
        const submitRegisterBtn = document.getElementById('submitRegisterBtn');
        if (submitRegisterBtn) {
          submitRegisterBtn.addEventListener('click', async () => {
            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const selectedSealEl = document.querySelector('.seal-option-card.selected');
            const seal = selectedSealEl ? selectedSealEl.getAttribute('data-seal') : '象';
            const alertEl = document.getElementById('authStatusAlert');

            submitRegisterBtn.disabled = true;
            submitRegisterBtn.innerHTML = '<span>ĐANG KHẮC DẤU VÀO CÕI MỰC...</span>';

            const res = await window.vtSupabase.signUp(email, password, name, seal);
            submitRegisterBtn.disabled = false;
            submitRegisterBtn.innerHTML = '<span>KHẮC TÊN LÊN BẢNG MỘC</span><span>✓</span>';

            if (res.success) {
              audio.playDrum();
              this.showAuthAlert(alertEl, 'success', `Khai danh thành công! Ấn triện [${seal}] đã khắc sâu vào thớ giấy.`);
              setTimeout(() => {
                closeAuth();
                this.toast(`🏮 Đã khai danh: ${name} (${seal})`);
              }, 800);
            } else {
              this.showAuthAlert(alertEl, 'error', res.message);
            }
          });
        }

        // Xử lý Chơi Ẩn Danh / Lữ Khách Tự Do
        const submitGuestBtn = document.getElementById('submitGuestBtn');
        if (submitGuestBtn) {
          submitGuestBtn.addEventListener('click', () => {
            const guestNick = document.getElementById('guestNick').value.trim() || 'Lữ Khách Vô Danh';
            window.vtSupabase.playAsGuest(guestNick, '墨');
            audio.playPaper();
            closeAuth();
            this.toast(`🏮 Bắt đầu hành trình với tư cách [${guestNick}]`);
          });
        }

        // Nút Khởi động nhanh Chế độ Khách (Guest Mode) nổi bật trên đầu Modal
        const quickGuestLaunchBtn = document.getElementById('quickGuestLaunchBtn');
        if (quickGuestLaunchBtn) {
          quickGuestLaunchBtn.addEventListener('click', () => {
            window.vtSupabase.playAsGuest('Lữ Khách Tự Do', '墨');
            audio.playPaper();
            closeAuth();
            this.toast('🏮 Đã kích hoạt Chế độ Khách! Bạn có thể khám phá tự do.');
          });
        }

        // Các nút điều khiển trong Modal Gói Mở Rộng
        const closeExpBtn = document.getElementById('closeExpansionModalBtn');
        if (closeExpBtn) {
          closeExpBtn.addEventListener('click', () => {
            const expModal = document.getElementById('expansionPackModal');
            if (expModal) expModal.classList.add('hidden');
          });
        }
        const btnExpPricing = document.getElementById('btnExpModalViewPricing');
        if (btnExpPricing) {
          btnExpPricing.addEventListener('click', () => {
            const expModal = document.getElementById('expansionPackModal');
            if (expModal) expModal.classList.add('hidden');
            this.switchView('home');
            setTimeout(() => {
              const sec = document.getElementById('secExpansionPacks');
              if (sec) sec.scrollIntoView({ behavior: 'smooth' });
            }, 300);
          });
        }
        const btnExpMask = document.getElementById('btnExpModalPlayMask');
        if (btnExpMask) {
          btnExpMask.addEventListener('click', () => {
            const expModal = document.getElementById('expansionPackModal');
            if (expModal) expModal.classList.add('hidden');
            if (window.vtMuseum3D && typeof window.vtMuseum3D.navigateToStation === 'function') {
              window.vtMuseum3D.navigateToStation('mask');
            }
            if (window.vtPixelGame && typeof window.vtPixelGame.openArtifactWorld === 'function') {
              window.vtPixelGame.openArtifactWorld('mask');
            }
          });
        }
        const btnBuyIndiv = document.getElementById('btnBuyIndividualPack');
        if (btnBuyIndiv) {
          btnBuyIndiv.addEventListener('click', () => {
            this.toast('⚡ Chế độ Khảo Thí / Triển Lãm: Toàn bộ thế giới cổ vật và tính năng đã được MỞ KHÓA TRỌN VẸN để Ban Giám Khảo trải nghiệm tự do!');
          });
        }
        const btnBuyCombo = document.getElementById('btnBuyComboPack');
        if (btnBuyCombo) {
          btnBuyCombo.addEventListener('click', () => {
            this.toast('⚡ Chế độ Khảo Thí / Triển Lãm: Toàn bộ thế giới cổ vật và tính năng đã được MỞ KHÓA TRỌN VẸN để Ban Giám Khảo trải nghiệm tự do!');
          });
        }
        const btnTierFree = document.getElementById('btnTierFreeCurrent');
        if (btnTierFree) {
          btnTierFree.addEventListener('click', () => {
            const startBtn = document.getElementById('btnEnterMuseumHero') || document.getElementById('btnEnterMuseumFinal');
            if (startBtn) startBtn.click();
          });
        }

        // Xử lý Cấu hình Supabase
        const saveSupaConfigBtn = document.getElementById('saveSupaConfigBtn');
        if (saveSupaConfigBtn) {
          saveSupaConfigBtn.addEventListener('click', () => {
            const url = document.getElementById('supaUrl').value.trim();
            const key = document.getElementById('supaKey').value.trim();
            window.vtSupabase.saveConfig(url, key);
            audio.playBell();
            this.toast('⚡ Đã cập nhật cổng kết nối Supabase Cloud!');
            this.refreshAuthModalView();
          });
        }

        // Xử lý Đăng Xuất
        const profileSignOutBtn = document.getElementById('profileSignOutBtn');
        if (profileSignOutBtn) {
          profileSignOutBtn.addEventListener('click', async () => {
            await window.vtSupabase.signOut();
            audio.playPaper();
            this.toast('Đã rời khỏi bảng mộc lữ khách');
            this.refreshAuthModalView();
          });
        }

        // Nút Lưu Mây & Tải lại trong modal
        const profileSaveNowBtn = document.getElementById('profileSaveNowBtn');
        if (profileSaveNowBtn) {
          profileSaveNowBtn.addEventListener('click', async () => {
            audio.playBell();
            const res = await window.vtSupabase.saveGameProgress(this.state);
            this.toast(res.cloud ? '☁️ Đã đồng bộ mây Supabase!' : '💾 Đã lưu tiến trình mộc bản!');
          });
        }

        const profileLoadSaveBtn = document.getElementById('profileLoadSaveBtn');
        if (profileLoadSaveBtn) {
          profileLoadSaveBtn.addEventListener('click', async () => {
            const res = await window.vtSupabase.loadGameProgress();
            if (res.success && res.save) {
              audio.playBell();
              this.state.sanity = res.save.sanity;
              this.state.inventory = res.save.inventory || [];
              this.state.clues = res.save.clues || [];
              this.state.solvedChambers = res.save.solvedChambers || [];
              this.state.history = res.save.history || [];
              this.loadScene(res.save.currentScene || 'hub_central');
              closeAuth();
              this.toast('📥 Đã khôi phục thành công tiến trình game!');
            } else {
              this.toast('⚠️ ' + (res.message || 'Không tìm thấy bản lưu nào!'));
            }
          });
        }

        // Nút Lưu Mây trên Game HUD
        if (this.dom.hudCloudSaveBtn) {
          this.dom.hudCloudSaveBtn.addEventListener('click', async () => {
            audio.playBell();
            if (this.dom.hudCloudIcon) this.dom.hudCloudIcon.textContent = '⏳';
            if (this.dom.hudCloudText) this.dom.hudCloudText.textContent = 'Đang lưu...';

            const res = await window.vtSupabase.saveGameProgress(this.state);

            setTimeout(() => {
              if (this.dom.hudCloudIcon) this.dom.hudCloudIcon.textContent = '☁️';
              if (this.dom.hudCloudText) this.dom.hudCloudText.textContent = 'Đã Lưu';
              this.toast(res.cloud ? '☁️ Đã đồng bộ tiến trình lên Supabase Cloud!' : '💾 Đã lưu tiến trình vào thư tịch cục bộ!');
            }, 400);
          });
        }

        // ===================================================================
        // SỰ KIỆN CỔNG NIÊM PHONG (GIỚI HẠN DÙNG THỬ CHO KHÁCH CHƯA ĐĂNG KÝ)
        // ===================================================================
        const closeGateX = document.getElementById('closeTrialGateX');
        if (closeGateX) closeGateX.addEventListener('click', () => this.closeTrialGateModal());
        const gateModal = document.getElementById('trialGateModal');
        if (gateModal) {
          gateModal.addEventListener('click', (e) => {
            if (e.target === gateModal) this.closeTrialGateModal();
          });
        }
        const gateRegisterBtn = document.getElementById('trialGateRegisterBtn');
        if (gateRegisterBtn) {
          gateRegisterBtn.addEventListener('click', () => {
            this.closeTrialGateModal();
            this.openAuthModalWithTab('tabRegister');
          });
        }
        const gateLoginBtn = document.getElementById('trialGateLoginBtn');
        if (gateLoginBtn) {
          gateLoginBtn.addEventListener('click', () => {
            this.closeTrialGateModal();
            this.openAuthModalWithTab('tabLogin');
          });
        }
        const gateDemoBtn = document.getElementById('trialGateDemoBtn');
        if (gateDemoBtn) {
          gateDemoBtn.addEventListener('click', async () => {
            this.closeTrialGateModal();
            await window.vtSupabase.signIn('admin@vantuong.vn', 'vantuong2026');
            this.toast('✨ Kính chào Trưởng Môn! Cổng niêm phong đã được giải khai.');
            this.renderChambers();
          });
        }

        // Lắng nghe sự kiện thay đổi xác thực Supabase
        window.addEventListener('vantuong:auth-change', (e) => {
          this.updateAuthUI(e.detail);
          // Tự động làm mới giao diện 4 cổ vật khi đăng nhập/đăng xuất
          if (this.state.currentScene === 'hub_central') {
            this.renderChambers();
          }
        });

        // Khởi động giao diện Auth ban đầu
        this.updateAuthUI({
          user: window.vtSupabase.currentUser,
          profile: window.vtSupabase.profile,
          isGuest: window.vtSupabase.isGuest,
          isConnected: window.vtSupabase.isConnected
        });
      }

      // Kiểm tra quyền mở khóa cổ vật (Chế độ Trình Diễn / Khảo Thí: Mở toàn bộ trải nghiệm cho Ban Giám Khảo)
      isArtifactUnlocked(artifactKey) {
        return true;
      }

      // Mở modal thông báo Gói Mở Rộng khi người dùng bấm vào ải bị khóa
      showExpansionPackModal(stationId) {
        const names = {
          ceramic: 'Bình Gốm Men Rạn Bát Tràng (Ải II)',
          flute: 'Tranh Dân Gian Ngũ Hổ Hàng Trống (Ải III)',
          brush: 'Điện Thờ Tiền Nhân (Hậu Cung)'
        };
        const name = names[stationId] || 'Cổ Vật Này';
        const modal = document.getElementById('expansionPackModal');
        const title = document.getElementById('expansionModalTitle');
        const desc = document.getElementById('expansionModalDesc');
        if (title) title.textContent = `Thế Giới ${name} Thuộc Gói Mở Rộng`;
        if (desc) {
          desc.innerHTML = `Bạn đang trải nghiệm <strong>Bản Dùng Thử miễn phí</strong>. Bản này cho phép bạn tham quan toàn bộ bảo tàng 3D và bước vào thế giới Mặt Nạ (<strong>HỌA DIỆN</strong>).<br><br>Để bước vào thế giới của <strong>${name}</strong>, vui lòng chọn mở khóa Gói Lẻ hoặc Gói Trọn Bộ bên dưới:`;
        }
        if (modal) modal.classList.remove('hidden');
      }

      // Kiểm tra người chơi đã đăng ký chính thức hay chưa
      isUserRegistered() {
        return !!(window.vtSupabase && (window.vtSupabase.currentUser || window.vtSupabase.isGuest));
      }

      // Mở Auth Modal với tab cụ thể (tabLogin, tabRegister, v.v.)
      openAuthModalWithTab(tabId) {
        const modal = this.dom.authModal || document.getElementById('authModal');
        if (!modal) return;
        modal.classList.remove('hidden');
        this.refreshAuthModalView();
        const tabBtn = document.querySelector(`.auth-tab-btn[data-tab="${tabId}"]`);
        if (tabBtn) tabBtn.click();
      }

      // Mở Popup Cổng Niêm Phong khi chưa đăng ký (Vô hiệu hóa theo yêu cầu)
      showTrialGateModal() {
        return;
      }

      // Đóng Popup Cổng Niêm Phong
      closeTrialGateModal() {
        const gate = document.getElementById('trialGateModal');
        if (gate) gate.classList.add('hidden');
      }

      showAuthAlert(el, type, msg) {
        if (!el) return;
        el.className = `auth-status-alert ${type}`;
        el.innerHTML = `<span>${type === 'success' ? '✓' : '⚠️'}</span> <span>${msg}</span>`;
      }

      refreshAuthModalView() {
        const supa = window.vtSupabase;
        const alertEl = document.getElementById('authStatusAlert');
        if (alertEl) alertEl.className = 'auth-status-alert';

        const supaUrl = document.getElementById('supaUrl');
        const supaKey = document.getElementById('supaKey');
        if (supaUrl && supa) supaUrl.value = supa.url || '';
        if (supaKey && supa && supa.anonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_offline_fallback') {
          supaKey.value = supa.anonKey || '';
        }

        const tabsBar = document.querySelector('.auth-tabs-bar');
        const profilePane = document.getElementById('tabUserProfile');
        const loginPane = document.getElementById('tabLogin');

        if (supa && (supa.currentUser || supa.profile)) {
          // Người dùng đã đăng nhập hoặc chơi ẩn danh
          if (tabsBar) tabsBar.style.display = 'none';
          document.querySelectorAll('.auth-tab-pane').forEach(p => p.style.display = 'none');
          if (profilePane) {
            profilePane.style.display = 'block';
            profilePane.classList.add('active');

            const pName = document.getElementById('profileDisplayName');
            const pSeal = document.getElementById('profileSealLarge');
            const pTitle = document.getElementById('profileUserTitle');
            const pEmail = document.getElementById('profileEmailTag');

            if (pName) pName.textContent = supa.profile ? supa.profile.displayName : 'Lữ Khách';
            if (pSeal) pSeal.textContent = supa.profile ? supa.profile.seal : '象';
            if (pTitle) pTitle.textContent = supa.profile ? (supa.profile.title || 'Lữ Khách Cõi Mực') : '';
            if (pEmail) pEmail.textContent = supa.currentUser && supa.currentUser.email ? supa.currentUser.email : (supa.isGuest ? 'Chế độ: Lữ Khách Tự Do (Offline & Cloud Sync)' : '');
          }
        } else {
          // Chưa đăng nhập
          if (tabsBar) tabsBar.style.display = 'grid';
          document.querySelectorAll('.auth-tab-pane').forEach(p => p.style.display = 'none');
          if (loginPane) {
            loginPane.style.display = 'block';
            loginPane.classList.add('active');
          }
          document.querySelectorAll('.auth-tab-btn').forEach((b, idx) => {
            if (idx === 0) b.classList.add('active');
            else b.classList.remove('active');
          });
        }
      }

      updateAuthUI(data) {
        const { user, profile, isGuest, isConnected } = data;
        const navSeal = this.dom.navAuthSeal;
        const navLabel = this.dom.navAuthLabel;
        const navDot = this.dom.navCloudDot;
        const hudSeal = this.dom.hudAuthSeal;
        const hudName = this.dom.hudAuthName;

        if (profile) {
          if (navSeal) navSeal.textContent = profile.seal || '象';
          if (navLabel) navLabel.textContent = profile.displayName || 'Lữ Khách';
          if (hudSeal) hudSeal.textContent = profile.seal || '象';
          if (hudName) hudName.textContent = profile.displayName || 'Lữ Khách';
        } else {
          if (navSeal) navSeal.textContent = '🏮';
          if (navLabel) navLabel.textContent = 'Đăng Nhập';
          if (hudSeal) hudSeal.textContent = '象';
          if (hudName) hudName.textContent = 'Lữ Khách';
        }

        if (navDot) {
          if (isConnected) {
            navDot.className = 'nav-cloud-dot';
            navDot.title = 'Supabase Cloud: Đã kết nối trực tiếp';
          } else {
            navDot.className = 'nav-cloud-dot offline';
            navDot.title = 'Mộc Bản Cục Bộ: Sẵn sàng đồng bộ mây';
          }
        }
      }

      loadScene(sceneId) {
        if (sceneId === 'home_screen') {
          this.switchView('home');
          return;
        }

        if (sceneId === 'chamber_mask_intro' && window.vtPixelGame && typeof window.vtPixelGame.openArtifactWorld === 'function') {
          window.vtPixelGame.openArtifactWorld('mask');
          return;
        }

        // Khi người chơi trở về sảnh trung tâm Vạn Tượng, chuyển cảnh đưa thẳng về Bảo Tàng 3D
        if (sceneId === 'hub_central') {
          this.state.currentScene = 'hub_central';
          if (window.vtSupabase) {
            window.vtSupabase.saveGameProgress(this.state);
          }
          if (window.vtMuseum3D) {
            window.vtMuseum3D.savedSnapshot = null;
          }
          this.toast('🏛️ Trở về Sảnh Trung Tâm Vạn Tượng • Bảo Tàng 3D');
          this.switchView('museum', () => {
            if (window.vtMuseum3D) {
              window.vtMuseum3D.navigateToStation('entrance');
            }
          }, 'dissolve');
          return;
        }

        const sc = GAME_DATA.scenes[sceneId];
        if (!sc) return;

        // Kích hoạt transition mờ dần & trượt êm ái cho màn tranh & đoạn văn
        const artFrame = document.getElementById('artFrame');
        if (artFrame) {
          artFrame.classList.remove('stage-fade-active');
          void artFrame.offsetWidth;
          artFrame.classList.add('stage-fade-active');
        }
        if (this.dom.storyContent) {
          this.dom.storyContent.classList.remove('stage-fade-active');
          void this.dom.storyContent.offsetWidth;
          this.dom.storyContent.classList.add('stage-fade-active');
        }

        this.state.currentScene = sceneId;
        this.state.history.push(sc.location || 'Triển Lãm Vạn Tượng');

        // Thêm Cổ Vật
        if (sc.addArtifact && !this.state.inventory.includes(sc.addArtifact)) {
          this.state.inventory.push(sc.addArtifact);
          const art = GAME_DATA.artifacts[sc.addArtifact];
          if (art) this.toast(`Thu thập di vật: ${art.name}`);
        }

        // Thêm Manh Mối
        if (sc.addClue && !this.state.clues.includes(sc.addClue)) {
          this.state.clues.push(sc.addClue);
          this.toast(`Manh mối mới: ${sc.addClue.substring(0, 32)}...`);
        }

        // Đánh dấu hoàn thành màn
        if (sc.solveChamber && !this.state.solvedChambers.includes(sc.solveChamber)) {
          this.state.solvedChambers.push(sc.solveChamber);
        }

        // Hiệu ứng rung màn hình
        if (sc.fx === 'shake') {
          document.body.classList.remove('camera-shake');
          void document.body.offsetWidth;
          document.body.classList.add('camera-shake');
          setTimeout(() => document.body.classList.remove('camera-shake'), 650);
          audio.playDrum();
        }

        this.renderStageArt(sc);

        // Metadata
        this.dom.locationTag.textContent = sc.location || 'VẠN TƯỢNG';
        this.dom.dateTag.textContent = sc.date || 'HÀ NỘI';
        this.dom.stageQuote.textContent = sc.quote || '';
        this.dom.phaseTag.textContent = sc.phase || 'VẠN TƯỢNG';

        // Nội dung văn học
        this.dom.storyContent.innerHTML = sc.text;
        this.dom.narrativeStage.scrollTop = 0;

        // Nếu là Sảnh Trung Tâm -> hiện 4 cổng màn chơi
        if (sc.isHub) {
          this.renderChambers();
        } else {
          this.dom.chamberGridContainer.style.display = 'none';
          this.renderChoices(sc.choices);
          // Vẽ các điểm nhãn tương tác trực tiếp trên khung cảnh (Spatial Hotspots)
          this.renderSceneHotspots(sc.hotspots);
        }

        this.updateHUD();
        this.updateJournal();
        this.updateMapProgress();

        // Tự động lưu tiến trình game lên Supabase mây & bản mộc cục bộ
        if (window.vtSupabase) {
          window.vtSupabase.saveGameProgress(this.state);
        }
      }

      renderStageArt(sc) {
        // Tích hợp Động Cơ Thế Giới Khám Phá Cách Điệu 60 FPS (Giai Đoạn 3)
        const artFrame = document.getElementById('artFrame');
        if (window.vtStylizedWorld && artFrame) {
          window.vtStylizedWorld.mount(artFrame);

          let worldKey = null;
          if (sc.svgType === 'mask' || (sc.id && sc.id.includes('mask'))) {
            worldKey = 'tuong';
          } else if (sc.svgType === 'ceramic' || (sc.id && sc.id.includes('ceramic'))) {
            worldKey = 'ceramic';
          } else if (sc.svgType === 'flute' || (sc.id && sc.id.includes('flute'))) {
            worldKey = 'flute';
          } else if (sc.svgType === 'brush' || (sc.id && sc.id.includes('brush'))) {
            worldKey = 'brush';
          }

          if (worldKey) {
            window.vtStylizedWorld.setWorld(worldKey);
            this.dom.stageImg.style.display = 'none';
            this.dom.proceduralSvg.style.display = 'none';
            return;
          } else {
            window.vtStylizedWorld.setWorld(null);
          }
        }

        this.dom.stageImg.style.display = 'block';
        this.dom.proceduralSvg.style.display = 'none';
        this.dom.stageImg.src = sc.image;

        // SVG nghệ thuật thuần Việt dự phòng
        const svg = this.dom.proceduralSvg;
        let svgContent = '';
        if (sc.svgType === 'mask') {
          svgContent = `
            <rect width="600" height="400" fill="#24160d"/>
            <rect x="25" y="20" width="550" height="360" rx="8" fill="#1c130d" stroke="#d4af37" stroke-width="3"/>
            <rect x="35" y="30" width="530" height="340" rx="6" fill="none" stroke="rgba(212,175,55,0.3)" stroke-width="1"/>
            <!-- Triện son cổ -->
            <rect x="490" y="45" width="55" height="55" fill="#a81c22" rx="4"/>
            <rect x="495" y="50" width="45" height="45" fill="none" stroke="#fcd55c" stroke-width="2"/>
            <text x="517" y="78" fill="#fcd55c" font-size="16" font-weight="bold" text-anchor="middle" font-family="serif">TUỒNG</text>
            <text x="300" y="55" fill="#d4af37" font-size="14" font-weight="bold" text-anchor="middle" font-family="serif" letter-spacing="2">CHIẾU TUỒNG CỔ ĐẶNG GIA</text>
            <!-- Mặt nạ Tam Diện -->
            <circle cx="300" cy="185" r="105" fill="#a81c22" opacity="0.22"/>
            <path d="M 230 135 Q 300 95 370 135 Q 385 265 300 295 Q 215 265 230 135 Z" fill="#c7ba9d" stroke="#d4af37" stroke-width="3.5"/>
            <!-- Mày tuồng & Mắt xếch -->
            <path d="M 245 150 Q 275 130 290 155" stroke="#1a120b" stroke-width="5" fill="none"/>
            <path d="M 355 150 Q 325 130 310 155" stroke="#1a120b" stroke-width="5" fill="none"/>
            <circle cx="270" cy="172" r="12" fill="#040608"/>
            <circle cx="330" cy="172" r="12" fill="#040608"/>
            <circle cx="273" cy="170" r="4" fill="#ffffff"/>
            <circle cx="333" cy="170" r="4" fill="#ffffff"/>
            <!-- Miệng son tuồng cổ -->
            <path d="M 255 235 Q 300 270 345 235" stroke="#a81c22" stroke-width="7" fill="none"/>
            <path d="M 290 200 L 300 220 L 310 200" stroke="#8a2a1f" stroke-width="3" fill="none"/>
          `;
        } else if (sc.svgType === 'ceramic') {
          svgContent = `
            <rect width="600" height="400" fill="#24160d"/>
            <rect x="25" y="20" width="550" height="360" rx="8" fill="#131d1b" stroke="#1abc9c" stroke-width="3"/>
            <rect x="35" y="30" width="530" height="340" rx="6" fill="none" stroke="rgba(26,188,156,0.3)" stroke-width="1"/>
            <!-- Triện son cổ -->
            <rect x="490" y="45" width="55" height="55" fill="#a81c22" rx="4"/>
            <rect x="495" y="50" width="45" height="45" fill="none" stroke="#fcd55c" stroke-width="2"/>
            <text x="517" y="78" fill="#fcd55c" font-size="15" font-weight="bold" text-anchor="middle" font-family="serif">GỐM</text>
            <text x="300" y="55" fill="#1abc9c" font-size="14" font-weight="bold" text-anchor="middle" font-family="serif" letter-spacing="2">LÒ BẦU BÁT TRÀNG • THẾ KỶ XVI</text>
            <!-- Dáng Bình Men Rạn Vũ Đỗ -->
            <path d="M 265 95 L 335 95 L 365 170 Q 395 265 300 305 Q 205 265 235 170 Z" fill="#1b2a47" stroke="#1abc9c" stroke-width="4"/>
            <!-- Vân rạn nứt tro trấu -->
            <path d="M 265 130 L 295 165 L 285 210 L 320 250" stroke="#d4af37" stroke-width="1.8" fill="none" opacity="0.85"/>
            <path d="M 335 140 L 315 185 L 330 230" stroke="#d4af37" stroke-width="1.8" fill="none" opacity="0.85"/>
            <circle cx="300" cy="205" r="42" fill="none" stroke="#1abc9c" stroke-dasharray="6,4" stroke-width="2.5"/>
          `;
        } else if (sc.svgType === 'flute') {
          svgContent = `
            <rect width="600" height="400" fill="#24160d"/>
            <rect x="25" y="20" width="550" height="360" rx="8" fill="#121b14" stroke="#2ecc71" stroke-width="3"/>
            <rect x="35" y="30" width="530" height="340" rx="6" fill="none" stroke="rgba(46,204,113,0.3)" stroke-width="1"/>
            <!-- Triện son cổ -->
            <rect x="490" y="45" width="55" height="55" fill="#a81c22" rx="4"/>
            <rect x="495" y="50" width="45" height="45" fill="none" stroke="#fcd55c" stroke-width="2"/>
            <text x="517" y="78" fill="#fcd55c" font-size="15" font-weight="bold" text-anchor="middle" font-family="serif">TIÊU</text>
            <text x="300" y="55" fill="#2ecc71" font-size="14" font-weight="bold" text-anchor="middle" font-family="serif" letter-spacing="2">TIÊU TRÚC ĐỒNG DAO KINH BẮC</text>
            <!-- Sóng nước sông Đuống -->
            <path d="M 35 285 Q 160 250 300 280 T 565 265 L 565 370 L 35 370 Z" fill="#0b170e" opacity="0.8"/>
            <!-- Ống tiêu trúc vàng -->
            <path d="M 180 195 L 420 160" stroke="#d4af37" stroke-width="14" stroke-linecap="round"/>
            <circle cx="230" cy="188" r="5" fill="#09100a"/>
            <circle cx="270" cy="182" r="5" fill="#09100a"/>
            <circle cx="310" cy="176" r="5" fill="#09100a"/>
            <circle cx="350" cy="170" r="5" fill="#09100a"/>
            <circle cx="390" cy="164" r="5" fill="#09100a"/>
          `;
        } else if (sc.svgType === 'brush') {
          svgContent = `
            <rect width="600" height="400" fill="#24160d"/>
            <rect x="25" y="20" width="550" height="360" rx="8" fill="#1f1214" stroke="#a81c22" stroke-width="3"/>
            <rect x="35" y="30" width="530" height="340" rx="6" fill="none" stroke="rgba(168,28,34,0.3)" stroke-width="1"/>
            <!-- Triện son cổ -->
            <rect x="490" y="45" width="55" height="55" fill="#a81c22" rx="4"/>
            <rect x="495" y="50" width="45" height="45" fill="none" stroke="#fcd55c" stroke-width="2"/>
            <text x="517" y="78" fill="#fcd55c" font-size="15" font-weight="bold" text-anchor="middle" font-family="serif">BÚT</text>
            <text x="300" y="55" fill="#a81c22" font-size="14" font-weight="bold" text-anchor="middle" font-family="serif" letter-spacing="2">ĐIỆN THỜ TIỀN NHÂN • NGHIÊN CHU SA</text>
            <!-- Nghiên mực đá & Thỏi mực -->
            <rect x="210" y="235" width="180" height="65" rx="8" fill="#181419" stroke="#d4af37" stroke-width="2"/>
            <circle cx="300" cy="267" r="22" fill="#a81c22"/>
            <!-- Thân bút lông & Ngòi lông chồn -->
            <path d="M 288 75 L 312 75 L 306 225 L 294 225 Z" fill="#d5c8b0" stroke="#a38965" stroke-width="1"/>
            <path d="M 294 225 L 306 225 L 300 260 Z" fill="#a81c22"/>
          `;
        } else if (sc.svgType === 'distortion') {
          svgContent = `
            <rect width="600" height="400" fill="#24160d"/>
            <!-- Nền giấy Dó sờn nếp gấp mộc bản -->
            <rect x="25" y="20" width="550" height="360" rx="8" fill="#e8d8be" stroke="#d4af37" stroke-width="4"/>
            <!-- Sóng mực đen cuộn trào -->
            <path d="M 25 290 Q 160 190 290 270 T 575 230 L 575 380 L 25 380 Z" fill="#140d07" opacity="0.95"/>
            <path d="M 25 320 Q 200 230 380 300 T 575 270 L 575 380 L 25 380 Z" fill="#a81c22" opacity="0.55"/>
            <!-- Hình tượng nhân vật tranh dân gian biến ảo -->
            <circle cx="300" cy="155" r="42" fill="#f4ebd9" stroke="#140d07" stroke-width="3"/>
            <path d="M 286 146 Q 291 139 296 146" stroke="#140d07" stroke-width="3" fill="none"/>
            <path d="M 304 146 Q 309 139 314 146" stroke="#140d07" stroke-width="3" fill="none"/>
            <path d="M 284 170 Q 300 195 316 168" stroke="#a81c22" stroke-width="4" fill="none"/>
            <!-- Áo tứ thân thời Trần - Lê -->
            <path d="M 258 197 Q 300 185 342 197 L 360 295 L 240 295 Z" fill="#a03424" stroke="#d4af37" stroke-width="2"/>
            <!-- Ấn triện son Vạn Tượng -->
            <rect x="495" y="45" width="55" height="55" fill="#a81c22" rx="4"/>
            <rect x="500" y="50" width="45" height="45" fill="none" stroke="#fcd55c" stroke-width="2"/>
            <text x="522" y="78" fill="#fcd55c" font-size="16" font-weight="bold" text-anchor="middle" font-family="serif">VẠN</text>
            <text x="280" y="52" fill="#d4af37" font-size="14" font-weight="bold" text-anchor="middle" font-family="serif" letter-spacing="2">CÕI MỰC THỦY BA BIẾN ẢO</text>
          `;
        } else {
          svgContent = `
            <rect width="600" height="400" fill="#24160d"/>
            <rect x="140" y="65" width="320" height="240" fill="#efe5ce" stroke="#d4af37" stroke-width="6"/>
            <text x="300" y="175" fill="#a81c22" font-size="24" font-weight="bold" text-anchor="middle" font-family="serif">VẠN TƯỢNG</text>
            <text x="300" y="215" fill="#7a5933" font-size="13" text-anchor="middle" font-family="serif">Tác phẩm trung tâm • Đang niêm phong</text>
          `;
        }
        svg.innerHTML = svgContent;
      }

      renderChambers() {
        this.dom.choiceContainer.innerHTML = '';
        this.dom.chamberGridContainer.style.display = 'block';

        const isReg = this.isUserRegistered();

        const artifacts = [
          {
            key: 'mask',
            index: 0,
            angle: -36,
            title: 'MẶT NẠ TUỒNG TAM DIỆN',
            chamberTag: 'Màn 1 • Án Tích Tuồng Cổ',
            lore: 'Tạc từ rễ mít già trăm tuổi. Ba khuôn mặt chồng lấn mang ba thế kỷ oan khiên của Tiết độ sứ Đặng Vũ Khiêm.',
            icon: '🎭',
            scene: 'chamber_mask_intro',
            themeSound: 'mask',
            freeTrial: true,
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
            caption: '“Ba trăm năm hận thù rỉ máu nơi chiếu tuồng cổ...”',
            hotspots: [
              {
                id: 'hub_mask_pin',
                icon: '💬',
                label: 'Tiết Độ Sứ Đặng Vũ Khiêm',
                dynasty: 'Thời Lê Trung Hưng',
                dynastyClass: 'tran',
                x: 50,
                y: 44,
                dialogue: 'Mặt nạ rễ mít già tỏa sắc son chu sa ma quái. Tiết độ sứ Đặng Vũ Khiêm cất tiếng rền vang: “Ngươi có dám gánh vác rửa sạch oan khiên ba thế kỷ?”',
                actions: [
                  { text: 'Bước vào Cõi Tuồng Cổ Đặng Gia ➔', next: 'chamber_mask_intro', sound: 'tuong' }
                ]
              }
            ]
          },
          {
            key: 'ceramic',
            index: 1,
            angle: -12,
            title: 'BÌNH GỐM MEN RẠN BÁT TRÀNG',
            chamberTag: 'Màn 2 • Mật Thất Gốm Cổ',
            lore: 'Bình gốm men ngọc nung bằng tro trấu nếp cái hoa vàng hòa phù sa sông Hồng. Hoa văn rạn nứt ẩn giấu cơ quan bí mật.',
            icon: '🏺',
            scene: 'chamber_ceramic_intro',
            themeSound: 'ceramic',
            freeTrial: true,
            image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80',
            caption: '“Đất sét sông Hồng nung trong ngọn lửa ngàn độ...”',
            hotspots: [
              {
                id: 'hub_ceramic_pin',
                icon: '💬',
                label: 'Nghệ Nhân Vũ Đỗ',
                dynasty: 'Thời Mạc • XVI',
                dynastyClass: 'le-mac',
                x: 50,
                y: 44,
                dialogue: 'Bình men rạn Bát Tràng cựa mình lách tách trong biển lửa ngàn ba trăm độ: “Hãy hòa hợp Đất - Nước - Tro - Lửa để cứu lấy tinh hoa làng gốm!”',
                actions: [
                  { text: 'Bước vào Lò Bầu Bát Tràng Thế Kỷ XVI ➔', next: 'chamber_ceramic_intro', sound: 'ceramic' }
                ]
              }
            ]
          },
          {
            key: 'flute',
            index: 2,
            angle: 12,
            title: 'TRANH DÂN GIAN NGŨ HỔ',
            chamberTag: 'Màn 3 • Ngũ Hổ Hàng Trống',
            lore: 'Ngũ Hổ Hàng Trống — tranh thờ với năm sắc màu tượng trưng ngũ hành, in nét mộc bản kết hợp tô màu bằng tay.',
            icon: '🖼️',
            scene: 'chamber_flute_intro',
            themeSound: 'flute',
            freeTrial: true,
            image: 'assets/van_tuong/folk-art/tranh_ngu_ho_hang_trong.webp',
            caption: '“Năm sắc màu, năm phương trời, một dấu tích còn vang vọng...”',
            hotspots: [
              {
                id: 'hub_flute_pin',
                icon: '💬',
                label: 'Tranh Ngũ Hổ Hàng Trống',
                dynasty: 'Tranh Đông Hồ',
                dynastyClass: 'ly',
                x: 50,
                y: 44,
                dialogue: 'Bức tranh Ngũ Hổ rung nhẹ, năm sắc màu dường như đang kể một câu chuyện còn bỏ ngỏ...',
                actions: [
                  { text: 'Bước vào Thế Giới Tranh Ngũ Hổ ➔', next: 'chamber_flute_intro', sound: 'flute' }
                ]
              }
            ]
          },
          {
            key: 'brush',
            index: 3,
            angle: 36,
            title: 'BÚT LÔNG & MỰC CHU SA',
            chamberTag: 'Màn 4 • Điện Thờ Tiền Nhân',
            lore: 'Ngọn bút lông đuôi chồn và thỏi chu sa cổ của Cụ Tổ nghề vẽ. Chứa đựng bí pháp điểm nhãn họa đồ và đại nghĩa truyền đời.',
            icon: '🖌️',
            scene: 'chamber_brush_intro',
            themeSound: 'brush',
            freeTrial: true,
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
            caption: '“Bút lông điểm nhãn, khai mở cõi hư vô...”',
            hotspots: [
              {
                id: 'hub_brush_pin',
                icon: '💬',
                label: 'Cụ Tổ Nghề Tranh',
                dynasty: 'Cội Nguồn Nét Bút',
                dynastyClass: 'ly',
                x: 50,
                y: 44,
                dialogue: 'Cụ già râu tóc bạc phơ dừng ngọn bút lông ngước nhìn bạn: “Người cầm bút không phải để mưu lợi, mà là để giữ hồn thiêng non sông!”',
                actions: [
                  { text: 'Bước vào Gian Điện Thờ Tiền Nhân ➔', next: 'chamber_brush_intro', sound: 'brush' }
                ]
              }
            ]
          }
        ];

        let selectedIdx = 0;

        let html = `
          <div class="chamber-3d-experience">
            <div class="chamber-3d-header">
              <h3>🏮 GIAN PHÒNG 3D • 4 CỔ VẬT THẤT TRUYỀN</h3>
              <p>Rê chuột để nghiêng góc nhìn 3D không gian mật thất. Chọn bệ cổ vật để lắng nghe thanh âm cổ linh & mở mật thất!</p>
            </div>

            <!-- Viewport 3D perspective -->
            <div id="chamber3dViewport" class="chamber-3d-viewport">
              <div id="chamber3dScene" class="chamber-3d-scene">
                <!-- Sàn gạch đá 3D -->
                <div class="chamber-3d-floor"></div>

                <!-- Vách thờ gỗ mộc 3D -->
                <div class="chamber-3d-backwall">
                  <span class="backwall-shrine-text">萬 象 歸 一</span>
                  <div class="chamber-3d-lantern l-left">🏮</div>
                  <div class="chamber-3d-lantern l-right">🏮</div>
                </div>

                <!-- 4 Bệ cổ vật 3D trên vòng cung -->
        `;

        artifacts.forEach((art, idx) => {
          const isDone = this.state.solvedChambers.includes(art.key);
          let badgeText = '✦ CHẠM ĐỂ GIÁM ĐỊNH';
          let badgeClass = '';
          if (isDone) {
            badgeText = '✓ ĐÃ GIẢI MÃ';
            badgeClass = 'completed';
          }

          html += `
            <div class="pedestal-3d-station ${idx === 0 ? 'active-focused' : ''}" data-index="${idx}" data-key="${art.key}">
              <!-- Cổ vật lơ lửng 3D -->
              <div class="pedestal-relic-floating">
                <span>${art.icon}</span>
                <div class="pedestal-relic-halo"></div>
              </div>

              <!-- Chân bệ mộc lim 3D -->
              <div class="pedestal-plinth-3d">
                <span class="pedestal-plinth-title">${art.title}</span>
              </div>

              <!-- Huy hiệu trạng thái -->
              <div class="pedestal-badge-3d ${badgeClass}">${badgeText}</div>
            </div>
          `;
        });

        html += `
              </div>
            </div>

            <!-- Thanh điều hướng xoay phòng 3D -->
            <div class="chamber-3d-controls">
              <button id="camPrevBtn" class="chamber-3d-btn">❮ BẢO VẬT TRƯỚC</button>
              <div class="chamber-3d-dots">
                <div class="chamber-3d-dot active" data-index="0"></div>
                <div class="chamber-3d-dot" data-index="1"></div>
                <div class="chamber-3d-dot" data-index="2"></div>
                <div class="chamber-3d-dot" data-index="3"></div>
              </div>
              <button id="camNextBtn" class="chamber-3d-btn">BẢO VẬT TIẾP ❯</button>
            </div>

            <!-- Bảng giám định cổ vật được chọn -->
            <div id="chamber3dInspection" class="chamber-3d-inspection"></div>
          </div>
        `;

        // Hoàn thành cả 4 màn -> Mở cổng Bức Tranh Trung Tâm
        const allDone = artifacts.every(c => this.state.solvedChambers.includes(c.key));
        if (allDone) {
          html += `
            <div style="margin-top:1.4rem; padding-top:1.4rem; border-top:1.5px dashed var(--gold-bright);">
              <button id="finalBossBtn" class="chamber-portal-card" style="border-color:var(--vermilion-glow); background:linear-gradient(135deg, rgba(192,57,43,0.35), rgba(40,20,15,0.95)); padding:1.4rem; width:100%; cursor:pointer;">
                <span class="icon-seal" style="font-size:2.8rem;">🌟</span>
                <div class="card-text">
                  <h4 style="color:var(--vermilion-glow); font-size:1.2rem;">ĐẠI KHẮC ĐỊNH ĐOẠT: BƯỚC VÀO BỨC TRANH TRUNG TÂM</h4>
                  <p style="color:var(--paper-cream);">Bạn đã quy tụ đủ 4 cổ vật và 4 manh mối. Bức tranh khổng lồ đang thức giấc và réo gọi tên bạn!</p>
                </div>
              </button>
            </div>
          `;
        } else {
          html += `
            <div style="text-align:center; margin-top:1rem; padding:0.8rem; background:rgba(0,0,0,0.35); border-radius:6px; border:1px solid var(--border-bronze);">
              <span style="color:var(--gold-bright); font-weight:700;">Tiến độ giải mã di vật:</span>
              <span style="color:var(--paper-cream); margin-left:0.4rem;">${this.state.solvedChambers.length} / 4 Cổ Vật</span>
              <span style="color:var(--paper-dim); font-size:0.85rem; display:block; margin-top:0.2rem; font-style:italic;">(Cần thu thập đủ 4 cổ vật để mở cánh cổng Bức Tranh Trung Tâm)</span>
            </div>
          `;
        }

        this.dom.chamberGridContainer.innerHTML = html;

        // References
        const viewport = document.getElementById('chamber3dViewport');
        const scene = document.getElementById('chamber3dScene');
        const stations = this.dom.chamberGridContainer.querySelectorAll('.pedestal-3d-station');
        const dots = this.dom.chamberGridContainer.querySelectorAll('.chamber-3d-dot');
        const prevBtn = document.getElementById('camPrevBtn');
        const nextBtn = document.getElementById('camNextBtn');
        const inspectionContainer = document.getElementById('chamber3dInspection');

        let currentTiltX = 0;
        let currentTiltY = 0;

        // Hàm cập nhật camera 3D tập trung vào bệ cổ vật
        const focusArtifact = (index, playSound = true) => {
          selectedIdx = index;
          const art = artifacts[index];
          if (!art) return;

          // 1. Âm thanh tương ứng
          if (playSound) {
            if (art.themeSound === 'mask') audio.playMaskTheme();
            else if (art.themeSound === 'ceramic') audio.playCeramicTheme();
            else if (art.themeSound === 'flute') audio.playFluteTheme();
            else if (art.themeSound === 'brush') audio.playBrushTheme();
            else audio.playBell();
          }

          // 2. Xoay góc máy 3D Camera trực diện bệ
          if (scene) {
            const rotY = -art.angle;
            scene.style.transform = `translateZ(-90px) rotateY(${rotY + currentTiltX}deg) rotateX(${currentTiltY}deg)`;
          }

          // 3. Highlight station và dot
          stations.forEach((st, i) => {
            if (i === index) st.classList.add('active-focused');
            else st.classList.remove('active-focused');
          });
          dots.forEach((dot, i) => {
            if (i === index) dot.classList.add('active');
            else dot.classList.remove('active');
          });

          // 4. Cập nhật Visual Stage bên trái
          this.dom.stageImg.src = art.image;
          this.dom.stageQuote.textContent = art.caption;
          this.dom.locationTag.textContent = art.title;
          this.dom.dateTag.textContent = art.chamberTag;
          this.renderSceneHotspots(art.hotspots || []);

          // 5. Cập nhật Bảng giám định & nút dấn thân
          if (inspectionContainer) {
            const isDone = this.state.solvedChambers.includes(art.key);

            inspectionContainer.innerHTML = `
              <h4>
                <span>${art.icon}</span>
                <span>GIÁM ĐỊNH BẢO VẬT: ${art.title}</span>
              </h4>
              <div class="inspection-chapter-tag">${art.chamberTag}</div>
              <div class="inspection-lore">${art.lore}</div>
              <button id="enter3dChamberBtn" class="enter-3d-chamber-btn">
                <span>${isDone ? 'TIẾP TỤC KHÁM PHÁ MẬT THẤT NÀY' : 'DẤN THÂN VÀO MẬT THẤT NÀY'}</span>
                <span>➔</span>
              </button>
            `;

            const enterBtn = document.getElementById('enter3dChamberBtn');
            if (enterBtn) {
              enterBtn.addEventListener('click', () => {
                // HIỆU ỨNG 3D ZOOM DIVE-IN VÀ CHUYỂN CẢNH MỰC TÀU THE BOAT
                if (scene) {
                  scene.classList.add('zoom-dive-active');
                }
                audio.playDrum();

                this.transitionWithTheBoatInk(() => {
                  this.loadScene(art.scene);
                });
              });
            }
          }
        };

        // Click trên từng bệ 3D
        stations.forEach((st, idx) => {
          st.addEventListener('click', () => focusArtifact(idx, true));
        });

        // Click trên các nút điều hướng
        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            const newIdx = (selectedIdx - 1 + artifacts.length) % artifacts.length;
            focusArtifact(newIdx, true);
          });
        }
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            const newIdx = (selectedIdx + 1) % artifacts.length;
            focusArtifact(newIdx, true);
          });
        }
        dots.forEach((dot, idx) => {
          dot.addEventListener('click', () => focusArtifact(idx, true));
        });

        // TƯƠNG TÁC 3D PARALLAX THEO CHUỘT (Mouse Parallax)
        if (viewport) {
          viewport.addEventListener('mousemove', (e) => {
            const rect = viewport.getBoundingClientRect();
            const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
            const yNorm = (e.clientY - rect.top) / rect.height - 0.5;

            currentTiltX = xNorm * 12; // -6deg -> +6deg
            currentTiltY = -yNorm * 7; // -3.5deg -> +3.5deg

            if (scene && !scene.classList.contains('zoom-dive-active')) {
              const currentArt = artifacts[selectedIdx];
              const baseAngle = currentArt ? -currentArt.angle : 0;
              scene.style.transform = `translateZ(-90px) rotateY(${baseAngle + currentTiltX}deg) rotateX(${currentTiltY}deg)`;
            }
          }, { passive: true });

          viewport.addEventListener('mouseleave', () => {
            currentTiltX = 0;
            currentTiltY = 0;
            if (scene && !scene.classList.contains('zoom-dive-active')) {
              const currentArt = artifacts[selectedIdx];
              const baseAngle = currentArt ? -currentArt.angle : 0;
              scene.style.transform = `translateZ(-90px) rotateY(${baseAngle}deg) rotateX(0deg)`;
            }
          });
        }

        // Khởi tạo focus bệ đầu tiên
        focusArtifact(0, false);

        // Nút Trùm cuối (nếu có)
        const finalBtn = document.getElementById('finalBossBtn');
        if (finalBtn) {
          finalBtn.addEventListener('click', () => {
            audio.playDrum();
            this.transitionWithTheBoatInk(() => {
              this.loadScene('chamber_final_boss');
            });
          });
        }
      }

      renderChoices(choices) {
        this.dom.choiceContainer.innerHTML = '';
        if (!choices || choices.length === 0) return;

        choices.forEach(ch => {
          const btn = document.createElement('button');
          btn.className = 'choice-branch-btn';
          btn.innerHTML = `<span>${ch.text}</span>`;

          btn.addEventListener('click', () => {
            if (ch.sound === 'drum') audio.playDrum();
            else if (ch.sound === 'bell') audio.playBell();
            else if (ch.sound === 'paper') audio.playPaper();
            else audio.playInk();

            if (ch.sanityEffect) {
              this.alterSanity(ch.sanityEffect);
            }

            // Nếu người chơi chọn quay về Sảnh Trung Tâm Vạn Tượng, chuyển cảnh trực tiếp về Bảo Tàng 3D
            if (ch.next === 'hub_central') {
              this.state.currentScene = 'hub_central';
              if (window.vtSupabase) {
                window.vtSupabase.saveGameProgress(this.state);
              }
              if (window.vtMuseum3D) {
                window.vtMuseum3D.savedSnapshot = null;
              }
              this.toast('🏛️ Trở về Sảnh Trung Tâm Vạn Tượng • Bảo Tàng 3D');
              this.switchView('museum', () => {
                if (window.vtMuseum3D) {
                  window.vtMuseum3D.navigateToStation('entrance');
                }
              }, 'dissolve');
              return;
            }

            // Chuyển cảnh với hiệu ứng mực tàu The Boat
            this.transitionWithTheBoatInk(() => {
              this.loadScene(ch.next);
            });
          });

          this.dom.choiceContainer.appendChild(btn);
        });
      }

      alterSanity(val) {
        this.state.sanity = Math.max(0, Math.min(100, this.state.sanity + val));
        this.updateHUD();
        if (val < 0) this.toast(`Định lực giảm ${Math.abs(val)}%!`);
        else if (val > 0) this.toast(`Định lực hồi phục +${val}%!`);

        if (this.state.sanity <= 0 && this.state.currentScene !== 'ending_ink_trap') {
          setTimeout(() => {
            this.toast('Định lực cạn kiệt! Bạn bị mực nuốt chửng vĩnh viễn!');
            this.loadScene('ending_ink_trap');
          }, 450);
        }
      }

      updateHUD() {
        this.dom.sanityValue.textContent = `${this.state.sanity}%`;
        this.dom.sanityBar.style.width = `${this.state.sanity}%`;

        if (this.state.sanity <= 25) {
          this.dom.sanityBar.style.background = 'var(--state-error)';
        } else if (this.state.sanity <= 55) {
          this.dom.sanityBar.style.background = 'linear-gradient(90deg, var(--state-error), var(--state-warning))';
        } else {
          this.dom.sanityBar.style.background = 'linear-gradient(90deg, var(--accent-cinnabar), var(--accent-imperial-gold))';
        }

        const totalItems = this.state.inventory.length + this.state.clues.length;
        this.dom.journalCount.textContent = totalItems;
        this.dom.countArtifacts.textContent = this.state.inventory.length;
        this.dom.countClues.textContent = this.state.clues.length;
      }

      updateJournal() {
        if (this.state.inventory.length === 0) {
          this.dom.artifactGrid.innerHTML = '<p style="color:var(--paper-dim); font-style:italic; text-align:center; grid-column:1/-1;">Chưa thu thập được cổ vật nào...</p>';
        } else {
          this.dom.artifactGrid.innerHTML = this.state.inventory.map(item => {
            const a = typeof item === 'string' ? GAME_DATA.artifacts[item] : (item && item.name ? item : (item && item.id ? GAME_DATA.artifacts[item.id] : null));
            if (!a) return '';
            return `
              <div class="inv-item-card">
                <div class="inv-item-header">
                  <span class="inv-item-icon">${a.icon || '🏺'}</span>
                  <span class="inv-item-name">${a.name}</span>
                </div>
                <p class="inv-item-desc">${a.desc || ''}</p>
              </div>
            `;
          }).join('');
        }

        if (this.state.clues.length === 0) {
          this.dom.clueList.innerHTML = '<li style="color:var(--paper-dim); font-style:italic;">Chưa có manh mối nào được ghi nhận...</li>';
        } else {
          this.dom.clueList.innerHTML = this.state.clues.map(c => `
            <li style="background:rgba(26,32,48,0.7); border-left:3px solid var(--gold-bright); padding:0.8rem 1rem; border-radius:0 4px 4px 0; font-size:0.92rem;">🔍 ${c}</li>
          `).join('');
        }

        this.dom.historyLog.innerHTML = this.state.history.map((h, i) => `
          <div><strong>#${i + 1}:</strong> ${h}</div>
        `).join('');
      }

      toast(msg) {
        const t = this.dom.gameToast;
        t.textContent = msg;
        t.classList.remove('hidden');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
      }

      // ===================================================================
      // MÀN HÌNH 3 ĐẠI DI KHÍ (UNLOCK ẢI THEO REF IMAGE4 VỚI BẢNG MÀU DMC)
      // ===================================================================
      toggleRelicsUnlock(show) {
        if (!this.dom.relicsUnlockModal) return;
        if (show) {
          audio.init();
          audio.playPaper();
          audio.playBell();
          if (this.dom.ancientMapModal) this.dom.ancientMapModal.classList.add('hidden');
          this.dom.relicsUnlockModal.classList.remove('hidden');
          this.updateRelicsProgress();
        } else {
          audio.playPaper();
          this.dom.relicsUnlockModal.classList.add('hidden');
        }
      }

      updateRelicsProgress() {
        const solved = this.state.solvedChambers || [];
        const required = ['mask', 'ceramic', 'flute'];
        const solvedCount = required.filter(c => solved.includes(c) || solved.includes(c === 'mask' ? 'tuong' : (c === 'ceramic' ? 'bat-trang' : 'song-duong'))).length;
        if (this.dom.relicsCollectedCount) {
          this.dom.relicsCollectedCount.textContent = `Tiến độ khảo cứu: ${solvedCount} / 3 Di Vật`;
        }

        // Cập nhật trạng thái từng card
        const maskCard = document.querySelector('.relic-showcase-card[data-station="mask"]');
        const ceramicCard = document.querySelector('.relic-showcase-card[data-station="ceramic"]');
        const fluteCard = document.querySelector('.relic-showcase-card[data-station="flute"]');

        const isMaskSolved = solved.includes('mask') || solved.includes('tuong');
        const isCeramicSolved = solved.includes('ceramic') || solved.includes('bat-trang');
        const isFluteSolved = solved.includes('flute') || solved.includes('song-duong');

        if (maskCard) maskCard.classList.toggle('unlocked-solved', isMaskSolved);
        if (ceramicCard) ceramicCard.classList.toggle('unlocked-solved', isCeramicSolved);
        if (fluteCard) fluteCard.classList.toggle('unlocked-solved', isFluteSolved);
      }

      // ===================================================================
      // HỆ THỐNG CỔ ĐỒ VẠN TƯỢNG (INTERACTIVE ANCIENT QUEST MAP & ATLAS)
      // ===================================================================
      toggleAncientMap(show) {
        if (!this.dom.ancientMapModal) return;
        if (show) {
          audio.init();
          audio.playPaper();
          audio.playBell();
          this.dom.ancientMapModal.classList.remove('hidden');
          this.updateMapProgress();
        } else {
          audio.playPaper();
          this.dom.ancientMapModal.classList.add('hidden');
        }
      }

      updateMapProgress() {
        const solved = this.state.solvedChambers || [];
        const solvedCount = solved.length;

        if (this.dom.mapProgressBadge) {
          this.dom.mapProgressBadge.textContent = `${solvedCount}/4`;
        }
        if (this.dom.mapProgressCount) {
          this.dom.mapProgressCount.textContent = `${solvedCount} / 4`;
        }

        // Cập nhật thẻ di vật trong banner
        const maskBadge = document.getElementById('mapBadgeMask');
        const vaseBadge = document.getElementById('mapBadgeVase');
        const fluteBadge = document.getElementById('mapBadgeFlute');
        const brushBadge = document.getElementById('mapBadgeBrush');

        const isMaskSolved = solved.includes('mask') || solved.includes('tuong');
        const isCeramicSolved = solved.includes('ceramic') || solved.includes('bat-trang');
        const isFluteSolved = solved.includes('flute') || solved.includes('song-duong');
        const isBrushSolved = solved.includes('brush') || solved.includes('dien-tho');

        if (maskBadge) maskBadge.classList.toggle('solved', isMaskSolved);
        if (vaseBadge) vaseBadge.classList.toggle('solved', isCeramicSolved);
        if (fluteBadge) fluteBadge.classList.toggle('solved', isFluteSolved);
        if (brushBadge) brushBadge.classList.toggle('solved', isBrushSolved);

        // Cập nhật đường nét mực chu sa SVG
        const rTlMask = document.getElementById('routeTlToMask');
        const rTlFlute = document.getElementById('routeTlToFlute');
        const rMaskVase = document.getElementById('routeMaskToVase');
        const rFluteBrush = document.getElementById('routeFluteToBrush');
        const rVaseCenter = document.getElementById('routeVaseToCenter');
        const rBrushCenter = document.getElementById('routeBrushToCenter');

        if (rTlMask) rTlMask.classList.toggle('unlocked', isMaskSolved);
        if (rTlFlute) rTlFlute.classList.toggle('unlocked', isFluteSolved);
        if (rMaskVase) rMaskVase.classList.toggle('unlocked', isCeramicSolved);
        if (rFluteBrush) rFluteBrush.classList.toggle('unlocked', isBrushSolved);
        if (rVaseCenter) rVaseCenter.classList.toggle('unlocked', solvedCount >= 4);
        if (rBrushCenter) rBrushCenter.classList.toggle('unlocked', solvedCount >= 4);

        // Cập nhật trạng thái các nút địa danh trên bản đồ
        const nodeTL = document.getElementById('mapNodeTL');
        const nodeMask = document.getElementById('mapNodeMask');
        const nodeVase = document.getElementById('mapNodeVase');
        const nodeFlute = document.getElementById('mapNodeFlute');
        const nodeBrush = document.getElementById('mapNodeBrush');
        const nodeCenter = document.getElementById('mapNodeCenter');

        if (nodeMask) nodeMask.classList.toggle('solved', isMaskSolved);
        if (nodeVase) nodeVase.classList.toggle('solved', isCeramicSolved);
        if (nodeFlute) nodeFlute.classList.toggle('solved', isFluteSolved);
        if (nodeBrush) nodeBrush.classList.toggle('solved', isBrushSolved);
        if (nodeCenter) nodeCenter.classList.toggle('solved', solvedCount >= 4);
      }

      handleMapNodeClick(chamberKey) {
        audio.init();
        const solved = this.state.solvedChambers || [];

        const navigateToScene = (sceneId) => {
          this.toggleAncientMap(false);
          if (!this.dom.viewGame.classList.contains('active')) {
            this.switchView('game', () => {
              this.loadScene(sceneId);
            });
          } else {
            this.transitionWithTheBoatInk(() => {
              this.loadScene(sceneId);
            });
          }
        };

        if (chamberKey === 'prologue') {
          navigateToScene('hub_central');
          return;
        }

        if (chamberKey === 'tuong') {
          this.toggleAncientMap(false);
          if (window.vtPixelGame && typeof window.vtPixelGame.openArtifactWorld === 'function') {
            window.vtPixelGame.openArtifactWorld('mask');
          } else {
            navigateToScene('chamber_mask_intro');
          }
          return;
        }

        if (chamberKey === 'bat-trang') {
          this.toggleAncientMap(false);
          if (window.vtPixelGame && typeof window.vtPixelGame.openArtifactWorld === 'function') {
            window.vtPixelGame.openArtifactWorld('ceramic');
          } else {
            navigateToScene('chamber_ceramic_intro');
          }
          return;
        }

        if (chamberKey === 'song-duong') {
          this.toggleAncientMap(false);
          if (window.vtPixelGame && typeof window.vtPixelGame.openArtifactWorld === 'function') {
            window.vtPixelGame.openArtifactWorld('flute');
          } else {
            navigateToScene('chamber_flute_intro');
          }
          return;
        }

        if (chamberKey === 'dien-tho') {
          navigateToScene('chamber_brush_intro');
          return;
        }

        if (chamberKey === 'final') {
          if (solved.length < 4) {
            audio.playDrum();
            this.toast('🔒 Bức Tranh Trung Tâm còn phong ấn! Cần thu thập đủ 4 di vật.');
            return;
          }
          navigateToScene('chamber_final_boss');
        }
      }

      // ===================================================================
      // HỆ THỐNG ĐIỂM NHÃN TƯƠNG TÁC BỐI CẢNH (SPATIAL SCENE HOTSPOTS)
      // Phong cách tiểu thuyết tương tác đồ họa lịch sử (Attentat 1942 / The Boat)
      // ===================================================================
      renderSceneHotspots(hotspots) {
        if (!this.dom.sceneHotspotLayer) return;
        this.dom.sceneHotspotLayer.innerHTML = '';
        this.resetHotspotFocus();

        if (!hotspots || hotspots.length === 0) return;

        hotspots.forEach(hp => {
          const pin = document.createElement('div');
          pin.className = 'scene-hotspot-pin';
          pin.style.left = `${hp.x}%`;
          pin.style.top = `${hp.y}%`;
          pin.innerHTML = `
            <div class="hotspot-pin-circle">
              <span class="pin-icon">${hp.icon || '💬'}</span>
            </div>
            <span class="hotspot-pin-name">${hp.label}</span>
          `;

          pin.addEventListener('click', (e) => {
            e.stopPropagation();
            this.focusHotspot(hp, pin);
          });

          this.dom.sceneHotspotLayer.appendChild(pin);
        });
      }

      focusHotspot(hp, pinEl) {
        audio.init();
        audio.playPaper();

        // Đánh dấu pin active
        document.querySelectorAll('.scene-hotspot-pin').forEach(p => p.classList.remove('active-pin'));
        if (pinEl) pinEl.classList.add('active-pin');

        // Hiệu ứng Zoom Camera vào tọa độ tương tác
        const artFrame = document.getElementById('artFrame');
        if (artFrame) {
          artFrame.style.transformOrigin = `${hp.x}% ${hp.y}%`;
          artFrame.classList.add('focus-hotspot-active');
        }

        // Đổ dữ liệu vào Hộp Thoại Thư Pháp Khám Phá
        if (this.dom.bubbleIcon) this.dom.bubbleIcon.textContent = hp.icon || '💬';
        if (this.dom.bubbleName) this.dom.bubbleName.textContent = hp.label;
        if (this.dom.bubbleDynastyTag) {
          this.dom.bubbleDynastyTag.textContent = hp.dynasty || 'Cổ Thư';
          this.dom.bubbleDynastyTag.className = `dynasty-badge ${hp.dynastyClass || 'ly'}`;
        }
        if (this.dom.bubbleContent) {
          this.dom.bubbleContent.innerHTML = hp.dialogue;
        }

        // Tạo các nút hành động tiếp nối
        if (this.dom.bubbleActions) {
          this.dom.bubbleActions.innerHTML = '';
          if (hp.actions && hp.actions.length > 0) {
            hp.actions.forEach((act, idx) => {
              const actBtn = document.createElement('button');
              actBtn.className = `bubble-act-btn ${idx === 0 ? 'primary' : ''}`;
              actBtn.innerHTML = `<span>${act.text}</span><span>➔</span>`;

              actBtn.addEventListener('click', () => {
                if (act.sound === 'drum') audio.playDrum();
                else if (act.sound === 'bell') audio.playBell();
                else if (act.sound === 'paper') audio.playPaper();
                else if (act.sound === 'tuong') audio.playTuongTheme();
                else if (act.sound === 'ceramic') audio.playCeramicTheme();
                else if (act.sound === 'flute') audio.playFluteTheme();
                else if (act.sound === 'brush') audio.playBrushTheme();
                else audio.playInk();

                if (act.sanityEffect) {
                  this.alterSanity(act.sanityEffect);
                }

                this.resetHotspotFocus();
                if (act.next === 'hub_central') {
                  this.state.currentScene = 'hub_central';
                  if (window.vtSupabase) {
                    window.vtSupabase.saveGameProgress(this.state);
                  }
                  if (window.vtMuseum3D) {
                    window.vtMuseum3D.savedSnapshot = null;
                  }
                  this.toast('🏛️ Trở về Sảnh Trung Tâm Vạn Tượng • Bảo Tàng 3D');
                  this.switchView('museum', () => {
                    if (window.vtMuseum3D) {
                      window.vtMuseum3D.navigateToStation('entrance');
                    }
                  }, 'dissolve');
                  return;
                }
                this.transitionWithTheBoatInk(() => {
                  this.loadScene(act.next);
                });
              });

              this.dom.bubbleActions.appendChild(actBtn);
            });
          }
        }

        // Hiện hộp thoại
        if (this.dom.hotspotDialogBubble) {
          this.dom.hotspotDialogBubble.classList.remove('hidden');
        }
      }

      resetHotspotFocus() {
        const artFrame = document.getElementById('artFrame');
        if (artFrame) {
          artFrame.classList.remove('focus-hotspot-active');
        }
        if (this.dom.hotspotDialogBubble) {
          this.dom.hotspotDialogBubble.classList.add('hidden');
        }
        document.querySelectorAll('.scene-hotspot-pin').forEach(p => p.classList.remove('active-pin'));
      }

      resetGame() {
        this.state = {
          sanity: 100,
          currentScene: 'prologue_context1',
          inventory: [],
          clues: [],
          solvedChambers: [],
          history: []
        };
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      window.app = new GameApp();
      window.vanTuongGame = window.app;
      window.game = window.app;
    });
