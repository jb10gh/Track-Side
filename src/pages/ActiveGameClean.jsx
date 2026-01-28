import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ClipboardCheck, Share2, X, FileDown, Clock, Play, Pause } from 'lucide-react';
import { useGameStore, EVENT_TYPES, TEAMS } from '../store/gameStore';
import { Shell } from '../components/layout/ShellSimple';
import { GameModal } from '../components/game/GameModal';
import { StreamlinedExportModal } from '../components/game/StreamlinedExportModal';
import { TimerInvocationModal } from '../components/game/TimerInvocationModal';
import { ScoreBoard } from '../components/game/ScoreBoardSimple';
import { ActionGrid } from '../components/game/ActionGridSimple';
import { EventTimeline } from '../components/game/EventTimelineSimple';
import { useGameTimer } from '../hooks/useGameTimer';
import { downloadCSV, copyEnhancedSummary } from '../utils/export';
import { Button, IconButton } from '../components/ui';
import { EndGameConfirmation } from '../components/game/EndGameConfirmation';

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
        deleteEvent,
        finishGame,
        updateEvent,
    } = useGameStore();

    const displayTime = useGameTimer();
    const [modalState, setModalState] = useState({ isOpen: false, type: '', team: '' });
    const [editingEvent, setEditingEvent] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showStreamlinedExport, setShowStreamlinedExport] = useState(false);
    const [showTimerModal, setShowTimerModal] = useState(false);
    const [showEndConfirmation, setShowEndConfirmation] = useState(false);

    // Check timer state on component mount
    React.useEffect(() => {
        checkTimerState();
    }, []);

    // Show timer modal on first event if timer not running
    React.useEffect(() => {
        if (events.length === 1 && !isRunning && !timerInvocation.reminderDismissed) {
            setShowTimerModal(true);
        }
    }, [events.length, isRunning, timerInvocation.reminderDismissed]);

    const handleModalConfirm = (label, meta) => {
        if (editingEvent) {
            updateEvent(editingEvent.id, { label, meta });
            setEditingEvent(null);
        } else {
            addEvent(modalState.type, modalState.team, label, meta);
            setModalState({ isOpen: false, type: '', team: '' });
        }
    };

    const handleAction = (actionType, team) => {
        setModalState({ isOpen: true, type: actionType, team });
    };

    const handleConfirmEnd = (exportOption) => {
        // Handle export if selected
        if (exportOption !== 'none') {
            handleExport(exportOption);
        }
        
        // End the game
        finishGame();
        navigate('/');
    };
    
    const handleExport = (option) => {
        const gameData = {
            opponentName,
            myScore,
            opponentScore,
            events,
            duration: displayTime
        };
        
        switch (option) {
            case 'copy':
                copyEnhancedSummary(gameData, formatTime, formatTimeForExport);
                break;
            case 'csv':
                downloadCSV(gameData);
                break;
        }
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

    const copySummary = async () => {
        await copyEnhancedSummary({ opponentName, myScore, opponentScore, events }, formatTime, formatTimeForExport);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const HeaderActions = () => (
        <div className="header-actions flex items-center gap-3">
            <IconButton 
                variant="ghost" 
                size="sm"
                onClick={copySummary}
                className="action-button"
            >
                {copied ? <ClipboardCheck size={16} /> : <Share2 size={16} />}
            </IconButton>
            
            <IconButton 
                variant="ghost" 
                size="sm"
                onClick={() => downloadCSV({ opponentName, myScore, opponentScore, events })}
                className="action-button"
            >
                <FileDown size={16} />
            </IconButton>
            
            <Button 
                variant="danger" 
                size="sm"
                onClick={() => setShowEndConfirmation(true)}
                className="end-game-btn"
            >
                <span className="text-xs font-black uppercase tracking-widest">End</span>
            </Button>
        </div>
    );

    if (!activeGameId) {
        return <Navigate to="/" replace />;
    }

    return (
        <Shell title="Track Side Analytics" headerAction={<HeaderActions />}>
            {/* Simple Score Display Only */}
            <div className="bg-black border-b border-gray-800 p-4">
                <div className="text-center py-4">
                    <div className="text-5xl font-black">
                        <span className="text-pink-500">{myScore}</span>
                        <span className="mx-4 text-white">-</span>
                        <span className="text-blue-500">{opponentScore}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                        vs {opponentName} • {events.length} events • {isRunning ? 'Live' : 'Not Started'}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-6 py-6">
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
                    onDelete={deleteEvent}
                    formatTime={formatTime} 
                />
            </div>

            <GameModal
                isOpen={modalState.isOpen || !!editingEvent}
                type={editingEvent ? editingEvent.type : modalState.type}
                team={editingEvent ? editingEvent.team : modalState.team}
                initialLabel={editingEvent ? editingEvent.label : modalState.label}
                initialIsPK={editingEvent ? editingEvent.meta?.isPK : modalState.isPK}
                onConfirm={handleModalConfirm}
                onCancel={() => {
                    setModalState({ isOpen: false, type: '', team: '', label: '', isPK: false });
                    setEditingEvent(null);
                }}
                label={editingEvent ? editingEvent.label : modalState.label}
                onLabelChange={(label) => {
                    if (editingEvent) {
                        setEditingEvent({ ...editingEvent, label });
                    } else {
                        setModalState({ ...modalState, label });
                    }
                }}
                onPKChange={(isPK) => {
                    if (editingEvent) {
                        setEditingEvent({ ...editingEvent, meta: { ...editingEvent.meta, isPK } });
                    } else {
                        setModalState({ ...modalState, isPK });
                    }
                }}
            />

            {showStreamlinedExport && (
                <StreamlinedExportModal
                    matchData={{ opponentName, myScore, opponentScore, events, timestamp: Date.now(), finalTime: displayTime }}
                    onClose={() => {
                        setShowStreamlinedExport(false);
                        // Don't automatically finish game - let user choose
                    }}
                    formatTime={formatTime}
                    formatTimeForExport={formatTimeForExport}
                />
            )}

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
            
            <EndGameConfirmation
                isOpen={showEndConfirmation}
                onClose={() => setShowEndConfirmation(false)}
                onConfirm={handleConfirmEnd}
                gameData={{
                  opponentName,
                  myScore,
                  opponentScore,
                  events,
                  duration: displayTime
                }}
                onExport={handleExport}
            />
        </Shell>
    );
};
