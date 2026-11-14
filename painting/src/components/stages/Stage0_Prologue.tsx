import React, { useState, useEffect } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { sounds } from '../../utils/soundEngine';
import { Compass, Footprints, Eye, ArrowRight } from 'lucide-react';

export const Stage0_Prologue: React.FC = () => {
  const { setStage } = useGameState();
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Tự động phát tiếng guốc mộc nhẹ lúc mở màn
    const timer = setTimeout(() => {
      sounds.playWoodClop();
      setTimeout(() => sounds.playWoodClop(), 400);
      setTimeout(() => sounds.playWoodClop(), 800);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const storyPages = [
    {
      title: 'Tỉnh Giấc Giữa Phố Cổ Thăng Long',
      paragraphs: [
        'Tiếng guốc gỗ lộc cộc vang lên đâu đó phía sau... Tôi từ từ mở mắt.',
        'Trước mặt tôi là một con phố xa lạ. Những mái ngói nâu sẫm rêu phong nối tiếp nhau, biển hiệu gỗ đung đưa kẽo kẹt trước hiên nhà.',
        'Từ những cửa hiệu hai bên đường, tiếng người trò chuyện, tiếng dụng cụ chạm vào mặt gỗ và cả mùi mực ngai ngái hòa lẫn trong không khí ẩm lành lạnh.'
      ],
      icon: <Footprints className="w-8 h-8 text-amber-500 animate-bounce" />
    },
    {
      title: 'Chiếc Bóng Vô Hình Giữa Dòng Người',
      paragraphs: [
        'Một người đàn ông đi ngang qua tôi, tay ôm một xấp giấy lớn. Tôi vội bước sang bên nhường đường, nhưng ông ta chẳng hề phản ứng.',
        'Tôi thử gọi, rồi đưa tay về phía người đi đường gần nhất. Không ai dừng lại. Họ cứ thế lướt qua xuyên qua tôi, như thể tôi chỉ là một chiếc bóng vô hình giữa con phố đông đúc...',
        'Tôi bắt đầu cảm thấy bất an tột độ. Đây là đâu? Thời gian nào?'
      ],
      icon: <Eye className="w-8 h-8 text-red-500 animate-pulse" />
    },
    {
      title: 'Bức Dị Bản Tại Cửa Hiệu Cuối Phố',
      paragraphs: [
        'Ở phía cuối con đường, một cửa hiệu nhỏ thu hút sự chú ý của tôi. Trước hiên treo vài bức tranh dân gian đã ngả màu thời gian.',
        'Tôi tiến lại gần. Những đường nét in đậm bằng mực đen, những mảng màu được tô vờn bằng tay khiến tôi chợt giật mình nhớ lại:',
        'Chính là hiện vật trong phòng triển lãm mà tôi đã chạm vào trước khi mọi thứ vụt tan biến! Trên bức tranh, năm con hổ thần hiện lên uy dũng nhưng lại mang những đường nét lạ lùng... một bức Dị Bản!'
      ],
      icon: <Compass className="w-8 h-8 text-amber-600 animate-spin" />
    }
  ];

  const handleNext = () => {
    sounds.playWoodClop();
    if (step < storyPages.length - 1) {
      setStep(step + 1);
    } else {
      sounds.playBell();
      setStage('INSPECT_TIGER');
    }
  };

  const current = storyPages[step];

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 animate-fadeIn">
      <div className="bg-dopaper-texture wood-frame max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative rounded">
        {/* Con dấu triện son trang trí góc */}
        <div className="absolute top-4 right-4 cinnabar-seal w-12 h-12 rounded rotate-6 text-xs">
          THĂNG<br />LONG
        </div>

        <div className="flex items-center gap-3 mb-6 border-b-2 border-[#b8894a] pb-4">
          <div className="p-3 bg-amber-100/80 rounded-full border border-amber-300 shadow">
            {current.icon}
          </div>
          <div>
            <span className="text-xs font-serif uppercase tracking-widest text-amber-800 font-bold">
              Phần {step + 1} / {storyPages.length}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#b91c1c]">
              {current.title}
            </h2>
          </div>
        </div>

        <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed text-[#2d2926] min-h-[160px]">
          {current.paragraphs.map((p, idx) => (
            <p key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 150}ms` }}>
              {p}
            </p>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-amber-300/80 flex items-center justify-between">
          <div className="flex gap-1.5">
            {storyPages.map((_, i) => (
              <span
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === step ? 'bg-[#b91c1c] scale-125' : 'bg-stone-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 font-serif font-bold text-sm sm:text-base rounded shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{step === storyPages.length - 1 ? 'Tiến Lại Soi Tranh Ngũ Hổ' : 'Tiếp tục bước đi'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
