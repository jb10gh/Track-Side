import React from 'react';
import { Target, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';
import '../../styles/design-tokens.css';

export const EventItem = ({ event, onEdit, onDelete, formatTime }) => {
    const homeTeamName = 'HOME';
    const awayTeamName = 'AWAY';
    const isUs = event.team === TEAMS.US;
    const isGoal = event.type === EVENT_TYPES.GOAL;

    const handleDelete = (e) => {
        e.stopPropagation(); // Prevent triggering the edit click
        if (window.confirm(`Are you sure you want to delete this ${isGoal ? 'goal' : 'penalty'} event?`)) {
            onDelete(event.id);
        }
    };

    return (
        <div
            onClick={onEdit}
            className={`flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/70 border-l-4 transition-all cursor-pointer group ${
                isUs ? 'border-pink-500/70' : 'border-blue-400/70'
            }`}
            style={{ boxShadow: 'var(--glass-shadow-sm)' }}
        >
            <span className="text-sm font-bold tabular-nums text-slate-400 w-12 font-mono">
                {formatTime(event.gameTime)}
            </span>

            <div className="flex-1 flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                            isUs ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-400/20 text-blue-400'
                        }`}>
                            {isUs ? homeTeamName : awayTeamName}
                        </span>
                        {event.meta?.isPK && (
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                isUs ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-400/20 text-blue-400'
                            }`}>
                                PK
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">
                            {event.label || (isGoal ? 'Unnamed Goal' : 'Unnamed Penalty')}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-60 transition-opacity">
                            <Pencil size={12} className="hover:text-pink-400 transition-colors" />
                            <Trash2 
                                size={12} 
                                className="hover:text-red-400 transition-colors cursor-pointer" 
                                onClick={handleDelete}
                            />
                        </div>
                    </div>
                    {!isUs && event.label && (
                        <div className="text-xs text-blue-400 font-medium mt-1">
                            {event.label}
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className={isUs ? 'text-pink-500' : 'text-blue-400'}>
                        {isGoal ? <Target size={20} /> : <AlertTriangle size={20} />}
                    </div>
                    {/* Removed HOME team label from right side */}
                </div>
            </div>
        </div>
    );
};
