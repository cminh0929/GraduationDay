import React, { useState, useEffect } from 'react';
import { EVENT_CONFIG } from '../config/event.ts';
import { Calendar, BellRing, Sparkles } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isPast: boolean;
}

export const Countdown: React.FC = () => {
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
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <section id="countdown" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <div className="card-academic-gold-border rounded-2xl p-6 sm:p-10 shadow-md">
        {/* Section kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#15489D] uppercase mb-2">
          <BellRing className="w-3.5 h-3.5 text-[#D6B274]" />
          <span>ĐẾM NGƯỢC THỜI GIAN</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17243A]">
          Cột mốc Lễ Tốt Nghiệp 2026
        </h2>
        <p className="text-sm text-slate-600 mt-1 mb-8">
          {EVENT_CONFIG.event.dayOfWeek}, {EVENT_CONFIG.event.displayDate} · {EVENT_CONFIG.event.displayTime} ({EVENT_CONFIG.event.timeZone})
        </p>

        {/* State 1: Graduation day has arrived */}
        {mounted && timeLeft.isToday ? (
          <div className="py-8 px-6 bg-[#15489D]/10 rounded-xl border border-[#15489D]/30 max-w-lg mx-auto">
            <span className="text-4xl block mb-2">🎓</span>
            <h3 className="text-2xl font-serif font-bold text-[#15489D]">
              Ngày tốt nghiệp đã đến!
            </h3>
            <p className="text-sm text-slate-700 mt-2">
              Chào mừng bạn đến với Trường Đại học Tôn Đức Thắng hôm nay!
            </p>
          </div>
        ) : mounted && timeLeft.isPast ? (
          /* State 2: Past event memorial */
          <div className="py-8 px-6 bg-[#FAF7F0] rounded-xl border border-[#D6B274]/40 max-w-lg mx-auto">
            <Sparkles className="w-8 h-8 mx-auto text-[#D6B274] mb-2" />
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#17243A]">
              Graduation Day — A Moment to Remember
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Khoảnh khắc thiêng liêng đã hoàn thành rực rỡ. Cảm ơn tất cả mọi người đã luôn đồng hành!
            </p>
          </div>
        ) : (
          /* State 3: Active Countdown Clock */
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
            {[
              { label: 'NGÀY', value: mounted ? timeLeft.days : 0 },
              { label: 'GIỜ', value: mounted ? formatNumber(timeLeft.hours) : '00' },
              { label: 'PHÚT', value: mounted ? formatNumber(timeLeft.minutes) : '00' },
              { label: 'GIÂY', value: mounted ? formatNumber(timeLeft.seconds) : '00' },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#D6B274]/40 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col items-center justify-center transition-all hover:border-[#15489D]"
              >
                <span className="font-mono tabular-nums text-3xl sm:text-4xl lg:text-5xl font-bold text-[#15489D]">
                  {unit.value}
                </span>
                <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase mt-2">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-xs text-slate-500 flex items-center justify-center gap-2">
          <span>Target Timestamp:</span>
          <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
            {EVENT_CONFIG.event.dateIso}
          </code>
        </div>
      </div>
    </section>
  );
};
