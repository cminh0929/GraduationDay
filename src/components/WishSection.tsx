import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, Loader2, AlertCircle, User, Sparkles } from 'lucide-react';
import { GraduationCapIcon, SunflowerIcon } from './SunflowerCapMotif.tsx';
import { GraduationWavingMascot } from './GraduationWavingMascot.tsx';
import { playBurst } from '../utils/fireworkSound.ts';

interface WishSectionGuest {
  id: string;
  linkId: string;
  code: string;
  guestName: string;
  salutation?: string;
  rsvpStatus?: 'attending' | 'maybe' | 'remote' | 'wish';
  rsvpMessage?: string;
}

interface WishSectionProps {
  currentGuest: WishSectionGuest | null;
  onWishSubmitted?: (message: string) => void;
}

interface FeedbackState {
  type: 'success' | 'error';
  text: string;
}

const MAX_NICKNAME_LENGTH = 60;
const MAX_WISH_LENGTH = 1000;

export const WishSection: React.FC<WishSectionProps> = ({
  currentGuest,
  onWishSubmitted,
}) => {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState(currentGuest?.rsvpMessage || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Reset or adjust state when switching between guests or public mode
  useEffect(() => {
    setFeedback(null);
    if (currentGuest) {
      setNickname('');
      if (currentGuest.rsvpMessage) {
        setMessage(currentGuest.rsvpMessage);
      }
    } else {
      setNickname('');
    }
  }, [currentGuest?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const rawMessage = message.trim();
    const cleanNickname = nickname.trim();

    if (cleanNickname.length > MAX_NICKNAME_LENGTH) {
      setFeedback({
        type: 'error',
        text: `Tên gọi tối đa ${MAX_NICKNAME_LENGTH} ký tự.`,
      });
      return;
    }

    if (rawMessage.length > MAX_WISH_LENGTH) {
      setFeedback({
        type: 'error',
        text: `Lời chúc tối đa ${MAX_WISH_LENGTH} ký tự.`,
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    // Allow empty inputs: polite fallbacks when left blank
    const finalNickname = cleanNickname || 'Người bạn ẩn danh';
    const finalMessage = rawMessage || 'Chúc mừng bạn tốt nghiệp cử nhân thành công! 🎓💛';

    // Build payload strictly adhering to specification
    const payload = currentGuest
      ? {
          action: 'wish',
          source: 'personal',
          guestName: currentGuest.guestName,
          salutation: currentGuest.salutation || '',
          code: currentGuest.code,
          linkId: currentGuest.linkId || '',
          status: currentGuest.rsvpStatus || 'wish',
          message: finalMessage,
        }
      : {
          action: 'wish',
          source: 'public',
          nickname: cleanNickname,
          guestName: finalNickname,
          salutation: '',
          code: '',
          linkId: '',
          status: '',
          message: finalMessage,
        };

    try {
      const res = await fetch('/api/invitations/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // Check explicit success from endpoint - never assume success on opaque response
      if (res.ok && data.success === true) {
        setMessage(''); // Clear wish input upon success
        setFeedback({
          type: 'success',
          text: 'Mình nhận được lời chúc rồi, cảm ơn bạn nhé! 💛',
        });

        // Festive celebration upon wish sent
        playBurst({ pan: 0, pitch: 1.15, intensity: 0.85, withCrackles: true });
        if (!shouldReduceMotion) {
          confetti({
            particleCount: 35,
            spread: 70,
            origin: { y: 0.65 },
            colors: ['#D6B274', '#F5B700', '#15489D', '#E44735', '#FFFFFF'],
            ticks: 200,
            gravity: 0.85,
            scalar: 0.85,
            disableForReducedMotion: true,
          });
        }

        if (onWishSubmitted) {
          onWishSubmitted(finalMessage);
        }
      } else {
        // Retain input for re-submission on failure
        setFeedback({
          type: 'error',
          text: data.error || data.message || 'Không thể gửi lời chúc lúc này. Vui lòng thử lại sau nhé.',
        });
      }
    } catch {
      // Retain input on network or connection errors
      setFeedback({
        type: 'error',
        text: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng và thử lại nhé.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="guestbook-wish"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto"
    >
      <div className="card-academic-gold-border rounded-2xl shadow-xl overflow-hidden bg-[#FCFAF6] relative p-6 sm:p-8">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-2 right-2 pointer-events-none opacity-10 select-none">
          <GraduationCapIcon className="w-20 h-20 text-[#15489D]" />
        </div>
        <div className="absolute bottom-2 left-2 pointer-events-none opacity-10 select-none">
          <SunflowerIcon className="w-16 h-16 text-[#D6B274]" />
        </div>

        {/* Top Accent Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#15489D] via-[#D6B274] to-[#E44735]" />

        <div className="relative z-10 space-y-5">
          {/* Section Header with Mascot and Prompt */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="h-px w-6 sm:w-8 bg-[#D6B274]" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#947229]">
                SỔ LƯU BÚT TỐT NGHIỆP
              </span>
              <span className="h-px w-6 sm:w-8 bg-[#D6B274]" />
            </div>

            <div className="flex flex-col items-center justify-center pt-0.5 pb-1">
              <GraduationWavingMascot className="w-24 h-24 sm:w-28 sm:h-28" />
              <p className="text-sm sm:text-base font-serif italic text-slate-800 mt-2 max-w-md leading-relaxed">
                “Ghé qua rồi, để lại cho mình một lời chúc bên dưới nhé!”
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            {currentGuest ? (
              /* Personalized Invitation Mode: Identity locked to verified guest */
              <div className="rounded-xl bg-[#FAF5ED] border border-[#D6B274]/40 p-3.5 flex items-center gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#15489D]/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-[#15489D]" />
                </div>
                <div className="text-xs sm:text-sm text-slate-600 truncate min-w-0">
                  <span>Gửi lời chúc với tên: </span>
                  <strong className="text-[#15489D] font-semibold block sm:inline truncate">
                    {currentGuest.guestName}
                  </strong>
                </div>
              </div>
            ) : (
              /* General / Public Mode: Nickname Input (Optional, placeholder empty) */
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="wish-nickname" className="block text-xs font-semibold text-slate-700">
                    Tên gọi / Nickname <span className="text-slate-400 font-normal">(tùy chọn)</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                    {nickname.length}/{MAX_NICKNAME_LENGTH}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="wish-nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      if (feedback?.type === 'error') setFeedback(null);
                    }}
                    maxLength={MAX_NICKNAME_LENGTH}
                    placeholder=""
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-[#D6B274]/45 bg-white px-4 py-2.5 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-[#15489D] focus:ring-2 focus:ring-[#15489D]/15 disabled:opacity-60 placeholder:text-transparent"
                  />
                </div>
              </div>
            )}

            {/* Multiline Message Textarea (placeholder empty) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="wish-message" className="block text-xs font-semibold text-slate-700">
                  Lời chúc của bạn <span className="text-slate-400 font-normal">(tùy chọn)</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                  {message.length}/{MAX_WISH_LENGTH}
                </span>
              </div>
              <textarea
                id="wish-message"
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (feedback?.type === 'error') setFeedback(null);
                }}
                maxLength={MAX_WISH_LENGTH}
                placeholder=""
                disabled={isSubmitting}
                className="w-full rounded-xl border border-[#D6B274]/45 bg-white p-4 text-xs sm:text-sm text-slate-800 outline-none transition focus:border-[#15489D] focus:ring-2 focus:ring-[#15489D]/15 disabled:opacity-60 resize-y min-h-[110px] placeholder:text-transparent leading-relaxed"
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#15489D] hover:bg-[#113A7E] text-white py-3 px-5 text-xs sm:text-sm font-semibold transition-all duration-150 disabled:opacity-60 cursor-pointer shadow-xs active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi lời chúc</span>
                </>
              )}
            </button>

            {/* Live Feedback Announcement */}
            <div aria-live="polite">
              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.div
                    key={feedback.type + feedback.text}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm border flex items-start gap-2.5 shadow-2xs ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{feedback.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Decorative Bottom Filigree */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-[#D6B274]/20 text-[11px] text-slate-400 font-mono">
            <Sparkles className="w-3 h-3 text-[#D6B274]" />
            <span>Trân trọng &amp; Biết ơn</span>
            <Sparkles className="w-3 h-3 text-[#D6B274]" />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
