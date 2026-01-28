import React, { useState } from 'react';
import { Trash2, X, Eye, ArrowRight } from 'lucide-react';
import { MatchDetailView } from '../match/MatchDetailViewSimple';

/**
 * Clean Code: MatchCard component.
 * Represents a single match entry in the archive with unified theme system.
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
        <div className="flex items-center justify-between group transition-all duration-300 bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4 hover:border-gray-600">
            <div className="space-y-1">
                <p className="font-bold uppercase tracking-widest font-mono text-pink-500">
                    {game.myScore} - {game.opponentScore}
                </p>
                <p className="text-white font-semibold">
                    vs {game.opponentName}
                </p>
                <p className="text-sm text-gray-400">
                    {new Date(game.timestamp).toLocaleDateString()} • {game.events.length} events
                </p>
            </div>
            
            <div className="flex items-center gap-1">
                <button 
                    onClick={handleViewDetails}
                    className="px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white"
                >
                    <Eye size={16} />
                    View Details
                </button>
                
                {isConfirmingDelete ? (
                    <>
                        <button
                            onClick={onCancelDelete}
                            className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 rounded-xl transition-all bg-red-600 hover:bg-red-700 text-white"
                        >
                            <Trash2 size={20} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={onConfirmDelete}
                        className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-gray-800"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>
        </div>
    );
};
