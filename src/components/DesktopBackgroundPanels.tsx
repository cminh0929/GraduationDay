import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Left Side Background Panel:
 * A very subtle vertical typographic watermark panel with "CLASS OF 2026",
 * delicate editorial rules, and academic Roman numeral MMXXVI.
 */
export const LeftAcademicWatermarkPanel: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={
        shouldReduceMotion
          ? { opacity: 1, x: 0 }
          : {
              opacity: [0.7, 0.88, 0.7],
              y: [0, -8, 0],
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.8 }
          : {
              y: { duration: 8.5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 6.8, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      className="h-full flex flex-col items-center justify-between py-6 text-center select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Top Hairline Accent */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-1.5 h-1.5 rotate-45 border border-[#D6B274]/50" />
        <div className="h-16 w-px bg-gradient-to-b from-[#D6B274]/50 to-transparent" />
      </div>

      {/* Main Vertical Watermark Text */}
      <div className="my-auto flex flex-col items-center gap-6">
        <span className="text-[10px] font-mono tracking-[0.28em] text-[#D6B274]/60 uppercase">
          COMMEMORATION
        </span>

        {/* Vertical Writing: CLASS OF 2026 */}
        <div
          className="font-serif font-bold text-xl 2xl:text-2xl tracking-[0.35em] text-[#15489D]/25 uppercase"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          CLASS OF 2026
        </div>

        <div className="h-10 w-px bg-[#D6B274]/30" />

        {/* Roman Numerals: MMXXVI */}
        <span className="text-[11px] font-serif tracking-[0.3em] text-slate-400/40 uppercase">
          MMXXVI
        </span>
      </div>

      {/* Bottom Hairline Accent */}
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-px bg-gradient-to-t from-[#D6B274]/50 to-transparent" />
        <div className="w-1.5 h-1.5 rotate-45 border border-[#D6B274]/50" />
      </div>
    </motion.div>
  );
};

/**
 * Right Side Background Panel:
 * A subtle decorative panel inspired by the official graduation sash / stole of TDTU,
 * with navy/red/gold livery, gold fringe, and faint commemorative inscriptions.
 */
export const RightTdtuStolePanel: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={
        shouldReduceMotion
          ? { opacity: 1, x: 0 }
          : {
              opacity: [0.75, 0.92, 0.75],
              y: [0, 7, 0],
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.8 }
          : {
              y: { duration: 9.8, delay: 1.2, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 7.4, delay: 0.5, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      className="h-full flex flex-col items-center justify-between py-4 text-center select-none pointer-events-none"
      aria-hidden="true"
    >
      {/* Top Hanging Mount */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="w-2 h-2 rounded-full border border-[#D6B274]/50 bg-[#F8F5EF]" />
        <div className="h-10 w-px bg-[#D6B274]/40" />
      </div>

      {/* Stylized TDTU Graduation Sash / Stole SVG */}
      <div className="my-auto w-16 2xl:w-20 opacity-35 hover:opacity-50 transition-opacity">
        <svg
          viewBox="0 0 80 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-sm"
        >
          <defs>
            <linearGradient id="stoleGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#15305B" />
              <stop offset="50%" stopColor="#1B3B6F" />
              <stop offset="100%" stopColor="#102548" />
            </linearGradient>

            <linearGradient id="stoleGoldTrim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6DF99" />
              <stop offset="50%" stopColor="#D6B274" />
              <stop offset="100%" stopColor="#9E762E" />
            </linearGradient>
          </defs>

          {/* Main Sash Body */}
          <path
            d="M10 0 L70 0 L70 280 L40 310 L10 280 Z"
            fill="url(#stoleGrad)"
            stroke="#0C1B33"
            strokeWidth="0.8"
          />

          {/* Left Red & Gold Trim Stripe */}
          <line x1="14" y1="0" x2="14" y2="282" stroke="#E3222A" strokeWidth="2.5" />
          <line x1="17" y1="0" x2="17" y2="284" stroke="url(#stoleGoldTrim)" strokeWidth="1.2" />

          {/* Right Red & Gold Trim Stripe */}
          <line x1="66" y1="0" x2="66" y2="282" stroke="#E3222A" strokeWidth="2.5" />
          <line x1="63" y1="0" x2="63" y2="284" stroke="url(#stoleGoldTrim)" strokeWidth="1.2" />

          {/* Embossed University Seal / Star Accent */}
          <circle cx="40" cy="45" r="14" fill="#0E2140" stroke="url(#stoleGoldTrim)" strokeWidth="0.8" />
          <circle cx="40" cy="45" r="11" stroke="#D6B274" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
          <text
            x="40"
            y="49"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
            fontSize="8"
            fontWeight="bold"
            fill="#F6DF99"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            TDTU
          </text>

          {/* Stole Vertical Inscriptions */}
          <g opacity="0.85">
            <text
              x="40"
              y="100"
              fontFamily="ui-serif, Georgia, serif"
              fontSize="9"
              fontWeight="600"
              fill="#F6E6B8"
              letterSpacing="0.28em"
              textAnchor="middle"
            >
              GRADUATION
            </text>

            <line x1="26" y1="112" x2="54" y2="112" stroke="#D6B274" strokeWidth="0.6" strokeOpacity="0.6" />

            {/* Date */}
            <text
              x="40"
              y="130"
              fontFamily="ui-monospace, monospace"
              fontSize="8"
              fill="#D6B274"
              letterSpacing="0.15em"
              textAnchor="middle"
            >
              17.10.2026
            </text>
          </g>

          {/* Stylized Laurels on Sash */}
          <path d="M28 175 C28 155 35 150 40 148" stroke="#D6B274" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M52 175 C52 155 45 150 40 148" stroke="#D6B274" strokeWidth="0.8" strokeLinecap="round" />
          <circle cx="40" cy="185" r="2" fill="#D6B274" />

          {/* Bottom Angled Chevron Trim */}
          <path d="M10 270 L40 300 L70 270" stroke="url(#stoleGoldTrim)" strokeWidth="2" fill="none" />
          <path d="M10 276 L40 306 L70 276" stroke="#E3222A" strokeWidth="1.5" fill="none" />

          {/* Gold Fringe Tassels at Bottom */}
          <g stroke="url(#stoleGoldTrim)" strokeWidth="1.2" strokeLinecap="round">
            <line x1="16" y1="288" x2="16" y2="304" />
            <line x1="22" y1="294" x2="22" y2="310" />
            <line x1="28" y1="300" x2="28" y2="316" />
            <line x1="34" y1="306" x2="34" y2="322" />
            <line x1="40" y1="312" x2="40" y2="328" />
            <line x1="46" y1="306" x2="46" y2="322" />
            <line x1="52" y1="300" x2="52" y2="316" />
            <line x1="58" y1="294" x2="58" y2="310" />
            <line x1="64" y1="288" x2="64" y2="304" />
          </g>
        </svg>
      </div>

      {/* Bottom Subtle Date & Dot Accent */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="h-10 w-px bg-[#D6B274]/40" />
        <span className="text-[9px] font-mono tracking-widest text-[#D6B274]/50 uppercase">
          TDTU
        </span>
      </div>
    </motion.div>
  );
};
