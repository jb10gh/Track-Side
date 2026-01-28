import React from 'react';
import { Undo2, Clock, Target, AlertTriangle } from 'lucide-react';
import { EventItem } from './EventItem';

export const EventTimeline = ({ events, onUndo, onEdit, onDelete, formatTime }) => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Header - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full animate-pulse shadow-lg shadow-pink-500/50"></div>
                    <h3 className="text-xl font-bold text-white">Live Events</h3>
                    <div className="text-sm text-slate-400">
                        {events.length} event{events.length !== 1 ? 's' : ''}
                    </div>
                </div>
                <button 
                    onClick={onUndo} 
                    className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-slate-500/50 rounded-lg transition-all duration-200 text-slate-300 hover:text-white"
                >
                    <Undo2 size={16} />
                    <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Undo Last</span>
                    <span className="text-xs font-semibold uppercase tracking-wider sm:hidden">Undo</span>
                </button>
            </div>

            {/* Events List - Mobile Responsive */}
            <div className="space-y-3">
                {events.length === 0 ? (
                    <div className="bg-slate-800/30 border-2 border-dashed border-slate-600/50 rounded-2xl p-8 sm:p-12 text-center">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center">
                                <Clock size={24} className="text-slate-500" />
                            </div>
                            <p className="text-slate-400 font-medium">
                                Ready for kick-off. No events logged.
                            </p>
                            <p className="text-sm text-slate-500">
                                Start adding events to track the game
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {events.map((event, index) => (
                            <div
                                key={event.id}
                                className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:bg-slate-800/40"
                            >
                                <EventItem
                                    event={event}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    formatTime={formatTime}
                                    isLast={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
