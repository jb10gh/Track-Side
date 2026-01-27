import React from 'react';
import { Undo2 } from 'lucide-react';
import { EventItem } from './EventItem';

/**
 * Clean Code: EventTimeline component.
 * Displays the list of game events in reverse chronological order.
 */
export const EventTimeline = ({ events, onUndo, onEdit, formatTime }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-pulse" />
                    Live Events
                </h3>
                <button 
                    onClick={onUndo} 
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                    <Undo2 size={14} />
                    Undo Last
                </button>
            </div>

            <div className="space-y-3">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-center card-simple bg-transparent border-dashed">
                        <p className="text-[var(--text-secondary)] font-medium text-sm italic">
                            Ready for kick-off. No events logged.
                        </p>
                    </div>
                ) : (
                    events.map((event) => (
                        <EventItem 
                            key={event.id} 
                            event={event} 
                            onEdit={() => onEdit(event)} 
                            formatTime={formatTime} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};
