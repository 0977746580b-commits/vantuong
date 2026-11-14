import React, { useState } from 'react';
import { useGameState } from '../../../context/GameStateContext';
import { sounds } from '../../../utils/soundEngine';
import {
  CheckCircle,
  ArrowLeft,
  Droplets,
  Paintbrush,
  RotateCcw,
  Sparkles,
  BookOpen,
  Scroll,
  Pipette,
  Check,
} from 'lucide-react';

export const PuzzleHangGai: React.FC = () => {
  const { collectRelic, completeLocation, setStage, hasRelic } = useGameState();

  // 3 màu cơ bản: Đỏ (Red), Vàng (Yellow), Lam (Blue)
  const [drops, setDrops] = useState<{ red: number; yellow: number; blue: number }>({
    red: 0,
    yellow: 0,
    blue: 0,
  });

  // Ống nhỏ giọt đang cầm
  const [selectedPipette, setSelectedPipette] = useState<'red' | 'yellow' | 'blue' | null>(null);
  const [isStirring, setIsStirring] = useState<boolean>(false);
  const [isDyeing, setIsDyeing] = useState<number | null>(null);

  // Trạng thái mở ngăn kéo và mở tráp
  const [openedDrawer, setOpenedDrawer] = useState<boolean>(hasRelic('pham_mau'));

  // 3 dải lụa cần nhuộm màu theo công thức cổ từ GDD
  const targetSilks = [
    {
      id: 1,
      name: 'Cam Hoàng Sa (Đỏ Son + Vàng Quỳ)',
      pattern: 'Họa tiết Sóng Nước & Cánh Đào',
      colorCode: '#ea580c',
      recipe: { red: 1, yellow: 1, blue: 0 },
      hint: 'Pha 1 giọt Đỏ Son + 1 giọt Vàng Quỳ',
    },
    {
      id: 2,
      name: 'Lục Thủy Ngọc (Vàng Quỳ + Lam Chàm)',
      pattern: 'Họa tiết Hoa Sen Nở Dưới Nắng',
      colorCode: '#059669',
      recipe: { red: 0, yellow: 1, blue: 1 },
      hint: 'Pha 1 giọt Vàng Quỳ + 1 giọt Lam Chàm',
    },
    {
      id: 3,
      name: 'Tím Tử Đằng (Đỏ Son + Lam Chàm)',
      pattern: 'Họa tiết Mây Cổ Phương Bắc',
      colorCode: '#7c3aed',
      recipe: { red: 1, yellow: 0, blue: 1 },
      hint: 'Pha 1 giọt Đỏ Son + 1 giọt Lam Chàm',
    },
  ];

  const [completedSilks, setCompletedSilks] = useState<number[]>(
    hasRelic('pham_mau') ? [1, 2, 3] : []
  );
  const [isSolved, setIsSolved] = useState<boolean>(hasRelic('pham_mau'));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tính màu hiện tại trong chén sứ dựa vào số giọt
  const getCurrentMixColor = () => {
    const { red, yellow, blue } = drops;
    if (red === 0 && yellow === 0 && blue === 0) return '#f5edd6'; // Chén sứ men ngà
    if (red > 0 && yellow > 0 && blue === 0) return '#ea580c'; // Cam Hoàng Sa
    if (red === 0 && yellow > 0 && blue > 0) return '#059669'; // Lục Thủy Ngọc
    if (red > 0 && yellow === 0 && blue > 0) return '#7c3aed'; // Tím Tử Đằng
    if (red > 0 && yellow === 0 && blue === 0) return '#dc2626'; // Đỏ Son
    if (red === 0 && yellow > 0 && blue === 0) return '#eab308'; // Vàng Quỳ
    if (red === 0 && yellow === 0 && blue > 0) return '#2563eb'; // Lam Chàm
    return '#78350f'; // Màu nâu đục nếu pha cả 3
  };

  const getMixColorName = () => {
    const { red, yellow, blue } = drops;
    if (red === 0 && yellow === 0 && blue === 0) return 'Chén Sứ Rỗng (Men Ngà)';
    if (red > 0 && yellow > 0 && blue === 0) return 'Sắc Cam Hoàng Sa (Chuẩn)';
    if (red === 0 && yellow > 0 && blue > 0) return 'Sắc Lục Thủy Ngọc (Chuẩn)';
    if (red > 0 && yellow === 0 && blue > 0) return 'Sắc Tím Tử Đằng (Chuẩn)';
    if (red > 0 && yellow === 0 && blue === 0) return 'Sắc Đỏ Son Đơn Màu';
    if (red === 0 && yellow > 0 && blue === 0) return 'Sắc Vàng Quỳ Đơn Màu';
    if (red === 0 && yellow === 0 && blue > 0) return 'Sắc Lam Chàm Đơn Màu';
    return 'Hỗn Hợp Nâu Đục (Sai Tỉ Lệ)';
  };

  const addDrop = (color: 'red' | 'yellow' | 'blue') => {
    sounds.playClick();
    setDrops((prev) => ({
      ...prev,
      [color]: Math.min(prev[color] + 1, 2),
    }));
  };

  const handlePickPipette = (color: 'red' | 'yellow' | 'blue') => {
    sounds.playClick();
    setSelectedPipette(color);
  };

  const handleDropIntoBowl = () => {
    if (!selectedPipette) return;
    sounds.playBell();
    addDrop(selectedPipette);
    setSelectedPipette(null);
  };

  const handleStir = () => {
    sounds.playPaperRub();
    setIsStirring(true);
    setTimeout(() => {
      setIsStirring(false);
    }, 600);
  };

  const resetBowl = () => {
    sounds.playClick();
    setDrops({ red: 0, yellow: 0, blue: 0 });
    setSelectedPipette(null);
    setErrorMessage(null);
  };

  // Tô màu vào dải lụa được chọn
  const applyColorToSilk = (silkId: number) => {
    sounds.playBrushSweep();
    setIsDyeing(silkId);
    const silk = targetSilks.find((s) => s.id === silkId)!;

    const matches =
      (drops.red > 0) === (silk.recipe.red > 0) &&
      (drops.yellow > 0) === (silk.recipe.yellow > 0) &&
      (drops.blue > 0) === (silk.recipe.blue > 0);

    setTimeout(() => {
      setIsDyeing(null);
      if (matches && !completedSilks.includes(silkId)) {
        sounds.playBell();
        setErrorMessage(null);
        const updated = [...completedSilks, silkId];
        setCompletedSilks(updated);
        resetBowl();

        if (updated.length === 3) {
          sounds.playSuccess();
          setIsSolved(true);
          setOpenedDrawer(true);
          completeLocation('hang_gai');
          collectRelic('pham_mau');
        }
      } else if (!matches) {
        setErrorMessage(
          'Tỉ lệ màu pha trong chén chưa đúng với công thức dải lụa này. Hãy đối chiếu cuốn sổ công thức và thử lại!'
        );
      }
    }, 500);
  };

  const handleReturnSafezone = () => {
    sounds.playWoodClop();
    setStage('RETURN_SAFEZONE');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-5 animate-fadeIn max-w-4xl mx-auto w-full">
      {/* Header Giới thiệu Cốt Truyện GDD */}
      <div className="bg-dopaper-texture wood-frame p-3.5 sm:p-4 w-full rounded shadow-md mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-serif font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-300">
              Hiệu Tơ Lụa Hàng Gai
            </span>
            <span className="text-xs font-serif text-stone-600">Đạo cụ: Phẩm Màu Tự Nhiên</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold font-serif text-[#b91c1c] mt-1">
            BÀN PHA MÀU THỦ CÔNG & NHUỘM 3 DẢI LỤA GẤM
          </h2>
          <p className="text-xs text-stone-700 font-serif mt-0.5 italic">
            "Cửa hiệu im lìm, chỉ có tiếng gió khẽ luồn qua khe cửa... Trên bàn là cuốn sổ ghi công thức pha màu bị nhòe và 3 hộp phẩm màu cơ bản."
          </p>
        </div>

        <button
          onClick={handleReturnSafezone}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#b8894a] rounded text-xs text-amber-200 transition self-start sm:self-auto shrink-0 shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Phố Cổ</span>
        </button>
      </div>

      {errorMessage && (
        <div className="w-full p-2 mb-3 bg-red-100 border border-red-400 text-red-900 rounded font-serif text-xs text-center animate-fadeIn shadow-sm">
          {errorMessage}
        </div>
      )}

      {/* Tranh minh họa bàn pha màu & dải lụa Hàng Gai */}
      <div className="w-full bg-[#1e1915] p-2.5 rounded-lg border-2 border-amber-800 shadow-xl mb-3 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-xs font-serif font-bold text-amber-200 mb-2 px-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TRANH MINH HỌA XƯỞNG NHUỘM TƠ LỤA HÀNG GAI:</span>
          </span>
          <span className="text-[11px] text-amber-400 font-normal italic">
            Sắc tố tự nhiên & Các dải lụa gấm truyền thống
          </span>
        </div>
        <div className="w-full rounded flex items-center justify-center bg-[#120f0d] p-2 border border-amber-700/60 shadow-inner">
          <img
            src="./assets/puzzle4_hang_gai_colors_silk.png"
            alt="Xưởng nhuộm tơ lụa Hàng Gai"
            className="max-w-full max-h-[420px] w-auto h-auto object-contain rounded drop-shadow"
          />
        </div>
      </div>

      {/* Khu Vực Bàn Pha Màu & 3 Dải Lụa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full mb-3">
        {/* Cột Trái: Bàn pha màu & chén sứ */}
        <div className="p-3.5 sm:p-4 rounded-lg wood-frame bg-dopaper-texture flex flex-col items-center justify-between shadow">
          <div className="w-full text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Droplets className="w-4 h-4 text-blue-700" />
              <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-800 uppercase tracking-wider">
                CHÉN SỨ MEN NGÀ & 3 HỘP SẮC TỐ CƠ BẢN
              </h3>
            </div>
            <p className="text-[11px] text-stone-600 font-serif">
              Chọn ống nhỏ giọt lấy sắc tố rồi nhấp vào chén sứ để hòa màu
            </p>
          </div>

          {/* Chén sứ men ngà tương tác */}
          <div className="relative my-3 flex flex-col items-center">
            <button
              type="button"
              onClick={handleDropIntoBowl}
              title={
                selectedPipette
                  ? `Nhấp để nhỏ giọt sắc tố ${selectedPipette.toUpperCase()} vào chén sứ`
                  : 'Chén sứ men ngà để pha màu'
              }
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-[#8c6239] shadow-2xl flex flex-col items-center justify-center transition-all duration-300 relative cursor-pointer group ${
                selectedPipette ? 'ring-4 ring-amber-400 animate-pulse scale-105' : ''
              } ${isStirring ? 'rotate-12 scale-102' : ''}`}
              style={{
                backgroundColor: getCurrentMixColor(),
                boxShadow: 'inset 0 4px 14px rgba(0,0,0,0.4), 0 8px 18px rgba(0,0,0,0.3)',
              }}
            >
              {selectedPipette && (
                <div className="absolute -top-3 bg-amber-400 text-stone-950 font-serif font-bold text-[10px] px-2 py-0.5 rounded shadow-lg animate-bounce">
                  Nhấp vào chén để nhỏ giọt!
                </div>
              )}

              <div className="text-[11px] font-bold font-serif bg-black/75 text-amber-200 px-2 py-0.5 rounded shadow">
                {getMixColorName()}
              </div>
              <div className="text-[10px] text-white/95 font-sans mt-1 bg-black/60 px-1.5 py-0.5 rounded">
                Đỏ: {drops.red} | Vàng: {drops.yellow} | Lam: {drops.blue}
              </div>
            </button>
          </div>

          {/* 3 Lọ sắc tố cơ bản & ống nhỏ giọt */}
          <div className="w-full space-y-2">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  handlePickPipette('red');
                  addDrop('red');
                }}
                className={`px-2 py-2 text-white rounded font-serif text-[11px] font-bold shadow transition flex flex-col items-center gap-1 active:scale-95 ${
                  selectedPipette === 'red'
                    ? 'bg-red-800 ring-2 ring-white scale-105'
                    : 'bg-red-700 hover:bg-red-800'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Pipette className="w-3.5 h-3.5 text-red-300" />
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400 border border-white" />
                </div>
                <span>+ Đỏ Son</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handlePickPipette('yellow');
                  addDrop('yellow');
                }}
                className={`px-2 py-2 text-stone-950 rounded font-serif text-[11px] font-bold shadow transition flex flex-col items-center gap-1 active:scale-95 ${
                  selectedPipette === 'yellow'
                    ? 'bg-amber-400 ring-2 ring-black scale-105'
                    : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Pipette className="w-3.5 h-3.5 text-amber-900" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-200 border border-stone-800" />
                </div>
                <span>+ Vàng Quỳ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handlePickPipette('blue');
                  addDrop('blue');
                }}
                className={`px-2 py-2 text-white rounded font-serif text-[11px] font-bold shadow transition flex flex-col items-center gap-1 active:scale-95 ${
                  selectedPipette === 'blue'
                    ? 'bg-blue-800 ring-2 ring-white scale-105'
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Pipette className="w-3.5 h-3.5 text-blue-300" />
                  <div className="w-3.5 h-3.5 rounded-full bg-blue-300 border border-white" />
                </div>
                <span>+ Lam Chàm</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStir}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded text-xs font-serif font-bold transition shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khuấy Đều Màu Sứ</span>
              </button>

              <button
                type="button"
                onClick={resetBowl}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-stone-300 hover:bg-stone-400 text-stone-800 rounded text-xs font-serif transition shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rửa Chén Men Ngà</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cột Phải: Cuốn sổ công thức & 3 dải lụa mẫu */}
        <div className="p-3.5 sm:p-4 rounded-lg wood-frame bg-dopaper-texture flex flex-col justify-between shadow">
          <div>
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#8c6239]/40">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#b91c1c]" />
                <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-800 uppercase tracking-wider">
                  SỔ TAY CÔNG THỨC & 3 DẢI LỤA GẤM ({completedSilks.length}/3)
                </h3>
              </div>
            </div>

            {/* Chi tiết sổ tay công thức bị nhòe mực */}
            <div className="p-2 mb-2.5 bg-amber-50/90 rounded border border-amber-300 text-[11px] font-serif text-amber-950 leading-relaxed shadow-inner">
              <div className="font-bold text-[#b91c1c] flex items-center gap-1 mb-0.5">
                <Scroll className="w-3.5 h-3.5" />
                <span>Cuốn Sổ Nhuộm Cổ (Trang Bị Nhòe Mực):</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                <li>
                  <span className="font-semibold text-orange-800">Cam Hoàng Sa:</span> Hòa hợp Đỏ Son và Vàng Quỳ...
                </li>
                <li>
                  <span className="font-semibold text-emerald-800">Lục Thủy Ngọc:</span> Giao thoa giữa Vàng Quỳ và Lam Chàm...
                </li>
                <li>
                  <span className="font-semibold text-purple-800">Tím Tử Đằng:</span> Kết hợp Đỏ Son với Lam Chàm...
                </li>
              </ul>
            </div>

            {/* Danh sách 3 dải lụa cần nhuộm */}
            <div className="space-y-2">
              {targetSilks.map((silk) => {
                const isDone = completedSilks.includes(silk.id);
                const isBeingDyed = isDyeing === silk.id;

                return (
                  <div
                    key={silk.id}
                    className={`p-2.5 rounded-lg border-2 transition-all flex items-center justify-between gap-2 ${
                      isDone
                        ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950 shadow-sm'
                        : isBeingDyed
                        ? 'bg-amber-100 border-amber-500 scale-102 ring-2 ring-amber-400'
                        : 'bg-white/80 border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Ô mẫu vải màu */}
                      <div
                        className="w-10 h-10 rounded border-2 border-stone-600 shadow flex items-center justify-center font-bold text-white text-xs shrink-0 transition-transform"
                        style={{
                          backgroundColor: isDone ? silk.colorCode : isBeingDyed ? getCurrentMixColor() : '#e5e5e5',
                        }}
                      >
                        {isDone ? <Check className="w-5 h-5 text-white stroke-[3]" /> : ''}
                      </div>

                      <div className="truncate">
                        <div className="font-bold font-serif text-xs sm:text-[13px] text-stone-900 truncate">
                          {silk.name}
                        </div>
                        <div className="text-[10px] text-stone-500 font-serif truncate">
                          {silk.pattern} • {isDone ? 'Đã nhuộm chuẩn' : 'Lụa thô trắng'}
                        </div>
                      </div>
                    </div>

                    {!isDone ? (
                      <button
                        type="button"
                        onClick={() => applyColorToSilk(silk.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded text-[11px] font-serif font-bold transition shadow shrink-0 active:scale-95"
                      >
                        <Paintbrush className="w-3.5 h-3.5" />
                        <span>Nhuộm Cọ</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-serif font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 shrink-0">
                        Hoàn tất
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* PHẦN KẾT QUẢ GDD: TẤM LỤA TRƯỢT XUỐNG, LỘ NGĂN KÉO VÀ MẢNH GIẤY HÌNH BÚT LÔNG */}
      {isSolved && (
        <div className="p-4 bg-emerald-900/95 border-2 border-amber-300 rounded-lg text-center max-w-xl w-full animate-fadeIn shadow-2xl text-amber-100 font-serif">
          <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm sm:text-base mb-1.5">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>ĐÃ NHUỘM HOÀN THIỆN CẢ 3 DẢI LỤA GẤM!</span>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed mb-3">
            "Sau khi hoàn thành việc pha thử các màu theo ghi chép, một tấm lụa ở cuối bàn khẽ trượt xuống, để lộ một ngăn kéo nhỏ bên dưới..."
          </p>

          {/* Mảnh giấy gợi ý cho Địa điểm 5 */}
          <div className="p-3 bg-[#241c16] rounded border border-amber-400/80 mb-3 text-left">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Manh Mối Trong Ngăn Kéo:</span>
            </div>
            <p className="text-xs text-stone-200 italic">
              "Tôi mở ngăn kéo. Bên trong là <strong>một mảnh giấy cũ có hình vẽ chiếc BÚT LÔNG</strong>. Ở góc bàn, chiếc hộp gỗ nhỏ bật mở, chứa những gói phẩm màu được bọc cẩn thận mang ký hiệu tương ứng với các màu sắc vừa tìm được."
            </p>
          </div>

          <div className="p-3 bg-[#17120e] rounded border border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-left">
              <span className="text-[11px] font-bold text-amber-300 block">
                🎉 THU THẬP THÀNH CÔNG ĐẠO CỤ #4:
              </span>
              <span className="text-sm font-bold text-emerald-300 font-serif">
                Bộ Phẩm Màu Tự Nhiên
              </span>
            </div>

            <button
              type="button"
              onClick={handleReturnSafezone}
              className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-serif font-bold rounded shadow-lg border border-amber-300 transition shrink-0 active:scale-95"
            >
              Nhận Phẩm Màu ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
