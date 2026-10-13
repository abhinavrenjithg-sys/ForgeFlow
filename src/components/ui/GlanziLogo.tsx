import React from 'react';

interface GlanziLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const GlanziLogo: React.FC<GlanziLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-lg tracking-wider',
    md: 'text-xl tracking-widest',
    lg: 'text-2xl tracking-[0.25em]'
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Precision Geometric Monogram */}
      <div className={`relative ${iconDimensions[size]} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(199,255,69,0.25)]"
        >
          {/* Subtle Outer Frame */}
          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            rx="6"
            className="stroke-[rgba(220,235,215,0.2)] group-hover:stroke-[rgba(199,255,69,0.4)] transition-colors duration-300"
            strokeWidth="1.5"
            fill="#0D100E"
          />
          {/* Geometric Technical G Monogram */}
          <path
            d="M25 11H12C10.8954 11 10 11.8954 10 13V23C10 24.1046 10.8954 25 12 25H24C25.1046 25 26 24.1046 26 23V18H18"
            stroke="#C7FF45"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central Precision Tech Node */}
          <circle cx="18" cy="18" r="2" fill="#C7FF45" />
          <circle cx="25" cy="11" r="1.2" fill="#F5F7F2" />
        </svg>
      </div>

      {/* Bespoke Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-display font-bold uppercase text-[#F5F7F2] ${textSizes[size]} transition-colors group-hover:text-white`}>
            GLANZI
          </span>
          {size !== 'sm' && (
            <span className="text-[9px] font-mono tracking-widest text-[#697168] -mt-1 uppercase">
              Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
