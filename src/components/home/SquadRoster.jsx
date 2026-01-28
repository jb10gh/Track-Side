import React from 'react';
import { Users } from 'lucide-react';
import '../../styles/design-tokens.css';

/**
 * Clean Code: SquadRoster component.
 * Displays the list of saved player names.
 */
export const SquadRoster = ({ roster, onClear }) => {
    if (roster.length === 0) return null;

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
                <h2 className="text-2xl font-bold tracking-tighter uppercase flex items-center gap-3 text-white">
                    <Users size={24} className="text-pink-500" />
                    Squad Roster
                </h2>
                <button
                    onClick={() => window.confirm('Clear all saved names?') && onClear()}
                    className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-pink-400 transition-colors px-3 py-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 border border-slate-700/50 hover:border-pink-500/50"
                    style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                >
                    Clear All
                </button>
            </div>
            
            {/* Player List - Glassmorphism Container */}
            <div className="flex flex-wrap gap-2">
                {roster.map(name => (
                    <div 
                        key={name} 
                        className="px-3 py-2 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800/50 transition-all duration-200"
                        style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                    >
                        {name}
                    </div>
                ))}
            </div>
        </section>
    );
};
