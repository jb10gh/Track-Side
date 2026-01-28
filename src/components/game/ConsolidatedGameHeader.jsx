import React from 'react';
import { TrackSideLogo } from '../brand/TrackSideLogo';

/**
 * Consolidated Game Header Component
 * 
 * Eliminates redundancy between Shell title, TrackSideHeader, and opponent header
 * Provides clean, single source of truth for game header information
 * 
 * Features:
 * - Single opponent name display
 * - TrackSide branding integration
 * - Clean visual hierarchy
 * - Responsive design
 */
export const ConsolidatedGameHeader = ({ opponentName, className = '' }) => {
  return (
    <div className={`consolidated-game-header text-center mb-6 ${className}`}>
      {/* TrackSide Branding */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <TrackSideLogo size="small" />
        <span 
          className="font-bold text-sm uppercase tracking-wider"
          style={{ 
            color: 'var(--color-brand)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-bold)',
            letterSpacing: '0.1em'
          }}
        >
          Track Side Analytics
        </span>
      </div>
      
      {/* Opponent Information */}
      <div className="opponent-info">
        <div 
          className="text-xs uppercase tracking-wider mb-2"
          style={{ 
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.1em'
          }}
        >
          VS
        </div>
        <h1 
          className="text-3xl font-black mb-2"
          style={{ 
            color: 'var(--text-primary)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-black)',
            textShadow: 'var(--glow-hot-pink)',
            letterSpacing: '-0.02em'
          }}
        >
          {opponentName}
        </h1>
        <div 
          className="text-xs uppercase tracking-wider"
          style={{ 
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.1em'
          }}
        >
          Opponent
        </div>
      </div>
    </div>
  );
};

export default ConsolidatedGameHeader;
