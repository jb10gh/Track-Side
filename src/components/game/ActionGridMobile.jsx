import React from 'react';
import { Target, Shield, AlertTriangle, Lock } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';
import '../../styles/design-tokens.css';

export const ActionGrid = ({ onAction, isTimerRunning }) => {
    const homeTeamName = 'HOME';
    const awayTeamName = 'AWAY';
    
    const handleAction = (actionType, team) => {
        if (!isTimerRunning) {
            // Show timer reminder instead of executing action
            return { 
                type: 'timer_required',
                message: 'Start the timer before adding events',
                action: 'start_timer'
            };
        }
        
        // Execute action if timer is running
        onAction(actionType, team);
        return { type: 'success' };
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Timer Required Notice - Mobile Responsive */}
            {!isTimerRunning && (
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 border-2 border-amber-500/30 rounded-2xl p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center justify-center sm:justify-start">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                                <AlertTriangle size={24} className="text-white" />
                            </div>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-lg font-semibold text-white mb-1">
                                Start Timer First
                            </h3>
                            <p className="text-sm text-amber-200">
                                Add events after the game timer is running to ensure accurate game timing and event tracking
                            </p>
                        </div>
                        <div className="flex items-center justify-center sm:justify-end space-x-2">
                            <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center">
                                <Lock size={16} className="text-slate-400" />
                            </div>
                            <span className="text-xs font-medium text-amber-300 uppercase tracking-wider hidden sm:block">
                                Actions Locked
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons - Glassmorphism 2x2 Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ${
                !isTimerRunning ? 'opacity-50 pointer-events-none' : ''
            }`}>
                {/* Goal Home Team */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.GOAL, TEAMS.US)}
                    disabled={!isTimerRunning}
                    className="group relative bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 border-2 border-pink-500/50 hover:border-pink-500/70 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-slate-700/50 transition-all duration-200">
                            <Target size={20} className="text-pink-500 sm:size-24" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Goal</h3>
                            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">{homeTeamName}</span>
                        </div>
                    </div>
                </button>

                {/* Goal Away Team */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.GOAL, TEAMS.THEM)}
                    disabled={!isTimerRunning}
                    className="group relative bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 border-2 border-blue-400/50 hover:border-blue-400/70 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-slate-700/50 transition-all duration-200">
                            <Target size={20} className="text-blue-400 sm:size-24" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Goal</h3>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{awayTeamName}</span>
                        </div>
                    </div>
                </button>

                {/* Penalty Home Team */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.PENALTY, TEAMS.US)}
                    disabled={!isTimerRunning}
                    className="group relative bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 border-2 border-pink-500/50 hover:border-pink-500/70 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-slate-700/50 transition-all duration-200">
                            <AlertTriangle size={20} className="text-pink-500 sm:size-24" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Penalty</h3>
                            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">{homeTeamName}</span>
                        </div>
                    </div>
                </button>

                {/* Penalty Away Team */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.PENALTY, TEAMS.THEM)}
                    disabled={!isTimerRunning}
                    className="group relative bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 border-2 border-blue-400/50 hover:border-blue-400/70 rounded-xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-slate-700/50 transition-all duration-200">
                            <AlertTriangle size={20} className="text-blue-400 sm:size-24" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Penalty</h3>
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{awayTeamName}</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};
