import React from 'react';
import { useGameState } from '../../context/GameStateContext';
import { TIGER_ANOMALIES } from '../../data/tigerAnomalies';
import { BookOpen, X, CheckCircle, HelpCircle } from 'lucide-react';

export const JournalModal: React.FC = () => {
  const { journalOpen, setJournalOpen, discoveredAnomalies, inventory, completedLocations } = useGameState();

  if (!journalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-dopaper-texture wood-frame max-w-2xl w-full p-6 text-[#2b2520] relative rounded shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b-2 border-[#b8894a] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#b91c1c]" />
            <h2 className="text-xl font-bold font-serif text-[#b91c1c]">
              SỔ TAY KÝ ỨC THĂNG LONG
            </h2>
          </div>
          <button
            onClick={() => setJournalOpen(false)}
            className="p-1 rounded-full hover:bg-stone-300 text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-5 pr-2 font-serif text-sm">
          {/* Mục tiêu hiện tại */}
          <section className="bg-amber-100/60 p-3 rounded border border-amber-300">
            <h3 className="font-bold text-[#b91c1c] mb-1 uppercase tracking-wider text-xs">
              Sứ mệnh của bạn:
            </h3>
            <p className="text-stone-800 leading-relaxed text-xs sm:text-sm">
              Tìm lại 5 đạo cụ in tranh thất lạc (Giấy dó, Mực Tàu, Ván khắc, Phẩm màu, Bút lông) tương ứng với Ngũ Hổ và Ngũ Hành, phục dựng lại bản in tranh cổ và giải mã bài thơ ẩn giấu.
            </p>
          </section>

          {/* Dấu vết 5 thần hổ */}
          <section>
            <h3 className="font-bold text-amber-900 border-b border-amber-300 pb-1 mb-3 uppercase tracking-wider text-xs flex items-center justify-between">
              <span>Manh Mối Dị Bản Ngũ Hổ ({discoveredAnomalies.length}/5)</span>
            </h3>
            <div className="space-y-2">
              {TIGER_ANOMALIES.map(anomaly => {
                const found = discoveredAnomalies.includes(anomaly.id);
                return (
                  <div
                    key={anomaly.id}
                    className={`p-2.5 rounded border ${
                      found ? 'bg-amber-50 border-amber-300' : 'bg-stone-200/50 border-stone-300 text-stone-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="flex items-center gap-1.5" style={{ color: found ? anomaly.colorCode : '#78716c' }}>
                        {found ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <HelpCircle className="w-3.5 h-3.5 text-stone-400" />}
                        {anomaly.tigerName} ({anomaly.element} - {anomaly.direction})
                      </span>
                      {found && (
                        <span className="text-[11px] bg-amber-200 px-1.5 py-0.5 rounded text-amber-900">
                          {anomaly.relicName}
                        </span>
                      )}
                    </div>
                    {found ? (
                      <div className="mt-1 text-xs text-stone-700">
                        <p><strong>Ý nghĩa biểu tượng:</strong> {anomaly.anomalyDesc}</p>
                        <p className="text-amber-800 mt-0.5"><strong>Suy luận:</strong> {anomaly.deductionHint}</p>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs italic">Chưa khám phá biểu tượng Thần Hổ này trên tranh bản chính...</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Tiến độ thu thập */}
          <section>
            <h3 className="font-bold text-amber-900 border-b border-amber-300 pb-1 mb-2 uppercase tracking-wider text-xs">
              Tiến Độ Thu Thập Đạo Cụ ({inventory.length}/5)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded border ${inventory.includes('giay_do') ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold' : 'bg-stone-100 border-stone-300 text-stone-400'}`}>
                📄 Giấy Dó (Mộc)
              </div>
              <div className={`p-2 rounded border ${inventory.includes('muc_tau') ? 'bg-red-50 border-red-400 text-red-900 font-bold' : 'bg-stone-100 border-stone-300 text-stone-400'}`}>
                💧 Mực Tàu (Hỏa)
              </div>
              <div className={`p-2 rounded border ${inventory.includes('van_khac') ? 'bg-slate-100 border-slate-400 text-slate-900 font-bold' : 'bg-stone-100 border-stone-300 text-stone-400'}`}>
                🪵 Ván Khắc Gỗ (Kim)
              </div>
              <div className={`p-2 rounded border ${inventory.includes('pham_mau') ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold' : 'bg-stone-100 border-stone-300 text-stone-400'}`}>
                🎨 Phẩm Màu (Thủy)
              </div>
              <div className={`p-2 rounded border ${inventory.includes('but_long') ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold' : 'bg-stone-100 border-stone-300 text-stone-400'}`}>
                🖌️ Bút Lông (Thổ)
              </div>
            </div>
          </section>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-300 text-center">
          <button
            onClick={() => setJournalOpen(false)}
            className="px-6 py-1.5 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 rounded text-sm font-serif transition"
          >
            Đóng Sổ Tay
          </button>
        </div>
      </div>
    </div>
  );
};
