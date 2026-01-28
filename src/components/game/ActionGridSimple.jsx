import React from 'react';
import { Target, Shield, AlertTriangle } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';

export const ActionGrid = ({ onAction }) => {
    const handleAction = (actionType, team) => {
        onAction(actionType, team);
        return true;
    };

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <button 
                onClick={() => handleAction(EVENT_TYPES.GOAL, TEAMS.US)} 
                className="rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2 bg-pink-900/50 border-2 border-pink-600 hover:bg-pink-900/70"
            >
                <Target 
                    size={32} 
                    strokeWidth={2.5} 
                    className="text-pink-400" 
                />
                <span className="text-sm font-bold text-white">
                    Goal Us
                </span>
            </button>

            <button 
                onClick={() => handleAction(EVENT_TYPES.GOAL, TEAMS.THEM)} 
                className="rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2 bg-blue-900/50 border-2 border-blue-600 hover:bg-blue-900/70"
            >
                <Shield 
                    size={32} 
                    strokeWidth={2.5} 
                    className="text-blue-400" 
                />
                <span className="text-sm font-bold text-white">
                    Goal Them
                </span>
            </button>

            <button 
                onClick={() => handleAction(EVENT_TYPES.PENALTY, TEAMS.US)} 
                className="rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2 bg-pink-900/50 border-2 border-pink-600 hover:bg-pink-900/70"
            >
                <AlertTriangle 
                    size={24} 
                    strokeWidth={2.5} 
                    className="text-yellow-400" 
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Penalty Us
                </span>
            </button>

            <button 
                onClick={() => handleAction(EVENT_TYPES.PENALTY, TEAMS.THEM)} 
                className="rounded-xl p-4 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-2 bg-blue-900/50 border-2 border-blue-600 hover:bg-blue-900/70"
            >
                <AlertTriangle 
                    size={24} 
                    strokeWidth={2.5} 
                    className="text-yellow-400" 
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-white">
                    Penalty Them
                </span>
            </button>
        </div>
    );
};
