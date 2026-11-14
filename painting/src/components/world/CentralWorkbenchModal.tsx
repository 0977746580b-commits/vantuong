import React, { useState, useEffect } from 'react';
import { X, Hammer, Eye, Compass, Award, Sparkles, Lock } from 'lucide-react';
import { useGameState } from '../../context/GameStateContext';
import { LOCATIONS_DATA } from '../../data/locations';
import { sounds } from '../../utils/soundEngine';

import { Stage1_InspectTiger } from '../stages/Stage1_InspectTiger';
import { PuzzleXuanPhienThi } from '../stages/puzzles/PuzzleXuanPhienThi';
import { PuzzleMaVi } from '../stages/puzzles/PuzzleMaVi';
import { PuzzleHangTrong } from '../stages/puzzles/PuzzleHangTrong';
import { PuzzleHangGai } from '../stages/puzzles/PuzzleHangGai';
import { PuzzleDongHuong } from '../stages/puzzles/PuzzleDongHuong';
import { Stage4_PrintingWorkshop } from '../stages/Stage4_PrintingWorkshop';
import { Stage5_PoemCipher } from '../stages/Stage5_PoemCipher';
import { Stage6_Epilogue } from '../stages/Stage6_Epilogue';

export type WorkbenchMode =
  | 'CURRENT_TASK'
  | 'INSPECT_TIGER'
  | 'PRINT_WORKSHOP'
  | 'POEM_CIPHER'
  | 'EPILOGUE';

interface CentralWorkbenchModalProps {
  currentLocationId: string;
  initialMode?: WorkbenchMode;
  onOpenMap: () => void;
  onReturnToSafezone?: () => void;
  onClose: () => void;
}

export const CentralWorkbenchModal: React.FC<CentralWorkbenchModalProps> = ({
  currentLocationId,
  initialMode = 'CURRENT_TASK',
  onOpenMap,
  onReturnToSafezone,
  onClose,
}) => {
  const {
    inventory,
    collectRelic,
    discoveredAnomalies,
    completedLocations,
    completeLocation,
    stage,
    setStage,
    poemUnlocked,
    setPoemUnlocked,
    epilogueUnlocked,
    setEpilogueUnlocked,
  } = useGameState();
  const [activeTab, setActiveTab] = useState<WorkbenchMode>(initialMode);

  const isHub = currentLocationId === 'opening_hub';
  const hasAll5Relics = inventory.length >= 5;

  // Khi các màn giải đố bên trong gọi setStage(...), đồng bộ sang hành động đúng của thế giới 2D
  useEffect(() => {
    if (stage === 'RETURN_SAFEZONE') {
      setStage('LOCATION_PUZZLE');
      onClose();
      if (onReturnToSafezone) {
        onReturnToSafezone();
      }
    } else if (stage === 'OLD_QUARTER_MAP') {
      setStage('LOCATION_PUZZLE');
      onClose();
      onOpenMap();
    } else if (stage === 'PRINTING_WORKSHOP') {
      setStage('LOCATION_PUZZLE');
      setActiveTab('PRINT_WORKSHOP');
    } else if (stage === 'POEM_CIPHER') {
      setStage('LOCATION_PUZZLE');
      setPoemUnlocked(true);
      setActiveTab('POEM_CIPHER');
    } else if (stage === 'EPILOGUE') {
      setStage('LOCATION_PUZZLE');
      setPoemUnlocked(true);
      setEpilogueUnlocked(true);
      setActiveTab('EPILOGUE');
    }
  }, [stage, setStage, onClose, onOpenMap, onReturnToSafezone, setPoemUnlocked, setEpilogueUnlocked]);

  const currentLoc =
    LOCATIONS_DATA.find((l) => l.id === currentLocationId) || LOCATIONS_DATA[0];

  const getHeaderInfo = () => {
    if (isHub || activeTab !== 'CURRENT_TASK') {
      if (activeTab === 'INSPECT_TIGER') {
        return {
          title: 'Khu Mở Đầu • Tranh Ngũ Hổ Hàng Trống (Bản Chính)',
          subtitle: 'Chiêm ngưỡng 5 Thần Hổ theo Ngũ Phương – Ngũ Hành để khám phá manh mối dẫn lối tới 5 phường nghề Thăng Long',
        };
      }
      if (activeTab === 'PRINT_WORKSHOP') {
        return {
          title: 'Bàn In Tranh Hàng Trống • Khôi Phục Bản In Cổ',
          subtitle: 'Sử dụng 5 đạo cụ Ngũ Hành đã thu thập để in bức tranh và làm hiện lên bài thơ 8 câu',
        };
      }
      if (activeTab === 'POEM_CIPHER') {
        return {
          title: 'Giải Mã Bài Thơ Cổ & Tọa Độ Bốn Phương',
          subtitle: 'Tìm 4 từ khóa phương hướng và bước theo lộ trình giải mã để mở lối tới Hồ Lục Thủy',
        };
      }
      if (activeTab === 'EPILOGUE') {
        return {
          title: 'Lý Ngư Vọng Nguyệt • Hoàn Tất Tuyến Phụ Tranh Hàng Trống',
          subtitle: 'Ánh trăng đáy hồ soi tỏ bức tranh cá chép trông trăng cổ truyền',
        };
      }
    }

    switch (currentLocationId) {
      case 'xuan_phien_thi':
        return {
          title: 'Bàn Chế Tác • Đình Xuân Phiến Thị',
          subtitle: 'Sắp xếp và lật 5 chiếc quạt nan tre để khớp bức họa — Nhận đạo cụ Giấy Dó',
        };
      case 'ma_vi':
        return {
          title: 'Bàn Sổ Phục Sức • Hiệu Phục Sức Mã Vĩ',
          subtitle: 'Đối chiếu sổ sách và chỉnh lại mũ, giáp, đạo cụ cho 3 vai tuồng cổ — Nhận Mực Tàu',
        };
      case 'hang_trong':
        return {
          title: 'Bàn Khắc Mộc Bản • Xưởng Tranh Hàng Trống',
          subtitle: 'So sánh bản in thử và bản gốc để phát hiện 3 chi tiết khắc lệch — Nhận Ván Khắc Gỗ',
        };
      case 'hang_gai':
        return {
          title: 'Bàn Pha Chế Sắc Tố • Hiệu Tơ Lụa Hàng Gai',
          subtitle: 'Pha 3 màu cơ bản theo sổ cổ để nhuộm 3 dải lụa — Nhận Phẩm Màu',
        };
      case 'dong_huong':
        return {
          title: 'Bệ Thờ Ngũ Hành • Đình Đông Hương',
          subtitle: 'Đặt các đạo cụ lên 5 bệ thờ tương ứng để mở tráp cổ — Nhận Bút Lông',
        };
      default:
        return {
          title: `${currentLoc.name} • ${currentLoc.atmosphere}`,
          subtitle: 'Khám phá phố phường và lắng nghe câu chuyện người dân Thăng Long xưa',
        };
    }
  };

  const renderLocationContent = () => {
    switch (currentLocationId) {
      case 'xuan_phien_thi':
        return <PuzzleXuanPhienThi />;
      case 'ma_vi':
        return <PuzzleMaVi />;
      case 'hang_trong':
        return <PuzzleHangTrong />;
      case 'hang_gai':
        return <PuzzleHangGai />;
      case 'dong_huong':
        return <PuzzleDongHuong />;
      default:
        return (
          <div className="p-6 bg-dopaper-texture wood-frame rounded-lg text-center max-w-2xl mx-auto my-4">
            <span className="text-xs font-serif font-bold text-stone-600 uppercase tracking-widest block mb-1">
              Phố Phường Thăng Long • {currentLoc.atmosphere}
            </span>
            <h3 className="text-xl font-bold font-serif text-[#b91c1c] mb-3">
              {currentLoc.name}
            </h3>
            <p className="text-xs sm:text-sm font-serif text-stone-700 italic mb-4">
              "{currentLoc.description}"
            </p>
            <div className="p-4 bg-amber-100/80 border border-amber-400 rounded text-xs sm:text-sm font-serif text-stone-800 space-y-2 mb-4 text-left">
              {currentLoc.dialogue.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs font-serif text-stone-700 mb-5 text-left">
              <strong>Tư liệu lịch sử:</strong> {currentLoc.historyText}
            </div>
            <button
              onClick={() => {
                sounds.playWoodClop();
                onClose();
                onOpenMap();
              }}
              className="px-5 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 text-xs sm:text-sm font-serif font-bold rounded shadow transition inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Mở Bản Đồ Để Dịch Chuyển Tới Địa Điểm Khác</span>
            </button>
          </div>
        );
    }
  };

  const renderPrintWorkshopOrGate = () => {
    if (!hasAll5Relics) {
      return (
        <div className="p-6 bg-dopaper-texture wood-frame rounded-lg text-center max-w-2xl mx-auto my-6">
          <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-[#b91c1c] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 text-[#b91c1c]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold font-serif text-[#b91c1c] mb-2">
            Chưa Đủ 5 Đạo Cụ Để In Tranh ({inventory.length}/5)
          </h3>
          <p className="text-xs sm:text-sm font-serif text-stone-700 mb-4 leading-relaxed">
            Để tiến hành 5 bước khôi phục bản in cổ Hàng Trống, bạn cần thu thập đủ 5 vật phẩm từ các địa điểm trên Bản Đồ Cổ:
            <strong> Giấy Dó</strong>, <strong>Mực Tàu</strong>,{' '}
            <strong>Ván Khắc Gỗ</strong>, <strong>Phẩm Màu</strong> và{' '}
            <strong>Bút Lông</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {[
              { id: 'giay_do', label: '1. Giấy Dó' },
              { id: 'muc_tau', label: '2. Mực Tàu' },
              { id: 'van_khac', label: '3. Ván Khắc Gỗ' },
              { id: 'pham_mau', label: '4. Phẩm Màu' },
              { id: 'but_long', label: '5. Bút Lông' },
            ].map((item) => {
              const collected = inventory.includes(item.id as any);
              return (
                <span
                  key={item.id}
                  className={`px-3 py-1 rounded text-xs font-serif border ${
                    collected
                      ? 'bg-emerald-900 text-emerald-100 border-emerald-500 font-bold'
                      : 'bg-stone-200 text-stone-700 border-stone-400'
                  }`}
                >
                  {collected ? '✓ ' : '○ '}
                  {item.label}
                </span>
              );
            })}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                sounds.playWoodClop();
                onClose();
                onOpenMap();
              }}
              className="px-5 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 text-xs sm:text-sm font-serif font-bold rounded shadow-lg transition inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>Mở Bản Đồ Cổ Để Dịch Chuyển Đi Thu Thập Đạo Cụ</span>
            </button>
          </div>
        </div>
      );
    }

    return <Stage4_PrintingWorkshop />;
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 animate-fadeIn">
      {/* Thanh tiêu đề theo đúng địa điểm đang đứng */}
      <div className="w-full max-w-5xl bg-[#1f1a16] border-2 border-[#b8894a] rounded-t-lg p-3 flex flex-wrap items-center justify-between gap-2 shadow-xl sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Hammer className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <h2 className="text-sm sm:text-base font-bold font-serif text-amber-200 uppercase">
              {headerInfo.title}
            </h2>
            <p className="text-[11px] text-stone-400 font-serif">
              {headerInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Ở Khu Mở Đầu hoặc khi đang trong luồng In Tranh -> Giải Thơ -> Kết Cục */}
          {(isHub || activeTab !== 'CURRENT_TASK') && (
            <>
              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('INSPECT_TIGER');
                }}
                className={`px-2.5 py-1 rounded text-xs font-serif font-bold flex items-center gap-1 transition ${
                  activeTab === 'INSPECT_TIGER'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Soi Tranh Ngũ Hổ ({discoveredAnomalies.length}/5)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  setActiveTab('PRINT_WORKSHOP');
                }}
                className={`px-2.5 py-1 rounded text-xs font-serif font-bold flex items-center gap-1 transition ${
                  activeTab === 'PRINT_WORKSHOP'
                    ? 'bg-amber-500 text-stone-950'
                    : hasAll5Relics
                    ? 'bg-emerald-900 text-emerald-100 border border-emerald-500 hover:bg-emerald-800'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}
              >
                {hasAll5Relics ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                <span>In Tranh ({inventory.length}/5 đạo cụ)</span>
              </button>

              {poemUnlocked && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('POEM_CIPHER');
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-serif font-bold flex items-center gap-1 transition ${
                    activeTab === 'POEM_CIPHER'
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Giải Mã Thơ</span>
                </button>
              )}

              {epilogueUnlocked && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab('EPILOGUE');
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-serif font-bold flex items-center gap-1 transition ${
                    activeTab === 'EPILOGUE'
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 text-amber-200 hover:bg-stone-700'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Lý Ngư Vọng Nguyệt</span>
                </button>
              )}
            </>
          )}

          <button
            onClick={() => {
              sounds.playWoodClop();
              onClose();
              onOpenMap();
            }}
            className="px-2.5 py-1 rounded bg-[#2d241c] hover:bg-[#3d3126] border border-amber-400/80 text-amber-200 text-xs font-serif font-bold flex items-center gap-1 transition"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Bản Đồ Dịch Chuyển</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="ml-1 p-1.5 rounded bg-[#b91c1c] hover:bg-[#991b1b] text-white transition"
            title="Đóng (ESC)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nội dung tương tác chính */}
      <div className="w-full max-w-5xl bg-[#161310]/95 border-x-2 border-b-2 border-[#b8894a] rounded-b-lg p-2 sm:p-4 shadow-2xl">
        {activeTab === 'INSPECT_TIGER' && <Stage1_InspectTiger />}
        {activeTab === 'CURRENT_TASK' && renderLocationContent()}
        {activeTab === 'PRINT_WORKSHOP' && renderPrintWorkshopOrGate()}
        {activeTab === 'POEM_CIPHER' && <Stage5_PoemCipher />}
        {activeTab === 'EPILOGUE' && <Stage6_Epilogue />}
      </div>
    </div>
  );
};
