// HỌA DIỆN (The Dual Mask) - Sprite Loader & Asset Manager (Workshop V3 Architecture)
window.GameAssets = {
  loaded: false,
  bgWorkshop: null,
  bgFloor1: null,
  bgFloor2: null,
  bgFloor3: null,
  ladderSecret: null,
  layer2Decor: null,
  layer3Props: null,
  cuaGoDong: null,
  hocKeoMo: null,
  baoHuongTram: null,
  diaTrauCauKho: null,
  maskTuong: null,
  maskRedHalf: null,
  maskWhiteHalf: null,
  maskBackClean: null,
  maskBackGold: null,
  maskAngles: {},
  daoTroImg: null,
  npcBacCanh: null,
  npcBacCanhAnim: null,
  charSheet: null,
  fullSheet: null,
  anims: null
};

window.SpriteLoader = (function () {
  function loadImage(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  // Fallback procedural background (1022x250 panoramic matching 2000x489 art)
  function createFallbackBackground(w = 1022, h = 250) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#221814';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#140f0c';
    ctx.fillRect(0, 236, w, 14);
    return c;
  }

  // Extract a single cell from the 4x4 master spritesheet (1254x1254)
  // Perfectly ground the character foot on y = 118 with center at x = 50
  function extractFrame(sheetImg, col, row, opts = {}) {
    const c = document.createElement('canvas');
    c.width = 100;
    c.height = 120;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    if (!sheetImg) return c;

    const cellW = sheetImg.naturalWidth / 4;
    const cellH = sheetImg.naturalHeight / 4;
    const sx = Math.floor(col * cellW);
    const sy = Math.floor(row * cellH);
    const sw = Math.floor(cellW);
    const sh = Math.floor(cellH);

    const scale = opts.scale || (100 / 297);
    const centerRelX = opts.cx !== undefined ? opts.cx : (cellW / 2);
    const footRelY = opts.fy !== undefined ? opts.fy : 303;

    const dx = Math.round(50 - centerRelX * scale + (opts.ox || 0));
    const dy = Math.round(118 - footRelY * scale + (opts.oy || 0));
    const dw = Math.round(sw * scale);
    const dh = Math.round(sh * scale);

    ctx.drawImage(sheetImg, sx, sy, sw, sh, dx, dy, dw, dh);
    return c;
  }

  function buildAnims(fullSheetImg) {
    if (!fullSheetImg) {
      return null;
    }

    // Row 0: Idle states
    const idle0 = extractFrame(fullSheetImg, 0, 0); // Normal standing
    const idle1 = extractFrame(fullSheetImg, 1, 0); // Breathing / eyes blink
    const idle2 = extractFrame(fullSheetImg, 2, 0); // Quick check pocket notebook
    const idle3 = extractFrame(fullSheetImg, 3, 0); // Looking up curiously

    // Row 1: Walk cycle
    const walk0 = extractFrame(fullSheetImg, 0, 1);
    const walk1 = extractFrame(fullSheetImg, 1, 1);
    const walk2 = extractFrame(fullSheetImg, 2, 1);
    const walk3 = extractFrame(fullSheetImg, 3, 1);

    // Row 2: Tool actions
    const lanternLow = extractFrame(fullSheetImg, 0, 2);  // Crouching lantern
    const lanternHigh = extractFrame(fullSheetImg, 1, 2); // Standing lantern
    const inspect = extractFrame(fullSheetImg, 2, 2);     // Magnifying glass
    const write = extractFrame(fullSheetImg, 3, 2);       // Writing in journal

    // Row 3: Interactions & Reactions
    const crouchPick = extractFrame(fullSheetImg, 0, 3);  // Picking clue on floor
    const reachDesk = extractFrame(fullSheetImg, 1, 3);   // Reaching onto workbench
    const wipeDesk = extractFrame(fullSheetImg, 2, 3);    // Wiping table/mask
    const shock = extractFrame(fullSheetImg, 3, 3);       // Startled exclamation

    return {
      idle: [idle0, idle0, idle1, idle0, idle0, idle3, idle0, idle0, idle2],
      walk: [walk0, walk1, walk2, walk3],
      inspect: [inspect],
      write: [write],
      lantern: [lanternHigh],
      lanternLow: [lanternLow],
      crouch: [crouchPick],
      reach: [reachDesk],
      wipe: [wipeDesk],
      shock: [shock]
    };
  }

  async function init(onComplete) {
    const ts = Date.now();
    const [
      bgImg,
      bgFloor1Img,
      bgFloor2Img,
      bgFloor3Img,
      ladderImg,
      l2Img,
      l3Img,
      doorImg,
      drawerOpenImg,
      incenseImg,
      betelImg,
      fullSheetImg,
      sheetImg,
      maskImg,
      maskRedHalfImg,
      maskWhiteHalfImg,
      maskBackCleanImg,
      maskBackGoldImg,
      mAng0, mAng45, mAng90, mAng135, mAng180, mAng225, mAng270, mAng315,
      daoTro,
      bacCanhImg,
      bacCanhAnimImg
    ] = await Promise.all([
      loadImage('assets/workshop_reference_full.webp?v=' + ts),
      loadImage('assets/floor1/floor1_panorama_raw.png?v=' + ts),
      loadImage('assets/floor2/floor2_panorama_game.png?v=' + ts),
      loadImage('assets/floor3/floor3_panorama_game.png?v=' + ts),
      loadImage('assets/floor3/ladder_game.png?v=' + ts),
      loadImage('assets/workshop_v3/composited_layers/layer2_transparent_canvas.png?v=' + ts),
      loadImage('assets/workshop_v3/composited_layers/layer3_no_door.png?v=' + ts),
      loadImage('assets/workshop_v3/layer3_interactive_individual/cua_go_dong.png?v=' + ts),
      loadImage('assets/workshop_v3/layer3_interactive_individual/hoc_keo_mo.png?v=' + ts),
      loadImage('assets/workshop_v3/layer3_interactive_individual/bao_huong_tram.png?v=' + ts),
      loadImage('assets/workshop_v3/layer3_interactive_individual/dia_trau_cau_kho.png?v=' + ts),
      loadImage('assets/character_an_full_sheet.webp?v=' + ts),
      loadImage('outputs/character_an_spritesheet_transparent.png?v=' + ts),
      loadImage('outputs/mask_tuong_transparent.png?v=' + ts),
      loadImage('assets/mask_angles/mask_red_half.png?v=' + ts),
      loadImage('assets/mask_angles/mask_white_half.png?v=' + ts),
      loadImage('assets/mask_angles/mask_back_clean.png?v=' + ts),
      loadImage('assets/mask_angles/mask_back_gold.png?v=' + ts),
      loadImage('assets/mask_angles/mask_angle_0.png?v=' + ts),
      loadImage('assets/mask_angles/mask_angle_45.png?v=' + ts),
      loadImage('assets/mask_angles/mask_angle_90.png?v=' + ts),
      loadImage('assets/mask_angles/mask_angle_135.png?v=' + ts),
      loadImage('assets/mask_angles/mask_angle_180.png?v=' + ts),
      loadImage('assets/mask_angles/mask_angle_225.png?v=' + ts),
      loadImage('assets/mask_angles/mask_angle_270.png?v=' + ts),
      loadImage('assets/mask_angles/mask_angle_315.png?v=' + ts),
      loadImage('assets/workshop_v3/layer3_interactive_individual/dao_tro_cao_vecni.png?v=' + ts),
      loadImage('assets/floor1/npc_bac_canh_seated.png?v=' + ts),
      loadImage('assets/floor1/npc_bac_canh_seated_anim.png?v=' + ts)
    ]);

    window.GameAssets.bgWorkshop = bgImg || createFallbackBackground(1022, 250);
    window.GameAssets.bgFloor1 = bgFloor1Img;
    window.GameAssets.bgFloor2 = bgFloor2Img;
    window.GameAssets.bgFloor3 = bgFloor3Img;
    window.GameAssets.ladderSecret = ladderImg;
    window.GameAssets.layer2Decor = l2Img;
    window.GameAssets.layer3Props = l3Img;
    window.GameAssets.cuaGoDong = doorImg;
    window.GameAssets.hocKeoMo = drawerOpenImg;
    window.GameAssets.baoHuongTram = incenseImg;
    window.GameAssets.diaTrauCauKho = betelImg;
    window.GameAssets.fullSheet = fullSheetImg;
    window.GameAssets.charSheet = sheetImg;
    window.GameAssets.maskTuong = maskImg;
    window.GameAssets.maskRedHalf = maskRedHalfImg;
    window.GameAssets.maskWhiteHalf = maskWhiteHalfImg;
    window.GameAssets.maskBackClean = maskBackCleanImg;
    window.GameAssets.maskBackGold = maskBackGoldImg;
    window.GameAssets.maskAngles = {
      0: mAng0, 45: mAng45, 90: mAng90, 135: mAng135,
      180: mAng180, 225: mAng225, 270: mAng270, 315: mAng315
    };
    window.GameAssets.daoTroImg = daoTro;
    window.GameAssets.npcBacCanh = bacCanhImg;
    window.GameAssets.npcBacCanhAnim = bacCanhAnimImg;
    window.GameAssets.anims = buildAnims(fullSheetImg);
    window.GameAssets.loaded = true;

    if (onComplete) onComplete(window.GameAssets);
  }

  return { init };
})();
