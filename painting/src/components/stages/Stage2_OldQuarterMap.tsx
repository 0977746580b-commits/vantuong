import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { LOCATIONS_DATA } from '../../data/locations';
import { LocationData } from '../../types/game';
import { sounds } from '../../utils/soundEngine';
import { Compass, ArrowRight, AlertCircle, Eye } from 'lucide-react';

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

export const Stage2_OldQuarterMap: React.FC = () => {
  const {
    completedLocations,
    setActiveLocation,
    setStage,
    inventory
  } = useGameState();

  const [hoveredLoc, setHoveredLoc] = useState<LocationData | null>(null);
  const [decoyAlertLoc, setDecoyAlertLoc] = useState<LocationData | null>(null);

  const handleSelectLocation = (loc: LocationData) => {
    if (loc.role === 'decoy') {
      sounds.playClick();
      setDecoyAlertLoc(loc);
    } else {
      sounds.playWoodClop();
      setActiveLocation(loc);
      setStage('LOCATION_PUZZLE');
    }
  };

  const isAllCollected = inventory.length >= 5;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn max-w-5xl mx-auto w-full">
      {/* Thanh thông tin đầu bản đồ */}
      <div className="bg-dopaper-texture wood-frame p-4 w-full rounded shadow-md mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-[#b91c1c] flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#b91c1c]" />
            HÀNG TRỐNG ĐỒNG HƯƠNG ĐỊA ĐỒ (KHU THUYÊN ẨN)
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 font-serif">
            Nhấp trực tiếp vào <strong>công trình hoặc tên phố</strong> trên bản đồ để khám phá và di chuyển.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-serif bg-amber-100 border border-amber-300 px-3 py-1.5 rounded text-amber-900 font-bold">
            Đạo cụ: {inventory.length}/5 • Đã giải: {completedLocations.length}/5
          </div>
          {isAllCollected && (
            <button
              onClick={() => setStage('PRINTING_WORKSHOP')}
              className="pulse-glow px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 font-bold text-xs rounded transition flex items-center gap-1 shadow"
            >
              <span>Vào Xưởng In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bản đồ cổ phong Thăng Long: Không mũi tên đỏ, không phân biệt giả thật */}
      <div className="relative w-full max-w-[770px] aspect-[1448/1086] mx-auto bg-[#1a140f] wood-frame rounded shadow-2xl overflow-hidden select-none border-4 border-[#3e2723] flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Ảnh bản đồ cổ gốc */}
          <img
            src="./assets/hang_trong_dia_do_map.webp"
            alt="Hàng Trống Đồng Hương Địa Đồ"
            className="w-full h-full object-contain pointer-events-none rounded shadow-md block"
          />

          {/* 10 Vùng Công Trình Tương Tác Trực Tiếp (Hotspots) - Đồng nhất hoàn toàn */}
          {LOCATIONS_DATA.map((loc) => {
            const spot = BUILDING_HOTSPOTS[loc.id] || { left: 45, top: 45, width: 15, height: 15 };

            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelectLocation(loc)}
                onMouseEnter={() => setHoveredLoc(loc)}
                onMouseLeave={() => setHoveredLoc(null)}
                style={{
                  left: `${spot.left}%`,
                  top: `${spot.top}%`,
                  width: `${spot.width}%`,
                  height: `${spot.height}%`,
                }}
                className="absolute z-10 cursor-pointer rounded-lg transition-all duration-200 group flex flex-col items-center justify-between p-1 focus:outline-none border border-transparent hover:border-amber-400/90 hover:bg-amber-400/15 hover:shadow-[0_0_18px_rgba(251,191,36,0.45)] hover:backdrop-brightness-105"
                title={loc.name}
              >
                {/* Nhãn nhỏ xuất hiện khi rê chuột */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-0.5 rounded text-[10px] sm:text-xs font-serif font-bold shadow-lg whitespace-nowrap pointer-events-none bg-[#1c1612]/95 text-amber-200 border border-amber-400/90">
                  {loc.name}
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
                  setActiveLocation(loc);
                  setStage('DECOY_LOCATION');
                }}
                className="px-3.5 py-2 bg-[#2d241c] hover:bg-[#3d3126] text-amber-200 border border-[#b8894a] text-xs sm:text-sm font-serif rounded shadow transition"
              >
                Vẫn Muốn Ghé Thăm Nơi Này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel thông tin khi hover */}
      <div className="mt-4 bg-dopaper-texture wood-frame p-4 w-full rounded shadow-md min-h-[80px] flex items-center justify-between">
        {hoveredLoc ? (
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold font-serif text-base text-[#b91c1c]">
                {hoveredLoc.name}
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-serif">
                {hoveredLoc.atmosphere}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-700 font-serif mt-1">
              {hoveredLoc.description}
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-stone-600 font-serif italic flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-amber-800" />
            <span>Rê chuột hoặc nhấp vào từng địa điểm trên bản đồ để khám phá không gian phố nghề Thăng Long...</span>
          </p>
        )}

        <div className="hidden sm:block text-right">
          <span className="text-xs font-serif text-stone-500 block">Hướng dẫn:</span>
          <span className="text-xs font-serif text-amber-900 font-bold">
            Quan sát kỹ 10 công trình trên bản đồ
          </span>
        </div>
      </div>
    </div>
  );
};
