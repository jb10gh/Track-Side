import React from 'react';
import { Target, Shield, AlertTriangle } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';

export const ActionGrid = ({ onAction }) => {
    const handleAction = (actionType, team) => {
        onAction(actionType, team);
        return true;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 gap-4">
                {/* Goal Our Team */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.GOAL, TEAMS.US)} 
                    className="group relative bg-gradient-to-br from-pink-500/20 to-rose-600/20 hover:from-pink-500/30 hover:to-rose-600/30 border-2 border-pink-500/30 hover:border-pink-500/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-pink-500/10"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
                            <Target size={28} className="text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-white">Goal</span>
                            <span className="block text-xs text-pink-300 font-medium">Our Team</span>
                        </div>
                    </div>
                </button>

                {/* Goal Opponent */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.GOAL, TEAMS.THEM)} 
                    className="group relative bg-gradient-to-br from-blue-500/20 to-cyan-600/20 hover:from-blue-500/30 hover:to-cyan-600/30 border-2 border-blue-500/30 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                            <Target size={28} className="text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-white">Goal</span>
                            <span className="block text-xs text-blue-300 font-medium">Opponent</span>
                        </div>
                    </div>
                </button>

                {/* Penalty Our Team */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.PENALTY, TEAMS.US)} 
                    className="group relative bg-gradient-to-br from-amber-500/20 to-orange-600/20 hover:from-amber-500/30 hover:to-orange-600/30 border-2 border-amber-500/30 hover:border-amber-500/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/10"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-amber-500/25 transition-all duration-300">
                            <AlertTriangle size={28} className="text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-white">Penalty</span>
                            <span className="block text-xs text-amber-300 font-medium">Our Team</span>
                        </div>
                    </div>
                </button>

                {/* Penalty Opponent */}
                <button 
                    onClick={() => handleAction(EVENT_TYPES.PENALTY, TEAMS.THEM)} 
                    className="group relative bg-gradient-to-br from-purple-500/20 to-violet-600/20 hover:from-purple-500/30 hover:to-violet-600/30 border-2 border-purple-500/30 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10"
                >
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                            <AlertTriangle size={28} className="text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-white">Penalty</span>
                            <span className="block text-xs text-purple-300 font-medium">Opponent</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};
