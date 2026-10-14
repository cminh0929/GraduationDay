import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export const LeftBotanicalOrnament: React.FC<{ className?: string }> = ({
  className = 'w-16 sm:w-24 lg:w-28',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={
        shouldReduceMotion
          ? { opacity: 0.85, x: 0 }
          : {
              opacity: [0.8, 0.95, 0.8],
              rotate: [-2, 2.2, -2],
              y: [0, -4, 0],
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.6 }
          : {
              rotate: { duration: 6.2, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      style={{ transformOrigin: 'top left' }}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
      >
        <defs>
          <linearGradient id="goldStemLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F9DF98" />
            <stop offset="50%" stopColor="#D6B274" />
            <stop offset="100%" stopColor="#A88132" />
          </linearGradient>

          <linearGradient id="leafGradLeft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDEBC0" />
            <stop offset="60%" stopColor="#E2BD76" />
            <stop offset="100%" stopColor="#BA8E3A" />
          </linearGradient>

          <linearGradient id="leafGradSoft" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF4D9" />
            <stop offset="100%" stopColor="#DEC288" />
          </linearGradient>
        </defs>

        {/* Central main curling vine */}
        <path
          d="M10 20 Q45 90 28 170 T48 270 Q55 330 18 385"
          stroke="url(#goldStemLeft)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Delicate secondary branchlets */}
        <path d="M28 120 Q65 110 78 135" stroke="url(#goldStemLeft)" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M34 195 Q75 190 85 220" stroke="url(#goldStemLeft)" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M46 250 Q85 245 92 278" stroke="url(#goldStemLeft)" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <path d="M30 310 Q65 315 72 345" stroke="url(#goldStemLeft)" strokeWidth="0.8" strokeLinecap="round" fill="none" />

        {/* Top budding cluster */}
        <ellipse cx="14" cy="24" rx="4.5" ry="8" transform="rotate(-30 14 24)" fill="url(#leafGradLeft)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="26" cy="38" rx="4" ry="7" transform="rotate(35 26 38)" fill="url(#leafGradSoft)" stroke="#9F782E" strokeWidth="0.5" />
        <circle cx="10" cy="18" r="2.2" fill="#F8E5A7" />

        {/* Ginkgo Fan Leaf 1 */}
        <g transform="translate(18, 70)">
          <path
            d="M0 15 C10 -2 30 -5 42 6 C48 12 46 24 38 30 C28 35 12 30 0 15 Z"
            fill="url(#leafGradLeft)"
            stroke="#9F782E"
            strokeWidth="0.6"
          />
          <path d="M3 17 Q22 14 38 12" stroke="#9F782E" strokeWidth="0.5" fill="none" strokeOpacity="0.7" />
          <path d="M5 19 Q24 22 36 24" stroke="#9F782E" strokeWidth="0.4" fill="none" strokeOpacity="0.5" />
        </g>

        {/* Laurel Pair 1 */}
        <ellipse cx="58" cy="122" rx="5" ry="11" transform="rotate(40 58 122)" fill="url(#leafGradSoft)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="78" cy="136" rx="4.5" ry="9" transform="rotate(75 78 136)" fill="url(#leafGradLeft)" stroke="#9F782E" strokeWidth="0.5" />
        <circle cx="68" cy="115" r="1.8" fill="#FDE68A" />

        {/* Ginkgo Fan Leaf 2 (Mid-Left) */}
        <g transform="translate(32, 160)">
          <path
            d="M0 18 C14 -2 40 -4 52 8 C58 15 54 28 44 34 C30 40 14 32 0 18 Z"
            fill="url(#leafGradLeft)"
            stroke="#9F782E"
            strokeWidth="0.6"
          />
          <path d="M4 20 Q28 17 46 14" stroke="#9F782E" strokeWidth="0.5" fill="none" strokeOpacity="0.7" />
          <path d="M6 22 Q28 26 42 28" stroke="#9F782E" strokeWidth="0.4" fill="none" strokeOpacity="0.5" />
        </g>

        {/* Laurel Pair 2 */}
        <ellipse cx="72" cy="205" rx="5" ry="11" transform="rotate(50 72 205)" fill="url(#leafGradSoft)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="88" cy="222" rx="4.5" ry="9" transform="rotate(80 88 222)" fill="url(#leafGradLeft)" stroke="#9F782E" strokeWidth="0.5" />
        <circle cx="80" cy="198" r="1.8" fill="#FDE68A" />

        {/* Ginkgo Fan Leaf 3 */}
        <g transform="translate(42, 235)">
          <path
            d="M0 16 C12 0 34 -2 45 8 C50 14 48 24 38 29 C26 34 12 28 0 16 Z"
            fill="url(#leafGradLeft)"
            stroke="#9F782E"
            strokeWidth="0.6"
          />
          <path d="M3 18 Q22 15 38 12" stroke="#9F782E" strokeWidth="0.5" fill="none" strokeOpacity="0.7" />
        </g>

        {/* Lower cluster */}
        <ellipse cx="82" cy="275" rx="4.5" ry="10" transform="rotate(60 82 275)" fill="url(#leafGradSoft)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="64" cy="335" rx="4" ry="9" transform="rotate(45 64 335)" fill="url(#leafGradLeft)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="28" cy="370" rx="3.5" ry="8" transform="rotate(15 28 370)" fill="url(#leafGradSoft)" stroke="#9F782E" strokeWidth="0.5" />

        {/* Tiny golden celebratory sparks */}
        <circle cx="86" cy="155" r="2.2" fill="#D6B274" />
        <circle cx="98" cy="240" r="1.8" fill="#E2BD76" />
        <circle cx="78" cy="360" r="2" fill="#D6B274" />
      </svg>
    </motion.div>
  );
};

export const RightBotanicalOrnament: React.FC<{ className?: string }> = ({
  className = 'w-16 sm:w-24 lg:w-28',
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={
        shouldReduceMotion
          ? { opacity: 0.85, x: 0 }
          : {
              opacity: [0.8, 0.95, 0.8],
              rotate: [2.2, -2, 2.2],
              y: [0, 4, 0],
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0.6 }
          : {
              rotate: { duration: 7.1, delay: 0.9, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 6.3, delay: 0.5, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      style={{ transformOrigin: 'top right' }}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-xs"
      >
        <defs>
          <linearGradient id="goldStemRight" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F9DF98" />
            <stop offset="50%" stopColor="#D6B274" />
            <stop offset="100%" stopColor="#A88132" />
          </linearGradient>

          <linearGradient id="leafGradRight" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDEBC0" />
            <stop offset="60%" stopColor="#E2BD76" />
            <stop offset="100%" stopColor="#BA8E3A" />
          </linearGradient>
        </defs>

        {/* Central main curling vine (mirrored / asymmetrical flow) */}
        <path
          d="M110 25 Q72 95 90 175 T70 275 Q62 335 102 388"
          stroke="url(#goldStemRight)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Branchlets */}
        <path d="M92 125 Q54 115 42 140" stroke="url(#goldStemRight)" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M85 200 Q45 195 35 225" stroke="url(#goldStemRight)" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M72 255 Q35 250 28 282" stroke="url(#goldStemRight)" strokeWidth="0.9" strokeLinecap="round" fill="none" />
        <path d="M90 315 Q55 320 48 350" stroke="url(#goldStemRight)" strokeWidth="0.8" strokeLinecap="round" fill="none" />

        {/* Top bud */}
        <ellipse cx="106" cy="28" rx="4.5" ry="8" transform="rotate(30 106 28)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="94" cy="42" rx="4" ry="7" transform="rotate(-35 94 42)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />
        <circle cx="110" cy="22" r="2.2" fill="#F8E5A7" />

        {/* Ginkgo Fan Leaf 1 (Top-Right) */}
        <g transform="translate(48, 75)">
          <path
            d="M48 15 C38 -2 18 -5 6 6 C0 12 2 24 10 30 C20 35 36 30 48 15 Z"
            fill="url(#leafGradRight)"
            stroke="#9F782E"
            strokeWidth="0.6"
          />
          <path d="M45 17 Q26 14 10 12" stroke="#9F782E" strokeWidth="0.5" fill="none" strokeOpacity="0.7" />
          <path d="M43 19 Q24 22 12 24" stroke="#9F782E" strokeWidth="0.4" fill="none" strokeOpacity="0.5" />
        </g>

        {/* Laurel Pair 1 */}
        <ellipse cx="62" cy="126" rx="5" ry="11" transform="rotate(-40 62 126)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="42" cy="140" rx="4.5" ry="9" transform="rotate(-75 42 140)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />
        <circle cx="52" cy="118" r="1.8" fill="#FDE68A" />

        {/* Ginkgo Fan Leaf 2 (Mid-Right) */}
        <g transform="translate(26, 165)">
          <path
            d="M52 18 C38 -2 12 -4 0 8 C-6 15 -2 28 8 34 C22 40 38 32 52 18 Z"
            fill="url(#leafGradRight)"
            stroke="#9F782E"
            strokeWidth="0.6"
          />
          <path d="M48 20 Q24 17 6 14" stroke="#9F782E" strokeWidth="0.5" fill="none" strokeOpacity="0.7" />
        </g>

        {/* Laurel Pair 2 */}
        <ellipse cx="48" cy="210" rx="5" ry="11" transform="rotate(-50 48 210)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="32" cy="226" rx="4.5" ry="9" transform="rotate(-80 32 226)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />
        <circle cx="40" cy="202" r="1.8" fill="#FDE68A" />

        {/* Ginkgo Fan Leaf 3 */}
        <g transform="translate(22, 240)">
          <path
            d="M45 16 C33 0 11 -2 0 8 C-5 14 -3 24 7 29 C19 34 33 28 45 16 Z"
            fill="url(#leafGradRight)"
            stroke="#9F782E"
            strokeWidth="0.6"
          />
        </g>

        {/* Lower cluster */}
        <ellipse cx="38" cy="280" rx="4.5" ry="10" transform="rotate(-60 38 280)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="56" cy="340" rx="4" ry="9" transform="rotate(-45 56 340)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />
        <ellipse cx="92" cy="375" rx="3.5" ry="8" transform="rotate(-15 92 375)" fill="url(#leafGradRight)" stroke="#9F782E" strokeWidth="0.5" />

        {/* Tiny golden celebratory sparks */}
        <circle cx="34" cy="160" r="2.2" fill="#D6B274" />
        <circle cx="22" cy="245" r="1.8" fill="#E2BD76" />
        <circle cx="42" cy="365" r="2" fill="#D6B274" />
      </svg>
    </motion.div>
  );
};
