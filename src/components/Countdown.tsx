import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { EVENT_CONFIG } from '../config/event.ts';
import { Sparkles } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isPast: boolean;
}

interface AnimatedDigitUnitProps {
  label: string;
  value: string | number;
  delayIndex: number;
  shouldReduceMotion: boolean | null;
}

const AnimatedDigitUnit: React.FC<AnimatedDigitUnitProps> = ({
  label,
  value,
  delayIndex,
  shouldReduceMotion,
}) => {
  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: shouldReduceMotion ? 0 : delayIndex * 0.07,
        ease: 'easeOut',
      }}
      className="bg-white border border-[#D6B274]/40 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col items-center justify-center transition-colors hover:border-[#15489D]"
    >
      <div className="relative overflow-hidden h-10 sm:h-12 lg:h-14 w-full flex items-center justify-center">
        {shouldReduceMotion ? (
          <span className="font-mono tabular-nums text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#15489D] block leading-none">
            {value}
          </span>
        ) : (
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={String(value)}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="font-mono tabular-nums text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#15489D] block leading-none"
            >
              {value}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-slate-500 uppercase mt-2">
        {label}
      </span>
    </motion.div>
  );
};

export const Countdown: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Target timestamp: 2026-10-17T09:00:00+07:00
  const targetDate = new Date(EVENT_CONFIG.event.dateIso);
  const targetTime = targetDate.getTime();

  // End of graduation day: 2026-10-17T23:59:59+07:00
  const endOfDayTime = new Date('2026-10-17T23:59:59+07:00').getTime();

  const calculateTimeLeft = (): TimeLeft => {
    const now = Date.now();

    if (now >= endOfDayTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false, isPast: true };
    }

    if (now >= targetTime && now < endOfDayTime) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true, isPast: false };
    }

    const difference = Math.max(0, targetTime - now);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, isToday: false, isPast: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft());
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    // Refresh immediately when returning from background tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateCountdown();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <motion.section
      id="countdown"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center"
    >
      <div className="card-academic-gold-border rounded-2xl p-6 sm:p-10 shadow-md">
        {/* Eyebrow Label */}
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#15489D] mb-2 font-medium">
          ✦ ĐẾM NGƯỢC
        </p>

        {/* Level 1: Main Heading */}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17243A]">
          Ngày tốt nghiệp đang đến gần
        </h2>

        {/* Level 2: Clean Event Date */}
        <p className="text-xs sm:text-sm text-slate-500 font-sans mt-1.5 mb-8">
          17.10.2026 · 09:00
        </p>

        {/* State 1: Graduation day has arrived */}
        {mounted && timeLeft.isToday ? (
          <div className="py-8 px-6 bg-[#15489D]/10 rounded-xl border border-[#15489D]/30 max-w-lg mx-auto">
            <span className="text-4xl block mb-2">🎓</span>
            <h3 className="text-2xl font-serif font-bold text-[#15489D]">
              Hôm nay là ngày tốt nghiệp!
            </h3>
            <p className="text-sm text-slate-700 mt-2 font-serif italic">
              Một cột mốc đáng nhớ đã đến. 🎓
            </p>
          </div>
        ) : mounted && timeLeft.isPast ? (
          /* State 2: Past event memorial */
          <div className="py-8 px-6 bg-[#FAF7F0] rounded-xl border border-[#D6B274]/40 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 mx-auto text-[#D6B274] mb-2" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17243A]">
              Dấu mốc đáng nhớ · 17.10.2026
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 font-serif italic">
              Khoảnh khắc thiêng liêng đã hoàn thành rực rỡ. Cảm ơn tất cả mọi người đã luôn đồng hành!
            </p>
          </div>
        ) : (
          /* State 3: Active Countdown Clock with Smooth Digit Transition */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            <AnimatedDigitUnit
              label="NGÀY"
              value={mounted ? formatNumber(timeLeft.days) : '00'}
              delayIndex={0}
              shouldReduceMotion={shouldReduceMotion}
            />
            <AnimatedDigitUnit
              label="GIỜ"
              value={mounted ? formatNumber(timeLeft.hours) : '00'}
              delayIndex={1}
              shouldReduceMotion={shouldReduceMotion}
            />
            <AnimatedDigitUnit
              label="PHÚT"
              value={mounted ? formatNumber(timeLeft.minutes) : '00'}
              delayIndex={2}
              shouldReduceMotion={shouldReduceMotion}
            />
            <AnimatedDigitUnit
              label="GIÂY"
              value={mounted ? formatNumber(timeLeft.seconds) : '00'}
              delayIndex={3}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
};
