import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Phone } from 'lucide-react';
import { EVENT_CONFIG } from '../config/event.ts';

export const FloatingCallBubble: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const phone = EVENT_CONFIG.student.phoneNumber || '0818864844';
  const displayPhone = EVENT_CONFIG.student.displayPhone || '0818 864 844';

  return (
    <motion.aside
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: 'easeOut' }}
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center"
      aria-label="Liên hệ hỗ trợ tân cử nhân"
    >
      <motion.a
        href={`tel:${phone}`}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
        title="Alo cho Minh (0818 864 844)"
        className="group relative flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#15489D] hover:bg-[#0E3574] text-white rounded-full shadow-[0_8px_25px_-4px_rgba(21,72,157,0.45)] border border-[#D6B274]/60 transition-all cursor-pointer select-none"
      >
        {/* Subtle Radar Pulse Ring */}
        {!shouldReduceMotion && (
          <span
            className="absolute -inset-1 rounded-full bg-[#15489D] opacity-40 animate-ping pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Phone Icon */}
        <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 text-[#F6DF99] group-hover:text-white transition-colors">
          <Phone className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-pulse" />
        </div>

        {/* Bubble Label & Phone Number */}
        <div className="flex flex-col text-left leading-tight pr-1">
          <span className="text-[10px] sm:text-[11px] text-[#F6DF99] font-medium tracking-wide">
            Cần hỏi đường cứ alo
          </span>
          <span className="text-xs sm:text-sm font-bold font-mono tracking-wider text-white">
            {displayPhone}
          </span>
        </div>
      </motion.a>
    </motion.aside>
  );
};
