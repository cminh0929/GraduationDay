import React from 'react';

export const GraduationCapIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cap board */}
    <path
      d="M24 6L4 16L24 26L44 16L24 6Z"
      fill="#15489D"
      stroke="#17243A"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Skull cap */}
    <path
      d="M12 20.5V30C12 30 15 36 24 36C33 36 36 30 36 30V20.5"
      fill="#17243A"
      stroke="#15489D"
      strokeWidth="1.5"
    />
    {/* Golden tassel */}
    <path d="M38 19.5V31" stroke="#D6B274" strokeWidth="2" strokeLinecap="round" />
    <circle cx="38" cy="32" r="2.5" fill="#D6B274" />
  </svg>
);

export const SunflowerIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Petals */}
    <g fill="#F5B700" stroke="#E29E00" strokeWidth="0.8">
      <ellipse cx="24" cy="8" rx="4.5" ry="7" />
      <ellipse cx="24" cy="40" rx="4.5" ry="7" />
      <ellipse cx="8" cy="24" rx="7" ry="4.5" />
      <ellipse cx="40" cy="24" rx="7" ry="4.5" />
      <ellipse cx="12.7" cy="12.7" rx="4.5" ry="7" transform="rotate(-45 12.7 12.7)" />
      <ellipse cx="35.3" cy="35.3" rx="4.5" ry="7" transform="rotate(-45 35.3 35.3)" />
      <ellipse cx="35.3" cy="12.7" rx="4.5" ry="7" transform="rotate(45 35.3 12.7)" />
      <ellipse cx="12.7" cy="35.3" rx="4.5" ry="7" transform="rotate(45 12.7 35.3)" />
    </g>
    {/* Seed disk */}
    <circle cx="24" cy="24" r="10" fill="#78350F" />
    <circle cx="24" cy="24" r="7" fill="#92400E" />
    <circle cx="24" cy="24" r="3" fill="#B45309" />
  </svg>
);

export const DiplomaScrollIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Rolled parchment */}
    <path
      d="M10 14L34 14C37 14 39 16 39 19L39 31C39 34 37 36 34 36L10 36C7 36 5 34 5 31L5 19C5 16 7 14 10 14Z"
      fill="#F8F5EF"
      stroke="#D6B274"
      strokeWidth="1.5"
    />
    <path d="M5 19C5 16 7 14 10 14C13 14 15 16 15 19V31C15 34 13 36 10 36C7 36 5 34 5 31V19Z" fill="#EAE5D9" />
    {/* Red Ribbon */}
    <rect x="22" y="14" width="5" height="22" fill="#E44735" />
    <path d="M24.5 36L21 44L24.5 42L28 44L24.5 36Z" fill="#E44735" />
  </svg>
);

export const WaxSealEmblem: React.FC<{ className?: string; text?: string }> = ({
  className = 'w-16 h-16',
  text = '2026',
}) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#E44735" />
      <circle cx="32" cy="32" r="26" fill="#C53727" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="32" cy="32" r="21" fill="#991B1B" />
      {/* Laurel leaves */}
      <path d="M20 32C20 25 24 20 28 18" stroke="#D6B274" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M44 32C44 25 40 20 36 18" stroke="#D6B274" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
      <span className="text-[9px] font-bold text-[#FDE68A] tracking-wider leading-none">CLASS</span>
      <span className="text-[12px] font-serif font-black text-white leading-none mt-0.5">{text}</span>
    </div>
  </div>
);
