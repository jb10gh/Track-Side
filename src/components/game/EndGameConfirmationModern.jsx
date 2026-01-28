import React, { useState } from 'react';
import { X, Download, Share2, FileText, Check } from 'lucide-react';
import '../../styles/design-tokens.css';

export const EndGameConfirmation = ({ isOpen, onClose, onConfirm, gameData, onExport }) => {
    const [selectedExport, setSelectedExport] = useState('none');
    
    const handleConfirm = () => {
        // Handle export if selected
        if (selectedExport !== 'none') {
            onExport(selectedExport);
        }
        
        // End game
        onConfirm();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50" style={{ boxShadow: 'var(--glass-shadow)' }}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-white">End Match</h2>
                        <p className="text-sm text-slate-400">
                            vs {gameData.opponentName} • {gameData.myScore}-{gameData.opponentScore}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Match Summary */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-600/50">
                        <div className="text-center space-y-2">
                            <div className="text-4xl font-black">
                                <span className="bg-gradient-to-br from-pink-500 to-rose-600 bg-clip-text text-transparent">
                                    {gameData.myScore}
                                </span>
                                <span className="mx-2 text-white">-</span>
                                <span className="bg-gradient-to-br from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                                    {gameData.opponentScore}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400">
                                {gameData.events.length} events • {gameData.duration}
                            </p>
                        </div>
                    </div>

                    {/* Export Options */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Export Options</h3>
                        
                        <div className="space-y-3">
                            <label className="flex items-center p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                                <input
                                    type="radio"
                                    name="export"
                                    value="none"
                                    checked={selectedExport === 'none'}
                                    onChange={(e) => setSelectedExport(e.target.value)}
                                    className="w-4 h-4 text-pink-500 bg-slate-700 border-slate-600 focus:ring-pink-500 focus:ring-2"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center">
                                        <span className="font-medium text-white">No Export</span>
                                        <span className="ml-2 text-xs text-slate-400">Just end the match</span>
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                                <input
                                    type="radio"
                                    name="export"
                                    value="copy"
                                    checked={selectedExport === 'copy'}
                                    onChange={(e) => setSelectedExport(e.target.value)}
                                    className="w-4 h-4 text-pink-500 bg-slate-700 border-slate-600 focus:ring-pink-500 focus:ring-2"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center">
                                        <Share2 size={16} className="text-slate-400 mr-2" />
                                        <span className="font-medium text-white">Copy Summary</span>
                                        <span className="ml-2 text-xs text-slate-400">Copy to clipboard</span>
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-center p-3 bg-slate-800/50 border border-slate-600/50 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-colors">
                                <input
                                    type="radio"
                                    name="export"
                                    value="csv"
                                    checked={selectedExport === 'csv'}
                                    onChange={(e) => setSelectedExport(e.target.value)}
                                    className="w-4 h-4 text-pink-500 bg-slate-700 border-slate-600 focus:ring-pink-500 focus:ring-2"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="flex items-center">
                                        <Download size={16} className="text-slate-400 mr-2" />
                                        <span className="font-medium text-white">Download CSV</span>
                                        <span className="ml-2 text-xs text-slate-400">Save as file</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleConfirm}
                            className="w-full py-4 bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                        >
                            <span className="text-lg">End Match</span>
                            <span className="text-xs opacity-75 block">
                                This will complete the game
                            </span>
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
