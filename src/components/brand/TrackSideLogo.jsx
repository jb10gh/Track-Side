import React from 'react';

/**
 * Track Side Logo Component
 * 
 * Features:
 * - Multiple sizes (small, medium, large, xlarge)
 * - Hot pink branding with modern design
 * - Clean, modern design
 * - Accessible markup
 */
export const TrackSideLogo = ({ size = 'medium', className = '' }) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16'
  };

  return (
    <div className={`track-side-logo ${sizes[size]} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Hot pink circle background */}
        <circle cx="50" cy="50" r="45" fill="#FF1493" />
        
        {/* Inner circle for depth */}
        <circle cx="50" cy="50" r="40" fill="#FF007F" opacity="0.3" />
        
        {/* TS text */}
        <text 
          x="50" 
          y="55" 
          textAnchor="middle" 
          fill="white" 
          fontSize="24" 
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          TS
        </text>
        
        {/* Subtle glow effect */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="#FF1493" 
          strokeWidth="2" 
          opacity="0.5"
          style={{ filter: 'blur(2px)' }}
        />
      </svg>
    </div>
  );
};

/**
 * Track Side Header Component
 * 
 * Features:
 * - Logo integration
 * - Title and subtitle
 * - Track Side branding
 * - Responsive design
 */
export const TrackSideHeader = ({ title, subtitle, showLogo = true, className = '' }) => {
  return (
    <div className={`track-side-header flex items-center justify-between p-4 border-b border-gray-800 ${className}`}>
      <div className="flex items-center gap-3">
        {showLogo && <TrackSideLogo size="medium" />}
        <div className="header-content">
          <h1 className="track-side-title text-xl font-bold text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="track-side-subtitle text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div className="header-brand">
        <span className="track-side-brand-text text-[#FF1493] font-bold text-lg">
          Track Side
        </span>
      </div>
    </div>
  );
};

/**
 * Track Side Watermark Component
 * 
 * Features:
 * - Subtle background branding
 * - Adjustable opacity
 * - Non-intrusive design
 * - Track Side branding
 */
export const TrackSideWatermark = ({ opacity = 0.1, className = '' }) => {
  return (
    <div 
      className={`track-side-watermark fixed bottom-4 right-4 flex items-center gap-2 pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <TrackSideLogo size="small" />
      <span className="watermark-text text-[#FF1493] font-semibold text-sm">
        Track Side
      </span>
    </div>
  );
};

/**
 * Track Side Footer Component
 * 
 * Features:
 * - Logo and branding
 * - App information
 * - Clean layout
 * - Track Side branding
 */
export const TrackSideFooter = ({ showAppInfo = true, className = '' }) => {
  return (
    <div className={`track-side-footer p-4 border-t border-gray-800 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="footer-content flex items-center gap-2">
          <TrackSideLogo size="small" />
          <span className="footer-text text-gray-400 font-medium">
            Track Side Analytics
          </span>
        </div>
        
        {showAppInfo && (
          <div className="footer-app-info">
            <span className="text-xs text-gray-500">
              track-side.vercel.app
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Track Side Brand Badge Component
 * 
 * Features:
 * - Compact branding badge
 * - Hot pink theme
 * - Versatile usage
 * - Track Side branding
 */
export const TrackSideBadge = ({ variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-[#FF1493] text-white',
    outline: 'border-2 border-[#FF1493] text-[#FF1493]',
    subtle: 'bg-gray-900 text-[#FF1493] border border-gray-800'
  };

  return (
    <div className={`track-side-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      <TrackSideLogo size="small" />
      <span>Track Side</span>
    </div>
  );
};

/**
 * Track Side Loading Component
 * 
 * Features:
 * - Branded loading animation
 * - Hot pink theme
 * - Smooth animations
 * - Track Side branding
 */
export const TrackSideLoading = ({ message = 'Loading...', className = '' }) => {
  return (
    <div className={`track-side-loading flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative">
        <TrackSideLogo size="large" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-[#FF1493] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-white font-medium">{message}</p>
        <p className="text-[#FF1493] text-sm">Track Side Analytics</p>
      </div>
    </div>
  );
};

export default TrackSideLogo;
