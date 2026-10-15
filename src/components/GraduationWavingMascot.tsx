import React from 'react';

export const GraduationWavingMascot: React.FC<{ className?: string }> = ({ className = 'w-32 h-32' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
        aria-hidden="true"
      >
        <style>
          {`
            @keyframes mascotWave {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(18deg); }
            }
            @keyframes starTwinkle {
              0%, 100% { opacity: 0.3; transform: scale(0.85); }
              50% { opacity: 1; transform: scale(1.15); }
            }
            @keyframes tasselFloat {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(10deg); }
            }
            .animate-mascot-wave {
              transform-origin: 122px 95px;
              animation: mascotWave 1.8s ease-in-out infinite;
            }
            .animate-star-1 {
              transform-origin: 24px 36px;
              animation: starTwinkle 2.2s ease-in-out infinite;
            }
            .animate-star-2 {
              transform-origin: 136px 30px;
              animation: starTwinkle 2.5s ease-in-out 0.7s infinite;
            }
            .animate-star-3 {
              transform-origin: 18px 108px;
              animation: starTwinkle 2.0s ease-in-out 1.2s infinite;
            }
            .animate-tassel {
              transform-origin: 80px 48px;
              animation: tasselFloat 2.0s ease-in-out infinite;
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-mascot-wave,
              .animate-star-1,
              .animate-star-2,
              .animate-star-3,
              .animate-tassel {
                animation: none !important;
              }
            }
          `}
        </style>

        {/* Ambient background soft glow */}
        <circle cx="80" cy="80" r="68" fill="#FDF8EE" />
        <circle cx="80" cy="80" r="68" stroke="#D6B274" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Floating Golden Stars */}
        {/* Star 1 - Top Left */}
        <g className="animate-star-1">
          <path
            d="M24 28L26 34L32 36L26 38L24 44L22 38L16 36L22 34Z"
            fill="#F5B700"
          />
        </g>
        {/* Star 2 - Top Right */}
        <g className="animate-star-2">
          <path
            d="M136 22L138 28L144 30L138 32L136 38L134 32L128 30L134 28Z"
            fill="#D6B274"
          />
        </g>
        {/* Star 3 - Mid Left */}
        <g className="animate-star-3">
          <path
            d="M18 102L19.5 106.5L24 108L19.5 109.5L18 114L16.5 109.5L12 108L16.5 106.5Z"
            fill="#F5B700"
          />
        </g>

        {/* Graduation Gown Body */}
        <path
          d="M52 110C52 98 64 96 80 96C96 96 108 98 108 110L112 142C112 144 110 146 108 146H52C50 146 48 144 48 142L52 110Z"
          fill="#15305B"
        />
        {/* Gown Academic Stole (V-Neck gold & red accent) */}
        <path
          d="M70 96L80 120L90 96H98L83 128C81.5 131 78.5 131 77 128L62 96H70Z"
          fill="#D6B274"
        />
        <path
          d="M74 96L80 112L86 96H90L81.5 118C80.8 119.5 79.2 119.5 78.5 118L70 96H74Z"
          fill="#8B1E22"
        />

        {/* Left Arm holding Diploma Scroll */}
        <path
          d="M52 106L42 120C40 123 43 127 46 125L54 118"
          stroke="#15305B"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Diploma Scroll */}
        <g transform="translate(32, 114) rotate(-25)">
          <rect x="0" y="0" width="18" height="8" rx="2" fill="#FAF7F1" stroke="#D6B274" strokeWidth="1" />
          <line x1="8" y1="0" x2="8" y2="8" stroke="#E44735" strokeWidth="2.5" />
        </g>

        {/* Head / Face */}
        <circle cx="80" cy="74" r="22" fill="#FFE0BD" />
        {/* Rosy Cheeks */}
        <circle cx="68" cy="79" r="4" fill="#F87171" opacity="0.45" />
        <circle cx="92" cy="79" r="4" fill="#F87171" opacity="0.45" />

        {/* Happy Smiling Eyes */}
        <path
          d="M66 72C67.5 69.5 71.5 69.5 73 72"
          stroke="#17243A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M87 72C88.5 69.5 92.5 69.5 94 72"
          stroke="#17243A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Cheerful Smile */}
        <path
          d="M74 81C76 84 84 84 86 81"
          stroke="#17243A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Mortarboard Graduation Cap */}
        {/* Cap Skull Base */}
        <path
          d="M62 58C62 53 98 53 98 58L95 65C95 68 65 68 65 65L62 58Z"
          fill="#0F2444"
        />
        {/* Cap Diamond Top */}
        <polygon
          points="80,38 122,48 80,58 38,48"
          fill="#15489D"
          stroke="#D6B274"
          strokeWidth="1.5"
        />
        {/* Cap Center Button */}
        <circle cx="80" cy="48" r="3" fill="#D6B274" />
        {/* Golden Hanging Tassel */}
        <g className="animate-tassel">
          <path
            d="M80 48Q96 52 104 62"
            stroke="#D6B274"
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M102 62L106 74H102L100 62Z"
            fill="#F5B700"
          />
        </g>

        {/* Right Waving Arm & Hand */}
        <g className="animate-mascot-wave">
          {/* Sleeve */}
          <path
            d="M108 106L122 95"
            stroke="#15305B"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Hand */}
          <circle cx="126" cy="91" r="5" fill="#FFE0BD" />
          {/* Little fingers */}
          <path
            d="M125 86L127 89M128 87L129 90M122 88L124 90"
            stroke="#FFE0BD"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
