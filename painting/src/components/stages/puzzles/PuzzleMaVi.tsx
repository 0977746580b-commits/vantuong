import React, { useState } from 'react';
import { useGameState } from '../../../context/GameStateContext';
import { sounds } from '../../../utils/soundEngine';
import { CheckCircle, ArrowLeft, Shirt, Shield, Eye, BookOpen, Sparkles, Search } from 'lucide-react';

interface AccessoryItem {
  name: string;
  category: 'hat' | 'armor' | 'prop';
  categoryLabel: string;
  desc: string;
  visual: string;
}

const ACCESSORIES: AccessoryItem[] = [
  {
    name: 'Mũ Cánh Chuồn',
    category: 'hat',
    categoryLabel: 'Mũ mão',
    visual: '🎩',
    desc: 'Mũ quan văn triều đình có hai cánh mỏng vươn ngang như cánh chuồn, biểu trưng cho bậc trung thần liêm chính.',
  },
  {
    name: 'Mũ Trụ Kim Tuyến',
    category: 'hat',
    categoryLabel: 'Mũ mão',
    visual: '⛑️',
    desc: 'Mũ trụ chiến trận đính kim tuyến và chỏm lông đỏ, dành cho võ tướng thống lĩnh binh quyền nơi sa trường.',
  },
  {
    name: 'Khăn Vấn Đỏ Thẫm',
    category: 'hat',
    categoryLabel: 'Mũ mão',
    visual: '🧣',
    desc: 'Khăn vấn lụa đỏ thẫm quấn gọn quanh đầu, giúp nghệ nhân đeo mặt nạ tuồng biểu diễn linh hoạt.',
  },
  {
    name: 'Áo Gấm Thêu Bổ',
    category: 'armor',
    categoryLabel: 'Y phục / Giáp',
    visual: '👘',
    desc: 'Áo bào gấm thêu bổ tử hình chim hạc trước ngực, trang phục chuẩn mực của quan văn khi chầu triều.',
  },
  {
    name: 'Giáp Sắt Hộ Tâm',
    category: 'armor',
    categoryLabel: 'Y phục / Giáp',
    visual: '🛡️',
    desc: 'Bộ giáp trụ có gương hộ tâm sáng loáng trước ngực, bảo vệ viên tướng giữa làn tên mũi giáo.',
  },
  {
    name: 'Áo Vạt Chẽn Rực Rỡ',
    category: 'armor',
    categoryLabel: 'Y phục / Giáp',
    visual: '🦺',
    desc: 'Áo vạt chẽn thêu vân mây ngũ sắc bó gọn cổ tay, chuyên dùng cho vai diễn đeo mặt nạ múa võ tuồng cổ.',
  },
  {
    name: 'Hốt Ngọc & Thẻ Bài',
    category: 'prop',
    categoryLabel: 'Đạo cụ',
    visual: '📜',
    desc: 'Tấm hốt ngà nâng trước ngực khi tấu trình và thẻ bài khắc chức tước của bậc quan văn.',
  },
  {
    name: 'Cờ Lệnh Ngũ Sắc',
    category: 'prop',
    categoryLabel: 'Đạo cụ',
    visual: '🚩',
    desc: 'Lá cờ lệnh thêu rồng năm sắc cắm sau lưng giáp, biểu tượng uy quyền điều binh khiển tướng.',
  },
  {
    name: 'Mặt Nạ Tuồng Cổ',
    category: 'prop',
    categoryLabel: 'Đạo cụ',
    visual: '🎭',
    desc: 'Chiếc mặt nạ sơn son thếp vàng vẽ nét mặt tuồng cổ, mang thần thái rực lửa của Xích Hổ.',
  },
];

export const PuzzleMaVi: React.FC = () => {
  const { collectRelic, completeLocation, setStage, hasRelic } = useGameState();

  const characters = [
    {
      id: 'quan',
      name: 'Vị Quan Triều Đình',
      roleDesc:
        'Bậc trung thần liêm chính, một đời phụng sự xã tắc. Mũ cánh chuồn ngay ngắn, áo gấm thêu bổ, tay nâng hốt ngọc thẻ bài.',
      correctHat: 'Mũ Cánh Chuồn',
      correctArmor: 'Áo Gấm Thêu Bổ',
      correctProp: 'Hốt Ngọc & Thẻ Bài',
      icon: <Shirt className="w-6 h-6 text-indigo-600" />,
    },
    {
      id: 'tuong',
      name: 'Viên Tướng Xuất Trận',
      roleDesc:
        'Dũng tướng xung trận xua tan giặc dữ. Mũ trụ ánh kim, giáp sắt hộ tâm, cờ lệnh ngũ sắc cắm sau lưng.',
      correctHat: 'Mũ Trụ Kim Tuyến',
      correctArmor: 'Giáp Sắt Hộ Tâm',
      correctProp: 'Cờ Lệnh Ngũ Sắc',
      icon: <Shield className="w-6 h-6 text-red-600" />,
    },
    {
      id: 'mat_na',
      name: 'Nhân Vật Đeo Mặt Nạ',
      roleDesc:
        'Vai tuồng biến ảo khôn lường mang bản sắc sân khấu cổ. Khăn vấn đỏ thẫm, áo vạt chẽn rực rỡ và chiếc mặt nạ tuồng.',
      correctHat: 'Khăn Vấn Đỏ Thẫm',
      correctArmor: 'Áo Vạt Chẽn Rực Rỡ',
      correctProp: 'Mặt Nạ Tuồng Cổ',
      icon: <Eye className="w-6 h-6 text-amber-600" />,
    },
  ];

  const hats = ['Mũ Cánh Chuồn', 'Mũ Trụ Kim Tuyến', 'Khăn Vấn Đỏ Thẫm'];
  const armors = ['Áo Gấm Thêu Bổ', 'Giáp Sắt Hộ Tâm', 'Áo Vạt Chẽn Rực Rỡ'];
  const props = ['Hốt Ngọc & Thẻ Bài', 'Cờ Lệnh Ngũ Sắc', 'Mặt Nạ Tuồng Cổ'];

  const initialSelections = hasRelic('muc_tau')
    ? {
        quan: { hat: 'Mũ Cánh Chuồn', armor: 'Áo Gấm Thêu Bổ', prop: 'Hốt Ngọc & Thẻ Bài' },
        tuong: { hat: 'Mũ Trụ Kim Tuyến', armor: 'Giáp Sắt Hộ Tâm', prop: 'Cờ Lệnh Ngũ Sắc' },
        mat_na: { hat: 'Khăn Vấn Đỏ Thẫm', armor: 'Áo Vạt Chẽn Rực Rỡ', prop: 'Mặt Nạ Tuồng Cổ' },
      }
    : {
        quan: { hat: '', armor: '', prop: '' },
        tuong: { hat: '', armor: '', prop: '' },
        mat_na: { hat: '', armor: '', prop: '' },
      };

  const [selections, setSelections] = useState(initialSelections);
  const [isSolved, setIsSolved] = useState(hasRelic('muc_tau'));
  const [showLedgerBook, setShowLedgerBook] = useState(false);
  const [inspectedAccessory, setInspectedAccessory] = useState<AccessoryItem | null>(ACCESSORIES[8]);
  const [draggedAccessory, setDraggedAccessory] = useState<AccessoryItem | null>(null);

  const handleSelect = (charId: string, category: 'hat' | 'armor' | 'prop', value: string) => {
    sounds.playClick();
    const updated = {
      ...selections,
      [charId]: {
        ...selections[charId as keyof typeof selections],
        [category]: value,
      },
    };
    setSelections(updated);

    const isCorrect = characters.every((c) => {
      const s = updated[c.id as keyof typeof updated];
      return s.hat === c.correctHat && s.armor === c.correctArmor && s.prop === c.correctProp;
    });

    if (isCorrect && !isSolved) {
      sounds.playSuccess();
      setIsSolved(true);
      completeLocation('ma_vi');
    }
  };

  const handleDropOnCharacter = (charId: string) => {
    if (!draggedAccessory || (isSolved && hasRelic('muc_tau'))) return;
    handleSelect(charId, draggedAccessory.category, draggedAccessory.name);
    setDraggedAccessory(null);
  };

  const handleCollect = () => {
    sounds.playBell();
    collectRelic('muc_tau');
    setStage('RETURN_SAFEZONE');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-5 animate-fadeIn max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="bg-dopaper-texture wood-frame p-3 sm:p-4 w-full rounded shadow-md mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded border border-red-300">
              Hiệu Phục Sức Mã Vĩ
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold font-serif text-[#b91c1c] mt-1">
            HIỆU PHỤC SỨC MÃ VĨ: VỞ DIỄN CHƯA HẠ MÀN
          </h2>
          <p className="text-xs text-stone-700 font-serif italic mt-0.5">
            Tôi dừng chân trước cửa hiệu nhỏ. Ba bộ trang phục chưa hoàn thiện đặt trước gương, một số món đồ bị vứt lẫn lộn...
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setShowLedgerBook(!showLedgerBook)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-400 rounded text-xs font-serif font-bold text-stone-800 shadow transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-800" />
            <span>Đọc Sổ Phục Trang</span>
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
        <p className="font-bold text-amber-300">
          Tiếng người phụ nữ lật giở trang giấy phía sau tấm bình phong:
        </p>
        <p className="italic">
          "Không thể nào... bộ này rõ ràng thuộc về vai trung thần liêm chính, tại sao trong sổ lại ghi nhầm sang phản tướng thế này?"
        </p>
      </div>

      {/* Tranh minh họa ba bộ phục trang truyền thống */}
      <div className="w-full bg-[#1e1915] p-2.5 rounded-lg border-2 border-amber-800 shadow-xl mb-3 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-xs font-serif font-bold text-amber-200 mb-2 px-1">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>MẪU THIẾT KẾ PHỤC TRANG TUỒNG CỔ TẠI HIỆU MÃ VĨ:</span>
          </span>
          <span className="text-[11px] text-amber-400 font-normal italic">
            Đối chiếu phục trang Quan Văn, Võ Tướng & Vai Mặt Nạ
          </span>
        </div>
        <div className="w-full rounded flex items-center justify-center bg-[#120f0d] p-2 border border-amber-700/60 shadow-inner">
          <img
            src="./assets/puzzle2_ma_vi_costumes.png"
            alt="Ba bộ trang phục tuồng cổ Mã Vĩ"
            className="max-w-full max-h-[440px] w-auto h-auto object-contain rounded drop-shadow"
          />
        </div>
      </div>

      {/* Modal Cuốn sổ phục trang tuồng cổ */}
      {showLedgerBook && (
        <div className="w-full bg-[#f4ebd0] border-2 border-[#b8894a] p-3.5 rounded text-stone-800 font-serif text-xs mb-3 shadow animate-fadeIn relative">
          <button
            type="button"
            onClick={() => setShowLedgerBook(false)}
            className="absolute top-2 right-2 text-stone-500 hover:text-stone-800 font-bold"
          >
            ✕
          </button>
          <div className="flex items-center gap-1.5 text-[#b91c1c] font-bold mb-1.5 text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Ghi Chú Trong Cuốn Sổ Phục Trang Xưa:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 leading-relaxed">
            <div className="p-2 bg-amber-50 rounded border border-amber-300">
              <strong className="text-indigo-800 block mb-0.5">1. Vị Quan Triều Đình:</strong>
              Mũ Cánh Chuồn thể hiện sự uy nghiêm, Áo Gấm Thêu Bổ hoa văn chim phượng, tay cầm Hốt Ngọc và Thẻ Bài khi bái yết.
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-300">
              <strong className="text-red-800 block mb-0.5">2. Viên Tướng Xuất Trận:</strong>
              Mũ Trụ Kim Tuyến che đầu, Giáp Sắt Hộ Tâm chịu ngọn giáo mũi kiếm, sau lưng giắt Cờ Lệnh Ngũ Sắc truyền hiệu lệnh.
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-300">
              <strong className="text-amber-900 block mb-0.5">3. Nhân Vật Đeo Mặt Nạ:</strong>
              Khăn Vấn Đỏ Thẫm truyền thống, Áo Vạt Chẽn Rực Rỡ thuận tiện múa vũ đạo, khuôn mặt mang Mặt Nạ Tuồng Cổ biến ảo.
            </div>
          </div>
        </div>
      )}

      {/* Khay 9 Phụ Kiện Đặt Lẫn Lộn Trên Bàn (Nhấp để soi chi tiết hoặc Kéo thả vào 3 vai diễn) */}
      <div className="w-full bg-[#241e18] border border-[#b8894a] rounded-lg p-3 mb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
          <span className="text-xs font-serif font-bold text-amber-200 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Khay Phụ Kiện Bị Lẫn Lộn (Nhấp để xem chi tiết • Kéo thả hoặc chọn bên dưới cho 3 bộ trang phục):</span>
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 mb-2">
          {ACCESSORIES.map((acc) => {
            const isInspected = inspectedAccessory?.name === acc.name;
            return (
              <button
                key={acc.name}
                type="button"
                draggable={!isSolved}
                onDragStart={() => setDraggedAccessory(acc)}
                onClick={() => {
                  sounds.playClick();
                  setInspectedAccessory(acc);
                }}
                className={`p-1.5 rounded border text-center transition flex flex-col items-center justify-between ${
                  isInspected
                    ? 'bg-amber-300 text-stone-950 border-[#b91c1c] font-bold shadow scale-105'
                    : 'bg-stone-800/90 text-amber-100 border-stone-600 hover:border-amber-400'
                }`}
                title={`${acc.name} (${acc.categoryLabel})`}
              >
                <span className="text-base">{acc.visual}</span>
                <span className="text-[9px] font-serif leading-tight line-clamp-2 mt-0.5">
                  {acc.name}
                </span>
              </button>
            );
          })}
        </div>

        {inspectedAccessory && (
          <div className="p-2 rounded bg-black/50 border border-amber-500/40 text-xs font-serif text-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <strong className="text-amber-300">
                {inspectedAccessory.visual} {inspectedAccessory.name} ({inspectedAccessory.categoryLabel}):
              </strong>{' '}
              <span className="text-stone-300 italic">{inspectedAccessory.desc}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {characters.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    handleSelect(c.id, inspectedAccessory.category, inspectedAccessory.name)
                  }
                  disabled={isSolved && hasRelic('muc_tau')}
                  className="px-2 py-1 rounded bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[10px] font-bold transition"
                >
                  Gắn cho {c.id === 'quan' ? 'Vị Quan' : c.id === 'tuong' ? 'Viên Tướng' : 'Mặt Nạ'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3 Nhân vật sân khấu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full mb-3">
        {characters.map((char) => {
          const s = selections[char.id as keyof typeof selections];
          const isCharCorrect =
            s.hat === char.correctHat &&
            s.armor === char.correctArmor &&
            s.prop === char.correctProp;

          return (
            <div
              key={char.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOnCharacter(char.id)}
              className={`p-3.5 rounded-lg wood-frame transition-all ${
                isCharCorrect
                  ? 'bg-emerald-50/95 border-emerald-500 shadow-emerald-900/30'
                  : 'bg-dopaper-texture border-[#b8894a]'
              }`}
            >
              <div className="flex items-center gap-2 border-b border-amber-300 pb-2 mb-2.5">
                <div className="p-1.5 bg-amber-100 rounded-full border border-amber-300">
                  {char.icon}
                </div>
                <div>
                  <h3 className="font-bold font-serif text-xs sm:text-sm text-[#b91c1c] flex items-center gap-1">
                    {char.name}
                    {isCharCorrect && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                  </h3>
                </div>
              </div>

              <p className="text-[11px] text-stone-700 font-serif italic mb-2.5 min-h-[34px] leading-snug">
                "{char.roleDesc}"
              </p>

              <div className="space-y-1.5 text-xs font-serif">
                <div>
                  <label className="block text-[10px] font-bold text-stone-700 mb-0.5">
                    Mũ mão:
                  </label>
                  <select
                    value={s.hat}
                    onChange={(e) => handleSelect(char.id, 'hat', e.target.value)}
                    disabled={isSolved && hasRelic('muc_tau')}
                    className="w-full p-1 rounded border border-amber-300 bg-amber-50 text-stone-800 text-xs"
                  >
                    <option value="">-- Chọn Mũ Mão --</option>
                    {hats.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 mb-0.5">
                    Y phục / Giáp:
                  </label>
                  <select
                    value={s.armor}
                    onChange={(e) => handleSelect(char.id, 'armor', e.target.value)}
                    disabled={isSolved && hasRelic('muc_tau')}
                    className="w-full p-1 rounded border border-amber-300 bg-amber-50 text-stone-800 text-xs"
                  >
                    <option value="">-- Chọn Y Phục --</option>
                    {armors.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-700 mb-0.5">
                    Binh khí / Đạo cụ:
                  </label>
                  <select
                    value={s.prop}
                    onChange={(e) => handleSelect(char.id, 'prop', e.target.value)}
                    disabled={isSolved && hasRelic('muc_tau')}
                    className="w-full p-1 rounded border border-amber-300 bg-amber-50 text-stone-800 text-xs"
                  >
                    <option value="">-- Chọn Đạo Cụ --</option>
                    {props.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Thông báo kết quả khi giải xong */}
      {isSolved && (
        <div className="p-3 sm:p-4 bg-emerald-100/95 border-2 border-emerald-500 rounded-lg text-center max-w-xl w-full animate-fadeIn shadow-xl">
          <div className="flex items-center justify-center gap-1.5 text-emerald-900 font-bold font-serif mb-1 text-sm sm:text-base">
            <CheckCircle className="w-5 h-5 text-emerald-700" />
            <span>BA BỘ TRANG PHỤC & SỔ PHỤC TRANG ĐÃ HOÀN CHỈNH!</span>
          </div>
          <p className="text-xs font-serif text-stone-800 mb-2 italic">
            "Một vở diễn chỉ trọn vẹn khi mỗi người đứng đúng vai của mình. Chỉ cần lệch đi một chi tiết, cả câu chuyện sẽ biến thành thứ khác."
          </p>

          {/* Dấu vết then chốt dẫn sang Địa điểm 3 theo plot */}
          <div className="p-2.5 bg-amber-50 rounded border border-amber-300 text-stone-800 text-xs font-serif mb-3 text-left">
            <div className="flex items-center gap-1 text-[#b91c1c] font-bold mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Manh Mối Bên Cạnh Thỏi Mực:</span>
            </div>
            <p>
              "Bên cạnh thỏi mực trên bàn lại là một bản phác thảo Ngũ Hổ. Bản phác thảo ấy như đeo bám tôi ở mọi ngóc ngách...
              <strong> Ở góc dưới bức vẽ có khắc hình một chiếc dao cắt khắc gỗ.</strong>"
            </p>
            <span className="text-[11px] text-amber-900 font-bold block mt-1">
              ➔ Gợi ý tiếp theo dẫn đến phường thợ khắc gỗ in tranh truyền đời.
            </span>
          </div>

          <div className="p-2.5 bg-white rounded border border-emerald-300 flex items-center justify-between gap-2">
            <div className="text-left">
              <span className="text-[11px] font-bold text-emerald-900 block font-serif">
                🎉 ĐẠO CỤ #2:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#b91c1c] font-serif">
                Thỏi Mực Tàu Đen Tuyền
              </span>
            </div>

            {!hasRelic('muc_tau') ? (
              <button
                type="button"
                onClick={handleCollect}
                className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-serif font-bold rounded shadow-lg transition"
              >
                Thu Nhận Mực Tàu ➔
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
