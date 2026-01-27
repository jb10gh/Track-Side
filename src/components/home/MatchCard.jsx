import React, { useState } from 'react';
import { Trash2, X, Eye, ArrowRight } from 'lucide-react';
import { MatchDetailView } from '../match/MatchDetailView';

/**
 * Clean Code: MatchCard component.
 * Represents a single match entry in the archive.
 */
export const MatchCard = ({ game, isConfirmingDelete, onConfirmDelete, onCancelDelete, onDelete }) => {
    const [showDetailView, setShowDetailView] = useState(false);

    const handleViewDetails = () => {
        setShowDetailView(true);
    };

    const handleCloseDetails = () => {
        setShowDetailView(false);
    };

    if (showDetailView) {
        return <MatchDetailView matchId={game.id} onClose={handleCloseDetails} />;
    }

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
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                        {game.events.length} events
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleViewDetails}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--color-brand)] hover:bg-[var(--bg-primary)] rounded-lg transition-all"
                        title="View match details"
                    >
                        <Eye size={18} />
                    </button>
                    
                    {isConfirmingDelete ? (
                        <>
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
                        </>
                    ) : (
                        <button
                            onClick={onConfirmDelete}
                            className="p-2 text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--color-danger)]"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
