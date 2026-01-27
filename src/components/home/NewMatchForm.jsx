import React, { useState } from 'react';
import { PlusCircle, PlayCircle, ArrowRight } from 'lucide-react';

/**
 * Clean Code: NewMatchForm component.
 * Handles input and submission for starting a new match.
 */
export const NewMatchForm = ({ onStart }) => {
    const [opponent, setOpponent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!opponent.trim()) return;
        onStart(opponent.trim());
    };

    return (
        <section className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                    <PlusCircle className="text-[var(--color-brand)]" size={32} />
                    New Match
                </h2>
                <p className="text-[var(--text-secondary)] font-medium text-sm">
                    Initialize utility for current gamekeeper session.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                    <input
                        type="text"
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                        placeholder="Opponent Name..."
                        className="input-field font-mono pr-14"
                        required
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--color-brand)] transition-colors">
                        <PlayCircle size={24} />
                    </div>
                </div>
                <button 
                    type="submit" 
                    className="btn-primary w-full shadow-lg h-16 text-lg font-black uppercase tracking-tighter italic flex items-center justify-center gap-2"
                >
                    Begin Tracking
                    <ArrowRight size={20} />
                </button>
            </form>
        </section>
    );
};
