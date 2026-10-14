import React, { useState } from 'react';
import { TdtuLogo } from './TdtuLogo.tsx';
import { WaxSealEmblem, GraduationCapIcon } from './SunflowerCapMotif.tsx';
import { EVENT_CONFIG } from '../config/event.ts';
import { KeyRound, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface InvitationEntranceProps {
  onResolveSuccess: (guestData: {
    id: string;
    linkId: string;
    code: string;
    guestName: string;
    salutation?: string;
    rsvpStatus?: 'attending' | 'maybe' | 'remote';
    rsvpMessage?: string;
  }) => void;
  onExploreGeneral: () => void;
  initialCode?: string;
}

export const InvitationEntrance: React.FC<InvitationEntranceProps> = ({
  onResolveSuccess,
  onExploreGeneral,
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isOpening, setIsOpening] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage('Bạn vui lòng nhập mã thiệp mời nhé.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/invitations/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode }),
      });

      const data = await res.json();

      if (res.ok && data.valid && data.guest) {
        setIsOpening(true);
        setTimeout(() => {
          onResolveSuccess(data.guest);
        }, 800);
      } else {
        setErrorMessage(
          data.message || 'Mã thiệp mời chưa chính xác. Bạn vui lòng kiểm tra lại nhé.'
        );
      }
    } catch (err) {
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau vài giây.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseSampleCode = (sampleCode: string) => {
    setCode(sampleCode);
    setErrorMessage('');
  };

  return (
    <div className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      {/* Institutional Crest & Brand */}
      <div className="flex flex-col items-center justify-center mb-6">
        <TdtuLogo size="md" className="mb-4" />
        <span className="text-xs uppercase tracking-widest font-mono text-[#15489D] font-medium">
          {EVENT_CONFIG.student.classCohort} · {EVENT_CONFIG.student.majorEnglish}
        </span>
      </div>

      {/* Luxury Envelope Representation */}
      <div className="relative max-w-xl mx-auto mt-4 mb-8">
        <div
          className={`card-academic-gold-border rounded-xl p-8 sm:p-10 shadow-lg transition-all duration-700 ${
            isOpening ? 'scale-105 opacity-90' : 'hover:shadow-xl'
          }`}
        >
          {/* Top Wax Seal */}
          <div className="flex justify-center -mt-16 mb-4">
            <WaxSealEmblem text="2026" className="w-20 h-20" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D6B274] bg-[#17243A] px-3 py-1 rounded-sm">
              <span>{EVENT_CONFIG.event.concept}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#17243A] leading-tight">
              Một cột mốc đáng nhớ.
              <br />
              <span className="text-[#15489D] italic font-normal">Một lời mời dành riêng cho bạn.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed pt-1">
              Nhập mã thiệp mời cá nhân để xem thông tin trang trọng được thiết kế riêng dành cho bạn.
            </p>
          </div>

          {/* Code Input Form */}
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto">
            <div className="relative flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-[#D6B274]" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Ví dụ: CM-7K4M9P"
                  maxLength={16}
                  autoComplete="off"
                  spellCheck="false"
                  disabled={loading || isOpening}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#D6B274]/50 focus:border-[#15489D] focus:ring-2 focus:ring-[#15489D]/20 rounded-md text-sm font-mono tracking-wider uppercase text-slate-900 placeholder:text-slate-400 placeholder:normal-case transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || isOpening}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#15489D] hover:bg-[#113A7E] text-white text-sm font-medium rounded-md shadow-xs transition-colors disabled:opacity-60 whitespace-nowrap active:translate-y-0.5 cursor-pointer"
              >
                {loading || isOpening ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang mở thiệp...</span>
                  </>
                ) : (
                  <>
                    <span>Mở thiệp mời</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-[#E44735] font-medium animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick demo codes hint for reviewers */}
            <div className="mt-6 pt-5 border-t border-[#D6B274]/20 text-xs text-slate-500">
              <span className="text-slate-400">Mã mẫu thử nghiệm: </span>
              <button
                type="button"
                onClick={() => handleUseSampleCode('CM-7K4M9P')}
                className="underline hover:text-[#15489D] font-mono mr-2 cursor-pointer"
              >
                CM-7K4M9P
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => handleUseSampleCode('CM-8R2T6X')}
                className="underline hover:text-[#15489D] font-mono mx-2 cursor-pointer"
              >
                CM-8R2T6X
              </button>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => handleUseSampleCode('CM-GIADINH')}
                className="underline hover:text-[#15489D] font-mono ml-2 cursor-pointer"
              >
                CM-GIADINH
              </button>
            </div>
          </form>

          {/* Option to view basic event details without code */}
          <div className="mt-6">
            <button
              type="button"
              onClick={onExploreGeneral}
              className="text-xs text-slate-500 hover:text-[#15489D] underline transition-colors cursor-pointer"
            >
              Xem thông tin sự kiện cơ bản không cần mã →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
