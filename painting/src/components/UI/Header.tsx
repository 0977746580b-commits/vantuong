import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { sounds } from '../../utils/soundEngine';
import { Volume2, VolumeX, BookOpen, RotateCcw, MapPin } from 'lucide-react';

export const Header: React.FC = () => {
  const { stage, setStage, inventory, setJournalOpen, resetGame } = useGameState();
  const [muted, setMuted] = React.useState(false);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setMuted(!sounds.enabled);
    if (sounds.enabled) sounds.playClick();
  };

  const getStageTitle = () => {
    switch (stage) {
      case 'PROLOGUE': return 'Chương Mở Đầu: Lạc Bước Phố Cổ';
      case 'INSPECT_TIGER': return 'Nhiệm Vụ 01: Dị Bản Ngũ Hổ';
      case 'OLD_QUARTER_MAP': return 'Họa Đồ Thăng Long 36 Phố Phường';
      case 'LOCATION_PUZZLE': return 'Khám Phá Phố Nghề Di Sản';
      case 'DECOY_LOCATION': return 'Góc Nhỏ Phố Cổ';
      case 'PRINTING_WORKSHOP': return 'Xưởng Tranh: Kỹ Thuật Nửa In Nửa Vẽ';
      case 'POEM_CIPHER': return 'Nhiệm Vụ 02: Mật Mã Bát Quái Phương Vị';
      case 'EPILOGUE': return 'Hồi Kết: Lý Ngư Vọng Nguyệt';
      default: return 'Tranh Dân Gian Hàng Trống';
    }
  };

  return (
    <header className="w-full bg-[#1e1b18] border-b-2 border-[#b8894a] text-[#f5eedb] px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="cinnabar-seal w-9 h-9 rounded text-sm font-bold bg-[#991b1b] text-amber-200 border-amber-600">
          HT
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-wider text-amber-200">
            TRANH HÀNG TRỐNG: DẤU VẾT NGŨ HỔ
          </h1>
          <p className="text-xs text-[#cfa56b] flex items-center gap-1 font-serif">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {getStageTitle()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Nút quay lại bản đồ nếu đang ở các màn chơi khác sau khi đã mở khóa bản đồ */}
        {(stage === 'LOCATION_PUZZLE' || stage === 'DECOY_LOCATION') && (
          <button
            onClick={() => setStage('OLD_QUARTER_MAP')}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#b8894a] rounded text-xs text-amber-200 transition"
            title="Quay lại Bản đồ"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bản đồ</span>
          </button>
        )}

        {/* Nút Sổ tay ghi chép */}
        <button
          onClick={() => { sounds.playClick(); setJournalOpen(true); }}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#b8894a] rounded text-xs text-amber-200 transition"
          title="Mở Sổ tay Ký ức"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Sổ tay</span>
          <span className="bg-[#b91c1c] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
            {inventory.length}/5
          </span>
        </button>

        {/* Nút Âm thanh */}
        <button
          onClick={toggleSound}
          className="p-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#8b6f47] rounded text-amber-200 transition"
          title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
        </button>

        {/* Nút Chơi lại */}
        <button
          onClick={() => {
            if (window.confirm('Bạn có muốn bắt đầu lại hành trình từ đầu không?')) {
              resetGame();
            }
          }}
          className="p-1.5 bg-[#2d2823] hover:bg-[#3d3630] border border-[#8b6f47] rounded text-[#cfa56b] hover:text-amber-200 transition"
          title="Bắt đầu lại"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
