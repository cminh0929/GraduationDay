import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import confetti from 'canvas-confetti';
import { EVENT_CONFIG } from '../config/event.ts';
import { SunflowerIcon, GraduationCapIcon, DiplomaScrollIcon } from './SunflowerCapMotif.tsx';

// -----------------------------------------------------------------------
// CapTossAnimation: a small animated graduation cap that flips/tosses up
// Triggered once via IntersectionObserver; respects reduced-motion
// -----------------------------------------------------------------------
const CapTossAnimation: React.FC<{
  isVisible: boolean;
  shouldReduceMotion: boolean | null;
}> = ({ isVisible, shouldReduceMotion }) => {
  return (
    <>
      <style>{`
        @keyframes capToss {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          40%  { transform: translateY(-22px) rotate(-18deg) scale(1.08); opacity: 1; }
          70%  { transform: translateY(-14px) rotate(10deg) scale(1.04); opacity: 1; }
          85%  { transform: translateY(-4px) rotate(-4deg) scale(1.01); opacity: 1; }
          100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
        }
        .cap-toss-animate {
          animation: capToss 0.9s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .cap-toss-animate { animation: none !important; }
        }
      `}</style>
      <div
        className={`flex items-center justify-center mb-4 ${isVisible && !shouldReduceMotion ? 'cap-toss-animate' : ''}`}
        style={{ willChange: 'transform' }}
        aria-hidden="true"
      >
        <GraduationCapIcon className="w-14 h-14 sm:w-16 sm:h-16 text-[#15489D]" />
      </div>
    </>
  );
};

export const ClosingSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);
  const confettiFiredRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const el = sectionRef.current;
    if (!el) return;

    const fireClosingCelebration = () => {
      if (confettiFiredRef.current) return;
      confettiFiredRef.current = true;
      setHasTriggered(true);

      const colors = ['#D6B274', '#F5B700', '#15489D', '#FCFAF6', '#E44735'];

      // Small left burst
      confetti({
        particleCount: 18,
        angle: 55,
        spread: 50,
        startVelocity: 28,
        origin: { x: 0.28, y: 0.8 },
        colors,
        shapes: ['circle', 'star'],
        ticks: 180,
        gravity: 0.9,
        scalar: 0.75,
        disableForReducedMotion: true,
      });

      // Small right burst
      confetti({
        particleCount: 18,
        angle: 125,
        spread: 50,
        startVelocity: 28,
        origin: { x: 0.72, y: 0.8 },
        colors,
        shapes: ['circle', 'star'],
        ticks: 180,
        gravity: 0.9,
        scalar: 0.75,
        disableForReducedMotion: true,
      });

      // Center soft gold shower
      setTimeout(() => {
        confetti({
          particleCount: 22,
          angle: 90,
          spread: 80,
          startVelocity: 20,
          origin: { x: 0.5, y: 0.78 },
          colors: ['#D6B274', '#F5B700', '#FCFAF6'],
          shapes: ['star'],
          ticks: 200,
          gravity: 0.7,
          scalar: 0.85,
          disableForReducedMotion: true,
        });
      }, 220);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            fireClosingCelebration();
            observer.disconnect();
            break;
          }
        }
      },
      {
        threshold: 0.35, // fire when 35% of the section is visible
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldReduceMotion]);

  return (
    <motion.section
      id="closing"
      ref={sectionRef}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center"
    >
      <div className="card-academic-gold-border rounded-2xl p-8 sm:p-14 shadow-md bg-[#FAF7F1] relative overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-4 left-4 opacity-15">
          <SunflowerIcon className="w-16 h-16" />
        </div>
        <div className="absolute bottom-4 right-4 opacity-15">
          <GraduationCapIcon className="w-16 h-16" />
        </div>

        {/* Top small icon pair — cap animates on scroll-in */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <CapTossAnimation isVisible={hasTriggered} shouldReduceMotion={shouldReduceMotion} />

          <div className="flex items-center gap-3">
            <SunflowerIcon className="w-7 h-7" />
            <div className="h-4 w-px bg-[#D6B274]" />
            <DiplomaScrollIcon className="w-7 h-7" />
          </div>
        </div>

        {/* Thank-you message — appears when closing section is triggered */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={hasTriggered || shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
          className="text-sm sm:text-base font-serif italic text-[#15489D] mb-5"
        >
          "Cảm ơn bạn đã cùng mình lưu giữ khoảnh khắc này!"
        </motion.p>

        {/* Emotional Quote - Reveal 500ms */}
        <motion.blockquote
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-lg sm:text-xl md:text-2xl font-serif italic text-slate-800 leading-relaxed">
            "{EVENT_CONFIG.closing.quote}"
          </p>
        </motion.blockquote>

        {/* Signature & Credentials - Reveal after ~200ms */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
          className="mt-8 pt-6 border-t border-[#D6B274]/35 max-w-xs mx-auto"
        >
          <p className="text-xs uppercase tracking-widest font-mono text-slate-400 mb-1">
            THÂN ÁI VÀ BIẾT ƠN
          </p>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#15489D] tracking-tight">
            {EVENT_CONFIG.closing.signer}
          </h3>
          <p className="text-xs font-mono text-slate-600 mt-1">
            {EVENT_CONFIG.closing.subline}
          </p>
        </motion.div>

        {/* Footer Note */}
        <div className="mt-12 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-mono">
          <span>Hẹn gặp lại bạn tại Trường Đại học Tôn Đức Thắng</span>
          <span>·</span>
          <span>17.10.2026</span>
        </div>
      </div>
    </motion.section>
  );
};
