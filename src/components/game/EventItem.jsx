import React from 'react';
import { Target, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';

/**
 * Clean Code: EventItem component.
 * Represents a single event entry in the timeline.
 */
export const EventItem = ({ event, onEdit, onDelete, formatTime }) => {
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
            className={`flex items-center gap-4 p-5 rounded-[1.5rem] animate-slide-up hover:border-[var(--color-brand)] transition-all cursor-pointer group team-color-transition ${
                isUs ? 'event-our border-[var(--team-our-border)]' : 'event-their border-[var(--team-their-border)]'
            }`}
        >
            <span className="text-sm font-black tabular-nums text-[var(--text-secondary)] w-12 font-mono">
                {formatTime(event.gameTime)}
            </span>

            <div className="flex-1 flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isUs ? 'text-[var(--team-our-text)]' : 'text-[var(--team-their-text)]'}`}>
                            {isUs ? 'Us' : 'Them'}
                        </span>
                        {event.meta?.isPK && (
                            <span className={`text-[8px] font-black px-1.5 rounded uppercase tracking-tighter ${
                                isUs ? 'bg-[var(--team-our-primary)] text-white' : 'bg-[var(--team-their-primary)] text-white'
                            }`}>
                                PK
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-black text-xl italic tracking-tight uppercase leading-tight">
                            {event.label || (isGoal ? 'Unnamed Goal' : 'Unnamed Penalty')}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-60 transition-opacity">
                            <Pencil size={12} className="hover:text-[var(--color-brand)] transition-colors" />
                            <Trash2 
                                size={12} 
                                className="hover:text-[var(--color-danger)] transition-colors cursor-pointer" 
                                onClick={handleDelete}
                            />
                        </div>
                    </div>
                </div>
                <div className={isUs ? 'text-[var(--team-our-primary)]' : 'text-[var(--team-their-primary)]'}>
                    {isGoal ? <Target size={24} /> : <AlertTriangle size={24} />}
                </div>
            </div>
        </div>
    );
};
