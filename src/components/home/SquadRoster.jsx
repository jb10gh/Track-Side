import React from 'react';
import { Users } from 'lucide-react';

/**
 * Clean Code: SquadRoster component.
 * Displays the list of saved player names.
 */
export const SquadRoster = ({ roster, onClear }) => {
    if (roster.length === 0) return null;

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                    <Users size={24} className="text-[var(--color-brand)]" />
                    Squad Roster
                </h2>
                <button
                    onClick={() => window.confirm('Clear all saved names?') && onClear()}
                    className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--color-danger)] transition-colors"
                >
                    Clear All
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {roster.map(name => (
                    <div 
                        key={name} 
                        className="px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--color-border)] text-xs font-bold uppercase tracking-tight font-mono"
                    >
                        {name}
                    </div>
                ))}
            </div>
        </section>
    );
};
