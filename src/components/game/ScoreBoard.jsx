import React from 'react';

/**
 * Clean Code: ScoreBoard component.
 * Displays scores and the game clock.
 */
export const ScoreBoard = ({ myScore, opponentScore, displayTime, isRunning, onToggleTimer }) => {
    return (
        <div className="card-simple flex flex-col items-center py-10 gap-8 bg-black border-[var(--color-border)] shadow-2xl">
            <div className="flex w-full items-center justify-between px-4">
                {/* Us Score */}
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-2 font-mono">Us</span>
                    <div className="text-8xl font-black tabular-nums font-mono leading-none tracking-tighter team-color-transition" style={{ color: 'var(--score-our-color)' }}>
                        {myScore}
                    </div>
                </div>

                {/* Clock */}
                <div className="flex flex-col items-center px-4">
                    <div
                        onClick={onToggleTimer}
                        className={`text-5xl font-black tabular-nums cursor-pointer transition-all active:scale-95 font-mono ${
                            isRunning ? 'text-white' : 'text-white/70'
                        }`}
                    >
                        {displayTime}
                    </div>
                </div>

                {/* Them Score */}
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-2 font-mono">Them</span>
                    <div className="text-8xl font-black tabular-nums font-mono leading-none tracking-tighter team-color-transition" style={{ color: 'var(--score-their-color)' }}>
                        {opponentScore}
                    </div>
                </div>
            </div>
        </div>
    );
};
