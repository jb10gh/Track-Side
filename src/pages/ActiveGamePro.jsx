import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Share2, X, FileDown, Settings, ChevronDown } from 'lucide-react';
import { useGameStoreClean, EVENT_TYPES, TEAMS } from '../store/gameStoreClean';
import { Shell } from '../components/layout/Shell';
import { GameModal } from '../components/game/GameModal';
import { ExportDecisionModal } from '../components/game/ExportDecisionModal';
import { GestureDeckOptimized } from '../components/game/GestureDeckOptimized';
import { FloatingHUD } from '../components/game/FloatingHUD';
import { SwipeStream } from '../components/game/SwipeStream';
import { useGameTimer } from '../hooks/useGameTimer';
import { downloadCSV, copyEnhancedSummary } from '../utils/export';

export const ActiveGamePro = () => {
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
        addEvent,
        undoLastEvent,
        finishGame,
        updateEvent,
    } = useGameStoreClean();

    const displayTime = useGameTimer();
    const [modalState, setModalState] = useState({ isOpen: false, type: '', team: '' });
    const [editingEvent, setEditingEvent] = useState(null);
    const [copied, setCopied] = useState(false);
    const [confirmingFinish, setConfirmingFinish] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    if (!activeGameId) return <Navigate to="/" />;

    // Memoize action handler
    const handleAction = useCallback((type, team) => {
        setModalState({ isOpen: true, type, team });
    }, []);

    const handleModalConfirm = useCallback((label, meta) => {
        if (editingEvent) {
            updateEvent(editingEvent.id, { label, meta });
            setEditingEvent(null);
        } else {
            addEvent(modalState.type, modalState.team, label, meta);
            setModalState({ isOpen: false, type: '', team: '' });
        }
    }, [editingEvent, modalState, addEvent, updateEvent]);

    const handleFinish = useCallback(() => {
        setShowExportModal(true);
    }, []);

    const handleCopyAndFinish = useCallback(async () => {
        await copyEnhancedSummary({ opponentName, myScore, opponentScore, events }, formatTime, formatTimeForExport);
        finishGame();
        navigate('/');
    }, [finishGame, navigate]);

    const handleDownloadAndFinish = useCallback(async () => {
        downloadCSV({ opponentName, myScore, opponentScore, events });
        finishGame();
        navigate('/');
    }, [finishGame, navigate, opponentName, myScore, opponentScore, events]);

    const handleSkipAndFinish = useCallback(() => {
        finishGame();
        navigate('/');
    }, [finishGame, navigate]);

    // Memoize copy summary function
    const copySummary = useCallback(() => {
        const summary = [
            `Match: Us vs ${opponentName}`,
            `Final: ${myScore}-${opponentScore}`,
            `------------------`,
            ...events.slice().reverse().map(e => {
                const typeStr = e.meta?.isPK ? 'Goal (PK)' : e.type.charAt(0).toUpperCase() + e.type.slice(1);
                return `[${formatTime(e.gameTime)}] ${typeStr} (${e.team === TEAMS.us ? 'Us' : 'Them'}) - ${e.label || 'Unnamed'}`;
            })
        ].join('\n');

        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [opponentName, myScore, opponentScore, events, formatTime]);

    // Memoize header actions
    const HeaderActions = useMemo(() => (
        <div className="flex items-center gap-2">
            {!confirmingFinish ? (
                <>
                    <button 
                        onClick={copySummary} 
                        className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:bg-white/20 transition-colors"
                        aria-label="Copy summary"
                    >
                        {copied ? (
                            <ClipboardCheck size={18} className="text-green-400" />
                        ) : (
                            <Share2 size={18} className="text-white/80" />
                        )}
                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline text-white/80">
                            Copy
                        </span>
                    </button>
                    
                    <button
                        onClick={() => downloadCSV({ opponentName, myScore, opponentScore, events })}
                        className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:bg-white/20 transition-colors"
                        aria-label="Download CSV"
                    >
                        <FileDown size={18} className="text-white/80" />
                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline text-white/80">
                            CSV
                        </span>
                    </button>
                    
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:bg-white/20 transition-colors"
                        aria-label="Settings"
                    >
                        <Settings size={18} className="text-white/80" />
                    </button>
                    
                    <button 
                        onClick={() => setConfirmingFinish(true)} 
                        className="p-2 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">End</span>
                    </button>
                </>
            ) : (
                <>
                    <button 
                        onClick={() => setConfirmingFinish(false)} 
                        className="p-2 text-white/60 hover:text-white/80 transition-colors"
                    >
                        <X size={18} />
                    </button>
                    <button 
                        onClick={handleFinish} 
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <span className="text-xs font-black uppercase tracking-widest">Finish?</span>
                    </button>
                </>
            )}
        </div>
    ), [confirmingFinish, copied, showSettings, copySummary, opponentName, myScore, opponentScore, events, handleFinish]);

    // Memoize game stats
    const gameStats = useMemo(() => {
        const ourGoals = events.filter(e => e.type === EVENT_TYPES.goal && e.team === TEAMS.us).length;
        const theirGoals = events.filter(e => e.type === EVENT_TYPES.goal && e.team === TEAMS.them).length;
        const totalEvents = events.length;
        
        return { ourGoals, theirGoals, totalEvents };
    }, [events]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-black/20" />
            <div className="fixed inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-96 h-96 rounded-full bg-white/5"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            x: [0, Math.random() * 200 - 100],
                            y: [0, Math.random() * 200 - 100],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 20,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <Shell title={`vs ${opponentName}`} headerAction={HeaderActions}>
                <div className="relative z-10">
                    {/* Game Stats Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-white/70 text-xs uppercase tracking-wider mb-1">Goals</div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-green-400">{gameStats.ourGoals}</span>
                                        <span className="text-white/50">-</span>
                                        <span className="text-2xl font-bold text-red-400">{gameStats.theirGoals}</span>
                                    </div>
                                </div>
                                
                                <div className="text-center">
                                    <div className="text-white/70 text-xs uppercase tracking-wider mb-1">Events</div>
                                    <div className="text-xl font-bold text-white/90">{gameStats.totalEvents}</div>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <div className="text-white/70 text-xs uppercase tracking-wider mb-1">Time</div>
                                <div className="text-xl font-mono font-bold text-white/90">{formatTime(displayTime)}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Settings Panel */}
                    <AnimatePresence>
                        {showSettings && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-white/90 font-semibold">Game Settings</h3>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="text-white/60 hover:text-white/80"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70 text-sm">Sound Effects</span>
                                        <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70 text-sm">Haptic Feedback</span>
                                        <button className="w-12 h-6 bg-blue-500 rounded-full relative">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/70 text-sm">Auto-save</span>
                                        <button className="w-12 h-6 bg-gray-500 rounded-full relative">
                                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Gesture Deck */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <GestureDeckOptimized onAction={handleAction} />
                        </motion.div>

                        {/* Event Timeline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <SwipeStream
                                events={events}
                                onUndo={undoLastEvent}
                                onEdit={setEditingEvent}
                                formatTime={formatTime}
                                className="max-h-64 overflow-y-auto"
                            />
                        </motion.div>
                    </div>
                </div>
            </Shell>

            {/* Floating HUD */}
            <FloatingHUD
                myScore={myScore}
                opponentScore={opponentScore}
                displayTime={displayTime}
                isRunning={isRunning}
                onToggleTimer={toggleTimer}
                className="top-24 right-6"
            />

            {/* Game Modal */}
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

            {/* Export Decision Modal */}
            <ExportDecisionModal
                isOpen={showExportModal}
                gameData={{ opponentName, myScore, opponentScore, events }}
                onCopy={handleCopyAndFinish}
                onDownload={handleDownloadAndFinish}
                onSkip={handleSkipAndFinish}
            />
        </div>
    );
};
