import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PixelCharacter, CharacterAction } from './PixelCharacter';
import { FastTravelMapModal } from './FastTravelMapModal';
import { CentralWorkbenchModal, WorkbenchMode } from './CentralWorkbenchModal';
import { FanRackModal } from './FanRackModal';
import { BottomDialogueBox, DialogueTurn } from './BottomDialogueBox';
import { useGameState } from '../../context/GameStateContext';
import { LOCATIONS_DATA } from '../../data/locations';
import { LocationData } from '../../types/game';
import { sounds } from '../../utils/soundEngine';
import {
  Compass,
  Hammer,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Hand,
  ScrollText,
  Scroll,
  DoorOpen,
  Eye,
  Home,
  Search,
  MessageSquareQuote,
  CheckCircle2,
  Shirt,
  User,
} from 'lucide-react';

const MIN_PLAYER_X = 6;
const MAX_PLAYER_X = 94;
const MOVE_SPEED_PER_MS = 0.022; // 22% chiều rộng phòng mỗi giây

export type SceneRoomId =
  | 'opening_hub'
  | 'location_1_xuan_phien_thi'
  | 'location_2_ma_vi'
  | 'location_3_hang_trong'
  | 'location_4_hang_gai'
  | 'location_5_dong_huong'
  | 'decoy_hang_quat'
  | 'decoy_hang_hom'
  | 'decoy_quan_tra'
  | 'decoy_nam_huong'
  | 'decoy_ha_vi'
  | 'other_location';

interface SafezoneReturnNotice {
  locationName: string;
  relicName: string;
  clueText: string;
}

const SAFEZONE_RETURN_NOTICES: Record<string, SafezoneReturnNotice> = {
  xuan_phien_thi: {
    locationName: 'Đình Xuân Phiến Thị',
    relicName: 'Giấy Dó Cổ Truyền',
    clueText:
      'Bạn đã xếp khớp 5 chiếc quạt nan tre và nhận được Giấy Dó! Hãy mở Bản Đồ Cổ ở Khu Tranh Giữa Phố để tiếp tục hành trình.',
  },
  ma_vi: {
    locationName: 'Hiệu Phục Sức Mã Vĩ',
    relicName: 'Thỏi Mực Tàu Đen Tuyền',
    clueText:
      'Bên cạnh thỏi mực có bản phác thảo Ngũ Hổ khắc hình chiếc dao khắc gỗ ở góc dưới! Hãy mở Bản Đồ Cổ để tiếp tục hành trình.',
  },
  hang_trong: {
    locationName: 'Xưởng Tranh Hàng Trống',
    relicName: 'Ván Khắc Gỗ Nét Đen',
    clueText:
      'Mặt sau tấm ván khắc có dấu hiệu hoa văn sóng nước trên lụa! Hãy mở Bản Đồ Cổ để tiếp tục hành trình.',
  },
  hang_gai: {
    locationName: 'Hiệu Tơ Lụa Hàng Gai',
    relicName: 'Bộ Phẩm Màu Tự Nhiên',
    clueText:
      'Bạn đã thu thập được Phẩm Màu tự nhiên! Hãy mở Bản Đồ Cổ để tiếp tục hành trình.',
  },
  dong_huong: {
    locationName: 'Đình Đông Hương',
    relicName: 'Cây Bút Lông Vờn Màu',
    clueText:
      'Đã hội đủ 5 đạo cụ! Hãy tương tác với Bàn In Tranh Hàng Trống ở khu vực trung tâm để thực hiện 5 bước in tranh và giải mã bài thơ 8 câu.',
  },
};

export const MainWorkshopWorld: React.FC = () => {
  const {
    inventory,
    discoveredAnomalies,
    completedLocations,
    resetGame,
    setJournalOpen,
    journalOpen,
  } = useGameState();

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => !sounds.isMuted());
  const toggleSound = () => {
    const nextMuted = sounds.toggleMute();
    setSoundEnabled(!nextMuted);
  };

  useEffect(() => {
    const syncMute = () => {
      setSoundEnabled(!sounds.isMuted());
    };
    window.addEventListener('painting-mute-change', syncMute);
    return () => window.removeEventListener('painting-mute-change', syncMute);
  }, []);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(1024);
  const [viewportHeight, setViewportHeight] = useState<number>(600);

  // Bắt đầu tại Khu Mở Đầu / Safezone (opening_hub.webp) ở vị trí trung tâm (50%)
  const [playerX, setPlayerX] = useState<number>(50);
  const playerXRef = useRef<number>(50);
  playerXRef.current = playerX;

  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [action, setAction] = useState<CharacterAction>('idle');

  // Khu vực hiện tại: bắt đầu tại 'opening_hub' (Safezone)
  const [currentLocationId, setCurrentLocationId] = useState<string>('opening_hub');
  const [currentScene, setCurrentScene] = useState<SceneRoomId>('opening_hub');
  const [workbenchMode, setWorkbenchMode] = useState<WorkbenchMode>('CURRENT_TASK');

  // Lời dẫn cốt truyện hiển thị gọn ở đầu cảnh
  const [showSceneBanner, setShowSceneBanner] = useState<boolean>(true);
  // Thông báo khi vừa hoàn thành 1 địa điểm và tự động quay về Safezone
  const [safezoneNotice, setSafezoneNotice] = useState<SafezoneReturnNotice | null>(null);

  // Trạng thái các Modal & Hệ thống Hội thoại đa lượt có đối đáp
  const [showMap, setShowMap] = useState<boolean>(false);
  const [showWorkbench, setShowWorkbench] = useState<boolean>(false);
  const [showFanRack, setShowFanRack] = useState<boolean>(false);
  const [showPulpInfo, setShowPulpInfo] = useState<boolean>(false);

  // Lời thoại mở đầu cốt truyện khi mới vào game
  const [showOpeningPrologueSequence, setShowOpeningPrologueSequence] = useState<boolean>(true);
  const [openingPrologueStep, setOpeningPrologueStep] = useState<number>(0);

  // Đối thoại Khu Mở Đầu: Bác Nghệ Nhân Già
  const [showHubElderDialogue, setShowHubElderDialogue] = useState<boolean>(false);
  const [hubElderTurnIndex, setHubElderTurnIndex] = useState<number>(0);

  // Đối thoại Địa điểm 1: Đình Xuân Phiến Thị
  const [showLoc1ArtisanLore, setShowLoc1ArtisanLore] = useState<boolean>(false);
  const [loc1ArtisanTurnIndex, setLoc1ArtisanTurnIndex] = useState<number>(0);
  const [showLoc1ArrivalSequence, setShowLoc1ArrivalSequence] = useState<boolean>(false);
  const [loc1ArrivalStep, setLoc1ArrivalStep] = useState<number>(0);
  const hasSeenLoc1ArrivalRef = useRef<boolean>(false);

  // Đối thoại Địa điểm 2: Hiệu Phục Sức Mã Vĩ
  const [showLoc2ArrivalSequence, setShowLoc2ArrivalSequence] = useState<boolean>(false);
  const [loc2ArrivalTurnIndex, setLoc2ArrivalTurnIndex] = useState<number>(0);
  const [showLoc2ArtisanLore, setShowLoc2ArtisanLore] = useState<boolean>(false);
  const [loc2ArtisanTurnIndex, setLoc2ArtisanTurnIndex] = useState<number>(0);
  const [showArmorLore, setShowArmorLore] = useState<boolean>(false);
  const [showCostumeRackLore, setShowCostumeRackLore] = useState<boolean>(false);

  // Khu mở đầu: Người đi đường
  const [showStreetPasserbyLore, setShowStreetPasserbyLore] = useState<boolean>(false);

  // Đối thoại Địa điểm 3: Xưởng Tranh Hàng Trống
  const [showLoc3ArrivalSequence, setShowLoc3ArrivalSequence] = useState<boolean>(false);
  const [loc3ArrivalTurnIndex, setLoc3ArrivalTurnIndex] = useState<number>(0);
  const [showLoc3PaintingsLore, setShowLoc3PaintingsLore] = useState<boolean>(false);
  const [showLoc3CarverLore, setShowLoc3CarverLore] = useState<boolean>(false);
  const [loc3CarverTurnIndex, setLoc3CarverTurnIndex] = useState<number>(0);

  // Đối thoại Địa điểm 4: Hiệu Tơ Lụa Hàng Gai
  const [showLoc4ArrivalSequence, setShowLoc4ArrivalSequence] = useState<boolean>(false);
  const [loc4ArrivalTurnIndex, setLoc4ArrivalTurnIndex] = useState<number>(0);
  const [showLoc4ArtisanLore, setShowLoc4ArtisanLore] = useState<boolean>(false);
  const [loc4ArtisanTurnIndex, setLoc4ArtisanTurnIndex] = useState<number>(0);
  const [showLoc4TeaTableLore, setShowLoc4TeaTableLore] = useState<boolean>(false);
  const [showLoc4TapestryLore, setShowLoc4TapestryLore] = useState<boolean>(false);
  const [showLoc4ShelvesLore, setShowLoc4ShelvesLore] = useState<boolean>(false);

  // Đối thoại Địa điểm 5: Đình Đông Hương
  const [showLoc5ArrivalSequence, setShowLoc5ArrivalSequence] = useState<boolean>(false);
  const [loc5ArrivalTurnIndex, setLoc5ArrivalTurnIndex] = useState<number>(0);
  const [showLoc5ArtisanLore, setShowLoc5ArtisanLore] = useState<boolean>(false);
  const [loc5ArtisanTurnIndex, setLoc5ArtisanTurnIndex] = useState<number>(0);
  const [showLoc5LotusLore, setShowLoc5LotusLore] = useState<boolean>(false);
  const [showLoc5CoupletsLore, setShowLoc5CoupletsLore] = useState<boolean>(false);
  const [showLoc5TigerMuralLore, setShowLoc5TigerMuralLore] = useState<boolean>(false);
  const [showLoc5BellLore, setShowLoc5BellLore] = useState<boolean>(false);

  const [decoyLoreModal, setDecoyLoreModal] = useState<{
    title: string;
    speakerRole: string;
    content: React.ReactNode;
  } | null>(null);

  // Đối thoại Địa điểm giả có đối đáp
  const [decoyDialogue, setDecoyDialogue] = useState<{
    locName: string;
    atmosphere: string;
    turns: DialogueTurn[];
  } | null>(null);
  const [decoyTurnIndex, setDecoyTurnIndex] = useState<number>(0);

  const [decoyArrivalNotice, setDecoyArrivalNotice] = useState<{
    locName: string;
    atmosphere: string;
    description: string;
    dialogue: string[];
  } | null>(null);

  // Quản lý tập hợp phím & con trỏ đang giữ cho mỗi hướng
  const leftInputsRef = useRef<Set<string>>(new Set());
  const rightInputsRef = useRef<Set<string>>(new Set());
  const clickTargetXRef = useRef<number | null>(null);
  const stepDistanceAccRef = useRef<number>(0);
  const onArriveCallbackRef = useRef<(() => void) | null>(null);
  const teleportTimeoutRef = useRef<number | null>(null);

  const isModalOpen =
    showMap ||
    showWorkbench ||
    showFanRack ||
    showPulpInfo ||
    showOpeningPrologueSequence ||
    showHubElderDialogue ||
    showLoc1ArtisanLore ||
    showLoc1ArrivalSequence ||
    showLoc2ArrivalSequence ||
    showLoc2ArtisanLore ||
    showArmorLore ||
    showCostumeRackLore ||
    showStreetPasserbyLore ||
    showLoc3ArrivalSequence ||
    showLoc3PaintingsLore ||
    showLoc3CarverLore ||
    showLoc4ArrivalSequence ||
    showLoc4ArtisanLore ||
    showLoc4TeaTableLore ||
    showLoc4TapestryLore ||
    showLoc4ShelvesLore ||
    showLoc5ArrivalSequence ||
    showLoc5ArtisanLore ||
    showLoc5LotusLore ||
    showLoc5CoupletsLore ||
    showLoc5TigerMuralLore ||
    showLoc5BellLore ||
    Boolean(decoyLoreModal) ||
    Boolean(decoyDialogue) ||
    Boolean(decoyArrivalNotice) ||
    journalOpen;

  const stopAllMovement = useCallback((nextAction: CharacterAction = 'idle') => {
    leftInputsRef.current.clear();
    rightInputsRef.current.clear();
    clickTargetXRef.current = null;
    onArriveCallbackRef.current = null;
    setIsMoving(false);
    setAction(nextAction);
  }, []);

  useEffect(() => {
    return () => {
      if (teleportTimeoutRef.current !== null) {
        window.clearTimeout(teleportTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      leftInputsRef.current.clear();
      rightInputsRef.current.clear();
      clickTargetXRef.current = null;
      onArriveCallbackRef.current = null;
      setIsMoving(false);
    }
  }, [isModalOpen]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const updateSize = () => {
      setViewportWidth(el.clientWidth || 1024);
      setViewportHeight(el.clientHeight || 600);
    };
    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Tỷ lệ khung hình gốc chính xác của từng bức ảnh 6.webp, 7.webp, 8.webp, 9.webp, 10.webp, 11.webp và 5 địa điểm giả
  const getSceneAspectRatio = (scene: SceneRoomId): number => {
    if (scene === 'opening_hub') return 1926 / 817; // 6.webp (~2.3574)
    if (scene === 'location_1_xuan_phien_thi') return 1584 / 672; // 7.webp (~2.3571)
    if (scene === 'location_2_ma_vi') return 1672 / 941; // 8.webp (~1.7768)
    if (scene === 'location_3_hang_trong') return 1672 / 941; // 9.webp (~1.7768)
    if (scene === 'location_4_hang_gai') return 1672 / 941; // 10.webp (~1.7768)
    if (scene === 'location_5_dong_huong') return 1670 / 942; // 11.webp (~1.7728)
    if (
      scene === 'decoy_hang_quat' ||
      scene === 'decoy_hang_hom' ||
      scene === 'decoy_quan_tra' ||
      scene === 'decoy_nam_huong' ||
      scene === 'decoy_ha_vi'
    ) {
      return 1670 / 942; // ~1.7728 (tỷ lệ chuẩn 16:9 của 5 ảnh địa điểm giả)
    }
    return 1926 / 817;
  };

  const aspectRatio = getSceneAspectRatio(currentScene);
  const worldHeight = Math.max(260, viewportHeight);
  const worldWidth = Math.max(viewportWidth, Math.round(worldHeight * aspectRatio));

  // Giới hạn biên di chuyển tùy theo bối cảnh để tránh nhân vật đè lên đồ nội thất/bình gốm bên phải
  const getSceneBounds = (scene: SceneRoomId): { minX: number; maxX: number } => {
    if (scene === 'opening_hub') {
      return { minX: 10, maxX: 74 }; // Safezone: không đi lấn vào kệ tủ và chậu gốm bên phải (x > 74%)
    }
    return { minX: MIN_PLAYER_X, maxX: MAX_PLAYER_X };
  };

  // Vùng tương tác theo từng bối cảnh (Scene):
  // 0. KHU MỞ ĐẦU / SAFEZONE (opening_hub - 6.webp):
  const isNearHubPasserby = currentScene === 'opening_hub' && playerX >= 8 && playerX <= 26;
  const isNearHubCenterKiosk = currentScene === 'opening_hub' && playerX >= 36 && playerX <= 61;
  const isNearHubRightShop = currentScene === 'opening_hub' && playerX >= 62 && playerX <= 74;

  // 1. ĐỊA ĐIỂM 1: ĐÌNH XUÂN PHIẾN THỊ (location_1_xuan_phien_thi - 7.webp):
  const isNearPulpVat =
    currentScene === 'location_1_xuan_phien_thi' && playerX >= 8 && playerX <= 26;
  const isNearLoc1Artisan =
    currentScene === 'location_1_xuan_phien_thi' && playerX >= 27 && playerX <= 42;
  const isNearLoc1CenterTable =
    currentScene === 'location_1_xuan_phien_thi' && playerX >= 43 && playerX <= 66;
  const isNearFanRack =
    currentScene === 'location_1_xuan_phien_thi' && playerX >= 74 && playerX <= 94;

  // 2. ĐỊA ĐIỂM 2: HIỆU PHỤC SỨC MÃ VĨ (location_2_ma_vi - 8.webp):
  const isNearLeftArchway = currentScene === 'location_2_ma_vi' && playerX >= 6 && playerX <= 20;
  const isNearCostumeRack = currentScene === 'location_2_ma_vi' && playerX >= 22 && playerX <= 38;
  const isNearArmorDisplay = currentScene === 'location_2_ma_vi' && playerX >= 40 && playerX <= 60;
  const isNearRightBookTable =
    currentScene === 'location_2_ma_vi' && playerX >= 66 && playerX <= 88;

  // 3. ĐỊA ĐIỂM 3: XƯỞNG TRANH HÀNG TRỐNG (location_3_hang_trong - 9.webp):
  const isNearLoc3LeftPaintings =
    currentScene === 'location_3_hang_trong' && playerX >= 8 && playerX <= 30;
  const isNearLoc3CenterLensTable =
    currentScene === 'location_3_hang_trong' && playerX >= 36 && playerX <= 64;
  const isNearLoc3RightCarver =
    currentScene === 'location_3_hang_trong' && playerX >= 72 && playerX <= 92;

  // 4. ĐỊA ĐIỂM 4: HIỆU TƠ LỤA HÀNG GAI (location_4_hang_gai - 10.webp):
  const isNearLoc4Exit =
    currentScene === 'location_4_hang_gai' && playerX >= 6 && playerX <= 18;
  const isNearLoc4TeaTable =
    currentScene === 'location_4_hang_gai' && playerX >= 10 && playerX <= 26;
  const isNearLoc4CenterTable =
    currentScene === 'location_4_hang_gai' && playerX >= 36 && playerX <= 64;
  const isNearLoc4Tapestry =
    currentScene === 'location_4_hang_gai' && playerX >= 42 && playerX <= 60;
  const isNearLoc4Shelves =
    currentScene === 'location_4_hang_gai' && playerX >= 74 && playerX <= 94;

  // 5. ĐỊA ĐIỂM 5: ĐÌNH ĐÔNG HƯƠNG (location_5_dong_huong - 11.webp):
  const isNearLoc5Exit =
    currentScene === 'location_5_dong_huong' && playerX >= 6 && playerX <= 18;
  const isNearLoc5Lotus =
    currentScene === 'location_5_dong_huong' && playerX >= 10 && playerX <= 26;
  const isNearLoc5Couplets =
    currentScene === 'location_5_dong_huong' && playerX >= 22 && playerX <= 38;
  const isNearLoc5Altar =
    currentScene === 'location_5_dong_huong' && playerX >= 38 && playerX <= 62;
  const isNearLoc5TigerMural =
    currentScene === 'location_5_dong_huong' && playerX >= 42 && playerX <= 58;
  const isNearLoc5Bell =
    currentScene === 'location_5_dong_huong' && playerX >= 74 && playerX <= 94;

  // 6. CÁC ĐỊA ĐIỂM GIẢ (DECOY LOCATIONS):
  const isDecoyScene =
    currentScene === 'decoy_hang_quat' ||
    currentScene === 'decoy_hang_hom' ||
    currentScene === 'decoy_quan_tra' ||
    currentScene === 'decoy_nam_huong' ||
    currentScene === 'decoy_ha_vi';

  const isNearDecoyLeft = isDecoyScene && playerX >= 8 && playerX <= 28;
  const isNearDecoyCenter = isDecoyScene && playerX >= 36 && playerX <= 64;
  const isNearDecoyRight = isDecoyScene && playerX >= 72 && playerX <= 94;

  // 7. CÁC ĐỊA ĐIỂM KHÁC TRÊN BẢN ĐỒ (other_location):
  const isNearOtherMainSpot = currentScene === 'other_location' && playerX >= 38 && playerX <= 62;

  // Đi bộ mượt mà tới tọa độ khi click sàn (áp dụng đúng biên bối cảnh)
  const smoothWalkTo = useCallback((targetX: number) => {
    const { minX, maxX } = getSceneBounds(currentScene);
    const clamped = Math.max(minX, Math.min(maxX, targetX));
    clickTargetXRef.current = clamped;
    onArriveCallbackRef.current = null;
    setFacing(clamped > playerXRef.current ? 'right' : 'left');
    setIsMoving(true);
    setAction('walk');
  }, [currentScene]);

  // Tương tác trực tiếp khi nhấp vào điểm tương tác hoặc di chuyển nhanh
  const walkToAndExecute = useCallback((targetX: number, onArrive?: () => void) => {
    const { minX, maxX } = getSceneBounds(currentScene);
    const clamped = Math.max(minX, Math.min(maxX, targetX));
    playerXRef.current = clamped;
    setPlayerX(clamped);
    leftInputsRef.current.clear();
    rightInputsRef.current.clear();
    clickTargetXRef.current = null;
    onArriveCallbackRef.current = null;
    setIsMoving(false);
    if (onArrive) {
      onArrive();
    } else {
      setAction('idle');
    }
  }, [currentScene]);

  const openWorkbenchWithMode = useCallback(
    (mode: WorkbenchMode, pose: CharacterAction = 'work') => {
      stopAllMovement(pose);
      setWorkbenchMode(mode);
      setShowWorkbench(true);
    },
    [stopAllMovement]
  );

  // Quay về Khu Mở Đầu / Safezone (6.webp)
  const teleportToOpeningHub = useCallback(
    (spawnX = 50, fromCompletedLocId?: string) => {
      if (teleportTimeoutRef.current !== null) {
        window.clearTimeout(teleportTimeoutRef.current);
      }
      sounds.playWoodClop();
      setShowMap(false);
      setShowWorkbench(false);
      stopAllMovement('surprise');
      setCurrentLocationId('opening_hub');
      setCurrentScene('opening_hub');

      if (fromCompletedLocId && SAFEZONE_RETURN_NOTICES[fromCompletedLocId]) {
        setSafezoneNotice(SAFEZONE_RETURN_NOTICES[fromCompletedLocId]);
      }

      teleportTimeoutRef.current = window.setTimeout(() => {
        playerXRef.current = spawnX;
        setPlayerX(spawnX);
        setFacing('right');
        setAction('idle');
      }, 150);
    },
    [stopAllMovement]
  );

  // Dịch chuyển tức thời (Teleport) từ Bản Đồ tới địa điểm bất kỳ
  const handleFastTravel = useCallback(
    (loc: LocationData) => {
      if (teleportTimeoutRef.current !== null) {
        window.clearTimeout(teleportTimeoutRef.current);
      }
      setSafezoneNotice(null);
      setCurrentLocationId(loc.id);
      setShowMap(false);
      setShowWorkbench(false);
      stopAllMovement('surprise');

      let targetScene: SceneRoomId = 'other_location';
      let targetX = 50;
      let targetFacing: 'left' | 'right' = 'right';

      if (loc.id === 'xuan_phien_thi') {
        targetScene = 'location_1_xuan_phien_thi';
        targetX = 46; // Đứng trước bàn chế tác quạt trung tâm Địa điểm 1 (7.webp)
        targetFacing = 'right';
        setShowLoc1ArrivalSequence(true);
        setLoc1ArrivalStep(0);
      } else if (loc.id === 'ma_vi') {
        targetScene = 'location_2_ma_vi';
        targetX = 50; // Đứng giữa gian hiệu Mã Vĩ trước 3 bộ trang phục & bàn sổ (8.webp)
        targetFacing = 'right';
        setShowLoc2ArrivalSequence(true);
        setLoc2ArrivalTurnIndex(0);
      } else if (loc.id === 'hang_trong') {
        targetScene = 'location_3_hang_trong';
        targetX = 50; // Đứng trước bàn kính lúp soi 5 bản in thử ở giữa Địa điểm 3 (9.webp)
        targetFacing = 'right';
        setShowLoc3ArrivalSequence(true);
        setLoc3ArrivalTurnIndex(0);
      } else if (loc.id === 'hang_gai') {
        targetScene = 'location_4_hang_gai';
        targetX = 50; // Đứng trước bàn pha màu giữa Hiệu tơ lụa Hàng Gai (10.webp)
        targetFacing = 'right';
        setShowLoc4ArrivalSequence(true);
        setLoc4ArrivalTurnIndex(0);
      } else if (loc.id === 'dong_huong') {
        targetScene = 'location_5_dong_huong';
        targetX = 50; // Đứng trước bàn thờ chính giữa Đình Đông Hương (11.webp)
        targetFacing = 'right';
        setShowLoc5ArrivalSequence(true);
        setLoc5ArrivalTurnIndex(0);
      } else if (loc.id === 'hang_quat') {
        targetScene = 'decoy_hang_quat';
        targetX = 50;
        targetFacing = 'right';
        setDecoyDialogue({
          locName: loc.name,
          atmosphere: loc.atmosphere,
          turns: [
            {
              speaker: 'Chủ Hiệu Quạt Hàng Quạt',
              speakerRole: 'Hiệu Buôn Phố Xá',
              avatarType: 'villager',
              content: [
                'Chủ hiệu mải miết gảy bàn tính tí tách bên sạp quạt ngũ sắc rực rỡ.',
                '“Quạt nhà tôi bán cho khách đi trẩy hội, vui chơi ngày Tết, chẳng giữ manh mối kỳ bí nào của dòng tranh Hàng Trống cả người lạ ơi!”',
              ],
            },
            {
              speaker: 'Chiếc Bóng Vô Hình',
              speakerRole: 'Tự Nhủ',
              avatarType: 'player',
              content: [
                'Quan sát kỹ những chiếc quạt thương mại này, tôi nhận ra chúng đều là quạt bồi thông thường.',
                'Chiếc quạt mang biểu tượng Thần Hổ phương Tây thuộc Kim nhất định phải ẩn giấu ở đình tổ nghề Đình Xuân Phiến Thị, chứ không thể ở hiệu buôn này!',
              ],
              hint: '💡 Hãy mở Bản Đồ Cổ và tìm đến Đình Xuân Phiến Thị để thu thập Giấy Dó.',
              actionLabel: 'Mở Bản Đồ Dịch Chuyển ➔',
            },
          ],
        });
        setDecoyTurnIndex(0);
      } else if (loc.id === 'hang_hom') {
        targetScene = 'decoy_hang_hom';
        targetX = 50;
        targetFacing = 'right';
        setDecoyDialogue({
          locName: loc.name,
          atmosphere: loc.atmosphere,
          turns: [
            {
              speaker: 'Bác Thợ Đóng Rương Hàng Hòm',
              speakerRole: 'Thợ Mộc Phố Nghề',
              avatarType: 'artisan',
              content: [
                'Tiếng cưa xẻ gỗ vang lên rầm rập, mùn cưa thông ngai ngái bay mù mịt.',
                '“Ở đây chỉ đóng rương, hòm gỗ sơn cánh gián để đựng của cải y phục thôi, không có cổ vật Ngũ Hổ đâu bạn trẻ!”',
              ],
            },
            {
              speaker: 'Chiếc Bóng Vô Hình',
              speakerRole: 'Tự Nhủ',
              avatarType: 'player',
              content: [
                'Rương hòm tuy làm bằng gỗ nhưng không phải nơi khắc ván mộc bản in tranh.',
                'Nơi lưu giữ ván khắc mộc bản cổ thuộc Hành Kim ắt phải là Xưởng Tranh Hàng Trống!',
              ],
              hint: '💡 Hãy mở Bản Đồ Cổ và tìm đến Xưởng Tranh Hàng Trống để thu thập Ván Khắc Gỗ.',
              actionLabel: 'Mở Bản Đồ Dịch Chuyển ➔',
            },
          ],
        });
        setDecoyTurnIndex(0);
      } else if (loc.id === 'quan_tra') {
        targetScene = 'decoy_quan_tra';
        targetX = 50;
        targetFacing = 'right';
        setDecoyDialogue({
          locName: loc.name,
          atmosphere: loc.atmosphere,
          turns: [
            {
              speaker: 'Bà Chủ Quán Trà Gốc Đa',
              speakerRole: 'Nhàn Tản Phố Thị',
              avatarType: 'hostess',
              content: [
                'Bà chủ quán đon đả rót chén nước chè xanh mạn nóng hổi bên ấm tích bọc rơm.',
                '“Uống chén trà cho ấm lòng rồi hẵng đi tìm manh mối tiếp, bạn trẻ à! Ở đây chỉ có nước chè mạn, kẹo lạc với khói điếu cày thôi.”',
              ],
            },
            {
              speaker: 'Chiếc Bóng Vô Hình',
              speakerRole: 'Tự Nhủ',
              avatarType: 'player',
              content: [
                'Chén trà sen thật đậm đà phong vị kinh kỳ, nhưng đây là nơi nhàn tản dừng chân của khách bộ hành, không cất giấu đạo cụ Ngũ Hành.',
                'Tôi cần mở lại Hàng Trống Địa Đồ để đi tìm đúng 5 phường nghề truyền thống!',
              ],
              hint: '💡 Quán trà là nơi dừng chân nghỉ ngơi, hãy mở Bản Đồ Cổ để định vị 5 phường nghề thật.',
              actionLabel: 'Mở Bản Đồ Dịch Chuyển ➔',
            },
          ],
        });
        setDecoyTurnIndex(0);
      } else if (loc.id === 'nam_huong') {
        targetScene = 'decoy_nam_huong';
        targetX = 50;
        targetFacing = 'right';
        setDecoyDialogue({
          locName: loc.name,
          atmosphere: loc.atmosphere,
          turns: [
            {
              speaker: 'Cụ Già Ngồi Dưới Gốc Bàng',
              speakerRole: 'Đình Cổ Bên Hồ',
              avatarType: 'elder',
              content: [
                'Cụ già trầm ngâm nhìn sóng nước hồ Hoàn Kiếm dập dềnh dưới bóng cây bàng cổ thụ.',
                '“Đình Nam Hương ta thờ vua Lê Thái Tổ cùng các bậc tiền nhân anh hùng xã tắc, nơi đây không liên can đến điển tích tranh Ngũ Hổ phố nghề.”',
              ],
            },
            {
              speaker: 'Chiếc Bóng Vô Hình',
              speakerRole: 'Tự Nhủ',
              avatarType: 'player',
              content: [
                'Tôi kính cẩn cúi đầu trước công đức tiền nhân.',
                'Ngôi đình thờ thần linh trấn thủ gắn liền với dòng tranh Hàng Trống và Hành Thổ chính là Đình Đông Hương cổ kính!',
              ],
              hint: '💡 Hãy mở Bản Đồ Cổ và tìm đến Đình Đông Hương để thu thập Bút Lông.',
              actionLabel: 'Mở Bản Đồ Dịch Chuyển ➔',
            },
          ],
        });
        setDecoyTurnIndex(0);
      } else if (loc.id === 'ha_vi') {
        targetScene = 'decoy_ha_vi';
        targetX = 50;
        targetFacing = 'right';
        setDecoyDialogue({
          locName: loc.name,
          atmosphere: loc.atmosphere,
          turns: [
            {
              speaker: 'Bác Thợ Sơn Then Hà Vĩ',
              speakerRole: 'Phố Nghề Sơn Thiếp',
              avatarType: 'artisan',
              content: [
                'Mùi dầu trẩu và sơn ta ngai ngái bốc lên từ những chiếc tráp sơn son đang phơi ngoài hiên.',
                '“Nơi đây thợ sơn đang miết then vàng, thiếp bạc cho hoành phi câu đối, chẳng có bóng dáng ván in hay mực tranh Tết nào cả.”',
              ],
            },
            {
              speaker: 'Chiếc Bóng Vô Hình',
              speakerRole: 'Tự Nhủ',
              avatarType: 'player',
              content: [
                'Nghề sơn then thếp vàng quả thật kỳ công, nhưng đạo cụ Hắc Hổ thuộc Hành Thủy lại gắn liền với râu tóc, cờ lệnh và mực đen của Hiệu Phục Sức Mã Vĩ.',
                'Tôi phải quay lại bản đồ để tới Ngõ Mã Vĩ!',
              ],
              hint: '💡 Hãy mở Bản Đồ Cổ và tìm đến Hiệu Phục Sức Mã Vĩ để thu thập Mực Tàu.',
              actionLabel: 'Mở Bản Đồ Dịch Chuyển ➔',
            },
          ],
        });
        setDecoyTurnIndex(0);
      } else {
        targetScene = 'other_location';
        targetX = 50;
        targetFacing = 'right';
      }

      setCurrentScene(targetScene);
      teleportTimeoutRef.current = window.setTimeout(() => {
        playerXRef.current = targetX;
        setPlayerX(targetX);
        setFacing(targetFacing);
        setAction('idle');
      }, 160);
    },
    [stopAllMovement]
  );

  // Kích hoạt tương tác tại vị trí hiện tại (Phím E hoặc nút bấm)
  const triggerInteract = useCallback(() => {
    sounds.playClick();
    const x = playerXRef.current;

    // 0. KHU MỞ ĐẦU / SAFEZONE (opening_hub - 6.webp)
    if (currentScene === 'opening_hub') {
      if (x >= 8 && x <= 26) {
        stopAllMovement('look_up');
        setShowStreetPasserbyLore(true);
      } else if (x >= 60 && x <= 78) {
        openWorkbenchWithMode('PRINT_WORKSHOP', 'work');
      } else if (x >= 36 && x <= 59) {
        stopAllMovement('note');
        setShowMap(true);
      } else {
        walkToAndExecute(50, () => {
          stopAllMovement('note');
          setShowMap(true);
        });
      }
      return;
    }

    // 1. ĐỊA ĐIỂM 1: ĐÌNH XUÂN PHIẾN THỊ (location_1_xuan_phien_thi - 7.webp)
    if (currentScene === 'location_1_xuan_phien_thi') {
      if (x >= 27 && x <= 42) {
        stopAllMovement('inspect');
        setShowLoc1ArtisanLore(true);
        setLoc1ArtisanTurnIndex(0);
      } else if (x >= 43 && x <= 66) {
        openWorkbenchWithMode('CURRENT_TASK', 'work');
      } else if (x >= 74 && x <= 94) {
        stopAllMovement('inspect');
        setShowFanRack(true);
      } else if (x >= 8 && x <= 26) {
        stopAllMovement('look_up');
        setShowPulpInfo(true);
      } else {
        walkToAndExecute(46, () => {
          openWorkbenchWithMode('CURRENT_TASK', 'work');
        });
      }
      return;
    }

    // 2. ĐỊA ĐIỂM 2: HIỆU PHỤC SỨC MÃ VĨ (location_2_ma_vi - 8.webp)
    if (currentScene === 'location_2_ma_vi') {
      if (x >= 76 && x <= 94) {
        stopAllMovement('inspect');
        setShowLoc2ArtisanLore(true);
        setLoc2ArtisanTurnIndex(0);
      } else if (x >= 62 && x <= 75) {
        openWorkbenchWithMode('CURRENT_TASK', 'work');
      } else if (x >= 40 && x <= 60) {
        stopAllMovement('inspect');
        setShowArmorLore(true);
      } else if (x >= 22 && x <= 38) {
        stopAllMovement('inspect');
        setShowCostumeRackLore(true);
      } else if (x >= 6 && x <= 20) {
        teleportToOpeningHub(50);
      } else {
        walkToAndExecute(76, () => {
          openWorkbenchWithMode('CURRENT_TASK', 'work');
        });
      }
      return;
    }

    // 3. ĐỊA ĐIỂM 3: XƯỞNG TRANH HÀNG TRỐNG (location_3_hang_trong - 9.webp)
    if (currentScene === 'location_3_hang_trong') {
      if (x >= 72 && x <= 94) {
        stopAllMovement('inspect');
        setShowLoc3CarverLore(true);
        setLoc3CarverTurnIndex(0);
      } else if (x >= 36 && x <= 64) {
        openWorkbenchWithMode('CURRENT_TASK', 'work');
      } else if (x >= 8 && x <= 30) {
        stopAllMovement('look_up');
        setShowLoc3PaintingsLore(true);
      } else {
        walkToAndExecute(50, () => {
          openWorkbenchWithMode('CURRENT_TASK', 'work');
        });
      }
      return;
    }

    // 4. ĐỊA ĐIỂM 4: HIỆU TƠ LỤA HÀNG GAI (location_4_hang_gai - 10.webp)
    if (currentScene === 'location_4_hang_gai') {
      if (x >= 74 && x <= 94) {
        stopAllMovement('inspect');
        setShowLoc4ArtisanLore(true);
        setLoc4ArtisanTurnIndex(0);
      } else if (x >= 36 && x <= 64) {
        openWorkbenchWithMode('CURRENT_TASK', 'work');
      } else if (x >= 6 && x <= 18) {
        teleportToOpeningHub(50);
      } else if (x >= 10 && x <= 26) {
        stopAllMovement('inspect');
        setShowLoc4TeaTableLore(true);
      } else {
        walkToAndExecute(50, () => {
          openWorkbenchWithMode('CURRENT_TASK', 'work');
        });
      }
      return;
    }

    // 5. ĐỊA ĐIỂM 5: ĐÌNH ĐÔNG HƯƠNG (location_5_dong_huong - 11.webp)
    if (currentScene === 'location_5_dong_huong') {
      if (x >= 74 && x <= 94) {
        stopAllMovement('inspect');
        setShowLoc5ArtisanLore(true);
        setLoc5ArtisanTurnIndex(0);
      } else if (x >= 38 && x <= 62) {
        openWorkbenchWithMode('CURRENT_TASK', 'work');
      } else if (x >= 6 && x <= 18) {
        teleportToOpeningHub(50);
      } else if (x >= 10 && x <= 26) {
        stopAllMovement('inspect');
        setShowLoc5LotusLore(true);
      } else if (x >= 24 && x <= 38) {
        stopAllMovement('look_up');
        setShowLoc5CoupletsLore(true);
      } else {
        walkToAndExecute(50, () => {
          openWorkbenchWithMode('CURRENT_TASK', 'work');
        });
      }
      return;
    }

    // 6. ĐỊA ĐIỂM GIẢ 1: HIỆU QUẠT HÀNG QUẠT (decoy_hang_quat)
    if (currentScene === 'decoy_hang_quat') {
      if (x >= 8 && x <= 28) {
        stopAllMovement('inspect');
        setDecoyLoreModal({
          title: 'Giỏ Nan Quạt Tre',
          speakerRole: 'Hiệu Quạt Hàng Quạt',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Những bó quạt nan tre bọc giấy dầu được xếp ngay ngắn trong giỏ nan, chuẩn bị đóng hàng chuyển đi các tỉnh trẩy hội mùa xuân."</p>
              <p className="italic text-amber-200/90">"Bạn kiểm tra kỹ từng lớp nan nhưng không tìm thấy mảnh giấy dó cổ truyền nào. Đây chỉ là quạt buôn bán thương mại thông thường."</p>
              <p className="text-amber-400 text-xs pt-1">💡 <em>Gợi ý: Đình làng nghề cổ truyền Xuân Phiến Thị mới là nơi cất giấu 5 chiếc quạt nan tre của Thần Hổ Mộc!</em></p>
            </div>
          ),
        });
      } else if (x >= 72 && x <= 94) {
        stopAllMovement('inspect');
        setDecoyLoreModal({
          title: 'Kệ Quạt Lụa Phố Phường',
          speakerRole: 'Hiệu Quạt Hàng Quạt',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Trên kệ bày la liệt những chiếc quạt lụa thêu hoa mẫu đơn, chim công rực rỡ sắc màu, quạt giấy bồi vẽ phong cảnh non nước hữu tình."</p>
              <p className="italic text-amber-200/90">"Quạt ở đây tuy đẹp mắt nhưng nét vẽ hiện đại, không có cấu trúc họa tiết liên kết ngũ hành như chiếc quạt trong manh mối tranh Ngũ Hổ."</p>
            </div>
          ),
        });
      } else {
        stopAllMovement('note');
        setDecoyLoreModal({
          title: 'Trò Chuyện Với Chủ Hiệu Quạt',
          speakerRole: 'Hiệu Quạt Hàng Quạt',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>Chủ hiệu đang mải miết gảy bàn tính tí tách bên cuốn sổ cái, ngẩng đầu cười xởi lởi:</p>
              <p className="italic text-amber-200/90">"Quạt nhà tôi làm bằng giấy bồi, quạt lụa thêu hoa bán cho khách đi trẩy hội che nắng làm duyên ngày hè. Chẳng có chiếc quạt cổ kỳ bí nào liên quan tới dòng tranh thờ Ngũ Hổ cả đâu bạn trẻ!"</p>
              <p className="text-emerald-300 text-xs pt-1">⚠️ <strong>Địa điểm đánh lạc hướng:</strong> Hãy mở Bản Đồ [M] đối chiếu manh mối về tiếng chuốt nan tre bên hiên đình xưa!</p>
            </div>
          ),
        });
      }
      return;
    }

    // 7. ĐỊA ĐIỂM GIẢ 2: HIỆU ĐỒ SƠN HÀNG HÒM (decoy_hang_hom)
    if (currentScene === 'decoy_hang_hom') {
      if (x >= 8 && x <= 28) {
        stopAllMovement('inspect');
        setDecoyLoreModal({
          title: 'Dụng Cụ Thợ Mộc Đóng Rương',
          speakerRole: 'Hiệu Đồ Sơn Hàng Hòm',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Rìu sắt, đục thô và những khúc gỗ lim xẻ dở nằm ngổn ngang bên gốc thớt, phoi bào cuộn đầy mặt sàn đá."</p>
              <p className="italic text-amber-200/90">"Đây là những dụng cụ chặt gỗ đóng rương hòm khổ lớn, hoàn toàn khác với mũi đục thép tôi sắc bén tỉ mỉ của nghệ nhân mộc bản tranh Hàng Trống."</p>
            </div>
          ),
        });
      } else if (x >= 72 && x <= 94) {
        stopAllMovement('inspect');
        setDecoyLoreModal({
          title: 'Thùng Sơn Ta Cánh Gián',
          speakerRole: 'Hiệu Đồ Sơn Hàng Hòm',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Chiếc thùng gỗ chứa đầy sơn ta sánh đặc màu cánh gián, mùi dầu trẩu nồng nàn lan tỏa khắp gian phòng."</p>
              <p className="italic text-amber-200/90">"Lớp sơn này dùng để miết then và chống mối mọt cho rương hòm, không phải là loại mực tàu muội than luyện lửa dùng để in tranh thờ."</p>
            </div>
          ),
        });
      } else {
        stopAllMovement('inspect');
        setDecoyLoreModal({
          title: 'Hỏi Bác Thợ Mộc Đóng Hòm',
          speakerRole: 'Hiệu Đồ Sơn Hàng Hòm',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>Bác thợ mộc quệt mồ hôi trên trán, nhìn bạn lắc đầu cười:</p>
              <p className="italic text-amber-200/90">"Ở đây chỉ đóng rương, hòm da, hộp đựng y phục cho quan khách và dân gian đựng của cải thôi. Cổ vật Ngũ Hổ và ván khắc gỗ in tranh thì phải sang xưởng tranh Hàng Trống bên kia mới đúng nơi!"</p>
              <p className="text-emerald-300 text-xs pt-1">⚠️ <strong>Địa điểm đánh lạc hướng:</strong> Hãy mở Bản Đồ [M] để di chuyển tới Xưởng Tranh Hàng Trống!</p>
            </div>
          ),
        });
      }
      return;
    }

    // 8. ĐỊA ĐIỂM GIẢ 3: QUÁN TRÀ GỐC ĐA (decoy_quan_tra)
    if (currentScene === 'decoy_quan_tra') {
      if (x >= 8 && x <= 28) {
        stopAllMovement('look_up');
        setDecoyLoreModal({
          title: 'Gốc Đa Cổ Thụ & Bờ Tường Rêu',
          speakerRole: 'Quán Trà Gốc Đa',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Tán bồ đề xum xuê che mát một khoảng trời, rễ đa buông rủ thướt tha ôm lấy bức tường gạch hoa thủng lỗ hoa văn cổ kính."</p>
              <p className="italic text-amber-200/90">"Tiếng lá xào xạc theo làn gió thu, mang lại cảm giác bình yên, êm ả giữa lòng kinh kỳ Thăng Long hoa lệ."</p>
            </div>
          ),
        });
      } else if (x >= 72 && x <= 94) {
        stopAllMovement('look_up');
        setDecoyLoreModal({
          title: 'Khung Cảnh Phố Phường Xa',
          speakerRole: 'Quán Trà Gốc Đa',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Từ bóng râm quán nước nhìn ra xa, dòng người áo the khăn xếp tấp nập qua lại giữa phố phường buôn bán nhộn nhịp."</p>
              <p className="italic text-amber-200/90">"Quán trà chỉ là nơi dừng chân nghỉ ngơi, uống ngụm nước mát của khách bộ hành, không cất giấu đạo cụ phục chế tranh Ngũ Hổ."</p>
            </div>
          ),
        });
      } else {
        stopAllMovement('note');
        setDecoyLoreModal({
          title: 'Chõng Trà Mạn & Đĩa Kẹo Lạc',
          speakerRole: 'Quán Trà Gốc Đa',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>Khói trà sen thơm ngát bốc lên từ ấm tích ủ trong giỏ nan, mấy bác khách bộ hành cười xòa:</p>
              <p className="italic text-amber-200/90">"Uống chén nước chè tươi cho ấm lòng, nhai miếng kẹo lạc giòn tan rồi hẵng đi tìm manh mối tiếp, bạn trẻ à! Ở đây chỉ có trà thơm với điếu cày thôi, làm gì có đạo cụ cổ nào!"</p>
              <p className="text-emerald-300 text-xs pt-1">⚠️ <strong>Địa điểm đánh lạc hướng:</strong> Hãy mở Bản Đồ [M] để tiếp tục hành trình điều tra!</p>
            </div>
          ),
        });
      }
      return;
    }

    // 9. ĐỊA ĐIỂM GIẢ 4: ĐÌNH NAM HƯƠNG (decoy_nam_huong)
    if (currentScene === 'decoy_nam_huong') {
      if (x >= 8 && x <= 38) {
        stopAllMovement('look_up');
        setDecoyLoreModal({
          title: 'Bàn Thờ Danh Tướng Xã Tắc',
          speakerRole: 'Đình Nam Hương',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Bàn thờ sơn son thếp vàng uy nghiêm phụng thờ vua Lê Thái Tổ cùng các bậc anh hùng hào kiệt gắn liền với sự tích hoàn trả gươm thần cho Rùa Vàng."</p>
              <p className="italic text-amber-200/90">"Không gian ngập tràn khói trầm linh thiêng thờ bậc anh hùng hộ quốc an dân, không thấy có dấu vết gì của Thần Hổ dân gian."</p>
            </div>
          ),
        });
      } else if (x >= 72 && x <= 94) {
        stopAllMovement('inspect');
        setDecoyLoreModal({
          title: 'Lư Đồng Cổ Đốt Trầm',
          speakerRole: 'Đình Nam Hương',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Chiếc lư đồng chạm nổi hình lân rồng ngậm ngọc, làn khói trầm uốn lượn bay qua song cửa gỗ hòa vào gió hồ mênh mông."</p>
            </div>
          ),
        });
      } else {
        stopAllMovement('look_up');
        setDecoyLoreModal({
          title: 'Khung Cửa Trông Ra Tháp Rùa & Hồ Gươm',
          speakerRole: 'Đình Nam Hương',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>Làn gió mát từ hồ Hoàn Kiếm thổi qua rặng liễu rủ biếc xanh. Từ cửa đình nhìn thẳng ra Tháp Rùa rêu phong giữa làn nước biếc. Một cụ già ngồi ngắm sóng nước:</p>
              <p className="italic text-amber-200/90">"Nơi đây thờ vua Lê và các danh tướng. Nếu con muốn tìm đình cổ thờ Ngũ Hổ trấn giữ linh khí đất Thăng Long, hãy tìm về ngôi Đình Đông Hương ở giữa phố nghề Hàng Trống!"</p>
              <p className="text-emerald-300 text-xs pt-1">⚠️ <strong>Địa điểm đánh lạc hướng:</strong> Đình thờ Thần Hổ trung tâm là Đình Đông Hương!</p>
            </div>
          ),
        });
      }
      return;
    }

    // 10. ĐỊA ĐIỂM GIẢ 5: ĐÌNH HÀ VĨ (decoy_ha_vi)
    if (currentScene === 'decoy_ha_vi') {
      if (x >= 8 && x <= 32) {
        stopAllMovement('inspect');
        setDecoyLoreModal({
          title: 'Bia Đá Rùa Đội Đình Cổ',
          speakerRole: 'Đình Hà Vĩ',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Cụ rùa đá đội văn bia cổ ghi công đức của các nghệ nhân làng Thường Tín đã lập nghiệp trên phố Hàng Hòm, lưu giữ nghề sơn son thiếp vàng truyền đời."</p>
              <p className="italic text-amber-200/90">"Đây là văn bia ghi nhận nghề sơn mài và đồ thờ, không liên quan tới nghề làm tranh khắc mộc bản Hàng Trống."</p>
            </div>
          ),
        });
      } else if (x >= 70 && x <= 94) {
        stopAllMovement('look_up');
        setDecoyLoreModal({
          title: 'Cột Đình Thếp Vàng & Rồng Đá',
          speakerRole: 'Đình Hà Vĩ',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>"Những hàng cột gỗ lim được chạm nổi hoa cúc thếp vàng lộng lẫy và đôi rồng đá chầu bậc thềm uy dũng."</p>
              <p className="italic text-amber-200/90">"Nghệ thuật sơn thếp Thăng Long đạt đến độ hoàn mỹ, nhưng nơi đây không cất giữ đạo cụ in tranh."</p>
            </div>
          ),
        });
      } else {
        stopAllMovement('inspect');
        setDecoyLoreModal({
          title: 'Bàn Thờ Tổ Sư Nghề Sơn Mài',
          speakerRole: 'Đình Hà Vĩ',
          content: (
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>Bàn hương án sơn son rực rỡ, tượng Tổ sư ngự trên ngai vàng uy nghiêm. Người coi đình cho biết:</p>
              <p className="italic text-amber-200/90">"Nơi đây con cháu làng Thường Tín phụng thờ ông tổ nghề sơn mài dát vàng, chẳng hề có bóng dáng mộc bản hay bút lông in ấn của dòng tranh Ngũ Hổ đâu bạn trẻ ơi."</p>
              <p className="text-emerald-300 text-xs pt-1">⚠️ <strong>Địa điểm đánh lạc hướng:</strong> Hãy mở Bản Đồ [M] để tìm đúng 5 địa điểm nghề cổ truyền!</p>
            </div>
          ),
        });
      }
      return;
    }

    // 11. CÁC ĐỊA ĐIỂM KHÁC TRÊN BẢN ĐỒ
    walkToAndExecute(50, () => {
      openWorkbenchWithMode('CURRENT_TASK', 'work');
    });
  }, [
    currentScene,
    openWorkbenchWithMode,
    stopAllMovement,
    teleportToOpeningHub,
    walkToAndExecute,
  ]);

  // Xử lý bàn phím
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented) return;
      const isInteractive = typeof (e.target as HTMLElement)?.closest === 'function' &&
        Boolean((e.target as HTMLElement)?.closest('button, input, textarea, select, [contenteditable="true"]'));
      if (e.key !== 'Escape' && isInteractive) return;
      if (isModalOpen) {
        if (e.key === 'Escape') {
          setShowMap(false);
          setShowWorkbench(false);
          setShowFanRack(false);
          setShowPulpInfo(false);
          setShowLoc1ArtisanLore(false);
          setShowLoc1ArrivalSequence(false);
          setShowArmorLore(false);
          setShowCostumeRackLore(false);
          setShowStreetPasserbyLore(false);
          setShowLoc3PaintingsLore(false);
          setShowLoc3CarverLore(false);
          setShowLoc4TeaTableLore(false);
          setShowLoc4TapestryLore(false);
          setShowLoc4ShelvesLore(false);
          setShowLoc5LotusLore(false);
          setShowLoc5CoupletsLore(false);
          setShowLoc5TigerMuralLore(false);
          setShowLoc5BellLore(false);
          setJournalOpen(false);
          stopAllMovement('idle');
        } else if ((e.key === 'm' || e.key === 'M') && showMap) {
          setShowMap(false);
          stopAllMovement('idle');
        }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        clickTargetXRef.current = null;
        onArriveCallbackRef.current = null;
        leftInputsRef.current.add(e.code || e.key.toLowerCase());
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        clickTargetXRef.current = null;
        onArriveCallbackRef.current = null;
        rightInputsRef.current.add(e.code || e.key.toLowerCase());
      } else if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        e.preventDefault();
        triggerInteract();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        sounds.playClick();
        stopAllMovement('note');
        setShowMap(true);
      } else if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        sounds.playClick();
        stopAllMovement('note');
        setJournalOpen(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const isLeftKey = e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A';
      const isRightKey = e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D';
      if (!isLeftKey && !isRightKey) return;

      if (isLeftKey) {
        leftInputsRef.current.delete(e.code || e.key.toLowerCase());
        leftInputsRef.current.delete(e.key.toLowerCase());
      }
      if (isRightKey) {
        rightInputsRef.current.delete(e.code || e.key.toLowerCase());
        rightInputsRef.current.delete(e.key.toLowerCase());
      }

      if (
        leftInputsRef.current.size === 0 &&
        rightInputsRef.current.size === 0 &&
        clickTargetXRef.current === null
      ) {
        setIsMoving(false);
        setAction('idle');
      }
    };

    const handleBlurOrVisibility = () => {
      if (document.hidden || !document.hasFocus()) {
        stopAllMovement('idle');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlurOrVisibility);
    document.addEventListener('visibilitychange', handleBlurOrVisibility);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlurOrVisibility);
      document.removeEventListener('visibilitychange', handleBlurOrVisibility);
    };
  }, [isModalOpen, setJournalOpen, showMap, stopAllMovement, triggerInteract]);

  // VÒNG LẶP VẬT LÝ DI CHUYỂN 60FPS CHUẨN DELTA TIME
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(40, Math.max(0, now - lastTime));
      lastTime = now;

      if (!isModalOpen) {
        const leftPressed = leftInputsRef.current.size > 0;
        const rightPressed = rightInputsRef.current.size > 0;
        let moveDelta = 0;

        if (leftPressed && rightPressed) {
          setIsMoving(false);
          setAction('idle');
        } else if (leftPressed && !rightPressed) {
          moveDelta = -MOVE_SPEED_PER_MS * dt;
          setFacing('left');
          setAction('walk');
        } else if (rightPressed && !leftPressed) {
          moveDelta = MOVE_SPEED_PER_MS * dt;
          setFacing('right');
          setAction('walk');
        } else if (!leftPressed && !rightPressed && clickTargetXRef.current !== null) {
          const target = clickTargetXRef.current;
          const current = playerXRef.current;
          const diff = target - current;
          const step = MOVE_SPEED_PER_MS * dt;

          if (Math.abs(diff) <= step) {
            playerXRef.current = target;
            setPlayerX(target);
            clickTargetXRef.current = null;
            setIsMoving(false);
            setAction('idle');
            if (onArriveCallbackRef.current) {
              const cb = onArriveCallbackRef.current;
              onArriveCallbackRef.current = null;
              cb();
            }
          } else {
            moveDelta = diff > 0 ? step : -step;
            setFacing(diff > 0 ? 'right' : 'left');
            setAction('walk');
          }
        }

        if (moveDelta !== 0) {
          const prevX = playerXRef.current;
          const { minX, maxX } = getSceneBounds(currentScene);
          const nextX = Math.max(minX, Math.min(maxX, prevX + moveDelta));
          const actualMoved = Math.abs(nextX - prevX);

          playerXRef.current = nextX;
          setPlayerX(nextX);

          if (actualMoved > 0.001) {
            setIsMoving(true);
            stepDistanceAccRef.current += actualMoved;
            if (stepDistanceAccRef.current >= 4.2) {
              stepDistanceAccRef.current = 0;
              sounds.playWoodClop();
            }
          } else {
            setIsMoving(false);
            setAction('idle');
          }
        } else if (clickTargetXRef.current === null) {
          setIsMoving(false);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isModalOpen, currentScene]);

  // Kích hoạt tự động chuỗi lời thoại bối cảnh khi lần đầu bước vào Đình Xuân Phiến Thị
  useEffect(() => {
    if (currentScene === 'location_1_xuan_phien_thi' && !hasSeenLoc1ArrivalRef.current) {
      hasSeenLoc1ArrivalRef.current = true;
      setShowLoc1ArrivalSequence(true);
      setLoc1ArrivalStep(0);
    }
  }, [currentScene]);

  const handleFloorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPixelX = e.clientX - rect.left;
    const clickPercentX = (clickPixelX / rect.width) * 100;
    smoothWalkTo(clickPercentX);
  };

  // Tính toán Camera đồng bộ tức thì theo nhân vật
  const playerPixelX = (playerX / 100) * worldWidth;
  const maxCameraOffset = Math.max(0, worldWidth - viewportWidth);
  const cameraOffset =
    worldWidth > viewportWidth
      ? Math.max(0, Math.min(maxCameraOffset, playerPixelX - viewportWidth / 2))
      : 0;

  const startHoldDirection =
    (dir: 'left' | 'right') => (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore synthetic events
      }
      clickTargetXRef.current = null;
      onArriveCallbackRef.current = null;
      const setRef = dir === 'left' ? leftInputsRef : rightInputsRef;
      setRef.current.add(`pointer_${e.pointerId}`);
      setFacing(dir);
      setIsMoving(true);
      setAction('walk');
    };

  const endHoldDirection =
    (dir: 'left' | 'right') => (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
      const setRef = dir === 'left' ? leftInputsRef : rightInputsRef;
      setRef.current.delete(`pointer_${e.pointerId}`);
      if (leftInputsRef.current.size === 0 && rightInputsRef.current.size === 0) {
        setIsMoving(false);
        setAction('idle');
      }
    };

  const currentLocData =
    LOCATIONS_DATA.find((l) => l.id === currentLocationId) || LOCATIONS_DATA[0];

  const getSceneTitle = () => {
    if (currentScene === 'opening_hub') {
      return 'Khu Mở Đầu: Gian Hiệu Ngũ Hổ';
    }
    if (currentScene === 'location_1_xuan_phien_thi') {
      return 'Đình Xuân Phiến Thị';
    }
    if (currentScene === 'location_2_ma_vi') {
      return 'Hiệu Phục Sức Mã Vĩ';
    }
    if (currentScene === 'location_3_hang_trong') {
      return 'Xưởng Tranh Hàng Trống';
    }
    if (currentScene === 'location_4_hang_gai') {
      return 'Hiệu Tơ Lụa Hàng Gai';
    }
    if (currentScene === 'location_5_dong_huong') {
      return 'Đình Đông Hương';
    }
    if (currentScene === 'decoy_hang_quat') {
      return 'Hiệu Quạt Hàng Quạt';
    }
    if (currentScene === 'decoy_hang_hom') {
      return 'Hiệu Đồ Sơn Hàng Hòm';
    }
    if (currentScene === 'decoy_quan_tra') {
      return 'Quán Trà Gốc Đa';
    }
    if (currentScene === 'decoy_nam_huong') {
      return 'Đình Nam Hương';
    }
    if (currentScene === 'decoy_ha_vi') {
      return 'Đình Hà Vĩ';
    }
    return currentLocData.name;
  };

  const getSceneNarrative = () => {
    if (currentScene === 'opening_hub') {
      return '"Trên bức tranh đặt ở giữa cửa hiệu, năm con hổ hiện lên với những tư thế khác nhau. Hãy bước tới KHU TRANH Ở GIỮA hoặc ấn phím [E] để soi bức tranh Ngũ Hổ và mở Bản Đồ Cổ."';
    }
    if (currentScene === 'location_1_xuan_phien_thi') {
      return '"Đình Xuân Phiến Thị: Bác thợ già đang cặm cụi chuốt nan tre bên bàn gỗ: Nan tre phải đều, giấy phải phẳng... Hãy tương tác với Bác Thợ Già hoặc Bàn Chế Tác để ghép 5 chiếc quạt nan và nhận Giấy Dó."';
    }
    if (currentScene === 'location_2_ma_vi') {
      return '"Hiệu Phục Sức Mã Vĩ: Phía sau bình phong vang tiếng lật sổ phục trang: Bộ này rõ ràng thuộc về vai trung thần, sao lại ghi nhầm sang phản tướng? Hãy tương tác Bàn Sổ Phục Trang bên phải để chỉnh lại 3 bộ trang phục và nhận Mực Tàu."';
    }
    if (currentScene === 'location_3_hang_trong') {
      return '"Xưởng Tranh Hàng Trống: Tiếng mũi đục chạm vào thớ gỗ đều đặn. Trên bàn kính lúp ở giữa là bản in thử mới nhất — hãy tự đối chiếu với bức tranh gốc trên tường để tìm 3 nét khắc lệch và nhận Ván Khắc Gỗ."';
    }
    if (currentScene === 'location_4_hang_gai') {
      return '"Hiệu Tơ Lụa Hàng Gai: Cửa hiệu im lìm, những cuộn lụa ngũ sắc xếp chồng dưới ánh nắng nghiêng qua ô cửa. Trên chiếc bàn gỗ giữa phòng là cuốn sổ ghi công thức pha màu bị nhòe và 3 hộp phẩm màu cơ bản — hãy pha màu chuẩn để nhuộm lụa, mở ngăn kéo bí mật nhận Phẩm Màu!"';
    }
    if (currentScene === 'location_5_dong_huong') {
      return '"Đình Đông Hương: Không gian thờ tự thâm nghiêm, tĩnh lặng. Trên bàn thờ cổ là bức họa Hoàng Hổ oai phong, bên cạnh chiếc tráp gỗ khóa kín cùng 5 bệ thờ Ngũ Hành đang đợi được khai mở bằng các đạo cụ cổ để nhận Bút Lông!"';
    }
    if (currentScene === 'decoy_hang_quat') {
      return '"Hiệu Quạt Hàng Quạt: Cửa hiệu buôn bán tấp nập quạt lụa và quạt giấy bồi che nắng ngày hè. Hãy đi lại khám phá hoặc trò chuyện với chủ hiệu để nghe ngóng tin tức phố nghề."';
    }
    if (currentScene === 'decoy_hang_hom') {
      return '"Hiệu Đồ Sơn Hàng Hòm: Tiếng cưa xẻ gỗ rầm rập, mùi sơn ta cánh gián ngai ngái bốc lên từ những chiếc rương sơn son thếp vàng. Đây là xưởng đóng rương hòm dân dụng."';
    }
    if (currentScene === 'decoy_quan_tra') {
      return '"Quán Trà Gốc Đa: Dưới bóng bồ đề cổ thụ, quán nước chè mạn ấm cúng với ấm tích ủ giỏ nan, kẹo lạc vàng ươm và làn khói điếu cày bảng lảng giữa phố phường."';
    }
    if (currentScene === 'decoy_nam_huong') {
      return '"Đình Nam Hương: Ngôi đình uy nghiêm phụng thờ vua Lê Thái Tổ cùng các danh tướng, rặng liễu rủ bóng trông thẳng ra Tháp Rùa và mặt nước Hồ Gươm mênh mông."';
    }
    if (currentScene === 'decoy_ha_vi') {
      return '"Đình Hà Vĩ: Đình thờ cụ Tổ nghề sơn mài Thường Tín, rực rỡ sắc son thếp vàng, đôi rồng đá chầu bậc thềm và cụ rùa đá trầm mặc đội văn bia cổ ghi công đức."';
    }
    return `"${currentLocData.description}"`;
  };

  return (
    <div className="relative w-full h-full bg-[#0e0c0a] overflow-hidden flex flex-col justify-between select-none">
      {/* 1. Header Pixel HUD gọn gàng */}
      <header className="z-40 w-full bg-[#1b1511]/95 border-b border-[#b8894a] px-2.5 py-1 flex items-center justify-between gap-2 shadow-lg shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-[#b91c1c] border border-amber-300 flex items-center justify-center text-amber-200 font-bold font-serif text-[11px] shrink-0">
            HT
          </div>
          <div className="truncate">
            <span className="text-xs font-bold font-serif text-amber-200 mr-2">
              Tranh Hàng Trống
            </span>
            <span className="text-[11px] text-amber-300/90 font-serif">
              • {getSceneTitle()}
            </span>
          </div>
        </div>

        {/* Bộ nút điều hướng nhanh trên 1 dòng */}
        <div className="flex items-center gap-1 shrink-0">
          {currentScene !== 'opening_hub' && (
            <button
              type="button"
              onClick={() => teleportToOpeningHub(50)}
              className="px-2.5 py-1 bg-emerald-900 hover:bg-emerald-800 border border-emerald-400 rounded text-[11px] font-serif font-bold text-emerald-100 transition flex items-center gap-1 whitespace-nowrap shadow"
              title="Quay về Khu Mở Đầu"
            >
              <Home className="w-3.5 h-3.5 text-emerald-300" />
              <span>Về Khu Mở Đầu</span>
            </button>
          )}

          {currentScene === 'opening_hub' && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowOpeningPrologueSequence(true);
                setOpeningPrologueStep(0);
              }}
              className="px-2 py-1 bg-amber-900/80 hover:bg-amber-800 border border-amber-400/80 rounded text-[11px] font-serif text-amber-200 transition flex items-center gap-1 whitespace-nowrap shadow"
              title="Nghe lại lời dẫn mở đầu cốt truyện"
            >
              <Scroll className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Lời Dẫn Mở Đầu</span>
            </button>
          )}

          {currentScene === 'location_1_xuan_phien_thi' && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowLoc1ArrivalSequence(true);
                setLoc1ArrivalStep(0);
              }}
              className="px-2 py-1 bg-amber-900/80 hover:bg-amber-800 border border-amber-400/80 rounded text-[11px] font-serif text-amber-200 transition flex items-center gap-1 whitespace-nowrap shadow"
              title="Nghe lại lời dẫn & Bác thợ chuốt nan"
            >
              <User className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Lời Dẫn Đình Cổ</span>
            </button>
          )}

          {currentScene === 'location_2_ma_vi' && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowLoc2ArrivalSequence(true);
                setLoc2ArrivalTurnIndex(0);
              }}
              className="px-2 py-1 bg-amber-900/80 hover:bg-amber-800 border border-amber-400/80 rounded text-[11px] font-serif text-amber-200 transition flex items-center gap-1 whitespace-nowrap shadow"
              title="Nghe lại lời dẫn & Bác Quản Hiệu Mã Vĩ"
            >
              <User className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Lời Dẫn Hiệu Mã Vĩ</span>
            </button>
          )}

          {currentScene === 'location_3_hang_trong' && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowLoc3ArrivalSequence(true);
                setLoc3ArrivalTurnIndex(0);
              }}
              className="px-2 py-1 bg-amber-900/80 hover:bg-amber-800 border border-amber-400/80 rounded text-[11px] font-serif text-amber-200 transition flex items-center gap-1 whitespace-nowrap shadow"
              title="Nghe lại lời dẫn & Bác Thợ Khắc Ván"
            >
              <User className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Lời Dẫn Xưởng Mộc Bản</span>
            </button>
          )}

          {currentScene === 'location_4_hang_gai' && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowLoc4ArrivalSequence(true);
                setLoc4ArrivalTurnIndex(0);
              }}
              className="px-2 py-1 bg-amber-900/80 hover:bg-amber-800 border border-amber-400/80 rounded text-[11px] font-serif text-amber-200 transition flex items-center gap-1 whitespace-nowrap shadow"
              title="Nghe lại lời dẫn & Bà Chủ Hiệu Lụa"
            >
              <User className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Lời Dẫn Hiệu Lụa</span>
            </button>
          )}

          {currentScene === 'location_5_dong_huong' && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowLoc5ArrivalSequence(true);
                setLoc5ArrivalTurnIndex(0);
              }}
              className="px-2 py-1 bg-amber-900/80 hover:bg-amber-800 border border-amber-400/80 rounded text-[11px] font-serif text-amber-200 transition flex items-center gap-1 whitespace-nowrap shadow"
              title="Nghe lại lời dẫn & Cụ Từ Đình Cổ"
            >
              <User className="w-3 h-3 text-amber-300" />
              <span className="hidden sm:inline">Lời Dẫn Đình Đông Hương</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              stopAllMovement('note');
              setShowMap(true);
            }}
            className="px-2.5 py-1 bg-[#b91c1c] hover:bg-[#991b1b] border border-amber-400 rounded text-[11px] font-serif font-bold text-amber-100 shadow transition flex items-center gap-1 whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>Bản Đồ [M]</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSceneBanner(!showSceneBanner)}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 transition"
            title="Ẩn/Hiện lời dẫn cốt truyện"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              stopAllMovement('note');
              setJournalOpen(true);
            }}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 transition"
            title="Sổ tay ghi chép [J]"
          >
            <BookOpen className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={toggleSound}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 transition"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              stopAllMovement('idle');
              setSafezoneNotice(null);
              resetGame();
              teleportToOpeningHub(50);
            }}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-600 transition"
            title="Chơi lại từ đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. KHÔNG GIAN THẾ GIỚI 2D VỚI CAMERA ĐỒNG BỘ 60FPS */}
      <div
        ref={viewportRef}
        className="relative flex-1 min-h-0 w-full overflow-hidden bg-[#120e0a] flex items-center justify-start"
      >
        <div
          onClick={handleFloorClick}
          className="relative h-full cursor-pointer shrink-0"
          style={{
            width: `${worldWidth}px`,
            height: `${worldHeight}px`,
            transform: `translate3d(-${cameraOffset}px, 0, 0)`,
            willChange: 'transform',
          }}
        >
          {/* ==================== PHÔNG NỀN CHO TỪNG KHU VỰC (SỬ DỤNG ĐÚNG 4 ẢNH 6, 7, 8, 9) ==================== */}
          {currentScene === 'opening_hub' && (
            <img
              src="./assets/opening_hub.webp"
              alt="Ảnh 1: Khu Mở Đầu - Con Phố Cổ & Gian Hiệu Tranh Ngũ Hổ"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'location_1_xuan_phien_thi' && (
            <img
              src="./assets/location_1_xuan_phien_thi.png"
              alt="Địa điểm 1: Đình Xuân Phiến Thị"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'location_2_ma_vi' && (
            <img
              src="./assets/location_2_ma_vi.webp"
              alt="Ảnh 3: Địa điểm 2 - Hiệu Phục Sức Mã Vĩ"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'location_3_hang_trong' && (
            <img
              src="./assets/location_3_hang_trong.webp"
              alt="Ảnh 4: Địa điểm 3 - Xưởng Tranh Hàng Trống"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'location_4_hang_gai' && (
            <img
              src="./assets/location_4_hang_gai.webp"
              alt="Ảnh 10: Địa điểm 4 - Hiệu Tơ Lụa Hàng Gai"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'location_5_dong_huong' && (
            <img
              src="./assets/location_5_dong_huong.webp"
              alt="Ảnh 11: Địa điểm 5 - Đình Đông Hương"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {/* 5 BỐI CẢNH ĐỊA ĐIỂM GIẢ (DECOY LOCATIONS - 20.webp ĐẾN 24.webp) */}
          {currentScene === 'decoy_hang_quat' && (
            <img
              src="./assets/decoy_hang_quat.webp"
              alt="Địa điểm giả 1: Hiệu quạt Hàng Quạt (Ảnh 20)"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'decoy_hang_hom' && (
            <img
              src="./assets/decoy_hang_hom.webp"
              alt="Địa điểm giả 2: Hiệu đồ sơn Hàng Hòm (Ảnh 21)"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'decoy_quan_tra' && (
            <img
              src="./assets/decoy_quan_tra.webp"
              alt="Địa điểm giả 3: Quán trà gốc đa (Ảnh 22)"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'decoy_nam_huong' && (
            <img
              src="./assets/decoy_nam_huong.webp"
              alt="Địa điểm giả 4: Đình Nam Hương (Ảnh 23)"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'decoy_ha_vi' && (
            <img
              src="./assets/decoy_ha_vi.webp"
              alt="Địa điểm giả 5: Đình Hà Vĩ (Ảnh 24)"
              className="w-full h-full object-fill pixelated pointer-events-none select-none block"
              draggable={false}
            />
          )}

          {currentScene === 'other_location' && (
            <img
              src="./assets/opening_hub.webp"
              alt={currentLocData.name}
              className="w-full h-full object-fill pixelated pointer-events-none select-none block brightness-75"
              draggable={false}
            />
          )}

          {/* Lớp phủ ánh sáng chiều sâu */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-amber-950/10 pointer-events-none" />

          {/* ==================== 0. ĐIỂM TƯƠNG TÁC KHU MỞ ĐẦU / SAFEZONE (Ảnh 1: opening_hub.webp) ==================== */}
          {currentScene === 'opening_hub' && (
            <>
              {/* NGƯỜI ĐI ĐƯỜNG BÊN TRÁI (16%): CHIẾC BÓNG VÔ HÌNH */}
              <button
                type="button"
                aria-label="Thử gọi người đi đường trên phố"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(16, () => {
                    stopAllMovement('look_up');
                    setShowStreetPasserbyLore(true);
                  });
                }}
                style={{ left: '16%', top: '42%', width: '14%', height: '46%' }}
                className="absolute -translate-x-1/2 z-20 cursor-pointer flex flex-col items-center justify-start pt-1 group bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] font-bold shadow-xl flex items-center gap-1 whitespace-nowrap transition-transform ${
                    isNearHubPasserby
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 scale-105'
                      : 'bg-black/85 border border-amber-400/80 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Hand className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearHubPasserby ? '[E] Gọi Người Đi Đường' : 'Người Đi Đường'}
                  </span>
                </span>
              </button>

              {/* TRÊN MÁI GIAN HIỆU TRUNG TÂM (50%): BỨC TRANH NGŨ HỔ BẢN CHÍNH */}
              <button
                type="button"
                aria-label="Quan sát bức tranh Ngũ Hổ bản chính treo ở gian hiệu giữa phố"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('INSPECT_TIGER', 'inspect');
                  });
                }}
                style={{ left: '50%', top: '12%', width: '24%', height: '24%' }}
                className="absolute -translate-x-1/2 z-20 cursor-pointer flex flex-col items-center justify-start pt-1 group bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2.5 py-1 rounded font-serif text-[11px] font-bold shadow-xl flex items-center gap-1 whitespace-nowrap transition-transform ${
                    isNearHubCenterKiosk
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 scale-105'
                      : 'bg-black/85 border border-amber-400/80 text-amber-200 opacity-95 group-hover:scale-105'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Soi Tranh Ngũ Hổ
                  </span>
                </span>
              </button>

              {/* KHU TRANH & BÀN BẢN ĐỒ Ở GIỮA (50%): MỞ BẢN ĐỒ DỊCH CHUYỂN */}
              <button
                type="button"
                aria-label="Khu tranh ở giữa - Mở Bản Đồ Dịch Chuyển"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    stopAllMovement('note');
                    setShowMap(true);
                  });
                }}
                style={{ left: '50%', top: '36%', width: '24%', height: '48%' }}
                className="absolute -translate-x-1/2 z-20 cursor-pointer flex flex-col items-center justify-start pt-1 group bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-3 py-1 rounded font-serif text-xs font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap transition-transform ${
                    isNearHubCenterKiosk
                      ? 'bg-[#b91c1c] border-2 border-amber-300 text-white scale-105'
                      : 'bg-[#b91c1c]/95 border border-amber-300 text-amber-100 group-hover:scale-105'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isNearHubCenterKiosk
                      ? '[E] Khu Tranh Ở Giữa: Mở Bản Đồ Cổ'
                      : 'Khu Tranh Ở Giữa: Mở Bản Đồ Cổ'}
                  </span>
                </span>
              </button>

              {/* GIAN HIỆU BÊN PHẢI (70%): BÀN IN TRANH HÀNG TRỐNG & GIẢI MÃ THƠ */}
              <button
                type="button"
                aria-label="Bàn in tranh và giải mã thơ bên phải"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(70, () => {
                    openWorkbenchWithMode('PRINT_WORKSHOP', 'work');
                  });
                }}
                style={{ left: '70%', top: '38%', width: '16%', height: '48%' }}
                className="absolute -translate-x-1/2 z-20 cursor-pointer flex flex-col items-center justify-start pt-2 group bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2.5 py-1 rounded font-serif text-[11px] font-bold shadow-xl flex items-center gap-1 whitespace-nowrap transition-transform ${
                    inventory.length >= 5
                      ? 'bg-amber-400 border-2 border-[#b91c1c] text-stone-950 scale-105'
                      : isNearHubRightShop
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 scale-105'
                      : 'bg-black/85 border border-amber-400/80 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {isNearHubRightShop
                      ? '[E] Bàn In Tranh & Giải Thơ'
                      : 'Bàn In Tranh & Giải Thơ'}
                  </span>
                </span>
              </button>
            </>
          )}

          {/* ==================== 1. ĐIỂM TƯƠNG TÁC ĐỊA ĐIỂM 1: ĐÌNH XUÂN PHIẾN THỊ (Ảnh 2: location_1_xuan_phien_thi.webp) ==================== */}
          {currentScene === 'location_1_xuan_phien_thi' && (
            <>
              {/* BÊN TRÁI (16%): BÓ TRE TRÚC & KHUNG DỆT GIẤY DÓ */}
              <button
                type="button"
                aria-label="Xem bó tre trúc và khung làm giấy dó bên trái"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(16, () => {
                    stopAllMovement('look_up');
                    setShowPulpInfo(true);
                  });
                }}
                style={{ left: '16%', top: '36%', width: '16%', height: '48%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearPulpVat
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <Hand className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearPulpVat ? '[E] Tre Trúc & Khung Giấy Dó' : 'Tre Trúc & Khung Giấy Dó'}
                  </span>
                </span>
              </button>

              {/* BÀN GỖ CHẾ TÁC TRUNG TÂM ĐỊA ĐIỂM 1 (50%): SẮP XẾP & LẬT 5 CHIẾC QUẠT + MẢNH GIẤY DƯỚI BÀN */}
              <button
                type="button"
                aria-label="Bàn gỗ trung tâm Đình Xuân Phiến Thị - Ghép 5 chiếc quạt và nhặt mảnh giấy gợi ý"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                style={{ left: '50%', top: '42%', width: '26%', height: '44%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start pt-1 bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-3 py-1 rounded font-serif text-xs font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap transition-transform ${
                    isNearLoc1CenterTable
                      ? 'bg-[#b91c1c] border-2 border-amber-300 text-white scale-105'
                      : 'bg-[#b91c1c]/95 border border-amber-300 text-amber-100 group-hover:scale-105'
                  }`}
                >
                  <Hammer className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isNearLoc1CenterTable
                      ? '[E] Bàn Chế Tác Giữa Đình: Ghép 5 Chiếc Quạt (Nhận Giấy Dó)'
                      : 'Bàn Chế Tác Giữa Đình: Ghép 5 Chiếc Quạt'}
                  </span>
                </span>
              </button>

              {/* GIÁ TRƯNG BÀY QUẠT CỔ BÊN PHẢI (86%) */}
              <button
                type="button"
                aria-label="Khám phá giá quạt cổ bên phải"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(86, () => {
                    stopAllMovement('inspect');
                    setShowFanRack(true);
                  });
                }}
                style={{ left: '86%', top: '34%', width: '16%', height: '52%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearFanRack
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-400/80 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearFanRack ? '[E] Giá Quạt Cổ' : 'Giá Quạt Cổ'}
                  </span>
                </span>
              </button>
            </>
          )}

          {/* ==================== 2. ĐIỂM TƯƠNG TÁC ĐỊA ĐIỂM 2: HIỆU PHỤC SỨC MÃ VĨ (Ảnh 3: location_2_ma_vi.webp) ==================== */}
          {currentScene === 'location_2_ma_vi' && (
            <>
              {/* CỬA VÒM GẠCH BÊN TRÁI (12%): QUAY VỀ KHU MỞ ĐẦU */}
              <button
                type="button"
                aria-label="Cửa vòm gạch bên trái - Quay về Khu Mở Đầu"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(12, () => {
                    teleportToOpeningHub(50);
                  });
                }}
                style={{ left: '12%', top: '34%', width: '12%', height: '52%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLeftArchway
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <DoorOpen className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLeftArchway ? '[E] Về Phố Cổ' : 'Cửa Vòm'}
                  </span>
                </span>
              </button>

              {/* GIÁ TREO Y PHỤC & CỜ LỆNH (31%) */}
              <button
                type="button"
                aria-label="Quan sát giá treo y phục và cờ lệnh sân khấu"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(31, () => {
                    stopAllMovement('inspect');
                    setShowCostumeRackLore(true);
                  });
                }}
                style={{ left: '31%', top: '34%', width: '14%', height: '50%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearCostumeRack
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <Shirt className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearCostumeRack ? '[E] Giá Treo Y Phục' : 'Giá Treo Y Phục & Cờ'}
                  </span>
                </span>
              </button>

              {/* BA BỘ GIÁP PHỤC TRƯỚC GƯƠNG TRUNG TÂM (50%) */}
              <button
                type="button"
                aria-label="Quan sát ba bộ trang phục chưa hoàn thiện đặt trước gương"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    stopAllMovement('inspect');
                    setShowArmorLore(true);
                  });
                }}
                style={{ left: '50%', top: '28%', width: '20%', height: '56%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearArmorDisplay
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearArmorDisplay
                      ? '[E] Ba Bộ Trang Phục Trước Gương'
                      : 'Ba Bộ Trang Phục Trước Gương'}
                  </span>
                </span>
              </button>

              {/* ĐIỂM TƯƠNG TÁC CHÍNH ĐỊA ĐIỂM 2: BÌNH PHONG & BÀN SỔ PHỤC SỨC BÊN PHẢI (76%) */}
              <button
                type="button"
                aria-label="Bàn sổ phục trang và bình phong bên phải Hiệu Phục Sức Mã Vĩ"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(76, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                style={{ left: '76%', top: '42%', width: '22%', height: '44%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-3 py-1 rounded font-serif text-xs font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap transition-transform ${
                    isNearRightBookTable
                      ? 'bg-[#b91c1c] border-2 border-amber-300 text-white scale-105'
                      : 'bg-[#b91c1c]/95 border border-amber-300 text-amber-100 group-hover:scale-105'
                  }`}
                >
                  <ScrollText className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isNearRightBookTable
                      ? '[E] Bàn Sổ Phục Trang & Bình Phong (Nhận Mực Tàu)'
                      : 'Bàn Sổ Phục Trang & Bình Phong'}
                  </span>
                </span>
              </button>
            </>
          )}

          {/* ==================== 3. ĐIỂM TƯƠNG TÁC ĐỊA ĐIỂM 3: XƯỞNG TRANH HÀNG TRỐNG (Ảnh 4: location_3_hang_trong.webp) ==================== */}
          {currentScene === 'location_3_hang_trong' && (
            <>
              {/* BÊN TRÁI (18%): TRANH DÂN GIAN TREO TƯỜNG & KỆ VÁN KHẮC */}
              <button
                type="button"
                aria-label="Quan sát các bức tranh dân gian treo tường và kệ ván khắc bên trái"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(18, () => {
                    stopAllMovement('look_up');
                    setShowLoc3PaintingsLore(true);
                  });
                }}
                style={{ left: '18%', top: '26%', width: '20%', height: '58%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc3LeftPaintings
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLoc3LeftPaintings
                      ? '[E] Tranh Treo Tường & Kệ Ván'
                      : 'Tranh Treo Tường & Kệ Ván'}
                  </span>
                </span>
              </button>

              {/* TRUNG TÂM (50%): BÀN KÍNH LÚP & BẢN IN THỬ (NHIỆM VỤ CHÍNH ĐỊA ĐIỂM 3) */}
              <button
                type="button"
                aria-label="Bàn kính lúp soi bản in thử ở giữa Xưởng tranh Hàng Trống"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                style={{ left: '50%', top: '48%', width: '28%', height: '38%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start pt-1 bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-3 py-1 rounded font-serif text-xs font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap transition-transform ${
                    isNearLoc3CenterLensTable
                      ? 'bg-[#b91c1c] border-2 border-amber-300 text-white scale-105'
                      : 'bg-[#b91c1c]/95 border border-amber-300 text-amber-100 group-hover:scale-105'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isNearLoc3CenterLensTable
                      ? '[E] Bàn Kính Lúp: Soi Bản In Thử (Nhận Ván Khắc Gỗ)'
                      : 'Bàn Kính Lúp: Soi Bản In Thử'}
                  </span>
                </span>
              </button>
            </>
          )}

          {/* ==================== 4. ĐIỂM TƯƠNG TÁC ĐỊA ĐIỂM 4: HIỆU TƠ LỤA HÀNG GAI (Ảnh 10: location_4_hang_gai.webp) ==================== */}
          {currentScene === 'location_4_hang_gai' && (
            <>
              {/* CỬA VÒM BÊN TRÁI (10%): QUAY VỀ KHU MỞ ĐẦU */}
              <button
                type="button"
                aria-label="Cửa ra vào bên trái - Quay về Khu Mở Đầu"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(10, () => {
                    teleportToOpeningHub(50);
                  });
                }}
                style={{ left: '10%', top: '38%', width: '12%', height: '50%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc4Exit
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <DoorOpen className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLoc4Exit ? '[E] Về Phố Cổ' : 'Cửa Ra'}
                  </span>
                </span>
              </button>

              {/* BÀN TRÀ HOA MẬN & CỬA SỔ ĐÓN NẮNG (14%) */}
              <button
                type="button"
                aria-label="Quan sát khung cửa sổ đón nắng và bình hoa mận trắng trên khăn lụa sóng nước"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(14, () => {
                    stopAllMovement('inspect');
                    setShowLoc4TeaTableLore(true);
                  });
                }}
                style={{ left: '14%', top: '55%', width: '14%', height: '40%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc4TeaTable
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLoc4TeaTable
                      ? '[E] Cửa Sổ & Bình Hoa Mận'
                      : 'Cửa Sổ & Bình Hoa Mận'}
                  </span>
                </span>
              </button>

              {/* BỨC TRANH HẮC HỔ & DẢI LỤA NGŨ SẮC (51%) */}
              <button
                type="button"
                aria-label="Chiêm ngưỡng bức tranh Hắc Hổ vượt sóng nước và các dải lụa ngũ sắc"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(51, () => {
                    stopAllMovement('look_up');
                    setShowLoc4TapestryLore(true);
                  });
                }}
                style={{ left: '51%', top: '22%', width: '18%', height: '36%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc4Tapestry
                      ? 'bg-[#1a1410] border-2 border-blue-400 text-blue-200 font-bold'
                      : 'bg-black/80 border border-blue-400/80 text-blue-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Eye className="w-3 h-3 text-blue-300" />
                  <span>
                    {isNearLoc4Tapestry
                      ? '[E] Tranh Hắc Hổ & Lụa Ngũ Sắc'
                      : 'Tranh Hắc Hổ & Lụa Ngũ Sắc'}
                  </span>
                </span>
              </button>

              {/* BÀN GỖ TRUNG TÂM: PHA PHẨM MÀU & NHUỘM LỤA (50%) - NHIỆM VỤ CHÍNH ĐỊA ĐIỂM 4 */}
              <button
                type="button"
                aria-label="Bàn gỗ trung tâm: Khay 3 màu cơ bản, cối giã và sổ công thức nhuộm lụa"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                style={{ left: '50%', top: '58%', width: '32%', height: '38%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start pt-1 bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-3 py-1 rounded font-serif text-xs font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap transition-transform ${
                    isNearLoc4CenterTable
                      ? 'bg-[#b91c1c] border-2 border-amber-300 text-white scale-105'
                      : 'bg-[#b91c1c]/95 border border-amber-300 text-amber-100 group-hover:scale-105'
                  }`}
                >
                  <Hammer className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isNearLoc4CenterTable
                      ? '[E] Bàn Pha Màu: Nhuộm 3 Dải Lụa (Nhận Phẩm Màu)'
                      : 'Bàn Pha Màu: Nhuộm 3 Dải Lụa'}
                  </span>
                </span>
              </button>

              {/* KỆ TRƯNG BÀY CUỘN LỤA & TỦ BÍ MẬT BÊN PHẢI (85%) */}
              <button
                type="button"
                aria-label="Khám phá kệ cuộn lụa gấm, bình gốm và tủ gỗ bí mật bên phải"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(85, () => {
                    stopAllMovement('inspect');
                    setShowLoc4ShelvesLore(true);
                  });
                }}
                style={{ left: '85%', top: '48%', width: '18%', height: '50%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc4Shelves
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <ScrollText className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLoc4Shelves
                      ? '[E] Kệ Cuộn Lụa & Tủ Bí Mật'
                      : 'Kệ Cuộn Lụa & Tủ Bí Mật'}
                  </span>
                </span>
              </button>
            </>
          )}

          {/* ==================== 5. ĐIỂM TƯƠNG TÁC ĐỊA ĐIỂM 5: ĐÌNH ĐÔNG HƯƠNG (Ảnh 11: location_5_dong_huong.webp) ==================== */}
          {currentScene === 'location_5_dong_huong' && (
            <>
              {/* CỬA RA VÀO BÊN TRÁI (8%): QUAY VỀ KHU MỞ ĐẦU */}
              <button
                type="button"
                aria-label="Cửa ra vào bên trái - Quay về Khu Mở Đầu"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(8, () => {
                    teleportToOpeningHub(50);
                  });
                }}
                style={{ left: '8%', top: '45%', width: '12%', height: '50%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc5Exit
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <DoorOpen className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLoc5Exit ? '[E] Về Phố Cổ' : 'Cửa Ra'}
                  </span>
                </span>
              </button>

              {/* BỆ TƯỢNG HOA SEN ĐÁ & RÙA ĐỘI BIA BÊN TRÁI (11%) */}
              <button
                type="button"
                aria-label="Quan sát tượng hoa sen đá và rùa đá chầu bên hiên đình"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(11, () => {
                    stopAllMovement('inspect');
                    setShowLoc5LotusLore(true);
                  });
                }}
                style={{ left: '11%', top: '65%', width: '14%', height: '35%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc5Lotus
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLoc5Lotus
                      ? '[E] Sen Đá & Rùa Đình Cổ'
                      : 'Sen Đá & Rùa Đình Cổ'}
                  </span>
                </span>
              </button>

              {/* CỘT RỒNG CUỘN & CÂU ĐỐI "HỘ QUỐC AN DÂN" (28%) */}
              <button
                type="button"
                aria-label="Chiêm ngưỡng câu đối thếp vàng và rồng cuộn trên cột gỗ lim"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(28, () => {
                    stopAllMovement('look_up');
                    setShowLoc5CoupletsLore(true);
                  });
                }}
                style={{ left: '28%', top: '36%', width: '12%', height: '55%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc5Couplets
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <ScrollText className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLoc5Couplets
                      ? '[E] Câu Đối & Cột Rồng'
                      : 'Câu Đối & Cột Rồng'}
                  </span>
                </span>
              </button>

              {/* BỨC HỌA HOÀNG HỔ & HOÀNH PHI "ĐÌNH ĐÔNG HƯƠNG" (50%, top: 20%) */}
              <button
                type="button"
                aria-label="Soi bức tranh Hoàng Hổ trấn giữ trung tâm và hoành phi thếp vàng"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    stopAllMovement('look_up');
                    setShowLoc5TigerMuralLore(true);
                  });
                }}
                style={{ left: '50%', top: '20%', width: '26%', height: '25%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2.5 py-1 rounded font-serif text-[11px] font-bold shadow-xl flex items-center gap-1 whitespace-nowrap transition-transform ${
                    isNearLoc5TigerMural
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 scale-105'
                      : 'bg-black/85 border border-amber-400/80 text-amber-200 opacity-95 group-hover:scale-105'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {isNearLoc5TigerMural
                      ? '[E] Bức Họa Hoàng Hổ'
                      : 'Bức Họa Hoàng Hổ & Hoành Phi'}
                  </span>
                </span>
              </button>

              {/* ĐIỂM TƯƠNG TÁC CHÍNH ĐỊA ĐIỂM 5: BÀN THỜ TRUNG TÂM & TRÁP GỖ KHÓA KÍN (50%, top: 64%) */}
              <button
                type="button"
                aria-label="Bàn thờ chính Đình Đông Hương và tráp gỗ cổ khóa kín chứa Bút Lông"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                style={{ left: '50%', top: '64%', width: '28%', height: '34%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start pt-1 bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-3 py-1 rounded font-serif text-xs font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap transition-transform ${
                    isNearLoc5Altar
                      ? 'bg-[#b91c1c] border-2 border-amber-300 text-white scale-105'
                      : 'bg-[#b91c1c]/95 border border-amber-300 text-amber-100 group-hover:scale-105'
                  }`}
                >
                  <Hammer className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {isNearLoc5Altar
                      ? '[E] Bàn Thờ & Tráp Gỗ Cổ (Khai Mở Bút Lông)'
                      : 'Bàn Thờ & Tráp Gỗ Cổ'}
                  </span>
                </span>
              </button>

              {/* ĐẠI HỒNG CHUNG & TƯỢNG NGHÊ ĐÁ BÊN PHẢI (86%) */}
              <button
                type="button"
                aria-label="Quan sát quả chuông đồng cổ và tượng Nghê đá canh cửa bên phải"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(86, () => {
                    stopAllMovement('inspect');
                    setShowLoc5BellLore(true);
                  });
                }}
                style={{ left: '86%', top: '55%', width: '18%', height: '44%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearLoc5Bell
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {isNearLoc5Bell
                      ? '[E] Đại Hồng Chung & Nghê Đá'
                      : 'Đại Hồng Chung & Nghê Đá'}
                  </span>
                </span>
              </button>
            </>
          )}

          {/* ==================== 6. ĐIỂM TƯƠNG TÁC ĐỊA ĐIỂM GIẢ (DECOY SCENES) ==================== */}
          {isDecoyScene && (
            <>
              {/* CỬA RA VÀO / LỐI VỀ PHỐ CỔ (8%) */}
              <button
                type="button"
                aria-label="Lối ra - Quay về Khu Mở Đầu"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(8, () => {
                    teleportToOpeningHub(50);
                  });
                }}
                style={{ left: '8%', top: '45%', width: '12%', height: '50%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    playerX >= 6 && playerX <= 18
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-85 group-hover:opacity-100'
                  }`}
                >
                  <DoorOpen className="w-3 h-3 text-amber-400" />
                  <span>
                    {playerX >= 6 && playerX <= 18 ? '[E] Về Phố Cổ' : 'Cửa Ra'}
                  </span>
                </span>
              </button>

              {/* ĐIỂM TƯƠNG TÁC BÊN TRÁI (18%) */}
              <button
                type="button"
                aria-label="Điểm tương tác bên trái"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(18, () => {
                    triggerInteract();
                  });
                }}
                style={{ left: '18%', top: '58%', width: '16%', height: '38%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearDecoyLeft
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {currentScene === 'decoy_hang_quat'
                      ? isNearDecoyLeft ? '[E] Giỏ Nan Quạt Tre' : 'Giỏ Nan Quạt Tre'
                      : currentScene === 'decoy_hang_hom'
                      ? isNearDecoyLeft ? '[E] Dụng Cụ Thợ Mộc' : 'Dụng Cụ Thợ Mộc'
                      : currentScene === 'decoy_quan_tra'
                      ? isNearDecoyLeft ? '[E] Gốc Đa Cổ Thụ' : 'Gốc Đa Cổ Thụ'
                      : currentScene === 'decoy_nam_huong'
                      ? isNearDecoyLeft ? '[E] Bàn Thờ Lê Thái Tổ' : 'Bàn Thờ Lê Thái Tổ'
                      : currentScene === 'decoy_ha_vi'
                      ? isNearDecoyLeft ? '[E] Bia Đá Rùa Đội' : 'Bia Đá Rùa Đội'
                      : 'Điểm Khám Phá'}
                  </span>
                </span>
              </button>

              {/* ĐIỂM TƯƠNG TÁC TRUNG TÂM (50%) */}
              <button
                type="button"
                aria-label="Điểm tương tác trung tâm"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(50, () => {
                    triggerInteract();
                  });
                }}
                style={{ left: '50%', top: '52%', width: '24%', height: '44%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2.5 py-1 rounded font-serif text-[11px] font-bold shadow-xl flex items-center gap-1.5 whitespace-nowrap transition-transform ${
                    isNearDecoyCenter
                      ? 'bg-[#b91c1c] border-2 border-amber-300 text-white scale-105'
                      : 'bg-[#2b211a]/95 border border-amber-400 text-amber-200 group-hover:scale-105'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {currentScene === 'decoy_hang_quat'
                      ? isNearDecoyCenter ? '[E] Bàn Tính & Chủ Hiệu' : 'Bàn Tính & Chủ Hiệu'
                      : currentScene === 'decoy_hang_hom'
                      ? isNearDecoyCenter ? '[E] Rương Gỗ & Bác Thợ' : 'Rương Gỗ & Bác Thợ'
                      : currentScene === 'decoy_quan_tra'
                      ? isNearDecoyCenter ? '[E] Chõng Trà & Kẹo Lạc' : 'Chõng Trà & Kẹo Lạc'
                      : currentScene === 'decoy_nam_huong'
                      ? isNearDecoyCenter ? '[E] Cửa Trông Ra Tháp Rùa' : 'Cửa Trông Ra Tháp Rùa'
                      : currentScene === 'decoy_ha_vi'
                      ? isNearDecoyCenter ? '[E] Bàn Thờ Tổ Sư Sơn Mài' : 'Bàn Thờ Tổ Sư'
                      : 'Khu Trung Tâm'}
                  </span>
                </span>
              </button>

              {/* ĐIỂM TƯƠNG TÁC BÊN PHẢI (82%) */}
              <button
                type="button"
                aria-label="Điểm tương tác bên phải"
                onClick={(e) => {
                  e.stopPropagation();
                  walkToAndExecute(82, () => {
                    triggerInteract();
                  });
                }}
                style={{ left: '82%', top: '56%', width: '18%', height: '40%' }}
                className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
              >
                <span
                  className={`px-2 py-0.5 rounded font-serif text-[11px] shadow flex items-center gap-1 whitespace-nowrap transition ${
                    isNearDecoyRight
                      ? 'bg-[#1a1410] border-2 border-amber-400 text-amber-200 font-bold'
                      : 'bg-black/80 border border-amber-500/70 text-amber-200 opacity-90 group-hover:opacity-100'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>
                    {currentScene === 'decoy_hang_quat'
                      ? isNearDecoyRight ? '[E] Kệ Quạt Lụa Phố Phường' : 'Kệ Quạt Lụa Phố Phường'
                      : currentScene === 'decoy_hang_hom'
                      ? isNearDecoyRight ? '[E] Thùng Sơn Ta Cánh Gián' : 'Thùng Sơn Ta Cánh Gián'
                      : currentScene === 'decoy_quan_tra'
                      ? isNearDecoyRight ? '[E] Khung Cảnh Phố Phường' : 'Khung Cảnh Phố Phường'
                      : currentScene === 'decoy_nam_huong'
                      ? isNearDecoyRight ? '[E] Lư Đồng Cổ Đốt Trầm' : 'Lư Đồng Cổ Đốt Trầm'
                      : currentScene === 'decoy_ha_vi'
                      ? isNearDecoyRight ? '[E] Cột Đình Thếp Vàng & Rồng Đá' : 'Cột Đình Thếp Vàng'
                      : 'Khu Quan Sát'}
                  </span>
                </span>
              </button>
            </>
          )}

          {/* ==================== 7. CÁC ĐỊA ĐIỂM KHÁC TRÊN BẢN ĐỒ ==================== */}
          {currentScene === 'other_location' && (
            <button
              type="button"
              aria-label={`Tương tác tại ${currentLocData.name}`}
              onClick={(e) => {
                e.stopPropagation();
                walkToAndExecute(50, () => {
                  openWorkbenchWithMode('CURRENT_TASK', 'work');
                });
              }}
              style={{ left: '50%', top: '35%', width: '24%', height: '50%' }}
              className="absolute -translate-x-1/2 z-20 group cursor-pointer flex flex-col items-center justify-start bg-transparent border-0 focus:outline-none"
            >
              <span
                className={`px-3 py-1 rounded font-serif text-xs font-bold shadow-2xl flex items-center gap-1.5 whitespace-nowrap transition-transform ${
                  isNearOtherMainSpot
                    ? 'bg-[#b91c1c] border-2 border-amber-300 text-white scale-105'
                    : 'bg-[#b91c1c]/95 border border-amber-300 text-amber-100 group-hover:scale-105'
                }`}
              >
                <Hammer className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {isNearOtherMainSpot
                    ? `[E] Tương Tác Tại ${currentLocData.name}`
                    : `Khám Phá ${currentLocData.name}`}
                </span>
              </span>
            </button>
          )}

          {/* Nhân vật Pixel với tỷ lệ chuẩn trên sàn đá */}
          <PixelCharacter
            x={playerX}
            facing={facing}
            isMoving={isMoving}
            action={action}
            bottomPercent={currentScene === 'opening_hub' ? 4.5 : 12.5}
            heightPercent={currentScene === 'opening_hub' ? 31 : 28.5}
          />
        </div>

        {/* Nút điều khiển gọn góc dưới màn hình */}
        <div className="absolute bottom-2 left-2 z-30 flex items-center gap-1">
          <button
            type="button"
            onPointerDown={startHoldDirection('left')}
            onPointerUp={endHoldDirection('left')}
            onPointerCancel={endHoldDirection('left')}
            className="px-2.5 py-1 bg-black/85 hover:bg-stone-900 border border-amber-500/80 rounded text-amber-200 font-serif text-[11px] flex items-center gap-1 shadow active:scale-95 touch-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Trái [A]</span>
          </button>

          <button
            type="button"
            onPointerDown={startHoldDirection('right')}
            onPointerUp={endHoldDirection('right')}
            onPointerCancel={endHoldDirection('right')}
            className="px-2.5 py-1 bg-black/85 hover:bg-stone-900 border border-amber-500/80 rounded text-amber-200 font-serif text-[11px] flex items-center gap-1 shadow active:scale-95 touch-none"
          >
            <span>Phải [D]</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="absolute bottom-2 right-2 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={triggerInteract}
            className="px-3 py-1 bg-[#b91c1c] hover:bg-[#991b1b] border border-amber-300 rounded text-white font-serif font-bold text-[11px] shadow-xl flex items-center gap-1 active:scale-95"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {currentScene === 'opening_hub'
                ? 'Tương Tác [E]'
                : currentScene === 'location_1_xuan_phien_thi'
                ? 'Ghép Quạt [E]'
                : currentScene === 'location_2_ma_vi'
                ? 'Sổ Phục Trang [E]'
                : currentScene === 'location_3_hang_trong'
                ? 'Soi Bản In [E]'
                : currentScene === 'location_4_hang_gai'
                ? 'Pha Màu Lụa [E]'
                : currentScene === 'location_5_dong_huong'
                ? 'Mở Tráp Cổ [E]'
                : 'Tương Tác [E]'}
            </span>
          </button>
        </div>

        {/* Lời kể và hội thoại neo đáy vùng chơi, không che toàn bộ bối cảnh. */}
        {!isModalOpen && !safezoneNotice && showSceneBanner && (
          <BottomDialogueBox
            isOpen
            speaker="Lời dẫn"
            content={getSceneNarrative()}
            onClose={() => setShowSceneBanner(false)}
            className="!bottom-12"
          />
        )}
        {!isModalOpen && currentScene === 'opening_hub' && safezoneNotice && (
          <BottomDialogueBox
            isOpen
            speaker={`Đã hoàn thành ${safezoneNotice.locationName}!`}
            content={<><p>Nhận được: <strong className="text-emerald-300">{safezoneNotice.relicName}</strong>.</p><p>{safezoneNotice.clueText}</p></>}
            onClose={() => setSafezoneNotice(null)}
            className="!bottom-12"
            actions={[{ label: inventory.length >= 5 ? 'In Tranh Hàng Trống Ngay ➔' : 'Mở Bản Đồ Đi Tiếp ➔', primary: true, onClick: () => {
              setSafezoneNotice(null);
              if (inventory.length >= 5) openWorkbenchWithMode('PRINT_WORKSHOP', 'work');
              else { stopAllMovement('note'); setShowMap(true); }
            }}]}
          />
        )}
        {!showMap && !showWorkbench && !journalOpen && (
          <>
            {(showOpeningPrologueSequence || showFanRack || showStreetPasserbyLore || showHubElderDialogue || showPulpInfo || showLoc1ArtisanLore || showLoc1ArrivalSequence || showLoc2ArrivalSequence || showLoc2ArtisanLore || showArmorLore || showCostumeRackLore || showLoc3ArrivalSequence || showLoc3PaintingsLore || showLoc3CarverLore || showLoc4ArrivalSequence || showLoc4ArtisanLore || showLoc4TeaTableLore || showLoc4TapestryLore || showLoc4ShelvesLore || showLoc5ArrivalSequence || showLoc5ArtisanLore || showLoc5LotusLore || showLoc5CoupletsLore || showLoc5TigerMuralLore || showLoc5BellLore || Boolean(decoyDialogue) || Boolean(decoyArrivalNotice) || Boolean(decoyLoreModal)) && (
              <div className="absolute inset-0 z-30" aria-hidden="true" />
            )}
      {/* Chuỗi Lời Thoại Mở Đầu Cốt Truyện GDD */}
      {showOpeningPrologueSequence && currentScene === 'opening_hub' && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Lời Dẫn',
              speakerRole: 'Khu Mở Đầu',
              avatarType: 'system',
              content: [
                'Tiếng guốc gỗ lộc cộc vang lên đâu đó phía sau. Tôi mở mắt.',
                'Trước mặt tôi là một con phố xa lạ. Những mái ngói nâu sẫm nối tiếp nhau, biển hiệu gỗ đung đưa trước hiên nhà.',
              ],
            },
            {
              speaker: 'Lời Dẫn',
              speakerRole: 'Khu Mở Đầu',
              avatarType: 'system',
              content: [
                'Từ những cửa hiệu hai bên đường, tiếng người trò chuyện, tiếng dụng cụ va vào mặt gỗ và cả mùi mực ngai ngái hòa lẫn trong không khí.',
              ],
            },
            {
              speaker: 'Lời Dẫn',
              speakerRole: 'Khu Mở Đầu',
              avatarType: 'system',
              content: [
                'Một người đàn ông đi ngang qua tôi, tay ôm một xấp giấy lớn. Tôi vội bước sang bên nhường đường, nhưng ông ta chẳng hề phản ứng.',
              ],
            },
            {
              speaker: 'Lời Dẫn',
              speakerRole: 'Khu Mở Đầu',
              avatarType: 'system',
              content: [
                'Tôi thử gọi, rồi đưa tay về phía người đi đường gần nhất. Không ai dừng lại. Họ cứ thế lướt qua, như thể tôi chỉ là một chiếc bóng vô hình giữa con phố đông đúc.',
                'Tôi bắt đầu cảm thấy bất an.',
              ],
            },
            {
              speaker: 'Lời Dẫn',
              speakerRole: 'Khu Mở Đầu',
              avatarType: 'system',
              content: [
                'Ở phía cuối con đường, một cửa hiệu nhỏ thu hút sự chú ý của tôi. Trước hiên treo vài bức tranh dân gian đã ngả màu. Tôi tiến lại gần.',
              ],
            },
            {
              speaker: 'Lời Dẫn',
              speakerRole: 'Khu Mở Đầu',
              avatarType: 'system',
              content: [
                'Những đường nét in đậm, những mảng màu được tô bằng tay khiến tôi chợt nhớ đến một hiện vật trong triển lãm.',
                'Trên bức tranh đặt ở giữa cửa hiệu, năm con hổ hiện lên với những tư thế khác nhau. Tôi nhận ra hình ảnh ấy. Chính là tác phẩm tôi đã chạm vào trước khi mọi thứ biến mất.',
              ],
              hint: '💡 Hãy bước tới bức tranh ở giữa cửa hiệu hoặc nhấn [E] để soi bức tranh Ngũ Hổ!',
              actionLabel: 'Tới Soi Tranh Ngũ Hổ Ở Giữa ➔',
            },
          ]}
          currentTurnIndex={openingPrologueStep}
          onNextTurn={() => setOpeningPrologueStep((prev) => prev + 1)}
          onPrevTurn={() => setOpeningPrologueStep((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setShowOpeningPrologueSequence(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowOpeningPrologueSequence(false);
            walkToAndExecute(50, () => {
              openWorkbenchWithMode('INSPECT_TIGER', 'inspect');
            });
          }}
        />
      )}
      {showFanRack && (
        <FanRackModal
          onClose={() => {
            setShowFanRack(false);
            stopAllMovement('idle');
          }}
        />
      )}

      {/* Modal Người Đi Đường Vô Hình ở Khu Mở Đầu */}
      {showStreetPasserbyLore && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Lời Dẫn',
              speakerRole: 'Khu Mở Đầu',
              avatarType: 'system',
              content: [
                'Một người đàn ông đi ngang qua tôi, tay ôm một xấp giấy lớn. Tôi vội bước sang bên nhường đường, nhưng ông ta chẳng hề phản ứng.',
                'Ánh mắt ông ta nhìn thẳng về phía trước, bước qua như thể tôi chỉ là một làn khói hư ảo.',
              ],
            },
            {
              speaker: 'Lời Dẫn',
              speakerRole: 'Khu Mở Đầu',
              avatarType: 'system',
              content: [
                'Tôi thử gọi thêm vài người, rồi đưa tay về phía người đi đường gần nhất. Không ai dừng lại. Họ cứ thế lướt qua, như thể tôi chỉ là một chiếc bóng vô hình giữa con phố đông đúc.',
                'Tôi bắt đầu cảm thấy bất an. Gian hiệu treo bức tranh Ngũ Hổ ở giữa phố dường như là mối liên kết duy nhất...',
              ],
              hint: '💡 Hãy bước tới bức tranh ở giữa cửa hiệu hoặc nhấn [E] để soi tranh Ngũ Hổ!',
              actionLabel: 'Tới Soi Tranh Ngũ Hổ Ở Giữa ➔',
            },
          ]}
          onClose={() => {
            setShowStreetPasserbyLore(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowStreetPasserbyLore(false);
            walkToAndExecute(50, () => {
              openWorkbenchWithMode('INSPECT_TIGER', 'inspect');
            });
          }}
        />
      )}

      {/* Chuỗi Lời Thoại Bối Cảnh Khi Mới Đến Đình Xuân Phiến Thị (Địa Điểm 1) */}
      {showLoc1ArrivalSequence && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Đình Xuân Phiến Thị • Tổ Nghề Quạt Thăng Long',
              speakerRole: 'Không Gian Lịch Sử',
              avatarType: 'system',
              content: [
                'Bạn bước chân qua ngưỡng cửa gỗ lim của ngôi đình cổ Xuân Phiến Thị trên phố Hàng Quạt. Mùi thơm mộc mạc của tre nứa tươi hòa cùng hương hồ dán và giấy bồi phơi nắng vương vấn trong không gian.',
                'Phía trước, tiếng "sột... soạt..." đều đặn của lưỡi dao miết trên thớ nan tre vang lên giữa gian đình tĩnh mịch từ chiếc bàn gỗ giữa sân...',
              ],
            },
            {
              speaker: 'Bác Thợ Già Chuốt Nan',
              speakerRole: 'Lời lẩm bẩm bên bàn chuốt',
              avatarType: 'elder',
              avatarIcon: (
                <img
                  src="./assets/npc_elder_avatar_talk.webp"
                  alt="Bác Thợ Già"
                  className="w-full h-full object-cover rounded-full"
                />
              ),
              content: [
                '“Nan tre phải đều, giấy phải phẳng. Năm chiếc quạt này vốn cùng một bộ, đường nét họa tiết vốn liền mạch nhau, cớ sao lại bị xáo trộn đến mức chẳng còn ra hình hài thế này...”',
                '“Giấy giữ hình, tre giữ dáng. Muốn lưu lại một điều gì cho mai sau, trước hết phải có nơi để nó tồn tại...”',
              ],
              hint: '💡 Bác thợ già mải mê chuốt nan và không nhìn thấy bạn. Hãy bước tới Bàn Chế Tác ở giữa đình để ghép hoàn chỉnh 5 chiếc quạt!',
              actionLabel: 'Tới Bàn Ghép Quạt ➔',
            },
          ]}
          currentTurnIndex={loc1ArrivalStep}
          onNextTurn={() => setLoc1ArrivalStep((prev) => prev + 1)}
          onPrevTurn={() => setLoc1ArrivalStep((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setShowLoc1ArrivalSequence(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc1ArrivalSequence(false);
            walkToAndExecute(46, () => {
              openWorkbenchWithMode('CURRENT_TASK', 'work');
            });
          }}
        />
      )}

      {/* Modal Quan Sát Bác Thợ Già Chuốt Nan */}
      {showLoc1ArtisanLore && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Bác Thợ Già Chuốt Nan',
              speakerRole: 'Đình Xuân Phiến Thị',
              avatarType: 'elder',
              avatarIcon: (
                <img
                  src="./assets/npc_elder_avatar_talk.webp"
                  alt="Bác Thợ Già"
                  className="w-full h-full object-cover rounded-full"
                />
              ),
              content: [
                'Bác thợ già đang cặm cụi chuốt từng nan tre bên bàn gỗ, hoàn toàn không hề nhận ra sự hiện diện của bạn.',
                'Bên cạnh bác là những chiếc quạt nan tre bị xáo trộn. Tiếng lẩm bẩm nhắc nhở: Gốc tre cắm sâu đất lành, Thân dưới vươn thẳng, Thân trên đón gió, Ngọn tre chạm mây, và Tán lá chim hót...',
              ],
              hint: '💡 Hãy bước tới bàn chế tác ở giữa đình để ghép lại 5 nan quạt!',
              actionLabel: 'Tới Bàn Ghép 5 Chiếc Quạt ➔',
            },
          ]}
          currentTurnIndex={0}
          onNextTurn={() => setShowLoc1ArtisanLore(false)}
          onPrevTurn={() => {}}
          onClose={() => {
            setShowLoc1ArtisanLore(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc1ArtisanLore(false);
            walkToAndExecute(46, () => {
              openWorkbenchWithMode('CURRENT_TASK', 'work');
            });
          }}
        />
      )}

      {/* Modal Tre Trúc & Khung Dệt Giấy Dó ở Địa điểm 1 */}
      {showPulpInfo && (
        <BottomDialogueBox
          isOpen
          speaker="Khu Tre Trúc & Khung Bồi Giấy Dó"
          speakerRole="Đình Xuân Phiến Thị"
          onClose={() => { setShowPulpInfo(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                Bên trái gian đình là những bó tre già đã ngâm kỹ để vót nan quạt cùng khung gỗ căng giấy dó phơi khô.
              </p>
              <p className="text-amber-200/90 italic">
                "Nan tre phải đều, giấy phải phẳng. Chỉ cần lệch một chút thôi, chiếc quạt dù đẹp đến đâu cũng chẳng thể khép lại cho trọn vẹn."
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowPulpInfo(false);
                  walkToAndExecute(46, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Tới Bàn Ghép 5 Chiếc Quạt
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowPulpInfo(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Chuỗi Lời Thoại Bối Cảnh Khi Mới Đến Hiệu Phục Sức Mã Vĩ (Địa Điểm 2) */}
      {showLoc2ArrivalSequence && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Hiệu Phục Sức Mã Vĩ • Ngõ Nghề Tuồng Cổ Thăng Long',
              speakerRole: 'Không Gian Lịch Sử',
              avatarType: 'system',
              content: [
                'Bạn bước vào gian hiệu phục sức trên ngõ Mã Vĩ xưa. Xung quanh treo đầy áo bào thêu chỉ kim tuyến, cờ lệnh ngũ sắc, mũ cánh chuồn và những chòm râu đuôi ngựa óng mượt dành cho các nghệ sĩ tuồng hát.',
                'Không gian thoang thoảng mùi sơn ta, mực mài và vải mới, phản chiếu ánh sáng lung linh từ những tấm gương soi phục trang sân khấu.',
              ],
            },
            {
              speaker: 'Bác Quản Hiệu Phục Sức',
              speakerRole: 'Lời lẩm bẩm bên giá phục trang',
              avatarType: 'artisan',
              content: [
                '“Rõ khổ... Giờ diễn của gánh hát tuồng sắp đến nơi rồi mà trong sổ phục trang ghi chép một đằng, ngoài giá treo người ta lại để lẫn lộn một nẻo!”',
                '“Mũ quan triều đình thì lẫn với mũ tướng, mặt nạ tuồng lại vắt sang áo bổ quan văn... Không phân định rõ ràng thì lát nữa lên sân khấu làm sao toát lên cái uy của bậc trung thần, cái dũng của viên tướng?”',
              ],
              hint: '💡 Người quản hiệu mải miết sắp xếp và không nhìn thấy bạn. Hãy bước sang Bàn Sổ Phục Trang bên phải để chỉnh trang y phục 3 vai diễn!',
              actionLabel: 'Tới Bàn Phục Trang ➔',
            },
          ]}
          currentTurnIndex={loc2ArrivalTurnIndex}
          onNextTurn={() => setLoc2ArrivalTurnIndex((prev) => prev + 1)}
          onPrevTurn={() => setLoc2ArrivalTurnIndex((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setShowLoc2ArrivalSequence(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc2ArrivalSequence(false);
            walkToAndExecute(76, () => {
              openWorkbenchWithMode('CURRENT_TASK', 'work');
            });
          }}
        />
      )}

      {/* Modal Quan Sát Bác Quản Hiệu Phục Sức (Địa Điểm 2) */}
      {showLoc2ArtisanLore && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Bác Quản Hiệu Phục Sức',
              speakerRole: 'Hiệu Phục Sức Mã Vĩ',
              avatarType: 'artisan',
              content: [
                'Người quản hiệu đang lật từng trang sổ bộ, miệng lẩm bẩm quy thức: Quan Văn đội Mũ Cánh Chuồn, Áo Bổ, Hốt Ngọc; Võ Tướng đội Mũ Trụ, Giáp Sắt, Cờ Lệnh; Kép Hề đội Khăn Vấn, Áo Chẽn, Mặt Nạ Tuồng...',
                'Người đó hoàn toàn không hề nhận ra sự hiện diện của bạn.',
              ],
              hint: '💡 Đi sang bàn sổ phục trang bên phải để chỉnh trang y phục!',
              actionLabel: 'Tới Bàn Phục Trang ➔',
            },
          ]}
          currentTurnIndex={0}
          onNextTurn={() => setShowLoc2ArtisanLore(false)}
          onPrevTurn={() => {}}
          onClose={() => {
            setShowLoc2ArtisanLore(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc2ArtisanLore(false);
            walkToAndExecute(76, () => {
              openWorkbenchWithMode('CURRENT_TASK', 'work');
            });
          }}
        />
      )}

      {/* Modal Giá Treo Y Phục & Cờ Lệnh ở Địa điểm 2 */}
      {showCostumeRackLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🚩 Giá Treo Y Phục & Cờ Lệnh Sân Khấu (Hiệu Phục Sức Mã Vĩ)"}
          onClose={() => { setShowCostumeRackLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                "Trên giá gỗ treo những bộ áo bào thêu kim tuyến, cờ lệnh ngũ sắc, mũ mão và những chiếc mặt nạ sơn đủ màu của gánh hát Tuồng cổ."
              </p>
              <p className="italic text-amber-200/90">
                "Một số phụ kiện như Mũ Cánh Chuồn, Giáp Sắt Hộ Tâm, Mặt Nạ Tuồng Cổ đang bị đặt lẫn lộn giữa ba bộ trang phục mẫu..."
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowCostumeRackLore(false);
                  walkToAndExecute(76, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Tới Bàn Sổ Phục Trang Bên Phải
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowCostumeRackLore(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Modal Ba Bộ Trang Phục Trước Gương ở Địa điểm 2 */}
      {showArmorLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🎭 Ba Bộ Trang Phục Chưa Hoàn Thiện Trước Gương (Hiệu Phục Sức Mã Vĩ)"}
          onClose={() => { setShowArmorLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                Chính giữa gian hiệu là ba bộ trang phục mẫu đặt trước chân dung tương ứng với ba vai diễn trong sổ phục trang:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-300">
                <li>
                  <strong className="text-amber-300">Vị Quan Triều Đình:</strong> Mũ Cánh Chuồn, Áo Gấm Thêu Bổ, Hốt Ngọc & Thẻ Bài.
                </li>
                <li>
                  <strong className="text-amber-300">Viên Tướng Xuất Trận:</strong> Mũ Trụ Kim Tuyến, Giáp Sắt Hộ Tâm, Cờ Lệnh Ngũ Sắc.
                </li>
                <li>
                  <strong className="text-amber-300">Nhân Vật Đeo Mặt Nạ:</strong> Khăn Vấn Đỏ Thẫm, Áo Vạt Chẽn Rực Rỡ, Mặt Nạ Tuồng Cổ.
                </li>
              </ul>
              <p className="text-emerald-300 text-xs pt-1">
                💡 Hãy đi sang <strong>Bàn Sổ Phục Trang bên phải</strong> để đối chiếu sổ sách, gắn đúng phụ kiện cho 3 vai diễn và nhận <strong>Mực Tàu</strong>!
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowArmorLore(false);
                  walkToAndExecute(76, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Mở Sổ Phục Trang & Chỉnh Trang Phục
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowArmorLore(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Modal Tranh Dân Gian Treo Tường tại Địa điểm 3 */}
      {showLoc3PaintingsLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🖼️ Tranh Dân Gian Treo Tường & Kệ Ván Khắc (Xưởng Tranh Hàng Trống)"}
          onClose={() => { setShowLoc3PaintingsLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                "Tôi nhận ra nơi này ngay khi nhìn thấy những bức tranh dân gian treo dọc hai bên tường và những tấm ván gỗ xếp chồng trên kệ. Đây chính là xưởng tranh Hàng Trống."
              </p>
              <p className="italic text-amber-200/90">
                "Trên bàn giữa xưởng là bản in thử mới nhất, nhưng đặt cạnh bức tranh gốc treo trên tường vẫn lộ ra vài chỗ chưa hoàn toàn trùng khớp — có lẽ nét khắc trên gỗ đã bị sửa lại."
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc3PaintingsLore(false);
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Soi Bản In Thử Ở Bàn Giữa
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc3PaintingsLore(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Chuỗi Lời Thoại Bối Cảnh Khi Mới Đến Xưởng Tranh Hàng Trống (Địa Điểm 3) */}
      {showLoc3ArrivalSequence && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Xưởng Tranh Hàng Trống • Mộc Bản Tranh Thờ Cổ Truyền',
              speakerRole: 'Không Gian Lịch Sử',
              avatarType: 'system',
              content: [
                'Bạn bước chân vào xưởng tranh Hàng Trống cổ kính. Mùi gỗ thị, gỗ lồng mực ngai ngái hòa cùng mùi mực mài đen nhánh phảng phất khắp gian phòng.',
                'Dọc theo các bức tường là những bản mộc khắc tinh xảo và các bức tranh dân gian rực rỡ sắc màu. Giữa xưởng, tiếng gõ đục mộc bản "cốc... cốc..." trầm ấm vang lên đều đặn.',
              ],
            },
            {
              speaker: 'Bác Thợ Già Khắc Ván',
              speakerRole: 'Lời lẩm bẩm bên bàn mộc',
              avatarType: 'artisan',
              avatarIcon: (
                <img
                  src="./assets/npc_elder_avatar_talk.webp"
                  alt="Bác Thợ Khắc"
                  className="w-full h-full object-cover rounded-full"
                />
              ),
              content: [
                '“Lạ thật đấy... Bản in thử này đường nét thanh thoát, nhưng sao đối chiếu với bản gốc của tiền nhân, ta cứ cảm thấy có tới 3 chỗ sai lệch...”',
                '“Dù chỉ lệch một nét nhỏ thôi thì thần thái của Bạch Hổ cũng chẳng còn trọn vẹn. Ta phải dò kỹ từng thớ nét từ đầu tới chân mới được!”',
              ],
              hint: '💡 Người thợ già mải mê soi bản khắc và không nhìn thấy bạn. Hãy bước tới Bàn Kính Lúp ở giữa xưởng để tự đối chiếu bản in thử!',
              actionLabel: 'Tới Bàn Kính Lúp ➔',
            },
          ]}
          currentTurnIndex={loc3ArrivalTurnIndex}
          onNextTurn={() => setLoc3ArrivalTurnIndex((prev) => prev + 1)}
          onPrevTurn={() => setLoc3ArrivalTurnIndex((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setShowLoc3ArrivalSequence(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc3ArrivalSequence(false);
            walkToAndExecute(50, () => {
              openWorkbenchWithMode('CURRENT_TASK', 'work');
            });
          }}
        />
      )}

      {/* Modal Quan Sát Bác Thợ Khắc Ván (Địa Điểm 3) */}
      {showLoc3CarverLore && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Bác Thợ Già Khắc Ván',
              speakerRole: 'Xưởng Tranh Hàng Trống',
              avatarType: 'artisan',
              avatarIcon: (
                <img
                  src="./assets/npc_elder_avatar_talk.webp"
                  alt="Bác Thợ Khắc"
                  className="w-full h-full object-cover rounded-full"
                />
              ),
              content: [
                'Bác thợ già cúi sát tấm ván mộc thị, ngón tay chai sần miết dọc theo từng thớ nét khắc, hoàn toàn đắm chìm vào công việc.',
                'Lời bác lẩm bẩm một mình: “Mực mài đã đen, gỗ thị đã đẽo... Chỉ cần đối chiếu lại bản in thử trên bàn với bức tranh gốc treo tường, ắt sẽ thấy chỗ bị sửa đổi!”',
              ],
              hint: '💡 Bước tới Bàn Kính Lúp ở giữa xưởng để soi tranh!',
              actionLabel: 'Tới Bàn Kính Lúp ➔',
            },
          ]}
          currentTurnIndex={0}
          onNextTurn={() => setShowLoc3CarverLore(false)}
          onPrevTurn={() => {}}
          onClose={() => {
            setShowLoc3CarverLore(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc3CarverLore(false);
            walkToAndExecute(50, () => {
              openWorkbenchWithMode('CURRENT_TASK', 'work');
            });
          }}
        />
      )}

      {/* Chuỗi Lời Thoại Bối Cảnh Khi Mới Đến Hiệu Tơ Lụa Hàng Gai (Địa Điểm 4) */}
      {showLoc4ArrivalSequence && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Hiệu Tơ Lụa Hàng Gai • Phố Gấm Vóc Kinh Kỳ',
              speakerRole: 'Không Gian Lịch Sử',
              avatarType: 'system',
              content: [
                'Bạn bước qua tấm rèm the bước vào Hiệu Tơ Lụa Hàng Gai. Không gian ngập tràn sắc màu óng ả của những cuộn lụa tơ tằm Hà Đông buông rủ mềm mại như thác nước mây ngàn.',
                'Ánh sáng ban mai xuyên qua khung cửa gỗ, chiếu lên bình hoa mận trắng và tỏa ngát hương thơm thanh tao của nước hoa lài cùng bột thảo mộc ngâm nhuộm.',
              ],
            },
            {
              speaker: 'Bà Chủ Hiệu Lụa',
              speakerRole: 'Lẩm Bẩm Bên Giá Lụa',
              avatarType: 'hostess',
              content: [
                'Bà chủ hiệu lụa đang cặm cụi lật giở cuốn sổ nhuộm cũ kỹ, miệng lẩm bẩm đầy bối rối:',
                '“Các thợ nhuộm vẫn đang lúng túng trước cuốn sổ tay cổ truyền. Pha sắc tố tự nhiên từ cây cỏ không thể tùy tiện, nhỏ sai một giọt màu là dải lụa biến sắc ngay!”',
                '“Màu sắc trong tranh và lụa kinh kỳ đều có chung cội nguồn ngũ hành: Đỏ từ hoa hòe vang, Vàng từ củ nghệ già, Lam từ lá chàm... Ở chiếc bàn giữa phòng có sổ tay và ba bát sứ cần đong đúng số giọt...”',
              ],
              hint: '💡 Hãy bước tới Bàn Pha Màu giữa phòng để pha sắc tố!',
              actionLabel: 'Tới Bàn Pha Màu ➔',
            },
          ]}
          currentTurnIndex={loc4ArrivalTurnIndex}
          onNextTurn={() => setLoc4ArrivalTurnIndex((prev) => prev + 1)}
          onPrevTurn={() => setLoc4ArrivalTurnIndex((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setShowLoc4ArrivalSequence(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc4ArrivalSequence(false);
            walkToAndExecute(50, () => {
              openWorkbenchWithMode('CURRENT_TASK', 'work');
            });
          }}
        />
      )}

      {/* Modal Quan Sát Lời Dẫn & Công Thức Tại Hiệu Lụa (Địa Điểm 4) */}
      {showLoc4ArtisanLore && (
        <BottomDialogueBox
          isOpen
          turns={
            !inventory.includes('pham_mau')
              ? [
                  {
                    speaker: 'Lời Dẫn',
                    speakerRole: 'Quan Sát Bàn Nhuộm',
                    avatarType: 'system',
                    content: [
                      'Đứng bên bàn nhuộm lụa, bạn lắng nghe tiếng bà chủ hiệu đang nhắc nhở thợ phụ công thức cổ truyền:',
                      '“Hãy ghi nhớ kỹ tỷ lệ của tiền nhân phố Hàng Gai: Màu Cam ấm áp cần 3 giọt Vàng và 2 giọt Đỏ; Màu Lục biếc non cần 3 giọt Lam và 2 giọt Vàng; Màu Tía quý phái cần 3 giọt Đỏ và 2 giọt Lam.”',
                      '“Đong đúng từng giọt thảo mộc vào bát sứ, màu sắc mới óng ả và bền bỉ nghìn năm!”',
                    ],
                    hint: '💡 Bước tới Bàn Pha Màu ở giữa hiệu lụa để tiến hành pha chế!',
                    actionLabel: 'Tới Bàn Pha Màu ➔',
                  },
                ]
              : [
                  {
                    speaker: 'Lời Dẫn',
                    speakerRole: 'Quan Sát Bàn Nhuộm',
                    avatarType: 'system',
                    content: [
                      'Trên bàn, ba bát màu Cam, Lục và Tía đã được hòa sắc hoàn hảo, trong vắt và tươi thắm tựa cánh hoa mùa xuân.',
                      'Hộp Phẩm Màu Ngũ Hành mang linh khí Hành Thủy mềm mại của Hắc Hổ phương Bắc đã nằm trong tay bạn. Đã đến lúc mở Bản Đồ Cổ để tiếp tục hành trình!',
                    ],
                    hint: '💡 Bấm nút dưới để mở Bản Đồ Dịch Chuyển sang địa điểm tiếp theo!',
                    actionLabel: 'Mở Bản Đồ Cổ Đi Tiếp ➔',
                  },
                ]
          }
          currentTurnIndex={loc4ArtisanTurnIndex}
          onNextTurn={() => setLoc4ArtisanTurnIndex((prev) => prev + 1)}
          onPrevTurn={() => setLoc4ArtisanTurnIndex((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setShowLoc4ArtisanLore(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc4ArtisanLore(false);
            if (!inventory.includes('pham_mau')) {
              walkToAndExecute(50, () => {
                openWorkbenchWithMode('CURRENT_TASK', 'work');
              });
            } else {
              stopAllMovement('note');
              setShowMap(true);
            }
          }}
        />
      )}

      {/* Modal Cửa Sổ Đón Nắng & Bàn Trà Hoa Mận tại Địa điểm 4 */}
      {showLoc4TeaTableLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🌸 Cửa Sổ Đón Nắng & Khăn Lụa Sóng Nước (Hiệu Tơ Lụa Hàng Gai)"}
          onClose={() => { setShowLoc4TeaTableLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                "Ánh sáng xuyên qua khung cửa sổ gỗ, chiếu lên bình hoa mận trắng và tấm khăn lụa dập hoa văn sóng nước chập chùng..."
              </p>
              <p className="italic text-amber-200/90">
                "Cửa hiệu im lìm. Không có ai bên trong, chỉ có tiếng gió nhẹ luồn qua khe cửa và tiếng những cuộn lụa khẽ va vào nhau."
              </p>
              <p className="text-emerald-300 text-xs pt-1">
                💡 Hãy tiến đến <strong>Bàn Pha Màu giữa phòng</strong> để mở cuốn sổ nhuộm cổ và pha các sắc tố!
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc4TeaTableLore(false);
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Tới Bàn Pha Màu
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc4TeaTableLore(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Modal Tranh Hắc Hổ & Dải Lụa Ngũ Sắc tại Địa điểm 4 */}
      {showLoc4TapestryLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🌊 Bức Tranh Hắc Hổ Vượt Sóng & Dải Lụa Ngũ Sắc"}
          onClose={() => { setShowLoc4TapestryLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                Tấm tranh treo tường thêu hình <strong className="text-blue-300">Hắc Hổ</strong> dũng mãnh đạp trên những ngọn sóng biếc cuộn trào dưới vầng trăng khuyết và mây bạc.
              </p>
              <p className="italic text-amber-200/90">
                "Hắc Hổ trấn giữ phương Bắc, thuộc hành Thủy. Nước tượng trưng cho sự uyển chuyển, mềm mại, tương đồng với những dải tơ lụa Hàng Gai rủ xuống bốn bề."
              </p>
              <p className="text-stone-400 text-xs">
                Màu chàm lam của nước và ánh trăng như hòa quyện vào các thớ vải tự nhiên.
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc4TapestryLore(false);
                  stopAllMovement('idle');
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Đóng Lại
              </button>
            </div>)}
        />
      )}

      {/* Modal Kệ Cuộn Lụa & Tủ Bí Mật tại Địa điểm 4 */}
      {showLoc4ShelvesLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🏮 Kệ Trưng Bày Cuộn Lụa & Đèn Lồng Sóng Nước"}
          onClose={() => { setShowLoc4ShelvesLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                "Những cuộn lụa được xếp thành từng chồng, từ đỏ thẫm, xanh ngọc đến vàng nhạt. Một số tấm lụa có hoa văn gần như giống hệt nhau, nhưng màu sắc lại hoàn toàn khác biệt."
              </p>
              <p className="italic text-amber-200/90">
                "Phía dưới kệ là chiếc tủ gỗ khép kín. Người thợ nhuộm phố Hàng Gai xưa kia đã cất giữ các gói phẩm màu tự nhiên quý giá vào ngăn kéo bí mật dưới bàn chế tác..."
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc4ShelvesLore(false);
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Tới Bàn Pha Màu
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc4ShelvesLore(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Chuỗi Lời Thoại Bối Cảnh Khi Mới Đến Đình Đông Hương (Địa Điểm 5) */}
      {showLoc5ArrivalSequence && (
        <BottomDialogueBox
          isOpen
          turns={[
            {
              speaker: 'Đình Đông Hương • Trung Tâm Tâm Linh Thần Hổ',
              speakerRole: 'Không Gian Lịch Sử',
              avatarType: 'system',
              content: [
                'Bạn bước qua cổng tam quan, tiến vào sân đình Đông Hương cổ kính trên phố Hàng Trống. Khói trầm hương bảng lảng quyện lấy đôi cột rồng đá lim uốn lượn uy nghi.',
                'Trước gian chính điện, bức hoành phi sơn son thếp vàng ba chữ "Đình Đông Hương" tỏa ánh hào quang ấm áp, phía dưới là bàn thờ đá tôn nghiêm ngự bóng dáng uy dũng của Hoàng Hổ trung tâm.',
              ],
            },
            {
              speaker: 'Cụ Từ Đình Đông Hương',
              speakerRole: 'Lẩm Bẩm Khấn Nguyện',
              avatarType: 'priest',
              content: [
                'Trong làn khói trầm mờ ảo, cụ từ đình đang quỳ gối trầm ngâm trước ban thờ Hoàng Hổ, miệng lẩm bẩm khấn nguyện:',
                '“Tranh Ngũ Hổ không chỉ là tranh thờ, mà là sự hòa hợp của ngũ phương và ngũ hành. Muốn mở được tráp cổ của tiền nhân, phải dâng đủ bốn khí chất từ bốn phường nghề quanh kinh thành rồi mới khai thông trung tâm...”',
                '“Năm thẻ Ngũ Hành phải an vị đúng phương: Đông Mộc, Nam Hỏa, Tây Kim, Bắc Thủy, và Hoàng Hổ ở Trung Thổ... Bệ thờ chính điện đang chờ người hội tụ ngũ khí để khai mở chiếc tráp cổ...”',
              ],
              hint: '💡 Hãy bước tới Bàn Thờ Trung Tâm ở giữa đình để dâng thẻ Ngũ Hành!',
              actionLabel: 'Tới Bàn Thờ Trung Tâm ➔',
            },
          ]}
          currentTurnIndex={loc5ArrivalTurnIndex}
          onNextTurn={() => setLoc5ArrivalTurnIndex((prev) => prev + 1)}
          onPrevTurn={() => setLoc5ArrivalTurnIndex((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setShowLoc5ArrivalSequence(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc5ArrivalSequence(false);
            walkToAndExecute(50, () => {
              openWorkbenchWithMode('CURRENT_TASK', 'work');
            });
          }}
        />
      )}

      {/* Modal Quan Sát Lời Dẫn & Ban Thờ Đình Đông Hương (Địa Điểm 5) */}
      {showLoc5ArtisanLore && (
        <BottomDialogueBox
          isOpen
          turns={
            !inventory.includes('but_long')
              ? [
                  {
                    speaker: 'Lời Dẫn',
                    speakerRole: 'Chiêm Bái Đình Cổ',
                    avatarType: 'system',
                    content: [
                      'Khói hương trầm mặc lan tỏa qua từng thớ gỗ lim. Trước gian chính điện là chiếc tráp gỗ cổ với 5 bệ thờ Ngũ Phương đang chờ được hội tụ đủ khí chất từ các phường nghề.',
                      'Lời nhắc nhở của cụ từ vẳng bên tai: “Đông Mộc ứng Thanh Hổ, Tây Kim ứng Bạch Hổ, Nam Hỏa ứng Xích Hổ, Bắc Thủy ứng Hắc Hổ, và Trung Ương là Hoàng Hổ... Đặt đúng 5 thẻ báu, chiếc tráp cổ khắc rồng sẽ tự khắc mở ra!”',
                    ],
                    hint: '💡 Bước tới Bàn Thờ Trung Tâm để dâng thẻ Ngũ Hành!',
                    actionLabel: 'Tới Bàn Thờ Trung Tâm ➔',
                  },
                ]
              : [
                  {
                    speaker: 'Lời Dẫn',
                    speakerRole: 'Khai Mở Tráp Cổ',
                    avatarType: 'system',
                    content: [
                      'Chiếc tráp gỗ cổ đã bật mở trong ánh sáng vàng kim ấm áp. Cây Bút Lông Cổ Truyền nằm tĩnh lặng trên lớp vải cũ cùng bốn câu thơ thiêng liêng.',
                      'Bạn đã thu thập trọn vẹn cả 5 Đạo Cụ Ngũ Hành: Giấy Dó, Mực Tàu, Ván Khắc Gỗ, Phẩm Màu và Bút Lông. Đã đến lúc quay về Xưởng Tranh ở Khu Mở Đầu để bắt đầu in tranh!',
                    ],
                    hint: '💡 Đã đủ 5 đạo cụ! Bấm nút dưới để quay về Xưởng Tranh ở Khu Mở Đầu!',
                    actionLabel: 'Về Xưởng Tranh In Tranh ➔',
                  },
                ]
          }
          currentTurnIndex={loc5ArtisanTurnIndex}
          onNextTurn={() => setLoc5ArtisanTurnIndex((prev) => prev + 1)}
          onPrevTurn={() => setLoc5ArtisanTurnIndex((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setShowLoc5ArtisanLore(false);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setShowLoc5ArtisanLore(false);
            if (!inventory.includes('but_long')) {
              walkToAndExecute(50, () => {
                openWorkbenchWithMode('CURRENT_TASK', 'work');
              });
            } else {
              teleportToOpeningHub(50);
            }
          }}
        />
      )}

      {/* Modal Bệ Tượng Hoa Sen Đá & Rùa Chầu tại Địa điểm 5 */}
      {showLoc5LotusLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🌸 Tượng Sen Đá & Rùa Chầu Đình Cổ (Đình Đông Hương)"}
          onClose={() => { setShowLoc5LotusLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                Dưới ánh nắng ban mai rọi qua khung cửa gỗ, bệ hoa sen đá nở rộ và tượng rùa đá đội ấn toát lên vẻ trang nghiêm cổ kính.
              </p>
              <p className="italic text-amber-200/90">
                "Hoa sen tượng trưng cho sự thanh tịnh, thoát tục. Rùa đá tượng trưng cho sự trường tồn, bền bỉ của mạch nguồn văn hóa Thăng Long nghìn năm văn hiến."
              </p>
              <p className="text-emerald-300 text-xs">
                💡 Hãy tiến vào <strong>Bàn Thờ chính ở giữa</strong> để đối chiếu các ký hiệu và khai mở chiếc tráp gỗ cổ!
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc5LotusLore(false);
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Tới Bàn Thờ Trung Tâm
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc5LotusLore(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Modal Cột Rồng & Cặp Câu Đối tại Địa điểm 5 */}
      {showLoc5CoupletsLore && (
        <BottomDialogueBox
          isOpen
          speaker={"📜 Cột Rồng Cuộn & Câu Đối Đỏ \"Hộ Quốc An Dân\""}
          onClose={() => { setShowLoc5CoupletsLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                Hai bên gian thờ là đôi câu đối đỏ rực thếp vàng cổ kính:
              </p>
              <div className="p-2.5 bg-amber-950/40 rounded border border-amber-600/50 text-amber-200 font-bold text-xs space-y-1 text-center">
                <p>Vế trái: 「 Hộ Quốc An Dân 」 (Bảo vệ đất nước, yên ổn lòng dân)</p>
                <p>Vế phải: 「 Phong Điều Vũ Thuận 」 (Gió hòa mưa thuận, mùa màng tốt tươi)</p>
              </div>
              <p className="italic text-stone-300">
                Thân cột gỗ lim khổng lồ được chạm nổi hình rồng cuộn uốn lượn uy nghi giữa làn mây mộc bản, tượng trưng cho linh khí đất thiêng Thăng Long.
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc5CoupletsLore(false);
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Tới Bàn Thờ Trung Tâm
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc5CoupletsLore(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Modal Bức Họa Hoàng Hổ tại Địa điểm 5 */}
      {showLoc5TigerMuralLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🐯 Bức Họa Hoàng Hổ Trấn Thủ Trung Ương (Hành Thổ)"}
          onClose={() => { setShowLoc5TigerMuralLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                Chính giữa gian thờ, bức hoành phi ba chữ vàng <strong className="text-amber-300">"Đình Đông Hương"</strong> tỏa sáng lung linh. Phía dưới là bức gấm vẽ <strong className="text-amber-400">Hoàng Hổ</strong> dũng mãnh đạp mây, khói trầm lan tỏa bảng lảng từ đỉnh đồng.
              </p>
              <p className="italic text-amber-200/90">
                "Hoàng Hổ trấn giữ trung tâm, thuộc hành Thổ — đất mẹ bao bọc muôn loài. Hoàng Hổ là vị chúa sơn lâm thống lĩnh Thanh Hổ (Đông), Xích Hổ (Nam), Bạch Hổ (Tây) và Hắc Hổ (Bắc)."
              </p>
              <p className="text-emerald-300 text-xs">
                💡 Cây Bút Lông ngự trong chiếc tráp gỗ cổ dưới bàn thờ chính là nét vẽ cuối cùng để hồi sinh toàn bộ Ngũ Hổ!
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc5TigerMuralLore(false);
                  walkToAndExecute(50, () => {
                    openWorkbenchWithMode('CURRENT_TASK', 'work');
                  });
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Mở Tráp Nhận Bút Lông
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc5TigerMuralLore(false);
                  stopAllMovement('idle');
                }}
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded border border-stone-600 transition"
              >
                Đóng
              </button>
            </div>)}
        />
      )}

      {/* Modal Đại Hồng Chung & Nghê Đá tại Địa điểm 5 */}
      {showLoc5BellLore && (
        <BottomDialogueBox
          isOpen
          speaker={"🔔 Đại Hồng Chung & Tượng Nghê Đá Canh Cửa"}
          onClose={() => { setShowLoc5BellLore(false); stopAllMovement('idle'); }}
          content={(<div className="space-y-2.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <p>
                Bên phải gian thờ là quả chuông đồng cổ (Đại Hồng Chung) đúc các hoa văn quầng lửa và vân sóng, treo vững chãi trên giá gỗ thếp son.
              </p>
              <p className="italic text-amber-200/90">
                "Phía trước chuông là tượng linh thú Nghê đá mắt sáng ngời, miệng nở nụ cười nhân từ, ngày đêm canh giữ sự thanh tịnh cho không gian đình làng và xua tan tà khí."
              </p>
              <p className="text-stone-400 text-xs">
                Mỗi tiếng chuông ngân lên như vang vọng qua các phố nghề Thăng Long, nhắc nhở thế hệ mai sau gìn giữ tinh hoa của tiền nhân.
              </p>
            </div>)}
          customFooter={(<div className="flex flex-wrap justify-end">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowLoc5BellLore(false);
                  stopAllMovement('idle');
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition"
              >
                Đóng Lại
              </button>
            </div>)}
        />
      )}

      {/* Modal Thông Báo Khi Vừa Đến Địa Điểm Giả (Decoy Arrival Notice) */}
      {decoyArrivalNotice && (
        <BottomDialogueBox
          isOpen
          speaker={decoyArrivalNotice.locName}
          speakerRole="Địa Điểm Đánh Lạc Hướng"
          onClose={() => {
            setDecoyArrivalNotice(null);
            stopAllMovement('idle');
          }}
          content={
            <div className="space-y-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <div className="p-2 bg-amber-950/40 border border-amber-600/50 rounded text-amber-200">
                <span className="font-bold text-amber-400">Không khí:</span> {decoyArrivalNotice.atmosphere}
              </div>
              <p>{decoyArrivalNotice.description}</p>
              <div className="italic text-amber-200/90 border-l-2 border-amber-400 pl-2 space-y-1">
                {decoyArrivalNotice.dialogue.map((line, idx) => (
                  <p key={idx}>"{line}"</p>
                ))}
              </div>
              <p className="text-emerald-300 text-xs pt-1">
                ⚠️ <strong>Lưu ý:</strong> Nơi đây không cất giấu đạo cụ phục chế Ngũ Hổ. Bạn có thể tự do ngắm nhìn phố phường hoặc bấm <strong>Mở Bản Đồ [M]</strong> để tìm đúng 5 địa điểm làng nghề cổ truyền!
              </p>
            </div>
          }
          actions={[
            {
              label: 'Khám Phá Cảnh Này',
              primary: true,
              onClick: () => {
                sounds.playClick();
                setDecoyArrivalNotice(null);
                stopAllMovement('idle');
              },
            },
            {
              label: 'Mở Bản Đồ [M] Đi Tiếp',
              onClick: () => {
                sounds.playClick();
                setDecoyArrivalNotice(null);
                stopAllMovement('note');
                setShowMap(true);
              },
            },
          ]}
        />
      )}

      {/* Modal Tương Tác Chi Tiết Trong Địa Điểm Giả (Decoy Lore Modal) */}
      {decoyLoreModal && (
        <BottomDialogueBox
          isOpen
          speaker={decoyLoreModal.title}
          speakerRole={decoyLoreModal.speakerRole}
          onClose={() => {
            setDecoyLoreModal(null);
            stopAllMovement('idle');
          }}
          content={decoyLoreModal.content}
          customFooter={
            <div className="flex flex-wrap items-center justify-between gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setDecoyLoreModal(null);
                  stopAllMovement('note');
                  setShowMap(true);
                }}
                className="px-3.5 py-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#b8894a] rounded text-xs text-amber-200 transition shadow active:scale-95"
              >
                Mở Bản Đồ [M] ➔
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setDecoyLoreModal(null);
                  stopAllMovement('idle');
                }}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-bold rounded shadow transition active:scale-95"
              >
                Đóng Lại
              </button>
            </div>
          }
        />
      )}

      {/* Modal Đối Thoại Đối Đáp Tại Địa Điểm Giả (Decoy Interactive Dialogue) */}
      {decoyDialogue && (
        <BottomDialogueBox
          isOpen
          turns={decoyDialogue.turns}
          currentTurnIndex={decoyTurnIndex}
          onNextTurn={() => setDecoyTurnIndex((prev) => prev + 1)}
          onPrevTurn={() => setDecoyTurnIndex((prev) => Math.max(0, prev - 1))}
          onClose={() => {
            setDecoyDialogue(null);
            stopAllMovement('idle');
          }}
          onFinish={() => {
            setDecoyDialogue(null);
            stopAllMovement('note');
            setShowMap(true);
          }}
        />
      )}

          </>
        )}
      </div>

      {/* 3. Footer Pixel HUD: Túi Đạo Cụ Ngũ Hành */}
      <footer className="z-40 w-full bg-[#16120e]/95 border-t border-[#b8894a] px-2.5 py-1 flex flex-wrap items-center justify-between gap-2 shadow-2xl shrink-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-serif font-bold text-amber-300">
            Túi Đạo Cụ:
          </span>
          {[
            { id: 'giay_do', name: 'Giấy Dó' },
            { id: 'muc_tau', name: 'Mực Tàu' },
            { id: 'van_khac', name: 'Ván Khắc Gỗ' },
            { id: 'pham_mau', name: 'Phẩm Màu' },
            { id: 'but_long', name: 'Bút Lông' },
          ].map((relic) => {
            const hasIt = inventory.includes(relic.id as any);
            return (
              <div
                key={relic.id}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-serif transition-all ${
                  hasIt
                    ? 'bg-emerald-900/90 text-emerald-200 border-emerald-400 font-bold shadow'
                    : 'bg-stone-900/80 text-stone-500 border-stone-800'
                }`}
              >
                {hasIt ? '✓ ' : '○ '}
                {relic.name}
              </div>
            );
          })}
        </div>

        <div className="text-[10px] sm:text-[11px] font-serif text-stone-400">
          {currentScene === 'opening_hub' ? (
            <>
              <strong>Khu Mở Đầu:</strong> Ấn <strong>Soi Tranh Ngũ Hổ</strong> hoặc <strong>Khu Tranh Ở Giữa</strong> để mở Bản Đồ Cổ
            </>
          ) : currentScene === 'location_1_xuan_phien_thi' ? (
            <>
              <strong>Đình Xuân Phiến Thị:</strong> Ấn <strong>Bàn Chế Tác Giữa Đình</strong> ghép 5 chiếc quạt nhận Giấy Dó
            </>
          ) : currentScene === 'location_2_ma_vi' ? (
            <>
              <strong>Hiệu Phục Sức Mã Vĩ:</strong> Ấn <strong>Bàn Sổ Phục Trang bên phải</strong> chỉnh 3 bộ trang phục nhận Mực Tàu
            </>
          ) : currentScene === 'location_3_hang_trong' ? (
            <>
              <strong>Xưởng Tranh Hàng Trống:</strong> Ấn <strong>Bàn Kính Lúp ở giữa</strong> soi bản in thử nhận Ván Khắc Gỗ
            </>
          ) : currentScene === 'location_4_hang_gai' ? (
            <>
              <strong>Hiệu Tơ Lụa Hàng Gai:</strong> Ấn <strong>Bàn Pha Màu Giữa Phòng</strong> để pha màu nhuộm lụa nhận Phẩm Màu
            </>
          ) : currentScene === 'location_5_dong_huong' ? (
            <>
              <strong>Đình Đông Hương:</strong> Ấn <strong>Bàn Thờ & Tráp Gỗ Cổ</strong> để khai mở 5 bệ thờ nhận Bút Lông
            </>
          ) : isDecoyScene ? (
            <>
              <strong className="text-amber-300">{getSceneTitle()}:</strong> Địa điểm đánh lạc hướng. Ấn <strong>Cửa Ra [E]</strong> hoặc <strong>Bản Đồ [M]</strong> để tìm 5 địa điểm nghề cổ truyền!
            </>
          ) : (
            <>
              Đang ở <strong>{currentLocData.name}</strong>
            </>
          )}
        </div>
      </footer>

      {/* CÁC MODAL TƯƠNG TÁC */}
      {showMap && (
        <FastTravelMapModal
          currentLocationId={currentLocationId}
          onSelectDestination={handleFastTravel}
          onReturnToHub={() => teleportToOpeningHub(50)}
          onClose={() => {
            setShowMap(false);
            stopAllMovement('idle');
          }}
        />
      )}

      {showWorkbench && (
        <CentralWorkbenchModal
          currentLocationId={currentLocationId}
          initialMode={workbenchMode}
          onOpenMap={() => {
            setShowWorkbench(false);
            stopAllMovement('note');
            setShowMap(true);
          }}
          onReturnToSafezone={() => {
            teleportToOpeningHub(50, currentLocationId);
          }}
          onClose={() => {
            setShowWorkbench(false);
            stopAllMovement('idle');
          }}
        />
      )}

    </div>
  );
};
