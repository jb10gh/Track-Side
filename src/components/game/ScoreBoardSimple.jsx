import React from 'react';
import { Play, Pause } from 'lucide-react';

export const ScoreBoard = ({ myScore, opponentScore, displayTime, isRunning, onToggleTimer }) => {
    return (
        <div className="flex flex-col items-center py-10 gap-8">
            <div className="flex w-full items-center justify-between px-4">
                {/* Us Score */}
                <div className="flex flex-col items-center flex-1">
                    <span className="text-xs font-black uppercase tracking-widest mb-2 font-mono text-pink-400">
                        US
                    </span>
                    <div className="text-6xl font-black text-pink-500">
                        {myScore}
                    </div>
                </div>

                {/* Timer */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={onToggleTimer}
                        className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                            isRunning 
                                ? 'bg-yellow-600 hover:bg-yellow-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isRunning ? (
                            <Pause size={24} className="text-white" />
                        ) : (
                            <Play size={24} className="text-white" />
                        )}
                    </button>
                    <div className="mt-2 text-2xl font-mono text-white">
                        {displayTime}
                    </div>
                </div>

                {/* Opponent Score */}
                <div className="flex flex-col items-center flex-1">
                    <span className="text-xs font-black uppercase tracking-widest mb-2 font-mono text-blue-400">
                        THEM
                    </span>
                    <div className="text-6xl font-black text-blue-500">
                        {opponentScore}
                    </div>
                </div>
            </div>
        </div>
    );
};
