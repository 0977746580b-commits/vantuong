import React, { useState } from 'react';
import { X, Compass, Home, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import { LOCATIONS_DATA } from '../../data/locations';
import { LocationData } from '../../types/game';
import { useGameState } from '../../context/GameStateContext';
import { sounds } from '../../utils/soundEngine';

interface FastTravelMapModalProps {
  currentLocationId: string;
  onSelectDestination: (loc: LocationData) => void;
  onReturnToHub?: () => void;
  onClose: () => void;
}

// Tọa độ và kích thước vùng công trình trên bản đồ cổ (tỷ lệ %)
interface BuildingHotspot {
  left: number;   // %
  top: number;    // %
  width: number;  // %
  height: number; // %
}

const BUILDING_HOTSPOTS: Record<string, BuildingHotspot> = {
  hang_gai: { left: 28.0, top: 10.5, width: 17.0, height: 18.0 },       // Hiệu Tơ Lụa Hàng Gai
  quan_tra: { left: 59.0, top: 8.5, width: 16.0, height: 17.0 },        // Quán Trà
  xuan_phien_thi: { left: 74.0, top: 20.5, width: 15.5, height: 17.5 },  // Đình Xuân Phiến Thị
  hang_quat: { left: 76.0, top: 38.5, width: 16.0, height: 16.5 },       // Hiệu Quạt Hàng Quạt
  dong_huong: { left: 39.0, top: 33.5, width: 22.0, height: 21.5 },      // Đình Đông Hương
  hang_trong: { left: 7.0, top: 25.0, width: 19.5, height: 21.5 },       // Xưởng Tranh Hàng Trống
  ha_vi: { left: 22.0, top: 34.5, width: 14.0, height: 17.5 },           // Đình Hà Vĩ
  hang_hom: { left: 4.0, top: 43.5, width: 18.0, height: 19.5 },         // Hiệu Đồ Sơn Hàng Hòm
  ma_vi: { left: 22.5, top: 56.0, width: 19.0, height: 22.0 },          // Hiệu Phục Sức Mã Vĩ
  nam_huong: { left: 57.0, top: 46.0, width: 16.0, height: 19.0 },       // Đình Nam Hương
};

export const FastTravelMapModal: React.FC<FastTravelMapModalProps> = ({
  currentLocationId,
  onSelectDestination,
  onReturnToHub,
  onClose,
}) => {
  const { completedLocations, inventory } = useGameState();
  const [hoveredLoc, setHoveredLoc] = useState<LocationData | null>(null);
  const [decoyAlertLoc, setDecoyAlertLoc] = useState<LocationData | null>(null);

  const handleLocationClick = (loc: LocationData) => {
    if (loc.role === 'decoy') {
      sounds.playClick();
      setDecoyAlertLoc(loc);
    } else {
      sounds.playWoodClop();
      onSelectDestination(loc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="bg-dopaper-texture wood-frame max-w-5xl w-full max-h-[95vh] overflow-y-auto rounded-lg p-3 sm:p-5 shadow-2xl relative">
        {/* Nút đóng */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-[#2d241c] hover:bg-[#3d3126] text-amber-200 border border-[#b8894a] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề Bản đồ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-[#b8894a]/50 pr-8">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#b91c1c]" />
              <h2 className="text-base sm:text-xl font-bold font-serif text-[#b91c1c] uppercase">
                Hàng Trống Đồng Hương Địa Đồ
              </h2>
            </div>
            <p className="text-xs text-stone-700 font-serif mt-0.5">
              Nhấp trực tiếp vào <strong>công trình hoặc tên phố</strong> trên bản đồ để di chuyển tới địa điểm đó.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            {onReturnToHub && (
              <button
                onClick={() => {
                  sounds.playWoodClop();
                  onReturnToHub();
                }}
                className={`px-3 py-1.5 rounded text-xs font-serif font-bold border shadow flex items-center gap-1.5 transition ${
                  currentLocationId === 'opening_hub'
                    ? 'bg-amber-400 text-stone-950 border-[#b91c1c]'
                    : 'bg-[#2d241c] hover:bg-[#3d3126] text-amber-200 border-[#b8894a]'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>
                  {currentLocationId === 'opening_hub'
                    ? 'Khu Mở Đầu (Đang ở đây)'
                    : 'Về Khu Mở Đầu'}
                </span>
              </button>
            )}

            <div className="text-xs font-serif bg-amber-900/15 border border-amber-800/30 px-3 py-1.5 rounded">
              Đạo cụ Ngũ Hành: <strong className="text-[#b91c1c]">{inventory.length}/5</strong> • Đã giải: <strong>{completedLocations.length}/5</strong>
            </div>
          </div>
        </div>

        {/* Khung Bản đồ Cổ: Không có mũi tên hay pin đỏ, công trình tương tác trực tiếp */}
        <div className="relative w-full rounded border-2 border-[#8c6239] bg-[#1a140f] overflow-hidden shadow-2xl flex items-center justify-center p-1">
          <div className="relative w-full aspect-[1448/1086] mx-auto select-none">
            {/* Ảnh bản đồ cổ gốc mới: Hàng Trống Đồng Hương Địa Đồ (Khu Thuyên Ẩn) */}
            <img
              src="./assets/hang_trong_dia_do_map.webp"
              alt="Hàng Trống Đồng Hương Địa Đồ"
              className="w-full h-full object-contain pointer-events-none rounded shadow-md block"
            />

            {/* 10 Vùng Công Trình Tương Tác Trực Tiếp (Hotspots) - Đồng nhất hoàn toàn */}
            {LOCATIONS_DATA.map((loc) => {
              const spot = BUILDING_HOTSPOTS[loc.id] || { left: 45, top: 45, width: 15, height: 15 };
              const isCurrent = loc.id === currentLocationId;

              return (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleLocationClick(loc)}
                  onMouseEnter={() => setHoveredLoc(loc)}
                  onMouseLeave={() => setHoveredLoc(null)}
                  style={{
                    left: `${spot.left}%`,
                    top: `${spot.top}%`,
                    width: `${spot.width}%`,
                    height: `${spot.height}%`,
                  }}
                  className={`absolute z-10 cursor-pointer rounded-lg transition-all duration-200 group flex flex-col items-center justify-between p-1 focus:outline-none ${
                    isCurrent
                      ? 'border-2 border-amber-500 bg-amber-500/15 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'border border-transparent hover:border-amber-400/90 hover:bg-amber-400/15 hover:shadow-[0_0_18px_rgba(251,191,36,0.45)] hover:backdrop-brightness-105'
                  }`}
                  title={loc.name}
                >
                  {/* Nhãn nhỏ xuất hiện khi hover hoặc khi đang ở vị trí này */}
                  <div
                    className={`transition-opacity duration-200 px-2 py-0.5 rounded text-[10px] sm:text-xs font-serif font-bold shadow-lg whitespace-nowrap pointer-events-none ${
                      isCurrent
                        ? 'opacity-100 bg-[#b91c1c] text-amber-200 border border-amber-400'
                        : 'opacity-0 group-hover:opacity-100 bg-[#1c1612]/95 text-amber-200 border border-amber-400/90'
                    }`}
                  >
                    {loc.name} {isCurrent ? '• Đang ở đây' : ''}
                  </div>

                  {/* Vệt sáng chân công trình khi hover */}
                  <div className="w-full h-1 bg-amber-400/0 group-hover:bg-amber-400/60 rounded-full blur-[1px] transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Thông Báo Khi Nhấp Vào Địa Điểm Giả (Decoy Notification) */}
        {decoyAlertLoc && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
            <div className="bg-dopaper-texture wood-frame border-2 border-amber-600 rounded-lg p-5 sm:p-6 max-w-lg w-full shadow-2xl relative text-stone-900 animate-scaleUp">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setDecoyAlertLoc(null);
                }}
                className="absolute top-3 right-3 text-stone-600 hover:text-stone-900 p-1.5 font-bold text-base"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-[#b91c1c] font-bold font-serif text-base sm:text-lg border-b border-[#b8894a]/40 pb-2.5 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                <span>THÔNG BÁO: {decoyAlertLoc.name}</span>
              </div>

              <div className="text-xs sm:text-sm font-serif text-stone-700 space-y-2.5 leading-relaxed">
                <p className="font-semibold text-stone-800">
                  Bối cảnh: <span className="font-normal italic">{decoyAlertLoc.description}</span>
                </p>

                <div className="bg-amber-950/10 border-l-4 border-amber-700 p-3 rounded text-stone-800 space-y-1.5 my-2">
                  <p className="font-bold text-amber-900 text-xs uppercase tracking-wide">
                    Tiếng động & Lời thoại nghe được:
                  </p>
                  {decoyAlertLoc.dialogue.map((line, idx) => (
                    <p key={idx} className="italic">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="p-2.5 bg-amber-100/90 border border-amber-400 rounded text-xs text-amber-950 font-serif">
                  ⚠️ <strong>Gợi ý hành trình:</strong> Đây là địa điểm đánh lạc hướng, không cất giấu đạo cụ phục chế tranh Ngũ Hổ. Hãy đối chiếu kỹ biểu tượng Ngũ Hành và phương vị trên tranh Ngũ Hổ bản chính để định vị 5 phường nghề truyền thống!
                </div>
              </div>

              <div className="mt-5 flex flex-wrap justify-end gap-2.5 pt-3 border-t border-[#b8894a]/30">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setDecoyAlertLoc(null);
                  }}
                  className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-serif font-bold rounded shadow transition"
                >
                  Tiếp Tục Quan Sát Bản Đồ
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playWoodClop();
                    const loc = decoyAlertLoc;
                    setDecoyAlertLoc(null);
                    onSelectDestination(loc);
                  }}
                  className="px-3.5 py-2 bg-[#2d241c] hover:bg-[#3d3126] text-amber-200 border border-[#b8894a] text-xs sm:text-sm font-serif rounded shadow transition"
                >
                  Vẫn Muốn Ghé Thăm Nơi Này
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Thanh Thông Tin Công Trình Khi Rê Chuột (Hover Info Bar) */}
        <div className="mt-3 bg-dopaper-texture wood-frame p-3 rounded shadow-md min-h-[58px] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {hoveredLoc ? (
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold font-serif text-sm sm:text-base text-[#b91c1c]">
                  {hoveredLoc.name}
                </span>
                <span className="text-[11px] font-serif bg-amber-200/90 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  {hoveredLoc.atmosphere}
                </span>
              </div>
              <p className="text-xs text-stone-700 font-serif mt-0.5">
                {hoveredLoc.description}
              </p>
            </div>
          ) : (
            <p className="text-xs text-stone-600 font-serif italic flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-800" />
              <span>Rê chuột hoặc nhấp vào bất kỳ công trình nào trên bản đồ để khám phá hoặc di chuyển...</span>
            </p>
          )}

          <div className="text-right text-[11px] font-serif text-stone-500 shrink-0">
            Phím tắt: <strong>[M]</strong> hoặc <strong>[ESC]</strong> để đóng
          </div>
        </div>
      </div>
    </div>
  );
};
