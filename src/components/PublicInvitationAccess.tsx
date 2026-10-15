import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, KeyRound, Loader2, X } from 'lucide-react';

interface PublicInvitationAccessProps {
  initialError?: string;
  onDismissError?: () => void;
  onResolveSuccess: (guest: {
    id: string;
    linkId: string;
    code: string;
    guestName: string;
    salutation?: string;
    rsvpStatus?: 'attending' | 'maybe' | 'remote' | 'wish';
    rsvpMessage?: string;
  }) => void;
}

export const PublicInvitationAccess: React.FC<PublicInvitationAccessProps> = ({
  initialError = '',
  onDismissError,
  onResolveSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(Boolean(initialError));
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(initialError);

  useEffect(() => {
    if (initialError) {
      setErrorMessage(initialError);
      setIsOpen(true);
    }
  }, [initialError]);

  const showGeneralInvitation = () => {
    setCode('');
    setErrorMessage('');
    setIsOpen(false);
    onDismissError?.();
    if (window.location.pathname !== '/' || window.location.search) {
      window.history.replaceState({}, '', '/');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMessage('Bạn vui lòng nhập mã thiệp mời nhé.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/invitations/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode }),
      });
      const data = await response.json();

      if (!response.ok || !data.valid || !data.guest?.linkId) {
        throw new Error(data.message || 'Mã mời chưa chính xác. Bạn vui lòng kiểm tra và thử lại.');
      }

      window.history.pushState({}, '', `/home/${encodeURIComponent(data.guest.linkId)}`);
      onResolveSuccess(data.guest);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Không thể kiểm tra mã mời lúc này. Bạn vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Only render if an error occurred or explicit verification is active
  if (!isOpen && !errorMessage) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto pt-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-2xl border border-[#D6B274]/40 bg-[#FCFAF6] p-4 sm:p-5 shadow-md animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-3 border-b border-[#D6B274]/25 pb-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#947229]">
              Thông báo thiệp mời
            </span>
            <button
              type="button"
              onClick={showGeneralInvitation}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#15489D] transition-colors cursor-pointer"
              title="Đóng thông báo"
            >
              <span>Xem thiệp chung</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {errorMessage && (
            <div className="mb-3.5 rounded-lg bg-[#FFF7ED] border border-[#FDBA74]/50 p-3 text-xs text-[#9A3412]" role="alert">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#EA580C]" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D6B274]" />
              <input
                id="personal-invite-code"
                type="text"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value.toUpperCase());
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Nhập mã mời riêng (VD: CM-XXXXXX)"
                autoComplete="off"
                spellCheck={false}
                disabled={loading}
                className="w-full rounded-lg border border-[#D6B274]/50 bg-white py-2.5 pl-9 pr-3 text-xs sm:text-sm font-mono tracking-wider uppercase outline-none transition focus:border-[#15489D] focus:ring-2 focus:ring-[#15489D]/15 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#15489D] px-4 py-2.5 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-[#113A7E] disabled:opacity-60 cursor-pointer shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>Mở thiệp</span>
            </button>
          </div>

          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={showGeneralInvitation}
              className="text-xs text-slate-500 hover:text-[#15489D] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Tiếp tục xem thiệp mời chung
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
