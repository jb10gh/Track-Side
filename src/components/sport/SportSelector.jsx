import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Plus, Settings, Sport } from 'lucide-react';
import { SPORTS, SPORT_CONFIGS, getSportConfig } from '../../constants/sports';
import { useSportStore } from '../../store/sportStore';

export const SportSelector = ({ onSportChange, currentSport }) => {
    const { setCurrentSport, createCustomSport } = useSportStore();
    const [showCustomForm, setShowCustomForm] = useState(false);
    const [customSportData, setCustomSportData] = useState({
        name: '',
        icon: '🏆',
        duration: 60 * 60 * 1000,
        teamSize: 5,
        scoreLabels: { home: 'Points', away: 'Points' }
    });

    const handleSportSelect = (sportType) => {
        setCurrentSport(sportType);
        onSportChange?.(sportType);
    };

    const handleCreateCustomSport = () => {
        if (!customSportData.name.trim()) return;
        
        const newSport = createCustomSport(customSportData);
        handleSportSelect(newSport.id);
        setShowCustomForm(false);
        setCustomSportData({
            name: '',
            icon: '🏆',
            duration: 60 * 60 * 1000,
            teamSize: 5,
            scoreLabels: { home: 'Points', away: 'Points' }
        });
    };

    const sportOptions = Object.entries(SPORT_CONFIGS).map(([type, config]) => ({
        type,
        ...config
    }));

    return (
        <div className="space-y-4">
            {/* Sport Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {sportOptions.map((sport) => (
                    <motion.button
                        key={sport.type}
                        onClick={() => handleSportSelect(sport.type)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            currentSport === sport.type
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="text-2xl mb-2">{sport.icon}</div>
                        <div className="font-medium text-gray-900">{sport.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {sport.teamSize}v{sport.teamSize} • {sport.duration ? `${Math.floor(sport.duration / 60000)}min` : 'Variable'}
                        </div>
                    </motion.button>
                ))}
                
                {/* Custom Sport Button */}
                <motion.button
                    onClick={() => setShowCustomForm(true)}
                    className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-medium text-gray-700">Custom Sport</div>
                    <div className="text-xs text-gray-500 mt-1">Create your own</div>
                </motion.button>
            </div>

            {/* Current Sport Display */}
            {currentSport && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{getSportConfig(currentSport).icon}</span>
                            <div>
                                <h3 className="font-medium text-blue-900">
                                    {getSportConfig(currentSport).name}
                                </h3>
                                <p className="text-sm text-blue-700">
                                    {getSportConfig(currentSport).teamSize}v{getSportConfig(currentSport).teamSize} • 
                                    {getSportConfig(currentSport).duration ? 
                                        ` ${Math.floor(getSportConfig(currentSport).duration / 60000)} minutes` : 
                                        ' Variable duration'}
                                </p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                            <Settings className="w-4 h-4 text-blue-600" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Custom Sport Form */}
            {showCustomForm && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowCustomForm(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl p-6 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create Custom Sport</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sport Name
                                </label>
                                <input
                                    type="text"
                                    value={customSportData.name}
                                    onChange={(e) => setCustomSportData(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Ultimate Frisbee"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                </label>
                                <input
                                    type="text"
                                    value={customSportData.icon}
                                    onChange={(e) => setCustomSportData(prev => ({ ...prev, icon: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="🏆"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={Math.floor(customSportData.duration / 60000)}
                                        onChange={(e) => setCustomSportData(prev => ({ 
                                            ...prev, 
                                            duration: parseInt(e.target.value) * 60 * 1000 
                                        }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="60"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Team Size
                                    </label>
                                    <input
                                        type="number"
                                        value={customSportData.teamSize}
                                        onChange={(e) => setCustomSportData(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="5"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Home Score Label
                                    </label>
                                    <input
                                        type="text"
                                        value={customSportData.scoreLabels.home}
                                        onChange={(e) => setCustomSportData(prev => ({ 
                                            ...prev, 
                                            scoreLabels: { ...prev.scoreLabels, home: e.target.value }
                                        }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Points"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Away Score Label
                                    </label>
                                    <input
                                        type="text"
                                        value={customSportData.scoreLabels.away}
                                        onChange={(e) => setCustomSportData(prev => ({ 
                                            ...prev, 
                                            scoreLabels: { ...prev.scoreLabels, away: e.target.value }
                                        }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Points"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateCustomSport}
                                disabled={!customSportData.name.trim()}
                                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Create Sport
                            </button>
                            <button
                                onClick={() => setShowCustomForm(false)}
                                className="px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

// Sport-specific event selector
export const SportEventSelector = ({ sportType, onEventSelect, team }) => {
    const config = getSportConfig(sportType);
    const events = Object.entries(config.eventTypes).map(([type, eventConfig]) => ({
        type,
        ...eventConfig
    }));

    const scoringEvents = events.filter(event => config.scoringEvents.includes(event.type));
    const otherEvents = events.filter(event => !config.scoringEvents.includes(event.type));

    return (
        <div className="space-y-4">
            {/* Scoring Events */}
            {scoringEvents.length > 0 && (
                <div>
                    <h3 className="font-medium text-gray-900 mb-2">Scoring Events</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {scoringEvents.map((event) => (
                            <motion.button
                                key={event.type}
                                onClick={() => onEventSelect(event.type, team)}
                                className="p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{event.icon}</span>
                                    <div className="text-left">
                                        <div className="font-medium text-green-900">{event.name}</div>
                                        <div className="text-xs text-green-700">{event.points} points</div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Other Events */}
            {otherEvents.length > 0 && (
                <div>
                    <h3 className="font-medium text-gray-900 mb-2">Other Events</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {otherEvents.map((event) => (
                            <motion.button
                                key={event.type}
                                onClick={() => onEventSelect(event.type, team)}
                                className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{event.icon}</span>
                                    <div className="text-left">
                                        <div className="font-medium text-gray-900">{event.name}</div>
                                        {event.points > 0 && (
                                            <div className="text-xs text-gray-700">{event.points} points</div>
                                        )}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
