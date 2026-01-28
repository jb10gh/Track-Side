import React from 'react';
import { History, Trophy } from 'lucide-react';
import { MatchCard } from './MatchCardModern';
import '../../styles/design-tokens.css';

export const MatchArchive = ({ history, confirmingDelete, onConfirmDelete, onDelete }) => {
    return (
        <section className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <History size={24} className="text-slate-400" />
                    Match Archive
                </h2>
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                    <Trophy size={14} className="text-pink-500" />
                    <span className="text-xs font-mono text-white font-medium">
                        {history.length}
                    </span>
                </div>
            </div>

            {/* Match List - Glassmorphism Container */}
            <div className="space-y-4">
                {history.length === 0 ? (
                    <div className="bg-slate-900/50 backdrop-blur-sm border-2 border-dashed border-slate-700/50 rounded-2xl p-16 flex flex-col items-center text-center space-y-4" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center">
                            <History size={32} className="text-slate-500" />
                        </div>
                        <p className="font-bold text-slate-400 uppercase tracking-wider text-xs">
                            Zero Matches on Record
                        </p>
                        <p className="text-sm text-slate-500">
                            Start your first match to see it here
                        </p>
                    </div>
                ) : (
                    history.map((game) => (
                        <MatchCard 
                            key={game.id} 
                            game={game} 
                            isConfirmingDelete={confirmingDelete === game.id} 
                            onConfirmDelete={() => onConfirmDelete(game.id)} 
                            onCancelDelete={() => onConfirmDelete(null)} 
                            onDelete={() => onDelete(game.id)} 
                        />
                    ))
                )}
            </div>
        </section>
    );
};
