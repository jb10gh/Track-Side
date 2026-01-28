import React, { useState } from 'react';
import { PlusCircle, ArrowRight } from 'lucide-react';
import '../../styles/design-tokens.css';

export const NewMatchForm = ({ onStart }) => {
    const [opponent, setOpponent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!opponent.trim()) return;
        onStart(opponent.trim());
    };

    return (
        <section className="space-y-8">
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-black to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25" style={{ backgroundImage: 'var(--team-our-gradient)' }}>
                        <PlusCircle size={24} className="text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white">New Match</h2>
                </div>
                <p className="text-slate-400 font-medium">
                    Start tracking your next game
                </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <div className="relative">
                    <input
                        type="text"
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                        placeholder="Enter opponent name"
                        className="w-full px-4 py-3 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:bg-slate-900/70 transition-all duration-200"
                        style={{ boxShadow: 'var(--glass-shadow-sm)' }}
                        required
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ArrowRight size={20} className="text-slate-500" />
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={!opponent.trim()}
                    className="w-full px-6 py-3 bg-gradient-to-br from-black to-pink-500 hover:from-pink-600 hover:to-black disabled:from-slate-600 disabled:to-slate-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg shadow-pink-500/25 disabled:shadow-none flex items-center justify-center space-x-2"
                    style={{ backgroundImage: 'var(--team-our-gradient)' }}
                >
                    <span>Start Match</span>
                    <ArrowRight size={18} />
                </button>
            </form>
        </section>
    );
};
