import React from 'react';
import { Play, Pause, Clock } from 'lucide-react';

export const ScoreBoard = ({ myScore, opponentScore, displayTime, isRunning, onToggleTimer }) => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Score Display */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl p-8">
                <div className="flex items-center justify-between">
                    {/* Our Team */}
                    <div className="flex-1 text-center">
                        <div className="mb-2">
                            <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Our Team</span>
                        </div>
                        <div className="text-7xl font-black bg-gradient-to-br from-pink-500 to-rose-600 bg-clip-text text-transparent">
                            {myScore}
                        </div>
                    </div>

                    {/* Timer & Controls */}
                    <div className="flex flex-col items-center px-8">
                        <button
                            onClick={onToggleTimer}
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                isRunning 
                                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25' 
                                    : 'bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-emerald-500/25'
                            }`}
                        >
                            {isRunning ? (
                                <Pause size={24} className="text-white" />
                            ) : (
                                <Play size={24} className="text-white" />
                            )}
                        </button>
                        <div className="mt-4 flex items-center space-x-2 text-slate-300">
                            <Clock size={16} />
                            <span className="font-mono text-lg font-medium">{displayTime}</span>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                            {isRunning ? 'Live' : 'Ready'}
                        </div>
                    </div>

                    {/* Opponent Team */}
                    <div className="flex-1 text-center">
                        <div className="mb-2">
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Opponent</span>
                        </div>
                        <div className="text-7xl font-black bg-gradient-to-br from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                            {opponentScore}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
