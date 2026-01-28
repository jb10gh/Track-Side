import React, { useState } from 'react';
import { Trash2, X, Eye, ArrowRight } from 'lucide-react';
import { MatchDetailView } from '../match/MatchDetailViewSimple';

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
        <div className="group bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 rounded-xl p-6 transition-all duration-300 hover:bg-slate-800/40 hover:shadow-xl hover:shadow-slate-900/10">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                        <div className="text-center">
                            <div className="text-3xl font-black bg-gradient-to-br from-pink-500 to-rose-600 bg-clip-text text-transparent">
                                {game.myScore}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-slate-400">-</div>
                        <div className="text-center">
                            <div className="text-3xl font-black bg-gradient-to-br from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                                {game.opponentScore}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                            vs {game.opponentName}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-slate-400">
                            <span>{new Date(game.timestamp).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{game.events.length} events</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                    <button 
                        onClick={handleViewDetails}
                        className="px-4 py-2 bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-lg font-semibold text-sm transition-all duration-200 transform hover:scale-105 shadow-lg shadow-pink-500/25 flex items-center space-x-2"
                    >
                        <Eye size={16} />
                        <span>View Details</span>
                    </button>
                    
                    {isConfirmingDelete ? (
                        <>
                            <button
                                onClick={onCancelDelete}
                                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-2 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white transition-all duration-200"
                            >
                                <Trash2 size={20} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onConfirmDelete}
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-red-400 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
