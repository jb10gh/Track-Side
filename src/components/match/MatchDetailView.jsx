import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Save, X, Plus, Trash2, FileDown, Share2, ArrowLeft } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { copyEnhancedSummary, downloadEnhancedCSV } from '../../utils/export';
import { EditableEventItem } from './EditableEventItem';
import { SimplifiedExport } from '../game/SimplifiedExport';
import { useTheme, useTeamTheme } from '../../theme/useTheme';

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
    
    const { createModalStyles, createButtonStyles, getSpacingValue } = useTheme();
    const ourTeam = useTeamTheme('our');
    const theirTeam = useTeamTheme('their');

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
        <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: 'var(--bg-primary)' }}>
            {/* Header */}
            <div 
                className="sticky top-0 p-4 z-10"
                style={{
                    ...createModalStyles(),
                    padding: getSpacingValue('md'),
                    position: 'sticky',
                    top: 0,
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-lg transition-colors"
                            style={{
                                border: 'var(--border-primary)',
                                color: 'var(--text-primary)',
                                backgroundColor: 'transparent',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--brand-primary)';
                                e.target.style.color = 'var(--bg-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = 'var(--text-primary)';
                            }}
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 
                                className="text-2xl font-bold"
                                style={{
                                    color: 'var(--text-primary)',
                                    fontWeight: 'var(--font-bold)',
                                    fontSize: 'var(--text-2xl)',
                                    textShadow: 'var(--glow-brand)',
                                }}
                            >
                                vs {match.opponentName}
                            </h1>
                            <p 
                                className="text-sm"
                                style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: 'var(--text-sm)',
                                }}
                            >
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
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                                    style={{
                                        ...createButtonStyles('primary'),
                                        padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`,
                                    }}
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
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    style={{
                                        ...createButtonStyles('secondary'),
                                        padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`,
                                    }}
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
                                    className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                                    style={{
                                        ...createButtonStyles('primary'),
                                        padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`,
                                    }}
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
            <div 
                className="p-6 text-center rounded-xl"
                style={{
                    ...createCardStyles(),
                    padding: getSpacingValue('lg'),
                    textAlign: 'center',
                }}
            >
                <div 
                    className="text-6xl font-black mb-2"
                    style={{
                        fontSize: 'var(--text-6xl)',
                        fontWeight: 'var(--font-black)',
                        marginBottom: getSpacingValue('sm'),
                    }}
                >
                    <span 
                        style={{ 
                            color: ourTeam.colors.primary, 
                            textShadow: ourTeam.colors.shadow 
                        }}
                    >
                        {match.myScore}
                    </span>
                    <span 
                        className="mx-4"
                        style={{ 
                            color: 'var(--text-primary)' 
                        }}
                    >
                        -
                    </span>
                    <span 
                        style={{ 
                            color: theirTeam.colors.primary, 
                            textShadow: theirTeam.colors.shadow 
                        }}
                    >
                        {match.opponentScore}
                    </span>
                </div>
                {isEditing ? (
                    <div className="flex items-center justify-center gap-2" style={{ gap: getSpacingValue('sm') }}>
                        <input
                            type="text"
                            defaultValue={match.opponentName}
                            onChange={(e) => setMetadata({ ...metadata, opponentName: e.target.value })}
                            className="text-xl font-semibold rounded px-3 py-2 text-center"
                            style={{
                                backgroundColor: 'var(--bg-surface)',
                                border: 'var(--border-primary)',
                                color: 'var(--text-primary)',
                                borderRadius: 'var(--radius-md)',
                                padding: `${getSpacingValue('sm')} ${getSpacingValue('md')}`,
                                boxShadow: 'var(--shadow-button)',
                            }}
                            placeholder="Opponent name"
                        />
                    </div>
                ) : (
                    <p 
                        className="text-xl font-semibold"
                        style={{
                            color: 'var(--text-primary)',
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-semibold)',
                        }}
                    >
                        vs {match.opponentName}
                    </p>
                )}
                <div 
                    className="flex items-center justify-center gap-4 mt-2 text-sm"
                    style={{
                        gap: getSpacingValue('md'),
                        marginTop: getSpacingValue('sm'),
                        color: 'var(--text-muted)',
                        fontSize: 'var(--text-sm)',
                    }}
                >
                    <span>{match.events.length} events</span>
                    <span>•</span>
                    <span>Duration: {formatTime(match.finalTime) || 'Unknown'}</span>
                </div>
            </div>

            {/* Events List */}
            <div className="p-4" style={{ padding: getSpacingValue('md') }}>
                <div className="flex items-center justify-between mb-4" style={{ marginBottom: getSpacingValue('lg') }}>
                    <h2 
                        className="text-xl font-bold"
                        style={{
                            color: 'var(--text-primary)',
                            fontSize: 'var(--text-xl)',
                            fontWeight: 'var(--font-bold)'
                        }}
                    >
                        Events ({match.events.length})
                    </h2>
                    {isEditing && (
                        <button 
                            onClick={() => setShowAddEventModal(true)}
                            className="p-2 rounded-lg transition-all"
                            style={{
                                backgroundColor: 'var(--status-success)',
                                color: 'var(--text-primary)',
                                borderRadius: 'var(--radius-lg)',
                                transition: 'var(--transition-normal)',
                            }}
                            title="Add Event"
                        >
                            <Plus size={18} />
                        </button>
                    )}
                </div>
                
                {match.events.length === 0 ? (
                    <div 
                        className="text-center py-12"
                        style={{ padding: `${getSpacingValue('3xl')} 0` }}
                    >
                        <p 
                            style={{
                                color: 'var(--text-disabled)',
                            fontSize: 'var(--text-base)',
                            marginBottom: getSpacingValue('sm'),
                            textAlign: 'center',
                            }}
                        >
                            No events recorded
                        </p>
                        {isEditing && (
                            <p 
                                className="text-sm mt-2"
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    marginTop: getSpacingValue('sm'),
                                    textAlign: 'center',
                                }}
                            >
                                Tap the + button to add an event
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2" style={{ gap: getSpacingValue('md') }}>
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
            <div 
                className="sticky bottom-0 p-4"
                style={{
                    ...createModalStyles(),
                    position: 'sticky',
                    bottom: 0,
                    padding: getSpacingValue('md'),
                }}
            >
                <div className="flex gap-2" style={{ gap: getSpacingValue('sm') }}>
                    <button 
                        onClick={handleExportCopy}
                        className="flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                        style={{
                            ...createButtonStyles('secondary'),
                            padding: getSpacingValue('sm'),
                        }}
                    >
                        <Share2 size={18} />
                        Copy Summary
                    </button>
                    <button 
                        onClick={handleExportCSV}
                        className="flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                        style={{
                            ...createButtonStyles('secondary'),
                            padding: getSpacingValue('sm'),
                        }}
                    >
                        <FileDown size={18} />
                        Download CSV
                    </button>
                    <button 
                        onClick={() => setShowSimplifiedExport(true)}
                        className="flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                        style={{
                            ...createButtonStyles('primary'),
                            padding: getSpacingValue('sm'),
                        }}
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
