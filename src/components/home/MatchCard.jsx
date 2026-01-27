import React from 'react';
import { Trash2, X } from 'lucide-react';

/**
 * Clean Code: MatchCard component.
 * Represents a single match entry in the archive.
 */
export const MatchCard = ({ game, isConfirmingDelete, onConfirmDelete, onCancelDelete, onDelete }) => {
    return (
        <div className="card-simple flex items-center justify-between group bg-[var(--bg-secondary)] border-[var(--color-border)] hover:border-[var(--text-secondary)]/30">
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] font-mono">
                    {new Date(game.timestamp).toLocaleDateString()}
                </p>
                <h3 className="text-xl font-black uppercase italic tracking-tighter flex items-center gap-2">
                    vs {game.opponentName}
                </h3>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-3xl font-black font-mono tracking-tighter">
                        <span className="text-[var(--color-brand)]">{game.myScore}</span>
                        <span className="mx-1 text-[var(--text-secondary)] opacity-20">-</span>
                        <span>{game.opponentScore}</span>
                    </div>
                </div>

                {isConfirmingDelete ? (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onCancelDelete}
                            className="p-2 text-[var(--text-secondary)]"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="bg-[var(--color-danger)] text-white p-2 rounded-xl"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onConfirmDelete}
                        className="p-2 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};
