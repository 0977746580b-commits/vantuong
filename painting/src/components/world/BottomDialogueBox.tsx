import React, { useEffect, useId } from 'react';
import {
  X,
  MessageSquareQuote,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  User,
  Scroll,
  Hammer,
  Palette,
  Flame,
  Users,
  Compass,
} from 'lucide-react';
import { sounds } from '../../utils/soundEngine';

export interface DialogueAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export type AvatarType =
  | 'player'
  | 'elder'
  | 'artisan'
  | 'hostess'
  | 'priest'
  | 'villager'
  | 'system';

export interface DialogueTurn {
  speaker: string;
  speakerRole?: string;
  avatarType?: AvatarType;
  avatarIcon?: React.ReactNode;
  content: string | string[];
  hint?: string;
  actionLabel?: string;
}

export interface BottomDialogueProps {
  speaker?: string;
  speakerRole?: string;
  avatarIcon?: React.ReactNode;
  avatarType?: AvatarType;
  content?: string | string[] | React.ReactNode;
  hint?: string;
  actions?: DialogueAction[];
  customFooter?: React.ReactNode;
  onClose?: () => void;
  isOpen: boolean;
  className?: string;

  // Chuỗi đối thoại nhiều lượt luân chuyển nhân vật (Multi-turn interactive dialogue)
  turns?: DialogueTurn[];
  currentTurnIndex?: number;
  onNextTurn?: () => void;
  onPrevTurn?: () => void;
  onFinish?: () => void;
}

export const BottomDialogueBox: React.FC<BottomDialogueProps> = ({
  speaker,
  speakerRole,
  avatarIcon,
  avatarType = 'system',
  content,
  hint,
  actions,
  customFooter,
  onClose,
  isOpen,
  className = '',
  turns,
  currentTurnIndex = 0,
  onNextTurn,
  onPrevTurn,
  onFinish,
}) => {
  // Lấy dữ liệu lượt thoại hiện thời nếu có turns
  const isMultiTurn = Array.isArray(turns) && turns.length > 0;
  const currentTurn = isMultiTurn
    ? turns[Math.min(currentTurnIndex, turns.length - 1)]
    : null;

  const activeSpeaker = currentTurn ? currentTurn.speaker : speaker || 'Người Dẫn Chuyện';
  const activeSpeakerRole = currentTurn ? currentTurn.speakerRole : speakerRole;
  const activeAvatarType: AvatarType = currentTurn?.avatarType || avatarType;
  const activeContent = currentTurn ? currentTurn.content : content;
  const activeHint = currentTurn ? currentTurn.hint : hint;

  const isLastTurn = isMultiTurn && currentTurnIndex >= turns.length - 1;
  const isFirstTurn = isMultiTurn && currentTurnIndex <= 0;

  // Xử lý phím tắt Space / Enter / Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      const interactive =
        typeof (e.target as HTMLElement)?.closest === 'function' &&
        Boolean(
          (e.target as HTMLElement)?.closest(
            'button, input, textarea, select, [contenteditable="true"]'
          )
        );
      if (interactive) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!e.repeat) {
          sounds.playClick();
          if (onClose) onClose();
          else if (onFinish) onFinish();
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!e.repeat) {
          if (isMultiTurn) {
            if (!isLastTurn && onNextTurn) {
              sounds.playClick();
              onNextTurn();
            } else {
              sounds.playWoodClop();
              if (onFinish) onFinish();
              else if (onClose) onClose();
            }
          } else if (actions && actions.length > 0) {
            const primaryAction = actions.find((a) => a.primary) || actions[0];
            sounds.playWoodClop();
            primaryAction.onClick();
          } else if (onClose) {
            sounds.playClick();
            onClose();
          }
        }
      } else if (e.key === 'ArrowLeft' && isMultiTurn && !isFirstTurn && onPrevTurn) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!e.repeat) {
          sounds.playClick();
          onPrevTurn();
        }
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [isOpen, onClose, actions, isMultiTurn, isLastTurn, isFirstTurn, onNextTurn, onPrevTurn, onFinish]);

  const headingId = useId();

  if (!isOpen) return null;

  // Icon và màu sắc riêng biệt cho từng vai trò trong đối thoại
  const getAvatarBadge = () => {
    if (currentTurn?.avatarIcon || avatarIcon) {
      return currentTurn?.avatarIcon || avatarIcon;
    }
    switch (activeAvatarType) {
      case 'player':
        return <User className="w-4 h-4 text-amber-300" />;
      case 'elder':
        return <Scroll className="w-4 h-4 text-amber-400" />;
      case 'artisan':
        return <Hammer className="w-4 h-4 text-orange-400" />;
      case 'hostess':
        return <Palette className="w-4 h-4 text-rose-300" />;
      case 'priest':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'villager':
        return <Users className="w-4 h-4 text-emerald-300" />;
      case 'system':
      default:
        return <Compass className="w-4 h-4 text-amber-300" />;
    }
  };

  const getSpeakerStyle = () => {
    if (activeAvatarType === 'player') {
      return {
        badgeBg: 'bg-amber-950/80 border-amber-400',
        nameColor: 'text-amber-300',
        roleColor: 'bg-amber-900/60 text-amber-200 border-amber-500/60',
      };
    }
    if (activeAvatarType === 'elder') {
      return {
        badgeBg: 'bg-stone-900 border-amber-500',
        nameColor: 'text-amber-200',
        roleColor: 'bg-[#3b2d1f] text-amber-300 border-[#b8894a]',
      };
    }
    if (activeAvatarType === 'artisan') {
      return {
        badgeBg: 'bg-stone-900 border-orange-500',
        nameColor: 'text-orange-200',
        roleColor: 'bg-orange-950/70 text-orange-200 border-orange-500/60',
      };
    }
    if (activeAvatarType === 'hostess') {
      return {
        badgeBg: 'bg-stone-900 border-rose-400',
        nameColor: 'text-rose-200',
        roleColor: 'bg-rose-950/70 text-rose-200 border-rose-400/60',
      };
    }
    if (activeAvatarType === 'priest') {
      return {
        badgeBg: 'bg-stone-900 border-red-500',
        nameColor: 'text-red-300',
        roleColor: 'bg-red-950/70 text-red-200 border-red-500/60',
      };
    }
    return {
      badgeBg: 'bg-[#2b221a] border-amber-400/80',
      nameColor: 'text-amber-300',
      roleColor: 'bg-black/50 text-stone-300 border-stone-600',
    };
  };

  const speakerTheme = getSpeakerStyle();

  return (
    <div
      role="region"
      aria-labelledby={headingId}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={`absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-4xl animate-fadeIn pointer-events-auto select-text ${className}`}
    >
      {/* Khung Hộp Thoại Phong Cách Cổ Điển / Tranh Dân Gian */}
      <div className="bg-[#171310]/95 border-2 border-[#b8894a] rounded-lg shadow-2xl p-3 sm:p-4 wood-frame relative backdrop-blur-md text-amber-100 flex flex-col justify-between max-h-[40vh] sm:max-h-[34vh]">
        {/* Nút Đóng góc trên phải */}
        {(onClose || onFinish) && (
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              if (onFinish) onFinish();
              else if (onClose) onClose();
            }}
            className="absolute top-2 right-2 p-1 rounded bg-[#2a221b] hover:bg-[#3a3026] text-stone-300 hover:text-amber-200 border border-[#b8894a]/50 transition text-xs flex items-center gap-1 z-10"
            title="Đóng hộp thoại (ESC)"
          >
            <span className="hidden sm:inline text-[10px] font-serif">Đóng</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Thanh Tên Người Nói / Vai Trò / Tiến Trình Đối Thoại */}
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#b8894a]/40 pr-16 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 shadow-inner ${speakerTheme.badgeBg}`}
            >
              {getAvatarBadge()}
            </div>
            <h4
              id={headingId}
              className={`font-serif font-bold text-xs sm:text-sm tracking-wide ${speakerTheme.nameColor}`}
            >
              {activeSpeaker}
            </h4>
            {activeSpeakerRole && (
              <span
                className={`px-2 py-0.5 rounded border text-[10px] font-serif ${speakerTheme.roleColor}`}
              >
                {activeSpeakerRole}
              </span>
            )}
          </div>

          {/* Chỉ báo lượt thoại đối đáp */}
          {isMultiTurn && turns.length > 1 && (
            <div className="text-[11px] font-serif text-amber-300/80 bg-black/40 px-2 py-0.5 rounded border border-[#b8894a]/40">
              Lượt {currentTurnIndex + 1}/{turns.length}
            </div>
          )}
        </div>

        {/* Nội Dung Lời Dẫn / Lời Thoại Đối Đáp */}
        <div className="font-serif text-xs sm:text-[13px] text-stone-200 leading-relaxed space-y-1.5 overflow-y-auto pr-1 flex-1 min-h-0">
          {Array.isArray(activeContent) ? (
            activeContent.map((paragraph, index) => (
              <div
                key={index}
                className={
                  typeof paragraph === 'string' &&
                  (paragraph.startsWith('"') || paragraph.startsWith('“') || paragraph.startsWith('—'))
                    ? 'italic text-amber-100 font-medium'
                    : ''
                }
              >
                {paragraph}
              </div>
            ))
          ) : typeof activeContent === 'string' ? (
            <p
              className={
                activeContent.startsWith('"') ||
                activeContent.startsWith('“') ||
                activeContent.startsWith('—')
                  ? 'italic text-amber-100 font-medium'
                  : ''
              }
            >
              {activeContent}
            </p>
          ) : (
            activeContent
          )}

          {activeHint && (
            <div className="pt-1.5 text-[11px] text-emerald-300 flex items-center gap-1 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{activeHint}</span>
            </div>
          )}
        </div>

        {/* Chân Trang: Điều Hướng Đối Thoại (Multi-turn navigation) & Nút Hành Động */}
        {customFooter ? (
          <div className="mt-2 pt-2 border-t border-[#b8894a]/30 shrink-0">
            {customFooter}
          </div>
        ) : (
          <div className="mt-2 pt-2 border-t border-[#b8894a]/30 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="text-[10px] text-stone-400 font-serif italic hidden sm:block">
              {isMultiTurn
                ? 'Phím Space / Enter: Lượt tiếp theo • Esc: Bỏ qua'
                : 'Phím Space / Esc: Đóng lời thoại'}
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {/* Nút lùi lượt trước (nếu là đối thoại nhiều lượt) */}
              {isMultiTurn && !isFirstTurn && onPrevTurn && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onPrevTurn();
                  }}
                  className="px-2.5 py-1 rounded bg-[#251d16] hover:bg-[#34281f] text-stone-300 border border-stone-600 text-xs font-serif flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-3 h-3" />
                  <span>Trước</span>
                </button>
              )}

              {/* Nút sang lượt tiếp theo trong đối thoại */}
              {isMultiTurn && !isLastTurn && onNextTurn && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onNextTurn();
                  }}
                  className="px-3.5 py-1 bg-[#b91c1c] hover:bg-[#991b1b] text-white border border-amber-400/90 rounded text-xs font-serif font-bold transition shadow flex items-center gap-1"
                >
                  <span>Tiếp Tục</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Nút kết thúc chuỗi đối thoại */}
              {isMultiTurn && isLastTurn && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playWoodClop();
                    if (onFinish) onFinish();
                    else if (onClose) onClose();
                  }}
                  className="px-4 py-1 bg-[#b91c1c] hover:bg-[#991b1b] text-amber-100 border border-amber-300 rounded text-xs font-serif font-bold transition shadow flex items-center gap-1"
                >
                  <span>{currentTurn?.actionLabel || 'Hiểu Rõ ➔ Bắt Đầu'}</span>
                </button>
              )}

              {/* Nút hành động tùy biến khi không dùng multi-turn */}
              {!isMultiTurn &&
                actions &&
                actions.map((act, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sounds.playWoodClop();
                      act.onClick();
                    }}
                    className={`px-3 py-1 rounded text-xs font-serif font-bold flex items-center gap-1 shadow transition active:scale-95 ${
                      act.primary
                        ? 'bg-[#b91c1c] hover:bg-[#991b1b] text-white border border-amber-400'
                        : 'bg-[#2a221b] hover:bg-[#3a3026] text-amber-200 border border-[#b8894a]/70'
                    }`}
                  >
                    <span>{act.label}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ))}

              {!isMultiTurn && onClose && (!actions || actions.length === 0) && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                  }}
                  className="px-3 py-1 bg-[#2a221b] hover:bg-[#3a3026] text-amber-200 border border-[#b8894a] rounded text-xs font-serif font-bold transition shadow"
                >
                  Tiếp Tục ➔
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
