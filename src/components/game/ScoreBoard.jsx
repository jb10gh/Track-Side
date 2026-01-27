import React from 'react';
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

                {/* Clock */}
                <div className="flex flex-col items-center px-4">
                    <div
                        onClick={onToggleTimer}
                        className={`text-5xl font-black tabular-nums cursor-pointer transition-all active:scale-95 font-mono ${
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
