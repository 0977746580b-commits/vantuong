import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useGameState } from '../../context/GameStateContext';
import { sounds } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Layers,
  RotateCcw,
  Hand,
  CheckCircle2,
  Compass,
  ArrowRight,
  Move,
  Eye,
  Info,
} from 'lucide-react';

export const Stage4_PrintingWorkshop: React.FC = () => {
  const { setStage } = useGameState();

  // 5 bước quy trình in tranh Hàng Trống:
  // 1: Quét sạch mạt cưa
  // 2: Phủ mực Tàu
  // 3: Căn chỉnh giấy dó
  // 4: Miết con quay mực
  // 5: Bóc tách bản in
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Tiến trình cho các bước
  const [cleanCoverage, setCleanCoverage] = useState<number>(0);
  const [inkCoverage, setInkCoverage] = useState<number>(0);
  const [rubCoverage, setRubCoverage] = useState<number>(0);
  const [peelPercent, setPeelPercent] = useState<number>(0);
  const [isPaperSnapped, setIsPaperSnapped] = useState<boolean>(false);
  const [paperOffset, setPaperOffset] = useState<{ x: number; y: number }>({ x: 30, y: -40 });
  const [isDraggingPaper, setIsDraggingPaper] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  // Canvas refs cho tương tác cọ và mực
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPointerDownRef = useRef<boolean>(false);
  const isDraggingPaperRef = useRef<boolean>(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const boardContainerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Reset hoặc khởi tạo canvas khi chuyển bước
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentStep === 1) {
      // BƯỚC 1: LỚP BỤI MÙN CƯA PHỦ TRÊN VÁN GỖ
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(180, 140, 90, 0.88)'; // Màu mùn cưa vàng nâu gỗ
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Thêm các đốm hạt mạt cưa ngẫu nhiên
      ctx.fillStyle = 'rgba(120, 80, 40, 0.45)';
      for (let i = 0; i < 600; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (currentStep === 2) {
      // BƯỚC 2: KHỞI TẠO LỚP TRẮNG TRONG SUỐT ĐỂ TÔ VỆT MỰC ĐEN
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (currentStep === 4) {
      // BƯỚC 4: MẶT LƯNG GIẤY DÓ CHƯA NGẤM MỰC
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [currentStep]);

  // Tính toán tỷ lệ diện tích đã tương tác trên Canvas
  const calculateCoverage = useCallback((mode: 'clean' | 'ink' | 'rub') => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    // Lấy mẫu điểm để kiểm tra hiệu năng cao
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    let matchedPixels = 0;
    const totalSampled = (canvas.width * canvas.height) / 16; // Bước nhảy 4x4

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];

        if (mode === 'clean') {
          // Bụi bị xóa thì alpha giảm
          if (alpha < 80) matchedPixels++;
        } else if (mode === 'ink' || mode === 'rub') {
          // Mực được quét lên thì alpha tăng
          if (alpha > 120) matchedPixels++;
        }
      }
    }

    const percent = Math.min(100, Math.round((matchedPixels / totalSampled) * 100));
    return percent;
  }, []);

  // Xử lý tương tác vẽ cọ / lăn con quay / quét bụi
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    isPointerDownRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    lastPosRef.current = { x, y };

    if (currentStep === 1) {
      sounds.playBrushSweep();
    } else if (currentStep === 2) {
      sounds.playBrushSweep();
    } else if (currentStep === 4) {
      sounds.playPaperRub();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    const last = lastPosRef.current || { x, y };

    ctx.save();
    if (currentStep === 1) {
      // BƯỚC 1: QUÉT BỤI BẰNG CHỔI LÔNG (XÓA LỚP MÙN CƯA)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 36;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      const cov = calculateCoverage('clean');
      setCleanCoverage(cov);
      if (cov >= 80 && cleanCoverage < 80) {
        sounds.playSuccess();
      }
    } else if (currentStep === 2) {
      // BƯỚC 2: PHẾT MỰC TÀU ĐEN TUYỀN
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(15, 12, 10, 0.92)'; // Mực Tàu đen tuyền muội than
      ctx.lineWidth = 34;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      const cov = calculateCoverage('ink');
      setInkCoverage(cov);
      if (cov >= 80 && inkCoverage < 80) {
        sounds.playBell();
      }
    } else if (currentStep === 4) {
      // BƯỚC 4: LĂN CON QUAY MỰC LÀM MỰC THẨM THẤU QUA MẶT LƯNG GIẤY DÓ
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(28, 22, 18, 0.65)'; // Mực thẩm thấu qua thớ giấy dó
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      const cov = calculateCoverage('rub');
      setRubCoverage(cov);
      if (cov >= 80 && rubCoverage < 80) {
        sounds.playSuccess();
      }
    }
    ctx.restore();

    lastPosRef.current = { x, y };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPointerDownRef.current = false;
    lastPosRef.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
  };

  // BƯỚC 3: KÉO THẢ CĂN CHỈNH TỜ GIẤY DÓ KHỚP VÀO 4 CHỐT CỮ
  const snapPaperIntoPegs = () => {
    setPaperOffset({ x: 0, y: 0 });
    setIsPaperSnapped(true);
    isDraggingPaperRef.current = false;
    setIsDraggingPaper(false);
    sounds.playSuccess();
  };

  const handlePaperDragStart = (e: React.PointerEvent) => {
    if (isPaperSnapped) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDraggingPaperRef.current = true;
    setIsDraggingPaper(true);
    dragStartRef.current = {
      x: e.clientX - paperOffset.x,
      y: e.clientY - paperOffset.y,
    };
    sounds.playPaperRub();
  };

  const handlePaperDragMove = (e: React.PointerEvent) => {
    if (!isDraggingPaperRef.current || !dragStartRef.current || isPaperSnapped) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setPaperOffset({ x: newX, y: newY });

    // Kiểm tra khoảng cách so với cữ chuẩn (0, 0)
    const dist = Math.sqrt(newX * newX + newY * newY);
    if (dist < 32) {
      // Hít vào chốt cữ căn gỗ
      snapPaperIntoPegs();
    }
  };

  const handlePaperDragEnd = (e: React.PointerEvent) => {
    isDraggingPaperRef.current = false;
    setIsDraggingPaper(false);
    dragStartRef.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
  };

  // BƯỚC 5: KÉO BÓC TÁCH MÉP GIẤY DÓ BẰNG CHUỘT
  const handlePeelMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const container = boardContainerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();

    // Tính toán độ bóc tách dựa vào vị trí kéo chuột từ dưới lên trên
    const mouseY = e.clientY - rect.top;
    const height = rect.height;
    // Bóc từ dưới (height) lên trên (0)
    const peel = Math.max(0, Math.min(100, Math.round(((height - mouseY) / height) * 100)));
    setPeelPercent(peel);

    if (peel >= 75 && !isRevealed) {
      setIsRevealed(true);
      sounds.playSuccess();
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#b91c1c', '#f59e0b', '#10b981', '#3b82f6', '#fbbf24'],
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-5 animate-fadeIn max-w-4xl mx-auto w-full">
      {/* Header Giới Thiệu Quy Trình */}
      <div className="bg-dopaper-texture wood-frame p-3 sm:p-4 w-full rounded shadow-md mb-3 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-serif font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded border border-amber-300">
            Kỹ Thuật In Nét Mộc Bản Hàng Trống: Mô Phỏng Tay Nghề Thủ Công 100%
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-bold font-serif text-[#b91c1c] mt-0.5 uppercase tracking-wide">
          BƯỚC {currentStep} / 5:{' '}
          {currentStep === 1
            ? 'CẦM CHỔI LÔNG QUÉT SẠCH MẠT CƯA TRÊN VÁN GỖ'
            : currentStep === 2
            ? 'CẦM BÚT LÔNG PHẾT MỰC TÀU ĐỀU CÁC THỚ KHẮC'
            : currentStep === 3
            ? 'KÉO RÊ GIẤY DÓ KHỚP VÀO 4 CHỐT CỮ VÁN IN'
            : currentStep === 4
            ? 'DÙNG CON QUAY MỰC MIẾT CHO MỰC NGẤM QUA GIẤY'
            : 'NẮM MÉP GIẤY DÓ TỪ TỪ BÓC TÁCH BẢN IN'}
        </h2>
        <p className="text-xs text-stone-700 font-serif max-w-2xl mx-auto mt-0.5 italic">
          {currentStep === 1 &&
            'Dùng chuột rê chổi lông qua lại trên bề mặt ván gỗ để quét sạch lớp bụi mùn cưa còn đọng trong các khe khắc nổi.'}
          {currentStep === 2 &&
            'Nhúng bút lông vào bát mực Tàu đen tuyền, rê chuột quét mực đều tay phủ kín các rãnh gỗ nổi.'}
          {currentStep === 3 &&
            'Dùng chuột nhấn giữ tờ giấy dó kéo rê vào vị trí 4 chốt cữ gỗ ở góc ván in để giấy nằm phẳng phiu.'}
          {currentStep === 4 &&
            'Cầm con quay mực (con lăn) miết qua lại bằng chuột trên mặt lưng giấy, cảm nhận mực Tàu thẩm thấu qua từng thớ dó.'}
          {currentStep === 5 &&
            'Nhấn giữ góc dưới tờ giấy dó kéo trượt lên trên để bóc tách bản in và hé lộ 8 câu thơ cổ phát sáng!'}
        </p>
      </div>

      {/* Bàn Chế Tác In Tranh Tương Tác */}
      <div className="w-full bg-[#1c1815] p-3 sm:p-5 rounded-lg wood-frame shadow-2xl flex flex-col items-center">
        {/* VÙNG KHÔNG GIAN BÀN IN TRANH */}
        <div
          ref={boardContainerRef}
          className="relative w-full max-w-xl aspect-[4/3] bg-[#120f0d] rounded-lg border-4 border-[#b8894a] shadow-2xl overflow-hidden flex items-center justify-center select-none"
          onPointerDown={() => {
            if (currentStep === 5 && !isRevealed) {
              isPointerDownRef.current = true;
            }
          }}
          onPointerMove={(e) => {
            if (currentStep === 5 && !isRevealed) {
              handlePeelMove(e);
            }
          }}
          onPointerUp={() => {
            if (currentStep === 5) {
              isPointerDownRef.current = false;
            }
          }}
        >
          {/* Lớp nền ván gỗ khắc mộc Bạch Hổ / Ngũ Hổ */}
          <img
            src="./assets/step_1_clean_wood.png"
            alt="Mộc bản ván khắc gỗ Hàng Trống"
            className="absolute inset-0 w-full h-full object-contain p-2 pointer-events-none"
            draggable={false}
          />

          {/* BƯỚC 1: CANVAS QUÉT SẠCH MÙN CƯA BẰNG CHỔI LÔNG */}
          {currentStep === 1 && (
            <>
              <canvas
                ref={canvasRef}
                width={520}
                height={390}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
              />
              <div className="absolute top-2 left-2 z-20 bg-black/85 px-2.5 py-1 rounded border border-amber-500/80 text-[11px] font-serif text-amber-200 flex items-center gap-1.5 shadow">
                <Hand className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Rê chuột quét cọ khắp mặt ván: <strong>{cleanCoverage}% sạch bụi</strong></span>
              </div>
            </>
          )}

          {/* BƯỚC 2: CANVAS PHẾT MỰC TÀU ĐEN BÓNG BẰNG BÚT LÔNG */}
          {currentStep === 2 && (
            <>
              <canvas
                ref={canvasRef}
                width={520}
                height={390}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
              />
              <div className="absolute top-2 left-2 z-20 bg-black/85 px-2.5 py-1 rounded border border-amber-500/80 text-[11px] font-serif text-amber-200 flex items-center gap-1.5 shadow">
                <Hand className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Quét mực đều các thớ gỗ: <strong>{inkCoverage}% đẫm mực</strong></span>
              </div>
            </>
          )}

          {/* BƯỚC 3: KÉO THẢ TỜ GIẤY DÓ KHỚP VÀO 4 CHỐT CỮ */}
          {currentStep === 3 && (
            <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
              {/* 4 Chốt cữ gỗ ở 4 góc ván */}
              <div className="absolute top-4 left-4 w-5 h-5 rounded border-2 border-dashed border-amber-400 flex items-center justify-center text-[10px] text-amber-300 font-bold bg-amber-950/60">
                1
              </div>
              <div className="absolute top-4 right-4 w-5 h-5 rounded border-2 border-dashed border-amber-400 flex items-center justify-center text-[10px] text-amber-300 font-bold bg-amber-950/60">
                2
              </div>
              <div className="absolute bottom-4 left-4 w-5 h-5 rounded border-2 border-dashed border-amber-400 flex items-center justify-center text-[10px] text-amber-300 font-bold bg-amber-950/60">
                3
              </div>
              <div className="absolute bottom-4 right-4 w-5 h-5 rounded border-2 border-dashed border-amber-400 flex items-center justify-center text-[10px] text-amber-300 font-bold bg-amber-950/60">
                4
              </div>

              {/* Tờ giấy dó kéo rê */}
              <div
                onPointerDown={handlePaperDragStart}
                onPointerMove={handlePaperDragMove}
                onPointerUp={handlePaperDragEnd}
                onClick={() => {
                  if (!isPaperSnapped) snapPaperIntoPegs();
                }}
                style={{
                  transform: `translate(${paperOffset.x}px, ${paperOffset.y}px)`,
                  transition: isPaperSnapped ? 'all 0.3s ease-out' : 'none',
                }}
                className={`w-[85%] h-[85%] rounded border-2 shadow-2xl flex flex-col items-center justify-center cursor-grab active:cursor-grabbing p-3 select-none touch-none ${
                  isPaperSnapped
                    ? 'border-emerald-400 bg-[#f5edd6]/95 ring-4 ring-emerald-400/50'
                    : isDraggingPaper
                    ? 'border-amber-400 bg-[#fbf5e6]/80 scale-102 ring-2 ring-amber-300'
                    : 'border-stone-400 bg-[#fbf5e6]/75'
                }`}
              >
                <div className="text-center font-serif pointer-events-none">
                  {isPaperSnapped ? (
                    <div className="text-emerald-800 font-bold text-xs flex items-center gap-1.5 bg-emerald-100/90 px-3 py-1.5 rounded border border-emerald-400 shadow">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>ĐÃ CĂN PHẲNG VÀ KHỚP 4 CHỐT CỮ GỖ!</span>
                    </div>
                  ) : (
                    <div className="bg-black/75 text-amber-200 text-[11px] px-2.5 py-1.5 rounded border border-amber-400 shadow flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                      <span>Nhấn giữ & kéo rê giấy dó vào giữa 4 chốt cữ</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BƯỚC 4: LĂN CON QUAY MỰC LÊN MẶT LƯNG GIẤY DÓ */}
          {currentStep === 4 && (
            <>
              {/* Giấy dó phủ trên mặt ván */}
              <div className="absolute inset-0 bg-[#fbf5e6]/90 p-2 pointer-events-none flex items-center justify-center">
                <img
                  src="./assets/step_4_roller_ink.png"
                  alt="Miết con quay mực"
                  className="w-full h-full object-contain opacity-80"
                />
              </div>

              {/* Canvas lăn xoa mực */}
              <canvas
                ref={canvasRef}
                width={520}
                height={390}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
              />

              <div className="absolute top-2 left-2 z-20 bg-black/85 px-2.5 py-1 rounded border border-amber-500/80 text-[11px] font-serif text-amber-200 flex items-center gap-1.5 shadow">
                <Hand className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Rê con lăn miết đều khắp mặt giấy: <strong>{rubCoverage}% ngấm thớ</strong></span>
              </div>
            </>
          )}

          {/* BƯỚC 5: NẮM GÓC DƯỚI BÓC TÁCH BẢN IN */}
          {currentStep === 5 && !isRevealed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-end p-4">
              {/* Mặt in chuẩn bị hé lộ bên dưới */}
              <div
                className="absolute inset-0 bg-stone-900 pointer-events-none overflow-hidden"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${100 - peelPercent}%, 0 ${100 - peelPercent * 0.85}%)`,
                }}
              >
                <img
                  src="./assets/step_5_peel_print.png"
                  alt="Tranh sau khi bóc"
                  className="w-full h-full object-contain p-2"
                />
              </div>

              {/* Tờ giấy đang được bóc cong lên */}
              <div
                onClick={() => {
                  if (!isRevealed) {
                    setPeelPercent(100);
                    setIsRevealed(true);
                    sounds.playSuccess();
                  }
                }}
                style={{
                  height: `${Math.max(10, 100 - peelPercent)}%`,
                  boxShadow: '0 -8px 25px rgba(0,0,0,0.6)',
                }}
                className="w-full bg-[#f6eee0] rounded-t-lg border-t-4 border-amber-600 transition-all flex flex-col items-center justify-start pt-2 relative cursor-pointer"
              >
                <div className="bg-black/80 text-amber-200 px-3 py-1 rounded border border-amber-400 text-xs font-serif flex items-center gap-1.5 animate-pulse">
                  <Hand className="w-4 h-4 text-amber-400" />
                  <span>Kéo chuột từ dưới lên trên để bóc tách giấy ({peelPercent}%)</span>
                </div>
              </div>
            </div>
          )}

          {/* BẢN IN HOÀN CHỈNH SAU KHI BÓC XONG */}
          {isRevealed && (
            <div className="absolute inset-0 z-20 bg-[#fbf6ec] p-3 sm:p-4 flex flex-col items-center justify-between border-2 border-amber-800 shadow-2xl animate-fadeIn overflow-y-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#b91c1c] font-bold font-serif text-sm sm:text-base">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>BẢN IN TRANH HÀNG TRỐNG HOÀN THÀNH XUẤT SẮC!</span>
                </div>
                <p className="text-[11px] text-amber-900 font-serif">
                  Từng thớ giấy dó ôm trọn nét mực Tàu đen tuyền — 8 câu thơ cổ đồng loạt phát sáng!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center w-full my-2">
                <div className="w-full max-w-[260px] aspect-[3/2] mx-auto border-2 border-amber-900/60 rounded shadow-md overflow-hidden bg-stone-900">
                  <img
                    src="./assets/step_5_peel_print.png"
                    alt="Bản in Cá Chép Trông Trăng"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* 8 Câu thơ cổ phát sáng từ GDD */}
                <div className="p-2.5 bg-amber-50 rounded border border-amber-300 font-serif text-[11px] sm:text-xs leading-relaxed text-stone-800 text-left italic shadow-inner space-y-0.5">
                  <p>Trên mái đình xưa, áng <strong>mây</strong> bạc lững lờ,</p>
                  <p>Tiếng sáo ai đưa theo ngọn <strong>gió</strong> bơ vơ.</p>
                  <p>Dòng sông in bóng trăng, <strong>nước</strong> trôi về bến cũ,</p>
                  <p>Trong đêm tàn, ánh <strong>lửa</strong> vẫn âm thầm chờ.</p>
                  <p>Hiên nhà vắng, tiếng <strong>gió</strong> luồn qua khe cửa,</p>
                  <p>Rêu phủ mái ngói, <strong>mây</strong> trắng khuất lưng đồi.</p>
                  <p>Khi canh khuya buông xuống, vạn vật chìm trong tĩnh lặng,</p>
                  <p className="font-bold text-[#b91c1c] not-italic">
                    Cá chép ngước nhìn trăng, bóng nguyệt tròn in đáy nước.
                  </p>
                </div>
              </div>

              <div className="w-full text-center">
                <button
                  type="button"
                  onClick={() => setStage('POEM_CIPHER')}
                  className="pulse-glow px-5 py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white font-serif font-bold text-xs sm:text-sm rounded shadow-lg transition inline-flex items-center gap-1.5 active:scale-95"
                >
                  <Compass className="w-4 h-4 text-amber-300" />
                  <span>Giải Mã Bài Thơ & Điều Hướng Phương Vị ➔</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BẢNG ĐIỀU KHIỂN & CHUYỂN BƯỚC THEO TIẾN TRÌNH THỰC */}
        {!isRevealed && (
          <div className="mt-3 w-full max-w-xl flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-1.5 text-xs font-serif text-stone-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                {currentStep === 1 && `Tiến độ quét bụi: ${cleanCoverage}% (Cần đạt ≥ 80%)`}
                {currentStep === 2 && `Tiến độ phủ mực: ${inkCoverage}% (Cần đạt ≥ 80%)`}
                {currentStep === 3 && (isPaperSnapped ? '✓ Giấy dó đã căn chỉnh chuẩn xác' : 'Kéo giấy khớp vào 4 chốt cữ')}
                {currentStep === 4 && `Độ ngấm mực thớ giấy: ${rubCoverage}% (Cần đạt ≥ 80%)`}
                {currentStep === 5 && `Độ bóc tách bản in: ${peelPercent}% (Kéo chuột lên trên)`}
              </span>
            </div>

            {/* Nút sang bước tiếp theo chỉ khả dụng khi người chơi thực sự tương tác đạt yêu cầu */}
            <div>
              {currentStep === 1 && (
                <button
                  type="button"
                  disabled={cleanCoverage < 80}
                  onClick={() => {
                    sounds.playWoodClop();
                    setCurrentStep(2);
                  }}
                  className={`px-4 py-1.5 text-xs font-serif font-bold rounded shadow transition flex items-center gap-1 ${
                    cleanCoverage >= 80
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 animate-pulse'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  <span>Sang Bước 2: Phết Mực</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  disabled={inkCoverage < 80}
                  onClick={() => {
                    sounds.playWoodClop();
                    setCurrentStep(3);
                  }}
                  className={`px-4 py-1.5 text-xs font-serif font-bold rounded shadow transition flex items-center gap-1 ${
                    inkCoverage >= 80
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 animate-pulse'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  <span>Sang Bước 3: Đặt Giấy Dó</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="button"
                  disabled={!isPaperSnapped}
                  onClick={() => {
                    sounds.playWoodClop();
                    setCurrentStep(4);
                  }}
                  className={`px-4 py-1.5 text-xs font-serif font-bold rounded shadow transition flex items-center gap-1 ${
                    isPaperSnapped
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 animate-pulse'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  <span>Sang Bước 4: Miết Con Quay Mực</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {currentStep === 4 && (
                <button
                  type="button"
                  disabled={rubCoverage < 80}
                  onClick={() => {
                    sounds.playWoodClop();
                    setCurrentStep(5);
                  }}
                  className={`px-4 py-1.5 text-xs font-serif font-bold rounded shadow transition flex items-center gap-1 ${
                    rubCoverage >= 80
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 animate-pulse'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  <span>Sang Bước 5: Bóc Bản In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
