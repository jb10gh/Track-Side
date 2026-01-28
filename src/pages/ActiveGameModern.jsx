import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ClipboardCheck, Share2, X, FileDown } from 'lucide-react';
import { useGameStore, EVENT_TYPES, TEAMS } from '../store/gameStore';
import { Shell } from '../components/layout/ShellModern';
import { GameModal } from '../components/game/GameModalModern';
import { StreamlinedExportModal } from '../components/game/StreamlinedExportModal';
import { TimerInvocationModal } from '../components/game/TimerInvocationModal';
import { ScoreBoard } from '../components/game/ScoreBoardMobile';
import { ActionGrid } from '../components/game/ActionGridMobile';
import { EventTimeline } from '../components/game/EventTimelineMobile';
import { useGameTimer } from '../hooks/useGameTimer';
import { downloadCSV, copyEnhancedSummary } from '../utils/export';
import { Button, IconButton } from '../components/ui';
import { EndGameConfirmation } from '../components/game/EndGameConfirmationModern';

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

    const copySummary = async () => {
        await copyEnhancedSummary({ opponentName, myScore, opponentScore, events }, formatTime, formatTimeForExport);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const HeaderActions = () => (
        <div className="flex items-center space-x-3">
            <IconButton 
                variant="ghost" 
                size="sm"
                onClick={copySummary}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
                {copied ? <ClipboardCheck size={16} /> : <Share2 size={16} />}
            </IconButton>
            
            <IconButton 
                variant="ghost" 
                size="sm"
                onClick={() => downloadCSV({ opponentName, myScore, opponentScore, events })}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
            >
                <FileDown size={16} />
            </IconButton>
            
            <Button 
                variant="danger" 
                size="sm"
                onClick={() => setShowEndConfirmation(true)}
                className="bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
                <span className="text-xs font-black uppercase tracking-wider">End Game</span>
            </Button>
        </div>
    );

    if (!activeGameId) {
        return <Navigate to="/" replace />;
    }

    return (
        <Shell title="Track Side Analytics" headerAction={<HeaderActions />}>
            {/* Game Info Header */}
            <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">
                            vs <span className="bg-gradient-to-br from-blue-500 to-cyan-600 bg-clip-text text-transparent">{opponentName}</span>
                        </h2>
                        <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
                            <span>Match in Progress</span>
                            <span>•</span>
                            <span>{events.length} events</span>
                            <span>•</span>
                            <span className={isRunning ? "text-emerald-400" : "text-slate-500"}>
                                {isRunning ? "Live" : "Not Started"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <ScoreBoard 
                    myScore={myScore} 
                    opponentScore={opponentScore} 
                    displayTime={displayTime} 
                    isRunning={isRunning} 
                    onToggleTimer={toggleTimer} 
                />

                <ActionGrid onAction={handleAction} isTimerRunning={isRunning} />

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
