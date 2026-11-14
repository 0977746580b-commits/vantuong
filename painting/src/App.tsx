import React, { useCallback, useEffect, useState } from 'react';
import { GameStateProvider } from './context/GameStateContext';
import { MainWorkshopWorld } from './components/world/MainWorkshopWorld';
import { JournalModal } from './components/UI/JournalModal';
import { sounds } from './utils/soundEngine';

declare global {
  interface Window {
    GameAudio?: {
      isMuted: () => boolean;
      setMuted: (muted: boolean) => boolean;
      toggleMute: () => boolean;
      dispose: () => void;
    };
  }
}

function getFullscreenElement(): Element | null {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  };
  let fsEl =
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null;

  if (!fsEl && window.parent && window.parent !== window) {
    try {
      const pDoc = window.parent.document as Document & {
        webkitFullscreenElement?: Element | null;
      };
      fsEl = pDoc.fullscreenElement || pDoc.webkitFullscreenElement || null;
    } catch {
      // ignore cross-origin access
    }
  }
  return fsEl;
}

export function App() {
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.isMuted());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => !!getFullscreenElement());

  const handleToggleMute = useCallback(() => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    const currentFs = getFullscreenElement();
    if (!currentFs) {
      const target = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void> | void;
        mozRequestFullScreen?: () => Promise<void> | void;
        msRequestFullscreen?: () => Promise<void> | void;
      };
      const req =
        target.requestFullscreen ||
        target.webkitRequestFullscreen ||
        target.mozRequestFullScreen ||
        target.msRequestFullscreen;

      const tryParentFullscreen = () => {
        if (window.parent && window.parent !== window) {
          try {
            const pDoc = window.parent.document;
            const pTarget = (pDoc.getElementById('viewPixelGame') || pDoc.documentElement) as HTMLElement & {
              webkitRequestFullscreen?: () => Promise<void> | void;
            };
            const pReq = pTarget.requestFullscreen || pTarget.webkitRequestFullscreen;
            if (pReq) {
              Promise.resolve(pReq.call(pTarget)).catch(() => {});
            }
          } catch {
            // ignore cross-origin
          }
        }
      };

      if (req) {
        try {
          Promise.resolve(req.call(target)).catch(() => {
            tryParentFullscreen();
          });
        } catch {
          tryParentFullscreen();
        }
      } else {
        tryParentFullscreen();
      }
    } else {
      const doc = document as Document & {
        webkitFullscreenElement?: Element | null;
        webkitExitFullscreen?: () => Promise<void> | void;
        mozCancelFullScreen?: () => Promise<void> | void;
        msExitFullscreen?: () => Promise<void> | void;
      };
      const exit =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.msExitFullscreen;
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        try {
          if (exit) Promise.resolve(exit.call(doc)).catch(() => {});
        } catch {
          // ignore
        }
      }
      if (window.parent && window.parent !== window) {
        try {
          const pDoc = window.parent.document as Document & {
            webkitFullscreenElement?: Element | null;
            webkitExitFullscreen?: () => Promise<void> | void;
          };
          if (pDoc.fullscreenElement || pDoc.webkitFullscreenElement) {
            const pExit = pDoc.exitFullscreen || pDoc.webkitExitFullscreen;
            if (pExit) Promise.resolve(pExit.call(pDoc)).catch(() => {});
          }
        } catch {
          // ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    // Expose GameAudio interface for museum parent cleanup
    window.GameAudio = {
      isMuted: () => sounds.isMuted(),
      setMuted: (m: boolean) => sounds.setMuted(m),
      toggleMute: () => sounds.toggleMute(),
      dispose: () => sounds.dispose(),
    };

    // Notify parent iframe host that the game is ready
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(
          { type: 'VT_PIXEL_STAGE_READY', station: 'flute' },
          window.location.origin
        );
      } catch {
        // ignore cross-origin
      }
    }

    const onMuteChange = () => {
      setIsMuted(sounds.isMuted());
    };
    window.addEventListener('painting-mute-change', onMuteChange);

    const onFsChange = () => {
      setIsFullscreen(!!getFullscreenElement());
    };
    const fsEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
    fsEvents.forEach((ev) => document.addEventListener(ev, onFsChange));

    let parentDoc: Document | null = null;
    if (window.parent && window.parent !== window) {
      try {
        parentDoc = window.parent.document;
        fsEvents.forEach((ev) => parentDoc?.addEventListener(ev, onFsChange));
      } catch {
        parentDoc = null;
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase() || '';
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          handleToggleFullscreen();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'VT_SET_MUTE') {
        sounds.setMuted(!!data.muted);
      } else if (data.type === 'VT_DISPOSE_AUDIO') {
        sounds.dispose();
      }
    };
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('painting-mute-change', onMuteChange);
      fsEvents.forEach((ev) => document.removeEventListener(ev, onFsChange));
      if (parentDoc) {
        fsEvents.forEach((ev) => parentDoc?.removeEventListener(ev, onFsChange));
      }
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('message', onMessage);
    };
  }, [handleToggleFullscreen]);

  return (
    <GameStateProvider>
      <div className={`vt-painting-shell${isFullscreen ? ' is-fullscreen' : ''}`}>
        <div className="vt-painting-workspace">
          <div className="vt-painting-viewport-card">
            <div className="vt-painting-stage-box">
              <MainWorkshopWorld />
              <JournalModal />
            </div>

            <div className="vt-painting-controls-bar">
              <div className="vt-painting-hints">
                <div><span className="vt-key-badge">A</span><span className="vt-key-badge">D</span>Di chuyển</div>
                <div><span className="vt-key-badge">E</span>Tương tác / Thoại</div>
                <div><span className="vt-key-badge">M</span>Bản đồ</div>
                <div><span className="vt-key-badge">J</span>Sổ tay</div>
                <div><span className="vt-key-badge">ESC</span>Đóng</div>
              </div>
              <div className="vt-painting-actions">
                <button
                  id="btnMute"
                  type="button"
                  className="vt-ctrl-btn"
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Bật tiếng game' : 'Tắt tiếng game'}
                  aria-pressed={isMuted}
                >
                  {isMuted ? '🔇 Bật tiếng' : '🔊 Tắt tiếng'}
                </button>
                <button
                  id="btnFullscreen"
                  type="button"
                  className="vt-ctrl-btn"
                  onClick={handleToggleFullscreen}
                  aria-label={isFullscreen ? 'Thu nhỏ màn hình' : 'Toàn màn hình'}
                  aria-pressed={isFullscreen}
                  title="Phóng to / thu nhỏ toàn màn hình (F)"
                >
                  {isFullscreen ? '🗗 Thu nhỏ' : '⛶ Toàn màn hình'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameStateProvider>
  );
}

export default App;
