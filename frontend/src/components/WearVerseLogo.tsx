import React from 'react';
import { useApp } from '../context/AppContext';

interface WearVerseLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  showStudioBadge?: boolean;
}

export const WearVerseLogo: React.FC<WearVerseLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  showStudioBadge = false,
}) => {
  const { theme } = useApp();

  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
  }[size];

  const textDimensions = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  }[size];

  const wearTextColor = theme === 'dark' ? '#ffffff' : '#090d16';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Streetwear AI Geometric Emblem */}
      <div className={`relative ${iconDimensions} rounded-xl bg-gradient-to-tr from-[#5850ec] via-[#6366f1] to-[#a855f7] p-[1.5px] shadow-lg shadow-indigo-600/30 flex-shrink-0 group-hover:shadow-indigo-500/50 transition-shadow`}>
        <div className="w-full h-full rounded-[10px] bg-[#0c0f18] flex items-center justify-center overflow-hidden relative">
          {/* Subtle ambient glow behind logo */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-violet-500/20" />
          
          {/* Modern Streetwear Monogram SVG */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5/6 h-5/6 relative z-10"
          >
            <defs>
              <linearGradient id="wv-grad-1" x1="6" y1="8" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="45%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="wv-grad-2" x1="12" y1="12" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>

            {/* Left Chevron Fold */}
            <path
              d="M7 11L14.5 29C15 30.2 16.6 30.2 17.1 29L20 22L14 11H7Z"
              fill="url(#wv-grad-1)"
              opacity="0.95"
            />
            {/* Right Chevron Fold */}
            <path
              d="M33 11L25.5 29C25 30.2 23.4 30.2 22.9 29L20 22L26 11H33Z"
              fill="url(#wv-grad-1)"
              opacity="0.95"
            />
            {/* Central Precision Vertex Spark */}
            <path
              d="M20 9L22.5 15.5L29 18L22.5 20.5L20 27L17.5 20.5L11 18L17.5 15.5L20 9Z"
              fill="url(#wv-grad-2)"
              className="drop-shadow-[0_0_8px_rgba(129,140,248,0.9)]"
            />
          </svg>
        </div>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex items-center gap-2">
          <span className={`${textDimensions} font-black tracking-tight font-['Space_Grotesk'] leading-none`}>
            <span 
              className={theme === 'dark' ? 'text-white' : 'text-[#090d16]'} 
              style={{ color: wearTextColor, display: 'inline-block' }}
            >
              Wear
            </span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Verse
            </span>
          </span>
          {showStudioBadge && (
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border tracking-widest font-mono shadow-xs ${
              theme === 'dark'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              STUDIO
            </span>
          )}
        </div>
      )}
    </div>
  );
};
