import React, { useEffect, useState } from 'react';

export type CharacterAction =
  | 'idle'
  | 'walk'
  | 'inspect'
  | 'note'
  | 'lantern'
  | 'work'
  | 'look_up'
  | 'crouch'
  | 'surprise';

interface PixelCharacterProps {
  x: number; // Tọa độ ngang (% từ 6% đến 94%)
  facing: 'left' | 'right';
  isMoving: boolean;
  action?: CharacterAction;
  bottomPercent?: number; // Cao độ tiếp đất (% từ đáy màn hình)
  heightPercent?: number; // Chiều cao tỷ lệ % theo bối cảnh
}

const ALL_SPRITES = [
  './assets/sprites/idle_0.png',
  './assets/sprites/idle_1.png',
  './assets/sprites/walk_0.png',
  './assets/sprites/walk_1.png',
  './assets/sprites/walk_2.png',
  './assets/sprites/walk_3.png',
  './assets/sprites/inspect.png',
  './assets/sprites/note_0.png',
  './assets/sprites/note_1.png',
  './assets/sprites/lantern_walk.png',
  './assets/sprites/lantern_up.png',
  './assets/sprites/work_0.png',
  './assets/sprites/work_1.png',
  './assets/sprites/look_up.png',
  './assets/sprites/crouch_pick.png',
  './assets/sprites/surprise.png',
];

export const PixelCharacter: React.FC<PixelCharacterProps> = ({
  x,
  facing,
  isMoving,
  action = 'idle',
  bottomPercent,
  heightPercent,
}) => {
  const [frameIndex, setFrameIndex] = useState(0);

  // Preload toàn bộ ảnh sprite để không bị trễ khung hình khi chuyển trạng thái
  useEffect(() => {
    ALL_SPRITES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Nhịp chuyển frame mượt mà
  useEffect(() => {
    setFrameIndex(0);
    let intervalMs = 650;
    if (isMoving || action === 'walk') {
      intervalMs = 120; // 4 bước chân nhịp nhàng
    } else if (action === 'work') {
      intervalMs = 320;
    }

    const timer = setInterval(() => {
      setFrameIndex((prev) => prev + 1);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isMoving, action]);

  const getSpriteSrc = (): string => {
    if (isMoving || action === 'walk') {
      const walkFrames = [
        './assets/sprites/walk_0.png',
        './assets/sprites/walk_1.png',
        './assets/sprites/walk_2.png',
        './assets/sprites/walk_3.png',
      ];
      return walkFrames[frameIndex % walkFrames.length];
    }

    switch (action) {
      case 'inspect':
        return './assets/sprites/inspect.png';
      case 'note':
        return frameIndex % 2 === 0
          ? './assets/sprites/note_0.png'
          : './assets/sprites/note_1.png';
      case 'lantern':
        return frameIndex % 2 === 0
          ? './assets/sprites/lantern_up.png'
          : './assets/sprites/lantern_walk.png';
      case 'work':
        return frameIndex % 2 === 0
          ? './assets/sprites/work_0.png'
          : './assets/sprites/work_1.png';
      case 'look_up':
        return './assets/sprites/look_up.png';
      case 'crouch':
        return './assets/sprites/crouch_pick.png';
      case 'surprise':
        return './assets/sprites/surprise.png';
      case 'idle':
      default: {
        const idleSeq = [
          './assets/sprites/idle_0.png',
          './assets/sprites/idle_0.png',
          './assets/sprites/idle_0.png',
          './assets/sprites/idle_1.png',
        ];
        return idleSeq[frameIndex % idleSeq.length];
      }
    }
  };

  return (
    <div
      className="absolute z-30 select-none pointer-events-none flex flex-col items-center"
      style={{
        left: `${x}%`,
        bottom: `${bottomPercent !== undefined ? bottomPercent : 12.5}%`,
        height: `${heightPercent !== undefined ? heightPercent : 28.5}%`, // Tỷ lệ chuẩn: cao ~28.5% bối cảnh (vừa vặn với cửa phòng, bàn ngang hông)
        aspectRatio: '314 / 320',
        transform: 'translateX(-50%)',
        willChange: 'left',
      }}
    >
      {/* Bóng đổ chuẩn tiếp xúc mặt sàn đá */}
      <div
        className="absolute bottom-[2%] left-1/2 -translate-x-1/2 bg-black/65 rounded-full blur-[1.5px]"
        style={{ width: '42%', height: '5.5%' }}
      />

      {/* Sprite Nhân Vật */}
      <div
        className="relative w-full h-full flex items-end justify-center"
        style={{
          transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
        }}
      >
        <img
          src={getSpriteSrc()}
          alt="Character Sprite"
          className="w-full h-full object-contain pixelated drop-shadow-[0_5px_6px_rgba(0,0,0,0.85)]"
          draggable={false}
        />
      </div>
    </div>
  );
};
