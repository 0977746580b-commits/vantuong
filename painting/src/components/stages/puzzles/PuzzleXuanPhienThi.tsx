import React, { useState } from 'react';
import { useGameState } from '../../../context/GameStateContext';
import { sounds } from '../../../utils/soundEngine';
import { RotateCw, CheckCircle, ArrowLeft, Scroll, HelpCircle } from 'lucide-react';

export const PuzzleXuanPhienThi: React.FC = () => {
  const { collectRelic, completeLocation, setStage, hasRelic } = useGameState();

  // 5 chiếc quạt bị xáo trộn lúc bắt đầu: thứ tự mục tiêu là [1, 2, 3, 4, 5]
  const [fanOrder, setFanOrder] = useState<number[]>(
    hasRelic('giay_do') ? [1, 2, 3, 4, 5] : [3, 1, 5, 2, 4]
  );
  const [isFlipped, setIsFlipped] = useState(hasRelic('giay_do'));
  const [isSolved, setIsSolved] = useState(hasRelic('giay_do'));
  const [selectedFanIndex, setSelectedFanIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showHintPaper, setShowHintPaper] = useState(false);

  const fanContents = [
    {
      id: 1,
      frontPattern: 'Gốc tre già cội & khóm măng non',
      imageSrc: './assets/fan_slice_1.png',
      frontVisual: '🎋 (Gốc tre)',
      backText: 'Giấy giữ hình,',
    },
    {
      id: 2,
      frontPattern: 'Thân tre dưới vươn thẳng vững chãi',
      imageSrc: './assets/fan_slice_2.png',
      frontVisual: '🎋 (Thân dưới)',
      backText: 'tre giữ dáng.',
    },
    {
      id: 3,
      frontPattern: 'Thân tre trên đón gió đông',
      imageSrc: './assets/fan_slice_3.png',
      frontVisual: '🎋 (Thân trên)',
      backText: 'Muốn lưu lại',
    },
    {
      id: 4,
      frontPattern: 'Ngọn tre vút cao chạm mây bạc',
      imageSrc: './assets/fan_slice_4.png',
      frontVisual: '🍃 (Ngọn tre)',
      backText: 'một điều, trước hết',
    },
    {
      id: 5,
      frontPattern: 'Tán lá tre xào xạc hòa tiếng chim',
      imageSrc: './assets/fan_slice_5.png',
      frontVisual: '🌿 (Tán lá)',
      backText: 'phải có nơi để nó tồn tại.',
    },
  ];

  const checkOrder = (order: number[]) => {
    const correct = order.every((val, i) => val === i + 1);
    if (correct && !isSolved) {
      sounds.playSuccess();
      setIsSolved(true);
      setIsFlipped(true);
      completeLocation('xuan_phien_thi');
    }
  };

  const handleSwap = (idx: number) => {
    if (isSolved && hasRelic('giay_do')) return;
    sounds.playClick();
    if (selectedFanIndex === null) {
      setSelectedFanIndex(idx);
    } else {
      if (selectedFanIndex !== idx) {
        const newOrder = [...fanOrder];
        const temp = newOrder[selectedFanIndex];
        newOrder[selectedFanIndex] = newOrder[idx];
        newOrder[idx] = temp;
        setFanOrder(newOrder);
        checkOrder(newOrder);
      }
      setSelectedFanIndex(null);
    }
  };

  // Hỗ trợ kéo thả trực quan (Drag & Drop)
  const handleDragStart = (e: React.DragEvent, idx: number) => {
    if (isSolved && hasRelic('giay_do')) return;
    setDraggedIndex(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (isSolved && hasRelic('giay_do')) return;
    if (draggedIndex === null || draggedIndex === dropIdx) {
      setDraggedIndex(null);
      return;
    }
    sounds.playWoodClop();
    const newOrder = [...fanOrder];
    const temp = newOrder[draggedIndex];
    newOrder[draggedIndex] = newOrder[dropIdx];
    newOrder[dropIdx] = temp;
    setFanOrder(newOrder);
    setDraggedIndex(null);
    checkOrder(newOrder);
  };

  const handleFlip = () => {
    sounds.playPaperRub();
    setIsFlipped(!isFlipped);
  };

  const handleCollect = () => {
    sounds.playBell();
    collectRelic('giay_do');
    setStage('RETURN_SAFEZONE');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-5 animate-fadeIn max-w-4xl mx-auto w-full">
      {/* Header cốt truyện bám sát plot */}
      <div className="bg-dopaper-texture wood-frame p-3 sm:p-4 w-full rounded shadow-md mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              Đình Xuân Phiến Thị
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold font-serif text-[#b91c1c] mt-1">
            ĐÌNH XUÂN PHIẾN THỊ: DẤU VẾT TRÊN GIẤY
          </h2>
          <p className="text-xs text-stone-700 font-serif italic mt-0.5">
            Tôi thử lên tiếng chào nhưng bác thợ già không hề ngẩng đầu. Dường như sự hiện diện của tôi chẳng có ý nghĩa gì đối với họ...
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setShowHintPaper(!showHintPaper)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-400 rounded text-xs font-serif font-bold text-stone-800 shadow transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Mảnh Giấy Dưới Bàn</span>
          </button>

          <button
            type="button"
            onClick={() => setStage('RETURN_SAFEZONE')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#b8894a] rounded text-xs text-amber-200 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Phố Cổ</span>
          </button>
        </div>
      </div>

      {/* Lời thoại nghe được theo plot */}
      <div className="w-full bg-amber-950/20 border-l-4 border-amber-600 p-2.5 rounded text-xs font-serif text-amber-200/90 mb-3 space-y-1">
        <p className="font-bold text-amber-300">Lời thoại người thợ già lẩm bẩm bên bàn:</p>
        <p className="italic">
          "Nan tre phải đều, giấy phải phẳng. Chỉ cần lệch một chút thôi, chiếc quạt dù đẹp đến đâu cũng chẳng thể khép lại cho trọn vẹn..."
        </p>
        <p className="italic">
          "Lạ thật... năm mẫu quạt ấy vốn phải được đặt cạnh nhau. Vậy mà chẳng hiểu sao lại có người xáo trộn."
        </p>
      </div>

      {/* Modal Mảnh giấy nhỏ nhặt dưới chân bàn */}
      {showHintPaper && (
        <div className="w-full bg-[#f4ebd0] border-2 border-[#b8894a] p-3 rounded text-stone-800 font-serif text-xs mb-3 shadow animate-fadeIn relative">
          <button
            type="button"
            onClick={() => setShowHintPaper(false)}
            className="absolute top-2 right-2 text-stone-500 hover:text-stone-800 font-bold"
          >
            ✕
          </button>
          <div className="flex items-center gap-1.5 text-[#b91c1c] font-bold mb-1">
            <Scroll className="w-4 h-4" />
            <span>Mảnh Giấy Nhỏ Nhặt Dưới Chân Bàn:</span>
          </div>
          <p className="leading-relaxed">
            <em>
              "Tre xanh từ đất mọc lên: bắt đầu từ Gốc cội, qua thân dưới đốt thẳng, thân trên đón gió, ngọn biếc chạm mây, rồi tán lá tỏa bóng. Xếp xong hãy lật mặt sau để đọc trọn câu minh triết của làng nghề."
            </em>
          </p>
        </div>
      )}

      {/* Khu vực tương tác 5 chiếc quạt */}
      <div className="w-full bg-[#241e18] p-4 sm:p-5 rounded-lg wood-frame shadow-2xl flex flex-col items-center justify-center">
        <div className="flex items-center justify-between w-full mb-3">
          <span className="text-xs text-amber-200 font-serif">
            {isFlipped
              ? 'Mặt sau (Câu thông điệp ẩn dưới lớp giấy)'
              : 'Mặt trước (Họa tiết Trúc Quân Tử: Kéo thả hoặc nhấp để hoán đổi)'}
          </span>
          <button
            type="button"
            onClick={handleFlip}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded text-xs font-serif font-bold transition shadow"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'Lật Xem Mặt Trước' : 'Lật Xem Mặt Sau'}</span>
          </button>
        </div>

        {/* 5 Chiếc quạt nan tre */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3 w-full max-w-2xl py-3">
          {fanOrder.map((fanId, idx) => {
            const fan = fanContents.find((f) => f.id === fanId)!;
            const isSelected = selectedFanIndex === idx;

            return (
              <div
                key={idx}
                draggable={!isSolved}
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onClick={() => handleSwap(idx)}
                className={`flex flex-col items-center justify-between p-2 sm:p-3 rounded-lg border-2 transition-all cursor-pointer aspect-[2/3] select-none ${
                  isSelected
                    ? 'border-yellow-400 bg-amber-100 scale-105 shadow-2xl ring-4 ring-yellow-400/50'
                    : isSolved
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                    : 'border-[#b8894a] bg-dopaper-texture hover:border-amber-400 hover:scale-102 shadow-lg'
                }`}
              >
                <span className="text-[10px] font-bold text-stone-500 font-serif">
                  Quạt #{idx + 1}
                </span>

                <div className="text-center my-auto px-0.5 w-full flex-1 flex flex-col items-center justify-center">
                  {!isFlipped ? (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <div className="w-full aspect-[1/2] max-h-[140px] rounded overflow-hidden flex items-center justify-center bg-[#1d1814] p-1 border border-amber-800/60 shadow-inner mb-1">
                        <img
                          src={fan.imageSrc}
                          alt={fan.frontPattern}
                          className="w-full h-full object-contain drop-shadow"
                        />
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-serif text-stone-900 font-bold leading-tight line-clamp-1">
                        {fan.frontPattern}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs sm:text-sm font-bold font-serif text-[#b91c1c] italic leading-snug p-2 bg-amber-50/90 rounded border border-amber-300 w-full shadow-inner">
                      "{fan.backText}"
                    </div>
                  )}
                </div>

                <div className="w-full text-center border-t border-stone-300 pt-1 text-[8px] sm:text-[9px] text-stone-500">
                  {isSolved ? 'Đã xếp đúng' : isSelected ? 'Đang chọn' : 'Kéo / Nhấp đổi'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Thông báo kết quả khi giải xong */}
        {isSolved ? (
          <div className="mt-3 p-3 sm:p-4 bg-emerald-100/95 border-2 border-emerald-500 rounded-lg text-center max-w-xl w-full animate-fadeIn shadow-xl">
            <div className="flex items-center justify-center gap-1.5 text-emerald-900 font-bold font-serif mb-1 text-sm sm:text-base">
              <CheckCircle className="w-5 h-5 text-emerald-700" />
              <span>NĂM CHIẾC QUẠT ĐÃ KHỚP NÉT! MẶT SAU HIỆN RÕ CÂU NÓI:</span>
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-emerald-950 mb-2 font-bold bg-white/70 py-1.5 px-3 rounded border border-emerald-300">
              "Giấy giữ hình, tre giữ dáng. Muốn lưu lại một điều, trước hết phải có nơi để nó tồn tại."
            </p>
            <p className="text-xs font-serif text-stone-700 italic mb-3">
              Bác thợ già mở chiếc hòm gỗ dưới chân bàn và lấy ra một xấp giấy dó được bọc cẩn thận...
            </p>

            <div className="p-2.5 bg-white rounded border border-emerald-300 flex items-center justify-between gap-2">
              <div className="text-left">
                <span className="text-[11px] font-bold text-emerald-900 block font-serif">
                  🎉 ĐẠO CỤ #1:
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#b91c1c] font-serif">
                  Xấp Giấy Dó Cổ Truyền
                </span>
              </div>

              {!hasRelic('giay_do') ? (
                <button
                  type="button"
                  onClick={handleCollect}
                  className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-serif font-bold rounded shadow-lg transition"
                >
                  Thu Nhận Giấy Dó ➔
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStage('RETURN_SAFEZONE')}
                  className="px-3 py-1.5 bg-[#2d241c] hover:bg-[#3d3126] text-amber-200 text-xs font-serif font-bold rounded border border-amber-400 shadow transition"
                >
                  Đã Có Trong Túi • Trở Về
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-amber-300/80 font-serif mt-2 text-center">
            Gợi ý: Xếp 5 quạt theo chiều sinh trưởng: <strong>Gốc tre ➔ Thân dưới ➔ Thân trên ➔ Ngọn tre ➔ Tán lá</strong>.
          </p>
        )}
      </div>
    </div>
  );
};
