import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EVENT_CONFIG } from '../config/event.ts';
import { getGuestInvitationUrl } from '../config/guestUrl.ts';
import { TdtuLogo } from './TdtuLogo.tsx';
import { ClassOf2026Medallion, GraduationCapIcon } from './SunflowerCapMotif.tsx';
import { GraduationHeroIllustration } from './GraduationHeroIllustration.tsx';
import { LeftBotanicalOrnament, RightBotanicalOrnament } from './AcademicBotanicalOrnaments.tsx';
import { Calendar, MapPin, Share2, Check, ExternalLink } from 'lucide-react';

interface PersonalizedInvitationProps {
  guestName: string;
  salutation?: string;
  guestCode: string;
  linkId: string;
}

export const PersonalizedInvitation: React.FC<PersonalizedInvitationProps> = ({
  guestName,
  salutation = 'Bạn',
  guestCode,
  linkId,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Helper to build Google Calendar URL
  const googleCalendarUrl = (() => {
    const title = encodeURIComponent(
      `Lễ tốt nghiệp 2026 — Đặng Công Minh (Khoa học máy tính, TDTU)`
    );
    const details = encodeURIComponent(
      `Lễ trao bằng tốt nghiệp cử nhân của Đặng Công Minh tại Trường Đại học Tôn Đức Thắng.\nKhách mời: ${guestName}\nThiệp mời trực tuyến: ${getGuestInvitationUrl(linkId)}`
    );
    const location = encodeURIComponent(
      `${EVENT_CONFIG.location.venueName}, ${EVENT_CONFIG.location.address}`
    );
    // 2026-10-17 09:00 to 12:00 in Asia/Ho_Chi_Minh (UTC+7) -> 20261017T020000Z / 20261017T050000Z
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261017T020000Z/20261017T050000Z&details=${details}&location=${location}`;
  })();

  const handleCopyLink = () => {
    const url = getGuestInvitationUrl(linkId);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Helper to split multi-person names (e.g. Cha & Me) to match mockup typography hierarchy
  const renderFormattedGuestName = (name: string) => {
    if (name.includes('&')) {
      const parts = name.split('&').map((p) => p.trim());
      return (
        <>
          <span className="block text-[#15305B]">{parts[0]} &amp;</span>
          <span className="block text-[#8B1E22] mt-0.5 sm:mt-1">{parts[1]}</span>
        </>
      );
    }
    if (name.includes(' và ')) {
      const parts = name.split(' và ').map((p) => p.trim());
      return (
        <>
          <span className="block text-[#15305B]">{parts[0]} &amp;</span>
          <span className="block text-[#8B1E22] mt-0.5 sm:mt-1">{parts[1]}</span>
        </>
      );
    }
    return <span className="block text-[#15305B]">{name}</span>;
  };

  return (
    <section id="invitation" className="relative py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Main Luxury Academic Card */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card-academic-gold-border rounded-2xl shadow-xl overflow-hidden bg-[#FCFAF6] relative"
      >
        {/* Left Ambient Botanical Ornament (gentle breeze sway) */}
        <div className="absolute top-24 sm:top-28 left-0 sm:left-1 lg:left-2 w-10 sm:w-16 lg:w-20 pointer-events-none z-0 opacity-40 sm:opacity-70 lg:opacity-85">
          <LeftBotanicalOrnament className="w-full" />
        </div>

        {/* Right Ambient Botanical Ornament (gentle breeze sway) */}
        <div className="absolute top-24 sm:top-28 right-0 sm:right-1 lg:right-2 w-10 sm:w-16 lg:w-20 pointer-events-none z-0 opacity-40 sm:opacity-70 lg:opacity-85">
          <RightBotanicalOrnament className="w-full" />
        </div>

        {/* Decorative Top Accent Bar: Reveal from left to right */}
        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-1.5 w-full bg-gradient-to-r from-[#15489D] via-[#D6B274] to-[#E44735] origin-left relative z-10"
        />

        <div className="p-5 sm:p-9 lg:p-12 relative z-10">
          {/* ========================================================= */}
          {/* 1. TOP CARD HEADER                                         */}
          {/* ========================================================= */}
          <div className="flex flex-row items-center justify-between border-b border-[#D6B274]/30 pb-6 sm:pb-7 gap-4">
            {/* Left: TDTU Brand Lockup */}
            <div className="flex items-center gap-3">
              <TdtuLogo size="sm" />
              <div className="hidden sm:block border-l border-[#D6B274]/40 pl-3 leading-tight">
                <span className="text-[10px] font-sans tracking-[0.16em] uppercase text-slate-500 font-semibold block">
                  BACHELOR OF SCIENCE
                </span>
                <span className="text-[10px] font-mono text-[#D6B274] tracking-wider block">
                  · 2026 ·
                </span>
              </div>
            </div>

            {/* Right: Commemorative Seal & Degree Lockup */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="hidden md:flex flex-col text-right font-sans leading-tight">
                <span className="text-[10.5px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  BACHELOR
                </span>
                <span className="text-[10.5px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  OF SCIENCE
                </span>
                <span className="text-[10px] text-[#D6B274] font-mono tracking-widest mt-0.5">
                  · 2026 ·
                </span>
              </div>

              <div className="hidden md:block h-9 w-px bg-[#D6B274]/35" />

              <ClassOf2026Medallion className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2 & 4. INVITATION HERO & ILLUSTRATION SECTION             */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-7 sm:mt-9 items-center">
            {/* Left Column: Invitation Wording & Personalized Name (7 cols on Desktop) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5 sm:space-y-6">
              {/* Eyebrow Label */}
              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
                  <span className="h-px w-6 sm:w-8 bg-[#D6B274]" />
                  <span className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#947229]">
                    TRÂN TRỌNG KÍNH MỜI
                  </span>
                  <span className="h-px w-6 sm:w-8 bg-[#D6B274]" />
                </div>

                {/* Salutation */}
                <p className="text-sm sm:text-base font-serif italic text-slate-600 mb-1">
                  {salutation && salutation !== 'Bạn' ? `Kính gửi ${salutation}` : 'Thân gửi bạn'}
                </p>

                {/* Primary Guest Name: Serif, large, authoritative */}
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-black tracking-tight leading-[1.18] text-balance">
                  {renderFormattedGuestName(guestName)}
                </h2>

                {/* Subtle Gold Divider */}
                <div className="w-full max-w-[280px] sm:max-w-[340px] h-px bg-gradient-to-r from-[#D6B274] via-[#D6B274]/60 to-transparent mt-3 mb-2" />
              </div>

              {/* Supporting Quote / Ceremonial Message Panel */}
              <div className="bg-[#FAF5ED] border-l-[3.5px] border-[#D6B274] rounded-r-lg p-4 sm:p-5 shadow-2xs">
                <p className="text-sm sm:text-[15px] font-serif italic text-slate-700 leading-relaxed">
                  “Đến chung vui và chia sẻ khoảnh khắc đáng nhớ cùng Đặng Công Minh trong ngày tốt nghiệp tại Trường Đại học Tôn Đức Thắng.”
                </p>
              </div>
            </div>

            {/* Right Column: Hero Artwork (5 cols on Desktop, centered on Mobile) */}
            <div className="lg:col-span-5 flex items-center justify-center py-2 lg:py-0">
              <GraduationHeroIllustration className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-[4/3]" />
            </div>
          </div>

          {/* Continuous Gold Divider */}
          <div className="border-t border-[#D6B274]/35 my-7 sm:my-9" />

          {/* ========================================================= */}
          {/* 5 & 6. BOTTOM EVENT METADATA (3-Column on Desktop)        */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-6 lg:gap-8 items-start">
            {/* Column 1: Tân Cử Nhân (4 cols) */}
            <div className="lg:col-span-4 space-y-1">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400 uppercase block">
                TÂN CỬ NHÂN
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#15305B] tracking-tight">
                {EVENT_CONFIG.student.fullName}
              </h3>
              <div className="text-xs text-slate-600 space-y-0.5 pt-0.5">
                <p>{EVENT_CONFIG.student.faculty}</p>
                <p>Ngành {EVENT_CONFIG.student.major}</p>
              </div>
            </div>

            {/* Column 2: Thời Gian (4 cols) */}
            <div className="lg:col-span-4 sm:border-l sm:border-[#D6B274]/30 sm:pl-6 lg:pl-6 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#15489D]" />
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
                  THỜI GIAN
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#17243A]">
                {EVENT_CONFIG.event.dayOfWeek} — {EVENT_CONFIG.event.displayDate} · {EVENT_CONFIG.event.displayTime}
              </p>
              <div className="pt-1">
                <a
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#15489D] hover:text-[#0F3574] hover:underline font-medium transition-colors cursor-pointer"
                >
                  <span>+ Lưu vào Google Calendar</span>
                </a>
              </div>
            </div>

            {/* Column 3: Địa Điểm (4 cols) */}
            <div className="lg:col-span-4 sm:col-span-2 lg:col-span-4 sm:border-l sm:border-[#D6B274]/30 sm:pl-6 lg:pl-6 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#E44735]" />
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase">
                  ĐỊA ĐIỂM
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#17243A]">
                {EVENT_CONFIG.location.venueName}
              </p>
              <p className="text-[11px] text-slate-500 leading-snug">
                {EVENT_CONFIG.location.address}
              </p>
              <div className="pt-1">
                <a
                  href={EVENT_CONFIG.location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#15489D] hover:text-[#0F3574] hover:underline font-medium transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Xem đường đi (Google Maps)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Center Filigree Ornament */}
          <div className="flex items-center justify-center gap-3 pt-6 mt-6 sm:mt-8 border-t border-[#D6B274]/20">
            <span className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-[#D6B274]/60" />
            <GraduationCapIcon className="w-4 h-4 text-[#D6B274]" />
            <span className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-[#D6B274]/60" />
          </div>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* INVITATION ACTIONS & VERIFICATION ROW                     */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-5 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-500">MÃ THIỆP:</span>
          <span className="font-mono font-semibold text-[#15489D] bg-[#15489D]/10 px-2 py-0.5 rounded-sm">
            {guestCode}
          </span>
          <span className="text-emerald-700 font-medium">· Đã xác thực</span>
        </div>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D6B274]/50 hover:border-[#15489D] text-slate-700 hover:text-[#15489D] rounded-md transition-colors shadow-2xs cursor-pointer"
        >
          {copiedLink ? (
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <Share2 className="w-3.5 h-3.5 text-[#D6B274]" />
          )}
          <span>{copiedLink ? 'Đã sao chép link' : 'Sao chép link thiệp'}</span>
        </button>
      </div>
    </section>
  );
};
