import React from 'react';
import { Play, Pause } from 'lucide-react';

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
                    <div className="text-8xl font-black text-[var(--color-brand)] tabular-nums font-mono leading-none tracking-tighter">
                        {myScore}
                    </div>
                </div>

                {/* Clock */}
                <div className="flex flex-col items-center px-4">
                    <div
                        onClick={onToggleTimer}
                        className={`text-5xl font-black tabular-nums cursor-pointer transition-all active:scale-95 font-mono ${
                            isRunning ? 'text-white' : 'text-[var(--text-secondary)] opacity-50'
                        }`}
                    >
                        {displayTime}
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                        {isRunning ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                            {isRunning ? 'Live' : 'Paused'}
                        </span>
                    </div>
                </div>

                {/* Them Score */}
                <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-2 font-mono">Them</span>
                    <div className="text-8xl font-black tabular-nums font-mono leading-none tracking-tighter">
                        {opponentScore}
                    </div>
                </div>
            </div>
        </div>
    );
};
