import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { HeaderNav } from './components/HeaderNav.tsx';
import { PersonalizedInvitation } from './components/PersonalizedInvitation.tsx';
import { Countdown } from './components/Countdown.tsx';
import { LocationSection } from './components/LocationSection.tsx';
import { ClosingSection } from './components/ClosingSection.tsx';
import { RsvpSection } from './components/RsvpSection.tsx';
import { EVENT_CONFIG } from './config/event.ts';

type CurrentGuest = {
  id: string;
  linkId: string;
  code: string;
  guestName: string;
  salutation?: string;
  rsvpStatus?: 'attending' | 'maybe' | 'remote' | 'wish';
  rsvpMessage?: string;
};

export default function App() {
  const [currentGuest, setCurrentGuest] = useState<CurrentGuest | null>(null);
  const [isResolvingLink, setIsResolvingLink] = useState(false);
  const [linkError, setLinkError] = useState('');

  const fireGentleConfetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D6B274', '#15489D', '#F5B700', '#FFFFFF'],
        ticks: 200,
        gravity: 0.8,
        scalar: 0.9,
        disableForReducedMotion: true,
      });
    } catch {
      // The invitation remains fully usable when animation is unavailable.
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    const personalizedPath = window.location.pathname.match(/^\/home\/(\d{4,12})\/?$/i);

    if (!personalizedPath && !codeParam) return;

    setIsResolvingLink(true);
    const request = personalizedPath
      ? fetch(`/api/invitations/home/${encodeURIComponent(personalizedPath[1])}`)
      : fetch('/api/invitations/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: codeParam?.trim().toUpperCase() }),
        });

    request
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.valid || !data.guest) {
          throw new Error(data.message || 'Liên kết thiệp mời chưa chính xác.');
        }
        return data.guest as CurrentGuest;
      })
      .then((guest) => {
        setCurrentGuest(guest);
        fireGentleConfetti();
      })
      .catch((error) => {
        setLinkError(error instanceof Error ? error.message : 'Không thể mở liên kết thiệp mời.');
      })
      .finally(() => setIsResolvingLink(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#17243A] selection:bg-[#15489D]/20 selection:text-[#15489D]">
      <HeaderNav />

      <main className="flex-1 pb-16">
        {isResolvingLink ? (
          <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
            <div className="space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full border-2 border-[#D6B274] border-t-[#15489D] animate-spin" />
              <p className="text-sm font-serif text-slate-600">Đang chuẩn bị lời chào dành riêng cho bạn...</p>
            </div>
          </div>
        ) : (
          <>
            {currentGuest ? (
              <PersonalizedInvitation
                guestName={currentGuest.guestName}
                salutation={currentGuest.salutation}
                guestCode={currentGuest.code}
                linkId={currentGuest.linkId}
              />
            ) : (
              <div className="py-8 px-4 text-center max-w-4xl mx-auto">
                {linkError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-[#B42318]">
                    {linkError} Bạn vẫn có thể xem thông tin chung của buổi lễ.
                  </div>
                )}
                <div className="p-5 bg-white border border-[#D6B274]/40 rounded-xl shadow-2xs text-left">
                  <p className="text-xs font-mono uppercase text-[#15489D]">
                    THIỆP MỜI LỄ TỐT NGHIỆP 2026 · ĐẶNG CÔNG MINH
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    Chào mừng bạn đến với trang thông tin lễ tốt nghiệp. Thiệp cá nhân hóa được mở trực tiếp từ liên kết riêng đã gửi đến từng khách mời.
                  </p>
                </div>
              </div>
            )}

            <Countdown />
            <LocationSection />

            {currentGuest && (
              <div className="max-w-4xl mx-auto px-4">
                <RsvpSection
                  guestCode={currentGuest.code}
                  guestName={currentGuest.guestName}
                  initialMessage={currentGuest.rsvpMessage}
                  onWishSubmitted={(message) => {
                    setCurrentGuest((previous) =>
                      previous ? { ...previous, rsvpStatus: 'wish', rsvpMessage: message } : null
                    );
                  }}
                />
              </div>
            )}

            <ClosingSection />
          </>
        )}
      </main>

      <footer className="border-t border-[#D6B274]/30 bg-[#FAF7F1] py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {EVENT_CONFIG.student.displayName} · {EVENT_CONFIG.institution.nameVi}</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>{EVENT_CONFIG.student.faculty}</span>
            <span>·</span>
            <span>{EVENT_CONFIG.student.major}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
