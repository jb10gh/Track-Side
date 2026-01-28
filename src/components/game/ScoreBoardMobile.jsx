import React from 'react';
import { Play, Pause } from 'lucide-react';
import '../../styles/design-tokens.css';

export const ScoreBoard = ({ myScore, opponentScore, displayTime, isRunning, onToggleTimer }) => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Score Display - Glassmorphism Surface Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-8" style={{ boxShadow: 'var(--glass-shadow)' }}>
                {/* Mobile Layout (Stacked) */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
                    {/* Our Team */}
                    <div className="text-center sm:text-left sm:flex-1">
                        <div className="mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-pink-400 bg-pink-500/20 px-2 py-1 rounded">Our Team</span>
                        </div>
                        <div className="text-5xl sm:text-7xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(255, 20, 147, 0.6)' }}>
                            {myScore}
                        </div>
                    </div>

                    {/* Timer & Controls - Centered */}
                    <div className="flex flex-col items-center justify-center">
                        <button
                            onClick={onToggleTimer}
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                isRunning 
                                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25' 
                                    : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/25'
                            }`}
                        >
                            {isRunning ? (
                                <Pause size={20} className="text-white sm:size-24" />
                            ) : (
                                <Play size={20} className="text-white sm:size-24" />
                            )}
                        </button>
                        <div className="mt-3 sm:mt-4 flex items-center space-x-2 text-slate-300">
                            <span className="font-mono text-base sm:text-lg font-medium">{displayTime}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                            {isRunning ? 'Live' : 'Ready'}
                        </div>
                    </div>

                    {/* Opponent Team */}
                    <div className="text-center sm:text-right sm:flex-1">
                        <div className="mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-400/20 px-2 py-1 rounded">Opponent</span>
                        </div>
                        <div className="text-5xl sm:text-7xl font-bold text-white" style={{ textShadow: '0 0 20px rgba(0, 206, 209, 0.6)' }}>
                            {opponentScore}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
