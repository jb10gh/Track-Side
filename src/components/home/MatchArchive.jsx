import React from 'react';
import { History, Trophy } from 'lucide-react';
import { MatchCard } from './MatchCard';

/**
 * Clean Code: MatchArchive component.
 * Displays the history of previous matches.
 */
export const MatchArchive = ({ history, confirmingDelete, onConfirmDelete, onDelete }) => {
    return (
        <section className="space-y-8 pb-12">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                    <History size={24} />
                    Match Archive
                </h2>
                <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1 rounded-full">
                    <Trophy size={14} className="text-[var(--color-brand)]" />
                    <span className="text-[10px] font-black font-mono">
                        {history.length}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                {history.length === 0 ? (
                    <div className="card-simple p-16 flex flex-col items-center text-center space-y-4 opacity-40 border-dashed">
                        <div className="w-16 h-16 rounded-3xl bg-[var(--bg-secondary)] flex items-center justify-center">
                            <History size={32} />
                        </div>
                        <p className="font-bold text-[var(--text-secondary)] uppercase tracking-widest text-xs">
                            Zero Matches on Record
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
