import React from 'react';
import { Undo2 } from 'lucide-react';
import { EventItem } from './EventItem';

export const EventTimeline = ({ events, onUndo, onEdit, onDelete, formatTime }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    Live Events
                </h3>
                <button 
                    onClick={onUndo} 
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                >
                    <Undo2 size={14} />
                    Undo Last
                </button>
            </div>

            <div className="space-y-3">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-center border-2 border-dashed border-gray-700 rounded-lg">
                        <p className="text-gray-400 font-medium text-sm italic">
                            Ready for kick-off. No events logged.
                        </p>
                    </div>
                ) : (
                    events.map((event, index) => (
                        <EventItem
                            key={event.id}
                            event={event}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            formatTime={formatTime}
                            isLast={index === 0}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
