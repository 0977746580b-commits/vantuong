import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import { BottomDialogueBox } from './BottomDialogueBox';

interface FanRackModalProps {
  onClose: () => void;
}

export const FanRackModal: React.FC<FanRackModalProps> = ({ onClose }) => {
  const content = (
    <div className="space-y-2.5">
      <div className="p-2.5 bg-amber-950/40 rounded border border-amber-800/60 flex items-start gap-2.5">
        <span className="text-xl">🪭</span>
        <div>
          <p className="font-bold text-amber-200 text-xs">
            Lịch sử Nghề Quạt Thăng Long
          </p>
          <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
            Phố Hàng Quạt xưa kia là nơi hội tụ của những thợ quạt tài hoa gốc làng Chàng Sơn (Thạch Thất). Họ lập nên <strong>Đình Xuân Phiến Thị</strong> (nghĩa là "Chợ quạt mùa xuân") để thờ tổ nghề và làm nơi quy tụ bán quạt giấy dó, quạt nan tre trứ danh khắp xứ Kinh kỳ.
          </p>
        </div>
      </div>

      {/* 3 loại quạt trưng bày trên giá */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-0.5">
        <div className="p-2 bg-[#2a221b] border border-stone-700/80 rounded text-center">
          <span className="text-lg">🎋</span>
          <h4 className="font-bold text-amber-300 text-xs mt-0.5">Quạt Giấy Dó Châm Kim</h4>
          <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">
            Dùng kim đục các lỗ nhỏ li ti tạo thành hình hoa sen hoặc chữ Nôm. Khi soi quạt lên trước ánh sáng, các tia nắng lấp lánh như ngàn vì sao.
          </p>
        </div>

        <div className="p-2 bg-[#2a221b] border border-stone-700/80 rounded text-center">
          <span className="text-lg">🌸</span>
          <h4 className="font-bold text-amber-300 text-xs mt-0.5">Quạt Gấm Thêu Cung Đình</h4>
          <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">
            Làm từ nan trúc uốn cong, dán lụa gấm Hàng Gai thêu hình phượng vũ, tùng hạc dành cho các bậc vương tôn quý tộc chốn hoàng thành.
          </p>
        </div>

        <div className="p-2 bg-[#2a221b] border border-stone-700/80 rounded text-center">
          <span className="text-lg">🖌️</span>
          <h4 className="font-bold text-amber-300 text-xs mt-0.5">Quạt Thơ Sơn Thủy</h4>
          <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">
            Các văn nhân kẻ sĩ thường dùng bút lông đề thơ, vẽ tranh thủy mặc lên mặt quạt để tặng bạn tri âm trong những đêm đàm đạo.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <BottomDialogueBox
      isOpen={true}
      speaker="Giá Quạt Cổ Phố Nghề Hàng Quạt & Đình Xuân Phiến Thị"
      speakerRole="Tư Liệu Văn Hóa"
      avatarIcon={<BookOpen className="w-3.5 h-3.5" />}
      content={content}
      hint="Gợi ý từ thợ già: Bàn gỗ ở giữa phòng là nơi lưu giữ 5 chiếc nan quạt trúc cổ mang dấu ấn Thanh Hổ (Mộc). Hãy đến đó để ghép hoàn chỉnh hình mẫu!"
      onClose={onClose}
    />
  );
};
