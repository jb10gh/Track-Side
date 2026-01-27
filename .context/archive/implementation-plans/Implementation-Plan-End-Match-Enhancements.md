# Implementation Plan: End Match Flow Enhancements

## Overview
This document outlines the technical implementation plan for ADR-010 (Forced Export Decision) and ADR-011 (Post-Match Inline Editing), providing a comprehensive roadmap for enhancing the end match experience.

## Current State Analysis

### Existing Flow
1. **Active Game** → User clicks "End" → "Finish?" confirmation → `finishGame()` → Navigate to Home
2. **Match Archive** → Read-only match cards with delete functionality only
3. **Export Options** → Optional copy/CSV buttons in active game header (easily missed)

### Pain Points Identified
- **Data Loss Risk**: Users forget to export, lose data on browser clear
- **No Post-Match Editing**: Cannot fix typos or add details after completion
- **Limited Match Details**: Basic score display only in archive
- **No Review Process**: Match ends without data verification opportunity

## Phase 1: Forced Export Decision (ADR-010)

### 1.1 Component Creation: `ExportDecisionModal`

```jsx
// src/components/game/ExportDecisionModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, FileDown, AlertTriangle, X } from 'lucide-react';

export const ExportDecisionModal = ({ 
  isOpen, 
  gameData, 
  onCopy, 
  onDownload, 
  onSkip,
  defaultAction = 'copy' 
}) => {
  const [selectedAction, setSelectedAction] = useState(defaultAction);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    setIsProcessing(true);
    setSelectedAction(action);
    
    switch (action) {
      case 'copy':
        await onCopy();
        break;
      case 'download':
        await onDownload();
        break;
      case 'skip':
        await onSkip();
        break;
    }
    
    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Save Your Match Data</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose how to preserve your match statistics
              </p>
            </div>

            {/* Match Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-black mb-2">
                  <span className="text-green-600">{gameData.myScore}</span>
                  <span className="mx-2">-</span>
                  <span className="text-red-600">{gameData.opponentScore}</span>
                </div>
                <p className="font-semibold">vs {gameData.opponentName}</p>
                <p className="text-sm text-gray-500">{gameData.events.length} events recorded</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleAction('copy')}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedAction === 'copy' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ClipboardCheck size={20} className="text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold">Copy Summary</div>
                    <div className="text-sm text-gray-500">Quick copy to clipboard</div>
                  </div>
                </div>
                {selectedAction === 'copy' && (
                  <div className="w-4 h-4 rounded-full bg-blue-600" />
                )}
              </button>

              <button
                onClick={() => handleAction('download')}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedAction === 'download' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileDown size={20} className="text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold">Download CSV</div>
                    <div className="text-sm text-gray-500">Save to device</div>
                  </div>
                </div>
                {selectedAction === 'download' && (
                  <div className="w-4 h-4 rounded-full bg-green-600" />
                )}
              </button>

              <button
                onClick={() => handleAction('skip')}
                disabled={isProcessing}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedAction === 'skip' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-red-600" />
                  <div className="text-left">
                    <div className="font-semibold">Skip Export</div>
                    <div className="text-sm text-red-500">Data may be lost</div>
                  </div>
                </div>
                {selectedAction === 'skip' && (
                  <div className="w-4 h-4 rounded-full bg-red-600" />
                )}
              </button>
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="text-center text-sm text-gray-500">
                Processing...
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### 1.2 Integration with ActiveGame Components

```jsx
// Updated handleFinish in ActiveGame.jsx
const [showExportModal, setShowExportModal] = useState(false);

const handleFinish = () => {
    setShowExportModal(true);
};

const handleCopyAndFinish = async () => {
    await copySummary();
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

// Add modal to render
<ExportDecisionModal
  isOpen={showExportModal}
  gameData={{ opponentName, myScore, opponentScore, events }}
  onCopy={handleCopyAndFinish}
  onDownload={handleDownloadAndFinish}
  onSkip={handleSkipAndFinish}
/>
```

### 1.3 Enhanced Export Functions

```javascript
// Enhanced utils/export.js
const generateEnhancedCSVContent = (game) => {
    const headers = [
        'Match ID',
        'Date',
        'Opponent',
        'Final Score',
        'Event Timestamp',
        'Game Time',
        'Event Type',
        'Team',
        'Player',
        'Is Penalty',
        'Notes'
    ];
    
    const matchInfo = [
        game.id || crypto.randomUUID(),
        new Date(game.timestamp || Date.now()).toLocaleString(),
        game.opponentName,
        `${game.myScore}-${game.opponentScore}`,
        '', '', '', '', '', '', ''
    ];
    
    const eventRows = game.events.map(event => [
        '', // Match ID (empty for events)
        '', // Date (empty for events)
        '', // Opponent (empty for events)
        '', // Final Score (empty for events)
        new Date(event.timestamp).toLocaleString(),
        event.gameTime,
        event.type,
        event.team,
        event.label || '',
        event.meta?.isPK ? 'Yes' : 'No',
        event.meta?.notes || ''
    ]);
    
    return [headers, matchInfo, ...eventRows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
};

const generateEnhancedSummary = (game) => {
    const summary = [
        `📊 MATCH SUMMARY`,
        `═══════════════════════════`,
        `🏆 Match: Us vs ${game.opponentName}`,
        `⚡ Final Score: ${game.myScore}-${game.opponentScore}`,
        `📅 Date: ${new Date(game.timestamp || Date.now()).toLocaleDateString()}`,
        `⏱️ Duration: ${game.finalTime || 'Unknown'}`,
        `📝 Events: ${game.events.length} total`,
        '',
        `📋 EVENT TIMELINE`,
        `═══════════════════════════`,
        ...game.events.slice().reverse().map(e => {
            const icon = e.type === 'goal' ? '⚽' : e.type === 'penalty' ? '🟨' : '📝';
            const team = e.team === 'us' ? '🔵' : '🔴';
            const pk = e.meta?.isPK ? ' (PK)' : '';
            return `${icon} [${formatTime(e.gameTime)}] ${team} ${e.label || 'Unnamed'}${pk}`;
        }),
        '',
        `Generated by Sideline Stats App`
    ].join('\n');
    
    return summary;
};
```

## Phase 2: Post-Match Inline Editing (ADR-011)

### 2.1 Store Extensions for Historical Editing

```javascript
// Enhanced store/gameStore.js
const updateHistoricalMatch = (set, get) => ({
    // New actions for historical match editing
    updateHistoricalEvent: (matchId, eventId, updates) => {
        set((state) => ({
            history: state.history.map(match => {
                if (match.id !== matchId) return match;
                
                const updatedEvents = match.events.map(event =>
                    event.id === eventId ? { ...event, ...updates } : event
                );
                
                // Recalculate scores based on updated events
                const ourGoals = updatedEvents.filter(e => 
                    e.type === EVENT_TYPES.GOAL && e.team === TEAMS.US
                ).length;
                const theirGoals = updatedEvents.filter(e => 
                    e.type === EVENT_TYPES.GOAL && e.team === TEAMS.THEM
                ).length;
                
                return {
                    ...match,
                    events: updatedEvents,
                    myScore: ourGoals,
                    opponentScore: theirGoals,
                    lastEdited: Date.now()
                };
            })
        }));
    },
    
    deleteHistoricalEvent: (matchId, eventId) => {
        set((state) => ({
            history: state.history.map(match => {
                if (match.id !== matchId) return match;
                
                const eventToDelete = match.events.find(e => e.id === eventId);
                if (!eventToDelete) return match;
                
                const updatedEvents = match.events.filter(e => e.id !== eventId);
                
                // Recalculate scores
                let ourGoals = match.myScore;
                let theirGoals = match.opponentScore;
                
                if (eventToDelete.type === EVENT_TYPES.GOAL) {
                    if (eventToDelete.team === TEAMS.US) {
                        ourGoals = Math.max(0, ourGoals - 1);
                    } else {
                        theirGoals = Math.max(0, theirGoals - 1);
                    }
                }
                
                return {
                    ...match,
                    events: updatedEvents,
                    myScore: ourGoals,
                    opponentScore: theirGoals,
                    lastEdited: Date.now()
                };
            })
        }));
    },
    
    updateMatchMetadata: (matchId, metadata) => {
        set((state) => ({
            history: state.history.map(match =>
                match.id === matchId 
                    ? { ...match, ...metadata, lastEdited: Date.now() }
                    : match
            )
        }));
    },
    
    addHistoricalEvent: (matchId, eventData) => {
        set((state) => ({
            history: state.history.map(match => {
                if (match.id !== matchId) return match;
                
                const newEvent = {
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                    ...eventData
                };
                
                const updatedEvents = [newEvent, ...match.events];
                
                // Recalculate scores
                let ourGoals = match.myScore;
                let theirGoals = match.opponentScore;
                
                if (newEvent.type === EVENT_TYPES.GOAL) {
                    if (newEvent.team === TEAMS.US) {
                        ourGoals++;
                    } else {
                        theirGoals++;
                    }
                }
                
                return {
                    ...match,
                    events: updatedEvents,
                    myScore: ourGoals,
                    opponentScore: theirGoals,
                    lastEdited: Date.now()
                };
            })
        }));
    }
});
```

### 2.2 Match Detail View Component

```jsx
// src/components/match/MatchDetailView.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Save, X, Plus, Trash2, FileDown, Share2 } from 'lucide-react';
import { EditableEventItem } from './EditableEventItem';
import { useGameStore } from '../../store/gameStore';

export const MatchDetailView = ({ matchId, onClose }) => {
    const { history, updateHistoricalEvent, deleteHistoricalEvent, updateMatchMetadata } = useGameStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editingMetadata, setEditingMetadata] = useState(false);
    const [metadata, setMetadata] = useState({});
    
    const match = history.find(m => m.id === matchId);
    if (!match) return null;

    const handleSaveMetadata = () => {
        updateMatchMetadata(matchId, metadata);
        setEditingMetadata(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2">
                            <X size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">vs {match.opponentName}</h1>
                            <p className="text-sm text-gray-500">
                                {new Date(match.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setEditingMetadata(true)}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                                >
                                    <Edit3 size={18} />
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                                >
                                    <Edit3 size={16} />
                                    Edit Match
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
                            >
                                <Save size={16} />
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Match Score */}
            <div className="p-6 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div className="text-6xl font-black mb-2">
                    <span className="text-blue-600">{match.myScore}</span>
                    <span className="mx-4 text-gray-400">-</span>
                    <span className="text-red-600">{match.opponentScore}</span>
                </div>
                {editingMetadata ? (
                    <input
                        type="text"
                        defaultValue={match.opponentName}
                        onChange={(e) => setMetadata({ ...metadata, opponentName: e.target.value })}
                        className="text-xl font-semibold bg-white dark:bg-gray-800 border rounded px-2 py-1"
                    />
                ) : (
                    <p className="text-xl font-semibold">vs {match.opponentName}</p>
                )}
            </div>

            {/* Events List */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Events ({match.events.length})</h2>
                    {isEditing && (
                        <button className="p-2 bg-green-600 text-white rounded-lg">
                            <Plus size={18} />
                        </button>
                    )}
                </div>
                
                <div className="space-y-2">
                    {match.events.map((event) => (
                        <EditableEventItem
                            key={event.id}
                            event={event}
                            isEditing={isEditing}
                            onUpdate={(updates) => updateHistoricalEvent(matchId, event.id, updates)}
                            onDelete={() => deleteHistoricalEvent(matchId, event.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Export Options */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex gap-2">
                    <button className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center gap-2">
                        <Share2 size={18} />
                        Copy Summary
                    </button>
                    <button className="flex-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center gap-2">
                        <FileDown size={18} />
                        Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
};
```

### 2.3 Editable Event Item Component

```jsx
// src/components/match/EditableEventItem.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Save, X, Clock } from 'lucide-react';

export const EditableEventItem = ({ event, isEditing, onUpdate, onDelete }) => {
    const [isEditingEvent, setIsEditingEvent] = useState(false);
    const [editData, setEditData] = useState({
        label: event.label || '',
        gameTime: event.gameTime,
        type: event.type,
        team: event.team
    });

    const handleSave = () => {
        onUpdate(editData);
        setIsEditingEvent(false);
    };

    const handleCancel = () => {
        setEditData({
            label: event.label || '',
            gameTime: event.gameTime,
            type: event.type,
            team: event.team
        });
        setIsEditingEvent(false);
    };

    return (
        <motion.div
            layout
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500 font-mono">
                        {editData.gameTime}
                    </div>
                    
                    {isEditingEvent ? (
                        <div className="flex items-center gap-2">
                            <select
                                value={editData.type}
                                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="goal">Goal</option>
                                <option value="penalty">Penalty</option>
                                <option value="card">Card</option>
                            </select>
                            
                            <select
                                value={editData.team}
                                onChange={(e) => setEditData({ ...editData, team: e.target.value })}
                                className="border rounded px-2 py-1 text-sm"
                            >
                                <option value="us">Us</option>
                                <option value="them">Them</option>
                            </select>
                            
                            <input
                                type="text"
                                value={editData.label}
                                onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                                placeholder="Player name"
                                className="border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    ) : (
                        <div>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                event.team === 'us' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {event.type.toUpperCase()}
                            </span>
                            <span className="ml-2 font-medium">{event.label || 'Unnamed'}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isEditing && !isEditingEvent && (
                        <>
                            <button
                                onClick={() => setIsEditingEvent(true)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                    
                    {isEditingEvent && (
                        <>
                            <button
                                onClick={handleSave}
                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                            >
                                <X size={16} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
```

## Implementation Timeline

### Week 1: Export Decision Modal
- [ ] Create `ExportDecisionModal` component
- [ ] Integrate with `ActiveGame.jsx` and `ActiveGamePro.jsx`
- [ ] Enhance export functions with better formatting
- [ ] Test mobile responsiveness and accessibility

### Week 2: Store Extensions
- [ ] Add historical editing functions to `gameStore.js`
- [ ] Implement score recalculation logic
- [ ] Add edit history tracking
- [ ] Test data integrity and edge cases

### Week 3: Match Detail View
- [ ] Create `MatchDetailView` component
- [ ] Implement `EditableEventItem` component
- [ ] Add metadata editing functionality
- [ ] Integrate with existing match archive

### Week 4: Integration & Testing
- [ ] Update `MatchCard` to open detail view
- [ ] Add routing for match detail pages
- [ ] Comprehensive testing of all workflows
- [ ] Performance optimization and bug fixes

## Success Metrics

### Quantitative
- **Export Rate**: 95% of matches exported (vs current ~30%)
- **Edit Adoption**: 40% of matches edited post-completion
- **Time to Export**: < 3 seconds from finish to export
- **Data Accuracy**: 90% reduction in data correction requests

### Qualitative
- **User Confidence**: Increased trust in data backup
- **Professional Workflow**: Enhanced coach/statistician experience
- **Error Recovery**: Easy correction of match data
- **Data Quality**: Higher quality exports and reports

---

*This implementation plan provides a comprehensive roadmap for transforming the end match experience from a basic completion flow into a professional-grade data management system.*
