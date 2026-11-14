import React, { useState } from 'react';
import { useGameState } from '../../../context/GameStateContext';
import { sounds } from '../../../utils/soundEngine';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Flame,
  Droplet,
  Trees,
  CircleDot,
  Mountain,
  Lock,
  Scroll,
  HelpCircle,
  Check,
} from 'lucide-react';
import { RelicId } from '../../../types/game';

export const PuzzleDongHuong: React.FC = () => {
  const { collectRelic, completeLocation, setStage, hasRelic } = useGameState();

  // 5 Thẻ gỗ khắc dấu ấn Ngũ Hành tương ứng với 4 đạo cụ đã thu thập + Bàn thờ trung tâm
  const pedestals: {
    id: string;
    tokenNum: number;
    name: string;
    direction: string;
    element: string;
    tiger: string;
    requiredItem: string;
    requiredRelicId?: RelicId;
    icon: React.ReactNode;
    color: string;
    pattern: string;
    desc: string;
  }[] = [
    {
      id: 'Thủy',
      tokenNum: 4,
      name: 'Thẻ Thủy (Bắc Phương)',
      direction: 'Phương Bắc',
      element: 'Hành Thủy',
      tiger: 'Hắc Hổ',
      requiredItem: 'Phẩm Màu (Hiệu Tơ Lụa Hàng Gai)',
      requiredRelicId: 'pham_mau',
      icon: <Droplet className="w-5 h-5 text-blue-400" />,
      color: '#2563eb',
      pattern: 'Họa tiết sóng nước cuồn cuộn & dải lụa',
      desc: 'Nơi dòng nước trong trẻo hòa tan sắc tố tự nhiên nhuộm nên muôn màu rực rỡ.',
    },
    {
      id: 'Mộc',
      tokenNum: 1,
      name: 'Thẻ Mộc (Đông Phương)',
      direction: 'Phương Đông',
      element: 'Hành Mộc',
      tiger: 'Thanh Hổ',
      requiredItem: 'Giấy Dó (Đình Xuân Phiến Thị)',
      requiredRelicId: 'giay_do',
      icon: <Trees className="w-5 h-5 text-emerald-400" />,
      color: '#059669',
      pattern: 'Họa tiết nan tre & vân gió mây cổ',
      desc: 'Nơi cây tre ngâm vót thành nan quạt và lớp giấy dó thảo mộc bền bỉ ngàn năm.',
    },
    {
      id: 'Hỏa',
      tokenNum: 2,
      name: 'Thẻ Hỏa (Nam Phương)',
      direction: 'Phương Nam',
      element: 'Hành Hỏa',
      tiger: 'Xích Hổ',
      requiredItem: 'Mực Tàu (Hiệu Phục Sức Mã Vĩ)',
      requiredRelicId: 'muc_tau',
      icon: <Flame className="w-5 h-5 text-red-400" />,
      color: '#dc2626',
      pattern: 'Họa tiết ngọn lửa bùng cháy & mặt nạ tuồng',
      desc: 'Nơi muội than dầu thông luyện qua lửa đỏ đúc thành thỏi mực đen tuyền óng ả.',
    },
    {
      id: 'Kim',
      tokenNum: 3,
      name: 'Thẻ Kim (Tây Phương)',
      direction: 'Phương Tây',
      element: 'Hành Kim',
      tiger: 'Bạch Hổ',
      requiredItem: 'Ván Khắc Gỗ (Xưởng Tranh Hàng Trống)',
      requiredRelicId: 'van_khac',
      icon: <CircleDot className="w-5 h-5 text-slate-300" />,
      color: '#94a3b8',
      pattern: 'Họa tiết lưỡi dao khắc chạm mộc bản',
      desc: 'Nơi mũi đục thép tôi sắc bén chạm trổ nên những đường viền nét đen thần thái.',
    },
    {
      id: 'Thổ',
      tokenNum: 5,
      name: 'Thẻ Thổ (Trung Ương)',
      direction: 'Trung Tâm',
      element: 'Hành Thổ',
      tiger: 'Hoàng Hổ',
      requiredItem: 'Bàn Thờ Đình Đông Hương (Cội nguồn Ngũ Hổ)',
      icon: <Mountain className="w-5 h-5 text-amber-400" />,
      color: '#d97706',
      pattern: 'Họa tiết Hoàng Hổ uy phong & rồng cuộn cột đình',
      desc: 'Đất mẹ linh thiêng ngự giữa đình làng, nơi hội tụ năng lượng của bốn phương trời.',
    },
  ];

  // Trạng thái các bệ đã được kích hoạt
  const [activatedPedestals, setActivatedPedestals] = useState<string[]>(
    hasRelic('but_long') ? ['Mộc', 'Hỏa', 'Kim', 'Thủy', 'Thổ'] : []
  );
  const [isSolved, setIsSolved] = useState(hasRelic('but_long'));
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Kiểm tra điều kiện kích hoạt từng thẻ ấn
  const canActivatePedestal = (ped: (typeof pedestals)[0]): boolean => {
    if (ped.requiredRelicId) {
      return hasRelic(ped.requiredRelicId);
    }
    // Bệ Thổ trung tâm yêu cầu 4 bệ kia đã kích hoạt
    return (
      activatedPedestals.includes('Mộc') &&
      activatedPedestals.includes('Hỏa') &&
      activatedPedestals.includes('Kim') &&
      activatedPedestals.includes('Thủy')
    );
  };

  const handleActivate = (ped: (typeof pedestals)[0]) => {
    if (!canActivatePedestal(ped)) {
      sounds.playClick();
      setWarningMsg(
        ped.requiredRelicId
          ? `Bạn chưa có "${ped.requiredItem}". Hãy mở Bản Đồ [M] ghé địa điểm phường nghề tương ứng để giải đố và thu thập đạo cụ này trước!`
          : 'Hãy đặt đủ 4 thẻ ấn phương vị Mộc (Đông), Hỏa (Nam), Kim (Tây), Thủy (Bắc) trước khi kích hoạt Thẻ Thổ Trung Tâm!'
      );
      return;
    }

    setWarningMsg(null);
    sounds.playBell();
    if (!activatedPedestals.includes(ped.id)) {
      const updated = [...activatedPedestals, ped.id];
      setActivatedPedestals(updated);

      if (updated.length === 5) {
        sounds.playSuccess();
        setIsSolved(true);
        completeLocation('dong_huong');
        collectRelic('but_long');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#059669', '#dc2626', '#94a3b8', '#2563eb', '#d97706'],
          });
        } catch {
          // ignore
        }
      }
    }
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
            <span className="text-[11px] font-serif font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
              Đình Đông Hương
            </span>
            <span className="text-xs font-serif text-stone-600">Đạo cụ: Bút Lông Cổ Truyền</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold font-serif text-[#b91c1c] mt-1">
            ĐÌNH ĐÔNG HƯƠNG: KÍCH HOẠT NĂM PHƯƠNG VỊ VÀ MỞ TRÁP GỖ CỔ
          </h2>
          <p className="text-xs text-stone-700 font-serif mt-0.5 italic">
            "Không gian tĩnh mịch, mùi hương trầm thoang thoảng trong gió. Trước ban thờ là chiếc tráp gỗ cổ khóa bằng then đồng chạm rồng ngũ sắc..."
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-400 rounded text-xs font-serif font-bold text-stone-800 shadow transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Chỉ Dẫn Ngũ Hành</span>
          </button>

          <button
            onClick={handleReturnSafezone}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#b8894a] rounded text-xs text-amber-200 transition shadow"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Phố Cổ</span>
          </button>
        </div>
      </div>

      {/* Lời thoại nghe được từ cụ từ đình theo plot */}
      <div className="w-full bg-amber-950/20 border-l-4 border-amber-600 p-2.5 rounded text-xs font-serif text-amber-200/90 mb-3 space-y-1">
        <p className="font-bold text-amber-300">Lời cụ từ trầm ngâm trước ban thờ:</p>
        <p className="italic">
          "Tranh Ngũ Hổ không chỉ là tranh thờ, mà là sự hòa hợp của ngũ phương và ngũ hành. Muốn mở được tráp cổ của tiền nhân, phải dâng đủ bốn khí chất từ bốn phường nghề quanh kinh thành rồi mới khai thông trung tâm."
        </p>
      </div>

      {/* Hộp chỉ dẫn mối liên hệ Ngũ Hành */}
      {showGuide && (
        <div className="w-full bg-[#f4ebd0] border-2 border-[#b8894a] p-3 rounded text-stone-800 font-serif text-xs mb-3 shadow animate-fadeIn relative">
          <button
            type="button"
            onClick={() => setShowGuide(false)}
            className="absolute top-2 right-2 text-stone-500 hover:text-stone-800 font-bold"
          >
            ✕
          </button>
          <div className="flex items-center gap-1.5 text-[#b91c1c] font-bold mb-1">
            <Scroll className="w-4 h-4" />
            <span>Quy Luật Khai Quang Bệ Thờ Ngũ Phương:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-stone-700 leading-relaxed">
            <li>
              <strong className="text-emerald-800">Phương Đông (Hành Mộc):</strong> Ứng với Thanh Hổ — Đạo cụ Giấy Dó tại Đình Xuân Phiến Thị.
            </li>
            <li>
              <strong className="text-red-800">Phương Nam (Hành Hỏa):</strong> Ứng với Xích Hổ — Đạo cụ Mực Tàu tại Hiệu Phục Sức Mã Vĩ.
            </li>
            <li>
              <strong className="text-slate-800">Phương Tây (Hành Kim):</strong> Ứng với Bạch Hổ — Đạo cụ Ván Khắc Gỗ tại Xưởng Tranh Hàng Trống.
            </li>
            <li>
              <strong className="text-blue-800">Phương Bắc (Hành Thủy):</strong> Ứng với Hắc Hổ — Đạo cụ Phẩm Màu tại Hiệu Tơ Lụa Hàng Gai.
            </li>
            <li>
              <strong className="text-amber-800">Trung Tâm (Hành Thổ):</strong> Ứng với Hoàng Hổ — Bàn thờ Đình Đông Hương (chỉ mở khi 4 phương đã sáng).
            </li>
          </ul>
        </div>
      )}

      {warningMsg && (
        <div className="w-full p-2.5 mb-3 bg-red-100 border border-red-400 text-red-900 rounded font-serif text-xs text-center animate-fadeIn shadow-sm">
          ⚠️ {warningMsg}
        </div>
      )}

      {/* Không Gian Bàn Thờ & 5 Bệ Thờ Ngũ Hành */}
      <div className="w-full bg-[#18130f] p-4 sm:p-5 rounded-lg wood-frame shadow-2xl flex flex-col items-center">
        <div className="text-center mb-3">
          <span className="cinnabar-seal text-xs px-3.5 py-1 rounded text-amber-200 font-serif font-bold uppercase tracking-wider">
            ĐÌNH ĐÔNG HƯƠNG • NƠI HỘI TỤ NGŨ HỔ
          </span>
          <p className="text-[11px] text-stone-400 font-serif mt-1">
            Nhấp dâng từng thẻ ấn vào 5 vị trí tương ứng để giải phóng phong ấn trên tráp gỗ cổ
          </p>
        </div>

        {/* Tranh minh họa 5 thẻ gỗ dấu ấn Ngũ Hành Đông Hương */}
        <div className="w-full bg-[#1e1915] p-2.5 rounded-lg border-2 border-amber-800 shadow-xl mb-3 flex flex-col items-center">
          <div className="w-full flex items-center justify-between text-xs font-serif font-bold text-amber-200 mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NĂM THẺ GỖ KHẮC DẤU ẤN NGŨ HÀNH TẠI ĐÌNH ĐÔNG HƯƠNG:</span>
            </span>
            <span className="text-[11px] text-amber-400 font-normal italic">
              Mộc (Đông) • Hỏa (Nam) • Kim (Tây) • Thủy (Bắc) • Thổ (Trung Tâm)
            </span>
          </div>
          <div className="w-full rounded flex items-center justify-center bg-[#120f0d] p-2 border border-amber-700/60 shadow-inner">
            <img
              src="./assets/puzzle5_dong_huong_wooden_tiles.png"
              alt="Năm thẻ gỗ ngũ hành Đình Đông Hương"
              className="max-w-full max-h-[420px] w-auto h-auto object-contain rounded drop-shadow"
            />
          </div>
        </div>

        {/* 5 Thẻ Ngũ Hành bố trí theo 5 phương vị */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 w-full mb-3">
          {pedestals.map((ped) => {
            const isAct = activatedPedestals.includes(ped.id);
            const unlocked = canActivatePedestal(ped);
            return (
              <div
                key={ped.id}
                className={`p-3 rounded-lg border-2 transition-all flex flex-col justify-between ${
                  isAct
                    ? 'bg-amber-100/95 border-amber-500 shadow-md ring-2 ring-amber-400/50'
                    : unlocked
                    ? 'bg-[#2b241e] border-amber-600/80 text-stone-200 hover:border-amber-400'
                    : 'bg-[#201a15]/90 border-stone-800 text-stone-400 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={`p-1.5 rounded-full ${
                        isAct ? 'bg-amber-200' : 'bg-stone-800'
                      }`}
                    >
                      {ped.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/40 text-amber-300 font-mono">
                          #{ped.tokenNum}
                        </span>
                        <h4
                          className={`font-bold font-serif text-xs truncate ${
                            isAct ? 'text-[#b91c1c]' : 'text-amber-200'
                          }`}
                        >
                          {ped.name}
                        </h4>
                      </div>
                      <span className="text-[10px] text-stone-400 font-serif block">
                        {ped.direction} • {ped.tiger}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-serif text-stone-400 mb-1">
                    <span className="text-amber-400/90 font-semibold">Hoa văn:</span>{' '}
                    {ped.pattern}
                  </div>

                  <p className="text-[10px] font-serif text-stone-500 mb-2 italic leading-relaxed">
                    {ped.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleActivate(ped)}
                  disabled={isAct}
                  className={`w-full py-1.5 rounded text-xs font-serif font-bold transition flex items-center justify-center gap-1 shadow active:scale-95 ${
                    isAct
                      ? 'bg-emerald-700 text-white cursor-default'
                      : unlocked
                      ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 animate-pulse'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  {isAct ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
                      <span>Đã Khai Quang</span>
                    </>
                  ) : unlocked ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                      <span>Dâng Thẻ Khai Quang</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-stone-500" />
                      <span>Chưa Đủ Khí Chất</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Thanh trạng thái tiến độ */}
        {!isSolved && (
          <div className="w-full flex items-center justify-center pt-2 border-t border-stone-800 text-[11px] font-serif text-stone-400">
            <span>
              Đã kích hoạt: <strong className="text-amber-300">{activatedPedestals.length} / 5</strong> dấu ấn bệ thờ Ngũ Phương.
            </span>
          </div>
        )}

        {/* PHẦN KẾT QUẢ GDD: TRÁP GỖ BẬT MỞ, LỘ CÂY BÚT LÔNG VÀ BÀI THƠ 4 CÂU */}
        {isSolved && (
          <div className="p-4 bg-amber-50 border-2 border-amber-500 rounded-lg text-center max-w-xl w-full animate-fadeIn shadow-2xl mt-2">
            <div className="flex items-center justify-center gap-2 text-[#b91c1c] font-bold font-serif mb-1.5 text-sm sm:text-base">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>NĂM KÝ HIỆU ĐỒNG LOẠT BỪNG SÁNG — TRÁP GỖ BẬT MỞ!</span>
            </div>

            <p className="text-xs text-stone-700 font-serif leading-relaxed mb-3">
              "Những đường khắc trên nắp hộp bắt đầu chuyển động, chiếc khóa đồng từ từ bật mở... Bên trong là một cây bút lông được đặt ngay ngắn trên lớp vải cũ."
            </p>

            {/* Bài thơ 4 câu khắc trên thành hộp từ GDD */}
            <div className="p-3 bg-amber-100/90 rounded border border-amber-300 font-serif text-xs text-stone-900 italic space-y-1 mb-3 text-center shadow-inner">
              <div className="font-bold text-[#b91c1c] not-italic flex items-center justify-center gap-1 mb-1">
                <Scroll className="w-3.5 h-3.5" />
                <span>Dòng Chữ Cổ Khắc Trên Thành Hộp:</span>
              </div>
              <p>"Ngũ phương quy nhất khí,"</p>
              <p>"Họa sắc định càn khôn."</p>
              <p>"Mực tàn theo năm tháng,"</p>
              <p>"Nét vẽ vẫn trường tồn."</p>
            </div>

            <div className="p-3 bg-white rounded border border-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="text-left">
                <span className="text-[11px] font-bold text-emerald-900 block font-serif">
                  🎉 THU THẬP THÀNH CÔNG ĐẠO CỤ CUỐI CÙNG (#5):
                </span>
                <span className="text-sm font-bold text-[#b91c1c] font-serif">
                  Cây Bút Lông Cổ Truyền
                </span>
              </div>

              <button
                type="button"
                onClick={handleReturnSafezone}
                className="px-4 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-serif font-bold rounded shadow-lg border border-amber-300 transition shrink-0 active:scale-95"
              >
                Nhận Bút Lông ➔ Về Phố Cổ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
