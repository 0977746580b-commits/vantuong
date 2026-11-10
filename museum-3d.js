/**
 * VẠN TƯỢNG - BẢO TÀNG 3D VĂN HÓA ĐẠI VIỆT (THREE.JS ENGINE)
 * Giai Đoạn 2: Tách Rời Mô Hình & Chất Liệu (Level 1), Hệ Thống Tải GLB (Level 2),
 * Khắc Phục Triệt Để Lỗi Biển Tên Bệ Thờ & Tối Ưu Mượt Mà 60 FPS
 */

// ===================================================================
// BỘ QUẢN LÝ TÀI NGUYÊN HIỆN VẬT ĐỘC LẬP (ARTIFACT ASSET FACTORY)
// Cho phép hoán đổi độc lập Geometry, Material và Texture mà không cần Blender
// ===================================================================
const ArtifactAssetFactory = {
  textures: {},
  materials: {},

  initTextures() {
    // 1. Texture men rạn Bát Tràng thế kỷ XVI (Mai rùa tam thái ngọc lam)
    const crackleCanvas = document.createElement('canvas');
    crackleCanvas.width = 1024;
    crackleCanvas.height = 1024;
    const cctx = crackleCanvas.getContext('2d');

    const grad = cctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, '#2d6a5f');
    grad.addColorStop(0.5, '#357d71');
    grad.addColorStop(1, '#1e5248');
    cctx.fillStyle = grad;
    cctx.fillRect(0, 0, 1024, 1024);

    cctx.strokeStyle = 'rgba(18, 32, 26, 0.75)';
    cctx.lineWidth = 1.8;
    for (let i = 0; i < 90; i++) {
      let x = Math.random() * 1024;
      let y = Math.random() * 1024;
      cctx.beginPath();
      cctx.moveTo(x, y);
      for (let j = 0; j < 5; j++) {
        x += (Math.random() - 0.5) * 160;
        y += (Math.random() - 0.5) * 160;
        cctx.lineTo(x, y);
      }
      cctx.stroke();
    }

    cctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
    cctx.lineWidth = 6;
    cctx.strokeRect(0, 520, 1024, 30);

    const crackleTex = new THREE.CanvasTexture(crackleCanvas);
    crackleTex.wrapS = THREE.RepeatWrapping;
    crackleTex.wrapT = THREE.RepeatWrapping;
    crackleTex.userData = { isShared: true };
    this.textures.crackleGlaze = crackleTex;

    // 2. Texture thớ sợi tre già Kinh Bắc (Vàng mật ong ngâm bùn)
    const fluteCanvas = document.createElement('canvas');
    fluteCanvas.width = 256;
    fluteCanvas.height = 1024;
    const tctx = fluteCanvas.getContext('2d');
    tctx.fillStyle = '#b88939';
    tctx.fillRect(0, 0, 256, 1024);

    tctx.fillStyle = 'rgba(92, 58, 27, 0.18)';
    for (let x = 0; x < 256; x += 4) {
      if (Math.random() > 0.4) {
        tctx.fillRect(x, 0, 1.5, 1024);
      }
    }

    const fluteTex = new THREE.CanvasTexture(fluteCanvas);
    fluteTex.userData = { isShared: true };
    this.textures.bambooFiber = fluteTex;
  },

  initMaterials() {
    if (!this.textures.crackleGlaze) this.initTextures();

    // Chất liệu Mặt nạ Tuồng (Gỗ mít, chu sa, mực nho)
    this.materials.jackfruitWood = new THREE.MeshStandardMaterial({
      color: 0xdec8a4,
      roughness: 0.8,
      metalness: 0,
      side: THREE.DoubleSide
    });
    this.materials.cinnabarCrest = new THREE.MeshStandardMaterial({
      color: 0xa82823,
      roughness: 0.35,
      metalness: 0.15
    });
    this.materials.goldLeaf = new THREE.MeshStandardMaterial({
      color: 0xfcd55c,
      roughness: 0.28,
      metalness: 0.75
    });
    this.materials.theatricalInk = new THREE.MeshBasicMaterial({ color: 0x0f0c08 });
    this.materials.tuongLip = new THREE.MeshStandardMaterial({ color: 0x8a241b, roughness: 0.4 });
    this.materials.silkBeard = new THREE.MeshStandardMaterial({ color: 0x140f0a, roughness: 0.9 });

    // Chất liệu Bình gốm Bát Tràng (Men rạn celadon bóng kính, quai mây đắp nổi)
    this.materials.crackleCeramic = new THREE.MeshStandardMaterial({
      map: this.textures.crackleGlaze,
      roughness: 0.16,
      metalness: 0.12
    });
    this.materials.cloudHandle = new THREE.MeshStandardMaterial({
      color: 0x1d4d44,
      roughness: 0.22,
      metalness: 0.2
    });

    // Chất liệu Tiêu trúc Kinh Bắc (Tre vàng, mấu cháy, ngọc bích, lụa)
    this.materials.honeyBamboo = new THREE.MeshStandardMaterial({
      map: this.textures.bambooFiber,
      roughness: 0.32,
      metalness: 0.15
    });
    this.materials.roastedNode = new THREE.MeshStandardMaterial({
      color: 0x5a391c,
      roughness: 0.65,
      metalness: 0.25
    });
    this.materials.fluteHole = new THREE.MeshBasicMaterial({ color: 0x140c06 });
    this.materials.imperialJade = new THREE.MeshStandardMaterial({
      color: 0x2d8a55, // Men ngọc Bát Tràng chuẩn Design Tokens (--state-success)
      roughness: 0.15,
      metalness: 0.2
    });
    this.materials.silkCord = new THREE.MeshStandardMaterial({
      color: 0xa81c22, // Đỏ chu sa chuẩn DMC 321 (--accent-cinnabar)
      roughness: 0.8
    });
    this.materials.rosewoodStand = new THREE.MeshStandardMaterial({
      color: 0x1f120a,
      roughness: 0.45
    });

    // Chất liệu Án Thư Tiền Nhân (Gỗ mun, nghiên đá, mực chu sa, lông chồn, trầm hương)
    this.materials.ebonyAltar = new THREE.MeshStandardMaterial({
      color: 0x18100a,
      roughness: 0.35,
      metalness: 0.15
    });
    this.materials.inkStone = new THREE.MeshStandardMaterial({
      color: 0x1a191d,
      roughness: 0.45,
      metalness: 0.3
    });
    this.materials.cinnabarInk = new THREE.MeshStandardMaterial({
      color: 0xb92b27,
      roughness: 0.22,
      metalness: 0.18
    });
    this.materials.brushBamboo = new THREE.MeshStandardMaterial({
      color: 0xc49b45,
      roughness: 0.3,
      metalness: 0.4
    });
    this.materials.bronzeIncense = new THREE.MeshStandardMaterial({
      color: 0x5a3e1b,
      roughness: 0.28,
      metalness: 0.85
    });
    this.materials.parchmentBook = new THREE.MeshStandardMaterial({
      color: 0xd9c29e,
      roughness: 0.82
    });
  },

  // 1. Tạo Mô Hình Tạm: Mặt Nạ Tuồng Tam Diện (Chiếu Tuồng Đặng Gia)
  createMaskModel() {
    this.initMaterials();
    const group = new THREE.Group();

    // Cốt mặt cong gỗ mít già bồi giấy bản
    const faceGeo = new THREE.CylinderGeometry(0.32, 0.22, 0.92, 24, 1, true, -Math.PI / 2, Math.PI);
    const face = new THREE.Mesh(faceGeo, this.materials.jackfruitWood);
    face.castShadow = true;
    group.add(face);

    // Mũ quan trung thần sơn son chu sa
    const crownGeo = new THREE.TorusGeometry(0.32, 0.05, 12, 24, Math.PI);
    const crown = new THREE.Mesh(crownGeo, this.materials.cinnabarCrest);
    crown.position.set(0, 0.44, 0.08);
    crown.rotation.x = -Math.PI / 2;
    group.add(crown);

    // Búp sen thếp vàng đính đỉnh trán
    const crestGeo = new THREE.ConeGeometry(0.08, 0.20, 8);
    const crest = new THREE.Mesh(crestGeo, this.materials.goldLeaf);
    crest.position.set(0, 0.54, 0.18);
    group.add(crest);

    // Chân mày xếch lưỡi mác (mực nho than dừa)
    const leftBrow = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.045, 0.05), this.materials.theatricalInk);
    leftBrow.position.set(-0.14, 0.18, 0.27);
    leftBrow.rotation.z = 0.38;
    const rightBrow = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.045, 0.05), this.materials.theatricalInk);
    rightBrow.position.set(0.14, 0.18, 0.27);
    rightBrow.rotation.z = -0.38;
    group.add(leftBrow, rightBrow);

    // Đôi mắt xếch kẻ viền tuồng cổ
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.035, 0.04), this.materials.theatricalInk);
    leftEye.position.set(-0.13, 0.09, 0.26);
    leftEye.rotation.z = 0.15;
    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.035, 0.04), this.materials.theatricalInk);
    rightEye.position.set(0.13, 0.09, 0.26);
    rightEye.rotation.z = -0.15;
    group.add(leftEye, rightEye);

    // Mũi sống chạm vát & Môi sơn son
    const noseGeo = new THREE.ConeGeometry(0.075, 0.28, 4);
    const noseMat = new THREE.MeshStandardMaterial({ color: 0xcfb28e, roughness: 0.5 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.05, 0.28);
    nose.rotation.x = 0.28;
    group.add(nose);

    const lip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.045, 0.05), this.materials.tuongLip);
    lip.position.set(0, -0.16, 0.25);
    group.add(lip);

    // Râu ba chòm bằng tơ lụa đen nhánh
    [-0.08, 0, 0.08].forEach((xOffset, idx) => {
      const beardGeo = new THREE.CylinderGeometry(0.012, 0.006, 0.45, 8);
      const beard = new THREE.Mesh(beardGeo, this.materials.silkBeard);
      beard.position.set(xOffset, -0.46, 0.22 - Math.abs(xOffset) * 0.08);
      beard.rotation.z = (idx - 1) * 0.12;
      group.add(beard);
    });

    group.scale.set(0.78, 0.78, 0.78);
    group.position.y = 0.18;
    return group;
  },

  // 2. Tạo Mô Hình Tạm: Bình Gốm Men Rạn Bát Tràng (Lò Bầu Thế Kỷ XVI)
  createCeramicModel() {
    this.initMaterials();
    const group = new THREE.Group();

    // Dáng bình tỳ bà thời Mạc (Lathe Geometry 18 tọa độ đường cong)
    const points = [];
    points.push(new THREE.Vector2(0.24, 0.0));
    points.push(new THREE.Vector2(0.26, 0.05));
    points.push(new THREE.Vector2(0.23, 0.12));
    points.push(new THREE.Vector2(0.27, 0.22));
    points.push(new THREE.Vector2(0.38, 0.40));
    points.push(new THREE.Vector2(0.48, 0.60));
    points.push(new THREE.Vector2(0.50, 0.74));
    points.push(new THREE.Vector2(0.44, 0.90));
    points.push(new THREE.Vector2(0.32, 1.05));
    points.push(new THREE.Vector2(0.22, 1.20));
    points.push(new THREE.Vector2(0.20, 1.38));
    points.push(new THREE.Vector2(0.22, 1.54));
    points.push(new THREE.Vector2(0.28, 1.68));
    points.push(new THREE.Vector2(0.34, 1.76));
    points.push(new THREE.Vector2(0.31, 1.79));
    points.push(new THREE.Vector2(0.24, 1.75));
    points.push(new THREE.Vector2(0.18, 1.62));
    points.push(new THREE.Vector2(0.15, 1.35));

    const latheGeo = new THREE.LatheGeometry(points, 32);
    const vase = new THREE.Mesh(latheGeo, this.materials.crackleCeramic);
    vase.castShadow = true;
    group.add(vase);

    // Đôi tai quai mây đao mác đắp nổi thủ công hai bên cổ bình
    const handleGeo = new THREE.TorusGeometry(0.14, 0.038, 12, 24, Math.PI * 1.2);
    const leftHandle = new THREE.Mesh(handleGeo, this.materials.cloudHandle);
    leftHandle.position.set(-0.25, 1.42, 0);
    leftHandle.rotation.z = Math.PI / 2;

    const rightHandle = new THREE.Mesh(handleGeo, this.materials.cloudHandle);
    rightHandle.position.set(0.25, 1.42, 0);
    rightHandle.rotation.z = -Math.PI / 2;

    group.add(leftHandle, rightHandle);
    group.scale.set(0.62, 0.62, 0.62);
    group.position.y = -0.22;
    return group;
  },

  // 3. Tạo Mô Hình Trưng Bày 3D: Tranh Dân Gian Ngũ Hổ Hàng Trống (Khung Gỗ Sơn Son Thếp Vàng & Mặt Tranh Lụa/Giấy Dó)
  createFolkPaintingModel() {
    this.initMaterials();
    const group = new THREE.Group();

    // 1. Giá Đỡ Tranh Bằng Gỗ Mun / Gỗ Trắc Cổ Điển (Museum Display Easel đặt trên đỉnh trụ đỡ y = 1.95)
    const easelMat = new THREE.MeshStandardMaterial({
      color: 0x24160d,
      roughness: 0.38,
      metalness: 0.25
    });

    // Thanh đỡ ngang dưới chân tranh
    const shelfGeo = new THREE.BoxGeometry(1.18, 0.045, 0.22);
    const shelfMesh = new THREE.Mesh(shelfGeo, easelMat);
    shelfMesh.position.set(0, -0.365, 0);
    shelfMesh.castShadow = true;
    shelfMesh.receiveShadow = true;
    group.add(shelfMesh);

    // Cữ chặn giữ tranh phía trước
    const lipGeo = new THREE.BoxGeometry(1.18, 0.038, 0.025);
    const lipMesh = new THREE.Mesh(lipGeo, new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8 }));
    lipMesh.position.set(0, -0.34, 0.095);
    group.add(lipMesh);

    // Chân chống nghiêng phía sau
    const strutGeo = new THREE.BoxGeometry(0.055, 0.96, 0.04);
    const strutMesh = new THREE.Mesh(strutGeo, easelMat);
    strutMesh.position.set(0, 0.04, -0.18);
    strutMesh.rotation.x = 0.25;
    strutMesh.castShadow = true;
    group.add(strutMesh);

    // 2. Khung Tranh Gỗ Cổ Sơn Son Thếp Vàng (Traditional Ornate Lacquer Frame)
    const frameGroup = new THREE.Group();
    frameGroup.position.set(0, 0.24, 0.02);
    frameGroup.rotation.x = -0.06; // Nghiêng nhẹ ra sau để tạo góc nhìn thưởng lãm tự nhiên

    const frameOuterMat = new THREE.MeshStandardMaterial({
      color: 0x1e1008,
      roughness: 0.38,
      metalness: 0.32
    });
    const crimsonInnerMat = new THREE.MeshStandardMaterial({
      color: 0x6e1a14,
      roughness: 0.45,
      metalness: 0.2
    });
    const goldRimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.26,
      metalness: 0.88
    });

    // Lòng khung giữ đúng tỉ lệ ảnh gốc 1059 × 1302, không kéo méo hay cắt tranh.
    const fw = 0.98, thick = 0.048, border = 0.064;
    const fh = (fw - border * 2 - 0.044) * 1302 / 1059 + border * 2 + 0.044;
    // Thanh trên & dưới
    const fTop = new THREE.Mesh(new THREE.BoxGeometry(fw, border, thick), frameOuterMat);
    fTop.position.set(0, fh / 2 - border / 2, 0);
    const fBot = new THREE.Mesh(new THREE.BoxGeometry(fw, border, thick), frameOuterMat);
    fBot.position.set(0, -fh / 2 + border / 2, 0);
    // Thanh trái & phải
    const fLeft = new THREE.Mesh(new THREE.BoxGeometry(border, fh - border * 2, thick), frameOuterMat);
    fLeft.position.set(-fw / 2 + border / 2, 0, 0);
    const fRight = new THREE.Mesh(new THREE.BoxGeometry(border, fh - border * 2, thick), frameOuterMat);
    fRight.position.set(fw / 2 - border / 2, 0, 0);
    fTop.castShadow = fBot.castShadow = fLeft.castShadow = fRight.castShadow = true;
    frameGroup.add(fTop, fBot, fLeft, fRight);

    // Lớp bo lót sơn son đỏ thẫm bên trong lòng khung
    const matBorder = 0.022;
    const innerW = fw - border * 2;
    const innerH = fh - border * 2;
    const mTop = new THREE.Mesh(new THREE.BoxGeometry(innerW, matBorder, thick * 0.72), crimsonInnerMat);
    mTop.position.set(0, innerH / 2 - matBorder / 2, 0.004);
    const mBot = new THREE.Mesh(new THREE.BoxGeometry(innerW, matBorder, thick * 0.72), crimsonInnerMat);
    mBot.position.set(0, -innerH / 2 + matBorder / 2, 0.004);
    const mLeft = new THREE.Mesh(new THREE.BoxGeometry(matBorder, innerH - matBorder * 2, thick * 0.72), crimsonInnerMat);
    mLeft.position.set(-innerW / 2 + matBorder / 2, 0, 0.004);
    const mRight = new THREE.Mesh(new THREE.BoxGeometry(matBorder, innerH - matBorder * 2, thick * 0.72), crimsonInnerMat);
    mRight.position.set(innerW / 2 - matBorder / 2, 0, 0.004);
    frameGroup.add(mTop, mBot, mLeft, mRight);

    // 4 Góc nẹp đồng mạ vàng chạm nổi
    [[-fw/2 + 0.038, fh/2 - 0.038], [fw/2 - 0.038, fh/2 - 0.038], [-fw/2 + 0.038, -fh/2 + 0.038], [fw/2 - 0.038, -fh/2 + 0.038]].forEach(pos => {
      const cornerMesh = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.078, 0.054), goldRimMat);
      cornerMesh.position.set(pos[0], pos[1], 0.003);
      frameGroup.add(cornerMesh);
    });

    // 4 đường chỉ vàng kim chạy dọc lòng khung
    const goldStripT = new THREE.Mesh(new THREE.BoxGeometry(innerW - matBorder * 2 + 0.012, 0.008, 0.012), goldRimMat);
    goldStripT.position.set(0, (innerH - matBorder * 2) / 2, 0.018);
    const goldStripB = new THREE.Mesh(new THREE.BoxGeometry(innerW - matBorder * 2 + 0.012, 0.008, 0.012), goldRimMat);
    goldStripB.position.set(0, -(innerH - matBorder * 2) / 2, 0.018);
    const goldStripL = new THREE.Mesh(new THREE.BoxGeometry(0.008, innerH - matBorder * 2 + 0.012, 0.012), goldRimMat);
    goldStripL.position.set(-(innerW - matBorder * 2) / 2, 0, 0.018);
    const goldStripR = new THREE.Mesh(new THREE.BoxGeometry(0.008, innerH - matBorder * 2 + 0.012, 0.012), goldRimMat);
    goldStripR.position.set((innerW - matBorder * 2) / 2, 0, 0.018);
    frameGroup.add(goldStripT, goldStripB, goldStripL, goldStripR);

    // 3. Mặt Tranh Dân Gian "Ngũ Hổ" Hàng Trống được dán khít vào lòng khung 3D
    const paintingCanvas = document.createElement('canvas');
    paintingCanvas.width = 1059;
    paintingCanvas.height = 1302;
    const ctx = paintingCanvas.getContext('2d');

    // Nền giấy dó lót ban đầu
    ctx.fillStyle = '#2b3d54';
    ctx.fillRect(0, 0, paintingCanvas.width, paintingCanvas.height);

    // Nạp bức tranh Ngũ Hổ người dùng cung cấp
    const folkImg = new Image();
    folkImg.crossOrigin = 'anonymous';
    folkImg.src = 'assets/van_tuong/folk-art/tranh_ngu_ho_hang_trong.webp';

    const drawPaintingContent = () => {
      try {
        if (folkImg.complete && folkImg.naturalWidth > 0) {
          // Giữ nguyên toàn bộ ảnh, bao gồm thông tin nguồn ở chân tranh.
          ctx.drawImage(folkImg, 0, 0, folkImg.naturalWidth, folkImg.naturalHeight,
            0, 0, paintingCanvas.width, paintingCanvas.height);

          // Viền bo lụa vàng kim mỏng tôn bức tranh trong lòng khung
          ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
          ctx.lineWidth = 10;
          ctx.strokeRect(5, 5, paintingCanvas.width - 10, paintingCanvas.height - 10);
        }

        paintingTex.needsUpdate = true;
      } catch (e) {
        console.warn('Lỗi vẽ canvas tranh Ngũ Hổ:', e);
      }
    };

    const paintingTex = new THREE.CanvasTexture(paintingCanvas);
    if (THREE.SRGBColorSpace) {
      paintingTex.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      paintingTex.encoding = THREE.sRGBEncoding;
    }
    paintingTex.anisotropy = 4;
    folkImg.onload = () => {
      drawPaintingContent();
    };
    drawPaintingContent();

    const paintingMat = new THREE.MeshStandardMaterial({
      map: paintingTex,
      roughness: 0.8,
      metalness: 0
    });

    const paintingPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(innerW - matBorder * 2, innerH - matBorder * 2),
      paintingMat
    );
    paintingPlane.position.z = 0.019;
    frameGroup.add(paintingPlane);

    // Mặt sau: Ván gỗ bồi biểu tranh truyền thống nẹp đai đồng (Wood Backing)
    const backWoodMat = new THREE.MeshStandardMaterial({
      color: 0x2b1c12,
      roughness: 0.85,
      metalness: 0.1
    });
    const backPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(fw - border * 1.2, fh - border * 1.2),
      backWoodMat
    );
    backPlane.rotation.y = Math.PI;
    backPlane.position.z = -thick / 2 + 0.002;
    frameGroup.add(backPlane);

    group.add(frameGroup);

    // Tự động xoay nhẹ nhàng 360 độ trong chế độ ngắm hiện vật
    group.userData = group.userData || {};
    group.userData.baseRotationY = 0;
    group.userData.isFolkPainting = true;

    return group;
  },

  // 4. Tạo Mô Hình Tạm: Án Thư Tiền Nhân (Điện Thờ Tiền Nhân - Màn 4)
  createBrushModel() {
    this.initMaterials();
    const group = new THREE.Group();

    // Bàn án thư bằng gỗ mun thế kỷ XVIII chạm hoa sen
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.45, 0.08, 0.65),
      this.materials.ebonyAltar
    );
    tableTop.position.y = 0;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    group.add(tableTop);

    // 4 chân quỳ chạm nghê
    [[-0.62, -0.22], [0.62, -0.22], [-0.62, 0.22], [0.62, 0.22]].forEach(pos => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.035, 0.44, 8),
        this.materials.ebonyAltar
      );
      leg.position.set(pos[0], -0.24, pos[1]);
      leg.castShadow = true;
      group.add(leg);
    });

    // Nghiên mực đá đen tạc từ đá núi thiêng
    const inkstone = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.05, 0.22),
      this.materials.inkStone
    );
    inkstone.position.set(-0.35, 0.065, 0.05);
    inkstone.castShadow = true;
    group.add(inkstone);

    // Vũng mực chu sa đỏ thắm bên trong nghiên
    const cinnabarPool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.015, 16),
      this.materials.cinnabarInk
    );
    cinnabarPool.position.set(-0.35, 0.092, 0.05);
    group.add(cinnabarPool);

    // Giá gác bút chạm sừng trâu cong
    const restGeo = new THREE.TorusGeometry(0.07, 0.018, 8, 16, Math.PI);
    const brushRest = new THREE.Mesh(restGeo, this.materials.rosewoodStand);
    brushRest.position.set(0.05, 0.06, 0.08);
    brushRest.rotation.x = Math.PI / 2;
    group.add(brushRest);

    // Ngọn Bút Lông Đuôi Chồn ngàn năm thếp vàng
    const brushGroup = new THREE.Group();
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.011, 0.52, 16),
      this.materials.brushBamboo
    );
    handle.rotation.z = Math.PI / 2;
    brushGroup.add(handle);

    // Khâu đồng mạ vàng
    const ferrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.016, 0.04, 16),
      this.materials.goldLeaf
    );
    ferrule.position.x = -0.26;
    ferrule.rotation.z = Math.PI / 2;
    brushGroup.add(ferrule);

    // Ngòi lông chồn nhọn hoắt tẩm mực son
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.016, 0.12, 16),
      this.materials.cinnabarInk
    );
    tip.position.x = -0.34;
    tip.rotation.z = Math.PI / 2;
    brushGroup.add(tip);

    brushGroup.position.set(0.05, 0.095, 0.08);
    brushGroup.rotation.y = 0.18;
    group.add(brushGroup);

    // Bản mộc bí tịch cổ giấy bản mở sẵn
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.03, 0.28),
      this.materials.parchmentBook
    );
    book.position.set(0.42, 0.055, 0.02);
    book.rotation.y = -0.12;
    group.add(book);

    // Lư đồng trầm hương ba chân tỏa khói
    const burner = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.045, 0.09, 12),
      this.materials.bronzeIncense
    );
    burner.position.set(0, 0.085, -0.18);
    group.add(burner);

    // Hào quang chu sa bao bọc án thư
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xf39c12, transparent: true, opacity: 0.6 })
    );
    halo.position.set(0, 0.18, -0.18);
    group.add(halo);

    group.scale.set(0.85, 0.85, 0.85);
    group.position.y = 0.15;
    return group;
  }
};


// ===================================================================
// BẢO TÀNG 3D VẠN TƯỢNG ENGINE CHÍNH (THREE.JS RUNTIME)
// ===================================================================
class VanTuongMuseum3D {
  constructor() {
    this.container = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animId = null;
    this.isActive = false;

    // Tương tác chuột, Raycasting & 360° Inspection Controls
    this.raycaster = null;
    this.mouse = { x: 0, y: 0 };
    this.interactiveObjects = [];
    this.hotspotObjects = [];
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };

    // Điều khiển xoay 360 độ và Zoom an toàn
    this.userOrbitYaw = 0;
    this.userOrbitPitch = 0;
    this.targetOrbitYaw = 0;
    this.targetOrbitPitch = 0;
    this.zoomDistanceFactor = 1.0;
    this.targetZoomFactor = 1.0;
    this.minZoomFactor = 0.72; // Zoom gần nhất: ~1.25m
    this.maxZoomFactor = 1.45; // Zoom xa nhất: ~2.85m
    this.autoRotateArtifact = true;
    this.autoRotateSpeed = 0.0012; // Tốc độ trôi nhẹ nhàng chuẩn bảo tàng di sản

    // Quản lý Camera chuyển động mượt mà (Camera Rail) - Mặc định toàn cảnh sảnh Rotunda (entrance)
    this.currentViewId = 'entrance';
    this.cameraCurrentPos = { x: 0, y: 3.2, z: 11.0 };
    this.cameraTargetPos = { x: 0, y: 3.2, z: 11.0 };
    this.lookCurrentTarget = { x: 0, y: 1.85, z: -7.2 };
    this.lookDesiredTarget = { x: 0, y: 1.85, z: -7.2 };
    this.lerpSpeed = 0.085;

    // Waypoints góc nhìn (Bố cục lồng kính chuẩn bảo tàng quốc tế như ảnh mẫu 6.webp)
    // Cân chỉnh cự ly và độ lệch trục để bảng giám định không che khuất lồng kính
    this.waypoints = {
      entrance: {
        pos: { x: 0, y: 3.2, z: 11.0 },
        target: { x: 0, y: 1.85, z: -7.6 },
        title: 'TIỀN SẢNH BẢO TÀNG VẠN TƯỢNG',
        subtitle: 'Không gian vòm cong Rotunda • Tam Đại Cổ Vật di sản thất truyền'
      },
      mask: {
        pos: { x: -4.2, y: 2.15, z: -2.6 },
        target: { x: -5.2, y: 1.85, z: -7.0 },
        title: 'GIAN TÂY • CHIẾU TUỒNG ĐẶNG GIA',
        subtitle: 'Mặt Nạ Tuồng Tam Diện • Ba trăm năm oan khiên vị trung thần'
      },
      ceramic: {
        pos: { x: 0, y: 2.15, z: -4.0 },
        target: { x: 0, y: 1.85, z: -8.2 },
        title: 'GIAN TRUNG • LÒ BẦU BÁT TRÀNG',
        subtitle: 'Bình Men Rạn Thế Kỷ XVI • Xương đất phù sa & tro trấu nếp cái'
      },
      flute: {
        pos: { x: 4.2, y: 2.15, z: -2.6 },
        target: { x: 5.2, y: 1.85, z: -7.0 },
        title: 'GIAN ĐÔNG • TRANH DÂN GIAN NGŨ HỔ',
        subtitle: 'Tranh Thờ Hàng Trống • Ngũ Phương Thần Hổ trấn trạch phương Đông'
      }
    };

    this.artifactMeshes = {};
    this.spotlights = {};
    this.spotlightTargets = {
      mask: 2.0,
      ceramic: 2.0,
      flute: 2.0
    };

    // Dữ liệu khảo cứu & điểm nhãn 3D Hotspot
    this.hotspotData = {
      mask: [
        {
          id: 'mask_forehead',
          pos: [0, 0.44, 0.28],
          title: 'Trán Son Chu Sa',
          desc: 'Quy ước mặt đỏ chu sa trong nghệ thuật Tuồng biểu trưng cho bậc trung thần tiết liệt. Bột khoáng chu sa nén giữ vệt son không phai nhòa.'
        },
        {
          id: 'mask_eyebrow',
          pos: [-0.16, 0.18, 0.28],
          title: 'Mày Xếch Đao Mác',
          desc: 'Nét mày lưỡi mác chĩa lên trán biểu thị lòng phẫn nộ trước bất công thời loạn, vẽ bằng mực nho cổ pha than lá dừa.'
        },
        {
          id: 'mask_beard',
          pos: [0, -0.42, 0.24],
          title: 'Râu Tơ Ba Chòm',
          desc: 'Tua râu lụa bện từ tơ tằm nhuộm đen nhánh, thể hiện phong thái uy nghiêm của tướng soái trong tuồng cổ Đặng gia.'
        }
      ],
      ceramic: [
        {
          id: 'ceramic_glaze',
          pos: [0, 0.45, 0.35],
          title: 'Men Rạn Tam Thái',
          desc: 'Vết rạn mai rùa huyền bí thế kỷ XVI thời Mạc của nghệ nhân Đặng Huyền Thông, do lớp men tro trấu nếp co ngót tự nhiên khi hạ lửa.'
        },
        {
          id: 'ceramic_handle',
          pos: [0.34, 0.42, 0],
          title: 'Tai Quai Mây Cuộn',
          desc: 'Họa tiết mây đao mác thời Mạc đắp nổi thủ công hai bên cổ bình, thể hiện kỹ thuật đắp chạm nổi đỉnh cao của làng gốm Bát Tràng.'
        },
        {
          id: 'ceramic_body',
          pos: [0, -0.30, 0.45],
          title: 'Cốt Gốm Sa Mốt',
          desc: 'Xương đất phù sa sông Hồng khử chì, nung củi gỗ trong lò bầu trên 1200°C tạo độ đanh chắc ngân vang như chuông đồng.'
        }
      ],
      flute: [
        {
          id: 'flute_diep_paper',
          pos: [0, 0.32, 0.08],
          title: 'Hoàng Hổ Trung Tâm',
          desc: 'Chúa sơn lâm sắc vàng ngự chính giữa thuộc hành Thổ (Trung ương), chân đạp bệ ấn phù chú trấn trạch, ánh mắt uy nghiêm cai quản bốn phương trời đất.'
        },
        {
          id: 'flute_mineral_colors',
          pos: [-0.24, 0.45, 0.08],
          title: 'Ngũ Hành Tứ Phương',
          desc: 'Bốn vị thần hổ chầu bốn góc ứng với Thanh Hổ (Đông - Mộc), Bạch Hổ (Tây - Kim), Xích Hổ (Nam - Hỏa) và Hắc Hổ (Bắc - Thủy) quy tụ giữa vòm mây cổ.'
        },
        {
          id: 'flute_woodblock_carve',
          pos: [0.22, -0.22, 0.08],
          title: 'Kỹ Thuật Cản Màu Hàng Trống',
          desc: 'In nét đen từ ván khắc gỗ rồi dùng cọ mềm vờn chuyển sắc độ (cản màu) bằng tay trên giấy dó bồi, tạo thần thái sống động uy linh độc bản.'
        }
      ],
      brush: [
        {
          id: 'brush_tip',
          pos: [-0.28, 0.12, 0.08],
          title: 'Ngòi Bút Son Chu Sa',
          desc: 'Lông chồn tuyết ngàn năm thấm đẫm mực chu sa, dùng điểm nhãn cho những bức họa thần truyền để mở khóa linh khí trời đất.'
        },
        {
          id: 'brush_inkstone',
          pos: [-0.35, 0.10, 0.05],
          title: 'Nghiên Mực Đá Núi Thiêng',
          desc: 'Nghiên mực tạc từ đá đen nguyên khối đỉnh Yên Tử, giữ cho mực chu sa qua trăm năm không bao giờ đông kết hay phai sắc son.'
        },
        {
          id: 'brush_burner',
          pos: [0, 0.14, -0.18],
          title: 'Lư Đồng Trầm Hương',
          desc: 'Khói trầm thanh khiết xua tan chướng khí ma mị, định thần và soi sáng tâm trí cho người kế nghiệp bước vào cõi họa đồ.'
        }
      ]
    };

    this.onStationChanged = null;
    this.onHotspotClicked = null;
    this.onQualityChanged = null;

    // Cấu hình đồ họa & Tối ưu hiệu năng (Graphics Quality Tiering)
    this.graphicsQuality = 'medium'; // 'auto' | 'high' | 'medium' | 'low'
    this.effectiveTier = 'medium';   // 'high' | 'medium' | 'low'
    this.autoQualityEnabled = true;
    this.fpsSamples = [];
    this.lastFrameTimestamp = performance.now();
    this.lastTierChangeTime = performance.now();
    this.mainDirLight = null;
    this.isFallbackMode = false;

    // Snapshot trạng thái phục vụ Persistent Museum Scene
    this.savedSnapshot = null;
  }

  // Kiểm tra tính tương thích WebGL của thiết bị
  static isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  // ===================================================================
  // 1. KHỞI TẠO THREE.JS WEBGL RENDERER & SCENE
  // ===================================================================
  init(containerElement) {
    if (!VanTuongMuseum3D.isWebGLAvailable()) {
      console.warn('[Bảo Tàng 3D] WebGL không khả dụng trên thiết bị! Tự động kích hoạt chế độ Fallback 2.5D Canvas.');
      this.isFallbackMode = true;
      return this.initFallback2D(containerElement);
    }

    if (!window.THREE) {
      console.error('[Bảo Tàng 3D] Không tìm thấy thư viện Three.js!');
      return false;
    }

    this.container = containerElement;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d0806); // Tông sơn then gỗ trắc sẫm chuẩn Design Tokens (--bg-lacquer)
    this.scene.fog = new THREE.FogExp2(0x0d0806, 0.038);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    this.camera.position.set(
      this.waypoints.entrance.pos.x,
      this.waypoints.entrance.pos.y,
      this.waypoints.entrance.pos.z
    );

    // 3. Renderer & Graphics Tier Config
    const tierCfg = this.getTierConfig(this.effectiveTier);
    this.renderer = new THREE.WebGLRenderer({
      antialias: tierCfg.softShadow,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tierCfg.maxDpr));
    this.renderer.shadowMap.enabled = tierCfg.shadowMap;
    this.renderer.shadowMap.type = tierCfg.softShadow ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 4. Raycaster
    this.raycaster = new THREE.Raycaster();

    // 5. Xây dựng môi trường & hiện vật
    this.setupLighting();
    this.buildMuseumArchitecture();
    this.buildArtifactPavilions();
    this.setupEventListeners();

    // 6. Tự động nạp các file GLB di sản thực tế nếu có sẵn
    this.loadDefaultGLBModels();

    console.log(`[Bảo Tàng 3D] Khởi tạo thành công không gian triển lãm Đại Việt. (Tier: ${this.effectiveTier.toUpperCase()}, DPR: ${this.renderer.getPixelRatio()})`);
    return true;
  }

  // ===================================================================
  // 2. HỆ THỐNG ÁNH SÁNG & ĐÈN RỌI TẬP TRUNG CHIAROSCURO (BẢO TÀNG ĐƯƠNG ĐẠI)
  // Tái hiện nghệ thuật chiếu sáng tĩnh mịch, tập trung vào hiện vật như ảnh mẫu 6.webp
  // Tối ưu hóa: 1-2 shadow passes, ambient tối giản, spotlight góc hẹp
  // ===================================================================
  setupLighting() {
    // Ánh sáng môi trường trầm ấm nhưng sáng rõ theo chuẩn bảo tàng quốc tế (des.docx)
    const ambientLight = new THREE.AmbientLight(0xffecd6, 1.05);
    this.scene.add(ambientLight);

    const tierCfg = this.getTierConfig(this.effectiveTier);
    // Đèn định hướng chính tạo độ sáng & chiều sâu cho toàn bộ không gian bảo tàng
    const mainDirLight = new THREE.DirectionalLight(0xfffaee, 1.15);
    mainDirLight.position.set(4, 16, 8);
    mainDirLight.castShadow = tierCfg.shadowMap;
    mainDirLight.shadow.mapSize.width = tierCfg.shadowSize;
    mainDirLight.shadow.mapSize.height = tierCfg.shadowSize;
    mainDirLight.shadow.bias = -0.001;
    this.scene.add(mainDirLight);
    this.mainDirLight = mainDirLight;

    // Đèn phụ dịu ấm (Soft Fill Light) xóa góc tối sảnh
    const fillLight = new THREE.DirectionalLight(0xffecd6, 0.45);
    fillLight.position.set(-6, 14, 6);
    this.scene.add(fillLight);

    // Hệ thống Đèn Rọi Vách Tường Bích Họa Cung Đình (Perimeter Wall Wash Floodlights)
    const wallLightsConfig = [
      { x: 0, y: 8.8, z: -5.0, tx: 0, ty: 4.8, tz: -18.5, color: 0xfff2dc, intensity: 3.5, angle: Math.PI / 3.4 }, // Trung tâm: Bích họa Cung Điện & Hoành phi
      { x: -5.5, y: 8.5, z: -4.0, tx: -6.5, ty: 4.5, tz: -16.0, color: 0xffe8c8, intensity: 2.6, angle: Math.PI / 3.0 }, // Cánh tả: Chiếu Tuồng & Trúc Vàng
      { x: 5.5, y: 8.5, z: -4.0, tx: 6.5, ty: 4.5, tz: -16.0, color: 0xffe8c8, intensity: 2.6, angle: Math.PI / 3.0 },  // Cánh hữu: Lò Bát Tràng & Hoàng Gia
      { x: -10.0, y: 8.0, z: -1.5, tx: -12.5, ty: 4.2, tz: -11.0, color: 0xffe0b6, intensity: 2.0, angle: Math.PI / 2.8 },
      { x: 10.0, y: 8.0, z: -1.5, tx: 12.5, ty: 4.2, tz: -11.0, color: 0xffe0b6, intensity: 2.0, angle: Math.PI / 2.8 }
    ];
    wallLightsConfig.forEach(cfg => {
      const wSpot = new THREE.SpotLight(cfg.color, cfg.intensity, 30, cfg.angle, 0.5, 1);
      wSpot.position.set(cfg.x, cfg.y, cfg.z);
      wSpot.target.position.set(cfg.tx, cfg.ty, cfg.tz);
      this.scene.add(wSpot);
      this.scene.add(wSpot.target);
    });

    // Đèn rọi Chiaroscuro pin-spotlight từ trần tủ kính xuống từng hiện vật (Vòng cung 3 bệ mở rộng thông thoáng)
    this.setupSpotlight('mask', -5.2, 4.3, -7.0, 0xffded6);
    this.setupSpotlight('ceramic', 0, 4.3, -8.2, 0xe4f8f4);
    this.setupSpotlight('flute', 5.2, 4.3, -7.0, 0xfff0d6);
  }

  setupSpotlight(id, x, y, z, colorHex) {
    // Chùm sáng rọi góc hẹp chiếu thẳng xuống cổ vật trong lồng kính
    const spot = new THREE.SpotLight(colorHex, 3.2, 20, Math.PI / 5.8, 0.38, 1);
    spot.position.set(x, y, z);
    spot.target.position.set(x, 1.85, z);
    spot.castShadow = false; // Chỉ bật khi được chọn ở cấu hình High
    spot.shadow.mapSize.width = 512;
    spot.shadow.mapSize.height = 512;
    spot.shadow.bias = -0.001;
    this.scene.add(spot);
    this.scene.add(spot.target);

    this.spotlights[id] = spot;

    // Đèn phát quang gắn trần tủ kính (Vitrine Downlight Fixture)
    const fixtureMat = new THREE.MeshBasicMaterial({ color: colorHex });
    const fixtureMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.06, 16),
      fixtureMat
    );
    fixtureMesh.position.set(x, y - 0.95, z);
    this.scene.add(fixtureMesh);
  }

  // ===================================================================
  // 3. KIẾN TRÚC PHÒNG VÒNG CUNG BẢO TÀNG (CURVED ROTUNDA GALLERY)
  // Tái hiện 100% không gian triển lãm di sản chuẩn quốc tế như ảnh mẫu 6.webp:
  // Vách tường cong lam gỗ sẫm, dải đèn âm trần hắt sáng vòm, sàn nhám mỹ thuật
  // ===================================================================

  // HÀM SINH HOA VĂN TRỐNG ĐỒNG ĐÔNG SƠN HOÀNG KIM (ZERO-CORS CANVAS TEXTURE)
  // Tạo trực tiếp trên HTML5 Canvas 2D trong RAM - Đảm bảo hiển thị 100% trên mọi môi trường (kể cả file:///)
  // Tái hiện đầy đủ: Ngôi sao mặt trời 14 cánh, 3 vành chim Lạc bay ngược chiều kim đồng hồ,
  // dải răng cưa đối xứng, vòng tròn hạt ngọc, và hoa văn xoắn ốc chữ S đôi theo mẫu Ảnh 22.png.
  createDongSonFloorCanvas() {
    const size = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const cx = size / 2;
    const cy = size / 2;
    const maxRadius = 980;

    // Bảng màu hoàng kim Đông Sơn & nền sơn then bóng
    const GOLD_HI = '#ffe898';
    const GOLD_BRIGHT = '#f5c542';
    const GOLD_MED = '#d4af37';
    const GOLD_DEEP = '#a87e24';
    const LACQUER_DARK = '#0d0704';

    // 1. Nền sơn then bóng bẩy (Radial Lacquer Gradient)
    const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius + 40);
    bgGrad.addColorStop(0, '#24140b');
    bgGrad.addColorStop(0.35, '#190c07');
    bgGrad.addColorStop(0.75, '#100704');
    bgGrad.addColorStop(1, '#080402');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, size, size);

    // Helpers vẽ hoa văn vector
    const drawConcentricRing = (r, width = 2, color = GOLD_MED) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    };

    const drawDottedCirclesBand = (radius, count = 72, circleR = 4, color = GOLD_BRIGHT) => {
      const step = (Math.PI * 2) / count;
      for (let i = 0; i < count; i++) {
        const angle = step * i;
        const bx = cx + radius * Math.cos(angle);
        const by = cy + radius * Math.sin(angle);
        ctx.beginPath();
        ctx.arc(bx, by, circleR, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bx, by, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = GOLD_HI;
        ctx.fill();
      }
    };

    const drawSawtoothBand = (rInner, rOuter, count = 96, pointingIn = false, color = GOLD_MED) => {
      const step = (Math.PI * 2) / count;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < count; i++) {
        const a1 = i * step;
        const a2 = (i + 0.5) * step;
        const a3 = (i + 1.0) * step;
        if (pointingIn) {
          ctx.moveTo(cx + rOuter * Math.cos(a1), cy + rOuter * Math.sin(a1));
          ctx.lineTo(cx + rInner * Math.cos(a2), cy + rInner * Math.sin(a2));
          ctx.lineTo(cx + rOuter * Math.cos(a3), cy + rOuter * Math.sin(a3));
        } else {
          ctx.moveTo(cx + rInner * Math.cos(a1), cy + rInner * Math.sin(a1));
          ctx.lineTo(cx + rOuter * Math.cos(a2), cy + rOuter * Math.sin(a2));
          ctx.lineTo(cx + rInner * Math.cos(a3), cy + rInner * Math.sin(a3));
        }
      }
      ctx.fill();
    };

    const drawSpiralsBand = (radius, count = 64, spiralR = 8, color = GOLD_BRIGHT) => {
      const step = (Math.PI * 2) / count;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < count; i++) {
        const angle = i * step;
        const sx = cx + radius * Math.cos(angle);
        const sy = cy + radius * Math.sin(angle);
        const tanAngle = angle + Math.PI / 2;
        const c1x = sx + spiralR * 0.45 * Math.cos(tanAngle);
        const c1y = sy + spiralR * 0.45 * Math.sin(tanAngle);
        const c2x = sx - spiralR * 0.45 * Math.cos(tanAngle);
        const c2y = sy - spiralR * 0.45 * Math.sin(tanAngle);
        ctx.beginPath();
        ctx.arc(c1x, c1y, 2.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(c2x, c2y, 2.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(c1x, c1y);
        ctx.lineTo(c2x, c2y);
        ctx.stroke();
      }
    };

    const drawChimLacRing = (radius, count = 16, birdScale = 1.0, color = GOLD_BRIGHT) => {
      const step = (Math.PI * 2) / count;
      const rawPts = [
        [35 * birdScale, 2 * birdScale],
        [18 * birdScale, 0],
        [20 * birdScale, 10 * birdScale],
        [12 * birdScale, 3 * birdScale],
        [5 * birdScale, 18 * birdScale],
        [-2 * birdScale, 26 * birdScale],
        [-6 * birdScale, 10 * birdScale],
        [-22 * birdScale, 16 * birdScale],
        [-32 * birdScale, 8 * birdScale],
        [-26 * birdScale, 0],
        [-18 * birdScale, -8 * birdScale],
        [-8 * birdScale, -4 * birdScale],
        [2 * birdScale, -12 * birdScale],
        [8 * birdScale, -4 * birdScale],
        [16 * birdScale, 1 * birdScale]
      ];

      for (let i = 0; i < count; i++) {
        const baseAngle = i * step;
        const forwardAngle = baseAngle + Math.PI / 2;
        const bx = cx + radius * Math.cos(baseAngle);
        const by = cy + radius * Math.sin(baseAngle);
        const fCos = Math.cos(forwardAngle);
        const fSin = Math.sin(forwardAngle);
        const rCos = Math.cos(baseAngle);
        const rSin = Math.sin(baseAngle);

        ctx.beginPath();
        for (let j = 0; j < rawPts.length; j++) {
          const fo = rawPts[j][0];
          const ro = rawPts[j][1];
          const px = bx + fo * fCos + ro * rCos;
          const py = by + fo * fSin + ro * rSin;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = GOLD_HI;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Mắt chim Lạc
        const eyeX = bx + 16 * birdScale * fCos + 2 * birdScale * rCos;
        const eyeY = by + 16 * birdScale * fSin + 2 * birdScale * rCos;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = LACQUER_DARK;
        ctx.fill();
      }
    };

    // 2. Ngôi sao mặt trời 14 cánh ở trung tâm (14-Pointed Solar Star)
    const starROuter = 165;
    const starRInner = 55;
    const numPoints = 14;

    ctx.beginPath();
    for (let i = 0; i < numPoints * 2; i++) {
      const angle = (Math.PI / numPoints) * i - Math.PI / 2;
      const r = (i % 2 === 0) ? starROuter : starRInner;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = GOLD_BRIGHT;
    ctx.fill();
    ctx.strokeStyle = GOLD_HI;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tâm mặt trời tròn nhẵn bên trong
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, Math.PI * 2);
    ctx.fillStyle = GOLD_HI;
    ctx.fill();
    ctx.strokeStyle = GOLD_DEEP;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hoa văn lông công / tam giác giữa các cánh sao
    for (let i = 0; i < numPoints; i++) {
      const aMid = (Math.PI * 2 / numPoints) * (i + 0.5) - Math.PI / 2;
      const pBase1 = [cx + (starRInner + 8) * Math.cos(aMid - 0.12), cy + (starRInner + 8) * Math.sin(aMid - 0.12)];
      const pTip = [cx + (starROuter - 12) * Math.cos(aMid), cy + (starROuter - 12) * Math.sin(aMid)];
      const pBase2 = [cx + (starRInner + 8) * Math.cos(aMid + 0.12), cy + (starRInner + 8) * Math.sin(aMid + 0.12)];
      ctx.beginPath();
      ctx.moveTo(pBase1[0], pBase1[1]);
      ctx.lineTo(pTip[0], pTip[1]);
      ctx.lineTo(pBase2[0], pBase2[1]);
      ctx.closePath();
      ctx.fillStyle = GOLD_DEEP;
      ctx.fill();
      ctx.strokeStyle = GOLD_HI;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 3. Các vành hoa văn đồng tâm Đông Sơn kinh điển
    // Vành 1: Khung bao bọc ngôi sao trung tâm
    drawConcentricRing(175, 3, GOLD_BRIGHT);
    drawSawtoothBand(178, 192, 84, false, GOLD_MED);
    drawConcentricRing(195, 2, GOLD_BRIGHT);
    drawDottedCirclesBand(210, 70, 5, GOLD_BRIGHT);
    drawConcentricRing(225, 2, GOLD_BRIGHT);

    // Vành 2: Vòng xoắn ốc chữ S đôi bên trong
    drawSpiralsBand(245, 64, 7, GOLD_MED);
    drawConcentricRing(262, 3, GOLD_BRIGHT);

    // Vành 3: VÒNG CHIM LẠC BAY NHỎ (16 Chim Lạc)
    drawConcentricRing(270, 2, GOLD_MED);
    drawChimLacRing(320, 16, 0.85, GOLD_BRIGHT);
    drawConcentricRing(375, 2, GOLD_MED);

    // Vành 4: Dải răng cưa đối xứng và vòng tròn hạt cườm
    drawSawtoothBand(380, 396, 96, true, GOLD_MED);
    drawConcentricRing(400, 3, GOLD_BRIGHT);
    drawDottedCirclesBand(416, 84, 5, GOLD_BRIGHT);
    drawConcentricRing(432, 3, GOLD_BRIGHT);
    drawSawtoothBand(435, 452, 108, false, GOLD_MED);
    drawConcentricRing(455, 2, GOLD_BRIGHT);

    // Vành 5: VÒNG CHIM LẠC BAY LỚN (18 Chim Lạc sải cánh uy phong)
    drawConcentricRing(470, 3, GOLD_HI);
    drawChimLacRing(540, 18, 1.25, GOLD_BRIGHT);
    drawConcentricRing(615, 3, GOLD_HI);

    // Vành 6: Vòng xoắn ốc kép tiếp tuyến & sóng nước
    drawSawtoothBand(620, 638, 128, false, GOLD_MED);
    drawConcentricRing(642, 2, GOLD_BRIGHT);
    drawSpiralsBand(660, 88, 8, GOLD_BRIGHT);
    drawConcentricRing(678, 2, GOLD_BRIGHT);
    drawDottedCirclesBand(696, 108, 6, GOLD_BRIGHT);
    drawConcentricRing(714, 3, GOLD_BRIGHT);

    // Vành 7: VÒNG CHIM LẠC NGOẠI VI (20 Chim Lạc giang cánh)
    drawChimLacRing(780, 20, 1.35, GOLD_BRIGHT);
    drawConcentricRing(850, 3, GOLD_HI);

    // Vành 8: Răng cưa tia hướng tâm viền ngoài cùng
    drawSawtoothBand(855, 878, 144, true, GOLD_MED);
    drawConcentricRing(882, 3, GOLD_BRIGHT);
    drawDottedCirclesBand(902, 128, 6, GOLD_HI);
    drawConcentricRing(922, 4, GOLD_HI);
    drawSawtoothBand(926, 952, 160, false, GOLD_MED);
    drawConcentricRing(958, 5, GOLD_HI);
    drawConcentricRing(972, 2, GOLD_DEEP);

    return canvas;
  }

  buildMuseumArchitecture() {
    // 1. Sàn Bảo Tàng Hoa Văn Trống Đồng Đông Sơn Hoàng Gia (Dong Son Bronze Drum Polished Floor)
    // Tự động sinh trực tiếp qua Canvas 2D trong RAM - Đảm bảo Zero-CORS, 100% không bao giờ bị đen sàn trên file:///
    const floorCanvas = this.createDongSonFloorCanvas();
    const floorTex = new THREE.CanvasTexture(floorCanvas);
    if (THREE.SRGBColorSpace) {
      floorTex.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      floorTex.encoding = THREE.sRGBEncoding;
    }

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      emissiveMap: floorTex,
      emissive: new THREE.Color(0xf5a823), // Sắc vàng đồng hoàng gia Đông Sơn phát quang dịu ấm
      emissiveIntensity: 0.28, // Hoa văn phát quang dịu nhẹ
      roughness: 0.38,
      metalness: 0.22,
      transparent: true,
      opacity: 0.50 // Giảm opacity nền sàn bảo tàng còn 50% theo yêu cầu
    });

    // Thử tải thêm tệp ảnh độ phân giải cao nếu môi trường cho phép (Local server/Online)
    try {
      const floorTexLoader = new THREE.TextureLoader();
      floorTexLoader.load('assets/patterns/floor_trong_dong.jpg', (loadedTex) => {
        if (THREE.SRGBColorSpace) {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
        } else if (THREE.sRGBEncoding) {
          loadedTex.encoding = THREE.sRGBEncoding;
        }
        floorMat.map = loadedTex;
        floorMat.emissiveMap = loadedTex;
        floorMat.needsUpdate = true;
      }, undefined, () => {});
    } catch (e) {}

    // Mặt sàn Trống Đồng Đông Sơn bao phủ trọn vẹn đại sảnh vòm Rotunda
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 36),
      floorMat
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -3.5);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Sàn nền tối mở rộng bao quanh đại sảnh
    const outerFloorMat = new THREE.MeshStandardMaterial({
      color: 0x120a06,
      roughness: 0.85,
      metalness: 0.08
    });
    const outerFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      outerFloorMat
    );
    outerFloor.rotation.x = -Math.PI / 2;
    outerFloor.position.set(0, -0.01, -3.5);
    outerFloor.receiveShadow = true;
    this.scene.add(outerFloor);

    // 2. Vách Vòng Cung Bảo Tàng Di Sản (Rotunda Curved Wall) - Bảng Màu DMC & Hoa Văn Cung Đình (des.docx)
    // Tích hợp toàn diện 4 tác phẩm từ des.docx: image7 (Hoa Sen), image8 (Cung Điện), image9 (Trúc Vàng), image10 (Gấm Mây Cát Tường)
    // Tương thích 100% file:/// và Chrome qua dữ liệu Base64 Zero-CORS
    const wallSrc = (window.VT_TEXTURES && window.VT_TEXTURES.wallMural)
      ? window.VT_TEXTURES.wallMural
      : 'assets/patterns/museum_wall_mural_opt.jpg';

    const wallTexLoader = new THREE.TextureLoader();
    const wallTex = wallTexLoader.load(wallSrc);
    wallTex.wrapS = THREE.RepeatWrapping;
    wallTex.wrapT = THREE.ClampToEdgeWrapping;
    wallTex.repeat.set(-1, 1);
    wallTex.offset.set(1, 0);
    if (THREE.SRGBColorSpace) {
      wallTex.colorSpace = THREE.SRGBColorSpace;
    } else if (THREE.sRGBEncoding) {
      wallTex.encoding = THREE.sRGBEncoding;
    }

    const rotundaGeo = new THREE.CylinderGeometry(
      15.5, 15.5, 9.4, 64, 1, true,
      Math.PI * 0.28, Math.PI * 1.44
    );
    const rotundaMat = new THREE.MeshStandardMaterial({
      map: wallTex,
      side: THREE.BackSide,
      roughness: 0.55,
      metalness: 0.05,
      emissive: new THREE.Color(0x4a2216),
      emissiveIntensity: 0.32,
      transparent: true,
      opacity: 0.88 // Tường vòm sáng rõ, tôn vinh bích họa hoàng thành
    });
    const rotundaWall = new THREE.Mesh(rotundaGeo, rotundaMat);
    rotundaWall.position.set(0, 4.7, -3.5);
    rotundaWall.receiveShadow = true;
    this.scene.add(rotundaWall);

    // 3. Dải đèn âm trần hắt sáng vòng cung (Curved Cove Light Fixture)
    const coveLightGeo = new THREE.TorusGeometry(15.42, 0.12, 8, 64, Math.PI * 1.44);
    const coveLightMat = new THREE.MeshBasicMaterial({ color: 0xffe2a4 });
    const coveLightMesh = new THREE.Mesh(coveLightGeo, coveLightMat);
    coveLightMesh.rotation.x = Math.PI / 2;
    coveLightMesh.rotation.z = Math.PI * 0.78;
    coveLightMesh.position.set(0, 9.35, -3.5);
    this.scene.add(coveLightMesh);

    // Vòm trần kiến trúc (Ceiling Soffit Ring)
    const ceilingGeo = new THREE.RingGeometry(13.8, 16.2, 64, 1, Math.PI * 0.28, Math.PI * 1.44);
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x1f140e, side: THREE.DoubleSide, roughness: 0.75 });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.rotation.x = Math.PI / 2;
    ceilingMesh.position.set(0, 9.4, -3.5);
    this.scene.add(ceilingMesh);

    // 4. Hệ Cột Gỗ Lim sẫm & Chân Tảng Đá Kê Cột Hoa Sen nép sát hai bên tường (x = ±7.6)
    const columnPositions = [
      [-7.6, 2], [7.6, 2],
      [-7.6, -3], [7.6, -3],
      [-7.6, -8], [7.6, -8],
      [-7.6, -12], [7.6, -12]
    ];

    const columnMat = new THREE.MeshStandardMaterial({ color: 0x22130a, roughness: 0.45, metalness: 0.1 });
    const stoneBaseMat = new THREE.MeshStandardMaterial({ color: 0x3d352e, roughness: 0.85, metalness: 0.05 });

    columnPositions.forEach(pos => {
      const stoneBase = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.68, 0.35, 8), stoneBaseMat);
      stoneBase.position.set(pos[0], 0.18, pos[1]);
      stoneBase.receiveShadow = true;
      this.scene.add(stoneBase);

      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 7.5, 16), columnMat);
      col.position.set(pos[0], 4.1, pos[1]);
      col.castShadow = true;
      col.receiveShadow = true;
      this.scene.add(col);
    });
  }

  // ===================================================================
  // 4. BỐN BỆ TRƯNG BÀY THEO VÒNG CUNG VƯƠNG GIẢ (CRESCENT GALLERY ARC)
  // Tầm nhìn thông thoáng 100%, không bị che khuất, tích hợp Án Thư Tiền Nhân
  // ===================================================================
  buildArtifactPavilions() {
    this.interactiveObjects = [];
    this.hotspotObjects = [];

    // --- BỆ 1: GIAN TÂY • MẶT NẠ TUỒNG TAM DIỆN (MÀN 1) ---
    this.createExhibitionStation({
      id: 'mask',
      x: -5.2,
      y: 0,
      z: -7.0,
      rotY: 0.32,
      pedestalColor: 0x3d2015,
      bannerColor: 0xa81c22, // Đỏ chu sa chuẩn DMC 321
      bannerText: 'MẶT NẠ TUỒNG TAM DIỆN',
      dynastyText: 'Chiếu Tuồng Đặng Gia • TK XVIII',
      createMesh: () => new THREE.Group() // Chờ nạp trực tiếp model GLB chất lượng cao
    });

    // --- BỆ 2: GIAN TRUNG TÂM • BÌNH GỐM MEN RẠN BÁT TRÀNG (MÀN 2) ---
    this.createExhibitionStation({
      id: 'ceramic',
      x: 0,
      y: 0,
      z: -8.2,
      rotY: 0.0,
      pedestalColor: 0x203530,
      bannerColor: 0x16a085,
      bannerText: 'BÌNH GỐM MEN RẠN',
      dynastyText: 'Lò Bầu Bát Tràng • TK XVI',
      createMesh: () => new THREE.Group() // Chờ nạp trực tiếp model GLB chất lượng cao
    });

    // --- BỆ 3: GIAN ĐÔNG • TRANH DÂN GIAN NGŨ HỔ HÀNG TRỐNG (MÀN 3) ---
    this.createExhibitionStation({
      id: 'flute',
      x: 5.2,
      y: 0,
      z: -7.0,
      rotY: -0.32,
      pedestalColor: 0x3b301b,
      bannerColor: 0xb38822,
      bannerText: 'TRANH DÂN GIAN NGŨ HỔ',
      dynastyText: 'Hàng Trống • Thăng Long',
      createMesh: () => ArtifactAssetFactory.createFolkPaintingModel()
    });
  }

  createExhibitionStation(cfg) {
    const group = new THREE.Group();
    group.position.set(cfg.x, cfg.y, cfg.z);
    if (cfg.rotY) group.rotation.y = cfg.rotY;

    // ===================================================================
    // TỦ KÍNH BẢO TÀNG HIỆN ĐẠI (MUSEUM VITRINE DISPLAY CASE)
    // Thiết kế theo đúng nguyên mẫu ảnh 6.webp:
    // Chân bệ đồng hun thanh mảnh, lồng kính cường lực 4 mặt trong suốt,
    // Trụ đỡ tối giản tôn vinh cổ vật, biển đồng bảo tàng ngả góc 20°
    // ===================================================================

    // 1. Chân Bệ Đế Vitrine (Plinth Base)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x18120d,
      roughness: 0.55,
      metalness: 0.45
    });
    const plinthMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.60, 0.26, 1.60),
      baseMat
    );
    plinthMesh.position.y = 0.13;
    plinthMesh.receiveShadow = true;
    group.add(plinthMesh);

    // Đệm chân thụt lề (Shadow gap foot)
    const skirtMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.46, 0.06, 1.46),
      new THREE.MeshStandardMaterial({ color: 0x0e0a07, roughness: 0.8 })
    );
    skirtMesh.position.y = 0.03;
    group.add(skirtMesh);

    // Vầng sáng dịu nhẹ dưới chân bục kính
    const haloMesh = new THREE.Mesh(
      new THREE.RingGeometry(1.15, 1.45, 32),
      new THREE.MeshBasicMaterial({
        color: cfg.bannerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35
      })
    );
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = 0.015;
    group.add(haloMesh);

    // 2. Trụ Đỡ Cổ Vật Bên Trong Lồng Kính (Slender Internal Pedestal Stand)
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x22150d,
      roughness: 0.42,
      metalness: 0.15
    });
    const pedestalColumn = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 1.36, 0.48),
      pedestalMat
    );
    pedestalColumn.position.y = 0.94;
    pedestalColumn.castShadow = true;
    pedestalColumn.receiveShadow = true;
    group.add(pedestalColumn);

    // Cổ nẹp chỉ vàng kim trên đỉnh trụ đỡ
    const collarMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.04, 0.54),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.28, metalness: 0.85 })
    );
    collarMesh.position.y = 1.63;
    collarMesh.castShadow = true;
    group.add(collarMesh);

    // 3. Khung Thép Đồng Hun Tủ Kính (Bronze Mullions & Framing)
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x15100b,
      metalness: 0.88,
      roughness: 0.22
    });

    // 4 Cột góc lồng kính
    const mullionGeo = new THREE.BoxGeometry(0.032, 2.30, 0.032);
    const cornerOffsets = [
      [-0.68, -0.68], [0.68, -0.68],
      [-0.68, 0.68], [0.68, 0.68]
    ];
    cornerOffsets.forEach(pt => {
      const col = new THREE.Mesh(mullionGeo, frameMat);
      col.position.set(pt[0], 2.05, pt[1]);
      col.castShadow = true;
      group.add(col);
    });

    // Thanh giằng ngang dưới chân kính
    const railXGeo = new THREE.BoxGeometry(1.36, 0.032, 0.032);
    const railZGeo = new THREE.BoxGeometry(0.032, 0.032, 1.36);
    [-0.68, 0.68].forEach(z => {
      const rxBot = new THREE.Mesh(railXGeo, frameMat);
      rxBot.position.set(0, 0.91, z);
      const rxTop = new THREE.Mesh(railXGeo, frameMat);
      rxTop.position.set(0, 3.19, z);
      group.add(rxBot, rxTop);
    });
    [-0.68, 0.68].forEach(x => {
      const rzBot = new THREE.Mesh(railZGeo, frameMat);
      rzBot.position.set(x, 0.91, 0);
      const rzTop = new THREE.Mesh(railZGeo, frameMat);
      rzTop.position.set(x, 3.19, 0);
      group.add(rzBot, rzTop);
    });

    // Hộp Nóc Tủ Kính Tích Hợp Đèn Âm Trần (Top Canopy Box)
    const canopyMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.48, 0.14, 1.48),
      frameMat
    );
    canopyMesh.position.y = 3.26;
    canopyMesh.castShadow = true;
    group.add(canopyMesh);

    // 4 Mắt đèn LED âm trần siêu nhỏ phát sáng vàng ấm
    const miniLightMat = new THREE.MeshBasicMaterial({ color: 0xffecc4 });
    const miniLightGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12);
    [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]].forEach(pt => {
      const mLight = new THREE.Mesh(miniLightGeo, miniLightMat);
      mLight.position.set(pt[0], 3.18, pt[1]);
      group.add(mLight);
    });

    // 4. Lớp Kính Cường Lực Bảo Tàng Trong Suốt (Crystal Clear Museum Glass - Theo ref image6.png)
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xf5f8ff,
      transparent: true,
      opacity: 0.12, // Tăng độ trong suốt, quan sát hiện vật rõ ràng từ mọi góc
      roughness: 0.04,
      metalness: 0.15,
      depthWrite: false
    });

    // Mặt kính trước & sau
    const glassFBGeo = new THREE.PlaneGeometry(1.33, 2.24);
    const glassFront = new THREE.Mesh(glassFBGeo, glassMat);
    glassFront.position.set(0, 2.05, 0.68);
    const glassBack = new THREE.Mesh(glassFBGeo, glassMat);
    glassBack.position.set(0, 2.05, -0.68);
    group.add(glassFront, glassBack);

    // Mặt kính trái & phải
    const glassLRGeo = new THREE.PlaneGeometry(1.33, 2.24);
    const glassLeft = new THREE.Mesh(glassLRGeo, glassMat);
    glassLeft.rotation.y = Math.PI / 2;
    glassLeft.position.set(-0.68, 2.05, 0);
    const glassRight = new THREE.Mesh(glassLRGeo, glassMat);
    glassRight.rotation.y = Math.PI / 2;
    glassRight.position.set(0.68, 2.05, 0);
    group.add(glassLeft, glassRight);

    // ===================================================================
    // 5. BIỂN TÊN ĐỒNG ĐẠI VIỆT (GẮN MẶT TRƯỚC BỆ CHÂN ĐẾ)
    // Thiết kế bệ kim loại thanh lịch ngả góc 20° chuẩn bảo tàng quốc tế
    // ===================================================================
    const plaqueGroup = new THREE.Group();

    // Khung kim loại đồng thau oxy hóa
    const plaqueBacking = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 0.28, 0.035),
      new THREE.MeshStandardMaterial({ color: 0x22150c, roughness: 0.35, metalness: 0.78 })
    );
    plaqueBacking.castShadow = true;
    plaqueGroup.add(plaqueBacking);

    const plaqueFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.76, 0.32, 0.018),
      new THREE.MeshStandardMaterial({ color: 0x5a3e1b, roughness: 0.28, metalness: 0.85 })
    );
    plaqueFrame.position.z = -0.01;
    plaqueGroup.add(plaqueFrame);

    // Mặt biển đồng khắc chữ độ nét cao (1024x384)
    const plateCanvas = document.createElement('canvas');
    plateCanvas.width = 1024;
    plateCanvas.height = 384;
    const pctx = plateCanvas.getContext('2d');

    pctx.fillStyle = '#140c06';
    pctx.fillRect(0, 0, 1024, 384);

    // Viền kim loại mạ vàng
    pctx.strokeStyle = '#c69c3a';
    pctx.lineWidth = 10;
    pctx.strokeRect(14, 14, 996, 356);
    pctx.strokeStyle = '#fcd55c';
    pctx.lineWidth = 3;
    pctx.strokeRect(28, 28, 968, 328);

    // 4 góc hoa văn chữ Vạn
    pctx.fillStyle = '#fcd55c';
    pctx.font = '32px serif';
    pctx.fillText('❖', 56, 72);
    pctx.fillText('❖', 968, 72);
    pctx.fillText('❖', 56, 336);
    pctx.fillText('❖', 968, 336);

    // Tựa đề cổ vật (Phông serif uy nghiêm chuẩn tiếng Việt)
    pctx.fillStyle = '#fcd55c';
    pctx.font = 'bold 54px "Playfair Display", "Lora", serif';
    pctx.textAlign = 'center';
    pctx.fillText(cfg.bannerText, 512, 175);

    // Xuất xứ & Niên đại
    pctx.fillStyle = '#e8b84d';
    pctx.font = '36px "Lora", "Playfair Display", serif';
    pctx.fillText(cfg.dynastyText, 512, 275);

    const plateTex = new THREE.CanvasTexture(plateCanvas);
    plateTex.anisotropy = 4;
    const plateMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.70, 0.26),
      new THREE.MeshBasicMaterial({ map: plateTex })
    );
    plateMesh.position.z = 0.022;
    plaqueGroup.add(plateMesh);

    // Gắn biển tên tại mặt trước chân bục kính, ngả 22° chuẩn tầm nhìn
    plaqueGroup.position.set(0, 0.38, 0.82);
    plaqueGroup.rotation.x = -Math.PI * 0.12;
    group.add(plaqueGroup);

    // 6. Hiện vật 3D (Cấp độ 1 Procedural đặt trên đỉnh trụ đỡ y = 1.95)
    const artifactMesh = cfg.createMesh();
    artifactMesh.position.y = 1.95;
    artifactMesh.castShadow = true;
    group.add(artifactMesh);

    this.artifactMeshes[cfg.id] = artifactMesh;

    // PHONG ẤN THẦN BÍ CHO BỆ ÁN THƯ HẬU CUNG (MÀN 4 - MỞ KHI ĐỦ 3 CỔ VẬT)
    if (cfg.id === 'brush') {
      const sealGroup = new THREE.Group();
      sealGroup.position.y = 2.1;

      // Vòm năng lượng phong ấn bán cầu
      const domeGeo = new THREE.SphereGeometry(1.65, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58);
      const domeMat = new THREE.MeshBasicMaterial({
        color: 0xa81c22,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const domeMesh = new THREE.Mesh(domeGeo, domeMat);
      sealGroup.add(domeMesh);

      // Vòng ấn phù cổ xoay ngang
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(1.45, 0.025, 8, 36),
        new THREE.MeshBasicMaterial({ color: 0xf5a823, transparent: true, opacity: 0.75 })
      );
      ring1.rotation.x = Math.PI / 2;

      // Vòng ấn phù cổ xoay nghiêng
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(1.3, 0.02, 8, 36),
        new THREE.MeshBasicMaterial({ color: 0xa81c22, transparent: true, opacity: 0.65 })
      );
      ring2.rotation.x = Math.PI / 3;

      sealGroup.add(ring1, ring2);
      group.add(sealGroup);
      this.brushSealGroup = sealGroup;
      this.brushSealRings = [ring1, ring2];
      this.brushDomeMesh = domeMesh;
    }

    // Gắn metadata nhận diện click cho toàn bộ khối tủ kính
    group.userData = {
      isArtifactStation: true,
      stationId: cfg.id,
      title: cfg.bannerText,
      dynasty: cfg.dynastyText
    };

    plinthMesh.userData = group.userData;
    pedestalColumn.userData = group.userData;
    plaqueBacking.userData = group.userData;
    this.interactiveObjects.push(plinthMesh, pedestalColumn, plaqueBacking);

    // Gắn các điểm nhãn 3D Hotspot lên hiện vật
    this.attachHotspots(artifactMesh, cfg.id);

    this.scene.add(group);
  }

  // ===================================================================
  // 5. HỆ THỐNG ĐIỂM NHÃN 3D HOTSPOT TRÊN HIỆN VẬT
  // ===================================================================
  attachHotspots(parentGroup, stationId, isStationGroup = false) {
    const list = this.hotspotData[stationId] || [];
    list.forEach(item => {
      const pinGroup = new THREE.Group();
      // Nếu parentGroup là stationGroup (tủ kính), vị trí Y cộng thêm chiều cao bệ (1.95m)
      const posY = isStationGroup ? (item.pos[1] + 1.95) : item.pos[1];
      pinGroup.position.set(item.pos[0], posY, item.pos[2]);

      // Hạt ngọc vàng phát sáng
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.042, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xfcd55c })
      );
      pinGroup.add(bead);

      // Vòng halo son nhịp thở
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.065, 0.085, 16),
        new THREE.MeshBasicMaterial({
          color: 0xa81c22, // Đỏ chu sa chuẩn DMC 321
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85
        })
      );
      pinGroup.add(ring);

      pinGroup.userData = {
        isHotspot: true,
        stationId: stationId,
        info: item,
        ringMesh: ring
      };

      bead.userData = pinGroup.userData;
      ring.userData = pinGroup.userData;

      this.interactiveObjects.push(bead, ring);
      this.hotspotObjects.push(pinGroup);

      parentGroup.add(pinGroup);
    });
  }

  // ===================================================================
  // 6. CẤP ĐỘ 2 – HỆ THỐNG TẢI MODEL GLB KÉP (DIRECT GLB + BASE64 ZERO CORS)
  // Đảm bảo 100% hiển thị đầy đủ cả 3 mô hình trên cả HTTP server và file:///
  // ===================================================================
  loadStationModelOnDemand(stationId) {
    // Trạm 'flute' nay là Tranh Dân Gian Đông Hồ (đã dựng 3D trực tiếp trong createFolkPaintingModel)
    const glbConfigs = {
      mask: { id: 'mask', path: 'models/mask.glb', b64Keys: ['VT_GLB_MASK', 'VT_MODEL_MASK_B64'], script: 'models/mask-data.js' },
      ceramic: { id: 'ceramic', path: 'models/ceramic.glb', b64Keys: ['VT_GLB_CERAMIC', 'VT_MODEL_CERAMIC_B64'], script: 'models/ceramic-data.js' }
    };

    const cfg = glbConfigs[stationId];
    if (!cfg) return;

    // Kiểm tra xem trạm này đã được nạp GLB thực tế chưa (Session Cache)
    const current = this.artifactMeshes[cfg.id];
    if (current && current.userData && current.userData.isGLTFModel) return;

    // 1. Kiểm tra Base64 có sẵn trong window
    for (const k of cfg.b64Keys) {
      if (window[k]) {
        const dataUri = 'data:application/octet-stream;base64,' + window[k];
        this.loadGLBModel(cfg.id, dataUri);
        return;
      }
    }

    // 2. Thử nạp qua web server (http: hoặc https:)
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      this.loadGLBModel(cfg.id, cfg.path, null, () => {
        this.loadModelScriptDynamically(cfg);
      });
    } else {
      this.loadModelScriptDynamically(cfg);
    }
  }

  loadModelScriptDynamically(cfg) {
    if (this._loadingScripts && this._loadingScripts[cfg.id]) return;
    this._loadingScripts = this._loadingScripts || {};
    this._loadingScripts[cfg.id] = true;

    const script = document.createElement('script');
    script.src = cfg.script;
    script.onload = () => {
      for (const k of cfg.b64Keys) {
        if (window[k]) {
          const dataUri = 'data:application/octet-stream;base64,' + window[k];
          this.loadGLBModel(cfg.id, dataUri);
          break;
        }
      }
    };
    document.head.appendChild(script);
  }

  loadDefaultGLBModels() {
    // Trạm 'flute' sử dụng mô hình 3D Tranh Dân Gian Đông Hồ đã tạo sẵn
    const glbConfigs = [
      { id: 'mask', path: 'models/mask.glb', b64Keys: ['VT_GLB_MASK', 'VT_MODEL_MASK_B64'], script: 'models/mask-data.js' },
      { id: 'ceramic', path: 'models/ceramic.glb', b64Keys: ['VT_GLB_CERAMIC', 'VT_MODEL_CERAMIC_B64'], script: 'models/ceramic-data.js' }
    ];

    glbConfigs.forEach(cfg => {
      // 1. Ưu tiên nạp ngay từ Base64 nhúng sẵn (Zero CORS, 100% hiển thị cả trên file:///)
      let hasB64 = false;
      for (const k of cfg.b64Keys) {
        if (window[k]) {
          const dataUri = 'data:application/octet-stream;base64,' + window[k];
          this.loadGLBModel(cfg.id, dataUri);
          hasB64 = true;
          break;
        }
      }
      if (hasB64) return;

      // 2. Nếu chạy qua web server, nạp trực tiếp file .glb
      if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
        this.loadGLBModel(cfg.id, cfg.path, null, () => {
          this.loadModelScriptDynamically(cfg);
        });
      } else {
        this.loadStationModelOnDemand(cfg.id);
      }
    });
  }

  loadGLBModel(stationId, url, onLoadSuccess, onLoadError) {
    if (!window.THREE || !window.THREE.GLTFLoader) {
      console.warn('[Bảo Tàng 3D] THREE.GLTFLoader chưa sẵn sàng trên trang!');
      return;
    }

    const loader = new window.THREE.GLTFLoader();
    const sourceLabel = url.startsWith('data:') ? '[Dữ liệu nhúng Base64 - Zero CORS]' : url;
    console.log(`[Bảo Tàng 3D] Đang tải model GLB cho ${stationId} từ: ${sourceLabel}...`);

    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene || gltf.scenes[0];
        if (!model) return;
        model.userData = model.userData || {};
        model.userData.isGLTFModel = true;

        // Xử lý góc xoay đặc thù từng hiện vật
        if (stationId === 'ceramic') {
          // Khắc phục lỗi trục xoay -90 độ Z-up từ Sketchfab của bình gốm Bát Tràng
          model.traverse((child) => {
            if (child.name === 'Sketchfab_model' && Math.abs(child.rotation.x + Math.PI / 2) < 0.2) {
              child.rotation.x = 0;
            }
          });
          // Xoay nhẹ góc Y để hoa văn men rạn hướng về phía người xem
          model.userData.baseRotationY = 0.25;
          model.rotation.y = 0.25;
        } else if (stationId === 'flute') {
          // Xoay góc 3/4 (-36 độ) để người xem ngắm trọn vẹn lưng trâu, mục đồng và ống tiêu
          model.userData.baseRotationY = -Math.PI / 5;
          model.rotation.y = -Math.PI / 5;
        } else {
          model.userData.baseRotationY = 0;
        }

        // Cập nhật ma trận thế giới sau khi xoay để tính Box3 chính xác
        model.updateMatrixWorld(true);

        // Kích thước chuẩn hóa tối ưu cho từng hiện vật bên trong lồng kính (vitrine cao 1.55m)
        let targetSize = 1.15;
        if (stationId === 'mask') targetSize = 1.05;
        else if (stationId === 'ceramic') targetSize = 1.18;
        else if (stationId === 'flute') targetSize = 1.45; // Chiều dài trâu 1.45m cho chiều cao ~0.70m cân đối

        // Tính toán Bounding Box và scale tự động
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = targetSize / (maxDim || 1);
        model.scale.set(scale, scale, scale);

        // Cập nhật lại Box sau khi scale
        model.updateMatrixWorld(true);
        box.setFromObject(model);
        box.getSize(size);
        box.getCenter(center);

        // Canh tâm model đúng trục bệ thờ X, Z
        model.position.x = -center.x;
        model.position.z = -center.z;

        // Canh đáy mô hình tiếp giáp chuẩn xác mặt trên bệ gỗ trắc (y = 1.65m)
        const pedestalTop = (stationId === 'mask') ? 1.70 : 1.65;
        model.position.y += (pedestalTop - box.min.y);

        // Bật bóng đổ mềm và tối ưu vật liệu
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => {
                  m.roughness = Math.min(0.85, m.roughness || 0.45);
                });
              } else {
                child.material.roughness = Math.min(0.85, child.material.roughness || 0.45);
              }
            }
          }
        });

        // Dọn dẹp model cũ và các điểm hotspot cũ để tránh rò rỉ bộ nhớ
        const oldMesh = this.artifactMeshes[stationId];
        let parentGroup = null;
        if (oldMesh) {
          // Xóa các hotspot cũ khỏi danh sách tương tác
          this.interactiveObjects = this.interactiveObjects.filter(obj => {
            return !obj.userData || obj.userData.stationId !== stationId || !obj.userData.isHotspot;
          });
          this.hotspotObjects = this.hotspotObjects.filter(pin => {
            return !pin.userData || pin.userData.stationId !== stationId;
          });

          // Giải phóng hình học và vật liệu cũ
          oldMesh.traverse((child) => {
            if (child.isMesh) {
              if (child.geometry) child.geometry.dispose();
              if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
              }
            }
          });

          if (oldMesh.parent) {
            parentGroup = oldMesh.parent;
            parentGroup.remove(oldMesh);
            parentGroup.add(model);
          }
        }

        // Gắn lại các điểm nhãn 3D Hotspot lên station parent (đảm bảo không bị méo/phóng to bởi scale của GLB)
        const hotspotAnchor = parentGroup || model;
        this.attachHotspots(hotspotAnchor, stationId, !!parentGroup);
        this.artifactMeshes[stationId] = model;

        if (this.renderer && this.renderer.shadowMap) {
          this.renderer.shadowMap.needsUpdate = true;
        }

        console.log(`[Bảo Tàng 3D] Đã tích hợp thành công model GLB cho ${stationId}!`);
        if (typeof onLoadSuccess === 'function') onLoadSuccess(model);
      },
      undefined,
      (err) => {
        console.error(`[Bảo Tàng 3D] Không thể tải file GLB từ ${url}:`, err);
        if (typeof onLoadError === 'function') onLoadError(err);
      }
    );
  }

  // Hỗ trợ tải trực tiếp File GLB từ máy tính người dùng (không cần web server)
  loadGLBFromFile(stationId, fileObject, onLoadSuccess, onLoadError) {
    if (!fileObject) return;
    const blobUrl = URL.createObjectURL(fileObject);
    this.loadGLBModel(stationId, blobUrl, (model) => {
      URL.revokeObjectURL(blobUrl);
      if (typeof onLoadSuccess === 'function') onLoadSuccess(model);
    }, (err) => {
      URL.revokeObjectURL(blobUrl);
      if (typeof onLoadError === 'function') onLoadError(err);
    });
  }

  // ===================================================================
  // 7. SỰ KIỆN TƯƠNG TÁC CHUỘT: RAYCASTING, 360° ORBIT & CLAMPED ZOOM
  // ===================================================================
  setupEventListeners() {
    if (this.boundWindowResize) {
      window.removeEventListener('resize', this.boundWindowResize);
    }
    if (this.boundWindowMouseUp) {
      window.removeEventListener('mouseup', this.boundWindowMouseUp);
    }

    this.boundWindowResize = () => this.onWindowResize();
    window.addEventListener('resize', this.boundWindowResize);

    const dom = this.renderer.domElement;
    dom.style.cursor = 'grab';

    let dragDistance = 0;

    // 1. Nhấn chuột trái (MouseDown) để bắt đầu xoay 360°
    dom.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Chỉ nhận chuột trái
      this.isDragging = true;
      dragDistance = 0;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
      this.autoRotateArtifact = false; // Tạm dừng tự xoay khi người dùng chủ động điều khiển
      clearTimeout(this.resumeRotateTimer);
      dom.style.cursor = 'grabbing';

      const card = document.getElementById('museumInspectionCard');
      if (card) {
        card.classList.add('card-dimmed');
      }
    });

    // 2. Nhả chuột (MouseUp) kết thúc thao tác xoay
    this.boundWindowMouseUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        dom.style.cursor = 'grab';
        const card = document.getElementById('museumInspectionCard');
        if (card) {
          card.classList.remove('card-dimmed');
        }
        // Sau 3 giây người dùng dừng kéo, tự động xoay nhẹ nhàng tiếp tục
        clearTimeout(this.resumeRotateTimer);
        this.resumeRotateTimer = setTimeout(() => {
          this.autoRotateArtifact = true;
        }, 3000);
      }
    };
    window.addEventListener('mouseup', this.boundWindowMouseUp);

    // Bắt sự kiện kéo chuột mượt mà ngay cả khi con trỏ lướt ra ngoài canvas
    this.boundWindowMouseMove = (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        dragDistance += Math.hypot(deltaX, deltaY);

        if (this.currentViewId !== 'entrance') {
          // Xoay 360 độ hiện vật theo trục Y
          this.targetOrbitYaw += deltaX * 0.015;
          this.targetOrbitPitch = Math.max(-0.35, Math.min(0.35, this.targetOrbitPitch + deltaY * 0.008));
        } else {
          // Ở tiền sảnh: xoay nhẹ góc nhìn toàn cảnh
          this.targetOrbitYaw += deltaX * 0.008;
        }
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener('mousemove', this.boundWindowMouseMove);

    // 3. Kéo chuột để xoay 360 độ quanh hiện vật
    dom.addEventListener('mousemove', (e) => {
      const rect = dom.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        dragDistance += Math.hypot(deltaX, deltaY);

        if (this.currentViewId !== 'entrance') {
          // Xoay 360 độ hiện vật theo trục Y
          this.targetOrbitYaw += deltaX * 0.015;
          this.targetOrbitPitch = Math.max(-0.35, Math.min(0.35, this.targetOrbitPitch + deltaY * 0.008));
        } else {
          // Ở tiền sảnh: xoay nhẹ góc nhìn toàn cảnh
          this.targetOrbitYaw += deltaX * 0.008;
        }
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // Kiểm tra hover trên Hotspots
      if (this.isActive && !this.isDragging) {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        dom.style.cursor = (intersects.length > 0) ? 'pointer' : 'grab';
      }
    });

    // 4. Hỗ trợ cảm ứng vuốt xoay 360° trên điện thoại / tablet / touchpad
    dom.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        dragDistance = 0;
        this.autoRotateArtifact = false;
        clearTimeout(this.resumeRotateTimer);
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        const card = document.getElementById('museumInspectionCard');
        if (card) card.classList.add('card-dimmed');
      }
    }, { passive: true });

    dom.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        dragDistance += Math.hypot(deltaX, deltaY);

        if (this.currentViewId !== 'entrance') {
          this.targetOrbitYaw += deltaX * 0.018;
          this.targetOrbitPitch = Math.max(-0.35, Math.min(0.35, this.targetOrbitPitch + deltaY * 0.01));
        } else {
          this.targetOrbitYaw += deltaX * 0.01;
        }
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    dom.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.isDragging = false;
        const card = document.getElementById('museumInspectionCard');
        if (card) card.classList.remove('card-dimmed');
        clearTimeout(this.resumeRotateTimer);
        this.resumeRotateTimer = setTimeout(() => {
          this.autoRotateArtifact = true;
        }, 3000);
      }
    }, { passive: true });

    // 5. Cuộn chuột Zoom an toàn
    dom.addEventListener('wheel', (e) => {
      if (this.currentViewId === 'entrance') return;
      e.preventDefault();

      const zoomDelta = e.deltaY * 0.0012;
      this.targetZoomFactor = Math.max(
        this.minZoomFactor,
        Math.min(this.maxZoomFactor, this.targetZoomFactor + zoomDelta)
      );
    }, { passive: false });

    // 6. Click Raycasting (Chỉ kích hoạt nếu người dùng không kéo xoay)
    dom.addEventListener('click', (e) => {
      if (!this.isActive) return;
      if (dragDistance > 6) return; // Nếu đang kéo xoay thì bỏ qua click

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects);

      if (intersects.length > 0) {
        const hitData = intersects[0].object.userData;

        // Bấm vào điểm nhãn 3D Hotspot
        if (hitData && hitData.isHotspot && hitData.info) {
          if (window.audio && typeof window.audio.playBell === 'function') {
            window.audio.playBell();
          }
          if (typeof this.onHotspotClicked === 'function') {
            this.onHotspotClicked(hitData.info, hitData.stationId);
          }
          return;
        }

        // Bấm vào bệ hiện vật
        if (hitData && hitData.stationId && this.currentViewId !== hitData.stationId) {
          this.navigateToStation(hitData.stationId);
        }
      }
    });
  }

  // Phương thức hỗ trợ xoay hiện vật theo góc chỉ định (cho nút UI)
  rotateArtifact(deltaAngle) {
    this.targetOrbitYaw += deltaAngle;
    this.autoRotateArtifact = false;
    clearTimeout(this.resumeRotateTimer);
    this.resumeRotateTimer = setTimeout(() => {
      this.autoRotateArtifact = true;
    }, 3500);
  }

  // Bật/Tắt tự động xoay
  toggleAutoRotate() {
    this.autoRotateArtifact = !this.autoRotateArtifact;
    return this.autoRotateArtifact;
  }

  // Đặt lại góc nhìn và góc xoay chuẩn ban đầu
  resetArtifactView() {
    this.targetOrbitYaw = 0;
    this.targetOrbitPitch = 0;
    this.targetZoomFactor = 1.0;
    this.autoRotateArtifact = true;
    clearTimeout(this.resumeRotateTimer);
  }

  // Alias tương thích cho các nút UI xoay và reset góc nhìn
  rotateArtifactManual(deltaAngle) {
    return this.rotateArtifact(deltaAngle);
  }

  resetArtifactAngle() {
    return this.resetArtifactView();
  }

  onWindowResize() {
    if (!this.container || !this.camera || !this.renderer) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    // Responsive FOV: Tự động cân chỉnh góc nhìn cho màn hình hẹp/vuông để bao trọn sảnh bảo tàng
    if (this.camera.aspect < 1.45) {
      this.camera.fov = 52 + (1.45 - this.camera.aspect) * 24;
    } else {
      this.camera.fov = 52;
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // ===================================================================
  // 8. ĐIỀU HƯỚNG CAMERA (CAMERA RAIL WAYPOINTS & FOCUS LIGHTING)
  // Tích hợp GSAP 3 Cinematic Camera Rail lướt êm ái giữa các lồng kính
  // ===================================================================
  navigateToStation(stationId) {
    const wp = this.waypoints[stationId];
    if (!wp) return;

    this.currentViewId = stationId;

    // Nạp mô hình 3D theo nhu cầu khi tiếp cận trạm cổ vật (On-Demand Loading)
    if (stationId !== 'entrance') {
      this.loadStationModelOnDemand(stationId);
    }

    // Reset lại góc xoay và zoom
    this.targetOrbitYaw = 0;
    this.userOrbitYaw = 0;
    this.targetOrbitPitch = 0;
    this.userOrbitPitch = 0;
    this.targetZoomFactor = 1.0;
    this.autoRotateArtifact = true;

    // Chuyển động Camera GSAP 3 mượt mà
    if (window.gsap) {
      window.gsap.killTweensOf(this.cameraTargetPos);
      window.gsap.killTweensOf(this.lookDesiredTarget);
      window.gsap.to(this.cameraTargetPos, {
        x: wp.pos.x,
        y: wp.pos.y,
        z: wp.pos.z,
        duration: 1.35,
        ease: 'power2.inOut'
      });
      window.gsap.to(this.lookDesiredTarget, {
        x: wp.target.x,
        y: wp.target.y,
        z: wp.target.z,
        duration: 1.35,
        ease: 'power2.inOut'
      });
    } else {
      this.cameraTargetPos = { ...wp.pos };
      this.lookDesiredTarget = { ...wp.target };
    }

    // Chiếu sáng tập trung Chiaroscuro: Tăng đèn rọi bệ chọn (3.8), làm dịu các gian còn lại (0.35)
    if (stationId === 'entrance') {
      this.spotlightTargets.mask = 2.0;
      this.spotlightTargets.ceramic = 2.0;
      this.spotlightTargets.flute = 2.0;
    } else {
      this.spotlightTargets.mask = (stationId === 'mask') ? 3.8 : 0.35;
      this.spotlightTargets.ceramic = (stationId === 'ceramic') ? 3.8 : 0.35;
      this.spotlightTargets.flute = (stationId === 'flute') ? 3.8 : 0.35;
    }

    // Tối ưu hóa bóng đổ động (Dynamic Shadow Passes):
    // Chỉ bật castShadow trên spotlight của trạm đang chọn ở Tier High
    const tierCfg = this.getTierConfig(this.effectiveTier);
    ['mask', 'ceramic', 'flute'].forEach(id => {
      const spot = this.spotlights[id];
      if (spot) {
        spot.castShadow = (id === stationId && tierCfg.spotShadow && tierCfg.shadowMap);
      }
    });
    if (this.renderer && this.renderer.shadowMap) {
      this.renderer.shadowMap.needsUpdate = true;
    }

    if (window.audio) {
      if (stationId === 'mask' && typeof window.audio.playMaskTheme === 'function') {
        window.audio.playMaskTheme();
      } else if (stationId === 'ceramic' && typeof window.audio.playCeramicTheme === 'function') {
        window.audio.playCeramicTheme();
      } else if (stationId === 'flute' && typeof window.audio.playFluteTheme === 'function') {
        window.audio.playFluteTheme();
      } else if (stationId === 'brush' && typeof window.audio.playBell === 'function') {
        window.audio.playBell();
      } else if (typeof window.audio.playPaper === 'function') {
        window.audio.playPaper();
      }
    }

    if (typeof this.onStationChanged === 'function') {
      this.onStationChanged(stationId, wp);
    }
  }

  // Chuyển động Zoom xuyên qua lồng kính tiến sát hiện vật bằng GSAP 3
  zoomIntoArtifact(stationId, onComplete) {
    if (typeof stationId === 'function') {
      onComplete = stationId;
      stationId = this.currentViewId;
    }
    stationId = stationId || this.currentViewId || 'entrance';

    let called = false;
    const finish = () => {
      if (called) return;
      called = true;
      this.isZoomingIntoArtifact = false;
      if (typeof onComplete === 'function') onComplete();
    };

    // Safety fallback: Đảm bảo không bao giờ bị kẹt nếu rAF bị tạm dừng
    const safetyTimer = setTimeout(finish, 750);

    if (window.gsap && this.camera) {
      this.isZoomingIntoArtifact = true;
      const wp = this.waypoints[stationId] || this.waypoints.entrance;
      const targetCamPos = {
        x: wp.target.x + (wp.pos.x - wp.target.x) * 0.22,
        y: wp.target.y + 0.12,
        z: wp.target.z + (wp.pos.z - wp.target.z) * 0.22
      };

      window.gsap.killTweensOf(this.cameraCurrentPos);
      window.gsap.killTweensOf(this.cameraTargetPos);
      window.gsap.killTweensOf(this.lookCurrentTarget);

      window.gsap.to(this.cameraCurrentPos, {
        x: targetCamPos.x,
        y: targetCamPos.y,
        z: targetCamPos.z,
        duration: 0.68,
        ease: 'power3.in',
        onComplete: () => {
          clearTimeout(safetyTimer);
          finish();
        }
      });
      return;
    }
    clearTimeout(safetyTimer);
    finish();
  }

  // ===================================================================
  // 9. QUẢN LÝ PERSISTENT MUSEUM SNAPSHOT & VÒNG LẶP RENDER 60 FPS
  // ===================================================================
  saveMuseumSnapshot() {
    this.savedSnapshot = {
      stationId: this.currentViewId,
      cameraCurrentPos: { x: this.cameraCurrentPos.x, y: this.cameraCurrentPos.y, z: this.cameraCurrentPos.z },
      cameraTargetPos: { x: this.cameraTargetPos.x, y: this.cameraTargetPos.y, z: this.cameraTargetPos.z },
      lookCurrentTarget: { x: this.lookCurrentTarget.x, y: this.lookCurrentTarget.y, z: this.lookCurrentTarget.z },
      lookDesiredTarget: { x: this.lookDesiredTarget.x, y: this.lookDesiredTarget.y, z: this.lookDesiredTarget.z },
      userOrbitYaw: this.userOrbitYaw || 0,
      userOrbitPitch: this.userOrbitPitch || 0,
      targetOrbitYaw: this.targetOrbitYaw || 0,
      targetOrbitPitch: this.targetOrbitPitch || 0,
      zoomDistanceFactor: this.zoomDistanceFactor || 1.0,
      targetZoomFactor: this.targetZoomFactor || 1.0,
      autoRotateArtifact: this.autoRotateArtifact,
      spotlightTargets: { ...this.spotlightTargets },
      timestamp: Date.now()
    };
    try {
      sessionStorage.setItem('VT_MUSEUM_SNAPSHOT', JSON.stringify(this.savedSnapshot));
      console.log(`[Bảo Tàng 3D] Đã lưu snapshot trạng thái trạm: ${this.currentViewId} vào sessionStorage`);
    } catch(e) {
      console.warn('[Bảo Tàng 3D] Không thể lưu snapshot vào sessionStorage:', e);
    }
    return this.savedSnapshot;
  }

  restoreMuseumSnapshot(customSnap) {
    let snap = customSnap || this.savedSnapshot;
    if (!snap) {
      try {
        const stored = sessionStorage.getItem('VT_MUSEUM_SNAPSHOT');
        if (stored) snap = JSON.parse(stored);
      } catch(e) {}
    }
    if (!snap) return false;
    this.savedSnapshot = snap;
    this.currentViewId = snap.stationId || 'entrance';
    this.cameraCurrentPos = { ...snap.cameraCurrentPos };
    this.cameraTargetPos = { ...snap.cameraTargetPos };
    this.lookCurrentTarget = { ...snap.lookCurrentTarget };
    this.lookDesiredTarget = { ...snap.lookDesiredTarget };
    this.userOrbitYaw = snap.userOrbitYaw;
    this.userOrbitPitch = snap.userOrbitPitch;
    this.targetOrbitYaw = snap.targetOrbitYaw;
    this.targetOrbitPitch = snap.targetOrbitPitch;
    this.zoomDistanceFactor = snap.zoomDistanceFactor;
    this.targetZoomFactor = snap.targetZoomFactor;
    this.autoRotateArtifact = snap.autoRotateArtifact;
    if (snap.spotlightTargets) {
      this.spotlightTargets = { ...snap.spotlightTargets };
    }

    if (this.camera) {
      this.camera.position.set(snap.cameraCurrentPos.x, snap.cameraCurrentPos.y, snap.cameraCurrentPos.z);
      this.camera.lookAt(snap.lookCurrentTarget.x, snap.lookCurrentTarget.y, snap.lookCurrentTarget.z);
    }

    // Cập nhật góc xoay của mesh hiện vật nếu có
    const activeMesh = this.artifactMeshes[this.currentViewId];
    if (activeMesh && this.currentViewId !== 'entrance') {
      activeMesh.rotation.y = (activeMesh.userData.baseRotationY || 0) + this.userOrbitYaw;
    }

    // Cập nhật cường độ sáng và shadow spotlight của trạm được khôi phục
    const tierCfg = this.getTierConfig(this.effectiveTier);
    ['mask', 'ceramic', 'flute'].forEach(id => {
      const spot = this.spotlights[id];
      if (spot) {
        spot.castShadow = (id === this.currentViewId && tierCfg.spotShadow && tierCfg.shadowMap);
        if (this.spotlightTargets[id] !== undefined) {
          spot.intensity = this.spotlightTargets[id];
        }
      }
    });

    const wp = this.waypoints[this.currentViewId] || this.waypoints.entrance;
    if (typeof this.onStationChanged === 'function') {
      this.onStationChanged(this.currentViewId, wp);
    }

    // Tự động nạp mô hình 3D on-demand cho trạm được khôi phục
    if (this.currentViewId && this.currentViewId !== 'entrance') {
      this.loadStationModelOnDemand(this.currentViewId);
    }

    console.log(`[Bảo Tàng 3D] Đã khôi phục thành công snapshot trạm: ${this.currentViewId}`);
    return true;
  }

  hasSavedSnapshot() {
    if (this.savedSnapshot) return true;
    try {
      return !!sessionStorage.getItem('VT_MUSEUM_SNAPSHOT');
    } catch(e) {
      return false;
    }
  }

  clearMuseumSnapshot() {
    this.savedSnapshot = null;
    try {
      sessionStorage.removeItem('VT_MUSEUM_SNAPSHOT');
    } catch(e) {}
  }

  start(restoreSnapshot = false) {
    if (this.isActive) {
      if (!restoreSnapshot) {
        this.navigateToStation('entrance');
      }
      return;
    }
    this.isActive = true;

    if (restoreSnapshot && this.hasSavedSnapshot()) {
      this.restoreMuseumSnapshot();
    } else {
      this.navigateToStation('entrance');
    }

    const animate = () => {
      if (!this.isActive) return;

      // 1. Nội suy mượt góc xoay và zoom
      this.userOrbitYaw += (this.targetOrbitYaw - this.userOrbitYaw) * 0.08;
      this.userOrbitPitch += (this.targetOrbitPitch - this.userOrbitPitch) * 0.08;
      this.zoomDistanceFactor += (this.targetZoomFactor - this.zoomDistanceFactor) * 0.08;

      // 2. Tính toán vị trí Camera theo tọa độ rail và zoom
      const wp = this.waypoints[this.currentViewId] || this.waypoints.entrance;
      const targetVec = new THREE.Vector3(wp.target.x, wp.target.y, wp.target.z);
      const baseCamVec = new THREE.Vector3(wp.pos.x, wp.pos.y, wp.pos.z);
      const dirVec = new THREE.Vector3().subVectors(baseCamVec, targetVec);

      dirVec.multiplyScalar(this.zoomDistanceFactor);
      dirVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), this.userOrbitPitch * 0.35);

      const computedCamPos = new THREE.Vector3().addVectors(targetVec, dirVec);

      if (!this.isZoomingIntoArtifact) {
        this.cameraCurrentPos.x += (computedCamPos.x - this.cameraCurrentPos.x) * this.lerpSpeed;
        this.cameraCurrentPos.y += (computedCamPos.y - this.cameraCurrentPos.y) * this.lerpSpeed;
        this.cameraCurrentPos.z += (computedCamPos.z - this.cameraCurrentPos.z) * this.lerpSpeed;

        if (Math.hypot(computedCamPos.x - this.cameraCurrentPos.x, computedCamPos.z - this.cameraCurrentPos.z) < 0.008) {
          this.cameraCurrentPos.x = computedCamPos.x;
          this.cameraCurrentPos.y = computedCamPos.y;
          this.cameraCurrentPos.z = computedCamPos.z;
        }
      }

      this.camera.position.set(
        this.cameraCurrentPos.x,
        this.cameraCurrentPos.y,
        this.cameraCurrentPos.z
      );

      // 3. Nội suy điểm nhìn (LookAt Target)
      this.lookCurrentTarget.x += (wp.target.x - this.lookCurrentTarget.x) * this.lerpSpeed;
      this.lookCurrentTarget.y += (wp.target.y + this.userOrbitPitch * 0.2 - this.lookCurrentTarget.y) * this.lerpSpeed;
      this.lookCurrentTarget.z += (wp.target.z - this.lookCurrentTarget.z) * this.lerpSpeed;

      if (Math.hypot(wp.target.x - this.lookCurrentTarget.x, wp.target.z - this.lookCurrentTarget.z) < 0.008) {
        this.lookCurrentTarget.x = wp.target.x;
        this.lookCurrentTarget.z = wp.target.z;
      }

      this.camera.lookAt(
        this.lookCurrentTarget.x,
        this.lookCurrentTarget.y,
        this.lookCurrentTarget.z
      );

      // 4. Cập nhật cường độ sáng spotlight
      ['mask', 'ceramic', 'flute'].forEach(id => {
        const spot = this.spotlights[id];
        if (spot) {
          const target = this.spotlightTargets[id] || 2.0;
          spot.intensity += (target - spot.intensity) * 0.08;
        }
      });

      // 5. Xoay hiện vật: Tự xoay chậm hoặc người dùng xoay 360° bằng chuột
      const activeMesh = this.artifactMeshes[this.currentViewId];
      if (activeMesh && this.currentViewId !== 'entrance') {
        if (this.autoRotateArtifact) {
          if (activeMesh.userData && activeMesh.userData.isFolkPainting) {
            // Tranh phẳng đóng khung: Dao động góc nhẹ ±16° hướng mặt tranh về phía người xem (không quay lưng ván gỗ ra trước)
            this.targetOrbitYaw = Math.sin(performance.now() * 0.00085) * 0.28;
          } else {
            this.targetOrbitYaw += this.autoRotateSpeed;
          }
        }
        activeMesh.rotation.y = (activeMesh.userData.baseRotationY || 0) + this.userOrbitYaw;
      }

      // Nhấp nháy nhẹ các vòng halo của điểm nhãn 3D Hotspot
      const time = performance.now() * 0.003;
      this.hotspotObjects.forEach(pin => {
        const ring = pin.userData.ringMesh;
        if (ring) {
          const scale = 1.0 + Math.sin(time) * 0.18;
          ring.scale.set(scale, scale, scale);
          ring.lookAt(this.camera.position);
        }
      });

      // 6. Hiệu ứng Phong Ấn Hậu Cung (Án Thư Tiền Nhân - Mở khi giải xong 3 cổ vật)
      if (this.brushSealGroup && this.brushDomeMesh && this.brushSealRings) {
        const solved = (window.vanTuongGame && window.vanTuongGame.state && window.vanTuongGame.state.solvedChambers) || [];
        const required = ['mask', 'ceramic', 'flute'];
        const isUnlocked = required.every(c => solved.includes(c));

        if (isUnlocked) {
          // Phong ấn đã khai mở: hào quang chuyển vàng kim thanh tịnh (--accent-imperial-gold)
          this.brushDomeMesh.material.color.setHex(0xf5a823);
          this.brushDomeMesh.material.opacity = 0.12;
          this.brushSealRings[0].material.color.setHex(0xf5a823);
          this.brushSealRings[0].material.opacity = 0.22;
          this.brushSealRings[1].material.color.setHex(0xf5a823);
          this.brushSealRings[1].material.opacity = 0.15;
          this.brushSealGroup.rotation.y += 0.005;
        } else {
          // Chưa giải đủ 3 cổ vật: vòm chắn màu chu sa đỏ rực xoay bảo vệ (--accent-cinnabar)
          this.brushDomeMesh.material.color.setHex(0xa81c22);
          this.brushDomeMesh.material.opacity = 0.32 + Math.sin(time * 3) * 0.12;
          this.brushSealRings[0].rotation.z += 0.015;
          this.brushSealRings[1].rotation.z -= 0.018;
          this.brushSealGroup.rotation.y += 0.008;
        }
      }

      // 7. Đo đạc & Giám sát FPS thích ứng (Adaptive Performance Scaling)
      const now = performance.now();
      const delta = now - this.lastFrameTimestamp;
      this.lastFrameTimestamp = now;
      if (delta > 0 && delta < 200) {
        const currentFps = 1000 / delta;
        this.fpsSamples.push(currentFps);
        if (this.fpsSamples.length > 60) this.fpsSamples.shift();

        if (this.autoQualityEnabled && this.fpsSamples.length >= 45 && (now - this.lastTierChangeTime) > 3000) {
          const avgFps = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
          if (avgFps < 38) {
            if (this.effectiveTier === 'high') {
              console.warn(`[Bảo Tàng 3D - Auto FPS] Tải GPU cao (FPS: ${Math.round(avgFps)}), tự chuyển sang Vừa (Medium)`);
              this.applyGraphicsTier('medium');
              this.lastTierChangeTime = now;
              this.fpsSamples = [];
            } else if (this.effectiveTier === 'medium') {
              console.warn(`[Bảo Tàng 3D - Auto FPS] Tải GPU cao (FPS: ${Math.round(avgFps)}), tự chuyển sang Tiết Kiệm (Low)`);
              this.applyGraphicsTier('low');
              this.lastTierChangeTime = now;
              this.fpsSamples = [];
            }
          }
        }
      }

      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
      this.animId = requestAnimationFrame(animate);
    };

    this.animId = requestAnimationFrame(animate);
  }

  // ===================================================================
  // 10. QUẢN LÝ CẤP ĐỘ ĐỒ HỌA (GRAPHICS QUALITY MANAGER)
  // ===================================================================
  getTierConfig(tier) {
    const configs = {
      high: {
        maxDpr: 1.5,
        shadowMap: true,
        softShadow: true,
        shadowSize: 1024,
        spotShadow: true
      },
      medium: {
        maxDpr: 1.25,
        shadowMap: true,
        softShadow: false,
        shadowSize: 512,
        spotShadow: false
      },
      low: {
        maxDpr: 1.0,
        shadowMap: false,
        softShadow: false,
        shadowSize: 256,
        spotShadow: false
      }
    };
    return configs[tier] || configs.medium;
  }

  setGraphicsQuality(level) {
    if (level === 'auto') {
      this.autoQualityEnabled = true;
      this.graphicsQuality = 'auto';
    } else if (['high', 'medium', 'low'].includes(level)) {
      this.autoQualityEnabled = false;
      this.graphicsQuality = level;
      this.applyGraphicsTier(level);
    }

    if (typeof this.onQualityChanged === 'function') {
      this.onQualityChanged(this.graphicsQuality, this.effectiveTier);
    }
    console.log(`[Bảo Tàng 3D] Đặt mức đồ họa: ${level.toUpperCase()} (Đang thực thi: ${this.effectiveTier.toUpperCase()})`);
  }

  applyGraphicsTier(tier) {
    this.effectiveTier = tier;
    const cfg = this.getTierConfig(tier);

    if (this.renderer) {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cfg.maxDpr));
      this.renderer.shadowMap.enabled = cfg.shadowMap;
      this.renderer.shadowMap.type = cfg.softShadow ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;

      if (this.mainDirLight) {
        this.mainDirLight.castShadow = cfg.shadowMap;
        if (this.mainDirLight.shadow) {
          this.mainDirLight.shadow.mapSize.width = cfg.shadowSize;
          this.mainDirLight.shadow.mapSize.height = cfg.shadowSize;
        }
      }

      ['mask', 'ceramic', 'flute'].forEach(id => {
        const spot = this.spotlights[id];
        if (spot) {
          spot.castShadow = (id === this.currentViewId && cfg.spotShadow && cfg.shadowMap);
        }
      });

      this.renderer.shadowMap.needsUpdate = true;
      const w = this.container ? this.container.clientWidth || window.innerWidth : window.innerWidth;
      const h = this.container ? this.container.clientHeight || window.innerHeight : window.innerHeight;
      this.renderer.setSize(w, h);
    }
  }

  // ===================================================================
  // 11. GIẢI PHÓNG TÀI NGUYÊN GPU (STRICT MEMORY LIFECYCLE MANAGEMENT)
  // ===================================================================
  dispose() {
    this.stop();

    if (this.boundWindowResize) {
      window.removeEventListener('resize', this.boundWindowResize);
      this.boundWindowResize = null;
    }
    if (this.boundWindowMouseUp) {
      window.removeEventListener('mouseup', this.boundWindowMouseUp);
      this.boundWindowMouseUp = null;
    }
    if (this.boundWindowMouseMove) {
      window.removeEventListener('mousemove', this.boundWindowMouseMove);
      this.boundWindowMouseMove = null;
    }

    const disposeTextureIfOwn = (tex) => {
      if (tex && tex.isTexture && !tex.userData?.isShared) {
        tex.dispose();
      }
    };

    const disposeObject = (obj) => {
      if (!obj) return;
      if (obj.geometry) {
        obj.geometry.dispose();
      }
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(m => {
          ['map', 'lightMap', 'bumpMap', 'normalMap', 'specularMap', 'envMap'].forEach(slot => {
            disposeTextureIfOwn(m[slot]);
          });
          m.dispose();
        });
      }
    };

    if (this.scene) {
      this.scene.traverse(disposeObject);
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
    this.scene = null;
    this.camera = null;
    console.log('[Bảo Tàng 3D] Đã giải phóng 100% tài nguyên GPU và bộ nhớ.');
  }

  // ===================================================================
  // 12. PHƯƠNG ÁN DỰ PHÒNG 2.5D CANVAS (GRACEFUL WEBGL FALLBACK)
  // Chống sập và màn hình trắng nếu GPU yếu hoặc WebGL bị vô hiệu hóa
  // ===================================================================
  initFallback2D(containerElement) {
    this.container = containerElement;
    this.container.innerHTML = `
      <div id="museumFallbackWrapper" style="position:relative; width:100%; height:100%; background:radial-gradient(ellipse at center, #26160d 0%, #0d0704 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#fcd55c; font-family:'Playfair Display', 'Lora', serif; text-align:center; padding:20px; box-sizing:border-box;">
        <div style="border:1px solid rgba(252,213,92,0.4); padding:24px 32px; border-radius:8px; background:rgba(18,11,7,0.85); max-width:680px; box-shadow:0 12px 36px rgba(0,0,0,0.8);">
          <div style="font-size:12px; letter-spacing:3px; color:#c69c3a; margin-bottom:8px;">❖ CHẾ ĐỘ HIỂN THỊ TƯƠNG THÍCH 2.5D ❖</div>
          <h2 style="font-size:24px; margin:0 0 12px 0; color:#fcd55c; text-shadow:0 0 10px rgba(252,213,92,0.4);">TIỀN SẢNH BẢO TÀNG ĐẠI VIỆT</h2>
          <p style="font-family:'Lora', serif; font-size:14px; color:#d6c7b2; line-height:1.6; margin-bottom:24px;">Hệ thống phát hiện thiết bị chưa hỗ trợ đầy đủ WebGL 3D. Trò chơi đã tự động chuyển sang chế độ triển lãm 2.5D mượt mà để bảo toàn 100% trải nghiệm và tiến trình cốt truyện của bạn.</p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:12px; margin-bottom:20px;">
            <button onclick="window.vtMuseum3D.navigateToStation('mask')" style="background:#1b120c; border:1px solid #a81c22; color:#fcd55c; padding:12px 8px; border-radius:4px; cursor:pointer;">
              <div style="font-size:18px;">🎭</div>
              <div style="font-size:12px; font-weight:bold; margin-top:4px;">Tuồng Tam Diện</div>
            </button>
            <button onclick="window.vtMuseum3D.navigateToStation('ceramic')" style="background:#1b120c; border:1px solid #2d8a55; color:#fcd55c; padding:12px 8px; border-radius:4px; cursor:pointer;">
              <div style="font-size:18px;">🏺</div>
              <div style="font-size:12px; font-weight:bold; margin-top:4px;">Gốm Bát Tràng</div>
            </button>
            <button onclick="window.vtMuseum3D.navigateToStation('flute')" style="background:#1b120c; border:1px solid #e06d28; color:#fcd55c; padding:12px 8px; border-radius:4px; cursor:pointer;">
              <div style="font-size:18px;">🎋</div>
              <div style="font-size:12px; font-weight:bold; margin-top:4px;">Tiêu Kinh Bắc</div>
            </button>
          </div>
        </div>
      </div>
    `;
    this.navigateToStation('entrance');
    return true;
  }

  stop() {
    this.isActive = false;
    this.isZoomingIntoArtifact = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  destroy() {
    this.dispose();
  }
}

// Khởi tạo đối tượng toàn cục
window.VanTuongMuseum3D = VanTuongMuseum3D;
window.Museum3DExperience = VanTuongMuseum3D;
window.vtMuseum3D = new VanTuongMuseum3D();
window.ArtifactAssetFactory = ArtifactAssetFactory;
