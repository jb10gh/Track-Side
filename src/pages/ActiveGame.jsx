import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ClipboardCheck, Share2, X, FileDown } from 'lucide-react';
import { useGameStore, EVENT_TYPES, TEAMS } from '../store/gameStore';
import { Shell } from '../components/layout/Shell';
import { GameModal } from '../components/game/GameModal';
import { ExportDecisionModal } from '../components/game/ExportDecisionModal';
import { SimplifiedExport } from '../components/game/SimplifiedExport';
import { TimerInvocationModal } from '../components/game/TimerInvocationModal';
import { ScoreBoard } from '../components/game/ScoreBoard';
import { ActionGrid } from '../components/game/ActionGrid';
import { EventTimeline } from '../components/game/EventTimeline';
import { useGameTimer } from '../hooks/useGameTimer';
import { downloadCSV, copyEnhancedSummary } from '../utils/export';
import { TrackSideHeader, TrackSideWatermark } from '../components/brand/TrackSideLogo';

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
        formatTimeForExport,
        timerInvocation,
        invokeTimer,
        startTimerWithConfirmation,
        dismissTimerReminder,
        checkTimerState,
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
    const [showExportModal, setShowExportModal] = useState(false);
    const [showTimerModal, setShowTimerModal] = useState(false);
    const [showSimplifiedExport, setShowSimplifiedExport] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);

    // CRITICAL FIX: Ensure share workflow never appears on game start
    React.useEffect(() => {
        // Double-check that share workflow is never shown on game start
        if (showSimplifiedExport && !gameFinished) {
            console.warn('Share workflow shown prematurely - fixing state');
            setShowSimplifiedExport(false);
        }
    }, [showSimplifiedExport, gameFinished]);

    // Check timer state on component mount and first event
    React.useEffect(() => {
        checkTimerState();
    }, []);

    // Show timer modal on first event if timer not running
    React.useEffect(() => {
        if (events.length === 1 && !isRunning && !timerInvocation.reminderDismissed) {
            setShowTimerModal(true);
            invokeTimer('first_event');
        }
    }, [events.length, isRunning]);

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
        // CRITICAL FIX: Mark game as finished BEFORE showing export
        setGameFinished(true);
        setShowSimplifiedExport(true);
    };

    const handleCopyAndFinish = async () => {
        await copyEnhancedSummary({ opponentName, myScore, opponentScore, events }, formatTime, formatTimeForExport);
        finishGame();
        navigate('/');
    };

    const handleDownloadAndFinish = async () => {
        downloadCSV({ opponentName, myScore, opponentScore, events });
        finishGame();
        navigate('/');
    };

    const handleSkipAndFinish = () => {
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
                    <button onClick={handleFinish} className="bg-gradient-to-r from-[#FF1493] to-[#FF007F] hover:from-[#FF69B4] hover:to-[#FF1493] text-white px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all transform hover:scale-105 shadow-lg" style={{ boxShadow: '0 4px 20px rgba(255, 20, 147, 0.4)' }}>
                        <span className="text-[10px] font-black uppercase tracking-widest">Finish?</span>
                    </button>
                </>
            )}
        </div>
    );

    return (
        <Shell title={`vs ${opponentName}`} headerAction={<HeaderActions />}>
            {/* Track Side Header */}
            <TrackSideHeader 
              title={`vs ${opponentName}`} 
              subtitle="Track Side Analytics" 
              showLogo={true} 
            />
            
            {/* Enhanced Opponent Name Display */}
            <div className="opponent-header mb-6">
                <div className="text-center">
                    <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                        VS
                    </div>
                    <div className="text-3xl font-black text-white mb-2" style={{ 
                        textShadow: 'var(--glow-hot-pink)' 
                    }}>
                        {opponentName}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                        Opponent
                    </div>
                </div>
            </div>
            
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

            {/* CRITICAL FIX: Only show SimplifiedExport when game is actually finished */}
            {showSimplifiedExport && (
                <SimplifiedExport
                    matchData={{ opponentName, myScore, opponentScore, events, timestamp: Date.now(), finalTime: displayTime }}
                    onClose={() => {
                        setShowSimplifiedExport(false);
                        finishGame();
                        navigate('/');
                    }}
                />
            )}

            <ExportDecisionModal
                isOpen={showExportModal}
                gameData={{ opponentName, myScore, opponentScore, events }}
                onCopy={handleCopyAndFinish}
                onDownload={handleDownloadAndFinish}
                onSkip={handleSkipAndFinish}
            />

            <TimerInvocationModal
                isOpen={showTimerModal}
                trigger={timerInvocation.lastInvocationTrigger}
                onStart={() => {
                    startTimerWithConfirmation();
                    setShowTimerModal(false);
                }}
                onSkip={() => {
                    dismissTimerReminder();
                    setShowTimerModal(false);
                }}
                onDismiss={() => {
                    setShowTimerModal(false);
                }}
            />
            
            {/* TrackSide Watermark */}
            <TrackSideWatermark opacity={0.1} />
        </Shell>
    );
};
