import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'motion/react';
import { EVENT_CONFIG } from '../config/event.ts';
import { getGuestInvitationUrl } from '../config/guestUrl.ts';
import { TdtuLogo } from './TdtuLogo.tsx';
import { WaxSealEmblem, GraduationCapIcon, DiplomaScrollIcon, SunflowerIcon } from './SunflowerCapMotif.tsx';
import { Calendar, Clock, MapPin, Share2, Check, Terminal, ExternalLink } from 'lucide-react';

interface PersonalizedInvitationProps {
  guestName: string;
  salutation?: string;
  guestCode: string;
  linkId: string;
}

const CommitTerminal: React.FC = () => {
  const [showCommitDetails, setShowCommitDetails] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const terminalRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(terminalRef, { once: true, margin: '-40px' });
  const [typedCommand, setTypedCommand] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  const fullCommand = 'git show --stat';

  useEffect(() => {
    if (!isInView) return;

    if (shouldReduceMotion) {
      setTypedCommand(fullCommand);
      setTypingComplete(true);
      return;
    }

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex++;
      setTypedCommand(fullCommand.slice(0, currentIndex));
      if (currentIndex >= fullCommand.length) {
        clearInterval(interval);
        setTimeout(() => setTypingComplete(true), 120);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [isInView, shouldReduceMotion]);

  const commitLines = [
    { text: `commit ${EVENT_CONFIG.student.commitHash}`, className: 'text-[#38BDF8]' },
    {
      text: `Author: ${EVENT_CONFIG.student.displayName} <${EVENT_CONFIG.student.gitUsername}@tdtu.edu.vn>`,
      className: 'text-slate-400',
    },
    { text: 'Date: Sat Oct 17 09:00:00 2026 +0700', className: 'text-slate-400' },
    {
      text: 'feat(milestone): Bachelor of Science in Computer Science',
      className: 'text-emerald-400 font-semibold pt-1',
    },
  ];

  return (
    <div
      ref={terminalRef}
      className="rounded-xl border border-slate-800 bg-[#0F172A] text-slate-300 p-4 font-mono text-xs shadow-md"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-400">
          <Terminal className="w-3.5 h-3.5 text-[#D6B274]" />
          <span className="text-[11px]">
            {typedCommand}
            {!typingComplete && (
              <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#D6B274] animate-pulse align-middle" />
            )}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowCommitDetails(!showCommitDetails)}
          className="text-[11px] text-[#D6B274] hover:underline cursor-pointer transition-colors"
        >
          {showCommitDetails ? 'Thu gọn' : 'Chi tiết commit'}
        </button>
      </div>

      <div className="pt-3 space-y-1 text-[11.5px] leading-relaxed text-slate-300 min-h-[96px]">
        {commitLines.map((line, idx) => (
          <motion.p
            key={idx}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
            animate={typingComplete ? { opacity: 1, x: 0 } : shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.22, delay: shouldReduceMotion ? 0 : idx * 0.08 }}
            className={line.className}
          >
            {line.text}
          </motion.p>
        ))}

        <AnimatePresence initial={false}>
          {showCommitDetails && (
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pt-2 border-t border-slate-800 text-slate-400 space-y-1 text-[11px]">
                <p>+ 140+ Credits Completed</p>
                <p>+ Data Structures &amp; Algorithms [PASSED]</p>
                <p>+ Software Engineering &amp; AI Systems [PASSED]</p>
                <p>+ Graduation Thesis Defended Successfully [100%]</p>
                <p className="text-[#D6B274]">+ Ready for New Horizons in Tech</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

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

  return (
    <section id="invitation" className="relative py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Salutation Header - Appears first */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-8 text-center"
      >
        <p className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-[#947229] mb-2">
          Một lời mời dành riêng cho bạn
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#17243A] leading-tight">
          Xin chào, <span className="text-[#15489D]">{guestName}</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 font-serif italic">
          Minh rất vui vì bạn đang có mặt ở đây để cùng sẻ chia cột mốc đặc biệt này.
        </p>
      </motion.div>

      {/* Main Luxury Academic Card - Appears with 500ms fade-up */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.15, ease: 'easeOut' }}
        className="card-academic-gold-border rounded-2xl shadow-xl overflow-hidden bg-[#FCFAF6]"
      >
        {/* Decorative Top Accent Bar: Reveal from left to right (650ms) */}
        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.65, delay: shouldReduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="h-1.5 w-full bg-gradient-to-r from-[#15489D] via-[#D6B274] to-[#E44735] origin-left"
        />

        <div className="p-6 sm:p-10 lg:p-14">
          {/* Header Institutional Lockup */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#D6B274]/30 pb-8 gap-6 text-center sm:text-left">
            <TdtuLogo size="md" />

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-mono tracking-wider text-slate-500 uppercase">
                  BACHELOR OF SCIENCE
                </p>
                <p className="text-xs font-serif italic text-[#15489D]">
                  Graduation Class of 2026
                </p>
              </div>
              {/* Wax Seal 2026 - Scale animation (450ms) */}
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.45, delay: shouldReduceMotion ? 0 : 0.45, ease: 'easeOut' }}
              >
                <WaxSealEmblem text="2026" className="w-14 h-14" />
              </motion.div>
            </div>
          </div>

          {/* Grid Layout: Desktop 2-column Split / Mobile Single Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mt-10 items-stretch">
            {/* Left Column: Official Invitation Wording (7 cols on Desktop) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              {/* Salutation & Guest Name */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-[#D6B274]" />
                  <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#947229]">
                    TRÂN TRỌNG KÍNH MỜI
                  </span>
                  <span className="h-px w-8 bg-[#D6B274]" />
                </div>

                <div className="pt-1">
                  {salutation && salutation !== 'Bạn' && (
                    <span className="block text-sm sm:text-base font-serif italic text-slate-600 mb-0.5">
                      Kính gửi {salutation}
                    </span>
                  )}
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#15489D] tracking-tight leading-tight text-balance">
                    <span className="invitation-name-highlight">{guestName}</span>
                  </h2>
                </div>

                <p className="text-base sm:text-lg text-slate-700 font-serif leading-relaxed italic pt-2 border-l-2 border-[#D6B274] pl-4">
                  "Đến chung vui và chia sẻ khoảnh khắc đáng nhớ cùng Đặng Công Minh trong ngày tốt nghiệp tại Trường Đại học Tôn Đức Thắng."
                </p>
              </div>

              {/* Host & Graduate Details */}
              <div className="pt-4 space-y-2 border-t border-[#D6B274]/25">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  TÂN CỬ NHÂN
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17243A] tracking-normal">
                  {EVENT_CONFIG.student.fullName}
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 space-y-0.5">
                  <p className="font-medium text-[#15489D]">
                    {EVENT_CONFIG.student.faculty}
                  </p>
                  <p className="text-slate-700">
                    Ngành {EVENT_CONFIG.student.major}
                  </p>
                  <p className="font-mono text-xs text-slate-500 pt-0.5">
                    {EVENT_CONFIG.student.classCohort}
                  </p>
                </div>
              </div>

              {/* Date, Time & Venue Summary Block */}
              <div className="bg-[#FAF7F0] border border-[#D6B274]/40 rounded-xl p-5 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date & Time */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg text-[#15489D] border border-[#D6B274]/30 shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-500 uppercase">THỜI GIAN</p>
                      <p className="text-sm font-semibold text-[#17243A]">
                        {EVENT_CONFIG.event.dayOfWeek} — {EVENT_CONFIG.event.displayDate}
                      </p>
                      <p className="text-xs text-slate-600 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#D6B274]" />
                        <span>{EVENT_CONFIG.event.displayTime}</span>
                      </p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg text-[#E44735] border border-[#D6B274]/30 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-mono text-slate-500 uppercase">ĐỊA ĐIỂM</p>
                      <p className="text-sm font-semibold text-[#17243A]">
                        {EVENT_CONFIG.location.venueName}
                      </p>
                      <p className="text-xs text-slate-600 leading-snug mt-0.5">
                        {EVENT_CONFIG.location.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#15489D] hover:bg-[#113A7E] text-white text-xs font-medium rounded-md shadow-2xs transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Lưu vào Google Calendar</span>
                  </a>
                  <a
                    href={EVENT_CONFIG.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:border-[#15489D] text-slate-700 hover:text-[#15489D] text-xs font-medium rounded-md transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Xem đường đi (Google Maps)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Artwork & The Final Commit (5 cols on Desktop) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              {/* Campus / Graduation Architectural Art Frame */}
              <div className="relative rounded-xl overflow-hidden border border-[#D6B274]/50 bg-gradient-to-br from-[#17243A] to-[#15489D] text-white p-6 sm:p-8 flex flex-col justify-between min-h-[300px] shadow-inner">
                {/* Background decorative watermark grid */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFFFFF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono tracking-widest text-[#D6B274] uppercase">
                      MILESTONE COMMIT #2026
                    </span>
                    <SunflowerIcon className="w-6 h-6" />
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
                      THE FINAL COMMIT
                    </h4>
                    <p className="text-xs text-blue-200 font-mono mt-1">
                      branch: {EVENT_CONFIG.student.branchName}
                    </p>
                  </div>
                </div>

                {/* Central Academic Emblem Display */}
                <div className="relative z-10 py-6 my-auto flex items-center justify-center gap-4">
                  <GraduationCapIcon className="w-14 h-14 drop-shadow-md" />
                  <div className="h-10 w-px bg-white/20" />
                  <DiplomaScrollIcon className="w-14 h-14 drop-shadow-md" />
                </div>

                {/* Bottom Quote & Status */}
                <div className="relative z-10 pt-4 border-t border-white/15 text-xs text-blue-100 flex items-center justify-between">
                  <span>Khoa học máy tính</span>
                  <span className="font-mono text-[#D6B274]">Status: GRADUATED</span>
                </div>
              </div>

              {/* The "Final Commit" Interactive Terminal Box (CS Identity) */}
              <CommitTerminal />
            </div>
          </div>

          {/* Footer Floral & Academic filigree line */}
          <div className="mt-12 pt-6 border-t border-[#D6B274]/30 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <SunflowerIcon className="w-4 h-4" />
              <span>Trân quý từng kỷ niệm tại giảng đường TDTU</span>
            </div>
            <span className="font-mono text-slate-400 text-[11px]">
              Tôn Đức Thắng University · 2026
            </span>
          </div>
        </div>
      </motion.div>

      {/* Invitation metadata and sharing actions live after the card. */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-xs text-slate-500">
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
          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#D6B274]" />}
          <span>{copiedLink ? 'Đã sao chép link' : 'Sao chép link thiệp'}</span>
        </button>
      </div>
    </section>
  );
};
