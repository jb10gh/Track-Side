import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ClipboardCheck, Share2, X, FileDown } from 'lucide-react';
import { useGameStore, EVENT_TYPES, TEAMS } from '../store/gameStore';
import { Shell } from '../components/layout/Shell';
import { GameModal } from '../components/game/GameModal';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { ActionGrid } from '../components/game/ActionGrid';
import { EventTimeline } from '../components/game/EventTimeline';
import { useGameTimer } from '../hooks/useGameTimer';
import { downloadCSV } from '../utils/export';

export const ActiveGame = () => {
    const navigate = useNavigate();
    const {
        activeGameId,
        opponentName,
        myScore,
        opponentScore,
        events,
        isRunning,
        toggleTimer,
        formatTime,
        addEvent,
        undoLastEvent,
        finishGame,
        updateEvent,
    } = useGameStore();

    const displayTime = useGameTimer();
    const [modalState, setModalState] = useState({ isOpen: false, type: '', team: '' });
    const [editingEvent, setEditingEvent] = useState(null);
    const [copied, setCopied] = useState(false);
    const [confirmingFinish, setConfirmingFinish] = useState(false);

    if (!activeGameId) return <Navigate to="/" />;

    const handleAction = (type, team) => {
        setModalState({ isOpen: true, type, team });
    };

    const handleModalConfirm = (label, meta) => {
        if (editingEvent) {
            updateEvent(editingEvent.id, { label, meta });
            setEditingEvent(null);
        } else {
            addEvent(modalState.type, modalState.team, label, meta);
            setModalState({ isOpen: false, type: '', team: '' });
        }
    };

    const handleFinish = () => {
        finishGame();
        navigate('/');
    };

    const copySummary = () => {
        const summary = [
            `Match: Us vs ${opponentName}`,
            `Final: ${myScore}-${opponentScore}`,
            '------------------',
            ...events.slice().reverse().map(e => {
                const typeStr = e.meta?.isPK ? 'Goal (PK)' : e.type.charAt(0).toUpperCase() + e.type.slice(1);
                return `[${formatTime(e.gameTime)}] ${typeStr} (${e.team === TEAMS.US ? 'Us' : 'Them'}) - ${e.label || 'Unnamed'}`;
            })
        ].join('\n');

        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const HeaderActions = () => (
        <div className="flex items-center gap-2">
            {!confirmingFinish ? (
                <>
                    <button onClick={copySummary} className="btn-ghost p-2 rounded-xl bg-[var(--bg-secondary)] flex items-center gap-2">
                        {copied ? <ClipboardCheck size={18} className="text-[var(--color-brand)]" /> : <Share2 size={18} />}
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Copy</span>
                    </button>
                    <button
                        onClick={() => downloadCSV({ opponentName, myScore, opponentScore, events })}
                        className="btn-ghost p-2 rounded-xl bg-[var(--bg-secondary)] flex items-center gap-2"
                    >
                        <FileDown size={18} />
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">CSV</span>
                    </button>
                    <button onClick={() => setConfirmingFinish(true)} className="btn-ghost p-2 text-[var(--color-danger)]">
                        <span className="text-[10px] font-bold uppercase tracking-widest">End</span>
                    </button>
                </>
            ) : (
                <>
                    <button onClick={() => setConfirmingFinish(false)} className="btn-ghost p-2 text-[var(--text-secondary)]">
                        <X size={18} />
                    </button>
                    <button onClick={handleFinish} className="bg-[var(--color-danger)] text-white px-3 py-1.5 rounded-lg">
                        <span className="text-[10px] font-black uppercase tracking-widest">Finish?</span>
                    </button>
                </>
            )}
        </div>
    );

    return (
        <Shell title={`vs ${opponentName}`} headerAction={<HeaderActions />}>
            <div className="flex flex-col gap-8 py-4 pb-40">
                <ScoreBoard 
                    myScore={myScore} 
                    opponentScore={opponentScore} 
                    displayTime={displayTime} 
                    isRunning={isRunning} 
                    onToggleTimer={toggleTimer} 
                />

                <ActionGrid onAction={handleAction} />

                <EventTimeline 
                    events={events} 
                    onUndo={undoLastEvent} 
                    onEdit={setEditingEvent} 
                    formatTime={formatTime} 
                />
            </div>

            <GameModal
                isOpen={modalState.isOpen || !!editingEvent}
                type={editingEvent ? editingEvent.type : modalState.type}
                team={editingEvent ? editingEvent.team : modalState.team}
                initialLabel={editingEvent ? editingEvent.label : ''}
                initialIsPK={editingEvent ? editingEvent.meta?.isPK : false}
                onConfirm={handleModalConfirm}
                onCancel={() => {
                    setModalState({ isOpen: false, type: '', team: '' });
                    setEditingEvent(null);
                }}
            />
        </Shell>
    );
};
