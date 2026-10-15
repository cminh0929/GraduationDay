import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EVENT_CONFIG } from '../config/event.ts';
import { getGuestInvitationUrl } from '../config/guestUrl.ts';
import { TdtuLogo } from './TdtuLogo.tsx';
import { ClassOf2026Medallion, GraduationCapIcon } from './SunflowerCapMotif.tsx';
import { GraduationHeroIllustration } from './GraduationHeroIllustration.tsx';
import { LeftBotanicalOrnament, RightBotanicalOrnament } from './AcademicBotanicalOrnaments.tsx';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

interface PersonalizedInvitationProps {
  guestName: string;
  salutation?: string;
  guestCode?: string;
  linkId?: string;
  isGeneral?: boolean;
}

// -----------------------------------------------------------------------
// GraduateName: animated character reveal + one-time gold shimmer sweep
// -----------------------------------------------------------------------
const GraduateName: React.FC<{ name: string; shouldReduceMotion: boolean | null }> = ({
  name,
  shouldReduceMotion,
}) => {
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const hasShimmeredRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion || hasShimmeredRef.current) return;
    // Fire shimmer after characters finish animating (~1.2s)
    const tid = setTimeout(() => {
      if (!hasShimmeredRef.current && shimmerRef.current) {
        hasShimmeredRef.current = true;
        shimmerRef.current.classList.add('grad-name-shimmer-run');
      }
    }, 1250);
    return () => clearTimeout(tid);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <span className="block text-[#15305B]">{name}</span>;
  }

  // Split by words to avoid breaking diacritics across individual codepoints
  const words = name.split(' ');

  return (
    <span className="relative inline-block">
      {/* Shimmer overlay — slides left→right once */}
      <span
        ref={shimmerRef}
        aria-hidden="true"
        className="grad-name-shimmer pointer-events-none absolute inset-0 z-10"
      />
      <span className="block text-[#15305B]" aria-label={name}>
        {words.map((word, wi) => (
          <React.Fragment key={wi}>
            <span className="inline-block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.38,
                  delay: 0.25 + wi * 0.11,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
            {wi < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </span>
    </span>
  );
};

export const PersonalizedInvitation: React.FC<PersonalizedInvitationProps> = ({
  guestName,
  salutation = 'Bạn',
  linkId,
  isGeneral = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Helper to build Google Calendar URL
  const googleCalendarUrl = (() => {
    const title = encodeURIComponent(
      `Lễ tốt nghiệp 2026 — Đặng Công Minh (Khoa học máy tính, TDTU)`
    );
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const details = encodeURIComponent(
      isGeneral
        ? `Lễ trao bằng tốt nghiệp cử nhân của Đặng Công Minh tại Trường Đại học Tôn Đức Thắng.\nThiệp mời trực tuyến: ${origin}`
        : `Lễ trao bằng tốt nghiệp cử nhân của Đặng Công Minh tại Trường Đại học Tôn Đức Thắng.\nKhách mời: ${guestName}\nThiệp mời trực tuyến: ${getGuestInvitationUrl(linkId || '')}`
    );
    const location = encodeURIComponent(
      `${EVENT_CONFIG.location.venueName}, ${EVENT_CONFIG.location.address}`
    );
    // 2026-10-17 09:00 to 12:00 in Asia/Ho_Chi_Minh (UTC+7) -> 20261017T020000Z / 20261017T050000Z
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261017T020000Z/20261017T050000Z&details=${details}&location=${location}`;
  })();

  // Helper to split multi-person names (e.g. Cha & Me) to match mockup typography hierarchy
  const renderFormattedGuestName = (name: string) => {
    if (isGeneral) {
      // For the general invitation, render with same word-by-word animation
      return <GraduateName name={name} shouldReduceMotion={shouldReduceMotion} />;
    }
    if (name.includes('&')) {
      const parts = name.split('&').map((p) => p.trim());
      return (
        <>
          <span className="block text-[#15305B]">{parts[0]} &amp;</span>
          <span className="block text-[#8B1E22] mt-0.5 sm:mt-1">{parts[1]}</span>
        </>
      );
    }
    if (name.includes(' và ') && !isGeneral) {
      const parts = name.split(' và ').map((p) => p.trim());
      return (
        <>
          <span className="block text-[#15305B]">{parts[0]} &amp;</span>
          <span className="block text-[#8B1E22] mt-0.5 sm:mt-1">{parts[1]}</span>
        </>
      );
    }
    // Single guest name — animated word-by-word reveal
    return <GraduateName name={name} shouldReduceMotion={shouldReduceMotion} />;
  };

  return (
    <>
      {/* Inline CSS for shimmer & cap-fly keyframes — scoped, no extra lib */}
      <style>{`
        /* Gold shimmer sweep — runs once via JS class injection */
        .grad-name-shimmer {
          background: linear-gradient(
            100deg,
            transparent 20%,
            rgba(214, 178, 116, 0.55) 45%,
            rgba(250, 220, 140, 0.75) 50%,
            rgba(214, 178, 116, 0.55) 55%,
            transparent 80%
          );
          background-size: 300% 100%;
          background-position: 200% center;
          mix-blend-mode: screen;
        }
        .grad-name-shimmer-run {
          animation: gradShimmer 0.85s ease-out forwards;
        }
        @keyframes gradShimmer {
          from { background-position: 200% center; }
          to   { background-position: -100% center; }
        }

        /* Cap fly-in: arrives from top-right, settles, tassel nudge */
        @keyframes capFlyIn {
          0%   { transform: translate(32px, -28px) rotate(14deg) scale(0.88); opacity: 0; }
          65%  { transform: translate(-3px, 3px) rotate(-3deg) scale(1.01); opacity: 1; }
          80%  { transform: translate(1px, 0px) rotate(1deg) scale(1); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes tasselSwing {
          0%,100% { transform-origin: top center; transform: rotate(0deg); }
          30%  { transform-origin: top center; transform: rotate(12deg); }
          65%  { transform-origin: top center; transform: rotate(-6deg); }
          85%  { transform-origin: top center; transform: rotate(3deg); }
        }
        .cap-fly-in {
          animation: capFlyIn 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
        }
        .cap-tassel-swing {
          animation: tasselSwing 1.0s ease-in-out 0.95s 1 both;
        }
        @media (prefers-reduced-motion: reduce) {
          .cap-fly-in, .cap-tassel-swing, .grad-name-shimmer-run {
            animation: none !important;
          }
          .grad-name-shimmer { display: none; }
        }
      `}</style>

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
                    {/* "TRÂN TRỌNG KÍNH MỜI" — soft fade-in */}
                    <motion.span
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.7, delay: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                      className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#947229]"
                    >
                      TRÂN TRỌNG KÍNH MỜI
                    </motion.span>
                    <span className="h-px w-6 sm:w-8 bg-[#D6B274]" />
                  </div>

                  {/* Salutation */}
                  {!isGeneral && (
                    <motion.p
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
                      className="text-sm sm:text-base font-serif italic text-slate-600 mb-1"
                    >
                      {salutation && salutation !== 'Bạn' ? `Kính gửi ${salutation}` : 'Thân gửi bạn'}
                    </motion.p>
                  )}

                  {/* Primary Guest Name: Serif, large, authoritative */}
                  <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-black tracking-tight leading-[1.18] text-balance">
                    {renderFormattedGuestName(guestName)}
                  </h2>

                  {/* Subtle Gold Divider */}
                  <div className="w-full max-w-[280px] sm:max-w-[340px] h-px bg-gradient-to-r from-[#D6B274] via-[#D6B274]/60 to-transparent mt-3 mb-2" />
                </div>

                {/* Supporting Quote / Ceremonial Message Panel */}
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.7, ease: 'easeOut' }}
                  className="bg-[#FAF5ED] border-l-[3.5px] border-[#D6B274] rounded-r-lg p-4 sm:p-5 shadow-2xs"
                >
                  <p className="text-sm sm:text-[15px] font-serif italic text-slate-700 leading-relaxed">
                    "Đến chung vui và chia sẻ khoảnh khắc đáng nhớ cùng Đặng Công Minh trong ngày tốt nghiệp tại Trường Đại học Tôn Đức Thắng."
                  </p>
                </motion.div>
              </div>

              {/* Right Column: Hero Artwork — cap flies in */}
              <div className="lg:col-span-5 flex items-center justify-center py-2 lg:py-0">
                <div
                  className={shouldReduceMotion ? '' : 'cap-fly-in'}
                  style={{ willChange: 'transform, opacity' }}
                >
                  {/* Tassel swing wraps inside cap-fly container */}
                  <div className={shouldReduceMotion ? '' : 'cap-tassel-swing'} style={{ display: 'contents' }}>
                    <GraduationHeroIllustration className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-[4/3]" />
                  </div>
                </div>
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
                {/* Graduate name with staggered char animation + shimmer */}
                <GraduateNameAnimated shouldReduceMotion={shouldReduceMotion} />
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
      </section>
    </>
  );
};

// -----------------------------------------------------------------------
// GraduateNameAnimated: "Đặng Công Minh" staggered word reveal + shimmer
// -----------------------------------------------------------------------
const GRADUATE_NAME = 'Đặng Công Minh';

const GraduateNameAnimated: React.FC<{ shouldReduceMotion: boolean | null }> = ({
  shouldReduceMotion,
}) => {
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion || hasRunRef.current) return;
    // Fire after staggered words finish (~0.85s total stagger)
    const tid = setTimeout(() => {
      if (!hasRunRef.current && shimmerRef.current) {
        hasRunRef.current = true;
        shimmerRef.current.classList.add('grad-name-shimmer-run');
      }
    }, 1400);
    return () => clearTimeout(tid);
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#15305B] tracking-tight">
        {GRADUATE_NAME}
      </h3>
    );
  }

  const words = GRADUATE_NAME.split(' ');

  return (
    <h3 className="text-lg sm:text-xl font-serif font-bold text-[#15305B] tracking-tight relative">
      {/* Gold shimmer overlay */}
      <span
        ref={shimmerRef}
        aria-hidden="true"
        className="grad-name-shimmer pointer-events-none absolute inset-0 z-10"
      />
      <span aria-label={GRADUATE_NAME}>
        {words.map((word, wi) => (
          <React.Fragment key={wi}>
            <span className="inline-block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.35,
                  delay: 0.4 + wi * 0.13,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
            {wi < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </span>
    </h3>
  );
};
