import React from 'react';
import { Play, Pause } from 'lucide-react';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

/**
 * Clean Code: ScoreBoard component.
 * Displays scores and the game clock with unified theme system.
 */
export const ScoreBoard = ({ myScore, opponentScore, displayTime, isRunning, onToggleTimer }) => {
    const { createCardStyles, getSpacingValue } = useTheme();
    const ourTeam = useTeamTheme('our');
    const theirTeam = useTeamTheme('their');

    const cardStyles = createCardStyles();

    return (
        <div 
            className="flex flex-col items-center py-10 gap-8"
            style={{
                ...cardStyles,
                padding: `${getSpacingValue('3xl')} 0`,
                gap: getSpacingValue('xl'),
            }}
        >
            <div className="flex w-full items-center justify-between px-4">
                {/* Us Score */}
                <div className="flex flex-col items-center flex-1">
                    <span 
                        className="text-xs font-black uppercase tracking-widest mb-2 font-mono"
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--text-xs)',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 'var(--font-black)',
                            letterSpacing: '0.3em',
                        }}
                    >
                        Us
                    </span>
                    <div 
                        className="text-8xl font-black tabular-nums font-mono leading-none tracking-tighter transition-all duration-300"
                        style={{
                            color: ourTeam.colors.primary,
                            textShadow: ourTeam.colors.shadow,
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 'var(--font-black)',
                            fontSize: 'var(--text-6xl)',
                        }}
                    >
                        {myScore}
                    </div>
                </div>

                {/* Clock with Prominent Timer Control */}
                <div className="flex flex-col items-center px-4">
                    {/* Timer Start Button for Parents */}
                    {!isRunning && (
                        <button
                            onClick={onToggleTimer}
                            className="mb-3 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wider transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 animate-pulse"
                            style={{
                                background: 'linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%)',
                                color: 'white',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 'var(--font-bold)',
                                letterSpacing: '0.1em',
                                boxShadow: 'var(--glow-brand)',
                            }}
                        >
                            <Play size={16} />
                            Start Timer
                        </button>
                    )}
                    
                    {/* Timer Display */}
                    <div
                        onClick={onToggleTimer}
                        className={`text-5xl font-black tabular-nums cursor-pointer transition-all active:scale-95 font-mono relative ${
                            isRunning ? 'text-primary' : 'text-disabled'
                        }`}
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 'var(--font-black)',
                            fontSize: 'var(--text-5xl)',
                            color: isRunning ? 'var(--text-primary)' : 'var(--text-disabled)',
                            transition: 'var(--transition-normal)',
                        }}
                    >
                        {displayTime}
                        
                        {/* Status Indicator */}
                        <div 
                            className="absolute -top-2 -right-2 w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: isRunning ? 'var(--color-success)' : 'var(--color-warning)',
                                boxShadow: isRunning ? '0 0 8px var(--color-success)' : '0 0 8px var(--color-warning)',
                            }}
                        />
                    </div>
                    
                    {/* Timer Status Text */}
                    <div 
                        className="text-xs font-medium uppercase tracking-wider mt-2"
                        style={{
                            color: isRunning ? 'var(--color-success)' : 'var(--text-muted)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 'var(--font-medium)',
                            letterSpacing: '0.1em',
                        }}
                    >
                        {isRunning ? 'Running' : 'Tap to Start'}
                    </div>
                </div>

                {/* Them Score */}
                <div className="flex flex-col items-center flex-1">
                    <span 
                        className="text-xs font-black uppercase tracking-widest mb-2 font-mono"
                        style={{
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--text-xs)',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 'var(--font-black)',
                            letterSpacing: '0.3em',
                        }}
                    >
                        Them
                    </span>
                    <div 
                        className="text-8xl font-black tabular-nums font-mono leading-none tracking-tighter transition-all duration-300"
                        style={{
                            color: theirTeam.colors.primary,
                            textShadow: theirTeam.colors.shadow,
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 'var(--font-black)',
                            fontSize: 'var(--text-6xl)',
                        }}
                    >
                        {opponentScore}
                    </div>
                </div>
            </div>
        </div>
    );
};
