import React, { useState } from 'react';

interface TdtuLogoProps {
  className?: string;
  variant?: 'full' | 'emblem' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const TdtuLogo: React.FC<TdtuLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  // Height mappings
  const heightClasses = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
  }[size];

  if (!imgError) {
    return (
      <div className={`inline-flex items-center gap-3 select-none ${className}`}>
        <img
          src="/assets/tdtu/logo-official-square.png"
          alt="Logo chính thức Trường Đại học Tôn Đức Thắng"
          className={`${heightClasses} aspect-square object-contain shrink-0`}
          onError={() => setImgError(true)}
        />
        {variant !== 'emblem' && (
          <div className="flex flex-col justify-center leading-tight text-left">
            <span className={`font-sans font-bold tracking-tight text-[#15489D] ${size === 'lg' ? 'text-base' : size === 'md' ? 'text-xs md:text-sm' : 'text-xs'}`}>
              TRƯỜNG ĐẠI HỌC TÔN ĐỨC THẮNG
            </span>
            <span className={`font-sans font-semibold tracking-[0.12em] text-[#E3222A] ${size === 'lg' ? 'text-xs' : 'text-[10px]'}`}>
              TON DUC THANG UNIVERSITY
            </span>
          </div>
        )}
      </div>
    );
  }

  // Text-only fallback: never invent or redraw an institutional mark.
  return (
    <div className={`inline-flex flex-col leading-tight text-left ${className}`}>
      <span className="font-sans font-bold text-[#15489D]">TRƯỜNG ĐẠI HỌC TÔN ĐỨC THẮNG</span>
      <span className="font-sans text-[10px] font-semibold tracking-[0.12em] text-[#E3222A]">TON DUC THANG UNIVERSITY</span>
    </div>
  );
};
