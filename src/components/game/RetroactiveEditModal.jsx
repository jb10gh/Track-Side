import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Clock, Target, Users } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { useGlobalRosterStore } from '../../store/globalRosterStore';

export const RetroactiveEditModal = ({ isOpen, onClose, event }) => {
    const { updateEvent, deleteEvent } = useGameStore();
    const { players, searchPlayers } = useGlobalRosterStore();
    
    const [editedEvent, setEditedEvent] = useState({
        type: event?.type || 'goal',
        team: event?.team || 'us',
        label: event?.label || '',
        gameTime: event?.gameTime || 0,
        meta: event?.meta || {}
    });
    
    const [searchQuery, setSearchQuery] = useState('');
    const [showPlayerSearch, setShowPlayerSearch] = useState(false);

    useEffect(() => {
        if (event) {
            setEditedEvent({
                type: event.type,
                team: event.team,
                label: event.label || '',
                gameTime: event.gameTime,
                meta: event.meta || {}
            });
        }
    }, [event]);

    const handleSave = () => {
        if (!event) return;
        
        const updates = {
            type: editedEvent.type,
            team: editedEvent.team,
            label: editedEvent.label,
            gameTime: editedEvent.gameTime,
            meta: editedEvent.meta
        };
        
        updateEvent(event.id, updates);
        onClose();
    };

    const handleDelete = () => {
        if (!event) return;
        deleteEvent(event.id);
        onClose();
    };

    const handlePlayerSelect = (player) => {
        setEditedEvent(prev => ({
            ...prev,
            label: player.name,
            meta: { ...prev.meta, player: player.name, number: player.number }
        }));
        setShowPlayerSearch(false);
        setSearchQuery('');
    };

    const formatGameTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const searchedPlayers = searchPlayers(searchQuery);

    if (!isOpen || !event) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Edit Event</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Event Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Event Type
                            </label>
                            <select
                                value={editedEvent.type}
                                onChange={(e) => setEditedEvent(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="goal">Goal</option>
                                <option value="penalty">Penalty</option>
                                <option value="yellow_card">Yellow Card</option>
                                <option value="red_card">Red Card</option>
                                <option value="substitution">Substitution</option>
                            </select>
                        </div>

                        {/* Team */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Team
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setEditedEvent(prev => ({ ...prev, team: 'us' }))}
                                    className={`p-3 rounded-lg font-medium transition-colors ${
                                        editedEvent.team === 'us'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Us
                                </button>
                                <button
                                    onClick={() => setEditedEvent(prev => ({ ...prev, team: 'them' }))}
                                    className={`p-3 rounded-lg font-medium transition-colors ${
                                        editedEvent.team === 'them'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Them
                                </button>
                            </div>
                        </div>

                        {/* Game Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Game Time
                            </label>
                            <input
                                type="text"
                                value={formatGameTime(editedEvent.gameTime)}
                                onChange={(e) => {
                                    const [minutes, seconds] = e.target.value.split(':').map(Number);
                                    const totalMs = (minutes * 60 + (seconds || 0)) * 1000;
                                    setEditedEvent(prev => ({ ...prev, gameTime: totalMs }));
                                }}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0:00"
                            />
                        </div>

                        {/* Player/Label */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-1" />
                                Player
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={editedEvent.label}
                                    onChange={(e) => setEditedEvent(prev => ({ ...prev, label: e.target.value }))}
                                    onFocus={() => setShowPlayerSearch(true)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter player name..."
                                />
                                
                                {showPlayerSearch && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-10">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full p-2 border-b border-gray-200"
                                            placeholder="Search players..."
                                            autoFocus
                                        />
                                        {searchedPlayers.slice(0, 5).map(player => (
                                            <button
                                                key={player.id}
                                                onClick={() => handlePlayerSelect(player)}
                                                className="w-full p-2 text-left hover:bg-gray-100 flex justify-between items-center"
                                            >
                                                <span>{player.name}</span>
                                                <span className="text-sm text-gray-500">
                                                    {player.number && `#${player.number}`}
                                                    {player.position && ` ${player.position}`}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Options */}
                        {editedEvent.type === 'goal' && (
                            <div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={editedEvent.meta?.isPK || false}
                                        onChange={(e) => setEditedEvent(prev => ({
                                            ...prev,
                                            meta: { ...prev.meta, isPK: e.target.checked }
                                        }))}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Penalty Kick
                                    </span>
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
