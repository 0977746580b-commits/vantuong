import React, { useEffect, useState } from 'react';
import { useGameState } from '../../../context/GameStateContext';
import { sounds } from '../../../utils/soundEngine';
import { CheckCircle, ArrowLeft, Search, RotateCw, Sparkles } from 'lucide-react';

export const PuzzleHangTrong: React.FC = () => {
  const { collectRelic, completeLocation, setStage, hasRelic } = useGameState();

  const [foundDiffs, setFoundDiffs] = useState<number[]>(
    hasRelic('van_khac') ? [1, 2, 3] : []
  );
  const [isSolved, setIsSolved] = useState(hasRelic('van_khac'));
  const [flippedBoard, setFlippedBoard] = useState(hasRelic('van_khac'));
  const [missMessage, setMissMessage] = useState<string | null>(null);

  useEffect(() => {
    if (foundDiffs.length === 3 && !isSolved) {
      sounds.playSuccess();
      setIsSolved(true);
      completeLocation('hang_trong');
    }
  }, [foundDiffs.length, isSolved, completeLocation]);

  const differences = [
    {
      id: 1,
      title: '1. Nét chữ "Vương" (王) trên trán bị biến dạng',
      unfoundTitle: 'Điểm khắc lệch #1: Chưa phát hiện',
      desc: 'Bản in thử có nét chữ "Vương" (王) ở trán bị khắc lệch nét ngang giữa.',
      unfoundHint: 'Tự quan sát và đối chiếu hai bức tranh để tìm ra chi tiết khác biệt.',
      x: 39,
      y: 42,
    },
    {
      id: 2,
      title: '2. Chân trước bị khắc thừa thêm đường vằn',
      unfoundTitle: 'Điểm khắc lệch #2: Chưa phát hiện',
      desc: 'Bản chuẩn chỉ có 2 vệt vằn, bản in thử bị khắc thừa thành 4 vệt vằn trên chân.',
      unfoundHint: 'Tự quan sát và đối chiếu hai bức tranh để tìm ra chi tiết khác biệt.',
      x: 17,
      y: 71,
    },
    {
      id: 3,
      title: '3. Vòng xoáy mây góc dưới bị khắc thừa nét lượn',
      unfoundTitle: 'Điểm khắc lệch #3: Chưa phát hiện',
      desc: 'Cụm xoáy mây bên dưới góc phải bị khắc thêm nét đuôi cuộn lượn ra ngoài.',
      unfoundHint: 'Tự quan sát và đối chiếu hai bức tranh để tìm ra chi tiết khác biệt.',
      x: 74,
      y: 89,
    },
  ];

  const handleSpot = (e: React.MouseEvent, diffId: number) => {
    e.stopPropagation();
    setMissMessage(null);
    if (foundDiffs.includes(diffId)) return;
    sounds.playBell();
    setFoundDiffs((prev) => (prev.includes(diffId) ? prev : [...prev, diffId]));
  };

  const handleMissClick = () => {
    if (isSolved) return;
    sounds.playClick();
    setMissMessage('Vị trí này trùng khớp với bản chuẩn. Hãy quan sát kỹ từng nét khắc giữa hai bức tranh!');
  };

  const handleCollect = () => {
    if (!flippedBoard) return;
    sounds.playBell();
    collectRelic('van_khac');
    setStage('RETURN_SAFEZONE');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-5 animate-fadeIn max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="bg-dopaper-texture wood-frame p-3 sm:p-4 w-full rounded shadow-md mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-serif font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded border border-slate-400">
            Xưởng Tranh Hàng Trống
          </span>
          <h2 className="text-base sm:text-lg font-bold font-serif text-[#b91c1c] mt-1">
            XƯỞNG TRANH HÀNG TRỐNG: NÉT KHẮC BỊ THẤT LẠC
          </h2>
          <p className="text-xs text-stone-700 font-serif italic mt-0.5">
            Từ phía trong xưởng, tiếng dụng cụ chạm vào mặt gỗ vang lên đều đặn. Trên bàn là bản in thử mới nhất đặt cạnh bức tranh chuẩn treo trên tường...
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStage('RETURN_SAFEZONE')}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#b8894a] rounded text-xs text-amber-200 transition self-start sm:self-center"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Phố Cổ</span>
        </button>
      </div>

      {/* Lời thoại người thợ khắc theo đúng plot */}
      <div className="w-full bg-amber-950/20 border-l-4 border-amber-600 p-2.5 rounded text-xs font-serif text-amber-200/90 mb-3 space-y-1">
        <p className="font-bold text-amber-300">Lời người thợ già cúi sát tấm ván khắc:</p>
        <p className="italic">
          "Lạ thật... ta đã khắc đủ năm hình, vậy mà vẫn thiếu một nét cuối cùng. Hay là có người đã sửa lại bản gốc?"
        </p>
      </div>

      {/* So sánh hai bản in */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-3">
        {/* Bản Tranh Chuẩn Trên Tường */}
        <div className="p-3 rounded-lg wood-frame bg-dopaper-texture">
          <div className="text-center font-serif font-bold text-xs text-amber-900 border-b border-amber-300 pb-1 mb-2">
            [BỨC TRANH CHUẨN TREO TRÊN TƯỜNG]
          </div>
          <div className="p-2 bg-[#f5ecd8] border-2 border-stone-400 rounded shadow-inner mx-auto max-w-[380px] w-full">
            <div className="relative w-full aspect-square overflow-hidden rounded">
              <img
                src="./assets/puzzle3_bach_ho_master.png"
                alt="Bản Tranh Chuẩn Treo Trên Tường"
                className="w-full h-full object-contain block"
              />
              <div className="absolute bottom-1.5 right-1.5 text-[10px] text-stone-900 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-300 font-serif font-bold shadow-sm">
                Bản gốc hoàn chỉnh
              </div>
            </div>
          </div>
        </div>

        {/* Bản In Thử Duy Nhất Để Tự Đối Chiếu */}
        <div className="p-3 rounded-lg wood-frame bg-amber-50">
          <div className="text-center font-serif font-bold text-xs text-[#b91c1c] border-b border-amber-300 pb-1 mb-2 flex items-center justify-center gap-1">
            <Search className="w-3.5 h-3.5" />
            <span>[BẢN IN THỬ TRÊN BÀN — TÌM VÀ NHẤP VÀO 3 CHI TIẾT LỆCH]</span>
          </div>

          <div className="p-2 bg-[#fbf6ea] border-2 border-red-300 rounded shadow-inner mx-auto max-w-[380px] w-full">
            <div
              onClick={handleMissClick}
              className="relative w-full aspect-square overflow-hidden rounded cursor-crosshair select-none"
            >
              <img
                src="./assets/puzzle3_bach_ho_proof.png"
                alt="Bản In Thử Đang Phóng To"
                className="w-full h-full object-contain block pointer-events-none"
              />

              {/* 3 vùng tương tác ẩn hoàn toàn cho tới khi người chơi tự tìm và nhấp đúng */}
              {differences.map((diff) => {
                const isFound = foundDiffs.includes(diff.id);

                return (
                  <button
                    key={diff.id}
                    type="button"
                    aria-label={isFound ? diff.title : `Vùng kiểm tra ${diff.id}`}
                    onClick={(e) => handleSpot(e, diff.id)}
                    style={{
                      left: `${diff.x}%`,
                      top: `${diff.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    className={`absolute w-12 h-12 rounded-full flex items-center justify-center transition-all focus:outline-none ${
                      isFound
                        ? 'border-2 border-emerald-600 bg-emerald-400/55 text-emerald-950 font-bold text-sm ring-4 ring-emerald-400/70 shadow-lg cursor-default'
                        : 'border-0 bg-transparent text-transparent cursor-crosshair'
                    }`}
                    title={isFound ? diff.title : undefined}
                  >
                    {isFound ? '✓' : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {missMessage && !isSolved && (
        <div className="w-full mb-3 p-2 rounded bg-amber-950/35 border border-amber-500/60 text-amber-200 text-xs font-serif text-center animate-fadeIn">
          {missMessage}
        </div>
      )}

      {/* Tiến độ 3 điểm bất thường (ẩn toàn bộ gợi ý cho tới khi tự tìm đúng) */}
      <div className="w-full bg-dopaper-texture wood-frame p-3 rounded mb-3">
        <h4 className="text-xs font-serif font-bold text-stone-800 mb-2">
          Sổ đối chiếu các điểm khắc lệch đã phát hiện ({foundDiffs.length}/3):
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-serif">
          {differences.map((d) => {
            const found = foundDiffs.includes(d.id);
            return (
              <div
                key={d.id}
                className={`p-2 rounded border text-left flex items-center gap-1.5 transition ${
                  found
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold'
                    : 'bg-amber-50/80 border-amber-300 text-stone-700'
                }`}
              >
                <CheckCircle
                  className={`w-4 h-4 shrink-0 ${found ? 'text-emerald-700' : 'text-stone-400'}`}
                />
                <div>
                  <span className="block">{found ? d.title : 'Điểm khắc lệch chưa được tìm thấy'}</span>
                  <span className="text-[10px] text-stone-500 font-normal">
                    {found ? d.desc : 'Hãy quan sát kỹ để tìm chi tiết khác biệt.'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phân cảnh 3: Nhận ván khắc gỗ & Lật mặt sau xem dấu hiệu lụa Hàng Gai */}
      {isSolved && (
        <div className="p-3 sm:p-4 bg-emerald-100/95 border-2 border-emerald-500 rounded-lg text-center max-w-xl w-full animate-fadeIn shadow-xl">
          <div className="flex items-center justify-center gap-1.5 text-emerald-900 font-bold font-serif mb-1 text-sm sm:text-base">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
            <span>BÁC THỢ ĐẶT TẤM VÁN HOÀN CHỈNH LÊN BÀN!</span>
          </div>
          <p className="text-xs font-serif text-stone-800 italic mb-2">
            "Có những nét đã được khắc xuống thì chẳng dễ gì xóa đi. Dù lớp mực có phai, dấu vết vẫn còn nằm lại trên gỗ."
          </p>

          {/* Nút lật mặt sau tấm ván gỗ theo đúng plot */}
          <div className="mb-3">
            {!flippedBoard ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playWoodClop();
                  setFlippedBoard(true);
                }}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-serif font-bold rounded shadow inline-flex items-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Lật Mặt Sau Tấm Ván Gỗ Để Kiểm Tra Dấu Hiệu</span>
              </button>
            ) : (
              <div className="p-2.5 bg-amber-50 rounded border border-amber-400 text-stone-800 text-xs font-serif text-left animate-fadeIn">
                <div className="flex items-center gap-1 text-[#b91c1c] font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Dấu Hiệu Mặt Sau Tấm Ván Khắc:</span>
                </div>
                <p>
                  "Tôi lật mặt sau tấm ván. Ở đó có một dấu hiệu nhỏ giống với{' '}
                  <strong>hoa văn sóng nước trên tấm vải lụa</strong> mà tôi từng nhìn thấy trong cuốn sổ ở hiệu phục sức."
                </p>
                <span className="text-[11px] text-amber-900 font-bold block mt-1">
                  ➔ Gợi ý tiếp theo dẫn tới phường dệt tơ lụa và sắc màu ngũ hành kinh kỳ.
                </span>
              </div>
            )}
          </div>

          <div className="p-2.5 bg-white rounded border border-emerald-300 flex items-center justify-between gap-2">
            <div className="text-left">
              <span className="text-[11px] font-bold text-emerald-900 block font-serif">
                🎉 ĐẠO CỤ #3:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#b91c1c] font-serif">
                Ván Khắc Gỗ Nét Đen Ngũ Hổ
              </span>
            </div>

            {!hasRelic('van_khac') ? (
              <button
                type="button"
                onClick={handleCollect}
                disabled={!flippedBoard}
                className={`px-4 py-2 text-xs font-serif font-bold rounded shadow-lg transition ${
                  flippedBoard
                    ? 'bg-[#b91c1c] hover:bg-[#991b1b] text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {flippedBoard ? 'Thu Nhận Ván Khắc Gỗ ➔' : 'Lật Mặt Sau Ván Trước'}
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
      )}
    </div>
  );
};
