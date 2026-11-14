import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

export type ElderNpcState = 'sit_idle' | 'sit_talk' | 'sit_think' | 'stand_idle' | 'walk';

interface ElderNpcProps {
  x: number; // Tọa độ ngang theo % chiều rộng phòng (0 - 100)
  y?: number; // Tọa độ dọc theo % chiều cao phòng
  bottomPercent?: number; // Tọa độ đáy sàn % (chuẩn theo PixelCharacter)
  heightPercent?: number; // Chiều cao tỷ lệ % theo bối cảnh (mặc định: ngồi ~22.5%, đứng ~27.5%)
  state?: ElderNpcState;
  facing?: 'left' | 'right';
  scale?: number;
  nameTag?: string;
  subTitle?: string;
  isNear?: boolean;
  isTalking?: boolean;
  onClick?: () => void;
  showChair?: boolean;
  showWorkTable?: boolean;
}

export const ElderNpc: React.FC<ElderNpcProps> = ({
  x,
  y,
  bottomPercent = 12,
  heightPercent,
  state = 'sit_idle',
  facing = 'right',
  scale = 1,
  nameTag = 'Bác Nghệ Nhân Già',
  subTitle,
  isNear = false,
  isTalking = false,
  onClick,
  showChair = false,
  showWorkTable = false,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);

  // Tính vị trí bottom chuẩn xác trên sàn (đồng bộ cùng PixelCharacter)
  const effectiveBottom = bottomPercent !== undefined ? bottomPercent : y !== undefined ? 100 - y : 12;

  // Quyết định state hiện thời: nếu đang nói chuyện thì chuyển sang sit_talk hoặc stand_idle
  const activeState: ElderNpcState = isTalking
    ? state === 'stand_idle' || state === 'walk'
      ? 'stand_idle'
      : 'sit_talk'
    : state;

  const isSitting = activeState.startsWith('sit');

  // Chiều cao tự nhiên theo bối cảnh: người đứng ~27.5% (tương quan hoàn hảo với player 28.5%), người ngồi ~22.5%
  const defaultHeight = isSitting ? 22.5 : 27.5;
  const effectiveHeight = heightPercent !== undefined ? heightPercent : defaultHeight;

  useEffect(() => {
    let maxFrames = 4;
    let intervalMs = 350;

    if (activeState === 'walk') {
      maxFrames = 8;
      intervalMs = 180;
    } else if (activeState === 'sit_talk') {
      maxFrames = 4;
      intervalMs = 280;
    } else if (activeState === 'sit_think') {
      maxFrames = 4;
      intervalMs = 450;
    } else {
      maxFrames = 4;
      intervalMs = 400;
    }

    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % maxFrames);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [activeState]);

  // Lấy đường dẫn hình ảnh frame tương ứng
  const getFrameSrc = (): string => {
    const f = frameIndex + 1;
    switch (activeState) {
      case 'walk':
        return `./assets/npc_elder_walk_${Math.min(f, 8)}.webp`;
      case 'sit_talk':
        return `./assets/npc_elder_sit_talk_${Math.min(f, 4)}.webp`;
      case 'sit_think':
        return `./assets/npc_elder_sit_think_${Math.min(f, 4)}.webp`;
      case 'stand_idle':
        return `./assets/npc_elder_stand_idle_${Math.min(f, 4)}.webp`;
      case 'sit_idle':
      default:
        return `./assets/npc_elder_sit_idle_${Math.min(f, 4)}.webp`;
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        left: `${x}%`,
        bottom: `${effectiveBottom}%`,
        height: `${effectiveHeight}%`,
        transform: `translate(-50%, 0) scale(${scale})`,
        transformOrigin: 'bottom center',
      }}
      className={`absolute z-20 flex flex-col items-center select-none cursor-pointer group transition-all duration-150 ${
        onClick ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      {/* Name tag & Nút tương tác [E] định vị nổi phía trên đỉnh đầu */}
      <div className="absolute bottom-[102%] mb-1 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none whitespace-nowrap z-30">
        {isNear && (
          <span className="px-2 py-0.5 rounded font-serif text-[11px] font-bold shadow-xl flex items-center gap-1 bg-[#1a1410] border-2 border-amber-400 text-amber-200 animate-pulse mb-1">
            <MessageSquare className="w-3 h-3 text-amber-400" />
            <span>[E] Trò Chuyện</span>
          </span>
        )}

        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 border border-amber-500/80 text-[10px] font-serif font-bold text-amber-200 shadow-md">
          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
          <span>{nameTag}</span>
          {subTitle && (
            <span className="text-[9px] text-stone-300 font-normal border-l border-stone-600 pl-1 ml-0.5">
              {subTitle}
            </span>
          )}
        </div>
      </div>

      {/* Bóng đổ tiếp xúc mặt sàn đá */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 rounded-full blur-[1px] pointer-events-none"
        style={{ width: isSitting ? '50%' : '38%', height: '5%' }}
      />

      {/* Vùng chứa Sprite và Phụ Kiện (Co giãn 100% theo chiều cao bối cảnh) */}
      <div className="relative h-full flex items-end justify-center">
        {/* Ghế gỗ phía sau nếu đang ngồi */}
        {showChair && isSitting && (
          <img
            src="./assets/npc_elder_prop_chair.webp"
            alt="Ghế gỗ"
            className="absolute bottom-0 -left-[18%] h-[78%] w-auto object-contain pointer-events-none opacity-95"
            style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'none' }}
          />
        )}

        {/* Nhân vật Bác Nghệ Nhân Già */}
        <div
          className="relative h-full flex items-end justify-center transition-transform duration-100"
          style={{
            transform: facing === 'left' ? 'scaleX(-1)' : 'none',
          }}
        >
          <img
            src={getFrameSrc()}
            alt={nameTag}
            className="h-full w-auto object-contain pixelated drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)] group-hover:brightness-110 transition-all"
            draggable={false}
          />
        </div>

        {/* Bàn làm việc có đèn dầu, sách, bút */}
        {showWorkTable && (
          <img
            src="./assets/npc_elder_prop_table.webp"
            alt="Bàn làm việc"
            className={`absolute bottom-0 ${
              facing === 'right' ? '-right-[65%]' : '-left-[65%]'
            } h-[85%] w-auto object-contain pointer-events-none drop-shadow-md`}
            style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'none' }}
          />
        )}
      </div>
    </div>
  );
};
