import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { EVENT_CONFIG } from '../config/event.ts';
import { isSoundMuted, toggleSound, subscribeSoundState, unlockAudio } from '../utils/fireworkSound.ts';

interface HeaderNavProps {
  onReplayCelebration?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onReplayCelebration }) => {
  const [muted, setMuted] = useState(isSoundMuted());

  useEffect(() => {
    return subscribeSoundState((m) => setMuted(m));
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F1]/90 backdrop-blur-md border-b border-[#D6B274]/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand wordmark (single line, no descriptors) */}
        <a
          href="#"
          className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#15489D] hover:text-[#0F3574] transition-colors whitespace-nowrap shrink-0"
        >
          {EVENT_CONFIG.student.displayName} · 2026
        </a>

        {/* Zone 2: Navigation & Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-6">
          <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-slate-700">
            <a
              href="#invitation"
              className="hover:text-[#15489D] transition-colors whitespace-nowrap shrink-0"
            >
              Thiệp Mời
            </a>
            <a
              href="#countdown"
              className="hover:text-[#15489D] transition-colors whitespace-nowrap shrink-0"
            >
              Thời Gian
            </a>
            <a
              href="#location"
              className="hover:text-[#15489D] transition-colors whitespace-nowrap shrink-0"
            >
              Địa Điểm
            </a>
            <a
              href="#closing"
              className="hover:text-[#15489D] transition-colors whitespace-nowrap shrink-0"
            >
              Lời Cảm Ơn
            </a>
          </nav>

          {/* Replay Firework Celebration Button */}
          {onReplayCelebration && (
            <button
              type="button"
              onClick={() => {
                unlockAudio();
                onReplayCelebration();
              }}
              title="Bắn pháo hoa ăn mừng"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold bg-[#15489D] hover:bg-[#0E3574] text-white transition-all shadow-xs hover:shadow-md cursor-pointer select-none active:scale-95"
            >
              <span>🎆</span>
              <span className="text-[11px] font-medium">Bắn pháo hoa</span>
            </button>
          )}

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            title={muted ? 'Bật âm thanh pháo hoa' : 'Tắt âm thanh pháo hoa'}
            aria-label={muted ? 'Bật âm thanh pháo hoa' : 'Tắt âm thanh pháo hoa'}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border select-none ${
              muted
                ? 'bg-slate-100/90 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-700'
                : 'bg-[#FAF3E0] text-[#15489D] border-[#D6B274]/60 hover:bg-[#F5E8C7] shadow-sm'
            }`}
          >
            {muted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline text-[11px]">Tắt tiếng</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#15489D] animate-pulse" />
                <span className="hidden sm:inline text-[11px] font-semibold text-[#15489D]">
                  Bật tiếng
                </span>
                <span className="sm:hidden text-[11px] font-semibold text-[#15489D]">Bật</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
