import React from 'react';
import { EVENT_CONFIG } from '../config/event.ts';

export const HeaderNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F1]/90 backdrop-blur-md border-b border-[#D6B274]/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no descriptors) */}
        <a
          href="#"
          className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#15489D] hover:text-[#0F3574] transition-colors whitespace-nowrap shrink-0"
        >
          {EVENT_CONFIG.student.displayName} · 2026
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
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
      </div>
    </header>
  );
};
