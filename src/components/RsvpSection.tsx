import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { CheckCircle2, Send, Loader2, AlertCircle, User, Sparkles } from 'lucide-react';
import { GraduationCapIcon, SunflowerIcon } from './SunflowerCapMotif.tsx';

interface RsvpSectionProps {
  guestCode: string;
  guestName: string;
  initialMessage?: string;
  onWishSubmitted?: (message: string) => void;
}

interface FeedbackState {
  type: 'success' | 'error';
  text: string;
}

const MAX_WISH_LENGTH = 500;

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  guestCode,
  guestName,
  initialMessage = '',
  onWishSubmitted,
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(initialMessage));
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage) {
      setFeedback({
        type: 'error',
        text: 'Bạn hãy viết một lời chúc trước khi gửi nhé.',
      });
      return;
    }
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/invitations/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: guestCode,
          status: 'wish',
          message: cleanMessage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setFeedback({
          type: 'success',
          text: 'Minh đã nhận được lời nhắn của bạn. Cảm ơn nhé!',
        });
        if (onWishSubmitted) {
          onWishSubmitted(cleanMessage);
        }
      } else {
        setFeedback({
          type: 'error',
          text: data.error || 'Có lỗi xảy ra, vui lòng thử lại.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="guestbook-wish"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mt-10 pt-8 border-t border-[#D6B274]/30"
    >
      <div className="max-w-xl mx-auto text-left relative overflow-hidden bg-[#FCFAF6] border border-[#D6B274]/40 rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_-6px_rgba(23,36,58,0.06)]">
        {/* Subtle Academic Guestbook Decorative Accents */}
        <div
          className="absolute -top-3 -right-3 sm:top-1 sm:right-2 pointer-events-none opacity-15 select-none"
          aria-hidden="true"
        >
          <GraduationCapIcon className="w-20 h-20 sm:w-24 sm:h-24 text-[#15489D]" />
        </div>
        <div
          className="absolute -bottom-4 -left-4 sm:bottom-0 sm:left-1 pointer-events-none opacity-15 select-none"
          aria-hidden="true"
        >
          <SunflowerIcon className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
        <div
          className="absolute top-4 right-20 pointer-events-none opacity-30 select-none hidden sm:block"
          aria-hidden="true"
        >
          <Sparkles className="w-4 h-4 text-[#D6B274]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-5 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17243A] tracking-tight">
              Gửi lời chúc đến Minh
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-serif italic mt-1">
              Một chút sẻ chia cho ngày tốt nghiệp thêm đáng nhớ.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Writing Area */}
            <div>
              <label htmlFor="guest-wish-message" className="sr-only">
                Lời chúc của bạn
              </label>
              <textarea
                id="guest-wish-message"
                name="guestWishMessage"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (feedback?.type === 'error') setFeedback(null);
                }}
                rows={5}
                maxLength={MAX_WISH_LENGTH}
                required
                className="w-full min-h-[130px] sm:min-h-[145px] p-3.5 sm:p-4 bg-white border border-[#D6B274]/35 focus:border-[#15489D] focus:ring-2 focus:ring-[#15489D]/15 rounded-xl text-sm sm:text-base text-slate-800 placeholder:text-transparent outline-none transition-all duration-200 resize-y leading-relaxed"
              />

              {/* Character Counter - Aligned to bottom-right, non-overlapping */}
              <div className="flex justify-end pt-1.5 pr-0.5">
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {message.length}/{MAX_WISH_LENGTH}
                </span>
              </div>
            </div>

            {/* Footer Row: Guest Identity (Left) & Send Action (Right) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
                <User className="w-3.5 h-3.5 text-[#D6B274] shrink-0" />
                <span className="truncate">
                  Khách mời:{' '}
                  <strong className="font-semibold text-slate-800">
                    {guestName}
                  </strong>
                </span>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={
                  shouldReduceMotion || isSubmitting
                    ? undefined
                    : { scale: 1.02 }
                }
                whileTap={
                  shouldReduceMotion || isSubmitting
                    ? undefined
                    : { scale: 0.98 }
                }
                transition={{ duration: 0.15 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#15489D] hover:bg-[#113A7E] text-white text-xs sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-60 cursor-pointer shadow-xs active:translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {submitted ? 'Cập nhật lời chúc' : 'Gửi lời chúc'}
                    </span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Accessible Live Feedback Announcement */}
            <div aria-live="polite" className="pt-1">
              <AnimatePresence mode="wait">
                {feedback && (
                  <motion.div
                    key={feedback.type + feedback.text}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: -6 }
                    }
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`p-3 rounded-lg text-xs sm:text-sm border flex items-center gap-2.5 shadow-2xs ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    )}
                    <span>{feedback.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  );
};
