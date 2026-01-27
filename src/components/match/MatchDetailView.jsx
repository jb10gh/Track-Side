import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Save, X, Plus, Trash2, FileDown, Share2, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { copyEnhancedSummary, downloadEnhancedCSV } from '../../utils/export';
import { EditableEventItem } from './EditableEventItem';
import { SimplifiedExport } from '../game/SimplifiedExport';

export const MatchDetailView = ({ matchId, onClose }) => {
    const { 
        history, 
        updateHistoricalEvent, 
        deleteHistoricalEvent, 
        updateMatchMetadata,
        addHistoricalEvent,
        formatTime,
        formatTimeForExport
    } = useGameStore();
    
    const [isEditing, setIsEditing] = useState(false);
    const [editingMetadata, setEditingMetadata] = useState(false);
    const [metadata, setMetadata] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [showSimplifiedExport, setShowSimplifiedExport] = useState(false);
    
    const match = history.find(m => m.id === matchId);
    if (!match) return null;

    const handleSaveMetadata = () => {
        updateMatchMetadata(matchId, metadata);
        setEditingMetadata(false);
        setHasChanges(true);
    };

    const handleExportCopy = async () => {
        await copyEnhancedSummary(match, formatTime, formatTimeForExport);
    };

    const handleExportCSV = () => {
        downloadEnhancedCSV(match);
    };

    const handleEventUpdate = (eventId, updates) => {
        updateHistoricalEvent(matchId, eventId, updates);
        setHasChanges(true);
    };

    const handleEventDelete = (eventId) => {
        deleteHistoricalEvent(matchId, eventId);
        setHasChanges(true);
    };

    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [newEventData, setNewEventData] = useState({
        type: 'goal',
        team: 'us',
        label: '',
        gameTime: '0:00'
    });

    const handleAddEvent = () => {
        if (newEventData.label.trim()) {
            addHistoricalEvent(matchId, newEventData);
            setNewEventData({ type: 'goal', team: 'us', label: '', gameTime: '0:00' });
            setShowAddEventModal(false);
            setHasChanges(true);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-black border-b-2 border-[var(--trackside-hot-pink)] p-4 z-10" style={{ boxShadow: 'var(--shadow-hot-pink)' }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-lg border border-[var(--trackside-hot-pink)] hover:bg-[var(--trackside-hot-pink)] transition-colors text-white"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white" style={{ textShadow: 'var(--glow-hot-pink)' }}>vs {match.opponentName}</h1>
                            <p className="text-sm text-[var(--text-secondary)]">
                                {new Date(match.timestamp).toLocaleDateString()}
                                {match.lastEdited && ' • Edited'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-gradient-to-r from-[var(--trackside-hot-pink)] to-[var(--trackside-electric-pink)] text-white rounded-lg flex items-center gap-2 hover:from-[var(--trackside-neon-pink)] hover:to-[var(--trackside-hot-pink)] transition-all transform hover:scale-105"
                                    style={{ boxShadow: 'var(--shadow-hot-pink)' }}
                                >
                                    <Edit3 size={16} />
                                    Edit Match
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditingMetadata(false);
                                    }}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (metadata.opponentName && metadata.opponentName !== match.opponentName) {
                                            handleSaveMetadata();
                                        }
                                        setIsEditing(false);
                                        setEditingMetadata(false);
                                    }}
                                    className="px-4 py-2 bg-gradient-to-r from-[var(--trackside-hot-pink)] to-[var(--trackside-electric-pink)] text-white rounded-lg flex items-center gap-2 hover:from-[var(--trackside-neon-pink)] hover:to-[var(--trackside-hot-pink)] transition-all transform hover:scale-105"
                                    style={{ boxShadow: 'var(--shadow-hot-pink)' }}
                                >
                                    <Save size={16} />
                                    Save
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Match Score */}
            <div className="p-6 text-center bg-black border-2 border-[var(--trackside-hot-pink)]" style={{ boxShadow: 'var(--shadow-hot-pink)' }}>
                <div className="text-6xl font-black mb-2">
                    <span className="text-[var(--team-our-primary)]" style={{ textShadow: 'var(--team-our-shadow)' }}>{match.myScore}</span>
                    <span className="mx-4 text-white">-</span>
                    <span className="text-[var(--team-their-primary)]" style={{ textShadow: 'var(--team-their-shadow)' }}>{match.opponentScore}</span>
                </div>
                {isEditing ? (
                    <div className="flex items-center justify-center gap-2">
                        <input
                            type="text"
                            defaultValue={match.opponentName}
                            onChange={(e) => setMetadata({ ...metadata, opponentName: e.target.value })}
                            className="text-xl font-semibold bg-black border-2 border-[var(--trackside-hot-pink)] rounded px-3 py-2 text-center text-white placeholder-gray-500"
                            placeholder="Opponent name"
                            style={{ boxShadow: 'var(--shadow-hot-pink)' }}
                        />
                    </div>
                ) : (
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">vs {match.opponentName}</p>
                )}
                <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{match.events.length} events</span>
                    <span>•</span>
                    <span>Duration: {formatTime(match.finalTime) || 'Unknown'}</span>
                </div>
            </div>

            {/* Events List */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Events ({match.events.length})
                    </h2>
                    {isEditing && (
                        <button 
                            onClick={() => setShowAddEventModal(true)}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            title="Add Event"
                        >
                            <Plus size={18} />
                        </button>
                    )}
                </div>
                
                {match.events.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>No events recorded</p>
                        {isEditing && (
                            <p className="text-sm mt-2">Tap the + button to add an event</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {match.events.map((event) => (
                            <EditableEventItem
                                key={event.id}
                                event={event}
                                isEditing={isEditing}
                                onUpdate={(updates) => handleEventUpdate(event.id, updates)}
                                onDelete={() => handleEventDelete(event.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Export Options */}
            <div className="sticky bottom-0 bg-black border-t-2 border-[var(--trackside-hot-pink)] p-4" style={{ boxShadow: 'var(--shadow-hot-pink)' }}>
                <div className="flex gap-2">
                    <button 
                        onClick={handleExportCopy}
                        className="flex-1 p-3 bg-black border-2 border-[var(--trackside-hot-pink)] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--trackside-hot-pink)] transition-colors"
                        style={{ boxShadow: 'var(--shadow-hot-pink)' }}
                    >
                        <Share2 size={18} />
                        Copy Summary
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        className="flex-1 p-3 bg-black border-2 border-[var(--trackside-hot-pink)] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[var(--trackside-hot-pink)] transition-colors"
                        style={{ boxShadow: 'var(--shadow-hot-pink)' }}
                    >
                        <FileDown size={18} />
                        Download CSV
                    </button>
                    <button 
                        onClick={() => setShowSimplifiedExport(true)}
                        className="flex-1 p-3 bg-gradient-to-r from-[var(--trackside-hot-pink)] to-[var(--trackside-electric-pink)] text-white rounded-lg flex items-center justify-center gap-2 hover:from-[var(--trackside-neon-pink)] hover:to-[var(--trackside-hot-pink)] transition-all transform hover:scale-105"
                        style={{ boxShadow: 'var(--shadow-hot-pink)' }}
                    >
                        <Share2 size={18} />
                        Share Options
                    </button>
                </div>
                
                {hasChanges && (
                    <div className="mt-2 text-center text-sm text-[var(--trackside-hot-pink)]">
                        ✓ Changes saved
                    </div>
                )}
            </div>

            {/* Add Event Modal */}
            {showAddEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-black border-2 border-[var(--trackside-hot-pink)] rounded-xl p-6 max-w-md w-full" style={{ boxShadow: 'var(--shadow-hot-pink)' }}>
                        <h3 className="text-lg font-bold mb-4 text-white" style={{ textShadow: 'var(--glow-hot-pink)' }}>Add New Event</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Event Type
                                </label>
                                <select
                                    value={newEventData.type}
                                    onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value })}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="goal">Goal</option>
                                    <option value="penalty">Penalty</option>
                                    <option value="card">Card</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Team
                                </label>
                                <select
                                    value={newEventData.team}
                                    onChange={(e) => setNewEventData({ ...newEventData, team: e.target.value })}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="us">Us</option>
                                    <option value="them">Them</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Player Name
                                </label>
                                <input
                                    type="text"
                                    value={newEventData.label}
                                    onChange={(e) => setNewEventData({ ...newEventData, label: e.target.value })}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Enter player name"
                                    autoFocus
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Game Time
                                </label>
                                <input
                                    type="text"
                                    value={newEventData.gameTime}
                                    onChange={(e) => setNewEventData({ ...newEventData, gameTime: e.target.value })}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="0:00"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowAddEventModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEvent}
                                disabled={!newEventData.label.trim()}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add Event
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Simplified Export */}
            {showSimplifiedExport && (
                <SimplifiedExport
                    matchData={match}
                    onClose={() => setShowSimplifiedExport(false)}
                />
            )}
        </div>
    );
};
