import React from 'react';
import { Target, Shield, AlertTriangle, Clock, Lock } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';

export const ActionGrid = ({ onAction, isTimerRunning }) => {
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
                                <Clock size={24} className="text-white" />
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

            {/* Action Buttons - Mobile Responsive Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300 ${
                !isTimerRunning ? 'opacity-50 pointer-events-none' : ''
            }`}>
                {/* Goal Our Team */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.GOAL, TEAMS.US)}
                    disabled={!isTimerRunning}
                    className="group relative bg-gradient-to-br from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30 border-2 border-pink-500/30 hover:border-pink-500/50 rounded-2xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
                            <Target size={20} className="text-white sm:size-28" />
                        </div>
                        <div className="text-center">
                            <span className="text-base sm:text-lg font-bold text-white">Goal</span>
                            <span className="block text-xs text-pink-300 font-medium">Our Team</span>
                        </div>
                    </div>
                </button>

                {/* Goal Opponent */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.GOAL, TEAMS.THEM)}
                    disabled={!isTimerRunning}
                    className="group relative bg-gradient-to-br from-blue-500/20 to-cyan-600/20 hover:from-blue-500/30 hover:to-cyan-600/30 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-2xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                            <Target size={20} className="text-white sm:size-28" />
                        </div>
                        <div className="text-center">
                            <span className="text-base sm:text-lg font-bold text-white">Goal</span>
                            <span className="block text-xs text-blue-300 font-medium">Opponent</span>
                        </div>
                    </div>
                </button>

                {/* Penalty Our Team */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.PENALTY, TEAMS.US)}
                    disabled={!isTimerRunning}
                    className="group relative bg-gradient-to-br from-amber-500/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-600/30 border-2 border-amber-500/30 hover:border-amber-500/50 rounded-2xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300">
                            <AlertTriangle size={20} className="text-white sm:size-28" />
                        </div>
                        <div className="text-center">
                            <span className="text-base sm:text-lg font-bold text-white">Penalty</span>
                            <span className="block text-xs text-amber-300 font-medium">Our Team</span>
                        </div>
                    </div>
                </button>

                {/* Penalty Opponent */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.PENALTY, TEAMS.THEM)}
                    disabled={!isTimerRunning}
                    className="group relative bg-gradient-to-br from-purple-500/20 to-violet-600/20 hover:from-purple-500/30 hover:to-violet-600/30 border-2 border-purple-500/30 hover:border-purple-500/50 rounded-2xl p-4 sm:p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                            <AlertTriangle size={20} className="text-white sm:size-28" />
                        </div>
                        <div className="text-center">
                            <span className="text-base sm:text-lg font-bold text-white">Penalty</span>
                            <span className="block text-xs text-purple-300 font-medium">Opponent</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};
