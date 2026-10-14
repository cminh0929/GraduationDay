import React, { useState } from 'react';
import { CheckCircle2, Send, Loader2, Heart } from 'lucide-react';

interface RsvpSectionProps {
  guestCode: string;
  guestName: string;
  initialMessage?: string;
  onWishSubmitted?: (message: string) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  guestCode,
  guestName,
  initialMessage = '',
  onWishSubmitted,
}) => {
  const [message, setMessage] = useState(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(Boolean(initialMessage));
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setFeedback('Bạn hãy viết một lời chúc trước khi gửi nhé.');
      return;
    }
    setIsSubmitting(true);
    setFeedback('');

    try {
      const res = await fetch('/api/invitations/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: guestCode,
          status: 'wish',
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setFeedback('Cảm ơn bạn! Minh đã nhận được lời chúc của bạn.');
        if (onWishSubmitted) {
          onWishSubmitted(message.trim());
        }
      } else {
        setFeedback(data.error || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
    } catch {
      setFeedback('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 pt-8 border-t border-[#D6B274]/30">
      <div className="max-w-xl mx-auto text-left bg-white p-6 sm:p-8 rounded-xl border border-[#D6B274]/40 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-[#E44735]" />
          <h3 className="text-base sm:text-lg font-serif font-bold text-[#17243A]">
            Gửi lời chúc đến Minh
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-6">
          Đôi lời của bạn sẽ là một kỷ niệm thật đẹp trong ngày tốt nghiệp của Minh.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Lời chúc mừng:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              required
              placeholder={`Viết đôi lời chúc mừng gửi tân cử nhân Đặng Công Minh...`}
              className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-[#15489D] focus:bg-white rounded-md text-xs sm:text-sm text-slate-800 outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Khách mời: {guestName}
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#15489D] hover:bg-[#113A7E] text-white text-xs font-medium rounded-md transition-colors disabled:opacity-60 cursor-pointer shadow-2xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitted ? 'Cập nhật lời chúc' : 'Gửi lời chúc'}</span>
                </>
              )}
            </button>
          </div>

          {feedback && (
            <div className="mt-3 p-2.5 rounded-md text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{feedback}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
