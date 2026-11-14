import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { TIGER_ANOMALIES } from '../../data/tigerAnomalies';
import { TigerAnomaly } from '../../types/game';
import { sounds } from '../../utils/soundEngine';
import { Search, Compass, CheckCircle, Sparkles, ArrowRight, Info, ShieldAlert } from 'lucide-react';

export const Stage1_InspectTiger: React.FC = () => {
  const { discoveredAnomalies, discoverAnomaly, setStage } = useGameState();
  const [selectedTiger, setSelectedTiger] = useState<TigerAnomaly | null>(null);
  const [hoveredTiger, setHoveredTiger] = useState<TigerAnomaly | null>(null);
  const [showCompleteBanner, setShowCompleteBanner] = useState(false);

  const handleSpotClick = (tiger: TigerAnomaly) => {
    discoverAnomaly(tiger.id);
    setSelectedTiger(tiger);
    sounds.playBell();

    if (discoveredAnomalies.length === 4 && !discoveredAnomalies.includes(tiger.id)) {
      setTimeout(() => {
        sounds.playSuccess();
        setShowCompleteBanner(true);
      }, 400);
    }
  };

  const isAllDiscovered = discoveredAnomalies.length >= 5;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-5 animate-fadeIn max-w-5xl mx-auto w-full">
      {/* Header hướng dẫn */}
      <div className="text-center mb-3 bg-dopaper-texture wood-frame p-3 sm:p-4 w-full rounded shadow-md">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Search className="w-5 h-5 text-[#b91c1c]" />
          <h2 className="text-base sm:text-xl font-bold font-serif text-[#b91c1c] uppercase tracking-wider">
            TRANH NGŨ HỔ HÀNG TRỐNG (BẢN CHÍNH)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 font-serif max-w-2xl mx-auto leading-relaxed">
          Chiêm ngưỡng kiệt tác tranh dân gian Ngũ Hổ Hàng Trống nguyên bản. Hãy nhấp vào <strong>5 vị Thần Hổ</strong> theo Ngũ Phương – Ngũ Hành để khám phá thần thái, ý nghĩa triết học và manh mối dẫn lối tới 5 phường nghề cổ truyền Thăng Long.
        </p>
        <div className="mt-2 text-xs font-serif font-bold text-amber-900 bg-amber-100/90 inline-flex items-center gap-2 px-3 py-1 rounded border border-amber-300">
          <span>Khám phá Ngũ Phương:</span>
          <strong className="text-[#b91c1c]">{discoveredAnomalies.length} / 5</strong>
          <span>Thần Hổ</span>
        </div>
      </div>

      {/* Khung tranh Ngũ Hổ Bản Chính tương tác */}
      <div className="relative w-full max-w-[476px] aspect-[1071/1305] mx-auto bg-[#1a140f] wood-frame rounded-lg shadow-2xl overflow-hidden flex items-center justify-center border-4 border-[#3e2723]">
        <div className="relative w-full h-full select-none">
          {/* Bức Tranh Ngũ Hổ Bản Chính */}
          <img
            src="./assets/ngu_ho_original.webp"
            alt="Tranh Ngũ Hổ Hàng Trống Bản Chính"
            className="w-full h-full object-contain pointer-events-none rounded shadow-md block"
          />

          {/* 5 Vị Trí Tương Tác Thần Hổ trên Tranh Bản Chính */}
          {TIGER_ANOMALIES.map((tiger) => {
            const isFound = discoveredAnomalies.includes(tiger.id);
            const isSelected = selectedTiger?.id === tiger.id;
            const isHovered = hoveredTiger?.id === tiger.id;

            return (
              <button
                key={tiger.id}
                type="button"
                onClick={() => handleSpotClick(tiger)}
                onMouseEnter={() => setHoveredTiger(tiger)}
                onMouseLeave={() => setHoveredTiger(null)}
                style={{
                  left: `${tiger.xPercent}%`,
                  top: `${tiger.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute p-1.5 sm:p-2 rounded-full cursor-pointer transition-all duration-300 transform z-20 group focus:outline-none ${
                  isSelected
                    ? 'scale-125 ring-4 ring-amber-400 bg-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                    : isFound
                    ? 'scale-105 bg-[#2d241c]/90 text-amber-200 border-2 border-amber-400/90 hover:scale-120 hover:border-amber-300 hover:shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                    : 'scale-100 bg-[#b91c1c]/90 text-amber-100 border-2 border-amber-300 hover:scale-125 animate-pulse hover:bg-[#991b1b] shadow-lg'
                }`}
                title={tiger.tigerName}
              >
                {isFound ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
                ) : (
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200" />
                )}

                {/* Nhãn tên Thần Hổ nổi khi rê chuột hoặc đang chọn */}
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded text-xs font-serif font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all z-30 border ${
                    isSelected || isHovered
                      ? 'opacity-100 bg-[#1c1612]/95 text-amber-200 border-amber-400 scale-100'
                      : 'opacity-0 scale-95'
                  }`}
                >
                  <span className="text-[11px]" style={{ color: tiger.colorCode }}>
                    ●{' '}
                  </span>
                  <span>{tiger.tigerName}</span>
                  <span className="text-[10px] text-amber-300/80 ml-1 font-normal">
                    • {tiger.element} • {tiger.direction}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bảng Chi Tiết Thần Hổ Vừa Nhấp Chọn */}
      {selectedTiger && (
        <div className="mt-3 bg-dopaper-texture wood-frame p-3 sm:p-4 rounded-lg shadow-xl w-full max-w-2xl animate-scaleUp text-stone-900 border-2 border-[#b8894a]">
          <div className="flex items-center justify-between border-b border-[#b8894a]/40 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full inline-block border border-stone-800"
                style={{ backgroundColor: selectedTiger.colorCode }}
              />
              <h3 className="font-bold font-serif text-sm sm:text-base text-[#b91c1c]">
                {selectedTiger.anomalyTitle}
              </h3>
            </div>
            <span className="text-xs font-serif font-bold bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded border border-amber-400">
              {selectedTiger.direction}
            </span>
          </div>

          <div className="text-xs font-serif space-y-2 text-stone-700 leading-relaxed">
            <p>
              <strong>Thần thái trên bản chính:</strong>{' '}
              <span className="italic">{selectedTiger.anomalyDesc}</span>
            </p>
            <div className="p-2.5 bg-amber-100/80 border-l-4 border-amber-700 rounded text-stone-900">
              <p className="font-bold text-amber-900 mb-0.5">
                🧭 Manh mối suy luận phường nghề:
              </p>
              <p className="italic">{selectedTiger.deductionHint}</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-[#b8894a]/30">
            <button
              type="button"
              onClick={() => setSelectedTiger(null)}
              className="px-3 py-1.5 bg-stone-300 hover:bg-stone-400 text-stone-800 text-xs font-serif rounded transition"
            >
              Đóng Chi Tiết
            </button>
            <button
              type="button"
              onClick={() => setStage('OLD_QUARTER_MAP')}
              className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 font-serif font-bold text-xs rounded shadow flex items-center gap-1.5 transition"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Mở Bản Đồ Cổ Để Di Chuyển</span>
            </button>
          </div>
        </div>
      )}

      {/* Banner Hoàn Thành Khám Phá Cả 5 Thần Hổ */}
      {showCompleteBanner && (
        <div className="mt-3 w-full max-w-2xl bg-[#2d241c] border-2 border-amber-500 p-3 sm:p-4 rounded-lg shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn text-amber-200 font-serif">
          <div>
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              ĐÃ HIỂU RÕ Ý NGHĨA NGŨ PHƯƠNG TRÊN TRANH BẢN CHÍNH!
            </h4>
            <p className="text-xs text-stone-300 mt-0.5">
              Cả 5 vị Thần Hổ tương ứng trọn vẹn với 5 đạo cụ và 5 phường nghề cổ truyền Thăng Long. Hãy mở Bản Đồ Cổ để bắt đầu hành trình thu thập!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStage('OLD_QUARTER_MAP')}
            className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-serif font-bold rounded shadow-lg flex items-center gap-1.5 whitespace-nowrap transition"
          >
            <span>Mở Bản Đồ Cổ Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
