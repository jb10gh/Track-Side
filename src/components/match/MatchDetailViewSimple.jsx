import React, { useState } from 'react';
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
        console.log('Updating event:', eventId, updates);
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black">
            {/* Header */}
            <div className="sticky top-0 p-4 z-10 bg-black border-b border-gray-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                vs {match.opponentName}
                            </h1>
                            <p className="text-sm text-gray-400">
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
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 bg-pink-600 hover:bg-pink-700 text-white"
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
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-gray-700 hover:bg-gray-600 text-white"
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
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 bg-pink-600 hover:bg-pink-700 text-white"
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
            <div className="p-6 text-center rounded-xl bg-gray-900 border border-gray-800 mx-4 mt-4">
                <div className="text-6xl font-black mb-2">
                    <span className="text-pink-500">
                        {match.myScore}
                    </span>
                    <span className="mx-4 text-white">
                        -
                    </span>
                    <span className="text-blue-500">
                        {match.opponentScore}
                    </span>
                </div>
                {isEditing ? (
                    <div className="flex items-center justify-center gap-2">
                        <input
                            type="text"
                            defaultValue={match.opponentName}
                            onChange={(e) => setMetadata({ ...metadata, opponentName: e.target.value })}
                            className="text-xl font-semibold rounded px-3 py-2 text-center bg-gray-800 border border-gray-700 text-white"
                            placeholder="Opponent name"
                        />
                    </div>
                ) : (
                    <p className="text-xl font-semibold text-white">
                        vs {match.opponentName}
                    </p>
                )}
                <div className="flex items-center justify-center gap-4 mt-2 text-sm text-gray-400">
                    <span>{match.events.length} events</span>
                    <span>•</span>
                    <span>Duration: {formatTime(match.finalTime) || 'Unknown'}</span>
                </div>
            </div>

            {/* Events List */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white">
                        Events ({match.events.length})
                    </h2>
                    {isEditing && (
                        <button 
                            onClick={() => setShowAddEventModal(true)}
                            className="p-2 rounded-lg transition-all bg-green-600 hover:bg-green-700 text-white"
                            title="Add Event"
                        >
                            <Plus size={18} />
                        </button>
                    )}
                </div>
                
                {match.events.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-2">
                            No events recorded
                        </p>
                        {isEditing && (
                            <p className="text-sm text-gray-400 mt-2">
                                Tap the + button to add an event
                            </p>
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
            <div className="sticky bottom-0 p-4 bg-black border-t border-gray-800">
                <div className="flex gap-2">
                    <button 
                        onClick={handleExportCopy}
                        className="flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        <Share2 size={18} />
                        Copy Summary
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        className="flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all bg-gray-700 hover:bg-gray-600 text-white"
                    >
                        <FileDown size={18} />
                        Download CSV
                    </button>
                    <button 
                        onClick={() => setShowSimplifiedExport(true)}
                        className="flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 bg-pink-600 hover:bg-pink-700 text-white"
                    >
                        <Share2 size={18} />
                        Share Options
                    </button>
                </div>
                
                {hasChanges && (
                    <div className="mt-2 text-center text-sm text-pink-500">
                        ✓ Changes saved
                    </div>
                )}
            </div>

            {/* Add Event Modal */}
            {showAddEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <div className="bg-black border-2 border-pink-600 rounded-xl p-6 max-w-md w-full">
                        <h3 className="text-lg font-bold mb-4 text-white">Add New Event</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Event Type
                                </label>
                                <select
                                    value={newEventData.type}
                                    onChange={(e) => setNewEventData({ ...newEventData, type: e.target.value })}
                                    className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white"
                                >
                                    <option value="goal">Goal</option>
                                    <option value="penalty">Penalty</option>
                                    <option value="card">Card</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Team
                                </label>
                                <select
                                    value={newEventData.team}
                                    onChange={(e) => setNewEventData({ ...newEventData, team: e.target.value })}
                                    className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white"
                                >
                                    <option value="us">Us</option>
                                    <option value="them">Them</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Player Name
                                </label>
                                <input
                                    type="text"
                                    value={newEventData.label}
                                    onChange={(e) => setNewEventData({ ...newEventData, label: e.target.value })}
                                    className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white"
                                    placeholder="Enter player name"
                                    autoFocus
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Game Time
                                </label>
                                <input
                                    type="text"
                                    value={newEventData.gameTime}
                                    onChange={(e) => setNewEventData({ ...newEventData, gameTime: e.target.value })}
                                    className="w-full border border-gray-600 rounded px-3 py-2 bg-gray-800 text-white"
                                    placeholder="0:00"
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowAddEventModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
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
