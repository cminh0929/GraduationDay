import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EVENT_CONFIG } from '../config/event.ts';
import { SunflowerIcon, GraduationCapIcon, DiplomaScrollIcon } from './SunflowerCapMotif.tsx';

export const ClosingSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id="closing"
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

        {/* Top small icon pair */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <SunflowerIcon className="w-7 h-7" />
          <div className="h-4 w-px bg-[#D6B274]" />
          <DiplomaScrollIcon className="w-7 h-7" />
        </div>

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
