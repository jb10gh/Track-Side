import React from 'react';
import { Undo2, Target, AlertTriangle } from 'lucide-react';
import { EventItem } from './EventItem';
import '../../styles/design-tokens.css';

export const EventTimeline = ({ events, onUndo, onEdit, onDelete, formatTime }) => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Header - Glassmorphism Surface Card */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow)' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-br from-pink-500 to-black rounded-full animate-pulse shadow-lg shadow-pink-500/50"></div>
                        <h3 className="text-xl font-bold text-white">Live Events</h3>
                        <div className="text-sm text-slate-400">
                            {events.length} event{events.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                    <button 
                        onClick={onUndo} 
                        className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 rounded-lg transition-all duration-200 text-slate-300 hover:text-white"
                        style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                    >
                        <Undo2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Undo Last</span>
                        <span className="text-xs font-bold uppercase tracking-wider sm:hidden">Undo</span>
                    </button>
                </div>

            {/* Events List - Glassmorphism Container */}
            <div className="space-y-3">
                {events.length === 0 ? (
                    <div className="bg-slate-900/50 backdrop-blur-sm border-2 border-dashed border-slate-700/50 rounded-2xl p-8 sm:p-12 text-center" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center">
                                <Target size={24} className="text-slate-500" />
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
                    events.map((event, index) => (
                        <EventItem
                            key={event.id}
                            event={event}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            formatTime={formatTime}
                            isLast={index === events.length - 1}
                        />
                    ))
                )}
            </div>
        </div>
    </div>
    );
};
