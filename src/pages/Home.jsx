import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Shell } from '../components/layout/ShellModern';
import { NewMatchForm } from '../components/home/NewMatchFormModern';
import { SquadRoster } from '../components/home/SquadRoster';
import { MatchArchive } from '../components/home/MatchArchive';
import '../styles/design-tokens.css';

export const Home = () => {
    const { startGame, history, deleteMatch, roster, clearRoster } = useGameStore();
    const navigate = useNavigate();
    const [confirmingDelete, setConfirmingDelete] = useState(null);

    const handleStart = (opponent) => {
        startGame(opponent);
        navigate('/game');
    };

    const handleDelete = (id) => {
        deleteMatch(id);
        setConfirmingDelete(null);
    };

    return (
        <Shell title="Track Side Analytics">
            {/* Header Section - Similar to Game Page */}
            <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            Match Center
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-slate-400">
                            <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full mr-2 bg-emerald-400 animate-pulse"></span>
                                Ready to Track
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span>{history.length} matches</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="text-xs bg-slate-700/50 px-2 py-1 rounded">{roster.length} players</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 sm:space-y-8">
                {/* New Match Form */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                    <NewMatchForm onStart={handleStart} />
                </div>
                
                {/* Squad Roster */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                    <SquadRoster 
                        roster={roster} 
                        onClear={clearRoster} 
                    />
                </div>

                {/* Match Archive */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-4 sm:p-6" style={{ boxShadow: 'var(--glass-shadow-sm)' }}>
                    <MatchArchive 
                        history={history} 
                        confirmingDelete={confirmingDelete} 
                        onConfirmDelete={setConfirmingDelete} 
                        onDelete={handleDelete} 
                    />
                </div>
            </div>
        </Shell>
    );
};
