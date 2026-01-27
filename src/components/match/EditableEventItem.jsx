import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Save, X, Clock, Goal, AlertTriangle } from 'lucide-react';
import { EVENT_TYPES, TEAMS } from '../../store/gameStore';

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

    const getEventIcon = (type) => {
        switch (type) {
            case EVENT_TYPES.GOAL:
                return <Goal size={16} />;
            case EVENT_TYPES.PENALTY:
                return <AlertTriangle size={16} />;
            default:
                return <Clock size={16} />;
        }
    };

    const getEventColor = (type, team) => {
        const baseColors = {
            [EVENT_TYPES.GOAL]: team === TEAMS.US ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
            [EVENT_TYPES.PENALTY]: team === TEAMS.US ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800',
        };
        return baseColors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <motion.div
            layout
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    {/* Event Time */}
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-mono min-w-[60px]">
                        {editData.gameTime}
                    </div>
                    
                    {/* Event Content */}
                    {isEditingEvent ? (
                        <div className="flex items-center gap-2 flex-1">
                            <select
                                value={editData.type}
                                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value={EVENT_TYPES.GOAL}>Goal</option>
                                <option value={EVENT_TYPES.PENALTY}>Penalty</option>
                                <option value={EVENT_TYPES.CARD}>Card</option>
                            </select>
                            
                            <select
                                value={editData.team}
                                onChange={(e) => setEditData({ ...editData, team: e.target.value })}
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value={TEAMS.US}>Us</option>
                                <option value={TEAMS.THEM}>Them</option>
                            </select>
                            
                            <input
                                type="text"
                                value={editData.label}
                                onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                                placeholder="Player name"
                                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex-1"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 flex-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getEventColor(event.type, event.team)}`}>
                                {getEventIcon(event.type)}
                                {event.type.toUpperCase()}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {event.label || 'Unnamed'}
                            </span>
                            {event.meta?.isPK && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    PK
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {isEditing && !isEditingEvent && (
                        <>
                            <button
                                onClick={() => setIsEditingEvent(true)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded transition-colors"
                                title="Edit event"
                            >
                                <Edit3 size={16} />
                            </button>
                            <button
                                onClick={onDelete}
                                className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Delete event"
                            >
                                <Trash2 size={16} />
                            </button>
                        </>
                    )}
                    
                    {isEditingEvent && (
                        <>
                            <button
                                onClick={handleSave}
                                className="p-2 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded transition-colors"
                                title="Save changes"
                            >
                                <Save size={16} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-2 text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/20 rounded transition-colors"
                                title="Cancel"
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
