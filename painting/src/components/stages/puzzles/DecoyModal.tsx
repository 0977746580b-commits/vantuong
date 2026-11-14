import React from 'react';
import { useGameState } from '../../../context/GameStateContext';
import { sounds } from '../../../utils/soundEngine';
import { ArrowLeft, Compass, Info } from 'lucide-react';

export const DecoyModal: React.FC = () => {
  const { activeLocation, setStage } = useGameState();

  if (!activeLocation) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn max-w-2xl mx-auto w-full">
      <div className="bg-dopaper-texture wood-frame p-6 sm:p-8 rounded shadow-2xl relative w-full">
        {/* Header */}
        <div className="flex items-center gap-3 border-b-2 border-[#b8894a] pb-3 mb-4">
          <div className="p-3 bg-amber-100 rounded-full border border-amber-300 shadow">
            <Compass className="w-6 h-6 text-stone-700 animate-spin" />
          </div>
          <div>
            <span className="text-xs font-serif font-bold text-stone-600 uppercase tracking-widest">
              Góc Nhỏ Phố Cổ Thăng Long • {activeLocation.atmosphere}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#b91c1c]">
              {activeLocation.name}
            </h2>
          </div>
        </div>

        {/* Nội dung trải nghiệm & đối thoại */}
        <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed text-stone-800 mb-6">
          <p className="italic text-stone-700">
            "{activeLocation.description}"
          </p>

          <div className="p-4 bg-amber-50 rounded border border-amber-200 space-y-2 text-xs sm:text-sm">
            {activeLocation.dialogue.map((line, idx) => (
              <p key={idx} className="text-stone-800">
                {line}
              </p>
            ))}
          </div>

          <div className="p-3 bg-amber-100/60 rounded border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Lịch sử phố phường:</strong> {activeLocation.historyText}
            </div>
          </div>
        </div>

        <div className="border-t border-amber-300 pt-4 flex items-center justify-between">
          <span className="text-xs font-serif text-stone-500 italic">
            Gợi ý: Đối chiếu biểu tượng Ngũ Hành và phương vị trên tranh Ngũ Hổ bản chính để chọn đúng địa điểm.
          </span>
          <button
            onClick={() => {
              sounds.playWoodClop();
              setStage('OLD_QUARTER_MAP');
            }}
            className="flex items-center gap-2 px-5 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 font-serif font-bold text-xs sm:text-sm rounded shadow transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bản đồ</span>
          </button>
        </div>
      </div>
    </div>
  );
};
