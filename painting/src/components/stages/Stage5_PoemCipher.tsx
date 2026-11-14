import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { sounds } from '../../utils/soundEngine';
import { Compass, CheckCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';

export const Stage5_PoemCipher: React.FC = () => {
  const { setStage } = useGameState();

  // Chuỗi hướng mục tiêu dựa trên bài thơ:
  // 1. Mây (Bắc)
  // 2. Gió (Đông)
  // 3. Nước (Tây)
  // 4. Lửa (Nam)
  // 5. Gió (Đông)
  // 6. Mây (Bắc)
  const targetDirections = ['Bắc', 'Đông', 'Tây', 'Nam', 'Đông', 'Bắc'];

  // Trạng thái bước di chuyển của người chơi
  const [currentStep, setCurrentStep] = useState(0);
  const [playerPath, setPlayerPath] = useState<string[]>([]);
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 2, y: 3 }); // Xuất phát ở (2, 3)
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Xử lý khi người chơi bấm nút la bàn
  const handleMove = (direction: 'Bắc' | 'Nam' | 'Đông' | 'Tây') => {
    sounds.playWoodClop();
    setErrorMessage(null);
    const expected = targetDirections[currentStep];

    if (direction === expected) {
      sounds.playBell();
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setPlayerPath(prev => [...prev, direction]);

      // Cập nhật vị trí tọa độ
      setPlayerPos(prev => {
        let { x, y } = prev;
        if (direction === 'Bắc') y -= 1;
        if (direction === 'Nam') y += 1;
        if (direction === 'Đông') x += 1;
        if (direction === 'Tây') x -= 1;
        return { x: Math.max(0, Math.min(4, x)), y: Math.max(0, Math.min(4, y)) };
      });

      if (nextStep === 6) {
        sounds.playSuccess();
        setIsSuccess(true);
      }
    } else {
      // Đi sai hướng
      setErrorMessage(`Sai phương hướng! Bạn vừa đi hướng ${direction}, nhưng câu thơ gợi ý một hướng khác. Hãy đọc kỹ thứ tự từ khóa!`);
      // Reset lại bước đi
      setCurrentStep(0);
      setPlayerPath([]);
      setPlayerPos({ x: 2, y: 3 });
    }
  };

  const handleReset = () => {
    sounds.playClick();
    setErrorMessage(null);
    setCurrentStep(0);
    setPlayerPath([]);
    setPlayerPos({ x: 2, y: 3 });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="bg-dopaper-texture wood-frame p-4 w-full rounded shadow-md mb-4 text-center">
        <span className="text-xs font-serif font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded border border-amber-300">
          Nhiệm Vụ 02: Giải Mã Tọa Độ & Phương Vị Bát Quái
        </span>
        <h2 className="text-lg sm:text-xl font-bold font-serif text-[#b91c1c] mt-1">
          BÀI THƠ CỔ & CHUỖI ĐIỀU HƯỚNG 6 BƯỚC
        </h2>
        <p className="text-xs sm:text-sm text-stone-700 font-serif max-w-2xl mx-auto">
          Dựa vào các từ khóa thiên nhiên trong bài thơ để quy đổi ra 4 hướng:
          <strong> Mây (Bắc ↑), Gió (Đông →), Nước (Tây ←), Lửa (Nam ↓)</strong>.
          Hãy bấm La Bàn theo đúng thứ tự xuất hiện của các từ khóa trong thơ!
        </p>
      </div>

      {errorMessage && (
        <div className="w-full p-2.5 mb-3 bg-red-100 border border-red-400 text-red-900 rounded font-serif text-xs text-center animate-fadeIn">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
        {/* Bài thơ cổ */}
        <div className="p-4 rounded-lg wood-frame bg-dopaper-texture flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-xs text-amber-900 border-b border-amber-300 pb-1 mb-3 uppercase tracking-wider text-center">
              BÀI THƠ KHẮC TRÊN BẢN MỘC
            </h3>

            <div className="space-y-2 text-xs sm:text-sm font-serif leading-relaxed text-stone-800 text-center italic">
              <p className={currentStep === 0 ? 'font-bold text-[#b91c1c] bg-amber-200/60 p-1 rounded' : ''}>
                1. Trên mái đình xưa, áng <strong className="text-blue-700 underline">mây</strong> bạc lững lờ,
              </p>
              <p className={currentStep === 1 ? 'font-bold text-[#b91c1c] bg-amber-200/60 p-1 rounded' : ''}>
                2. Tiếng sáo ai đưa theo ngọn <strong className="text-emerald-700 underline">gió</strong> bơ vơ.
              </p>
              <p className={currentStep === 2 ? 'font-bold text-[#b91c1c] bg-amber-200/60 p-1 rounded' : ''}>
                3. Dòng sông in bóng trăng, <strong className="text-cyan-700 underline">nước</strong> trôi về bến cũ,
              </p>
              <p className={currentStep === 3 ? 'font-bold text-[#b91c1c] bg-amber-200/60 p-1 rounded' : ''}>
                4. Trong đêm tàn, ánh <strong className="text-red-700 underline">lửa</strong> vẫn âm thầm chờ.
              </p>
              <p className={currentStep === 4 ? 'font-bold text-[#b91c1c] bg-amber-200/60 p-1 rounded' : ''}>
                5. Hiên nhà vắng, tiếng <strong className="text-emerald-700 underline">gió</strong> luồn qua khe cửa,
              </p>
              <p className={currentStep === 5 ? 'font-bold text-[#b91c1c] bg-amber-200/60 p-1 rounded' : ''}>
                6. Rêu phủ mái ngói, <strong className="text-blue-700 underline">mây</strong> trắng khuất lưng đồi.
              </p>
              <div className="pt-2 text-stone-500 text-xs">
                <p>Khi canh khuya buông xuống, vạn vật chìm trong tĩnh lặng,</p>
                <p className="font-bold text-[#b91c1c] text-xs sm:text-sm mt-1">
                  Cá chép ngước nhìn trăng, bóng nguyệt tròn in đáy nước.
                </p>
              </div>
            </div>
          </div>

          {/* Bảng quy ước phương hướng */}
          <div className="mt-4 p-2.5 bg-amber-100/70 rounded border border-amber-300 text-[11px] font-serif grid grid-cols-2 gap-1 text-center">
            <div>☁️ <strong>Mây</strong>: Hướng BẮC (↑)</div>
            <div>💨 <strong>Gió</strong>: Hướng ĐÔNG (→)</div>
            <div>🌊 <strong>Nước</strong>: Hướng TÂY (←)</div>
            <div>🔥 <strong>Lửa</strong>: Hướng NAM (↓)</div>
          </div>
        </div>

        {/* La Bàn & Bàn cờ tọa độ 5x5 */}
        <div className="p-4 rounded-lg wood-frame bg-[#231d18] text-amber-100 flex flex-col items-center justify-between">
          <div className="text-center w-full">
            <h3 className="font-serif font-bold text-xs text-amber-300 mb-1 uppercase tracking-wider">
              BÀN CỜ ĐIỀU HƯỚNG TỌA ĐỘ
            </h3>
            <span className="text-[11px] text-stone-400 font-serif">
              Tiến độ: {currentStep} / 6 bước (Đã đi: {playerPath.join(' ➔ ') || 'Chưa xuất phát'})
            </span>
          </div>

          {/* Lưới tọa độ bàn cờ 5x5 */}
          <div className="grid grid-cols-5 gap-1.5 p-3 bg-[#171310] rounded-lg border border-[#b8894a] my-3">
            {Array.from({ length: 25 }).map((_, i) => {
              const x = i % 5;
              const y = Math.floor(i / 5);
              const isPlayer = playerPos.x === x && playerPos.y === y;
              const isStart = x === 2 && y === 3;
              const isGoal = x === 3 && y === 1;

              return (
                <div
                  key={i}
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded border flex items-center justify-center text-xs font-serif transition-all ${
                    isPlayer
                      ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 ring-4 ring-amber-400/50 scale-110 z-10'
                      : isGoal
                      ? 'bg-blue-950 border-cyan-400 text-cyan-300 animate-pulse font-bold'
                      : isStart
                      ? 'bg-amber-950/80 border-amber-700 text-amber-500'
                      : 'bg-[#2a231d] border-stone-800 text-stone-600'
                  }`}
                >
                  {isPlayer ? '🚶' : isGoal ? '🌕' : isStart ? '🚩' : ''}
                </div>
              );
            })}
          </div>

          {/* La Bàn 4 Nút Điều Hướng */}
          <div className="flex flex-col items-center gap-1.5 my-2">
            <button
              onClick={() => handleMove('Bắc')}
              disabled={isSuccess}
              className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded font-serif text-xs font-bold transition flex items-center gap-1 shadow"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>BẮC (Mây)</span>
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => handleMove('Tây')}
                disabled={isSuccess}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded font-serif text-xs font-bold transition flex items-center gap-1 shadow"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>TÂY (Nước)</span>
              </button>

              <div className="p-2 bg-stone-900 border border-amber-600 rounded-full text-amber-400">
                <Compass className="w-5 h-5 animate-spin" />
              </div>

              <button
                onClick={() => handleMove('Đông')}
                disabled={isSuccess}
                className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded font-serif text-xs font-bold transition flex items-center gap-1 shadow"
              >
                <span>ĐÔNG (Gió)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => handleMove('Nam')}
              disabled={isSuccess}
              className="px-4 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded font-serif text-xs font-bold transition flex items-center gap-1 shadow"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>NAM (Lửa)</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="text-[11px] text-stone-400 hover:text-amber-200 font-serif flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Đi lại từ đầu</span>
          </button>
        </div>
      </div>

      {/* Thông báo kết quả khi giải xong */}
      {isSuccess && (
        <div className="p-5 bg-emerald-100/95 border-2 border-emerald-500 rounded-lg text-center max-w-lg w-full animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-center gap-2 text-emerald-950 font-bold font-serif text-base mb-1">
            <CheckCircle className="w-6 h-6 text-emerald-700" />
            <span>GIẢI MÃ HOÀN TẤT CHUỖI TỌA ĐỘ BÁT QUÁI!</span>
          </div>
          <p className="text-xs sm:text-sm font-serif text-emerald-950 mb-4">
            Bước chân cuối cùng đưa bạn tới mặt hồ tĩnh lặng, nơi ánh trăng tròn tỏa bóng lung linh và bóng cá chép từ từ hiển hiện dưới đáy nước!
          </p>
          <button
            onClick={() => setStage('EPILOGUE')}
            className="pulse-glow px-6 py-3 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-serif font-bold text-sm sm:text-base rounded shadow-2xl transition flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Chiêm Ngưỡng Kiệt Tác "Lý Ngư Vọng Nguyệt"</span>
            <span>➔</span>
          </button>
        </div>
      )}
    </div>
  );
};
