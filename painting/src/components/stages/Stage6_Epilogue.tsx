import React, { useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { sounds } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, Heart, Share2, Award } from 'lucide-react';

export const Stage6_Epilogue: React.FC = () => {
  const { resetGame } = useGameState();

  useEffect(() => {
    sounds.playSuccess();
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(
          { type: 'VT_PIXEL_STAGE_COMPLETE', station: 'flute' },
          window.location.origin
        );
      } catch {
        // safe fallback if cross-origin
      }
    }
    // Bắn pháo hoa rực rỡ giấy ngũ sắc
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      try {
        const p1 = confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#b91c1c', '#d97706', '#059669', '#2563eb', '#f5eedb']
        });
        if (p1 && typeof p1.catch === 'function') p1.catch(() => {});

        const p2 = confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#b91c1c', '#d97706', '#059669', '#2563eb', '#f5eedb']
        });
        if (p2 && typeof p2.catch === 'function') p2.catch(() => {});
      } catch (err) {
        // Safe fallback in headless/unsupported environments
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn max-w-4xl mx-auto w-full">
      <div className="bg-dopaper-texture wood-frame p-6 sm:p-10 rounded shadow-2xl relative w-full text-center">
        {/* Con dấu triện son vinh danh */}
        <div className="cinnabar-seal text-xs px-4 py-1.5 rounded mb-3 mx-auto">
          PHỤC DỰNG DI SẢN THĂNG LONG THÀNH CÔNG
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#b91c1c] mb-2 tracking-wide">
          HỒI KẾT: LÝ NGƯ VỌNG NGUYỆT
        </h2>
        <p className="text-xs sm:text-sm text-stone-700 font-serif max-w-2xl mx-auto mb-6">
          Bóng trăng tròn đáy nước lung linh, đôi cá chép quẫy đuôi hướng về vầng nguyệt tỏ.
          Bạn đã hoàn thành xuất sắc sứ mệnh phục dựng dòng tranh truyền thống Hàng Trống!
        </p>

        {/* Tranh Lý Ngư Vọng Nguyệt nghệ thuật */}
        <div className="relative w-full max-w-sm mx-auto aspect-[1/2] bg-[#0c1829] rounded-lg wood-frame shadow-2xl overflow-hidden mb-6 flex items-center justify-center border-4 border-amber-600 p-2">
          <img
            src="./assets/stage6_ly_ngu_vong_nguyet.png"
            alt="Kiệt tác Tranh Hàng Trống: Lý Ngư Vọng Nguyệt"
            className="w-full h-full object-contain rounded drop-shadow-xl"
          />
        </div>

        {/* Thông điệp tri ân di sản */}
        <div className="p-4 bg-amber-50 rounded border border-amber-300 max-w-lg mx-auto mb-6 text-xs sm:text-sm font-serif leading-relaxed text-stone-800">
          <p className="font-bold text-[#b91c1c] mb-1">
            Triết lý di sản Tranh Dân Gian Hàng Trống:
          </p>
          <p className="italic text-stone-700">
            "Có những điều nếu không được viết lại thì sẽ dễ bị lãng quên. Vì vậy, người ta dùng giấy để lưu giữ chúng, để nhiều năm sau vẫn có người biết đến... Dù lớp mực có phai, dấu vết vẫn còn nằm lại trên gỗ."
          </p>
        </div>

        <button
          onClick={resetGame}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-serif font-bold text-sm sm:text-base rounded shadow-lg transition transform hover:-translate-y-0.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Bắt Đầu Lại Hành Trình</span>
        </button>
      </div>
    </div>
  );
};
