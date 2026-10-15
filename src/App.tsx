import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { HeaderNav } from './components/HeaderNav.tsx';
import { PersonalizedInvitation } from './components/PersonalizedInvitation.tsx';
import { Countdown } from './components/Countdown.tsx';
import { LocationSection } from './components/LocationSection.tsx';
import { ClosingSection } from './components/ClosingSection.tsx';
import { RsvpSection } from './components/RsvpSection.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { FloatingCallBubble } from './components/FloatingCallBubble.tsx';
import { PublicInvitationAccess } from './components/PublicInvitationAccess.tsx';
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
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname === '/admin';
  });
  const activeTimeoutsRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasCelebratedRef = React.useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      setIsAdminOpen(window.location.pathname === '/admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Grand Graduation Fireworks Celebration
  const fireGrandCelebration = () => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (hasCelebratedRef.current) return;
    hasCelebratedRef.current = true;

    // Clear any previous scheduled bursts
    activeTimeoutsRef.current.forEach((t) => clearTimeout(t));
    activeTimeoutsRef.current = [];

    const isMobile = window.innerWidth < 768;
    const scale = isMobile ? 0.55 : 1.0;

    // Official event palette
    const colors = ['#15489D', '#D6B274', '#F5B700', '#FFFFFF', '#E44735'];
    const goldWhiteColors = ['#D6B274', '#F5B700', '#FFFFFF'];
    const navyGoldColors = ['#15489D', '#D6B274', '#FFFFFF'];

    const scheduleBurst = (delayMs: number, fn: () => void) => {
      const id = setTimeout(() => {
        try {
          fn();
        } catch {
          // Keep invitation intact even if confetti fails
        }
      }, delayMs);
      activeTimeoutsRef.current.push(id);
    };

    // Staggered Timeline (Total celebration ~ 2.5 - 3.0s):
    // Stage 1 (0ms): Dual lower-corner fireworks launch
    scheduleBurst(0, () => {
      // Left lower corner cannon
      confetti({
        particleCount: Math.round(40 * scale),
        angle: 60,
        spread: 55,
        startVelocity: 55,
        origin: { x: 0.12, y: 0.88 },
        colors,
        shapes: ['circle', 'square'],
        ticks: 240,
        gravity: 0.85,
        scalar: 0.9,
        disableForReducedMotion: true,
      });

      // Right lower corner cannon
      confetti({
        particleCount: Math.round(40 * scale),
        angle: 120,
        spread: 55,
        startVelocity: 55,
        origin: { x: 0.88, y: 0.88 },
        colors,
        shapes: ['circle', 'square'],
        ticks: 240,
        gravity: 0.85,
        scalar: 0.9,
        disableForReducedMotion: true,
      });
    });

    // Stage 2 (280ms): Fast star-shaped bursts rising from lower sides
    scheduleBurst(280, () => {
      confetti({
        particleCount: Math.round(25 * scale),
        angle: 65,
        spread: 60,
        startVelocity: 62,
        origin: { x: 0.18, y: 0.82 },
        colors: goldWhiteColors,
        shapes: ['star'],
        ticks: 220,
        gravity: 0.9,
        scalar: 1.2,
        disableForReducedMotion: true,
      });

      confetti({
        particleCount: Math.round(25 * scale),
        angle: 115,
        spread: 60,
        startVelocity: 62,
        origin: { x: 0.82, y: 0.82 },
        colors: goldWhiteColors,
        shapes: ['star'],
        ticks: 220,
        gravity: 0.9,
        scalar: 1.2,
        disableForReducedMotion: true,
      });
    });

    // Stage 3 (700ms): Central Grand Explosion
    scheduleBurst(700, () => {
      // Full spread central burst
      confetti({
        particleCount: Math.round(65 * scale),
        angle: 90,
        spread: 100,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.45 },
        colors,
        shapes: ['circle', 'square', 'star'],
        ticks: 260,
        gravity: 0.75,
        scalar: 0.95,
        disableForReducedMotion: true,
      });

      // Higher velocity golden stars burst
      confetti({
        particleCount: Math.round(30 * scale),
        angle: 90,
        spread: 125,
        startVelocity: 55,
        decay: 0.92,
        origin: { x: 0.5, y: 0.45 },
        colors: goldWhiteColors,
        shapes: ['star'],
        ticks: 200,
        gravity: 0.8,
        scalar: 1.25,
        disableForReducedMotion: true,
      });
    });

    // Stage 4 (1250ms): Gentle slow-falling golden shimmer rain
    scheduleBurst(1250, () => {
      confetti({
        particleCount: Math.round(15 * scale),
        angle: 85,
        spread: 50,
        startVelocity: 25,
        origin: { x: 0.35, y: 0.32 },
        colors: navyGoldColors,
        shapes: ['circle', 'star'],
        ticks: 200,
        gravity: 0.65,
        scalar: 0.8,
        disableForReducedMotion: true,
      });

      confetti({
        particleCount: Math.round(15 * scale),
        angle: 95,
        spread: 50,
        startVelocity: 25,
        origin: { x: 0.65, y: 0.32 },
        colors: navyGoldColors,
        shapes: ['circle', 'star'],
        ticks: 200,
        gravity: 0.65,
        scalar: 0.8,
        disableForReducedMotion: true,
      });
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeParam = params.get('code');
    const personalizedPath = window.location.pathname.match(/^\/home\/([a-zA-Z0-9]{4,12})\/?$/i);

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
        fireGrandCelebration();
      })
      .catch((error) => {
        setLinkError(error instanceof Error ? error.message : 'Không thể mở liên kết thiệp mời.');
      })
      .finally(() => setIsResolvingLink(false));

    return () => {
      activeTimeoutsRef.current.forEach((t) => clearTimeout(t));
      activeTimeoutsRef.current = [];
    };
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
              <>
                <PublicInvitationAccess
                  initialError={linkError}
                  onDismissError={() => setLinkError('')}
                  onResolveSuccess={(guest) => {
                    setLinkError('');
                    setCurrentGuest(guest);
                    fireGrandCelebration();
                  }}
                />
                <PersonalizedInvitation
                  guestName="Bạn bè và những người thân quý"
                  isGeneral
                />
              </>
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

      {/* Floating Call Bubble for quick guest contact */}
      <FloatingCallBubble />

      <footer className="border-t border-[#D6B274]/30 bg-[#FAF7F1] py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 {EVENT_CONFIG.student.displayName} · {EVENT_CONFIG.institution.nameVi}</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>{EVENT_CONFIG.student.faculty}</span>
            <span>·</span>
            <span>{EVENT_CONFIG.student.major}</span>
            <span>·</span>
            <button
              onClick={() => {
                setIsAdminOpen(true);
                window.history.pushState({}, '', '/admin');
              }}
              className="hover:text-[#15489D] transition-colors cursor-pointer"
            >
              Quản trị
            </button>
          </div>
        </div>
      </footer>

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.pathname === '/admin') {
            window.history.pushState({}, '', '/');
          }
        }}
        onSelectCodeToTest={(code) => {
          window.location.href = `/?code=${encodeURIComponent(code)}`;
        }}
      />
    </div>
  );
}
