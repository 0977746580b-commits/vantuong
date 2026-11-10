/**
 * VẠN TƯỢNG - STYLIZED 3D LIVING WORLDS ENGINE (GIAI ĐOẠN 3)
 * Động cơ đồ họa 3D cách điệu Three.js kết hợp mỹ thuật tranh dân gian Việt Nam,
 * chất liệu giấy Dó, mực tàu, tro than, vảy điệp và quầng nhiệt đối lưu.
 *
 * Ba Thế Giới Độc Bản & Án Thư Tiền Nhân:
 * 1. Cõi Tuồng Cổ Đặng Gia (Màn 1) - Sân khấu tuồng, mặt nạ Tam Diện khổng lồ nửa son nửa mực
 * 2. Lò Bầu Bát Tràng Thế Kỷ XVI (Màn 2) - Vòm cuốn gạch sa mốt, bình men rạn phát quang ngọc lam
 * 3. Vực Thẳm Mục Đồng Kinh Bắc (Màn 3) - Sông Đuống sóng mực dập dềnh, trâu mộng & sóng âm tiêu trúc
 * 4. Điện Thờ Tiền Nhân & Án Thư (Màn 4) - Bàn án thư gỗ mun, ngọn bút lông đuôi chồn lơ lửng tỏa hào quang
 *
 * Kèm Hệ Thống Chuyển Cảnh Riêng Biệt (Bespoke Transitions Pipeline) & Bảo Lưu 100% Game State.
 */

class StylizedWorldEngine {
  constructor() {
    this.container = null;
    this.renderer = null;
    this.camera = null;

    // Kiến trúc Single Active World: Chỉ lưu duy nhất 1 thế giới 3D đang hiển thị
    this.activeScene = null;
    this.activeWorldKey = null;
    this.currentWorld = null;
    this.animId = null;
    this.time = 0;

    // Chuột tạo chiều sâu 3D Parallax Tilt
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Bộ lắng nghe sự kiện để gỡ bỏ triệt để chống Memory Leak
    this.boundResizeHandler = null;
    this.boundMouseMoveHandler = null;
    this.boundMouseLeaveHandler = null;

    // Đối tượng động cập nhật theo khung hình (Breathing, Particles, Waves, Rotations)
    this.updaters = [];

    // Lớp phủ giấy Dó 2D trên bề mặt 3D
    this.overlayCanvas = null;
    this.overlayCtx = null;
    this.doPaperPattern = null;

    // Lớp overlay chuyển cảnh bespoke
    this.transitionOverlay = null;
    this.initTransitionOverlay();

    // Quản lý cấp độ đồ họa & hiệu năng
    this.effectiveTier = 'medium';
    this.graphicsQuality = 'medium';
    this.isFallbackMode = false;
  }

  getTierConfig(tier = this.effectiveTier) {
    const configs = {
      high: { maxDpr: 1.5, shadowMap: true, softShadow: true, particleScale: 1.0 },
      medium: { maxDpr: 1.25, shadowMap: true, softShadow: false, particleScale: 0.55 },
      low: { maxDpr: 1.0, shadowMap: false, softShadow: false, particleScale: 0.25 }
    };
    return configs[tier] || configs.medium;
  }

  getParticleCount(baseCount) {
    const cfg = this.getTierConfig();
    return Math.max(30, Math.round(baseCount * cfg.particleScale));
  }

  setGraphicsQuality(tier) {
    if (['high', 'medium', 'low'].includes(tier)) {
      this.effectiveTier = tier;
      this.graphicsQuality = tier;
      const cfg = this.getTierConfig(tier);
      if (this.renderer) {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.maxDpr));
        this.renderer.shadowMap.enabled = cfg.shadowMap;
      }
      console.log(`[Thế Giới Cách Điệu] Đặt mức đồ họa: ${tier.toUpperCase()}`);
    }
  }

  // ===================================================================
  // 1. KHỞI TẠO PATTERN GIẤY DÓ & TRANSITION OVERLAY
  // ===================================================================
  initDoPaperTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 256;
    pCanvas.height = 256;
    const pctx = pCanvas.getContext('2d');

    pctx.fillStyle = '#1c130d';
    pctx.fillRect(0, 0, 256, 256);

    // Vân xơ dó li ti màu hoàng thổ và vàng kim
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const len = 3 + Math.random() * 12;
      const angle = Math.random() * Math.PI * 2;
      pctx.strokeStyle = `rgba(212, 175, 55, ${0.03 + Math.random() * 0.06})`;
      pctx.lineWidth = 0.6 + Math.random() * 0.8;
      pctx.beginPath();
      pctx.moveTo(x, y);
      pctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      pctx.stroke();
    }

    // Đốm vỏ cây dó sờn mộc cổ truyền
    for (let i = 0; i < 160; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      pctx.fillStyle = `rgba(180, 140, 90, ${0.04 + Math.random() * 0.08})`;
      pctx.beginPath();
      pctx.arc(x, y, 1 + Math.random() * 2.5, 0, Math.PI * 2);
      pctx.fill();
    }

    this.doPaperPatternCanvas = pCanvas;
  }

  initTransitionOverlay() {
    if (!document.body) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initTransitionOverlay());
        return;
      }
      return;
    }

    let overlay = document.getElementById('bespokeTransitionOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bespokeTransitionOverlay';
      overlay.className = 'bespoke-transition-overlay';
      overlay.innerHTML = `
        <div class="transition-cut-left"></div>
        <div class="transition-cut-right"></div>
        <div class="transition-core-burst">
          <div class="burst-seal">象</div>
          <span class="burst-text">VẠN TƯỢNG QUY NHẤT</span>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    this.transitionOverlay = overlay;
  }

  // ===================================================================
  // 2. GẮN ĐỘNG CƠ THREE.JS VÀO KHUNG TRANH (#artFrame)
  // ===================================================================
  mount(containerEl) {
    if (!containerEl) return;
    if (this.container === containerEl && this.renderer) return;

    // Gỡ bỏ bộ lắng nghe cũ nếu đổi container để chống Memory Leak
    if (this.container && this.boundMouseMoveHandler) {
      this.container.removeEventListener('mousemove', this.boundMouseMoveHandler);
    }
    if (this.container && this.boundMouseLeaveHandler) {
      this.container.removeEventListener('mouseleave', this.boundMouseLeaveHandler);
    }

    this.container = containerEl;
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 400;

    // 1. Khởi tạo Three.js WebGLRenderer tối ưu hiệu năng
    if (!this.renderer) {
      const cfg = this.getTierConfig();
      this.renderer = new THREE.WebGLRenderer({
        antialias: cfg.softShadow,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.maxDpr));
      this.renderer.setSize(w, h);
      this.renderer.shadowMap.enabled = cfg.shadowMap;
      this.renderer.shadowMap.type = cfg.softShadow ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;

      const canvas = this.renderer.domElement;
      canvas.className = 'stylized-world-canvas-3d';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '2';
      canvas.style.pointerEvents = 'none'; // Để tương tác với các Điểm Nhãn Hotspots

      // Camera góc nhìn 3D có chiều sâu
      this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      this.camera.position.set(0, 0, 7.5);
    }

    if (this.renderer.domElement.parentElement !== this.container) {
      this.container.appendChild(this.renderer.domElement);
    }

    // 2. Lớp Canvas 2D phủ vân giấy Dó & Vignette mực tàu
    if (!this.overlayCanvas) {
      this.overlayCanvas = document.createElement('canvas');
      this.overlayCanvas.className = 'stylized-world-paper-overlay';
      this.overlayCanvas.style.position = 'absolute';
      this.overlayCanvas.style.top = '0';
      this.overlayCanvas.style.left = '0';
      this.overlayCanvas.style.width = '100%';
      this.overlayCanvas.style.height = '100%';
      this.overlayCanvas.style.zIndex = '3';
      this.overlayCanvas.style.pointerEvents = 'none';
      this.overlayCtx = this.overlayCanvas.getContext('2d');
      this.initDoPaperTexture();
    }

    if (this.overlayCanvas.parentElement !== this.container) {
      this.container.appendChild(this.overlayCanvas);
    }

    this.handleResize();

    if (!this.boundResizeHandler) {
      this.boundResizeHandler = () => this.handleResize();
      window.addEventListener('resize', this.boundResizeHandler);
    }

    // Bắt tọa độ chuột tạo góc nghiêng Parallax 3D
    this.boundMouseMoveHandler = (e) => {
      const rect = this.container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      this.mouse.targetX = Math.max(-1, Math.min(1, nx));
      this.mouse.targetY = Math.max(-1, Math.min(1, ny));
    };
    this.container.addEventListener('mousemove', this.boundMouseMoveHandler);

    this.boundMouseLeaveHandler = () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    };
    this.container.addEventListener('mouseleave', this.boundMouseLeaveHandler);

    if (this.activeScene) {
      this.startLoop();
    }
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth || 600;
    const h = this.container.clientHeight || 400;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);

    if (this.overlayCanvas) {
      this.overlayCanvas.width = w;
      this.overlayCanvas.height = h;
      this.renderPaperOverlay();
    }
  }

  renderPaperOverlay() {
    if (!this.overlayCtx || !this.overlayCanvas) return;
    const ctx = this.overlayCtx;
    const w = this.overlayCanvas.width;
    const h = this.overlayCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Phủ hoa văn giấy Dó tự nhiên
    if (this.doPaperPatternCanvas) {
      if (!this.doPaperPattern) {
        this.doPaperPattern = ctx.createPattern(this.doPaperPatternCanvas, 'repeat');
      }
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = this.doPaperPattern;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    // 2. Viền loang mực tàu sẫm bốn góc (Vignette)
    const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.72);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(0.7, 'rgba(12, 8, 5, 0.45)');
    vig.addColorStop(1, 'rgba(8, 4, 2, 0.92)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);
  }

  // Getter để tương thích ngược 100% nếu có mã bên ngoài đọc .scenes
  get scenes() {
    return (this.activeWorldKey && this.activeScene) ? { [this.activeWorldKey]: this.activeScene } : {};
  }

  // ===================================================================
  // 3. LAZY LOADING CẢNH TRÍ 3D (SINGLE ACTIVE SCENE - TIẾT KIỆM BỘ NHỚ GPU)
  // Chỉ tải duy nhất 1 thế giới tại một thời điểm, dọn dẹp sạch thế giới cũ
  // ===================================================================
  getWorld(worldId) {
    if (!worldId) return null;
    const key = (worldId === 'mask') ? 'tuong' : worldId;

    // Nếu thế giới yêu cầu trùng với thế giới đang hoạt động -> tái sử dụng
    if (this.activeWorldKey === key && this.activeScene) {
      return this.activeScene;
    }

    // Nếu đang có một thế giới khác trong bộ nhớ -> giải phóng sạch sẽ trước khi dựng thế giới mới
    this.unloadCurrentWorld();

    let scene = null;
    if (key === 'tuong') scene = this.createTuongScene();
    else if (key === 'ceramic') scene = this.createCeramicScene();
    else if (key === 'flute') scene = this.createFluteScene();
    else if (key === 'brush') scene = this.createBrushScene();

    if (scene) {
      this.activeScene = scene;
      this.activeWorldKey = key;
      this.currentWorld = key;
      console.log(`[Thế Giới Cách Điệu] Đã nạp thế giới 3D: ${key} (Lazy Loaded on Demand)`);
    }

    return this.activeScene;
  }

  initAllWorlds() {
    // Để tương thích ngược nếu có chỗ gọi
    return this.getWorld('tuong');
  }

  // -------------------------------------------------------------------
  // THẾ GIỚI 1: CÕI TUỒNG CỔ ĐẶNG GIA (MÀN 1)
  // Sân khấu tuồng rách nát, mặt nạ Tam Diện khổng lồ nửa son nửa mực
  // -------------------------------------------------------------------
  createTuongScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0808, 0.065);

    // Ánh sáng sân khấu kịch tính
    const amb = new THREE.AmbientLight(0x421212, 1.2);
    const spot = new THREE.SpotLight(0xd9381e, 3.8); // Cam đỏ rực DMC 606
    spot.position.set(0, 5, 6);
    spot.angle = Math.PI / 4;
    spot.penumbra = 0.6;
    scene.add(amb, spot);

    const rim = new THREE.DirectionalLight(0x8e44ad, 1.8);
    rim.position.set(-4, -2, -3);
    scene.add(rim);

    const worldGroup = new THREE.Group();

    // 1. Sàn rạp hát gỗ lim nứt nẻ
    const floorGeo = new THREE.PlaneGeometry(16, 12, 16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x24120c,
      roughness: 0.85,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2.3;
    floor.position.set(0, -2.4, -2);
    worldGroup.add(floor);

    // 2. Màn nhung tuồng đỏ son rách tơi tả hai bên cánh gà
    const curtainGeo = new THREE.CylinderGeometry(2.4, 2.8, 7.5, 18, 8, true, 0, Math.PI * 0.8);
    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0x5a1315,
      roughness: 0.9,
      side: THREE.DoubleSide
    });
    const leftCurtain = new THREE.Mesh(curtainGeo, curtainMat);
    leftCurtain.position.set(-4.2, 0.5, -1);
    leftCurtain.rotation.y = Math.PI * 0.35;

    const rightCurtain = new THREE.Mesh(curtainGeo, curtainMat);
    rightCurtain.position.set(4.2, 0.5, -1);
    rightCurtain.rotation.y = -Math.PI * 0.35;
    worldGroup.add(leftCurtain, rightCurtain);

    // 3. Đao mác thời Lê cắm xiêu vẹo trên sàn gỗ
    const spearMat = new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 0.8, roughness: 0.3 });
    const woodPoleMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.7 });

    const createSpear = (x, z, rotZ, rotX) => {
      const g = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4.2, 8), woodPoleMat);
      const blade = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.8, 4), spearMat);
      blade.position.y = 2.1;
      blade.scale.set(0.6, 1, 1.8);
      g.add(pole, blade);
      g.position.set(x, -1.2, z);
      g.rotation.set(rotX, 0, rotZ);
      return g;
    };
    worldGroup.add(createSpear(-2.8, -1.5, 0.35, 0.2));
    worldGroup.add(createSpear(3.1, -2.2, -0.4, 0.15));

    // 4. MẶT NẠ TUỒNG TAM DIỆN KHỔNG LỒ LƠ LỬNG Ở TRUNG TÂM
    const maskCenter = new THREE.Group();

    // Thân mặt nạ cốt gỗ mít
    const faceShape = new THREE.Shape();
    faceShape.moveTo(0, 1.6);
    faceShape.bezierCurveTo(1.2, 1.4, 1.6, 0.4, 1.4, -0.6);
    faceShape.bezierCurveTo(1.1, -1.5, 0.4, -1.9, 0, -2.1);
    faceShape.bezierCurveTo(-0.4, -1.9, -1.1, -1.5, -1.4, -0.6);
    faceShape.bezierCurveTo(-1.6, 0.4, -1.2, 1.4, 0, 1.6);

    const extrudeSettings = { depth: 0.45, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.1, bevelThickness: 0.12 };
    const faceGeo = new THREE.ExtrudeGeometry(faceShape, extrudeSettings);
    faceGeo.center();

    // Nửa mặt tả sơn son chu sa trung liệt
    const redMat = new THREE.MeshStandardMaterial({
      color: 0xa81c22, // Đỏ chu sa chuẩn DMC 321
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0x4a0e0e,
      emissiveIntensity: 0.4
    });
    // Nửa mặt hữu vôi trắng thanh liêm nhíu mày bi thương
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xe8dfd1,
      roughness: 0.5,
      metalness: 0.05
    });

    const maskMeshRight = new THREE.Mesh(faceGeo, redMat);
    maskMeshRight.scale.set(1.15, 1.15, 1.15);

    // Mày tuồng lưỡi mác than lá dừa dữ dội
    const browGeo = new THREE.BoxGeometry(0.85, 0.16, 0.12);
    const browMat = new THREE.MeshStandardMaterial({ color: 0x0a0604, roughness: 0.9 });
    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(-0.62, 0.42, 0.32);
    leftBrow.rotation.z = 0.28;

    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(0.62, 0.46, 0.32);
    rightBrow.rotation.z = -0.36; // Xếch ngược căm hờn

    // Đôi mắt tuồng rực lửa oán khiên
    const eyeGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3838 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.55, 0.12, 0.28);
    leftEye.scale.set(1.4, 0.65, 0.8);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.55, 0.12, 0.28);
    rightEye.scale.set(1.4, 0.65, 0.8);

    // Râu tơ tằm ba chòm buông dài
    const beardGroup = new THREE.Group();
    const beardStrandGeo = new THREE.CylinderGeometry(0.02, 0.008, 1.6, 6);
    const beardMat = new THREE.MeshStandardMaterial({ color: 0x110d0a, roughness: 0.8 });
    [-0.35, 0, 0.35].forEach((bx, idx) => {
      const strand = new THREE.Mesh(beardStrandGeo, beardMat);
      strand.position.set(bx, -1.8 - Math.abs(bx) * 0.3, 0.15);
      strand.rotation.z = (idx - 1) * 0.14;
      beardGroup.add(strand);
    });

    maskCenter.add(maskMeshRight, leftBrow, rightBrow, leftEye, rightEye, beardGroup);
    maskCenter.position.set(0, 0.3, 0);
    worldGroup.add(maskCenter);

    // 5. Hệ thống hạt 3D: Tàn tro than củi và tia son đỏ bốc lên cuồn cuộn
    const particleCount = this.getParticleCount(180);
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 8;
      pPositions[i * 3 + 1] = -3 + Math.random() * 7;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Màu đỏ chu sa hoặc vàng tàn tro
      const isRed = Math.random() > 0.4;
      pColors[i * 3] = isRed ? 0.95 : 0.85;
      pColors[i * 3 + 1] = isRed ? 0.22 : 0.65;
      pColors[i * 3 + 2] = isRed ? 0.18 : 0.22;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    worldGroup.add(particles);

    scene.add(worldGroup);

    // Bộ cập nhật chuyển động mỗi frame
    scene.userData.update = (time, mouse) => {
      // Nhịp thở của mặt nạ (Breathing Animation)
      const breath = 1.0 + Math.sin(time * 1.5) * 0.035;
      maskCenter.scale.set(breath, breath, breath);
      maskCenter.rotation.y = mouse.x * 0.32 + Math.sin(time * 0.8) * 0.06;
      maskCenter.rotation.x = -mouse.y * 0.22;

      // Rèm nhung lay động
      leftCurtain.rotation.z = Math.sin(time * 1.2) * 0.04;
      rightCurtain.rotation.z = -Math.sin(time * 1.2) * 0.04;

      // Hạt tàn tro bay ngược lên trên
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.02 + Math.sin(time + i) * 0.005;
        pos[i * 3] += Math.sin(time * 1.5 + i) * 0.008;
        if (pos[i * 3 + 1] > 4.5) {
          pos[i * 3 + 1] = -3.0;
          pos[i * 3] = (Math.random() - 0.5) * 8;
        }
      }
      pGeo.attributes.position.needsUpdate = true;
    };

    return scene;
  }

  // -------------------------------------------------------------------
  // THẾ GIỚI 2: LÒ BẦU BÁT TRÀNG THẾ KỶ XVI (MÀN 2)
  // Vòm cuốn gạch sa mốt ngột ngạt tro than, bình men rạn phát quang ngọc lam
  // -------------------------------------------------------------------
  createCeramicScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a0f05, 0.07);

    // Ánh sáng lò nung rực cháy & hào quang ngọc lam celadon
    const amb = new THREE.AmbientLight(0x2d1305, 1.0);
    const fireLight = new THREE.PointLight(0xe06d28, 4.2, 16); // Cam cháy nung gốm chuẩn DMC 947
    fireLight.position.set(0, -0.5, -4);
    scene.add(amb, fireLight);

    const jadeGlow = new THREE.PointLight(0x1abc9c, 2.5, 6);
    jadeGlow.position.set(0, 0.3, 0);
    scene.add(jadeGlow);

    const worldGroup = new THREE.Group();

    // 1. Vòm cuốn lò bầu xây gạch sa mốt sẫm đen ám muội than
    const archGroup = new THREE.Group();
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x2b1c14, roughness: 0.95 });
    for (let i = 0; i < 9; i++) {
      const z = -6 + i * 1.4;
      const archMesh = new THREE.Mesh(
        new THREE.TorusGeometry(3.6, 0.35, 8, 24, Math.PI),
        brickMat
      );
      archMesh.position.set(0, -1.2, z);
      archMesh.rotation.z = Math.PI;
      archGroup.add(archMesh);
    }
    worldGroup.add(archGroup);

    // 2. Cửa lò phía sau rực sáng ánh lửa nung 1300 độ C
    const fireMouth = new THREE.Mesh(
      new THREE.CircleGeometry(2.2, 24),
      new THREE.MeshBasicMaterial({ color: 0xff4500, side: THREE.DoubleSide })
    );
    fireMouth.position.set(0, 0.5, -6.2);
    worldGroup.add(fireMouth);

    // 3. Bàn chuốt gốm bằng gỗ cổ
    const wheelStand = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.7, 18),
      new THREE.MeshStandardMaterial({ color: 0x3d271d, roughness: 0.85 })
    );
    wheelStand.position.set(0, -2.1, 0);
    worldGroup.add(wheelStand);

    // 4. BÌNH GỐM TỲ BÀ MEN RẠN THẾ KỶ XVI LƠ LỬNG TRÊN BÀN CHUỐT
    const vaseGroup = new THREE.Group();

    const points = [];
    points.push(new THREE.Vector2(0.35, 0.0));
    points.push(new THREE.Vector2(0.55, 0.3));
    points.push(new THREE.Vector2(0.85, 0.75));
    points.push(new THREE.Vector2(0.92, 1.15));
    points.push(new THREE.Vector2(0.75, 1.55));
    points.push(new THREE.Vector2(0.42, 1.95));
    points.push(new THREE.Vector2(0.35, 2.35));
    points.push(new THREE.Vector2(0.48, 2.65));
    points.push(new THREE.Vector2(0.45, 2.70));
    points.push(new THREE.Vector2(0.30, 2.62));
    points.push(new THREE.Vector2(0.24, 2.2));

    const latheGeo = new THREE.LatheGeometry(points, 32);
    latheGeo.center();

    // Men rạn ngọc lam Celadon kết hợp huỳnh quang mạch nứt
    const vaseMat = new THREE.MeshStandardMaterial({
      color: 0x16a085,
      roughness: 0.18,
      metalness: 0.25,
      emissive: 0x0e4f42,
      emissiveIntensity: 0.55
    });
    const vaseMesh = new THREE.Mesh(latheGeo, vaseMat);

    // Đôi tai quai mây đao mác đắp nổi thủ công
    const handleGeo = new THREE.TorusGeometry(0.25, 0.065, 10, 20, Math.PI * 1.3);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x1abc9c, roughness: 0.3 });
    const h1 = new THREE.Mesh(handleGeo, handleMat);
    h1.position.set(-0.48, 0.52, 0);
    h1.rotation.z = Math.PI / 2;

    const h2 = new THREE.Mesh(handleGeo, handleMat);
    h2.position.set(0.48, 0.52, 0);
    h2.rotation.z = -Math.PI / 2;

    vaseGroup.add(vaseMesh, h1, h2);
    vaseGroup.position.set(0, 0.2, 0);
    worldGroup.add(vaseGroup);

    // 5. Mảnh gốm rạn vỡ trôi nổi lơ lửng theo dòng khí nhiệt đối lưu
    const shardsGroup = new THREE.Group();
    const shardGeo = new THREE.TetrahedronGeometry(0.18, 0);
    const shardMat = new THREE.MeshStandardMaterial({ color: 0x48c9b0, roughness: 0.2, metalness: 0.3 });
    for (let i = 0; i < 8; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      const angle = (i / 8) * Math.PI * 2;
      shard.position.set(Math.cos(angle) * 1.6, -0.4 + (i % 3) * 0.5, Math.sin(angle) * 1.6);
      shard.scale.set(0.6 + Math.random() * 0.8, 0.4 + Math.random() * 0.6, 0.2);
      shardsGroup.add(shard);
    }
    worldGroup.add(shardsGroup);

    // 6. Hệ thống hạt 3D: Tro trấu nếp cái hoa vàng cháy rực bốc lên cuộn xoáy
    const huskCount = this.getParticleCount(220);
    const hGeo = new THREE.BufferGeometry();
    const hPositions = new Float32Array(huskCount * 3);
    const hColors = new Float32Array(huskCount * 3);

    for (let i = 0; i < huskCount; i++) {
      hPositions[i * 3] = (Math.random() - 0.5) * 6;
      hPositions[i * 3 + 1] = -2.5 + Math.random() * 6;
      hPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Màu vàng hoa cải nếp hoặc cam lửa củi nung
      hColors[i * 3] = 0.98;
      hColors[i * 3 + 1] = 0.45 + Math.random() * 0.45;
      hColors[i * 3 + 2] = 0.08;
    }

    hGeo.setAttribute('position', new THREE.BufferAttribute(hPositions, 3));
    hGeo.setAttribute('color', new THREE.BufferAttribute(hColors, 3));

    const hMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const huskParticles = new THREE.Points(hGeo, hMat);
    worldGroup.add(huskParticles);

    scene.add(worldGroup);

    scene.userData.update = (time, mouse) => {
      // Bình men rạn xoay chầm chậm và lơ lửng
      vaseGroup.rotation.y = time * 0.35 + mouse.x * 0.4;
      vaseGroup.position.y = 0.2 + Math.sin(time * 1.8) * 0.08;
      vaseGroup.rotation.x = -mouse.y * 0.2;

      // Mảnh gốm quay theo dòng khí
      shardsGroup.rotation.y = -time * 0.5;

      // Lửa lò bập bùng thay đổi cường độ
      fireLight.intensity = 3.8 + Math.sin(time * 14) * 0.6 + Math.cos(time * 26) * 0.3;

      // Tro trấu bốc lên xoáy cuộn
      const pos = hGeo.attributes.position.array;
      for (let i = 0; i < huskCount; i++) {
        pos[i * 3 + 1] += 0.025 + Math.sin(time * 2 + i) * 0.006;
        pos[i * 3] += Math.sin(time * 1.8 + i) * 0.01;
        if (pos[i * 3 + 1] > 4.0) {
          pos[i * 3 + 1] = -2.5;
          pos[i * 3] = (Math.random() - 0.5) * 6;
        }
      }
      hGeo.attributes.position.needsUpdate = true;
    };

    return scene;
  }

  // -------------------------------------------------------------------
  // THẾ GIỚI 3: VỰC THẲM MỤC ĐỒNG KINH BẮC (MÀN 3)
  // Sông Đuống mực đen sóng dập dềnh, trâu mộng & sóng âm tiêu trúc ma mị
  // -------------------------------------------------------------------
  createFluteScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a140f, 0.06);

    // Ánh trăng xanh ngọc bích ma quái chiếu rọi
    const amb = new THREE.AmbientLight(0x0e2417, 1.2);
    const moon = new THREE.DirectionalLight(0x2ecc71, 2.6);
    moon.position.set(3, 6, 4);
    scene.add(amb, moon);

    const worldGroup = new THREE.Group();

    // 1. DÒNG SÔNG ĐUỐNG 3D MỰC ĐEN SÓNG DẬP DỀNH (Dynamic Ink Wave Mesh)
    const waveGeo = new THREE.PlaneGeometry(16, 12, 40, 30);
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x050e09,
      roughness: 0.15,
      metalness: 0.5,
      flatShading: true
    });
    const riverMesh = new THREE.Mesh(waveGeo, waveMat);
    riverMesh.rotation.x = -Math.PI / 2.2;
    riverMesh.position.set(0, -1.8, -1.5);
    worldGroup.add(riverMesh);

    // Lưu lại vị trí đỉnh ban đầu để biến dạng sóng
    const waveBasePos = waveGeo.attributes.position.clone();

    // 2. Vạt tre ngà Kinh Bắc oằn mình theo gió lốc bên bờ sông
    const bambooMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.6 });
    const stalks = [];
    for (let i = 0; i < 5; i++) {
      const bGeo = new THREE.CylinderGeometry(0.06, 0.08, 6.5, 8);
      const bMesh = new THREE.Mesh(bGeo, bambooMat);
      bMesh.position.set(-4.5 + i * 0.45, 0.8, -2 - i * 0.3);
      worldGroup.add(bMesh);
      stalks.push(bMesh);
    }

    // 3. TRÂU MỘNG MỰC THAN & MỤC ĐỒNG THỔI TIÊU
    const charGroup = new THREE.Group();

    // Thân trâu mộng tạc từ khối than đen mun
    const buffaloBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.3, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x111613, roughness: 0.9 })
    );
    buffaloBody.position.set(0, -0.2, 0);

    // Cặp sừng cánh cung dũng mãnh
    const hornGeo = new THREE.TorusGeometry(0.65, 0.1, 8, 16, Math.PI * 0.85);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.5 });
    const hornLeft = new THREE.Mesh(hornGeo, hornMat);
    hornLeft.position.set(-0.8, 0.7, 0.3);
    hornLeft.rotation.set(0.3, 0.4, 0.8);

    const hornRight = new THREE.Mesh(hornGeo, hornMat);
    hornRight.position.set(0.8, 0.7, 0.3);
    hornRight.rotation.set(0.3, -0.4, -0.8);

    charGroup.add(buffaloBody, hornLeft, hornRight);

    // Chú bé mục đồng ngồi trên lưng trâu
    const boyMat = new THREE.MeshStandardMaterial({ color: 0xbda88a, roughness: 0.7 });
    const boyBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 0.75, 8), boyMat);
    boyBody.position.set(0, 0.85, 0);

    const boyHead = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), boyMat);
    boyHead.position.set(0, 1.35, 0);

    // Ống tiêu trúc 7 đốt giơ lên môi
    const fluteMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.032, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4 })
    );
    fluteMesh.position.set(0.28, 1.25, 0.35);
    fluteMesh.rotation.set(-0.4, 0.3, -0.6);

    charGroup.add(boyBody, boyHead, fluteMesh);
    charGroup.position.set(0.4, -0.3, 0);
    worldGroup.add(charGroup);

    // 4. VÒNG SÓNG ÂM MA MỊ (Concentric 3D Sound Wave Rings) PHÁT RA TỪ ĐẦU TIÊU
    const soundRings = [];
    for (let r = 0; r < 4; r++) {
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.5 + r * 0.6, 0.025, 8, 32),
        new THREE.MeshBasicMaterial({
          color: 0x2ecc71,
          transparent: true,
          opacity: 0.8 - r * 0.18,
          blending: THREE.AdditiveBlending
        })
      );
      ringMesh.position.set(0.7, 1.45, 0.5);
      ringMesh.rotation.x = Math.PI / 3;
      worldGroup.add(ringMesh);
      soundRings.push(ringMesh);
    }

    // 5. Hệ thống hạt 3D: Vảy điệp vảy sò óng ánh rách toác từ bầu trời rơi rụng
    const diepCount = this.getParticleCount(200);
    const dGeo = new THREE.BufferGeometry();
    const dPositions = new Float32Array(diepCount * 3);
    const dColors = new Float32Array(diepCount * 3);

    for (let i = 0; i < diepCount; i++) {
      dPositions[i * 3] = (Math.random() - 0.5) * 8;
      dPositions[i * 3 + 1] = -2 + Math.random() * 6;
      dPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      // Sắc trắng vảy điệp óng ánh ánh ngọc bích
      dColors[i * 3] = 0.85 + Math.random() * 0.15;
      dColors[i * 3 + 1] = 0.95;
      dColors[i * 3 + 2] = 0.88;
    }

    dGeo.setAttribute('position', new THREE.BufferAttribute(dPositions, 3));
    dGeo.setAttribute('color', new THREE.BufferAttribute(dColors, 3));

    const dMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const diepParticles = new THREE.Points(dGeo, dMat);
    worldGroup.add(diepParticles);

    scene.add(worldGroup);

    let waveNormalCounter = 0;
    scene.userData.update = (time, mouse) => {
      // 1. Sóng nước sông Đuống nhấp nhô liên tục (Tối ưu hóa tính toán ma trận đỉnh)
      const pos = waveGeo.attributes.position.array;
      const base = waveBasePos.array;
      for (let i = 0; i < pos.length; i += 3) {
        const vx = base[i];
        const vy = base[i + 1];
        pos[i + 2] = Math.sin(vx * 0.9 + time * 2.2) * 0.22 + Math.cos(vy * 0.8 + time * 1.8) * 0.18;
      }
      waveGeo.attributes.position.needsUpdate = true;
      waveNormalCounter++;
      if (waveNormalCounter % 2 === 0) {
        waveGeo.computeVertexNormals();
      }

      // 2. Nhịp thở trâu mộng & nghiêng theo chuột
      charGroup.position.y = -0.3 + Math.sin(time * 1.6) * 0.05;
      charGroup.rotation.y = mouse.x * 0.28;
      charGroup.rotation.x = -mouse.y * 0.18;

      // 3. Tre trúc oằn mình theo gió
      stalks.forEach((st, idx) => {
        st.rotation.z = 0.18 + Math.sin(time * 2.4 + idx * 0.4) * 0.14;
      });

      // 4. Vòng sóng âm mở rộng ra xa và mờ dần
      soundRings.forEach((ring, idx) => {
        const ringScale = ((time * 1.2 + idx * 0.4) % 2.0);
        ring.scale.set(1 + ringScale * 1.2, 1 + ringScale * 1.2, 1);
        ring.material.opacity = Math.max(0, 0.85 - ringScale * 0.42);
      });

      // 5. Bụi vảy điệp rơi lãng đãng trong gió
      const dpos = dGeo.attributes.position.array;
      for (let i = 0; i < diepCount; i++) {
        dpos[i * 3 + 1] -= 0.015;
        dpos[i * 3] += 0.018 + Math.sin(time + i) * 0.005; // Cuốn theo chiều gió sông
        if (dpos[i * 3 + 1] < -2.2) {
          dpos[i * 3 + 1] = 4.0;
          dpos[i * 3] = (Math.random() - 0.5) * 8;
        }
      }
      dGeo.attributes.position.needsUpdate = true;
    };

    return scene;
  }

  // -------------------------------------------------------------------
  // THẾ GIỚI 4: ĐIỆN THỜ TIỀN NHÂN & ÁN THƯ (MÀN 4)
  // Bàn án thư gỗ mun, ngọn bút lông đuôi chồn lơ lửng tỏa hào quang chu sa
  // -------------------------------------------------------------------
  createBrushScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x180c05, 0.055);

    // Ánh hào quang hổ phách và chu sa linh thiêng
    const amb = new THREE.AmbientLight(0x381808, 1.2);
    const goldLight = new THREE.DirectionalLight(0xf5a823, 3.2); // Hoàng kim DMC 741
    goldLight.position.set(0, 6, 5);
    scene.add(amb, goldLight);

    const cinnabarGlow = new THREE.PointLight(0xa81c22, 2.8, 6); // Đỏ chu sa DMC 321
    cinnabarGlow.position.set(0, 0.4, 0);
    scene.add(cinnabarGlow);

    const worldGroup = new THREE.Group();

    // 1. Khung cửa võng mộc bản thế kỷ XVIII chạm hoa cúc sen
    const archMat = new THREE.MeshStandardMaterial({ color: 0x3d2112, roughness: 0.75 });
    const beam = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.5, 0.4), archMat);
    beam.position.set(0, 3.2, -1.8);

    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 6.0, 0.4), archMat);
    p1.position.set(-4.0, 0.5, -1.8);
    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 6.0, 0.4), archMat);
    p2.position.set(4.0, 0.5, -1.8);
    worldGroup.add(beam, p1, p2);

    // 2. Hoành phi vàng son: "VẠN TƯỢNG QUY NHẤT" (萬 象 歸 一)
    const plaqueMat = new THREE.MeshStandardMaterial({ color: 0x801818, roughness: 0.4, metalness: 0.3 });
    const plaque = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.1, 0.15), plaqueMat);
    plaque.position.set(0, 2.8, -1.7);
    worldGroup.add(plaque);

    // 3. Bàn Án Thư gỗ mun chạm chân quỳ hoa sen
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.28, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x1f140e, roughness: 0.35, metalness: 0.2 })
    );
    tableTop.position.set(0, -1.3, 0);

    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.6 });
    [-1.9, 1.9].forEach(lx => {
      [-0.75, 0.75].forEach(lz => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.4, 8), legMat);
        leg.position.set(lx, -2.0, lz);
        worldGroup.add(leg);
      });
    });
    worldGroup.add(tableTop);

    // 4. Nghiên Mực Đá Yên Tử với đầm mực chu sa đỏ thắm
    const inkstone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.65, 0.16, 18),
      new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.85 })
    );
    inkstone.position.set(-1.1, -1.08, 0.2);

    const inkPool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.04, 18),
      new THREE.MeshStandardMaterial({ color: 0xb02015, roughness: 0.1, metalness: 0.4 })
    );
    inkPool.position.set(-1.1, -1.02, 0.2);
    worldGroup.add(inkstone, inkPool);

    // 5. Lư trầm đồng khói nghi ngút
    const burner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.18, 0.42, 12),
      new THREE.MeshStandardMaterial({ color: 0x966e35, metalness: 0.7, roughness: 0.4 })
    );
    burner.position.set(1.3, -0.95, 0.2);
    worldGroup.add(burner);

    // 6. NGỌN BÚT LÔNG ĐUÔI CHỒN LƠ LỬNG TỎA HÀO QUANG CHU SA Ở TRUNG TÂM
    const brushCenter = new THREE.Group();

    // Cán trúc ngà nạm vòng vàng kim
    const handleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.044, 1.6, 16),
      new THREE.MeshStandardMaterial({ color: 0xdcd0b6, roughness: 0.35 })
    );

    // Khâu đồng giữ lông bút
    const ferruleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.05, 0.22, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 })
    );
    ferruleMesh.position.y = -0.85;

    // Ngọn lông chồn đẫm mực chu sa
    const tipMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.052, 0.48, 16),
      new THREE.MeshStandardMaterial({
        color: 0xa81c22, // Đỏ chu sa chuẩn DMC 321
        roughness: 0.2,
        metalness: 0.1,
        emissive: 0x96281b,
        emissiveIntensity: 0.65
      })
    );
    tipMesh.position.y = -1.18;
    tipMesh.rotation.x = Math.PI;

    // Vòng hào quang kim quang bao quanh ngọn bút
    const auraRing1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.015, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xf5a823, transparent: true, opacity: 0.85 })
    );
    auraRing1.position.y = -1.15;
    auraRing1.rotation.x = Math.PI / 2;

    const auraRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.012, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xa81c22, transparent: true, opacity: 0.65 })
    );
    auraRing2.position.y = -1.15;
    auraRing2.rotation.y = Math.PI / 2;

    brushCenter.add(handleMesh, ferruleMesh, tipMesh, auraRing1, auraRing2);
    brushCenter.position.set(0, 0.45, 0);
    brushCenter.rotation.z = 0.35; // Nghiêng thanh thoát như đang sẵn sàng điểm nhãn
    worldGroup.add(brushCenter);

    // 7. Hệ thống hạt 3D: Bụi vàng kim tinh túy & làn khói trầm linh thiêng
    const goldCount = this.getParticleCount(160);
    const gGeo = new THREE.BufferGeometry();
    const gPositions = new Float32Array(goldCount * 3);
    const gColors = new Float32Array(goldCount * 3);

    for (let i = 0; i < goldCount; i++) {
      gPositions[i * 3] = (Math.random() - 0.5) * 6;
      gPositions[i * 3 + 1] = -2 + Math.random() * 6;
      gPositions[i * 3 + 2] = (Math.random() - 0.5) * 5;

      gColors[i * 3] = 0.98;
      gColors[i * 3 + 1] = 0.82;
      gColors[i * 3 + 2] = 0.28;
    }

    gGeo.setAttribute('position', new THREE.BufferAttribute(gPositions, 3));
    gGeo.setAttribute('color', new THREE.BufferAttribute(gColors, 3));

    const gMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending
    });
    const goldParticles = new THREE.Points(gGeo, gMat);
    worldGroup.add(goldParticles);

    scene.add(worldGroup);

    scene.userData.update = (time, mouse) => {
      // Ngọn bút xoay chầm chậm và lơ lửng bồng bềnh
      brushCenter.position.y = 0.45 + Math.sin(time * 2.0) * 0.08;
      brushCenter.rotation.y = time * 0.45 + mouse.x * 0.35;
      brushCenter.rotation.x = -mouse.y * 0.2;

      auraRing1.rotation.z = time * 1.5;
      auraRing2.rotation.x = time * 1.2;

      // Hạt vàng kim bay lượn lơ lửng
      const gpos = gGeo.attributes.position.array;
      for (let i = 0; i < goldCount; i++) {
        gpos[i * 3 + 1] += 0.012 + Math.sin(time + i) * 0.004;
        gpos[i * 3] += Math.sin(time * 1.2 + i) * 0.005;
        if (gpos[i * 3 + 1] > 3.8) {
          gpos[i * 3 + 1] = -2.0;
          gpos[i * 3] = (Math.random() - 0.5) * 6;
        }
      }
      gGeo.attributes.position.needsUpdate = true;
    };

    return scene;
  }

  // ===================================================================
  // 4. THIẾT LẬP THẾ GIỚI HIỆN TẠI & GIẢI PHÓNG TÀI NGUYÊN (SAFE UNLOAD)
  // Lazy Loading & Dọn dẹp triệt để VRAM khi rời cảnh để bảo toàn 100% hiệu năng
  // ===================================================================
  unloadCurrentWorld() {
    this.stopLoop();

    if (this.activeScene) {
      const scene = this.activeScene;
      const oldKey = this.activeWorldKey || 'unknown';

      // 1. Duyệt đệ quy giải phóng toàn bộ Geometry, Material & Texture
      scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(mat => {
            const textureSlots = [
              'map', 'lightMap', 'bumpMap', 'normalMap',
              'specularMap', 'envMap', 'alphaMap', 'emissiveMap', 'roughnessMap', 'metalnessMap'
            ];
            textureSlots.forEach(slot => {
              if (mat[slot] && mat[slot].isTexture && !mat[slot].userData?.isShared) {
                mat[slot].dispose();
              }
            });
            mat.dispose();
          });
        }
        if (obj.userData) {
          obj.userData.update = null;
        }
      });

      // 2. Tháo gỡ các nút con khỏi Scene Graph
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }

      // 3. Xóa danh sách render cache của Three.js
      if (this.renderer && this.renderer.renderLists) {
        this.renderer.renderLists.dispose();
      }

      this.activeScene = null;
      this.activeWorldKey = null;
      this.currentWorld = null;
      console.log(`[Thế Giới Cách Điệu] Đã dọn dẹp & giải phóng hoàn toàn VRAM thế giới: ${oldKey}`);
    }
  }

  setWorld(worldId) {
    if (!worldId) {
      this.unloadCurrentWorld();
      if (this.overlayCanvas) {
        this.renderPaperOverlay();
      }
      return;
    }

    const key = (worldId === 'mask') ? 'tuong' : worldId;
    if (this.activeWorldKey === key && this.activeScene) {
      this.currentWorld = key;
      this.startLoop();
      if (this.overlayCanvas) {
        this.renderPaperOverlay();
      }
      return;
    }

    // Dọn dẹp thế giới cũ trước khi nạp thế giới mới
    this.unloadCurrentWorld();
    this.currentWorld = key;
    const scene = this.getWorld(key);
    if (scene) {
      this.startLoop();
    }
    if (this.overlayCanvas) {
      this.renderPaperOverlay();
    }
  }

  // ===================================================================
  // 5. VÒNG LẶP RENDER 60 FPS LEAN 3D LOOP
  // ===================================================================
  startLoop() {
    if (this.animId) return;

    const loop = () => {
      this.time += 0.025;
      // Nội suy mượt mà chuột Parallax 3D
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      this.render();
      if (this.currentWorld && this.activeScene) {
        this.animId = requestAnimationFrame(loop);
      } else {
        this.animId = null;
      }
    };

    this.animId = requestAnimationFrame(loop);
  }

  stopLoop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  render() {
    if (!this.renderer || !this.camera || !this.activeScene) return;
    const scene = this.activeScene;

    // Cập nhật góc nhìn Camera theo tọa độ rê chuột Parallax 3D
    this.camera.position.x = this.mouse.x * 0.85;
    this.camera.position.y = -this.mouse.y * 0.55;
    this.camera.lookAt(0, 0, 0);

    // Cập nhật chuyển động nội tại của thế giới hiện tại
    if (typeof scene.userData.update === 'function') {
      scene.userData.update(this.time, this.mouse);
    }

    // Render WebGL 3D
    this.renderer.render(scene, this.camera);
  }

  dispose() {
    this.unloadCurrentWorld();

    if (this.boundResizeHandler) {
      window.removeEventListener('resize', this.boundResizeHandler);
      this.boundResizeHandler = null;
    }
    if (this.container && this.boundMouseMoveHandler) {
      this.container.removeEventListener('mousemove', this.boundMouseMoveHandler);
      this.boundMouseMoveHandler = null;
    }
    if (this.container && this.boundMouseLeaveHandler) {
      this.container.removeEventListener('mouseleave', this.boundMouseLeaveHandler);
      this.boundMouseLeaveHandler = null;
    }

    if (this.renderer) {
      if (typeof this.renderer.forceContextLoss === 'function') {
        try { this.renderer.forceContextLoss(); } catch(e) {}
      }
      this.renderer.dispose();
      if (this.renderer.domElement && this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
      this.renderer = null;
    }
    this.container = null;
    console.log('[Thế Giới Cách Điệu] Đã dọn dẹp và giải phóng toàn bộ tài nguyên Three.js');
  }

  // ===================================================================
  // 6. HỆ THỐNG HIỆU ỨNG CHUYỂN CẢNH BESPOKE CHO TỪNG THẾ GIỚI
  // ===================================================================
  playBespokeTransition(worldId, onMidpointCallback) {
    if (!this.transitionOverlay) {
      this.initTransitionOverlay();
    }

    if (!this.transitionOverlay) {
      if (typeof onMidpointCallback === 'function') onMidpointCallback();
      return;
    }

    const worldKey = (worldId === 'mask') ? 'tuong' : worldId;
    const overlay = this.transitionOverlay;
    overlay.className = `bespoke-transition-overlay active transition-${worldKey}`;

    // Phát âm thanh chuyển cảnh tương ứng
    if (window.audio) {
      if ((worldKey === 'tuong' || worldKey === 'mask') && typeof window.audio.playMaskTheme === 'function') {
        window.audio.playMaskTheme();
      } else if (worldKey === 'ceramic' && typeof window.audio.playCeramicTheme === 'function') {
        window.audio.playCeramicTheme();
      } else if (worldKey === 'flute' && typeof window.audio.playFluteTheme === 'function') {
        window.audio.playFluteTheme();
      } else if (worldKey === 'brush' && typeof window.audio.playBell === 'function') {
        window.audio.playBell();
      } else if (typeof window.audio.playDrum === 'function') {
        window.audio.playDrum();
      }
    }

    // Sau 420ms (thời điểm màn rèm/khói lửa che phủ hoàn toàn) -> chuyển cảnh
    setTimeout(() => {
      if (typeof onMidpointCallback === 'function') {
        onMidpointCallback();
      }
    }, 420);

    // Sau 950ms -> mở toang thế giới và gỡ bỏ class active
    setTimeout(() => {
      overlay.classList.add('transition-fade-out');
      setTimeout(() => {
        overlay.className = 'bespoke-transition-overlay';
      }, 350);
    }, 950);
  }
}

// Khởi tạo Singleton Instance
window.vtStylizedWorld = new StylizedWorldEngine();
