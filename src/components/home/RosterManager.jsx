import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Search, Edit2, Trash2, X, Save, User, Hash, MapPin } from 'lucide-react';
import { useGlobalRosterStore } from '../../store/globalRosterStore';

export const RosterManager = () => {
    const { 
        players, 
        addPlayer, 
        updatePlayer, 
        deletePlayer, 
        searchPlayers, 
        getRecentPlayers,
        getFrequentPlayers 
    } = useGlobalRosterStore();
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    
    const [formData, setFormData] = useState({
        name: '',
        number: '',
        position: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPlayer) {
            updatePlayer(editingPlayer.id, formData);
            setEditingPlayer(null);
        } else {
            addPlayer(formData);
        }
        setFormData({ name: '', number: '', position: '', notes: '' });
        setShowAddForm(false);
    };

    const handleEdit = (player) => {
        setEditingPlayer(player);
        setFormData({
            name: player.name,
            number: player.number,
            position: player.position,
            notes: player.notes
        });
        setShowAddForm(true);
    };

    const getFilteredPlayers = () => {
        switch (activeTab) {
            case 'recent':
                return getRecentPlayers();
            case 'frequent':
                return getFrequentPlayers();
            case 'search':
                return searchPlayers(searchQuery);
            default:
                return players;
        }
    };

    const filteredPlayers = getFilteredPlayers();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Roster Management
                </h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Player
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-200">
                {['all', 'recent', 'frequent', 'search'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 font-medium capitalize transition-colors ${
                            activeTab === tab
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            {activeTab === 'search' && (
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search players by name, number, or position..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            )}

            {/* Player Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {filteredPlayers.map(player => (
                    <motion.div
                        key={player.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{player.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    {player.number && (
                                        <span className="flex items-center gap-1">
                                            <Hash className="w-3 h-3" />
                                            {player.number}
                                        </span>
                                    )}
                                    {player.position && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {player.position}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(player)}
                                    className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => deletePlayer(player.id)}
                                    className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        {player.notes && (
                            <p className="text-sm text-gray-600 mt-2">{player.notes}</p>
                        )}
                        
                        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                            <span>{player.gameCount} games</span>
                            <span>Last used: {new Date(player.lastUsed).toLocaleDateString()}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Add/Edit Player Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingPlayer ? 'Edit Player' : 'Add Player'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setEditingPlayer(null);
                                        setFormData({ name: '', number: '', position: '', notes: '' });
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Player name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Hash className="w-4 h-4 inline mr-1" />
                                        Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.number}
                                        onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Jersey number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Position
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Position"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Additional notes..."
                                        rows={3}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {editingPlayer ? 'Update Player' : 'Add Player'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
