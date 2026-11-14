import React, { useState } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { RelicId, ElementType } from '../../types/game';
import { FileText, Droplet, Box, Palette, Feather, Info, X } from 'lucide-react';

interface ToolMeta {
  id: RelicId;
  name: string;
  element: ElementType;
  color: string;
  imageSrc: string;
  icon: React.ReactNode;
  origin: string;
  desc: string;
  historicalNote: string;
}

const TOOLS_METADATA: ToolMeta[] = [
  {
    id: 'giay_do',
    name: 'Giấy Dó',
    element: 'Mộc',
    color: '#059669',
    imageSrc: './assets/item_giay_do.png',
    icon: <FileText className="w-5 h-5 text-emerald-600" />,
    origin: 'Đình Xuân Phiến Thị',
    desc: 'Giấy làm từ vỏ cây dó tự nhiên, dai, bền, xốp nhẹ và giữ màu mực hàng trăm năm không mục.',
    historicalNote: 'Tranh Hàng Trống dùng giấy dó quét thêm lớp hồ điệp mỏng hoặc giấy bồi nhiều lớp để tranh dày dặn khi tô màu.'
  },
  {
    id: 'muc_tau',
    name: 'Mực Tàu',
    element: 'Hỏa',
    color: '#dc2626',
    imageSrc: './assets/item_muc_tau.png',
    icon: <Droplet className="w-5 h-5 text-red-600" />,
    origin: 'Hiệu phục sức Mã Vĩ',
    desc: 'Mực đen chế từ muội than dầu thông nguyên chất mài với keo da trâu, đen tuyền óng ả.',
    historicalNote: 'Mực đen dùng để in đường viền chính từ ván khắc gỗ lên giấy dó, tạo nên "bộ xương" sắc nét của bức tranh.'
  },
  {
    id: 'van_khac',
    name: 'Ván Khắc Gỗ',
    element: 'Kim',
    color: '#94a3b8',
    imageSrc: './assets/item_van_khac.png',
    icon: <Box className="w-5 h-5 text-slate-500" />,
    origin: 'Xưởng tranh Hàng Trống',
    desc: 'Gỗ thị hoặc gỗ lồng mực được nghệ nhân chạm khắc tỉ mỉ từng đường nét tinh xảo hình Hổ Thần.',
    historicalNote: 'Tranh Hàng Trống dùng ván khắc mộc bản để in nét đen, đường nét thanh mảnh, bay bổng tinh xảo.'
  },
  {
    id: 'pham_mau',
    name: 'Phẩm Màu & Con Quay Mực',
    element: 'Thủy',
    color: '#2563eb',
    imageSrc: './assets/item_con_quay_muc.png',
    icon: <Palette className="w-5 h-5 text-blue-600" />,
    origin: 'Hiệu tơ lụa Hàng Gai',
    desc: 'Bao gồm phẩm màu tự nhiên và con quay mực truyền thống để miết êm đều mực in.',
    historicalNote: 'Con quay mực có trục gỗ và con lăn đầm tay giúp ép mực Tàu ngấm trọn vẹn vào thớ giấy dó mà không làm rách giấy.'
  },
  {
    id: 'but_long',
    name: 'Bút Lông',
    element: 'Thổ',
    color: '#d97706',
    imageSrc: './assets/item_but_long.png',
    icon: <Feather className="w-5 h-5 text-amber-600" />,
    origin: 'Đình Đông Hương',
    desc: 'Bộ bút lông vẽ tranh truyền thống cán tre buộc tua rua đỏ, dùng trong công đoạn vờn màu điêu luyện.',
    historicalNote: 'Nghệ nhân dùng một ngọn bút chấm nửa màu nửa nước lã, vuốt màu loang chuyển độ từ đậm sang nhạt tạo hiệu ứng thần kỳ.'
  }
];

export const InventoryBar: React.FC = () => {
  const { inventory, stage, setStage } = useGameState();
  const [selectedTool, setSelectedTool] = useState<ToolMeta | null>(null);
  const [showFullSet, setShowFullSet] = useState<boolean>(false);

  const canGoToWorkshop = inventory.length === 5 && stage !== 'PRINTING_WORKSHOP' && stage !== 'POEM_CIPHER' && stage !== 'EPILOGUE';

  return (
    <>
      <div className="w-full bg-[#1b1714] border-t-2 border-[#b8894a] px-3 py-2 flex flex-wrap items-center justify-between gap-3 shadow-2xl z-30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif uppercase tracking-widest text-[#dec291] font-bold">
            TÚI ĐẠO CỤ:
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {TOOLS_METADATA.map((tool) => {
            const isOwned = inventory.includes(tool.id);
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded border transition relative text-xs ${
                  isOwned
                    ? 'bg-[#2b241e] border-amber-600 text-amber-200 shadow-md hover:bg-[#382f27]'
                    : 'bg-[#151210] border-stone-800 text-stone-600 opacity-60 cursor-not-allowed'
                }`}
                title={tool.name}
              >
                <div className={`w-8 h-8 rounded p-0.5 flex items-center justify-center overflow-hidden shrink-0 ${isOwned ? 'bg-[#3b322a] border border-amber-600/70 shadow' : 'bg-stone-900 border border-stone-800'}`}>
                  {isOwned ? (
                    <img
                      src={tool.imageSrc}
                      alt={tool.name}
                      className="w-full h-full object-contain drop-shadow"
                    />
                  ) : (
                    <div className="opacity-40">{tool.icon}</div>
                  )}
                </div>
                <div className="text-left font-serif">
                  <div className="font-bold flex items-center gap-1">
                    {tool.name}
                    {isOwned && (
                      <span className="text-[10px] px-1 rounded bg-[#b91c1c] text-white font-sans font-bold">
                        {tool.element}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {isOwned ? 'Đã có' : 'Chưa có'}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Nút xem toàn bộ ảnh bộ dụng cụ */}
          <button
            type="button"
            onClick={() => setShowFullSet(true)}
            className="px-2.5 py-1.5 bg-[#2b241e] hover:bg-[#382f27] border border-amber-600/80 rounded text-amber-200 text-xs font-serif flex items-center gap-1.5 transition shadow"
            title="Xem toàn bộ ảnh bộ dụng cụ 5 món"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Xem Bộ Dụng Cụ</span>
          </button>
        </div>

        {/* Nút vào Xưởng in tranh khi đã đủ 5 đạo cụ */}
        {canGoToWorkshop && (
          <button
            onClick={() => setStage('PRINTING_WORKSHOP')}
            className="pulse-glow px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] border-2 border-amber-400 text-amber-100 font-bold text-xs sm:text-sm rounded shadow-lg transition flex items-center gap-2"
          >
            <span>Đủ 5 Đạo Cụ! Vào Xưởng In Tranh</span>
            <span className="text-lg">➔</span>
          </button>
        )}
      </div>

      {/* Modal xem toàn bộ ảnh bộ dụng cụ mới (Image 1) */}
      {showFullSet && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-dopaper-texture wood-frame max-w-2xl w-full p-5 text-[#2b2520] relative rounded shadow-2xl">
            <button
              onClick={() => setShowFullSet(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-stone-300 text-stone-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="border-b-2 border-[#b8894a] pb-2 mb-3 text-center">
              <h3 className="text-lg sm:text-xl font-bold text-[#b91c1c] font-serif">
                BỘ DỤNG CỤ NGHỆ NHÂN TRANH HÀNG TRỐNG
              </h3>
              <p className="text-xs text-amber-900 font-serif">
                Giấy Dó • Mực Tàu & Nghiên Đá • Ván Khắc Gỗ • Con Quay Mực (Con Lăn) • Bút Lông
              </p>
            </div>
            <div className="w-full aspect-[3/2] bg-[#1a1614] rounded border-2 border-amber-700 p-2 flex items-center justify-center overflow-hidden shadow-inner mb-3">
              <img
                src="./assets/inventory_props_new.png"
                alt="Bộ dụng cụ làm tranh Hàng Trống"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            <p className="text-xs font-serif text-stone-700 italic text-center">
              "Năm vật phẩm tụ hội đầy đủ khí ngũ hành, giúp nghệ nhân tái hiện trọn vẹn nét khắc và vờn màu tinh hoa của di sản Thăng Long."
            </p>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowFullSet(false)}
                className="px-5 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 rounded font-serif text-sm transition shadow"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết đạo cụ văn hóa */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-dopaper-texture wood-frame max-w-md w-full p-6 text-[#2b2520] relative rounded shadow-2xl">
            <button
              onClick={() => setSelectedTool(null)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-stone-300 text-stone-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b-2 border-[#b8894a] pb-3 mb-4">
              <div className="w-16 h-16 bg-[#241e1a] rounded-lg border-2 border-amber-500/80 p-1 flex items-center justify-center shadow overflow-hidden shrink-0">
                <img
                  src={selectedTool.imageSrc}
                  alt={selectedTool.name}
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#b91c1c] font-serif">
                  {selectedTool.name}
                </h3>
                <p className="text-xs text-amber-800 font-serif">
                  Ngũ Hành: <strong className="font-bold text-[#b91c1c]">{selectedTool.element}</strong> • {selectedTool.origin}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm leading-relaxed font-serif">
              <p className="text-stone-800 italic">
                "{selectedTool.desc}"
              </p>
              <div className="p-3 bg-amber-50/80 rounded border border-amber-200 text-xs text-stone-700">
                <strong className="text-[#b91c1c] block mb-1">Giá trị văn hóa & Lịch sử:</strong>
                {selectedTool.historicalNote}
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setSelectedTool(null)}
                className="px-5 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 rounded font-serif text-sm transition shadow"
              >
                Đóng lại
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
