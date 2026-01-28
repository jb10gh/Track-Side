import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { Shell } from '../components/layout/ShellModern';
import { NewMatchForm } from '../components/home/NewMatchFormModern';
import { SquadRoster } from '../components/home/SquadRoster';
import { MatchArchive } from '../components/home/MatchArchive';

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
        <Shell title="Match Center">
            <div className="space-y-12 py-4">
                <NewMatchForm onStart={handleStart} />
                
                <SquadRoster 
                    roster={roster} 
                    onClear={clearRoster} 
                />

                <MatchArchive 
                    history={history} 
                    confirmingDelete={confirmingDelete} 
                    onConfirmDelete={setConfirmingDelete} 
                    onDelete={handleDelete} 
                />
            </div>
        </Shell>
    );
};
